/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BallWS.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/21 12:12:38 by isibio            #+#    #+#             */
/*   Updated: 2025/05/28 13:14:52 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import PointWS		from '../PointWS.js';
import * as wsUtils	from '/lib/transcendence/wsCommunicationsJS/wsUtils.js';

import GameCountdownWS		from '/lib/transcendence/wsCommunicationsJS/event/GameCountdownWS.js';

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "ball";

export function BallWS(id_ = DEFAULT_ID)
{
	// - public attrubutes
	this.type	= TYPE_JSON;
	this.id		= id_ || DEFAULT_ID;

	this.point	= new PointWS(id_ + "'s point");
	this.point.setPosition(0, 0);
	this.point.setSpeed(20);
	this.point.setAngle(0);
	this.point.setSize(50);			// Bigness :O

	this.accelerationOnHit	= 1.02;	// value multiplied with actual speed when a surface is hit
									// parsing minimum value : 0
									// parsing maximum value : 2

	this.lastHit	= "";

	this.countdownBeforeBallLaunch	= new GameCountdownWS(500, 0, 0);

	// not sent in JSON
	this.printedChanges			= false;
	this.handledCollisions		= false;

	this.collisionsToRespectMap	= new Map();	// - map with : [key]	= object id	(String)
												//				[value]	= HitLine	(object HitLineWS)

	this.stepSize				= 1;
	this.loopId					= 0;

	this.tickspeed				= 0;

	this.blockBallLaunch		= false;


	this.hitLineContactCallbackFunction = undefined;	// - this function is called when the ball hits a wall
														//   arguments	: (this, hitLine id)
														//   	this		: _this variable
														//   	hitLine id	: id of the hit line ball hit [_this.lastHit]
														//		nextPoint	: balls's next point after object hit

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON = JSON.parse(strJSON);

		_this.id		= parsedJSON.id;

		_this.point.initFromJSON(parsedJSON.point);

		_this.accelerationOnHit	= parsedJSON.accelerationOnHit;

		_this.lastHit			= parsedJSON.lastHit;

		_this.countdownBeforeBallLaunch.initFromJSON(parsedJSON.countdownBeforeBallLaunch);

		return (_this);
	}

	let	createJSON = this.createJSON = function()
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,

			point:_this.point.createJSON(),

			accelerationOnHit:this.accelerationOnHit,

			lastHit:this.lastHit,

			countdownBeforeBallLaunch:this.countdownBeforeBallLaunch.createJSON(),
		});
		return (toReturn);
	}

	let	setPosition = this.setPosition = function(newPosX, newPosY, throwExceptions_ = false)
	{
		if ((!newPosX && newPosX != 0) || (!newPosY && newPosY != 0))
			return (wsUtils.throwAndReturn(false, new Error("newPosX or newPosY isn't positive"), throwExceptions_));
		if ((!(typeof newPosX === 'number' || newPosX instanceof Number)) || !(typeof newPosY === 'number' || newPosY instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("a given variable is not a number"), throwExceptions_));

		_this.point.setPosition(newPosX, newPosY);
	}

	let	setSpeed = this.setSpeed = function(newSpeed, throwExceptions_ = false)
	{
		if (!newSpeed && newSpeed != 0)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions_));
		if (!(typeof newSpeed === 'number' || newSpeed instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions_));
		if (newSpeed > BallWS.maxSpeed)
			newSpeed = BallWS.maxSpeed
		if (newSpeed < BallWS.minSpeed)
			newSpeed = BallWS.minSpeed

		_this.point.setSpeed(newSpeed);
	}

	let	setAngle = this.setAngle = function(newAngle, throwExceptions_ = false)
	{
		if (!newAngle && newAngle != 0)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions_));
		if (!(typeof newAngle === 'number' || newAngle instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions_));

		_this.point.setAngle(newAngle);
	}

	let	setSize = this.setSize = function(newSize, throwExceptions_ = false)
	{
		if (!newSize && newSize != 0)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions_));
		if (!(typeof newSize === 'number' || newSize instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions_));

		if (newSize < BallWS.minSize)
			newSize = BallWS.minSize;
		else if (newSize > BallWS.maxSize)
			newSize = BallWS.maxSize;

		_this.point.setSize(newSize);
	}

	let	setAccelerationOnHit = this.setAccelerationOnHit = function(newValue, throwExceptions_ = false)
	{
		if (!newValue && newValue != 0)
			return (wsUtils.throwAndReturn(false, new Error("value isn't positive"), throwExceptions_));
		if (!(typeof newValue === 'number' || newValue instanceof Number))
			return (wsUtils.throwAndReturn(false, new TypeError("the given variable type must be a number"), throwExceptions_));

		if (newValue < BallWS.minAccelerationOnHit)
			newValue = BallWS.minAccelerationOnHit;
		else if (newValue > BallWS.maxAccelerationOnHit)
			newValue = BallWS.maxAccelerationOnHit;

		_this.accelerationOnHit = newValue;
	}


	let	setCollisionsToRespect = this.setCollisionsToRespect = function(id_, hitLine_)
	{
		_this.collisionsToRespectMap.set(id_, hitLine_);
	}

	let	setCountdownBeforeBallLaunch = this.setCountdownBeforeBallLaunch = function(originalValue_, actualValue_, endValue_)
	{
		originalValue_	= parseInt(originalValue_);
		actualValue_	= parseInt(actualValue_);
		endValue_		= parseInt(endValue_);
		
		if (originalValue_ < 0 || actualValue_ < 0 || endValue_ < 0)
			return (false);

		_this.countdownBeforeBallLaunch.originalValue	= (originalValue_ <= 1000) ? originalValue_ : 1000;
		_this.countdownBeforeBallLaunch.actualValue		= actualValue_;
		_this.countdownBeforeBallLaunch.endValue		= endValue_;
	}

	// let	addCollisionsToRespect = this.addCollisionsToRespect = function(collisions)
	// {
	// 	// for (let element of collisions)
	// 	// 	_this.collisionsToRespectMap.push(element);
	// 	_this.collisionsToRespectMap.push(collisions);
	// }

	let	launch = this.launch = async function(countdownBeforeLaunch_ = _this.countdownBeforeBallLaunch.originalValue, newSpeed = _this.point.speed, newAngle = _this.point.angle)
	{
		if (_this.loopId || _this.blockBallLaunch)
			return ;

		_this.countdownBeforeBallLaunch.actualValue = countdownBeforeLaunch_;
		await _launchCoundtown(_this.countdownBeforeBallLaunch);

		_this.setSpeed(newSpeed);
		_this.setAngle(newAngle);

		_this.tickspeed = BallWS.getTickspeed(_this.point.speed);

		let loopFunction = async function ()
		{
			_this.step(_this.stepSize, _this.point.angle);

			// - Calculating new interval according to speed (if speed is updated)
			let newTickspeed = BallWS.getTickspeed(_this.point.speed);
			if (newTickspeed != _this.tickspeed)
			{
				_this.tickspeed = newTickspeed;
				clearInterval(_this.loopId);
				if (_this.loopId)
					_this.loopId = setInterval(loopFunction, _this.tickspeed);
			}
		}
		_this.loopId = setInterval(loopFunction, _this.tickspeed);

		return (_this.loopId);
	}

	let	stop = this.stop = function()
	{
		if (_this.loopId)
		{
			clearInterval(_this.loopId);
			_this.loopId = 0;
		}
	}

	let	step = this.step = function(stepSize = _this.stepSize, angle = _this.point.angle)
	{
		let	nextPoint = PointWS.getNextStep(_this.point, stepSize, angle);

		let hitPoint;
		for (let [id, hitLine] of _this.collisionsToRespectMap)
		{
			// * calculate the ball's next point and adding the ball radus
			// * (so the collision is not handled from ball center point)
			// let pointPLusRadus		= _this.point;
			// pointPLusRadus.posX		+= width;
			// pointPLusRadus.posY		+= height;
			// let	nextPointPlusRadus	= PointWS.getNextStep(pointPLusRadus, stepSize, angle);
			hitPoint = hitLine.isHitting(_this.point, nextPoint);
			if (hitPoint != null)
			{
				_this.lastHit = hitLine.id;
			
				// * pour ne pas etre dans le mur, on step de `stepSize - 1`
				//   pour le moment cette solution est mauvaise mais ca se voit pas si on a un stepSize faible
				nextPoint = PointWS.getNextStep(_this.point, stepSize - 1, angle)
				nextPoint.setAngle(getNextAngle(hitLine, hitPoint, _this.point.angle));
				nextPoint.setSpeed(getNextSpeed(_this.point.speed, _this.accelerationOnHit));

				if (_this.hitLineContactCallbackFunction != undefined)
					_this.hitLineContactCallbackFunction(_this, _this.lastHit, nextPoint);

				break ;
			}
		}

		_this.point = nextPoint;
		_this.printedChanges	= false;
		_this.handledCollisions	= false;
		return (hitPoint);
	}

	let	getNextAngle = this.getNextAngle = function(hitLine_, hitPoint_, angle_ = _this.point.angle)
	{
		if (!PointWS.distance(hitLine_.startPoint, hitPoint_) || !PointWS.distance(hitLine_.endPoint, hitPoint_))
			return ((angle_ + 180 + 10) % 360);

		let hitLineAngle = hitLine_.getLineAngle();

		// - Calculate the 'Normals' and choosing the good one (the one on the side of the line in contact with the ball)
		let hitLineNormalA	= Math.abs((hitLineAngle + 90) % 360);
		let hitLineNormalB	= Math.abs((hitLineAngle - 90 + 360) % 360);
		let hitLineNormal	= (PointWS.angleDifference(hitLineNormalA, angle_) < 90) ? hitLineNormalB : hitLineNormalA;
	
		// - Law of reflection final formula
		let newAngle = (2 * hitLineNormal - angle_ + 180) % 360;
		newAngle = Math.abs(newAngle) % 360;

		// - To handle if the ball is stuck (stuck = flipping angle_ by 180 degrees forever)
		if (newAngle == ((angle_ + 180) % 360))
			newAngle += 10;
		return (newAngle);
	}

	let	getNextSpeed = this.getNextSpeed = function(speed_ = _this.point.speed, acceleration_ = _this.accelerationOnHit)
	{
		let newSpeed = speed_ * acceleration_;
		if (newSpeed > BallWS.maxSpeed)
			newSpeed = BallWS.maxSpeed
		return (newSpeed);
	}

	// * private methods
	let	_launchCoundtown = async function(gameCountdown_)
	{
		while (gameCountdown_.actualValue > gameCountdown_.endValue)
		{
			if (!(gameCountdown_.actualValue % 20))
				_this.printedChanges = false;
			gameCountdown_.actualValue -= 1;
			await new Promise(r => setTimeout(r, 1));
		}
		_this.printedChanges = false;
	}
}

// * constants
BallWS.minSpeed	= 100;
BallWS.maxSpeed	= 2000;
BallWS.minSize	= 20;
BallWS.maxSize	= 75;
BallWS.minAccelerationOnHit	= 1;
BallWS.maxAccelerationOnHit	= 2;


// * static methods
BallWS.createFromJSON = function(strJSON)
{
	let	toReturn = new BallWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

BallWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

BallWS.getTickspeed = function(speed)
{
	return (1000 / speed);
}

export default BallWS;
