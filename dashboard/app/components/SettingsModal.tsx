"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Plus, Zap, Activity } from 'lucide-react'
import { useSettings } from '../context'

export function SettingsModal({ isOpen, onClose }: any) {
  const { salesNotifications, setSalesNotifications, developerMode, setDeveloperMode, autoCloudSync, setAutoCloudSync } = useSettings()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300">
       <motion.div 
         initial={{ scale: 0.9, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-zinc-100"
       >
          <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                   <Settings className="text-white w-5 h-5" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-zinc-900 tracking-tight leading-none">Configuración Global</h2>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Nodo Industrial v3.5</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400">
                <Plus className="rotate-45" size={24} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
             <section className="space-y-6">
                <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                   <Zap size={14} className="text-blue-500" /> Identidad & Marca
                </h3>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nombre de Plataforma</label>
                      <input type="text" defaultValue="Architect Build" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Idioma de Interfaz</label>
                      <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold appearance-none">
                         <option>Español (Global)</option>
                         <option>English (Direct)</option>
                      </select>
                   </div>
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                   <Activity size={14} className="text-blue-500" /> Funciones Operativas
                </h3>
                <div className="space-y-4">
                   <ToggleRow 
                     label="Notificaciones de Ventas" 
                     description="Alertas instantáneas sobre conversiones." 
                     active={salesNotifications} 
                     onChange={setSalesNotifications}
                   />
                   <ToggleRow 
                     label="Modo Desarrollador" 
                     description="Acceso a logs técnicos de bajo nivel." 
                     active={developerMode} 
                     onChange={setDeveloperMode}
                   />
                   <ToggleRow 
                     label="Sincronización Cloud" 
                     description="Persistencia automática en GitHub." 
                     active={autoCloudSync} 
                     onChange={setAutoCloudSync}
                   />
                </div>
             </section>
          </div>

          <div className="p-8 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50">
             <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">Cancelar</button>
             <button onClick={onClose} className="nuclear-button !bg-zinc-900 !px-8 text-sm !py-3 transform active:scale-95 transition-all">Aplicar Cambios</button>
          </div>
       </motion.div>
    </div>
  )
}

function ToggleRow({ label, description, active = false, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-2">
       <div>
          <h4 className="text-sm font-bold text-zinc-900">{label}</h4>
          <p className="text-[11px] text-zinc-400 font-medium">{description}</p>
       </div>
       <div 
         onClick={() => onChange && onChange(!active)}
         className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-zinc-200'}`}
       >
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'right-1' : 'left-1'}`} />
       </div>
    </div>
  )
}
