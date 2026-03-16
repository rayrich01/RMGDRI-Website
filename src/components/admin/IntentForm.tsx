'use client'
// src/components/admin/IntentForm.tsx
// CR-ADMIN-UI-002 — Authoritative RMGDRI Intent Workbook
// Source: RMGDRI_Intent_Form.jsx (Lori-approved 2026-03-15)
// DO NOT simplify or genericize this form. Every field is intentional.

import { useState, useEffect, useCallback } from 'react'
import { AdminColors, AdminFonts } from '@/styles/admin-tokens'
import {
  ProgressRing, StatusChip, AdminCheckbox, AdminRadio,
  AdminField, AdminCard, AdminSaveBar
} from '@/components/admin/ui'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface S1 {
  confirms: Record<string, string>
  corrections: Record<string, string>
  mission: string
  publicFeel: string
  atlasNeverForget: string
}

interface S2a {
  ranks: Record<string, string>
  tradeoffs: Record<string, string>
  stakeholders: Record<string, string>
}

interface S2b {
  autonomy: Record<string, boolean>
  mustAsk: Record<string, boolean>
  neverDo: Record<string, boolean>
  escalate: Record<string, boolean>
}

interface S2c {
  useTone: Record<string, boolean>
  avoidTone: Record<string, boolean>
  websiteJobs: Record<string, boolean>
  optimizeFor: Record<string, boolean>
  neverSacrifice: string[]
}

interface S3 {
  examples: { situation: string; shouldDo: string; whyRight: string }[]
  badPatterns: Record<string, string>
}

interface S4 {
  optimizeFor: string
  protect: string
  escalateWhen: string
  neverAssume: string
  behaveLike: string
  fastStart: Record<string, string>
}

interface FormData {
  lastSaved: string | null
  s1: S1
  s2a: S2a
  s2b: S2b
  s2c: S2c
  s3: S3
  s4: S4
}

/* ------------------------------------------------------------------ */
/*  Initial state — canonical data shape                               */
/* ------------------------------------------------------------------ */

const INITIAL: FormData = {
  lastSaved: null,
  s1: {
    confirms: { protect: '', trust: '', sensitive: '', support: '', website: '' },
    corrections: { protect: '', trust: '', sensitive: '', support: '', website: '' },
    mission: '',
    publicFeel: '',
    atlasNeverForget: '',
  },
  s2a: {
    ranks: { dogSafety: '', adopterTrust: '', communication: '', volunteer: '', fundraising: '', websiteTraffic: '' },
    tradeoffs: { safetyVsSpeed: '', accuracyVsFast: '', compassionVsEfficiency: '', trustVsConversion: '', verifiedVsPolished: '' },
    stakeholders: { dogs: '', adopters: '', fosters: '', volunteers: '', donors: '', board: '', public: '' },
  },
  s2b: {
    autonomy: { summarize: false, draft: false, suggest: false, organize: false, flag: false, prepare: false },
    mustAsk: { dogStatus: false, medBehavior: false, criteria: false, sensitive: false, policyException: false, websiteCopy: false, publicEscalate: false },
    neverDo: { inventFacts: false, unverified: false, overrideJudgment: false, optimizeSpeed: false, hideUncertainty: false },
    escalate: { conflicting: false, safety: false, legal: false, emotionalConflict: false, publicCriticism: false, compassionVsPolicy: false },
  },
  s2c: {
    useTone: { compassionate: false, trustworthy: false, clear: false, calm: false, direct: false, warmNotSentimental: false, professionalHuman: false },
    avoidTone: { robotic: false, corporate: false, casual: false, guilt: false, polished: false, pushy: false },
    websiteJobs: { understand: false, dogInfo: false, actions: false, reduceConfusion: false, confidence: false },
    optimizeFor: { clarity: false, trust: false, conversion: false, storytelling: false, donorConfidence: false, searchVisibility: false },
    neverSacrifice: ['', '', ''],
  },
  s3: {
    examples: [
      { situation: '', shouldDo: '', whyRight: '' },
      { situation: '', shouldDo: '', whyRight: '' },
      { situation: '', shouldDo: '', whyRight: '' },
    ],
    badPatterns: { speed: '', conversion: '', workload: '', positivity: '' },
  },
  s4: {
    optimizeFor: '',
    protect: '',
    escalateWhen: '',
    neverAssume: '',
    behaveLike: '',
    fastStart: { protect: '', neverSacrifice: '', alwaysAsk: '', neverGuess: '', helpful: '', dangerous: '' },
  },
}

const STAGE_META = [
  { id: 's1', label: 'Stage 1', title: 'Confirm What We Know', icon: '◉', color: AdminColors.navy },
  { id: 's2', label: 'Stage 2', title: 'Priorities & Boundaries', icon: '⊞', color: AdminColors.sage },
  { id: 's3', label: 'Stage 3', title: 'Judgment Examples', icon: '◈', color: AdminColors.gold },
  { id: 's4', label: 'Summary', title: 'Atlas Intent Profile', icon: '▣', color: AdminColors.amber },
]

