export default function CredibilityBar() {
  const stats = [
    { value: "20+", label: "Years in the business", sublabel: "Dealer side experience" },
    { value: "$1B+", label: "In closed deals", sublabel: "Real transaction volume" },
    { value: "50K+", label: "Deals closed", sublabel: "Across every deal type" },
    { value: "500+", label: "Cars per month", sublabel: "At peak volume" },
  ];

  return (
    <section className="relative bg-white px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#10b981] uppercase tracking-wider mb-3">Why trust us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Built by a real dealer, not a blogger</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative text-center p-6 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#10b981]/30 hover:bg-[#f0fdf4]/50 transition-all duration-300"
            >
              <p className="text-3xl md:text-4xl font-black text-[#0f172a] mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-[#0f172a] mb-0.5">{stat.label}</p>
              <p className="text-xs text-[#94a3b8]">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
