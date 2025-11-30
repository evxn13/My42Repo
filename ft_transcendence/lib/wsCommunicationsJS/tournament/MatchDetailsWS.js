// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   MatchDetailsWS.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/18 15:45:45 by isibio            #+#    #+#             //
//   Updated: 2025/06/18 15:45:47 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "matchDetails";

import * as c				from '/lib/transcendence/colorsJS/colors.js';
import UserDetailsWS		from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

export function MatchDetailsWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	// this.client			= [];		// - array of client uuid (string)
	this.userDetailsArr		= [];		// - array of client details object (UserDetailsWS)

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
		let parsedUserDetailsArr	= parsedJSON.userDetailsArr;

		for (let i = 0; i < parsedUserDetailsArr.length; ++i)
		{
			let	elementJSON = JSON.stringify(parsedUserDetailsArr[i]);
			_this.userDetailsArr.push(UserDetailsWS.createFromJSON(elementJSON));
		}

		_this.id		= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			userDetailsArr:this.userDetailsArr,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
MatchDetailsWS.createFromJSON = function(strJSON)
{
	let	toReturn = new MatchDetailsWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

MatchDetailsWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default MatchDetailsWS;


