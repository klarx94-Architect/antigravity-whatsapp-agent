"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle2, ArrowRight, Activity, Plus, Download } from 'lucide-react'
import { generateAgentProposal } from '../api'
import { pushFileToGithub } from '../github'
import { saveAgent, generateApiKey } from '../supabase'
import { EvolutionBridge } from './EvolutionBridge'

export function AgentCreator() {
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
    
    const newAgent = await saveAgent({
      name: interview.name,
      company: interview.company,
      website_url: interview.web,
      system_prompt: res.systemPrompt,
      connection_type: interview.connection,
      status: 'active'
    });

    if (newAgent) {
      await generateApiKey(newAgent.id);
    }

    setIsGenerating(false)
    nextStep()
  }

  const handleDeploy = async () => {
    const filename = `agents/${interview.name.toLowerCase().replace(/\s+/g, '_')}.yaml`
    await pushFileToGithub(filename, proposal.yaml, `Inyectando nuevo Agente Autónomo: ${interview.name}`)
    setShowDossier(true)
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
              <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 size={40} />
               </div>
               <h2 className="text-2xl font-black text-zinc-900">¡Agente Creado y Persistido!</h2>
               <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold">Dossier de Instalación para {interview.name}</p>

               <div className="flex gap-4 justify-center">
                  <button onClick={() => window.location.reload()} className="px-8 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Finalizar Protocolo</button>
                  <button onClick={() => window.print()} className="nuclear-button !bg-zinc-900 flex items-center gap-3">
                     <Download size={18} /> Descargar Dossier PDF
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

function ConnectionCard({ label, desc, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${active ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10' : 'border-zinc-100 bg-zinc-50 hover:bg-zinc-100'}`}>
       <h4 className={`text-sm font-bold mb-1 ${active ? 'text-blue-700' : 'text-zinc-900'}`}>{label}</h4>
       <p className="text-[10px] text-zinc-400 font-medium leading-tight">{desc}</p>
    </div>
  )
}
