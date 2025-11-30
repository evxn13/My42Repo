export default async function (fastify, opts) {
  fastify.post("/disable2fa", { preHandler: fastify.authenticate }, async (request, reply) => {
    const userId = request.user.id;

    try {
      const disable = fastify.db.prepare("UPDATE users SET secret2fa = NULL WHERE id = ?");
      disable.run(userId);
      fastify.db.prepare("UPDATE users SET is2fa = 0 WHERE id = ?").run(userId);
      return reply.send({ success: true, message: "2FA deactivated with success." });
    } catch (err) {
      console.error("❌ Eror deactivation 2FA:", err);
      return reply.status(500).send({ success: false, error: "Internal error: route disable" });
    }
  });
}

