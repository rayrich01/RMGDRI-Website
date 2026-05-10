import Image from "next/image";

export const metadata = {
  title: "Adoption Foster Thank You | RMGDRI",
  description:
    "Thank you for your adoption or foster application with Rocky Mountain Great Dane Rescue, Inc.",
};

export default function AppThankYouPage() {
  return (
    <main className="pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You for Your Application
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600">
            We are Working Hard On Placing a Dane in Your Home
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/wp-content/uploads/2014/11/IMG_2011.jpg"
              alt="Harlequin Great Dane"
              width={2310}
              height={1536}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="space-y-6 text-lg text-gray-700">
            <p>
              Thank you for your interest in adopting or fostering a Great Dane through
              Rocky Mountain Great Dane Rescue, Inc. With your support, we have been
              able to rescue, rehome and rehabilitate many Great Danes.
            </p>
            <p>
              Please be patient with our process, as we are committed to find the best
              forever homes for our Great Danes. It is good to remember that we are
              all volunteers dedicating our free time to support the RMGDRI mission.
              This process can take up to 4 weeks, but usually quicker.
            </p>
            <p>
              Rest assured we are working hard on your application and are as excited
              as you to place a Great Dane into your home.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
