export default async function (fastify, opts) {
    fastify.get("/you/:username", async (request, reply) => {
      try {
        const { username } = request.params;
        
        const user = fastify.db.prepare(`
          SELECT id, username, email, genre, avatar, avatarDefault, is2fa, numOfGames, wins, losses, total_score, is_online, created_at FROM users WHERE username = ?

        `).get(username);
  
        if (!user) {
          return reply.status(404).send({ 
            success: false, 
            error: "User not found" 
          });
        }
  
        return reply.send({ success: true, user });
      } catch (err) {
        console.error("❌ Error /you/:username :", err);
        return reply.status(500).send({ 
          success: false, 
          error: "Error server" 
        });
      }
    });
  }
