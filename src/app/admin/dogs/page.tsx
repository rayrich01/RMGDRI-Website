"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Dog {
  id: string;
  dane_id: string | null;
  name: string;
  status: string;
  sex: string | null;
  age_text: string | null;
  weight_lbs: number | null;
  state_of_foster: string | null;
  date_in: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  FN: { label: "Foster Needed", color: "bg-purple-100 text-purple-800" },
  WT: { label: "Waiting Transport", color: "bg-blue-100 text-blue-800" },
  UE: { label: "Under Evaluation", color: "bg-orange-100 text-orange-800" },
  BH: { label: "Behavior Hold", color: "bg-red-100 text-red-800" },
  MH: { label: "Medical Hold", color: "bg-red-100 text-red-800" },
  A: { label: "Available", color: "bg-green-100 text-green-800" },
  PA: { label: "Pending Adoption", color: "bg-yellow-100 text-yellow-800" },
  PF: { label: "Permanent Foster", color: "bg-violet-100 text-violet-800" },
  adopted: { label: "Adopted", color: "bg-emerald-100 text-emerald-800" },
  "rainbow-bridge": { label: "Rainbow Bridge", color: "bg-gray-100 text-gray-600" },
};

export default function DogsPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dane_id: "", status: "UE", sex: "", age_text: "", intake_id: "", state_of_origin: "", surrender_type: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const url = filter ? `/api/admin/dogs?status=${filter}` : "/api/admin/dogs";
    const res = await fetch(url);
    if (res.ok) {
      const { dogs: d } = await res.json();
      setDogs(d || []);
    }
  }

  useEffect(() => { load(); }, [filter]);

  async function create() {
    setSaving(true);
    const res = await fetch("/api/admin/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", dane_id: "", status: "UE", sex: "", age_text: "", intake_id: "", state_of_origin: "", surrender_type: "" });
      load();
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dogs Registry</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Add Dog"}
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button onClick={() => setFilter("")} className={`text-xs px-3 py-1 rounded-full ${!filter ? "bg-gray-800 text-white" : "bg-gray-100"}`}>All</button>
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`text-xs px-3 py-1 rounded-full ${filter === k ? "bg-gray-800 text-white" : v.color}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Dane ID (YYYY-###)" value={form.dane_id} onChange={e => setForm(f => ({ ...f, dane_id: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Intake ID" value={form.intake_id} onChange={e => setForm(f => ({ ...f, intake_id: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 border rounded text-sm">
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))} className="px-3 py-2 border rounded text-sm">
              <option value="">Sex...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Neutered Male">Neutered Male</option>
              <option value="Spayed Female">Spayed Female</option>
            </select>
            <input placeholder="Age (e.g., 2 years)" value={form.age_text} onChange={e => setForm(f => ({ ...f, age_text: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="State of Origin (CO)" value={form.state_of_origin} onChange={e => setForm(f => ({ ...f, state_of_origin: e.target.value }))} maxLength={2} className="px-3 py-2 border rounded text-sm" />
            <select value={form.surrender_type} onChange={e => setForm(f => ({ ...f, surrender_type: e.target.value }))} className="px-3 py-2 border rounded text-sm">
              <option value="">Surrender type...</option>
              <option value="owner_surrender">Owner Surrender</option>
              <option value="shelter_surrender">Shelter Surrender</option>
            </select>
          </div>
          <button onClick={create} disabled={saving || !form.name} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create Dog Record"}
          </button>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dane ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Sex</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Age</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Foster State</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date In</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {dogs.map(d => {
              const s = STATUS_LABELS[d.status] || { label: d.status, color: "bg-gray-100" };
              return (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{d.dane_id || "—"}</td>
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span></td>
                  <td className="px-4 py-3 text-xs">{d.sex || "—"}</td>
                  <td className="px-4 py-3 text-xs">{d.age_text || "—"}</td>
                  <td className="px-4 py-3 text-xs">{d.state_of_foster || "—"}</td>
                  <td className="px-4 py-3 text-xs">{d.date_in || "—"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/dogs/${d.id}`} className="text-blue-600 text-xs hover:underline">Detail →</Link>
                  </td>
                </tr>
              );
            })}
            {dogs.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No dogs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">{dogs.length} records</p>
    </div>
  );
}
