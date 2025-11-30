export default async function (fastify, opts) {
	fastify.post("/change-username", { preHandler: fastify.authenticate }, async (request, reply) => {
		try {
			const userId = request.user.id;
			const { newUsername } = request.body;

			// ✅ Vérification du nouveau username
			if (!newUsername || typeof newUsername !== "string")
				return reply.status(400).send({ success: false, error: "❌ newUsername needed" });

			if (newUsername.length < 3 || newUsername.length > 12)
				return reply.status(400).send({ success: false, error: "❌ newUsername need to be 3 to 12 characters" });

			if (!/^[a-zA-Z0-9_]+$/.test(newUsername))
				return reply.status(400).send({ success: false, error: "❌ newUsername need to be characters/digits or _" });

			// 🔎 Vérifie si le nom est déjà utilisé
			const existingUser = fastify.db.prepare("SELECT id FROM users WHERE username = ?").get(newUsername.toLowerCase());
			if (existingUser)
				return reply.status(400).send({ success: false, error: "❌ Username already exists" });

			// 🔁 Mise à jour
			const update = fastify.db.prepare("UPDATE users SET username = ? WHERE id = ?");
			const result = update.run(newUsername.toLowerCase(), userId);

			if (result.changes === 0)
				return reply.status(404).send({ success: false, error: "❌ User not found" });

			return reply.send({ success: true, message: "✅ Username updated !" });
		} catch (err) {
			console.log("❌ Error server :", err);
			return reply.status(500).send({ success: false, error: "Error server" });
		}
	});
}
