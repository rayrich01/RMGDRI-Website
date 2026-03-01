import { Metadata } from "next";
import VolunteerForm from "@/components/forms/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer Application | Rocky Mountain Great Dane Rescue",
  description:
    "Apply to volunteer with RMGDRI. Help Great Danes across Colorado, Idaho, New Mexico, Montana, Utah, and Wyoming.",
};

export default function VolunteerApplicationPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer Application</h1>
      <p className="text-lg text-teal-700 font-medium mb-2">
        Thank you for your interest in volunteering with RMGDRI!
      </p>
      <p className="text-gray-600 mb-8">
        Rocky Mountain Great Dane Rescue is run entirely by dedicated volunteers. Please fill out
        this application and we will be in touch. Fields marked with{" "}
        <span className="text-red-500">*</span> are required.
      </p>

      <VolunteerForm />
    </main>
  );
}
