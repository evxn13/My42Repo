// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Client.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/18 18:08:06 by isibio            #+#    #+#             //
//   Updated: 2025/04/18 18:08:09 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import {v4 as uuidv4}		from 'uuid';

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';

import KeyWS				from '/lib/transcendence/wsCommunicationsJS/control/KeyWS.js';
import Controls				from '/lib/transcendence/wsCommunicationsJS/control/Controls.js';

import KeyEventWS			from '/lib/transcendence/wsCommunicationsJS/event/KeyEventWS.js';

import UserDetailsWS		from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

// - let uuid argument at value "" to generate a new uuid
export function Client(uuid_, ws_)
{
	// * public attributes
	this.uuid	= uuid_;
	if (uuid_ == "")
		this.uuid = uuidv4();

	this.ws					= ws_;
	this.isConnected		= false;
	this.loopId				= null;			// - maybe soon outdated with new GameRoom system
	this.matchmakingLoopId	= null;			// - id of the 'matchmaking' loop (when the client is searching for a game room)
	this.movingPaddle		= false;		// - boolean, true if client's paddle(s) are moving
	this.joinedGameRoomMap	= new Map();	// - map with : [key]   = roomName
											//				[value] = room object

	this.userDetails	= new UserDetailsWS()

	this.keyStateMap	= new Map();	// - map with : [key]	= key name (literally the name of the key on the keyboard)
										//				[value]	= last recived keyEvent (KeyEventWS)
										//   should be capable to handle multi-key (♥ cub3d ♥)

	this.keyBindingsMap	= new Map();	// - map with : [key]	= keyWS object
										//				[value]	= associated control (KeyControls)

	// * private attributes
	let	_this = this;

	// * public methods
	let	handleKey = this.handleKey = function(keyEventJSON)
	{
		let	keyEvent = new KeyEventWS();
		keyEvent.initFromJSON(keyEventJSON);

		_this.keyStateMap.set(keyEvent.key.createJSON(), keyEvent);
	}

	let	log = this.log = function(prefix, message)
	{
		let	messageToReturn = prefix + "[" + this.uuid + "] " + message;
		return (messageToReturn);
	}

	let	send = this.send = function(message)
	{
		logger("backend_outcommingMessage", "log", this.log(c.LBROWN + "← ", c.BOLD + "sending message" + c.CLEAN), "\n" + message)
		logger("backend_outcommingMessage", "log", "", c.LBROWN + "-- END --" + c.CLEAN + "\n");
		this.ws.send(message);
	}

	let	leaveEveryGameRoom = this.leaveEveryGameRoom = function()
	{
		for (let [roomName, roomObject] of _this.joinedGameRoomMap)
			roomObject.removeClient(_this);
	}

	let initDefaultKeyBindingsMap = this.initDefaultKeyBindingsMap = function()
	{
		// - PADDLE UP
		let keyArrowUp = new KeyWS();
		keyArrowUp.name = "ArrowUp";
		_this.keyBindingsMap.set(keyArrowUp.createJSON(), Controls.paddleUp);

		// - PADDLE DOWN
		let keyArrowDown = new KeyWS();
		keyArrowDown.name = "ArrowDown";
		_this.keyBindingsMap.set(keyArrowDown.createJSON(), Controls.paddleDown);
	}

	// * Iterate ovec the keyStateMap and returns a list of Controls,
	// * if the keyEvent of the element on keyStateMap is set to ""
	let getUsedControls = this.getUsedControls = function()
	{
		let	usedControls = [];

		for (let [keyJSON, lastKeyEvent] of _this.keyStateMap)
			if (lastKeyEvent.eventType === KeyEventWS.keyDown)
				usedControls.push(_this.keyBindingsMap.get(keyJSON));
		return (usedControls);
	}

	let getBindedKey = this.getBindedKey = function(control_)
	{
		for (let [keyObject, control] of _this.keyBindingsMap)
			if (control == control_)
				return (KeyWS.createFromJSON(keyObject));
		return (null);
	}
}
export default Client;
