"use client"
import Link from "next/link"
import { LayoutDashboard, Award, Shield, FileText } from "lucide-react"

export default function StaffSidebar() {
  const menuItems = [
    { name: "Gestion des Logos", href: "/staff/logos", icon: <LayoutDashboard size={20} /> },
    { name: "Gestion des Badges", href: "/staff/badges", icon: <Award size={20} /> },
    { name: "Logos Divisions", href: "/staff/division_logos", icon: <Shield size={20} /> },
    { name: "Gestion des CVs", href: "/staff/resumes", icon: <FileText size={20} /> },
  ]
  
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
      </nav>
      <div className="p-4 border-t border-gray-800">
      </div>
    </div>
  )
}