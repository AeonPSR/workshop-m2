"use client"
import { useState , useEffect } from "react"
import { Badge } from "@/lib/types/badge";
import BadgeCard from "@/components/staff/BadgeCard";



export default function Page() {

    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true); // État loading
    const [error, setError] = useState<string | null>(null);

      useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/badges");
        if (!res.ok) throw new Error("Erreur lors du fetch");
        const data: Badge[] = await res.json();
        setBadges(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);





  if (loading) {
        <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-orange border-t-4 border-gray-300 rounded-full animate-spin"></div>
      </div>
  }


    if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-bold">{error}</p>
      </div>
    );
  }

    return (






        <section className="p-9 flex flex-col items-center gap-4">

            <h1 className=" text-white font-bold text-3xl ">Gestion des badges </h1>




            <div className="  flex flex-wrap  w-full gap-4 justify-center">

                {badges.map((item , index) => (
                    <BadgeCard name={item.name} image={item.image} initials={item.initials} key={index}/>
                )

                )}



            </div>







        </section>

    )
}