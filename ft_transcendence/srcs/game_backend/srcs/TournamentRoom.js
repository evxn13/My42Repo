// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   TournamentRoom.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/03 16:50:18 by isibio            #+#    #+#             //
//   Updated: 2025/06/03 16:50:20 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';
import fetch				from 'node-fetch';
import https				from 'https';

import GameRoom				from './GameRoom.js'

import wsCommunicationsJS			from '/lib/transcendence/wsCommunicationsJS/wsCommunications.js';

import RoomCreationEventWS			from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js';
import RoomLeftEventWS				from '/lib/transcendence/wsCommunicationsJS/event/RoomLeftEventWS.js';
import GameSummaryWS				from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js';
import ClearRenderMapEventWS		from '/lib/transcendence/wsCommunicationsJS/event/ClearRenderMapEventWS.js';

import TournamentCreationEventWS	from '/lib/transcendence/wsCommunicationsJS/event/TournamentCreationEventWS.js';
import ClientTournamentDataWS		from '/lib/transcendence/wsCommunicationsJS/tournament/ClientTournamentDataWS.js';
import TournamentSummaryWS			from '/lib/transcendence/wsCommunicationsJS/tournament/TournamentSummaryWS.js';
import RoundDetailsWS				from '/lib/transcendence/wsCommunicationsJS/tournament/RoundDetailsWS.js';
import MatchDetailsWS				from '/lib/transcendence/wsCommunicationsJS/tournament/MatchDetailsWS.js';

let ROOM_TYPE = "tournamentRoom"

