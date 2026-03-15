'use client'
import { AdminColors, AdminFonts } from '@/styles/admin-tokens'

interface Props {
  onSave: () => void
  saving: boolean
  saveMsg: string
  activeStage: number
  totalStages: number
  onPrev: () => void
  onNext: () => void
}

export default function AdminSaveBar({
  onSave, saving, saveMsg, activeStage, totalStages, onPrev, onNext
}: Props) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: AdminColors.navy, padding: '12px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.2)', zIndex: 100,
    }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {activeStage > 0 && (
          <button onClick={onPrev} style={{
            padding: '8px 18px', background: 'transparent', cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6,
            color: '#A8C4E8', fontSize: 13, fontFamily: AdminFonts.ui,
          }}>
            ← Previous
          </button>
        )}
        {activeStage < totalStages - 1 && (
          <button onClick={onNext} style={{
            padding: '8px 18px', background: 'rgba(255,255,255,0.1)', cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6,
            color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: AdminFonts.ui,
          }}>
            Next Stage →
          </button>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {saveMsg && (
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: saveMsg.includes('✓') ? '#7FE0A0' : '#FFB4B4',
          }}>
            {saveMsg}
          </span>
        )}
        <button onClick={onSave} disabled={saving} style={{
          padding: '10px 28px', border: 'none', borderRadius: 6,
          background: saving ? AdminColors.textLight : AdminColors.goldLight,
          color: '#1C1C1C', fontWeight: 700, fontSize: 14,
          cursor: saving ? 'wait' : 'pointer', fontFamily: AdminFonts.ui,
          transition: 'background 0.15s',
        }}>
          {saving ? 'Saving…' : 'Save Progress'}
        </button>
      </div>
    </div>
  )
}
