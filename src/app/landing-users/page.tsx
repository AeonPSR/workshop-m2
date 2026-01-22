import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LandingUsers() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,146,40,0.15),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF9228]/10 blur-[100px] rounded-full"></div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]"></div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter mb-6">
              <span className="block text-white">Bienvenue sur</span>
              <span className="bg-gradient-to-r from-[#FF9228] to-[#FF6B00] bg-clip-text text-transparent">Scoutify</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-medium">
              Créez votre CV Sportif professionnel et passez au niveau supérieur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/player"
                className="group relative border-2 border-[#FF9228] px-8 py-4 bg-transparent text-white font-bold text-lg uppercase tracking-wide rounded-full transition-all hover:scale-[1.025] hover:shadow-[0_0_40px_rgba(255,146,40,0.4)]"
              >
                <span className="flex items-center gap-2">
                  Créer mon CV
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF9228]/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-4 text-white">
                Comment ça <span className="text-[#FF9228]">marche ?</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                Créez votre CV sportif professionnel en quelques étapes simples.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-[#FF9228]/20 text-[#FF9228] rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-white uppercase">
                  Remplissez le formulaire
                </h3>
                <p className="text-white/60">
                  Entrez vos informations personnelles, votre parcours et vos qualités sportives.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-[#FF9228]/20 text-[#FF9228] rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-white uppercase">
                  Validation par notre équipe
                </h3>
                <p className="text-white/60">
                  Notre staff vérifie et enrichit votre dossier avec les logos officiels.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-[#FF9228]/20 text-[#FF9228] rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-white uppercase">
                  Téléchargez votre PDF
                </h3>
                <p className="text-white/60">
                  Recevez votre CV premium au format PDF A4, prêt à être partagé.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#FF9228]/40 to-[#FF9228]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 max-w-3xl mx-auto leading-tight text-white drop-shadow-sm">
              Prêt à créer votre CV ?
            </h2>
            <Link
              href="/player"
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-bold text-lg uppercase tracking-wide py-4 px-8 rounded-full hover:bg-white/90 transition-all hover:scale-[1.025]"
            >
              Commencer maintenant
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
