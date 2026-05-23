ALTER TABLE brand_kit
ADD COLUMN IF NOT EXISTS instagram_access_token     TEXT,
ADD COLUMN IF NOT EXISTS instagram_token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS instagram_user_id          TEXT,
ADD COLUMN IF NOT EXISTS instagram_connected        BOOLEAN DEFAULT FALSE;
