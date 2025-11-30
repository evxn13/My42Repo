// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ClearRenderMapEventWS.js                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/10 18:13:54 by isibio            #+#    #+#             //
//   Updated: 2025/06/10 18:13:55 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "clearRenderMapEvent";

import BallWS	from '../ball/BallWS.js';

export function ClearRenderMapEventWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;
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

		_this.id		= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
ClearRenderMapEventWS.createFromJSON = function(strJSON)
{
	let	toReturn = new ClearRenderMapEventWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

ClearRenderMapEventWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}
export default ClearRenderMapEventWS;
