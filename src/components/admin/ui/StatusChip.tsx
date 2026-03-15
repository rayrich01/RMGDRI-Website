'use client'
import { AdminColors } from '@/styles/admin-tokens'

type Status = 'correct' | 'correction' | 'discuss' | ''

interface Props { status: Status }

const CONFIG: Record<Status, [string, string, string]> = {
  correct:    [AdminColors.sageLight,  AdminColors.sage,  '✓ Confirmed'],
  correction: [AdminColors.amberLight, AdminColors.amber, '⚠ Correction noted'],
  discuss:    ['#EEF0FF',              '#4C5FAB',         '◌ Need to discuss'],
  '':         [AdminColors.muted,      AdminColors.textLight, 'Not answered'],
}

export default function StatusChip({ status }: Props) {
  const [bg, fg, label] = CONFIG[status] ?? CONFIG['']
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, background: bg, color: fg,
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}
