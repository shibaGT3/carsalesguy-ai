"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] px-6 py-20 md:py-28">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#10b981]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#10b981]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Ready to stop leaving money on the table?
        </h2>
        <p className="mt-6 text-lg text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
          The average buyer overpays by <span className="text-white font-semibold">$3,000+</span> on their car deal.
          Our emails have helped buyers save a combined <span className="text-[#10b981] font-semibold">$2M+</span> and counting.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/generate"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#10b981] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#10b981]/25 transition-all hover:bg-[#059669] hover:shadow-xl hover:shadow-[#10b981]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Generate My Email Now
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <p className="mt-6 text-sm text-[#64748b]">
          Takes 2 minutes &middot; No signup required
        </p>
      </div>
    </section>
  );
}
