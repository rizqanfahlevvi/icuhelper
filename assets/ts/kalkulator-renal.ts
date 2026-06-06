// ============================================================
// kalkulator-renal.ts — Renal Calculator (TypeScript)
// Halaman: kalkulator-renal.html
// Mencakup: eGFR, AKI staging, FENa, Osmolalitas, BUN/Cr
// ============================================================

import type { Sex } from './types.js'

// ─── Unit toggle config ───────────────────────────────────────

type UnitConfig = {
  units: [string, string]
  factors: [number, number]
  decimals: [number, number]
  placeholders: [string, string]
}

const UNIT_MAP: Record<string, UnitConfig> = {
  'osm-glu':      { units: ['mg/dL', 'mmol/L'], factors: [1/18, 18],         decimals: [0, 2], placeholders: ['cth: 180', 'cth: 10.0'] },
  'egfr-scr':     { units: ['mg/dL', 'µmol/L'], factors: [88.42, 1/88.42],   decimals: [2, 0], placeholders: ['cth: 1.2', 'cth: 106'] },
  'aki-scr-base': { units: ['mg/dL', 'µmol/L'], factors: [88.42, 1/88.42],   decimals: [2, 0], placeholders: ['cth: 0.9', 'cth: 80'] },
  'aki-scr-now':  { units: ['mg/dL', 'µmol/L'], factors: [88.42, 1/88.42],   decimals: [2, 0], placeholders: ['cth: 2.1', 'cth: 186'] },
  'fena-scr':     { units: ['mg/dL', 'µmol/L'], factors: [88.42, 1/88.42],   decimals: [2, 0], placeholders: ['cth: 2.1', 'cth: 186'] },
  'fena-ucr':     { units: ['mg/dL', 'µmol/L'], factors: [88.42, 1/88.42],   decimals: [0, 0], placeholders: ['cth: 120', 'cth: 10614'] },
  'buncr-cr':     { units: ['mg/dL', 'µmol/L'], factors: [88.42, 1/88.42],   decimals: [2, 0], placeholders: ['cth: 1.8', 'cth: 159'] },
}

export function toggleKalcUnit(id: string): void {
  const cfg = UNIT_MAP[id]
  if (!cfg) return
  const key = 'kalc-unit-' + id
  const current = localStorage.getItem(key) ?? cfg.units[0]
  const isBase = current === cfg.units[0]
  const next = isBase ? cfg.units[1] : cfg.units[0]
  const inp = document.getElementById(id) as HTMLInputElement | null
  if (inp?.value) {
    const v = parseFloat(inp.value)
    if (!isNaN(v)) inp.value = (v * cfg.factors[isBase ? 0 : 1]).toFixed(cfg.decimals[isBase ? 1 : 0])
  }
  if (inp) inp.placeholder = isBase ? cfg.placeholders[1] : cfg.placeholders[0]
  localStorage.setItem(key, next)
  const btn = document.querySelector<HTMLElement>(`[data-unit="${id}"]`)
  if (btn) btn.textContent = next
}

function asMgDL(id: string, umolFactor: number): number {
  const v = parseFloat((document.getElementById(id) as HTMLInputElement).value)
  return (localStorage.getItem('kalc-unit-' + id) ?? 'mg/dL') !== 'mg/dL' ? v * umolFactor : v
}

function getFloat(id: string): number {
  return parseFloat((document.getElementById(id) as HTMLInputElement).value)
}

// ─── Init unit toggles on load ────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  for (const id of Object.keys(UNIT_MAP)) {
    const stored = localStorage.getItem('kalc-unit-' + id)
    if (stored) {
      const btn = document.querySelector<HTMLElement>(`[data-unit="${id}"]`)
      if (btn) btn.textContent = stored
      const inp = document.getElementById(id) as HTMLInputElement | null
      const cfg = UNIT_MAP[id]
      if (inp && cfg) inp.placeholder = stored === cfg.units[0] ? cfg.placeholders[0] : cfg.placeholders[1]
    }
  }
})

// ─── eGFR CKD stage helper ────────────────────────────────────

