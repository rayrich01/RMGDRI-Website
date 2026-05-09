"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Person {
  id: string;
  people_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  experience: string | null;
  created_at: string;
}

const TAG_OPTIONS = [
  "foster_family", "board_member", "adopting_family", "volunteer",
  "coordinator", "transporter", "homechecker", "applications", "donor",
];

const TAG_COLORS: Record<string, string> = {
  foster_family: "bg-purple-100 text-purple-800",
  board_member: "bg-blue-100 text-blue-800",
  adopting_family: "bg-green-100 text-green-800",
  volunteer: "bg-yellow-100 text-yellow-800",
  donor: "bg-emerald-100 text-emerald-800",
};

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", tags: [] as string[] });
  const [saving, setSaving] = useState(false);

  async function load() {
    const url = filter ? `/api/admin/people?tag=${filter}` : "/api/admin/people";
    const res = await fetch(url);
    if (res.ok) {
      const { people: p } = await res.json();
      setPeople(p || []);
    }
  }

  useEffect(() => { load(); }, [filter]);

  async function create() {
    setSaving(true);
    const res = await fetch("/api/admin/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", experience: "", tags: [] });
      load();
    }
    setSaving(false);
  }

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">People Registry</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          {showForm ? "Cancel" : "+ Add Person"}
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button onClick={() => setFilter("")} className={`text-xs px-3 py-1 rounded-full ${!filter ? "bg-gray-800 text-white" : "bg-gray-100"}`}>All</button>
        {TAG_OPTIONS.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`text-xs px-3 py-1 rounded-full ${filter === t ? "bg-gray-800 text-white" : "bg-gray-100"}`}>
            {t.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-6 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="px-3 py-2 border rounded text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Experience</label>
            <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className="px-3 py-2 border rounded text-sm">
              <option value="">Select...</option>
              <option value="GDE">GDE — Great Dane Experience</option>
              <option value="GBE">GBE — Giant Breed Experience</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags</label>
            <div className="flex gap-2 flex-wrap">
              {TAG_OPTIONS.map(t => (
                <button key={t} type="button" onClick={() => toggleTag(t)}
                  className={`text-xs px-2 py-1 rounded-full border ${form.tags.includes(t) ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300"}`}>
                  {t.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
          <button onClick={create} disabled={saving || !form.name} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create Person"}
          </button>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tags</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Experience</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {people.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.people_id}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{p.email || p.phone || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.map(t => (
                      <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[t] || "bg-gray-100 text-gray-800"}`}>
                        {t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{p.experience || "—"}</td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No people found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">{people.length} records</p>
    </div>
  );
}
