// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   wsCommunications.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/03 11:24:48 by isibio            #+#    #+#             //
//   Updated: 2025/04/03 11:24:49 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import BallWS				from './ball/BallWS.js';

import BoardWS				from './board/BoardWS.js';
import BoardWallWS			from './board/BoardWallWS.js';

import HitLineWS			from './collision/HitLineWS.js';

import Controls				from './control/Controls.js';
import KeyWS				from './control/KeyWS.js';

import BallHitObjectWS				from './event/BallHitObjectWS.js'
import ClearRenderMapEventWS		from './event/ClearRenderMapEventWS.js'
import GameCountdownWS				from './event/GameCountdownWS.js'
import GameSummaryWS				from './event/GameSummaryWS.js'
import JoinRoomEventWS				from './event/JoinRoomEventWS.js'
import KeyEventWS					from './event/KeyEventWS.js'
import LaunchGameEventWS			from './event/LaunchGameEventWS.js'
import LeaveRoomEventWS				from './event/LeaveRoomEventWS.js'
import MatchmakingEventWS			from './event/MatchmakingEventWS.js'
import RoomCreationEventWS			from './event/RoomCreationEventWS.js'
import RoomLeftEventWS				from './event/RoomLeftEventWS.js'
import TournamentCreationEventWS	from './event/TournamentCreationEventWS.js'

import ClientControllingPaddlesWS	from './gameRoom/ClientControllingPaddlesWS.js';
import ClientRoomDataWS				from './gameRoom/ClientRoomDataWS.js';
import RoomObjectDataWS				from './gameRoom/RoomObjectDataWS.js';

import PaddleWS					from './paddle/PaddleWS.js';
import PaddleHitLineWS			from './paddle/PaddleHitLineWS.js';

import ClientTournamentDataWS	from './tournament/ClientTournamentDataWS.js';
import TournamentSummaryWS		from './tournament/TournamentSummaryWS.js';
import MatchDetailsWS			from './tournament/MatchDetailsWS.js';
import RoundDetailsWS			from './tournament/RoundDetailsWS.js';

import UserDetailsWS			from './user/UserDetailsWS.js';

import PointWS				from './PointWS.js';

export function wsCommunications()
{
}

wsCommunications.createObjectFromJSON = function(messageJSON)
{
	let parsedJSON = JSON.parse(messageJSON);

	if (BallWS.isGoodTypeJSON(parsedJSON.type))
		return(BallWS.createFromJSON(messageJSON));

	if (BoardWS.isGoodTypeJSON(parsedJSON.type))
		return(BoardWS.createFromJSON(messageJSON));
	if (BoardWallWS.isGoodTypeJSON(parsedJSON.type))
		return(BoardWallWS.createFromJSON(messageJSON));

	if (HitLineWS.isGoodTypeJSON(parsedJSON.type))
		return(HitLineWS.createFromJSON(messageJSON));

	if (KeyWS.isGoodTypeJSON(parsedJSON.type))
		return(KeyWS.createFromJSON(messageJSON));

	if (BallHitObjectWS.isGoodTypeJSON(parsedJSON.type))
		return(BallHitObjectWS.createFromJSON(messageJSON));
	if (ClearRenderMapEventWS.isGoodTypeJSON(parsedJSON.type))
		return(ClearRenderMapEventWS.createFromJSON(messageJSON));
	if (GameCountdownWS.isGoodTypeJSON(parsedJSON.type))
		return(GameCountdownWS.createFromJSON(messageJSON));
	if (GameSummaryWS.isGoodTypeJSON(parsedJSON.type))
		return(GameSummaryWS.createFromJSON(messageJSON));
	if (JoinRoomEventWS.isGoodTypeJSON(parsedJSON.type))
		return(JoinRoomEventWS.createFromJSON(messageJSON));
	if (KeyEventWS.isGoodTypeJSON(parsedJSON.type))
		return(KeyEventWS.createFromJSON(messageJSON));
	if (LaunchGameEventWS.isGoodTypeJSON(parsedJSON.type))
		return(LaunchGameEventWS.createFromJSON(messageJSON));
	if (LeaveRoomEventWS.isGoodTypeJSON(parsedJSON.type))
		return(LeaveRoomEventWS.createFromJSON(messageJSON));
	if (MatchmakingEventWS.isGoodTypeJSON(parsedJSON.type))
		return(MatchmakingEventWS.createFromJSON(messageJSON));
	if (RoomCreationEventWS.isGoodTypeJSON(parsedJSON.type))
		return(RoomCreationEventWS.createFromJSON(messageJSON));
	if (RoomLeftEventWS.isGoodTypeJSON(parsedJSON.type))
		return(RoomLeftEventWS.createFromJSON(messageJSON));
	if (TournamentCreationEventWS.isGoodTypeJSON(parsedJSON.type))
		return(TournamentCreationEventWS.createFromJSON(messageJSON));

	if (ClientControllingPaddlesWS.isGoodTypeJSON(parsedJSON.type))
		return(ClientControllingPaddlesWS.createFromJSON(messageJSON));
	if (ClientRoomDataWS.isGoodTypeJSON(parsedJSON.type))
		return(ClientRoomDataWS.createFromJSON(messageJSON));
	if (RoomObjectDataWS.isGoodTypeJSON(parsedJSON.type))
		return(RoomObjectDataWS.createFromJSON(messageJSON));

	if (PaddleWS.isGoodTypeJSON(parsedJSON.type))
		return(PaddleWS.createFromJSON(messageJSON));
	if (PaddleHitLineWS.isGoodTypeJSON(parsedJSON.type))
		return(PaddleHitLineWS.createFromJSON(messageJSON));

	if (ClientTournamentDataWS.isGoodTypeJSON(parsedJSON.type))
		return (ClientTournamentDataWS.createFromJSON(messageJSON));
	if (TournamentSummaryWS.isGoodTypeJSON(parsedJSON.type))
		return (TournamentSummaryWS.createFromJSON(messageJSON));
	if (MatchDetailsWS.isGoodTypeJSON(parsedJSON.type))
		return (MatchDetailsWS.createFromJSON(messageJSON));
	if (RoundDetailsWS.isGoodTypeJSON(parsedJSON.type))
		return (RoundDetailsWS.createFromJSON(messageJSON));

	if (UserDetailsWS.isGoodTypeJSON(parsedJSON.type))
		return (UserDetailsWS.createFromJSON(messageJSON));

	if (PointWS.isGoodTypeJSON(parsedJSON.type))
		return(PointWS.createFromJSON(messageJSON));

	return (null);
}


export default wsCommunications;
