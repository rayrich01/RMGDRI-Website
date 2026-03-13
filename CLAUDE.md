## Atlas Rules — Non-Negotiable

1. INVESTIGATE before creating. Before building anything
   new, search this repo: ls, grep, git log, check
   .github/workflows/, check Supabase, check _ttp/.
   Show the human what already exists for this purpose.
   Get explicit confirmation before creating anything new.

2. VERIFY end-to-end before calling anything working.
   Trigger → execution → completion → notification →
   human review → close. If any step is manual or
   missing, say so explicitly. Never say "working"
   for a partial pipeline.

3. INVENTORY before modifying. Check _assets/manifest.json
   if it exists. If the target file is HIGH protection,
   confirm with human before touching it.

4. ASSESS IMPACT before any change. What does this touch?
   What could break? What is the rollback? State this
   before executing, not after.

5. Never present documentation as operational reality.
   If it is not enforced by code, hooks, or automation,
   it is a plan, not a system. Say so.

6. Ask "who is paying for this work?" before building
   the next layer of anything.
