"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Layers, Plus } from 'lucide-react'
import { EvolutionBridge } from './EvolutionBridge'

export function DeploymentsView({ agents = [] }: { agents: any[] }) {
  const [activeModalAgent, setActiveModalAgent] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Centro de Despliegues</h2>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Gestión de Instancias y Conectividad WhatsApp</p>
        </div>
        <button className="nuclear-button !bg-zinc-900 !px-6">Status Global</button>
      </div>
      
      <div className="glass-card bg-white divide-y divide-zinc-100 overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <Layers size={40} className="text-zinc-200 mx-auto" />
            <p className="text-sm font-medium text-zinc-400 italic">No hay agentes registrados en la base de datos.</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  agent.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                }`}>
                  <Zap size={20} className={agent.status === 'active' ? 'fill-current' : ''} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{agent.name}</h4>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{agent.connection_type}</span>
                     <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                     <span className="text-[10px] text-zinc-400 font-medium">{agent.website_url || 'Sin URL'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setActiveModalAgent(agent)}
                   className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-zinc-900/10 hover:scale-105 transition-transform"
                 >
                    Conectar WhatsApp
                 </button>
                 <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                   agent.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                 }`}>
                   {agent.status}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {activeModalAgent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-lg"
             >
                <button 
                  onClick={() => setActiveModalAgent(null)}
                  className="absolute -top-12 right-0 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                   Cerrar <Plus className="rotate-45" size={20} />
                </button>
                <EvolutionBridge 
                  instanceName={activeModalAgent.name.toLowerCase().replace(/\s+/g, '_')} 
                  onConnected={() => {
                    console.log("Conectado con éxito")
                    setTimeout(() => setActiveModalAgent(null), 3000)
                  }} 
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
