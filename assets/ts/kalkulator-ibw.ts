// ============================================================
// kalkulator-ibw.ts — IBW Calculator (TypeScript)
// Halaman: kalkulator-ibw.html
// ============================================================

import type { Sex, VentCondition, IbwResult } from './types.js'

// ─── Vent condition config ────────────────────────────────────

interface ConditionConfig {
  vtLow: number
  vtHigh: number
  note: string
  tableRows: (vtLowMl: number, vtHighMl: number) => string
}

const CONDITION_CONFIG: Record<VentCondition, ConditionConfig> = {
  ards: {
    vtLow: 4, vtHigh: 6,
    note: 'Lung-protective ARDS — ARDSNet Protocol',
    tableRows: (lo, hi) => `
      <tr><td>Mode</td><td>VC-AC</td><td>Kontrol VT ketat</td></tr>
      <tr><td>VT</td><td>${lo}–${hi} mL</td><td>4–6 mL/kg IBW</td></tr>
      <tr><td>RR</td><td>16–22 bpm</td><td>Naikkan jika pH drop</td></tr>
      <tr><td>PEEP</td><td>8–13 cmH₂O</td><td>Titrasi FiO₂/PEEP table ARDSNet</td></tr>
      <tr><td>Pplat target</td><td>&lt;30 cmH₂O</td><td>Inspiratory hold 0.5 det</td></tr>
      <tr><td>Driving pressure</td><td>≤15 cmH₂O</td><td>Pplat − PEEP; target ≤13 ideal</td></tr>`,
  },
  copd: {
    vtLow: 6, vtHigh: 8,
    note: 'PPOK — permissive hypercapnia; ekspirasi panjang',
    tableRows: (lo, hi) => `
      <tr><td>Mode</td><td>VC-AC</td><td>Flow tinggi 60–80 L/mnt</td></tr>
      <tr><td>VT</td><td>${lo}–${hi} mL</td><td>6–8 mL/kg IBW</td></tr>
      <tr><td>RR</td><td>10–14 bpm</td><td>Rendah — ekspirasi panjang</td></tr>
      <tr><td>I:E ratio</td><td>1:3 sampai 1:5</td><td>Cegah auto-PEEP</td></tr>
      <tr><td>PEEP</td><td>5–8 cmH₂O</td><td>75–85% auto-PEEP terukur</td></tr>
      <tr><td>PaCO₂ target</td><td>Baseline pasien</td><td>Koreksi bertahap</td></tr>`,
  },
  asthma: {
    vtLow: 6, vtHigh: 8,
    note: 'Asma — controlled hypoventilation; Pplat <30',
    tableRows: (lo, hi) => `
      <tr><td>Mode</td><td>VC-AC</td><td>Kontrol VT; PC tidak ideal</td></tr>
      <tr><td>VT</td><td>${lo}–${hi} mL</td><td>6–8 mL/kg IBW</td></tr>
      <tr><td>RR</td><td>8–12 bpm</td><td>SANGAT LAMBAT</td></tr>
      <tr><td>I:E ratio</td><td>1:4 sampai 1:5</td><td>Ekspirasi panjang wajib</td></tr>
      <tr><td>PEEP</td><td>0–5 cmH₂O</td><td>Rendah — auto-PEEP sudah ada</td></tr>
      <tr><td>PaCO₂ target</td><td>45–70 mmHg</td><td>Permissive hypercapnia</td></tr>`,
  },
  neuro: {
    vtLow: 10, vtHigh: 12,
    note: 'NMD — paru normal, butuh VT lebih besar',
    tableRows: (lo, hi) => `
      <tr><td>Mode</td><td>VC-AC atau SIMV+PSV</td><td>Preserve spontaneous effort</td></tr>
      <tr><td>VT</td><td>${lo}–${hi} mL</td><td>10–12 mL/kg IBW</td></tr>
      <tr><td>RR</td><td>12–16 bpm</td><td>Backup; spontan diutamakan</td></tr>
      <tr><td>PEEP</td><td>5 cmH₂O</td><td>Standar</td></tr>
      <tr><td>Monitor</td><td>VC serial tiap 4–6 jam</td><td>Target VC &gt;20 mL/kg sebelum ekstubasi</td></tr>`,
  },
  standard: {
    vtLow: 6, vtHigh: 8,
    note: 'Ventilasi standar',
    tableRows: (lo, hi) => `
      <tr><td>Mode</td><td>VC-AC atau PC-AC</td><td>Sesuai kondisi</td></tr>
      <tr><td>VT</td><td>${lo}–${hi} mL</td><td>6–8 mL/kg IBW</td></tr>
      <tr><td>RR</td><td>12–18 bpm</td><td>Sesuai target ventilasi</td></tr>
      <tr><td>PEEP</td><td>5–8 cmH₂O</td><td>Cegah atelektasis</td></tr>
      <tr><td>FiO₂</td><td>1.0 → titrasi</td><td>Target SpO₂ 94–98%</td></tr>`,
  },
}

