// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   TournamentSummaryWS.js                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/03 16:37:35 by isibio            #+#    #+#             //
//   Updated: 2025/06/03 16:37:36 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let	DEFAULT_ID	= "no id";
let	TYPE_JSON	= "tournamentSummary";

import ClientTournamentDataWS	from './ClientTournamentDataWS.js';
import GameSummaryWS			from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js';

export function TournamentSummaryWS(id_ = DEFAULT_ID, type_ = TYPE_JSON)
{
	// - public attrubutes
	this.type	= type_ || TYPE_JSON;

	this.tournamentEndReason	= "";
	this.tournmamentName		= "";	// - ???
	this.clientDataArr			= [];	// Array of [objects] ClientTournamentDataWS
	this.gameSummaryArr			= [];	// Array of [objects] GameSummaryWS
	this.nbRounds				= 0;

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
		let parsedHitLineArr		= parsedJSON.clientDataArr;
		let parsedGameSummaryArr	= parsedJSON.gameSummaryArr;

		for (let i = 0; i < parsedHitLineArr.length; ++i)
		{
			let	clientDataArrElementJSON = JSON.stringify(parsedHitLineArr[i]);
			_this.clientDataArr.push(ClientTournamentDataWS.createFromJSON(clientDataArrElementJSON));
		}

		for (let i = 0; i < parsedGameSummaryArr.length; ++i)
		{
			let	gameSummaryElementJSON = JSON.stringify(parsedGameSummaryArr[i]);
			_this.gameSummaryArr.push(GameSummaryWS.createFromJSON(gameSummaryElementJSON));
		}

		_this.tournamentEndReason	= parsedJSON.tournamentEndReason;
		_this.tournmamentName		= parsedJSON.tournmamentName;
		_this.nbRounds				= parsedJSON.nbRounds;
		_this.id					= parsedJSON.id;

		return (_this);
	}

	let	createJSON = this.createJSON = function(boolReturnParsed = false)
	{
		let toReturn = JSON.stringify({
			type:this.type,

			tournamentEndReason:this.tournamentEndReason,
			tournmamentName:this.tournmamentName,
			clientDataArr:this.clientDataArr,
			gameSummaryArr:this.gameSummaryArr,
			nbRounds:this.nbRounds,

			id:this.id,
		});
		if (boolReturnParsed)
			return (JSON.parse(toReturn));
		return (toReturn);
	}

	// * this method will return an array of ClientTournamentDataWS sorted by descending order
	// * arguments :
	// *		return2dArray: boolean, if this argument is true, this function will return a 2d array sorted
	// *					   by 'clientData.maxRoundPlayed'
	// * note: this function uses a second array (2d array named ranckingArrArr) to store data like this :
	// * 		players's maxRound 0 -> []
	// * 		players's maxRound 1 -> [client][client]
	// * 		players's maxRound 2 -> [client][client]
	let	getClientByRanckingArr = this.getClientByRanckingArr = function(return2dArray = false)
	{
		let ranckingArr			= [];
		let ranckingArrArr		= [[]];
		let ranckingArrArrLen	= _this.nbRounds;

		// * allocate the sub-arrays of ranckingArrArr and pushing values in it
		for (let i = 0; i <= ranckingArrArrLen; ++i)
			ranckingArrArr[i] = new Array(0);
		for (let clientData of _this.clientDataArr)
			ranckingArrArr[clientData.maxRoundPlayed].push(clientData);

		if (return2dArray)
			return (ranckingArrArr);

		// * passing values from 2d array to 1d simple array
		for (let i = ranckingArrArrLen; i; i--)
			for (let clientData of ranckingArrArr[i])
				ranckingArr.push(clientData);
		return (ranckingArr);
	}
	// * private methods
}

TournamentSummaryWS.tournamentEndNoReason			= "no reason";
TournamentSummaryWS.tournamentEndPlayerVictory		= "player victory";
TournamentSummaryWS.tournamentEndPlayersNotUnique	= "players not unique";
TournamentSummaryWS.tournamentEndPlayerQuit			= "player quit";

// * static methods
TournamentSummaryWS.createFromJSON = function(strJSON)
{
	let	toReturn = new TournamentSummaryWS;

	toReturn.initFromJSON(strJSON);
	return (toReturn);
}

TournamentSummaryWS.isGoodTypeJSON = function(typeToTest)
{
	if (typeToTest == TYPE_JSON)
		return (true);
	return (false);
}

export default TournamentSummaryWS;
