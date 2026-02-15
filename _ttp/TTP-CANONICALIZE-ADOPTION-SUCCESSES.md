# TTP — Canonicalize /adoption-successes, Retire /successes

**Date**: 2026-02-12
**Policy**: B (Route canonicalization + redirect shims)
**Status**: In Progress

## Objective

Fully retire `/successes` routes and establish `/adoption-successes` as the canonical path structure.

## Gates

### Gate A: Prep (clean misleading artifacts)
- [ ] Delete or move `src/app/(main)/successes/[year]/page.tsx.save`

### Gate B: Create canonical routes
- [ ] `src/app/(main)/adoption-successes/page.tsx`
- [ ] `src/app/(main)/adoption-successes/[year]/page.tsx`
- [ ] `src/app/(main)/adoption-successes/[year]/[slug]/page.tsx`

### Gate C: Convert /successes into redirect shims
- [ ] `src/app/(main)/successes/page.tsx` → redirect
- [ ] `src/app/(main)/successes/[year]/page.tsx` → redirect
- [ ] `src/app/(main)/successes/[year]/[slug]/page.tsx` → redirect

### Gate D: Update internal links
- [ ] `src/app/(main)/the-dog-blog/[slug]/page.tsx` - Replace `/successes` → `/adoption-successes`

## Done Definition
- /adoption-successes exists and renders
- Any /successes* URL immediately redirects to canonical path
- No active code links to /successes

## Evidence
- TBD
