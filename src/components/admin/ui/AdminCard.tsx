import { AdminColors, AdminSpacing } from '@/styles/admin-tokens'

interface Props {
  children: React.ReactNode
  style?: React.CSSProperties
  leftAccent?: string   // hex color for left border accent, optional
}

export default function AdminCard({ children, style, leftAccent }: Props) {
  return (
    <div style={{
      background: AdminColors.surface,
      border: `1px solid ${AdminColors.border}`,
      borderLeft: leftAccent ? `4px solid ${leftAccent}` : `1px solid ${AdminColors.border}`,
      borderRadius: AdminSpacing.cardRadius,
      padding: AdminSpacing.cardPadding,
      marginBottom: AdminSpacing.sectionGap,
      ...style,
    }}>
      {children}
    </div>
  )
}
