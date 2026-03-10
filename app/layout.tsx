import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased bg-white text-[#1a1a2e]`}
      >
        {children}
      </body>
    </html>
  );
}
