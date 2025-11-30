/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ClientRoomDataWS.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 10:05:03 by isibio            #+#    #+#             */
/*   Updated: 2025/05/30 14:19:07 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "clientRoomData";

import UserDetailsWS	from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

export function ClientRoomDataWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.client				= "";					// - should be client uuid (string)
	this.userDetails		= new UserDetailsWS();	// - should be client details object (UserDetailsWS)
	this.isVictory			= -1;					// - < 0		: the game is not finished 
													//   false		: the client didn't won
													//   true		: the client won
	this.points				= 0;
	this.clientDisconnected	= false;

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.client				= parsedJSON.client;
		_this.userDetails			= UserDetailsWS.createFromJSON(JSON.stringify(parsedJSON.userDetails));
		_this.isVictory				= parsedJSON.isVictory;
		_this.points				= parsedJSON.points;
		_this.clientDisconnected	= parsedJSON.clientDisconnected;

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
			points:this.points,
			clientDisconnected:this.clientDisconnected,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
ClientRoomDataWS.createFromJSON = function(strJSON)
{
	let	toReturn = new ClientRoomDataWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

ClientRoomDataWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default ClientRoomDataWS;

