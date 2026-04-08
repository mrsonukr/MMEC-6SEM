-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref   INTEGER NOT NULL,
  caption       TEXT,
  media_type    TEXT CHECK(media_type IN ('image', 'images', 'video', 'videos')),
  media_urls    TEXT, -- JSON array of media URLs
  is_private    INTEGER DEFAULT 0, -- 0 = public, 1 = private
  deleted_at    TIMESTAMP NULL, -- NULL for active posts, timestamp for deleted posts
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX idx_posts_user_id_ref ON posts(user_id_ref);
CREATE INDEX idx_posts_media_type ON posts(media_type);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_is_private ON posts(is_private);
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
