# Review Guide for Lori - Step by Step

**What:** Review the new volunteer pages and sponsor page updates
**Time needed:** 10-15 minutes
**What you need:** Just a web browser (Chrome, Safari, or Firefox)

---

## Step 1: Open the Pull Request

1. Click this link: https://github.com/rayrich01/RMGDRI-Website/pull/3
2. You'll see a page with the title "Lori review fixes (volunteer/sponsor updates + assets)"

**What you're looking at:** This is a "Pull Request" - it's like a package of changes waiting to be approved before going live.

---

## Step 2: Find the Preview Link

Scroll down on the PR page until you see a section that looks like this:

```
✅ vercel bot commented 2 minutes ago

Successfully deployed to preview
🔍 Inspect: https://vercel.com/...
✅ Preview: https://rmgdri-website-git-fea-...vercel.app
```

**Click the "Preview" link** - This opens a live preview of the changes in a new tab.

**If you don't see this yet:** The build might still be running. Wait 2-3 minutes and refresh the page.

---

## Step 3: Test the New Volunteer Pages

Once the preview site opens in a new tab:

### Test 1: Main Volunteer Page

1. **In the browser address bar, add `/volunteer` to the end of the URL**
   - Example: `https://...vercel.app/volunteer`
2. **What to check:**
   - ✅ Page loads without errors
   - ✅ Title says "Volunteer - Want to Help Make a Difference?"
   - ✅ You see 6 cards with volunteer opportunities:
     - Become a Foster
     - Help Transport
     - Conduct Home Checks
     - Attend Events
     - Raise Funds
     - Many More Opportunities
   - ✅ Each card has an image (not broken/missing)
   - ✅ "Complete a Volunteer Application" button is visible
   - ✅ All text is readable (not cut off or weird formatting)

### Test 2: Volunteer Opportunities Page

1. **Change the URL to `/volunteer-opportunities`**
   - Example: `https://...vercel.app/volunteer-opportunities`
2. **What to check:**
   - ✅ Page loads with title "Volunteer Today"
   - ✅ You see a list of positions with "+" icons:
     - Social Media Specialist
     - Marketing Coordinator
     - Fundraising Coordinator
     - (and 7 more positions)
   - ✅ **Click on one of the "+" icons** - it should expand to show:
     - Description
     - Responsibilities
     - Qualifications
     - Benefits
     - "Apply for This Position" button
   - ✅ Click the "+" again - it should collapse back
   - ✅ Try expanding 2-3 different positions to make sure they all work

### Test 3: Navigation Menu

1. **Go back to the homepage** (click the logo or remove `/volunteer-opportunities` from URL)
2. **Hover over "Get Involved" in the top menu**
3. **What to check:**
   - ✅ A dropdown menu appears
   - ✅ You see "Volunteer" at the top of the menu
   - ✅ You see "Volunteer Opportunities" below it
   - ✅ Click "Volunteer" - takes you to `/volunteer` page
   - ✅ Click "Volunteer Opportunities" - takes you to `/volunteer-opportunities` page

---

## Step 4: Test the Sponsor Page Updates

### Test 1: Dark Mode Title Fix

1. **Go to `/sponsor-a-dane`**
   - Example: `https://...vercel.app/sponsor-a-dane`
2. **What to check:**
   - ✅ The big title "Sponsor-a-Dane" at the top is **white** on a **dark background**
   - ✅ The heading "Will You Be an Angel Today?" is **white** on a **dark background**
   - ✅ Both are easy to read (not black-on-black)

**Try this in different browsers if possible:**
- Chrome
- Safari
- Firefox

All should look the same.

### Test 2: Removed Content

1. **Still on the `/sponsor-a-dane` page**
2. **Scroll down to "Champion Sponsor" section** (first sponsorship level box)
3. **What to check:**
   - ✅ You should **NOT** see "Invitation to meet your sponsored Dane" in the benefits list
   - ✅ Benefits should only include:
     - Monthly photo updates and progress reports
     - Recognition on website as Champion Sponsor
     - Notification when your Dane finds their forever home

4. **Scroll down to the FAQ section**
5. **What to check:**
   - ✅ You should **NOT** see a question "Can I visit my sponsored Dane?"
   - ✅ FAQ should only have questions about:
     - What happens when my sponsored Dane is adopted?
     - Is sponsorship tax-deductible?

---

## Step 5: Test Dark Mode (Optional but Helpful)

**On a Mac:**
1. Open System Settings → Appearance
2. Try both "Light" and "Dark" modes
3. Refresh the preview site
4. **What to check:**
   - ✅ Site should **always start in light mode** (white backgrounds)
   - ✅ Regardless of your computer's setting

**On Windows:**
1. Settings → Personalization → Colors
2. Try both "Light" and "Dark" under "Choose your mode"
3. Refresh the preview site
4. **What to check:**
   - ✅ Site should **always start in light mode** (white backgrounds)

---

## Step 6: Leave Feedback

Go back to the PR page: https://github.com/rayrich01/RMGDRI-Website/pull/3

### If everything looks good:

Scroll to the bottom and click in the comment box, then type:
```
Looks good! ✅

Checked:
- Volunteer pages load and work correctly
- Sponsor page titles are readable
- Removed content is gone
- Navigation links work

Approved for merge.
```

Then click the green "Comment" button.

### If something looks wrong:

Click in the comment box and describe what you see:

**Template:**
```
Issue on [page name]:

Expected: [what you thought you'd see]
Actual: [what you actually see]
Browser: [Chrome/Safari/Firefox]

[Optional: attach a screenshot]
```

**Example:**
```
Issue on /volunteer:

Expected: Foster card to have an image
Actual: Broken image icon (blank square)
Browser: Chrome

Screenshot: [paste or drag image here]
```

---

## Quick Reference Checklist

Use this to track what you've tested:

**Volunteer Pages:**
- [ ] `/volunteer` - loads, images show, buttons work
- [ ] `/volunteer-opportunities` - loads, accordions expand/collapse
- [ ] Navigation menu shows "Volunteer" and "Volunteer Opportunities"

**Sponsor Page:**
- [ ] `/sponsor-a-dane` - title is white on dark background
- [ ] "Will You Be an Angel Today?" is white on dark background
- [ ] NO "invitation to meet your sponsored Dane" in Champion benefits
- [ ] NO "Can I visit my sponsored Dane?" in FAQ

**Cross-Browser (if possible):**
- [ ] Tested in Chrome - looks good
- [ ] Tested in Safari - looks good
- [ ] Site starts in light mode regardless of system setting

---

## What if I Get Stuck?

**Can't find the preview link?**
- Scroll down the PR page looking for "vercel bot"
- If it's not there yet, wait 2-3 minutes and refresh

**Preview link doesn't work / shows error?**
- Send Ray a message with the error you see
- The build might have failed and needs fixing

**Not sure if something is right?**
- Take a screenshot and ask Ray
- Better to ask than to assume!

**Page won't load?**
- Try refreshing the page
- Check your internet connection
- Make sure the URL ends with the right path (like `/volunteer`)

---

## What Happens After Review?

Once you approve (or Ray fixes any issues you find):

1. Ray will click "Merge pull request"
2. Changes go live on the real website (usually within 5-10 minutes)
3. You can verify on the actual rmgdri.org site

---

## Questions?

Text/call Ray or drop a comment on the PR page!

**Remember:** You're not expected to understand GitHub or code - just use the preview site like a normal website and tell Ray if anything looks weird or broken. That's perfect! 🎉
