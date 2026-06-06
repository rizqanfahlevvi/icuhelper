// ============================================================
// monitoring-dashboard.ts — Vital Signs Trend Dashboard
// ICU Helper · TypeScript strict mode
// ============================================================

export {} // make this file a module so `declare global` is valid

// ─── Types ───────────────────────────────────────────────────

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

type VitalRangeKey = keyof typeof VITAL_RANGES

// ─── Constants ───────────────────────────────────────────────

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

const PARAM_KEYS: (keyof VitalEntry)[] = [
  'spo2','hr','rr','map','temp','pplat','peep','fio2','laktat','ph'
]

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

// ─── Storage ─────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function saveVitalEntry(
  entry: Omit<VitalEntry, 'id' | 'timestamp'>
): VitalEntry {
  const full: VitalEntry = { ...entry, id: generateId(), timestamp: Date.now() }
  const entries = loadVitalEntries()
  entries.push(full)
  try {
    localStorage.setItem(STORAGE_KEY_VITALS, JSON.stringify(entries))
  } catch {
    // storage full — silently skip
  }
  return full
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

function clearVitalEntries(): void {
  localStorage.removeItem(STORAGE_KEY_VITALS)
}

// ─── Validation ──────────────────────────────────────────────

function isAbnormal(param: VitalRangeKey, value: number): boolean {
  const range = VITAL_RANGES[param]
  return value < range.min || value > range.max
}

// ─── Format helpers ──────────────────────────────────────────

function fmtTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}\n${pad(d.getDate())}/${pad(d.getMonth()+1)}`
}

function fmtTimeShort(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ─── Render Trend Table ───────────────────────────────────────

function renderTrendTable(containerId: string, entries: VitalEntry[]): void {
  const container = document.getElementById(containerId)
  if (!container) return

  if (entries.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);font-size:13px;padding:12px 0;">Belum ada data. Tambahkan data vital pertama di atas.</p>'
    return
  }

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)

  const rangeParams = Object.keys(VITAL_RANGES) as VitalRangeKey[]
  // peep and fio2 don't have VITAL_RANGES entry, handle separately
  const allDisplayParams: Array<{ key: keyof VitalEntry; label: string; unit: string; hasRange: boolean }> = [
    ...rangeParams.map(k => ({ key: k as keyof VitalEntry, label: VITAL_RANGES[k].label, unit: VITAL_RANGES[k].unit, hasRange: true })),
    { key: 'peep', label: 'PEEP', unit: 'cmH₂O', hasRange: false },
    { key: 'fio2', label: 'FiO₂', unit: '%',     hasRange: false },
  ]

  let html = '<div class="vital-table"><table><thead><tr><th>Parameter</th>'
  for (const e of sorted) {
    const t = fmtTime(e.timestamp)
    html += `<th>${t.replace('\n','<br>')}</th>`
  }
  html += '</tr></thead><tbody>'

  for (const p of allDisplayParams) {
    html += `<tr><td style="text-align:left;font-weight:600;white-space:nowrap">${p.label}${p.unit ? ` <span style="font-weight:400;color:var(--muted)">(${p.unit})</span>` : ''}</td>`
    for (const e of sorted) {
      const val = e[p.key] as number | undefined
      if (val === undefined || val === null) {
        html += '<td style="color:var(--muted)">—</td>'
      } else {
        const abnormal = p.hasRange && isAbnormal(p.key as VitalRangeKey, val)
        html += `<td class="${abnormal ? 'vital-abnormal' : ''}">${val}</td>`
      }
    }
    html += '</tr>'
  }

  // Note row if any entry has note
  const hasNote = sorted.some(e => e.note)
  if (hasNote) {
    html += '<tr><td style="text-align:left;font-weight:600">Catatan</td>'
    for (const e of sorted) {
      html += `<td style="font-size:11px;text-align:left">${e.note ?? '—'}</td>`
    }
    html += '</tr>'
  }

  html += '</tbody></table></div>'
  container.innerHTML = html
}

// ─── Render Trend Chart (Canvas API) ─────────────────────────

function renderTrendChart(canvasId: string, entries: VitalEntry[], params: string[]): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (entries.length < 2 || params.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#94a3b8'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Tambahkan minimal 2 data untuk melihat grafik', canvas.width / 2, canvas.height / 2)
    return
  }

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  const dpr = window.devicePixelRatio || 1
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  ctx.scale(dpr, dpr)

  const PAD = { top: 20, right: 20, bottom: 45, left: 48 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top  - PAD.bottom

  // Detect theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const axisColor  = isDark ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.4)'
  const bgColor    = isDark ? '#1e293b' : '#ffffff'
  const labelColor = isDark ? '#94a3b8' : '#64748b'

  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, W, H)

  // Collect all values for active params
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
    return PAD.left + (i / (sorted.length - 1)) * chartW
  }
  function yOf(v: number): number {
    return PAD.top + chartH - ((v - yMin) / yRange) * chartH
  }

  // Grid lines (5 horizontal)
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

  // Vertical grid lines (time axis)
  ctx.strokeStyle = gridColor
  for (let i = 0; i < sorted.length; i++) {
    const x = xOf(i)
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + chartH); ctx.stroke()
    // X-axis label
    ctx.fillStyle = labelColor
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(fmtTimeShort(sorted[i].timestamp), x, PAD.top + chartH + 14)
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
      const v = sorted[i][p as keyof VitalEntry] as number | undefined
      if (v === undefined) { started = false; continue }
      const x = xOf(i)
      const y = yOf(v)
      if (!started) { ctx.moveTo(x, y); started = true }
      else { ctx.lineTo(x, y) }
    }
    ctx.stroke()

    // Dots
    for (let i = 0; i < sorted.length; i++) {
      const v = sorted[i][p as keyof VitalEntry] as number | undefined
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
    const label = (VITAL_RANGES as Record<string, { label: string }>)[p]?.label ?? p
    ctx.fillText(label, lx + 17, ly)
    lx += 17 + ctx.measureText(label).width + 14
  }
}

// ─── Form helpers ────────────────────────────────────────────

function getNumInput(id: string): number | undefined {
  const el = document.getElementById(id) as HTMLInputElement | null
  if (!el || el.value.trim() === '') return undefined
  const v = parseFloat(el.value)
  return isNaN(v) ? undefined : v
}

function getTextInput(id: string): string | undefined {
  const el = document.getElementById(id) as HTMLInputElement | null
  if (!el || el.value.trim() === '') return undefined
  return el.value.trim()
}

// ─── initDashboard ────────────────────────────────────────────

function initDashboard(_containerId: string): void {
  const entries = loadVitalEntries()
  renderTrendTable('vd-table-container', entries)
  renderChartFromCheckboxes()

  // Form submit
  const form = document.getElementById('vd-form') as HTMLFormElement | null
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const entry: Omit<VitalEntry, 'id' | 'timestamp'> = {
      spo2:   getNumInput('vd-spo2'),
      hr:     getNumInput('vd-hr'),
      rr:     getNumInput('vd-rr'),
      map:    getNumInput('vd-map'),
      temp:   getNumInput('vd-temp'),
      pplat:  getNumInput('vd-pplat'),
      peep:   getNumInput('vd-peep'),
      fio2:   getNumInput('vd-fio2'),
      laktat: getNumInput('vd-laktat'),
      ph:     getNumInput('vd-ph'),
      note:   getTextInput('vd-note'),
    }
    // Require at least one value
    const hasAny = PARAM_KEYS.some(k => (entry as Record<string, unknown>)[k as string] !== undefined)
    if (!hasAny) {
      alert('Masukkan minimal satu nilai parameter.')
      return
    }
    saveVitalEntry(entry)
    form.reset()
    refreshDashboard()
  })

  // Clear button
  document.getElementById('vd-btn-clear')?.addEventListener('click', () => {
    if (confirm('Hapus semua data vital? Tindakan ini tidak dapat diurungkan.')) {
      clearVitalEntries()
      refreshDashboard()
    }
  })

  // Print button
  document.getElementById('vd-btn-print')?.addEventListener('click', () => {
    window.print()
  })

  // Chart checkboxes
  document.querySelectorAll<HTMLInputElement>('.vd-chart-check').forEach(cb => {
    cb.addEventListener('change', () => renderChartFromCheckboxes())
  })
}

function refreshDashboard(): void {
  const entries = loadVitalEntries()
  renderTrendTable('vd-table-container', entries)
  renderChartFromCheckboxes()
}

function renderChartFromCheckboxes(): void {
  const entries = loadVitalEntries()
  const checked = Array.from(
    document.querySelectorAll<HTMLInputElement>('.vd-chart-check:checked')
  ).map(cb => cb.value)
  renderTrendChart('vd-chart', entries, checked)
}

// ─── Expose to window ────────────────────────────────────────

const w = window as unknown as Record<string, unknown>
w['vdSaveVitalEntry']    = saveVitalEntry
w['vdLoadVitalEntries']  = loadVitalEntries
w['vdClearVitalEntries'] = clearVitalEntries
w['vdIsAbnormal']        = isAbnormal
w['vdRenderTrendTable']  = renderTrendTable
w['vdRenderTrendChart']  = renderTrendChart
w['vdInitDashboard']     = initDashboard

// ─── Auto-init ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vd-dashboard-root')) {
    initDashboard('vd-dashboard-root')
  }
})
