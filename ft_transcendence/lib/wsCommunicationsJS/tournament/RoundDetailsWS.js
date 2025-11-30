// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   RoundDetailsWS.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/18 11:21:18 by isibio            #+#    #+#             //
//   Updated: 2025/06/18 11:21:20 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "roundDetails";

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import MatchDetailsWS		from './MatchDetailsWS.js';

export function RoundDetailsWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.roundNb			= 0;		// - number of the round (int)
	this.matchDetailsArr	= [];		// - array of match details (MatchDetailsWS)

	this.id		= id_ || DEFAULT_ID;

	// not sent in JSON
	this.printedChanges			= false;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON				= JSON.parse(strJSON);
		let parsedMatchDetailsArr	= parsedJSON.matchDetailsArr;

		for (let i = 0; i < parsedMatchDetailsArr.length; ++i)
		{
			let	elementJSON = JSON.stringify(parsedMatchDetailsArr[i]);
			_this.matchDetailsArr.push(MatchDetailsWS.createFromJSON(elementJSON));
		}

		_this.roundNb	= parsedJSON.roundNb;
		_this.id		= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			roundNb:this.roundNb,
			matchDetailsArr:this.matchDetailsArr,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
RoundDetailsWS.createFromJSON = function(strJSON)
{
	let	toReturn = new RoundDetailsWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

RoundDetailsWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default RoundDetailsWS;

