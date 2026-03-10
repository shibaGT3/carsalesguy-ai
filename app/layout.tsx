import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarSalesGuy AI — Negotiate Your Next Car Like a Dealer",
  description:
    "AI-powered car negotiation emails built on 15+ years of dealership experience and over a billion dollars in sales.",
  openGraph: {
    title: "CarSalesGuy AI — Negotiate Your Next Car Like a Dealer",
    description:
      "AI-powered car negotiation emails built on 15+ years of dealership experience and over a billion dollars in sales.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
