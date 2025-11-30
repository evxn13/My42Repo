export default async function (fastify, opts) {
	fastify.get("/me", { preHandler: fastify.authenticate }, async (request, reply) => {
		try { 
			const userId = request.user.id; // token = decoded dans token verif
			const user = fastify.db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

			//user presence in DB checked in preHandler
			return reply.send({ success: true, user });
		} catch (err) {
			console.error("❌ Error on /me :", err);
			return reply.status(500).send({ success: false, error: "Error server" });
		}
	});
}

