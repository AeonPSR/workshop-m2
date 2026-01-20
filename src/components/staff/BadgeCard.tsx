"use client"
import { Trash2, Upload, Edit3 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/lib/types/badge"
export default function BadgeCard({image , name , initials  } : Badge) {

  const handleUpload = () => {
    // Logique d'upload
    console.log("Upload image")
  }

  const handleEdit = () => {
    // Logique de modification
    console.log("Edit logo")
  }

  const handleDelete = () => {
    // Logique de suppression
    console.log("Delete logo")
  }

  return (
    <div className="w-80 bg-[#242423] border-2 border-[#ff9228] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#ff9228]/20 transition-all duration-300 hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative h-56 bg-[#1a1a1a] flex items-center justify-center overflow-hidden group">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#242423] via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Nom du logo */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#ffffff] tracking-wide">
            {name}
          </h3>
          <div className="w-16 h-1 bg-[#ff9228] mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Bouton Upload */}
          <button
            onClick={handleUpload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#39332f] text-[#ffffff] rounded-xl font-semibold transition-all duration-300 hover:bg-[#4a433f] hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Upload size={18} />
            <span className="text-sm">Upload</span>
          </button>

          {/* Bouton Modifier */}
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff9228] text-[#000000] rounded-xl font-semibold transition-all duration-300 hover:bg-[#ffa64d] hover:shadow-lg hover:shadow-[#ff9228]/30 hover:scale-105 active:scale-95"
          >
            <Edit3 size={18} />
            <span className="text-sm">Modifier</span>
          </button>
        </div>

        {/* Bouton Supprimer */}
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#dc2626] text-[#ffffff] rounded-xl font-semibold transition-all duration-300 hover:bg-[#ef4444] hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
        >
          <Trash2 size={18} />
          <span className="text-sm">Supprimer</span>
        </button>
      </div>
    </div>
  )
}