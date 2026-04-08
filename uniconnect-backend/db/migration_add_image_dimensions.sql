-- Add image dimensions to posts table
ALTER TABLE posts ADD COLUMN media_dimensions TEXT; -- JSON array of {width, height} for each media