// ─── Pure calculation logic (testable, no DOM) ────────────────

export function calcIbwCore(
  sex: Sex,
  heightCm: number,
  actualWeightKg?: number,
  condition: VentCondition = 'standard',
): IbwResult {
  const ibwRaw = sex === 'm'
    ? 50 + 0.91 * (heightCm - 152.4)
    : 45.5 + 0.91 * (heightCm - 152.4)
  const ibw = Math.max(ibwRaw, 30)

  const cfg = CONDITION_CONFIG[condition]

  let adjBW: number | null = null
  let bmi: number | null = null
  if (actualWeightKg !== undefined && !isNaN(actualWeightKg)) {
    bmi = actualWeightKg / ((heightCm / 100) ** 2)
    if (bmi > 30 && actualWeightKg > ibw) {
      adjBW = ibw + 0.4 * (actualWeightKg - ibw)
    }
  }

  return {
    ibw,
    adjBW,
    bmi,
    vtLowMl: cfg.vtLow * ibw,
    vtHighMl: cfg.vtHigh * ibw,
    vtRangeLow: cfg.vtLow,
    vtRangeHigh: cfg.vtHigh,
    vtNote: cfg.note,
    mvEstimate: ibw * cfg.vtLow * 0.001 * 16,
  }
}

// ─── DOM helpers ──────────────────────────────────────────────

function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Element #${id} tidak ditemukan`)
  return el as T
}

function getInputFloat(id: string): number | undefined {
  const val = parseFloat((getEl<HTMLInputElement>(id)).value)
  return isNaN(val) ? undefined : val
}

// ─── Render functions ────────────────────────────────────────

function renderResultGrid(
  result: IbwResult,
  _sex: Sex,
  _heightCm: number,
  actualWeightKg: number | undefined,
): string {
  const { ibw, adjBW, bmi, vtLowMl, vtHighMl, vtRangeLow, vtRangeHigh, mvEstimate } = result

  let grid = `
    <div class="result-card">
      <div class="result-label">IBW</div>
      <div class="result-value">${ibw.toFixed(1)} kg</div>
      <div class="result-sub">Devine formula — dasar VT</div>
    </div>
    <div class="result-card">
      <div class="result-label">VT Rendah (${vtRangeLow} mL/kg)</div>
      <div class="result-value">${vtLowMl.toFixed(0)} mL</div>
      <div class="result-sub">Target awal</div>
    </div>
    <div class="result-card">
      <div class="result-label">VT Tinggi (${vtRangeHigh} mL/kg)</div>
      <div class="result-value">${vtHighMl.toFixed(0)} mL</div>
      <div class="result-sub">Batas atas</div>
    </div>
    <div class="result-card">
      <div class="result-label">MV Estimasi</div>
      <div class="result-value">${mvEstimate.toFixed(1)} L/mnt</div>
      <div class="result-sub">RR 16, VT rendah</div>
    </div>`

  if (actualWeightKg !== undefined) {
    const diff = ((actualWeightKg - ibw) / ibw * 100).toFixed(0)
    const vtActLow = (vtRangeLow * actualWeightKg).toFixed(0)
    grid += `
    <div class="result-card">
      <div class="result-label">VT Jika Actual BW</div>
      <div class="result-value" style="color:var(--red)">${vtActLow} mL</div>
      <div class="result-sub">↑${diff}% vs IBW — risiko overdistensi</div>
    </div>`
  }

  if (adjBW !== null && bmi !== null) {
    grid += `
    <div class="result-card" style="border-color:var(--amber)">
      <div class="result-label">AdjBW — Obesitas (BMI ${bmi.toFixed(1)})</div>
      <div class="result-value" style="color:var(--amber)">${adjBW.toFixed(1)} kg</div>
      <div class="result-sub">IBW + 0.4×(ABW−IBW) · dosis obat</div>
    </div>`
  }

  return grid
}

