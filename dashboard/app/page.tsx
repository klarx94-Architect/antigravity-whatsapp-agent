import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Activity, Plus, MoreHorizontal, MessageSquare, Box, Cpu, HardDrive } from 'lucide-react'

export default function HomePage() {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-8 max-w-6xl mx-auto space-y-12"
    >
      {/* Header de la Fábrica */}
      <motion.header variants={itemVars} className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-glow-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400">Nucleus Factory v2.5</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-robotic-900 tracking-tight">Estado de la Fábrica</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Orquestando inteligencia en tiempo real.</p>
        </div>
        <button className="robot-button group shadow-lg shadow-blue-500/10">
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">Nuevo Androide</span>
        </button>
      </motion.header>

      {/* Métricas Rápidas */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Activity className="text-glow-blue" />} label="Mensajes / hora" value="1,284" delta="+12%" />
        <StatCard icon={<ShieldCheck className="text-glow-green" />} label="Uptime Nuclear" value="99.99%" delta="0%" />
        <StatCard icon={<Zap className="text-amber-500" />} label="Créditos Gemini" value="842.2k" delta="-5.2k" />
      </motion.div>

      {/* Línea de Producción (Agentes) */}
      <motion.section variants={itemVars}>
        <div className="flex items-center justify-between mb-6 border-b border-metallic-100 pb-4">
          <h2 className="text-xl font-display font-bold text-robotic-900 flex items-center gap-3">
            <Box size={20} className="text-robotic-900" />
            Línea de Producción
            <span className="bg-robotic-900 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1.5 grayscale">
              <Cpu size={10} /> 3 Activos
            </span>
          </h2>
          <div className="flex gap-2">
             <div className="w-32 h-1.5 bg-metallic-100 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-glow-blue" />
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase">Capacidad: 75%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AgentCard 
            name="Venta El Gallo Bot" 
            role="Ventas / Reservas" 
            status="online" 
            messages={1520} 
            type="Alpha"
          />
          <AgentCard 
            name="Electrofox Support" 
            role="Soporte Técnico" 
            status="online" 
            messages={842} 
            type="Gamma"
          />
          <AgentCard 
            name="Robo-Asistente" 
            role="Pruebas Nucleares" 
            status="offline" 
            messages={0} 
            type="Prototype"
          />
        </div>
      </motion.section>
      
      {/* Visual Decorator */}
      <motion.div variants={itemVars} className="h-[200px] border border-dashed border-metallic-200 rounded-3xl flex items-center justify-center bg-metallic-50/30">
          <p className="text-slate-300 font-display text-sm tracking-widest uppercase">Waiting for next injection...</p>
      </motion.div>

    </motion.div>
  )
}

function StatCard({ icon, label, value, delta }: { icon: any, label: string, value: string, delta: string }) {
  return (
    <div className="metallic-card p-6 flex flex-col gap-1 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-metallic-50 rounded-full translate-x-12 translate-y-[-12px] group-hover:scale-110 transition-transform duration-500" />
      <div className="flex items-center gap-2 mb-2 relative z-10">
        {icon}
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">{label}</span>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <span className="text-3xl font-display font-bold text-robotic-900 group-hover:text-glow-blue transition-colors">{value}</span>
        <div className="flex flex-col items-end">
             <span className={`text-xs font-black ${delta.startsWith('+') ? 'text-glow-green' : 'text-slate-400'}`}>{delta}</span>
             <span className="text-[8px] text-slate-300 uppercase font-black">24h delta</span>
        </div>
      </div>
    </div>
  )
}

function AgentCard({ name, role, status, messages, type }: { name: string, role: string, status: 'online' | 'offline', messages: number, type: string }) {
  return (
    <div className={`metallic-card group ${status === 'offline' ? 'opacity-60 grayscale' : ''}`}>
      <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-robotic-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500">
                <Zap className={`w-7 h-7 ${status === 'online' ? 'text-white animate-pulse' : 'text-slate-600'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-robotic-900 font-display">{name}</h3>
                    <span className="text-[8px] bg-metallic-100 text-slate-500 px-1.5 py-0.5 rounded font-black italic">{type}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">{role}</p>
              </div>
            </div>
            <button className="text-slate-300 hover:text-robotic-900 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-metallic-50 p-3 rounded-xl border border-metallic-100">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Estado</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-glow-green animate-ping' : 'bg-slate-300'}`} />
                <span className="text-[11px] font-bold uppercase tracking-tight">{status}</span>
              </div>
            </div>
            <div className="bg-metallic-50 p-3 rounded-xl border border-metallic-100">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Throughput</span>
              <div className="flex items-center gap-2 mt-1">
                <HardDrive size={10} className="text-slate-400" />
                <span className="text-[11px] font-bold">{messages.toLocaleString()} msgs</span>
              </div>
            </div>
          </div>
      </div>

      <div className="p-2 flex gap-2 bg-metallic-50/50 border-t border-metallic-100">
        <button className="flex-1 hover:bg-white hover:shadow-sm text-robotic-900 py-2.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all">Config</button>
        <button className="flex-1 hover:bg-white hover:shadow-sm text-robotic-900 py-2.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all">Logs</button>
      </div>
    </div>
  )
}
