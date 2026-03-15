"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminColors, AdminFonts } from "@/styles/admin-tokens";
import { AdminField, AdminCard, AdminSaveBar } from "@/components/admin/ui";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface IntentData {
  // Stage 1 — Core Identity
  orgName?: string;
  missionStatement?: string;
  primaryAudience?: string;
  problemSolved?: string;
  uniqueValue?: string;

  // Stage 2 — Digital Goals
  websitePurpose?: string;
  topThreeActions?: string;
  successMetrics?: string;
  currentPainPoints?: string;

  // Stage 3 — Content & Voice
  brandVoice?: string;
  keyMessages?: string;
  contentTypes?: string;
  existingAssets?: string;

  // Stage 4 — Technical & Operations
  integrations?: string;
  userAccounts?: string;
  complianceNeeds?: string;
  launchTimeline?: string;
}

const EMPTY: IntentData = {};

const STAGE_META = [
  { title: "Stage 1 — Core Identity", description: "Define who you are and why you exist." },
  { title: "Stage 2 — Digital Goals", description: "What should your website accomplish?" },
  { title: "Stage 3 — Content & Voice", description: "How should your organization sound and what content do you need?" },
  { title: "Stage 4 — Technical & Operations", description: "Integrations, accounts, compliance, and timeline." },
];

/* ------------------------------------------------------------------ */
/*  Section header (form-specific, not extracted per CR spec)          */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{
        fontSize: 18, fontWeight: 700, color: AdminColors.navy,
        fontFamily: AdminFonts.heading, margin: 0,
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: 13, color: AdminColors.textLight, marginTop: 4,
        fontFamily: AdminFonts.body,
      }}>
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main form                                                          */
/* ------------------------------------------------------------------ */

