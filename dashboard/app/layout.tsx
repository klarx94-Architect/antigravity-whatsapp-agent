import './globals.css'
import { Inter, Outfit } from 'next/font/google'
import React from 'react'
import { ClientShell } from './ClientShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = {
  title: 'Architect Build | Industrial Automation Unit',
  description: 'Industrial-grade WhatsApp Agent SaaS Infrastructure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
       <body className="antialiased overflow-hidden">
          <ClientShell>
            {children}
          </ClientShell>
       </body>
    </html>
  )
}
