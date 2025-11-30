import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";

export default async function (fastify, opts) {
  fastify.post("/verify2fa-google", async (request, reply) => {
    const { id, token } = request.body;

    if (!id || !token)
      return reply.status(400).send({ success: false, error: "❌ Bruh (verify2fagoogle)" });

    const user = fastify.db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!user || !user.secret2fa)
      return reply.status(400).send({ success: false, error: "❌ User not found or 2FA deactivated" });

    const valid = speakeasy.totp.verify({
      secret: user.secret2fa,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!valid)
      return reply.status(400).send({ success: false, error: "❌ Invalid code" });

    const payload = { email: user.email, id: user.id, name: user.username };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    reply.send({ success: true, token: jwtToken });
  });
}

