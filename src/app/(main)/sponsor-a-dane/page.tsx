import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Sponsor a Dane | RMGDRI',
  description:
    'Be an angel for a Great Dane in need. Your sponsorship provides life-saving care, support for special needs dogs, and hope for permanent fosters.',
}

export default function SponsorADanePage() {
  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section - WordPress Inspired */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white overflow-hidden">
        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Sponsor-a-Dane
              </h1>
              <p className="text-2xl md:text-3xl text-teal-300 mb-6">
                Consider Sponsoring. Be an Angel.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We firmly believe that we should do all that we can to rescue,
                rehabilitate and rehome Great Danes in need. Your sponsorship
                makes this life-saving work possible.
              </p>
            </div>

            {/* Featured Image */}
            <div className="relative hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src="/images/sponsor-hero.jpg"
                  alt="Beautiful Great Dane in polka dot harness sitting proudly"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Mission & Cost Information - WordPress Content */}
        <section className="mb-12 prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Many of these gentle giants require expensive medical care—spaying
            or neutering alone can cost <strong>more than $600 per dog</strong>
            , and special needs Danes often require even more extensive
            treatment. Without support, these dogs face uncertain futures and
            the risk of euthanasia.
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Through your sponsorship, we can continue to rescue, rehabilitate
            and rehome Great Danes who would otherwise have nowhere to turn.
            Your monthly or one-time contribution directly saves lives.
          </p>
        </section>

        {/* What is Sponsorship - Current Content */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What is Sponsorship?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you sponsor a Great Dane, you&apos;re making a commitment to
              help cover their care costs while they&apos;re in our program.
              Your monthly or one-time sponsorship directly supports your chosen
              dog&apos;s food, medical care, and daily needs.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Sponsorship is perfect for those who want to help but can&apos;t
              adopt or foster. You&apos;ll receive updates on your sponsored
              Dane and know you&apos;re making a real difference in their life.
            </p>
          </div>
        </section>

        {/* Why Sponsor - Current Content */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why Sponsorship Matters
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-3">
                Direct Impact
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your sponsorship goes directly to your chosen dog&apos;s care.
                You&apos;ll know exactly which Great Dane you&apos;re helping.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-3">
                Special Needs Support
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Many Great Danes need expensive medical treatments or long-term
                care. Sponsorship helps cover these critical costs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-3">
                Extended Care
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Some dogs stay with us for months while waiting for the right
                home. Sponsorship ensures they receive quality care throughout
                their wait.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-3">
                Regular Updates
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Receive photos and updates about your sponsored Dane&apos;s
                progress, personality, and journey to their forever home.
              </p>
            </div>
          </div>
        </section>

        {/* Special Programs Section - WordPress Content */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Special Programs
          </h2>

          <div className="space-y-6">
            {/* Special Needs Danes */}
            <div className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 dark:border-amber-600 p-6 rounded-r-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Special Needs Danes
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Often we have Danes in our program who require advanced medical
                care beyond routine spay/neuter and vaccinations. These special
                needs dogs face a high risk of suffering or euthanasia without
                proper intervention and care.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                RMGDRI provides veterinary consultations and advanced medical
                treatment to ensure these dogs can live happy, healthy lives
                despite their special needs. Your sponsorship makes this
                life-saving care possible.
              </p>
            </div>

            {/* Permanent Foster Program */}
            <div className="bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500 dark:border-purple-600 p-6 rounded-r-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Permanent Foster Program
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Some Great Danes come to us who are terminally ill or too sick
                to be adopted into traditional homes. Our board of directors and
                veterinarians carefully assess each dog&apos;s quality of life
                and determine the best care plan.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                These special dogs remain in dedicated foster homes where they
                receive compassionate care and love for the remainder of their
                lives. RMGDRI provides ongoing financial and medical support to
                ensure their comfort and quality of life until their journey
                ends.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Sponsoring a Permanent Foster dog means giving a terminally ill
                or chronically sick Great Dane dignity, comfort, and love in
                their final days.
              </p>
            </div>
          </div>
        </section>

        {/* Sponsorship Levels - Current Content */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Sponsorship Levels
          </h2>
          <div className="space-y-6">
            <div className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Champion Sponsor
                  </h3>
                  <p className="text-teal-600 font-semibold text-lg">
                    $100/month or $1,200/year
                  </p>
                </div>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Impact
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Covers nearly all monthly costs for one Great Dane, including
                food, medications, and routine vet care.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Monthly photo updates and progress reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Recognition on website as Champion Sponsor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>
                    Notification when your Dane finds their forever home
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-teal-300 bg-teal-50 dark:bg-teal-950 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Hero Sponsor
                  </h3>
                  <p className="text-teal-600 font-semibold text-lg">
                    $50/month or $600/year
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Covers food and basic supplies for one Great Dane for a month.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Bi-monthly photo updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Recognition on website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Notification of adoption</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-300 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Friend Sponsor
                  </h3>
                  <p className="text-teal-600 font-semibold text-lg">
                    $25/month or $300/year
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Helps with daily care costs and supplies.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">✓</span>
                  <span>Quarterly updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">✓</span>
                  <span>Recognition on website</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works - Current Content */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            How Sponsorship Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Choose Your Dane
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Browse our available dogs and select one to sponsor. You can
                  sponsor any dog in our program, whether available for
                  adoption, in medical care, or a long-term resident.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Select Your Level
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Choose a sponsorship level that works for you. Set up monthly
                  recurring sponsorship or make a one-time annual contribution.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Receive Updates
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Get regular updates about your sponsored Dane&apos;s health,
                  personality, and progress toward finding their forever home.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Celebrate Adoption
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  When your sponsored Dane finds their forever home, you&apos;ll
                  be notified. You can then choose to sponsor another dog or
                  continue your support through general donations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* "Be an Angel" CTA - WordPress Inspired */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mb-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Will You Be an Angel Today?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your sponsorship can save a life and give a Great Dane the second
            chance they deserve. Join our community of angels who make rescue
            possible.
          </p>
          <a
            href="https://greatd.mybigcommerce.com/sponsor-a-dane/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Sponsor Now →
          </a>
          <p className="text-sm text-gray-400 mt-4">
            Secure payment through our trusted partner
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* FAQ - Merged Content */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Sponsorship Questions
          </h2>
          <div className="space-y-4">
            {/* WordPress FAQ Items */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                What is a Special Needs Dane?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                A Special Needs Dane requires advanced medical care beyond
                routine treatments. These dogs often face high medical costs and
                risk euthanasia without intervention. RMGDRI provides veterinary
                consultations and treatment to ensure they can live happy,
                healthy lives. Sponsorship directly supports their ongoing
                medical care.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                What is a Permanent Foster?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Permanent Fosters are Great Danes who are terminally ill or too
                sick to be adopted. Our board and veterinarians assess their
                quality of life, and these dogs remain in compassionate foster
                homes where RMGDRI provides ongoing financial and medical
                support until their journey ends. Sponsorship helps us give
                these dogs dignity and comfort in their final days.
              </p>
            </div>

            {/* Current FAQ Items */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Can I sponsor more than one Dane?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Absolutely! You can sponsor as many Great Danes as you&apos;d
                like to support.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                What happens if my sponsored Dane gets adopted quickly?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We&apos;ll notify you of the adoption and help you choose
                another Great Dane to sponsor, or you can convert your
                sponsorship to a general donation.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Is sponsorship tax-deductible?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes! RMGDRI is a 501(c)(3) nonprofit (EIN: 84-1565402). All
                sponsorship contributions are tax-deductible to the fullest
                extent allowed by law.
              </p>
            </div>
          </div>
        </section>

        {/* Secondary CTA - Current Content */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Choose a Great Dane to sponsor or learn more about our available
            dogs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/available-danes"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Meet Our Danes
            </Link>
            <Link
              href="/donate-to-rmgdri"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Donation
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
