import { useState, useMemo } from 'react'
import { CF_FLUIDS } from '../data/fluids'

type Cat = 'all' | 'kristaloid' | 'hipertonik' | 'dextrose' | 'maintenance' | 'amino' | 'koloid' | 'elektrolit' | 'osmotik'

const CATS: { id: Cat; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'kristaloid', label: 'Kristaloid' },
  { id: 'hipertonik', label: 'Hipertonik' },
  { id: 'dextrose', label: 'Dextrose' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'amino', label: 'Amino / Nutrisi' },
  { id: 'koloid', label: 'Koloid' },
  { id: 'elektrolit', label: 'Elektrolit' },
  { id: 'osmotik', label: 'Osmotik' },
]

const CAT_COLOR: Record<string, string> = {
  kristaloid: 'bg-blue-100 text-blue-700',
  hipertonik: 'bg-red-100 text-red-700',
  dextrose: 'bg-yellow-100 text-yellow-700',
  maintenance: 'bg-green-100 text-green-700',
  amino: 'bg-purple-100 text-purple-700',
  koloid: 'bg-pink-100 text-pink-700',
  elektrolit: 'bg-orange-100 text-orange-700',
  osmotik: 'bg-slate-100 text-slate-700',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type FluidRaw = any

function FluidModal({ fluid, onClose }: { fluid: FluidRaw; onClose: () => void }) {
  const [tab, setTab] = useState<'komposisi' | 'indikasi' | 'peringatan' | 'populasi'>('komposisi')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{fluid.name}</h2>
              {fluid.alias && <p className="text-xs text-slate-400 mt-0.5">{fluid.alias}</p>}
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${CAT_COLOR[fluid.cat] ?? 'bg-slate-100 text-slate-600'}`}>{fluid.cat}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">{fluid.osm}</span>
                {fluid.badge && <span className="px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700">{fluid.badge}</span>}
                {fluid.deprecated && <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">⛔ Deprecated</span>}
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl p-1">✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-2 border-b border-slate-200 overflow-x-auto">
          {(['komposisi', 'indikasi', 'peringatan', 'populasi'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${tab === t ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3 text-sm">
          {tab === 'komposisi' && (
            <table className="w-full border-collapse text-sm">
              <tbody className="divide-y divide-slate-100">
                {fluid.comp?.map((c: any, i: number) => (
                  <tr key={i}>
                    <td className="py-1.5 pr-4 text-slate-500 font-medium w-1/3">{c.l}</td>
                    <td className="py-1.5 text-slate-800 font-mono">{c.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'indikasi' && (
            <ul className="space-y-2">
              {fluid.ind?.map((item: any, i: number) => (
                <li key={i} className="flex gap-2 text-slate-700">
                  <span className="shrink-0">{item.i}</span>
                  <span>{item.t}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === 'peringatan' && (
            <div className="space-y-3">
              <ul className="space-y-2">
                {fluid.warn?.map((item: any, i: number) => (
                  <li key={i} className={`flex gap-2 p-2 rounded-lg ${item.i?.includes('⚠') ? 'bg-amber-50 text-amber-800' : item.i?.includes('🔴') ? 'bg-red-50 text-red-800' : 'bg-teal-50 text-teal-800'}`}>
                    <span className="shrink-0">{item.i}</span>
                    <span className="text-sm">{item.t}</span>
                  </li>
                ))}
              </ul>
              {fluid.tips && fluid.tips.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-2">💡 Tips Klinis</p>
                  <ul className="space-y-1">
                    {fluid.tips.map((tip: string, i: number) => (
                      <li key={i} className="text-slate-600 text-sm">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === 'populasi' && (
            <div className="space-y-3">
              {fluid.pop?.map((p: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-700 text-sm mb-1">{p.g}</p>
                  <p className="text-slate-600 text-sm">{p.n}</p>
                </div>
              ))}
              {(!fluid.pop || fluid.pop.length === 0) && (
                <p className="text-slate-400 text-sm">Tidak ada data populasi khusus.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FluidCard({ fluid, onClick }: { fluid: FluidRaw; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md bg-white ${fluid.deprecated ? 'border-red-200 opacity-70' : 'border-slate-200 hover:border-teal-300'}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{fluid.name}</h3>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${CAT_COLOR[fluid.cat] ?? 'bg-slate-100 text-slate-600'}`}>{fluid.badge ?? fluid.cat}</span>
      </div>
      {fluid.alias && <p className="text-xs text-slate-400 mb-2 truncate">{fluid.alias}</p>}
      <p className="text-xs font-mono text-teal-700">{fluid.osm}</p>
      {fluid.deprecated && <p className="text-xs text-red-600 mt-1">⛔ Tidak direkomendasikan</p>}
    </button>
  )
}

export function CairanIV() {
  const [cat, setCat] = useState<Cat>('all')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<FluidRaw | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (CF_FLUIDS as FluidRaw[]).filter(f => {
      if (cat !== 'all' && f.cat !== cat) return false
      if (q) {
        const hay = [f.name, f.alias ?? '', f.osm ?? '', f.cat].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [cat, search])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Cairan IV</h1>
        <p className="text-sm text-slate-500 mt-1">{(CF_FLUIDS as FluidRaw[]).length} cairan · Kristaloid · Koloid · Elektrolit · Nutrisi Parenteral</p>
      </div>

      {/* Search & filter */}
      <div className="space-y-3">
        <div className="relative">
          <input type="text" className="input w-full pl-9" placeholder="Cari nama cairan..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${cat === c.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">Menampilkan {filtered.length} cairan</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((f: FluidRaw) => (
          <FluidCard key={f.id} fluid={f} onClick={() => setOpen(f)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-2">💧</p>
          <p>Tidak ada cairan ditemukan.</p>
        </div>
      )}

      {open && <FluidModal fluid={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
