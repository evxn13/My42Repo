// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   UserDetailsWS.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/06 14:21:24 by isibio            #+#    #+#             //
//   Updated: 2025/06/06 14:21:25 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "userDetails";

import * as c				from '/lib/transcendence/colorsJS/colors.js';

export function UserDetailsWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.userId	= "";
	this.token	= "";

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

		_this.userId	= parsedJSON.userId;
		_this.token		= parsedJSON.token;
		_this.id		= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			userId:this.userId,
			token:this.token,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

UserDetailsWS.AiId			= "Ai";
UserDetailsWS.AnonymousId	= "anonymous";

// * static methods
UserDetailsWS.createFromJSON = function(strJSON)
{
	let	toReturn = new UserDetailsWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

UserDetailsWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default UserDetailsWS;

