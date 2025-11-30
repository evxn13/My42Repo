// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   RoomLeftEventWS.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/22 18:40:28 by isibio            #+#    #+#             //
//   Updated: 2025/05/22 18:40:28 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "roomLeftEvent";

export function RoomLeftEventWS(roomToJoin_ = "", id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.clientUUID	= "";

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.clientUUID	= parsedJSON.clientUUID;
		_this.id			= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			clientUUID:this.clientUUID,

			eventType:this.eventType,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
RoomLeftEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new RoomLeftEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

RoomLeftEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default RoomLeftEventWS;

