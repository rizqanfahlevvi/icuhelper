// ============================================================
// scripts-abg.ts — ABG Interpreter v2.0 (TypeScript)
// Halaman: abg.html
// ============================================================

// ─── Types ───────────────────────────────────────────────────

type AbgParam = 'paco2' | 'hco3' | 'na' | 'cl' | 'alb'
type FiO2Mode = 'direct' | 'lowflow'
type O2Device = 'nasal' | 'simple' | 'nrm' | `venturi${number}`
type KondisiKlinis = 'umum' | 'ards' | 'copd' | 'sepsis' | 'cardiac' | 'neuro'

interface ManagementItem {
  judul: string
  color: string
  isi: string[]
  ref: string
}

interface CompensationResult {
  cls: string
  title: string
  val: string
  range: string
  formula: string
  status: string
  ref: string
}

// ─── Clinical thresholds ─────────────────────────────────────

const AG_NORMAL_HIGH      = 12  // mEq/L — normal Anion Gap ceiling
const AG_CORRECTED_HIGH   = 14  // mEq/L — albumin-corrected AG ceiling (Figge formula)
const AG_SEVERE_ACIDOSIS  = 7.20 // pH threshold for severe acidemia
const AG_SEVERE_ALKALOSIS = 7.55 // pH threshold for severe alkalemia

// ─── Unit config ─────────────────────────────────────────────

const UNIT_DEFAULTS: Record<AbgParam, string> = {
  paco2: 'mmHg', hco3: 'mmol/L', na: 'mmol/L', cl: 'mmol/L', alb: 'g/dL',
}

const UNIT_OPTIONS: Record<AbgParam, [string, string]> = {
  paco2: ['mmHg', 'kPa'],
  hco3:  ['mmol/L', 'mEq/L'],
  na:    ['mmol/L', 'mEq/L'],
  cl:    ['mmol/L', 'mEq/L'],
  alb:   ['g/dL', 'mg/dL'],
}

const INPUT_MAP: Record<AbgParam, string> = {
  paco2: 'abgCO2', hco3: 'abgHCO3', na: 'abgNa', cl: 'abgCl', alb: 'abgAlb',
}

// ─── DOM helpers ─────────────────────────────────────────────

function getEl<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null
}

function getInputEl(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null
}

function getFloat(id: string): number | null {
  const v = parseFloat(getInputEl(id)?.value ?? '')
  return isNaN(v) ? null : v
}

// ─── Init ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  for (const [param, defaultUnit] of Object.entries(UNIT_DEFAULTS) as [AbgParam, string][]) {
    const stored = localStorage.getItem('abg-unit-' + param) ?? defaultUnit
    const btn = document.querySelector<HTMLElement>(`[data-unit="${param}"]`)
    if (btn) btn.textContent = stored
  }
  setSpo2Source('pulse')
  syncFiO2Direct()
})

// ─── Theory toggle ───────────────────────────────────────────

export function toggleTheory(id: string): void {
  const btn = (event as MouseEvent).currentTarget as HTMLElement
  const content = getEl('theory-' + id)
  if (!content) return
  btn.classList.toggle('open')
  content.classList.toggle('visible')
}

// ─── Unit toggle ─────────────────────────────────────────────

export function toggleUnit(param: AbgParam): void {
  const arr = UNIT_OPTIONS[param]
  const key = 'abg-unit-' + param
  const current = localStorage.getItem(key) ?? arr[0]
  const next = current === arr[0] ? arr[1] : arr[0]

  const input = getInputEl(INPUT_MAP[param])
  if (input?.value) {
    const val = parseFloat(input.value)
    if (!isNaN(val)) {
      if (param === 'paco2') {
        input.value = (current === 'mmHg' ? val / 7.5006 : val * 7.5006)
          .toFixed(current === 'mmHg' ? 2 : 0)
      } else if (param === 'alb') {
        input.value = (current === 'g/dL' ? val * 1000 : val / 1000)
          .toFixed(current === 'g/dL' ? 0 : 1)
      }
      // hco3 / na / cl: 1:1, hanya ganti label
    }
  }

  if (param === 'paco2' && input) {
    if (next === 'kPa') {
      input.setAttribute('min', '1'); input.setAttribute('max', '20')
      input.setAttribute('step', '0.1'); input.placeholder = '4.7–6.0'
    } else {
      input.setAttribute('min', '10'); input.setAttribute('max', '150')
      input.setAttribute('step', '1'); input.placeholder = '35–45'
    }
  }
  if (param === 'alb' && input) {
    if (next === 'mg/dL') {
      input.setAttribute('max', '6000'); input.setAttribute('step', '100')
      input.placeholder = '3500–5000 (opsional)'
    } else {
      input.setAttribute('max', '6'); input.setAttribute('step', '0.1')
      input.placeholder = '3.5–5 (opsional)'
    }
  }

  localStorage.setItem(key, next)
  const btn = document.querySelector<HTMLElement>(`[data-unit="${param}"]`)
  if (btn) btn.textContent = next
}

// ─── FiO₂ dual mode ──────────────────────────────────────────

export function setFiO2Mode(mode: FiO2Mode): void {
  const directWrap  = getEl('fio2DirectWrap')
  const lowflowWrap = getEl('fio2LowflowWrap')
  const btnDirect   = getEl('fio2BtnDirect')
  const btnLowflow  = getEl('fio2BtnLowflow')

  if (mode === 'direct') {
    if (directWrap)  directWrap.style.display  = ''
    if (lowflowWrap) lowflowWrap.style.display = 'none'
    btnDirect?.classList.add('active')
    btnLowflow?.classList.remove('active')
    syncFiO2Direct()
  } else {
    if (directWrap)  directWrap.style.display  = 'none'
    if (lowflowWrap) lowflowWrap.style.display = ''
    btnDirect?.classList.remove('active')
    btnLowflow?.classList.add('active')
    estimateFiO2()
  }
}

export function syncFiO2Direct(): void {
  const src    = getInputEl('abgFiO2Direct')
  const hidden = getInputEl('abgFiO2')
  if (src && hidden && src.value) hidden.value = src.value
}

export function estimateFiO2(): void {
  const deviceEl = getEl<HTMLSelectElement>('abgO2Device')
  const flowEl   = getInputEl('abgO2Flow')
  if (!deviceEl) return

  const device    = deviceEl.value as O2Device
  const flow      = parseFloat(flowEl?.value ?? '')
  const isVenturi = device.startsWith('venturi')

  if (flowEl) flowEl.style.display = isVenturi ? 'none' : ''

  let fio2 = 0.21
  if (isVenturi) {
    fio2 = parseInt(device.replace('venturi', '')) / 100
  } else if (device === 'nasal' && !isNaN(flow)) {
    fio2 = Math.min(0.21 + 0.04 * flow, 0.44)
  } else if (device === 'simple' && !isNaN(flow)) {
    fio2 = flow <= 6 ? 0.35 : flow >= 10 ? 0.60 : 0.35 + (flow - 6) * 0.0625
  } else if (device === 'nrm' && !isNaN(flow)) {
    fio2 = flow <= 10 ? 0.80 : flow >= 15 ? 0.95 : 0.80 + (flow - 10) * 0.03
  }

  const hidden = getInputEl('abgFiO2')
  if (hidden) hidden.value = fio2.toFixed(2)

  const est = getEl('abgFiO2Est')
  if (est) {
    est.textContent = (isVenturi || !isNaN(flow))
      ? `Estimasi FiO₂ ≈ ${(fio2 * 100).toFixed(0)}% (${fio2.toFixed(2)})`
      : ''
  }
}

// ─── SpO₂ source ─────────────────────────────────────────────

