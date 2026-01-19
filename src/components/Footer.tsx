import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
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
                  className="brightness-0 invert object-contain object-left"
                />
              </div>
            </div>
            <p className="max-w-xs">
              Votre partenaire stratégique pour des CV sportifs premium.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-white font-medium mb-4">Produit</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/player" className="hover:text-white transition-colors">
                    Créer mon CV
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="https://scoutify.fr" className="hover:text-white transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="https://scoutify.fr/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Scoutify. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <a
              href="https://www.linkedin.com/company/scoutify-fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
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
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <span className="text-gray-600">|</span>
            <span className="text-sm">Powered by Scoutify</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
