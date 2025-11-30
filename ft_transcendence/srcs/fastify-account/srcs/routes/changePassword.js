import bcrypt from 'bcryptjs';

export default async function (fastify, opts) {
	fastify.post("/change-password", { preHandler: fastify.authenticate }, async (request, reply) => {
		try {
			const userId = request.user.id;
			const { oldPassword, newPassword } = request.body;
			const user = fastify.db.prepare("SELECT password FROM users WHERE id = ?").get(userId);
			if (!user)
				return reply.status(404).send({ success: false, error: "User not found" });

			const isCorrect = await bcrypt.compare(oldPassword, user.password);
			if (!isCorrect)
				return reply.status(400).send({ success: false, error: "Bad old password" });

			if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 5 || newPassword.length > 15 ||
				!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
				return reply.status(400).send({ success: false, error: "❌ Invalid password" });
			}
		
			const hashed = await bcrypt.hash(newPassword, 10);
			fastify.db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, userId);

			return reply.send({ success: true, message: "✅ Password changed with success" });
		} catch (err) {
			console.error("❌ Error server :", err);
			return reply.status(500).send({ success: false, error: "Error server" });
		}
	});
}
