"use client"
import { useState , useEffect } from "react"
import { Plus } from "lucide-react";
import { Resume } from "@/app/api/resumes/route";
import ResumeCard from "@/components/staff/ResumeCard";
export default function Page() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true); // État loading
    const [error, setError] = useState<string | null>(null);

     const fetchResumes = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/resumes");
        if (!res.ok) throw new Error("Erreur lors du fetch");
        const data: Resume[] = await res.json();
        setResumes(data);
      } catch (err: any) {
        setError("Erreur interne du serveur");
      } finally {
        setLoading(false);
      }
    };
      useEffect(() => {
   

    fetchResumes();
  }, []);



  

  





   



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
  <div className="flex justify-center items-center w-full">
    <h1 className="text-white font-bold text-3xl">Gestion des CVs</h1>
   
  </div>

  
  

  {resumes.length === 0 ? (
    <p className="text-white mt-4">Aucun cv n’est disponible pour le moment.</p>
  ) : (
    <div className="flex flex-wrap w-full gap-4 mt-4">
      {resumes.map((item, index) => (
        <ResumeCard
          id={item.resumeId}
          firstName={item.playerData.firstname}
          lastName={item.playerData.lastname}
          position={item.playerData.primary_position}
          isTreated={item.isTreated}
          submissionDate={item.createdAt}
          key={index}
          onDelete={() => fetchResumes()}
          onStatusChange={() => fetchResumes()}
        />
      ))}
    </div>
  )}
</section>


    )
}