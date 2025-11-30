// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AcanavatAI.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/04 18:13:15 by isibio            #+#    #+#             //
//   Updated: 2025/06/04 18:13:16 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { WebSocketServer }	from 'ws';

import WsClientGameBackend	from '/lib/transcendence/wsClientJS/WsClientGameBackend.js';

import logger				from '/lib/transcendence/loggerJS/logger.js';
import * as c				from '/lib/transcendence/colorsJS/colors.js';

import JoinRoomEventWS		from '/lib/transcendence/wsCommunicationsJS/event/JoinRoomEventWS.js'
import RoomCreationEventWS	from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js'
import LaunchGameEventWS	from '/lib/transcendence/wsCommunicationsJS/event/LaunchGameEventWS.js';
import KeyEventWS			from '/lib/transcendence/wsCommunicationsJS/event/KeyEventWS.js';
import GameSummaryWS		from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js';
import LeaveRoomEventWS		from '/lib/transcendence/wsCommunicationsJS/event/LeaveRoomEventWS.js';

import UserDetailsWS		from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

import RoomObjectDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/RoomObjectDataWS.js';

import BallWS				from '/lib/transcendence/wsCommunicationsJS/ball/BallWS.js';
import PaddleWS				from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleWS.js';
import PaddleHitLineWS			from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleHitLineWS.js';
import BoardWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWS.js';
import BoardWallWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWallWS.js';
import HitLineWS			from '/lib/transcendence/wsCommunicationsJS/collision/HitLineWS.js';
import PointWS				from '/lib/transcendence/wsCommunicationsJS/PointWS.js';

import ClientControllingPaddlesWS	from '/lib/transcendence/wsCommunicationsJS/gameRoom/ClientControllingPaddlesWS.js';

// /lib/transcendence/

// function pastouche(backend)
// {
// 	let roomname			= "bebou's fluffy cloudy universe";
// 	let roomCreationEvent	= RoomCreationEventWS.createBlankRoom(roomname);
// 	{
// 		let boardRoomData = new RoomObjectDataWS();
// 		let board = new BoardWS(roomname + " board");
// 		board.addWall(new BoardWallWS(roomname + " wall 1", 0, 0, 800, 0));
// 		board.addWall(new BoardWallWS(roomname + " wall 2", 800, 0, 800, 600));
// 		board.addWall(new BoardWallWS(roomname + " wall 3", 800, 600, 0, 600));
// 		board.addWall(new BoardWallWS(roomname + " wall 4", 0, 0, 0, 600));
// 		roomCreationEvent.objectMap.set(board, boardRoomData);

// 		let paddle1 = new PaddleWS(roomname + " paddle 1");
// 		let paddle1RoomData	= new RoomObjectDataWS();
// 		paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 1", 0 + 50, 111, 20 + 50, 111));
// 		paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 2", 20 + 50, 111, 20 + 50, 60));
// 		paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 3", 20 + 50, 60, 0 + 50, 60));
// 		paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 4", 0 + 50, 60, 0 + 50, 111));
// 		paddle1.setSpeed(550);
// 		paddle1.setAngle(270);

// 		let paddle2 = new PaddleWS(roomname + " paddle 2");
// 		paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 1", 0 + 500, 0, 20 + 500, 0));
// 		paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 2", 20 + 500, 0, 20 + 500, 60));
// 		paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 3", 20 + 500, 60, 0 + 500, 60));
// 		paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 4", 0 + 500, 60, 0 + 500, 0));
// 		paddle2.setSpeed(550);
// 		paddle2.setAngle(270);

		
// 		// let paddle1 = new PaddleWS(roomname + " paddle 1");
// 		// let paddle1RoomData	= new RoomObjectDataWS();
// 		// paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 1", 0 + 50,	0 + 10,		60 + 50,	0 + 10));
// 		// paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 2", 60 + 50,	0 + 10,		60 + 50,	20 + 10));
// 		// paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 3", 60 + 50,	20 + 10,	0 + 50,		0 + 10));
// 		// paddle1.addHitLine(new PaddleHitLineWS(roomname + " paddle 1 : 4", 0 + 50,	20 + 10,	0 + 50,		0 + 10));
// 		// paddle1.setSpeed(550);
// 		// paddle1.setAngle(270 + 90);

