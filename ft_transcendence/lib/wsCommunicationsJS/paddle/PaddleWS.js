// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PaddleWS.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/21 12:12:38 by isibio            #+#    #+#             //
//   Updated: 2025/03/21 12:12:39 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "paddle";

import PaddleHitLineWS	from "./PaddleHitLineWS.js"

import wsCommunications	from '/lib/transcendence/wsCommunicationsJS/wsCommunications.js';
import BallWS			from '/lib/transcendence/wsCommunicationsJS/ball/BallWS.js';
import PointWS			from '/lib/transcendence/wsCommunicationsJS/PointWS.js';
import HitLineWS		from '/lib/transcendence/wsCommunicationsJS/collision/HitLineWS.js';

import * as wsUtils		from '/lib/transcendence/wsCommunicationsJS/wsUtils.js';
import * as c			from '/lib/transcendence/colorsJS/colors.js';

export function PaddleWS(id_ = DEFAULT_ID)
{
	// - public attrubutes
	this.type	= TYPE_JSON;

	this.hitLineArr		= [];
	this.clientOwnerArr	= [];					// - only uuid stored (strings)

	this.stepSize			= 1;				// - in pixels
	this.angle				= 270;				// - angle of the paddle, usually when direction is UP
	this.speed				= 50;

	this.id		= id_ || DEFAULT_ID;


	// not sent in JSON
	this.collisionsToRespectMap	= new Map();	// - map with : [key]	= object id	(String)
												//				[value]	= HitLine	(object HitLineWS)

	this.printedChanges		= false;
	this.handledCollisions	= false;

	this.stepLoopId			= 0;

	this.maxClientOwner = 1;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	launch = this.launch = function(angleToAdd_ = 0, newSpeed_, newAngle_)
	{
		// * step tous les points (stocker les nouvelles positions dans une variable temporare)
		// * check si un des points est en collision avec un des objets
		// * si non :
		//  	ne pas effectuer le deplacement
		// * si oui :
		//  	effectuer le deplacement

		// * If paddle already launched, return
		if (_this.stepLoopId)
			return ;

		if (newSpeed_)
			_this.setSpeed(newSpeed_);
		if (newAngle_)
			_this.setAngle(newAngle_);

		let workingAngle	= (_this.angle + angleToAdd_) % 360;
		let tickspeed		= BallWS.getTickspeed(_this.speed);

		let loopFunction = function ()
		{
			_this.step(_this.stepSize, workingAngle);

			// - Calculating new interval according to speed (if speed is updated)
			let newTickspeed = BallWS.getTickspeed(_this.speed);
			if (newTickspeed != tickspeed)
			{
				tickspeed = newTickspeed;
				clearInterval(_this.stepLoopId);
				_this.stepLoopId = setInterval(loopFunction, tickspeed);
			}
		}
		_this.stepLoopId = setInterval(loopFunction, tickspeed);

		return (_this.stepLoopId);
	}

	let	stop = this.stop = function()
	{
		if (_this.stepLoopId)
		{
			clearInterval(_this.stepLoopId);
			_this.stepLoopId = 0;
		}
	}

	let	step = this.step = function(stepSize_, angle_)
	{
		let	hitLineArrAfterMovement = [];
		for (let paddleHitLineElement of _this.hitLineArr)
			hitLineArrAfterMovement.push(wsCommunications.createObjectFromJSON(paddleHitLineElement.createJSON()));
		for (let paddleHitLineElement of hitLineArrAfterMovement)
		{
			paddleHitLineElement.hitLine.startPoint	= PointWS.getNextStep(paddleHitLineElement.hitLine.startPoint, stepSize_, angle_);
			paddleHitLineElement.hitLine.endPoint	= PointWS.getNextStep(paddleHitLineElement.hitLine.endPoint, stepSize_, angle_);
		}

		let hitPointArr	= _getAllPossibleHitPoints(_this.hitLineArr, hitLineArrAfterMovement, true, true);
		// * clear the old array and replacing to by the new with new positions
		if (!hitPointArr)
		{
			_this.hitLineArr = [];
			for (let paddleHitLineElement of hitLineArrAfterMovement)
				_this.hitLineArr.push(wsCommunications.createObjectFromJSON(paddleHitLineElement.createJSON()));

			_this.printedChanges	= false;
			_this.handledCollisions	= false;
		}
	}


	let	clientStep = this.clientStep = function(uuid, xToAdd_ = 0, yToAdd_ = 0)
	{
		if (isClientOwner(uuid))
			_this.step(xToAdd_, yToAdd_);
	}

	let	clientLaunch = this.clientLaunch = function(uuid_, angleToAdd_, newSpeed_, newAngle_)
	{
		if (isClientOwner(uuid_))
			_this.launch(angleToAdd_, newSpeed_, newAngle_);
	}

	let	clientStop = this.clientStop = function(uuid)
	{
		if (isClientOwner(uuid))
			_this.stop();
	}


	let	addHitLine = this.addHitLine = function(hitLine_)
	{
		_this.hitLineArr.push(hitLine_);
	}


	let	isClientOwner = this.isClientOwner = function(uuid_)
	{
		if (uuid_ === undefined || uuid_ === null)
			return (false);

		for (let clientOwnerArrElement of _this.clientOwnerArr)
			if (uuid_ == clientOwnerArrElement)
				return (true);
		return (false);
	}

	let	addClientOwner = this.addClientOwner = function(uuid_)
	{
		if (!_this.canAddClientOwner())
			return ;
		_this.clientOwnerArr.push(uuid_);
		_this.printedChanges = false;
	}

	let	removeClientOwner = this.removeClientOwner = function(uuid_)
	{
		let indexOfElement = _this.clientOwnerArr.indexOf(uuid_);
		if (indexOfElement !== -1)
			_this.clientOwnerArr.splice(indexOfElement, 1);
		_this.printedChanges = false;
	}

	let	canAddClientOwner = this.canAddClientOwner = function()
	{
		if (_this.clientOwnerArr.length >= _this.maxClientOwner)
			return (false);
		return (true);
	}


	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON			= JSON.parse(strJSON);
		let parsedHitLineArr		= parsedJSON.hitLineArr;
		let clientOwnerArr			= parsedJSON.clientOwnerArr;

		for (let i = 0; i < parsedHitLineArr.length; ++i)
		{
			let	hitLineArrElementJSON = JSON.stringify(parsedHitLineArr[i]);
			_this.hitLineArr.push(PaddleHitLineWS.createFromJSON(hitLineArrElementJSON));
		}

		for (let i = 0; i < clientOwnerArr.length; ++i)
		{
			let	clientOwnerArrElementJSON = JSON.stringify(clientOwnerArr[i]);
			_this.clientOwnerArr.push(clientOwnerArrElementJSON);
		}

		_this.stepSize	= parsedJSON.stepSize;
		_this.angle		= parsedJSON.angle;
		_this.speed		= parsedJSON.speed;
		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function()
	{
		let toReturn = JSON.stringify({
			type:this.type,

			hitLineArr:this.hitLineArr,
			clientOwnerArr:this.clientOwnerArr,

			stepSize:this.stepSize,
			angle:this.angle,
			speed:this.speed,

			id:this.id,
		});
		return (toReturn);
	}


	let setSpeed = this.setSpeed = function(newSpeed_, throwExceptions_ = false)
	{
		if (!newSpeed_ && newSpeed_ != 0)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions_));
		if (!(typeof newSpeed_ === 'number' || newSpeed_ instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions_));

		if (newSpeed_ > PaddleWS.maxSpeed)
			newSpeed_ = PaddleWS.maxSpeed
		if (newSpeed_ < PaddleWS.minSpeed)
			newSpeed_ = PaddleWS.minSpeed

		for (let paddleHitLine of _this.hitLineArr)
		{
			paddleHitLine.hitLine.startPoint.setSpeed(newSpeed_);
			paddleHitLine.hitLine.endPoint.setSpeed(newSpeed_);
		}

		_this.speed = newSpeed_;
		return (true);
	}

	let setAngle = this.setAngle = function(newAngle_)
	{
		for (let paddleHitLine of _this.hitLineArr)
		{
			paddleHitLine.hitLine.startPoint.setAngle(newAngle_);
			paddleHitLine.hitLine.endPoint.setAngle(newAngle_);
		}

		_this.angle = newAngle_;
	}

	let	setCollisionsToRespect = this.setCollisionsToRespect = function(id_, hitElement_)
	{
		_this.collisionsToRespectMap.set(id_, hitElement_);
	}

	// * private methods
	let	_getAllPossibleHitPoints = function(paddleHitLineArr, secondPaddleHitLineArr, returnAtFirstPositive = false, returnBooleanValue = false)
	{
		let hitPointArr			= [];

		let	__pushToHitPointArr = function(value)
		{
			// * avoid pushing `null` or `undefined` values
			if (value)
				hitPointArr.push(value);

			if (returnAtFirstPositive)
				return (__returnHitPointArr());
		}

		let	__returnHitPointArr = function()
		{
			if (returnBooleanValue)
			{
				let booleanValue = hitPointArr.length ? true : false;
				return (booleanValue);
			}
			return (hitPointArr);
		}

		for (let i in secondPaddleHitLineArr)
		{
			let paddleHitLineArrElement			= paddleHitLineArr[i];
			let secondPaddleHitLineArrElement	= secondPaddleHitLineArr[i];


			for (let [key, element] of _this.collisionsToRespectMap)
			{
				if (HitLineWS.isGoodTypeJSON(element.type))
				{
					let firstPaddleStartPoint	= paddleHitLineArrElement.hitLine.startPoint;
					let firstPaddleEndPoint		= paddleHitLineArrElement.hitLine.endPoint;
					let secondPaddleStartPoint	= secondPaddleHitLineArrElement.hitLine.startPoint;
					let secondPaddleEndPoint	= secondPaddleHitLineArrElement.hitLine.endPoint;

					__pushToHitPointArr(element.isHitting(firstPaddleStartPoint,	secondPaddleStartPoint));
					__pushToHitPointArr(element.isHitting(firstPaddleEndPoint,		secondPaddleEndPoint));
					__pushToHitPointArr(element.isHitting(firstPaddleStartPoint,	firstPaddleEndPoint));
					__pushToHitPointArr(element.isHitting(secondPaddleStartPoint,	secondPaddleEndPoint));
				}
				else if (PointWS.isGoodTypeJSON(element.type))
				{
					let firstPaddleStartPoint	= paddleHitLineArrElement.hitLine.startPoint;
					let firstPaddleEndPoint		= paddleHitLineArrElement.hitLine.endPoint;
					let secondPaddleStartPoint	= secondPaddleHitLineArrElement.hitLine.startPoint;
					let secondPaddleEndPoint	= secondPaddleHitLineArrElement.hitLine.endPoint;

					__pushToHitPointArr(HitLineWS.isPointTouchingLine(element, firstPaddleStartPoint,	secondPaddleStartPoint));
					__pushToHitPointArr(HitLineWS.isPointTouchingLine(element, firstPaddleEndPoint,		secondPaddleEndPoint));
					__pushToHitPointArr(HitLineWS.isPointTouchingLine(element, firstPaddleStartPoint,	firstPaddleEndPoint));
					__pushToHitPointArr(HitLineWS.isPointTouchingLine(element, secondPaddleStartPoint,	secondPaddleEndPoint));
				}
				else
				{
					// * unhandled collision
					continue ;
				}
			}
		}

		return (__returnHitPointArr());
	}
}

// * constants
PaddleWS.maxSpeed	= 2000;
PaddleWS.minSpeed	= 300;

// * static methods
PaddleWS.createFromJSON = function(strJSON)
{
	let	toReturn = new PaddleWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

PaddleWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default PaddleWS;
