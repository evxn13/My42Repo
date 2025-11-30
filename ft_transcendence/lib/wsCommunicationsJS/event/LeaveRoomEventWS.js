// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   LeaveRoomEventWS.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/25 17:39:29 by isibio            #+#    #+#             //
//   Updated: 2025/05/02 10:06:46 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "leaveRoomEvent";

export function LeaveRoomEventWS(roomToLeave_ = "", id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.roomToLeave	= roomToLeave_;

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.roomToLeave	= parsedJSON.roomToLeave;
		_this.id			= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			roomToLeave:this.roomToLeave,

			eventType:this.eventType,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
LeaveRoomEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new LeaveRoomEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

LeaveRoomEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default LeaveRoomEventWS;

