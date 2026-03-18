"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] px-6 pt-8 pb-20 md:pt-12 md:pb-32">
      {/* Background gradient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#10b981]/8 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#10b981]/5 to-transparent rounded-full blur-3xl" />

      {/* Nav */}
      <nav className="relative max-w-6xl mx-auto flex items-center justify-between mb-16 md:mb-24">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="CarSalesGuy"
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <span className="text-white font-bold text-lg">CarSalesGuy<span className="text-[#10b981]"> AI</span></span>
        </div>
        <Link
          href="/generate"
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/15"
        >
          Get Started
        </Link>
      </nav>

      <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm px-5 py-2 text-sm font-medium text-[#94a3b8]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
          </span>
          From a GM who&apos;s closed 50,000+ deals
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
          Stop overpaying for{" "}
          <span className="relative">
            <span className="relative z-10 text-[#10b981]">your next car</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#10b981]/15 rounded-sm -z-0" />
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 md:mt-8 text-lg md:text-xl text-[#94a3b8] max-w-2xl leading-relaxed">
          Get a ready-to-send dealer negotiation email in 2 minutes. Built on insider
          knowledge from 20 years and <span className="text-white font-medium">$1B+</span> in real car deals.
        </p>

        {/* CTA */}
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/generate"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#10b981] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#10b981]/25 transition-all hover:bg-[#059669] hover:shadow-xl hover:shadow-[#10b981]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Generate My Email
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <span className="text-sm text-[#64748b]">Free to try &middot; No signup</span>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-sm text-[#64748b]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e293b] to-[#334155] border-2 border-[#0f172a] flex items-center justify-center text-xs font-medium text-white/60">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>Trusted by thousands of buyers</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/10" />
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1">4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
