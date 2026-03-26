"use client"

import React from 'react'
import { ShieldCheck, Zap } from 'lucide-react'

export function SecurityView() {
  return (
    <div className="space-y-10">
      <div className="space-y-2 px-1">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Seguridad & Credenciales</h2>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Configuración de Puentes Nucleares</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card bg-white p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
             <ShieldCheck className="text-blue-600" size={20} />
             <h3 className="text-sm font-bold text-zinc-900">Tokens de Infraestructura</h3>
          </div>
          <SecretInput 
            label="GitHub Personal Access Token" 
            value="ghp_****************************" 
            help="Permite a la plataforma persistir tus agentes y configuraciones en el repositorio."
          />
          <SecretInput 
            label="Gemini AI API Key" 
            value="AIzaSy****************************" 
            help="El 'Cerebro' de tus agentes. Proporciona la capacidad de razonamiento de lenguaje."
          />
          <SecretInput 
            label="Evolution API URL" 
            value="https://evolution-motor-vora-production.up.railway.app" 
            help="Punto de enlace con tu Nodo Evolution (Production)."
          />
          <SecretInput 
            label="Evolution API Key" 
            value="architect_admin_key" 
            help="Clave maestra de administración de tu Nodo Evolution."
          />
        </div>

        <div className="glass-card bg-zinc-900 text-white p-8 space-y-8 border-none ring-1 ring-white/10 shadow-2xl rounded-[32px]">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
             <Zap className="text-emerald-400" size={20} />
             <h3 className="text-sm font-bold">Motor Zero-Cost (Evolution API)</h3>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Para operar sin costes por mensaje, utiliza **Evolution API**. Conecta tu cuenta oficial de WhatsApp mediante emulación segura y mantén la sincronización total en tu móvil.
            </p>
 
            <div className="space-y-4">
               <GuideStep number={1} label="Desplegar Nodo Evolution" text="Instala la instancia en tu servidor o VPS mediante Docker Compose." />
               <GuideStep number={2} label="Configurar Webhook" text="Apunta los eventos de Evolution a la URL de tu API de Architect Build." />
               <GuideStep number={3} label="Vincular Cuenta via QR" text="Escanea el código QR desde el Constructor de Agentes para activar el servicio." />
            </div>
 
            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
               Descargar Manual de Despliegue (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GuideStep({ number, label, text }: any) {
  return (
    <div className="flex gap-4">
       <div className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-emerald-400">
          {number}
       </div>
       <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase tracking-tight text-white">{label}</h4>
          <p className="text-[10px] text-zinc-500 leading-normal">{text}</p>
       </div>
    </div>
  )
}

function SecretInput({ label, value, help }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">{label}</label>
        <span className="text-[9px] text-zinc-300 italic font-medium">{help}</span>
      </div>
      <div className="flex gap-2">
        <input 
          type="password" 
          value={value} 
          readOnly 
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs font-mono text-zinc-500 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <button className="px-4 py-2 bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-colors">
           Editar
        </button>
      </div>
    </div>
  )
}
