"use client"

import React, { useState } from 'react'
import { Mail, Briefcase, LogOut } from 'lucide-react'
import { useSettings } from '../context'

export function ProfileView({ vaultFiles = [] }: { vaultFiles?: any[] }) {
  const agentCount = vaultFiles.length
  const { salesNotifications, setSalesNotifications, developerMode, setDeveloperMode, autoCloudSync, setAutoCloudSync } = useSettings()
  
  const [profile] = useState({
    name: 'Architect Senior',
    role: 'CEO & Lead Architect',
    email: 'karc@architect-build.ai',
    bio: 'Especialista en automatización industrial de WhatsApp y orquestación de Agentes IA.',
    company: 'Architect Build Ltd.'
  })

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
      <div className="flex items-center gap-8 border-b border-zinc-100 pb-12">
         <div className="w-32 h-32 bg-zinc-900 rounded-[40px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-zinc-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            SA
         </div>
         <div className="space-y-4 flex-1">
            <div className="space-y-1">
               <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">{profile.name}</h1>
               <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{profile.role}</p>
            </div>
            <div className="flex gap-6">
               <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
                  <Mail size={12} /> {profile.email}
               </div>
               <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
                  <Briefcase size={12} /> {profile.company}
               </div>
            </div>
         </div>
         <button className="nuclear-button !bg-zinc-900 !px-8">Editar Perfil</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            <div className="glass-card bg-white p-8 space-y-4">
               <h3 className="text-sm font-black uppercase text-zinc-900 tracking-widest">Biografía Profesional</h3>
               <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  {profile.bio}
               </p>
            </div>

            <div className="glass-card bg-white p-8 space-y-6">
               <h3 className="text-sm font-black uppercase text-zinc-900 tracking-widest">Preferencias de Sistema</h3>
               <div className="space-y-4">
                  <PreferenceToggle 
                    label="Notificaciones de Ventas" 
                    desc="Recibir alertas en tiempo real cuando un agente cierre una conversión." 
                    active={salesNotifications} 
                    onChange={setSalesNotifications}
                  />
                  <PreferenceToggle 
                    label="Modo Desarrollador" 
                    desc="Ver logs técnicos y estados de las GitHub Actions en el dashboard." 
                    active={developerMode} 
                    onChange={setDeveloperMode}
                  />
                  <PreferenceToggle 
                    label="Sincronización Cloud Automática" 
                    desc="Persistir cambios en GitHub instantáneamente tras cada edición." 
                    active={autoCloudSync} 
                    onChange={setAutoCloudSync}
                  />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="glass-card bg-zinc-900 text-white p-8 space-y-6 border-none shadow-2xl rounded-[32px]">
               <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Métricas de Usuario</h3>
               <div className="space-y-4">
                  <MetricSmall label="Agentes Gestionados" value={agentCount.toString()} color="blue" />
                  <MetricSmall label="Uptime de Infra" value="100%" color="emerald" />
               </div>
            </div>

            <button className="w-full py-5 border-2 border-zinc-100 rounded-[32px] text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-3">
               <LogOut size={16} /> Cerrar Sesión Segura
            </button>
         </div>
      </div>
    </div>
  )
}

function PreferenceToggle({ label, desc, active, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0 font-display">
       <div className="space-y-0.5">
          <p className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] text-zinc-400 font-medium">{desc}</p>
       </div>
       <div 
         onClick={() => onChange(!active)}
         className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${active ? 'bg-blue-600' : 'bg-zinc-200'}`}
       >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'left-5' : 'left-1'}`} />
       </div>
    </div>
  )
}

function MetricSmall({ label, value, color }: any) {
  return (
    <div className="space-y-1">
       <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
       <p className={`text-xl font-black ${color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`}>{value}</p>
    </div>
  )
}