function ckdStage(egfr: number): { s: string; label: string; color: string; css: string } {
  if (egfr >= 90) return { s: 'G1',  label: '≥90 — Normal atau tinggi',         color: 'var(--green)', css: 'teal' }
  if (egfr >= 60) return { s: 'G2',  label: '60–89 — Sedikit menurun',           color: 'var(--teal)',  css: 'teal' }
  if (egfr >= 45) return { s: 'G3a', label: '45–59 — Penurunan ringan-sedang',   color: 'var(--amber)', css: 'amber' }
  if (egfr >= 30) return { s: 'G3b', label: '30–44 — Penurunan sedang-berat',    color: 'var(--amber)', css: 'amber' }
  if (egfr >= 15) return { s: 'G4',  label: '15–29 — Penurunan berat',           color: 'var(--red)',   css: 'red' }
  return              { s: 'G5',  label: '<15 — Gagal Ginjal',                color: 'var(--red)',   css: 'red' }
}

// ─── Ureum converter ─────────────────────────────────────────

export function convertUreum(from: 'mgdl' | 'mmol'): void {
  let mgdl: number, mmol: number, bun: number
  if (from === 'mgdl') {
    mgdl = getFloat('uBUN-ureum-mgdl')
    if (isNaN(mgdl) || mgdl < 0) {
      ;(document.getElementById('uBUN-ureum-mmol') as HTMLInputElement).value = ''
      ;(document.getElementById('uBUN-bun') as HTMLInputElement).value = ''
      document.getElementById('ureum-conv-note')?.classList.add('hidden')
      return
    }
    mmol = mgdl / 6.006; bun = mgdl * 0.4667
    ;(document.getElementById('uBUN-ureum-mmol') as HTMLInputElement).value = mmol.toFixed(2)
    ;(document.getElementById('uBUN-bun') as HTMLInputElement).value = bun.toFixed(1)
  } else {
    mmol = getFloat('uBUN-ureum-mmol')
    if (isNaN(mmol) || mmol < 0) {
      ;(document.getElementById('uBUN-ureum-mgdl') as HTMLInputElement).value = ''
      ;(document.getElementById('uBUN-bun') as HTMLInputElement).value = ''
      document.getElementById('ureum-conv-note')?.classList.add('hidden')
      return
    }
    mgdl = mmol * 6.006; bun = mmol * 2.8
    ;(document.getElementById('uBUN-ureum-mgdl') as HTMLInputElement).value = mgdl.toFixed(1)
    ;(document.getElementById('uBUN-bun') as HTMLInputElement).value = bun.toFixed(1)
  }
  const curbOk = mgdl > 42, psiOk = mgdl > 64
  const note = document.getElementById('ureum-conv-note')
  if (note) {
    note.innerHTML =
      `Ureum <strong>${mgdl.toFixed(1)} mg/dL</strong> = <strong>${mmol.toFixed(2)} mmol/L</strong> = BUN <strong>${bun.toFixed(1)} mg/dL</strong> &nbsp;|&nbsp; ` +
      `CURB-65 U-criterion (&gt;7 mmol/L): ${curbOk ? '<span style="color:var(--red);font-weight:600">✔ Skor 1</span>' : '<span style="color:var(--green)">✘ Skor 0</span>'} &nbsp;|&nbsp; ` +
      `PSI BUN &gt;30 (&gt;64 mg/dL): ${psiOk ? '<span style="color:var(--red);font-weight:600">✔ +20 poin</span>' : '<span style="color:var(--green)">✘ 0 poin</span>'}`
    note.classList.remove('hidden')
  }
}

// ─── eGFR calculator ─────────────────────────────────────────

