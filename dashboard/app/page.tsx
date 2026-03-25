"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Zap, 
  Plus, 
  MoreHorizontal, 
  Cpu, 
  Activity,
  Play,
  Pause,
  Download,
  Copy,
  ChevronRight,
  Database,
  FileCode,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { getApiStatus, getVaultFiles, saveConfig } from './api'

export default function HomePage() {
  const [activeTab, setActiveTab ] = useState<'monitor' | 'creator' | 'vault'>('monitor')
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [vaultFiles, setVaultFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const status = await getApiStatus()
      const files = await getVaultFiles()
      setSystemStatus(status)
      setVaultFiles(files)
      setLoading(false)
    }
    init()
    const interval = setInterval(init, 10000) // Polling cada 10s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8 pb-20">
      {/* Mini Header / Breadcrumb */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
          <span>Antigravity</span>
          <ChevronRight size={10} />
          <span className="text-zinc-900">Operations Hub</span>
        </div>
        
        {/* Status indicator in breadcrumb */}
        {systemStatus?.status === 'online' ? (
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            ENGINE ONLINE
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <AlertCircle size={10} />
            ENGINE OFFLINE
          </div>
        )}
      </div>

      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-zinc-900 tracking-tight">Industrial Dash</h1>
          <p className="text-sm text-zinc-500 font-medium tracking-tight">Gestión y despliegue de inteligencia autónoma v2.5</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <TabButton active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} label="Monitor" />
          <TabButton active={activeTab === 'creator'} onClick={() => setActiveTab('creator')} label="Creator" />
          <TabButton active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} label="Vault" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'monitor' && <OperationsMonitor status={systemStatus} />}
          {activeTab === 'creator' && <AgentCreator />}
          {activeTab === 'vault' && <ConfigVault files={vaultFiles} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
        ${active ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}
      `}
    >
      {label}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* SECCIÓN: MONITOR DE OPERACIONES                                            */
/* -------------------------------------------------------------------------- */
function OperationsMonitor({ status }: any) {
  const isOnline = status?.status === 'online'

  return (
    <div className="space-y-10">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat label="System Active" value={isOnline ? "YES" : "NO"} status={isOnline ? "Optimal" : "Offline"} color={isOnline ? "emerald" : "red"} />
        <MiniStat label="Engine Type" value={status?.engine || "Gemini 1.5"} delta="Nuclear" />
        <MiniStat label="API Connection" value={status?.api_connected ? "SECURE" : "MISSING"} status={status?.api_connected ? "Stable" : "Critical"} color={status?.api_connected ? "emerald" : "red"} />
        <MiniStat label="Hub Version" value={status?.version || "2.5.0"} delta="Stable" />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 px-1">Línea de Producción Activada</h2>
        {!isOnline && (
          <div className="p-8 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 bg-zinc-50/50">
             <AlertCircle size={32} className="text-zinc-300" />
             <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900">Backend Desconectado</h3>
                <p className="text-xs text-zinc-400 font-medium">Ejecuta `cd agent && python main.py` para activar la inteligencia del hub.</p>
             </div>
          </div>
        )}
        {isOnline && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AgentStatusCard name="Gallo Reserva Bot" status="running" type="Sales Intelligence" />
            <AgentStatusCard name="Electrofox Tech" status="running" type="L2 Support" />
            <AgentStatusCard name="Architect Alpha" status="paused" type="Diagnostics" />
          </div>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, value, delta, status, color = "blue" }: any) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50"
  }[color as keyof typeof colorClasses] || "text-blue-600 bg-blue-50"

  return (
    <div className="glass-card p-5 space-y-2">
      <span className="premium-label text-[10px]">{label}</span>
      <div className="flex items-end justify-between">
        <h4 className="text-xl font-bold text-zinc-900">{value}</h4>
        {delta && <span className={`text-[10px] font-black ${colorClasses} px-2 py-0.5 rounded-full`}>{delta}</span>}
        {status && <span className={`text-[10px] font-black ${colorClasses} px-2 py-0.5 rounded-full`}>{status}</span>}
      </div>
    </div>
  )
}

function AgentStatusCard({ name, status, type }: { name: string, status: 'running' | 'paused' | 'created', type: string }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-6 group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform cursor-pointer">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-zinc-900">{name}</h3>
            <p className="text-[11px] text-zinc-400 font-medium">{type}</p>
          </div>
        </div>
        <div className={`
          flex items-center gap-2 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter
          ${status === 'running' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
            status === 'paused' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
            'bg-zinc-50 border-zinc-100 text-zinc-400'}
        `}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-emerald-500 animate-pulse' : status === 'paused' ? 'bg-amber-500' : 'bg-zinc-300'}`} />
          {status}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button className="flex-1 nuclear-button bg-zinc-100 !text-zinc-900 hover:!bg-zinc-200 shadow-none border border-zinc-200">
          <Activity size={14} /> <span className="text-[11px] tracking-tight">Stats</span>
        </button>
        {status === 'running' ? (
          <button className="flex-1 nuclear-button">
            <Pause size={14} /> <span className="text-[11px] tracking-tight">Pause</span>
          </button>
        ) : (
          <button className="flex-1 nuclear-button !bg-blue-600 hover:!bg-blue-700">
            <Play size={14} /> <span className="text-[11px] tracking-tight">Resume</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SECCIÓN: CONSTRUCTOR DE AGENTES (PROTOCOLO DE VIDA)                        */
/* -------------------------------------------------------------------------- */
function AgentCreator() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    type: "restaurante",
    hours: "9:00 - 18:00",
    location: "",
    services: []
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2)
      return
    }
    
    setSaving(true)
    const res = await saveConfig("business", formData)
    setSaving(false)
    
    if (!res.error) {
      setDone(true)
      setTimeout(() => setDone(false), 3000)
      setStep(step + 1)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-8 space-y-4 bg-zinc-900 text-white">
          <ShieldCheck size={32} className="text-blue-500" />
          <h2 className="text-xl font-bold font-display">Protocolo de Vida v3</h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">Inyectar inteligencia autónoma requiere precisión. Sigue el flujo nuclear para garantizar la estabilidad del núcleo.</p>
          <div className="space-y-3 pt-4 border-t border-zinc-800">
             <StepLabel active={step === 1} number={1} label="Identidad Nuclear" />
             <StepLabel active={step === 2} number={2} label="Configuración de Motor" />
             <StepLabel active={step === 3} number={3} label="Inyección de Conocimiento" />
             <StepLabel active={step === 4} number={4} label="Activación Final" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 glass-card p-10 bg-white min-h-[400px] flex flex-col justify-between">
        <div className="max-w-xl space-y-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Nombre del Agente / Negocio</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sales Architect Prime" 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Tipo de Entidad</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="restaurante">Restaurante / Cafetería</option>
                    <option value="clinica">Clínica / Salud</option>
                    <option value="tienda">E-commerce / Tienda</option>
                    <option value="saas">SaaS / Tecnología</option>
                    <option value="personal">Marca Personal</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Modelo de Inteligencia</label>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="p-4 border-2 border-blue-600 bg-blue-50 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <Cpu size={18} className="text-blue-600" />
                          <span className="text-sm font-bold text-zinc-900">Gemini 1.5 Pro</span>
                        </div>
                        <CheckCircle2 size={16} className="text-blue-600" />
                     </button>
                     <button className="p-4 border-2 border-zinc-100 rounded-xl flex items-center gap-3 grayscale cursor-not-allowed opacity-50">
                        <Cpu size={18} className="text-zinc-400" />
                        <span className="text-sm font-bold text-zinc-400">GPT-4 Turbo</span>
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-6 border-t border-zinc-100 flex justify-end items-center gap-4">
          {done && <span className="text-xs font-bold text-emerald-600 flex items-center gap-2"><CheckCircle2 size={14} /> Guardado</span>}
          <button 
            onClick={handleContinue}
            disabled={saving}
            className="nuclear-button !px-10 !py-4 text-sm group disabled:opacity-50"
          >
            {saving ? "Procesando..." : step === 4 ? "Activar Agente" : "Continuar"} 
            {!saving && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-2" />}
          </button>
        </div>
      </div>
    </div>
  )
}

