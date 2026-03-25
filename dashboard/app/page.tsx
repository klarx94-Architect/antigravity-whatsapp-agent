import { Zap, ShieldCheck, Activity, Plus, MoreHorizontal, MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header de la Fábrica */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-robotic-900 tracking-tight">Estado de la Fábrica</h1>
          <p className="text-slate-500 mt-1">Monitoreando 3 agentes activos en la nube.</p>
        </div>
        <button className="robot-button">
          <Plus size={20} />
          Nuevo Androide
        </button>
      </header>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Activity className="text-glow-blue" />} label="Mensajes / hora" value="1,284" delta="+12%" />
        <StatCard icon={<ShieldCheck className="text-glow-green" />} label="Uptime Nuclear" value="99.99%" delta="0%" />
        <StatCard icon={<Zap className="text-amber-500" />} label="Créditos Gemini" value="842.2k" delta="-5.2k" />
      </div>

      {/* Línea de Producción (Agentes) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-robotic-900 flex items-center gap-2">
            Línea de Producción
            <span className="bg-glow-blue/10 text-glow-blue text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-glow-blue/20">3 Activos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgentCard 
            name="Venta El Gallo Bot" 
            role="Ventas / Reservas" 
            status="online" 
            messages={1520} 
          />
          <AgentCard 
            name="Electrofox Support" 
            role="Soporte Técnico" 
            status="online" 
            messages={842} 
          />
          <AgentCard 
            name="Robo-Asistente Alpha" 
            role="Pruebas Nucleares" 
            status="offline" 
            messages={0} 
          />
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, label, value, delta }: { icon: any, label: string, value: string, delta: string }) {
  return (
    <div className="metallic-card p-6 flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-display font-bold text-robotic-900">{value}</span>
        <span className={`text-xs font-bold ${delta.startsWith('+') ? 'text-glow-green' : 'text-slate-400'}`}>{delta}</span>
      </div>
    </div>
  )
}

function AgentCard({ name, role, status, messages }: { name: string, role: string, status: 'online' | 'offline', messages: number }) {
  return (
    <div className="metallic-card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-metallic-100 rounded-xl flex items-center justify-center border border-metallic-200">
            <Zap className={`w-6 h-6 ${status === 'online' ? 'text-glow-blue fill-current' : 'text-slate-300'}`} />
          </div>
          <div>
            <h3 className="font-bold text-robotic-900">{name}</h3>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-robotic-900 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-center gap-6 py-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estado</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-glow-green shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
            <span className="text-xs font-bold capitalize">{status}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mensajes</span>
          <span className="text-xs font-bold mt-0.5 flex items-center gap-1">
            <MessageSquare size={12} className="text-slate-400" />
            {messages.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-metallic-100 flex gap-2">
        <button className="flex-1 bg-metallic-50 hover:bg-metallic-100 text-robotic-900 py-2 rounded-lg text-xs font-bold transition-all">Configurar</button>
        <button className="flex-1 bg-metallic-50 hover:bg-glow-blue/10 hover:text-glow-blue text-robotic-900 py-2 rounded-lg text-xs font-bold transition-all">Ver Logs</button>
      </div>
    </div>
  )
}
