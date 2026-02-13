#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(pwd)"
CONFIG_FILE="src/config/contact.ts"
TS="$(date +"%Y-%m-%d__CENTRALIZE_CONTACT_EMAILS__%H%M%S")"
EVD="$REPO_ROOT/_ttp/evidence/$TS"
mkdir -p "$EVD"

echo "=== Centralize Contact Emails ===" | tee "$EVD/00_header.txt"
echo "Repo: $REPO_ROOT" | tee -a "$EVD/00_header.txt"
echo "Config file: $CONFIG_FILE" | tee -a "$EVD/00_header.txt"
echo "Evidence: $EVD" | tee -a "$EVD/00_header.txt"
echo | tee -a "$EVD/00_header.txt"

# Gate A: Pre-scan - capture all current email usage
echo "=== Gate A: Pre-scan email usage ===" | tee "$EVD/01_prescan.txt"
grep -r "@rmgreatdane.org" --include="*.tsx" --include="*.ts" -n src/ 2>/dev/null | \
  grep -v node_modules | tee -a "$EVD/01_prescan.txt" || true
echo | tee -a "$EVD/01_prescan.txt"

# Gate B: Create contact config file
echo "=== Gate B: Create contact config ===" | tee "$EVD/02_create_config.txt"
mkdir -p src/config
cat > "$CONFIG_FILE" << 'CONFIGEOF'
/**
 * Centralized contact information for RMGDRI
 * Single source of truth for all email addresses used throughout the site
 */

export const CONTACT_EMAILS = {
  /** General information and inquiries */
  INFO: 'info@rmgreatdane.org',
  
  /** Adoption inquiries and applications */
  ADOPTION: 'adoptadane@rmgreatdane.org',
  
  /** Volunteer program inquiries */
  VOLUNTEER: 'volunteer@rmgreatdane.org',
  
  /** Dog rehoming/surrender inquiries */
  REHOME: 'rehome@rmgreatdane.org',
  
  /** Placement coordinator */
  PLACEMENTS: 'placements@rmgreatdane.org',
  
  /** Training program inquiries */
  TRAINING: 'Training@rmgreatdane.org',
} as const

export type ContactEmailKey = keyof typeof CONTACT_EMAILS
CONFIGEOF

echo "Created: $CONFIG_FILE" | tee -a "$EVD/02_create_config.txt"
cat "$CONFIG_FILE" | tee -a "$EVD/02_create_config.txt"
echo | tee -a "$EVD/02_create_config.txt"

# Gate C: Update Footer
echo "=== Gate C: Update Footer ===" | tee "$EVD/03_update_footer.txt"
FOOTER_FILE="src/components/Footer.tsx"

# Add import at top (after existing imports)
if ! grep -q "import { CONTACT_EMAILS }" "$FOOTER_FILE" 2>/dev/null; then
  # Find the last import line and add our import after it
  sed -i '' "/^import.*from/a\\
import { CONTACT_EMAILS } from '@/config/contact'
" "$FOOTER_FILE" 2>/dev/null || \
  perl -i -pe 's/(^import.*from.*$)/$1\nimport { CONTACT_EMAILS } from '\''@\/config\/contact'\''/' "$FOOTER_FILE"
fi

# Replace hardcoded emails
perl -i -pe 's/mailto:adoptadane\@rmgreatdane\.org/mailto:${CONTACT_EMAILS.ADOPTION}/g' "$FOOTER_FILE"
perl -i -pe 's/"adoptadane\@rmgreatdane\.org"/{CONTACT_EMAILS.ADOPTION}/g' "$FOOTER_FILE"
perl -i -pe "s/'adoptadane\@rmgreatdane\.org'/{CONTACT_EMAILS.ADOPTION}/g" "$FOOTER_FILE"
perl -i -pe 's/>adoptadane\@rmgreatdane\.org</>{{CONTACT_EMAILS.ADOPTION}}</g' "$FOOTER_FILE"

echo "Updated: $FOOTER_FILE" | tee -a "$EVD/03_update_footer.txt"
echo | tee -a "$EVD/03_update_footer.txt"

# Gate D: Update key pages
echo "=== Gate D: Update key pages ===" | tee "$EVD/04_update_pages.txt"

# Helper function to update a page file
update_page() {
  local FILE=$1
  local EMAIL_CONST=$2
  local EMAIL_ADDR=$3
  
  echo "Updating: $FILE (${EMAIL_CONST})" | tee -a "$EVD/04_update_pages.txt"
  
  # Add import if not present
  if ! grep -q "import { CONTACT_EMAILS }" "$FILE" 2>/dev/null; then
    sed -i '' "/^import.*from/a\\
import { CONTACT_EMAILS } from '@/config/contact'
" "$FILE" 2>/dev/null || \
    perl -i -pe 's/(^import.*from.*$)/$1\nimport { CONTACT_EMAILS } from '\''@\/config\/contact'\''/' "$FILE"
  fi
  
  # Replace mailto: hrefs
  perl -i -pe "s/mailto:${EMAIL_ADDR}/mailto:\${CONTACT_EMAILS.${EMAIL_CONST}}/g" "$FILE"
  # Replace quoted strings
  perl -i -pe "s/\"${EMAIL_ADDR}\"/{CONTACT_EMAILS.${EMAIL_CONST}}/g" "$FILE"
  perl -i -pe "s/'${EMAIL_ADDR}'/{CONTACT_EMAILS.${EMAIL_CONST}}/g" "$FILE"
  # Replace text content (careful with JSX)
  perl -i -pe "s/>${EMAIL_ADDR}</>{CONTACT_EMAILS.${EMAIL_CONST}}</g" "$FILE"
}

