'use client'
import { AdminColors } from '@/styles/admin-tokens'

interface Props {
  pct: number       // 0–100
  size?: number     // px, default 36
  stroke?: number   // px, default 3
}

export default function ProgressRing({ pct, size = 36, stroke = 3 }: Props) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = pct === 100 ? AdminColors.ringComplete
              : pct > 0    ? AdminColors.ringPartial
              :               AdminColors.ringEmpty
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={AdminColors.border} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  )
}
