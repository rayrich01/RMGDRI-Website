import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Volunteer With Us | Rocky Mountain Great Dane Rescue',
  description:
    'Volunteer with RMGDRI and help Great Danes in Colorado, Idaho, New Mexico, Montana, Utah, and Wyoming. Explore roles from fostering coordination to events.',
  openGraph: {
    title: 'Volunteer With Us | Rocky Mountain Great Dane Rescue',
    description:
      'Join our volunteer team and make a difference in the lives of Great Danes across the Rocky Mountain region.',
  },
}

export default function VolunteersPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer With Us</h1>
      <p className="text-xl text-teal-700 font-medium mb-8">
        Make a Difference for Great Danes
      </p>

      {/* CTA — Begin Application */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Ready to Volunteer?
        </h2>
        <p className="text-gray-700 mb-4">
          We are always looking for compassionate people to join our team. Fill
          out our volunteer application and we will match you with a role that
          fits your skills and schedule.
        </p>
        <Link
          href="/apply/volunteer"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Start Volunteer Application
        </Link>
      </div>

      {/* Main Content */}
      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <p>
            Rocky Mountain Great Dane Rescue is a 100% volunteer-run
            organization. Every person who helps us &mdash; from processing
            applications to driving transports &mdash; does so because they love
            Great Danes and want to see them thrive.
          </p>
          <p>
            RMGDRI currently serves{' '}
            <strong>
              Colorado, Idaho, New Mexico, Montana, Utah, and Wyoming
            </strong>
            . We need volunteers in all of these areas (and virtual volunteers
            too!).
          </p>
        </section>

        {/* Volunteer Roles */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            Volunteer Roles
          </h2>
          <p className="mb-4">
            We have a wide variety of roles to fit almost any skill set and time
            commitment. Here are some of the ways you can help:
          </p>

          <div className="grid gap-4 md:grid-cols-2 not-prose">
            {[
              {
                title: 'Application Processor',
                desc: 'Review and process adoption, foster, and surrender applications.',
              },
              {
                title: 'Home Checker',
                desc: 'Visit prospective adopter and foster homes to ensure a safe environment.',
              },
              {
                title: 'Transport Volunteer',
                desc: 'Help move dogs between locations, vet appointments, and new homes.',
              },
              {
                title: 'Social Media',
                desc: 'Share our available dogs, events, and stories with the community.',
              },
              {
                title: 'Marketing',
                desc: 'Create materials, campaigns, and outreach to grow awareness.',
              },
              {
                title: 'Fundraising',
                desc: 'Help plan and run fundraisers that keep our rescue going.',
              },
              {
                title: 'Blog Writer',
                desc: 'Write stories, updates, and educational content for our blog.',
              },
              {
                title: 'Follow-Up Specialist',
                desc: 'Check in with adopters and fosters to ensure dogs are thriving.',
              },
              {
                title: 'Foster Coordinator',
                desc: 'Match incoming dogs with available foster homes.',
              },
              {
                title: 'Event Coordinator',
                desc: 'Plan and manage meet-and-greets, fundraisers, and community events.',
              },
              {
                title: 'Medical Director',
                desc: 'Oversee medical care decisions and vet relationships.',
              },
              {
                title: 'Adoption Director',
                desc: 'Manage the adoption pipeline from application to placement.',
              },
              {
                title: 'Intake Director',
                desc: 'Coordinate incoming surrender and shelter-transfer cases.',
              },
              {
                title: 'Supplies Coordinator',
                desc: 'Manage donated supplies and distribute to foster homes.',
              },
              {
                title: 'Transports Coordinator',
                desc: 'Organize and schedule transport runs across our service area.',
              },
              {
                title: 'Bookkeeper',
                desc: 'Help with financial record-keeping and reporting.',
              },
            ].map((role) => (
              <div
                key={role.title}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {role.title}
                </h3>
                <p className="text-gray-600 text-sm">{role.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Expect */}
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mt-0 mb-4">
            What to Expect
          </h2>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">
                &bull;
              </span>
              <span>
                After you submit your application, a coordinator will reach out
                to discuss your interests and availability.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">
                &bull;
              </span>
              <span>
                Training and onboarding are provided for all roles &mdash; no
                prior rescue experience needed.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold text-lg leading-6">
                &bull;
              </span>
              <span>
                Time commitments vary by role. Some are a few hours per month;
                others are more hands-on. We will find a fit for you.
              </span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            Questions?
          </h2>
          <p>
            If you have questions about volunteering, please email{' '}
            <a
              href="mailto:adoptadane@rmgreatdane.org"
              className="text-teal-600 hover:text-teal-800 underline"
            >
              adoptadane@rmgreatdane.org
            </a>
            .
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-4 pb-2 not-prose">
          <Link
            href="/apply/volunteer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Start Volunteer Application
          </Link>
        </div>
      </div>
    </main>
  )
}
