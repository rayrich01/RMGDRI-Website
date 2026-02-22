import ShelterTransferForm from "@/components/forms/ShelterTransferForm";

export const metadata = {
  title: "Rescue / Shelter Transfer Form | RMGDRI",
  description:
    "Submit a shelter or rescue transfer request to Rocky Mountain Great Dane Rescue, Inc.",
};

export default function ShelterTransferPage() {
  return (
    <main className="pb-20 bg-white">
      <ShelterTransferForm />
    </main>
  );
}
