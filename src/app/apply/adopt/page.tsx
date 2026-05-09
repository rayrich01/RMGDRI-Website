"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface ApplicationData {
  full_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  household_size?: number;
  home_type?: string;
  has_yard?: boolean;
  rent_or_own?: string;
  has_other_pets?: boolean;
  other_pets_details?: string;
  experience_with_large_dogs?: string;
  preferred_age?: string;
  preferred_gender?: string;
  activity_level?: string;
  additional_notes?: string;
}

export default function AdoptApplicationPage() {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationData>({});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function initApplication() {
      try {
        const res = await fetch("/api/applications");
        const { applications } = await res.json();
        const existingDraft = applications?.find(
          (a: { type: string; status: string }) => a.type === "adopt" && a.status === "draft"
        );
        if (existingDraft) {
          const detailRes = await fetch(`/api/applications/${existingDraft.id}`);
          const { application } = await detailRes.json();
          setApplicationId(application.id);
          setFormData(application.data || {});
        } else {
          const createRes = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "adopt", data: {} }),
          });
          const { application } = await createRes.json();
          setApplicationId(application.id);
        }
      } catch {
        setError("Failed to initialize application. Please try again.");
      }
    }
    initApplication();
  }, []);

  const autosave = useCallback(
    (data: ApplicationData) => {
      if (!applicationId) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          await fetch(`/api/applications/${applicationId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          });
          setLastSaved(new Date().toLocaleTimeString());
        } catch { /* silent autosave */ }
        setSaving(false);
      }, 2000);
    },
    [applicationId]
  );

  function updateField(field: keyof ApplicationData, value: unknown) {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    autosave(updated);
  }

  async function saveSection() {
    if (!applicationId) return;
    setSaving(true);
    try {
      await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  }

  async function handleSubmit() {
    if (!applicationId) return;
    setSubmitting(true);
    setError("");
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    });
    const res = await fetch(`/api/applications/${applicationId}/submit`, { method: "POST" });
    if (!res.ok) {
      const { error: errMsg } = await res.json();
      setError(errMsg || "Submission failed.");
      setSubmitting(false);
      return;
    }
    router.push(`/dashboard/applications/${applicationId}/confirmation`);
  }

  if (error && !applicationId) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">{error}</p></div>;
  }
  if (!applicationId) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading application...</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Adoption Application</h1>
        <div className="text-sm text-gray-500">
          {saving ? "Saving..." : lastSaved ? `Last saved: ${lastSaved}` : ""}
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="space-y-8">
        {/* Section 1: About You */}
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">About You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={formData.full_name || ""} onChange={(e) => updateField("full_name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" value={formData.state || ""} onChange={(e) => updateField("state", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <button onClick={saveSection} className="mt-4 text-sm text-blue-600 hover:underline">Save section</button>
        </section>

        {/* Section 2: Living Situation */}
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Living Situation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
              <input type="number" min="1" value={formData.household_size || ""} onChange={(e) => updateField("household_size", parseInt(e.target.value) || undefined)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Home Type</label>
              <select value={formData.home_type || ""} onChange={(e) => updateField("home_type", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select...</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Do you have a yard?</label>
              <select value={formData.has_yard === undefined ? "" : formData.has_yard ? "yes" : "no"} onChange={(e) => updateField("has_yard", e.target.value === "yes")} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent or Own?</label>
              <select value={formData.rent_or_own || ""} onChange={(e) => updateField("rent_or_own", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select...</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>
          <button onClick={saveSection} className="mt-4 text-sm text-blue-600 hover:underline">Save section</button>
        </section>

        {/* Section 3: Experience */}
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Experience</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Do you have other pets?</label>
              <select value={formData.has_other_pets === undefined ? "" : formData.has_other_pets ? "yes" : "no"} onChange={(e) => updateField("has_other_pets", e.target.value === "yes")} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {formData.has_other_pets && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Please describe your other pets</label>
                <textarea value={formData.other_pets_details || ""} onChange={(e) => updateField("other_pets_details", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience with large dogs</label>
              <select value={formData.experience_with_large_dogs || ""} onChange={(e) => updateField("experience_with_large_dogs", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select...</option>
                <option value="none">No experience</option>
                <option value="some">Some experience</option>
                <option value="experienced">Experienced owner</option>
                <option value="breed_specific">Great Dane experience</option>
              </select>
            </div>
          </div>
          <button onClick={saveSection} className="mt-4 text-sm text-blue-600 hover:underline">Save section</button>
        </section>

        {/* Section 4: Preferences */}
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Preferences & Additional Info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred age</label>
              <select value={formData.preferred_age || ""} onChange={(e) => updateField("preferred_age", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">No preference</option>
                <option value="puppy">Puppy (under 1 year)</option>
                <option value="young">Young (1-3 years)</option>
                <option value="adult">Adult (3-7 years)</option>
                <option value="senior">Senior (7+ years)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes</label>
              <textarea value={formData.additional_notes || ""} onChange={(e) => updateField("additional_notes", e.target.value)} rows={4} placeholder="Anything else you'd like us to know?" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <button onClick={saveSection} className="mt-4 text-sm text-blue-600 hover:underline">Save section</button>
        </section>

        {/* Submit */}
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-500">Your progress is saved automatically.</p>
          <button onClick={handleSubmit} disabled={submitting} className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium">
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
