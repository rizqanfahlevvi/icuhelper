// ============================================================
// ai-abg.ts — Gemini AI untuk Interpretasi ABG
// ============================================================

import { streamAiResponse, createAiPanel } from './ai-client.js'

// ─── Types ───────────────────────────────────────────────────

interface AbgSnapshot {
  ph: number
  pco2: number
  hco3: number
  po2?: number
  be?: number
  fio2?: number
  spo2?: number
  na?: number
  cl?: number
  alb?: number
  laktat?: number
  rr?: number
  kondisi: string
  // Units
  paco2Unit: string
  albUnit: string
}

// ─── Baca nilai dari form ABG ────────────────────────────────

function readAbgForm(): AbgSnapshot | null {
  const getVal = (id: string): number | undefined => {
    const v = parseFloat((document.getElementById(id) as HTMLInputElement)?.value ?? '')
    return isNaN(v) ? undefined : v
  }

  const paco2Unit = localStorage.getItem('abg-unit-paco2') ?? 'mmHg'
  const albUnit   = localStorage.getItem('abg-unit-alb')   ?? 'g/dL'

  let pco2 = getVal('abgCO2')
  if (pco2 !== undefined && paco2Unit === 'kPa') pco2 = pco2 * 7.5006

  let alb = getVal('abgAlb')
  if (alb !== undefined && albUnit === 'mg/dL') alb = alb / 1000

  const ph   = getVal('abgPH')
  const hco3 = getVal('abgHCO3')
  if (!ph || !pco2 || !hco3) return null

  const kondisi = (document.getElementById('abgKondisi') as HTMLSelectElement)?.value ?? 'umum'

  return {
    ph, pco2, hco3, alb,
    po2:    getVal('abgO2'),
    be:     getVal('abgBE'),
    fio2:   getVal('abgFiO2'),
    spo2:   getVal('abgSpO2'),
    na:     getVal('abgNa'),
    cl:     getVal('abgCl'),
    laktat: getVal('abgLaktat'),
    rr:     getVal('abgRR'),
    kondisi,
    paco2Unit,
    albUnit,
  }
}

// ─── Build prompt ─────────────────────────────────────────────

function buildAbgPrompt(data: AbgSnapshot): string {
  const lines: string[] = [
    `## Data ABG Pasien`,
    `- pH: ${data.ph}`,
    `- PaCO₂: ${data.pco2.toFixed(1)} mmHg`,
    `- HCO₃⁻: ${data.hco3} mmol/L`,
    `- BE: ${data.be ?? 'tidak diisi'} mEq/L`,
  ]

  if (data.po2)   lines.push(`- PaO₂: ${data.po2} mmHg`)
  if (data.fio2)  lines.push(`- FiO₂: ${(data.fio2 * 100).toFixed(0)}%`)
  if (data.spo2)  lines.push(`- SpO₂: ${data.spo2}%`)
  if (data.na)    lines.push(`- Na⁺: ${data.na} mmol/L`)
  if (data.cl)    lines.push(`- Cl⁻: ${data.cl} mmol/L`)
  if (data.alb)   lines.push(`- Albumin: ${data.alb.toFixed(1)} g/dL`)
  if (data.laktat) lines.push(`- Laktat: ${data.laktat} mmol/L`)
  if (data.rr)    lines.push(`- RR: ${data.rr} napas/mnt`)

  const kondisiLabel: Record<string, string> = {
    umum: 'Umum/tidak spesifik', ards: 'ARDS', copd: 'PPOK',
    sepsis: 'Sepsis/Syok Septik', cardiac: 'Gagal Jantung/Edema Paru', neuro: 'Neurologi',
  }

  lines.push(`- Kondisi klinis: ${kondisiLabel[data.kondisi] ?? data.kondisi}`)

  // Hitung nilai turunan jika tersedia
  if (data.po2 && data.fio2) {
    const pf = (data.po2 / data.fio2).toFixed(0)
    lines.push(`- P/F Ratio: ${pf} mmHg`)
  }
  if (data.na && data.cl) {
    const ag = data.na - (data.cl + data.hco3)
    lines.push(`- Anion Gap: ${ag.toFixed(1)} mEq/L`)
    if (data.alb) {
      const agCorr = ag + 2.5 * (4 - data.alb)
      lines.push(`- AG terkoreksi albumin: ${agCorr.toFixed(1)} mEq/L`)
    }
  }

  return `${lines.join('\n')}

## Tugas
Berikan analisis AGD yang sistematis dan ringkas dalam format berikut:

**1. Status Asam-Basa Utama**
(identifikasi gangguan primer: asidosis/alkalosis respiratorik/metabolik)

**2. Evaluasi Kompensasi**
(adekuat, tidak adekuat, atau mixed disorder — sertakan perhitungan ekspektasi)

**3. Status Oksigenasi**
(P/F ratio, interpretasi hipoksemia, ROX index jika ada RR)

**4. Anion Gap & Laktat**
(jika data tersedia — identifikasi HAGMA/NAGMA, delta-delta)

**5. Kemungkinan Etiologi**
(2-3 diagnosis paling mungkin berdasarkan pola ABG)

**6. Prioritas Tatalaksana Segera**
(3-4 langkah konkret berbasis guideline terkini — SSC 2024, GOLD 2024, ARDSNet)

Gunakan Bahasa Indonesia. Ringkas, tidak lebih dari 350 kata.`
}