# Update volunteer page
update_page "src/app/(main)/volunteer/page.tsx" "VOLUNTEER" "volunteer@rmgreatdane.org"

# Update shelter-transfers page
update_page "src/app/(main)/shelter-transfers/page.tsx" "INFO" "info@rmgreatdane.org"

# Update rehome page
update_page "src/app/(main)/rehome-a-dane/page.tsx" "REHOME" "rehome@rmgreatdane.org"

# Update available-danes detail page
update_page "src/app/(main)/available-danes/[slug]/page.tsx" "PLACEMENTS" "placements@rmgreatdane.org"

# Update surrender page (has both ADOPTION and TRAINING)
FILE="src/app/(main)/surrender/page.tsx"
echo "Updating: $FILE (ADOPTION + TRAINING)" | tee -a "$EVD/04_update_pages.txt"
if ! grep -q "import { CONTACT_EMAILS }" "$FILE" 2>/dev/null; then
  sed -i '' "/^import.*from/a\\
import { CONTACT_EMAILS } from '@/config/contact'
" "$FILE" 2>/dev/null || \
  perl -i -pe 's/(^import.*from.*$)/$1\nimport { CONTACT_EMAILS } from '\''@\/config\/contact'\''/' "$FILE"
fi
perl -i -pe 's/mailto:adoptadane\@rmgreatdane\.org/mailto:${CONTACT_EMAILS.ADOPTION}/g' "$FILE"
perl -i -pe 's/"adoptadane\@rmgreatdane\.org"/{CONTACT_EMAILS.ADOPTION}/g' "$FILE"
perl -i -pe 's/>adoptadane\@rmgreatdane\.org</>{{CONTACT_EMAILS.ADOPTION}}</g' "$FILE"
perl -i -pe 's/mailto:Training\@rmgreatdane\.org/mailto:${CONTACT_EMAILS.TRAINING}/g' "$FILE"
perl -i -pe 's/"Training\@rmgreatdane\.org"/{CONTACT_EMAILS.TRAINING}/g' "$FILE"
perl -i -pe 's/>Training\@rmgreatdane\.org</>{{CONTACT_EMAILS.TRAINING}}</g' "$FILE"

# Update foster-application page
update_page "src/app/(main)/foster-application/page.tsx" "INFO" "info@rmgreatdane.org"

# Update our-board page
update_page "src/app/(main)/our-board/page.tsx" "INFO" "info@rmgreatdane.org"

# Update adoption-application page
update_page "src/app/(main)/adoption-application/page.tsx" "INFO" "info@rmgreatdane.org"

# Update AI client (special case - just the string)
AI_FILE="src/lib/ai/client.ts"
if [ -f "$AI_FILE" ]; then
  echo "Updating: $AI_FILE" | tee -a "$EVD/04_update_pages.txt"
  if ! grep -q "import { CONTACT_EMAILS }" "$AI_FILE" 2>/dev/null; then
    sed -i '' "/^import.*from/a\\
import { CONTACT_EMAILS } from '@/config/contact'
" "$AI_FILE" 2>/dev/null || \
    perl -i -pe 's/(^import.*from.*$)/$1\nimport { CONTACT_EMAILS } from '\''@\/config\/contact'\''/' "$AI_FILE"
  fi
  perl -i -pe 's/adoptadane\@rmgreatdane\.org/${CONTACT_EMAILS.ADOPTION}/g' "$AI_FILE"
fi

echo | tee -a "$EVD/04_update_pages.txt"

# Gate E: Post-scan verification
echo "=== Gate E: Post-scan verification ===" | tee "$EVD/05_postscan.txt"
echo "Checking for remaining hardcoded emails..." | tee -a "$EVD/05_postscan.txt"
if grep -r "@rmgreatdane.org" --include="*.tsx" --include="*.ts" -n src/ 2>/dev/null | \
   grep -v "CONTACT_EMAILS" | \
   grep -v "config/contact.ts" | \
   grep -v node_modules | tee -a "$EVD/05_postscan.txt"; then
  echo "⚠️  WARNING: Some hardcoded emails still remain" | tee -a "$EVD/05_postscan.txt"
else
  echo "✅ PASS: All emails centralized or in config file" | tee -a "$EVD/05_postscan.txt"
fi
echo | tee -a "$EVD/05_postscan.txt"

# Gate F: Diffstat
echo "=== Gate F: Diffstat ===" | tee "$EVD/06_diffstat.txt"
git diff --stat | tee -a "$EVD/06_diffstat.txt"
echo | tee -a "$EVD/06_diffstat.txt"

echo "=== DONE ===" | tee "$EVD/99_done.txt"
echo "Evidence folder: $EVD" | tee -a "$EVD/99_done.txt"
echo | tee -a "$EVD/99_done.txt"
echo "Next steps:" | tee -a "$EVD/99_done.txt"
echo "  1. Review changes: git diff" | tee -a "$EVD/99_done.txt"
echo "  2. Test locally: npm run dev" | tee -a "$EVD/99_done.txt"
echo "  3. Commit: git add -A && git commit -m 'refactor: centralize contact emails in config'" | tee -a "$EVD/99_done.txt"
echo "  4. Push: git push" | tee -a "$EVD/99_done.txt"
