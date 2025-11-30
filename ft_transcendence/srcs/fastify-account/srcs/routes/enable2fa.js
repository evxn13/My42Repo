import speakeasy from "speakeasy";

export default async function (fastify, opts) {
	fastify.post("/enable2fa", { preHandler: fastify.authenticate }, async (request, reply) => {

	  const userId = request.user.id;

	  const secret = speakeasy.generateSecret({ length: 20 });

	  fastify.db.prepare("UPDATE users SET secret2fa = ? WHERE id = ?").run(secret.base32, userId);

	  return reply.send({ success: true, otpauth_url: secret.otpauth_url, base32: secret.base32 });
	});
}
// secret.base32 => cle stocked
// secret.otpauth_url => pour QR code
