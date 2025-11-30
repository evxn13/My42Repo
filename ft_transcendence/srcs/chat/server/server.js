// server/server.js -----------------------------------------------------------
// Fastify,WebSocket,SQLite,bcrypt,token validation
// ---------------------------------------------------------------------------
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import https from 'https';

// ---------------------------------------------------------------------------
// util
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number.parseInt(process.env.PORT_CHAT, 10);
const DB_FOLDER = process.env.PATH_DB_VOLUME ?? '/data';
const DB_FILE = path.join(DB_FOLDER, 'database.db');
const IS_DEV = process.env.NODE_ENV !== 'production';

const SSL_KEY_PATH = path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.key');
const SSL_CERT_PATH = path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.crt');
// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------
let logger = false;
if (IS_DEV) {
  try {
    await import('pino-pretty');
    logger = {
      transport: {
        target: 'pino-pretty',
        options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' }
      }
    };
  } catch {
    console.warn('[logger] pino-pretty non trouvé ; logs bruts.');
  }
}

const fastify = Fastify({
  logger,
  https: {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  }
});

// Garder la trace des utilisateurs connectés
const connectedUsers = new Set();
// Map pour stocker les connexions socket par utilisateur
const userSockets = new Map();

// ---------------------------------------------------------------------------
// Plugins
// ---------------------------------------------------------------------------
await fastify.register(fastifyCors, {
  origin: '*',
  credentials: true,
});

await fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../client'),
  prefix: '/static/',
});

await fastify.register(fastifyWebsocket, {
  options: {
    pingInterval: 14400000,
    pingTimeout: 14400000,
  }
});

fastify.get('/', (_, reply) => reply.sendFile('index.html'));


// ---------------------------------------------------------------------------
// SQLite
// ---------------------------------------------------------------------------

const db = new Database(`${process.env.PATH_DB_VOLUME}/database.db`);

