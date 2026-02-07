# Dog Import Status

## Current Status: READY - Awaiting API Permissions Fix

### Dogs Prepared for Import

#### 1. Kevin - Harlequin Male ✅ READY
- **Status:** Pending Adoption
- **Age:** 4-5 years | **Weight:** 110 lbs | **Ears:** Cropped
- **Special Needs:** Heart medication ($15-18/mo)
- **Good With:** NONE (adults only, no pets)
- **Images:** 4 images downloaded and ready
- **Script:** `scripts/create-kevin.mjs`
- **Will be live at:** `/available-danes/kevin`

#### 2. Chevy - Merle Female ✅ READY
- **Status:** Available (adoption fee sponsored)
- **Age:** 5 years | **Weight:** 108 lbs | **Ears:** Natural
- **Special Needs:** Fearful/anxious, needs experienced adopter
- **Good With:** NONE (adults/dog-savvy teens only, no pets)
- **Images:** 4 images downloaded and ready
- **Script:** `scripts/create-chevy.mjs`
- **Will be live at:** `/available-danes/chevy`

#### 3. Chloe - Brindle Female ✅ READY
- **Status:** Under Evaluation
- **Age:** 8 months | **Weight:** 90 lbs | **Ears:** Natural
- **Special Needs:** Giant breed experience required, adolescent puppy needs training
- **Good With:** Kids, Dogs, Cats (unlike Kevin and Chevy!)
- **Images:** 3 images downloaded and ready
- **Script:** `scripts/create-chloe.mjs`
- **Will be live at:** `/available-danes/chloe`

---

## Images Location

### Kevin
- Hero: `public/images/dogs/kevin/hero.jpg`
- Gallery: `public/images/dogs/kevin/gallery-[1-3].jpg`

### Chevy
- Hero: `public/images/dogs/chevy/hero.jpg`
- Gallery: `public/images/dogs/chevy/gallery-[1-3].jpg`

### Chloe
- Hero: `public/images/dogs/chloe/hero.jpg`
- Gallery: `public/images/dogs/chloe/gallery-[1-2].jpg`

---

## Import Options

### Option A: Automated Import (Requires API Fix)
Once you fix the Sanity API token permissions:

```bash
cd ~/ControlHub/RMGDRI_Website/rmgdri-site

# Import Kevin
node scripts/create-kevin.mjs

# Import Chevy
node scripts/create-chevy.mjs

# Import Chloe
node scripts/create-chloe.mjs
```

### Option B: Manual Import via Sanity Studio
If API permissions can't be fixed, manually create in Studio at `http://localhost:3000/studio`:

1. Click "+ Create" → "Dane"
2. Upload images from `public/images/dogs/[dog-name]/`
3. Copy content from scripts (description, fields, etc.)
4. Save and publish

---

## What's Working

✅ Featured Dog Profile System fully implemented:
- `DogPortableText.tsx` - Rich text rendering
- `DogFacts.tsx` - Stats + compatibility badges
- `DogGallery.tsx` - Photo gallery
- Schema updated with `body`, `ears`, enhanced `gallery`
- Detail page at `/available-danes/[slug]` ready

✅ All images downloaded and staged
✅ Import scripts created and ready
✅ Content formatted with emojis preserved
✅ Backward compatible with existing dogs (Jumbo)

---

## Blocked

❌ **Sanity API Token lacks "create" permission**
- Scripts return 403 Forbidden
- Cannot programmatically upload images or create documents
- User fixing permissions, then can proceed

---

## Next Steps

1. **Fix API permissions** → Run import scripts
2. **Run all three import scripts** (Kevin, Chevy, Chloe)
3. **Verify profiles** → Check `/available-danes/kevin`, `/available-danes/chevy`, and `/available-danes/chloe`
4. **Optional:** Convert descriptions to Portable Text for rich formatting

---

## Notes

- Kevin: NO KIDS, NO PETS - Adults only, heart medication
- Chevy: NO KIDS, NO PETS - Adults/teens only, fearful/anxious, sponsored adoption fee
- Chloe: GOOD WITH KIDS, DOGS, CATS - 8-month adolescent, needs giant breed experience
- All three scripts preserve exact wording and emojis from original content
- Gallery captions included for context
- All medical/special needs properly documented
