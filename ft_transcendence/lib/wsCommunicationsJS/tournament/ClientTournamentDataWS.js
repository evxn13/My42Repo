// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ClientTournamentDataWS.js                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/03 16:14:56 by isibio            #+#    #+#             //
//   Updated: 2025/06/03 16:14:57 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "clientTournamentData";

import * as c				from '/lib/transcendence/colorsJS/colors.js';

import ClientRoomDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/ClientRoomDataWS.js';
import UserDetailsWS		from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

export function ClientTournamentDataWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.client				= "";					// - client uuid (type string)
	this.userDetails		= new UserDetailsWS();	// - should be client details object (UserDetailsWS)

	this.isVictory			= -1;					// - false	: the client didn't won the tournament
													//   true	: the client won the tournament
	this.clientDisconnected	= false;				// - boolean, positive if client left the tournament before it ends
	this.maxRoundPlayed		= 0;					// - indicate the last round played by the client (type int)

	// this.clientRoomDataArr	= [];				// - array of games played by client during tournament (type ClientRoomDataWS)

	this.id		= id_ || DEFAULT_ID;

	// - not sent in JSON
	this.stillInTournament	= false;				// - boolean, positive if the client still didn't lost a game
	this.joinedMatch		= false;				// - boolean, positive if the client joined a match room

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON			= JSON.parse(strJSON);
		// let clientRoomDataArr	= parsedJSON.clientDataArr;

		_this.client				= parsedJSON.client;
		_this.userDetails			= UserDetailsWS.createFromJSON(JSON.stringify(parsedJSON.userDetails));
		_this.isVictory				= parsedJSON.isVictory;
		_this.clientDisconnected	= parsedJSON.clientDisconnected;
		_this.maxRoundPlayed		= parsedJSON.maxRoundPlayed;

		// for (let i = 0; i < clientRoomDataArr.length; ++i)
		// {
		// 	let	clientRoomDataArrElementJSON = JSON.stringify(clientRoomDataArr[i]);
		// 	_this.clientRoomDataArr.push(ClientRoomDataWS.createFromJSON(clientRoomDataArrElementJSON));
		// }

		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			client:this.client,
			userDetails:this.userDetails.createJSON(true),
			isVictory:this.isVictory,
			clientDisconnected:this.clientDisconnected,
			maxRoundPlayed:this.maxRoundPlayed,
			// clientRoomDataArr:this.clientRoomDataArr,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
ClientTournamentDataWS.createFromJSON = function(strJSON)
{
	let	toReturn = new ClientTournamentDataWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

ClientTournamentDataWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default ClientTournamentDataWS;


