// MonitoringDashboard.tsx — Vital Signs Trend Dashboard
// Ported from assets/ts/monitoring-dashboard.ts

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Interfaces ────────────────────────────────────────────────────────────────

interface VitalEntry {
  id: string
  timestamp: number
  spo2?: number
  hr?: number
  rr?: number
  map?: number
  temp?: number
  pplat?: number
  peep?: number
  fio2?: number
  laktat?: number
  ph?: number
  note?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY_VITALS = 'icu-vital-entries'

const VITAL_RANGES = {
  spo2:   { min: 92,   max: 100,  label: 'SpO₂',   unit: '%' },
  hr:     { min: 50,   max: 120,  label: 'HR',      unit: 'bpm' },
  rr:     { min: 10,   max: 30,   label: 'RR',      unit: '/mnt' },
  map:    { min: 65,   max: 110,  label: 'MAP',     unit: 'mmHg' },
  temp:   { min: 36.0, max: 38.5, label: 'Temp',    unit: '°C' },
  pplat:  { min: 0,    max: 28,   label: 'Pplat',   unit: 'cmH₂O' },
  laktat: { min: 0,    max: 2,    label: 'Laktat',  unit: 'mmol/L' },
  ph:     { min: 7.35, max: 7.45, label: 'pH',      unit: '' },
} as const

type VitalRangeKey = keyof typeof VITAL_RANGES

const CHART_COLORS: Record<string, string> = {
  spo2:   '#3b82f6',
  hr:     '#ef4444',
  rr:     '#f59e0b',
  map:    '#8b5cf6',
  temp:   '#ec4899',
  pplat:  '#14b8a6',
  peep:   '#06b6d4',
  fio2:   '#84cc16',
  laktat: '#f97316',
  ph:     '#6366f1',
}

const ALL_DISPLAY_PARAMS: { key: keyof VitalEntry; label: string; unit: string; hasRange: boolean }[] = [
  ...( Object.keys(VITAL_RANGES) as VitalRangeKey[]).map(k => ({
    key: k as keyof VitalEntry,
    label: VITAL_RANGES[k].label,
    unit: VITAL_RANGES[k].unit,
    hasRange: true,
  })),
  { key: 'peep', label: 'PEEP', unit: 'cmH₂O', hasRange: false },
  { key: 'fio2', label: 'FiO₂', unit: '%',     hasRange: false },
]

const FORM_FIELDS: { key: keyof Omit<VitalEntry, 'id' | 'timestamp' | 'note'>; label: string; unit: string; step: string; min: string; max: string }[] = [
  { key: 'spo2',   label: 'SpO₂',   unit: '%',       step: '1',    min: '0',   max: '100' },
  { key: 'hr',     label: 'HR',     unit: 'bpm',     step: '1',    min: '0',   max: '300' },
  { key: 'rr',     label: 'RR',     unit: '/mnt',    step: '1',    min: '0',   max: '80'  },
  { key: 'map',    label: 'MAP',    unit: 'mmHg',    step: '1',    min: '0',   max: '200' },
  { key: 'temp',   label: 'Temp',   unit: '°C',      step: '0.1',  min: '30',  max: '45'  },
  { key: 'pplat',  label: 'Pplat',  unit: 'cmH₂O',  step: '1',    min: '0',   max: '60'  },
  { key: 'peep',   label: 'PEEP',   unit: 'cmH₂O',  step: '1',    min: '0',   max: '30'  },
  { key: 'fio2',   label: 'FiO₂',  unit: '%',       step: '1',    min: '21',  max: '100' },
  { key: 'laktat', label: 'Laktat', unit: 'mmol/L',  step: '0.1',  min: '0',   max: '20'  },
  { key: 'ph',     label: 'pH',     unit: '',        step: '0.01', min: '6.5', max: '8'   },
]

// ── Storage helpers ───────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function loadVitalEntries(): VitalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VITALS)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as VitalEntry[]
  } catch {
    return []
  }
}

function persistVitalEntries(entries: VitalEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VITALS, JSON.stringify(entries))
  } catch {
    // storage full — silently skip
  }
}

function isAbnormal(param: VitalRangeKey, value: number): boolean {
  const range = VITAL_RANGES[param]
  return value < range.min || value > range.max
}

function fmtTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

