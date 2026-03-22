#!/usr/bin/env bash
set -euo pipefail

URL="$1"
EXPECT="$2"

BODY="$(curl -s "$URL")"

if [[ "$BODY" == *"$EXPECT"* ]]; then
  echo "VALIDATED_SUCCESS"
  exit 0
else
  echo "VALIDATION_FAILED"
  exit 1
fi
