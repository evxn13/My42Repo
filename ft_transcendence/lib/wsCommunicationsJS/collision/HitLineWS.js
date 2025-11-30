// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   HitLineWS.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/07 14:35:48 by isibio            #+#    #+#             //
//   Updated: 2025/04/07 14:35:49 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as c		from '/lib/transcendence/colorsJS/colors.js';
import logger		from '/lib/transcendence/loggerJS/logger.js';

import PointWS		from '../PointWS.js';

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "hitLine";

export function HitLineWS(id_ = DEFAULT_ID, startX_, startY_, endX_, endY_)
{
	// - public attrubutes
	this.type	= TYPE_JSON;

	this.startPoint	= new PointWS(id_ + "'s starting point")
	this.startPoint.setPosition(startX_, startY_);

	this.endPoint	= new PointWS(id_ + "'s ending point")
	this.endPoint.setPosition(endX_, endY_);

	this.id		= id_ || DEFAULT_ID;
	// not sent in JSON

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	isHitting = this.isHitting = function(actualPoint_, nextPoint_)
	{
		// * tracer une droite entre 'actual' et 'next', si cette droite croise la droite entre 'start' et 'end',

		// * Maybe, partir de cette base et ajouter 2 verifications, si `actualPoint_` || `nextPoint_`
		//   en prenant en compte leurs `size`, touchent la ligne

		// _this.isPointTouchingLine(actualPoint_.posX, actualPoint_.posY, actualPoint_.size / 2)

		let hitPoint = HitLineWS.acanavatFormulaVector(_this.startPoint, _this.endPoint, actualPoint_, nextPoint_, false, false);
		if (hitPoint)
			return (hitPoint);

		// hitPoint = HitLineWS.isPointTouchingLine(actualPoint_, _this.startPoint, _this.endPoint)
		// if (hitPoint)
		// 	return (hitPoint);

		hitPoint = HitLineWS.isPointTouchingLine(nextPoint_, _this.startPoint, _this.endPoint);
		return (hitPoint);
	}

	let	setStartPoint = this.setStartPoint = function(newPosX_, newPosY_)
	{
		this.startPoint.setPosition(newPosX_, newPosY_);
	}
	
	let	setEndPoint = this.setEndPoint = function(newPosX_, newPosY_)
	{
		this.endPoint.setPosition(newPosX_, newPosY_);
	}
	
	let	setPosition = this.setPosition = function(newStartPointX_, newStartPointY_, newEndPointX_, newEndPointY_)
	{
		_this.setStartPoint(newStartPointX_, newStartPointY_);
		_this.setEndPoint(newEndPointX_, newEndPointY_);
	}


	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON = JSON.parse(strJSON);

		_this.id		= parsedJSON.id;

		// console.log("HERE");
		// console.log("  -  strJSON                               =", strJSON);
		// console.log("  -  parsedJSON                            =", parsedJSON);
		// console.log("  -  parsedJSON.startPoint                 =", parsedJSON.startPoint);
		// console.log("  -  JSON.stringify(parsedJSON.startPoint) =", JSON.stringify(parsedJSON.startPoint));
		// console.log("  -  JSON.stringify(parsedJSON.endPoint)   =", JSON.stringify(parsedJSON.endPoint));
		_this.startPoint.initFromJSON(JSON.stringify(parsedJSON.startPoint));
		_this.endPoint.initFromJSON(JSON.stringify(parsedJSON.endPoint));

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,
			id:this.id,

			startPoint:this.startPoint.createJSON(true),
			endPoint:this.endPoint.createJSON(true),
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}
	
	// * This is a function by acanavat
	let	onWall = this.onWall = function(x, y) 
	{
		const x1 = this.startPoint.posX;
		const y1 = this.startPoint.posY;
		const x2 = this.endPoint.posX;
		const y2 = this.endPoint.posY;

		const dx = x2 - x1;
		const dy = y2 - y1;
		const dxp = x - x1;
		const dyp = y - y1;

		// Produit vectoriel pour tester la colinéarité
		const cross = dx * dyp - dy * dxp;

		if (Math.abs(cross) > 1e-6) 
			return false; // Si non colinéaire, retour

		// Calcul du produit scalaire pour voir si le point est dans l'intervalle
		const dot = dx * dxp + dy * dyp;
		const squaredLength = dx * dx + dy * dy;

		// Vérifier si le point est entre les deux extrémités du segment
		if (dot < 0 || dot > squaredLength)
			return false;
		return true; // Le point est sur le segment
	};

	let	getLineAngle = this.getLineAngle = function() 
	{
		// - Get and flipping (to match the ball's angle handling) the angle of hitLine_
		return (HitLineWS.getLineAngle(_this.startPoint, _this.endPoint));
	}

