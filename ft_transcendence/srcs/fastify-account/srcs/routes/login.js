import bcrypt				from "bcryptjs";
import jwt					from 'jsonwebtoken';
import speakeasy			from 'speakeasy';

export default async function (fastify, opts) {
	fastify.post("/login", async (request, reply) => {
		const { username, password, twoFactorCode } = request.body;
		const usernameClean = username.trim();
		//=== Verifications ===
		//--- username ---
		if (!usernameClean || typeof usernameClean !== "string")
			return reply.status(400).send({ success: false, error: "❌ Username needed" });

		if (usernameClean.length < 3 || usernameClean.length > 12)
			return reply.status(400).send({ success: false, error: "❌ Username between 3 and 12 characters" });

		if (!/^[a-zA-Z0-9_]+$/.test(usernameClean))
			return reply.status(400).send({ success: false, error: "❌ Username invalid" });
		//--- password ---
		if (!password || typeof password !== "string")
			return reply.status(400).send({ success: false, error: "❌ Password needed" });

		try {
			const babaou = fastify.db.prepare("SELECT * FROM users WHERE username = ?");
			const user = babaou.get(usernameClean);

			if (!user)
				return reply.status(401).send({ success: false, error: "❌ User not found" });

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch)
				return reply.status(400).send({ success: false, error: "❌ Invalid password" });

			// 2fa check
			if (user.is2fa === 1) {
				if (!twoFactorCode) {
					const emailToSend = user.email;
					return reply.status(206).send({ success: false, error: "Code 2FA needed", emailToSend });
				}

				const verified = speakeasy.totp.verify({
					secret: user.secret2fa,
					encoding: 'base32',
					token: twoFactorCode,
					window: 1, // autorise decalage de 30s
				});

				if (!verified)
					return reply.status(400).send({ success: false, error: "❌ Code 2FA invalid" });
			}
			// Login Complet. Generation JWTtoken
			const payload = { id: user.id, username: user.username, email: user.email };
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
			console.log("🔐 Token send to frontend:", token);

			return reply.send({ success: true, message: "✅ Login successful!", token });
		} catch (err) {
			console.error("❌ Erreur login:", err);
			return reply.status(500).send({ success: false, error: "Error login.js" });
		}
	});
}
