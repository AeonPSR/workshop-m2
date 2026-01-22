"use client"
import { FileText, Trash2, Copy, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FileDown } from "lucide-react";
interface ResumeardProps {
    id: number
    firstName: string;
    lastName: string;
    position?: string;
    submissionDate: string;
    isTreated : boolean;
    onDelete?: () => void;
    onDuplicate?: () => void;
}

export default function ResumeCard({
    id,
    firstName,
    lastName,
    position,
    submissionDate,
    isTreated ,
    onDelete,
    onDuplicate,
}: ResumeardProps) {


   const [isGenerating, setIsGenerating] = useState(false)
   const handleGenerateCV = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/generate-cv?id=${id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `CV ${firstName} ${lastName}`;
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const error = await response.json()
        alert("Erreur: " + error.details)
      }
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la génération du PDF")
    } finally {
      setIsGenerating(false)
    }
  }
  
    return (
        <div className="w-full max-w-md bg-[#1a1a1a] border border-[#ff9228] rounded-xl p-5 shadow-lg transition-transform hover:scale-[1.01]">
            {/* Header avec Statut */}
            <div className="flex justify-between items-start mb-4">
                <div className="bg-[#ff9228]/10 p-2 rounded-lg">
                    <FileText className="text-[#ff9228] w-6 h-6" />
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${isTreated
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                >
                    {isTreated ? "Traité" : "À traiter"}
                </span>
            </div>

            {/* Informations Joueur */}
            <div className="space-y-3 mb-6">
                <div>
                    <h3 className="text-white text-xl font-bold uppercase tracking-tight">
                        {firstName} {lastName}
                    </h3>
                    <p className="text-[#ff9228] font-medium text-sm">{position}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center text-white/60 text-xs">
                        <Calendar className="w-3.5 h-3.5 mr-2" />
                        Soumis le {submissionDate} h
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <Link
                 href={`/staff/resumes/edit/${id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#ff9228] hover:bg-[#ff9228]/90 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                    <ExternalLink className="w-4 h-4" /> Ouvrir
                </Link>

                



                <button
                    onClick={onDuplicate}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors border border-white/10"
                    title="Dupliquer"
                >
                    <Copy className="w-4 h-4" />
                </button>

                <button
                    onClick={onDelete}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                    title="Supprimer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>


                    <button
          onClick={handleGenerateCV}
          disabled={isGenerating}
        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20 flex  gap-2 items-center"
        >
          <FileDown size={20} className="text-green-400 group-hover:text-white transition-colors duration-300" />
          <span className="font-medium">{isGenerating ? "Génération..." : "Générer CV"}</span>
        </button>
            </div>
        </div>
    );
}