// MAJ le last_seen d'un utilisateur
function updateUserLastSeen(username, is_online) {
  try {
    // MAJ dans la base locale du chat
    // Sync le service fastify-account
		if (!process.env.BACKEND_SECRET)
		{
			console.log("MISSING secret for backend communication, cancelling gameStats");
			return ;
		}

    let agent = new https.Agent({ rejectUnauthorized: false });
    fetch(`https://fastify-account:${process.env.PORT_FASTIFY}/auth/update-last-seen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': process.env.BACKEND_SECRET },
      body: JSON.stringify({ username: username, is_online: is_online }),
      agent
    }).catch(err => {
      console.log("❌ Error server :", err);
    });
  } catch (err) {
  }
}

// util pour parser JSON
function safeJSONParse(jsonString) {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    console.log("❌ Error server :", err);
    return null;
  }
}

// check si un utilisateur est bloqué
function isUserBlocked(blockerId, blockedId) {
  try {
    const result = db.prepare(`
      SELECT id FROM blocked_users 
      WHERE blocker_id = ? AND blocked_id = ?
    `).get(blockerId, blockedId);
    return !!result;
  } catch (err) {
    console.log("❌ Error server :", err);
    return false;
  }
}


// ---------------------------------------------------------------------------
// REST basic
// ---------------------------------------------------------------------------
fastify.post('/register', async (req, reply) => {
  const { username, email, password } = req.body ?? {};
  if (!username || !email || !password)
    return reply.code(400).send({ error: 'All fields are required.' });

  const hash = await bcrypt.hash(password, 10);
  try {
    db.prepare('INSERT INTO users(username,email,password) VALUES(?,?,?)')
      .run(username, email, hash);
    reply.code(201).send({ message: 'User registered.' });
  } catch (err) {
    console.log("❌ Error server :", err);
    reply.code(409).send({ error: 'Username or e-mail already taken.' });
  }
});

fastify.post('/login', async (req, reply) => {
  const { username, password } = req.body ?? {};
  if (!username || !password)
    return reply.code(400).send({ error: 'All fields are required.' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return reply.code(401).send({ error: 'Invalid credentials.' });

  reply.send({ message: 'Login OK.' });
});

// ---------------------------------------------------------------------------
// Fonctions utilitaires pour la gestion des messages
// ---------------------------------------------------------------------------
async function saveMessage(senderUsername, recipientUsername, content, isPrivate, messageType = 'text', gameData = null) {
  try {
    // Récupérer les IDs des utilisateurs
    let senderId = null;
    let recipientId = null;

    // Récupérer l'ID de l'expéditeur
    const senderQuery = db.prepare('SELECT id FROM users WHERE username = ?');
    const sender = senderQuery.get(senderUsername);

    if (sender) {
      senderId = sender.id;
    } else {
      // Si l'utilisateur n'existe pas dans notre base locale, on le crée avec les informations minimales
      const insertSender = db.prepare('INSERT INTO users (username) VALUES (?)');
      const result = insertSender.run(senderUsername);
      senderId = result.lastInsertRowid;
    }

    // Si c'est un message privé, récupérer l'ID du destinataire
    if (isPrivate && recipientUsername) {
      const recipientQuery = db.prepare('SELECT id FROM users WHERE username = ?');
      const recipient = recipientQuery.get(recipientUsername);

      if (recipient) {
        recipientId = recipient.id;
      } else {
        // Si le destinataire n'existe pas, on le crée aussi
        const insertRecipient = db.prepare('INSERT INTO users (username) VALUES (?)');
        const result = insertRecipient.run(recipientUsername);
        recipientId = result.lastInsertRowid;
      }
    }

    // Enregistrer le message
    const insertMessage = db.prepare(
      'INSERT INTO messages (sender_id, recipient_id, content, is_private, message_type, game_data) VALUES (?, ?, ?, ?, ?, ?)'
    );

    insertMessage.run(senderId, recipientId, content, isPrivate ? 1 : 0, messageType, gameData);

    return true;
  } catch (err) {
    console.log("❌ Error server :", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// REST pour l'historique des messages
// ---------------------------------------------------------------------------
fastify.get('/messages', async (req, reply) => {
  try {
    const { token, limit = 50, recipient = null } = req.query;

    // Valider le token
    if (!token) {
      return reply.code(401).send({ error: 'Authentication required.' });
    }


    let agent = new https.Agent({ rejectUnauthorized: false });
    const authResponse = await fetch('https://fastify-account:' + process.env.PORT_FASTIFY + '/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      agent,
    });

    if (authResponse.success == 'false') {
      return reply.code(403).send({ error: 'Invalid authentication.' });
    }

    const caca = await authResponse.json();
    const user = caca.user;
    // Obtenir l'utilisateur actuel dans la base chat (par username)
    const currentUserQuery = db.prepare('SELECT id FROM users WHERE username = ?');
    let currentUser = currentUserQuery.get(user.username);


    // Créer l'utilisateur dans la base chat s'il n'existe pas
    if (!currentUser) {
      const insertUser = db.prepare('INSERT INTO users (username) VALUES (?)');
      const result = insertUser.run(user.username);
      currentUser = { id: result.lastInsertRowid };
    }

    if (recipient) {
      // Messages privés avec un destinataire spécifique
      const recipientQuery = db.prepare('SELECT id FROM users WHERE username = ?');
      let recipientUser = recipientQuery.get(recipient);

      // Créer le destinataire dans la base chat s'il n'existe pas
      if (!recipientUser) {
        const insertRecipient = db.prepare('INSERT INTO users (username) VALUES (?)');
        const result = insertRecipient.run(recipient);
        recipientUser = { id: result.lastInsertRowid };
      }

      // Obtenir les messages privés entre l'utilisateur et le destinataire (dans les deux sens)
      // en excluant les messages des utilisateurs bloqués
      const query = db.prepare(`
        SELECT m.id, m.sender_id, m.recipient_id, m.content, m.is_private, 
               m.message_type, m.game_data, m.created_at,
               u_sender.username as sender_username, u_recipient.username as recipient_username
        FROM messages m
        JOIN users u_sender ON m.sender_id = u_sender.id
        LEFT JOIN users u_recipient ON m.recipient_id = u_recipient.id
        WHERE (
          (m.sender_id = ? AND m.recipient_id = ?) OR
          (m.sender_id = ? AND m.recipient_id = ?)
        )
        AND m.is_private = 1
        -- Exclure les messages de l'utilisateur bloqué
        AND NOT EXISTS (
          SELECT 1 FROM blocked_users b 
          WHERE b.blocker_id = ? AND b.blocked_id = m.sender_id
        )
        ORDER BY m.created_at DESC
        LIMIT ?
      `);

      const params = [currentUser.id, recipientUser.id, recipientUser.id, currentUser.id, currentUser.id, limit];

      // Exécuter la requête
      const messages = query.all(...params);

      // Transformer les résultats pour le client
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sender: msg.sender_username,
        text: msg.content,
        isPrivate: Boolean(msg.is_private),
        recipient: msg.recipient_username,
        timestamp: msg.created_at,
        type: msg.message_type || 'text',
        gameData: safeJSONParse(msg.game_data)
      })).reverse(); // Inverser pour avoir les messages les plus récents en dernier

      reply.send({ messages: formattedMessages });
    } else {
      // Retourner les anciens messages publics pour préserver l'historique
      // en excluant les messages des utilisateurs bloqués
      const query = db.prepare(`
        SELECT m.id, m.sender_id, m.recipient_id, m.content, m.is_private, 
               m.message_type, m.game_data, m.created_at,
               u_sender.username as sender_username, u_recipient.username as recipient_username
        FROM messages m
        JOIN users u_sender ON m.sender_id = u_sender.id
        LEFT JOIN users u_recipient ON m.recipient_id = u_recipient.id
        WHERE m.is_private = 0
        -- Exclure les messages de l'utilisateur bloqué
        AND NOT EXISTS (
          SELECT 1 FROM blocked_users b 
          WHERE b.blocker_id = ? AND b.blocked_id = m.sender_id
        )
        ORDER BY m.created_at DESC
        LIMIT ?
      `);

      const messages = query.all(currentUser.id, limit);

      // Transformer les résultats pour le client
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sender: msg.sender_username,
        text: msg.content,
        isPrivate: Boolean(msg.is_private),
        recipient: msg.recipient_username,
        timestamp: msg.created_at,
        type: msg.message_type || 'text',
        gameData: safeJSONParse(msg.game_data)
      })).reverse(); // Inverser pour avoir les messages les plus récents en dernier

      reply.send({ messages: formattedMessages });
    }
  } catch (err) {
    console.log("❌ Error server :", err);
    reply.code(500).send({ error: 'An error occurred while fetching messages.' });
  }
});

// ---------------------------------------------------------------------------
// WebSocket /ws-chat  : validation du token avant d'accepter
// ---------------------------------------------------------------------------
fastify.get('/ws-chat', { websocket: true }, async (conn, req) => {
  // — 1) récupérer le token dans la querystring
  const { token = '' } = req.query;

  // — 2) appeler fastify-account pour valider
  if (!token) {
    conn.socket.close();
    return;
  }

  try {
    let agent = new https.Agent({ rejectUnauthorized: false });
    const res = await fetch('https://fastify-account:' + process.env.PORT_FASTIFY + '/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      agent,
    });

    if (res.success == 'false') {
      conn.socket.close();                   // token refusé
      return;
    }
    const caca = await res.json();       // { id, username }
    const user = caca.user;

    // conserver le username sur l'objet socket
    conn.socket.username = user.username;

    // Mettre à jour le last_seen lors de la connexion
    updateUserLastSeen(user.username, true);

    // Ajouter l'utilisateur à la liste des connectés et associer le socket
    connectedUsers.add(user.username);
    userSockets.set(user.username, conn.socket);


    // Envoyer la liste des utilisateurs connectés à ce client
    conn.socket.send(JSON.stringify({
      type: 'system',
      connectedUsers: Array.from(connectedUsers)
    }));

    // Broadcast à tous les clients qu'un nouvel utilisateur s'est connecté
    for (const client of fastify.websocketServer.clients) {
      if (client !== conn.socket && client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'system',
          connectedUsers: Array.from(connectedUsers)
        }));
      }
    }
  } catch (err) {
    console.log("❌ Error server :", err);
    conn.socket.close();
    return;
  }

  // — 3) broadcast
  conn.socket.on('message', async raw => {
    const text = typeof raw === 'string' ? raw : raw.toString('utf8');
    const data = JSON.parse(text);

    // Gérer les invitations de jeu
    if (data.type === 'game_invite') {
      const recipientUsername = data.to;
      const roomId = data.roomId;
      const inviteMessage = data.message || `${conn.socket.username} vous invite à rejoindre une partie !`;


      // Sauvegarder l'invitation dans la base de données
      await saveMessage(
        conn.socket.username,
        recipientUsername,
        inviteMessage,
        true,
        'game_invite',
        JSON.stringify({ roomId })
      );


      // Lister tous les clients connectés pour debug
      const connectedClients = Array.from(fastify.websocketServer.clients).map(client => ({
        username: client.username,
        readyState: client.readyState
      }));

      // Trouver le destinataire dans les clients connectés
      let recipientFound = false;
      for (const client of fastify.websocketServer.clients) {
        if (client.username === recipientUsername && client.readyState === 1) {
          // Envoyer l'invitation de jeu au destinataire
          client.send(JSON.stringify({
            type: 'game_invite',
            from: conn.socket.username,
            roomId: roomId,
            message: inviteMessage
          }));

          // Confirmer à l'expéditeur
          conn.socket.send(JSON.stringify({
            type: 'system',
            message: `Invitation envoyée à ${recipientUsername} pour rejoindre la room: ${roomId}`
          }));
          recipientFound = true;
          break;
        }
      }

      if (!recipientFound) {
        // Si le destinataire n'est pas trouvé, l'invitation est quand même sauvegardée
        conn.socket.send(JSON.stringify({
          type: 'system',
          message: `Invitation sauvegardée pour ${recipientUsername} (hors ligne). Il la verra à sa prochaine connexion.`
        }));
      }
      return;
    }

    // Gérer l'historique de jeu
    if (data.type === 'game_history') {
      const recipientUsername = data.to;

      // Sauvegarder l'historique dans la base de données
      await saveMessage(
        'Système de jeu',
        recipientUsername,
        data.message,
        true,
        'game_history',
        JSON.stringify(data.gameData)
      );

      // Trouver le destinataire dans les clients connectés
      for (const client of fastify.websocketServer.clients) {
        if (client.username === recipientUsername && client.readyState === 1) {
          // Envoyer l'historique de jeu au destinataire
          client.send(JSON.stringify({
            type: 'game_history',
            from: 'Système de jeu',
            message: data.message,
            gameData: data.gameData,
            timestamp: new Date().toISOString()
          }));
          return;
        }
      }
      // L'historique est sauvegardé même si l'utilisateur n'est pas connecté
      return;
    }

    // Ne traiter que les messages privés (qui commencent par @username)
    if (data.message.startsWith('@')) {
      const [recipient, ...messageParts] = data.message.split(' ');
      const recipientUsername = recipient.substring(1); // Enlever le @
      const message = messageParts.join(' ');

      // Obtenir ou créer les utilisateurs pour vérifier le blocage
      const senderQuery = db.prepare('SELECT id FROM users WHERE username = ?');
      const recipientQuery = db.prepare('SELECT id FROM users WHERE username = ?');

      let senderUser = senderQuery.get(conn.socket.username);
      let recipientUser = recipientQuery.get(recipientUsername);

      // Créer l'utilisateur expéditeur s'il n'existe pas
      if (!senderUser) {
        const insertSender = db.prepare('INSERT INTO users (username) VALUES (?)');
        const result = insertSender.run(conn.socket.username);
        senderUser = { id: result.lastInsertRowid };
      }

      // Créer l'utilisateur destinataire s'il n'existe pas
      if (!recipientUser) {
        const insertRecipient = db.prepare('INSERT INTO users (username) VALUES (?)');
        const result = insertRecipient.run(recipientUsername);
        recipientUser = { id: result.lastInsertRowid };
      }

      // Vérifier si le destinataire est bloqué par l'expéditeur
      if (isUserBlocked(senderUser.id, recipientUser.id)) {
        conn.socket.send(JSON.stringify({
          type: 'system',
          message: `Vous avez bloqué ${recipientUsername}. Débloquez-le pour pouvoir lui envoyer des messages.`
        }));
        return;
      }

      // Sauvegarder le message privé dans la base de données
      await saveMessage(conn.socket.username, recipientUsername, message, true);

      // Sending the message to the sender
      conn.socket.send(JSON.stringify({
        username: conn.socket.username,
        message: message,
        isPrivate: true,
        recipient: recipientUsername
      }));

      // Trouver le destinataire dans les clients connectés
      for (const client of fastify.websocketServer.clients) {
        if (client.username === recipientUsername && client.readyState === 1) {
          // Envoyer au destinataire
          client.send(JSON.stringify({
            username: conn.socket.username,
            message: message,
            isPrivate: true
          }));
          return;
        }
      }
    } else {
      // Refuser les messages publics
      conn.socket.send(JSON.stringify({
        type: 'system',
        message: 'Seuls les messages privés sont autorisés. Utilisez @username pour envoyer un message privé.'
      }));
    }
  });

  conn.socket.on('close', () => {
    // Retirer l'utilisateur de la liste des connectés et supprimer la référence du socket
    if (conn.socket.username) {
      // Mettre à jour le last_seen lors de la déconnexion
      updateUserLastSeen(conn.socket.username, false);

      // Ne supprimer que si c'est le même socket qui est stocké pour cet utilisateur
      if (userSockets.get(conn.socket.username) === conn.socket) {
        connectedUsers.delete(conn.socket.username);
        userSockets.delete(conn.socket.username);

        // Broadcast à tous les clients qu'un utilisateur s'est déconnecté
        for (const client of fastify.websocketServer.clients) {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'system',
              connectedUsers: Array.from(connectedUsers)
            }));
          }
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Route pour les invitations de jeu
// ---------------------------------------------------------------------------
fastify.post('/game-invite', async (req, reply) => {
  try {
    const { type, to, roomId, message } = req.body ?? {};

    // Extraire le token du header Authorization ou de la query string
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }


    // Valider le token d'authentification
    if (!token) {
      // fastify.log.warn(`❌ Missing authentication token`);
      return reply.code(401).send({ error: 'Authentication required.' });
    }
    // Valider le token avec fastify-account
    let agent = new https.Agent({ rejectUnauthorized: false });
    const res = await fetch('https://fastify-account:' + process.env.PORT_FASTIFY + '/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      agent,
    });

    if (res.success == 'false') {
      // fastify.log.warn(`❌ Invalid authentication token`);
      return reply.code(401).send({ error: 'Invalid authentication.' });
    }
    const caca = await res.json();
    const fromUser = caca.user.username; // Obtenir le username depuis le token authentifié

    if (!to || !roomId) {
      // fastify.log.warn(`❌ Missing required fields - to: "${to}", roomId: "${roomId}"`);
      return reply.code(400).send({ error: 'Recipient and roomId are required.' });
    }

    const inviteMessage = message || `${fromUser} vous invite à rejoindre une partie !`;

    // Sauvegarder l'invitation dans la base de données
    const saveResult = await saveMessage(
      fromUser,
      to,
      inviteMessage,
      true,
      'game_invite',
      JSON.stringify({ roomId })
    );

    // if (saveResult) {
    // } else {
      // fastify.log.warn(`⚠️ Failed to save game invite to database for ${to}`);
    // }

    // Lister tous les clients connectés pour debug
    const connectedClients = Array.from(fastify.websocketServer.clients).map(client => ({
      username: client.username,
      readyState: client.readyState
    }));

    // Trouver le destinataire dans les clients connectés
    let clientFound = false;
    for (const client of fastify.websocketServer.clients) {
      if (client.username === to && client.readyState === 1) {
        // Envoyer l'invitation en temps réel
        const inviteWsMessage = {
          type: 'game_invite',
          from: fromUser,
          roomId: roomId,
          message: inviteMessage,
          timestamp: new Date().toISOString()
        };


        client.send(JSON.stringify(inviteWsMessage));
        clientFound = true;
        break;
      }
    }

    // if (!clientFound) {
    //   fastify.log.warn(`❌ Client ${to} not found in connected WebSocket clients or not ready`);
    // }

    reply.send({ success: true, message: 'Game invite sent successfully' });
  } catch (err) {
    console.log("❌ Error server :", err);
    reply.code(500).send({ error: 'An error occurred while sending the game invite.' });
  }
});

// ---------------------------------------------------------------------------
// Route pour l'historique de jeu
// ---------------------------------------------------------------------------
fastify.post('/game-history', async (req, reply) => {
  try {
    const { type, to, message, gameData } = req.body ?? {};

    // Extraire le token du header Authorization ou de la query string
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }


    // Valider le token d'authentification
    if (!token) {
      // fastify.log.warn(`❌ Missing authentication token`);
      return reply.code(401).send({ error: 'Authentication required.' });
    }

    // Valider le token avec fastify-account
    let agent = new https.Agent({ rejectUnauthorized: false });
    const res = await fetch('https://fastify-account:' + process.env.PORT_FASTIFY + '/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      agent,
    });

    if (res.success == 'false') {
      // fastify.log.warn(`❌ Invalid authentication token`);
      return reply.code(401).send({ error: 'Invalid authentication.' });
    }

    const caca = await res.json();
    const user = caca.user;

    if (!to || !message) {
      // fastify.log.warn(`❌ Missing required fields - to: "${to}", message: "${message}"`);
      return reply.code(400).send({ error: 'Recipient and message are required.' });
    }


    // Sauvegarder l'historique dans la base de données
    const saveResult = await saveMessage(
      'Système de jeu',
      to,
      message,
      true,
      'game_history',
      JSON.stringify(gameData)
    );

    // if (saveResult) {
    // } else {
    //   fastify.log.warn(`⚠️ Failed to save game history to database for ${to}`);
    // }

    // Lister tous les clients connectés pour debug
    const connectedClients = Array.from(fastify.websocketServer.clients).map(client => ({
      username: client.username,
      readyState: client.readyState
    }));

    // Trouver le destinataire dans les clients connectés
    let clientFound = false;
    for (const client of fastify.websocketServer.clients) {
      if (client.username === to && client.readyState === 1) {
        // Envoyer l'historique en temps réel
        const historyMessage = {
          type: 'game_history',
          from: 'Système de jeu',
          message: message,
          gameData: gameData,
          timestamp: new Date().toISOString()
        };


        client.send(JSON.stringify(historyMessage));
        clientFound = true;
        break;
      }
    }

    // if (!clientFound) {
    //   fastify.log.warn(`❌ Client ${to} not found in connected WebSocket clients or not ready`);
    // }

    reply.send({ success: true, message: 'Game history sent successfully' });
  } catch (err) {
    console.log("❌ Error server :", err);
    reply.code(500).send({ error: 'An error occurred while sending the game history.' });
  }
});

// ---------------------------------------------------------------------------
// Route INTERNE pour les notifications de tournoi (utilisée par game_backend)
// ---------------------------------------------------------------------------
fastify.post('/internal/tournament-notification', async (req, reply) => {
  try {
    const { type, to, tournamentName, roundNumber, message, nextOpponent, allMatches } = req.body ?? {};


    // Vérifier que la requête vient du réseau Docker interne (optionnel pour plus de sécurité)
    const clientIP = req.ip || req.socket.remoteAddress;

    if (!to || !message) {
      // fastify.log.warn(`❌ Missing required fields - to: "${to}", message: "${message}"`);
      return reply.code(400).send({ error: 'Recipient and message are required.' });
    }


    // Sauvegarder la notification dans la base de données
    const saveResult = await saveMessage(
      'Tournament System',
      to,
      message,
      true,
      'tournament_notification',
      JSON.stringify({
        tournamentName,
        roundNumber,
        nextOpponent,
        allMatches
      })
    );

    // if (saveResult) {
    // } else {
    //   fastify.log.warn(`⚠️ Failed to save tournament notification to database for ${to}`);
    // }

    // Lister tous les clients connectés pour debug
    const connectedClients = Array.from(fastify.websocketServer.clients).map(client => ({
      username: client.username,
      readyState: client.readyState
    }));

    // Trouver le destinataire dans les clients connectés
    let clientFound = false;
    for (const client of fastify.websocketServer.clients) {
      if (client.username === to && client.readyState === 1) {
        // Envoyer la notification en temps réel
        const notificationMessage = {
          type: 'tournament_notification',
          from: 'Tournament System',
          message: message,
          tournamentName: tournamentName,
          roundNumber: roundNumber,
          nextOpponent: nextOpponent,
          allMatches: allMatches,
          timestamp: new Date().toISOString()
        };


        client.send(JSON.stringify(notificationMessage));
        clientFound = true;
        break;
      }
    }

    // if (!clientFound) {
    //   fastify.log.warn(`❌ Client ${to} not found in connected WebSocket clients or not ready`);
    // }

    reply.send({ success: true, message: 'Tournament notification sent successfully' });
  } catch (err) {
    console.log("❌ Error server :", err);
    reply.code(500).send({ error: 'An error occurred while sending the tournament notification.' });
  }
});

// ---------------------------------------------------------------------------
// Route pour les notifications de tournoi (sécurisée pour les clients)
// ---------------------------------------------------------------------------
fastify.post('/tournament-notification', async (req, reply) => {
  try {
    const { type, to, tournamentName, roundNumber, message, nextOpponent, allMatches } = req.body ?? {};

    // Extraire le token du header Authorization ou de la query string
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }


    // Valider le token d'authentification
    if (!token) {
      // fastify.log.warn(`❌ Missing authentication token`);
      return reply.code(401).send({ error: 'Authentication required.' });
    }

    // Valider le token avec fastify-account
    let agent = new https.Agent({ rejectUnauthorized: false });
    const res = await fetch('https://fastify-account:' + process.env.PORT_FASTIFY + '/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      agent,
    });

    if (res.success == 'false') {
      // fastify.log.warn(`❌ Invalid authentication token`);
      return reply.code(401).send({ error: 'Invalid authentication.' });
    }

    const caca = await res.json();
    const user = caca.user;

    if (!to || !message) {
      // fastify.log.warn(`❌ Missing required fields - to: "${to}", message: "${message}"`);
      return reply.code(400).send({ error: 'Recipient and message are required.' });
    }


    // Sauvegarder la notification dans la base de données
    const saveResult = await saveMessage(
      'Tournament System',
      to,
      message,
      true,
      'tournament_notification',
      JSON.stringify({
        tournamentName,
        roundNumber,
        nextOpponent,
        allMatches
      })
    );

    // if (saveResult) {
    // } else {
    //   fastify.log.warn(`⚠️ Failed to save tournament notification to database for ${to}`);
    // }

    // Lister tous les clients connectés pour debug
    const connectedClients = Array.from(fastify.websocketServer.clients).map(client => ({
      username: client.username,
      readyState: client.readyState
    }));

    // Trouver le destinataire dans les clients connectés
    let clientFound = false;
    for (const client of fastify.websocketServer.clients) {
      if (client.username === to && client.readyState === 1) {
        // Envoyer la notification en temps réel
        const notificationMessage = {
          type: 'tournament_notification',
          from: 'Tournament System',
          message: message,
          tournamentName: tournamentName,
          roundNumber: roundNumber,
          nextOpponent: nextOpponent,
          allMatches: allMatches,
          timestamp: new Date().toISOString()
        };


        client.send(JSON.stringify(notificationMessage));
        clientFound = true;
        break;
      }
    }

    // if (!clientFound) {
    //   fastify.log.warn(`❌ Client ${to} not found in connected WebSocket clients or not ready`);
    // }

    reply.send({ success: true, message: 'Tournament notification sent successfully' });
  } catch (err) {
    console.log("❌ Error server :", err);
    reply.code(500).send({ error: 'An error occurred while sending the tournament notification.' });
  }
});

// 404
fastify.setNotFoundHandler((req, reply) =>
  reply.code(404).send({ error: 'Route not found' })
);

// ---------------------------------------------------------------------------
// Démarrage
// ---------------------------------------------------------------------------
await fastify.listen({ port: process.env.PORT_CHAT_HTTPS, host: '0.0.0.0' });
