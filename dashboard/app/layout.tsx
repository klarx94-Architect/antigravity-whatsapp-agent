"use client"

import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Rocket, 
  Zap, 
  Sliders, 
  ChevronRight, 
  Settings, 
  Info,
  Shield,
  Cpu,
  Layers
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex h-screen bg-[#F8F9FA] text-[#0F172A] antialiased overflow-hidden font-sans">
        
        {/* Cinematic Backdrop Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Sidebar Senior Nuclear */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-80 h-[96vh] m-[2vh] glass-card flex flex-col relative z-20 border-white/40 shadow-nuclear overflow-hidden"
        >
          {/* Logo Section */}
          <div className="p-10 flex flex-col gap-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-nuclear relative overflow-hidden transition-transform duration-500 group-hover:scale-110">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                 <Zap className="text-white w-6 h-6 fill-current relative z-10" />
              </div>
              <div className="flex flex-col">
                  <h2 className="font-display font-black text-2xl tracking-tighter leading-tight">
                    ROBO<span className="text-accent">FACTORY</span>
                  </h2>
                  <span className="premium-label opacity-60">Industrial Hub v2.5</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Panel Central" active />
            <NavItem icon={<Rocket size={20} />} label="Línea de Agentes" />
            <NavItem icon={<Layers size={20} />} label="Arquitectura IA" />
            <NavItem icon={<Cpu size={20} />} label="Procesamiento" />
            <NavItem icon={<Shield size={20} />} label="Seguridad Nuclear" />
          </nav>

          {/* User / Status Section */}
          <div className="p-8 border-t border-white/10 space-y-6">
            <div className="bg-primary/95 p-6 rounded-[2rem] shadow-nuclear relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full translate-x-16 translate-y-[-16px] blur-2xl group-hover:scale-150 transition-transform duration-1000" />
               <p className="text-[9px] text-accent font-black uppercase tracking-[0.3em] mb-2 opacity-80">System Status</p>
               <h4 className="text-white font-display font-bold text-sm leading-tight italic">Protocolo Maestro Activo</h4>
               <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                      <span className="text-[10px] text-white/60 font-medium tracking-widest uppercase">Safe Mode</span>
                  </div>
                  <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
            
            <div className="flex items-center justify-between px-2">
                <div className="flex gap-4">
                  <Info size={16} className="text-slate-400 hover:text-primary transition-colors cursor-pointer" />
                  <Settings size={16} className="text-slate-400 hover:text-primary transition-colors cursor-pointer" />
                </div>
                <span className="text-[10px] font-bold text-slate-300">© 2026 ANTIGRAVITY</span>
            </div>
          </div>
        </motion.aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 py-[2vh] pr-[2vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full glass-card border-white/40 shadow-premium overflow-y-auto no-scrollbar"
          >
            {children}
          </motion.div>
        </main>
      </body>
    </html>
  )
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-5 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.15em] relative group
      ${active 
        ? 'bg-primary text-white shadow-nuclear translate-x-2' 
        : 'text-slate-400 hover:text-primary hover:bg-white/50 translate-x-0'}
    `}>
      <span className={`${active ? 'text-accent' : 'group-hover:text-primary'} transition-colors duration-500`}>
        {icon}
      </span>
      <span>{label}</span>
      {active && (
        <motion.div 
          layoutId="activeNav"
          className="absolute left-0 w-1 h-6 bg-accent rounded-full" 
        />
      )}
    </div>
  )
}
