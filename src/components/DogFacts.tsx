type DogFactsProps = {
  sex: string
  age: string
  weight: number
  ears?: string
  coatColor: string
  health?: {
    specialNeeds?: boolean
    medicalNotes?: string
  }
  goodWith?: {
    kids?: boolean | null
    dogs?: boolean | null
    cats?: boolean | null
    notes?: string
  }
}

const sexLabels: Record<string, string> = {
  male: 'Male (Neutered)',
  female: 'Female (Spayed)',
}

export default function DogFacts({ sex, age, weight, ears, coatColor, health, goodWith }: DogFactsProps) {
  const facts = [
    { label: 'Sex', value: sexLabels[sex] || sex },
    { label: 'Age', value: age },
    { label: 'Weight', value: `${weight} lbs` },
    { label: 'Ears', value: ears ? ears.charAt(0).toUpperCase() + ears.slice(1) : undefined },
    { label: 'Color', value: coatColor },
  ].filter((f): f is { label: string; value: string } => !!f.value)

  // Determine restriction badges
  const restrictions: { label: string; type: 'warn' | 'ok' | 'unknown' }[] = []
  if (goodWith) {
    if (goodWith.kids === false) restrictions.push({ label: 'No Kids', type: 'warn' })
    else if (goodWith.kids === true) restrictions.push({ label: 'Kid Friendly', type: 'ok' })
    if (goodWith.dogs === false) restrictions.push({ label: 'No Other Dogs', type: 'warn' })
    else if (goodWith.dogs === true) restrictions.push({ label: 'Dog Friendly', type: 'ok' })
    if (goodWith.cats === false) restrictions.push({ label: 'No Cats', type: 'warn' })
    else if (goodWith.cats === true) restrictions.push({ label: 'Cat Friendly', type: 'ok' })
  }

  const badgeColors = {
    warn: 'bg-red-100 text-red-800 border-red-200',
    ok: 'bg-green-100 text-green-800 border-green-200',
    unknown: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
      {/* Key facts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{fact.label}</p>
            <p className="text-gray-900 font-semibold">{fact.value}</p>
          </div>
        ))}
      </div>

      {/* Compatibility badges */}
      {restrictions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Compatibility</p>
          <div className="flex flex-wrap gap-2">
            {restrictions.map((r) => (
              <span
                key={r.label}
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColors[r.type]}`}
              >
                {r.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Special needs */}
      {health?.specialNeeds && health?.medicalNotes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Special Needs</p>
          <p className="text-gray-700 text-sm mt-1">{health.medicalNotes}</p>
        </div>
      )}
    </div>
  )
}
