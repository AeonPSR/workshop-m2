"use client"
import { FileText, Trash2, Copy, ExternalLink, Calendar, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
    onStatusChange?: () => void;
}

// Modal de confirmation de suppression
function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    playerName,
    isDeleting
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    playerName: string;
    isDeleting: boolean;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-[#1a1a1a] border border-red-500/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-white text-xl font-bold text-center mb-2">
                    Confirmer la suppression
                </h3>
                <p className="text-white/70 text-center mb-6">
                    Êtes-vous sûr de vouloir supprimer le CV de <span className="text-white font-semibold">{playerName}</span> ? 
                    Cette action est irréversible.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
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
    onStatusChange,
}: ResumeardProps) {

   const [isGenerating, setIsGenerating] = useState(false)
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [isDeleting, setIsDeleting] = useState(false)
   const [isTogglingStatus, setIsTogglingStatus] = useState(false)

   const handleDeleteClick = () => {
       setShowDeleteModal(true)
   }

   const handleToggleStatus = async () => {
       setIsTogglingStatus(true)
       try {
           const response = await fetch(`/api/resumes/${id}`, {
               method: 'PATCH',
           })
           if (response.ok) {
               if (onStatusChange) onStatusChange()
           } else {
               const error = await response.json()
               alert("Erreur: " + (error.message || "Impossible de changer le statut"))
           }
       } catch (err) {
           console.error(err)
           alert("Erreur lors du changement de statut")
       } finally {
           setIsTogglingStatus(false)
       }
   }

   const handleDeleteConfirm = async () => {
       setIsDeleting(true)
       try {
           const response = await fetch(`/api/resumes/${id}`, {
               method: 'DELETE',
           })
           if (response.ok) {
               setShowDeleteModal(false)
               if (onDelete) onDelete()
           } else {
               const error = await response.json()
               alert("Erreur: " + (error.message || "Impossible de supprimer le CV"))
           }
       } catch (err) {
           console.error(err)
           alert("Erreur lors de la suppression du CV")
       } finally {
           setIsDeleting(false)
       }
   }
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
                <button
                    onClick={handleToggleStatus}
                    disabled={isTogglingStatus}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer disabled:opacity-50 ${isTreated
                            ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                        }`}
                    title={isTreated ? "Marquer comme à traiter" : "Marquer comme traité"}
                >
                    {isTogglingStatus ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isTreated ? (
                        <CheckCircle className="w-3 h-3" />
                    ) : (
                        <Clock className="w-3 h-3" />
                    )}
                    {isTreated ? "Traité" : "À traiter"}
                </button>
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
                    onClick={handleDeleteClick}
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

            {/* Modal de confirmation - rendu via portal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                playerName={`${firstName} ${lastName}`}
                isDeleting={isDeleting}
            />
        </div>
    );
}