// let	acanavatFormula = this.acanavatFormula = function(firstX_, firstY_, secondX_, secondY_)
// 	{
// 		let	divide = function(a, b)
// 		{
// 			if (a == 0)
// 				return (0);
// 			if (b == 0)
// 				return (1);
// 			return (a / b);
// 		}

// 		// y = (nb * x) + b
// 		//
// 		// nb	=	(y2 - y1) / (x2 - x1)
// 		// b	=	y - (1/2 * x)

// 		// * let	collisionX	= (firstY_ - (nb * firstX_)) - (secondY_ - (nb * secondX_));

// 		console.log(c.LYELLOW + c.ITALIC + "firstX_  = " + firstX_ + c.CLEAN);
// 		console.log(c.LYELLOW + c.ITALIC + "firstY_  = " + firstY_ + c.CLEAN);
// 		console.log(c.LYELLOW + c.ITALIC + "secondX_ = " + secondX_ + c.CLEAN);
// 		console.log(c.LYELLOW + c.ITALIC + "secondY_ = " + secondY_ + c.CLEAN);
// 		console.log("");
// 		console.log(c.LYELLOW + c.ITALIC + "startX = " + _this.startPoint.posX + c.CLEAN);
// 		console.log(c.LYELLOW + c.ITALIC + "startY = " + _this.startPoint.posY + c.CLEAN);
// 		console.log(c.LYELLOW + c.ITALIC + "endX   = " + _this.endPoint.posX + c.CLEAN);
// 		console.log(c.LYELLOW + c.ITALIC + "endY   = " + _this.endPoint.posY + c.CLEAN);
// 		console.log("");

// 		// * PARTE CALCULS

// 		let nb	= (secondY_ - firstY_) / (secondX_ - firstX_);
// 		let b;
// 		if ((secondY_ - firstY_) == 0)
// 		{
// 			nb	= 0;
// 		}
// 		else if ((secondX_ - firstX_) == 0)
// 		{
// 			nb	= 1;
// 			b = secondX_ - firstX_;
// 		}
// 		b	= firstY_ - (nb * firstX_);
// 		if (b === Infinity)
// 			b = 1;
// 		// if ((secondX_ - firstX_) == 0)
// 		// {
// 		// 	console.log("WTF1");
// 		// 	nb = 1;
// 		// 	b = firstX_;
// 		// 	collisionX = firstX_;

// 		// }
// 		// if ((secondY_ - firstY_) == 0)
// 		// {
// 		// 	console.log("WTF2");
// 		// 	nb = 0;
// 		// 	b = firstY_;
// 		// 	collisionY = firstY_;
// 		// }

// 		let	hit_nb	= (_this.endPoint.posY - _this.startPoint.posY) / (_this.endPoint.posX - _this.startPoint.posX);
// 		if ((_this.endPoint.posY - _this.startPoint.posY) == 0)
// 			hit_nb = 0;
// 		else if ((_this.endPoint.posX - _this.startPoint.posX) == 0)
// 			hit_nb = 1;
// 		let	hit_b	= _this.startPoint.posY - (hit_nb * _this.startPoint.posX);
// 			if (hit_b === Infinity)
// 				hit_b = 0;

// 		// if ((_this.endPoint.posX - _this.startPoint.posX) == 0)
// 		// {
// 		// 	console.log("WTF3");
// 		// 	hit_nb = 1;
// 		// 	hit_b = _this.startPoint.posX;
// 		// 	collisionX = _this.startPoint.posX;
// 		// }
// 		// if ((_this.endPoint.posY - _this.startPoint.posY) == 0)
// 		// {
// 		// 	console.log("WTF4");
// 		// 	hit_nb = 0;
// 		// 	hit_b = _this.startPoint.posY;
// 		// 	collisionX = _this.startPoint.posY;
// 		// }

// 		let temp		= hit_nb - nb;
// 		let collisionX	= (b - hit_b) / temp;
// 		let collisionY	= (nb * collisionX) + b;

