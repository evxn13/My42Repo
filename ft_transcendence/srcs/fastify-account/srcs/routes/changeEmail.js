export default async function (fastify, opts) {
	fastify.post("/change-email", { preHandler: fastify.authenticate }, async (request, reply) => {
		try {
			const userId = request.user.id;
			const { newEmail } = request.body;

			if (!newEmail || typeof newEmail !== "string")
		  		return reply.status(400).send({ success: false, error: "❌ new Email needed" });

			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
		  		return reply.status(400).send({ success: false, error: "❌ Invalid email format" });

			const emailExists = fastify.db.prepare("SELECT id FROM users WHERE email = ?").get(newEmail.toLowerCase());
			if (emailExists)
		  		return reply.status(400).send({ success: false, error: "❌ Email already used" });

			const update = fastify.db.prepare("UPDATE users SET email = ? WHERE id = ?");
			update.run(newEmail.toLowerCase(), userId);

			return reply.send({ success: true, message: "✅ Email updated with success !" });
		} catch (err) {
			console.error("❌ Erreur serveur :", err);
			return reply.status(500).send({ success: false, error: "Error server" });
	  	}
	});
}