export default function IntentForm({ passphrase }: { passphrase: string }) {
  const [data, setData] = useState<IntentData>(EMPTY);
  const [activeStage, setActiveStage] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const reqHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      "x-admin-passphrase": passphrase,
    }),
    [passphrase]
  );

  // Load on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/intent", { headers: reqHeaders() });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!cancelled) {
          setData(json.data ?? {});
          setStatus("idle");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Failed to load");
          setStatus("error");
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [reqHeaders]);

  function set<K extends keyof IntentData>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (status === "saved" || status === "error") setStatus("idle");
    setSaveMsg("");
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    setSaveMsg("");
    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: reqHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      setStatus("saved");
      setSaveMsg("✓ Saved");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setErrorMsg(msg);
      setStatus("error");
      setSaveMsg(msg);
    }
  }

  if (status === "loading") {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "40vh", background: AdminColors.bg,
      }}>
        <p style={{ color: AdminColors.textLight, fontFamily: AdminFonts.body }}>
          Loading workbook...
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: AdminColors.bg, minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: AdminColors.navy, padding: "20px 32px",
        color: "#fff", fontFamily: AdminFonts.heading,
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          Intent Engineering Workbook
        </h1>
        <p style={{ fontSize: 13, color: "#A8C4E8", marginTop: 4 }}>
          Work through each stage at your own pace. Click <strong>Save Progress</strong> at any time.
        </p>
      </div>

      {/* Stage tabs */}
      <div style={{
        display: "flex", gap: 0, background: AdminColors.navy,
        borderBottom: `3px solid ${AdminColors.gold}`, paddingLeft: 32,
      }}>
        {STAGE_META.map((stage, i) => (
          <button
            key={i}
            onClick={() => setActiveStage(i)}
            style={{
              padding: "10px 20px", border: "none", cursor: "pointer",
              background: activeStage === i ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeStage === i ? "#fff" : "#A8C4E8",
              fontWeight: activeStage === i ? 700 : 400,
              fontSize: 13, fontFamily: AdminFonts.ui,
              borderBottom: activeStage === i ? `3px solid ${AdminColors.goldLight}` : "3px solid transparent",
              marginBottom: -3,
              transition: "all 0.15s",
            }}
          >
            Stage {i + 1}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
        {activeStage === 0 && (
          <AdminCard>
            <SectionHeader title={STAGE_META[0].title} description={STAGE_META[0].description} />
            <AdminField label="Organization Name" value={data.orgName ?? ""} onChange={(v) => set("orgName", v)} rows={1} />
            <AdminField label="Mission Statement" hint="In one or two sentences, what is your mission?" value={data.missionStatement ?? ""} onChange={(v) => set("missionStatement", v)} />
            <AdminField label="Primary Audience" hint="Who are you trying to reach? Be specific." value={data.primaryAudience ?? ""} onChange={(v) => set("primaryAudience", v)} />
            <AdminField label="Problem You Solve" hint="What problem does your organization address?" value={data.problemSolved ?? ""} onChange={(v) => set("problemSolved", v)} />
            <AdminField label="Unique Value Proposition" hint="What makes you different from similar organizations?" value={data.uniqueValue ?? ""} onChange={(v) => set("uniqueValue", v)} />
          </AdminCard>
        )}

        {activeStage === 1 && (
          <AdminCard>
            <SectionHeader title={STAGE_META[1].title} description={STAGE_META[1].description} />
            <AdminField label="Website Purpose" hint="In one sentence, why does this website exist?" value={data.websitePurpose ?? ""} onChange={(v) => set("websitePurpose", v)} />
            <AdminField label="Top Three Actions" hint="What are the three most important things a visitor should do?" value={data.topThreeActions ?? ""} onChange={(v) => set("topThreeActions", v)} />
            <AdminField label="Success Metrics" hint="How will you measure whether the website is working?" value={data.successMetrics ?? ""} onChange={(v) => set("successMetrics", v)} />
            <AdminField label="Current Pain Points" hint="What isn't working with your current web presence?" value={data.currentPainPoints ?? ""} onChange={(v) => set("currentPainPoints", v)} />
          </AdminCard>
        )}

        {activeStage === 2 && (
          <AdminCard>
            <SectionHeader title={STAGE_META[2].title} description={STAGE_META[2].description} />
            <AdminField label="Brand Voice" hint="Describe the tone: professional, warm, urgent, playful, etc." value={data.brandVoice ?? ""} onChange={(v) => set("brandVoice", v)} />
            <AdminField label="Key Messages" hint="What are the 3-5 things every visitor should walk away knowing?" value={data.keyMessages ?? ""} onChange={(v) => set("keyMessages", v)} />
            <AdminField label="Content Types" hint="Blog posts, success stories, photo galleries, forms, etc." value={data.contentTypes ?? ""} onChange={(v) => set("contentTypes", v)} />
            <AdminField label="Existing Assets" hint="What do you already have? Photos, copy, logos, documents?" value={data.existingAssets ?? ""} onChange={(v) => set("existingAssets", v)} />
          </AdminCard>
        )}

        {activeStage === 3 && (
          <AdminCard>
            <SectionHeader title={STAGE_META[3].title} description={STAGE_META[3].description} />
            <AdminField label="Integrations" hint="Payment processors, email marketing, social media, CRM, etc." value={data.integrations ?? ""} onChange={(v) => set("integrations", v)} />
            <AdminField label="User Accounts" hint="Do visitors need accounts? Admin roles? Volunteer portals?" value={data.userAccounts ?? ""} onChange={(v) => set("userAccounts", v)} />
            <AdminField label="Compliance Needs" hint="Accessibility (WCAG), privacy policy, data retention, etc." value={data.complianceNeeds ?? ""} onChange={(v) => set("complianceNeeds", v)} />
            <AdminField label="Launch Timeline" hint="When does this need to go live? Any hard deadlines?" value={data.launchTimeline ?? ""} onChange={(v) => set("launchTimeline", v)} />
          </AdminCard>
        )}
      </div>

      {/* Save bar */}
      <AdminSaveBar
        onSave={handleSave}
        saving={status === "saving"}
        saveMsg={saveMsg}
        activeStage={activeStage}
        totalStages={STAGE_META.length}
        onPrev={() => setActiveStage((a) => a - 1)}
        onNext={() => setActiveStage((a) => a + 1)}
      />
    </div>
  );
}
