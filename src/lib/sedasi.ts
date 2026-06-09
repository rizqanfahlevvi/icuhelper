/* Sedasi, RSI & ICU Drug calculators — port of kalkulator-drug.js */

export type Scenario = 'general' | 'shock' | 'icp' | 'bronchospasm' | 'hyperkalemia' | 'seizure'
export type NmbChoice = 'sux' | 'roc_rsi' | 'roc_std' | 'atracurium'
export type PremedChoice = 'fentanyl' | 'remifentanil' | 'alfentanil' | 'none'
export type RassTarget = 'light' | 'moderate' | 'deep'
export type PainLevel = 'mild' | 'moderate' | 'severe'

export interface DrugRow {
  drug: string
  totalDose: string
  volume?: string
  rate?: string
  concentration: string
  onset: string
  duration: string
  note?: string
  warning?: string
}

export interface RsiSection {
  title: string
  rows: DrugRow[]
  guidance?: string
}

export interface ScenarioInfo {
  label: string
  induction: string
  nmbRec: string
  color: string
  guidance: string
}

export const SCENARIO_INFO: Record<Scenario, ScenarioInfo> = {
  general: { label: 'Kondisi Umum / Elektif', induction: 'Propofol', nmbRec: 'Suk atau Roc 0.6–1.2 mg/kg', color: 'blue', guidance: 'Propofol pilihan utama. Titrasi perlahan. Pre-oksigenasi 3 menit dengan NRM 15 L/mnt.' },
  shock: { label: 'Syok / Hemodinamik Tidak Stabil', induction: 'Ketamine', nmbRec: 'Suk atau Roc RSI 1.2 mg/kg', color: 'amber', guidance: 'Ketamine mempertahankan tonus simpatik. Hindari propofol (vasodilasi). Pertimbangkan push-dose epinefrin.' },
  icp: { label: 'Peningkatan TIK / Cedera Kepala', induction: 'Propofol atau Etomidate', nmbRec: 'Rocuronium RSI 1.2 mg/kg', color: 'purple', guidance: 'Hindari suksinilkolin (↑TIK transient). Lidokain 1.5 mg/kg IV 3 menit sebelum dapat meredam respons laringoskopi.' },
  bronchospasm: { label: 'Bronkospasme / Asma Berat', induction: 'Ketamine', nmbRec: 'Rocuronium RSI 1.2 mg/kg', color: 'teal', guidance: 'Ketamine merupakan bronkodilator. Hindari morfin (histamin release). Pertimbangkan MDI salbutamol sebelum intubasi.' },
  hyperkalemia: { label: 'Hiperkalemia / KI Suksinilkolin', induction: 'Propofol atau Ketamine', nmbRec: 'Rocuronium RSI 1.2 mg/kg + Sugammadex 16 mg/kg siap', color: 'red', guidance: '⛔ Suksinilkolin KONTRAINDIKASI — dapat memicu cardiac arrest. Siapkan Sugammadex 200 mg/mL untuk reversal cepat.' },
  seizure: { label: 'Status Epileptikus', induction: 'Propofol', nmbRec: 'Rocuronium RSI 1.2 mg/kg', color: 'blue', guidance: 'Propofol memiliki efek antikonvulsan. Konfirmasi dengan EEG setelah NMB diberikan.' },
}

function vol(dose: number, conc: number, unit = 'mL'): string {
  return `${(dose / conc).toFixed(1)} ${unit}`
}