// ─── Main handler ─────────────────────────────────────────────

const AI_ABG_CONTAINER = 'abg-ai-container'

export function initAbgAiButton(): void {
  // Inject tombol AI ke halaman ABG setelah tombol interpretasi
  const calcBtn = document.querySelector<HTMLElement>('.calc-btn[onclick="calcABG()"]')
  if (!calcBtn) return

  const aiBtn = document.createElement('button')
  aiBtn.className = 'calc-btn ai-btn'
  aiBtn.id = 'abg-ai-btn'
  aiBtn.innerHTML = '✦ Analisis dengan AI'
  aiBtn.style.cssText = 'background:linear-gradient(135deg,var(--purple,#7c3aed),var(--blue,#2563eb));color:#fff;margin-left:8px'
  aiBtn.onclick = runAbgAi
  calcBtn.insertAdjacentElement('afterend', aiBtn)

  // Container untuk panel AI
  const container = document.createElement('div')
  container.id = AI_ABG_CONTAINER
  container.style.marginTop = '12px'
  calcBtn.parentElement?.appendChild(container)
}

export async function runAbgAi(): Promise<void> {
  const data = readAbgForm()
  if (!data) {
    alert('Minimal masukkan pH, PaCO₂, dan HCO₃⁻ sebelum menggunakan AI.')
    return
  }

  let panel: ReturnType<typeof createAiPanel>
  try {
    panel = createAiPanel(AI_ABG_CONTAINER, 'Analisis AI — ABG Interpreter')
  } catch {
    // Container belum ada, buat dulu
    const container = document.getElementById(AI_ABG_CONTAINER)
    if (!container) {
      const div = document.createElement('div')
      div.id = AI_ABG_CONTAINER
      document.getElementById('abg-results')?.insertAdjacentElement('afterend', div)
    }
    panel = createAiPanel(AI_ABG_CONTAINER, 'Analisis AI — ABG Interpreter')
  }

  panel.show()
  panel.reset()
  panel.setLoading(true)

  const prompt = buildAbgPrompt(data)

  await streamAiResponse(prompt, {
    onChunk: (text) => {
      panel.setLoading(false)
      panel.appendChunk(text)
    },
    onDone:  (_full) => {
      panel.setLoading(false)
    },
    onError: (err) => {
      panel.setLoading(false)
      panel.setError(err.message)
    },
  })
}

// ─── Global exposure ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => initAbgAiButton())
;(window as unknown as Record<string, unknown>).runAbgAi = runAbgAi