export function calcEGFR(): void {
  const sex = (document.getElementById('egfr-sex') as HTMLSelectElement).value as Sex
  const age  = getFloat('egfr-age')
  const bw   = getFloat('egfr-bw')
  const scr  = asMgDL('egfr-scr', 1/88.42)
  const cysc = getFloat('egfr-cysc')
  const ureum = getFloat('egfr-ureum')
  if (!age || !scr) { alert('Masukkan usia dan kreatinin serum'); return }

  const female = sex === 'f'
  const kappa = female ? 0.7 : 0.9
  const alpha = female ? -0.241 : -0.302
  const sexF  = female ? 1.012 : 1.0
  const r = scr / kappa
  const ckdEPI = 142 * Math.pow(Math.min(r, 1), alpha) * Math.pow(Math.max(r, 1), -1.2) * Math.pow(0.9938, age) * sexF

  const cg = (!isNaN(bw) && bw > 0) ? ((140 - age) * bw) / (72 * scr) * (female ? 0.85 : 1.0) : null
  const mdrd = 175 * Math.pow(scr, -1.154) * Math.pow(age, -0.203) * (female ? 0.742 : 1.0)

  let ckdCys: number | null = null
  if (!isNaN(cysc) && cysc > 0) {
    const kc = female ? 0.7 : 0.9, ac = female ? -0.219 : -0.144, sf = female ? 0.963 : 1.0
    const cr2 = scr / kc, cy2 = cysc / 0.8
    ckdCys = 135 * Math.pow(Math.min(cr2, 1), ac) * Math.pow(Math.max(cr2, 1), -0.544) *
      Math.pow(Math.min(cy2, 1), -0.323) * Math.pow(Math.max(cy2, 1), -0.778) *
      Math.pow(0.9961, age) * sf
  }

  const st = ckdStage(ckdEPI)
  let html = '<div class="result-grid">'
  html += `<div class="result-card" style="border-color:${st.color}"><div class="result-label">CKD-EPI 2021 ★</div><div class="result-value" style="color:${st.color}">${ckdEPI.toFixed(1)}</div><div class="result-sub">mL/mnt/1.73m² · Stadium ${st.s}</div></div>`
  if (cg !== null) html += `<div class="result-card"><div class="result-label">Cockcroft-Gault (CrCl)</div><div class="result-value">${cg.toFixed(1)}</div><div class="result-sub">mL/mnt · Untuk dosis obat</div></div>`
  html += `<div class="result-card"><div class="result-label">MDRD-4 (legacy)</div><div class="result-value">${mdrd.toFixed(1)}</div><div class="result-sub">mL/mnt/1.73m²</div></div>`
  if (ckdCys !== null) html += `<div class="result-card" style="border-color:var(--purple)"><div class="result-label">CKD-EPI Cys-C 2021</div><div class="result-value" style="color:var(--purple)">${ckdCys.toFixed(1)}</div><div class="result-sub">mL/mnt/1.73m² · Lebih akurat</div></div>`
  html += '</div>'
  html += `<div class="cc ${st.css}" style="margin-top:10px"><div class="ct">Stadium CKD — ${st.s}</div><p>${st.label} mL/mnt/1.73m²</p></div>`

  if (!isNaN(ureum) && ureum > 0) {
    const bun = (ureum * 0.4667).toFixed(1)
    const umm = (ureum / 6.006).toFixed(2)
    const ratio = (parseFloat(bun) / scr).toFixed(1)
    const rNum = parseFloat(ratio)
    const [ri, rc] = rNum > 20
      ? ['Sugestif pre-renal atau perdarahan GI atas', 'var(--amber)']
      : rNum < 10
      ? ['Sugestif penyakit ginjal intrinsik', 'var(--blue)']
      : ['Normal', 'var(--teal)']
    html += `<div class="formula-note" style="margin-top:10px"><strong>Ureum/BUN:</strong> ${ureum} mg/dL = ${umm} mmol/L = BUN ${bun} mg/dL<br><strong>Rasio BUN/SCr:</strong> ${ratio} — <span style="color:${rc}">${ri}</span></div>`
  }

  html += `<div class="formula-note" style="margin-top:8px">★ CKD-EPI 2021 race-free adalah formula primer per KDIGO 2024. CG untuk penyesuaian dosis. &nbsp;|&nbsp; Inker LA et al. NEJM 2021;385:1737 · Kidney Int Suppl 2024</div>`
  const content = document.getElementById('egfr-result-content')
  if (content) content.innerHTML = html
  document.getElementById('egfr-results')?.classList.remove('hidden')
}

