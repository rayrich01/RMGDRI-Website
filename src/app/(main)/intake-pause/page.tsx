import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { rescueIntakeControlQuery } from "@/lib/sanity/queries";
import type { IntakeControl } from "@/lib/intake/intake-status";

export const revalidate = 60;

// ── Safe defaults (current hardcoded values) ──
const DEFAULTS = {
  heading: "Check Back",
  body: `Please remember that Rocky Mountain Great Dane Rescue is a wholly volunteer-run organization and depends entirely on our foster families and volunteer team to care for the Danes that come into rescue.

As we continue transitioning to our updated adoption, foster, and Dane intake processes, we do not currently have the staffing capacity to support standard Owner Surrender and Shelter Intake requests through our legacy process.

We are still reviewing a limited number of intake situations on a case-by-case basis when urgency, available foster capacity, and rescue resources allow.

Submission of a request does not guarantee acceptance, immediate placement, or an immediate response.`,
  email: "rehome@rmgreatdane.org",
  instructions: `Please include:
- your name
- phone number
- city and state
- whether this is an owner surrender or shelter case
- the dog's age and sex
- the reason the situation is urgent
- any immediate medical or behavioral concerns`,
  returnLabel: "Return Home",
  returnHref: "/",
  title: "Check Back — Intake Temporarily Paused | RMGDRI",
};

export async function generateMetadata() {
  let control: IntakeControl | null = null;
  try {
    control = await sanityClient.fetch(rescueIntakeControlQuery, {}, { next: { revalidate: 60 } });
  } catch { /* fallback */ }

  return {
    title: control?.pausePageTitle || DEFAULTS.title,
    description: "Owner Surrender and Shelter Intake requests are temporarily paused while we transition to updated operations.",
  };
}

export default async function IntakePausePage() {
  let control: IntakeControl | null = null;
  try {
    control = await sanityClient.fetch(rescueIntakeControlQuery, {}, { next: { revalidate: 60 } });
  } catch {
    // Singleton unavailable — fallback to hardcoded defaults
  }

  const heading = control?.pausePageHeading || DEFAULTS.heading;
  const body = control?.pausePageBody || DEFAULTS.body;
  const email = control?.intakeReviewEmail || DEFAULTS.email;
  const instructions = control?.limitedReviewInstructions || DEFAULTS.instructions;
  const showReturn = control?.returnHomeEnabled ?? true;
  const returnLabel = control?.returnHomeLabel || DEFAULTS.returnLabel;
  const returnHref = control?.returnHomeHref || DEFAULTS.returnHref;

  const instructionLines = instructions
    .split("\n")
    .map(line => line.replace(/^-\s*/, "").trim())
    .filter(line => line.length > 0 && !line.toLowerCase().startsWith("please include"));

  const bodyParagraphs = body.split("\n\n").filter(p => p.trim().length > 0);

  return (
    <main className="pb-20 bg-white">
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{heading}</h1>
          <p className="text-xl text-gray-600">
            Owner Surrender and Shelter Intake requests are temporarily paused.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none text-gray-700 mb-10">
          {bodyParagraphs.map((para, i) => {
            if (i === bodyParagraphs.length - 1 && para.toLowerCase().includes("does not guarantee")) {
              return <p key={i} className="text-gray-500 text-base italic">{para}</p>;
            }
            return <p key={i}>{para}</p>;
          })}
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limited Intake Review</h2>
          <p className="text-gray-700 mb-6">
            If you believe your situation requires limited intake review, please contact us at:
          </p>
          <a href={`mailto:${email}`} className="inline-block text-lg font-semibold text-teal-700 hover:text-teal-800 mb-6">
            {email}
          </a>
          {instructionLines.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-teal-100">
              <p className="font-medium text-gray-800 mb-3">Please include:</p>
              <ul className="space-y-2 text-gray-700">
                {instructionLines.map((line, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-teal-500 mr-2 mt-1">•</span>{line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href={`mailto:${email}`} className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors text-center">
            Email Intake Review
          </a>
          {showReturn && (
            <Link href={returnHref} className="inline-block bg-gray-100 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors text-center">
              {returnLabel}
            </Link>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm">
          Thank you for your understanding and patience as we work to stabilize and strengthen our rescue operations.
        </p>
      </div>
    </main>
  );
}
