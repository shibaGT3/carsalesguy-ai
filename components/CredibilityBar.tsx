const stats = [
  { label: "15+ Years Experience" },
  { label: "$1B+ in Career Sales" },
  { label: "500+ Cars/Month" },
  { label: "GM at a Luxury Dealership" },
];

export default function CredibilityBar() {
  return (
    <section className="bg-[#1f2937] border-y border-white/10 px-6 py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-center text-center px-4">
            <span className="text-sm md:text-base font-medium text-white">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
