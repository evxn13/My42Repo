/* **************************************************************************** */
/*                                                                              */
/*                                                         :::      ::::::::    */
/*    GameTestPage.tsx                                   :+:      :+:    :+:    */
/*                                                     +:+ +:+         +:+      */
/*    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         */
/*                                                 +#+#+#+#+#+   +#+            */
/*    Created: 2025/03/07 15:32:18 by isibio            #+#    #+#              */
/*    Updated: 2025/03/07 15:32:19 by isibio           ###   ########.fr        */
/*                                                                              */
/* **************************************************************************** */

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';

import KeyEventWS				from '/lib/transcendence/wsCommunicationsJS/event/KeyEventWS.js';
import LaunchGameEventWS		from '/lib/transcendence/wsCommunicationsJS/event/LaunchGameEventWS.js';
import RoomCreationEventWS		from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js';
import JoinRoomEventWS			from '/lib/transcendence/wsCommunicationsJS/event/JoinRoomEventWS.js';
import LeaveRoomEventWS			from '/lib/transcendence/wsCommunicationsJS/event/LeaveRoomEventWS.js';
import GameCountdownWS			from '/lib/transcendence/wsCommunicationsJS/event/GameCountdownWS.js';
import BallHitObjectWS			from '/lib/transcendence/wsCommunicationsJS/event/BallHitObjectWS.js';
import GameSummaryWS			from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js';
import ClearRenderMapEventWS	from '/lib/transcendence/wsCommunicationsJS/event/ClearRenderMapEventWS.js';

import TournamentSummaryWS		from '/lib/transcendence/wsCommunicationsJS/tournament/TournamentSummaryWS.js';
import RoundDetailsWS			from '/lib/transcendence/wsCommunicationsJS/tournament/RoundDetailsWS.js';

import ClientRoomDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/ClientRoomDataWS.js';
import RoomObjectDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/RoomObjectDataWS.js';

import BallWS				from '/lib/transcendence/wsCommunicationsJS/ball/BallWS.js';
import PaddleWS				from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleWS.js';
import PaddleHitLineWS			from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleHitLineWS.js';
import BoardWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWS.js';
import BoardWallWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWallWS.js';
import HitLineWS			from '/lib/transcendence/wsCommunicationsJS/collision/HitLineWS.js';
import PointWS				from '/lib/transcendence/wsCommunicationsJS/PointWS.js';

import { BackendWsContext }	from '../context/BackendWsContext.tsx';

import { Ball }					from '../components/Ball.tsx';
import { Paddle }				from '../components/Paddle.tsx';
import { PaddleHitLine }		from '../components/PaddleHitLine.tsx';
import { Board }				from '../components/Board.tsx';
import { BoardWall }			from '../components/BoardWall.tsx';
import { HitLine }				from '../components/HitLine.tsx';
import { Point }				from '../components/Point.tsx';
import { GameCountdown }		from '../components/GameCountdown.tsx';
import { BallHitObject }		from '../components/BallHitObject.tsx';
import { GameSummary }			from '../components/GameSummary.tsx';
import { ClientRoomData }		from '../components/ClientRoomData.tsx';
import { TournamentSummary }	from '../components/TournamentSummary.tsx';
import { RoundDetails }			from '../components/RoundDetails.tsx';

import { WebSocketServer }	from 'ws';
import { useState }			from 'react';
import { useEffect }		from 'react';
import { useContext }		from 'react';
import React				from 'react';

interface GameTestPageProps {
	leaveRoom?: boolean;
}

