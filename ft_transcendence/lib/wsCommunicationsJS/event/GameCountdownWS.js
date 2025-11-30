// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   GameCountdownWS.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/07 17:30:55 by isibio            #+#    #+#             //
//   Updated: 2025/05/07 17:31:13 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "gameCountdownEvent";

export function GameCountdownWS(originalValue_, actualValue_, endValue_, id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.originalValue	= originalValue_	? originalValue_	: 0;
	this.actualValue	= actualValue_		? actualValue_		: 0;
	this.endValue		= endValue_			? endValue_			: 0;

	this.id		= id_ || DEFAULT_ID;

	// not sent in JSON
	this.printedChanges			= false;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);

		_this.originalValue	= parsedJSON.originalValue;
		_this.actualValue	= parsedJSON.actualValue;
		_this.endValue		= parsedJSON.endValue;

		_this.id			= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			originalValue:this.originalValue,
			actualValue:this.actualValue,
			endValue:this.endValue,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
GameCountdownWS.createFromJSON = function(strJSON)
{
	let	toReturn = new GameCountdownWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

GameCountdownWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default GameCountdownWS;
