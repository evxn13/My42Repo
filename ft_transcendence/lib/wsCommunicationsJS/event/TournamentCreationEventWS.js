// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   TournamentCreationEventWS.js                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/03 15:47:00 by isibio            #+#    #+#             //
//   Updated: 2025/06/03 15:47:01 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "tournamentCreationEvent";

import RoomCreationEvent	from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js';

export function TournamentCreationEventWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.roomName					= "kissing tournament";
	this.roomCreationEventTemplate	= new RoomCreationEvent();
	this.maxPlayers					= 4;

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.id		= parsedJSON.id;

		_this.roomName		= parsedJSON.roomName;
		_this.roomCreationEventTemplate.initFromJSON(JSON.stringify(parsedJSON.roomCreationEventTemplate));
		_this.maxPlayers	= parsedJSON.maxPlayers;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,

			roomName:this.roomName,
			roomCreationEventTemplate:this.roomCreationEventTemplate.createJSON(true),
			maxPlayers:this.maxPlayers,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
TournamentCreationEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new TournamentCreationEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

TournamentCreationEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default TournamentCreationEventWS;