function renderVentTable(condition: VentCondition, vtLowMl: number, vtHighMl: number): string {
  const cfg = CONDITION_CONFIG[condition]
  return `
    <div class="subsec">Rekomendasi Setting Awal — ${condition.toUpperCase()}</div>
    <table>
      <tr><th>Parameter</th><th>Nilai</th><th>Keterangan</th></tr>
      ${cfg.tableRows(Math.round(vtLowMl), Math.round(vtHighMl))}
    </table>`
}

function renderObesityBox(
  bmi: number,
  adjBW: number | null,
  actualWeightKg: number,
  ibw: number,
): string {
  if (adjBW === null) return ''
  return `
    <div class="warn" style="margin-top:10px;margin-bottom:0">
      <strong>⚠ BMI ${bmi.toFixed(1)} — Pasien Obesitas: Perhatikan Pilihan Berat Badan</strong><br>
      <strong>AdjBW = IBW + 0.4 × (ABW − IBW) = ${adjBW.toFixed(1)} kg</strong><br>
      <table style="margin-top:6px;font-size:12px">
        <tr><th>Tujuan</th><th>Gunakan</th><th>Nilai</th></tr>
        <tr><td>VT Ventilator</td><td><strong>IBW</strong></td><td>${ibw.toFixed(1)} kg</td></tr>
        <tr><td>Aminoglikosida, Heparin berat-badan</td><td><strong>AdjBW</strong></td><td>${adjBW.toFixed(1)} kg</td></tr>
        <tr><td>Vancomycin loading</td><td><strong>Actual BW</strong></td><td>${actualWeightKg} kg</td></tr>
        <tr><td>LMWH (enoxaparin) obesitas</td><td><strong>AdjBW</strong></td><td>${adjBW.toFixed(1)} kg</td></tr>
        <tr><td>Kebutuhan kalori ICU fase akut</td><td><strong>IBW atau AdjBW</strong></td><td>ESPEN 2023: hindari overfeeding</td></tr>
      </table>
      <span style="font-size:11px;color:var(--muted)">ESPEN Guidelines 2023 · ASPEN 2022 · Rice TW. Crit Care Med 2012</span>
    </div>`
}

