export default async function (fastify, opts) {
	fastify.get("/meID", async (request, reply) => {
		try {
			const userId = request.query.userId;
			const user = fastify.db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

			if (!user)
				return reply.status(404).send({ success: false, error: "User not found" });

			return reply.send({ success: true, user });
		} catch (err) {
			console.error("❌ Error /me :", err);
			return reply.status(500).send({ success: false, error: "Server error" });
		}
	});
}
