/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   JoinRoomEventWS.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/25 17:39:29 by isibio            #+#    #+#             */
/*   Updated: 2025/06/26 14:48:13 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "joinRoomEvent";

export function JoinRoomEventWS(roomToJoin_ = "", id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.roomToJoin	= roomToJoin_;

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.roomToJoin	= parsedJSON.roomToJoin;
		_this.id			= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			roomToJoin:this.roomToJoin,

			eventType:this.eventType,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
JoinRoomEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new JoinRoomEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

JoinRoomEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default JoinRoomEventWS;
