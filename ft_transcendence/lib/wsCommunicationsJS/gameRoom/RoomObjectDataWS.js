// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   RoomObjectDataWS.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/24 14:53:26 by isibio            #+#    #+#             //
//   Updated: 2025/04/24 14:53:27 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import	wsCommunications	from '../wsCommunications.js'

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "roomObjectData";

export function RoomObjectDataWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.collideWithMap	= new Map();	// - key:	object Id	[string]
										//	 value:	object		[object]

	this.id		= id_ || DEFAULT_ID;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON	= JSON.parse(strJSON);
		
		// * handle collideWithMap
		{
			let map_KEY		= JSON.parse(parsedJSON.collideWithMap_KEY);
			let map_VALUE	= JSON.parse(parsedJSON.collideWithMap_VALUE);

			let	collideWithMap_KEY	= [];
			let	collideWithMap_VALUE;
			for (let i = 0; i < map_KEY.length; ++i)
				collideWithMap_KEY.push(map_KEY[i]);
			for (let i = 0; i < map_VALUE.length; ++i)
			{
				collideWithMap_VALUE	= wsCommunications.createObjectFromJSON(map_VALUE[i]);
				_this.collideWithMap.set(collideWithMap_KEY[i], collideWithMap_VALUE);
			}
		}

		_this.id		= parsedJSON.id;
		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let	collideWithMap_KEY		= [];
		let	collideWithMap_VALUE	= [];
		{
			for (let [mapKey, mapValue] of _this.collideWithMap)
			{
				collideWithMap_KEY.push(mapKey);
				collideWithMap_VALUE.push(mapValue.createJSON());
			}
		}

		let toReturn = JSON.stringify({
			type:this.type,

			collideWithMap_KEY:JSON.stringify(collideWithMap_KEY),
			collideWithMap_VALUE:JSON.stringify(collideWithMap_VALUE),

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

// * static methods
RoomObjectDataWS.createFromJSON = function(strJSON)
{
	let	toReturn = new RoomObjectDataWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

RoomObjectDataWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default RoomObjectDataWS;
