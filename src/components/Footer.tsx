import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Brand */}
          <div className="mb-10 md:mb-0">
            <div className="font-bold text-2xl text-white mb-4 flex items-center">
              <div className="h-8 relative">
                <Image
                  alt="Scoutify"
                  src="/logo.svg"
                  width={160}
                  height={40}
                  className="invert opacity-80 object-contain object-left"
                />
              </div>
            </div>
            <p className="max-w-xs text-white/40">
              Votre partenaire stratégique pour des CV sportifs premium.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-white font-bold uppercase tracking-wide mb-4">Produit</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/player" className="text-white/60 hover:text-[#FF9228] transition-colors">
                    Créer mon CV
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wide mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="https://scoutify.fr" className="text-white/60 hover:text-[#FF9228] transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="https://scoutify.fr/contact" className="text-white/60 hover:text-[#FF9228] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40">© 2026 Scoutify for Players. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0 flex gap-4 items-center">
            <a
              href="https://instagram.com/scoutify_plyrs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#FF9228] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <span className="text-white/20">|</span>
            <span className="text-sm text-white/40">Powered by Scoutify</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