/* ------------------------------------------------------------------ */
/*  Deep merge — preserves saved data when new fields are added        */
/* ------------------------------------------------------------------ */

function mergeWithInitial(saved: Record<string, unknown>): FormData {
  const result = JSON.parse(JSON.stringify(INITIAL)) as FormData
  function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const key of Object.keys(source)) {
      if (key in target) {
        const tv = target[key]
        const sv = source[key]
        if (
          typeof tv === 'object' && tv !== null && !Array.isArray(tv) &&
          typeof sv === 'object' && sv !== null && !Array.isArray(sv)
        ) {
          deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>)
        } else {
          target[key] = sv
        }
      }
    }
  }
  deepMerge(result as unknown as Record<string, unknown>, saved)
  return result
}

/* ------------------------------------------------------------------ */
/*  Progress calculation                                               */
/* ------------------------------------------------------------------ */

function stageProgress(data: FormData) {
  const s1Fields = [
    ...Object.values(data.s1.confirms),
    data.s1.mission, data.s1.publicFeel, data.s1.atlasNeverForget,
    ...Object.values(data.s2a.ranks),
    ...Object.values(data.s2a.tradeoffs),
    ...Object.values(data.s2a.stakeholders),
  ]
  const s1Total = s1Fields.length
  const s1Filled = s1Fields.filter(v => typeof v === 'string' ? v.trim() : v).length

  const s2bBools = [
    ...Object.values(data.s2b.autonomy),
    ...Object.values(data.s2b.mustAsk),
    ...Object.values(data.s2b.neverDo),
    ...Object.values(data.s2b.escalate),
    ...Object.values(data.s2c.useTone),
    ...Object.values(data.s2c.avoidTone),
    ...Object.values(data.s2c.websiteJobs),
    ...Object.values(data.s2c.optimizeFor),
  ]
  const s2Fields: (boolean | string)[] = [...s2bBools, ...data.s2c.neverSacrifice]
  const s2Total = s2Fields.length
  const s2Filled = s2Fields.filter(v => typeof v === 'boolean' ? v : typeof v === 'string' && v.trim()).length

  const s3Fields = data.s3.examples.flatMap(e => [e.situation, e.shouldDo, e.whyRight])
    .concat(Object.values(data.s3.badPatterns))
  const s3Total = s3Fields.length
  const s3Filled = s3Fields.filter(v => v.trim()).length

  const s4Fields = [...Object.values(data.s4.fastStart), ...Object.values(data.s4).filter((v): v is string => typeof v === 'string')]
  const s4Total = s4Fields.length
  const s4Filled = s4Fields.filter(v => v.trim()).length

  return [
    { pct: s1Total ? Math.round((s1Filled / s1Total) * 100) : 0, filled: s1Filled, total: s1Total },
    { pct: s2Total ? Math.round((s2Filled / s2Total) * 100) : 0, filled: s2Filled, total: s2Total },
    { pct: s3Total ? Math.round((s3Filled / s3Total) * 100) : 0, filled: s3Filled, total: s3Total },
    { pct: s4Total ? Math.round((s4Filled / s4Total) * 100) : 0, filled: s4Filled, total: s4Total },
  ]
}

/* ------------------------------------------------------------------ */
/*  SectionHeader (form-specific — not extracted per CR spec)          */
/* ------------------------------------------------------------------ */

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, paddingBottom: 16,
      borderBottom: `2px solid ${AdminColors.border}` }}>
      <span style={{ fontSize: 22, color: AdminColors.navy, lineHeight: 1 }}>{icon}</span>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: AdminColors.navy, fontFamily: AdminFonts.heading }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 12, color: AdminColors.textLight }}>{subtitle}</p>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stage 1 — Confirm What We Know                                     */
/* ------------------------------------------------------------------ */

