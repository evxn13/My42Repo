// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   BallHitObjectWS.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/08 17:53:33 by isibio            #+#    #+#             //
//   Updated: 2025/05/08 17:53:38 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "ballHitObjectEvent";

import BallWS	from '../ball/BallWS.js';

export function BallHitObjectWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.ball		= new BallWS();		// - object type [BallWS]
	this.hitLineId	= "";				// - string
	this.isGoal		= false;			// - boolean

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

		_this.ball		= BallWS.createFromJSON(parsedJSON.ball);
		_this.hitLineId	= parsedJSON.hitLineId;
		_this.isGoal	= parsedJSON.isGoal;

		_this.id		= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			ball:this.ball.createJSON(),
			hitLineId:this.hitLineId,
			isGoal:this.isGoal,

			eventType:this.eventType,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
BallHitObjectWS.createFromJSON = function(strJSON)
{
	let	toReturn = new BallHitObjectWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

BallHitObjectWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default BallHitObjectWS;