export function setSpo2Source(src: 'pulse' | 'abg'): void {
  const btnPulse = getEl('spo2BtnPulse')
  const btnABG   = getEl('spo2BtnABG')
  const note     = getEl('spo2SourceNote')

  if (src === 'pulse') {
    btnPulse?.classList.add('active')
    btnABG?.classList.remove('active')
    if (note) note.style.display = ''
  } else {
    btnPulse?.classList.remove('active')
    btnABG?.classList.add('active')
    if (note) note.style.display = 'none'
  }

  let hidden = getInputEl('spo2SourceVal')
  if (!hidden) {
    hidden = document.createElement('input')
    hidden.type = 'hidden'; hidden.id = 'spo2SourceVal'
    document.body.appendChild(hidden)
  }
  hidden.value = src
}

// ─── Reset ───────────────────────────────────────────────────

export function resetABG(): void {
  const ids = [
    'abgPH','abgCO2','abgO2','abgHCO3','abgBE','abgSpO2',
    'abgFiO2','abgFiO2Direct','abgMAP','abgNa','abgCl',
    'abgAlb','abgLaktat','abgRR','abgO2Flow',
  ]
  for (const id of ids) {
    const el = getInputEl(id)
    if (el) el.value = ''
  }
  const est = getEl('abgFiO2Est')
  if (est) est.textContent = ''
  setSpo2Source('pulse')
  setFiO2Mode('direct')
  getEl('abg-results')?.classList.add('hidden')
}

// ─── Main ABG Interpreter ────────────────────────────────────

