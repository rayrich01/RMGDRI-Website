'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Opportunity {
  _id: string
  title: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  benefits: string[]
}

export default function OpportunitiesAccordion({ opportunities }: { opportunities: Opportunity[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      {opportunities.map((opp) => {
        const isOpen = openId === opp._id
        return (
          <div key={opp._id} className="border-2 border-gray-200 rounded-xl overflow-hidden mb-4">
            <button
              onClick={() => setOpenId(isOpen ? null : opp._id)}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="text-xl font-bold text-gray-900">{opp.title}</h3>
              <span className="text-2xl text-teal-600">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                <p className="text-gray-700 mb-6">{opp.description}</p>

                {opp.responsibilities?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Responsibilities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {opp.responsibilities.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {opp.qualifications?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Qualifications:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {opp.qualifications.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {opp.benefits?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">What We Offer:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {opp.benefits.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href="/apply/volunteer"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold transition-colors mt-2"
                >
                  Apply for This Position →
                </Link>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
