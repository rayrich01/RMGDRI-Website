-- CR-INTENT-001: Intent Engineering Workbook storage
-- Single-row JSONB profile per user/session, keyed by a slug.

CREATE TABLE IF NOT EXISTS intent_profile (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE DEFAULT 'default',
  data        jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS: service-role only (no public access)
ALTER TABLE intent_profile ENABLE ROW LEVEL SECURITY;
