"use client";

import { useState, useEffect } from "react";

interface Vet { id: string; vet_id: string; office_name: string; address_city: string | null; address_state: string | null; phone: string | null; email: string | null; specialty_services: string | null; }

export default function VetsPage() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vet_id: "", office_name: "", address_city: "", address_state: "", phone: "", email: "", specialty_services: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/vets");
    if (res.ok) { const { vets: v } = await res.json(); setVets(v || []); }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setSaving(true);
    const res = await fetch("/api/admin/vets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setShowForm(false); setForm({ vet_id: "", office_name: "", address_city: "", address_state: "", phone: "", email: "", specialty_services: "" }); load(); }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vet Registry</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Add Vet"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Vet ID (ST-####) *" value={form.vet_id} onChange={e => setForm(f => ({ ...f, vet_id: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Office Name *" value={form.office_name} onChange={e => setForm(f => ({ ...f, office_name: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="City" value={form.address_city} onChange={e => setForm(f => ({ ...f, address_city: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="State (CO)" value={form.address_state} onChange={e => setForm(f => ({ ...f, address_state: e.target.value }))} maxLength={2} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Specialty Services" value={form.specialty_services} onChange={e => setForm(f => ({ ...f, specialty_services: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
          </div>
          <button onClick={create} disabled={saving || !form.vet_id || !form.office_name} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50">
            {saving ? "Creating..." : "Add Vet"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Vet ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Office</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Specialty</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vets.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{v.vet_id}</td>
                <td className="px-4 py-3 font-medium">{v.office_name}</td>
                <td className="px-4 py-3 text-xs">{[v.address_city, v.address_state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-4 py-3 text-xs">{v.phone || "—"}</td>
                <td className="px-4 py-3 text-xs">{v.specialty_services || "—"}</td>
              </tr>
            ))}
            {vets.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No vets registered</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">{vets.length} records</p>
    </div>
  );
}
