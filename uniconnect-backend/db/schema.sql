CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT UNIQUE NOT NULL,
  username    TEXT UNIQUE,
  full_name   TEXT NOT NULL,
  role        TEXT CHECK(role IN ('student','teacher')) NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  profile_picture_url TEXT,
  bio         TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref     INTEGER NOT NULL UNIQUE,
  auth_provider   TEXT NOT NULL,
  password_hash   TEXT,
  google_id       TEXT,
  last_login      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref INTEGER NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMP NOT NULL,
  used        INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id         TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL,
  refresh_token_hash TEXT,
  ip_address         TEXT,
  device             TEXT,
  browser            TEXT,
  os                 TEXT,
  country            TEXT,
  login_time         DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active        DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at         DATETIME NOT NULL,
  is_active          INTEGER DEFAULT 1
);
