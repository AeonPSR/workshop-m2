"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

/* ============================================================================
   ██████╗ ███████╗███╗   ███╗ ██████╗     ███╗   ███╗ ██████╗ ██████╗ ███████╗
   ██╔══██╗██╔════╝████╗ ████║██╔═══██╗    ████╗ ████║██╔═══██╗██╔══██╗██╔════╝
   ██║  ██║█████╗  ██╔████╔██║██║   ██║    ██╔████╔██║██║   ██║██║  ██║█████╗  
   ██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║    ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  
   ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝    ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗
   ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝     ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
   
   ⚠️  DEMO MODE - TO BE REMOVED BEFORE PRODUCTION DEPLOYMENT  ⚠️
   
   This entire file should be deleted when shipping to the client.
   Also remove:
   - Import and usage in src/app/layout.tsx
   - Any useDemoMode() calls in components
   - DEMO_PREFILL_DATA in src/app/player/page.tsx
   
============================================================================ */

interface DemoModeContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
  onPrefillRequest: (() => void) | null
  registerPrefillCallback: (callback: (() => void) | null) => void
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [prefillCallback, setPrefillCallback] = useState<(() => void) | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault()
        setIsDemoMode(prev => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const registerPrefillCallback = useCallback((callback: (() => void) | null) => {
    setPrefillCallback(() => callback)
  }, [])

  const handlePrefill = () => {
    if (prefillCallback) {
      prefillCallback()
    }
  }

  return (
    <DemoModeContext.Provider value={{ 
      isDemoMode, 
      toggleDemoMode: () => setIsDemoMode(prev => !prev),
      onPrefillRequest: prefillCallback,
      registerPrefillCallback
    }}>
      {children}
      {/* ==================== DEMO MODE OVERLAY ==================== */}
      {isDemoMode && (
        <div className="fixed top-2 left-2 z-[9999] flex flex-col gap-2">
          <div className="text-[#FF9228] text-xs font-bold bg-black/90 px-3 py-1.5 rounded border border-[#FF9228]">
            🎬 DEMO MODE
          </div>
          {prefillCallback && (
            <button
              onClick={handlePrefill}
              className="bg-[#FF9228] text-black text-xs font-bold px-3 py-2 rounded hover:bg-[#ffaa55] transition-colors cursor-pointer"
            >
              ✨ Remplir le formulaire
            </button>
          )}
        </div>
      )}
      {/* ==================== END DEMO MODE OVERLAY ==================== */}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider")
  }
  return context
}

/* ============================================================================
   END OF DEMO MODE CODE - REMOVE THIS ENTIRE FILE FOR PRODUCTION
============================================================================ */
