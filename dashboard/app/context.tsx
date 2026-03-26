"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type ViewType = 'dashboard' | 'builder' | 'vault' | 'deployments' | 'infrastructure' | 'security' | 'settings' | 'profile'

interface SettingsContextType {
  salesNotifications: boolean
  setSalesNotifications: (v: boolean) => void
  developerMode: boolean
  setDeveloperMode: (v: boolean) => void
  autoCloudSync: boolean
  setAutoCloudSync: (v: boolean) => void
}

interface ViewContextType {
  activeView: ViewType
  setActiveView: (view: ViewType) => void
  selectedAgentId: string | null
  setSelectedAgentId: (id: string | null) => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)
const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  
  // Settings State
  const [salesNotifications, setSalesNotifications] = useState(true)
  const [developerMode, setDeveloperMode] = useState(false)
  const [autoCloudSync, setAutoCloudSync] = useState(true)

  // Cargar preferencias
  useEffect(() => {
    const savedId = localStorage.getItem('ARCHITECT_SELECTED_AGENT')
    if (savedId) setSelectedAgentId(savedId)
    const saved = localStorage.getItem('ARCHITECT_SETTINGS')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSalesNotifications(parsed.salesNotifications ?? true)
        setDeveloperMode(parsed.developerMode ?? false)
        setAutoCloudSync(parsed.autoCloudSync ?? true)
      } catch (e) {}
    }
  }, [])

  // Guardar preferencias
  useEffect(() => {
    localStorage.setItem('ARCHITECT_SETTINGS', JSON.stringify({
      salesNotifications, developerMode, autoCloudSync
    }))
  }, [salesNotifications, developerMode, autoCloudSync])

  useEffect(() => {
    if (selectedAgentId) {
      localStorage.setItem('ARCHITECT_SELECTED_AGENT', selectedAgentId)
    } else {
      localStorage.removeItem('ARCHITECT_SELECTED_AGENT')
    }
  }, [selectedAgentId])

  useEffect(() => {
    const handleViewChange = (e: any) => {
      if (e.detail) setActiveView(e.detail as ViewType)
    }
    window.addEventListener('architect-view-change', handleViewChange)
    return () => window.removeEventListener('architect-view-change', handleViewChange)
  }, [])

  return (
    <ViewContext.Provider value={{ 
      activeView, 
      setActiveView, 
      selectedAgentId, 
      setSelectedAgentId 
    }}>
      <SettingsContext.Provider value={{ 
        salesNotifications, setSalesNotifications,
        developerMode, setDeveloperMode,
        autoCloudSync, setAutoCloudSync
      }}>
        {children}
      </SettingsContext.Provider>
    </ViewContext.Provider>
  )
}

export function useView() {
  const context = useContext(ViewContext)
  if (context === undefined) throw new Error('useView must be used within a ViewProvider')
  return context
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) throw new Error('useSettings must be used within a ViewProvider')
  return context
}
