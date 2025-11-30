// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ObjectWS.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/27 16:12:12 by isibio            #+#    #+#             //
//   Updated: 2025/03/27 16:12:13 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";

export function ObjectWS(id_ = DEFAULT_ID)
{
	// - public attrubutes
	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods

	// * private methods
}

// * static methods
ObjectWS.createFromJSON = function(strJSON)
{
	let	toReturn = new ObjectWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

ObjectWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default ObjectWS;