export function TournamentRoom(roomName_ = defaultRoomName)
{
	// - public attrubutes
	this.roomType					= ROOM_TYPE;

	this.roomName					= "kissing tournament";
	this.maxPlayers					= 4;
	this.clientMap					= new Map();				// - key:	client		[object]
																//	 value:	roomData	[object: ClientTournamentDataWS]
	this.gameRoomMap				= new Map();				// - map with : [key]	= room name
																//				[value]	= room object (GameRoom)
	this.roomCreationEventTemplate	= new RoomCreationEventWS();
	this.isMatchmakingPossible		= true;
	this.isTournamentLaunched		= false;
	this.round						= 0;
	this.clientInTournamentArr		= [];						// array of client UUID (string)

	this.tournamentSummary			= null;
	this.timeBetweenRounds			= 2500;						// pause time in ms between rounds (to see RoundDetailsWS)

	// - private attrubutes
	let	_this = this;

	// *
	// * public methods
	let	launchTournament = this.launchTournament = async function()
	{
		logger("tournamentRoom_gameLaunching", "log", c.LGREEN + `[${_this.roomName}] : launching tournament` + c.CLEAN)
		if (_this.isTournamentLaunched)
		{
			logger("tournamentRoom_gameLaunching", "warn", c.LORANGE + `[${_this.roomName}] : tournament already launched, can't re-launch` + c.CLEAN)
			return ;
		}
		_this.isTournamentLaunched = true;

		// * init clients :
		// *	- set stillInTournament attribute of TournamentSummaryWS to false
		// *	- initialize _this.clientInTournamentArr with uuid of all clients playning in tournament (no spectators)
		// *	+ security to avoid more than '_this.maxPlayers' players in tournament 
		let	nbPlayers = 0;
		for (let [ client, roomData ] of _this.clientMap)
		{
			if (nbPlayers >= _this.maxPlayers)
				break ;
			roomData.stillInTournament = true;
			_this.clientInTournamentArr.push(client.uuid);

			nbPlayers++;
		}

		// * prepare next match clients :
		// *	- calling _getNextMatchArr to get 2d array of next matches with fighting client UUIDs
		// *	- counting round number
		let maxPlayersInMatch	= 2;
		let roundLetter			= 'A'

		_this.round				= 1;

		while (_this.isTournamentLaunched)
		{
			logger("tournamentRoom_gameManagment", "log", c.PURPLE + `[${_this.roomName}] :${c.BOLD} starting round ${_this.round}` + c.CLEAN)
			// * updating client's roomData
			// * 	- updating attribute maxRoundPlayed
			for (let [ client, roomData ] of _this.clientMap)
			{
				if (roomData.stillInTournament)
					roomData.maxRoundPlayed = _this.round;
				roomData.joinedMatch	= false;
			}

			// * creating and adding clients inside rooms :
			// *	- announcing round
			// *	- note: gameRoom.initRoomFromRoomCreationEvent is called from a version of '_this.roomCreationEventTemplate'
			// *	 transformed in JSON and transformed back in a valid object to avoid an issue (sort of deep copy needed)
			let nextMatchArr = [];
			for (let nextMatch of _getNextMatchArr(_this.clientMap, maxPlayersInMatch))
			{
				let nextMatchLength = 0;
				for (let element of nextMatch)
					if (element)
						nextMatchLength++;
				if (nextMatchLength < maxPlayersInMatch)
					continue ;

				nextMatchArr.push(nextMatch);
			}

			await _announceNextRound(nextMatchArr, _this.round, _this.clientMap);
			if (_this.timeBetweenRounds)
				await new Promise(r => setTimeout(r, _this.timeBetweenRounds));
			_sendMessageToClientMap((new ClearRenderMapEventWS()).createJSON(), _this.clientMap);

			for (let nextMatch of nextMatchArr)
			{
				let	gameRoomName	= _this.roomName + " bound " + _this.round + roundLetter;		// ! should be unique
				roundLetter			= String.fromCharCode(roundLetter.charCodeAt() + 1);
				logger("tournamentRoom_gameManagment", "log", c.PURPLE + `[${_this.roomName}] : creating new room` + c.CLEAN, `${c.PURPLE}${c.ITALIC} \"${gameRoomName}\"${c.CLEAN}`)

				let	gameRoom		= new GameRoom();
				gameRoom.isMatchmakingPossible	= false;
				gameRoom.initRoomFromRoomCreationEvent(RoomCreationEventWS.createFromJSON(_this.roomCreationEventTemplate.createJSON()));
				gameRoom.roomName				= gameRoomName;

				_this.gameRoomMap.set(gameRoomName, gameRoom);
				for (let clientUUID of nextMatch)
				{
					let client		= _this.getClientFromUUID(clientUUID, false, _this.clientMap);
					let roomData	= _this.clientMap.get(client);

					if (roomData.clientDisconnected)
					{
						await _removeClientsFromRooms();
						_this.endTournament(TournamentSummaryWS.tournamentEndPlayerQuit);
						return ;
					}

					gameRoom.addClient(client);
					roomData.joinedMatch = true;
				}
			}

			// * handle round spectating (spectators or losers) :
			// * 	- for clients not in a game (spectators or losers)
			for (let [ client, roomData ] of _this.clientMap)
			{
				if (!roomData.joinedMatch)
					_joinRoomToSpectate(client, _this.gameRoomMap);
			}


			// * waiting for the actual round to be finished :
			// *	- loop while there are active rooms left
			// *	? handle clients in 'inactive' room spectate 'active' rooms
			logger("tournamentRoom_gameManagment", "log", c.PURPLE + `[${_this.roomName}] :${c.WHITE}${c.BOLD} Waiting for the round to be finished` + c.CLEAN)
			while (_getActiveRoomArr(_this.gameRoomMap).length)
			{
				// console.log(c.WHITE + c.ITALIC + "Waiting for the round to be finished" + c.CLEAN);

				for (let [ gameRoomName, roomObject ] of _this.gameRoomMap)
				{
					if (_isActiveRoom(roomObject))
						continue ;
					for (let [ client, roomData ] of roomObject.clientMap)
					{
						await roomObject.removeClient(client, false);
						_joinRoomToSpectate(client, _this.gameRoomMap);
					}
				}
				await new Promise(r => setTimeout(r, 1000));
			}
			logger("tournamentRoom_gameManagment", "log", c.PURPLE + `[${_this.roomName}] :${c.WHITE}${c.BOLD} Round ended` + c.CLEAN)

			// * handle round end :
			// *	- update all 'Client.stillInTournament' attributes
			// * should be working if gameRoom(s) from previous rounds are still in '_this.gameRoomMap'
			for (let [ gameRoomName, roomObject ] of _this.gameRoomMap)
			{
				if (roomObject.gameSummary.gameEndReason == GameSummaryWS.gameEndPlayerQuit)
				{
					await _removeClientsFromRooms();
					_this.endTournament(TournamentSummaryWS.tournamentEndPlayerQuit);
					return ;
				}

				if (roomObject.gameSummary.gameEndReason == GameSummaryWS.gameEndPlayersNotUnique)
				{
					await _removeClientsFromRooms();
					_this.endTournament(TournamentSummaryWS.tournamentEndPlayersNotUnique);
					return ;
				}

				for (let clientSummary of roomObject.gameSummary.clientDataArr)
				{
					let [ testedClient, testedClientRoomData ] = _this.getClientFromUUID(clientSummary.client, true, _this.clientMap);
					if (!testedClientRoomData.stillInTournament)
						continue ;

					if (clientSummary.isVictory != 1)
					{
						testedClientRoomData.isVictory			= false;
						testedClientRoomData.stillInTournament	= false;
					}
				}
			}

			// * removing clients from rooms
			// *
			await _removeClientsFromRooms();
			// await new Promise(r => setTimeout(r, 100));

			// * cheching if tournament is finished
			// *
			let	clientsStillInTournamentArr = _getClientStillInTournamentArr(_this.clientMap);
			if (clientsStillInTournamentArr.length == 1)
			{
				let [ lastClient, lastClientRoomData ]	= _this.getClientFromUUID(clientsStillInTournamentArr[0], true, _this.clientMap);
				lastClientRoomData.isVictory			= true;

				_this.endTournament(TournamentSummaryWS.tournamentEndPlayerVictory);
				return ;
			}

			// * prepating variables for next round
			// *
			_this.round++;
			roundLetter = "A";
		}
	}

	let endTournament = this.endTournament = function(reason = TournamentSummaryWS.tournamentEndNoReason)
	{
		logger("tournamentRoom_gameEnding", "log", c.DDORANGE + `[${_this.roomName}] : Ending tournamemt` + c.CLEAN, `${c.DDORANGE} for reason : ${c.ITALIC}${reason}` + c.CLEAN)
		// console.log("ending tournamemt for reason :", reason);

		_handleTournamentSummary(reason, _this.clientMap);

		// * removing disconnected clients from '_this.clientMap'
		for (let [ client, roomData ] of _this.clientMap)
		{
			if (!roomData.clientDisconnected)
				continue ;

			_this.removeClient(client, true)
		}
	}

	// * stopTournament
	let	stop = this.stop = function()
	{
	}

	let	initRoomFromRoomCreationEvent = this.initRoomFromRoomCreationEvent = function(tournamentCreationEvent)
	{
		// console.log("gawd damn -> tournamentCreationEvent = ", tournamentCreationEvent);
		setRoomName(tournamentCreationEvent.roomName);
		_this.roomCreationEventTemplate	= tournamentCreationEvent.roomCreationEventTemplate;
		_this.maxPlayers				= tournamentCreationEvent.maxPlayers;
	}

	let	addClient = this.addClient = function(client, roomData = new ClientTournamentDataWS())
	{
		logger("tournamentRoom_clientJoin", "log", c.LGREEN + `→ [${_this.roomName}]: client joined tournament room ` + c.CLEAN, c.ITALIC + c.LGREEN + `: ${client.uuid}` + c.CLEAN)

		roomData.client				= client.uuid;
		roomData.userDetails		= client.userDetails;
		roomData.isVictory			= false;
		roomData.clientDisconnected	= false;
		roomData.id					= client.uuid + "'s tournament data";
		roomData.stillInTournament	= false;

		_this.clientMap.set(client, roomData);

		// _renderElementMapToClient(client, _objectMap, true, false);

		let tournamentCreationEventWS	= new TournamentCreationEventWS();
		tournamentCreationEventWS.roomName		= _this.roomName;
		tournamentCreationEventWS.maxPlayers	= _this.maxPlayers;
		tournamentCreationEventWS.id			= _this.roomName + "'s game creation event"
		client.send(tournamentCreationEventWS.createJSON());

		client.joinedGameRoomMap.set(_this.roomName, _this);

		if (_this.clientMap.size == _this.maxPlayers)
			_this.launchTournament();
		else if (_this.isTournamentLaunched)
			_joinRoomToSpectate(client, _this.gameRoomMap);
	}

	let	removeClient = this.removeClient = function(client, forceRemoveFromMap = false)
	{
		logger("tournamentRoom_clientLeave", "log", c.LRED + `→ [${_this.roomName}]: client left tournament room` + c.CLEAN, c.ITALIC + c.LRED + `: ${client.uuid}` + c.CLEAN)

		let roomLeftEventWS			= new RoomLeftEventWS();
		roomLeftEventWS.clientUUID	= client.uuid;
		roomLeftEventWS.id			= client.uuid + " left room";
		_sendMessageToClientMap(roomLeftEventWS.createJSON());

		let	clientRoomData = _this.clientMap.get(client);
		clientRoomData.clientDisconnected = true;

		// * handling client deconnection when client was playing the tournament
		if (!forceRemoveFromMap && !_this.tournamentSummary && _this.clientInTournamentArr.includes(client.uuid))
			logger("tournamentRoom_clientLeave", "log", c.LYELLOW + "→ the client is playing in the tournament" + c.CLEAN, c.LYELLOW + " : " + c.ITALIC + c.LYELLOW + client.uuid + c.CLEAN)
		else
			_this.clientMap.delete(client);
		client.joinedGameRoomMap.delete(_this.roomName);
	}

	let	canPlayInRoom = this.canPlayInRoom = function()
	{
		if (_this.clientMap.size >= _this.maxPlayers || _this.isTournamentLaunched || _this.tournamentSummary)
			return (false);
		return (true);
	}

	let	setRoomName = this.setRoomName = function(newRoomName_ = "")
	{
		_this.roomName = newRoomName_;
	}

	let	getClientFromUUID = this.getClientFromUUID = function(uuid_, getRoomData_ = false, clientMap_ = _this.clientMap)
	{
		if (uuid_ === undefined)
			return (getRoomData_ ? [null, null] : null);

		for (let [client, roomData] of clientMap_)
		{
			if (client.uuid == uuid_)
				return (getRoomData_ ? [client, roomData] : client);
		}
		return (getRoomData_ ? [null, null] : null);
	}

	// * private methods
	let	_sendMessageToClientMap = function(message, clientMap_ = _this.clientMap, sendToDisconnectedClient = false)
	{
		if (!message)
			return ;

		for (let [client, roomData] of clientMap_)
			if (roomData.clientDisconnected == false || sendToDisconnectedClient)
				client.send(message);
	}

	let	_getNextMatchArr = function(clientMap_ = _this.clientMap, maxPlayersInMatch = 2)
	{
		let matchArr			= [[]];
		let bigArrayIt			= 0;
		let smallArrayIt		= 0;

		for (let [client, roomData] of clientMap_)
		{
			if (!roomData.stillInTournament)
				continue ;
			if (smallArrayIt >= maxPlayersInMatch)
			{
				smallArrayIt			= 0;
				bigArrayIt++;
				matchArr[bigArrayIt]	= new Array(maxPlayersInMatch);
			}

			matchArr[bigArrayIt][smallArrayIt] = client.uuid;
			smallArrayIt++;
		}
		return (matchArr);
	}

	// * return an array of gameRoomName [string] linked with a room where the game is not finished
	let	_getActiveRoomArr = function(gameRoomMap_ = _this.gameRoomMap)
	{
		let	activeGameRoomNameArr = [];

		for (let [ gameRoomName, roomObject ] of gameRoomMap_)
			if (_isActiveRoom(roomObject))
				activeGameRoomNameArr.push(gameRoomName);
		return (activeGameRoomNameArr);
	}

	// * return an array of client UUIDs [string] who are stillInTournament (checking attribute ClientTournamentDataWS.stillInTournament)
	let _getClientStillInTournamentArr = function(clientMap_ = _this.clientMap)
	{
		let clientStillInTournamentArr = [];

		for (let [client, roomData] of clientMap_)
			if (roomData.stillInTournament)
				clientStillInTournamentArr.push(client.uuid);
		return (clientStillInTournamentArr);
	}

	// * _handleTournamentSummary : creating and updating class attribute 'tournamentSummary'
	// * arguments :
	// * 	endReason_ : specifies the end reason of the tourmament (usually from constants of 'TournamentSummaryWS')
	// *	clientMap_ : sending created tournamentSummary to clients in this map, if null, the function will not send anything
	let _handleTournamentSummary = function(endReason_ = TournamentSummaryWS.tournamentEndNoReason, clientMap_ = null)
	{
		let newTournamentSummary = new TournamentSummaryWS();
		newTournamentSummary.tournamentEndReason	= endReason_;
		newTournamentSummary.tournmamentName		= _this.roomName;
		newTournamentSummary.nbRounds				= _this.round;
		newTournamentSummary.id						= _this.roomName + ' tournament summary';

		for (let [ gameRoomName, roomObject ] of _this.gameRoomMap)
		{
			if (!roomObject.gameSummary)
				continue ;

			let gameSummary = GameSummaryWS.createFromJSON(roomObject.gameSummary.createJSON());
			newTournamentSummary.gameSummaryArr.push(gameSummary);
		}
		for (let [client, roomData] of _this.clientMap)
		{
			if (!_this.clientInTournamentArr.includes(client.uuid))
				continue ;

			// console.log("[TournamentRoom] roomData.createJSON() =", roomData.createJSON());
			let clientTournamentData = ClientTournamentDataWS.createFromJSON(roomData.createJSON());
			newTournamentSummary.clientDataArr.push(clientTournamentData);
		}
		_this.tournamentSummary = newTournamentSummary;

		if (clientMap_)
		{
			let tournamentSummaryJSON = _this.tournamentSummary.createJSON();
			_sendMessageToClientMap(tournamentSummaryJSON, clientMap_, false);
		}
	}

	let _joinRoomToSpectate = function(client, gameRoomMap_ = _this.gameRoomMap)
	{
		let	clientTournamentData = _this.clientMap.get(client);
		if (clientTournamentData.clientDisconnected)
			return ;

		let activeRoomArr		= _getActiveRoomArr(gameRoomMap_);
		let gameRoomNameToJoin	= activeRoomArr[(Math.floor(Math.random() * activeRoomArr.length))];
		let	gameRoomToJoin		= gameRoomMap_.get(gameRoomNameToJoin)

		gameRoomToJoin.addClient(client);
	}

	let _isActiveRoom = function(gameRoom)
	{
		return (!(!gameRoom.roomLoopId && gameRoom.gameSummary))
	}

	let _removeClientsFromRooms = function(gameRoom)
	{
		for (let [ gameRoomName, roomObject ] of _this.gameRoomMap)
			for (let [ client, roomData ] of _this.clientMap)
				if (roomObject.clientMap.get(client))
					roomObject.removeClient(client);
	}

	// * 
	let _announceNextRound = async function(nextMatchArr_, roundNumber_ = 0, clientMap_ = _this.clientMap)
	{
		let roundDetails		= new RoundDetailsWS();
		roundDetails.id			= "round " + roundNumber_ + " details";
		roundDetails.roundNb	= roundNumber_;
		let	matchNumber			= -1; 

		for (let nextMatch of nextMatchArr_)
		{
			matchNumber++;
			let	matchDetails	= new MatchDetailsWS();
			matchDetails.id		= roundDetails.id + " match " + matchNumber + " details";

			for (let clientUUID of nextMatch)
			{
				let [ client, roomData ] = _this.getClientFromUUID(clientUUID, true, _this.clientMap);
				matchDetails.userDetailsArr.push(roomData.userDetails);
			}
			roundDetails.matchDetailsArr.push(matchDetails);
		}

		await _announceNextRoundChat(roundDetails);
		if (clientMap_)
			_sendMessageToClientMap(roundDetails.createJSON(), clientMap_);
	}

	// * function developed by 'evscheid'
	let _announceNextRoundChat = async function(roundDetails_)
	{
		if (!roundDetails_)
		{
			logger("tournamentRoom_chatNotification", "warn", c.LYELLOW + "[" + _this.roomName + "] : roundDetails is null, cannot send notifications" + c.CLEAN);
			return ;
		}

		logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : sending round " + roundDetails_.roundNb + " notifications to chat" + c.CLEAN);
		logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : roundDetails contains " + roundDetails_.matchDetailsArr.length + " matches" + c.CLEAN);

		// Fonction pour récupérer le username depuis l'ID utilisateur
		async function getUsernameFromId(userId) {
			try {
				let agent		= new https.Agent({ rejectUnauthorized: false });
				const response	= await fetch('https://fastify-account:' + process.env.PORT_FASTIFY + '/meID?userId=' + userId,
					{
						method: 'GET',
						agent
					}
				);
				if (response.ok) {
					const data = await response.json();
					if (data.success && data.user) {
						logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : converted userId " + userId + " to username: " + data.user.username + c.CLEAN);
						return data.user.username;
					}
				}
				logger("tournamentRoom_chatNotification", "warn", c.LYELLOW + "[" + _this.roomName + "] : failed to get username for userId " + userId + c.CLEAN);
				return null;
			} catch (error) {
				logger("tournamentRoom_chatNotification", "warn", c.LYELLOW + "[" + _this.roomName + "] : error getting username for userId " + userId + ": " + error.message + c.CLEAN);
				return null;
			}
		}

		// Construire le message de notification
		let tournamentName = _this.roomName;
		let roundNumber = roundDetails_.roundNb;
		let matchesInfo = [];

		// Extraire les informations des matchs
		for (let matchDetails of roundDetails_.matchDetailsArr) {
			logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : processing match with " + matchDetails.userDetailsArr.length + " players" + c.CLEAN);
			
			let playerIds = matchDetails.userDetailsArr.map(user => {
				logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : player userId: " + user.userId + c.CLEAN);
				return user.userId;
			});
			
			// Convertir les IDs en usernames
			let playerUsernames = [];
			for (let playerId of playerIds) {
				let username = await getUsernameFromId(playerId);
				if (username) {
					playerUsernames.push(username);
				}
			}
			
			if (playerUsernames.length >= 2) {
				matchesInfo.push({
					players: playerUsernames,
					matchDescription: `${playerUsernames[0]} vs ${playerUsernames[1]}`
				});
				logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : match added: " + playerUsernames[0] + " vs " + playerUsernames[1] + c.CLEAN);
			} else {
				logger("tournamentRoom_chatNotification", "warn", c.LYELLOW + "[" + _this.roomName + "] : match has only " + playerUsernames.length + " valid players, skipping" + c.CLEAN);
			}
		}

		logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : total matches to notify: " + matchesInfo.length + c.CLEAN);

		// Récupérer tous les joueurs du tournoi (participants + éliminés)
		let allTournamentPlayers = [];
		for (let [client, roomData] of _this.clientMap) {
			if (_this.clientInTournamentArr.includes(client.uuid)) {
				// Convertir l'ID utilisateur en nom d'utilisateur
				let username = await getUsernameFromId(roomData.userDetails.userId);
				if (username) {
					allTournamentPlayers.push(username);
				}
			}
		}

		logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : sending notifications to all " + allTournamentPlayers.length + " tournament participants" + c.CLEAN);

		// Envoyer les notifications à tous les joueurs du tournoi
		try {
			for (let playerUsername of allTournamentPlayers) {
				// Déterminer le statut du joueur pour ce round
				let playerStatus = "spectateur"; // Par défaut, le joueur est spectateur
				let nextOpponent = null;

				// Vérifier si le joueur participe activement à ce round
				for (let matchInfo of matchesInfo) {
					if (matchInfo.players.includes(playerUsername)) {
						playerStatus = "participant";
						nextOpponent = matchInfo.players.find(p => p !== playerUsername);
						break;
					}
				}

				// Créer le message adapté au statut du joueur
				let message;
				if (playerStatus === "participant") {
					message = `🏆 Tournoi "${tournamentName}" - Round ${roundNumber} : Votre prochain match commence bientôt !`;
				} else {
					message = `🏆 Tournoi "${tournamentName}" - Round ${roundNumber} : Nouveau round en cours. Vous pouvez regarder les matchs !`;
				}

				// Envoyer la notification HTTP au service de chat
				let notificationData = {
					type: 'tournament_notification',
					to: playerUsername,
					tournamentName: tournamentName,
					roundNumber: roundNumber,
					message: message,
					nextOpponent: nextOpponent,
					allMatches: matchesInfo.map(m => m.matchDescription),
					playerStatus: playerStatus
				};

				logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : sending notification to " + playerStatus + " " + playerUsername + c.CLEAN);
				logger("tournamentRoom_chatNotification", "log", c.CYAN + "[" + _this.roomName + "] : notification data: " + JSON.stringify(notificationData, null, 2) + c.CLEAN);

				// Utiliser fetch pour envoyer la notification via la route interne
				let agent = new https.Agent({ rejectUnauthorized: false });
				await fetch('https://chat:' + process.env.PORT_CHAT_HTTPS + '/internal/tournament-notification', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(notificationData),
					agent
				}).then(response => {
					if (response.ok) {
						logger("tournamentRoom_chatNotification", "log", c.LGREEN + "[" + _this.roomName + "] : notification sent successfully to " + playerUsername + c.CLEAN);
					} else {
						logger("tournamentRoom_chatNotification", "warn", c.LYELLOW + "[" + _this.roomName + "] : failed to send notification to " + playerUsername + ", status: " + response.status + c.CLEAN);
					}
				}).catch(err => {
					logger("tournamentRoom_chatNotification", "warn", c.LYELLOW + "[" + _this.roomName + "] : failed to send notification to chat service for " + playerUsername + ": " + err.message + c.CLEAN);
				});
			}
		} catch (error) {
			logger("tournamentRoom_chatNotification", "error", c.LRED + "[" + _this.roomName + "] : error sending tournament notifications: " + error.message + c.CLEAN);
		}
	}

}

// * static methods
TournamentRoom.isGoodRoomType = function(typeToTest)
{
	if (typeToTest == ROOM_TYPE)
		return (true);
	return (false);
}

export default TournamentRoom;
