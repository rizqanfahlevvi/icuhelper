// ============================================================
// kalkulator-pf.ts — P/F Ratio & Oxygenation Calculator
// Halaman: kalkulator-pf.html
// ============================================================


// ─── Pure calculation logic ───────────────────────────────────

interface PFCoreResult {
  pf: number
  ardsBerlin: string
  oi: number | null
  osi: number | null
  drivingPressure: number | null
  failType: string | null
  failDesc: string | null
  aaGradient: null
  roxIndex: null
}

export function calcPFCore(
  pao2: number,
  fio2: number,
  mapCmh2o?: number,
  spo2?: number,
  pplat?: number,
  peep?: number,
  paco2?: number,
): PFCoreResult {
  const pf = pao2 / fio2

  const ardsBerlin =
    pf >= 400 ? 'Normal' :
    pf >= 300 ? 'Hipoksemia Ringan' :
    pf >= 200 ? 'ARDS Mild (Berlin)' :
    pf >= 100 ? 'ARDS Moderate (Berlin)' : 'ARDS Severe (Berlin)'

  const oi = mapCmh2o !== undefined
    ? (mapCmh2o * fio2 * 100) / pao2
    : null

  const osi = (spo2 !== undefined && mapCmh2o !== undefined)
    ? (mapCmh2o * fio2 * 100) / spo2
    : null

  const drivingPressure = (pplat !== undefined && peep !== undefined)
    ? pplat - peep
    : null

  let failType: string | null = null
  let failDesc: string | null = null
  if (paco2 !== undefined) {
    if (paco2 > 50) {
      failType = 'Tipe II (Hiperkapnik)'
      failDesc = `Kegagalan ventilasi. PaCO₂ > 50 mmHg. Pertimbangkan NIV / intubasi jika asidosis berat. (PaCO₂ = ${paco2} mmHg)`
    } else if (pf < 300 || pao2 < 60) {
      failType = 'Tipe I (Hipoksemik)'
      failDesc = `Kegagalan oksigenasi tanpa retensi CO₂ yang signifikan. (PaCO₂ = ${paco2} mmHg)`
    } else {
      failType = 'Bukan Tipe I/II yang jelas'
      failDesc = `Oksigenasi baik, PaCO₂ normal/rendah. (PaCO₂ = ${paco2} mmHg)`
    }
  }

  return { pf, ardsBerlin, oi, osi, drivingPressure, failType, failDesc, aaGradient: null, roxIndex: null }
}

// ─── Render ───────────────────────────────────────────────────

