// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   GameBackend.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/02/27 14:20:05 by isibio            #+#    #+#             //
//   Updated: 2025/02/27 14:20:07 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { WebSocketServer }	from 'ws';
import https				from 'https';
import fs					from 'fs';
import path					from 'path';
import fetch				from 'node-fetch';

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';

import KeyEventWS					from '/lib/transcendence/wsCommunicationsJS/event/KeyEventWS.js';
import LaunchGameEventWS			from '/lib/transcendence/wsCommunicationsJS/event/LaunchGameEventWS.js';
import RoomCreationEventWS			from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js';
import JoinRoomEventWS				from '/lib/transcendence/wsCommunicationsJS/event/JoinRoomEventWS.js';
import LeaveRoomEventWS				from '/lib/transcendence/wsCommunicationsJS/event/LeaveRoomEventWS.js';
import MatchmakingEventWS			from '/lib/transcendence/wsCommunicationsJS/event/MatchmakingEventWS.js';
import TournamentCreationEventWS	from '/lib/transcendence/wsCommunicationsJS/event/TournamentCreationEventWS.js';

import UserDetailsWS				from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

import Client				from './Client.js';
import GameRoom				from './GameRoom.js';
import TournamentRoom		from './TournamentRoom.js';

export function GameBackend(portArg)
{
	// - public attrubutes

	// - private attrubutes
	let _wss;
	let	_port			= portArg || "undefined";
	let _clientsArr		= [];
	let	_gameRoomMap	= new Map();	// - map with : [key]	= room name
										//				[value]	= room object (GameRoom)
	let _this			= this;

	// *
	// * public methods
	let	launchServer = this.launchServer = function(portArg = _port)
	{
		console.log("launching server at port [", portArg, "]");

		let sslOptions =
		{
			key: fs.readFileSync(path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.key')),
			cert: fs.readFileSync(path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.crt')),
		};

		// Create an HTTPS server
		const server = https.createServer(sslOptions, (req, res) =>
		{
			res.writeHead(200);
			res.end('Hello, HTTPS server is running!');
		});

		_wss = new WebSocketServer({ server });

		// Setup WebSocket connections
		_wss.on('connection', _handleWssConnectionEvent);

		// Start the server on the specified port
		server.listen(portArg, '0.0.0.0', () => {
		});
	}

	let	printClients = this.printClients = function()
	{
		let	index = 0;

		for (index in _clientsArr)
		{
			console.log("CLIENTS -> uuid = ", _clientsArr[index].uuid);
			// console.log("        -> ws   = ", _clientsArr[index].ws);
		}
	}

	let	createGameRoom = this.createGameRoom = async function(roomCreationEvent)
	{
		logger("backend_gameRoomCreation", "log", c.LGREEN + "+ creating game room \"" + c.BOLD + roomCreationEvent.roomName + c.CLEAN + c.LGREEN + "\"" + c.CLEAN, c.ITALIC + c.GRAY + "(roomCreationEvent.createJSON = " + roomCreationEvent.createJSON() + ")" + c.CLEAN)

		if (_gameRoomMap.get(roomCreationEvent.roomName) !== undefined)
		{
			logger("backend_gameRoomCreation", "warn", c.LYELLOW + "a room named \"" + c.BOLD + roomCreationEvent.roomName + c.CLEAN + c.LYELLOW + "\" already exists" + c.CLEAN, ""/* c.ITALIC + c.GRAY + "(roomCreationEvent.createJSON = " + roomCreationEvent.createJSON() + ")" + c.CLEAN*/)
			return ;
		}

		let	newRoom = new GameRoom(roomCreationEvent.roomName);
		newRoom.initRoomFromRoomCreationEvent(roomCreationEvent);

		_gameRoomMap.set(newRoom.roomName, newRoom);

		for (let i = 0; i < roomCreationEvent.nbAiToJoin; i++)
		{
			let	joinEvent			= new JoinRoomEventWS();
			joinEvent.roomToJoin	= roomCreationEvent.roomName;

			try
			{
				let agent	= new https.Agent({ rejectUnauthorized: false });

				const res	= await fetch("https://game_ai:" + process.env.PORT_GAME_AI + "/",
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: joinEvent.createJSON(),
					agent,
				});
			}
			catch (e)
			{
				logger("backend_gameRoomCreation", "err", c.DORANGE + c.BOLD + "error : \"" + e.message + c.CLEAN + c.DORANGE + c.BOLD + "\"" + c.CLEAN, c.ITALIC + c.GRAY + "(e = " + e + ")" + c.CLEAN)
			}
		}
	}

	let	createTournamentRoom = this.createTournamentRoom = async function(tournamentCreationEvent)
	{
		logger("backend_tournamentRoomCreation", "log", c.LGREEN + "+ creating tournament room \"" + c.BOLD + tournamentCreationEvent.roomName + c.CLEAN + c.LGREEN + "\"" + c.CLEAN, c.ITALIC + c.GRAY + "(tournamentCreationEvent.createJSON = " + tournamentCreationEvent.createJSON() + ")" + c.CLEAN)
		if (_gameRoomMap.get(tournamentCreationEvent.roomName) !== undefined)
		{
			logger("backend_tournamentRoomCreation", "warn", c.LYELLOW + "a room named \"" + c.BOLD + tournamentCreationEvent.roomName + c.CLEAN + c.LYELLOW + "\" already exists" + c.CLEAN, ""/* c.ITALIC + c.GRAY + "(tournamentCreationEvent.createJSON = " + tournamentCreationEvent.createJSON() + ")" + c.CLEAN*/)
			return ;
		}

		let	newRoom = new TournamentRoom(tournamentCreationEvent.roomName);
		newRoom.initRoomFromRoomCreationEvent(tournamentCreationEvent);

		_gameRoomMap.set(newRoom.roomName, newRoom);
	}

	let	gameRoomJoin = this.gameRoomJoin = function(client_, roomName_)
	{
		let roomToJoin = _gameRoomMap.get(roomName_);
		if (roomToJoin === undefined)
			return ;

		roomToJoin.addClient(client_);
	}

	let	gameRoomLeave = this.gameRoomLeave = function(client_, roomName_)
	{
		if (roomName_ == "")
		{
			client_.leaveEveryGameRoom();
			return ;
		}

		let roomToJoin = _gameRoomMap.get(roomName_);
		if (roomToJoin === undefined)
			return ;
		roomToJoin.removeClient(client_);
	}

	let	deleteEmptyGameRooms = this.deleteEmptyGameRooms = function()
	{
		for (let [roomName, roomObject] of _gameRoomMap)
		{
			if (roomObject.clientMap.size == 0)
			{
				logger("backend_roomDestruction", "log", c.LORANGE + "🗑 deleting room \"" + c.BOLD + roomObject.roomName + c.CLEAN + c.LORANGE + "\"" + c.CLEAN, "");
				roomObject.stop();
				_gameRoomMap.delete(roomName);
			}
		}
	}

	// * private methods
	let		_handleWssConnectionEvent = function(clientWs, req)
	{
		logger("backend_connection", "log", c.LGREEN + "→ client connected", " : " + c.ITALIC + c.GRAY + "[no uuid for the moment]" + c.CLEAN)

		let client = new Client("", clientWs);
		client.initDefaultKeyBindingsMap();		// * NOT DEFINITIVE ???

		_clientsArr.push(client);

		// - handling events
		clientWs.on('message', function bridge(message) {
			_handleWsMessageEvent(client, message, req);
		});

		clientWs.on('close', function bridge(clientWs, req) {
			_handleWsCloseEvent(client, req);
		});

		client.isConnected = true;

		// - sending connection message
		client.send("connected lets goo ^^");
		logger("backend_connection", "log", client.log(c.LGREEN + "→ ", "client init" + c.CLEAN + "\n"))
	}

	let		_handleWsMessageEvent = function(client, message, req)
	{
		logger("backend_incommingMessage", "log", client.log(c.LLGREEN + "→ ", "new message" + c.CLEAN), "\n" + message);
		logger("backend_incommingMessage", "log", "", c.LLGREEN + "-- END --" + c.CLEAN + "\n");

		_handleIncommingJSONMessage(client, message);
	}

	let		_handleWsCloseEvent = function(client, req)
	{
		logger("backend_disconnection", "log", client.log(c.LRED + "← ", c.BOLD + "client disconnected" + c.CLEAN + "\n"));

		// - handling disconnection (removing client from _clientsArr)
		client.leaveEveryGameRoom();

		_clientsArr.splice(_clientsArr.indexOf({ws:client.clientWs}), 1);
		clearInterval(client.loopId);
		client.isConnected = false;
	}

	let		_handleMatchmaking = function(client, matchmakingEventObject)
	{
		// * actual status list :
		//   MatchmakingEventWS.noStatus;
		//   MatchmakingEventWS.launch;
		//   MatchmakingEventWS.stop;
		//   MatchmakingEventWS.found;

		logger("backend_matchmaking", "log", "", c.CYAN + "recived MatchmakingEventWS" + c.CLEAN);
		if (matchmakingEventObject.status == MatchmakingEventWS.noStatus)
			return ;

		if (matchmakingEventObject.status == MatchmakingEventWS.launch)
		{
			if (matchmakingEventObject.mode == MatchmakingEventWS.noMode)
				return ;
			if (matchmakingEventObject.mode == MatchmakingEventWS.againstPlayer)
				_startMatchmakingVsPlayer(client);
			if (matchmakingEventObject.mode == MatchmakingEventWS.againstAi)
				_startMatchmakingVsAi(client);
			if (matchmakingEventObject.mode == MatchmakingEventWS.tournament)
				_startMatchmakingTournament(client);
		}
		else if (matchmakingEventObject.status == MatchmakingEventWS.stop)
			_stopMatchmaking(client);
	}

	let		_startMatchmakingVsPlayer = function(client)
	{
		logger("backend_matchmaking", "log", c.LLGREEN + "starting matchmaking (vs player) for client \"" + client.uuid + "\"" + c.CLEAN);

		// let matchmakingTickSpeed = 50;
		let matchmakingTickSpeed = 1000;

		if (client.matchmakingLoopId != null)
		{
			logger("backend_matchmaking", "log", c.ORANGE + "client is already in matchmaking process" + c.CLEAN, c.ORANGE + c.ITALIC + "client: \"" + client.uuid + "\"" + c.CLEAN);
			return ;
		}

		client.matchmakingLoopId = setInterval(function ()
		{
			for (let [roomName, roomObject] of [..._gameRoomMap].reverse())
			{
				if (!GameRoom.isGoodRoomType(roomObject.roomType))
					continue ;
				if (!roomObject.isMatchmakingPossible)
					continue ;
				if (roomObject.canPlayInRoom() == true)
				{
					let matchmakingEvent	= new MatchmakingEventWS();
					matchmakingEvent.id		= client.uuid + " matchmaking";
					matchmakingEvent.status	= MatchmakingEventWS.found;
					client.send(matchmakingEvent.createJSON());

					roomObject.addClient(client);

					_stopMatchmaking(client);
					break ;
				}
			}
		}, matchmakingTickSpeed);
	}

	let		_startMatchmakingVsAi = function(client)
	{
		logger("backend_matchmaking", "log", c.LLGREEN + "starting matchmaking (vs AI) for client \"" + client.uuid + "\"" + c.CLEAN);
		logger("backend_matchmaking", "log", c.RED + "-- NOT IMPLEMENTED --" + c.CLEAN);
		// * Will probably be delete, game vs AI didn't work with matchmaking ?
	}

	let		_startMatchmakingTournament = function(client)
	{
		logger("backend_matchmaking", "log", c.LLGREEN + "starting matchmaking (tournament) for client \"" + client.uuid + "\"" + c.CLEAN);
		// * Trying to join a 'Tournament' object, who stores :
		// *	- clients
		// * 	- tournament config
		// *	- scores
		// *	- game rooms (not joinable on regular matchmaking process)
		// * Matchmaking process same as '_startMatchmakingVsPlayer()', but instead of joining 'GameRoom',
		// * you join a 'tournamentRoom'

		// * Needs a 'create tournament' page

		// let matchmakingTickSpeed = 50;
		let matchmakingTickSpeed = 1000;

		if (client.matchmakingLoopId != null)
		{
			logger("backend_matchmaking", "log", c.ORANGE + "client is already in matchmaking process" + c.CLEAN, c.ORANGE + c.ITALIC + "client: \"" + client.uuid + "\"" + c.CLEAN);
			return ;
		}

		client.matchmakingLoopId = setInterval(function ()
		{
			for (let [roomName, roomObject] of [..._gameRoomMap].reverse())
			{
				if (!TournamentRoom.isGoodRoomType(roomObject.roomType))
					continue ;
				if (!roomObject.isMatchmakingPossible)
					continue ;
				if (roomObject.canPlayInRoom() == true)
				{
					let matchmakingEvent	= new MatchmakingEventWS();
					matchmakingEvent.id		= client.uuid + " matchmaking";
					matchmakingEvent.status	= MatchmakingEventWS.found;
					client.send(matchmakingEvent.createJSON());

					roomObject.addClient(client);

					_stopMatchmaking(client);
					break ;
				}
			}
		}, matchmakingTickSpeed);
	}

	let		_stopMatchmaking = function(client)
	{
		logger("backend_matchmaking", "log", c.LRED + "stopping matchmaking for client \"" + client.uuid + "\"" + c.CLEAN);
		if (client.matchmakingLoopId == null)
		{
			logger("backend_matchmaking", "log", c.ORANGE + "client is not in matchmaking process" + c.CLEAN, c.ORANGE + c.ITALIC + "client: \"" + client.uuid + "\"" + c.CLEAN);
			return ;
		}

		clearInterval(client.matchmakingLoopId);
		client.matchmakingLoopId = null;
	}

	let		_handleIncommingJSONMessage = async function(client, messageJSON)
	{
		let parsedJSON;

		try
		{
			parsedJSON = JSON.parse(messageJSON);
		}
		catch (e)
		{
			logger("JSONParsing", "err", c.LORANGE + "! exception caught : " + e + c.CLEAN);
			logger("JSONParsing", "err", "", c.LORANGE + "! complete message : " + "\n" + messageJSON);
			logger("JSONParsing", "err", "", c.LORANGE + "-- END --" + c.CLEAN + "\n");
			client.send("pa  du JSON ca >:(");
			client.send("error: " + e);
			return (1);
		}

		// logger("note", "log", c.LPINK + c.BOLD + "-- we have to handle request types now --" + c.CLEAN);
		// logger("note", "log", c.LPINK + c.BOLD + "-- for the moment, we launch the game for any JSON requests --" + c.CLEAN);
		if (KeyEventWS.isGoodTypeJSON(parsedJSON.type))
			client.handleKey(messageJSON);
		if (RoomCreationEventWS.isGoodTypeJSON(parsedJSON.type))
		{
			let	roomCreationEvent = RoomCreationEventWS.createFromJSON(messageJSON);
			createGameRoom(roomCreationEvent);
		}
		if (LaunchGameEventWS.isGoodTypeJSON(parsedJSON.type))
		{
			let	launchGameEvent = LaunchGameEventWS.createFromJSON(messageJSON);
			
			let room = _gameRoomMap.get(launchGameEvent.roomName);
			if (room)
				room.launchGame();
		}
		if (JoinRoomEventWS.isGoodTypeJSON(parsedJSON.type))
		{
			let joinRoomEvent = JoinRoomEventWS.createFromJSON(messageJSON);
			gameRoomJoin(client, joinRoomEvent.roomToJoin);

			deleteEmptyGameRooms();
		}
		if (LeaveRoomEventWS.isGoodTypeJSON(parsedJSON.type))
		{
			let leaveRoomEvent = LeaveRoomEventWS.createFromJSON(messageJSON);
			gameRoomLeave(client, leaveRoomEvent.roomToLeave);

			deleteEmptyGameRooms();
		}
		if (MatchmakingEventWS.isGoodTypeJSON(parsedJSON.type))
			_handleMatchmaking(client, MatchmakingEventWS.createFromJSON(messageJSON));
		if (TournamentCreationEventWS.isGoodTypeJSON(parsedJSON.type))
		{
			let	tournamentCreationEvent = TournamentCreationEventWS.createFromJSON(messageJSON);
			createTournamentRoom(tournamentCreationEvent);
		}
		if (UserDetailsWS.isGoodTypeJSON(parsedJSON.type))
		{
			let userDetails = UserDetailsWS.createFromJSON(messageJSON)

			if (userDetails.userId == UserDetailsWS.AiId || userDetails.userId == UserDetailsWS.AnonymousId)
			{
				client.userDetails = userDetails;
				return ;
			}

			try
			{
				let agent	= new https.Agent({ rejectUnauthorized: false });
				const res	= await fetch("https://fastify-account:" + process.env.PORT_FASTIFY + "/me",
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userDetails.token}` },
					agent,
				});

				let response = await res.json();
				if (res.status == 403 || response.user.id != userDetails.userId)
				{
					logger("backend_connection", "warn", c.LYELLOW + c.BOLD + "sus warning : client is a fraud (invalid token or wrong userId provided)" + c.CLEAN)
					userDetails.userId	= UserDetailsWS.AnonymousId;
					userDetails.token	= "";
				}
			}
			catch (e)
			{
				logger("backend_connection", "err", c.DORANGE + c.BOLD + "error : \"" + e.message + c.CLEAN + c.DORANGE + c.BOLD + "\"" + c.CLEAN, c.ITALIC + c.GRAY + "(e = " + e + ")" + c.CLEAN)
			}

			logger("backend_incommingMessage", "log", client.log(c.LGREEN + "† ", "client identified" + c.CLEAN), c.LGREEN + " with userId " + c.ITALIC + userDetails.userId + c.CLEAN);
			client.userDetails = userDetails;
		}
	}
}