// 		// if (collisionX == 0)
// 		// {
// 		// 	collisionX	= (b - hit_b) / temp;
// 		// }
// 		// if (collisionY == 0 && nb != 1)
// 		// {
// 		// 	console.log("nb == " + nb + " collisionX == " + collisionX + "b == " + b);
// 		// 	collisionY	= (nb * collisionX) + b;
// 		// }
// 		// else 
// 		// 	collisionY	= (nb * collisionX);

// 		// * PARTE PRINT
// 		console.log("nb = " + nb);
// 		console.log("b  = " + b);
// 		console.log("");
// 		console.log("hit_nb = " + hit_nb);
// 		console.log("  (_this.endPoint.posX - _this.startPoint.posX)  = " + (_this.endPoint.posX - _this.startPoint.posX));
// 		console.log("  (_this.endPoint.posY - _this.startPoint.posY)  = " + (_this.endPoint.posY - _this.startPoint.posY));
// 		console.log("hit_b  = " + hit_b);
// 		console.log("  (_this.endPoint.posX - _this.startPoint.posX)  = " + (_this.endPoint.posX - _this.startPoint.posX));
// 		console.log("");
// 		console.log("temp = " + temp);
// 		console.log("");
// 		console.log(c.LGREEN + c.BOLD + c.BLINK + "collisionX = " + collisionX + c.CLEAN);
// 		console.log(c.LGREEN + c.BOLD + c.BLINK + "collisionY = " + collisionY + c.CLEAN);

// 		// * PARTIE RENDER (A REMOVE ?)
// 		let	hitPoint = new PointWS("collision point");
// 		hitPoint.setPosition(collisionX, collisionY);

// 		return (hitPoint);
// 	}

	let	_acanavatTest = this._acanavatTest = function(firstX_, firstY_, secondX_, secondY_)
	{

		let formula_a = ((secondX_ - firstX_) * (firstY_ - _this.startPoint.posY)) - ((secondY_ - firstY_) * (firstX_ - _this.startPoint.posX));
		let formula_b = ((secondX_ - firstX_) * (_this.endPoint.posY - _this.startPoint.posY)) - ((secondY_ - firstY_) * (_this.endPoint.posX - _this.startPoint.posX));
		let formula_c = ((_this.endPoint.posX - _this.startPoint.posX) * (firstY_ - _this.startPoint.posY)) - ((_this.endPoint.posY - _this.startPoint.posY) * (firstX_ - _this.startPoint.posX));

		if (formula_b == 0)
			return (null);

		let alpha	= formula_a / formula_b;
		let beta	= formula_c / formula_b;
		
		// * [<= / >=] or simple [< / >] ???
		let hitPoint = new PointWS("acanavat hp");
		hitPoint.posX = (_this.startPoint.posX + (alpha * (_this.endPoint.posX - _this.startPoint.posX)));
		hitPoint.posY = (_this.startPoint.posY + (alpha * (_this.endPoint.posY - _this.startPoint.posY)));

		return (hitPoint);
	}

	let	_acanavatTestV2 = this._acanavatTestV2 = function(firstX_, firstY_, secondX_, secondY_)
	{
		let formula_a = ((secondX_ - firstX_) * (firstY_ - _this.startPoint.posY)) - ((secondY_ - firstY_) * (firstX_ - _this.startPoint.posX));
		let formula_b = ((secondX_ - firstX_) * (_this.endPoint.posY - _this.startPoint.posY)) - ((secondY_ - firstY_) * (_this.endPoint.posX - _this.startPoint.posX));
		let formula_c = ((_this.endPoint.posX - _this.startPoint.posX) * (firstY_ - _this.startPoint.posY)) - ((_this.endPoint.posY - _this.startPoint.posY) * (firstX_ - _this.startPoint.posX));
		if (formula_b == 0)
			return (null);

		let alpha	= formula_a / formula_b;
		let beta	= formula_c / formula_b;
		// * [<= / >=] or simple [< / >] ???
		if ((alpha < 0 || alpha > 1) || (beta < 0 || beta > 1))
			return (null);

		let hitPoint = new PointWS("acanavat hp");
		hitPoint.posX = (_this.startPoint.posX + (alpha * (_this.endPoint.posX - _this.startPoint.posX)));
		hitPoint.posY = (_this.startPoint.posY + (alpha * (_this.endPoint.posY - _this.startPoint.posY)));
		return (hitPoint);
	}
	// * private methods
}

