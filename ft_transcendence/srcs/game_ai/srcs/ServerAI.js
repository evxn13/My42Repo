// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   serverAI.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/04 18:14:09 by isibio            #+#    #+#             //
//   Updated: 2025/06/04 18:14:10 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import logger				from '/lib/transcendence/loggerJS/logger.js';

import https				from 'https';
import fs					from 'fs';
import path					from 'path';

import Fastify				from 'fastify'

import JoinRoomEventWS		from '/lib/transcendence/wsCommunicationsJS/event/JoinRoomEventWS.js';

import AcanavatAI			from './AcanavatAI.js';

// * ai provider
export function ServerAI(listeningPort_)
{
	// - public attrubutes

	// - private attrubutes
	let	_this			= this;
	let	_listeningPort	= listeningPort_;
	let	_fastify;
	let	_wss;

	// *
	// * public methods
	let	launchServer = this.launchServer = function(listeningPort_ = _listeningPort)
	{
		_fastify = Fastify(
		{
			logger: false,
			https:
			{
				key: fs.readFileSync(path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.key')),
				cert: fs.readFileSync(path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.crt'))
			}
		});

		_fastify.post('/', _handleRequest);
		console.log("launching server at port [", listeningPort_ ,"]");
		_fastify.listen({ port: listeningPort_, host: "0.0.0.0" }, _handleServerError);
	}

	let	joinAiToRoom = this.joinAiToRoom = function(joinRoomEvent)
	{
		// console.log("joinRoomEvent =", joinRoomEvent);

		let		acanavatAI = new AcanavatAI(joinRoomEvent.roomToJoin);
		acanavatAI.start();
		// console.log("acanavatAI =", acanavatAI);
	}

	// * private methods
	let		_handleRequest = function(request, reply)
	{
		logger("aiServer_incommingRequest", "log", c.LLGREEN + "→ new request" + c.CLEAN, "\nrequest body : " + JSON.stringify(request.body));
		logger("aiServer_incommingRequest", "log", "", c.LLGREEN + "-- END --" + c.CLEAN + "\n");

		let parsedRequest = JSON.parse(JSON.stringify(request.body));
		if (JoinRoomEventWS.isGoodTypeJSON(parsedRequest.type))
			joinAiToRoom(JoinRoomEventWS.createFromJSON(JSON.stringify(parsedRequest)));

		reply.send({ hello: 'world' });
	}

	let		_handleServerError = function(err, address)
	{
		logger("aiServer_serverError", "warn", c.LORANGE + c.BOLD + "✗ new error" + c.CLEAN, c.LORANGE + "\n" + err);
		logger("aiServer_incommingRequest", "warn", "", c.LORANGE + c.BOLD + "-- END --" + c.CLEAN + "\n");

		if (err)
			process.exit(1)
	}
}
