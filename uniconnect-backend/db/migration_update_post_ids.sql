-- Update posts table to use custom string IDs instead of auto-increment
-- This migration will:
-- 1. Add a new column for custom IDs
-- 2. Generate custom IDs for existing posts
-- 3. Drop the old auto-increment ID
-- 4. Rename the custom ID column to be the primary key

-- Step 1: Add new custom_id column
ALTER TABLE posts ADD COLUMN custom_id TEXT;

-- Step 2: Generate custom IDs for existing posts
UPDATE posts SET custom_id = lower(hex(randomblob(6))) WHERE custom_id IS NULL;

-- Step 3: Make custom_id unique and not null
ALTER TABLE posts ADD CONSTRAINT unique_custom_id UNIQUE (custom_id);
ALTER TABLE posts ALTER COLUMN custom_id SET NOT NULL;

-- Step 4: Update foreign key references (if any exist)
-- Note: This would need to be done carefully if other tables reference posts.id

-- Step 5: Create new indexes for custom_id
CREATE INDEX idx_posts_custom_id ON posts(custom_id);

-- Note: The final step of dropping the old id column and renaming custom_id to id
-- should be done after confirming everything works, as it's a destructive operation
