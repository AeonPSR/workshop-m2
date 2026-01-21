"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Award, Shield, FileText, LogOut, Home, FileDown } from "lucide-react"
import { useState } from "react"

export default function StaffSidebar() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const menuItems = [
    { name: "Gestion des Logos", href: "/staff/logos", icon: <LayoutDashboard size={20} /> },
    { name: "Gestion des Badges", href: "/staff/badges", icon: <Award size={20} /> },
    { name: "Logos Divisions", href: "/staff/division_logos", icon: <Shield size={20} /> },
    { name: "Gestion des CVs", href: "/staff/resumes", icon: <FileText size={20} /> },
  ]

  const handleLogout = async () => {
    await fetch("/api/staff/logout", { method: "POST" })
    router.push("/staff/login")
    router.refresh()
  }

  const handleGenerateCV = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-cv?id=demo")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "CV-demo.pdf"
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
    <div className="w-64 h-screen bg-[#000000] border-r border-[#ff9228] flex flex-col shadow-2xl">
      <div className="p-6 border-b border-[#ff9228]">
        <h2 className="text-2xl font-bold text-[#ff9228] tracking-tight">AdminPanel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-[#ffffff] rounded-xl transition-all duration-300 hover:bg-[#ff9228] hover:text-[#000000] hover:shadow-lg hover:scale-105 group"
          >
            <span className="text-[#ff9228] group-hover:text-[#000000] transition-colors duration-300">
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}

        {/* Temporary CV Generation Button */}
        <button
          onClick={handleGenerateCV}
          disabled={isGenerating}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#ffffff] rounded-xl transition-all duration-300 hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown size={20} className="text-green-400 group-hover:text-white transition-colors duration-300" />
          <span className="font-medium">{isGenerating ? "Génération..." : "Générer CV (Demo)"}</span>
        </button>
      </nav>
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/player"
          className="flex items-center gap-3 px-4 py-3 w-full text-[#ffffff] rounded-xl transition-all duration-300 hover:bg-[#ff9228] hover:text-[#000000] hover:shadow-lg group cursor-pointer"
        >
          <Home size={20} className="text-[#ff9228] group-hover:text-[#000000] transition-colors duration-300" />
          <span className="font-medium">Formulaire joueur</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#ffffff] rounded-xl transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg group cursor-pointer"
        >
          <LogOut size={20} className="text-red-400 group-hover:text-white transition-colors duration-300" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  )
}