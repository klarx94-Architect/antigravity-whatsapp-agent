"use client"

import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Rocket, 
  Zap, 
  Menu,
  ChevronLeft,
  Settings, 
  Info,
  Shield,
  Cpu,
  Layers,
  Search,
  Bell
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

  return (
    <div className="flex h-screen bg-[#FCFCFC] text-[#09090B] font-sans">
        {/* Minimal Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isCollapsed ? 80 : 280 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-white border-r border-zinc-200 flex flex-col relative z-20 overflow-hidden"
        >
          {/* Header / Logo */}
          <div className="h-16 flex items-center px-6 justify-between border-b border-zinc-100">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="text-blue-600 w-5 h-5 fill-current" />
                  <span className="font-display font-bold text-sm tracking-tight">Architect Build</span>
                </motion.div>
              )}
              {isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex justify-center"
                >
                  <Zap className="text-blue-600 w-5 h-5 fill-current" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 py-6 px-4 space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeView === 'dashboard'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('dashboard' as any)}
            />
            <NavItem 
              icon={<Rocket size={18} />} 
              label="Agent Builder" 
              active={activeView === 'builder'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('builder' as any)}
            />
            <NavItem 
              icon={<Layers size={18} />} 
              label="Deployments" 
              active={activeView === 'deployments'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('deployments' as any)}
            />
            
            <div className="pt-4 pb-2 px-3">
               {!isCollapsed && <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Workspace</span>}
               {isCollapsed && <div className="h-px bg-zinc-100 my-2" />}
            </div>
            
            <NavItem 
              icon={<Cpu size={18} />} 
              label="Infrastructure" 
              active={activeView === 'infrastructure'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('infrastructure' as any)}
            />
            <NavItem 
              icon={<Shield size={18} />} 
              label="Security" 
              active={activeView === 'security'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('security' as any)}
            />
          </div>

          <div className="p-4 border-t border-zinc-100 space-y-1">
            <NavItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={activeView === 'settings'} 
              collapsed={isCollapsed} 
              onClick={() => setActiveView('settings' as any)}
            />
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
            >
              {isCollapsed ? <Menu size={18} className="mx-auto" /> : <ChevronLeft size={18} />}
              {!isCollapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
            </button>
          </div>
        </motion.aside>

        <div className="flex-1 flex flex-col min-w-0 bg-[#FCFCFC]">
          {/* Top Bar */}
          <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search agents, deployments..." 
                  className="w-full pl-10 pr-4 py-1.5 bg-zinc-100 border-none rounded-lg text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg relative">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
               </button>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white shadow-sm cursor-pointer" />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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
