import Hero from "@/components/Hero";
import CredibilityBar from "@/components/CredibilityBar";
import Footer from "@/components/Footer";

const steps = [
  {
    number: 1,
    title: "Tell us your deal",
    description: "Select your deal type and answer a few quick questions about your vehicle and terms",
  },
  {
    number: 2,
    title: "Get your email",
    description: "AI generates a ready-to-send negotiation email backed by real dealership expertise",
  },
  {
    number: 3,
    title: "Refine & ask questions",
    description: "Chat with the AI to adjust your email or get insider advice on your deal",
  },
  {
    number: 4,
    title: "Send & save",
    description: "Copy, paste, send to 3-5 dealers, and let them compete for your business",
  },
];


export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Hero />
      <CredibilityBar />

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-14">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#3b82f6] flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
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
