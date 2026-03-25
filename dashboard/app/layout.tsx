"use client"

import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import { LayoutDashboard, Rocket, Zap, Sliders, ChevronRight, Settings, Info } from 'lucide-react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex h-screen bg-white text-robotic-900 antialiased overflow-hidden font-sans">
        
        {/* Decorative background glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-glow-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Sidebar Robótico */}
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-metallic-100 flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="p-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-robotic-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3 group overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-50" />
               <Zap className="text-white w-6 h-6 fill-current relative z-10" />
            </div>
            <div>
                <h2 className="font-display font-black text-xl tracking-tighter leading-none">ROBO<span className="text-glow-blue underline decoration-2 underline-offset-4">FACTORY</span></h2>
                <span className="text-[8px] uppercase font-black tracking-[0.4em] text-slate-400">Industrial Division</span>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-2 mt-4">
            <NavItem icon={<LayoutDashboard size={18} />} label="Panel de Control" active />
            <NavItem icon={<Rocket size={18} />} label="Línea de Producción" />
            <NavItem icon={<Zap size={18} />} label="Gestión de IA" />
            <NavItem icon={<Sliders size={18} />} label="Configuración" />
          </nav>

          <div className="p-6 border-t border-metallic-100 space-y-4">
            <div className="bg-metallic-900 bg-slate-900 p-5 rounded-2xl shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-10 translate-y-[-10px] group-hover:scale-150 transition-transform duration-700" />
               <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Status: Operational</p>
               <h4 className="text-white font-display font-bold text-xs">Nucleus Protocol 2.5</h4>
               <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-blue-500" />
                      <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700" />
                  </div>
                  <ChevronRight size={14} className="text-slate-500" />
               </div>
            </div>
            
            <div className="flex items-center justify-between px-2 text-slate-400">
                <Info size={14} className="hover:text-robotic-900 cursor-pointer" />
                <Settings size={14} className="hover:text-robotic-900 cursor-pointer animate-spin-slow" />
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-10">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-metallic-50/50 to-transparent pointer-events-none" />
          {children}
        </main>
      </body>
    </html>
  )
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-bold text-xs uppercase tracking-widest
      ${active 
        ? 'bg-robotic-900 text-white shadow-lg shadow-blue-900/20 translate-x-1' 
        : 'text-slate-400 hover:text-robotic-900 hover:bg-metallic-50 translate-x-0'}
    `}>
      <span className={active ? 'text-glow-blue' : ''}>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
