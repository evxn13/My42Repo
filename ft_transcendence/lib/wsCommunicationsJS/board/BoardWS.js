// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   BoardWS.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/21 12:12:38 by isibio            #+#    #+#             //
//   Updated: 2025/03/21 12:12:39 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "board";

import BoardWallWS	from './BoardWallWS.js';
import HitLineWS	from '../collision/HitLineWS.js';

export function BoardWS(id_ = DEFAULT_ID)
{
	// - public attrubutes
	this.type		= TYPE_JSON;

	this.wallArr	= [];	// - array of object [BoardWallWS]

	this.id			= id_ || DEFAULT_ID;

	// - not sent in JSON
	this.printedChanges		= false;
	this.handledCollisions	= false;

	// - private attrubutes
	let	_this				= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON		= JSON.parse(strJSON);

		let parsedWallArray;
		if (typeof(parsedJSON.wallArr) != "string")
			parsedWallArray	= parsedJSON.wallArr;
		else
			parsedWallArray	= JSON.parse(parsedJSON.wallArr);

		// console.log("testParsedJSON.length() = " + testParsedJSON.length());
		for (let i = 0; i < parsedWallArray.length; ++i)
		{
			let	wallArrElementJSON = JSON.stringify(parsedWallArray[i]);
			_this.wallArr.push(BoardWallWS.createFromJSON(wallArrElementJSON));
		}

		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function()
	{
		let wallArrJSON = JSON.stringify(_this.wallArr);

		let toReturn = JSON.stringify(
		{
			type:this.type,
			wallArr:wallArrJSON,
			id:this.id,
		});
		return (toReturn);
	}

	// * will init collisions from variables 'this.height' and 'this.width'
	// let	initCollisions = this.initCollisions = function()
	// {
	// 	// * only the wall on the right staying
	// 	// this.collisions.push(new HitLine(0, 0, this.width, 0));
	// 	this.collisions.push(new HitLine("Test Line", this.width, 0, this.width, this.height));
	// 	// this.collisions.push(new HitLine(this.width, this.height, 0, this.height));
	// 	// this.collisions.push(new HitLine(0, this.height, 0, 0));

	// 	console.log("this.collisions[0] = " + this.collisions[0].startX + ":" + this.collisions[0].startY + " - " + this.collisions[0].endX + ":" + this.collisions[0].endY);
	// 	// console.log("this.collisions[1] = " + this.collisions[1].startX + ":" + this.collisions[1].startY + " - " + this.collisions[1].endX + ":" + this.collisions[1].endY);
	// 	// console.log("this.collisions[2] = " + this.collisions[2].startX + ":" + this.collisions[2].startY + " - " + this.collisions[2].endX + ":" + this.collisions[2].endY);
	// 	// console.log("this.collisions[3] = " + this.collisions[3].startX + ":" + this.collisions[3].startY + " - " + this.collisions[3].endX + ":" + this.collisions[3].endY);
	// }

	let	addWall = this.addWall = function(wall)
	{
		_this.wallArr.push(wall);
		_this.printedChanges	= false;
		_this.handledCollisions	= false;
	}

	let	printWallArr = this.printWallArr = function()
	{
		for (let i = 0; i < _this.wallArr.length; ++i)
		{
			console.log("_this.wallArr[" + i + "] : " + _this.wallArr[i].createJSON());
		}
	}

	let	getCenterX = this.getCenterX = function()
	{
		return (_this.width / 2);
	}

	let	getCenterY = this.getCenterY = function()
	{
		return (_this.height / 2);
	}

	// let	getHitLineMap = this.getHitLineMap = function()
	// {
	// 	let	hitLineMap = new Map();

	// 	// for (let wall of objectToCollideWith.wallArr)
	// 	// 	object.setCollisionsToRespect(wall.hitLine.id, wall.hitLine);
	// 	return (_this.collisions);
	// }


	// * private methods
}

// * static methods
BoardWS.createFromJSON = function(strJSON)
{
	let	toReturn = new BoardWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

BoardWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default BoardWS;
