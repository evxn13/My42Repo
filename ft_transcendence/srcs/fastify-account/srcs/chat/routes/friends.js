export default async function (fastify, opts) {
  // const db = fastify.db ?? fastify.sqlite ?? fastify.database ?? null;
  // if (!db) throw new Error("SQLite database not accessible via Fastify instance");

  // ─────────────── Ajouter une demande d'ami ───────────────
  fastify.post('/friendsAdd', { preHandler: fastify.authenticate }, async (req, reply) => {
    const { friend_id } = req.body;
    const user_id = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    // Validation des paramètres
    if (!friend_id) {
      return reply.code(400).send({ 
        error: 'Friend ID needed.' 
      });
    }

    if (user_id === friend_id) {
      return reply.code(400).send({ 
        error: 'You cannot ad yourself.' 
      });
    }

    try {
      // Vérifier si l'ami existe
      const friendExists = fastify.db.prepare('SELECT id FROM users WHERE id = ?').get(friend_id);
      if (!friendExists) {
        return reply.code(400).send({ 
          error: 'Friend not found.' 
        });
      }

      // Vérifier si la relation d'amitié existe déjà
      const existingFriend = fastify.db.prepare(`
        SELECT status FROM friends 
        WHERE (user_id = ? AND friend_id = ?) 
        OR (user_id = ? AND friend_id = ?)
      `).get(user_id, friend_id, friend_id, user_id);

      if (existingFriend) {
        return reply.code(400).send({ 
          error: existingFriend.status === 'pending' 
            ? 'Friend request already send.' 
            : 'Already friend.' 
        });
      }

      // Ajouter la demande d'ami
      const stmt = fastify.db.prepare(`
        INSERT INTO friends (user_id, friend_id)
        VALUES (?, ?)
      `);
      stmt.run(user_id, friend_id);

      reply.send({ 
        success: true, 
        message: 'Friend requested with success.' 
      });
    } catch (err) {
      console.error('Error while adding friend:', err);
      reply.code(500).send({ 
        error: 'Error while adding friend.' 
      });
    }
  });

  // ─────────────── Récupérer les demandes d'amis en attente ───────────────
  fastify.get('/friends/pending', { preHandler: fastify.authenticate }, async (req, reply) => {
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    try {
      const rows = fastify.db.prepare(`
        SELECT f.id, f.user_id, f.friend_id, f.status, f.created_at, u.username as friend_username
        FROM friends f
        JOIN users u ON u.id = f.user_id
        WHERE f.friend_id = ? AND f.status = 'pending'
      `).all(userId);

      reply.send(rows);
    } catch (err) {
      console.error('Error while friend request handling:', err);
      reply.code(500).send({ 
        error: 'Error while friend request handling.' 
      });
    }
  });

  // ─────────────── Accepter une demande d'ami ───────────────
  fastify.patch('/friends/:id', { preHandler: fastify.authenticate }, async (req, reply) => {
    const { id } = req.params;
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    try {
      // Vérifier que la demande d'ami existe et que l'utilisateur authentifié est bien le destinataire
      const friendRequest = fastify.db.prepare(`
        SELECT * FROM friends 
        WHERE id = ? AND friend_id = ? AND status = 'pending'
      `).get(id, userId);

      if (!friendRequest) {
        return reply.code(404).send({ 
          error: 'Friend request not found or impossible to accept.' 
        });
      }

      // Accepter la demande d'ami
      const result = fastify.db.prepare(`
        UPDATE friends
        SET status = 'accepted'
        WHERE id = ?
      `).run(id);

      if (result.changes === 0) {
        return reply.code(404).send({ error: 'Error while accepting.' });
      }

      reply.send({ success: true, message: 'Request accepted.' });
    } catch (err) {
      console.error('Error while friend request accpeting:', err);
      reply.code(500).send({ error: 'Internal error.' });
    }
  });

  // ─────────────── Lister les amis acceptés ───────────────
  fastify.get('/friends', { preHandler: fastify.authenticate }, async (req, reply) => {
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    try {
      // Requête pour récupérer les amis avec leur statut de connexion
      // en excluant ceux qui sont bloqués par l'utilisateur actuel
      const rows = fastify.db.prepare(`
        SELECT DISTINCT 
          u.id, 
          u.username, 
          u.last_seen,
          f.status, 
          f.created_at,
          CASE 
            WHEN datetime(u.last_seen, '+5 minutes') > datetime('now') THEN 'online'
            ELSE 'offline'
          END as connection_status
        FROM friends f
        JOIN users u ON (u.id = f.friend_id OR u.id = f.user_id)
        WHERE (f.user_id = ? OR f.friend_id = ?) 
        AND f.status = 'accepted'
        AND u.id != ?
        -- Exclure les utilisateurs bloqués
        AND NOT EXISTS (
          SELECT 1 FROM blocked_users b 
          WHERE b.blocker_id = ? AND b.blocked_id = u.id
        )
        ORDER BY f.created_at DESC
      `).all(userId, userId, userId, userId);

      // console.log(`📋 Friends for user ${userId} (excluding blocked):`, rows); // Log de débogage

      // Transformer les données pour inclure le temps depuis la dernière connexion
      const friendsWithStatus = rows.map(friend => ({
        id: friend.id,
        username: friend.username,
        status: friend.status,
        created_at: friend.created_at,
        connection_status: friend.connection_status,
        last_seen: friend.last_seen,
        // Calculer le temps depuis la dernière connexion
        time_since_last_seen: friend.connection_status === 'offline' 
          ? calculateTimeSince(friend.last_seen)
          : null
      }));

      reply.send(friendsWithStatus);
    } catch (err) {
      console.error('Error while friend request handling:', err);
      reply.code(500).send({ error: 'Error server.' });
    }
  });

  // Fonction utilitaire pour calculer le temps écoulé
  function calculateTimeSince(lastSeen) {
    if (!lastSeen) return 'Unknown';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Right now';
    if (diffInMinutes < 60) return `Since  ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Since ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Since ${diffInDays}j`;
    
    return `Since ${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`;
  }

  // ─────────────── Bloquer un utilisateur ───────────────
  fastify.post('/block', { preHandler: fastify.authenticate }, async (req, reply) => {
    const { blocked_id } = req.body;
    const blocker_id = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    // Validation des paramètres
    if (!blocked_id) {
      return reply.code(400).send({ 
        error: 'Blocked ID user needed.' 
      });
    }

    if (blocker_id === blocked_id) {
      return reply.code(400).send({ 
        error: 'You cannot block yourself.' 
      });
    }

    try {
      // Vérifier si l'utilisateur à bloquer existe
      const userToBlock = fastify.db.prepare('SELECT id FROM users WHERE id = ?').get(blocked_id);
      if (!userToBlock) {
        return reply.code(400).send({ 
          error: 'User to block not found.' 
        });
      }

      // Vérifier si l'utilisateur est déjà bloqué
      const existingBlock = fastify.db.prepare(`
        SELECT id FROM blocked_users 
        WHERE blocker_id = ? AND blocked_id = ?
      `).get(blocker_id, blocked_id);

      if (existingBlock) {
        return reply.code(400).send({ 
          error: 'User already blocked.' 
        });
      }

      // Bloquer l'utilisateur
      const stmt = fastify.db.prepare(`
        INSERT INTO blocked_users (blocker_id, blocked_id)
        VALUES (?, ?)
      `);
      stmt.run(blocker_id, blocked_id);

      reply.send({ 
        success: true, 
        message: 'User blocked with success.' 
      });
    } catch (err) {
      console.error('Error while blocking:', err);
      reply.code(500).send({ 
        error: 'Error while blocking.' 
      });
    }
  });

  // ─────────────── Débloquer un utilisateur ───────────────
  fastify.delete('/block/:blockedId', { preHandler: fastify.authenticate }, async (req, reply) => {
    const { blockedId } = req.params;
    const blockerId = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    try {
      const result = fastify.db.prepare(`
        DELETE FROM blocked_users
        WHERE blocker_id = ? AND blocked_id = ?
      `).run(blockerId, blockedId);

      if (result.changes === 0) {
        return reply.code(404).send({ error: 'Block not found.' });
      }

      reply.send({ success: true, message: 'User unblocked.' });
    } catch (err) {
      console.error('Error while block:', err);
      reply.code(500).send({ error: 'Internal error.' });
    }
  });

  // ─────────────── Récupérer la liste des utilisateurs bloqués ───────────────
  fastify.get('/blocked', { preHandler: fastify.authenticate }, async (req, reply) => {
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token

    try {
      const rows = fastify.db.prepare(`
        SELECT b.id, b.blocked_id, b.created_at, u.username as blocked_username
        FROM blocked_users b
        JOIN users u ON u.id = b.blocked_id
        WHERE b.blocker_id = ?
        ORDER BY b.created_at DESC
      `).all(userId);

      reply.send(rows);
    } catch (err) {
      console.error('Error while users blocked handling:', err);
      reply.code(500).send({ error: 'Error server.' });
    }
  });

  // ─────────────── Vérifier si un utilisateur est bloqué ───────────────
  fastify.get('/blocked/:blockerId/:blockedId', async (req, reply) => {
    const { blockerId, blockedId } = req.params;

    try {
      const blocked = fastify.db.prepare(`
        SELECT id FROM blocked_users 
        WHERE blocker_id = ? AND blocked_id = ?
      `).get(blockerId, blockedId);

      reply.send({ isBlocked: !!blocked });
    } catch (err) {
      console.error('Error while verification block:', err);
      reply.code(500).send({ error: 'Error server.' });
    }
  });
}
