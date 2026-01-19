"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full px-4 py-4 flex justify-between items-center bg-white">
      <Link href="/" className="font-bold text-2xl flex items-center">
        {/* Desktop logo */}
        <div className="h-10 w-40 hidden md:block relative">
          <Image
            alt="Scoutify"
            src="/logo.svg"
            width={160}
            height={40}
            className="hidden md:block object-contain object-left"
          />
        </div>
        {/* Mobile logo */}
        <div className="h-10 w-10 relative md:hidden">
          <Image
            alt="Scoutify"
            src="/monogramme.svg"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </Link>

      <div className="flex gap-2 md:gap-4 items-center">
        <Link
          href="/"
          className="px-3 md:px-4 py-2 bg-white text-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-all"
        >
          Accueil
        </Link>
        <Link
          href="/player"
          className="px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
        >
          Créer mon CV
        </Link>
      </div>
    </nav>
  );
}
