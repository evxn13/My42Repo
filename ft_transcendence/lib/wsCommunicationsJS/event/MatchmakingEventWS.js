// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   MatchmakingEventWS.js                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/02 10:48:46 by isibio            #+#    #+#             //
//   Updated: 2025/05/02 10:48:47 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "matchmakingEvent";

MatchmakingEventWS.noStatus	= "No status";
MatchmakingEventWS.launch	= "Launch";
MatchmakingEventWS.stop		= "Stop";
MatchmakingEventWS.found	= "Found";

MatchmakingEventWS.noMode			= "No matchmaking mode";
MatchmakingEventWS.againstPlayer	= "Client vs Player";
MatchmakingEventWS.againstAi		= "Client vs Ai";
MatchmakingEventWS.tournament		= "tournament";

export function MatchmakingEventWS(roomToJoin_ = "", id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.status	= MatchmakingEventWS.noStatus;
	this.mode	= MatchmakingEventWS.noType;

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);
		_this.status		= parsedJSON.status;
		_this.mode			= parsedJSON.mode;
		_this.id			= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			status:this.status,
			mode:this.mode,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
MatchmakingEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new MatchmakingEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

MatchmakingEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default MatchmakingEventWS;
