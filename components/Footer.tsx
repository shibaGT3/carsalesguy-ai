import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.jpg" alt="CarSalesGuy" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-[#0f172a]">CarSalesGuy<span className="text-[#10b981]"> AI</span></span>
            </Link>
            <p className="text-sm text-[#94a3b8] max-w-xs text-center md:text-left">
              The unfair advantage every car buyer deserves. Built by a GM who&apos;s been on the other side of the desk.
            </p>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-5">
              <a
                href="https://x.com/carsales_guy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#64748b] transition hover:text-[#0f172a]"
              >
                X / Twitter
              </a>
              <a
                href="https://instagram.com/carsalesguy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#64748b] transition hover:text-[#0f172a]"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com/@carsalesguy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#64748b] transition hover:text-[#0f172a]"
              >
                YouTube
              </a>
            </div>
            <p className="text-xs text-[#cbd5e1]">&copy; {new Date().getFullYear()} CarSalesGuy AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
