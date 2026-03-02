"use client";

import BiteReportHumanForm from "@/components/forms/BiteReportHumanForm";

export default function BiteReportHumanPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bite Report &mdash; Human
      </h1>
      <p className="text-gray-600 mb-2">
        Use this form to report a bite incident involving a dog in RMGDRI&apos;s
        care. All fields marked with{" "}
        <span className="text-red-500 font-semibold">*</span> are required.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        A board member will review your submission. If you have an emergency,
        please contact 911 or your local Animal Control immediately.
      </p>

      <BiteReportHumanForm />
    </main>
  );
}
