import GameSummaryWS from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js'

import UserDetailsWS from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js'

export default async function (fastify, opts) {
	fastify.post("/gameStats", async (request, reply) => {
		try {
			const authorization = request.headers.authorization;
			if (authorization !== process.env.BACKEND_SECRET)
				return reply.status(498).send({ success: false, error:"Wait a minute, you're not supposed to call this route... ABORT REQUEST"  });

			const stats = request.body;
			const statsToStore = await JSON.stringify(stats);
			//Need to stringify again because fastify has automatic JSON.parse() (request is a stringified javascript Object)

			const tiddy = fastify.db.prepare("INSERT INTO game_stats (statsJSONED) VALUES (?)");
			const tiddyResult = tiddy.run(statsToStore); //to be able to access ID
			const statsID = tiddyResult.lastInsertRowid; //get the ID of stats just stored
		
			const linkStatsWithUser = fastify.db.prepare("INSERT INTO game_players_stats (game_stat_id, user_id, score) VALUES (?, ?, ?)");

			const gameSummary = GameSummaryWS.createFromJSON(statsToStore);

			let update;
			for (const clientData of gameSummary.clientDataArr)
			{
				let id = clientData.userDetails.userId
				if (typeof id === 'number' && id !== UserDetailsWS.AnonymousId && id !== UserDetailsWS.AiId)
				{	
					linkStatsWithUser.run(statsID, id, clientData.points);

					if (clientData.isVictory === true ||
						(gameSummary.gameEndReason === "player quit" && clientData.clientDisconnected === false))
						update = fastify.db.prepare("UPDATE users SET wins = wins + 1, numOfGames = numOfGames + 1, total_score = total_score + ? WHERE id = ?");
					else
						update = fastify.db.prepare("UPDATE users SET losses = losses + 1, numOfGames = numOfGames + 1, total_score = total_score + ? WHERE id = ?");
					update.run(clientData.points, id);
				}
				else if (id === UserDetailsWS.AnonymousId)
					console.log("Anonymous client, CANNOT SAVE GAME STATS");
				else if (id === UserDetailsWS.AiId)
					console.log("AI Detected, skipping game stats saving process");
				else
					console.log("Unexpected ID type or value: ID = ", id, ", Type = ", typeof id);
			}

			return reply.send({ success: true, message: "✅ Game stats saved!" });
		} catch (err) {
			console.error("❌ Error gameStats:", err);
			return reply.status(500).send({ success: false, error: "Error gameStats" });
		}
	});
}

//saving JSONIFIED Javascript OBJECT of gameStats
