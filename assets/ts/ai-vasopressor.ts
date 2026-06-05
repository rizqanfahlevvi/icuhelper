// ============================================================
// ai-vasopressor.ts — Gemini AI untuk Panduan Vasopressor/Inotropik
// ============================================================

import { streamAiResponse, createAiPanel } from './ai-client.js'

// ─── Types ───────────────────────────────────────────────────

interface VasopressorSnapshot {
  map: number
  hr: number
  laktat: number
  cvp?: number
  sv?: number
  ef?: number
  jenisSyok: string
  vasopressorAktif?: string
  dosis?: string
  kondisi?: string
}

// ─── Baca nilai dari form Vasopressor ────────────────────────

function readVasopressorForm(): VasopressorSnapshot | null {
  const getVal = (id: string): number | undefined => {
    const v = parseFloat((document.getElementById(id) as HTMLInputElement)?.value ?? '')
    return isNaN(v) ? undefined : v
  }

  const map    = getVal('vasoMAP')
  const laktat = getVal('vasoLaktat')
  if (!map || !laktat) return null

  const hr         = getVal('vasoHR')
  const jenisSyok  = (document.getElementById('vasoJenis') as HTMLSelectElement)?.value ?? 'distributif'
  const vasopressorAktif = (document.getElementById('vasoAktif') as HTMLInputElement)?.value?.trim() || undefined
  const dosis      = (document.getElementById('vasoDosis') as HTMLInputElement)?.value?.trim() || undefined
  const kondisi    = (document.getElementById('vasoKondisi') as HTMLInputElement)?.value?.trim() || undefined

  return {
    map,
    hr: hr ?? 0,
    laktat,
    cvp:    getVal('vasoCVP'),
    sv:     getVal('vasoSV'),
    ef:     getVal('vasoEF'),
    jenisSyok,
    vasopressorAktif,
    dosis,
    kondisi,
  }
}

// ─── Build prompt ─────────────────────────────────────────────

function buildVasopressorPrompt(data: VasopressorSnapshot): string {
  const lines: string[] = [
    `## Data Hemodinamik Pasien`,
    `- MAP: ${data.map} mmHg`,
    `- HR: ${data.hr} bpm`,
    `- Laktat: ${data.laktat} mmol/L`,
  ]

  if (data.cvp !== undefined) lines.push(`- CVP: ${data.cvp} mmHg`)
  if (data.sv  !== undefined) lines.push(`- SV: ${data.sv} mL`)
  if (data.ef  !== undefined) lines.push(`- EF: ${data.ef} %`)

  lines.push(`- Jenis syok: ${data.jenisSyok}`)

  if (data.vasopressorAktif) {
    lines.push(`\n### Vasopressor/Inotropik Aktif`)
    lines.push(`- Obat: ${data.vasopressorAktif}`)
    if (data.dosis) lines.push(`- Dosis: ${data.dosis}`)
  }

  if (data.kondisi) lines.push(`\n- Kondisi/catatan tambahan: ${data.kondisi}`)

  return `${lines.join('\n')}

## Tugas
Berikan panduan vasopressor/inotropik yang sistematis dan ringkas mencakup:

**1. Identifikasi Jenis dan Severity Syok**
(konfirmasi tipe syok, derajat keparahan berdasarkan data hemodinamik)

**2. Target Hemodinamik yang Direkomendasikan**
(MAP target, laktat clearance, parameter kardiak yang relevan)

**3. Rekomendasi Vasopressor/Inotropik Lini Pertama dan Eskalasi**
(nama obat, dosis awal, rentang dosis, urutan eskalasi sesuai guideline)

**4. Indikasi dan Kontraindikasi Sesuai Kondisi**
(pertimbangan khusus berdasarkan jenis syok dan komorbid)

**5. Target Terapi dan Kapan Escalate/De-escalate**
(parameter monitoring, kriteria respons adekuat, kapan mengurangi atau menambah vasopressor)

Gunakan Bahasa Indonesia. Ringkas, tidak lebih dari 350 kata.`
}

// ─── Main handler ─────────────────────────────────────────────

const AI_VASO_CONTAINER = 'vaso-ai-container'

export function initVasopressorAiButton(): void {
  // Inject tombol AI ke halaman Vasopressor setelah tombol panduan
  const calcBtn = document.querySelector<HTMLElement>('.calc-btn[onclick="showVasopressorGuide()"]')
    ?? document.querySelector<HTMLElement>('.calc-btn[onclick*="asopressor"]')
  if (!calcBtn) return

  const aiBtn = document.createElement('button')
  aiBtn.className = 'calc-btn ai-btn'
  aiBtn.id = 'vaso-ai-btn'
  aiBtn.innerHTML = '✦ Analisis dengan AI'
  aiBtn.style.cssText = 'background:linear-gradient(135deg,var(--purple,#7c3aed),var(--blue,#2563eb));color:#fff;margin-left:8px'
  aiBtn.onclick = runVasopressorAi
  calcBtn.insertAdjacentElement('afterend', aiBtn)

  // Container untuk panel AI
  const container = document.createElement('div')
  container.id = AI_VASO_CONTAINER
  container.style.marginTop = '12px'
  calcBtn.parentElement?.appendChild(container)
}

export async function runVasopressorAi(): Promise<void> {
  const data = readVasopressorForm()
  if (!data) {
    alert('Minimal masukkan MAP dan Laktat sebelum menggunakan AI.')
    return
  }

  let panel: ReturnType<typeof createAiPanel>
  try {
    panel = createAiPanel(AI_VASO_CONTAINER, 'Analisis AI — Panduan Vasopressor')
  } catch {
    // Container belum ada, buat dulu
    const container = document.getElementById(AI_VASO_CONTAINER)
    if (!container) {
      const div = document.createElement('div')
      div.id = AI_VASO_CONTAINER
      document.getElementById('vaso-results')?.insertAdjacentElement('afterend', div)
    }
    panel = createAiPanel(AI_VASO_CONTAINER, 'Analisis AI — Panduan Vasopressor')
  }

  panel.show()
  panel.reset()
  panel.setLoading(true)

  const prompt = buildVasopressorPrompt(data)

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

document.addEventListener('DOMContentLoaded', () => initVasopressorAiButton())
;(window as unknown as Record<string, unknown>).runVasopressorAi = runVasopressorAi
