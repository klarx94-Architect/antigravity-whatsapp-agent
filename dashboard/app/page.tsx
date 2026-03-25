"use client"

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
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
  Layers,
  Settings,
  Lock
} from 'lucide-react'
import { getApiStatus, getVaultFiles, saveConfig } from './api'
import { getGithubWorkflows, pushFileToGithub } from './github'

import { useView } from './context'

export default function HomePage() {
  const { activeView } = useView()
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [vaultFiles, setVaultFiles] = useState<any[]>([])
  const [githubRuns, setGithubRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Auth Check
    const session = localStorage.getItem('ARCHITECT_SESSION')
    setIsAuthorized(session === 'true')

    async function init() {
      try {
        const [status, files, runs] = await Promise.all([
          getApiStatus(),
          getVaultFiles(),
          getGithubWorkflows()
        ])
        setSystemStatus(status)
        setVaultFiles(files)
        setGithubRuns(runs)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    init()
    const interval = setInterval(init, 15000)
    return () => clearInterval(interval)
  }, [])

  if (isAuthorized === null) return <div className="h-screen bg-white flex items-center justify-center font-black animate-pulse">BOOTING ARCHITECT BUILD...</div>
  
  if (!isAuthorized) {
    return <LoginShield onAuthorize={() => setIsAuthorized(true)} />
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Mini Header / Breadcrumb */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
          <span>Architect Build</span>
          <ChevronRight size={10} />
          <span className="text-zinc-900 capitalize italic font-bold">{activeView}</span>
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
          
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">
            <Layers size={10} />
            GitHub Native Persistence
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {activeTabSelector(activeView, systemStatus, githubRuns, vaultFiles)}
        </motion.div>
      </AnimatePresence>

      <SettingsModal 
        isOpen={activeView === 'settings'} 
        onClose={() => {
          // Si el usuario cierra el modal, volvemos al dashboard
          // Nota: Esto asume que el cambio de estado se propaga al layout.
          // Para una mejor UX, dispararemos un evento custom o modificaremos el prop si es posible.
          window.dispatchEvent(new CustomEvent('architect-view-change', { detail: 'dashboard' }))
        }} 
      />
    </div>
  )
}

function LoginShield({ onAuthorize }: { onAuthorize: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === 'architect' && pass === 'build2026') {
      localStorage.setItem('ARCHITECT_SESSION', 'true')
      onAuthorize()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
             <Zap className="text-white fill-current" />
          </div>
          <div className="space-y-1">
             <h1 className="text-2xl font-bold font-display tracking-tight text-zinc-900">Architect Build v3.5</h1>
             <p className="text-xs text-zinc-400 uppercase tracking-widest font-black">Secure Administration Hub</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Identidad de Acceso</label>
              <input 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Manager ID"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Código Nuclear</label>
              <input 
                type="password" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full nuclear-button !py-5 !bg-zinc-900 !text-white text-sm tracking-tight shadow-xl shadow-zinc-900/20 group uppercase font-black"
          >
            Sincronizar Acceso 
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[11px] font-bold text-red-500 uppercase tracking-tight">Acceso Denegado. Credenciales Inválidas.</motion.p>
          )}
        </form>

        <p className="text-[10px] text-center text-zinc-400 font-medium">© 2026 Architect Build — Industrial Automation Unit</p>
      </div>
    </div>
  )
}

