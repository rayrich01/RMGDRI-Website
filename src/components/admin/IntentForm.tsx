"use client";

import { useCallback, useEffect, useState } from "react";

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

/* ------------------------------------------------------------------ */
/*  Section helper                                                     */
/* ------------------------------------------------------------------ */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main form                                                          */
/* ------------------------------------------------------------------ */

export default function IntentForm({ passphrase }: { passphrase: string }) {
  const [data, setData] = useState<IntentData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const headers = useCallback(
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
        const res = await fetch("/api/intent", { headers: headers() });
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
  }, [headers]);

  function set<K extends keyof IntentData>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (status === "saved" || status === "error") setStatus("idle");
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      setStatus("saved");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Save failed");
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading workbook...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Intent Engineering Workbook
        </h1>
        <p className="text-gray-500 mt-1">
          Work through each stage at your own pace. Click <strong>Save Progress</strong> at any time.
        </p>
      </div>

      {/* Stage 1 */}
      <Section
        title="Stage 1 — Core Identity"
        description="Define who you are and why you exist."
      >
        <Field
          label="Organization Name"
          value={data.orgName ?? ""}
          onChange={(v) => set("orgName", v)}
          rows={1}
        />
        <Field
          label="Mission Statement"
          hint="In one or two sentences, what is your mission?"
          value={data.missionStatement ?? ""}
          onChange={(v) => set("missionStatement", v)}
        />
        <Field
          label="Primary Audience"
          hint="Who are you trying to reach? Be specific."
          value={data.primaryAudience ?? ""}
          onChange={(v) => set("primaryAudience", v)}
        />
        <Field
          label="Problem You Solve"
          hint="What problem does your organization address?"
          value={data.problemSolved ?? ""}
          onChange={(v) => set("problemSolved", v)}
        />
        <Field
          label="Unique Value Proposition"
          hint="What makes you different from similar organizations?"
          value={data.uniqueValue ?? ""}
          onChange={(v) => set("uniqueValue", v)}
        />
      </Section>

      {/* Stage 2 */}
      <Section
        title="Stage 2 — Digital Goals"
        description="What should your website accomplish?"
      >
        <Field
          label="Website Purpose"
          hint="In one sentence, why does this website exist?"
          value={data.websitePurpose ?? ""}
          onChange={(v) => set("websitePurpose", v)}
        />
        <Field
          label="Top Three Actions"
          hint="What are the three most important things a visitor should do?"
          value={data.topThreeActions ?? ""}
          onChange={(v) => set("topThreeActions", v)}
        />
        <Field
          label="Success Metrics"
          hint="How will you measure whether the website is working?"
          value={data.successMetrics ?? ""}
          onChange={(v) => set("successMetrics", v)}
        />
        <Field
          label="Current Pain Points"
          hint="What isn't working with your current web presence?"
          value={data.currentPainPoints ?? ""}
          onChange={(v) => set("currentPainPoints", v)}
        />
      </Section>

      {/* Stage 3 */}
      <Section
        title="Stage 3 — Content & Voice"
        description="How should your organization sound and what content do you need?"
      >
        <Field
          label="Brand Voice"
          hint="Describe the tone: professional, warm, urgent, playful, etc."
          value={data.brandVoice ?? ""}
          onChange={(v) => set("brandVoice", v)}
        />
        <Field
          label="Key Messages"
          hint="What are the 3-5 things every visitor should walk away knowing?"
          value={data.keyMessages ?? ""}
          onChange={(v) => set("keyMessages", v)}
        />
        <Field
          label="Content Types"
          hint="Blog posts, success stories, photo galleries, forms, etc."
          value={data.contentTypes ?? ""}
          onChange={(v) => set("contentTypes", v)}
        />
        <Field
          label="Existing Assets"
          hint="What do you already have? Photos, copy, logos, documents?"
          value={data.existingAssets ?? ""}
          onChange={(v) => set("existingAssets", v)}
        />
      </Section>

      {/* Stage 4 */}
      <Section
        title="Stage 4 — Technical & Operations"
        description="Integrations, accounts, compliance, and timeline."
      >
        <Field
          label="Integrations"
          hint="Payment processors, email marketing, social media, CRM, etc."
          value={data.integrations ?? ""}
          onChange={(v) => set("integrations", v)}
        />
        <Field
          label="User Accounts"
          hint="Do visitors need accounts? Admin roles? Volunteer portals?"
          value={data.userAccounts ?? ""}
          onChange={(v) => set("userAccounts", v)}
        />
        <Field
          label="Compliance Needs"
          hint="Accessibility (WCAG), privacy policy, data retention, etc."
          value={data.complianceNeeds ?? ""}
          onChange={(v) => set("complianceNeeds", v)}
        />
        <Field
          label="Launch Timeline"
          hint="When does this need to go live? Any hard deadlines?"
          value={data.launchTimeline ?? ""}
          onChange={(v) => set("launchTimeline", v)}
        />
      </Section>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between z-50">
        <div className="text-sm">
          {status === "saved" && (
            <span className="text-green-600 font-medium">Saved successfully</span>
          )}
          {status === "error" && (
            <span className="text-red-600 font-medium">{errorMsg}</span>
          )}
          {status === "idle" && (
            <span className="text-gray-400">Unsaved changes</span>
          )}
          {status === "saving" && (
            <span className="text-gray-400">Saving...</span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="bg-gray-900 text-white rounded-md px-6 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "saving" ? "Saving..." : "Save Progress"}
        </button>
      </div>
    </div>
  );
}
