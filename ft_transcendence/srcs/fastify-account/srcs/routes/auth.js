export default async function routes(fastify, opts) {
  // Route pour valider un token JWT
  fastify.post('/auth/validate', async (req, reply) => {
    const { token } = req.body;

    if (!token) {
      return reply.code(400).send({ error: 'Token is required' });
    }

    try {
      const decoded = fastify.jwt.verify(token);
      return { user: decoded };
    } catch (err) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });

  // Route pour mettre à jour le last_seen d'un utilisateur
  fastify.post('/auth/update-last-seen', async (req, reply) => {
    const { username, is_online } = req.body;
    const authorization = req.headers.authorization;

    if (authorization !== process.env.BACKEND_SECRET)
      return reply.status(498).send({ success: false, error: "Wait a minute, you're not supposed to call this route... ABORT REQUEST" });

    if (!username) {
      return reply.code(400).send({ error: 'Username is required' });
    }

    if (typeof is_online !== 'boolean')
      return reply.code(400).send({ error: 'is_online must be a boolean' });

    try {
      const db = fastify.db ?? fastify.sqlite ?? fastify.database ?? null;
      if (!db) throw new Error("SQLite database not accessible via Fastify instance");

      const isOnlineValue = Number(!!is_online);
      const updateStmt = db.prepare('UPDATE users SET last_seen = CURRENT_TIMESTAMP, is_online = ? WHERE username = ?');
      updateStmt.run(isOnlineValue, username);

      return { success: true };
    } catch (err) {
      fastify.log.error('Error updating last_seen and is_online:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
