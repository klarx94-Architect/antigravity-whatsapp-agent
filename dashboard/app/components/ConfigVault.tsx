"use client"

import React from 'react'
import { FileCode, Database, Copy, Download } from 'lucide-react'

export function ConfigVault({ files = [] }: { files: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-zinc-900">Archivos del Ecosistema</h2>
        <button className="text-xs font-bold text-blue-600 hover:underline">Download All (.zip)</button>
      </div>

      <div className="glass-card bg-white overflow-hidden divide-y divide-zinc-100">
        {files.length === 0 ? (
          <div className="p-10 text-center space-y-2">
             <FileCode size={32} className="text-zinc-200 mx-auto" />
             <p className="text-xs text-zinc-400 font-medium">Bóveda vacía. Inicia el protocolo para generar archivos.</p>
          </div>
        ) : (
          files.map((file: any, idx: number) => (
            <FileRow key={idx} name={file.name} type={file.name.split('.').pop()?.toUpperCase() || "FILE"} size={file.size} date={file.date} />
          ))
        )}
      </div>

      <div className="p-8 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
         <Database size={32} className="text-zinc-300" />
         <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">Inyectar conocimiento externo</h3>
            <p className="text-xs text-zinc-400 font-medium">Arrastra tus archivos de entrenamiento (.txt, .pdf) para RAG.</p>
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