// * static methods
HitLineWS.createFromJSON = function(strJSON)
{
	let	toReturn = new HitLineWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

HitLineWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

HitLineWS.getLineAngle = function(startPoint_, endPoint_) 
{
	// * 0		= left
	// * 90		= down
	// * 180	= right
	// * 270	= up

	// - Get and flipping (to match the ball's angle handling) the angle of hitLine_
	let hitLineAngle = Math.atan2(endPoint_.posX - startPoint_.posX, endPoint_.posY - startPoint_.posY) * 180 / Math.PI;
	
	// if (test) console.log("[getLineAngle] angle before =", hitLineAngle);
	// if (test) console.log("[getLineAngle] angle after  =", hitLineAngle);

	hitLineAngle	-= 90 + 180;
	hitLineAngle	= (360 + hitLineAngle) % 360;
	// hitLineAngle	+= (hitLineAngle < 0) ? 180 : 0;	// * old angle adjustment formula

	return (hitLineAngle);
}

// * acanavat formula but static
HitLineWS.acanavatFormulaVector = function(firstLineStartPoint_, firstLineEndPoint_, secondLineStartPoint_, secondLineEndPoint_, isFirstLineInfinite_ = false, isSecondLineInfinite_ = false)
{
	// * from https://www.youtube.com/watch?v=bvlIYX9cgls
	// * A = (x1, y1)					A = (_this.startPoint.posX, _this.startPoint.posY)
	// * B = (x2, y2)					B = (_this.endPoint.posX, _this.endPoint.posY)
	// * C = (x3, y3)					C = (firstX_, firstY_)
	// * D = (x4, y4)					D = (secondX_, secondY_)
	// * AB = (x2 - x1, y2 - y1)
	// * CD = (x4 - x3, y4 - y3)

	// * A + αAB = C + βCD

	// * α = ((x4 - x3)(y3 - y1) - (y4 - y3)(x3 - x1)) / ((x4 - x3)(y2 - y1) - (y4 - y3)(x2 - x1)) = a / b
	// * β = ((x2 - x1)(y3 - y1) - (y2 - y1)(x3 - x1)) / ((x4 - x3)(y2 - y1) - (y4 - y3)(x2 - x1)) = c / b

	// * P = (x0, y0)
	// * x0 = x1 + α(x2 - x1) = x3 + β(x4 - x3)
	// * y0 = y1 + α(y2 - y1) = y3 + β(y4 - y3)

	let firstLineStartPointX	= firstLineStartPoint_.posX;
	let firstLineStartPointY	= firstLineStartPoint_.posY;
	let firstLineEndPointX		= firstLineEndPoint_.posX;
	let firstLineEndPointY		= firstLineEndPoint_.posY;

	let secondLineStartPointX	= secondLineStartPoint_.posX;
	let secondLineStartPointY	= secondLineStartPoint_.posY;
	let secondLineEndPointX		= secondLineEndPoint_.posX;
	let secondLineEndPointY		= secondLineEndPoint_.posY;

	logger("acanavatFormulaVector_calcul_details", "log", "", "wall B - firstLineStartPointX = " + firstLineStartPointX);
	logger("acanavatFormulaVector_calcul_details", "log", "", "wall B - firstLineStartPointY = " + firstLineStartPointY);
	logger("acanavatFormulaVector_calcul_details", "log", "", "wall B - firstLineEndPointX   = " + firstLineEndPointX);
	logger("acanavatFormulaVector_calcul_details", "log", "", "wall B - firstLineEndPointY   = " + firstLineEndPointY);

	logger("acanavatFormulaVector_calcul_details", "log", "", "wall A - secondLineStartPointX  = " + secondLineStartPointX);
	logger("acanavatFormulaVector_calcul_details", "log", "", "wall A - secondLineStartPointY  = " + secondLineStartPointY);
	logger("acanavatFormulaVector_calcul_details", "log", "", "wall A - secondLineEndPointX = " + secondLineEndPointX);
	logger("acanavatFormulaVector_calcul_details", "log", "", "wall A - secondLineEndPointY = " + secondLineEndPointY);

	let formula_a = ((secondLineEndPointX - secondLineStartPointX) * (secondLineStartPointY - firstLineStartPointY)) - ((secondLineEndPointY - secondLineStartPointY) * (secondLineStartPointX - firstLineStartPointX));
	let formula_b = ((secondLineEndPointX - secondLineStartPointX) * (firstLineEndPointY - firstLineStartPointY)) - ((secondLineEndPointY - secondLineStartPointY) * (firstLineEndPointX - firstLineStartPointX));
	let formula_c = ((firstLineEndPointX - firstLineStartPointX) * (secondLineStartPointY - firstLineStartPointY)) - ((firstLineEndPointY - firstLineStartPointY) * (secondLineStartPointX - firstLineStartPointX));

	logger("acanavatFormulaVector_calcul_details", "log", "", "");
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LYELLOW + c.BOLD + "formula_a = " + formula_a + c.CLEAN);
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LYELLOW + c.BOLD + "formula_b = " + formula_b + c.CLEAN);
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LYELLOW + c.BOLD + "formula_c = " + formula_c + c.CLEAN);

	if (formula_b == 0)
		return (null);

	let alpha	= formula_a / formula_b;
	let beta	= formula_c / formula_b;

	logger("acanavatFormulaVector_calcul_details", "log", "", "");
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LYELLOW + c.BOLD + "alpha = " + alpha + c.CLEAN);
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LYELLOW + c.BOLD + "beta  = " + beta + c.CLEAN);

	// * [<= / >=] or simple [< / >] ???
	if (!isFirstLineInfinite_ && (alpha < 0 || alpha > 1))
		return (null);
	if (!isSecondLineInfinite_ && (beta < 0 || beta > 1))
		return (null);

	let hitPoint = new PointWS("acanavat hp");
	hitPoint.posX = (firstLineStartPointX + (alpha * (firstLineEndPointX - firstLineStartPointX)));
	hitPoint.posY = (firstLineStartPointY + (alpha * (firstLineEndPointY - firstLineStartPointY)));

	logger("acanavatFormulaVector_calcul_details", "log", "", "");
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LGREEN + c.BOLD + c.BLINK + "hitPoint.posX = " + hitPoint.posX + c.CLEAN);
	logger("acanavatFormulaVector_calcul_details", "log", "", c.LGREEN + c.BOLD + c.BLINK + "hitPoint.posY = " + hitPoint.posY + c.CLEAN);
	logger("acanavatFormulaVector_calcul_details", "log", "", "");
	logger("acanavatFormulaVector_calcul_details", "log", "", "hitPoint.posX = " + hitPoint.posX);
	logger("acanavatFormulaVector_calcul_details", "log", "", "hitPoint.posY = " + hitPoint.posY);

	return (hitPoint);
}
HitLineWS.isLineTouchingLine = HitLineWS.acanavatFormulaVector;

