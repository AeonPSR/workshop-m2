"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-[#0a0a0a] border-b border-white/10">
      <Link href="/" className="font-bold text-2xl flex items-center">
        {/* Desktop logo */}
        <div className="h-10 w-40 hidden md:block relative">
          <Image
            alt="Scoutify"
            src="/logo.svg"
            width={160}
            height={40}
            className="hidden md:block object-contain object-left invert"
          />
        </div>
        {/* Mobile logo */}
        <div className="h-10 w-10 relative md:hidden">
          <Image
            alt="Scoutify"
            src="/monogramme.svg"
            width={40}
            height={40}
            className="object-contain invert"
          />
        </div>
      </Link>

      <div className="flex gap-2 md:gap-4 items-center">
        <Link
          href="/"
          className="px-3 md:px-4 py-2 text-white/80 text-sm font-medium hover:text-[#FF9228] transition-all uppercase tracking-wide"
        >
          Accueil
        </Link>
        <Link
          href="/player"
          className="px-4 md:px-6 py-2.5 bg-[#FF9228] text-white rounded-full text-sm font-bold hover:bg-[#FF9228]/90 transition-all uppercase tracking-wide"
        >
          Créer mon CV
        </Link>
      </div>
    </nav>
  );
}
