# Lori QA — Volunteer Application (PR #7)

**Preview URL**: https://rmgdri-site-a1lcmdgsj-ray-richardsons-projects-4591755e.vercel.app

## Navigation
- [ ] From the main site header, hover over **Get Involved** dropdown
- [ ] Confirm **Volunteer** link appears (between Foster Application and Sponsor a Dane)
- [ ] Click **Volunteer** → confirm it navigates to `/apply/volunteer`

## Form Review
- [ ] Page title: "Volunteer Application"
- [ ] All 6 sections visible:
  1. Applicant Information (name, email, phone, city, state)
  2. Availability (weekdays, weekends, hours/month)
  3. Volunteer Roles (16 checkboxes)
  4. Experience (dog experience, giant breed experience)
  5. Consent & Signature (certification checkbox + typed signature)
  6. Additional Notes (optional)

## Volunteer Roles — verify all 16 present
- [ ] Application Processor
- [ ] Home Checker
- [ ] Transport Volunteer
- [ ] Social Media
- [ ] Marketing
- [ ] Fundraising
- [ ] Blog Writer
- [ ] Follow-up Specialist
- [ ] Foster Coordinator
- [ ] Event Coordinator
- [ ] Medical Director
- [ ] Adoption Director
- [ ] Intake Director
- [ ] Supplies Coordinator
- [ ] Transport Coordinator
- [ ] Bookkeeper

## Validation Tests
- [ ] Try submitting with **no roles** selected → should show inline error
- [ ] Try submitting with required fields empty → should show "This field is required" messages
- [ ] Complete all fields, pick at least one role, submit → success confirmation appears

## Report Back
- [ ] Missing roles or incorrect labels?
- [ ] Anything that should be required but isn't?
- [ ] Anything that should be optional but is marked required?
- [ ] Any confusing wording or layout issues?
