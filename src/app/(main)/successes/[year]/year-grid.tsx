'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import type { AdoptionSuccessRecord } from '@/lib/adoption-successes'

export function YearGrid({
  successes,
  year,
  basePath,
}: {
  successes: AdoptionSuccessRecord[]
  year: number
  basePath: string
}) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return successes
    const q = search.toLowerCase()
    return successes.filter((s) => s.name.toLowerCase().includes(q))
  }, [successes, search])

  return (
    <>
      {/* Search */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {search && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {filtered.length} of {successes.length} results
            </p>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {search ? 'No matches found' : 'Stories Coming Soon'}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                {search
                  ? `No dogs match "${search}". Try a different name.`
                  : `We're adding ${year} adoption stories. Check back soon.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((success) => (
                <SuccessCard
                  key={success.slug}
                  success={success}
                  year={year}
                  basePath={basePath}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

function SuccessCard({
  success,
  year,
  basePath,
}: {
  success: AdoptionSuccessRecord
  year: number
  basePath: string
}) {
  const hasImage = !!success.hero_image_ref && isValidUrl(success.hero_image_ref)
  const adoptionDate = success.adoption_date
    ? new Date(success.adoption_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const excerpt = success.blog_text
    ? success.blog_text.slice(0, 140) +
      (success.blog_text.length > 140 ? '...' : '')
    : null

  return (
    <Link
      href={`${basePath}/${year}/${success.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={success.hero_image_ref}
            alt={success.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-4xl text-gray-400">?</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
          {success.name}
        </h3>
        {adoptionDate && (
          <p className="text-xs text-gray-500 mt-0.5">{adoptionDate}</p>
        )}
        {excerpt && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{excerpt}</p>
        )}
      </div>
    </Link>
  )
}
