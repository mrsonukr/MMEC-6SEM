-- Add deleted_at column to existing posts table for soft delete functionality
ALTER TABLE posts ADD COLUMN deleted_at TIMESTAMP NULL;

-- Create index for deleted_at column
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
