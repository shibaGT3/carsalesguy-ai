import Hero from "@/components/Hero";
import CredibilityBar from "@/components/CredibilityBar";
import Footer from "@/components/Footer";

const steps = [
  {
    number: 1,
    title: "Tell us your deal",
    description:
      "Select your deal type and answer a few quick questions about your vehicle and terms.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Get your email",
    description:
      "AI generates a ready-to-send negotiation email backed by real dealership expertise.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Refine & ask questions",
    description:
      "Chat with the AI to adjust your email or get insider advice on your deal.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Send & save",
    description:
      "Copy, paste, send to 3-5 dealers, and let them compete for your business.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a2e]">
      <Hero />
      <CredibilityBar />

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">
              How it works
            </h2>
            <p className="mt-3 text-[#6b7280] text-lg">
              Four simple steps to a better deal.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb] hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  <span className="text-sm font-semibold text-[#1e3a5f]">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