// ─── AKI staging ─────────────────────────────────────────────

export function calcAKI(): void {
  const scrBase = asMgDL('aki-scr-base', 1/88.42)
  const scrNow  = asMgDL('aki-scr-now',  1/88.42)
  const bw      = getFloat('aki-bw')
  const uoVol   = getFloat('aki-uo-vol')
  const uoHr    = getFloat('aki-uo-hr')
  let html = ''

  if (!isNaN(scrBase) && !isNaN(scrNow)) {
    const rise = scrNow - scrBase, ratio = scrNow / scrBase
    const [stage, slabel, scolor, scls] =
      scrNow >= 4.0 || ratio >= 3.0 ? [3, 'Stage 3 — Berat',    'var(--red)',    'severe'] :
      ratio >= 2.0                  ? [2, 'Stage 2 — Sedang',   'var(--amber)', 'mild'] :
      rise >= 0.3 || ratio >= 1.5   ? [1, 'Stage 1 — Ringan',   'var(--orange)','mild'] :
                                      [0, 'Tidak memenuhi kriteria AKI', 'var(--teal)', 'normal']
    html += `<div class="abg-result abg-${scls}">
      <div class="abg-label" style="color:${scolor}">Berdasarkan SCr${stage > 0 ? ' — AKI KDIGO Stage ' + stage : ''}</div>
      <div class="abg-interp">${slabel}</div>
      <div class="abg-detail">
        Kenaikan absolut: ${rise >= 0 ? '+' : ''}${rise.toFixed(2)} mg/dL ${rise >= 0.3 ? '<strong>✔ ≥0.3 mg/dL dalam 48 jam</strong>' : ''}<br>
        Rasio SCr: ×${ratio.toFixed(2)} (baseline ${scrBase} → sekarang ${scrNow} mg/dL)
      </div>
    </div>`
  }

  if (!isNaN(bw) && !isNaN(uoVol) && !isNaN(uoHr) && bw > 0 && uoHr > 0) {
    const rate = uoVol / (bw * uoHr)
    const [us, ul, uc, ucls] =
      rate < 0.3 && uoHr >= 24 ? [3, 'Stage 3 — UO <0.3 mL/kg/jam ≥24 jam',       'var(--red)',    'severe'] :
      rate < 0.5 && uoHr >= 12 ? [2, 'Stage 2 — UO <0.5 mL/kg/jam ≥12 jam',       'var(--amber)', 'mild'] :
      rate < 0.5 && uoHr >= 6  ? [1, 'Stage 1 — UO <0.5 mL/kg/jam dalam 6–12 jam','var(--orange)','mild'] :
                                  [0, 'UO dalam batas normal',                       'var(--teal)',  'normal']
    html += `<div class="abg-result abg-${ucls}" style="margin-top:8px">
      <div class="abg-label" style="color:${uc}">Berdasarkan Urine Output${us > 0 ? ' — AKI KDIGO Stage ' + us : ''}</div>
      <div class="abg-interp">${ul}</div>
      <div class="abg-detail">Rate UO: <strong>${rate.toFixed(3)} mL/kg/jam</strong> (${uoVol} mL / ${uoHr} jam / ${bw} kg)</div>
    </div>`
  }

  if (!html) html = '<div class="info">Masukkan setidaknya salah satu: (a) SCr baseline + saat ini, atau (b) BB + volume urin + durasi</div>'
  else html += `<div class="formula-note" style="margin-top:8px">KDIGO 2012: staging diambil dari kriteria yang paling berat (SCr atau UO). Stage 3 juga jika ada kebutuhan RRT. &nbsp;|&nbsp; Kidney Int Suppl 2012;2:1</div>`

  const content = document.getElementById('aki-result-content')
  if (content) content.innerHTML = html
  document.getElementById('aki-results')?.classList.remove('hidden')
}

// ─── FENa ────────────────────────────────────────────────────

