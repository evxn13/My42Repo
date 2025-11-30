// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    BackendWsContext.tsx                               :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/04/29 14:05:49 by isibio            #+#    #+#              //
//    Updated: 2025/04/29 14:05:50 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';
import wsCommunications		from '/lib/transcendence/wsCommunicationsJS/wsCommunications.js';

import UserDetailsWS			from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';
import ClearRenderMapEventWS	from '/lib/transcendence/wsCommunicationsJS/event/ClearRenderMapEventWS.js';

import { WebSocketServer }	from 'ws';

import React				from 'react';
import { useRef }			from 'react';
import { useState }			from 'react';
import { useEffect }		from 'react';
import { useContext }		from 'react';
import { createContext }	from 'react';

import axiosClient 			from '../../account/utils/axiosClient';
import { useAuth } 			from '../../website/src/hooks/useAuth';

export type BackendWsContextType = [
	Map<string, any>,
	(message: string) => void,
	() => void,
	React.Dispatch<React.SetStateAction<Map<string, any>>>
];

export const BackendWsContext = createContext<BackendWsContextType>(undefined as any);

interface BackendWsProviderProps {
	children: React.ReactNode;
}

export default function BackendWsProvider({ children }: BackendWsProviderProps): JSX.Element {
	// - public attrubutes
	const wsGameBackend				= useRef<WebSocket | null>(null);
	let [renderMap, setRenderMap]	= useState(new Map());

	let isConnectedToGameBackendWs	= useRef<boolean>(false);

	// *
	// * main methods (should be public)
	let firstRender = function()
	{
		let webSocketAddress	= 'wss://' + import.meta.env.VITE_HOST_TRANSCENDENCE + ':' + import.meta.env.VITE_PORT_NGINX + "/game_backend";
		if (!isConnectedToGameBackendWs.current)
			wsGameBackend.current = connectToBackend(webSocketAddress);
	}

	let	connectToBackend = function(wsUrl_)
	{
		logger("frontend_connectionToBackend", "log", "connectiong to backend ws ", "(url : " + c.BOLD + wsUrl_ + c.CLEAN + ")");

		if (!wsUrl_)
			return ;

		let wsObject = new WebSocket(wsUrl_);

		let getClientId = async function()
		{
			const	token = localStorage.getItem('token'); 
			let userId: string;

			try
			{
				if (!token && token !== 0)
					throw (new Error("token not found in localStorage"))

				const response = await axiosClient.get("/me");
				userId = response.data.user.id;
			}
			catch (e)
			{
				logger("frontend_connectionToBackend", "warn", c.DORANGE + c.BOLD + "exception caught : \"" + e.message + c.CLEAN + c.DORANGE + c.BOLD + "\"" + c.CLEAN, c.ITALIC + c.GRAY + " (e = " + e + ")" + c.CLEAN);
			
				userId = UserDetailsWS.AnonymousId;
				logger("frontend_connectionToBackend", "warn", c.DORANGE + c.BOLD + "setting userId to : " + c.CLEAN + c.DORANGE + userId + c.CLEAN);
			}

			let userDetails = new UserDetailsWS();
			userDetails.userId	= userId;
			userDetails.token	= token;
			userDetails.id		= userId + "'s userDetails";
			sendMessage(userDetails.createJSON());
		}

		getClientId();
		wsObject.onerror	= _handleWsErrorEvent;
		wsObject.onopen		= _handleWsOpenEvent;
		wsObject.onmessage	= _handleWsMessageEvent;
		return (wsObject);
	}

	let	sendMessage = function(message)
	{
		let sendMessageMicroFunc = function()
		{
			logger("frontend_outcommingMessage", "log", c.LBROWN + "← " + c.BOLD + "sending message to backend" + c.CLEAN, "\n" + message + "\n" + c.LBROWN + "-- END --" + c.CLEAN + "\n");
			wsGameBackend.current.send(message);
		}

		if (isConnectedToGameBackendWs.current == true)
		{
			sendMessageMicroFunc();
			return ;
		}

		// * waiting for isConnectedToGameBackendWs.current to be true
		let loopId = setInterval(function ()
		{
			if (isConnectedToGameBackendWs.current == true)
			{
				sendMessageMicroFunc();
				clearInterval(loopId);
			}
		}, 500);
	}

	let	clearRenderMap = function(message)
	{
		setRenderMap(new Map());
	}

	// *
	// * secondary methods (should be private)
	let		_handleWsErrorEvent = function()
	{
		logger("frontend_connectionToBackend", "log", "waiting to connect to backend", ", the backend is probably launching or down");
		setTimeout(function()
		{
			if (!isConnectedToGameBackendWs.current)
				connectToBackend();
		}, 2000);
	}

	let		_handleWsOpenEvent = function()
	{
		logger("frontend_connectionToBackend", "log", "connected to backend", "");

		isConnectedToGameBackendWs.current = true;
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
			logger("frontend_incommingMessageParsing", "log", "incomming message is not JSON, he will be handled as TEXT message", "\n(e = " + e + ")");
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
		// console.log("Created object id : " + newObject.id)
		// console.log("newObject         : ", newObject);
		if (newObject === null)
		{
			logger("frontend_incommingMessageHandlingJSON", "warn", "unknown object to create", "\n" + messageJSON + "\n" + "-- END --" + c.CLEAN + "\n");
			return ;
		}

		if (ClearRenderMapEventWS.isGoodTypeJSON(newObject.type))
		{
			clearRenderMap();
			return ;
		}

		setRenderMap(renderMap => {
			const newMap = new Map(renderMap);
			newMap.set(newObject.id, newObject)
			return (newMap);
		});

		// logger("frontend_incommingMessageHandlingJSON", "log", "updating renderMap", " renderMap = " + renderMap + "\n");

		// console.log("BEFORE : ballBackend.posX", ballBackend.posX);
		// setBallBackend(BallWS.createFromJSON(messageJSON));
		// console.log("AFTER  : ballBackend.posX", ballBackend.posX);
	}

	let		_handleWsMessageTEXT = function(messageTEXT)
	{
		logger("frontend_incommingMessageHandlingJSON", "log", "handling TEXT message", "\n" + messageTEXT + "\n" + "-- END --" + c.CLEAN + "\n");
	}

	// -- MAIN --
	useEffect(() =>
	{
		firstRender();
		return () =>
		{
			wsGameBackend.current.close()
		}
	}, []);

	return (
		<BackendWsContext.Provider value={[ renderMap, sendMessage, clearRenderMap, setRenderMap ]}>
			{children}
		</BackendWsContext.Provider>
	)
};

// export { BackendWsContext, BackendWsProvider };
