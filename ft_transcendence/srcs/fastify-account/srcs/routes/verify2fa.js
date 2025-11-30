import speakeasy from "speakeasy";

export default async function (fastify, opts) {
  fastify.post("/verify2fa", { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user.id;
    const { token } = request.body;

    if (!token)
      return reply.status(400).send({ success: false, error: "Code 2FA needed" });

    const row = fastify.db.prepare("SELECT secret2fa FROM users WHERE id = ?").get(userId);
    if (!row || !row.secret2fa)
      return reply.status(400).send({ success: false, error: "2FA not activated" });

    const verified = speakeasy.totp.verify({
      secret: row.secret2fa,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified)
      return reply.status(400).send({ success: false, error: "❌ Invalid code" });

	fastify.db.prepare("UPDATE users SET is2fa = 1 WHERE id = ?").run(userId);
	return reply.send({ success: true, message: "✅ Code 2FA verified with success !" });
  });
}

