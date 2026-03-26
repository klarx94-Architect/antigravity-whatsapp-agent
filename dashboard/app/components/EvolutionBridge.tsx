"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react'

export function EvolutionBridge({ instanceName, onConnected }: { instanceName: string, onConnected: () => void }) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'qr' | 'connected' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const fetchQR = async () => {
    try {
      setStatus('loading')
      const ENGINE_URL = 'https://evolution-motor-vora-production.up.railway.app'
      
      // 1. Crear instancia
      const createRes = await fetch(`${ENGINE_URL}/api/evolution/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: instanceName })
      })
      
      // 2. Obtener QR
      const qrRes = await fetch(`${ENGINE_URL}/api/evolution/qr/${instanceName}`)
      const data = await qrRes.json()
      
      if (data.code || data.base64) {
        setQrCode(data.base64 || data.code)
        setStatus('qr')
      } else if (data.status === 'CONNECTED') {
        setStatus('connected')
        onConnected()
      }
    } catch (e) {
      setError('Error al conectar con el Nodo Evolution')
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchQR()
    const ENGINE_URL = 'https://evolution-motor-vora-production.up.railway.app'
    const interval = setInterval(async () => {
      if (status === 'qr') {
        const res = await fetch(`${ENGINE_URL}/api/evolution/instances`)
        const instances = await res.json()
        const current = instances.find((i: any) => i.instanceName === instanceName)
        if (current?.status === 'open') {
          setStatus('connected')
          onConnected()
          clearInterval(interval)
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceName, status])

  return (
    <div className="glass-card p-10 bg-white border-none shadow-2xl space-y-8 text-center max-w-md mx-auto">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Vincular Inteligencia Nuclear</h3>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Motor Evolution API v2 (Gratis)</p>
      </div>

      <div className="relative aspect-square w-64 mx-auto bg-zinc-50 rounded-[40px] border border-zinc-100 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <RefreshCw className="w-10 h-10 text-zinc-300 animate-spin" />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Generando Nodo...</p>
            </motion.div>
          )}

          {status === 'qr' && qrCode && (
            <motion.div 
              key="qr"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-white rounded-3xl"
            >
              <img src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} alt="QR Code" className="w-full h-full" />
            </motion.div>
          )}

          {status === 'connected' && (
            <motion.div 
              key="connected"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="text-white w-8 h-8" />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nodo Vinculado</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              key="error"
              className="flex flex-col items-center gap-4 p-8"
            >
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="text-[10px] font-bold text-red-500 uppercase leading-relaxed">{error}</p>
              <button onClick={fetchQR} className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase">Reintentar</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 text-left space-y-3">
        <div className="flex items-center gap-3 text-emerald-400">
          <Zap size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Instrucciones de Inyección</span>
        </div>
        <ol className="text-[11px] text-zinc-400 space-y-2 list-decimal list-inside font-medium border-t border-white/5 pt-3">
          <li>Abre WhatsApp en tu dispositivo móvil.</li>
          <li>Menú {">"} Dispositivos Vinculados {">"} Vincular un dispositivo.</li>
          <li>Escanea el código QR superior para activar el agente.</li>
        </ol>
      </div>
    </div>
  )
}
