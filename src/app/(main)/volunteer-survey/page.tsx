import VolunteerSurveyForm from "./VolunteerSurveyForm";

export const metadata = {
  title: "Volunteer Satisfaction Survey | RMGDRI",
  description:
    "Share your anonymous feedback to help us improve the volunteer experience at Rocky Mountain Great Dane Rescue.",
};

export default function VolunteerSurveyPage() {
  return (
    <main className="pb-20 bg-white">
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Volunteer Satisfaction Survey</h1>
          <p className="text-teal-100 text-lg">
            Your feedback is anonymous and helps us improve the volunteer experience.
          </p>
        </div>
      </section>
      <VolunteerSurveyForm />
    </main>
  );
}
