"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Dog { id: string; dane_id: string | null; name: string; status: string; sex: string | null; age_text: string | null; weight_lbs: number | null; color: string | null; ears: string | null; microchip_number: string | null; date_in: string | null; state_of_origin: string | null; state_of_foster: string | null; surrender_type: string | null; special_needs_notes: string | null; comments: string | null; }
interface MedicalRecord { id: string; exam_date: string | null; rabies_given: string | null; rabies_due: string | null; da2pp_given: string | null; da2pp_due: string | null; spay_neuter_date: string | null; heartworm_test_date: string | null; other_notes: string | null; created_at: string; }
interface BiteRecord { id: string; bite_date: string | null; dunbar_level: number; context: string; aimed_at_face_neck: boolean; description: string | null; meets_exception: boolean | null; board_vote_required: boolean | null; vet_eval_required: boolean | null; outcome: string | null; created_at: string; }
interface FosterAssignment { id: string; start_date: string | null; end_date: string | null; is_current: boolean; people: { name: string; people_id: string } | null; }

const DUNBAR_COLORS = ["bg-green-100","bg-green-100","bg-yellow-100","bg-orange-100","bg-red-100","bg-red-200","bg-red-300"];

export default function DogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [medical, setMedical] = useState<MedicalRecord[]>([]);
  const [bites, setBites] = useState<BiteRecord[]>([]);
  const [fosters, setFosters] = useState<FosterAssignment[]>([]);
  const [tab, setTab] = useState<"info" | "medical" | "bites" | "foster">("info");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Bite form
  const [biteForm, setBiteForm] = useState({ dunbar_level: 0, context: "incoming", aimed_at_face_neck: false, is_defensive: false, is_puppy_play: false, is_accidental_breakup: false, description: "", bite_date: "" });
  const [policyResult, setPolicyResult] = useState<{
    accepted: boolean; reason: string; dunbar_label: string;
    board_vote_required: boolean; vet_eval_required: boolean;
    behaviorist_eval_required: boolean; bloodwork_required: boolean;
    immediate_removal_from_foster: boolean; euthanasia_review: boolean;
    exception_met: boolean; exception_type: string | null;
    policy_references: string[];
  } | null>(null);

  // Medical form
  const [medForm, setMedForm] = useState({ exam_date: "", rabies_given: "", da2pp_given: "", spay_neuter_date: "", heartworm_test_date: "", other_notes: "" });

  async function load() {
    const res = await fetch(`/api/admin/dogs/${id}`);
    if (res.ok) {
      const data = await res.json();
      setDog(data.dog);
      setMedical(data.medical_records || []);
      setBites(data.bite_records || []);
      setFosters(data.foster_assignments || []);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function recordBite() {
    setSaving(true);
    const res = await fetch(`/api/admin/dogs/${id}/bites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(biteForm),
    });
    if (res.ok) {
      const { policy_evaluation } = await res.json();
      setPolicyResult(policy_evaluation);
      setMsg("Bite recorded — see policy evaluation below");
      load();
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 5000);
  }

  async function addMedical() {
    setSaving(true);
    await fetch(`/api/admin/dogs/${id}/medical`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medForm),
    });
    setMsg("Medical record added");
    setMedForm({ exam_date: "", rabies_given: "", da2pp_given: "", spay_neuter_date: "", heartworm_test_date: "", other_notes: "" });
    load();
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  if (!dog) return <p className="text-gray-500 p-8">Loading...</p>;

  const inputCls = "px-3 py-2 border border-gray-300 rounded text-sm w-full";
  const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div>
      <Link href="/admin/dogs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Dogs</Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dog.name}</h1>
            <p className="text-sm text-gray-500">{dog.dane_id || "No Dane ID"} · {dog.sex || "Unknown sex"} · {dog.age_text || "Age unknown"}</p>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100">{dog.status}</span>
        </div>
      </div>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm mb-4">{msg}</div>}

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(["info", "medical", "bites", "foster"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-t-lg ${tab === t ? "bg-white border border-b-0 font-medium" : "bg-gray-100 text-gray-600"}`}>
            {t === "info" ? "Info" : t === "medical" ? `Medical (${medical.length})` : t === "bites" ? `Bites (${bites.length})` : `Foster (${fosters.length})`}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {tab === "info" && (
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500">Color:</span> {dog.color || "—"}</div>
            <div><span className="text-gray-500">Weight:</span> {dog.weight_lbs ? `${dog.weight_lbs} lbs` : "—"}</div>
            <div><span className="text-gray-500">Ears:</span> {dog.ears || "—"}</div>
            <div><span className="text-gray-500">Microchip:</span> {dog.microchip_number || "—"}</div>
            <div><span className="text-gray-500">Date In:</span> {dog.date_in || "—"}</div>
            <div><span className="text-gray-500">Origin:</span> {dog.state_of_origin || "—"}</div>
            <div><span className="text-gray-500">Foster State:</span> {dog.state_of_foster || "—"}</div>
            <div><span className="text-gray-500">Surrender:</span> {dog.surrender_type?.replace(/_/g, " ") || "—"}</div>
          </div>
          {dog.special_needs_notes && <div className="mt-4 p-3 bg-yellow-50 rounded text-sm"><strong>Special Needs:</strong> {dog.special_needs_notes}</div>}
          {dog.comments && <div className="mt-2 p-3 bg-gray-50 rounded text-sm"><strong>Comments:</strong> {dog.comments}</div>}
        </div>
      )}

      {/* Medical Tab */}
      {tab === "medical" && (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Add Medical Record</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><label className={labelCls}>Exam Date</label><input type="date" value={medForm.exam_date} onChange={e => setMedForm(f => ({ ...f, exam_date: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Rabies Given</label><input type="date" value={medForm.rabies_given} onChange={e => setMedForm(f => ({ ...f, rabies_given: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>DA2PP Given</label><input type="date" value={medForm.da2pp_given} onChange={e => setMedForm(f => ({ ...f, da2pp_given: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Spay/Neuter Date</label><input type="date" value={medForm.spay_neuter_date} onChange={e => setMedForm(f => ({ ...f, spay_neuter_date: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Heartworm Test</label><input type="date" value={medForm.heartworm_test_date} onChange={e => setMedForm(f => ({ ...f, heartworm_test_date: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Notes</label><input value={medForm.other_notes} onChange={e => setMedForm(f => ({ ...f, other_notes: e.target.value }))} className={inputCls} /></div>
            </div>
            <button onClick={addMedical} disabled={saving} className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 disabled:opacity-50">Add Record</button>
          </div>
          {medical.map(m => (
            <div key={m.id} className="bg-white border rounded-lg p-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                {m.exam_date && <div><span className="text-gray-500">Exam:</span> {m.exam_date}</div>}
                {m.rabies_given && <div><span className="text-gray-500">Rabies:</span> {m.rabies_given}</div>}
                {m.da2pp_given && <div><span className="text-gray-500">DA2PP:</span> {m.da2pp_given}</div>}
                {m.spay_neuter_date && <div><span className="text-gray-500">Spay/Neuter:</span> {m.spay_neuter_date}</div>}
                {m.heartworm_test_date && <div><span className="text-gray-500">HW Test:</span> {m.heartworm_test_date}</div>}
              </div>
              {m.other_notes && <p className="mt-1 text-gray-600">{m.other_notes}</p>}
            </div>
          ))}
          {medical.length === 0 && <p className="text-gray-400 text-sm italic">No medical records</p>}
        </div>
      )}

      {/* Bites Tab */}
      {tab === "bites" && (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Record Bite Incident</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Dunbar Level</label>
                <select value={biteForm.dunbar_level} onChange={e => setBiteForm(f => ({ ...f, dunbar_level: parseInt(e.target.value) }))} className={inputCls}>
                  {[0,1,2,3,4,5,6].map(l => <option key={l} value={l}>Level {l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Context</label>
                <select value={biteForm.context} onChange={e => setBiteForm(f => ({ ...f, context: e.target.value }))} className={inputCls}>
                  <option value="incoming">Incoming</option>
                  <option value="foster">Foster</option>
                  <option value="returned_adoption">Returned Adoption</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div><label className={labelCls}>Date</label><input type="date" value={biteForm.bite_date} onChange={e => setBiteForm(f => ({ ...f, bite_date: e.target.value }))} className={inputCls} /></div>
            </div>
            <div className="flex gap-4 flex-wrap text-sm">
              <label className="flex items-center gap-1"><input type="checkbox" checked={biteForm.aimed_at_face_neck} onChange={e => setBiteForm(f => ({ ...f, aimed_at_face_neck: e.target.checked }))} /> Face/Neck</label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={biteForm.is_defensive} onChange={e => setBiteForm(f => ({ ...f, is_defensive: e.target.checked }))} /> Defensive (injured/sick)</label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={biteForm.is_puppy_play} onChange={e => setBiteForm(f => ({ ...f, is_puppy_play: e.target.checked }))} /> Puppy play (&lt;12mo)</label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={biteForm.is_accidental_breakup} onChange={e => setBiteForm(f => ({ ...f, is_accidental_breakup: e.target.checked }))} /> Accidental (fight breakup)</label>
            </div>
            <textarea placeholder="Description / circumstances" value={biteForm.description} onChange={e => setBiteForm(f => ({ ...f, description: e.target.value }))} rows={2} className={inputCls} />
            <button onClick={recordBite} disabled={saving} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50">Record & Evaluate Against Policy</button>
          </div>

          {/* Policy evaluation result */}
          {policyResult && (
            <div className={`border rounded-lg p-4 text-sm ${policyResult.accepted ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
              <h4 className="font-bold mb-2">{policyResult.accepted ? "✓ ACCEPTED" : "✗ NOT ACCEPTED"} — {policyResult.dunbar_label as string}</h4>
              <p className="mb-2">{policyResult.reason as string}</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {policyResult.board_vote_required && <div>⚠️ Board vote required</div>}
                {policyResult.vet_eval_required && <div>🏥 Vet evaluation required</div>}
                {policyResult.behaviorist_eval_required && <div>🧠 Behaviorist evaluation required</div>}
                {policyResult.bloodwork_required && <div>🩸 Bloodwork required (T3/T4)</div>}
                {policyResult.immediate_removal_from_foster && <div>🚨 Immediate removal from foster</div>}
                {policyResult.euthanasia_review && <div>⛔ Euthanasia review triggered</div>}
                {policyResult.exception_met && <div>✓ Exception: {policyResult.exception_type as string}</div>}
              </div>
              {(policyResult.policy_references as string[])?.length > 0 && (
                <details className="mt-2"><summary className="text-xs text-gray-500 cursor-pointer">Policy references</summary>
                  <ul className="text-xs text-gray-600 mt-1 space-y-0.5">{(policyResult.policy_references as string[]).map((r, i) => <li key={i}>• {r}</li>)}</ul>
                </details>
              )}
            </div>
          )}

          {/* Existing bites */}
          {bites.map(b => (
            <div key={b.id} className={`border rounded-lg p-3 text-sm ${DUNBAR_COLORS[b.dunbar_level] || "bg-gray-50"}`}>
              <div className="flex justify-between">
                <span className="font-medium">Level {b.dunbar_level} — {b.context}</span>
                <span className="text-xs text-gray-500">{b.bite_date || b.created_at?.slice(0, 10)}</span>
              </div>
              {b.aimed_at_face_neck && <span className="text-xs text-red-700 font-bold">⚠ FACE/NECK</span>}
              {b.description && <p className="text-xs mt-1">{b.description}</p>}
              <div className="flex gap-3 mt-1 text-xs text-gray-600">
                {b.board_vote_required && <span>Board vote required</span>}
                {b.vet_eval_required && <span>Vet eval required</span>}
                {b.outcome && <span>Outcome: {b.outcome}</span>}
              </div>
            </div>
          ))}
          {bites.length === 0 && !policyResult && <p className="text-gray-400 text-sm italic">No bite records</p>}
        </div>
      )}

      {/* Foster Tab */}
      {tab === "foster" && (
        <div className="space-y-3">
          {fosters.map(f => (
            <div key={f.id} className={`bg-white border rounded-lg p-3 text-sm ${f.is_current ? "border-purple-300" : ""}`}>
              <div className="flex justify-between">
                <span className="font-medium">{f.people?.name || "Unknown"} <span className="text-xs text-gray-500">({f.people?.people_id})</span></span>
                {f.is_current && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Current</span>}
              </div>
              <p className="text-xs text-gray-500">{f.start_date || "?"} → {f.end_date || "ongoing"}</p>
            </div>
          ))}
          {fosters.length === 0 && <p className="text-gray-400 text-sm italic">No foster assignments</p>}
        </div>
      )}
    </div>
  );
}
