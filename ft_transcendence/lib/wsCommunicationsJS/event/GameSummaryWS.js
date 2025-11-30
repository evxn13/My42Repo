/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameSummaryWS.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/22 16:29:26 by isibio            #+#    #+#             */
/*   Updated: 2025/05/29 14:53:34 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "gameSummary";

import ClientRoomDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/ClientRoomDataWS.js';

export function GameSummaryWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.gameEndReason	= "";
	this.gameRoomName	= "";
	this.clientDataArr	= [];	// Array of [objects] ClientRoomDataWS

	this.id		= id_ || DEFAULT_ID;

	// not sent in JSON
	this.printedChanges			= false;

	// - private attrubutes
	let	_this		= this;

	// *
	// * public methods
	let	initFromJSON = this.initFromJSON = function(strJSON)
	{
		let parsedJSON			= JSON.parse(strJSON);
		let parsedClientDataArr	= parsedJSON.clientDataArr;

		for (let i = 0; i < parsedClientDataArr.length; ++i)
		{
			let	clientDataArrElementJSON = JSON.stringify(parsedClientDataArr[i]);
			_this.clientDataArr.push(ClientRoomDataWS.createFromJSON(clientDataArrElementJSON));
		}

		_this.gameEndReason	= parsedJSON.gameEndReason;
		_this.gameRoomName	= parsedJSON.gameRoomName;
		_this.id			= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			gameEndReason:this.gameEndReason,
			gameRoomName:this.gameRoomName,
			clientDataArr:this.clientDataArr,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * private methods
}

GameSummaryWS.gameEndNoReason			= "no reason";
GameSummaryWS.gameEndPlayerVictory		= "player victory";
GameSummaryWS.gameEndPlayersNotUnique	= "players not unique";
GameSummaryWS.gameEndPlayerQuit			= "player quit";

// * static methods
GameSummaryWS.createFromJSON = function(strJSON)
{
	let	toReturn = new GameSummaryWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

GameSummaryWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default GameSummaryWS;
