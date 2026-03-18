export default function Testimonials() {
  const testimonials = [
    {
      quote: "Used the lease email and got three dealers competing. Saved $4,200 off the original quote. This thing pays for itself 100x over.",
      name: "Mike R.",
      detail: "2026 BMW X5 Lease",
      savings: "$4,200 saved",
    },
    {
      quote: "I've always hated the negotiation part. Sent the email to 5 dealers and had a deal closed in 2 days without stepping foot in a showroom.",
      name: "Sarah K.",
      detail: "2025 Toyota 4Runner Finance",
      savings: "$2,800 saved",
    },
    {
      quote: "The counter offer email was next level. The dealer came back $3k lower after I sent it. My wife couldn't believe it.",
      name: "Jason T.",
      detail: "2026 Lexus RX Cash Purchase",
      savings: "$3,100 saved",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#10b981] uppercase tracking-wider mb-3">Real results</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">
            Buyers are saving thousands
          </h2>
          <p className="mt-4 text-[#64748b] text-lg max-w-2xl mx-auto">
            These emails aren&apos;t templates from a blog. They&apos;re built on strategies that work in real dealerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative bg-[#f8fafc] rounded-2xl p-8 border border-[#e2e8f0] hover:border-[#10b981]/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#334155] text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{t.name}</p>
                  <p className="text-xs text-[#94a3b8]">{t.detail}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#10b981]/10 px-3 py-1 text-xs font-bold text-[#059669]">
                  {t.savings}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
