import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LandingUsers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-500 text-white">
          <div className="container mx-auto px-6 pt-20 pb-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Créez votre CV Football Premium
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-200">
                Générez un CV sportif professionnel en quelques minutes. 
                Mettez en avant votre parcours et vos qualités.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/player"
                  className="px-8 py-4 bg-white text-purple-700 rounded-full text-lg font-medium hover:bg-opacity-90 transition-all shadow-xl"
                >
                  Créer mon CV
                </Link>
              </div>
            </div>
          </div>
        </section>
-
        {/* Features Section */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Remplissez le formulaire
                </h3>
                <p className="text-gray-600">
                  Entrez vos informations personnelles, votre parcours et vos qualités sportives.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Validation par notre équipe
                </h3>
                <p className="text-gray-600">
                  Notre staff vérifie et enrichit votre dossier avec les logos officiels.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Téléchargez votre PDF
                </h3>
                <p className="text-gray-600">
                  Recevez votre CV premium au format PDF A4, prêt à être partagé.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
