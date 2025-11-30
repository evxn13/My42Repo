CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	genre TEXT NOT NULL,
	avatar TEXT,
	avatarDefault TEXT,
	secret2fa TEXT,
	is2fa INTEGER DEFAULT 0,
	numOfGames INTEGER DEFAULT 0,
	wins INTEGER DEFAULT 0,
	losses INTEGER DEFAULT 0,
	total_score INTEGER DEFAULT 0,
	is_online INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending', 'accepted')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER,
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT 0,
    message_type TEXT DEFAULT 'text',
    game_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blocked_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blocker_id INTEGER NOT NULL,
  blocked_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blocker_id, blocked_id),
  FOREIGN KEY (blocker_id) REFERENCES users(id),
  FOREIGN KEY (blocked_id) REFERENCES users(id)
); -- Table pour le chat, bloquer, evscheid?

CREATE TABLE IF NOT EXISTS game_stats (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	statsJSONED TEXT UNIQUE,
	match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LINKING TABLE
CREATE TABLE IF NOT EXISTS game_players_stats (
	game_stat_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	score INTEGER DEFAULT 0,

	PRIMARY KEY (game_stat_id, user_id),
	FOREIGN KEY (game_stat_id) REFERENCES game_stats(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players_stats (user_id);
CREATE INDEX IF NOT EXISTS idx_game_players_game_stat_id ON game_players_stats (game_stat_id);