HitLineWS.isPointTouchingLine = function(point_, lineStartPoint_, lineEndPoint_)
{
	// * not very used but here's an article : https://www.geeksforgeeks.org/check-line-touches-intersects-circle/

	if (PointWS.distance(lineStartPoint_, point_) <= point_.size / 2)
		return (lineStartPoint_);
	if (PointWS.distance(lineEndPoint_, point_) <= point_.size / 2)
		return (lineEndPoint_);

	// console.log("point_          =", point_);
	// console.log("lineStartPoint_ =", lineStartPoint_);
	// console.log("lineEndPoint_   =", lineEndPoint_);

	let actualLineAngle	= HitLineWS.getLineAngle(lineStartPoint_, lineEndPoint_);
	let normalA			= Math.abs((actualLineAngle + 90) % 360);
	let normalB			= Math.abs((actualLineAngle - 90 + 360) % 360);
	// console.log("actualLineAngle =", actualLineAngle);
	// console.log("normalA         =", normalA);
	// console.log("normalB         =", normalB);

	let hitPointA		= HitLineWS.acanavatFormulaVector(lineStartPoint_, lineEndPoint_, point_, PointWS.getNextStep(point_, point_.size / 2, normalA));
	let hitPointB		= HitLineWS.acanavatFormulaVector(lineStartPoint_, lineEndPoint_, point_, PointWS.getNextStep(point_, point_.size / 2, normalB));
	// console.log(c.LGREEN + c.BOLD + c.BLINK + "hitPointA       =", hitPointA + c.CLEAN);
	// console.log(c.LGREEN + c.BOLD + c.BLINK + "hitPointB       =", hitPointB + c.CLEAN);

	if (hitPointA || hitPointB)
		return (hitPointA ? hitPointA : hitPointB);
	return (null);

	// * Get les 2 angles de la perpendiculaire de hitLine avec `this.getLineAngle` / +90* and -90*
	// * prolonger le point du cercle avec getNextStep de `radus_`px, check si ca touche la ligne originale
}

export default HitLineWS;
