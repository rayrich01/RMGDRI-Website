-- CR Task Queue for TTP-0120 Stage 3
-- GitHub Issues/PR comments → task queue → Claude Code executor → completion notifier

CREATE TABLE IF NOT EXISTS cr_tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cr_number     integer NOT NULL,                          -- GitHub issue number
  tenant        text NOT NULL DEFAULT 'rmgdri',            -- multi-tenant routing
  source        text NOT NULL CHECK (source IN ('github-issue', 'github-pr-comment')),
  source_url    text NOT NULL,                             -- full GitHub URL
  category      text NOT NULL CHECK (category IN ('content-update', 'feature-request', 'dog-record', 'bug', 'unknown')),
  priority      text NOT NULL DEFAULT 'nice-to-have' CHECK (priority IN ('urgent', 'before-launch', 'nice-to-have')),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'executing', 'review', 'done', 'blocked', 'escalated', 'failed')),
  title         text NOT NULL,
  description   text,                                      -- parsed CR body
  page_url      text,                                      -- target page if known
  payload       jsonb NOT NULL DEFAULT '{}',                -- full parsed fields from issue template
  requester     text,                                      -- GitHub username
  result        jsonb,                                      -- executor output: commit, files_changed, preview_url, summary
  error         text,                                      -- failure message if any
  attempts      integer NOT NULL DEFAULT 0,
  auto_execute  boolean NOT NULL DEFAULT false,             -- whether this can run without Ray's approval
  created_at    timestamptz NOT NULL DEFAULT now(),
  queued_at     timestamptz,
  started_at    timestamptz,
  completed_at  timestamptz
);

-- Index for executor polling
CREATE INDEX idx_cr_tasks_status ON cr_tasks (status, priority, created_at);
CREATE INDEX idx_cr_tasks_tenant ON cr_tasks (tenant, status);

-- RLS: service-role only (no public access)
ALTER TABLE cr_tasks ENABLE ROW LEVEL SECURITY;
