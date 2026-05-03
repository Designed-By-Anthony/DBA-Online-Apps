-- Add Clerk user ID column for cross-domain auth via Clerk satellite domains.
-- The clerk_id maps to the `sub` claim in Clerk JWTs (e.g. "user_abc123").
ALTER TABLE users ADD COLUMN clerk_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
