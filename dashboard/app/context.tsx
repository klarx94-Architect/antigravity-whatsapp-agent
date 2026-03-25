"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type ViewType = 'dashboard' | 'builder' | 'vault' | 'deployments' | 'infrastructure' | 'security' | 'settings' | 'profile'

interface ViewContextType {
  activeView: ViewType
  setActiveView: (view: ViewType) => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ViewType>('dashboard')

  // Listener para cambios externos (ej: desde modales o eventos globales)
  useEffect(() => {
    const handleViewChange = (e: any) => {
      if (e.detail) setActiveView(e.detail as ViewType)
    }
    window.addEventListener('architect-view-change', handleViewChange)
    return () => window.removeEventListener('architect-view-change', handleViewChange)
  }, [])

  return (
    <ViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ViewContext.Provider>
  )
}

export function useView() {
  const context = useContext(ViewContext)
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider')
  }
  return context
}