export function calcFENa(): void {
  const sna  = getFloat('fena-sna')
  const scr  = asMgDL('fena-scr', 1/88.42)
  const una  = getFloat('fena-una')
  const ucr  = asMgDL('fena-ucr', 1/88.42)
  const sureum = getFloat('fena-sureum')
  const uureum = getFloat('fena-uureum')
  if (!sna || !scr || !una || !ucr) { alert('Masukkan Na serum, SCr, Na urin, dan Cr urin'); return }

  const fena = (una * scr) / (sna * ucr) * 100
  const [fi, fc, fcls] =
    fena < 1 ? ['Pre-renal AKI — retensi Na, respons tubulus masih normal', 'var(--teal)',  'normal'] :
    fena < 2 ? ['Inkonklusif — evaluasi konteks klinis (diuretik? obstruksi?)',  'var(--amber)', 'mild'] :
               ['Renal intrinsik AKI — tubular injury, kemampuan retensi Na hilang', 'var(--red)', 'severe']

  let html = '<div class="result-grid">'
  html += `<div class="result-card" style="border-color:${fc}"><div class="result-label">FENa</div><div class="result-value" style="color:${fc}">${fena.toFixed(2)}%</div><div class="result-sub">${fena < 1 ? 'Pre-renal (<1%)' : fena < 2 ? 'Equivocal (1–2%)' : 'Renal intrinsik (>2%)'}</div></div>`

  let fuHtml = ''
  if (!isNaN(sureum) && !isNaN(uureum) && sureum > 0 && uureum > 0) {
    const feurea = (uureum * scr) / (sureum * ucr) * 100
    const [fui, fuc, fucls] =
      feurea < 35 ? ['Pre-renal (valid meski ada diuretik)', 'var(--teal)',  'normal'] :
      feurea < 50 ? ['Inkonklusif', 'var(--amber)', 'mild'] :
                    ['Renal intrinsik', 'var(--red)', 'severe']
    html += `<div class="result-card" style="border-color:${fuc}"><div class="result-label">FEUrea</div><div class="result-value" style="color:${fuc}">${feurea.toFixed(2)}%</div><div class="result-sub">${feurea < 35 ? 'Pre-renal (<35%)' : feurea < 50 ? 'Equivocal' : 'Renal (>50%)'}</div></div>`
    fuHtml = `<div class="abg-result abg-${fucls}" style="margin-top:8px"><div class="abg-label" style="color:${fuc}">FEUrea: ${feurea.toFixed(2)}%</div><div class="abg-interp">${fui}</div><div class="abg-detail">FEUrea = (Ureum urin ${uureum} × SCr ${scr}) / (Ureum serum ${sureum} × Cr urin ${ucr}) × 100</div></div>`
  }
  html += '</div>'
  html += `<div class="abg-result abg-${fcls}" style="margin-top:10px"><div class="abg-label" style="color:${fc}">FENa: ${fena.toFixed(2)}%</div><div class="abg-interp">${fi}</div><div class="abg-detail">FENa = (UNa ${una} × SCr ${scr}) / (SNa ${sna} × UCr ${ucr}) × 100</div></div>`
  html += fuHtml
  html += `<div class="formula-note" style="margin-top:8px">FENa tidak valid pada pasien diuretik → gunakan FEUrea. &nbsp;|&nbsp; Miller TR. Ann Intern Med 1978;89:47 · Espinal CH. Am Fam Physician 2000</div>`

  const content = document.getElementById('fena-result-content')
  if (content) content.innerHTML = html
  document.getElementById('fena-results')?.classList.remove('hidden')
}

// ─── Osmolality ──────────────────────────────────────────────

