// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   KeyWS.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/21 19:09:23 by isibio            #+#    #+#             //
//   Updated: 2025/04/21 19:09:25 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "key";

export function KeyWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.name		= "";
	this.altKey		= false;
	this.ctrlKey	= false;

	// - PRESSED / RELASED / ...
	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.id		= parsedJSON.id;

		_this.name		= parsedJSON.name;
		_this.altKey	= parsedJSON.altKey;
		_this.ctrlKey	= parsedJSON.ctrlKey;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,

			name:this.name,
			altKey:this.altKey,
			ctrlKey:this.ctrlKey,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
KeyWS.createFromJSON = function(strJSON)
{
	let	toReturn = new KeyWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

KeyWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default KeyWS;

