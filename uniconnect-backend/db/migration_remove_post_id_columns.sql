-- Remove post_id and custom_id columns from posts table
-- This cleans up the database after simplifying the media upload flow

DROP INDEX idx_posts_post_id;
DROP INDEX idx_posts_custom_id;
ALTER TABLE posts DROP COLUMN post_id;
ALTER TABLE posts DROP COLUMN custom_id;
