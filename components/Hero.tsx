"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 md:py-32">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f4ff] to-white" />

      <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 relative">
          <Image
            src="/logo.jpg"
            alt="CarSalesGuy"
            width={88}
            height={88}
            className="w-22 h-22 rounded-2xl object-cover shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10b981] rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1e3a5f]/5 px-4 py-1.5 text-sm font-medium text-[#1e3a5f]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          Built by a dealer with 15+ years experience
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1a1a2e] leading-[1.1] tracking-tight">
          Negotiate your next car{" "}
          <span className="text-[#1e3a5f]">like a dealer</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-xl text-[#6b7280] max-w-2xl leading-relaxed">
          AI-powered negotiation emails that get dealers competing for your business.
          Backed by over a billion dollars in real sales experience.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#1e3a5f]/20 transition-all hover:bg-[#162d4a] hover:shadow-xl hover:shadow-[#1e3a5f]/25 hover:-translate-y-0.5"
          >
            Start Your Deal
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <span className="text-sm text-[#9ca3af]">No signup required</span>
        </div>
      </div>
    </section>
  );
}
