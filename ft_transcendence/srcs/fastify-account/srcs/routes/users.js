export default async function routes(fastify, opts) {
  fastify.get('/users', async (req, reply) => {
    const db = fastify.db ?? fastify.sqlite ?? fastify.database ?? null;
    if (!db) return reply.code(500).send({ error: "Database not accessible" });

    try {
      const users = db.prepare('SELECT id, username FROM users').all();
      return users;
    } catch (err) {
      fastify.log.error('Error fetching users:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
} 