const GameTestPage: React.FC<GameTestPageProps> = ({leaveRoom = true}) =>
{
	let [ renderMap, sendMessageToGameBackendWs, clearRenderMap, serRenderMap ]	= useContext(BackendWsContext);
	let	lastSentKeyEventStr: string												= "";
	// let joinedRoom												= "bebou's fluffy cloudy universe";

	let firstRender = function(): void
	{
		clearRenderMap();

		window.removeEventListener("keydown", handleKeyDown);
		window.removeEventListener("keyup", handleKeyUp);

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		// let roomCreationEvent	= RoomCreationEventWS.createBlankRoom(joinedRoom);
		// {
		// 	let board = new BoardWS(joinedRoom + " board");
		// 	board.addWall(new BoardWallWS(joinedRoom + " wall 1", 0, 0, 800, 0));
		// 	board.addWall(new BoardWallWS(joinedRoom + " wall 2", 800, 0, 800, 600));
		// 	board.addWall(new BoardWallWS(joinedRoom + " wall 3", 800, 600, 0, 600));
		// 	board.addWall(new BoardWallWS(joinedRoom + " wall 4", 0, 600, 0, 0));
		// 	roomCreationEvent.objectMap.set(board, new RoomObjectDataWS());

		// 	let paddle1 = new PaddleWS(joinedRoom + " paddle 1");
		// 	paddle1.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 1 : 1", 0 + 50, 0, 20 + 50, 0));
		// 	paddle1.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 1 : 2", 20 + 50, 0, 20 + 50, 60));
		// 	paddle1.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 1 : 3", 20 + 50, 60, 0 + 50, 60));
		// 	paddle1.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 1 : 4", 0 + 50, 60, 0 + 50, 0));
		// 	roomCreationEvent.objectMap.set(paddle1, new RoomObjectDataWS());

		// 	let paddle2 = new PaddleWS(joinedRoom + " paddle 2");
		// 	paddle2.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 2 : 1", 0 + 50, 0 + 150, 20 + 50, 0 + 150));
		// 	paddle2.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 2 : 2", 20 + 50, 0 + 150, 20 + 50, 60 + 150));
		// 	paddle2.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 2 : 3", 20 + 50, 60 + 150, 0 + 50, 60 + 150));
		// 	paddle2.addHitLine(new PaddleHitLineWS(joinedRoom + " paddle 2 : 4", 0 + 50, 60 + 150, 0 + 50, 0 + 150));
		// 	roomCreationEvent.objectMap.set(paddle2, new RoomObjectDataWS());

		// 	let ball			= new BallWS(joinedRoom + " ball 1");
		// 	let ballRoomData	= new RoomObjectDataWS();
		// 	ballRoomData.collideWithMap.set(paddle1.id,	paddle1);
		// 	ballRoomData.collideWithMap.set(paddle2.id,	paddle2);
		// 	ballRoomData.collideWithMap.set(board.id,	board);
		// 	ball.setPosition(400, 100);
		// 	ball.setAngle(180 - 45);
		// 	ball.setSpeed(50);
		// 	roomCreationEvent.objectMap.set(ball, ballRoomData);
		// }
		// let roomCreationEvent2	= RoomCreationEventWS.createBlankRoom("bebou's dark twisted fantesy [second room]");

		// sendMessageToGameBackendWs(roomCreationEvent.createJSON());
		// sendMessageToGameBackendWs(roomCreationEvent2.createJSON());
		// sendMessageToGameBackendWs((new LaunchGameEventWS()).createJSON());
		// // sendMessageToGameBackendWs((new JoinRoomEventWS(joinedRoom)).createJSON());
	}

	let pageLeft = function(): void
	{
		if (leaveRoom)
			sendMessageToGameBackendWs((new LeaveRoomEventWS("")).createJSON());
		clearRenderMap();
	}

	function handleKeyDown(event: KeyboardEvent): void
	{
		let keyEventWS		= new KeyEventWS();
		let keyEventWsJSON	= "";

		keyEventWS.eventType	= KeyEventWS.keyDown;
		keyEventWS.key.name		= event.key;
		keyEventWS.key.altKey	= event.altKey;
		keyEventWS.key.ctrlKey	= event.ctrlKey;
		keyEventWsJSON				= keyEventWS.createJSON();

		if (lastSentKeyEventStr === keyEventWsJSON)
			return ;
		lastSentKeyEventStr = keyEventWsJSON;
		sendMessageToGameBackendWs(keyEventWsJSON);
	}

	function handleKeyUp(event: KeyboardEvent): void
	{
		let keyEventWS		= new KeyEventWS();
		let keyEventWsJSON	= "";

		keyEventWS.eventType		= KeyEventWS.keyUp;
		keyEventWS.key.name			= event.key;
		keyEventWS.key.altKey		= event.altKey;
		keyEventWS.key.ctrlKey		= event.ctrlKey;
		keyEventWsJSON					= keyEventWS.createJSON();

		if (lastSentKeyEventStr === keyEventWsJSON)
			return ;
		lastSentKeyEventStr = keyEventWsJSON;
		sendMessageToGameBackendWs(keyEventWsJSON);
	}

	let	renderObjects = function(): React.ReactElement[]
	{
		let toReturn: React.ReactElement[] = [];
		let i = -1;

		for (let [key, backendObject] of renderMap)
		{
			i++;

			if (BallWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <Ball key={key} backendObject={backendObject} />;
			else if (PaddleWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <Paddle key={key} backendObject={backendObject} />;
			else if (BoardWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <Board key={key} backendObject={backendObject} />;
			else if (BoardWallWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <BoardWall key={key} backendObject={backendObject} />;
			else if (HitLineWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <HitLine key={key} backendObject={backendObject} />;
			else if (PointWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <Point key={key} backendObject={backendObject} />;
			else if (GameCountdownWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <GameCountdown key={key} backendObject={backendObject} />;
			else if (BallHitObjectWS.isGoodTypeJSON(backendObject.type))
			{
				toReturn[i] = <BallHitObject key={key} backendObject={backendObject} />;
				renderMap.delete(key)
			}
			else if (GameSummaryWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <GameSummary key={key} backendObject={backendObject} />;
			else if (ClientRoomDataWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <ClientRoomData key={key} backendObject={backendObject} />;
			else if (TournamentSummaryWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <TournamentSummary key={key} backendObject={backendObject} />;
			else if (RoundDetailsWS.isGoodTypeJSON(backendObject.type))
				toReturn[i] = <RoundDetails key={key} backendObject={backendObject} />;
		}
		return (toReturn);
	}

	// -- MAIN --
	useEffect(() => {
		firstRender();

		return () =>
		{
			pageLeft();
		}; 
	}, []);

	logger("return_indication", "log", "returning GameTestPage component");
	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="relative" style={{
				width: '1200px',
				height: '600px',
				transform: 'translate(0, 0)'
			}}>
				{renderObjects()}
			</div>
		</div>
	);
};

export default GameTestPage;
