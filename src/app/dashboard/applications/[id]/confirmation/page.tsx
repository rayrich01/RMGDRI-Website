import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Application Submitted!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in adopting a Great Dane. Your application
          has been received and our team will review it shortly.
        </p>

        <div className="bg-blue-50 p-4 rounded-md text-left mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">What happens next?</h2>
          <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
            <li>Our team will review your application</li>
            <li>A volunteer will contact you for a phone interview</li>
            <li>If approved, we&apos;ll schedule a home check</li>
            <li>Once everything is confirmed, we&apos;ll work on matching you with a Dane</li>
          </ol>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            View My Dashboard
          </Link>
          <Link
            href="/"
            className="text-gray-600 px-6 py-2 rounded-md border hover:bg-gray-50"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
