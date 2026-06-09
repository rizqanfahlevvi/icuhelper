import { useState } from 'react'

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors">
        <span className="font-semibold text-slate-700 text-sm">{title}</span>
        <span className="text-slate-400 shrink-0 ml-2 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 py-4 space-y-3 bg-white text-sm">{children}</div>}
    </div>
  )
}

export function InfoBox({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const cls = color === 'red' ? 'bg-red-50 border-red-200 text-red-800'
    : color === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-800'
    : color === 'teal' ? 'bg-teal-50 border-teal-200 text-teal-800'
    : color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-800'
    : 'bg-blue-50 border-blue-200 text-blue-800'
  return <div className={`p-3 rounded-lg border ${cls} text-sm`}>{children}</div>
}

export function SectionTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-slate-100">
          <tr>{headers.map((h, i) => <th key={i} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {row.map((cell, j) => <td key={j} className="px-3 py-2 text-slate-700 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