function renderExtraCards(
  sex: Sex,
  heightCm: number,
  actualWeightKg: number,
  ibw: number,
  adjBW: number | null,
  bmi: number,
  ageTahun: number | undefined,
  hbGdl: number | undefined,
): string {
  const bsa = Math.sqrt(heightCm * actualWeightKg / 3600)
  const lbw = sex === 'm'
    ? 9270 * actualWeightKg / (6680 + 216 * bmi)
    : 9270 * actualWeightKg / (8780 + 244 * bmi)
  const ebv = actualWeightKg * (sex === 'm' ? 70 : 65)

  const bmiLabel =
    bmi < 18.5 ? 'Underweight' :
    bmi < 25   ? 'Normal' :
    bmi < 30   ? 'Overweight' :
    bmi < 35   ? 'Obesitas I' :
    bmi < 40   ? 'Obesitas II' : 'Obesitas III'
  const bmiColor =
    bmi < 18.5 ? 'var(--blue)' :
    bmi < 25   ? 'var(--green)' :
    bmi < 30   ? 'var(--amber)' : 'var(--red)'

  let html = `
    <div class="subsec" style="margin-top:14px">Anthropometri & Parameter Klinis Lanjutan</div>
    <div class="result-grid">
      <div class="result-card" style="border-color:${bmiColor}">
        <div class="result-label">BMI</div>
        <div class="result-value" style="color:${bmiColor}">${bmi.toFixed(1)}</div>
        <div class="result-sub">kg/m² — ${bmiLabel}</div>
      </div>
      <div class="result-card">
        <div class="result-label">BSA (Mosteller)</div>
        <div class="result-value">${bsa.toFixed(2)}</div>
        <div class="result-sub">m² — dosis kemoterapi</div>
      </div>
      <div class="result-card">
        <div class="result-label">LBW (Janmahasatian)</div>
        <div class="result-value">${lbw.toFixed(1)}</div>
        <div class="result-sub">kg — propofol/rocuronium</div>
      </div>
      <div class="result-card">
        <div class="result-label">EBV</div>
        <div class="result-value">${(ebv / 1000).toFixed(2)}</div>
        <div class="result-sub">L (${sex === 'm' ? 70 : 65} mL/kg)</div>
      </div>
      ${adjBW !== null ? `
      <div class="result-card" style="border-color:var(--amber)">
        <div class="result-label">ABW (Obesitas)</div>
        <div class="result-value" style="color:var(--amber)">${adjBW.toFixed(1)}</div>
        <div class="result-sub">kg — aminoglikosida/heparin</div>
      </div>` : ''}
    </div>`

  if (ageTahun !== undefined) {
    const ree = sex === 'm'
      ? 88.4 + 13.4 * actualWeightKg + 4.8 * heightCm - 5.68 * ageTahun
      : 447.6 + 9.25 * actualWeightKg + 3.1 * heightCm - 4.33 * ageTahun
    const calMin = Math.round(25 * actualWeightKg)
    const calMax = Math.round(30 * actualWeightKg)
    const protMin = (1.2 * actualWeightKg).toFixed(0)
    const protMax = (2.0 * actualWeightKg).toFixed(0)
    html += `
    <div class="result-grid" style="margin-top:8px">
      <div class="result-card">
        <div class="result-label">REE (Harris-Benedict)</div>
        <div class="result-value">${Math.round(ree)}</div>
        <div class="result-sub">kcal/hari (istirahat)</div>
      </div>
      <div class="result-card">
        <div class="result-label">Target ICU (25–30 kcal/kg)</div>
        <div class="result-value">${calMin}–${calMax}</div>
        <div class="result-sub">kcal/hari (fase akut)</div>
      </div>
      <div class="result-card">
        <div class="result-label">Target Protein ICU</div>
        <div class="result-value">${protMin}–${protMax}</div>
        <div class="result-sub">g/hari (1.2–2.0 g/kg)</div>
      </div>
    </div>`
  }

  if (hbGdl !== undefined) {
    const hbTrigger = 7
    const mabl = ebv * (hbGdl - hbTrigger) / hbGdl
    const mablKolf = Math.ceil(Math.max(0, (hbTrigger - hbGdl) * actualWeightKg * 4) / 250)
    if (hbGdl > hbTrigger) {
      html += `
      <div class="formula-note" style="margin-top:8px">
        <strong>MABL (Max Allowable Blood Loss):</strong>
        EBV ${(ebv / 1000).toFixed(2)} L × (Hb ${hbGdl} − trigger 7) / Hb ${hbGdl}
        = <strong>${Math.max(0, mabl).toFixed(0)} mL</strong><br>
        Perdarahan &gt;${Math.max(0, mabl).toFixed(0)} mL → pertimbangkan transfusi PRC.
      </div>`
    } else {
      html += `
      <div class="warn" style="margin-top:8px;margin-bottom:0">
        <strong>⚠ Hb di Bawah Trigger Transfusi</strong>
        Hb ${hbGdl} g/dL &lt; 7 g/dL — pertimbangkan transfusi PRC.
        Estimasi kebutuhan PRC: ±${mablKolf} kolf.
      </div>`
    }
  }

  html += `
    <div class="subsec" style="margin-top:14px">Panduan Pilihan BB untuk Dosis Obat</div>
    <table>
      <tr><th>Obat / Kategori</th><th>BB yang Digunakan</th><th>Nilai</th><th>Alasan</th></tr>
      <tr><td>VT Ventilator</td><td>IBW</td><td>${ibw.toFixed(1)} kg</td><td>Volume paru bergantung TB, bukan massa</td></tr>
      <tr><td>Aminoglikosida (${bmi >= 30 ? 'obesitas' : 'BMI normal'})</td>
          <td>${bmi >= 30 ? 'ABW' : 'IBW'}</td>
          <td>${bmi >= 30 && adjBW !== null ? adjBW.toFixed(1) + ' kg' : ibw.toFixed(1) + ' kg'}</td>
          <td>${bmi >= 30 ? 'ABW mencerminkan distribusi pada jaringan lemak' : 'BMI normal: gunakan IBW atau actual'}</td></tr>
      <tr><td>Propofol induction / Rocuronium</td><td>LBW</td><td>${lbw.toFixed(1)} kg</td><td>Distribusi ke lean tissue</td></tr>
      <tr><td>Heparin (APTT-guided)</td>
          <td>${bmi >= 30 ? 'ABW' : 'Actual BW'}</td>
          <td>${bmi >= 30 && adjBW !== null ? adjBW.toFixed(1) + ' kg' : actualWeightKg + ' kg'}</td>
          <td>Berbasis actual atau ABW pada obesitas</td></tr>
      <tr><td>Obat umum (parasetamol, dll)</td><td>Actual BW</td><td>${actualWeightKg} kg</td><td>Standar dosis umum</td></tr>
      <tr><td>Kemoterapi</td><td>BSA</td><td>${bsa.toFixed(2)} m²</td><td>Berdasarkan luas permukaan tubuh</td></tr>
    </table>
    <div class="formula-note" style="margin-top:6px">
      Harris JA & Benedict FG 1919 · Janmahasatian S. Clin Pharmacokinet 2005;44:1051 ·
      Mosteller RD. NEJM 1987;317:1098 · ASPEN Critical Care Guidelines 2021
    </div>`

  return html
}

