/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logger.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/10 10:20:29 by isibio            #+#    #+#             */
/*   Updated: 2025/05/29 15:05:00 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let	no_log			= 0;
let	partcial_log	= 1;
let	complete_log	= 2;

export let logConditions = {
	"backend_incommingMessage":			no_log,
	"backend_outcommingMessage":		no_log,
	"backend_connection":				complete_log,
	"backend_disconnection":			complete_log,
	"backend_matchmaking":				partcial_log,
	"backend_gameRoomCreation":			partcial_log,
	"backend_tournamentRoomCreation":	partcial_log,
	"backend_roomDestruction":			complete_log,

	"frontend_connectionToBackend":				no_log,
	"frontend_outcommingMessage":				no_log,
	"frontend_incommingMessage":				no_log,
	"frontend_incommingMessageParsing":			no_log,
	"frontend_incommingMessageHandlingJSON":	no_log,

	"game_ai_connectionToBackend":				no_log,
	"game_ai_disconnectionFromBackend":			no_log,
	"game_ai_outcommingMessage":				no_log,
	"game_ai_incommingMessage":					no_log,
	"game_ai_incommingMessageParsing":			no_log,
	"game_ai_incommingMessageHandlingJSON":		no_log,

	"aiServer_connection":						complete_log,
	"aiServer_incommingRequest":				complete_log,
	"aiServer_serverError":						complete_log,

	"gameRoom_clientJoin":						complete_log,
	"gameRoom_clientLeave":						complete_log,

	"tournamentRoom_clientJoin":				complete_log,
	"tournamentRoom_gameLaunching":				complete_log,
	"tournamentRoom_gameManagment":				complete_log,
	"tournamentRoom_gameEnding":				complete_log,
	"tournamentRoom_clientLeave":				complete_log,
	"tournamentRoom_chatNotification":			complete_log,

	"acanavatFormulaVector_calcul_details":		no_log,

	"return_indication":			no_log,

	"JSONParsing":					complete_log,
	"note":							complete_log,
};

export function logger(type, level = "log", message = "", parcial = "", logMessageBool = true)
{
	let messageToLog		= "";
	let	actualLogCondirion	= logConditions[type];

	// * condition to send message if level is higher than just 'log' (not really higher in fact, just not equal to)
	if (level != "log")
	{
		messageToLog += message;
		messageToLog += parcial

		if (logMessageBool)
			logMessage(level, messageToLog);
		return (messageToLog);
	}

	if (actualLogCondirion == no_log)
		return (messageToLog);

	messageToLog += message;
	if (actualLogCondirion == complete_log)
		messageToLog += parcial

	if (logMessageBool)
		logMessage(level, messageToLog);
	return (messageToLog);
}
export default logger;

function	logMessage(level, message)
{
	if (level == "log")
		console.log(message);
	if (level == "warn")
		console.warn(message);
	if (level == "err" || level == "error")
		console.error(message);
}
