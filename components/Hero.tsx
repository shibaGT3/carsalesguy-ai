"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 md:py-36 text-center bg-[#0a0a0a]">
      <Image
        src="/logo.jpg"
        alt="CarSalesGuy"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover mb-6 border-2 border-[#3b82f6]"
      />
      <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
        Negotiate Your Next Car Like a Dealer
      </h1>
      <p className="mt-6 text-lg md:text-xl text-[#9ca3af] max-w-2xl">
        AI-powered negotiation emails built on 15+ years of dealership
        experience and over a billion dollars in sales.
      </p>
      <Link
        href="/generate"
        className="mt-10 inline-block rounded-lg bg-[#3b82f6] px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
      >
        Generate Your Email &rarr;
      </Link>
    </section>
  );
}
