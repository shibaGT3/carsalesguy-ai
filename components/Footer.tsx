import Link from "next/link";

const socialLinks = [
  { name: "X", href: "#", display: "@carsales_guy" },
  { name: "Instagram", href: "#", display: "Instagram" },
  { name: "YouTube", href: "#", display: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-[#e5e7eb] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="text-base font-semibold text-[#1a1a2e]">
            CarSalesGuy AI
          </Link>
          <p className="text-sm text-[#9ca3af]">The unfair advantage every car buyer deserves.</p>
        </div>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6b7280] transition hover:text-[#1e3a5f]"
            >
              {link.display}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