export function calcOsmolality(): void {
  const na       = getFloat('osm-na')
  const glu      = asMgDL('osm-glu', 18)
  const ureum    = getFloat('osm-ureum')
  const measured = getFloat('osm-measured')
  if (!na || !glu || !ureum) { alert('Masukkan Na, Glukosa, dan Ureum'); return }

  const ureumMmol = ureum / 6.006
  const osmCalc = 2 * na + glu / 18 + ureumMmol
  const osmColor =
    osmCalc < 285  ? 'var(--blue)' :
    osmCalc <= 295 ? 'var(--teal)' :
    osmCalc <= 320 ? 'var(--amber)' : 'var(--red)'

  let html = '<div class="result-grid">'
  html += `<div class="result-card"><div class="result-label">Osmolalitas Kalkulasi</div><div class="result-value" style="color:${osmColor}">${osmCalc.toFixed(1)}</div><div class="result-sub">mOsm/kg · Normal 285–295</div></div>`
  html += `<div class="result-card"><div class="result-label">Ureum (konversi)</div><div class="result-value">${ureumMmol.toFixed(2)}</div><div class="result-sub">mmol/L (dari ${ureum} mg/dL)</div></div>`

  if (!isNaN(measured)) {
    const gap = measured - osmCalc
    const [gi, gc, gcls] =
      gap <= 10 ? ['Normal (<10 mOsm/kg)', 'var(--teal)', 'normal'] :
      gap <= 20 ? ['Sedikit meningkat — evaluasi klinis', 'var(--amber)', 'mild'] :
                  ['⚠ Meningkat signifikan → curiga etanol, metanol, etilenglikol, manitol', 'var(--red)', 'severe']
    html += `<div class="result-card" style="border-color:${gc}"><div class="result-label">Osmol Gap</div><div class="result-value" style="color:${gc}">${gap.toFixed(1)}</div><div class="result-sub">mOsm/kg — ${gap <= 10 ? 'Normal' : '⚠ Abnormal'}</div></div>`
    html += '</div>'
    html += `<div class="abg-result abg-${gcls}" style="margin-top:10px"><div class="abg-label" style="color:${gc}">Osmol Gap: ${gap.toFixed(1)} mOsm/kg</div><div class="abg-interp">${gi}</div><div class="abg-detail">Terukur ${measured} − Kalkulasi ${osmCalc.toFixed(1)} = ${gap.toFixed(1)} mOsm/kg</div></div>`
  } else html += '</div>'

  const oi =
    osmCalc < 285  ? 'Hipoosmolalitas — evaluasi konteks hiponatremia' :
    osmCalc <= 295 ? 'Normal (285–295 mOsm/kg)' :
    osmCalc <= 320 ? 'Hiperosmolalitas ringan-sedang' : '⚠ Hiperosmolalitas berat — risiko koma hiperosmolar'

  html += `<div class="formula-note" style="margin-top:10px"><strong>Kalkulasi:</strong> 2×${na} + ${glu}/18 + ${ureumMmol.toFixed(2)} = <strong>${osmCalc.toFixed(1)} mOsm/kg</strong> — ${oi}<br><span style="color:var(--muted)">BUN/2.8 = Ureum(mmol/L) — formula setara untuk RS yang menggunakan Ureum. Bhagat CI. Ann Clin Biochem 2001</span></div>`

  const content = document.getElementById('osm-result-content')
  if (content) content.innerHTML = html
  document.getElementById('osm-results')?.classList.remove('hidden')
}

// ─── BUN converter helper ────────────────────────────────────

export function buncrConvUreum(): void {
  const ureum = getFloat('buncr-ureum')
  if (!isNaN(ureum) && ureum > 0) {
    ;(document.getElementById('buncr-bun') as HTMLInputElement).value = (ureum / 2.14).toFixed(1)
  }
}

// ─── toggleTheory ────────────────────────────────────────────

export function toggleTheory(id: string): void {
  const btn = (event as MouseEvent).currentTarget as HTMLElement
  const content = document.getElementById('theory-' + id)
  if (!content) return
  btn.classList.toggle('open')
  content.classList.toggle('visible')
}

// ─── Global exposure ─────────────────────────────────────────

const g = window as unknown as Record<string, unknown>
g.toggleKalcUnit = toggleKalcUnit
g.convertUreum   = convertUreum
g.calcEGFR       = calcEGFR
g.calcAKI        = calcAKI
g.calcFENa       = calcFENa
g.calcOsmolality = calcOsmolality
g.buncrConvUreum = buncrConvUreum
g.toggleTheory   = toggleTheory
