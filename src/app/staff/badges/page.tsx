"use client"
import { useState , useEffect } from "react"
import { Badge } from "@/lib/types/badge";
import BadgeCard from "@/components/staff/BadgeCard";
import { Plus } from "lucide-react";
import BadgeFormModal from "@/components/staff/BadgeFormModal";
export default function Page() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true); // État loading
    const [error, setError] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

     const fetchBadges = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/badges");
        if (!res.ok) throw new Error("Erreur lors du fetch");
        const data: Badge[] = await res.json();
        setBadges(data);
      } catch (err: any) {
        setError("Erreur interne du serveur");
      } finally {
        setLoading(false);
      }
    };
      useEffect(() => {
   

    fetchBadges();
  }, []);



   const handleAddBadge = async (logo: { name: string; image: string; initials: string }) => {
    try {
      const res = await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logo),
      });

      if (!res.ok) throw new Error("Erreur ajout badge");
      await fetchBadges();
    } catch (err) {
      console.error(err);
    }
  };



  if (loading) {
       return( <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-orange border-t-4 border-gray-300 rounded-full animate-spin"></div>
      </div>)
  }

    if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-bold">{error}</p>
      </div>
    );
  }
    return (
<section className="p-9 pt-20 flex flex-col items-center gap-8 w-full">
  <div className="flex justify-between items-center w-full">
    <h1 className="text-white font-bold text-3xl">Gestion des badges</h1>
     <button
                            onClick={() => setAddModalOpen(true)}
                            className=" flex items-center justify-center gap-2 px-4 py-3 bg-[#ff9228] text-[#000000] rounded-xl font-semibold transition-all duration-300 hover:bg-[#ffa64d] hover:shadow-lg hover:shadow-[#ff9228]/30 hover:scale-105 active:scale-95"
                        >
                            <Plus size={18} />
                            <span className="text-sm">Ajouter un badge</span>
                        </button>
  </div>

  
   <BadgeFormModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddOrUpdate={handleAddBadge}
        />

  {badges.length === 0 ? (
    <p className="text-white mt-4">Aucun badge n’est disponible pour le moment.</p>
  ) : (
    <div className="flex flex-wrap w-full gap-4 mt-4">
      {badges.map((item, index) => (
        <BadgeCard
          id={item.id}
          name={item.name}
          image={item.image}
          initials={item.initials}
          key={index}
          onRefresh={fetchBadges}
        />
      ))}
    </div>
  )}
</section>


    )
}