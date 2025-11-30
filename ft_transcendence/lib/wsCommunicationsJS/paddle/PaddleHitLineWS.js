// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PaddleHitLineWS.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/17 11:10:43 by isibio            #+#    #+#             //
//   Updated: 2025/04/17 11:10:45 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "paddle hitLine";

import HitLineWS	from '../collision/HitLineWS.js';

export function PaddleHitLineWS(id_ = DEFAULT_ID, startX_ = 0, startY_ = 0, endX_ = 0, endY_ = 0)
{
	// - public attrubutes
	this.type	= TYPE_JSON;

	this.hitLine	= new HitLineWS(id_ + " hitWall", startX_, startY_, endX_, endY_);
	this.hitLine.startPoint.size	= 1
	this.hitLine.endPoint.size		= 1

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON = JSON.parse(strJSON);

		_this.hitLine.initFromJSON(JSON.stringify(parsedJSON.hitLine));

		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify(
		{
			type:this.type,
			hitLine:this.hitLine.createJSON(true),
			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
PaddleHitLineWS.createFromJSON = function(strJSON)
{
	let	toReturn = new PaddleHitLineWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

PaddleHitLineWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default PaddleHitLineWS;

