-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref   INTEGER NOT NULL,
  post_id_ref   INTEGER NOT NULL,
  comment_text  TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id_ref) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_user_id_ref ON comments(user_id_ref);
CREATE INDEX IF NOT EXISTS idx_comments_post_id_ref ON comments(post_id_ref);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