function fmtTimeShort(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ── Chart drawing ─────────────────────────────────────────────────────────────

function drawChart(canvas: HTMLCanvasElement, entries: VitalEntry[], params: string[]): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)

  if (sorted.length < 2 || params.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Tambahkan minimal 2 data untuk melihat grafik', canvas.width / 2, canvas.height / 2)
    return
  }

  const dpr = window.devicePixelRatio || 1
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  ctx.scale(dpr, dpr)

  const PAD = { top: 20, right: 20, bottom: 45, left: 48 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top  - PAD.bottom

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const axisColor  = isDark ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.4)'
  const bgColor    = isDark ? '#1e293b' : '#ffffff'
  const labelColor = isDark ? '#94a3b8' : '#64748b'

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, W, H)

  let globalMin = Infinity
  let globalMax = -Infinity
  for (const p of params) {
    for (const e of sorted) {
      const v = e[p as keyof VitalEntry] as number | undefined
      if (v !== undefined) {
        if (v < globalMin) globalMin = v
        if (v > globalMax) globalMax = v
      }
    }
  }
  if (!isFinite(globalMin) || !isFinite(globalMax)) {
    ctx.fillStyle = labelColor
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Tidak ada data untuk parameter yang dipilih', W / 2, H / 2)
    return
  }
  const range = globalMax - globalMin || 1
  const yMin = globalMin - range * 0.1
  const yMax = globalMax + range * 0.1
  const yRange = yMax - yMin

  function xOf(i: number): number {
    return PAD.left + (sorted.length > 1 ? (i / (sorted.length - 1)) * chartW : chartW / 2)
  }
  function yOf(v: number): number {
    return PAD.top + chartH - ((v - yMin) / yRange) * chartH
  }

  // Horizontal grid lines
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (i / 4) * chartH
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + chartW, y); ctx.stroke()
    const val = yMax - (i / 4) * yRange
    ctx.fillStyle = labelColor
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(val.toFixed(1), PAD.left - 6, y + 4)
  }

  // Vertical grid lines + time labels
  ctx.strokeStyle = gridColor
  for (let i = 0; i < sorted.length; i++) {
    const x = xOf(i)
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + chartH); ctx.stroke()
    ctx.fillStyle = labelColor
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(fmtTimeShort(sorted[i]!.timestamp), x, PAD.top + chartH + 14)
  }

  // Axes
  ctx.strokeStyle = axisColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(PAD.left, PAD.top)
  ctx.lineTo(PAD.left, PAD.top + chartH)
  ctx.lineTo(PAD.left + chartW, PAD.top + chartH)
  ctx.stroke()

  // Lines per param
  for (const p of params) {
    const color = CHART_COLORS[p] ?? '#888'
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    let started = false
    for (let i = 0; i < sorted.length; i++) {
      const v = sorted[i]![p as keyof VitalEntry] as number | undefined
      if (v === undefined) { started = false; continue }
      if (!started) { ctx.moveTo(xOf(i), yOf(v)); started = true }
      else { ctx.lineTo(xOf(i), yOf(v)) }
    }
    ctx.stroke()

    // Dots
    for (let i = 0; i < sorted.length; i++) {
      const v = sorted[i]![p as keyof VitalEntry] as number | undefined
      if (v === undefined) continue
      ctx.beginPath()
      ctx.arc(xOf(i), yOf(v), 3.5, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }
  }

  // Legend
  let lx = PAD.left
  const ly = H - 12
  for (const p of params) {
    const color = CHART_COLORS[p] ?? '#888'
    ctx.fillStyle = color
    ctx.fillRect(lx, ly - 8, 14, 8)
    ctx.fillStyle = labelColor
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'left'
    const label = (VITAL_RANGES as Record<string, { label: string }>)[p]?.label ?? p.toUpperCase()
    ctx.fillText(label, lx + 17, ly)
    lx += 17 + ctx.measureText(label).width + 14
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

type FormValues = Partial<Record<keyof Omit<VitalEntry, 'id' | 'timestamp'>, string>>

const EMPTY_FORM: FormValues = {
  spo2: '', hr: '', rr: '', map: '', temp: '',
  pplat: '', peep: '', fio2: '', laktat: '', ph: '', note: '',
}

export function MonitoringDashboard() {
  const [entries, setEntries] = useState<VitalEntry[]>(() => loadVitalEntries())
  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [selectedParams, setSelectedParams] = useState<string[]>(['spo2', 'hr', 'map'])
  const [error, setError] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const redrawChart = useCallback(() => {
    if (canvasRef.current) {
      drawChart(canvasRef.current, entries, selectedParams)
    }
  }, [entries, selectedParams])

  useEffect(() => {
    redrawChart()
  }, [redrawChart])

  useEffect(() => {
    const observer = new ResizeObserver(() => redrawChart())
    if (canvasRef.current) observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [redrawChart])

  function handleFormChange(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const numericFields = FORM_FIELDS.map(f => f.key)
    let hasAny = false
    const entry: Omit<VitalEntry, 'id' | 'timestamp'> = {}

    for (const f of numericFields) {
      const raw = (form[f as keyof FormValues] ?? '').trim()
      if (raw !== '') {
        const v = parseFloat(raw)
        if (!isNaN(v)) {
          (entry as Record<string, unknown>)[f] = v
          hasAny = true
        }
      }
    }

    const note = (form.note ?? '').trim()
    if (note) entry.note = note

    if (!hasAny) {
      setError('Masukkan minimal satu nilai parameter.')
      return
    }

    const full: VitalEntry = { ...entry, id: generateId(), timestamp: Date.now() }
    const updated = [...entries, full]
    persistVitalEntries(updated)
    setEntries(updated)
    setForm(EMPTY_FORM)
  }

  function handleClearAll() {
    if (!confirm('Hapus semua data vital? Tindakan ini tidak dapat diurungkan.')) return
    localStorage.removeItem(STORAGE_KEY_VITALS)
    setEntries([])
  }

  function toggleParam(param: string) {
    setSelectedParams(prev =>
      prev.includes(param) ? prev.filter(p => p !== param) : [...prev, param]
    )
  }

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  const hasNote = sorted.some(e => e.note)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Monitoring Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Catat &amp; visualisasikan tren vital signs — SpO₂ · HR · MAP · Laktat</p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Tambah Data Vital</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {FORM_FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {f.label}{f.unit ? ` (${f.unit})` : ''}
              </label>
              <input
                type="number"
                step={f.step}
                min={f.min}
                max={f.max}
                placeholder="—"
                value={form[f.key as keyof FormValues] ?? ''}
                onChange={(e) => handleFormChange(f.key, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan</label>
          <input
            type="text"
            placeholder="Catatan klinis…"
            value={form.note ?? ''}
            onChange={(e) => handleFormChange('note', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 flex-wrap">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            + Tambah Data
          </button>
          {entries.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-slate-300 bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Print
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-lg border border-slate-300 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Hapus Semua
              </button>
            </>
          )}
        </div>
      </form>

      {/* Trend table */}
      {sorted.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Tren Data Vital</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 whitespace-nowrap sticky left-0 bg-slate-50 z-10">Parameter</th>
                  {sorted.map(e => (
                    <th key={e.id} className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap text-center">
                      {fmtTime(e.timestamp).split(' ').map((t, i) => (
                        <span key={i} className="block">{t}</span>
                      ))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_DISPLAY_PARAMS.map(p => (
                  <tr key={p.key as string} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-700 whitespace-nowrap sticky left-0 bg-white">
                      {p.label}
                      {p.unit && <span className="font-normal text-slate-400 ml-1">({p.unit})</span>}
                    </td>
                    {sorted.map(e => {
                      const val = e[p.key] as number | undefined
                      if (val === undefined) {
                        return <td key={e.id} className="px-3 py-2 text-center text-slate-400">—</td>
                      }
                      const abnormal = p.hasRange && isAbnormal(p.key as VitalRangeKey, val)
                      return (
                        <td
                          key={e.id}
                          className={`px-3 py-2 text-center font-medium ${abnormal ? 'text-red-600 bg-red-50' : 'text-slate-700'}`}
                        >
                          {val}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {hasNote && (
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-700 whitespace-nowrap sticky left-0 bg-white">Catatan</td>
                    {sorted.map(e => (
                      <td key={e.id} className="px-3 py-2 text-center text-slate-600 text-xs">{e.note ?? '—'}</td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
          Belum ada data. Tambahkan data vital pertama di atas.
        </div>
      )}

      {/* Chart section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Grafik Tren</h2>
        {/* Parameter checkboxes */}
        <div className="flex flex-wrap gap-2">
          {FORM_FIELDS.map(f => {
            const isChecked = selectedParams.includes(f.key)
            const color = CHART_COLORS[f.key] ?? '#888'
            return (
              <label
                key={f.key}
                className={`flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  isChecked ? 'text-white border-transparent' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
                style={isChecked ? { backgroundColor: color, borderColor: color } : {}}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleParam(f.key)}
                  className="sr-only"
                />
                {f.label}
              </label>
            )
          })}
        </div>
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg border border-slate-100"
          style={{ height: '260px', display: 'block' }}
        />
      </div>
    </div>
  )
}
