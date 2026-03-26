"use client"

import React from 'react'
import { Activity } from 'lucide-react'

export function InfrastructureView({ status }: any) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">System Infrastructure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthCard label="Neural Engine" status={status?.status === 'online' ? 'Stable' : 'Offline'} value="Gemini 1.5 Pro" />
        <HealthCard label="GitHub Bridge" status="Connected" value="klarx94-Architect/..." />
        <HealthCard label="WhatsApp Provider" status="Online" value="Evolution API (Production)" />
      </div>
      <div className="glass-card p-10 bg-zinc-900 text-white space-y-4 rounded-[32px] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-500" />
          <h3 className="font-bold">Real-time Node Health</h3>
        </div>
        <div className="h-48 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 flex flex-col items-center justify-center p-8 space-y-4">
           <div className="flex items-center gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 bg-blue-500/40 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">Node-Vora Latency Monitor: Operational</p>
        </div>
      </div>
    </div>
  )
}

function HealthCard({ label, status, value }: any) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${status === 'Stable' || status === 'Connected' || status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {status}
        </span>
      </div>
      <p className="text-sm font-bold text-zinc-900">{value}</p>
    </div>
  )
}
