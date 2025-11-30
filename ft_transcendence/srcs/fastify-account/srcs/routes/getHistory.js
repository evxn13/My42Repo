import GameSummaryWS from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js'
export default async function (fastify, opts) {
	fastify.get("/getHistory/:userId", async (request,reply) => {
		try {
			const userId = request.params.userId;
			
			if (!userId)
				return reply.status(400).send({ success: false, error: "ID Invalid" });

			const games = fastify.db.prepare(`
			SELECT
				gs.id as game_stat_id,
				gs.statsJSONED,
				gs.match_date,
				gps.score
			FROM
				game_stats gs
			JOIN
				game_players_stats gps ON gs.id = gps.game_stat_id
			WHERE
				gps.user_id = ?
			ORDER BY
				gs.match_date DESC;
			`).all(userId);

			if (!games || games.length === 0)
				return reply.status(404).send({ success: false, error: "No games found for this user" });

			const gamesToReturn = games.map(game => {
				try {
					const parsedStats = GameSummaryWS.createFromJSON(game.statsJSONED);
					return {
						...game, //to keep all the other data
						statsJSONED: parsedStats //replacing
					};
				} catch (error) {
					console.error("Error when parsing statsJSON in getHistory");
					return {
						...game,
						statsJSONED: null
					};
				}
			});

			return reply.send({ success: true, games: gamesToReturn });
		} catch (err) {
			console.error("❌ Error getHistory:");
			return reply.status(500).send({ success: false, error: "Error getHistory" });
		}
	});
}
