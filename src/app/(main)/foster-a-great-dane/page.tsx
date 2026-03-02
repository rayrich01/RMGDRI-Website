import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Foster Information | RMGDRI',
  description: 'Learn about fostering a Great Dane with Rocky Mountain Great Dane Rescue.',
}

export default function FosterPage() {
  return (
    <main className="pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-900">Foster Information</h1>

        {/* Featured Image */}
        <div className="mb-10 rounded-lg overflow-hidden">
          <Image
            src="/images/pages/foster/foster-hero-dane.jpg"
            alt="Great Dane sitting in a meadow — Foster a Great Dane with RMGDRI"
            width={1200}
            height={466}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xl text-gray-700 leading-relaxed">
            Foster families are the heart of our rescue. Without dedicated foster homes,
            we couldn&apos;t save as many Great Danes as we do. Become a foster parent and help save lives!
          </p>
        </div>

        <div className="space-y-10">
          {/* Why Foster */}
          <section className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Foster?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <span className="text-3xl mr-4 mt-1">❤️</span>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Save Lives</h3>
                  <p className="text-gray-700">Every foster home opens up space to rescue another dog in need. You directly save lives by fostering.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4 mt-1">🏠</span>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Home Environment</h3>
                  <p className="text-gray-700">Dogs thrive in a home setting where they can learn routines, receive training, and show their true personalities.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4 mt-1">👥</span>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Join a Community</h3>
                  <p className="text-gray-700">Connect with other foster families and volunteers who share your passion for helping Great Danes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4 mt-1">😊</span>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Rewarding Experience</h3>
                  <p className="text-gray-700">Watch your foster dog transform and find their forever home – it&apos;s incredibly fulfilling!</p>
                </div>
              </div>
            </div>
          </section>

          {/* What Fostering Involves */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What Does Fostering Involve?</h2>
            <div className="space-y-4">
              {[
                { icon: '🏡', title: 'Provide a Safe Home', desc: "Offer a secure, loving environment where your foster dog can decompress, heal, and learn what it's like to be part of a family." },
                { icon: '🍽️', title: 'Daily Care', desc: 'Feed, exercise, and provide basic care for your foster dog. RMGDRI provides food and covers all medical expenses.' },
                { icon: '🎓', title: 'Training & Socialization', desc: 'Work on basic manners, house training, and socialization. Help your foster dog become the best version of themselves.' },
                { icon: '🩺', title: 'Medical Appointments', desc: 'Transport your foster dog to veterinary appointments as needed. RMGDRI covers all medical costs.' },
                { icon: '💬', title: 'Communication', desc: "Keep the adoption coordinator updated on your foster dog's progress, behavior, and any concerns." },
                { icon: '👤', title: 'Meet & Greets', desc: 'Facilitate meetings with potential adopters and help find the perfect forever home for your foster dog.' },
              ].map((item, i) => (
                <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-teal-500 transition-colors">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-gray-700 ml-11">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Foster Requirements</h2>
            <div className="space-y-4 text-gray-700">
              {[
                'Must be 21 years of age or older',
                'Own your home or have landlord approval for fostering large breed dogs',
                'Have a securely fenced yard or tell us how you will exercise your foster Dane',
                'All current pets must be spayed/neutered and up-to-date on vaccinations',
                'Have reliable transportation for vet appointments',
                'Be able to keep foster dogs separate from your own pets initially',
                'Agree to a home visit before fostering',
              ].map((req, i) => (
                <div key={i} className="flex items-start">
                  <span className="text-xl text-teal-600 mr-3 mt-1">✓</span>
                  <p className="text-lg">{req}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What RMGDRI Provides */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What RMGDRI Provides</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-teal-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Medical Care</h3>
                <p className="text-gray-700">All veterinary expenses, medications, and medical treatments are covered by RMGDRI.</p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">🥣</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Food &amp; Supplies</h3>
                <p className="text-gray-700">We provide dog food and can assist with crates, beds, and other necessary supplies.</p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">24/7 Support</h3>
                <p className="text-gray-700">Our team is always available to answer questions and provide guidance throughout your fostering journey.</p>
              </div>
              <div className="bg-teal-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Foster Network</h3>
                <p className="text-gray-700">Connect with experienced foster families who can share tips and support.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-blue-50 p-10 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-6 mt-8 max-w-3xl mx-auto">
              {[
                { q: 'How long do dogs stay in foster care?', a: "It varies! Some dogs are adopted within a few weeks, while others may need several months to find the right home. The average is 2-3 months." },
                { q: 'Can I choose which dog to foster?', a: "Yes! We work with you to match a dog that fits your lifestyle, experience level, and home environment." },
                { q: 'What if I have my own dogs?', a: "Many foster families have their own pets. We'll help match you with a foster dog that's compatible with your current pets." },
                { q: "What if fostering doesn't work out?", a: "We understand that sometimes things don't work as planned. You can contact us anytime, and we'll work together to find a solution." },
                { q: 'Can I adopt my foster dog?', a: 'Yes! Foster families have first priority if they wish to adopt their foster dog. Many "foster fails" become forever families!' },
              ].map((faq, i) => (
                <div key={i}>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Apply CTA */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-10 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Foster?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Take the first step in saving a Great Dane&apos;s life. Apply to become a foster family today!
            </p>
            <Link
              href="/foster-application"
              className="inline-block bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply to Foster
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
