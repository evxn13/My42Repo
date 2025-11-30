import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

async function databasePlugin(fastify, opts) {
  try {
    const db = new Database(`${process.env.PATH_DB_VOLUME}/database.db`);
    fastify.log.info('✅ Connected to SQLite database.');
    
    // Assurer que la colonne last_seen existe (migration si nécessaire)
    try {
      db.prepare('SELECT last_seen FROM users LIMIT 1').get();
    } catch (err) {
      if (err.code === 'SQLITE_ERROR' && err.message.includes('no such column: last_seen')) {
        fastify.log.info('Adding last_seen column to users table...');
        db.prepare('ALTER TABLE users ADD COLUMN last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP').run();
        fastify.log.info('✅ Added last_seen column to users table.');
      }
    }
    
    // Assurer que la table blocked_users existe (migration si nécessaire)
    try {
      db.prepare('SELECT 1 FROM blocked_users LIMIT 1').get();
    } catch (err) {
      if (err.code === 'SQLITE_ERROR' && err.message.includes('no such table: blocked_users')) {
        fastify.log.info('Creating blocked_users table...');
        db.prepare(`
          CREATE TABLE blocked_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blocker_id INTEGER NOT NULL,
            blocked_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(blocker_id, blocked_id),
            FOREIGN KEY (blocker_id) REFERENCES users(id),
            FOREIGN KEY (blocked_id) REFERENCES users(id)
          )
        `).run();
        fastify.log.info('✅ Created blocked_users table.');
      }
    }

    // Décorer fastify avec la base de données
    fastify.decorate('db', db);

    // Fonction pour mettre à jour le last_seen d'un utilisateur
    function updateUserLastSeen(username) {
      try {
        const updateStmt = db.prepare('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE username = ?');
        updateStmt.run(username);
        fastify.log.info(`Updated last_seen for user: ${username}`);
      } catch (err) {
        fastify.log.error('Error updating last_seen:', err);
      }
    }

    // Décorer fastify avec la fonction updateUserLastSeen
    fastify.decorate('updateUserLastSeen', updateUserLastSeen);

    // Hook pour fermer la base quand Fastify se ferme
    fastify.addHook('onClose', (fastify, done) => {
      db.close();
      fastify.log.info('✅ SQLite connection closed.');
      done();
    });

  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
}

export default fp(databasePlugin); 
