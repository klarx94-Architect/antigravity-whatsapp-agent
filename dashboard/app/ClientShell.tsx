"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  LayoutDashboard, 
  Layers, 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Bell, 
  User, 
  Zap 
} from 'lucide-react'

// Context & API
import { useView, ViewProvider } from './context'
import { supabase } from './supabase'

function NavItem({ icon, label, active, onClick, compact }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${active ? 'bg-blue-50 text-blue-700' : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'}`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
      {!compact && <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>}
      {active && <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />}
    </button>
  )
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { activeView, setActiveView, selectedAgentId, setSelectedAgentId } = useView()
  const [agents, setAgents] = useState<any[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    async function loadAgents() {
      const { data } = await supabase.from('agents').select('*').order('name')
      if (data) setAgents(data)
    }
    loadAgents()
    const subscription = supabase.channel('agents_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, loadAgents).subscribe()
    return () => { subscription.unsubscribe() }
  }, [])

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-zinc-200 flex flex-col relative z-50 shadow-sm"
      >
        <div className="p-6 mb-4 flex items-center justify-between">
           {isSidebarOpen && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                   <Zap size={18} />
                </div>
                <span className="font-black text-[12px] tracking-tighter text-zinc-900 uppercase">Architect<span className="text-blue-600">.</span>Build</span>
             </motion.div>
           )}
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
              <Menu size={20} />
           </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
           <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} compact={!isSidebarOpen} />
           <NavItem icon={<Layers size={20} />} label="Constructor" active={activeView === 'builder'} onClick={() => setActiveView('builder')} compact={!isSidebarOpen} />
           <NavItem icon={<Cpu size={20} />} label="Despliegues" active={activeView === 'deployments'} onClick={() => setActiveView('deployments')} compact={!isSidebarOpen} />
           
           <div className="py-6 px-4">
              {isSidebarOpen && <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Agentes</p>}
              <div className="space-y-2">
                 {agents.map(agent => (
                   <button 
                     key={agent.id}
                     onClick={() => { setSelectedAgentId(agent.id); setActiveView('dashboard') }}
                     className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedAgentId === agent.id ? 'bg-zinc-900 text-white shadow-lg' : 'hover:bg-zinc-100 text-zinc-500'}`}
                   >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                      {isSidebarOpen && <span className="text-[11px] font-bold truncate uppercase tracking-tight">{agent.name}</span>}
                   </button>
                 ))}
              </div>
           </div>
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-1">
           <NavItem icon={<ShieldCheck size={20} />} label="Seguridad" active={activeView === 'security'} onClick={() => setActiveView('security')} compact={!isSidebarOpen} />
           <NavItem icon={<Settings size={20} />} label="Ajustes" active={activeView === 'settings'} onClick={() => setActiveView('settings')} compact={!isSidebarOpen} />
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-zinc-100 px-10 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <p className="text-[11px] font-black uppercase text-zinc-400 tracking-widest leading-none">
                 Estación: <span className="text-zinc-900">Alpha-One</span>
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                 <Bell size={18} />
              </div>
              <button 
                onClick={() => setActiveView('profile')}
                className="flex items-center gap-3 pl-4 pr-1 py-1 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-all border border-zinc-100"
              >
                 <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter hidden sm:block">Architect Senior</span>
                 <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                    <User size={18} />
                 </div>
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-6 sm:p-10">
           {children}
        </div>
      </main>
    </div>
  )
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ViewProvider>
      <DashboardShell>{children}</DashboardShell>
    </ViewProvider>
  )
}