export function calcRsi(bw: number, scenario: Scenario, nmb: NmbChoice, premed: PremedChoice, lidocaine: boolean, atropinePre: boolean, showAlt: boolean): RsiSection[] {
  const sections: RsiSection[] = []

  // Pre-medication section
  const preRows: DrugRow[] = []
  if (premed === 'fentanyl') {
    const d = 2 * bw
    preRows.push({ drug: 'Fentanyl', totalDose: `${d.toFixed(0)} mcg (2 mcg/kg)`, volume: vol(d, 50), concentration: '50 mcg/mL', onset: '60–90 dtk', duration: '30–60 mnt' })
  } else if (premed === 'remifentanil') {
    const d = 1 * bw
    preRows.push({ drug: 'Remifentanil', totalDose: `${d.toFixed(0)} mcg (1 mcg/kg)`, volume: vol(d, 50), concentration: '50 mcg/mL', onset: '60–90 dtk', duration: '5–10 mnt' })
  } else if (premed === 'alfentanil') {
    const d = 15 * bw
    preRows.push({ drug: 'Alfentanil', totalDose: `${d.toFixed(0)} mcg (15 mcg/kg)`, volume: vol(d, 100), concentration: '100 mcg/mL', onset: '45–60 dtk', duration: '10–15 mnt' })
  }
  if (lidocaine) {
    const d = 1.5 * bw
    preRows.push({ drug: 'Lidokain 2%', totalDose: `${d.toFixed(0)} mg (1.5 mg/kg)`, volume: vol(d, 20), concentration: '20 mg/mL', onset: '3 mnt sebelum', duration: '—', note: 'Meredam respons laringoskopi (terutama ICP)' })
  }
  if (preRows.length > 0) {
    sections.push({ title: 'T−3 menit — Pre-medikasi', rows: preRows })
  }

  // Induction agents
  const indRows: DrugRow[] = []
  if (scenario === 'general' || scenario === 'icp' || scenario === 'seizure') {
    const lo = 1.5, hi = 2.5
    indRows.push({ drug: 'Propofol 1%', totalDose: `${(lo * bw).toFixed(0)}–${(hi * bw).toFixed(0)} mg (${lo}–${hi} mg/kg)`, volume: `${(lo * bw / 10).toFixed(1)}–${(hi * bw / 10).toFixed(1)} mL`, concentration: '10 mg/mL', onset: '15–45 dtk', duration: '5–10 mnt', note: scenario === 'icp' ? 'Pilihan utama ICP — menurunkan TIK & CMRO₂' : 'Pilihan utama kondisi umum' })
    if (scenario === 'icp') {
      const de = 0.3 * bw
      indRows.push({ drug: 'Etomidate', totalDose: `${de.toFixed(1)} mg (0.3 mg/kg)`, volume: vol(de, 2), concentration: '2 mg/mL', onset: '15–45 dtk', duration: '3–8 mnt', note: 'Alternatif jika hemodinamik borderline' })
    }
    if (showAlt) {
      indRows.push({ drug: 'Midazolam (alt)', totalDose: `${(0.2 * bw).toFixed(1)} mg (0.2 mg/kg)`, volume: vol(0.2 * bw, 1), concentration: '1 mg/mL', onset: '90–120 dtk', duration: '15–30 mnt', note: 'Onset lambat — bukan pilihan utama RSI' })
    }
  } else if (scenario === 'shock' || scenario === 'bronchospasm') {
    const dose = scenario === 'shock' ? 1.0 : 1.5
    const dK = dose * bw
    indRows.push({ drug: 'Ketamine', totalDose: `${dK.toFixed(1)} mg (${dose} mg/kg)`, volume: vol(dK, 10), concentration: '10 mg/mL', onset: '30–60 dtk', duration: '10–15 mnt', note: scenario === 'shock' ? 'Mempertahankan tonus simpatik — pilihan syok' : 'Bronkodilator — pilihan bronkospasme' })
    if (showAlt) {
      const de = 0.3 * bw
      indRows.push({ drug: 'Etomidate (alt)', totalDose: `${de.toFixed(1)} mg (0.3 mg/kg)`, volume: vol(de, 2), concentration: '2 mg/mL', onset: '15–45 dtk', duration: '3–8 mnt' })
    }
  } else if (scenario === 'hyperkalemia') {
    const dp = 2.0 * bw, dk = 1.5 * bw
    indRows.push({ drug: 'Propofol 1%', totalDose: `${(1.5 * bw).toFixed(0)}–${dp.toFixed(0)} mg (1.5–2 mg/kg)`, volume: `${(1.5 * bw / 10).toFixed(1)}–${(dp / 10).toFixed(1)} mL`, concentration: '10 mg/mL', onset: '15–45 dtk', duration: '5–10 mnt' })
    indRows.push({ drug: 'Ketamine (alt)', totalDose: `${dk.toFixed(1)} mg (1.5 mg/kg)`, volume: vol(dk, 10), concentration: '10 mg/mL', onset: '30–60 dtk', duration: '10–15 mnt' })
  }

  // NMB
  const nmbRows: DrugRow[] = []
  if (atropinePre) {
    const dAt = Math.max(0.1, 0.02 * bw)
    nmbRows.push({ drug: 'Atropin (pre-NMB)', totalDose: `${dAt.toFixed(2)} mg (0.02 mg/kg, min 0.1 mg)`, volume: vol(dAt, 0.25), concentration: '0.25 mg/mL', onset: '1–2 mnt sebelum NMB', duration: '—', note: 'Cegah bradikardia saat suksinilkolin/laringoskopi' })
  }

  if (nmb === 'sux') {
    const d = 1.5 * bw
    nmbRows.push({ drug: 'Suksinilkolin', totalDose: `${d.toFixed(0)} mg (1.5 mg/kg)`, volume: vol(d, 20), concentration: '20 mg/mL', onset: '45–60 dtk', duration: '8–12 mnt', warning: scenario === 'hyperkalemia' ? '⛔ KONTRAINDIKASI pada hiperkalemia!' : undefined })
  } else if (nmb === 'roc_rsi') {
    const d = 1.2 * bw
    const dSug = 16 * bw
    nmbRows.push({ drug: 'Rocuronium RSI', totalDose: `${d.toFixed(1)} mg (1.2 mg/kg)`, volume: vol(d, 10), concentration: '10 mg/mL', onset: '60–75 dtk', duration: '60–90 mnt', note: 'Reversal: Sugammadex 16 mg/kg' })
    nmbRows.push({ drug: 'Sugammadex (reversal)', totalDose: `${dSug.toFixed(0)} mg (16 mg/kg)`, volume: vol(dSug, 100), concentration: '100 mg/mL', onset: '3 mnt', duration: '—', note: 'Siapkan di syringe terpisah sebelum intubasi' })
  } else if (nmb === 'roc_std') {
    const d = 0.6 * bw
    nmbRows.push({ drug: 'Rocuronium Standar', totalDose: `${d.toFixed(1)} mg (0.6 mg/kg)`, volume: vol(d, 10), concentration: '10 mg/mL', onset: '90 dtk', duration: '30–45 mnt' })
  } else if (nmb === 'atracurium') {
    const d = 0.5 * bw
    nmbRows.push({ drug: 'Atrakurium', totalDose: `${d.toFixed(1)} mg (0.5 mg/kg)`, volume: vol(d, 10), concentration: '10 mg/mL', onset: '2–3 mnt', duration: '20–35 mnt', note: 'Bukan pilihan RSI — onset lambat' })
  }

  sections.push({ title: 'T−0 — Induksi + NMB', rows: [...indRows, ...nmbRows] })

  // Post-intubation maintenance
  const mRows: DrugRow[] = []
  const fentRate = (50 * bw) / (10 * 60)
  mRows.push({ drug: 'Fentanyl (maintenans)', totalDose: '25–200 mcg/kg/jam', volume: '—', rate: `${fentRate.toFixed(1)} mL/jam (dosis awal 50 mcg/kg/jam)`, concentration: '500 mcg/50 mL NS (10 mcg/mL)', onset: '—', duration: '—' })
  const propRate = (20 * bw * 60) / 10000
  mRows.push({ drug: 'Propofol 1% (sedasi)', totalDose: '5–75 mcg/kg/mnt', volume: '—', rate: `${propRate.toFixed(1)} mL/jam (dosis awal 20 mcg/kg/mnt)`, concentration: '10 mg/mL (RTU)', onset: '—', duration: '—', note: 'Cek TG bila >48 jam' })
  const ketRate = (0.2 * bw) / 10
  mRows.push({ drug: 'Ketamine (subanestesi)', totalDose: '0.1–0.5 mg/kg/jam', volume: '—', rate: `${ketRate.toFixed(1)} mL/jam (dosis 0.2 mg/kg/jam)`, concentration: '100 mg/50 mL NS (2 mg/mL)', onset: '—', duration: '—' })
  const midRate = (0.05 * bw * 60) / 1000
  mRows.push({ drug: 'Midazolam', totalDose: '0.02–0.1 mg/kg/jam', volume: '—', rate: `${midRate.toFixed(1)} mL/jam (dosis 0.05 mg/kg/jam)`, concentration: '50 mg/50 mL NS (1 mg/mL)', onset: '—', duration: '—' })
  const cisRate = (2 * bw * 60) / 1000
  mRows.push({ drug: 'Cisatrakurium (NMB)', totalDose: '1–3 mcg/kg/mnt', volume: '—', rate: `${cisRate.toFixed(1)} mL/jam (dosis 2 mcg/kg/mnt)`, concentration: '20 mg/20 mL NS (1 mg/mL)', onset: '—', duration: '—', note: 'Monitor TOF. Indikasi: ARDS P/F <120, ECMO' })

  sections.push({ title: 'Pasca Intubasi — Maintenans Sedasi & Analgesia', rows: mRows })

  return sections
}

