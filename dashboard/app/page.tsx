"use client"
// Industrial Architecture v20.5.0 Stable - Production Node

import React, { useState, useEffect } from 'react'
import { ArrowRight, Zap } from 'lucide-react'

// Context & API
import { useView } from './context'
import { supabase } from './supabase'

// Components
import { DashboardView } from './components/DashboardView'
import { AgentCreator } from './components/AgentCreator'
import { DeploymentsView } from './components/DeploymentsView'
import { InfrastructureView } from './components/InfrastructureView'
import { SecurityView } from './components/SecurityView'
import { ProfileView } from './components/ProfileView'
import { SettingsModal } from './components/SettingsModal'

function ViewOrchestrator() {
  const { activeView, setActiveView, selectedAgentId } = useView()
  const [status, setStatus] = useState<any>(null)
  const [vaultFiles, setVaultFiles] = useState<any[]>([])

  useEffect(() => {
    async function init() {
       const [s, a] = await Promise.all([
          { status: 'online' },
          supabase.from('agents').select('*').order('name')
       ])
       setStatus(s)
       if (a.data) setVaultFiles(a.data)
    }
    init()
  }, [])

  switch (activeView) {
    case 'dashboard': return <DashboardView status={status} agents={vaultFiles} selectedId={selectedAgentId} />
    case 'builder': return <AgentCreator />
    case 'deployments': return <DeploymentsView agents={vaultFiles} />
    case 'infrastructure': return <InfrastructureView status={status} />
    case 'security': return <SecurityView />
    case 'profile': return <ProfileView vaultFiles={vaultFiles} />
    case 'settings': return <SettingsModal isOpen={true} onClose={() => setActiveView('dashboard')} />
    default: return <DashboardView status={status} agents={vaultFiles} selectedId={selectedAgentId} />
  }
}

export default function AppPage() {
  const [isAuth, setIsAuth] = useState(false)
  
  if (!isAuth) {
    return (
       <div className="h-screen bg-zinc-900 flex items-center justify-center p-6 font-display animate-in fade-in duration-700">
          <div className="w-full max-w-md space-y-12">
             <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
                   <Zap className="text-zinc-900" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Protocolo de Acceso</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">SaaS Industrial Gateway</p>
             </div>
             
             <div className="glass-card bg-white/5 p-10 border-white/10 space-y-8 rounded-[40px]">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Clave Maestra de Operador</label>
                   <input type="password" placeholder="••••••••••••" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-center tracking-[0.5em] focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <button onClick={() => setIsAuth(true)} className="w-full py-5 bg-white text-zinc-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl">
                   Sincronizar Nodo <ArrowRight size={18} />
                </button>
             </div>
          </div>
       </div>
    )
  }

  return <ViewOrchestrator />
}
