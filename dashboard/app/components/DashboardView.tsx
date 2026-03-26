"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Cpu, Activity, Database, Plus, Layers } from 'lucide-react'
import { useView, useSettings } from '../context'

export function DashboardView({ status, agents = [], selectedId }: { status: any, agents: any[], selectedId: string | null }) {
  const { setActiveView } = useView()
  const isOnline = status?.status === 'online'
  const { developerMode } = useSettings()
  const [currentTime, setCurrentTime] = useState('')

  const selectedAgent = agents.find(a => a.id === selectedId)

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString())
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!selectedId || !selectedAgent) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
         <div className="w-24 h-24 bg-zinc-50 rounded-[40px] flex items-center justify-center border border-zinc-100 shadow-inner">
            <Zap size={40} className="text-zinc-200" />
         </div>
         <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">Terminal de Operaciones</h2>
            <p className="text-sm text-zinc-400 font-medium max-w-xs leading-relaxed uppercase tracking-widest text-[10px] font-black">
               Selecciona un agente desde el menú lateral para iniciar la monitorización industrial.
            </p>
         </div>
         <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <button onClick={() => setActiveView('builder')} className="p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all text-left group">
               <Plus size={16} className="text-zinc-400 mb-2 group-hover:text-blue-600" />
               <p className="text-[10px] font-black uppercase text-zinc-900">Crear Nuevo</p>
            </button>
            <button onClick={() => setActiveView('deployments')} className="p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all text-left group">
               <Layers size={16} className="text-zinc-400 mb-2 group-hover:text-blue-600" />
               <p className="text-[10px] font-black uppercase text-zinc-900">Configurar Nodo</p>
            </button>
         </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Developer Console Overlay */}
      <AnimatePresence>
        {developerMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 right-10 w-96 bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl z-50 font-mono text-[10px]"
          >
             <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="text-blue-400 font-black">AGENTE: {selectedAgent.name.toUpperCase()}</span>
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
             </div>
             <div className="space-y-2 text-zinc-400">
                <p><span className="text-zinc-600">[{currentTime}]</span> INSTANCE_ID: {selectedId.substring(0,8)}</p>
                <p><span className="text-zinc-600">[{currentTime}]</span> STATUS: {selectedAgent.status.toUpperCase()}</p>
                <p><span className="text-zinc-600">[{currentTime}]</span> ENGINE: GEMINI_1.5_PRO</p>
                <p className="text-emerald-500 tracking-tighter animate-pulse">{">>>"} ESCUCHANDO TRÁFICO DE {selectedAgent.connection_type}...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end px-1">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-zinc-900/10">
                  <Cpu size={20} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tighter">{selectedAgent.name}</h1>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Monitor de Rendimiento en Vivo</p>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${selectedAgent.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>
               <div className={`w-2 h-2 rounded-full ${selectedAgent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
               <span className="text-[10px] font-black uppercase tracking-widest">{selectedAgent.status}</span>
            </div>
         </div>
      </div>

      {/* Power Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PowerStat label="Conversaciones" value={selectedAgent.status === 'active' ? "1,240" : "0"} delta="Real-time" color="blue" icon={<Zap size={20} />} />
        <PowerStat label="Latencia" value={isOnline ? "342ms" : "---"} delta="Stable" color="emerald" icon={<Cpu size={20} />} />
        <PowerStat label="Efectividad IA" value="98.4%" delta="Optimizado" color="blue" icon={<Activity size={20} />} />
        <PowerStat label="Estado Canal" value={selectedAgent.connection_type} delta="Secure" color="indigo" icon={<Database size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-10 bg-zinc-900 text-white min-h-[400px] border-none shadow-2xl relative overflow-hidden ring-1 ring-white/10">
               <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                     <Activity size={16} className="text-blue-500" /> Registro de Actividad
                  </h3>
                  <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-zinc-500">Node_Stream: Activo</span>
                  </div>
               </div>
               <div className="py-10 text-center space-y-4 opacity-30">
                  <Database size={40} className="mx-auto" />
                  <p className="text-xs font-mono uppercase tracking-[0.2em]">Esperando interacciones de WhatsApp...</p>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />
            </div>
         </div>
         
         <div className="space-y-6">
            <div className="glass-card p-8 bg-white space-y-6">
               <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Configuración del Cerebro</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                     <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Modelo de Inferencia</p>
                     <p className="text-xs font-bold text-zinc-900">Gemini 1.5 Pro (Industrial)</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                     <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Tipo de Memoria</p>
                     <p className="text-xs font-bold text-zinc-900">PostgreSQL Vector (Supabase)</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                     <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Frecuencia de Sync</p>
                     <p className="text-xs font-bold text-zinc-900">Tiempo Real (Webhooks)</p>
                  </div>
               </div>
               <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                  Ver Dossier Técnico
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}

function PowerStat({ label, value, delta, color, icon }: any) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100"
  }[color as 'blue'|'emerald'|'indigo']

  return (
    <div className="glass-card p-7 space-y-4 hover:border-blue-200 transition-colors group">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl border ${colors}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border ${colors}`}>
          {delta}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">{label}</p>
        <h4 className="text-2xl font-bold text-zinc-900 tracking-tighter font-display">{value}</h4>
      </div>
    </div>
  )
}
