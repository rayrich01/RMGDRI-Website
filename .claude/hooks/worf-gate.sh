#!/bin/bash
set -euo pipefail

# Worf Gate — pre-execution protection
# Standard: Worf-Pre-Execution-Gate-Standard-v1
# Source: 01_System-HQ/Atlas-Architecture/03_MCP-Framework/Worf-Pre-Execution-Gate-Standard-v1.md

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

# If no file path detected, allow (non-file operations)
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# === CORE PROTECTED PATTERNS (do not remove or modify) ===
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

# === REPO-SPECIFIC EXTENSIONS (add below this line) ===

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
