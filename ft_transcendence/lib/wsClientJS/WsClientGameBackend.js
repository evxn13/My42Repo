// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   wsClientGameBackend.js                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/25 18:08:59 by isibio            #+#    #+#             //
//   Updated: 2025/04/25 18:08:59 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';
import wsCommunications		from '/lib/transcendence/wsCommunicationsJS/wsCommunications.js';

import { WebSocket }		from 'ws';
import https				from 'https';
import fs					from 'fs';

export function WsClientGameBackend(backendWsUrlArg)
{
	// - public attrubutes
	this.renderMap					= new Map();
	this.isConnectedToGameBackendWs	= false;

	// - private attrubutes
	let	_this = this;
	let	_backendWsUrl = backendWsUrlArg || "default";
	let _wsGameBackend;


	// *
	// * public methods
	let	connectToBackend = this.connectToBackend = function(wsUrl = _backendWsUrl)
	{
		logger("game_ai_connectionToBackend", "log", "connectiong to backend ws ", "(url : " + c.BOLD + wsUrl + c.CLEAN + ")");

		let agent		= new https.Agent({ rejectUnauthorized: false });
		_wsGameBackend 	= new WebSocket(wsUrl, { agent: agent });

		_wsGameBackend.onerror		= _handleWsErrorEvent;
		_wsGameBackend.onopen		= _handleWsOpenEvent;
		_wsGameBackend.onmessage	= _handleWsMessageEvent;
	}

	let	disconenctFromBackend = this.disconenctFromBackend = function()
	{
		logger("game_ai_disconnectionFromBackend", "log", "disconnecting from backend ws");
		_wsGameBackend.close();
	}

	let	sendMessageToGameBackendWs = this.sendMessageToGameBackendWs = function(message)
	{
		let sendMessage = function()
		{
			logger("game_ai_outcommingMessage", "log", c.LBROWN + "← " + c.BOLD + "sending message to backend" + c.CLEAN, "\n" + message + "\n" + c.LBROWN + "-- END --" + c.CLEAN + "\n");
			_wsGameBackend.send(message);
		}

		if (_this.isConnectedToGameBackendWs == true)
		{
			sendMessage();
			return ;
		}

		// * waiting for _this.isConnectedToGameBackendWs to be true
		let loopId = setInterval(function ()
		{
			if (_this.isConnectedToGameBackendWs == true)
			{
				sendMessage();
				clearInterval(loopId);
			}
		}, 500);
	}

	// * private methods
	let		_handleWsErrorEvent = function(test)
	{
		logger("game_ai_connectionToBackend", "log", "waiting to connect to backend", ", the backend is probably launching/down");
		setTimeout(function()
		{
			if (!_this.isConnectedToGameBackendWs)
				connectToBackend();
		}, 2000);
	}

	let		_handleWsOpenEvent = function()
	{
		logger("game_ai_connectionToBackend", "log", "connected to backend", "");

		_this.isConnectedToGameBackendWs = true;
		// sendMessageToGameBackendWs("{ \"type\":\"coucou backend\" }");
	}

	let		_handleWsMessageEvent = function(message)
	{
		logger("game_ai_incommingMessage", "log", c.LLGREEN + "→ " + c.BOLD + "new message from backend" + c.CLEAN, "\n" + message.data + "\n" + c.LLGREEN + "-- END --" + c.CLEAN + "\n");
		let	isJSON = false;

		try
		{
			JSON.parse(message.data);
			isJSON = true;
		}
		catch (e)
		{
			logger("game_ai_incommingMessageParsing", "warn", "incomming message is not JSON, he will be handled as TEXT message", "\n(e = " + e + ")");
		}

		if (isJSON)
			_handleWsMessageJSON(message.data)
		else
			_handleWsMessageTEXT(message.data)

	}

	let		_handleWsMessageJSON = function(messageJSON)
	{
		logger("game_ai_incommingMessageHandlingJSON", "log", "handling JSON message", "\n" + messageJSON + "\n" + "-- END --" + c.CLEAN + "\n");

		let newObject = wsCommunications.createObjectFromJSON(messageJSON);
		// console.log("Created object id : " + newObject.id)
		if (newObject === null)
		{
			logger("game_ai_incommingMessageHandlingJSON", "warn", "unknown object to create", "\n" + messageJSON + "\n" + "-- END --" + c.CLEAN + "\n");
			return ;
		}

		_this.renderMap.set(newObject.id, newObject);

		// logger("game_ai_incommingMessageHandlingJSON", "log", "updating renderMap", " _this.renderMap = " + _this.renderMap + "\n");

		// console.log("BEFORE : _this.ballBackend.posX", _this.ballBackend.posX);
		// _this.setBallBackend(BallWS.createFromJSON(messageJSON));
		// console.log("AFTER  : _this.ballBackend.posX", _this.ballBackend.posX);
	}

	let		_handleWsMessageTEXT = function(messageTEXT)
	{
	}
}
export default WsClientGameBackend;
