// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   LaunchGameEventWS.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/18 13:35:52 by isibio            #+#    #+#             //
//   Updated: 2025/04/18 13:35:53 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "launchGameEvent";

export function LaunchGameEventWS(roomName_, id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.roomName	= roomName_;

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.roomName	= parsedJSON.roomName;
		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			roomName:this.roomName,
			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
LaunchGameEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new LaunchGameEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

LaunchGameEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default LaunchGameEventWS;


