import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

async function tokenVerif(fastify, opts) {
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(403).send({ success: false, error: "⛔ Missing token" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

	  const user = fastify.db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.id);
	  if (!user)
		  return reply.code(403).send({ success: false, error: "User not found" });

      request.user = decoded; // Ajoute user à la requête
    } catch (err) {
      return reply.status(403).send({ success: false, error: "⛔ Invalid token" });
    }
  });
}

export default fp(tokenVerif);
