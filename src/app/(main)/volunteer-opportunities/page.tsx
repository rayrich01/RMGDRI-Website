'use client'

import { useState } from 'react'
import Link from 'next/link'

interface OpportunityProps {
  title: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  benefits: string[]
  isOpen: boolean
  onToggle: () => void
}

function OpportunityAccordion({
  title,
  description,
  responsibilities,
  qualifications,
  benefits,
  isOpen,
  onToggle,
}: OpportunityProps) {
  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-2xl text-teal-600 dark:text-teal-400">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-6">{description}</p>

          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">
              Responsibilities:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">
              Qualifications:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {qualifications.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">
              What We Offer:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {benefits.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <a
            href="https://form.jotform.com/RMGDRI/volunteer_application"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold transition-colors mt-2"
          >
            Apply for This Position →
          </a>
        </div>
      )}
    </div>
  )
}

export default function VolunteerOpportunitiesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const opportunities = [
    {
      title: 'Social Media Specialist',
      description:
        'Rocky Mountain Great Dane Rescue, Inc. is in search of a Volunteer Social Media Specialist to generate excitement, communicate with the public, and develop a strategy to ensure that our efforts to help Great Danes are successful across our multiple social media channels.',
      responsibilities: [
        'Writing and posting several Facebook status updates daily (including polls, photo captioning contests, etc.)',
        'Researching content',
        'Implement strategies to increase engagement and follower growth',
        'Monitor activity and engage with social media audiences',
        'Using Photoshop or other types of creative software to produce new content',
        'Helping us improve our social media strategy',
      ],
      qualifications: [
        'Self-motivation and a take charge attitude',
        'Strong writing skills and a good "writing voice"',
        'Ability to thrive in an individual/virtual work environment',
        'An eye for quality',
        'Experience a plus',
        'A commitment of approximately 5 hours/week',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Marketing Coordinator',
      description:
        "Rocky Mountain Great Dane Rescue Inc. is seeking an experienced Volunteer Marketing Coordinator to generate excitement, communicate with the public, and develop a strategy to ensure that our efforts to help Great Danes are successful. If you're perfect at reaching your audience, spurring them to action, and then creating the perfect follow-up plan, WE WANT YOU!",
      responsibilities: [
        'Creation and execution of an annual marketing strategy',
        'Collaborate with our web team, social media coordinator, events team, grant team and fundraising team to promote our mission',
        'Manage the creation of brochures and printed materials, as needed',
        "And more! We're only limited by our imaginations!",
      ],
      qualifications: [
        'Self starter',
        'Marketing experience preferred',
        'Strong communication and writing skills',
        'A great attitude and desire to help animals',
        'A commitment of 5 hours/week (more is welcome!)',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Fundraising Coordinator',
      description:
        'At Rocky Mountain Great Dane Rescue Inc., we are looking for a motivated individual who loves to fundraise for sweet causes. If you are an experienced fundraising coordinator who has the dedication and skills to move us forward we would love to hear from you.',
      responsibilities: [
        "Helping to develop and implement RMGDRI's fundraising strategy",
        'Developing materials for fundraising events (virtual and actual)',
      ],
      qualifications: [
        'Self starter',
        'Fundraising experience preferred',
        'Strong communication and writing skills',
        'A great attitude and desire to help animals',
        'A commitment of 5 hours/week (more is welcome!)',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Donor Management Coordinator',
      description:
        'Rocky Mountain Great Dane Rescue Inc. is seeking an experienced Donor Management Coordinator to help in the identification and cultivation of mid to major donor prospects to ensure that our efforts to help Great Danes are successful.',
      responsibilities: [
        'Creation and execution of a donor strategy',
        "Evaluation of our donors' giving history",
        'Donor cultivation',
      ],
      qualifications: [
        'Self starter',
        'Donor management experience preferred',
        'Strong communication and writing skills',
        'A great attitude and desire to help animals',
        'A commitment of 5 hours/week (more is welcome!)',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Blog Writer',
      description:
        'Rocky Mountain Great Dane Rescue Inc. is seeking a few bloggers who understand how to research and provide fresh original content that generates excitement and ensures that our efforts to help Great Danes are successful. Are you a storyteller? If so WE WANT YOU!',
      responsibilities: [
        'Outstanding writing and communication skills',
        'Experience writing blogs and knowledge of and a love for Dogs',
        'Knowledge of the WordPress blogging platform',
      ],
      qualifications: [
        'Self starter',
        'Creative blog writing experience preferred',
        'Strong communication and writing skills',
        'A great attitude and desire to help animals',
        'A commitment of 5 hours/week (more is welcome!)',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Twitter Social Media Specialist',
      description:
        'Rocky Mountain Great Dane Rescue Inc. is looking for a Twitter Social Media Specialist to help us become Twitter Famous. We are looking for someone to help create fresh original content that generates excitement and ensures that our efforts to help Great Danes are successful on our Twitter account.',
      responsibilities: [
        'Outstanding writing and communication skills',
        'A creative and savvy communicator to develop and execute our general Twitter outreach, as well as assist on special event promotion',
        'Knowledge of Twitter platform and engagement building strategies',
      ],
      qualifications: [
        'Self starter',
        'Creative blog writing experience preferred',
        'Strong communication and writing skills',
        'A great attitude and desire to help animals',
        'A commitment of 5 hours/week (more is welcome!)',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Follow-up Specialist',
      description:
        'Rocky Mountain Great Dane Rescue, Inc. is in search of a Follow-up Specialist to help us follow our adopted Danes in their new lives. You will be assigned a dog(s) to follow over their first year in their new home. You will be there to support new owners to ensure a successful placement by reaching out on set intervals and connecting them with help if needed. At RMGDRI we are committed to our owners and their new Dane.',
      responsibilities: [
        'Writing and communicating via email with adoptive families',
      ],
      qualifications: [
        'Self-motivation',
        'Ability to thrive in an individual/virtual work environment',
        'A commitment of approximately 1-2 hours/week',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Application Processor',
      description:
        'Rocky Mountain Great Dane Rescue, Inc. is in search of an Application Processor to help us screen prospective adoptive families looking to add a Great Dane to their home.',
      responsibilities: [
        'Writing and communicating via email and phone with adoptive families and their references',
      ],
      qualifications: [
        'Self-motivation',
        'Ability to thrive in an individual/virtual work environment',
        'A commitment of approximately 1-2 hours/week',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Home Check Processor',
      description:
        "Rocky Mountain Great Dane Rescue, Inc. is in search of Home Check Processors to help us screen prospective adoptive/foster families' homes looking to add a Great Dane to their home.",
      responsibilities: [
        'Ensure that every new home has certain required elements',
        'Visit homes in your area and meet new people',
      ],
      qualifications: [
        'Self-motivation',
        'Ability to thrive in an individual/virtual work environment',
        'A commitment of approximately 1-2 hours/week',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
    {
      title: 'Transporter',
      description:
        'Rocky Mountain Great Dane Rescue, Inc. is in search of Transporters to help us deliver dogs from shelters, surrendering owners, and other rescues to their new foster family or from RMGDRI to their new adoptive home. Have a Dane friendly vehicle and love a good roadtrip? If so we would love to chat with you.',
      responsibilities: [
        'Transport dogs from shelters, owners, and rescues to foster or adoptive homes',
      ],
      qualifications: [
        'Self-motivation',
        'Ability to thrive in an individual/virtual work environment',
        'A commitment of approximately 1-2 hours/week',
      ],
      benefits: [
        'A letter of recommendation',
        'Valuable experience for your resume',
        'A million karma points for saving animals!',
      ],
    },
  ]

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Volunteer Today
            </h1>
            <p className="text-2xl md:text-3xl text-teal-300">
              We have a lot of Great Danes that need saving and we would love your help.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Saving Great Danes takes a village and we hope you will join ours. We are always
            looking for new volunteers to lend a helping hand. Following are a few of the volunteer
            positions that we have available. It is easy to become a volunteer for RMGDRI, just
            complete a short online application. If one of the following job openings has caught
            your eye just mention it on your application and we will be in touch.
          </p>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 p-8 rounded-xl text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Are you ready to help save Great Danes?
            </h2>
            <a
              href="https://form.jotform.com/RMGDRI/volunteer_application"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Apply Now →
            </a>
          </div>
        </section>

        {/* Opportunities List */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Available Positions
          </h2>

          {opportunities.map((opportunity, index) => (
            <OpportunityAccordion
              key={index}
              {...opportunity}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white py-12 px-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Don&apos;t See the Perfect Fit?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We can tailor a position to match your unique skills and interests. Reach out and
            let&apos;s create something special together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://form.jotform.com/RMGDRI/volunteer_application"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg"
            >
              Submit Application →
            </a>
            <Link
              href="/volunteer"
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              ← Back to Volunteer Overview
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
