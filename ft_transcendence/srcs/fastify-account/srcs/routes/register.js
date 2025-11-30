import bcrypt				from "bcryptjs";

export default async function (fastify, opts) {
	fastify.post("/register", async (request, reply) => {
		try {
			const { username, email, password, genre } = request.body;
			// === Vérifications ===
			//--- username ---
			if (!username || typeof username !== "string")
				return reply.status(400).send({ success: false, error: "❌ Username needed" });

			if (username.length < 3 || username.length > 12)
				return reply.status(400).send({ success: false, error: "❌ Username between 3 and 12 characters" });

			if (!/^[a-zA-Z0-9_]+$/.test(username))
				return reply.status(400).send({ success: false, error: "❌ Username need to be digit/characters or _" });
			//--- email ---
			if (!email || typeof email !== "string")
				return reply.status(400).send({ success: false, error: "❌ Email needed" });

			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
				return reply.status(400).send({ success: false, error: "❌ Email format invalid" });
			//--- password ---
			if (!password || typeof password !== "string")
				return reply.status(400).send({ success: false, error: "❌ Password needed" });

			if (password.length < 5 || password.length > 15)
				return reply.status(400).send({ success: false, error: "❌ Password between 5 to 15 characters" });

			if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))
				return reply.status(400).send({ success: false, error: "❌ Password need at least Maj Min and number" });
			//--- genre ---
			if (genre != "Homme" && genre != "YE")
				return reply.status(400).send({ success: false, error: "❌ Do not touch inspect" });

			// --- Hash + Insertion ---
			const hashedPW = await bcrypt.hash(password, 10);
			const tiddy = fastify.db.prepare("INSERT INTO users (username, email, password, genre, avatarDefault) VALUES (?, ?, ?, ?, ?)");
			tiddy.run(username.toLowerCase(), email.toLowerCase(), hashedPW, genre, fastify.defaultAvatar);

			return reply.send({ success: true, message: "✅ User added successfully!" });
		} catch (err) {
			console.error("❌ Erreur SQL:", err);
			if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
				if (err.message.includes("users.username"))
					return reply.status(400).send({ success: false, error: "⚠️ Username already used" });
				if (err.message.includes("users.email"))
					return reply.status(400).send({ success: false, error: "⚠️ Email already used" });
			}
			return reply.status(500).send({ success: false, error: "Internal server error" });
		}
	});
}