export interface IcuDrugSection {
  title: string
  rows: DrugRow[]
  note?: string
}

export function calcIcuDrug(bw: number, rass: RassTarget, pain: PainLevel): IcuDrugSection[] {
  const sections: IcuDrugSection[] = []

  // Analgesia
  const fentDose = pain === 'mild' ? 25 : pain === 'moderate' ? 50 : 75
  const morphDose = pain === 'mild' ? 20 : pain === 'moderate' ? 40 : 60
  const fentRate = (fentDose * bw) / (10 * 60)
  const morphRate = (morphDose * bw) / (1000 * 60)

  sections.push({
    title: 'Analgesik (Analgesia First)',
    rows: [
      { drug: 'Fentanyl', totalDose: `${fentDose} mcg/kg/jam`, volume: '—', rate: `${fentRate.toFixed(1)} mL/jam`, concentration: '500 mcg/50 mL NS (10 mcg/mL)', onset: '1–5 mnt', duration: 'Kontinu', note: `Range: 25–200 mcg/kg/jam` },
      { drug: 'Morfin (alt)', totalDose: `${morphDose} mcg/kg/jam`, volume: '—', rate: `${morphRate.toFixed(2)} mL/jam`, concentration: '20 mg/20 mL NS (1 mg/mL)', onset: '3–5 mnt', duration: 'Kontinu', note: 'Hindari pada gagal ginjal (akumulasi metabolit)' },
    ],
  })

  // Sedation
  const propDose = rass === 'light' ? 5 : rass === 'moderate' ? 15 : 30
  const dexDose = rass === 'light' ? 0.3 : rass === 'moderate' ? 0.6 : 1.0
  const propRate = (propDose * bw * 60) / 10000
  const dexRate = (dexDose * bw) / 4
  const sedRows: DrugRow[] = [
    { drug: 'Propofol 1%', totalDose: `${propDose} mcg/kg/mnt`, volume: '—', rate: `${propRate.toFixed(1)} mL/jam`, concentration: '10 mg/mL (RTU)', onset: '1–2 mnt', duration: 'Kontinu', note: 'Cek TG bila >48 jam. Max 4 mg/kg/jam' },
    { drug: 'Dexmedetomidine', totalDose: `${dexDose} mcg/kg/jam`, volume: '—', rate: `${dexRate.toFixed(1)} mL/jam`, concentration: '200 mcg/50 mL NS (4 mcg/mL)', onset: '5–10 mnt', duration: 'Kontinu', note: 'Preservasi kemampuan bangun. Hindari jika HR rendah' },
  ]
  if (rass === 'deep') {
    const midRate2 = (0.05 * bw * 60) / 1000
    sedRows.push({ drug: 'Midazolam', totalDose: '0.05 mg/kg/jam', volume: '—', rate: `${midRate2.toFixed(1)} mL/jam`, concentration: '50 mg/50 mL NS (1 mg/mL)', onset: '2–5 mnt', duration: 'Kontinu', note: 'Tambahkan untuk sedasi dalam refrakter' })
  }
  sections.push({ title: 'Sedatif (Setelah Analgesia Adekuat)', rows: sedRows })

  // NMB (only deep)
  if (rass === 'deep') {
    const cisRate = (2 * bw * 60) / 1000
    const atrRate = (8 * bw * 60) / 5000
    sections.push({
      title: 'Paralitik / NMB (Jika Diperlukan)',
      rows: [
        { drug: 'Cisatrakurium', totalDose: '2 mcg/kg/mnt', volume: '—', rate: `${cisRate.toFixed(1)} mL/jam`, concentration: '20 mg/20 mL NS (1 mg/mL)', onset: '2–3 mnt', duration: 'Kontinu', note: 'Monitor TOF (target 2/4). Indikasi: ARDS P/F <120, ECMO' },
        { drug: 'Atrakurium (alt)', totalDose: '8 mcg/kg/mnt', volume: '—', rate: `${atrRate.toFixed(1)} mL/jam`, concentration: '50 mg/10 mL NS (5 mg/mL)', onset: '2–3 mnt', duration: 'Kontinu' },
      ],
      note: '⚠ Pastikan sedasi adekuat sebelum NMB. Monitor TOF wajib.',
    })
  }

  return sections
}
