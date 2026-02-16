"use client";

import { useMemo, useState } from "react";
import { OWNER_SURRENDER_FORM_KEY } from "@/lib/forms/owner-surrender/labels";

import * as OwnerSurrenderFieldMapMod from "@/lib/forms/owner-surrender/field-map";

function getOwnerSurrenderFieldMap(): Array<{ key: string; label: string; required?: boolean }> {
  const mod: any = OwnerSurrenderFieldMapMod;
  // Common patterns: default export, or a named export that's an array
  if (Array.isArray(mod?.default)) return mod.default;
  for (const k of Object.keys(mod)) {
    if (Array.isArray(mod[k])) return mod[k];
  }
  throw new Error("Owner surrender field-map export not found (expected default export or named array export).");
}

type FormState = Record<string, any>;

export default function ApplySurrenderPage() {
  const [state, setState] = useState<FormState>(() => ({
    owner_first_name: "",
    owner_last_name: "",
    owner_email: "",
    owner_address_line1: "",
    owner_address_line2: "",
    owner_city: "",
    owner_state: "",
    owner_postal_code: "",
    owner_contact_phone_primary: "",
    owner_contact_phone_secondary: "",
    dog_name: "",
    dog_dob_or_age: "",
    surrender_reason: "",
    interested_in_resources_to_keep: "no",
    surrender_deadline: "",
    heard_about_rmgdri: "",
    print_dog_name_cert: "",
    certify_lawful_owner: "yes",
    certify_over_18: "yes",
    certify_accept_surrender_agreement: "yes",
    release_email_to_new_owner: "no",
    todays_date: "",
    certify_email_communication_ack: "yes",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const requiredMissing = useMemo(() => {
    const requiredDefs = (getOwnerSurrenderFieldMap()).filter((f) => f.required);
    return requiredDefs
      .filter((f) => !String(state[f.key] ?? "").trim())
      .map((f) => f.key);
  }, [state]);

  const requiredLabelByKey = useMemo(() => {
    const m = new Map<string, string>();
    for (const f of (getOwnerSurrenderFieldMap())) m.set(f.key, f.label);
    return m;
  }, []);
async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (requiredMissing.length) {
      setResult(`Missing required fields: ${requiredMissing.map((k) => requiredLabelByKey.get(k) ?? k).join(", ")}`);
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
        setResult(`Submit failed (${res.status}): ${JSON.stringify(json)}`);
      } else {
        setResult(`Submitted OK (formKey=${OWNER_SURRENDER_FORM_KEY}) id=${json?.id ?? "null"}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function bind(name: string) {
    return {
      name,
      value: state[name] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setState((s) => ({ ...s, [name]: e.target.value })),
    };
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Owner Surrender</h1>
      <p className="mt-2 text-sm opacity-80">
        This is a scaffold for the full 20-page Owner Surrender form. We’ll expand field parity next.
      </p>

      <form className="mt-8 space-y-8" onSubmit={onSubmit}>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Owner</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm">First name *</span>
              <input className="rounded border px-3 py-2" {...bind("owner_first_name")} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Last name *</span>
              <input className="rounded border px-3 py-2" {...bind("owner_last_name")} />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Email *</span>
            <input className="rounded border px-3 py-2" type="email" {...bind("owner_email")} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Address line 1 *</span>
            <input className="rounded border px-3 py-2" {...bind("owner_address_line1")} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Address line 2</span>
            <input className="rounded border px-3 py-2" {...bind("owner_address_line2")} />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm">City *</span>
              <input className="rounded border px-3 py-2" {...bind("owner_city")} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">State *</span>
              <input className="rounded border px-3 py-2" {...bind("owner_state")} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Postal/Zip *</span>
              <input className="rounded border px-3 py-2" {...bind("owner_postal_code")} />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Preferred contact phone *</span>
            <input className="rounded border px-3 py-2" {...bind("owner_contact_phone_primary")} />
          </label>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Dog</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm">Dog name / nicknames *</span>
              <input className="rounded border px-3 py-2" {...bind("dog_name")} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">DOB / approximate age *</span>
              <input className="rounded border px-3 py-2" {...bind("dog_dob_or_age")} />
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Surrender</h2>

          <label className="grid gap-1">
            <span className="text-sm">Why are you surrendering the dog? *</span>
            <textarea className="min-h-28 rounded border px-3 py-2" {...bind("surrender_reason")} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">If we could help resolve this issue, would you keep the dog? *</span>
            <select className="rounded border px-3 py-2" {...bind("interested_in_resources_to_keep")}>
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">When does the dog absolutely need to be out? *</span>
            <input className="rounded border px-3 py-2" {...bind("surrender_deadline")} />
          </label>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Wrap-up</h2>
          <label className="grid gap-1">
            <span className="text-sm">How did you hear about RMGDRI? *</span>
            <input className="rounded border px-3 py-2" {...bind("heard_about_rmgdri")} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Print the name of the dog you are surrendering *</span>
            <input className="rounded border px-3 py-2" {...bind("print_dog_name_cert")} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Today’s date *</span>
            <input className="rounded border px-3 py-2" {...bind("todays_date")} />
          </label>
        </section>

        <div className="flex items-center gap-3">
          <button
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {result ? <p className="text-sm">{result}</p> : null}
        </div>
      </form>
    </main>
  );
}
