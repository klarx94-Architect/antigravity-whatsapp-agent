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
  Lock,
  Bell,
  User,
  LogOut,
  Mail,
  Briefcase
} from 'lucide-react'
import { 
  getApiStatus, 
  getVaultFiles, 
  saveConfig, 
  sendChatMessage, 
  generateAgentProposal 
} from './api'
import { pushFileToGithub, getGithubWorkflows } from './github'

import { ViewProvider, useView, useSettings } from './context'
import { EvolutionBridge } from './components/EvolutionBridge'

export default function HomePage() {
  const { activeView } = useView()
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [vaultFiles, setVaultFiles] = useState<any[]>([])
  const [githubRuns, setGithubRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
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
      } catch (e) { 
        console.error("Error en sincronización de nodo:", e)
      } finally {
        setLoading(false)
      }
    }
    init()
    const interval = setInterval(init, 30000) // Sincronización más relajada para evitar lag
    return () => clearInterval(interval)
  }, [])

  if (isAuthorized === null) return (
     <div className="h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Booting Architect Build...</p>
     </div>
  )
  
  if (!isAuthorized) {
    return <LoginShield onAuthorize={() => setIsAuthorized(true)} />
  }

  // No bloqueamos con pantalla completa de carga si ya estamos autorizados.
  // Solo mostramos el selector de pestañas.
  return <ViewSelector status={systemStatus} githubRuns={githubRuns} vaultFiles={vaultFiles} />
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

