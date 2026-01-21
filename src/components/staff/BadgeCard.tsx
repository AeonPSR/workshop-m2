import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { Badge } from "@/lib/types/badge";
import BadgeFormModal from "./BadgeFormModal";
type BadgeCardProps = Badge & { onRefresh: () => void }

export default function BadgeCard({ id, image, name, initials, onRefresh }: BadgeCardProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);



  const handleEditBadge = async (  badge: { name: string; image: string; initials: string }
) => {
  try {
    const res = await fetch(`http://localhost:3000/api/badges/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(badge),
    });
    if (!res.ok) throw new Error("Erreur update badge");
     setEditModalOpen(false)
     onRefresh();
     console.log("Élément Modifié");
  } catch (err) {
    console.error(err);
  }
};

    const handleDelete = async () => {
        try {
            await fetch(`http://localhost:3000/api/badges/${id}`, {
                method: "DELETE",
            });
            setConfirmModalOpen(false);
            onRefresh()
            console.log("Élément supprimé");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="w-80 bg-[#242423] border-2 border-[#ff9228] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#ff9228]/20 transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-56 bg-[#1a1a1a] flex items-center justify-center overflow-hidden group">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242423] via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-[#ffffff] tracking-wide">  {`${name}${initials ? ` - ${initials}` : ""}`}
</h3>
                        <div className="w-16 h-1 bg-[#ff9228] mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff9228] text-[#000000] rounded-xl font-semibold transition-all duration-300 hover:bg-[#ffa64d] hover:shadow-lg hover:shadow-[#ff9228]/30 hover:scale-105 active:scale-95"
                        >
                            <Edit size={18} />
                            <span className="text-sm">Modifier</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setConfirmModalOpen(true)} // Ouvre la modale ici
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#dc2626] text-[#ffffff] rounded-xl font-semibold transition-all duration-300 hover:bg-[#ef4444] hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
                    >
                        <Trash2 size={18} />
                        <span className="text-sm">Supprimer</span>
                    </button>
                </div>
            </div>

            {/* ✅ Modale */}
            <ConfirmModal
                open={confirmModalOpen}

                message="Êtes-vous sûr de vouloir supprimer ce badge ? Cette action est irréversible."
                onConfirm={handleDelete}
                onClose={() => setConfirmModalOpen(false)}
            />

            <BadgeFormModal
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  initialValues={{ name, image, initials }}
  onAddOrUpdate={handleEditBadge}
  
/>
        </>
    );
}