function renderPFResult(
  pao2: number,
  fio2: number,
  mapCmh2o?: number,
  spo2?: number,
  pplat?: number,
  peep?: number,
  paco2?: number,
): string {
  const r = calcPFCore(pao2, fio2, mapCmh2o, spo2, pplat, peep, paco2)

  const pfColor =
    r.pf >= 400 ? 'var(--green)' :
    r.pf >= 300 ? 'var(--teal)' :
    r.pf >= 200 ? 'var(--amber)' :
    r.pf >= 100 ? 'var(--orange)' : 'var(--red)'
  const pfClass = r.pf >= 300 ? 'abg-normal' : r.pf >= 200 ? 'abg-mild' : 'abg-severe'

  let html = `
    <div class="abg-result ${pfClass}">
      <div class="abg-label" style="color:${pfColor}">P/F Ratio — Klasifikasi Oksigenasi</div>
      <div class="abg-interp">${r.pf.toFixed(0)} mmHg — ${r.ardsBerlin}</div>
      <div class="abg-detail">PaO₂ ${pao2} ÷ FiO₂ ${fio2} = ${r.pf.toFixed(1)}</div>
    </div>`

  if (r.oi !== null && mapCmh2o !== undefined) {
    const oiClass = r.oi < 5 ? 'Ringan' : r.oi < 25 ? 'Moderate' : r.oi < 40 ? 'Berat' : 'Sangat Berat — pertimbangkan ECMO'
    const oiColor = r.oi < 5 ? 'var(--green)' : r.oi < 25 ? 'var(--amber)' : 'var(--red)'
    html += `
    <div class="abg-result abg-mild" style="margin-top:6px">
      <div class="abg-label" style="color:${oiColor}">Oxygenation Index (OI)</div>
      <div class="abg-interp">${r.oi.toFixed(1)} — ${oiClass}</div>
      <div class="abg-detail">OI = (MAP ${mapCmh2o} × FiO₂ ${fio2} × 100) / PaO₂ ${pao2}</div>
    </div>`
  }

  if (r.drivingPressure !== null && pplat !== undefined && peep !== undefined) {
    const dp = r.drivingPressure
    const dpColor = dp <= 13 ? 'var(--green)' : dp <= 15 ? 'var(--amber)' : 'var(--red)'
    html += `
    <div class="abg-result ${dp <= 15 ? 'abg-mild' : 'abg-severe'}" style="margin-top:6px">
      <div class="abg-label" style="color:${dpColor}">Driving Pressure</div>
      <div class="abg-interp">${dp} cmH₂O — ${dp <= 13 ? 'Optimal (≤13)' : dp <= 15 ? 'Batas (≤15)' : '⚠ Tinggi — risiko VILI'}</div>
      <div class="abg-detail">Pplat ${pplat} − PEEP ${peep} = ${dp} cmH₂O · Target ≤15 (ideal ≤13)</div>
    </div>`
  }

  if (r.osi !== null && mapCmh2o !== undefined && spo2 !== undefined) {
    html += `
    <div class="abg-result abg-blue" style="margin-top:6px">
      <div class="abg-label" style="color:var(--blue)">OSI (SpO₂-based OI — jika tidak ada ABG)</div>
      <div class="abg-interp">OSI = ${r.osi.toFixed(1)}</div>
      <div class="abg-detail">OSI = (MAP ${mapCmh2o} × FiO₂ × 100) / SpO₂ ${spo2}%</div>
    </div>`
  }

  if (r.failType !== null) {
    const failColor =
      r.failType.includes('II') ? 'var(--red)' :
      r.failType.includes('I)') ? 'var(--amber)' : 'var(--green)'
    html += `
    <div class="abg-result" style="margin-top:6px; border-left-color:${failColor}">
      <div class="abg-label" style="color:${failColor}">Tipe Gagal Napas</div>
      <div class="abg-interp">${r.failType}</div>
      <div class="abg-detail">${r.failDesc}</div>
    </div>`
  }

  return html
}

// ─── DOM handler ─────────────────────────────────────────────

function getOptionalFloat(id: string): number | undefined {
  const val = parseFloat((document.getElementById(id) as HTMLInputElement)?.value)
  return isNaN(val) ? undefined : val
}

export function calcPF(): void {
  const pao2 = getOptionalFloat('pfPaO2')
  const fio2 = getOptionalFloat('pf-fio2')
  if (!pao2 || !fio2) { alert('Masukkan PaO₂ dan FiO₂'); return }

  const mapV   = getOptionalFloat('pfMAP')
  const spo2   = getOptionalFloat('pfSpO2')
  const pplat  = getOptionalFloat('pfPplat')
  const peep   = getOptionalFloat('pfPEEP')
  const paco2  = getOptionalFloat('pfPaCO2')

  const content = document.getElementById('pf-result-content')
  const results = document.getElementById('pf-results')
  if (content) content.innerHTML = renderPFResult(pao2, fio2, mapV, spo2, pplat, peep, paco2)
  results?.classList.remove('hidden')
}

export function toggleTheory(id: string): void {
  const btn = (event as MouseEvent).currentTarget as HTMLElement
  const content = document.getElementById('theory-' + id)
  if (!content) return
  btn.classList.toggle('open')
  content.classList.toggle('visible')
}

;(window as unknown as Record<string, unknown>).calcPF = calcPF
;(window as unknown as Record<string, unknown>).toggleTheory = toggleTheory
