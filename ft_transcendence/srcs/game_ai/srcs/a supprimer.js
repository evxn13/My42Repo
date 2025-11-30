import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';
import wsCommunications		from '/lib/transcendence/wsCommunicationsJS/wsCommunications.js';

import { WebSocketServer }	from 'ws';
import { useState }			from 'react';

export function GameFrontend(backendWsUrlArg)
{
	// - public attrubutes
	// [this.ballBackend, this.setBallBackend] = useState(new BallWS);
	[this.renderList, this.setRenderList] = useState(new Map());
	// this.ballBackend = new BallWS;
	this.isConnectedToGameBackendWs = false;

	// - private attrubutes
	let	_this = this;
	let	_backendWsUrl = backendWsUrlArg || "default";
	let _wsGameBackend;


	// *
	// * public methods
	let	connectToBackend = this.connectToBackend = function(wsUrl = _backendWsUrl)
	{
		logger("frontend_connectionToBackend", "log", "connectiong to backend ws ", "(url : " + c.BOLD + wsUrl + c.CLEAN + ")");

		_wsGameBackend = new WebSocket(wsUrl);

		_wsGameBackend.onerror		= _handleWsErrorEvent;
		_wsGameBackend.onopen		= _handleWsOpenEvent;
		_wsGameBackend.onmessage	= _handleWsMessageEvent;

		// _wsGameBackend.addEventListener("error", (event) => {
		// 	console.log("Eror");
		// 	_wsGameBackend = new WebSocket(webSocketAddress)
		// });

		// _wsGameBackend.addEventListener("open", (event) => {
		// 	_wsGameBackend.send("Hello Server!");
		// });
	}

	let	sendMessageToGameBackendWs = this.sendMessageToGameBackendWs = function(message)
	{
		let sendMessage = function()
		{
			logger("frontend_outcommingMessage", "log", c.LBROWN + "← " + c.BOLD + "sending message to backend" + c.CLEAN, "\n" + message + "\n" + c.LBROWN + "-- END --" + c.CLEAN + "\n");
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
	let		_handleWsErrorEvent = function()
	{
		logger("frontend_connectionToBackend", "log", "waiting to connect to backend", ", the backend is probably launching/down");
		setTimeout(function()
		{
			if (!_this.isConnectedToGameBackendWs)
				connectToBackend();
		}, 2000);
	}

	let		_handleWsOpenEvent = function()
	{
		logger("frontend_connectionToBackend", "log", "connected to backend", "");

		_this.isConnectedToGameBackendWs = true;
		// sendMessageToGameBackendWs("{ \"type\":\"coucou backend\" }");
	}

	let		_handleWsMessageEvent = function(message)
	{
		logger("frontend_incommingMessage", "log", c.LLGREEN + "→ " + c.BOLD + "new message from backend" + c.CLEAN, "\n" + message.data + "\n" + c.LLGREEN + "-- END --" + c.CLEAN + "\n");
		let	isJSON = false;

		try
		{
			JSON.parse(message.data);
			isJSON = true;
		}
		catch (e)
		{
			logger("frontend_incommingMessageParsing", "warn", "incomming message is not JSON, he will be handled as TEXT message", "\n(e = " + e + ")");
		}

		if (isJSON)
			_handleWsMessageJSON(message.data)
		else
			_handleWsMessageTEXT(message.data)

	}

	let		_handleWsMessageJSON = function(messageJSON)
	{
		logger("frontend_incommingMessageHandlingJSON", "log", "handling JSON message", "\n" + messageJSON + "\n" + "-- END --" + c.CLEAN + "\n");

		let newObject = wsCommunications.createObjectFromJSON(messageJSON);
		console.log("Created object id : " + newObject.id)
		if (newObject === null)
			return ;

		// _this.setRenderList(_this.renderList.set(newObject.id, newObject));
		// _this.setRenderList(_this.renderList.set(newObject.id, newObject));
		_this.setRenderList(new Map(_this.renderList.set(newObject.id, newObject)));

		console.log("_this.renderList = ", _this.renderList, "\n");
		// logger("frontend_incommingMessageHandlingJSON", "log", "updating renderList", " _this.renderList = " + _this.renderList + "\n");

		// console.log("BEFORE : _this.ballBackend.posX", _this.ballBackend.posX);
		// _this.setBallBackend(BallWS.createFromJSON(messageJSON));
		// console.log("AFTER  : _this.ballBackend.posX", _this.ballBackend.posX);
	}

	let		_handleWsMessageTEXT = function(messageTEXT)
	{

	}
}
