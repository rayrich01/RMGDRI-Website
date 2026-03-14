#!/bin/bash
set -euo pipefail

# Worf Gate — minimum viable pre-edit protection
# Denies modifications to governance, config, and infrastructure files.
# Uses Claude Code PreToolUse hook with permissionDecision: deny.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

# If no file path detected, allow (non-file operations)
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Protected paths — these require human confirmation via the permission prompt
PROTECTED=(
  ".env"
  ".env.local"
  ".env.production"
  "package.json"
  "package-lock.json"
  ".github/"
  "CLAUDE.md"
  "_atlas/"
  "_cr/"
  "_assets/"
  "next.config"
  "tsconfig"
  "tailwind.config"
  ".claude/settings"
  ".claude/hooks/"
)

for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    # Output structured deny — Claude sees the reason and must ask the human
    jq -n --arg reason "Worf gate: '$FILE_PATH' matches protected pattern '$pattern'. Human confirmation required." '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: $reason
      }
    }'
    exit 0
  fi
done

# File passes — allow silently
exit 0
