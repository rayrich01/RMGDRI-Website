"use client";

import { useMemo, useState } from "react";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";
import { OWNER_SURRENDER_FIELD_MAP } from "@/lib/forms/owner-surrender/field-map";

type FormState = Record<string, any>;

function isLongAnswer(label: string) {
  const l = label.toLowerCase();
  return (
    l.includes("why ") ||
    l.includes("what do you") ||
    l.includes("what level") ||
    l.includes("how often") ||
    l.includes("how does") ||
    l.includes("how long") ||
    l.includes("history") ||
    l.includes("describe") ||
    l.includes("prior") ||
    l.includes("surgeries") ||
    l.includes("anything") ||
    l.includes("where do you leave") ||
    l.includes("where does the dog") ||
    l.includes("play")
  );
}

export default function ApplySurrenderPage() {
  const requiredDefs = useMemo(
    () => OWNER_SURRENDER_FIELD_MAP.filter((f) => f.required),
    []
  );

  const labelByKey = useMemo(() => {
    return new Map(OWNER_SURRENDER_FIELD_MAP.map((f) => [f.key, f.label] as const));
  }, []);

  const [state, setState] = useState<FormState>(() => {
    const init: FormState = {};
    for (const f of requiredDefs) init[f.key] = "";
    return init;
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const missingKeys = useMemo(() => {
    return requiredDefs
      .filter((f) => !String(state[f.key] ?? "").trim())
      .map((f) => f.key);
  }, [requiredDefs, state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (missingKeys.length) {
      const msg = missingKeys
        .map((k) => labelByKey.get(k) ?? k)
        .join(", ");
      setResult(`Missing required fields: ${msg}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/forms/owner-surrender/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(state),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        // If server returns missing list, format with labels
        const missing = Array.isArray(json?.missing) ? json.missing : [];
        const msg = missing.length
          ? missing.map((k: string) => labelByKey.get(k) ?? k).join(", ")
          : JSON.stringify(json);
        setResult(`Submit failed (${res.status}): ${msg}`);
      } else {
        setResult(`Submitted OK (formKey=${OWNER_SURRENDER_FORM_KEY}) id=${json?.id ?? "null"}`);
        // Optionally clear
        // setState(Object.fromEntries(requiredDefs.map((f) => [f.key, ""])));
      }
    } finally {
      setSubmitting(false);
    }
  }

  function bind(name: string) {
    return {
      name,
      value: state[name] ?? "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => setState((s) => ({ ...s, [name]: e.target.value })),
    };
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Owner Surrender</h1>
      <p className="mt-2 text-sm opacity-80">
        Required-fields parity v1 (auto-generated). We’ll expand to full form parity next.
      </p>

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        {requiredDefs.map((f) => (
          <label key={f.key} className="grid gap-1">
            <span className="text-sm">
              {f.label} <span className="opacity-70">*</span>
            </span>
            {isLongAnswer(f.label) ? (
              <textarea className="min-h-24 rounded border px-3 py-2" {...bind(f.key)} />
            ) : (
              <input className="rounded border px-3 py-2" {...bind(f.key)} />
            )}
          </label>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {result ? <p className="text-sm">{result}</p> : null}
        </div>

        <details className="text-xs opacity-70">
          <summary className="cursor-pointer">Debug: required keys</summary>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(requiredDefs.map((f) => f.key), null, 2)}
          </pre>
        </details>
      </form>
    </main>
  );
}