function Stage1({ data, setData }: { data: FormData; setData: (fn: (d: FormData) => FormData) => void }) {
  const confirmItems = [
    { key: 'protect', text: 'RMGDRI exists first to protect dogs and place them safely, not just process applications quickly.' },
    { key: 'trust', text: 'Trust with adopters, fosters, and volunteers matters more than automation speed.' },
    { key: 'sensitive', text: 'Sensitive dog information should never be guessed or published without verification.' },
    { key: 'support', text: "Atlas should support Lori's judgment, not replace it." },
    { key: 'website', text: 'The website should help the right people understand the rescue, trust it, and take the next right action.' },
  ]

  const rankItems = [
    { key: 'dogSafety', label: 'Dog safety and appropriate placement' },
    { key: 'adopterTrust', label: 'Trust with adopters and fosters' },
    { key: 'communication', label: 'Clear and timely communication' },
    { key: 'volunteer', label: 'Volunteer support and retention' },
    { key: 'fundraising', label: 'Donation and fundraising effectiveness' },
    { key: 'websiteTraffic', label: 'Website traffic / visibility' },
  ]

  const tradeoffs = [
    { key: 'safetyVsSpeed', a: 'Dog safety', b: 'Convenience / speed' },
    { key: 'accuracyVsFast', a: 'Accuracy', b: 'Fast response' },
    { key: 'compassionVsEfficiency', a: 'Compassion', b: 'Operational efficiency' },
    { key: 'trustVsConversion', a: 'Long-term trust', b: 'Short-term conversion' },
    { key: 'verifiedVsPolished', a: 'Verified facts', b: 'A polished answer right away' },
  ]

  const stakeholderItems = [
    { key: 'dogs', label: 'Dogs / animal welfare' },
    { key: 'adopters', label: 'Approved adopters' },
    { key: 'fosters', label: 'Fosters' },
    { key: 'volunteers', label: 'Volunteers' },
    { key: 'donors', label: 'Donors' },
    { key: 'board', label: 'Board / leadership' },
    { key: 'public', label: 'General public / website visitors' },
  ]

  return (
    <div>
      <AdminCard>
        <SectionHeader icon="◉" title="Confirm What We Already Know"
          subtitle="Each statement reflects what the architecture team believes to be true. Mark each one and add a note if needed." />
        {confirmItems.map(({ key, text }) => (
          <div key={key} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${AdminColors.muted}` }}>
            <p style={{ fontSize: 14, color: AdminColors.text, lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>&ldquo;{text}&rdquo;</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {([['correct', '✓ Correct'], ['correction', '⚠ Needs correction'], ['discuss', '◌ Need to discuss']] as const).map(([v, l]) => (
                <AdminRadio key={v} name={`confirm-${key}`} value={v} checked={data.s1.confirms[key] === v}
                  onChange={() => setData(d => ({ ...d, s1: { ...d.s1, confirms: { ...d.s1.confirms, [key]: v } } }))}
                  label={l} />
              ))}
            </div>
            {(data.s1.confirms[key] === 'correction' || data.s1.confirms[key] === 'discuss') && (
              <textarea value={data.s1.corrections[key]} rows={2} placeholder="Add your note or correction…"
                onChange={e => setData(d => ({ ...d, s1: { ...d.s1, corrections: { ...d.s1.corrections, [key]: e.target.value } } }))}
                style={{ width: '100%', padding: '8px 10px', border: `1.5px solid ${AdminColors.gold}`, borderRadius: 6,
                  fontSize: 12, background: AdminColors.amberLight, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
            )}
            <div style={{ marginTop: 6 }}><StatusChip status={data.s1.confirms[key] as 'correct' | 'correction' | 'discuss' | ''} /></div>
          </div>
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="◌" title="Identity in Your Own Words" subtitle="Quick open-ended questions — a sentence or two is enough." />
        <AdminField label="Mission in your own words" value={data.s1.mission} rows={2}
          onChange={v => setData(d => ({ ...d, s1: { ...d.s1, mission: v } }))} />
        <AdminField label="What should the public always feel after interacting with RMGDRI?" value={data.s1.publicFeel} rows={2}
          onChange={v => setData(d => ({ ...d, s1: { ...d.s1, publicFeel: v } }))} />
        <AdminField label="What should Atlas never forget about how rescue work really works?" value={data.s1.atlasNeverForget} rows={3}
          onChange={v => setData(d => ({ ...d, s1: { ...d.s1, atlasNeverForget: v } }))} />
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="⊞" title="Priority Ranking" subtitle="Rank each item 1–6 (1 = highest priority). You can use the same number for a tie." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {rankItems.map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              border: `1px solid ${data.s2a.ranks[key] ? AdminColors.navy : AdminColors.border}`, borderRadius: 8,
              background: data.s2a.ranks[key] ? '#F0F4FB' : AdminColors.muted }}>
              <input type="number" min={1} max={6} value={data.s2a.ranks[key]}
                onChange={e => setData(d => ({ ...d, s2a: { ...d.s2a, ranks: { ...d.s2a.ranks, [key]: e.target.value } } }))}
                style={{ width: 44, padding: '6px 8px', border: `1.5px solid ${AdminColors.border}`, borderRadius: 6,
                  fontSize: 16, fontWeight: 700, color: AdminColors.navy, textAlign: 'center', outline: 'none' }} />
              <span style={{ fontSize: 13, color: AdminColors.textMid, lineHeight: 1.3 }}>{label}</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="⇄" title="When Priorities Conflict" subtitle="For each pair, click which side Atlas should lean toward — or leave it as balanced / case-by-case." />
        {tradeoffs.map(({ key, a, b }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <AdminRadio name={`to-${key}`} value="a" checked={data.s2a.tradeoffs[key] === 'a'}
                onChange={() => setData(d => ({ ...d, s2a: { ...d.s2a, tradeoffs: { ...d.s2a.tradeoffs, [key]: 'a' } } }))} label={a} />
              <AdminRadio name={`to-${key}`} value="balanced" checked={data.s2a.tradeoffs[key] === 'balanced'}
                onChange={() => setData(d => ({ ...d, s2a: { ...d.s2a, tradeoffs: { ...d.s2a.tradeoffs, [key]: 'balanced' } } }))} label="Balanced / case-by-case" />
              <AdminRadio name={`to-${key}`} value="b" checked={data.s2a.tradeoffs[key] === 'b'}
                onChange={() => setData(d => ({ ...d, s2a: { ...d.s2a, tradeoffs: { ...d.s2a.tradeoffs, [key]: 'b' } } }))} label={b} />
            </div>
          </div>
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="◈" title="Stakeholder Priority Order" subtitle="Number 1–7 in the order Atlas should treat each group when needs conflict." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stakeholderItems.map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              border: `1px solid ${data.s2a.stakeholders[key] ? AdminColors.sage : AdminColors.border}`, borderRadius: 8,
              background: data.s2a.stakeholders[key] ? AdminColors.sageLight : AdminColors.muted }}>
              <input type="number" min={1} max={7} value={data.s2a.stakeholders[key]}
                onChange={e => setData(d => ({ ...d, s2a: { ...d.s2a, stakeholders: { ...d.s2a.stakeholders, [key]: e.target.value } } }))}
                style={{ width: 44, padding: '6px 8px', border: `1.5px solid ${AdminColors.border}`, borderRadius: 6,
                  fontSize: 16, fontWeight: 700, color: AdminColors.sage, textAlign: 'center', outline: 'none' }} />
              <span style={{ fontSize: 13, color: AdminColors.textMid }}>{label}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stage 2 — Priorities & Boundaries                                  */
/* ------------------------------------------------------------------ */

function Stage2({ data, setData }: { data: FormData; setData: (fn: (d: FormData) => FormData) => void }) {
  const autonomyItems = [
    { key: 'summarize', label: 'Summarize website status, logs, or current work' },
    { key: 'draft', label: 'Draft content or messages for review' },
    { key: 'suggest', label: 'Suggest next actions or priorities' },
    { key: 'organize', label: 'Organize information and surface blockers' },
    { key: 'flag', label: 'Flag inconsistencies or missing data' },
    { key: 'prepare', label: 'Prepare reports for Lori or leadership' },
  ]
  const mustAskItems = [
    { key: 'dogStatus', label: 'Publish or change dog status publicly' },
    { key: 'medBehavior', label: 'Publish medical or behavioral details about a dog' },
    { key: 'criteria', label: 'Change adoption, foster, or volunteer criteria' },
    { key: 'sensitive', label: 'Send emotionally sensitive communications' },
    { key: 'policyException', label: 'Represent policy exceptions as official rescue decisions' },
    { key: 'websiteCopy', label: 'Change live website copy on sensitive rescue topics' },
    { key: 'publicEscalate', label: 'Escalate donor or adopter issues publicly' },
  ]
  const neverItems = [
    { key: 'inventFacts', label: 'Invent facts about a dog, person, or rescue decision' },
    { key: 'unverified', label: 'Present unverified medical or behavioral claims as certain' },
    { key: 'overrideJudgment', label: "Override Lori's judgment or imply it has final authority" },
    { key: 'optimizeSpeed', label: 'Optimize for speed at the expense of dog safety or trust' },
    { key: 'hideUncertainty', label: 'Hide uncertainty when information is incomplete' },
  ]
  const escalateItems = [
    { key: 'conflicting', label: 'Conflicting information about a dog or case' },
    { key: 'safety', label: 'Any issue involving safety uncertainty' },
    { key: 'legal', label: 'Potential legal or policy-sensitive language' },
    { key: 'emotionalConflict', label: 'Emotionally charged adopter / foster / volunteer conflict' },
    { key: 'publicCriticism', label: 'Public criticism or reputational risk' },
    { key: 'compassionVsPolicy', label: 'Cases where compassion and policy appear to conflict' },
  ]
  const useToneItems = [
    { key: 'compassionate', label: 'Compassionate' }, { key: 'trustworthy', label: 'Trustworthy' },
    { key: 'clear', label: 'Clear' }, { key: 'calm', label: 'Calm' },
    { key: 'direct', label: 'Direct' }, { key: 'warmNotSentimental', label: 'Warm but not sentimental' },
    { key: 'professionalHuman', label: 'Professional but human' },
  ]
  const avoidToneItems = [
    { key: 'robotic', label: 'Robotic' }, { key: 'corporate', label: 'Overly corporate' },
    { key: 'casual', label: 'Overly casual' }, { key: 'guilt', label: 'Guilt-heavy' },
    { key: 'polished', label: 'Too polished / unrealistic' }, { key: 'pushy', label: 'Pushy fundraising tone' },
  ]
  const jobItems = [
    { key: 'understand', label: 'Help the right people understand the rescue' },
    { key: 'dogInfo', label: 'Make dog information understandable and trustworthy' },
    { key: 'actions', label: 'Support adoption, foster, volunteer, and donor actions' },
    { key: 'reduceConfusion', label: 'Reduce confusion and repetitive questions' },
    { key: 'confidence', label: "Build confidence in RMGDRI's judgment and care standards" },
  ]
  const optimizeItems = [
    { key: 'clarity', label: 'Clarity' }, { key: 'trust', label: 'Trust' },
    { key: 'conversion', label: 'Conversion' }, { key: 'storytelling', label: 'Storytelling' },
    { key: 'donorConfidence', label: 'Donor confidence' }, { key: 'searchVisibility', label: 'Search visibility' },
  ]

  return (
    <div>
      <AdminCard>
        <SectionHeader icon="⊞" title="Atlas Autonomy — What It May Do Without Asking" subtitle="Check all tasks Atlas can perform autonomously." />
        {autonomyItems.map(({ key, label }) => (
          <AdminCheckbox key={key} checked={data.s2b.autonomy[key]} label={label}
            onChange={() => setData(d => ({ ...d, s2b: { ...d.s2b, autonomy: { ...d.s2b.autonomy, [key]: !d.s2b.autonomy[key] } } }))} />
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="⚠" title="Must Ask Before Acting" subtitle="These always require human approval. Check all that apply." />
        <div style={{ background: AdminColors.amberLight, border: `1px solid ${AdminColors.amber}`, borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 12, color: AdminColors.amber }}>
          ⚠ These are hard gates — Atlas stops and waits for Lori before proceeding.
        </div>
        {mustAskItems.map(({ key, label }) => (
          <AdminCheckbox key={key} checked={data.s2b.mustAsk[key]} label={label}
            onChange={() => setData(d => ({ ...d, s2b: { ...d.s2b, mustAsk: { ...d.s2b.mustAsk, [key]: !d.s2b.mustAsk[key] } } }))} />
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="✗" title="Atlas Must Never Do" subtitle="These are absolute prohibitions. Check all that should be hard limits." />
        <div style={{ background: AdminColors.redLight, border: `1px solid ${AdminColors.red}`, borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 12, color: AdminColors.red }}>
          These become non-negotiable rules in the Atlas intent profile.
        </div>
        {neverItems.map(({ key, label }) => (
          <AdminCheckbox key={key} checked={data.s2b.neverDo[key]} label={label}
            onChange={() => setData(d => ({ ...d, s2b: { ...d.s2b, neverDo: { ...d.s2b.neverDo, [key]: !d.s2b.neverDo[key] } } }))} />
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="⬆" title="Escalation Triggers" subtitle="Atlas must pause and escalate immediately in these situations." />
        {escalateItems.map(({ key, label }) => (
          <AdminCheckbox key={key} checked={data.s2b.escalate[key]} label={label}
            onChange={() => setData(d => ({ ...d, s2b: { ...d.s2b, escalate: { ...d.s2b.escalate, [key]: !d.s2b.escalate[key] } } }))} />
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="◎" title="Communication Tone" subtitle="Select the tones Atlas should consistently use — and those to avoid." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: AdminColors.sage, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Use these tones</p>
            {useToneItems.map(({ key, label }) => (
              <AdminCheckbox key={key} checked={data.s2c.useTone[key]} label={label}
                onChange={() => setData(d => ({ ...d, s2c: { ...d.s2c, useTone: { ...d.s2c.useTone, [key]: !d.s2c.useTone[key] } } }))} />
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: AdminColors.red, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Avoid these tones</p>
            {avoidToneItems.map(({ key, label }) => (
              <AdminCheckbox key={key} checked={data.s2c.avoidTone[key]} label={label}
                onChange={() => setData(d => ({ ...d, s2c: { ...d.s2c, avoidTone: { ...d.s2c.avoidTone, [key]: !d.s2c.avoidTone[key] } } }))} />
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="▣" title="Website Intent" subtitle="The jobs the website should perform — and what it should optimize for." />
        <p style={{ fontSize: 12, fontWeight: 700, color: AdminColors.navy, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Website jobs-to-be-done</p>
        {jobItems.map(({ key, label }) => (
          <AdminCheckbox key={key} checked={data.s2c.websiteJobs[key]} label={label}
            onChange={() => setData(d => ({ ...d, s2c: { ...d.s2c, websiteJobs: { ...d.s2c.websiteJobs, [key]: !d.s2c.websiteJobs[key] } } }))} />
        ))}
        <p style={{ fontSize: 12, fontWeight: 700, color: AdminColors.navy, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '20px 0 10px' }}>Optimize the website for</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {optimizeItems.map(({ key, label }) => (
            <AdminCheckbox key={key} checked={data.s2c.optimizeFor[key]} label={label}
              onChange={() => setData(d => ({ ...d, s2c: { ...d.s2c, optimizeFor: { ...d.s2c.optimizeFor, [key]: !d.s2c.optimizeFor[key] } } }))} />
          ))}
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, color: AdminColors.navy, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '20px 0 10px' }}>Things that should never be sacrificed for website performance</p>
        {[0, 1, 2].map(i => (
          <input key={i} type="text" value={data.s2c.neverSacrifice[i]} placeholder={`Never sacrifice #${i + 1}…`}
            onChange={e => {
              const arr = [...data.s2c.neverSacrifice]; arr[i] = e.target.value
              setData(d => ({ ...d, s2c: { ...d.s2c, neverSacrifice: arr } }))
            }}
            style={{ display: 'block', width: '100%', padding: '10px 12px', marginBottom: 8,
              border: `1.5px solid ${data.s2c.neverSacrifice[i] ? AdminColors.red : AdminColors.border}`, borderRadius: 6,
              fontSize: 13, background: data.s2c.neverSacrifice[i] ? AdminColors.redLight : AdminColors.muted,
              color: AdminColors.text, outline: 'none', boxSizing: 'border-box' }} />
        ))}
      </AdminCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stage 3 — Judgment Examples                                        */
/* ------------------------------------------------------------------ */

function Stage3({ data, setData }: { data: FormData; setData: (fn: (d: FormData) => FormData) => void }) {
  return (
    <div>
      <AdminCard>
        <SectionHeader icon="◈" title="Judgment Examples" subtitle="Real situations teach Atlas better than abstract rules. Fill in as many as you can — more can always be added later." />
        {data.s3.examples.map((ex, i) => (
          <div key={i} style={{ marginBottom: 24, padding: 20, background: AdminColors.muted, borderRadius: 10,
            border: `1px solid ${AdminColors.border}` }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: AdminColors.navy, marginBottom: 14 }}>Example {i + 1}</p>
            <AdminField label="Situation" hint="Describe a real or likely scenario Atlas might encounter."
              value={ex.situation} rows={2}
              onChange={v => {
                const arr = [...data.s3.examples]; arr[i] = { ...arr[i], situation: v }
                setData(d => ({ ...d, s3: { ...d.s3, examples: arr } }))
              }} />
            <AdminField label="What Atlas should do" value={ex.shouldDo} rows={2}
              onChange={v => {
                const arr = [...data.s3.examples]; arr[i] = { ...arr[i], shouldDo: v }
                setData(d => ({ ...d, s3: { ...d.s3, examples: arr } }))
              }} />
            <AdminField label="Why that is the right call" value={ex.whyRight} rows={2}
              onChange={v => {
                const arr = [...data.s3.examples]; arr[i] = { ...arr[i], whyRight: v }
                setData(d => ({ ...d, s3: { ...d.s3, examples: arr } }))
              }} />
          </div>
        ))}
        <button onClick={() => setData(d => ({ ...d, s3: { ...d.s3, examples: [...d.s3.examples, { situation: '', shouldDo: '', whyRight: '' }] } }))}
          style={{ padding: '8px 18px', border: `1.5px dashed ${AdminColors.navy}`, borderRadius: 6, background: 'transparent',
            color: AdminColors.navy, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
          + Add another example
        </button>
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="⚠" title="Bad Optimization Patterns to Avoid"
          subtitle="If Atlas optimized only for one thing, what would go wrong? These become anti-patterns in the intent profile." />
        {[
          { key: 'speed', label: 'If Atlas optimized only for speed, what would go wrong?' },
          { key: 'conversion', label: 'If Atlas optimized only for website conversion, what would go wrong?' },
          { key: 'workload', label: 'If Atlas optimized only for lower workload, what would go wrong?' },
          { key: 'positivity', label: 'If Atlas optimized only for public positivity, what would go wrong?' },
        ].map(({ key, label }) => (
          <AdminField key={key} label={label} value={data.s3.badPatterns[key]} rows={2}
            onChange={v => setData(d => ({ ...d, s3: { ...d.s3, badPatterns: { ...d.s3.badPatterns, [key]: v } } }))} />
        ))}
      </AdminCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stage 4 — Atlas Intent Profile                                     */
/* ------------------------------------------------------------------ */

function Stage4({ data, setData }: { data: FormData; setData: (fn: (d: FormData) => FormData) => void }) {
  const checked = (obj: Record<string, boolean>) => Object.entries(obj).filter(([, v]) => v).map(([k]) => k)
  const rankedStakeholders = Object.entries(data.s2a.stakeholders)
    .filter(([, v]) => v).sort(([, a], [, b]) => Number(a) - Number(b))
    .map(([k]) => k).join(' → ')

  const neverDoLabels: Record<string, string> = {
    inventFacts: 'factual accuracy', unverified: 'verified information only',
    overrideJudgment: "Lori's authority", optimizeSpeed: 'dog safety over speed',
    hideUncertainty: 'transparency about uncertainty',
  }
  const escalateLabels: Record<string, string> = {
    conflicting: 'conflicting info about a dog/case', safety: 'safety uncertainty',
    legal: 'legal/policy sensitivity', emotionalConflict: 'emotionally charged conflicts',
    publicCriticism: 'public/reputational risk', compassionVsPolicy: 'compassion-policy tension',
  }

  const ap = {
    optimizeFor: checked(data.s2c.optimizeFor).join(', ') || '(not yet set)',
    protect: checked(data.s2b.neverDo).map(k => neverDoLabels[k] || k).join('; ') || '(not yet set)',
    escalateWhen: checked(data.s2b.escalate).map(k => escalateLabels[k] || k).join('; ') || '(not yet set)',
    stakeholderOrder: rankedStakeholders || '(not yet set)',
  }

  return (
    <div>
      <AdminCard style={{ background: '#F0F4FB', border: `2px solid ${AdminColors.navy}` }}>
        <SectionHeader icon="▣" title="Auto-Generated Intent Summary"
          subtitle="Built from your Stage 1–3 answers. Review and refine in the fields below." />
        {([
          ['Optimize for', ap.optimizeFor], ['Protect', ap.protect],
          ['Escalate when', ap.escalateWhen], ['Stakeholder order', ap.stakeholderOrder],
        ] as const).map(([label, value]) => (
          <div key={label} style={{ marginBottom: 12, padding: '12px 16px', background: '#fff',
            borderRadius: 8, border: `1px solid ${AdminColors.border}` }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: AdminColors.textLight, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: AdminColors.text, lineHeight: 1.5 }}>{value}</p>
          </div>
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="◉" title="Final Atlas Intent Profile"
          subtitle="Refine or complete your summary statements. These will become the machine-actionable intent profile." />
        {[
          { key: 'optimizeFor' as const, label: 'Atlas should optimize for', hint: 'What outcomes should Atlas work toward?' },
          { key: 'protect' as const, label: 'Atlas should protect', hint: 'What values, people, or standards must never be compromised?' },
          { key: 'escalateWhen' as const, label: 'Atlas should escalate when', hint: 'Define the conditions that trigger human review.' },
          { key: 'neverAssume' as const, label: 'Atlas should never assume', hint: 'What facts or decisions must always be verified?' },
          { key: 'behaveLike' as const, label: 'Atlas should behave like', hint: 'Describe the role or archetype Atlas should embody.' },
        ].map(({ key, label, hint }) => (
          <AdminField key={key} label={label} hint={hint} value={data.s4[key]} rows={2}
            onChange={v => setData(d => ({ ...d, s4: { ...d.s4, [key]: v } }))} />
        ))}
      </AdminCard>

      <AdminCard>
        <SectionHeader icon="⚡" title="Fast-Start Option (10 minutes)"
          subtitle="If you only have time for one section — complete this. These six questions produce the most essential intent signal." />
        {[
          { key: 'protect', label: 'What does RMGDRI most want to protect?' },
          { key: 'neverSacrifice', label: 'What should never be sacrificed for speed?' },
          { key: 'alwaysAsk', label: 'When should Atlas always ask a human?' },
          { key: 'neverGuess', label: 'What facts must never be guessed?' },
          { key: 'helpful', label: 'What would make Atlas feel genuinely helpful to you?' },
          { key: 'dangerous', label: 'What would make Atlas feel dangerous or misaligned?' },
        ].map(({ key, label }) => (
          <AdminField key={key} label={label} value={data.s4.fastStart[key]} rows={2}
            onChange={v => setData(d => ({ ...d, s4: { ...d.s4, fastStart: { ...d.s4.fastStart, [key]: v } } }))} />
        ))}
      </AdminCard>

      <AdminCard style={{ background: AdminColors.muted }}>
        <SectionHeader icon="⬇" title="Export Intent Profile (JSON)" subtitle="Copy this for use in Atlas governance configuration." />
        <pre style={{ background: '#1C1C1C', color: '#A8FF78', padding: 16, borderRadius: 8, fontSize: 11,
          overflow: 'auto', maxHeight: 300, lineHeight: 1.6 }}>
          {JSON.stringify({
            rmgdri_intent_profile: {
              version: '1.0',
              generated: new Date().toISOString(),
              atlas_optimize_for: data.s4.optimizeFor || ap.optimizeFor,
              atlas_protect: data.s4.protect || ap.protect,
              atlas_escalate_when: data.s4.escalateWhen || ap.escalateWhen,
              atlas_never_assume: data.s4.neverAssume,
              atlas_behave_like: data.s4.behaveLike,
              stakeholder_priority: Object.entries(data.s2a.stakeholders).filter(([, v]) => v).sort(([, a], [, b]) => Number(a) - Number(b)).map(([k, v]) => ({ stakeholder: k, rank: v })),
              hard_prohibitions: checked(data.s2b.neverDo),
              escalation_triggers: checked(data.s2b.escalate),
              tone_use: checked(data.s2c.useTone),
              tone_avoid: checked(data.s2c.avoidTone),
              judgment_examples: data.s3.examples.filter(e => e.situation),
              bad_patterns: data.s3.badPatterns,
            }
          }, null, 2)}
        </pre>
      </AdminCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main form                                                          */
/* ------------------------------------------------------------------ */

export default function IntentForm({ passphrase }: { passphrase: string }) {
  const [activeStage, setActiveStage] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const reqHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      'x-admin-passphrase': passphrase,
    }),
    [passphrase]
  )

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/intent', { headers: reqHeaders() })
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled) {
          const saved = json.data
          if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
            setData(mergeWithInitial(saved as Record<string, unknown>))
          }
          setLoaded(true)
        }
      } catch {
        if (!cancelled) setLoaded(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [reqHeaders])

  const handleSetData = useCallback((updater: (d: FormData) => FormData) => {
    setData(prev => {
      const next = updater(prev)
      return { ...next, lastSaved: null }
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    const toSave = { ...data, lastSaved: new Date().toISOString() }
    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: reqHeaders(),
        body: JSON.stringify(toSave),
      })
      if (res.ok) {
        setData(toSave)
        setSaveMsg('Saved ✓')
        setTimeout(() => setSaveMsg(''), 2500)
      } else {
        setSaveMsg('Save failed')
      }
    } catch {
      setSaveMsg('Save failed')
    }
    setSaving(false)
  }

  const progress = loaded ? stageProgress(data) : STAGE_META.map(() => ({ pct: 0, filled: 0, total: 0 }))
  const totalPct = Math.round(progress.reduce((s, p) => s + p.pct, 0) / progress.length)

  if (!loaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: AdminColors.bg }}>
      <p style={{ color: AdminColors.textLight, fontSize: 14 }}>Loading your saved progress…</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: AdminColors.bg, fontFamily: AdminFonts.heading }}>
      {/* Header */}
      <div style={{ background: AdminColors.navy, color: '#fff', padding: '20px 32px', display: 'flex',
        alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#A8C4E8', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20 }}>
              RMGDRI
            </span>
            <span style={{ fontSize: 11, color: '#A8C4E8' }}>Atlas Governance Layer</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '0.02em' }}>
            Intent Engineering Workbook
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#A8C4E8' }}>
            Prepared for Lori — Board President, RMGDRI
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: totalPct === 100 ? '#7FE0A0' : '#FFD580' }}>{totalPct}%</div>
          <div style={{ fontSize: 11, color: '#A8C4E8' }}>overall complete</div>
          {data.lastSaved && <div style={{ fontSize: 10, color: '#7A9FCC', marginTop: 2 }}>
            Last saved {new Date(data.lastSaved).toLocaleTimeString()}
          </div>}
        </div>
      </div>

      {/* Stage nav */}
      <div style={{ background: '#162A47', borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0 32px', display: 'flex', gap: 0 }}>
        {STAGE_META.map((s, i) => {
          const p = progress[i]
          const active = activeStage === i
          return (
            <button key={s.id} onClick={() => setActiveStage(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', borderBottom: active ? `3px solid ${AdminColors.goldLight}` : '3px solid transparent',
                color: active ? '#fff' : '#7A9FCC', cursor: 'pointer', transition: 'all 0.15s',
                fontSize: 13, fontFamily: AdminFonts.heading }}>
              <ProgressRing pct={p.pct} size={28} stroke={3} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: active ? AdminColors.goldLight : '#5A7A9F', fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 12, fontWeight: active ? 700 : 400 }}>{s.title}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Progress bar strip */}
      <div style={{ height: 4, background: AdminColors.border }}>
        <div style={{ height: '100%', background: AdminColors.goldLight, width: `${totalPct}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 80px' }}>
        {/* Stage intro banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
          background: AdminColors.surface, border: `1px solid ${AdminColors.border}`, borderRadius: 10, marginBottom: 24,
          borderLeft: `4px solid ${STAGE_META[activeStage].color}` }}>
          <ProgressRing pct={progress[activeStage].pct} size={42} stroke={4} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: AdminColors.navy, fontWeight: 700 }}>
              {STAGE_META[activeStage].icon} {STAGE_META[activeStage].title}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: AdminColors.textLight }}>
              {progress[activeStage].filled} of {progress[activeStage].total} fields completed
              {progress[activeStage].pct === 100 && ' — ✓ Stage complete'}
            </p>
          </div>
        </div>

        {activeStage === 0 && <Stage1 data={data} setData={handleSetData} />}
        {activeStage === 1 && <Stage2 data={data} setData={handleSetData} />}
        {activeStage === 2 && <Stage3 data={data} setData={handleSetData} />}
        {activeStage === 3 && <Stage4 data={data} setData={handleSetData} />}
      </div>

      {/* Save bar */}
      <AdminSaveBar
        onSave={handleSave}
        saving={saving}
        saveMsg={saveMsg}
        activeStage={activeStage}
        totalStages={STAGE_META.length}
        onPrev={() => setActiveStage(a => a - 1)}
        onNext={() => setActiveStage(a => a + 1)}
      />
    </div>
  )
}
