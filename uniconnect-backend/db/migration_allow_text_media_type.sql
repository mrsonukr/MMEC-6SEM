-- Rebuild posts table to allow 'text' in media_type CHECK constraint
PRAGMA foreign_keys = OFF;

CREATE TABLE posts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_ref INTEGER NOT NULL,
  caption TEXT,
  media_type TEXT CHECK(media_type IN ('image', 'images', 'video', 'videos', 'text')),
  media_urls TEXT,
  is_private INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  media_dimensions TEXT,
  post_id TEXT,
  FOREIGN KEY (user_id_ref) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO posts_new (
  id, user_id_ref, caption, media_type, media_urls, is_private,
  created_at, updated_at, deleted_at, media_dimensions, post_id
)
SELECT
  id,
  user_id_ref,
  caption,
  CASE WHEN media_type IS NULL THEN 'text' ELSE media_type END,
  media_urls,
  is_private,
  created_at,
  updated_at,
  deleted_at,
  media_dimensions,
  post_id
FROM posts;

DROP TABLE posts;
ALTER TABLE posts_new RENAME TO posts;

CREATE INDEX idx_posts_user_id_ref ON posts(user_id_ref);
CREATE INDEX idx_posts_media_type ON posts(media_type);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_is_private ON posts(is_private);
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
CREATE UNIQUE INDEX idx_posts_post_id_unique ON posts(post_id);

PRAGMA foreign_keys = ON;
