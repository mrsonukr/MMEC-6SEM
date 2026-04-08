-- Add post_id column to posts table
-- This will store the 12-character custom post IDs while keeping the auto-increment id as primary key

ALTER TABLE posts ADD COLUMN post_id TEXT;

-- Create index for post_id for faster lookups
CREATE INDEX idx_posts_post_id ON posts(post_id);
