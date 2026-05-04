CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  product_slug TEXT NOT NULL,
  tier TEXT NOT NULL,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product_slug ON purchases(product_slug);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_stripe_session_id ON purchases(stripe_session_id);
