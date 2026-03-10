const socialLinks = [
  { name: "X", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-[#9ca3af]">Built by a dealer, for buyers</p>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#9ca3af] transition hover:text-white"
            >
              {link.name === "X" ? "@carsales_guy" : link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
