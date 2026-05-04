-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref   INTEGER NOT NULL,
  post_id_ref   INTEGER NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id_ref, post_id_ref),
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id_ref) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_likes_user_id_ref ON likes(user_id_ref);
CREATE INDEX IF NOT EXISTS idx_likes_post_id_ref ON likes(post_id_ref);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);
