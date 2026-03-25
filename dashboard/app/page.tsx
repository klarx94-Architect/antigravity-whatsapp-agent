"use client"

import { motion } from 'framer-motion'
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Box, 
  Cpu, 
  HardDrive,
  BarChart3,
  Globe,
  Radio
} from 'lucide-react'

export default function HomePage() {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-12 max-w-7xl mx-auto space-y-16"
    >
      {/* Header Cinematográfico */}
      <motion.header variants={itemVars} className="flex justify-between items-center bg-white/40 p-10 rounded-[2.5rem] border border-white/40 shadow-premium backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            <span className="premium-label tracking-[0.5em]">Antigravity Intelligence Hub</span>
          </div>
          <h1 className="text-6xl font-display font-black text-primary tracking-tight leading-none mb-4">
            Centro de <span className="text-accent underline decoration-8 underline-offset-8">Operaciones</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg italic max-w-xl opacity-80 leading-relaxed">
            Gestión de agentes autónomos bajo el estándar Protocolo Maestro. 
            Arquitectura Nuclear verificada y activa.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-6">
          <button className="nuclear-button group">
            <Plus size={22} className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
            <span className="relative z-10">Inyectar Nuevo Agente</span>
          </button>
          <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase">
            <span className="flex items-center gap-2"><Globe size={14} className="text-accent" /> Global Node</span>
            <span className="flex items-center gap-2"><Radio size={14} className="text-accent" /> Live Sync</span>
          </div>
        </div>
      </motion.header>

      {/* Métricas de Alto Impacto */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard 
          icon={<Activity className="text-accent" size={24} />} 
          label="Throughput de Red" 
          value="48.2k" 
          delta="+24.5%" 
          description="Mensajes procesados (24h)"
        />
        <StatCard 
          icon={<ShieldCheck className="text-glow-green" size={24} />} 
          label="Estabilidad Central" 
          value="100.0%" 
          delta="Stable" 
          description="Tiempo de actividad nuclear"
        />
        <StatCard 
          icon={<BarChart3 className="text-amber-500" size={24} />} 
          label="Consumo Gemini" 
          value="8.4M" 
          delta="Normal" 
          description="Tokens proyectados / mes"
        />
      </motion.div>

      {/* Línea de Producción Beta */}
      <motion.section variants={itemVars}>
        <div className="flex items-end justify-between mb-10 border-b-2 border-slate-100 pb-8 px-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-black text-primary flex items-center gap-4">
              <Box size={32} className="text-accent" />
              Línea de Producción
            </h2>
            <p className="premium-label tracking-widest text-slate-400">Control de instancia y despliegue directo</p>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 rounded-[1.5rem] border border-slate-100 flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carga de CPU</span>
                <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '65%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-accent" 
                    />
                </div>
             </div>
             <span className="text-sm font-black text-primary">65%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <AgentCard 
            name="Gallo Reserva Bot" 
            role="Sales Intelligence" 
            status="online" 
            messages={24510} 
            tier="Nuclear v2"
          />
          <AgentCard 
            name="Electrofox Tech" 
            role="L2 Technical Support" 
            status="online" 
            messages={12840} 
            tier="Standard"
          />
          <AgentCard 
            name="Architect Alpha" 
            role="System Diagnostics" 
            status="offline" 
            messages={0} 
            tier="Prototype"
          />
        </div>
      </motion.section>
      
      {/* Footer Industrial Decorator */}
      <motion.div variants={itemVars} className="h-[120px] glass-card flex items-center justify-between px-12 bg-primary/5 border-dashed border-primary/20">
          <div className="flex items-center gap-6">
            <Cpu size={24} className="text-primary/40 animate-pulse" />
            <span className="premium-label text-primary/40 tracking-[0.5em]">Waiting for manual injection protocol 33...</span>
          </div>
          <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#F8F9FA] bg-slate-200 shadow-premium" />
              ))}
          </div>
      </motion.div>

    </motion.div>
  )
}

function StatCard({ icon, label, value, delta, description }: { icon: any, label: string, value: string, delta: string, description: string }) {
  return (
    <div className="glass-card p-10 flex flex-col gap-4 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full translate-x-16 translate-y-[-16px] group-hover:scale-125 transition-transform duration-1000" />
      <div className="flex items-center justify-between relative z-10">
        <div className="p-4 bg-white rounded-2xl shadow-premium group-hover:shadow-nuclear transition-all duration-500">
           {icon}
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${delta.startsWith('+') || delta === 'Stable' ? 'bg-glow-green/10 text-glow-green' : 'bg-slate-100 text-slate-400'}`}>
          {delta}
        </span>
      </div>
      <div className="space-y-1 relative z-10">
        <span className="premium-label opacity-60">{label}</span>
        <h3 className="text-5xl font-display font-black text-primary group-hover:text-accent transition-colors duration-500 leading-tight">
          {value}
        </h3>
        <p className="text-[11px] font-medium text-slate-400 italic mt-2">{description}</p>
      </div>
    </div>
  )
}

function AgentCard({ name, role, status, messages, tier }: { name: string, role: string, status: 'online' | 'offline', messages: number, tier: string }) {
  return (
    <div className={`glass-card group overflow-hidden ${status === 'offline' ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
      <div className="p-10 space-y-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-nuclear relative overflow-hidden group-hover:rotate-6 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <Zap className={`w-10 h-10 ${status === 'online' ? 'text-white ' : 'text-slate-600'}`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-primary font-display">{name}</h3>
                    <span className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{tier}</span>
                </div>
                <p className="text-sm text-slate-400 font-medium tracking-wide italic">{role}</p>
              </div>
            </div>
            <button className="p-2 text-slate-200 hover:text-primary transition-colors hover:bg-slate-50 rounded-xl">
              <MoreHorizontal size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
              <span className="premium-label text-[8px] opacity-60">Status Network</span>
              <div className="flex items-center gap-3 mt-2">
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-glow-green shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                <span className="text-xs font-black uppercase tracking-widest">{status}</span>
              </div>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
              <span className="premium-label text-[8px] opacity-60">Payload</span>
              <div className="flex items-center gap-3 mt-2">
                <HardDrive size={14} className="text-accent" />
                <span className="text-xs font-black">{messages.toLocaleString()} msg</span>
              </div>
            </div>
          </div>
      </div>

      <div className="p-4 flex gap-4 bg-slate-50/80 border-t border-slate-100 backdrop-blur-sm">
        <button className="flex-1 bg-white hover:bg-primary hover:text-white text-primary py-4 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-500 shadow-premium hover:shadow-nuclear">
          Control
        </button>
        <button className="flex-1 bg-white hover:bg-primary hover:text-white text-primary py-4 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-500 shadow-premium hover:shadow-nuclear">
          Deploy
        </button>
      </div>
    </div>
  )
}