function StepLabel({ number, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 transition-opacity duration-300 ${active ? 'opacity-100 text-white' : 'opacity-40 text-zinc-600'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${active ? 'bg-blue-600 border-blue-600' : 'border-zinc-700'}`}>
        {number}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SECCIÓN: BÓVEDA DE CONFIGURACIÓN (VAULT)                                    */
/* -------------------------------------------------------------------------- */
function ConfigVault({ files }: { files: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-zinc-900">Archivos del Ecosistema</h2>
        <button className="text-xs font-bold text-blue-600 hover:underline">Download All Manifests (.zip)</button>
      </div>

      <div className="glass-card bg-white overflow-hidden divide-y divide-zinc-100">
        {files.length === 0 ? (
          <div className="p-10 text-center space-y-2">
             <FileCode size={32} className="text-zinc-200 mx-auto" />
             <p className="text-xs text-zinc-400 font-medium">Bóveda vacía. Inicia el protocolo de creación para generar archivos.</p>
          </div>
        ) : (
          files.map((file, idx) => (
            <FileRow key={idx} name={file.name} type={file.name.split('.').pop()?.toUpperCase() || "FILE"} size={file.size} date={file.date} />
          ))
        )}
      </div>

      <div className="p-8 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
         <Database size={32} className="text-zinc-300" />
         <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">¿Necesitas inyectar conocimiento externo?</h3>
            <p className="text-xs text-zinc-400 font-medium">Arrastra tus archivos de entrenamiento (.txt, .pdf, .docx) para procesarlos mediante RAG.</p>
         </div>
      </div>
    </div>
  )
}

function FileRow({ name, type, size, date }: any) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-zinc-100 rounded-lg text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <FileCode size={18} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-zinc-700">{name}</h4>
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{type} • {size}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[11px] font-medium text-zinc-400">{date}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"><Copy size={16} /></button>
           <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"><Download size={16} /></button>
        </div>
      </div>
    </div>
  )
}
