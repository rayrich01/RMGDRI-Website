"use client";

import OwnerSurrenderForm from "@/components/forms/OwnerSurrenderForm";

export default function ApplySurrenderPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Owner Surrender Form
      </h1>
      <p className="text-gray-600 mb-8">
        Please complete all required fields below. Our Incoming Coordinator will
        contact you within 1&ndash;3 business days of submission.
      </p>
      <OwnerSurrenderForm />
    </main>
  );
}
