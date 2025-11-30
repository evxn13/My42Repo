// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   KeyEventWS.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/17 21:06:45 by isibio            #+#    #+#             //
//   Updated: 2025/04/17 21:06:46 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "keyEvent";

import KeyWS	from '../control/KeyWS.js';

export function KeyEventWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.key	= new KeyWS();

	// - PRESSED / RELASED / ...
	this.eventType	= "";

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.id		= parsedJSON.id;

		_this.key.initFromJSON(JSON.stringify(parsedJSON.key));
		_this.eventType	= parsedJSON.eventType;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,

			key:this.key.createJSON(true),
			eventType:this.eventType,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
KeyEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new KeyEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

KeyEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

KeyEventWS.keyUp	= "keyup *";
KeyEventWS.keyDown	= "keydown *";

export default KeyEventWS;

