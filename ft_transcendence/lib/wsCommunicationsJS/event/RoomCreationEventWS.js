/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RoomCreationEventWS.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/24 11:49:08 by isibio            #+#    #+#             */
/*   Updated: 2025/05/28 16:00:53 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import wsCommunications		from '../wsCommunications.js'
import * as wsUtils			from '/lib/transcendence/wsCommunicationsJS/wsUtils.js';

import RoomObjectDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/RoomObjectDataWS.js';

import BallWS				from '/lib/transcendence/wsCommunicationsJS/ball/BallWS.js';
import PaddleWS				from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleWS.js';
import PaddleHitLineWS			from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleHitLineWS.js';
import BoardWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWS.js';
import BoardWallWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWallWS.js';
import HitLineWS			from '/lib/transcendence/wsCommunicationsJS/collision/HitLineWS.js';
import PointWS				from '/lib/transcendence/wsCommunicationsJS/PointWS.js';

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "roomCreationEvent";

export function RoomCreationEventWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	// * can be directly changed by client
	this.roomName					= "P**G IN PARIS";
	this.countdownBeforeGameStarts	= 3000;		// - time in ms
	this.pointForClientWin			= 10;
	this.resetBallPositionOnGoal	= true;
	this.resetBallSpeedOnGoal		= true;
	this.nbAiToJoin					= 0;
	this.isMatchmakingPossible		= true;

	// * can't be directly changed by client
	this.objectMap	= new Map();				// - key:	object		[object]
												//	 value:	objectData	[object]
	this.goalMap	= new Map();				// - key:	hitLine Id	[string]
												//	 value:	paddle  Id	[string]
	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON		= JSON.parse(strJSON);

		_this.roomName					= parsedJSON.roomName;
		_this.countdownBeforeGameStarts	= parsedJSON.countdownBeforeGameStarts;
		_this.pointForClientWin			= parsedJSON.pointForClientWin;
		_this.resetBallPositionOnGoal	= parsedJSON.resetBallPositionOnGoal;
		_this.resetBallSpeedOnGoal		= parsedJSON.resetBallSpeedOnGoal;
		_this.nbAiToJoin				= parsedJSON.nbAiToJoin;
		_this.isMatchmakingPossible		= parsedJSON.isMatchmakingPossible;

		// * handle objectMap
		{
			let parsedObjectMap_KEY		= JSON.parse(parsedJSON.objectMap_KEY);
			let parsedObjectMap_VALUE	= JSON.parse(parsedJSON.objectMap_VALUE);

			let	objectMap_KEY	= [];
			let	objectMap_VALUE;
			for (let i = 0; i < parsedObjectMap_KEY.length; ++i)
				objectMap_KEY.push(wsCommunications.createObjectFromJSON(parsedObjectMap_KEY[i]));
			for (let i = 0; i < parsedObjectMap_VALUE.length; ++i)
			{
				objectMap_VALUE	= wsCommunications.createObjectFromJSON(parsedObjectMap_VALUE[i]);
				_this.objectMap.set(objectMap_KEY[i], objectMap_VALUE);
			}
		}

		// * handle goalMap
		{
			let map_KEY		= JSON.parse(parsedJSON.goalMap_KEY);
			let map_VALUE	= JSON.parse(parsedJSON.goalMap_VALUE);

			let	goalMap_KEY	= [];
			let	goalMap_VALUE;
			for (let i = 0; i < map_KEY.length; ++i)
				goalMap_KEY.push(map_KEY[i]);
			for (let i = 0; i < map_VALUE.length; ++i)
				_this.goalMap.set(goalMap_KEY[i], map_VALUE[i]);
		}

		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let	objectMap_KEY		= [];
		let	objectMap_VALUE		= [];
		for (let [mapKey, mapValue] of _this.objectMap)
		{
			objectMap_KEY.push(mapKey.createJSON());
			objectMap_VALUE.push(mapValue.createJSON());
		}

		let	goalMap_KEY	= [];
		let	goalMap_VALUE	= [];
		{
			for (let [mapKey, mapValue] of _this.goalMap)
			{
				goalMap_KEY.push(mapKey);
				goalMap_VALUE.push(mapValue);
			}
		}

		let toReturn = JSON.stringify({
			type:this.type,

			roomName:this.roomName,
			countdownBeforeGameStarts:this.countdownBeforeGameStarts,
			pointForClientWin:this.pointForClientWin,
			resetBallPositionOnGoal:this.resetBallPositionOnGoal,
			resetBallSpeedOnGoal:this.resetBallSpeedOnGoal,
			nbAiToJoin:this.nbAiToJoin,
			isMatchmakingPossible:this.isMatchmakingPossible,

			objectMap_KEY:JSON.stringify(objectMap_KEY),
			objectMap_VALUE:JSON.stringify(objectMap_VALUE),
			
			goalMap_KEY:JSON.stringify(goalMap_KEY),
			goalMap_VALUE:JSON.stringify(goalMap_VALUE),

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	let setRoomName = this.setRoomName = function(newValue = "", throwExceptions = true)
	{
		// * type:		string
		let minLength = RoomCreationEventWS.roomNameMinLength;
		let maxLength = RoomCreationEventWS.roomNameMaxLength;

		if (!newValue)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions));
		if (!(typeof newValue === 'string' || newValue instanceof String))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a string"), throwExceptions));
		if (newValue.length > maxLength)
			return (wsUtils.throwAndReturn(false, new RangeError("the length must be <= " + maxLength + " (actual:" + newValue.length + ")"), throwExceptions));
		if (newValue.length < minLength)
			return (wsUtils.throwAndReturn(false, new RangeError("the length must be >= " + minLength + " (actual:" + newValue.length + ")"), throwExceptions));

		_this.roomName = newValue;
		return (true);
	}

	let setCountdownBeforeGameStarts = this.setCountdownBeforeGameStarts = function(newValue = RoomCreationEventWS.countdownBeforeGameStartsDefault, throwExceptions = true)
	{
		// * type:		number
		let minValue = RoomCreationEventWS.countdownBeforeGameStartsMin;
		let maxValue = RoomCreationEventWS.countdownBeforeGameStartsMax;

		if (!newValue)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions));
		if (!(typeof newValue === 'number' || newValue instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions));
		if (newValue > maxValue)
			return (wsUtils.throwAndReturn(false, new RangeError("the value must be <= " + maxValue + " (actual:" + newValue + ")"), throwExceptions));
		if (newValue < minValue)
			return (wsUtils.throwAndReturn(false, new RangeError("the value must be >= " + minValue + " (actual:" + newValue + ")"), throwExceptions));

		_this.countdownBeforeGameStarts = newValue;
		return (true);
	}

	let setPointForClientWin = this.setPointForClientWin = function(newValue = RoomCreationEventWS.pointForClientWinDefault, throwExceptions = true)
	{
		// * type:		number
		let minValue = RoomCreationEventWS.pointForClientWinMin;
		let maxValue = RoomCreationEventWS.pointForClientWinMax;

		if (!newValue)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions));
		if (!(typeof newValue === 'number' || newValue instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions));
		if (newValue > maxValue)
			return (wsUtils.throwAndReturn(false, new RangeError("the value must be <= " + maxValue + " (actual:" + newValue + ")"), throwExceptions));
		if (newValue < minValue)
			return (wsUtils.throwAndReturn(false, new RangeError("the value must be >= " + minValue + " (actual:" + newValue + ")"), throwExceptions));

		_this.pointForClientWin = newValue;
		return (true);
	}

	let setResetBallPositionOnGoal = this.setResetBallPositionOnGoal = function(newValue = RoomCreationEventWS.resetBallPositionOnGoalDefault, throwExceptions = true)
	{
		// * type:		Boolean

		if (!(typeof newValue === 'boolean' || newValue instanceof Boolean))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a boolean"), throwExceptions));

		_this.resetBallPositionOnGoal = newValue;
		return (true);
	}

	let setResetBallSpeedOnGoal = this.setResetBallSpeedOnGoal = function(newValue = RoomCreationEventWS.resetBallSpeedOnGoalDefault, throwExceptions = true)
	{
		// * type:		Boolean

		if (!(typeof newValue === 'boolean' || newValue instanceof Boolean))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a boolean"), throwExceptions));

		_this.resetBallSpeedOnGoal = newValue;
		return (true);	
	}

	// * private methods
}

// * constants
RoomCreationEventWS.roomNameMinLength					= 3;
RoomCreationEventWS.roomNameMaxLength					= 36;
RoomCreationEventWS.countdownBeforeGameStartsDefault	= 2000;
RoomCreationEventWS.countdownBeforeGameStartsMin		= 500;
RoomCreationEventWS.countdownBeforeGameStartsMax		= 10000;
RoomCreationEventWS.pointForClientWinDefault			= 10;
RoomCreationEventWS.pointForClientWinMin				= 1;
RoomCreationEventWS.pointForClientWinMax				= 20;
RoomCreationEventWS.resetBallPositionOnGoalDefault		= true;
RoomCreationEventWS.resetBallSpeedOnGoalDefault			= true;

// * static methods
RoomCreationEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new RoomCreationEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

RoomCreationEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

RoomCreationEventWS.createBlankRoom = function(roomName_)
{
	let	newRoom = new RoomCreationEventWS();
	
	newRoom.roomName = roomName_;

	return (newRoom);
}


RoomCreationEventWS.addElementToObjectMap = function(element_, addPrefixToID = true)
{
}

// * max players : 4 (2v2)
RoomCreationEventWS.createRoomRectangle = function(roomName_, nbPlayers_ = 2, throwExceptions_ = true)
{
	if (!nbPlayers_ && nbPlayers_ != 0)
		return (wsUtils.throwAndReturn(false, new Error("nbPlayers_ isn't positive"), throwExceptions_));
	if (!(typeof nbPlayers_ === 'number' || nbPlayers_ instanceof Number))
		return (wsUtils.throwAndReturn(false, new TypeError("the given variable is not a number"), throwExceptions_));
	if (nbPlayers_ < 2)
		nbPlayers_ = 2;
	if (nbPlayers_ > 4)
		nbPlayers_ = 4;

	let roomCreationEvent = RoomCreationEventWS.createBlankRoom(roomName_);
	roomCreationEvent.setRoomName(roomName_);
	roomCreationEvent.setCountdownBeforeGameStarts(500);
	roomCreationEvent.setPointForClientWin(10);
		// roomCreationEvent.pointForClientWin			= 100;	// * MUST BE REMOVED
	roomCreationEvent.setResetBallPositionOnGoal(true);
	roomCreationEvent.setResetBallSpeedOnGoal(true);

	let paddle1			= new PaddleWS(roomName_ + " paddle 1");
	let paddle1RoomData	= new RoomObjectDataWS();
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 1", 0	+ 50, 0 + 100,		20 + 50,	0 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 2", 20	+ 50, 0 + 100,		20 + 50,	60 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 3", 20	+ 50, 60 + 100,		0 + 50,		60 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 4", 0	+ 50, 60 + 100,		0 + 50,		0 + 100));
	paddle1.setSpeed(700, true);
	paddle1.setAngle(270);
	roomCreationEvent.objectMap.set(paddle1, paddle1RoomData);

	let paddle2			= new PaddleWS(roomName_ + " paddle 2");
	let paddle2RoomData	= new RoomObjectDataWS();
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 1", 0	+ 1130, 0 + 460,	20 + 1130,	0 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 2", 20	+ 1130, 0 + 460,	20 + 1130,	60 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 3", 20	+ 1130, 60 + 460,	0 + 1130,	60 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 4", 0	+ 1130, 60 + 460,	0 + 1130,	0 + 460));
	paddle2.setSpeed(700, true);
	paddle2.setAngle(270);
	roomCreationEvent.objectMap.set(paddle2, paddle2RoomData);

	let paddle3			= new PaddleWS(roomName_ + " paddle 3");
	let paddle3RoomData	= new RoomObjectDataWS();
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 1", 0	+ 200, 0 + 460,		20 + 200,	0 + 460));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 2", 20	+ 200, 0 + 460,		20 + 200,	60 + 460));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 3", 20	+ 200, 60 + 460,	0 + 200,	60 + 460));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 4", 0	+ 200, 60 + 460,	0 + 200,	0 + 460));
	paddle3.setSpeed(700, true);
	paddle3.setAngle(270);
	if (nbPlayers_ >= 3)
		roomCreationEvent.objectMap.set(paddle3, paddle3RoomData);

	let paddle4			= new PaddleWS(roomName_ + " paddle 4");
	let paddle4RoomData	= new RoomObjectDataWS();
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 1", 0	+ 950, 	0 + 100,	20 + 950,	0 + 100));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 2", 20	+ 950, 	0 + 100,	20 + 950,	60 + 100));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 3", 20	+ 950, 	60 + 100,	0 + 950,	60 + 100));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 4", 0	+ 950, 	60 + 100,	0 + 950,	0 + 100));
	paddle4.setSpeed(700, true);
	paddle4.setAngle(270);
	if (nbPlayers_ >= 4)
		roomCreationEvent.objectMap.set(paddle4, paddle4RoomData);

	let boardRoomData	= new RoomObjectDataWS();
	let board			= new BoardWS(roomName_ + " board");
	board.addWall(new BoardWallWS(roomName_ + " wall 1", 0, 0, 1200, 0));
	board.addWall(new BoardWallWS(roomName_ + " wall 2", 1200, 0, 1200, 600));
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle2.id);
		if (nbPlayers_ >= 4) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle4.id);
	board.addWall(new BoardWallWS(roomName_ + " wall 3", 1200, 600, 0, 600));
	board.addWall(new BoardWallWS(roomName_ + " wall 4", 0, 600, 0, 0));
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle1.id);
		if (nbPlayers_ >= 3) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle3.id);
	roomCreationEvent.objectMap.set(board, boardRoomData);

	let ball			= new BallWS(roomName_ + " ball 1");
	let ballRoomData	= new RoomObjectDataWS();
	ballRoomData.collideWithMap.set(paddle1.id,	 paddle1);
	ballRoomData.collideWithMap.set(paddle2.id,	 paddle2);
	if (nbPlayers_ >= 3)	ballRoomData.collideWithMap.set(paddle3.id,	 paddle3);
	if (nbPlayers_ >= 4)	ballRoomData.collideWithMap.set(paddle4.id,	 paddle4);
	ballRoomData.collideWithMap.set(board.id,	board);
	ball.setPosition(600, 300, true);
	ball.setSpeed(BallWS.minSpeed, true);
	ball.setAngle(Math.floor(Math.random() * 2) ? 0 : 180, true);
	ball.setSize(50, true);
	ball.setAccelerationOnHit(1.1, true);
	roomCreationEvent.objectMap.set(ball, ballRoomData);

	// Collisions hangling
	paddle1RoomData.collideWithMap.set(board.id, 	board);
	paddle1RoomData.collideWithMap.set(ball.id, 	ball);

	paddle2RoomData.collideWithMap.set(board.id, 	board);
	paddle2RoomData.collideWithMap.set(ball.id, 	ball);

	paddle3RoomData.collideWithMap.set(board.id, 	board);
	paddle3RoomData.collideWithMap.set(ball.id, 	ball);

	paddle4RoomData.collideWithMap.set(board.id, 	board);
	paddle4RoomData.collideWithMap.set(ball.id, 	ball);

	return (roomCreationEvent);
}

// * max players : 4 (2v2)
RoomCreationEventWS.createRoomParallelogram = function(roomName_, nbPlayers_ = 2, throwExceptions_ = true)
{
	if (!nbPlayers_ && nbPlayers_ != 0)
		return (wsUtils.throwAndReturn(false, new Error("nbPlayers_ isn't positive"), throwExceptions_));
	if (!(typeof nbPlayers_ === 'number' || nbPlayers_ instanceof Number))
		return (wsUtils.throwAndReturn(false, new TypeError("the given variable is not a number"), throwExceptions_));
	if (nbPlayers_ < 2)
		nbPlayers_ = 2;
	if (nbPlayers_ > 4)
		nbPlayers_ = 4;

	let roomCreationEvent = RoomCreationEventWS.createBlankRoom(roomName_);
	roomCreationEvent.setRoomName(roomName_);
	roomCreationEvent.setCountdownBeforeGameStarts(500);
	roomCreationEvent.setPointForClientWin(10);
		// roomCreationEvent.pointForClientWin			= 100;	// * MUST BE REMOVED
	roomCreationEvent.setResetBallPositionOnGoal(true);
	roomCreationEvent.setResetBallSpeedOnGoal(true);

	let paddle1			= new PaddleWS(roomName_ + " paddle 1");
	let paddle1RoomData	= new RoomObjectDataWS();
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 1", 0	+ 300, 0 + 100,		20 + 300,	0 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 2", 20	+ 300, 0 + 100,		20 + 300,	60 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 3", 20	+ 300, 60 + 100,	0 + 300,	60 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 4", 0	+ 300, 60 + 100,	0 + 300,	0 + 100));
	paddle1.setSpeed(700, true);
	roomCreationEvent.objectMap.set(paddle1, paddle1RoomData);

	let paddle2			= new PaddleWS(roomName_ + " paddle 2");
	let paddle2RoomData	= new RoomObjectDataWS();
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 1", 0	+ 900, 0 + 460,		20 + 900,	0 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 2", 20	+ 900, 0 + 460,		20 + 900,	60 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 3", 20	+ 900, 60 + 460,	0 + 900,	60 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 4", 0	+ 900, 60 + 460,	0 + 900,	0 + 460));
	paddle2.setSpeed(700, true);
	roomCreationEvent.objectMap.set(paddle2, paddle2RoomData);

	let paddle3			= new PaddleWS(roomName_ + " paddle 3");
	let paddle3RoomData	= new RoomObjectDataWS();
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 1", 0	+ 350, 0 + 460,		20 + 350,	0 + 460));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 2", 20	+ 350, 0 + 460,		20 + 350,	60 + 460));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 3", 20	+ 350, 60 + 460,	0 + 350,	60 + 460));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 4", 0	+ 350, 60 + 460,	0 + 350,	0 + 460));
	paddle3.setSpeed(700, true);
	if (nbPlayers_ >= 3)
		roomCreationEvent.objectMap.set(paddle3, paddle3RoomData);

	let paddle4			= new PaddleWS(roomName_ + " paddle 4");
	let paddle4RoomData	= new RoomObjectDataWS();
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 1", 0	+ 850, 	0 + 100,	20 + 850,	0 + 100));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 2", 20	+ 850, 	0 + 100,	20 + 850,	60 + 100));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 3", 20	+ 850, 	60 + 100,	0 + 850,	60 + 100));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 4", 0	+ 850, 	60 + 100,	0 + 850,	0 + 100));
	paddle4.setSpeed(700, true);
	if (nbPlayers_ >= 4)
		roomCreationEvent.objectMap.set(paddle4, paddle4RoomData);

	let boardRoomData	= new RoomObjectDataWS();
	let board			= new BoardWS(roomName_ + " board");
	board.addWall(new BoardWallWS(roomName_ + " wall 1", 200,	0,		1200,	0));
	board.addWall(new BoardWallWS(roomName_ + " wall 2", 1200,	0,		1000,	600));
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle2.id);
		paddle1.setAngle((board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle() + 180) % 360);
		if (nbPlayers_ >= 4) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle4.id);
		if (nbPlayers_ >= 4) paddle4.setAngle((board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle() + 180) % 360);
	board.addWall(new BoardWallWS(roomName_ + " wall 3", 1000,	600,	0,		600));
	board.addWall(new BoardWallWS(roomName_ + " wall 4", 0,		600,	200,	0));
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle1.id);
		paddle2.setAngle(board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle());
		if (nbPlayers_ >= 3) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle3.id);
		if (nbPlayers_ >= 3) paddle3.setAngle(board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle());
	roomCreationEvent.objectMap.set(board, boardRoomData);

	let ball			= new BallWS(roomName_ + " ball 1");
	let ballRoomData	= new RoomObjectDataWS();
	ballRoomData.collideWithMap.set(paddle1.id,	 paddle1);
	ballRoomData.collideWithMap.set(paddle2.id,	 paddle2);
	if (nbPlayers_ >= 3)	ballRoomData.collideWithMap.set(paddle3.id,	 paddle3);
	if (nbPlayers_ >= 4)	ballRoomData.collideWithMap.set(paddle4.id,	 paddle4);
	ballRoomData.collideWithMap.set(board.id,	board);
	ball.setPosition(600, 300, true);
	ball.setSpeed(BallWS.minSpeed, true);
	ball.setAngle(Math.floor(Math.random() * 2) ? 0 : 180, true);
	ball.setSize(50, true);
	ball.setAccelerationOnHit(1.1, true);
	roomCreationEvent.objectMap.set(ball, ballRoomData);

	// Collisions hangling
	paddle1RoomData.collideWithMap.set(board.id, 	board);
	paddle1RoomData.collideWithMap.set(ball.id, 	ball);

	paddle2RoomData.collideWithMap.set(board.id, 	board);
	paddle2RoomData.collideWithMap.set(ball.id, 	ball);

	paddle3RoomData.collideWithMap.set(board.id, 	board);
	paddle3RoomData.collideWithMap.set(ball.id, 	ball);

	paddle4RoomData.collideWithMap.set(board.id, 	board);
	paddle4RoomData.collideWithMap.set(ball.id, 	ball);

	return (roomCreationEvent);
}

// * max players : 4 (1v1v1v1)
RoomCreationEventWS.createRoomSquare = function(roomName_, nbPlayers_ = 2, mapPositionXShift = 0, throwExceptions_ = true)
{
	if (!nbPlayers_ && nbPlayers_ != 0)
		return (wsUtils.throwAndReturn(false, new Error("nbPlayers_ isn't positive"), throwExceptions_));
	if (!(typeof nbPlayers_ === 'number' || nbPlayers_ instanceof Number))
		return (wsUtils.throwAndReturn(false, new TypeError("the given variable is not a number"), throwExceptions_));
	if (nbPlayers_ < 2)
		nbPlayers_ = 2;
	if (nbPlayers_ > 4)
		nbPlayers_ = 4;

	let roomCreationEvent = RoomCreationEventWS.createBlankRoom(roomName_);
	roomCreationEvent.setRoomName(roomName_);
	roomCreationEvent.setCountdownBeforeGameStarts(500);
	roomCreationEvent.setPointForClientWin(10);
		// roomCreationEvent.pointForClientWin			= 100;	// * MUST BE REMOVED
	roomCreationEvent.setResetBallPositionOnGoal(true);
	roomCreationEvent.setResetBallSpeedOnGoal(true);

	let paddle1			= new PaddleWS(roomName_ + " paddle 1");
	let paddle1RoomData	= new RoomObjectDataWS();
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 1", 0	+ 20 + mapPositionXShift, 0 + 100,		20 + 20 + mapPositionXShift,	0 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 2", 0	+ 20 + mapPositionXShift, 0 + 100,		20 + 20 + mapPositionXShift,	60 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 3", 20	+ 20 + mapPositionXShift, 60 + 100,		0 + 20 + mapPositionXShift,		60 + 100));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 4", 0	+ 20 + mapPositionXShift, 60 + 100,		0 + 20 + mapPositionXShift,		0 + 100));
	paddle1.setSpeed(700, true);
	roomCreationEvent.objectMap.set(paddle1, paddle1RoomData);

	let paddle2			= new PaddleWS(roomName_ + " paddle 2");
	let paddle2RoomData	= new RoomObjectDataWS();
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 1", 0	+ 560 + mapPositionXShift, 0 + 460,		20 + 560 + mapPositionXShift,	0 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 2", 20	+ 560 + mapPositionXShift, 0 + 460,		20 + 560 + mapPositionXShift,	60 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 3", 20	+ 560 + mapPositionXShift, 60 + 460,	0 + 560 + mapPositionXShift,	60 + 460));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 4", 0	+ 560 + mapPositionXShift, 60 + 460,	0 + 560 + mapPositionXShift,	0 + 460));
	paddle2.setSpeed(700, true);
	roomCreationEvent.objectMap.set(paddle2, paddle2RoomData);

	let paddle3			= new PaddleWS(roomName_ + " paddle 3");
	let paddle3RoomData	= new RoomObjectDataWS();
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 1", 0	+ 500 + mapPositionXShift, 0 + 20,		60 + 500 + mapPositionXShift,	0 + 20));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 2", 60	+ 500 + mapPositionXShift, 0 + 20,		60 + 500 + mapPositionXShift,	20 + 20));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 3", 60	+ 500 + mapPositionXShift, 20 + 20,		0 + 500 + mapPositionXShift,	20 + 20));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 4", 0	+ 500 + mapPositionXShift, 20 + 20,		0 + 500 + mapPositionXShift,	0 + 20));
	paddle3.setSpeed(700, true);
	if (nbPlayers_ >= 3)
		roomCreationEvent.objectMap.set(paddle3, paddle3RoomData);

	let paddle4			= new PaddleWS(roomName_ + " paddle 4");
	let paddle4RoomData	= new RoomObjectDataWS();
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 1", 0	+ 20 + mapPositionXShift, 	0 + 560,	60 + 20 + mapPositionXShift,	0 + 560));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 2", 60	+ 20 + mapPositionXShift, 	0 + 560,	60 + 20 + mapPositionXShift,	20 + 560));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 3", 60	+ 20 + mapPositionXShift, 	20 + 560,	0 + 20 + mapPositionXShift,		20 + 560));
	paddle4.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 4 : 4", 0	+ 20 + mapPositionXShift, 	20 + 560,	0 + 20 + mapPositionXShift,		0 + 560));
	paddle4.setSpeed(700, true);
	if (nbPlayers_ >= 4)
		roomCreationEvent.objectMap.set(paddle4, paddle4RoomData);

	let boardRoomData	= new RoomObjectDataWS();
	let board			= new BoardWS(roomName_ + " board");
	board.addWall(new BoardWallWS(roomName_ + " wall 1", 0 + mapPositionXShift,		0,		600 + mapPositionXShift,	0));
		if (nbPlayers_ >= 3) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle3.id);
		if (nbPlayers_ >= 3) paddle3.setAngle(board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle());
	board.addWall(new BoardWallWS(roomName_ + " wall 2", 600 + mapPositionXShift,	0,		600 + mapPositionXShift,	600));
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle2.id);
		paddle1.setAngle((board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle() + 180) % 360);
	board.addWall(new BoardWallWS(roomName_ + " wall 3", 600 + mapPositionXShift,	600,	0 + mapPositionXShift,		600));
		if (nbPlayers_ >= 4) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle4.id);
		if (nbPlayers_ >= 4) paddle4.setAngle((board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle() + 180) % 360);
	board.addWall(new BoardWallWS(roomName_ + " wall 4", 0 + mapPositionXShift,		600,	0 + mapPositionXShift,		0));
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle1.id);
		paddle2.setAngle(board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle());
	roomCreationEvent.objectMap.set(board, boardRoomData);

	let ball			= new BallWS(roomName_ + " ball 1");
	let ballRoomData	= new RoomObjectDataWS();
	ballRoomData.collideWithMap.set(paddle1.id,	 paddle1);
	ballRoomData.collideWithMap.set(paddle2.id,	 paddle2);
	if (nbPlayers_ >= 3)	ballRoomData.collideWithMap.set(paddle3.id,	 paddle3);
	if (nbPlayers_ >= 4)	ballRoomData.collideWithMap.set(paddle4.id,	 paddle4);
	ballRoomData.collideWithMap.set(board.id,	board);
	ball.setPosition(300 + mapPositionXShift, 300, true);
	ball.setSpeed(BallWS.minSpeed, true);
	ball.setAngle(90, true);
	ball.setSize(50, true);
	ball.setAccelerationOnHit(1.1, true);
	roomCreationEvent.objectMap.set(ball, ballRoomData);

	// Collisions hangling
	paddle1RoomData.collideWithMap.set(paddle2.id,	paddle2);
	if (nbPlayers_ >= 3)	paddle1RoomData.collideWithMap.set(paddle3.id,	paddle3);
	if (nbPlayers_ >= 4)	paddle1RoomData.collideWithMap.set(paddle4.id,	paddle4);
	paddle1RoomData.collideWithMap.set(board.id, 	board);
	paddle1RoomData.collideWithMap.set(ball.id, 	ball);

	paddle2RoomData.collideWithMap.set(paddle1.id,	paddle1);
	if (nbPlayers_ >= 3)	paddle2RoomData.collideWithMap.set(paddle3.id,	paddle3);
	if (nbPlayers_ >= 4)	paddle2RoomData.collideWithMap.set(paddle4.id,	paddle4);
	paddle2RoomData.collideWithMap.set(board.id, 	board);
	paddle2RoomData.collideWithMap.set(ball.id, 	ball);

	paddle3RoomData.collideWithMap.set(paddle1.id,	paddle1);
	paddle3RoomData.collideWithMap.set(paddle2.id,	paddle2);
	if (nbPlayers_ >= 4)	paddle3RoomData.collideWithMap.set(paddle4.id,	paddle4);
	paddle3RoomData.collideWithMap.set(board.id, 	board);
	paddle3RoomData.collideWithMap.set(ball.id, 	ball);

	paddle4RoomData.collideWithMap.set(paddle1.id,	paddle1);
	paddle4RoomData.collideWithMap.set(paddle2.id,	paddle2);
	paddle4RoomData.collideWithMap.set(paddle3.id,	paddle3);
	paddle4RoomData.collideWithMap.set(board.id, 	board);
	paddle4RoomData.collideWithMap.set(ball.id, 	ball);

	return (roomCreationEvent);
}

// * max players : 3 (1v1v1)
RoomCreationEventWS.createRoomTriangle = function(roomName_, nbPlayers_ = 3, mapPositionXShift = 0, throwExceptions_ = true)
{
	if (!nbPlayers_ && nbPlayers_ != 0)
		return (wsUtils.throwAndReturn(false, new Error("nbPlayers_ isn't positive"), throwExceptions_));
	if (!(typeof nbPlayers_ === 'number' || nbPlayers_ instanceof Number))
		return (wsUtils.throwAndReturn(false, new TypeError("the given variable is not a number"), throwExceptions_));
	if (nbPlayers_ < 2)
		nbPlayers_ = 2;
	if (nbPlayers_ > 3)
		nbPlayers_ = 3;

	let roomCreationEvent = RoomCreationEventWS.createBlankRoom(roomName_);
	roomCreationEvent.setRoomName(roomName_);
	roomCreationEvent.setCountdownBeforeGameStarts(500);
	roomCreationEvent.setPointForClientWin(10);
		// roomCreationEvent.pointForClientWin			= 100;	// * MUST BE REMOVED
	roomCreationEvent.setResetBallPositionOnGoal(true);
	roomCreationEvent.setResetBallSpeedOnGoal(true);

	let paddle1			= new PaddleWS(roomName_ + " paddle 1");
	let paddle1RoomData	= new RoomObjectDataWS();
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 1", 0	+ 180 + mapPositionXShift, 0 + 300,		20 + 180 + mapPositionXShift,	0 + 300));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 2", 0	+ 180 + mapPositionXShift, 0 + 300,		20 + 180 + mapPositionXShift,	60 + 300));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 3", 20	+ 180 + mapPositionXShift, 60 + 300,	0 + 180 + mapPositionXShift,	60 + 300));
	paddle1.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 1 : 4", 0	+ 180 + mapPositionXShift, 60 + 300,	0 + 180 + mapPositionXShift,	0 + 300));
	paddle1.setSpeed(700, true);
	roomCreationEvent.objectMap.set(paddle1, paddle1RoomData);

	let paddle2			= new PaddleWS(roomName_ + " paddle 2");
	let paddle2RoomData	= new RoomObjectDataWS();
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 1", 0	+ 400 + mapPositionXShift, 0 + 300,		20 + 400 + mapPositionXShift,	0 + 300));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 2", 20	+ 400 + mapPositionXShift, 0 + 300,		20 + 400 + mapPositionXShift,	60 + 300));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 3", 20	+ 400 + mapPositionXShift, 60 + 300,	0 + 400 + mapPositionXShift,	60 + 300));
	paddle2.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 2 : 4", 0	+ 400 + mapPositionXShift, 60 + 300,	0 + 400 + mapPositionXShift,	0 + 300));
	paddle2.setSpeed(700, true);
	roomCreationEvent.objectMap.set(paddle2, paddle2RoomData);

	let paddle3			= new PaddleWS(roomName_ + " paddle 3");
	let paddle3RoomData	= new RoomObjectDataWS();
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 1", 0	+ 270 + mapPositionXShift, 0 + 560,		60 + 270 + mapPositionXShift,	0 + 560));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 2", 60	+ 270 + mapPositionXShift, 0 + 560,		60 + 270 + mapPositionXShift,	20 + 560));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 3", 60	+ 270 + mapPositionXShift, 20 + 560,	0 + 270 + mapPositionXShift,	20 + 560));
	paddle3.addHitLine(new PaddleHitLineWS(roomName_ + " paddle 3 : 4", 0	+ 270 + mapPositionXShift, 20 + 560,	0 + 270 + mapPositionXShift,	0 + 560));
	paddle3.setSpeed(700, true);
	if (nbPlayers_ >= 3)
		roomCreationEvent.objectMap.set(paddle3, paddle3RoomData);

	let boardRoomData	= new RoomObjectDataWS();
	let board			= new BoardWS(roomName_ + " board");
	board.addWall(new BoardWallWS(roomName_ + " wall 1", 0 + mapPositionXShift,		600,	300 + mapPositionXShift,	0));
		paddle1.setAngle(board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle());
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle1.id);
	board.addWall(new BoardWallWS(roomName_ + " wall 2", 300 + mapPositionXShift,	0,		600 + mapPositionXShift,	600));
		paddle2.setAngle((board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle() + 180) % 360);
		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle2.id);
	board.addWall(new BoardWallWS(roomName_ + " wall 3", 600 + mapPositionXShift,	600,	0 + mapPositionXShift,		600));
		if (nbPlayers_ >= 3) paddle3.setAngle((board.wallArr[board.wallArr.length - 1].hitLine.getLineAngle() + 180) % 360);
		if (nbPlayers_ >= 3) roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle3.id);
	roomCreationEvent.objectMap.set(board, boardRoomData);

	let ball			= new BallWS(roomName_ + " ball 1");
	let ballRoomData	= new RoomObjectDataWS();
	ballRoomData.collideWithMap.set(paddle1.id,	 paddle1);
	ballRoomData.collideWithMap.set(paddle2.id,	 paddle2);
	if (nbPlayers_ >= 3)	ballRoomData.collideWithMap.set(paddle3.id,	 paddle3);
	ballRoomData.collideWithMap.set(board.id,	board);
	ball.setPosition(300 + mapPositionXShift, 400, true);
	ball.setSpeed(BallWS.minSpeed, true);
	ball.setAngle(90, true);
	ball.setSize(50, true);
	ball.setAccelerationOnHit(1.1, true);
	roomCreationEvent.objectMap.set(ball, ballRoomData);

	// Collisions hangling
	paddle1RoomData.collideWithMap.set(paddle2.id,	paddle2);
	if (nbPlayers_ >= 3)	paddle1RoomData.collideWithMap.set(paddle3.id,	paddle3);
	paddle1RoomData.collideWithMap.set(board.id, 	board);
	paddle1RoomData.collideWithMap.set(ball.id, 	ball);

	paddle2RoomData.collideWithMap.set(paddle1.id,	paddle1);
	if (nbPlayers_ >= 3)	paddle2RoomData.collideWithMap.set(paddle3.id,	paddle3);
	paddle2RoomData.collideWithMap.set(board.id, 	board);
	paddle2RoomData.collideWithMap.set(ball.id, 	ball);

	paddle3RoomData.collideWithMap.set(paddle1.id,	paddle1);
	paddle3RoomData.collideWithMap.set(paddle2.id,	paddle2);
	paddle3RoomData.collideWithMap.set(board.id, 	board);
	paddle3RoomData.collideWithMap.set(ball.id, 	ball);

	return (roomCreationEvent);
}

/* map indev
// let roomCreationEvent	= RoomCreationEventWS.createBlankRoom(roomUniqueId);
// let ball;  // Déclaration de ball au niveau global du fichier
// {
// 	roomCreationEvent.setRoomName(roomName);
// 	roomCreationEvent.setCountdownBeforeGameStarts(500);
// 	roomCreationEvent.setPointForClientWin(10);
// 		// roomCreationEvent.pointForClientWin			= 100;	// * MUST BE REMOVED
// 	roomCreationEvent.setResetBallPositionOnGoal(true);
// 	roomCreationEvent.setResetBallSpeedOnGoal(true);

// 	let paddle1 = new PaddleWS(roomUniqueId + " paddle 1");
// 	let paddle1RoomData	= new RoomObjectDataWS();
// 	// paddle1.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 1 : 1a", 0 + 50, 1, 20 + 50, 30));
// 	// paddle1.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 1 : 2a", 20 + 50, 30, 0 + 50, 60));
// 	paddle1.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 1 : 1", 0 + 50, 1, 20 + 50, 1));
// 	paddle1.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 1 : 2", 20 + 50, 1, 20 + 50, 60));
// 	paddle1.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 1 : 3", 20 + 50, 60, 0 + 50, 60));
// 	paddle1.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 1 : 4", 0 + 50, 60, 0 + 50, 1));
// 	paddle1.setSpeed(700, true);
// 	paddle1.setAngle(270);
// 	roomCreationEvent.objectMap.set(paddle1, paddle1RoomData);

// 	let paddle2 = new PaddleWS(roomUniqueId + " paddle 2");
// 	let paddle2RoomData = new RoomObjectDataWS();
// 	paddle2.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 2 : 1", 0 + 800 - 50, 0 + 150, 20 + 800 - 50, 0 + 150));
// 	paddle2.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 2 : 2", 20 + 800 - 50, 0 + 150, 20 + 800 - 50, 60 + 150));
// 	paddle2.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 2 : 3", 20 + 800 - 50, 60 + 150, 0 + 800 - 50, 60 + 150));
// 	paddle2.addHitLine(new PaddleHitLineWS(roomUniqueId + " paddle 2 : 4", 0 + 800 - 50, 60 + 150, 0 + 800 - 50, 0 + 150));
// 	paddle2.setSpeed(700, true);
// 	paddle1.setAngle(270);
// 	roomCreationEvent.objectMap.set(paddle2, paddle2RoomData);

// 	let boardRoomData = new RoomObjectDataWS();
// 	let board = new BoardWS(roomUniqueId + " board");
// 	board.addWall(new BoardWallWS(roomUniqueId + " wall 1", 0, 0, 1200, 0));
// 	board.addWall(new BoardWallWS(roomUniqueId + " wall 2", 1200, 0, 1200, 600));
// 		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle2.id);
// 	board.addWall(new BoardWallWS(roomUniqueId + " wall 3", 1200, 600, 0, 600));
// 	board.addWall(new BoardWallWS(roomUniqueId + " wall 4", 0, 600, 0, 0));
// 		roomCreationEvent.goalMap.set(board.wallArr[board.wallArr.length - 1].hitLine.id, paddle1.id);
// 	// board.addWall(new BoardWallWS(roomUniqueId + " wall 5", 0, 400, 100 + 120, 300 + 120));
// 	roomCreationEvent.objectMap.set(board, boardRoomData);

// 	ball = new BallWS(roomUniqueId + " ball 1");
// 	let ballRoomData	= new RoomObjectDataWS();
// 	ballRoomData.collideWithMap.set(paddle1.id,	 paddle1);
// 	ballRoomData.collideWithMap.set(paddle2.id,	 paddle2);
// 	ballRoomData.collideWithMap.set(board.id,	board);
// 	ball.setPosition(215 + 150, 420, true);
// 	ball.setSpeed(BallWS.minSpeed, true);
// 	// ball.setSpeed(250, true);
// 	ball.setAngle(90, true);
// 	ball.setSize(50, true);
// 	ball.setAccelerationOnHit(1.1, true);
// 	roomCreationEvent.objectMap.set(ball, ballRoomData);

// 	// Collisions hangling
// 	paddle1RoomData.collideWithMap.set(paddle2.id,	paddle2);
// 	paddle1RoomData.collideWithMap.set(board.id, 	board);
// 	paddle1RoomData.collideWithMap.set(ball.id, 	ball);

// 	paddle2RoomData.collideWithMap.set(paddle1.id,	paddle1);
// 	paddle2RoomData.collideWithMap.set(board.id, 	board);
// 	paddle2RoomData.collideWithMap.set(ball.id, 	ball);

// 	// let ball2			= new BallWS(roomUniqueId + " ball 2");
// 	// let ball2RoomData	= new RoomObjectDataWS();
// 	// ball2RoomData.collideWithMap.set(paddle1.id,	paddle1);
// 	// ball2RoomData.collideWithMap.set(paddle2.id,	paddle2);
// 	// ball2RoomData.collideWithMap.set(board.id,	board);
// 	// ball2.setPosition(400, 100);
// 	// ball2.setAngle(180 + 45);
// 	// ball2.setSpeed(200);
// 	// roomCreationEvent.objectMap.set(ball2, ball2RoomData);
// }
*/

export default RoomCreationEventWS;
