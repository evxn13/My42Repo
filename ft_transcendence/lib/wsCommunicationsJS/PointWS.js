// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PointWS.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/12 09:58:55 by isibio            #+#    #+#             //
//   Updated: 2025/04/12 09:58:56 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "point";

export function PointWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.posX	= 0;
	this.posY	= 0;
	this.speed	= 20;	// px per second
	this.angle	= 90;	// in degree
	this.size	= 20;	// Bigness :O

	this.id		= id_ || DEFAULT_ID;

	// not sent in JSON
	this.stepSize			= 1;	// in px	| pixelToSplit

	this.printedChanges		= false;
	this.loopId;
	// this.collisionsToRespect	= [];

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);
		// console.log("[PointWS.initFromJSON] strJSON         = ", strJSON);
		// console.log("[PointWS.initFromJSON] parsedJSON.type = ", parsedJSON.type);

		_this.id		= parsedJSON.id;

		_this.posX		= parsedJSON.posX;
		_this.posY		= parsedJSON.posY;
		_this.speed		= parsedJSON.speed;
		_this.angle		= parsedJSON.angle;
		_this.size		= parsedJSON.size;
		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,

			posX:this.posX,
			posY:this.posY,
			speed:this.speed,
			angle:this.angle,
			size:this.size,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	let	setPosition = this.setPosition = function(newPosX, newPosY)
	{
		_this.posX	= newPosX;
		_this.posY	= newPosY;
	}

	let	setSpeed = this.setSpeed = function(newSpeed)
	{
		_this.speed	= newSpeed;
	}

	let	setAngle = this.setAngle = function(newAngle)
	{
		// newAngle = Math.abs(newAngle % 360)
		
		while (newAngle >= 360)
			newAngle -= 360;
		_this.angle = newAngle;
	}

	let	setSize = this.setSize = function(newSize)
	{
		if (newSize < 1)
			newSize = 1;
		_this.size	= newSize;
	}

	// let	setCollisionsToRespect = this.setCollisionsToRespect = function(collisions)
	// {
	// 	_this.collisionsToRespect = collisions;
	// }

	// let	addCollisionsToRespect = this.addCollisionsToRespect = function(collisions)
	// {
	// 	// for (let element of collisions)
	// 	// 	_this.collisionsToRespect.push(element);
	// 	_this.collisionsToRespect.push(collisions);
	// }

	let	launch = this.launch = function(newSpeed, newAngle)
	{
		this.speed	= newSpeed || this.speed;
		this.angle	= newAngle || this.angle;	// use .setAngle()

		let tickspeed = 1000 / this.speed;

		_this.loopId = setInterval(function ()
		{
			_this.step(1, _this.angle);

			_this.printedChanges = false;
		}, tickspeed);
		
		return (_this.loopId);
	}

	let	stop = this.stop = function()
	{
		clearInterval(_this.loopId);
	}

	let	step = this.step = function(stepSize = this.stepSize, angle = _this.angle)
	{
		let tmp = PointWS.getNextStep(_this, stepSize, angle);
		_this.initFromJSON(tmp.createJSON());
	}

	let	stepAround = this.stepAround = function(centerPoint, distance = _this.stepSize, angle = _this.angle)
	{
		// let tmp = PointWS.getNextStepAround(_this, centerPoint, stepSize, angle);

		let tmp = PointWS.getNextStep(centerPoint, distance, angle);
		_this.posX = tmp.posX;
		_this.posY = tmp.posY;
	}


	// * private methods
}

// * static methods
PointWS.createFromJSON = function(strJSON)
{
	let	toReturn = new PointWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

PointWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

PointWS.getNextStep = function(startingPoint, stepSize, angle)
{
	let toReturn = PointWS.createFromJSON(startingPoint.createJSON());

	let pixelForX = stepSize * Math.cos(angle * (Math.PI / 180));
	let pixelForY = stepSize * Math.sin(angle * (Math.PI / 180));

	toReturn.posX -= pixelForX;
	toReturn.posY += pixelForY;

	return (toReturn)
}

PointWS.distance = function(firstPoint, secondPoint)
{
	// * formula : d = √((x_2-x_1)² + (y_2-y_1)²)
	return (Math.sqrt(Math.pow(secondPoint.posX - firstPoint.posX, 2) + Math.pow(secondPoint.posY - firstPoint.posY, 2)))
}

PointWS.angleDifference = function(angleReference, angleTarget)
{
	return ((angleTarget - angleReference + 180) % 360 - 180);

	// - https://yychang.github.io/Notes/202205291402_Calculating_the_difference_between_two_angles/
	//   d = (angleTarget - angleReference + 180) % 360 - 180
}

export default PointWS;