// 		// let paddle2 = new PaddleWS(roomname + " paddle 2");
// 		// paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 1", 0 + 50,	0 + 540,	60 + 50,	0 + 540));
// 		// paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 2", 60 + 50,	0 + 540,	60 + 50,	20 + 540));
// 		// paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 3", 60 + 50,	20 + 540,	0 + 50,		0 + 540));
// 		// paddle2.addHitLine(new PaddleHitLineWS(roomname + " paddle 2 : 4", 0 + 50,	20 + 540,	0 + 50,		0 + 540));
// 		// paddle2.setSpeed(550);
// 		// paddle2.setAngle(270 - 90);
		

// 		// * ajouter les paddle a la room
// 		// * l'ia va prendre le paddle de la liste a l'id 'paddleAiId'
// 		paddle1.id	= paddleAiId;
// 		roomCreationEvent.objectMap.set(paddle1, paddle1RoomData);
// 		roomCreationEvent.objectMap.set(paddle2, new RoomObjectDataWS());


// 		let ball			= new BallWS(roomname + " ball 1");
// 		let ballRoomData	= new RoomObjectDataWS();
// 		ballRoomData.collideWithMap.set(paddle1.id,	paddle1);
// 		ballRoomData.collideWithMap.set(paddle2.id,	paddle2);
// 		ballRoomData.collideWithMap.set(board.id,	board);
// 		ball.setPosition(400, 100);
// 		ball.setAngle(340);
// 		ball.setSpeed(120);
// 		// ball.point.setSize(1);
// 		 ball.accelerationOnHit = 1.1;
// 		roomCreationEvent.objectMap.set(ball, ballRoomData);

// 		paddle1RoomData.collideWithMap.set(paddle2.id,	paddle2);
// 		paddle1RoomData.collideWithMap.set(board.id, 	board);
// 		paddle1RoomData.collideWithMap.set(ball.id, 	ball);
// 	}

// 	backend.sendMessageToGameBackendWs(roomCreationEvent.createJSON());
// 	backend.sendMessageToGameBackendWs((new LaunchGameEventWS()).createJSON());
// }

