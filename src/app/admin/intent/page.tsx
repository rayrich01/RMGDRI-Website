"use client";

import { useState } from "react";
import IntentForm from "@/components/admin/IntentForm";

export default function IntentPage() {
  const [passphrase, setPassphrase] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // We don't call the auth API here — the passphrase is sent as a header
    // on every /api/intent call. If the first load succeeds, we're good.
    if (!passphrase.trim()) {
      setError("Please enter the passphrase.");
      return;
    }
    setAuthed(true);
  }

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">
            Intent Engineering Workbook
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Enter the admin passphrase to continue.
          </p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter passphrase"
              autoFocus
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={!passphrase.trim()}
              className="w-full bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Open Workbook
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <IntentForm passphrase={passphrase} />;
}