// ─── Main DOM handler ────────────────────────────────────────

export function calcIBW(): void {
  const sex = (getEl<HTMLSelectElement>('ibwSex')).value as Sex
  const heightCm = getInputFloat('ibwHeight')
  const actualWeightKg = getInputFloat('ibwActual')
  const condition = (getEl<HTMLSelectElement>('ibwCondition')).value as VentCondition

  if (!heightCm) {
    alert('Masukkan tinggi badan')
    return
  }

  const result = calcIbwCore(sex, heightCm, actualWeightKg, condition)
  const { ibw, adjBW, bmi, vtLowMl, vtHighMl, vtNote } = result

  getEl('ibw-result-grid').innerHTML = renderResultGrid(result, sex, heightCm, actualWeightKg)
  getEl('ibw-vent-table').innerHTML = renderVentTable(condition, vtLowMl, vtHighMl)

  const obesityBox = (bmi !== null && adjBW !== null && actualWeightKg !== undefined)
    ? renderObesityBox(bmi, adjBW, actualWeightKg, ibw)
    : ''

  getEl('ibw-note').innerHTML =
    `<strong>Catatan:</strong> ${vtNote} · IBW = ${ibw.toFixed(1)} kg ` +
    `(${sex === 'm' ? 'Laki-laki' : 'Perempuan'}, TB ${heightCm} cm) · Formula Devine BJ 1974` +
    (obesityBox ? '<br>' + obesityBox : '')

  if (actualWeightKg !== undefined && bmi !== null) {
    const ageTahun = getInputFloat('ibwAge')
    const hbGdl = getInputFloat('ibwHb')

    let extraDiv = document.getElementById('ibw-extra')
    if (!extraDiv) {
      extraDiv = document.createElement('div')
      extraDiv.id = 'ibw-extra'
      getEl('ibw-note').after(extraDiv)
    }
    extraDiv.innerHTML = renderExtraCards(
      sex, heightCm, actualWeightKg, ibw, adjBW, bmi, ageTahun, hbGdl,
    )
  }

  getEl('ibw-results').classList.remove('hidden')
}

// ─── Global exposure & toggle helper ────────────────────────

export function toggleTheory(id: string): void {
  const btn = (event as MouseEvent).currentTarget as HTMLElement
  const content = document.getElementById('theory-' + id)
  if (!content) return
  btn.classList.toggle('open')
  content.classList.toggle('visible')
}

// Expose to HTML onclick attributes
;(window as unknown as Record<string, unknown>).calcIBW = calcIBW
;(window as unknown as Record<string, unknown>).toggleTheory = toggleTheory