export function AcanavatAI(roomToJoin_ = null)
{
	let laPlusGrosse = 0;
	let axis;
	let goodColissionPoint;
	let laNouvelleBalle;
	let connectBackEnd;

	let paddleId	= "paddle ID";
	let ball = null;

	if (!roomToJoin_)
		return ;

	this.start = async function()
	{
		let isInRoom = await this.connectToBackend(); // démarre l'IA
		if (!isInRoom)
			return ;
		this.aiLoop(); // démarre l'IA
	}

	this.connectToBackend = async function()
	{
		let webSocketAddress = 'wss://game_backend:' + process.env.PORT_GAME_BACKEND;
		connectBackEnd = new WsClientGameBackend(webSocketAddress);
		connectBackEnd.connectToBackend();

		while (connectBackEnd.isConnectedToGameBackendWs !== true)
		    await new Promise(r => setTimeout(r, 500));

		let userDetails	= new UserDetailsWS();
		userDetails.userId	= UserDetailsWS.AiId;
		connectBackEnd.sendMessageToGameBackendWs(userDetails.createJSON());

		let joinRomeCamionTest = new JoinRoomEventWS(roomToJoin_);
		connectBackEnd.sendMessageToGameBackendWs(joinRomeCamionTest.createJSON());
	
		let	timeout		= 10000;
		let	waitingTime	= 0;
		while (1)
		{
			paddleId = null;
			for (let [object, objectData] of connectBackEnd.renderMap)
			{
				if (ClientControllingPaddlesWS.isGoodTypeJSON(objectData.type))
				{
					paddleId = objectData.paddleIdArr[0];
					break ;
				}
			}
			if (paddleId)
				break ;


		    await new Promise(r => setTimeout(r, 500));
			waitingTime += 500;
			if (waitingTime >= timeout)
				return (0);
		}
		return (1);
	}

	this.longestLine = function () {
		let longuestX = 0;
		let longuestY = 0;
		let longest = function(nbr1, nbr2, longuest) {
			let tmp = Math.abs(nbr1 - nbr2);
			return tmp > longuest ? tmp : longuest;
		};
		for (let [id, object] of connectBackEnd.renderMap) {
			if (BoardWS.isGoodTypeJSON(object.type)) {
				for (let wall of object.wallArr) {
					longuestX = longest(wall.hitLine.startPoint.posX, wall.hitLine.endPoint.posX, longuestX);
					longuestY = longest(wall.hitLine.startPoint.posY, wall.hitLine.endPoint.posY, longuestY);
				}
			}
		}
		return (longuestX > longuestY) ? longuestX : longuestY;
	};

	this.paddleToMove = function () {
		for (let [id, object] of connectBackEnd.renderMap) {
			if (PaddleWS.isGoodTypeJSON(object.type) && id == paddleAiId)
				return id;
		}
	};

	this.positive = function (number) {
		return Math.abs(number);
	};

	this.detectAxisForAI = function (paddle) {
		return axis;
	};

	this.myMiddle = function (paddle) {
		if (this.detectAxisForAI(paddle) == "AxisY") {
			return (this.positive(paddle.hitLineArr[1].hitLine.startPoint.posY + paddle.hitLineArr[1].hitLine.endPoint.posY)) / 2;
		} else {
			return (this.positive(paddle.hitLineArr[0].hitLine.startPoint.posX + paddle.hitLineArr[0].hitLine.endPoint.posX)) / 2;
		}
	};

	this.axisCompare = function (paddle, pointDeCollision) {
		return (this.detectAxisForAI(paddle) == "AxisY") ? pointDeCollision.posY : pointDeCollision.posX;
	};

	this.diffValue = function (paddle) {
		if (this.detectAxisForAI(paddle) == "AxisY") {
			return this.positive(paddle.hitLineArr[1].hitLine.startPoint.posY - paddle.hitLineArr[1].hitLine.endPoint.posY);
		} else {
			return this.positive(paddle.hitLineArr[0].hitLine.startPoint.posX - paddle.hitLineArr[0].hitLine.endPoint.posX);
		}
	};

	this.impactWallPoint = function (paddle, allwall) {
		let tabPoint = [];
		let hitLine = paddle.hitLineArr[0].hitLine;
		let startPoint = hitLine.startPoint;
		let paddleAngle = paddle.angle;

		let tryAddHittingPoints = (offsets) => {
			for (let offset of offsets) {
				let projectedPoint = PointWS.getNextStep(startPoint, offset, paddleAngle);
				for (let wall of allwall.wallArr) {
					let hittingPoint = wall.hitLine.isHitting(startPoint, projectedPoint);
					if (hittingPoint) {
						tabPoint.push(hittingPoint);
						break;
					}
				}
			}
		};

		tryAddHittingPoints([laPlusGrosse, -laPlusGrosse]);
		return tabPoint;
	};

	this.aiLoop = async function ()
	{
		while (true)
		{
			for (let [object, objectData] of connectBackEnd.renderMap)
			{
				if (GameSummaryWS.isGoodTypeJSON(objectData.type))
				{
					connectBackEnd.sendMessageToGameBackendWs((new LeaveRoomEventWS("")).createJSON());
					connectBackEnd.disconenctFromBackend();
					return(0);
				}
			}

			this.aiCalculs();
			await new Promise(r => setTimeout(r, 1000));
		}
	};

	this.aiCalculs = async function ()
	{
		if (laPlusGrosse === 0)
			laPlusGrosse = this.longestLine() * 2;

		let wallTest, firstX, firstY;
		for (let [id, object] of connectBackEnd.renderMap) {
			if (BoardWS.isGoodTypeJSON(object.type))
				wallTest = object;
			if (BallWS.isGoodTypeJSON(object.type)) {
				ball = object;
				firstX = object.point.posX;
				firstY = object.point.posY;
			}
		}

		let paddle		= connectBackEnd.renderMap.get(paddleId);

		let secondX = PointWS.getNextStep(ball.point, laPlusGrosse, ball.point.angle).posX;
		let secondY = PointWS.getNextStep(ball.point, laPlusGrosse, ball.point.angle).posY;

		let allwall = wallTest;
		let protectedWallImpacts = this.impactWallPoint(paddle, allwall);

		axis = this.positive(Math.round(protectedWallImpacts[1].posX) - Math.round(protectedWallImpacts[0].posX)) === 0 ? "AxisY" : "AxisX";

		let wall = new BoardWallWS("ai paddle wall", protectedWallImpacts[0].posX, protectedWallImpacts[0].posY, protectedWallImpacts[1].posX, protectedWallImpacts[1].posY);
		let indexExistingWall = allwall.wallArr.findIndex(w => w.id === "ai paddle wall");

		if (indexExistingWall !== -1) allwall.wallArr[indexExistingWall] = wall;
		else allwall.wallArr.push(wall);

		let pointDeCollision = wall.hitLine._acanavatTest(firstX, firstY, secondX, secondY);

		let hitPoint = null;
		{
			laNouvelleBalle = BallWS.createFromJSON(ball.createJSON());
			let wallToSkip = -1;
			let lastWall = -1;

			while (1)
			{
				let projectedPoint = PointWS.getNextStep(laNouvelleBalle.point, 10000, laNouvelleBalle.point.angle);
				let best = { dist: Infinity, point: null, hitLine: null, index: -1 };

				for (let i = allwall.wallArr.length - 1; i >= 0; i--) {
					if (i === wallToSkip) continue;
					let bouncePoint = allwall.wallArr[i].hitLine.isHitting(laNouvelleBalle.point, projectedPoint);
					if (!bouncePoint) continue;

					let distance = PointWS.distance(bouncePoint, laNouvelleBalle.point);
					if (distance < best.dist)
						best = { dist: distance, point: bouncePoint, hitLine: allwall.wallArr[i].hitLine, index: i };
				}

				if (best.index < 0) break;
				if (best.index === allwall.wallArr.length - 1) {
					hitPoint = best.point;
					break;
				}

				best.point.angle = laNouvelleBalle.point.angle;
				laNouvelleBalle.point.initFromJSON(best.point.createJSON());
				laNouvelleBalle.point.angle = laNouvelleBalle.getNextAngle(best.hitLine, best.point);

				let radius = laNouvelleBalle.point.size / 2;
				laNouvelleBalle.point = PointWS.getNextStep(laNouvelleBalle.point, PointWS.distance(laNouvelleBalle.point, best.point) - radius, best.point.angle);

				wallToSkip = (best.index === lastWall) ? -1 : best.index;
				lastWall = best.index;
			}

			pointDeCollision = new PointWS();
			pointDeCollision.posX = hitPoint ? hitPoint.posX : laNouvelleBalle.point.posX;
			pointDeCollision.posY = hitPoint ? hitPoint.posY : laNouvelleBalle.point.posY;
			goodColissionPoint = this.axisCompare(paddle, pointDeCollision);
		}

		let keyEvent = new KeyEventWS();
		let middle = this.myMiddle(paddle);

		if (middle < goodColissionPoint) {
			keyEvent.eventType = KeyEventWS.keyDown;
			keyEvent.key.name = "ArrowDown";
			connectBackEnd.sendMessageToGameBackendWs(keyEvent.createJSON());
			let diff = this.diffValue(paddle) / 2;

			while (middle + diff < goodColissionPoint && this.positive(middle - diff) < goodColissionPoint) {
				paddle = connectBackEnd.renderMap.get(paddleId);
				middle = this.myMiddle(paddle);
				await new Promise(r => setTimeout(r, 5));
			}
			keyEvent.eventType = KeyEventWS.keyUp;
			connectBackEnd.sendMessageToGameBackendWs(keyEvent.createJSON());
		} else {
			keyEvent.eventType = KeyEventWS.keyDown;
			keyEvent.key.name = "ArrowUp";
			connectBackEnd.sendMessageToGameBackendWs(keyEvent.createJSON());
			let diff = this.diffValue(paddle) / 2;

			while (middle + diff > goodColissionPoint && this.positive(middle - diff) > goodColissionPoint) {
				paddle = connectBackEnd.renderMap.get(paddleId);
				middle = this.myMiddle(paddle);
				await new Promise(r => setTimeout(r, 5));
			}
			keyEvent.eventType = KeyEventWS.keyUp;
			connectBackEnd.sendMessageToGameBackendWs(keyEvent.createJSON());
		}
	};

	return this;
}
export default AcanavatAI;
