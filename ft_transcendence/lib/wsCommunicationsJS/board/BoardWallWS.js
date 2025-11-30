// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   BoardWallWS.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/15 11:49:32 by isibio            #+#    #+#             //
//   Updated: 2025/04/15 11:49:33 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "board wall";

import HitLineWS	from '../collision/HitLineWS.js';

export function BoardWallWS(id_ = DEFAULT_ID, startX_ = 0, startY_ = 0, endX_ = 0, endY_ = 0)
{
	// - public attrubutes
	this.type	= TYPE_JSON;

	this.hitLine	= new HitLineWS(id_ + " hitWall", startX_, startY_, endX_, endY_);
	this.isGoalWall	= false;

	this.id		= id_ || DEFAULT_ID;

	// - not sent in JSON
	this.printedChanges		= false;

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

	let	createJSON = this.createJSON = function()
	{
		let toReturn = JSON.stringify(
		{
			type:this.type,
			hitLine:this.hitLine.createJSON(true),
			id:this.id,
		});
		return (toReturn);
	}

	// * private methods
}

// * static methods
BoardWallWS.createFromJSON = function(strJSON)
{
	let	toReturn = new BoardWallWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

BoardWallWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default BoardWallWS;