export function calcABG(): void {
  syncFiO2Direct()

  const paco2Unit = localStorage.getItem('abg-unit-paco2') ?? 'mmHg'
  const albUnit   = localStorage.getItem('abg-unit-alb')   ?? 'g/dL'

  const pH = getFloat('abgPH')
  let pco2 = getFloat('abgCO2')
  if (paco2Unit === 'kPa' && pco2 !== null) pco2 = pco2 * 7.5006

  const po2     = getFloat('abgO2')
  const hco3    = getFloat('abgHCO3')
  const be      = getFloat('abgBE') ?? 0
  const spo2    = getFloat('abgSpO2')
  const fio2    = getFloat('abgFiO2')
  const mapV    = getFloat('abgMAP')
  const na      = getFloat('abgNa')
  const cl      = getFloat('abgCl')
  let   alb     = getFloat('abgAlb')
  if (alb !== null && albUnit === 'mg/dL') alb = alb / 1000
  const laktat  = getFloat('abgLaktat')
  const rr      = getFloat('abgRR')
  const kondisi = (getEl<HTMLSelectElement>('abgKondisi')?.value ?? 'umum') as KondisiKlinis

  const spo2Source = (getInputEl('spo2SourceVal')?.value ?? 'pulse') === 'pulse'
    ? 'SpO₂ (Pulse Ox)' : 'SaO₂ (ABG)'

  const paco2Label = paco2Unit === 'kPa' && pco2 !== null
    ? `${(pco2 / 7.5006).toFixed(1)} kPa (= ${pco2.toFixed(0)} mmHg)`
    : `${pco2?.toFixed(0) ?? '—'} mmHg`

  if (!pH || !pco2 || !hco3) { alert('Minimal masukkan pH, PaCO₂, dan HCO₃⁻'); return }

  let html = ''

  // ── Langkah 1: Status pH ──────────────────────────────────
  let phStatus: string, phColor: string, phClass: string
  if (pH < 7.35) {
    phStatus = pH < AG_SEVERE_ACIDOSIS ? `Asidemia BERAT (pH <${AG_SEVERE_ACIDOSIS})` : 'Asidemia'
    phColor = 'var(--red)'; phClass = 'abg-severe'
  } else if (pH > 7.45) {
    phStatus = pH > AG_SEVERE_ALKALOSIS ? `Alkalemia BERAT (pH >${AG_SEVERE_ALKALOSIS})` : 'Alkalemia'
    phColor = 'var(--amber)'; phClass = 'abg-mild'
  } else {
    phStatus = 'pH Normal (7.35–7.45)'
    phColor = 'var(--green)'; phClass = 'abg-normal'
  }
  html += `<div class="abg-result ${phClass}">
    <div class="abg-label" style="color:${phColor}">Langkah 1 — Status pH</div>
    <div class="abg-interp">${phStatus}</div>
    <div class="abg-detail">pH = ${pH} · PaCO₂ = ${paco2Label} · HCO₃⁻ = ${hco3} mmol/L · BE = ${be} mEq/L${alb ? ` · Albumin = ${albUnit === 'mg/dL' ? (alb * 1000).toFixed(0) + ' mg/dL' : alb.toFixed(1) + ' g/dL'}` : ''}</div>
  </div>`

  // ── Langkah 2: Gangguan Primer ────────────────────────────
  const acidosis = pH < 7.35, alkalosis = pH > 7.45
  const respAcid = pco2 > 45, respAlk = pco2 < 35
  const metAcid  = hco3 < 22 || be < -2, metAlk = hco3 > 26 || be > 2
  let primary: string
  if (acidosis) {
    if (respAcid && metAcid)  primary = 'Mixed: Asidosis Respiratorik + Asidosis Metabolik'
    else if (respAcid)        primary = 'Asidosis Respiratorik Primer'
    else if (metAcid)         primary = 'Asidosis Metabolik Primer'
    else                      primary = 'Asidemia — penyebab tidak jelas (cek nilai)'
  } else if (alkalosis) {
    if (respAlk && metAlk)    primary = 'Mixed: Alkalosis Respiratorik + Alkalosis Metabolik'
    else if (respAlk)         primary = 'Alkalosis Respiratorik Primer'
    else if (metAlk)          primary = 'Alkalosis Metabolik Primer'
    else                      primary = 'Alkalemia — penyebab tidak jelas'
  } else {
    if (respAcid && metAlk)   primary = 'pH Normal — Mixed: Asidosis Resp terkompensasi oleh Alkalosis Met'
    else if (respAlk && metAcid) primary = 'pH Normal — Mixed: Alkalosis Resp terkompensasi oleh Asidosis Met'
    else if (!respAcid && !respAlk && !metAcid && !metAlk) primary = 'ABG Normal — tidak ada gangguan primer'
    else                      primary = 'pH Normal dengan kompensasi atau mixed disorder'
  }
  html += `<div class="abg-result abg-blue" style="margin-top:6px">
    <div class="abg-label" style="color:var(--blue)">Langkah 2 — Gangguan Primer</div>
    <div class="abg-interp">${primary}</div>
    <div class="abg-detail">PaCO₂ = ${pco2.toFixed(0)} mmHg (N:35–45) · HCO₃⁻ = ${hco3} mmol/L (N:22–26) · BE = ${be}</div>
  </div>`

  // ── Langkah 3: Kompensasi ─────────────────────────────────
  let compNote: string
  if (respAcid && !respAlk) {
    const expAcute   = 24 + 0.1  * (pco2 - 40)
    const expChronic = 24 + 0.35 * (pco2 - 40)
    if      (Math.abs(hco3 - expAcute) <= 2)   compNote = `Asidosis Resp AKUT — Kompensasi metabolik adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)}, actual: ${hco3})`
    else if (Math.abs(hco3 - expChronic) <= 3) compNote = `Asidosis Resp KRONIK — Kompensasi metabolik adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)}, actual: ${hco3})`
    else if (hco3 > expChronic + 3)            compNote = `Asidosis Resp + Alkalosis Metabolik Concurrent (HCO₃⁻ ${hco3} > expected kronik ${expChronic.toFixed(1)}+3)`
    else                                        compNote = `Kompensasi TIDAK ADEKUAT — Mixed disorder? Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`
  } else if (respAlk) {
    const expAcute   = 24 - 0.2 * (40 - pco2)
    const expChronic = 24 - 0.5 * (40 - pco2)
    if      (Math.abs(hco3 - expAcute) <= 2.5)   compNote = `Alkalosis Resp AKUT — Kompensasi adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)})`
    else if (Math.abs(hco3 - expChronic) <= 2.5) compNote = `Alkalosis Resp KRONIK — Kompensasi adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)})`
    else                                          compNote = `Alkalosis Resp + kemungkinan Asidosis Met Concurrent. Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`
  } else if (metAcid && hco3 < 22) {
    const expPCO2 = 1.5 * hco3 + 8
    if      (Math.abs(pco2 - expPCO2) <= 2) compNote = `Asidosis Metabolik — Kompensasi respiratorik adekuat (Winter's: expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`
    else if (pco2 > expPCO2 + 2)            compNote = `Asidosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > Winter's ${expPCO2.toFixed(0)})`
    else                                     compNote = `Asidosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < Winter's ${expPCO2.toFixed(0)})`
  } else if (metAlk && hco3 > 26) {
    const expPCO2 = 0.7 * hco3 + 21
    if      (Math.abs(pco2 - expPCO2) <= 2) compNote = `Alkalosis Metabolik — Kompensasi respiratorik adekuat (Expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`
    else if (pco2 < expPCO2 - 2)            compNote = `Alkalosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < expected ${expPCO2.toFixed(0)})`
    else                                     compNote = `Alkalosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > expected ${expPCO2.toFixed(0)})`
  } else {
    compNote = 'Tidak ada gangguan primer signifikan — kompensasi tidak applicable.'
  }
  html += `<div class="abg-result abg-mild" style="margin-top:6px">
    <div class="abg-label" style="color:var(--amber)">Langkah 3 — Evaluasi Kompensasi</div>
    <div class="abg-detail">${compNote}</div>
  </div>`

  // ── Langkah 4: Anion Gap ─────────────────────────────────
  let agHigh = false
  if (na !== null && cl !== null) {
    const ag     = na - (cl + hco3)
    const agCorr = alb !== null ? ag + 2.5 * (4 - alb) : null
    agHigh = agCorr !== null ? agCorr > AG_CORRECTED_HIGH : ag > AG_NORMAL_HIGH
    let agNote = `AG = ${na} − (${cl} + ${hco3}) = ${ag} mEq/L (Normal 8–12)`
    if (agCorr !== null) agNote += ` · AG terkoreksi albumin: ${agCorr.toFixed(1)} (Albumin ${alb!.toFixed(1)} g/dL)`
    let ddNote = ''
    if (agHigh && metAcid) {
      const dd = (ag - 12) / (24 - hco3)
      if      (dd < 0.4)  ddNote = `Delta-Delta = ${dd.toFixed(2)} (<0.4) → Mixed HAGMA + Non-AGMA (misalnya: ketoasidosis + RTA)`
      else if (dd <= 1)   ddNote = `Delta-Delta = ${dd.toFixed(2)} (0.4–1.0) → Non-anion gap metabolic acidosis concurrent`
      else if (dd <= 2)   ddNote = `Delta-Delta = ${dd.toFixed(2)} (1–2) → Pure HAGMA (tanpa komponen non-AG)`
      else                ddNote = `Delta-Delta = ${dd.toFixed(2)} (>2) → HAGMA + Alkalosis Metabolik Concurrent (HCO₃⁻ lebih tinggi dari expected)`
    }
    html += `<div class="abg-result ${agHigh ? 'abg-severe' : 'abg-normal'}" style="margin-top:6px">
      <div class="abg-label" style="color:${agHigh ? 'var(--red)' : 'var(--green)'}">Langkah 4 — Anion Gap${agCorr !== null ? ' (terkoreksi albumin)' : ''}</div>
      <div class="abg-interp">${agNote}</div>
      ${ddNote ? `<div class="abg-detail" style="margin-top:4px">${ddNote}</div>` : ''}
      ${agHigh ? `<div class="abg-detail" style="margin-top:4px">Penyebab HAGMA: Laktat, Ketoasidosis (DKA/alkohol), Uremia, Racun (metanol/etilen glikol), Salisilat — Mnemonic LKURS</div>` : ''}
    </div>`
  }

  // ── Langkah 5: Laktat ─────────────────────────────────────
  if (laktat !== null) {
    const lakColor = laktat < 2 ? 'var(--green)' : laktat < 4 ? 'var(--amber)' : 'var(--red)'
    const lakNote  = laktat < 2
      ? 'Normal (<2 mmol/L)'
      : laktat < 4
        ? `Hiperlaktatemia (${laktat} mmol/L) — waspada hipoperfusi/HAGMA`
        : `Laktat BERAT (${laktat} mmol/L) — asidosis laktat, mortalitas ↑ signifikan`
    html += `<div class="abg-result ${laktat < 2 ? 'abg-normal' : laktat < 4 ? 'abg-mild' : 'abg-severe'}" style="margin-top:6px">
      <div class="abg-label" style="color:${lakColor}">Langkah 5 — Laktat</div>
      <div class="abg-interp">${lakNote}</div>
      <div class="abg-detail">${laktat >= 2 ? 'Evaluasi: syok (Tipe A), DKA, gagal hati, metformin, thiamine def (Tipe B)' : ''}</div>
    </div>`
  }

  // ── Langkah 6: Oksigenasi ─────────────────────────────────
  if (po2 !== null || fio2 !== null || spo2 !== null) {
    let oxHtml = ''
    if (po2 !== null && fio2 !== null) {
      const pf      = po2 / fio2
      const pfClass = pf >= 400 ? 'Normal' : pf >= 300 ? 'Hipoksemia ringan' : pf >= 200 ? 'ARDS Mild' : pf >= 100 ? 'ARDS Moderate' : 'ARDS Severe'
      const pfColor = pf >= 300 ? 'var(--green)' : pf >= 200 ? 'var(--amber)' : 'var(--red)'
      oxHtml += `P/F Ratio = ${pf.toFixed(0)} → <strong style="color:${pfColor}">${pfClass}</strong> `
      const pao2calc = (fio2 * (760 - 47)) - (pco2 / 0.8)
      const aaGrad   = pao2calc - po2
      oxHtml += `· A-a Gradient = ${aaGrad.toFixed(0)} mmHg (normal &lt;20) → ${aaGrad > 20 ? 'MENINGKAT (V/Q mismatch/shunt)' : 'Normal (hipoventilasi murni jika hipoksemia ada)'} `
      if (mapV !== null) {
        const oi = (mapV * fio2 * 100) / po2
        oxHtml += `· OI = ${oi.toFixed(1)} (${oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat — ECMO?'})`
      }
    }
    if (spo2 !== null && fio2 !== null && rr !== null) {
      const rox      = (spo2 / fio2) / rr
      const roxColor = rox >= 4.88 ? 'var(--green)' : rox >= 3.85 ? 'var(--amber)' : 'var(--red)'
      oxHtml += `<br>ROX Index = (${spo2}/FiO₂${fio2})/RR${rr} = <strong style="color:${roxColor}">${rox.toFixed(2)}</strong> [sumber: <em>${spo2Source}</em>] → ${rox >= 4.88 ? 'Risiko HFNC gagal RENDAH' : rox >= 3.85 ? 'Intermediate — evaluasi ketat' : 'Risiko HFNC gagal TINGGI → pertimbangkan intubasi'}`
    }
    if (oxHtml) {
      html += `<div class="abg-result abg-blue" style="margin-top:6px">
        <div class="abg-label" style="color:var(--blue)">Langkah 6 — Oksigenasi &amp; Gagal Napas</div>
        <div class="abg-detail">${oxHtml}</div>
      </div>`
    }
  }

  // ── Konsiderasi Klinis ────────────────────────────────────
  const sugg: string[] = []
  if (po2 !== null && fio2 !== null) {
    const pf = po2 / fio2
    if      (pf < 100)  sugg.push('P/F <100 (ARDS Severe): ↑ PEEP 13–18, prone position jika P/F <150, pertimbangkan NMB cisatrakurium, ECMO jika OI >40')
    else if (pf < 200)  sugg.push('P/F 100–200 (ARDS Moderate): ↑ PEEP 8–13, FiO₂ 0.4–0.7, pertimbangkan prone jika tidak membaik')
    else if (pf < 300)  sugg.push('P/F 200–300 (ARDS Mild): PEEP 5–8, FiO₂ titrasi, evaluasi ventilasi lung-protective')
  }
  if (pH < 7.25 && pco2 > 50)  sugg.push('Asidosis respiratorik berat: ↑ RR atau ↑ VT (hati-hati Pplat), pertimbangkan NaHCO₃ jika pH <7.10 dengan ventilasi adekuat')
  if (pco2 < 35 && pH > 7.45)  sugg.push('Alkalosis respiratorik: ↓ RR (bertahap), cek dead space, pastikan tidak ada pain/agitasi yang meningkatkan drive')
  if (metAcid && be < -5)       sugg.push('Asidosis metabolik: koreksi penyebab primer (sepsis, hipovolemia, DKA). NaHCO₃ hanya jika pH <7.10 DAN ventilasi adekuat')
  if (pH > 7.50 && hco3 > 30)   sugg.push('Alkalosis metabolik: koreksi hipokalemia, hipokloremia; hentikan diuretik; KCl replacement')
  if (kondisi === 'copd' && pco2 > 55) sugg.push('PPOK: TARGET PaCO₂ = baseline pasien, bukan normocapnia! Koreksi bertahap — risiko alkalosis metabolik berat')
  if (kondisi === 'ards')        sugg.push('ARDS: Pertahankan driving pressure ≤15 cmH₂O. Toleransi permissive hypercapnia (PaCO₂ 45–65) jika pH >7.20')
  if (sugg.length > 0) {
    html += `<div class="abg-result abg-blue" style="margin-top:6px">
      <div class="abg-label" style="color:var(--blue)">Konsiderasi Klinis &amp; Saran Ventilator</div>
      <ul style="padding-left:16px;margin-top:4px">${sugg.map(s => `<li style="font-size:12px;margin-bottom:4px">${s}</li>`).join('')}</ul>
    </div>`
  }

  // ── Langkah 7: Koreksi & Tatalaksana ─────────────────────
  const mgmt: ManagementItem[] = []

  if (metAcid) {
    const isHAGMA  = agHigh
    const isNAGMA  = na !== null && cl !== null && !agHigh
    const bicarInd = pH < 7.10 ? '⚠ TERINDIKASI (pH <7.10)' : pH < 7.20 ? 'Pertimbangkan (pH 7.10–7.20, esp. AKI/NAGMA)' : 'Belum terindikasi — koreksi penyebab primer dulu'
    mgmt.push({
      judul: 'Koreksi Asidosis Metabolik', color: 'var(--red)',
      isi: [
        `NaHCO₃ IV: ${bicarInd}`,
        `Formula dosis: 0.5 × BBideal(kg) × (target HCO₃ − ${hco3.toFixed(0)} mmol/L) = mEq NaHCO₃ — targetkan HCO₃ 12–15, BUKAN normalisasi penuh`,
        'Pemberian: ½ dosis dalam 4 jam pertama → evaluasi AGD → ½ sisanya jika perlu. NaHCO₃ 8.4% = 1 mEq/mL; NaHCO₃ 7.5% = 0.9 mEq/mL',
        'Perhatian: NaHCO₃ → ↑ PaCO₂ transien — pastikan ventilasi adekuat. Hindari jika alkalosis concurrent (Δ-Δ >2)',
        isHAGMA ? 'HAGMA: Prioritas koreksi kausa (laktat → resusitasi, DKA → insulin, uremia → RRT, toksik → eliminasi)' : '',
        isNAGMA ? 'NAGMA: Identifikasi etiologi — diarrhea → rehidrasi; RTA → NaHCO₃ kronik 1–2 mEq/kg/hari; dilutional → hentikan saline, ganti ke balanced crystalloid' : '',
        'Monitoring post-koreksi: pH, PaCO₂, K⁺ (hipokalemia memburuk saat pH naik), Na⁺ (hati-hati Na overload)',
      ].filter(Boolean),
      ref: 'Kraut JA, Madias NE. NEJM 2014 · Jaber S et al. Lancet 2018 (BICAR-ICU) · Berend K. NEJM 2014',
    })
  }

  if (metAlk) {
    const severeAlk = hco3 > 40 || pH > 7.55
    mgmt.push({
      judul: 'Koreksi Alkalosis Metabolik', color: 'var(--amber)',
      isi: [
        'Tentukan tipe: Chloride-responsive (urin Cl⁻ <20 mEq/L) vs Chloride-resistant (urin Cl⁻ >20 mEq/L)',
        'Chloride-responsive (muntah, NGT suction, diuretik): NaCl 0.9% IV + KCl replacement',
        'KCl IV: 10–20 mEq/jam via central line — koreksi hipokalemia WAJIB dulu (target K⁺ ≥3.5 mEq/L)',
        'Chloride-resistant (hiperaldosteronisme, Cushing, Bartter): koreksi underlying + spironolakton/amiloride',
        hco3 > 35 ? 'Acetazolamide 250–500 mg IV/8 jam: pilihan untuk CHF/fluid-overloaded (hindari eGFR <30, sulfa allergy)' : '',
        severeAlk ? 'Alkalosis BERAT (pH >7.55): pertimbangkan HCl 0.1N via CVC — dosis: 0.1 × BB × (HCO₃ aktual − 24) mEq, berikan dalam 12–24 jam' : '',
        'Stop penyebab iatrogenik: kurangi/stop diuretik, hindari antasid berlebihan, kurangi transfusi sitrat',
      ].filter(Boolean),
      ref: 'Emmett M. CJASN 2020 · Gennari FJ. NEJM 1998 · Laski ME. Am J Kidney Dis 2006',
    })
  }

  if (respAcid && acidosis) {
    const permHyperCap = kondisi === 'ards' || (po2 !== null && fio2 !== null && (po2/fio2) < 200)
    mgmt.push({
      judul: 'Koreksi Asidosis Respiratorik', color: 'var(--red)',
      isi: [
        kondisi === 'copd'
          ? 'PPOK: TARGET PaCO₂ = baseline pasien (bukan 40 mmHg!) — koreksi agresif risiko alkalosis rebound berat'
          : 'Target: perbaiki ventilasi alveolar, bukan buffer HCO₃',
        (kondisi === 'copd' || kondisi === 'umum')
          ? 'NIV BiPAP lini pertama (GCS baik, kooperatif): IPAP 12–18 / EPAP 4–8 cmH₂O, titrasi PaCO₂ turun 5–8 mmHg/jam'
          : '',
        'Intubasi jika: NIV gagal/kontraindikasi, GCS ↓ berat, sekresi tidak terkontrol, instabilitas hemodinamik',
        'Pada ventilator: ↑ RR 2–3/mnt bertahap (max 35/mnt), awasi auto-PEEP. ↑ VT 6→8 mL/kgBBP hanya jika Pplat <28 cmH₂O',
        permHyperCap ? 'Permissive hypercapnia (ARDS/lung-protective): toleransi PaCO₂ hingga 70 mmHg jika pH >7.20 dan driving pressure ≤15 cmH₂O' : '',
        'NaHCO₃ TIDAK diindikasikan untuk asidosis resp murni — hanya sebagai bridge jika pH <7.10 dan ventilasi optimal sudah tercapai',
        'Bronkodilator nebulisasi: salbutamol 2.5 mg + ipratropium 0.5 mg q4–6h (esp. PPOK/asma)',
      ].filter(Boolean),
      ref: 'GOLD 2024 · Rochwerg B. Eur Respir J 2017 (NIV) · Matthay MA. NEJM 2019 · Slutsky AS. NEJM 2013',
    })
  }

  if (respAlk && alkalosis) {
    mgmt.push({
      judul: 'Koreksi Alkalosis Respiratorik', color: 'var(--amber)',
      isi: [
        'Koreksi penyebab: nyeri → analgesia (morfin/fentanyl titrasi); agitasi → sedasi (propofol/midazolam titrasi); sepsis → kultur + antibiotik',
        'Pada ventilator: ↓ RR 2/mnt bertahap (min 10/mnt), atau tambah dead space connector',
        'Target pH <7.50 secara bertahap — koreksi terlalu cepat dapat presipitasi seizure',
        'Elektrolit yang sering terganggu: hipokalemia, hipofosfatemia, hipokalsemia ionik — koreksi bersamaan',
        'Liver failure: alkalosis resp persisten akibat hiperammonemia — tidak bisa dicegah tanpa koreksi kausa hepatik',
        'Cek VD/VT meningkat jika PaCO₂ rendah persisten meski RR sudah diturunkan',
      ],
      ref: 'Berend K. NEJM 2014 · Laffey JG. NEJM 2002 · Seifter JL. NEJM 2023',
    })
  }

  if (agHigh && laktat !== null && laktat >= 2) {
    mgmt.push({
      judul: 'Asidosis Laktat / HAGMA', color: 'var(--blue)',
      isi: [
        'Target MAP ≥65 mmHg — resusitasi dengan Ringer Laktat atau PlasmaLyte',
        'Norepinefrin lini pertama jika MAP tidak respons cairan: 0.1–0.5 mcg/kg/mnt via central, titrasi',
        `Laktat clearance: target ≥10% penurunan per 2 jam. Laktat saat ini: ${laktat} mmol/L${laktat >= 4 ? ' — BERAT, mortalitas ↑' : ''}`,
        `NaHCO₃: ${pH < 7.10 ? 'TERINDIKASI (pH <7.10) — dosis 0.5 × BBideal × (15 − ' + hco3.toFixed(0) + ') mEq, berikan ½ dalam 4 jam' : pH < 7.20 ? 'Pertimbangkan jika AKI concurrent' : 'Belum terindikasi — koreksi kausa primer dulu'}`,
        'Koreksi kausa primer: sepsis (antibiotik <1 jam dari onset), iskemia (revaskularisasi), DKA (insulin), hepatik',
        'Tiamin IV 100–200 mg jika suspek defisiensi (alkohol, malnutrisi, refrakter terhadap resusitasi)',
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Jaber S. Lancet 2018 (BICAR-ICU) · Levy B. Chest 2015',
    })
  }

  if (agHigh && (laktat === null || laktat < 4) && metAcid) {
    mgmt.push({
      judul: 'Kemungkinan DKA / Ketoasidosis', color: 'var(--blue)',
      isi: [
        'Cek GDS, keton darah (beta-hydroxybutyrate), K⁺, Mg²⁺, fosfat sebelum mulai terapi',
        'Resusitasi cairan: NaCl 0.9% 1 L/jam pertama (1–2 jam), lanjut 250–500 mL/jam sesuai hidrasi',
        '⚠ CEK K⁺ DAHULU — jika K⁺ <3.5: TUNDA insulin, berikan KCl 20–40 mEq/jam IV sampai K⁺ ≥3.5',
        'Insulin regular IV: 0.1 unit/kgBB/jam (setelah K⁺ ≥3.5). Target: ↓ GDS 50–75 mg/dL/jam',
        'Ganti ke D5%/D10% + insulin saat GDS <200 (DKA) atau <250 (HHS) mg/dL',
        'Fosfat: koreksi jika <1 mg/dL atau ada kelemahan otot napas',
        'NaHCO₃ pada DKA: hanya jika pH <7.0 setelah 1 jam resusitasi (ADA 2024)',
      ],
      ref: 'ADA Standards of Care 2024 · Kitabchi AE. Diabetes Care 2009 · Umpierrez GE. Endocr Rev 2023',
    })
  }

  if (kondisi === 'ards' || (po2 !== null && fio2 !== null && (po2/fio2) < 300)) {
    const pf = (po2 !== null && fio2 !== null) ? po2/fio2 : null
    mgmt.push({
      judul: 'Manajemen ARDS', color: 'var(--blue)',
      isi: [
        'Lung-Protective Ventilation: VT 6 mL/kgBBP, Pplat ≤28 cmH₂O, Driving Pressure ≤15 cmH₂O, PEEP per ARDSNet table',
        pf !== null && pf < 150 ? '🔄 Prone positioning: ≥16 jam/hari — wajib jika P/F <150 (PROSEVA 2013, NNT=8 untuk mortalitas)' : 'Prone positioning: pertimbangkan jika P/F tidak membaik 12–24 jam',
        pf !== null && pf < 120 ? '💊 Neuromuscular blockade: cisatracurium 37.5 mg bolus → 37.5 mg/jam drip IV (48 jam awal)' : '',
        'Konservasi cairan: fluid-restrictive strategy hari 2–7 setelah stabilisasi hemodinamik (FACTT trial)',
        pf !== null && pf < 80 ? '🔴 Pertimbangkan ECMO-VV: jika OI >40 atau P/F <80 refrakter ≥6 jam (EOLIA 2018)' : '',
        'Kortikosteroid: deksametason 6 mg/hari IV — dipertimbangkan pada ARDS moderate-severe (RECOVERY 2021)',
        'Target: SpO₂ 92–96%, pH >7.20, Pplat <28, driving pressure <15',
      ].filter(Boolean),
      ref: 'Matthay MA. NEJM 2019 · Guérin C. NEJM 2013 (PROSEVA) · Combes A. NEJM 2018 (EOLIA) · Slutsky AS. NEJM 2013',
    })
  }

  if (kondisi === 'sepsis' || (laktat !== null && laktat >= 2 && agHigh)) {
    mgmt.push({
      judul: 'Manajemen Sepsis / Syok Septik (SSC 2021)', color: 'var(--blue)',
      isi: [
        '⏱ HOUR-1 BUNDLE: Kultur darah (2 set) → Antibiotik broad-spectrum IV → Laktat → Akses IV → Resusitasi',
        'Cairan: 30 mL/kgBB balanced crystalloid (RL preferred) dalam 3 jam; nilai respons cairan dengan PLR / VTI / PPV',
        'Vasopressor: Norepinefrin lini pertama 0.01–0.5 mcg/kg/mnt via central, target MAP ≥65 mmHg',
        'Vasopressin 0.03 unit/mnt: tambahkan jika dosis NE >0.25 mcg/kg/mnt',
        'Kortikosteroid: hidrokortison 200 mg/hari IV jika refrakter vasopressor',
        `Laktat monitoring: target clearance ≥10%/2 jam (saat ini: ${laktat ?? '?'} mmol/L)`,
        'Antibiotik: de-eskalasi setelah 48–72 jam sesuai kultur. Durasi: 5–7 hari',
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Levy MM. Crit Care Med 2018',
    })
  }

  if (kondisi === 'cardiac') {
    mgmt.push({
      judul: 'Edema Paru Kardiogenik Akut', color: 'var(--blue)',
      isi: [
        'Posisi duduk 90°, oksigen → NIV (CPAP 5–10 cmH₂O atau BiPAP 8–12/5 cmH₂O)',
        'Furosemide IV: 40–80 mg bolus atau infus 5–10 mg/jam; target UO ≥100 mL/jam 2 jam pertama',
        'Nitrogliserin IV: mulai 10–20 mcg/mnt, titrasi 10–20 mcg/mnt tiap 5 mnt jika sistolik >100 mmHg',
        'HINDARI cairan berlebihan — resusitasi hanya jika ada bukti hipovolemia konkuren',
        'Low output / kardiogenik syok: dobutamin 2–10 mcg/kgBB/mnt + NE jika MAP tidak tercapai',
        'Intubasi: jika gagal NIV, GCS ↓, asidosis berat (pH <7.20), atau distres napas tidak terkontrol',
      ],
      ref: 'McDonagh TA et al. Eur Heart J 2021 (ESC HF) · Mebazaa A. Intensive Care Med 2018',
    })
  }

  if (mgmt.length > 0) {
    const mgmtHtml = mgmt.map(m => `
      <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)">
        <div style="font-weight:600;color:${m.color};margin-bottom:5px;font-size:12px;letter-spacing:0.02em">🎯 ${m.judul}</div>
        <ul style="padding-left:16px;margin:0">${m.isi.map(i => `<li style="font-size:12px;margin-bottom:3px;line-height:1.5">${i}</li>`).join('')}</ul>
        <span class="ref-tag" style="display:block;margin-top:5px">📚 ${m.ref}</span>
      </div>`).join('')
    html += `<div class="abg-result abg-blue" style="margin-top:6px">
      <div class="abg-label" style="color:var(--blue)">Langkah 7 — Koreksi Asam-Basa &amp; Strategi Tatalaksana</div>
      ${mgmtHtml}
    </div>`
  }

  html += `<div class="warn" style="margin-top:8px;margin-bottom:0"><strong>⚠ Disclaimer Klinis</strong> Interpretasi ABG ini adalah panduan sistematis berbasis algoritma standar. Keputusan klinis tetap berdasarkan kondisi pasien secara keseluruhan. Konfirmasi dengan spesialis pada kasus kompleks.</div>`

  const content = getEl('abg-result-content')
  if (content) content.innerHTML = html
  getEl('abg-results')?.classList.remove('hidden')
}

// ─── Kalkulator Koreksi Asam-Basa ────────────────────────────

export function switchACBC(n: number): void {
  for (let i = 1; i <= 4; i++) {
    getEl('acbc-t' + i)?.classList.toggle('active', i === n)
    getEl('acbc-p' + i)?.classList.toggle('active', i === n)
  }
}

export function importFromABG(panel: number): void {
  const ph      = parseFloat(getInputEl('abgPH')?.value ?? '')
  const pco2Raw = parseFloat(getInputEl('abgCO2')?.value ?? '')
  const hco3Raw = parseFloat(getInputEl('abgHCO3')?.value ?? '')
  const naRaw   = parseFloat(getInputEl('abgNa')?.value ?? '')
  const clRaw   = parseFloat(getInputEl('abgCl')?.value ?? '')
  const albRaw  = parseFloat(getInputEl('abgAlb')?.value ?? '')

  const pco2Unit = document.querySelector<HTMLElement>('[data-unit="paco2"]')?.textContent ?? 'mmHg'
  const albUnit  = document.querySelector<HTMLElement>('[data-unit="alb"]')?.textContent ?? 'g/dL'

  const pco2 = pco2Unit === 'kPa' ? pco2Raw * 7.5006 : pco2Raw
  const hco3 = hco3Raw
  const na   = naRaw
  const cl   = clRaw
  const alb  = albUnit === 'mg/dL' ? albRaw / 1000 : albRaw
  let imported = 0

  if (panel === 1) {
    if (!isNaN(hco3)) { const el = getInputEl('acbc1-hco3act'); if (el) { el.value = hco3.toFixed(1); imported++ } }
    calcBicarb()
  } else if (panel === 2) {
    if (!isNaN(hco3)) { const el = getInputEl('acbc2-hco3'); if (el) { el.value = hco3.toFixed(1); imported++ } }
    calcAlk()
  } else if (panel === 3) {
    if (!isNaN(ph))   { const el = getInputEl('acbc3-ph');   if (el) { el.value = String(ph); imported++ } }
    if (!isNaN(pco2)) { const el = getInputEl('acbc3-pco2'); if (el) { el.value = pco2.toFixed(1); imported++ } }
    if (!isNaN(hco3)) { const el = getInputEl('acbc3-hco3'); if (el) { el.value = hco3.toFixed(1); imported++ } }
    calcKompensasi()
  } else if (panel === 4) {
    if (!isNaN(na))  { const el = getInputEl('acbc4-na');  if (el) { el.value = na.toFixed(1); imported++ } }
    if (!isNaN(cl))  { const el = getInputEl('acbc4-cl');  if (el) { el.value = cl.toFixed(1); imported++ } }
    if (!isNaN(hco3)) { const el = getInputEl('acbc4-hco3'); if (el) { el.value = hco3.toFixed(1); imported++ } }
    if (!isNaN(alb)) { const el = getInputEl('acbc4-alb'); if (el) { el.value = alb.toFixed(1); imported++ } }
    calcAGStandalone()
  }

  if (imported === 0) alert('Belum ada nilai ABG yang diisi. Isi dulu form ABG Interpreter di atas.')
}

export function calcBicarb(): void {
  const bb      = parseFloat(getInputEl('acbc1-bb')?.value ?? '')
  const hco3act = parseFloat(getInputEl('acbc1-hco3act')?.value ?? '')
  const type    = getEl<HTMLSelectElement>('acbc1-type')?.value ?? 'met'
  let hco3tgt   = parseFloat(getInputEl('acbc1-hco3tgt')?.value ?? '')
  if (type === 'dka')  hco3tgt = 15
  if (type === 'card') hco3tgt = 14

  const el = getEl('acbc1-result')
  if (!el) return
  if (isNaN(bb) || isNaN(hco3act)) { el.innerHTML = ''; return }

  if (type === 'card') {
    el.innerHTML = `
      <div class="acbc-result info">
        <div class="acbc-result-title">Cardiac Arrest — Bolus NaHCO₃ 8.4%</div>
        <div class="acbc-val">${bb.toFixed(0)} mEq</div>
        <div>(= ${bb.toFixed(0)} mL NaHCO₃ 8.4% IV bolus)</div>
        <div class="acbc-formula">Dosis: 1 mEq/kg BB IV bolus. Ulangi tiap 10 menit jika diperlukan.</div>
        <span class="ref-tag">📚 AHA ACLS 2020</span>
      </div>`
    return
  }

  if (hco3act >= hco3tgt) {
    el.innerHTML = `<div class="acbc-result ok"><div class="acbc-result-title">HCO₃⁻ sudah mencapai target</div><div>HCO₃⁻ aktual (${hco3act} mEq/L) ≥ target (${hco3tgt} mEq/L). Tidak perlu koreksi NaHCO₃.</div></div>`
    return
  }

  const dose = 0.5 * bb * (hco3tgt - hco3act)
  const half = dose / 2
  const typeLabel = type === 'dka' ? 'DKA (pH < 6.9)' : 'Asidosis Metabolik'

  el.innerHTML = `
    <div class="acbc-result ${dose > 200 ? 'warn' : 'ok'}">
      <div class="acbc-result-title">Dosis NaHCO₃ — ${typeLabel}</div>
      <div class="acbc-val">${dose.toFixed(0)} mEq</div>
      <div style="font-size:12px;margin-bottom:4px">Berikan ½ dosis dulu: <strong>${half.toFixed(0)} mEq</strong> dalam 4–6 jam, lalu re-evaluasi AGD.</div>
      <hr class="acbc-divider">
      <div style="font-size:11px">
        <strong>Sediaan umum:</strong><br>
        • NaHCO₃ 8.4% = 1 mEq/mL → butuh <strong>${dose.toFixed(0)} mL</strong><br>
        • NaHCO₃ 7.5% = 0.9 mEq/mL → butuh <strong>${(dose/0.9).toFixed(0)} mL</strong><br>
        • NaHCO₃ 1.4% (isotonis) = 0.167 mEq/mL → butuh <strong>${(dose/0.167).toFixed(0)} mL</strong>
      </div>
      <div class="acbc-formula">Rumus: 0.5 × BB ideal (${bb} kg) × (target HCO₃⁻ ${hco3tgt} − aktual ${hco3act}) mEq/L</div>
      <span class="ref-tag">📚 Seifter JL. NEJM 2014; Berend K. NEJM 2018</span>
    </div>
    ${dose > 200 ? `<div class="acbc-result warn"><div class="acbc-result-title">⚠ Dosis Besar</div>Dosis >200 mEq — pertimbangkan pemberian bertahap. Risiko: hipernatremia, volume overload, alkalosis rebound.</div>` : ''}`
}

export function calcAlk(): void {
  const bb   = parseFloat(getInputEl('acbc2-bb')?.value ?? '')
  const hco3 = parseFloat(getInputEl('acbc2-hco3')?.value ?? '')
  const k    = parseFloat(getInputEl('acbc2-k')?.value ?? '')
  const cl   = parseFloat(getInputEl('acbc2-cl')?.value ?? '')

  const el = getEl('acbc2-result')
  if (!el) return
  if (isNaN(bb) || isNaN(hco3)) { el.innerHTML = ''; return }

  if (hco3 <= 26) {
    el.innerHTML = `<div class="acbc-result ok"><div class="acbc-result-title">HCO₃⁻ dalam batas normal</div>HCO₃⁻ ${hco3} mEq/L ≤ 26. Tidak ada alkalosis metabolik.</div>`
    return
  }

  const clResponsive = !isNaN(cl) && cl < 95
  const hypoK = !isNaN(k) && k < 3.5

  let kclHtml = ''
  if (!isNaN(k)) {
    const kDeficit = (4.0 - k) * 0.4 * bb
    kclHtml = `
      <div class="acbc-result ${hypoK ? 'warn' : 'info'}">
        <div class="acbc-result-title">Koreksi KCl IV</div>
        <div class="acbc-val">${kDeficit > 0 ? kDeficit.toFixed(0) + ' mEq' : 'K⁺ cukup'}</div>
        ${kDeficit > 0 ? `<div style="font-size:11px">Berikan dengan kecepatan ≤20 mEq/jam (perifer) atau ≤40 mEq/jam (sentral + monitor EKG).<br>Tambahkan MgSO₄ 1–2 g IV jika ada hipomagnesemia.</div>` : '<div>K⁺ serum sudah ≥ 4.0 mEq/L.</div>'}
        <div class="acbc-formula">Deficit K⁺ ≈ (4.0 − ${k}) × 0.4 × ${bb} kg</div>
        <span class="ref-tag">📚 Galla JH. JASN 2000</span>
      </div>`
  }

  const hclTarget = 24
  const hclDose   = 0.1 * bb * (hco3 - hclTarget)
  const hclHtml   = hco3 >= 40 ? `
    <div class="acbc-result bad">
      <div class="acbc-result-title">HCl 0.1N — Alkalosis Berat / Refrakter (HCO₃⁻ ≥ 40)</div>
      <div class="acbc-val">${hclDose.toFixed(0)} mEq HCl</div>
      <div style="font-size:11px">Berikan via kateter vena sentral dalam 4–24 jam. Monitor pH tiap 4 jam.<br>HCl 0.1N = 100 mEq/L → butuh <strong>${(hclDose/0.1).toFixed(0)} mL</strong>.</div>
      <div class="acbc-formula">Rumus: 0.1 × BB (${bb} kg) × (HCO₃ aktual ${hco3} − target ${hclTarget})</div>
      <span class="ref-tag">📚 Gennari FJ. NEJM 1998; Emmett M. CJASN 2020</span>
    </div>` : ''

  const responsiveNote = `
    <div class="acbc-result ${clResponsive ? 'warn' : 'info'}">
      <div class="acbc-result-title">${clResponsive ? '✅ Chloride-Responsive' : '⚡ Chloride-Resistant'}</div>
      <div style="font-size:11px">${clResponsive
        ? 'Cl⁻ urin rendah atau Cl⁻ serum < 95 → kemungkinan penyebab: muntah, NG suction, diuretik. Koreksi dengan NaCl isotonis + KCl.'
        : 'Cl⁻ serum normal/tinggi → kemungkinan penyebab: hiperaldosteronisme, Cushing, Bartter/Gitelman syndrome. Tangani penyebab primer.'
      }</div>
      ${!isNaN(cl) ? `<div class="acbc-formula">Cl⁻ serum: ${cl} mEq/L</div>` : ''}
    </div>`

  el.innerHTML = responsiveNote + kclHtml + hclHtml
}

type DisorderKey = 'am' | 'alm' | 'ar' | 'arc' | 'alr' | 'alrc'

export function calcKompensasi(): void {
  const pco2     = parseFloat(getInputEl('acbc3-pco2')?.value ?? '')
  const hco3     = parseFloat(getInputEl('acbc3-hco3')?.value ?? '')
  const disorder = (getEl<HTMLSelectElement>('acbc3-disorder')?.value ?? '') as DisorderKey | ''

  const el = getEl('acbc3-result')
  if (!el) return
  if (!disorder) { el.innerHTML = '<div class="acbc-note">Pilih gangguan primer untuk melihat formula kompensasi.</div>'; return }
  if (isNaN(pco2) && isNaN(hco3)) { el.innerHTML = ''; return }

  const results: CompensationResult[] = []

  const addResult = (
    cls: string, title: string, val: string, range: string,
    formula: string, status: string, ref: string,
  ) => results.push({ cls, title, val, range, formula, status, ref })

  if (disorder === 'am' && !isNaN(hco3)) {
    const mid = 1.5 * hco3 + 8, lo = mid - 2, hi = mid + 2
    let status = '', cls = 'info'
    if (!isNaN(pco2)) {
      if      (pco2 < lo - 2)  { status = `PaCO₂ aktual (${pco2}) LEBIH RENDAH → tambahan Alkalosis Respiratorik`; cls = 'warn' }
      else if (pco2 > hi + 2)  { status = `PaCO₂ aktual (${pco2}) LEBIH TINGGI → tambahan Asidosis Respiratorik`; cls = 'warn' }
      else                     { status = `PaCO₂ aktual (${pco2}) sesuai kompensasi → gangguan tunggal`; cls = 'ok' }
    }
    addResult(cls, "Asidosis Metabolik — Kompensasi Respiratorik (Winter's)", `${mid.toFixed(1)} mmHg`, `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, `PaCO₂ ekspektasi = 1.5 × HCO₃⁻ (${hco3}) + 8 ± 2`, status, 'Winter SD. Ann Intern Med 1967')
  } else if (disorder === 'alm' && !isNaN(hco3)) {
    const expPco2 = 0.7 * hco3 + 21, lo = expPco2 - 2, hi = expPco2 + 2
    let status = '', cls = 'info'
    if (!isNaN(pco2)) {
      if      (pco2 < lo - 2)  { status = `PaCO₂ aktual (${pco2}) lebih rendah → tambahan Alkalosis Respiratorik`; cls = 'warn' }
      else if (pco2 > hi + 2)  { status = `PaCO₂ aktual (${pco2}) lebih tinggi → tambahan Asidosis Respiratorik`; cls = 'warn' }
      else                     { status = `PaCO₂ aktual (${pco2}) sesuai kompensasi`; cls = 'ok' }
    }
    addResult(cls, 'Alkalosis Metabolik — Kompensasi Respiratorik', `${expPco2.toFixed(1)} mmHg`, `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, `PaCO₂ ekspektasi = 0.7 × HCO₃⁻ (${hco3}) + 21 ± 2`, status, 'Martínez-Rueda. Rev Invest Clin 2020')
  } else if ((disorder === 'ar' || disorder === 'arc') && !isNaN(pco2)) {
    const acute = disorder === 'ar'
    const expHco3 = acute ? 24 + 0.1 * (pco2 - 40) : 24 + 0.35 * (pco2 - 40)
    const tol     = acute ? 1 : 3
    const lo = expHco3 - tol, hi = expHco3 + tol
    let status = '', cls = 'info'
    if (!isNaN(hco3)) {
      if      (hco3 < lo - 1)  { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn' }
      else if (hco3 > hi + 1)  { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn' }
      else                     { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi ${acute ? 'akut' : 'kronik'}`; cls = 'ok' }
    }
    const formula = acute
      ? `HCO₃⁻ ekspektasi = 24 + 0.1 × (PaCO₂ ${pco2} − 40) ± 1`
      : `HCO₃⁻ ekspektasi = 24 + 0.35 × (PaCO₂ ${pco2} − 40) ± 3`
    addResult(cls, `Asidosis Respiratorik ${acute ? 'Akut' : 'Kronik'} — Kompensasi Renal ${acute ? 'Akut' : 'Kronik'}`, `${expHco3.toFixed(1)} mEq/L`, `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula, status, 'Adrogue HJ. NEJM 1998')
  } else if ((disorder === 'alr' || disorder === 'alrc') && !isNaN(pco2)) {
    const acute = disorder === 'alr'
    const expHco3 = acute ? 24 - 0.2 * (40 - pco2) : 24 - 0.5 * (40 - pco2)
    const tol     = acute ? 1 : 2
    const lo = expHco3 - tol, hi = expHco3 + tol
    let status = '', cls = 'info'
    if (!isNaN(hco3)) {
      if      (hco3 < lo - 1)  { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn' }
      else if (hco3 > hi + 1)  { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn' }
      else                     { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi ${acute ? 'akut' : 'kronik'}`; cls = 'ok' }
    }
    const formula = acute
      ? `HCO₃⁻ ekspektasi = 24 − 0.2 × (40 − PaCO₂ ${pco2}) ± 1`
      : `HCO₃⁻ ekspektasi = 24 − 0.5 × (40 − PaCO₂ ${pco2}) ± 2`
    addResult(cls, `Alkalosis Respiratorik ${acute ? 'Akut' : 'Kronik'} — Kompensasi Renal ${acute ? 'Akut' : 'Kronik'}`, `${expHco3.toFixed(1)} mEq/L`, `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula, status, 'Adrogue HJ. NEJM 1998')
  }

  if (results.length === 0) { el.innerHTML = '<div class="acbc-note">Isi pH / PaCO₂ / HCO₃⁻ untuk melihat hasil kompensasi.</div>'; return }

  el.innerHTML = results.map(r => `
    <div class="acbc-result ${r.cls}">
      <div class="acbc-result-title">${r.title}</div>
      <div class="acbc-val">${r.val} <span style="font-size:13px;font-weight:400">${r.range}</span></div>
      ${r.status ? `<div style="font-size:11px;margin-top:4px;font-weight:600">${r.status}</div>` : ''}
      <div class="acbc-formula">${r.formula}</div>
      <span class="ref-tag">📚 ${r.ref}</span>
    </div>`).join('')
}

export function calcAGStandalone(): void {
  const na   = parseFloat(getInputEl('acbc4-na')?.value ?? '')
  const cl   = parseFloat(getInputEl('acbc4-cl')?.value ?? '')
  const hco3 = parseFloat(getInputEl('acbc4-hco3')?.value ?? '')
  const alb  = parseFloat(getInputEl('acbc4-alb')?.value ?? '')

  const el = getEl('acbc4-result')
  if (!el) return
  if (isNaN(na) || isNaN(cl) || isNaN(hco3)) { el.innerHTML = ''; return }

  const ag = na - (cl + hco3)
  const albCorr = !isNaN(alb) ? (alb - 4.0) * 2.5 : 0
  const agCorr  = ag - albCorr
  const agHigh  = agCorr > 16, agLow = agCorr < 8

  const [agClass, agLabel] = agHigh
    ? ['bad', '↑ HAGMA']
    : agLow ? ['info', '↓ Rendah (pertimbangkan hipoalbuminemia/mieloma)'] : ['ok', 'Normal']

  let ddHtml = ''
  if (agHigh) {
    const dd = (agCorr - 12) / (12 - hco3)
    let ddInterp: string, ddCls: string
    if      (dd < 0.4)   { ddInterp = '< 0.4 → NAGMA lebih dominan (mixed HAGMA + NAGMA)'; ddCls = 'warn' }
    else if (dd <= 0.8)  { ddInterp = '0.4–0.8 → HAGMA + NAGMA campuran'; ddCls = 'warn' }
    else if (dd <= 2.0)  { ddInterp = '0.8–2.0 → HAGMA murni (tipikal)'; ddCls = 'ok' }
    else                 { ddInterp = '> 2.0 → kemungkinan ada tambahan Alkalosis Metabolik'; ddCls = 'warn' }
    ddHtml = `
      <div class="acbc-result ${ddCls}">
        <div class="acbc-result-title">Delta-Delta Ratio</div>
        <div class="acbc-val">${isFinite(dd) ? dd.toFixed(2) : '—'}</div>
        <div style="font-size:11px">${ddInterp}</div>
        <div class="acbc-formula">Δ/Δ = (AG koreksi ${agCorr.toFixed(1)} − 12) / (24 − HCO₃⁻ ${hco3})</div>
        <span class="ref-tag">📚 Wrenn K. Ann Emerg Med 1990; Rastegar A. JASN 2007</span>
      </div>`
  }

  const sid = na - cl
  const sidNote = sid > 38 ? 'SID > 38 → alkalosis respiratorik atau metabolik'
    : sid < 32 ? 'SID < 32 → mungkin ada asidosis hiperklor atau hyponatremia' : 'SID normal (32–38)'

  el.innerHTML = `
    <div class="acbc-result ${agClass}">
      <div class="acbc-result-title">Anion Gap ${!isNaN(alb) ? '(Terkoreksi Albumin)' : ''}</div>
      <div class="acbc-val">${agCorr.toFixed(1)} mEq/L <span style="font-size:13px;font-weight:400">${agLabel}</span></div>
      ${!isNaN(alb) && alb !== 4.0 ? `<div style="font-size:11px">AG raw: ${ag.toFixed(1)} | Koreksi albumin: ${albCorr >= 0 ? '+' : ''}${albCorr.toFixed(1)} | Albumin: ${alb} g/dL</div>` : ''}
      <div class="acbc-formula">AG = Na⁺ (${na}) − [Cl⁻ (${cl}) + HCO₃⁻ (${hco3})] = ${ag.toFixed(1)}${!isNaN(alb) ? ` | Koreksi alb: ${agCorr.toFixed(1)}` : ''}</div>
      <span class="ref-tag">📚 Fidkowski C. Anesthesiology 2009; Kraut JA. CJASN 2007</span>
    </div>
    ${ddHtml}
    <div class="acbc-result info">
      <div class="acbc-result-title">Strong Ion Difference (SID simpel)</div>
      <div class="acbc-val">${sid.toFixed(1)} mEq/L</div>
      <div style="font-size:11px">${sidNote}</div>
      <div class="acbc-formula">SID = Na⁺ (${na}) − Cl⁻ (${cl})</div>
      <span class="ref-tag">📚 Stewart PA. Can J Physiol Pharmacol 1983</span>
    </div>`
}

export function updateKompLabel(): void { calcKompensasi() }

// ─── Global exposure ─────────────────────────────────────────

const g = window as unknown as Record<string, unknown>
g.toggleTheory   = toggleTheory
g.toggleUnit     = toggleUnit
g.setFiO2Mode    = setFiO2Mode
g.syncFiO2Direct = syncFiO2Direct
g.estimateFiO2   = estimateFiO2
g.setSpo2Source  = setSpo2Source
g.resetABG       = resetABG
g.calcABG        = calcABG
g.switchACBC     = switchACBC
g.importFromABG  = importFromABG
g.calcBicarb     = calcBicarb
g.calcAlk        = calcAlk
g.calcKompensasi = calcKompensasi
g.updateKompLabel = updateKompLabel
g.calcAGStandalone = calcAGStandalone
