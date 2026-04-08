-- Create new users table with username column
CREATE TABLE users_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT UNIQUE NOT NULL,
  username    TEXT UNIQUE,
  full_name   TEXT NOT NULL,
  role        TEXT CHECK(role IN ('student','teacher')) NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old table to new table
INSERT INTO users_new (id, user_id, full_name, role, email, created_at, updated_at)
SELECT id, user_id, full_name, role, email, created_at, updated_at
FROM users;

-- Drop old table
DROP TABLE users;

-- Rename new table to users
ALTER TABLE users_new RENAME TO users;

-- Create index for username
CREATE INDEX idx_users_username ON users(username);
