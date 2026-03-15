'use client'
import { AdminColors, AdminFonts } from '@/styles/admin-tokens'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  rows?: number
  placeholder?: string
}

export default function AdminField({
  label, value, onChange, hint, rows = 2, placeholder
}: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 700, color: AdminColors.navy,
        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
      }}>
        {label}
      </label>
      {hint && (
        <p style={{ fontSize: 12, color: AdminColors.textLight, marginBottom: 6, lineHeight: 1.4 }}>
          {hint}
        </p>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder ?? 'Enter your response…'}
        style={{
          width: '100%', padding: '10px 12px', resize: 'vertical', outline: 'none',
          border: `1.5px solid ${value ? AdminColors.borderDark : AdminColors.border}`,
          borderRadius: 6, fontSize: 13, lineHeight: 1.5, boxSizing: 'border-box',
          color: AdminColors.text, fontFamily: AdminFonts.body,
          background: value ? '#fff' : AdminColors.muted,
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  )
}
