'use client'
import { AdminColors } from '@/styles/admin-tokens'

interface Props {
  checked: boolean
  onChange: () => void
  label: string
}

export default function AdminCheckbox({ checked, onChange, label }: Props) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
      padding: '8px 12px', borderRadius: 6, marginBottom: 6,
      background: checked ? AdminColors.sageLight : 'transparent',
      border: `1px solid ${checked ? AdminColors.sage : AdminColors.border}`,
      transition: 'all 0.15s', userSelect: 'none',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
        border: `2px solid ${checked ? AdminColors.sage : AdminColors.border}`,
        background: checked ? AdminColors.sage : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{
        fontSize: 13, lineHeight: 1.4,
        color: checked ? AdminColors.sage : AdminColors.textMid,
        fontWeight: checked ? 600 : 400,
      }}>
        {label}
      </span>
    </label>
  )
}
