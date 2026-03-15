'use client'
import { AdminColors } from '@/styles/admin-tokens'

interface Props {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  label: string
}

export default function AdminRadio({ name, value, checked, onChange, label }: Props) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      padding: '6px 12px', borderRadius: 6, userSelect: 'none',
      background: checked ? AdminColors.navy : 'transparent',
      color: checked ? '#fff' : AdminColors.textMid,
      border: `1px solid ${checked ? AdminColors.navy : AdminColors.border}`,
      fontSize: 13, fontWeight: checked ? 600 : 400,
      transition: 'all 0.15s',
    }}>
      <input type="radio" name={name} value={value} checked={checked}
        onChange={onChange} style={{ display: 'none' }} />
      {label}
    </label>
  )
}
