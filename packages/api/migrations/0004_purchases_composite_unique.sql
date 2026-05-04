-- Replace single-column unique on stripe_session_id with composite unique
-- on (stripe_session_id, product_slug) to support multi-tool checkouts.
DROP INDEX IF EXISTS idx_purchases_stripe_session_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_session_slug ON purchases(stripe_session_id, product_slug);
