export default async function (fastify, opts) {
	fastify.post("/change-avatar", { preHandler: fastify.authenticate }, async (request, reply) => {
		try {
			const userId = request.user.id;
			const { avatar } = request.body;

				//fastify.validateAvatar(avatar);

			if (!avatar || typeof avatar !== "string")
			return reply.status(400).send({ success: false, error: "❌ Invalid Image" });

			const stmt = fastify.db.prepare("UPDATE users SET avatar = ? WHERE id = ?");
			stmt.run(avatar, userId);

			return reply.send({ success: true, message: "✅ Avatar uqdated with success !" });
		} catch (err) {
			if (err.statusCode === 400)
				return reply.status(400).send({ success: false, error: "❌ ❌ ❌ ❌ Error 400: change acanavatar" });

			return reply.status(500).send({ success: false, error: err.message || "Error: change AVATAR" });
		}
	});
}
