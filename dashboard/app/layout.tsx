import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import { LayoutDashboard, Rocket, Zap, Sliders, ChevronRight } from 'lucide-react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar Robótico */}
        <aside className="w-64 bg-white border-r border-metallic-100 flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-robotic-900 rounded-lg flex items-center justify-center">
              <Zap className="text-glow-blue w-5 h-5 fill-current" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">ROBOFACTORY</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Estado de Fábrica" active />
            <NavItem icon={<Rocket size={20} />} label="Línea de Producción" />
            <NavItem icon={<Zap size={20} />} label="Agentes Activos" />
            <NavItem icon={<Sliders size={20} />} label="Configuración" />
          </nav>

          <div className="p-6 border-t border-metallic-100">
            <div className="bg-metallic-50 p-4 rounded-xl border border-metallic-100">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Soporte Nuclear</p>
              <button className="text-sm font-semibold text-robotic-900 flex items-center gap-1 group">
                Contactar Arquitecto
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </body>
    </html>
  )
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all font-medium
      ${active ? 'bg-metallic-50 text-robotic-900' : 'text-slate-500 hover:text-robotic-900 hover:bg-metallic-50/50'}
    `}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  )
}
