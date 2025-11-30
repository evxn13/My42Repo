// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ClientControllingPaddlesWS.js                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/06 18:16:40 by isibio            #+#    #+#             //
//   Updated: 2025/06/06 18:16:40 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "clientControllingPaddles";

export function ClientControllingPaddlesWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.paddleIdArr	= [];	// - array of paddle id (string)

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON			= JSON.parse(strJSON);
		let parsedPaddleIdArr	= parsedJSON.paddleIdArr;

		for (let i = 0; i < parsedPaddleIdArr.length; ++i)
			_this.paddleIdArr.push(parsedPaddleIdArr[i]);
		_this.id		= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let	paddleIdArr		= [];
		for (let value of _this.paddleIdArr)
			paddleIdArr.push(value);

		let toReturn = JSON.stringify({
			type:this.type,

			paddleIdArr:paddleIdArr,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
ClientControllingPaddlesWS.createFromJSON = function(strJSON)
{
	let	toReturn = new ClientControllingPaddlesWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

ClientControllingPaddlesWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default ClientControllingPaddlesWS;


