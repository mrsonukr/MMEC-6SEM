-- Add username column to users table
ALTER TABLE users ADD COLUMN username TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_users_username ON users(username);
