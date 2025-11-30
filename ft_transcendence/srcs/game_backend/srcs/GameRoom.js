/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameRoom.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/12 16:57:09 by isibio            #+#    #+#             */
/*   Updated: 2025/05/30 15:23:45 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import https				from 'https';
import fetch				from 'node-fetch';

import { postToFastify }	from '/lib/transcendence/postToFastify.js'; //to use fastify's routes

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';

import wsCommunicationsJS	from '/lib/transcendence/wsCommunicationsJS/wsCommunications.js';

import Controls				from '/lib/transcendence/wsCommunicationsJS/control/Controls.js';

import KeyEventWS				from '/lib/transcendence/wsCommunicationsJS/event/KeyEventWS.js';
import LaunchGameEventWS		from '/lib/transcendence/wsCommunicationsJS/event/LaunchGameEventWS.js';
import GameCountdownWS			from '/lib/transcendence/wsCommunicationsJS/event/GameCountdownWS.js';
import BallHitObjectWS			from '/lib/transcendence/wsCommunicationsJS/event/BallHitObjectWS.js';
import GameSummaryWS			from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js';
import RoomLeftEventWS			from '/lib/transcendence/wsCommunicationsJS/event/RoomLeftEventWS.js';
import RoomCreationEventWS		from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js';
import ClearRenderMapEventWS	from '/lib/transcendence/wsCommunicationsJS/event/ClearRenderMapEventWS.js';

import BallWS				from '/lib/transcendence/wsCommunicationsJS/ball/BallWS.js';
import PaddleWS				from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleWS.js';
import PaddleHitLineWS			from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleHitLineWS.js';
import BoardWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWS.js';
import BoardWallWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWallWS.js';
import HitLineWS			from '/lib/transcendence/wsCommunicationsJS/collision/HitLineWS.js';
import PointWS				from '/lib/transcendence/wsCommunicationsJS/PointWS.js';

import UserDetailsWS				from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

import RoomObjectDataWS				from '/lib/transcendence/wsCommunicationsJS/gameRoom/RoomObjectDataWS.js';
import ClientRoomDataWS				from '/lib/transcendence/wsCommunicationsJS/gameRoom/ClientRoomDataWS.js';
import ClientControllingPaddlesWS	from '/lib/transcendence/wsCommunicationsJS/gameRoom/ClientControllingPaddlesWS.js';

let	defaultRoomName	= "bebou's nap area (default room name)";
let	ROOM_TYPE		= "gameRoom";

export function GameRoom(roomName_ = defaultRoomName)
{
	// - public attrubutes
	this.roomType	= ROOM_TYPE;

	this.roomName	= roomName_ == "" ? defaultRoomName : roomName_;
	this.clientMap	= new Map();					// - key:	client		[object]
													//	 value:	roomData	[object]
	this.goalMap	= new Map();					// - key:	hitLine Id	[string]
													//	 value:	paddle  Id	[string]
	this.pointForClientWin			= 10;

	this.roomLoopId					= undefined;
	this.collitionUpdateLoopId		= undefined;
	this.countdownBeforeGameStarts	= 3000;			// - time in ms

	this.resetBallPositionOnGoal	= true;
	this.resetBallSpeedOnGoal		= true;

	this.isMatchmakingPossible		= true;

	this.gameSummary				= null;

	// - private attrubutes
	let _this		= this;

	let _objectMap			= new Map();	// - key:	object		[object]
											//	 value:	objectData	[object]

	let _originalObjectMap	= new Map();	// - backup of `_objectMap` before the game starts 
											//		key:	object		[object]
											//		value:	objectData	[object]
	let	_clientDefaultPoints = 0;

	// *
	// * public methods
	let	launchGame = this.launchGame = async function()
	{
		if (_this.roomLoopId)
			return ;
		_this.roomLoopId = "loading";

		// * GAME PRELOAD
		// * ! this verification check all players, spectators too
		if (_getDuplicateClients(_this.clientMap).length)
		{
			_this.endGame(GameSummaryWS.gameEndPlayersNotUnique, false);
			return ;
		}
		for (let [client, roomData] of _this.clientMap)
			_sendMessageToClientMap(roomData.createJSON());

		_originalObjectMap = _copyObjectMap(_objectMap);
		_updateCollisionsLoop(_objectMap);
		_initBallHitLineContactCallback(_objectMap);

		for (let [client, roomData] of _this.clientMap)
			_sendMessageToClientMap(roomData.createJSON());

		await _launchCoundtown(_this.clientMap, _this.countdownBeforeGameStarts);
		if (!_this.roomLoopId)
			return ;

		// * GAME LAUNCH
		_this.launchBallsInMap();

		_this.roomLoopId = setInterval(async function ()
		{
			// * WILL BE MOVED TO A FUNCTION ( _executeKeys)
			// _executeKeys();
			for (let [client, roomData] of _this.clientMap)
			{
				client.movingPaddle = false;
				for (let [key, completeKeyEvent] of client.keyStateMap)
				{
					if (completeKeyEvent.eventType == KeyEventWS.keyDown)
					{
						if (!client.movingPaddle && completeKeyEvent.key.name == client.getBindedKey(Controls.paddleUp).name)
						{
							_clientStopPaddles(client);
							client.movingPaddle = true;
							_clientLaunchPaddles(client, 0);
						}
						if (!client.movingPaddle && completeKeyEvent.key.name == client.getBindedKey(Controls.paddleDown).name)
						{
							_clientStopPaddles(client);
							client.movingPaddle = true;
							_clientLaunchPaddles(client, 180);
						}
					}
					if (completeKeyEvent.eventType == KeyEventWS.keyUp)
					{
						if (!client.movingPaddle && (completeKeyEvent.key.name == client.getBindedKey(Controls.paddleUp).name || completeKeyEvent.key.name == client.getBindedKey(Controls.paddleDown).name))
						{
							_clientStopPaddles(client);
							client.movingPaddle = false;
						}
					}
				}
			}

			_renderElementMapToClientMap(_objectMap);
		}, 20);
	}

	let endGame = this.endGame = function(reason = GameSummaryWS.gameEndNoReason, sendSummaryToDatabase = true)
	{
		stop();

		_updateClientDataVictory(_this.clientMap);
		_this.gameSummary = _createGameSummary(_this.clientMap, reason);
		_sendMessageToClientMap(_this.gameSummary.createJSON());

		if (sendSummaryToDatabase)
			_gameSummaryToDatabase(_this.gameSummary);
	}

	// * stopGame
	let	stop = this.stop = function()
	{
		clearInterval(_this.roomLoopId);
		clearInterval(_this.collitionUpdateLoopId);
		stopBallsInMap(true, _objectMap);
		_this.roomLoopId = undefined;
	}

	let	initRoomFromRoomCreationEvent = this.initRoomFromRoomCreationEvent = function(gameRoomCreatonEvent)
	{
		setRoomName(gameRoomCreatonEvent.roomName);
		_this.countdownBeforeGameStarts	= gameRoomCreatonEvent.countdownBeforeGameStarts;
		_this.pointForClientWin			= gameRoomCreatonEvent.pointForClientWin;
		_this.resetBallPositionOnGoal	= gameRoomCreatonEvent.resetBallPositionOnGoal;
		_this.resetBallSpeedOnGoal		= gameRoomCreatonEvent.resetBallSpeedOnGoal;
		_this.isMatchmakingPossible		= gameRoomCreatonEvent.isMatchmakingPossible;

		_objectMap		= new Map(gameRoomCreatonEvent.objectMap);
		_this.goalMap	= new Map(gameRoomCreatonEvent.goalMap);
	}

	let	launchBallsInMap = this.launchBallsInMap = function(objectMap_ = _objectMap, countdownBeforeBallLaunch_ = 0)
	{
		for (let [object, objectRoomData] of objectMap_)
			if (BallWS.isGoodTypeJSON(object.type))
				object.launch(countdownBeforeBallLaunch_);
	}

	let	stopBallsInMap = this.stopBallsInMap = function(blockBallLaunch_ = false, objectMap_ = _objectMap)
	{
		for (let [object, objectRoomData] of objectMap_)
		{
			if (BallWS.isGoodTypeJSON(object.type))
			{
				object.blockBallLaunch = blockBallLaunch_;
				object.stop();
			}
		}
	}


	let	canPlayInRoom = this.canPlayInRoom = function()
	{
		if (_this.gameSummary || _this.roomLoopId || _this.getPaddleFreeToBeOwned() === null)
			return (false);
		return (true);
	}

	let	addClient = this.addClient = function(client, roomData = new ClientRoomDataWS())
	{
		logger("gameRoom_clientJoin", "log", c.LGREEN + `→ [${_this.roomName}]: client joined game room` + c.CLEAN, c.ITALIC + c.LGREEN + `: ${client.uuid}` + c.CLEAN)
		if (_this.gameSummary)
		{
			logger("gameRoom_clientJoin", "log", c.LORANGE + `→ [${_this.roomName}]: room match is over, can't join the room` + c.CLEAN, c.ITALIC + c.LORANGE + `: ${client.uuid}` + c.CLEAN)
			return ;
		}

		roomData.client 		= client.uuid;
		roomData.userDetails	= client.userDetails;
		roomData.points			= _clientDefaultPoints;
		roomData.id				= client.uuid + "'s room data";
		_this.clientMap.set(client, roomData);

		_renderElementMapToClient(client, _objectMap, true, false);

		let roomCreationEventWS = new RoomCreationEventWS();
		roomCreationEventWS.roomName					= _this.roomName;
		roomCreationEventWS.countdownBeforeGameStarts	= _this.countdownBeforeGameStarts;
		roomCreationEventWS.pointForClientWin			= _this.pointForClientWin;
		roomCreationEventWS.resetBallPositionOnGoal		= _this.resetBallPositionOnGoal;
		roomCreationEventWS.resetBallSpeedOnGoal		= _this.resetBallSpeedOnGoal;
		roomCreationEventWS.id							= _this.roomName + "'s game creation event"
		client.send(roomCreationEventWS.createJSON());

		let freePaddle = getPaddleFreeToBeOwned();
		if (freePaddle !== null)
			freePaddle.addClientOwner(client.uuid);

		client.joinedGameRoomMap.set(_this.roomName, _this);

		if (!_this.getPaddleFreeToBeOwned())
			_this.launchGame();

		let clientControllingPaddle		= new ClientControllingPaddlesWS();
		clientControllingPaddle.paddleIdArr	= getPaddleOwnedByClient(_this.objectMap, client.uuid);
		clientControllingPaddle.id			= client.uuid + "'s controlling paddles";
		client.send(clientControllingPaddle.createJSON());
	}

	let	removeClient = this.removeClient = function(client, sendClearRenderMapEvent = true)
	{
		logger("gameRoom_clientLeave", "log", c.LRED + `→ [${_this.roomName}]: client left game room` + c.CLEAN, c.ITALIC + c.LRED + `: ${client.uuid}` + c.CLEAN)

		let roomLeftEventWS			= new RoomLeftEventWS();
		roomLeftEventWS.clientUUID	= client.uuid;
		roomLeftEventWS.id			= client.uuid + " left room";
		_sendMessageToClientMap(roomLeftEventWS.createJSON());

		let	clientRoomData = _this.clientMap.get(client);
		clientRoomData.clientDisconnected = true;
		if (!_this.roomLoopId && _this.roomLoopId !== 0)
			_removeClientControllingPaddles(client);
		if (_this.roomLoopId && getPaddleOwnedByClient(_this.objectMap, client.uuid).length)
			endGame(GameSummaryWS.gameEndPlayerQuit);

		_this.clientMap.delete(client);
		client.joinedGameRoomMap.delete(_this.roomName);
		if (sendClearRenderMapEvent)
			client.send((new ClearRenderMapEventWS()).createJSON());


		// * Le retirer des propriaitaires des paddle qu'il controle
		// * Si la game etait lancee
		// *	endGame(GameSummaryWS.gameEndPlayerQuit);
		// * !! ABUS, si on peut mettre fin a la partie et gagner quand on veux c'est bizarre
		// *    mais comme il a ete delete de la map de clients je crois qu'il ne va pas etre dans le summary
		//      et c'est maybe un probleme, faut qu'il soit la mais qu'on lui mette ses points a 0 ou -1 carrement
		// if (_this.roomLoopId)


		// endGame(GameSummaryWS.gameEndPlayerQuit);
		// console.log("getClientOwnerArr =", getClientOwnerArr);
	}

	let	getObjectFromId = this.getObjectFromId = function(id_, objectMap_ = _objectMap)
	{
		for (let [object, objectRoomData] of objectMap_)
			if (object.id == id_)
				return (object);
		return (null);
	}

	let	getClientFromUUID = this.getClientFromUUID = function(uuid_, getRoomData = false, objectMap_ = _objectMap)
	{
		if (uuid_ === undefined)
			return (getRoomData ? [null, null] : null);

		for (let [client, roomData] of _this.clientMap)
			if (client.uuid == uuid_)
				return (getRoomData ? [client, roomData] : client);
		return (getRoomData ? [null, null] : null);
	}

	let	getPaddleFreeToBeOwned = this.getPaddleFreeToBeOwned = function(objectMap_ = _objectMap)
	{
		for (let [object, objectRoomData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				if (object.canAddClientOwner())
					return (object);
		return (null);
	}

	let	getPaddleFreeToBeOwnedArr = this.getPaddleFreeToBeOwnedArr = function(objectMap_ = _objectMap)
	{
		let paddleFreeToBeOwnedArr = [];

		for (let [object, objectRoomData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				if (object.canAddClientOwner())
					paddleFreeToBeOwnedArr.push(object);
		return (paddleFreeToBeOwnedArr);
	}

	let	getClientOwnerArr = this.getClientOwnerArr = function(objectMap_ = _objectMap)
	{
		let clientOwnerArr = [];

		for (let [object, objectRoomData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				clientOwnerArr = clientOwnerArr.concat(object.clientOwnerArr);
		return (clientOwnerArr);
	}

	let	getPaddleOwnedByClient = this.getPaddleOwnedByClient = function(objectMap_ = _objectMap, clientUUID)
	{
		let paddleIdArr = [];

		for (let [object, objectRoomData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				if (object.clientOwnerArr.includes(clientUUID))
					paddleIdArr.push(object.id);
		return (paddleIdArr);
	}


	let	setRoomName = this.setRoomName = function(newRoomName_ = "", buypassCheck_ = false)
	{
		// if (!RoomCreationEventWS.isValidRoomName(newRoomName_) && !buypassCheck_)
		_this.roomName = newRoomName_;
	}

	// * private methods
	let	_removeClientControllingPaddles = function(client_, objecMap_ = _this.objectMap)
	{
		for (let [object, objectRoomData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				object.removeClientOwner(client_.uuid);
	}


	let	_launchCoundtown = async function(clientMap_, timeInMs_)
	{
		let	countdownEndValue			= 0;
		let gameCountdownWS				= new GameCountdownWS();

		gameCountdownWS.id				= _this.roomName + " countdowm";
		gameCountdownWS.originalValue	= timeInMs_;
		gameCountdownWS.actualValue		= timeInMs_;
		gameCountdownWS.endValue		= countdownEndValue;

		while (timeInMs_ >= countdownEndValue && _this.roomLoopId)
		{
			gameCountdownWS.actualValue = timeInMs_;
			if (!(timeInMs_ % 10))
				_sendMessageToClientMap(gameCountdownWS.createJSON());
			timeInMs_ -= 1;
			await new Promise(r => setTimeout(r, 1));
		}
		_sendMessageToClientMap(gameCountdownWS.createJSON());
	}

	let	_updateCollisionsLoop = async function(objectMap_)
	{
		if (objectMap_ === null || objectMap_ === undefined)
			return ;

		_this.collitionUpdateLoopId = setInterval(async function ()
		{
			let newHandledCollisionsValuesMap = new Map();

			for (let [object, objectRoomData] of objectMap_)
			{
				if (!objectRoomData.collideWithMap.size)
					continue ; 
				for (let [id, objectToCollideWithMap] of objectRoomData.collideWithMap)
				{
					let objectToCollideWith = getObjectFromId(id);
					if (!objectToCollideWith)
						continue ;

					// * NOT DEFINITIVE // NASTY
					// * a lot better if 'objectToCollideWithMap' had a function 'getHitLineMap'
					//   this could avoid this function specific types conditions
					//	 How to paddle handling ball collision ? (ball = 4 points or 4 lines or 1 point + radus)
					if (objectToCollideWith.handledCollisions)
						continue ;

					if (BoardWS.isGoodTypeJSON(objectToCollideWith.type))
						for (let wall of objectToCollideWith.wallArr)
							object.setCollisionsToRespect(wall.hitLine.id, wall.hitLine);
					else if (PaddleWS.isGoodTypeJSON(objectToCollideWith.type))
						for (let paddleHitLine of objectToCollideWith.hitLineArr)
							object.setCollisionsToRespect(paddleHitLine.hitLine.id, paddleHitLine.hitLine);
					else if (BallWS.isGoodTypeJSON(objectToCollideWith.type))
						object.setCollisionsToRespect(objectToCollideWith.point.id, objectToCollideWith.point);

					newHandledCollisionsValuesMap.set(objectToCollideWith, true);
				}
			}
			for (let [object, newHandledCollisionsValue] of newHandledCollisionsValuesMap)
				object.handledCollisions = newHandledCollisionsValue;
			newHandledCollisionsValuesMap.clear();
		}, 1);
	}

	let	_updateClientDataVictory = function(clientMap_ = _this.clientMap)
	{
		for (let [client, roomData] of clientMap_)
		{
			if (_clientDataHasWon(roomData))
				roomData.isVictory = true;
			else
				roomData.isVictory = false;
		}
	}

	let	_clientDataHasWon = function(roomData)
	{
		if (roomData.points >= _this.pointForClientWin)
			return (true);
		return (false);
	}

	let _initBallHitLineContactCallback = function(objectMap_ = _objectMap)
	{
		for (let [object, objectData] of _objectMap)
			if (BallWS.isGoodTypeJSON(object.type))
				object.hitLineContactCallbackFunction = _callbackBallHitLinecontact;
	}

	let _callbackBallHitLinecontact = async function(ball, hitLineId, ballNextPoint)
	{
		let isGoal = _handleGoal(ball, hitLineId, ballNextPoint);

		let ballHitObjectEvent = new BallHitObjectWS();
		ballHitObjectEvent.id			= ball.id + " hit object event";
		ballHitObjectEvent.ball			= ball;
		ballHitObjectEvent.hitLineId	= hitLineId;
		ballHitObjectEvent.isGoal		= isGoal;
		_sendMessageToClientMap(ballHitObjectEvent.createJSON());
	}

	// * this function return 'true' or 'false' if the collision is a goal 
	let _handleGoal = function(ball, hitLineId, ballNextPoint)
	{
		let	goalOwnerPaddleId = _this.goalMap.get(hitLineId);
		if (!goalOwnerPaddleId)
			return (false);

		_handleBallOnGoal(ball, ballNextPoint, _this.getObjectFromId(ball.id, _originalObjectMap), _this.resetBallPositionOnGoal, _this.resetBallSpeedOnGoal);

		let goalOwnerPaddle			= getObjectFromId(goalOwnerPaddleId);
		let goalOwnerClientArr		= goalOwnerPaddle.clientOwnerArr;
		let paddleOwnerClientArr	= [...new Set(getClientOwnerArr())];	// - Remove doubles

		// * Remove clients in `goalOwnerClientArr` from `paddleOwnerClientArr`
		//    - they don't desetve points
		for (let clientUUID of goalOwnerClientArr)
		{
			const index = paddleOwnerClientArr.indexOf(clientUUID);
			if (index > -1)
				paddleOwnerClientArr.splice(index, 1);
		}

		// * Give points to everyone in `paddleOwnerClientArr`
		for (let clientUUID of paddleOwnerClientArr)
		{
			let [clientObject, clientRoomData] = getClientFromUUID(clientUUID, true);
			if (!clientObject || !clientObject)
				continue;
			clientRoomData.points += 1;
			_sendMessageToClientMap(clientRoomData.createJSON());
		}

		_checkPointsForEndGame(_this.clientMap);

		return (true);
		// Il faut : une liste de tous les client proprietaires de paddles dans _objectMap
		//			 retirer les doubles !
		//			 attribuer des points a tous ces clients sauf ceux dans la liste `goalOwnerClientArr`
	}


	let	_sendMessageToClientMap = function(message, clientMap_ = _this.clientMap, sendToDisconnectedClient = false)
	{
		if (!message)
			return ;

		for (let [client, roomData] of clientMap_)
			if (roomData.clientDisconnected == false || sendToDisconnectedClient)
				client.send(message);
	}

	let _createGameSummary = function(clientMap_ = _this.clientMap, gameEndReason_ = GameSummaryWS.gameEndNoReason)
	{
		let	gameSummary		= new GameSummaryWS();
		let clientOwnerArr	= getClientOwnerArr();

		gameSummary.gameEndReason	= gameEndReason_;
		gameSummary.gameRoomName	= _this.roomName;
		gameSummary.id				= _this.roomName + " game summary";
		for (let clientUUID of clientOwnerArr)
		{
			let [clientObject, clientRoomData] = getClientFromUUID(clientUUID, true);
			gameSummary.clientDataArr.push(clientRoomData);
		}
		return (gameSummary);
	}


	let	_renderElementMapToClientMap = function(mapToRender_ = _objectMap, clientMap_ = _this.clientMap, forceRender_ = false)
	{
		for (let [elementToDirplay, roomData] of mapToRender_)
		{
			_renderElementToClientMap(elementToDirplay, clientMap_, forceRender_, false);
			elementToDirplay.printedChanges = true;
		}
	}

	let	_renderElementMapToClient = function(client, mapToRender_ = _objectMap, forceRender_ = false, updatePrintedChanges_ = false)
	{
		for (let [elementToDirplay, roomData] of mapToRender_)
			_renderElement(client, elementToDirplay, forceRender_, updatePrintedChanges_);
	}

	let	_renderElementToClientMap = function(element_, clientMap_ = _this.clientMap, forceRender_ = false, updatePrintedChanges_ = true)
	{
		if (!element_)
			return ;
		for (let [client, roomData] of clientMap_)
		{
			if (forceRender_ || element_.printedChanges == false)
				client.send(element_.createJSON());
		}

		// * printedChanges different for each clients ?
		if (updatePrintedChanges_)
			element_.printedChanges = true;
	}

	let	_renderElement = function(client_, element_, forceRender_, updatePrintedChanges_ = true)
	{
		if (!element_)
			return ;
		if (forceRender_ || element_.printedChanges == false)
			client_.send(element_.createJSON());
		if (updatePrintedChanges_)
			element_.printedChanges = true;
	}


	let	_clientStepPaddles = function(client_, xToAdd_ = 0, yToAdd_ = 0)
	{
		for (let [object, objectData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				object.clientStep(client_.uuid, xToAdd_, yToAdd_);
	}

	let	_clientLaunchPaddles = function(client_, angleToAdd_, newSpeed_, newAngle_)
	{
		for (let [object, objectData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				object.clientLaunch(client_.uuid, angleToAdd_, newSpeed_, newAngle_);
	}

	let	_clientStopPaddles = function(client_)
	{
		for (let [object, objectData] of _objectMap)
			if (PaddleWS.isGoodTypeJSON(object.type))
				object.clientStop(client_.uuid);
	}


	let _copyObjectMap = function(objectMapToClone_)
	{
		let	toReturn = new Map();

		for (let [object, objectData] of objectMapToClone_)
			toReturn.set(wsCommunicationsJS.createObjectFromJSON(object.createJSON()), wsCommunicationsJS.createObjectFromJSON(objectData.createJSON()));
		return (toReturn);
	}


	let _handleBallOnGoal = async function(ball_, ballNextPoint_, newBall_, resetBallPosition_ = true, resetBallSpeed_ = true)
	{
		// - Random Angle :
		//		Take a random point of a random paddle
		//		Get angle between position of the ball (when at the center) and position of the point
		//		HitLineWS.getLineAngle = function(startPoint_, endPoint_) 
		if (!resetBallPosition_)
		{
			newBall_.setPosition(ballNextPoint_.posX, ballNextPoint_.posY);
			newBall_.setAngle(ballNextPoint_.angle);
		}
		else
		{
			let newAndle = _getRandomTargetAngle(newBall_.point);
			if (newAndle)
				newBall_.setAngle(newAndle);
		}

		if (!resetBallSpeed_)
		{
			newBall_.point.speed = ballNextPoint_.speed;
		}


		ball_.stop();
		await new Promise(r => setTimeout(r, ball_.tickspeed + 5));	// security : in case ball_ still running
																	//            (so updating her values)
		ball_.point.initFromJSON(newBall_.point.createJSON());
		ball_.launch();
	}

	let _checkPointsForEndGame = function(clientMap_ = _this.clientMap)
	{
		for (let [client, roomData] of clientMap_)
		{
			if (_clientDataHasWon(roomData))
				endGame(GameSummaryWS.gameEndPlayerVictory);
		}
	}

	let	_getDuplicateClients = function(clientMap_ = _this.clientMap)
	{
		let clientIdArr = [];

		for (let [client, roomData] of clientMap_)
			if (client.userDetails.userId != UserDetailsWS.AiId && client.userDetails.userId != UserDetailsWS.AnonymousId)
				clientIdArr.push(client.userDetails.userId);

		let duplicates = clientIdArr.filter((item, index) => clientIdArr.indexOf(item) !== index);
		return (duplicates);
	}

	let _getRandomTargetAngle = function(originPoint, objecMap_ = _this.objectMap)
	{
		let	targetArr = [];
		for (let [object, objectData] of _objectMap)
		{
			if (PaddleWS.isGoodTypeJSON(object.type))
			{
				for (let paddleHitLine of object.hitLineArr)
				{
					targetArr.push(paddleHitLine.hitLine.startPoint);
					targetArr.push(paddleHitLine.hitLine.endPoint);
				}
			}
		}

		let targetRand = Math.floor(Math.random() * (targetArr.length - 1));
		// console.log("originPoint           =", originPoint)
		// console.log("targetArr[targetRand] =", targetArr[targetRand]);
		// console.log("----------------------");
		// console.log("angle                 =", HitLineWS.getLineAngle(originPoint, targetArr[targetRand], true));
		// console.log("angle                 =", HitLineWS.getLineAngle(targetArr[targetRand], originPoint, true));
		let lineAngle = HitLineWS.getLineAngle(originPoint, targetArr[targetRand]);

		if (!targetRand)
			return (null);
		return (HitLineWS.getLineAngle(originPoint, targetArr[targetRand]));
	}
	
	/////////////////////////////////////////////////////// Send to fastify ///////////////////////////////////////////////////
	let _gameSummaryToDatabase = async function(gameSummary)
	{
		if (!gameSummary)
			return ;
		if (!process.env.BACKEND_SECRET)
		{
			console.log("MISSING secret for backend communication, cancelling gameStats");
			return ;
		}

		const gameSummaryParsed = gameSummary.createJSON(true);

		//send les donnees parsed
		let agent	= new https.Agent({ rejectUnauthorized: false });
		const res	= await fetch("https://fastify-account:" + process.env.PORT_FASTIFY + "/gameStats",
		{
			method: 'POST',
			body: JSON.stringify(gameSummaryParsed),
			headers: { 'Content-Type': 'application/json',
						'Authorization': process.env.BACKEND_SECRET },
			agent,
		});
		// const res = await postToFastify('/gameStats', gameSummaryParsed);
	}

	// * public methods (misc)
	let	testCollisions = this.testCollisions = function(client)
	{
		let ballOriginWS = new BallWS("Ball Origin Position");
		ballOriginWS.setPosition(200, 200);
		ballOriginWS.setAngle(180);

		let hitLineWS = new HitLineWS("HitLine Test");
		hitLineWS.setPosition(200, 0, 400, 400)


		// * not for edit
		let hitLineDistanceFromCenter = 400;
		let ballStepSize = hitLineDistanceFromCenter * 2 + 50;

		let pointLineCenter = new BallWS("Point HitLine Center");
		pointLineCenter.setPosition(400, 300);

		let ballWS = new BallWS("Ball Test");
		ballWS.setCollisionsToRespect(hitLineWS.id, hitLineWS);
		ballWS.setPosition(ballOriginWS.point.posX, ballOriginWS.point.posY);
		ballWS.setAngle(ballOriginWS.point.angle);

		let hitPoint = ballWS.step(ballStepSize);

		_renderElement(client, hitLineWS, true);
		_renderElement(client, ballOriginWS, true);
		_renderElement(client, hitPoint, true);
		_renderElement(client, ballWS, true);

		return ;
		// - looped test ----------------------------------------------------
		ballWS.setPosition(ballOriginWS.point.posX, ballOriginWS.point.posY);
		ballWS.setAngle(ballOriginWS.point.angle);

		let	i				= 0;
		client.loopId = setInterval(function ()
		{
			let hitPoint;

			// i++;
			// if (!(i % 2))
			// {
				ballWS.setPosition(ballOriginWS.point.posX, ballOriginWS.point.posY);
				hitLineWS.startPoint.stepAround(pointLineCenter, hitLineDistanceFromCenter);
				hitLineWS.startPoint.setAngle(hitLineWS.startPoint.angle + 0.5);

				hitLineWS.endPoint.stepAround(pointLineCenter, -hitLineDistanceFromCenter);
				hitLineWS.endPoint.setAngle(hitLineWS.endPoint.angle + 0.5);

				hitPoint = ballWS.step(ballStepSize);
			// }
			// else
				// hitPoint = ballWS.step(-ballStepSize);

			_renderElement(client, hitLineWS, true);
			_renderElement(client, ballOriginWS, true);
			_renderElement(client, hitPoint, true);
			_renderElement(client, ballWS, true);

		}, 10);
	}
}

// * static methods
GameRoom.isGoodRoomType = function(typeToTest)
{
	if (typeToTest == ROOM_TYPE)
		return (true);
	return (false);
}

export default GameRoom;
