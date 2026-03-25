"use client"

import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Rocket, 
  Layers,
  Zap, 
  Menu,
  ChevronLeft,
  Settings, 
  Info,
  Shield,
  Cpu,
  Search,
  Bell,
  User,
  LogOut,
  Mail,
  Briefcase
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

import { ViewProvider, useView } from './context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
       <body className="antialiased overflow-hidden">
          <ViewProvider>
             <DashboardShell>{children}</DashboardShell>
          </ViewProvider>
       </body>
    </html>
  )
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { activeView, setActiveView } = useView()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    { id: 1, title: 'Estación de Control Alpha Activa', time: 'Ahora', type: 'success' }
  ])

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-[#09090B] font-sans">
        {/* Minimal Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isCollapsed ? 80 : 280 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-white border-r border-zinc-100 flex flex-col relative z-20 overflow-hidden"
        >
          {/* Header / Logo */}
          <div className="h-20 flex items-center px-6 justify-between border-b border-zinc-50 bg-zinc-50/30">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3"
                >
                   <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center shadow-xl shadow-zinc-900/10">
                      <Zap className="text-white w-5 h-5 fill-current" />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-display font-black text-[13px] tracking-tight leading-none uppercase">Architect</span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Industrial Unit</span>
                   </div>
                </motion.div>
              )}
              {isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex justify-center"
                >
                   <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                      <Zap className="text-white w-5 h-5 fill-current" />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 py-10 px-4 space-y-1">
             <div className="px-3 mb-4">
                {!isCollapsed && <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">SaaS Factory</span>}
                {isCollapsed && <div className="h-px bg-zinc-100 my-4" />}
             </div>

            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Operaciones" 
              active={activeView === 'dashboard'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('dashboard' as any)}
            />
            <NavItem 
              icon={<Rocket size={18} />} 
              label="Constructor" 
              active={activeView === 'builder'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('builder' as any)}
            />
            <NavItem 
              icon={<Layers size={18} />} 
              label="Despliegues" 
              active={activeView === 'deployments'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('deployments' as any)}
            />
            
            <div className="pt-8 pb-4 px-3">
               {!isCollapsed && <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Seguridad</span>}
               {isCollapsed && <div className="h-px bg-zinc-100 my-4" />}
            </div>
            
            <NavItem 
              icon={<Cpu size={18} />} 
              label="Infraestructura" 
              active={activeView === 'infrastructure'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('infrastructure' as any)}
            />
            <NavItem 
              icon={<Shield size={18} />} 
              label="Seguridad Hub" 
              active={activeView === 'security'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('security' as any)}
            />
          </div>

          <div className="p-6 border-t border-zinc-100 space-y-2">
            <NavItem 
              icon={<Settings size={18} />} 
              label="Configuración" 
              active={activeView === 'settings'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('settings' as any)}
            />
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:bg-zinc-50 transition-all group"
            >
              {isCollapsed ? <Menu size={18} className="mx-auto" /> : <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />}
              {!isCollapsed && <span className="text-[11px] font-bold uppercase tracking-wider">Colapsar Nodo</span>}
            </button>
          </div>
        </motion.aside>

        <div className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
          {/* GLOBAL SAAS TOP BAR v3.6 */}
          <header className="h-20 border-b border-zinc-100 bg-white/60 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-30">
            <div className="flex items-center gap-6">
               <div className="h-10 w-[1px] bg-zinc-200 hidden sm:block" />
               <p className="text-[11px] font-black uppercase text-zinc-400 tracking-widest leading-none">
                 Estación: <span className="text-zinc-900">Alpha-One</span>
               </p>
            </div>

            <div className="flex items-center gap-6">
               {/* Centro de Notificaciones */}
               <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                  <div className={`p-2.5 hover:bg-zinc-100 rounded-xl transition-all relative ${showNotifications ? 'bg-zinc-100' : ''}`}>
                     <Bell size={20} className={showNotifications ? 'text-blue-600' : 'text-zinc-400'} />
                     <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
                  </div>
                  
                  <AnimatePresence>
                     {showNotifications && (
                        <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white border border-zinc-100 rounded-[32px] shadow-2xl p-6 space-y-4 z-50 origin-top-right ring-1 ring-zinc-900/5"
                        >
                           <div className="flex justify-between items-center border-b border-zinc-50 pb-3">
                              <h3 className="text-[10px] font-black uppercase text-zinc-900 tracking-widest">Alertas AI</h3>
                              <span className="text-[10px] text-blue-600 font-bold hover:underline">Limpiar</span>
                           </div>
                           <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                              {notifications.map(n => (
                                 <div key={n.id} className="flex gap-4 items-start group">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500`} />
                                    <div className="space-y-0.5">
                                       <p className="text-[11px] font-bold text-zinc-900 leading-tight">{n.title}</p>
                                       <p className="text-[10px] text-zinc-400 font-medium">{n.time}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <div className="h-8 w-[1px] bg-zinc-100" />

               {/* Acceso a Perfil */}
               <button 
                  onClick={() => setActiveView('profile' as any)}
                  className={`flex items-center gap-4 group pl-4 pr-1 py-1 rounded-2xl transition-all ${activeView === 'profile' ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
               >
                  <div className="text-right hidden sm:block">
                     <p className="text-[11px] font-black uppercase text-zinc-900 tracking-tighter leading-none">Architect Senior</p>
                     <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Nivel: Elite</p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white ring-2 ring-white shadow-xl shadow-zinc-900/10 group-hover:scale-105 transition-transform overflow-hidden relative">
                     <div className="absolute inset-0 bg-blue-600 opacity-20" />
                     <span className="relative text-[10px] font-black">SA</span>
                  </div>
               </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="max-w-7xl mx-auto h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
    </div>
  )
}

function NavItem({ icon, label, active = false, collapsed = false, onClick }: { icon: any, label: string, active?: boolean, collapsed?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`
      sidebar-item cursor-pointer transition-all duration-200
      ${active ? 'sidebar-item-active !bg-zinc-900 !text-white' : 'hover:bg-zinc-100'}
      ${collapsed ? 'justify-center px-0' : ''}
    `}>
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="truncate font-bold tracking-tight text-[13px]"
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
