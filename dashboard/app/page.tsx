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
  CheckCircle2,
  Layers
} from 'lucide-react'
import { getApiStatus, getVaultFiles, saveConfig } from './api'
import { getGithubWorkflows, pushFileToGithub } from './github'

export default function HomePage({ activeView = 'dashboard' }: { activeView?: string }) {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [vaultFiles, setVaultFiles] = useState<any[]>([])
  const [githubRuns, setGithubRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const [status, files, runs] = await Promise.all([
        getApiStatus(),
        getVaultFiles(),
        getGithubWorkflows()
      ])
      setSystemStatus(status)
      setVaultFiles(files)
      setGithubRuns(runs)
      setLoading(false)
    }
    init()
    const interval = setInterval(init, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8 pb-20">
      {/* Mini Header / Breadcrumb */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
          <span>Architect Build</span>
          <ChevronRight size={10} />
          <span className="text-zinc-900 capitalize">{activeView}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {systemStatus?.status === 'online' ? (
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              CORE ACTIVE
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
              <AlertCircle size={10} />
              LOCAL ENGINE OFFLINE
            </div>
          )}
          
          {process.env.NEXT_PUBLIC_GITHUB_TOKEN ? (
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <Layers size={10} />
              GH CLOUD CONNECTED
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
              <Layers size={10} />
              GH DISCONNECTED
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTabSelector(activeView, systemStatus, githubRuns, vaultFiles)}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function activeTabSelector(view: string, status: any, githubRuns: any[], vaultFiles: any[]) {
  switch (view) {
    case 'dashboard': return <OperationsMonitor status={status} />
    case 'builder': return <AgentCreator />
    case 'vault': return <ConfigVault files={vaultFiles} />
    case 'deployments': return <DeploymentsView runs={githubRuns} />
    case 'infrastructure': return <InfrastructureView status={status} />
    case 'security': return <SecurityView />
    case 'settings': return <SettingsView />
    default: return <OperationsMonitor status={status} />
  }
}

/* -------------------------------------------------------------------------- */
/* VIEWS COMPONENTIZADAS                                                     */
/* -------------------------------------------------------------------------- */

function DeploymentsView({ runs = [] }: { runs?: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">GitHub Deployments</h2>
          <p className="text-xs text-zinc-400 font-medium">Historial de compilaciones y orquestación de la nube.</p>
        </div>
        <button className="nuclear-button !bg-zinc-900 !px-6">Re-deploy All</button>
      </div>
      
      <div className="glass-card bg-white divide-y divide-zinc-100 overflow-hidden">
        {runs.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <Layers size={40} className="text-zinc-200 mx-auto" />
            <p className="text-sm font-medium text-zinc-400 italic">No se han detectado ejecuciones activas en GitHub Actions.</p>
          </div>
        ) : (
          runs.map((d) => (
            <div key={d.id} className="p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border ${
                  d.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                  d.status === 'running' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                  'bg-red-50 border-red-100 text-red-600'
                }`}>
                  <Layers size={18} className={d.status === 'running' ? 'animate-spin' : ''} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{d.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{d.id} • {d.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-[11px] font-bold text-zinc-400 tabular-nums">{d.time}</span>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                  d.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                  d.status === 'running' ? 'bg-blue-50 border-blue-100 text-blue-600 animate-pulse' :
                  'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {d.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function InfrastructureView({ status }: any) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">System Infrastructure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthCard label="Neural Engine" status={status?.status === 'online' ? 'Stable' : 'Offline'} value="Gemini 1.5 Pro" />
        <HealthCard label="GitHub Bridge" status="Connected" value="klarx94-Architect/..." />
        <HealthCard label="WhatsApp Provider" status="Idle" value="Whapi.cloud" />
      </div>
      <div className="glass-card p-10 bg-zinc-900 text-white space-y-4">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-500" />
          <h3 className="font-bold">Real-time Node Health</h3>
        </div>
        <div className="h-32 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center italic text-zinc-500 text-sm">
          [ Gráfico de Latencia Industrial ]
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
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${status === 'Stable' || status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {status}
        </span>
      </div>
      <p className="text-sm font-bold text-zinc-900">{value}</p>
    </div>
  )
}

function SecurityView() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Security & Credentials</h2>
      <div className="glass-card bg-white p-8 space-y-6">
        <SecretInput label="GitHub Personal Access Token" value="ghp_****************************" />
        <SecretInput label="Gemini API Key" value="AIzaSy****************************" />
        <SecretInput label="WhatsApp Token (Whapi)" value="********************************" />
      </div>
    </div>
  )
}

function SecretInput({ label, value }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">{label}</label>
      <div className="flex gap-2">
        <input 
          type="password" 
          value={value} 
          readOnly 
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-500"
        />
        <button className="nuclear-button !bg-zinc-100 !text-zinc-900 border border-zinc-200 hover:!bg-zinc-200">
           Change
        </button>
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Global Settings</h2>
      <div className="glass-card p-10 bg-white space-y-8">
        <div className="flex items-center justify-between py-4 border-b border-zinc-100">
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Industrial Dark Mode</h4>
            <p className="text-xs text-zinc-400">Activa la interfaz de alto contraste para entornos de baja luz.</p>
          </div>
          <div className="w-10 h-5 bg-zinc-200 rounded-full relative cursor-pointer">
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Auto-commit a GitHub</h4>
            <p className="text-xs text-zinc-400">Guarda automáticamente cada cambio en la configuración como un commit.</p>
          </div>
          <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>
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
    prompt: "Eres un asistente virtual de alta gama...",
    wa_token: "",
    wa_phone: ""
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handleContinue = async () => {
    if (step < 4) {
      setStep(step + 1)
      return
    }
    
    setSaving(true)
    
    // 1. Guardado Local (Legacy Backup)
    await saveConfig("business", formData)
    
    // 2. Persistencia Cloud-Native (GitHub API)
    const businessYaml = `name: ${formData.name}\ntype: ${formData.type}\nlocation: ${formData.location}`
    const promptsYaml = `system_prompt: ${formData.prompt}\nwhatsapp_token: ${formData.wa_token}`
    
    await Promise.all([
      pushFileToGithub(`config/business.yaml`, businessYaml, `Update business config for ${formData.name}`),
      pushFileToGithub(`config/prompts.yaml`, promptsYaml, `Update prompts for ${formData.name}`)
    ])
    
    setSaving(false)
    setDone(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-8 space-y-4 bg-zinc-900 text-white">
          <ShieldCheck size={32} className="text-blue-500" />
          <h2 className="text-xl font-bold font-display tracking-tight">Protocolo de Vida v3</h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">Inyectar inteligencia autónoma requiere precisión. Sigue el flujo nuclear para garantizar la estabilidad del núcleo.</p>
          <div className="space-y-4 pt-4 border-t border-zinc-800">
             <StepLabel active={step === 1} number={1} label="Identidad Nuclear" />
             <StepLabel active={step === 2} number={2} label="Configuración de Motor" />
             <StepLabel active={step === 3} number={3} label="Inyección de Conocimiento" />
             <StepLabel active={step === 4} number={4} label="Activación WhatsApp" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 glass-card p-10 bg-white min-h-[450px] flex flex-col justify-between">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Nombre del Agente / Negocio</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sales Architect Prime" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Tipo de Entidad</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" >
                    <option value="restaurante">Restaurante / Cafetería</option>
                    <option value="clinica">Clínica / Salud</option>
                    <option value="tienda">E-commerce / Tienda</option>
                    <option value="saas">SaaS / Tecnología</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-2 text-center py-10">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 ring-4 ring-blue-50">
                    <Cpu size={32} />
                  </div>
                  <h3 className="text-lg font-bold">Motor Gemini 1.5 Pro Detectado</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">Tu agente usará el núcleo de procesamiento más avanzado disponible en la Architect Build.</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Prompt de Comportamiento (Personality)</label>
                  <textarea 
                    rows={6} 
                    value={formData.prompt} 
                    onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-[12px]" 
                  />
                  <p className="text-[10px] text-zinc-400 italic">Define pautas claras: tono, prohibiciones y objetivos del agente.</p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">WhatsApp Access Token</label>
                    <input type="password" value={formData.wa_token} onChange={(e) => setFormData({...formData, wa_token: e.target.value})} placeholder="waba_v1_****************" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Phone ID / Number</label>
                    <input type="text" value={formData.wa_phone} onChange={(e) => setFormData({...formData, wa_phone: e.target.value})} placeholder="+34 600 000 000" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                </div>
              </motion.div>
            )}
            
            {done && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">Agente Sincronizado con Éxito</h3>
                    <p className="text-sm text-zinc-500 max-w-xs uppercase tracking-tight font-black">Tu agente ya vive en la nube y está en proceso de despliegue GitHub.</p>
                  </div>
                  <button onClick={() => { setStep(1); setDone(false); }} className="text-xs font-bold text-blue-600 hover:underline pt-4">Ir al Monitor de Despliegues</button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!done && (
          <div className="pt-6 border-t border-zinc-100 flex justify-end items-center gap-4">
            <button 
              onClick={handleContinue}
              disabled={saving}
              className="nuclear-button !px-10 !py-4 text-sm group disabled:opacity-50 !bg-zinc-900 shadow-xl shadow-zinc-900/20"
            >
              {saving ? "Sincronizando..." : step === 4 ? "Activar en la Nube" : "Continuar"} 
              {!saving && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-2" />}
            </button>
          </div>
        )}
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