function ViewSelector({ status, githubRuns, vaultFiles }: any) {
  const { activeView, setActiveView } = useView()
  
  switch (activeView) {
    case 'dashboard': return <DashboardView status={status} vaultFiles={vaultFiles} />
    case 'builder': return <AgentCreator />
    case 'vault': return <ConfigVault files={vaultFiles} />
    case 'deployments': return <DeploymentsView runs={githubRuns} />
    case 'infrastructure': return <InfrastructureView status={status} />
    case 'security': return <SecurityView />
    case 'profile': return <ProfileView vaultFiles={vaultFiles} />
    case 'settings': return <SettingsModal isOpen={true} onClose={() => setActiveView('dashboard')} />
    default: return <DashboardView status={status} vaultFiles={vaultFiles} />
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
            help="El 'Cerebro' de tus agentes. Proporciona la capacidad de razonamiento de lenguaje."
          />
          <SecretInput 
            label="Evolution API URL" 
            value="http://localhost:8080" 
            help="Punto de enlace con tu Nodo Evolution (Docker/VPS)."
          />
          <SecretInput 
            label="Evolution API Key" 
            value="********************************" 
            help="Clave maestra de administración de tu Nodo Evolution."
          />
        </div>

        <div className="glass-card bg-zinc-900 text-white p-8 space-y-8 border-none ring-1 ring-white/10 shadow-2xl">
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

function DashboardView({ status, vaultFiles = [] }: any) {
  const { setActiveView } = useView()
  const isOnline = status?.status === 'online'
  const agents = vaultFiles.filter((f: any) => f.name.endsWith('.yaml'))
  const agentCount = agents.length
  const { developerMode } = useSettings()
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString())
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Developer Console Overlay */}
      <AnimatePresence>
        {developerMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 right-10 w-96 bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl z-50 font-mono text-[10px]"
          >
             <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="text-blue-400 font-black">LOGS DE SISTEMA (DEV_MODE)</span>
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
             </div>
             <div className="space-y-2 text-zinc-400">
                <p><span className="text-zinc-600">[{currentTime}]</span> API_STATUS: {isOnline ? 'ONLINE' : 'OFFLINE'}</p>
                <p><span className="text-zinc-600">[{currentTime}]</span> VAULT_SYNC: {agentCount} AGENTS_LOADED</p>
                <p><span className="text-zinc-600">[{currentTime}]</span> SESSION: VALIDATED_ARCHITECT</p>
                <p className="text-emerald-500 tracking-tighter animate-pulse">{">>>"} ESCUCHANDO EVENTOS DE META_HUB...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PowerStat label="Operaciones IA" value={agentCount > 0 ? (agentCount * 124).toString() : "0"} delta={agentCount > 0 ? "Real-time" : "---"} color="blue" icon={<Zap size={20} />} />
        <PowerStat label="Latencia Promedio" value={isOnline ? "342ms" : "---"} delta={isOnline ? "Stable" : "N/A"} color="emerald" icon={<Cpu size={20} />} />
        <PowerStat label="Agentes Desplegados" value={agentCount.toString()} delta={agentCount > 0 ? "Cloud Activo" : "Waiting"} color="blue" icon={<Layers size={20} />} />
        <PowerStat label="Estado de Red" value={isOnline ? "Online" : "Offline"} delta={isOnline ? "Secure" : "Check Local"} color="indigo" icon={<Database size={20} />} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Línea de Producción Aktiva</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
             <Activity size={12} className={isOnline ? "animate-pulse text-blue-500" : "text-zinc-300"} />
             FEED EN TIEMPO REAL
          </div>
        </div>

        {agentCount === 0 && (
          <div className="p-20 bg-white border border-dashed border-zinc-200 rounded-[48px] text-center space-y-8 shadow-sm">
             <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto border border-zinc-100 italic font-black text-zinc-300">
                0
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Fábrica en Reposo</h3>
                <p className="text-sm text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">
                   Aún no has inyectado vida en este nodo. Inicia el protocolo de creación para desplegar tu primer agente autónomo.
                </p>
             </div>
             <button 
               onClick={() => setActiveView('builder')}
               className="nuclear-button !bg-zinc-900 !px-10 py-5"
             >
                Iniciar Protocolo de Vida
             </button>
          </div>
        )}

        {agentCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {agents.map((agent: any, i: number) => (
              <AgentStatusCard 
                key={i}
                name={agent.name.replace('.yaml', '').replace(/_/g, ' ').toUpperCase()} 
                status="running" 
                type="Agente Autónomo" 
              />
            ))}
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

function ProfileView({ vaultFiles = [] }: { vaultFiles?: any[] }) {
  const agentCount = vaultFiles.filter((f: any) => f.name.endsWith('.yaml')).length
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

      <div className="grid grid-cols-3 gap-8">
         <div className="col-span-2 space-y-8">
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
            <div className="glass-card bg-zinc-900 text-white p-8 space-y-6 border-none shadow-2xl">
               <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Métricas de Usuario</h3>
               <div className="space-y-4 text-emerald-400">
                  <MetricSmall label="Agentes Creados" value={agentCount.toString()} color="blue" />
                  <MetricSmall label="Ventas Totales" value={agentCount > 0 ? "Activando..." : "$0.00"} color="emerald" />
                  <MetricSmall label="Uptime Mensual" value={agentCount > 0 ? "99.9%" : "---"} color="blue" />
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
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0">
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

function ConnectionCard({ label, desc, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${active ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10' : 'border-zinc-100 bg-zinc-50 hover:bg-zinc-100'}`}>
       <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl ${active ? 'bg-blue-600 text-white' : 'bg-white text-zinc-400 border border-zinc-100'}`}>
             <Zap size={16} />
          </div>
          {active && <CheckCircle2 size={16} className="text-blue-600" />}
       </div>
       <h4 className={`text-sm font-bold mb-1 ${active ? 'text-blue-700' : 'text-zinc-900'}`}>{label}</h4>
       <p className="text-[10px] text-zinc-400 font-medium leading-tight">{desc}</p>
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

function SettingsModal({ isOpen, onClose }: any) {
  const { salesNotifications, setSalesNotifications, developerMode, setDeveloperMode, autoCloudSync, setAutoCloudSync } = useSettings()

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

function AgentStatusCard({ name, status, type }: any) {
  const [currentStatus, setCurrentStatus] = useState(status)
  
  const handleToggle = () => {
    setCurrentStatus(currentStatus === 'running' ? 'paused' : 'running')
    console.log(`Estado del agente ${name} cambiado a: ${currentStatus === 'running' ? 'paused' : 'running'}`)
  }

  return (
    <div className="glass-card p-6 space-y-6 group hover:border-blue-200 transition-all">
       <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
             <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-zinc-900 tracking-tight">{name}</h3>
                <div className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
             </div>
             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{type}</p>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={handleToggle}
               className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900"
             >
                {currentStatus === 'running' ? <Pause size={14} /> : <Play size={14} />}
             </button>
             <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900">
                <Settings size={14} />
             </button>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Uptime</p>
             <p className="text-xs font-black text-zinc-900">{currentStatus === 'running' ? '99.9%' : '0%'}</p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Conversaciones</p>
             <p className="text-xs font-black text-zinc-900">1,240</p>
          </div>
       </div>

       <div className="flex gap-3">
          <button className="flex-1 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-zinc-800 transition-colors">
             Estadísticas
          </button>
          <button className="flex-1 py-3 border border-zinc-200 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-zinc-50 transition-colors">
             Logs
          </button>
       </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SECCIÓN: CONSTRUCTOR DE AGENTES (PROTOCOLO DE VIDA)                        */
/* -------------------------------------------------------------------------- */
function AgentCreator() {
  const [step, setStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [interview, setInterview] = useState({
    name: '',
    company: '',
    web: '',
    goals: '',
    tone: 'Profesional',
    connection: 'YCloud'
  })
  const [proposal, setProposal] = useState<any>(null)
  const [showDossier, setShowDossier] = useState(false)
  const [isEvolutionConnected, setIsEvolutionConnected] = useState(false)

  const nextStep = () => setStep(s => s + 1)
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    const res = await generateAgentProposal(interview)
    setProposal(res)
    setIsGenerating(false)
    nextStep()
  }

  const handleDeploy = async () => {
    const filename = `agents/${interview.name.toLowerCase().replace(/\s+/g, '_')}.yaml`
    await pushFileToGithub(filename, proposal.yaml, `Inyectando nuevo Agente Autónomo: ${interview.name}`)
    setShowDossier(true)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter sm:text-5xl">Arquitecto de Agentes</h1>
        <p className="text-zinc-400 font-medium uppercase tracking-widest text-xs">Fábrica de Inteligencia Autónoma</p>
      </div>

      <div className="glass-card bg-white p-1 pb-1 overflow-hidden">
        {!showDossier && step < 4 && (
          <div className="flex border-b border-zinc-100">
            <StepIndicator current={step} index={0} label="Identidad" />
            <StepIndicator current={step} index={1} label="Contexto" />
            <StepIndicator current={step} index={2} label="Misión" />
            <StepIndicator current={step} index={3} label="Conexión" />
          </div>
        )}

        <div className="p-10">
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Cimentación de Identidad</h2>
                <p className="text-sm text-zinc-400">¿Cómo se llamará el agente y para qué organización cobrará vida?</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nombre del Agente</label>
                  <input 
                    type="text" 
                    placeholder="ej. SalesMaster Alpha" 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={interview.name}
                    onChange={e => setInterview({...interview, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nombre de la Empresa</label>
                  <input 
                    type="text" 
                    placeholder="ej. Architect Corp" 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={interview.company}
                    onChange={e => setInterview({...interview, company: e.target.value})}
                  />
                </div>
              </div>
              <button onClick={nextStep} disabled={!interview.name} className="nuclear-button w-full shadow-xl shadow-blue-500/20 disabled:opacity-50">Siguiente Fase</button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Contexto de Red</h2>
                <p className="text-sm text-zinc-400">Proporciona el sitio web o redes sociales para alimentar el cerebro del agente.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sitio Web / URL de Referencia</label>
                <div className="relative">
                   <input 
                    type="text" 
                    placeholder="https://su-empresa.com" 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold"
                    value={interview.web}
                    onChange={e => setInterview({...interview, web: e.target.value})}
                   />
                   <Plus size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Volver</button>
                <button onClick={nextStep} className="nuclear-button flex-1">Analizar Contexto</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Misión Nuclear</h2>
                <p className="text-sm text-zinc-400">¿Qué debe lograr exactamente este agente? (ej. Vender, Triaje, Soporte)</p>
              </div>
              <textarea 
                rows={4}
                placeholder="ej. El agente debe calificar clientes potenciales para servicios de arquitectura y agendar citas en Calendly."
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                value={interview.goals}
                onChange={e => setInterview({...interview, goals: e.target.value})}
              />
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Volver</button>
                <button onClick={nextStep} disabled={!interview.goals} className="nuclear-button flex-1 disabled:opacity-50">Definir Objetivos</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Protocolo de Conexión</h2>
                <p className="text-sm text-zinc-400">¿Cómo se comunicará el agente con el mundo exterior?</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <ConnectionCard 
                  label="Meta Cloud (YCloud)" 
                  desc="API Oficial. Coexistencia App móvil."
                  active={interview.connection === 'YCloud'}
                  onClick={() => setInterview({...interview, connection: 'YCloud'})}
                />
                <ConnectionCard 
                  label="Evolution API (QR)" 
                  desc="Motor Gratis (Zero-Cost). Vinculación instantánea."
                  active={interview.connection === 'Evolution'}
                  onClick={() => setInterview({...interview, connection: 'Evolution'})}
                />
                <ConnectionCard 
                  label="Whapi Legacy" 
                  desc="Protocolo QR alternativo."
                  active={interview.connection === 'Whapi'}
                  onClick={() => setInterview({...interview, connection: 'Whapi'})}
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-zinc-100">
                <button onClick={() => setStep(2)} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Volver</button>
                <button onClick={nextStep} className="nuclear-button flex-1">Siguiente Fase</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Personalidad & Tono</h2>
                <p className="text-sm text-zinc-400">Elige la frecuencia de comunicación para el agente.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ToneCard label="Profesional Elite" desc="Preciso, formal y ultra-eficiente." active={interview.tone === 'Profesional'} onClick={() => setInterview({...interview, tone: 'Profesional'})} />
                <ToneCard label="Empático & Amigable" desc="Cercano, cálido y resolutivo." active={interview.tone === 'Amigable'} onClick={() => setInterview({...interview, tone: 'Amigable'})} />
                <ToneCard label="Técnico Avanzado" desc="Lenguaje experto y detallado." active={interview.tone === 'Tecnico'} onClick={() => setInterview({...interview, tone: 'Tecnico'})} />
                <ToneCard label="Comercial Agresivo" desc="Enfocado en el cierre rápido." active={interview.tone === 'Vendedor'} onClick={() => setInterview({...interview, tone: 'Vendedor'})} />
              </div>
              <div className="flex gap-4 pt-4 border-t border-zinc-100">
                <button onClick={() => setStep(3)} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Ajustar Conexión</button>
                <button onClick={handleGenerate} className="nuclear-button flex-1 flex items-center justify-center gap-3">
                   {isGenerating ? <Activity className="animate-spin" size={18} /> : <Zap size={18} />}
                   {isGenerating ? "Ingeniería de Prompt en Curso..." : "Inyectar Inteligencia Nuclear"}
                </button>
              </div>
            </div>
          )}

          {step === 5 && proposal && !showDossier && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8">
               <div className="flex items-center gap-6 p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                     <CheckCircle2 size={32} className="text-blue-600" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-zinc-900">IA Generada Exitosamente</h2>
                     <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Protocolo de Vida v3.5 Listo</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Personalidad Nuclear ({interview.tone})</h3>
                     <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl min-h-[200px] text-sm text-zinc-600 italic leading-relaxed">
                        "{proposal.systemPrompt.substring(0, 300)}..."
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manifesto YAML (Cloud Data)</h3>
                     <pre className="p-6 bg-zinc-900 rounded-3xl text-[11px] text-emerald-400 font-mono overflow-x-auto border border-white/5 shadow-2xl">
                        {proposal.yaml}
                     </pre>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep(4)} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Ajustar Inteligencia</button>
                  
                  {interview.connection === 'Evolution' && !isEvolutionConnected ? (
                     <div className="flex-1">
                        <EvolutionBridge 
                           instanceName={interview.name.toLowerCase().replace(/\s+/g, '_')} 
                           onConnected={() => setIsEvolutionConnected(true)} 
                        />
                     </div>
                  ) : (
                     <button onClick={handleDeploy} className="nuclear-button flex-1 !bg-emerald-600 py-6 text-lg font-black group">
                        {isEvolutionConnected ? 'Activar Protocolo Evolution' : 'Realizar Despliegue Nuclear'}
                        <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
                     </button>
                  )}
               </div>
            </div>
          )}

          {showDossier && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                     <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900">¡Agente Creado y Persistido!</h2>
                  <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold">Dossier de Instalación para {interview.name}</p>
               </div>

               <div className="glass-card p-8 bg-zinc-50 border border-zinc-200 space-y-6">
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase text-zinc-900 tracking-widest border-b border-zinc-200 pb-2">Instrucciones de Activación ({interview.connection})</h3>
                     
                     {interview.connection === 'YCloud' ? (
                        <ul className="space-y-4 text-sm text-zinc-600 font-medium">
                           <li className="flex gap-3"><span className="text-blue-600 font-black">1.</span> Ve al panel de YCloud y obtén tu <code className="bg-zinc-200 px-1 rounded">Channel ID</code> y <code className="bg-zinc-200 px-1 rounded">API Key</code>.</li>
                           <li className="flex gap-3"><span className="text-blue-600 font-black">2.</span> Configura tu número en modo 'Coexistence' para no perder la App móvil.</li>
                           <li className="flex gap-3"><span className="text-blue-600 font-black">3.</span> Pega el Webhook de Architect Build en el portal de YCloud.</li>
                        </ul>
                     ) : (
                        <ul className="space-y-4 text-sm text-zinc-600 font-medium">
                           <li className="flex gap-3"><span className="text-blue-600 font-black">1.</span> Abre tu cuenta en Whapi.cloud.</li>
                           <li className="flex gap-3"><span className="text-blue-600 font-black">2.</span> Escanea el código QR desde el WhatsApp de tu cliente.</li>
                           <li className="flex gap-3"><span className="text-blue-600 font-black">3.</span> Cada agente que crees usará el mismo Token Maestro, pero un <code className="bg-zinc-200 px-1 rounded">Channel ID</code> distinto por cada número.</li>
                        </ul>
                     )}
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-zinc-100 space-y-4">
                     <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Credenciales del Agente</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[9px] font-bold text-zinc-400">ID ÚNICO</p>
                           <p className="text-xs font-mono font-bold text-zinc-900">{interview.name.toLowerCase().replace(/\s+/g, '-')}-44X</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-zinc-400">ESTADO INICIAL</p>
                           <p className="text-xs font-bold text-amber-600">Pending Installation</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => window.location.reload()} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Finalizar Protocolo</button>
                   <button 
                     onClick={handlePrint}
                     className="nuclear-button flex-1 !bg-zinc-900 flex items-center justify-center gap-3"
                   >
                      <Download size={18} /> Descargar Dossier PDF para el Cliente
                   </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ current, index, label }: any) {
  const active = current === index
  const past = current > index
  return (
    <div className={`flex-1 py-4 px-2 border-r last:border-r-0 border-zinc-100 flex items-center justify-center gap-3 transition-colors ${active ? 'bg-zinc-50' : ''}`}>
       <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border ${active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-200'} ${past ? '!bg-blue-600 !border-blue-600 !text-white' : ''}`}>
          {past ? <CheckCircle2 size={12} /> : index + 1}
       </div>
       <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>{label}</span>
    </div>
  )
}

function ToneCard({ label, desc, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${active ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10' : 'border-zinc-100 bg-zinc-50 hover:bg-zinc-100'}`}>
       <h4 className={`text-sm font-bold mb-1 ${active ? 'text-blue-700' : 'text-zinc-900'}`}>{label}</h4>
       <p className="text-[10px] text-zinc-400 font-medium leading-tight">{desc}</p>
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
/* VISTA: PANEL DE OPERACIONES (DASHBOARD)                                    */
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