function activeTabSelector(view: string, status: any, githubRuns: any[], vaultFiles: any[]) {
  console.log("Switching to view:", view); // Debug navigation
  switch (view) {
    case 'dashboard': return <OperationsMonitor status={status} />
    case 'builder': return <AgentCreator />
    case 'vault': return <ConfigVault files={vaultFiles} />
    case 'deployments': return <DeploymentsView runs={githubRuns} />
    case 'infrastructure': return <InfrastructureView status={status} />
    case 'security': return <SecurityView />
    case 'settings': return null // Ahora es un modal
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
            help="El 'Cerebro' de tus agentes. Proporciona la capacidad de razonamiento y procesamiento de lenguaje."
          />
          <SecretInput 
            label="WhatsApp Token (Whapi.cloud)" 
            value="********************************" 
            help="Proveedor externo de WhatsApp. Nota: Este servicio tiene un coste recurrente por parte de Whapi."
          />
        </div>

        <div className="glass-card bg-zinc-900 text-white p-8 space-y-8 border-none ring-1 ring-white/10 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
             <Zap className="text-emerald-400" size={20} />
             <h3 className="text-sm font-bold">Meta Cloud Hub (Coste Cero)</h3>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Para desplegar agentes sin costes de suscripción, utiliza la API Oficial de Meta. Las primeras 1,000 conversaciones/mes son GRATUITAS para la empresa si son iniciadas por el usuario.
            </p>

            <div className="space-y-4">
               <GuideStep number={1} label="Registro Meta Developers" text="Crea una cuenta en developers.facebook.com y activa una APP de tipo 'Business'." />
               <GuideStep number={2} label="Configurar Webhook" text="Apunta el Webhook de Meta a la URL de tu despliegue de Architect Build." />
               <GuideStep number={3} label="Obtener Token Perpetuo" text="Genera un 'System User Token' con permisos 'whatsapp_business_messaging'." />
            </div>

            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
               Descargar Guía de Configuración Meta (PDF)
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

function OperationsMonitor({ status, vaultFiles = [] }: any) {
  const isOnline = status?.status === 'online'
  const agentCount = vaultFiles.filter((f: any) => f.name.endsWith('.yaml')).length

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Power Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PowerStat label="Operaciones IA Totales" value={agentCount > 0 ? "1,248" : "0"} delta={agentCount > 0 ? "+12%" : "N/A"} color="blue" icon={<Zap size={20} />} />
        <PowerStat label="Latencia Promedio" value={isOnline ? "342ms" : "---"} delta={isOnline ? "-15ms" : "N/A"} color="emerald" icon={<Cpu size={20} />} />
        <PowerStat label="Agentes Activos (Cloud)" value={agentCount.toString()} delta={agentCount > 0 ? "Stable" : "Idle"} color="blue" icon={<Layers size={20} />} />
        <PowerStat label="Valor Proyectado" value={agentCount > 0 ? "$480.00" : "$0.00"} delta="Estimado" color="indigo" icon={<Database size={20} />} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Línea de Producción Aktiva</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
             <Activity size={12} className={isOnline ? "animate-pulse text-blue-500" : "text-zinc-300"} />
             FEED EN TIEMPO REAL
          </div>
        </div>

        {!isOnline && (
          <div className="p-12 border-2 border-dashed border-zinc-200 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 bg-zinc-50/30 backdrop-blur-sm">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100">
                <AlertCircle size={32} className="text-zinc-300" />
             </div>
             <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">Núcleo de Inteligencia Local Offline</h3>
                <p className="text-xs text-zinc-400 font-medium max-w-sm leading-relaxed uppercase tracking-tighter">
                   El dashboard está operando en modo NUBE (GitHub), pero la ejecución del cerebro local requiere iniciar el comando:
                   <br/><code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block lowercase">cd agent && python main.py</code>
                </p>
             </div>
          </div>
        )}

        {isOnline && agentCount === 0 && (
          <div className="p-12 bg-zinc-50 rounded-[40px] border border-zinc-100 text-center space-y-4">
             <p className="text-sm text-zinc-400 font-medium italic">Esperando la inyección del primer agente nuclear...</p>
             <button onClick={() => window.dispatchEvent(new CustomEvent('architect-view-change', { detail: 'builder' }))} className="text-xs font-bold text-blue-600 hover:underline">Iniciar Protocolo de Vida</button>
          </div>
        )}

        {agentCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AgentStatusCard name="Sales Intelligence Alpha" status="running" type="Inbound Bot" />
            <AgentStatusCard name="Technical Support V2" status="running" type="L2 Triage" />
            <AgentStatusCard name="Marketing Automation" status="paused" type="Outbound Blast" />
          </div>
        )}
      </div>
    </div>
  )
}

function PowerStat({ label, value, delta, color, icon }: any) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100"
  }[color as 'blue'|'emerald'|'indigo']

  return (
    <div className="glass-card p-7 space-y-4 hover:border-blue-200 transition-colors group">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl border ${colors}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border ${colors}`}>
          {delta}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">{label}</p>
        <h4 className="text-2xl font-bold text-zinc-900 tracking-tighter font-display">{value}</h4>
      </div>
    </div>
  )
}

function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300">
       <motion.div 
         initial={{ scale: 0.9, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
       >
          <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                   <Settings className="text-white w-5 h-5" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-zinc-900 tracking-tight leading-none">Configuración Global del Sistema</h2>
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
                   <ToggleRow label="Sincronización en Tiempo Real" description="Actualizar archivos en GitHub instantáneamente al editar." active />
                   <ToggleRow label="Modo Debug Avanzado" description="Mostrar razonamiento RAW de la IA en el constructor." />
                   <ToggleRow label="Auto-Escalado de Infraestructura" description="Provisionar nodos según picos de tráfico." active />
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

function ToggleRow({ label, description, active = false }: any) {
  return (
    <div className="flex items-center justify-between py-2">
       <div>
          <h4 className="text-sm font-bold text-zinc-900">{label}</h4>
          <p className="text-[11px] text-zinc-400 font-medium">{description}</p>
       </div>
       <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-zinc-200'}`}>
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'right-1' : 'left-1'}`} />
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
