/* ICU scoring systems — faithful TypeScript port of scripts-skoring.js.
   Pure functions returning structured results for React views.
   Covers: SOFA, CFS/BFS, CPIS, RASS, CAM-ICU, APACHE-II, Candida. */

export interface ScoreRow {
  organ: string
  detail?: string
  pts: number | null // null = skipped / not available
}

/* ===== SOFA ===== */
export interface SofaInput {
  pao2?: number
  fio2?: number
  vent: 'yes' | 'no'
  plt?: number
  bili?: number
  cv: string // '' or '0'..'4'
  gcs?: number
  cr?: number
  uo?: number
  baseline?: number
}

export interface SofaResult {
  total: number
  rows: ScoreRow[]
  missing: string[]
  color: string
  interp: string
  detail: string
  sepsis3Delta: number | null // set when baseline provided and Δ>=2
  baseline: number
}

export function computeSofa(i: SofaInput): SofaResult {
  let total = 0
  const rows: ScoreRow[] = []
  const missing: string[] = []
  const add = (organ: string, detail: string, pts: number) => { rows.push({ organ, detail, pts }); total += pts }
  const skip = (organ: string) => { rows.push({ organ, pts: null }); missing.push(organ) }

  // Respirasi
  if (i.pao2 != null && i.fio2 != null && i.fio2 > 0) {
    const pf = i.pao2 / i.fio2
    const onV = i.vent === 'yes'
    let pts: number, note: string
    if (pf >= 400) { pts = 0; note = 'P/F≥400 — Normal' }
    else if (pf >= 300) { pts = 1; note = `P/F ${pf.toFixed(0)} — Disfungsi ringan` }
    else if (pf >= 200) { pts = 2; note = `P/F ${pf.toFixed(0)} — Disfungsi sedang` }
    else if (pf >= 100) { pts = onV ? 3 : 2; note = `P/F ${pf.toFixed(0)} — ${onV ? 'Berat (ventilasi mekanik)' : 'Sedang (tanpa VM, max 2)'}` }
    else { pts = onV ? 4 : 3; note = `P/F ${pf.toFixed(0)} — ${onV ? 'Sangat berat (VM)' : 'Berat (tanpa VM)'}` }
    add('Respirasi — PaO₂/FiO₂', note, pts)
  } else skip('Respirasi (PaO₂/FiO₂)')

  // Koagulasi
  if (i.plt != null) {
    let pts: number, note: string
    if (i.plt >= 150) { pts = 0; note = `PLT ${i.plt} — Normal` }
    else if (i.plt >= 100) { pts = 1; note = `PLT ${i.plt} — Trombositopenia ringan` }
    else if (i.plt >= 50) { pts = 2; note = `PLT ${i.plt} — Trombositopenia sedang` }
    else if (i.plt >= 20) { pts = 3; note = `PLT ${i.plt} — Trombositopenia berat` }
    else { pts = 4; note = `PLT ${i.plt} — Sangat berat` }
    add('Koagulasi — Trombosit', note, pts)
  } else skip('Koagulasi (Trombosit)')

  // Hepar
  if (i.bili != null) {
    let pts: number, note: string
    if (i.bili < 1.2) { pts = 0; note = `Bil ${i.bili} — Normal` }
    else if (i.bili < 2) { pts = 1; note = `Bil ${i.bili} — Ringan` }
    else if (i.bili < 6) { pts = 2; note = `Bil ${i.bili} — Sedang` }
    else if (i.bili < 12) { pts = 3; note = `Bil ${i.bili} — Berat` }
    else { pts = 4; note = `Bil ${i.bili} — Gagal hati` }
    add('Hepar — Bilirubin', note, pts)
  } else skip('Hepar (Bilirubin)')

  // Kardiovaskular
  if (i.cv !== '') {
    const pts = parseInt(i.cv, 10)
    const n = ['MAP≥70 tanpa vasopressor', 'MAP<70 tanpa vasopressor', 'Dopamine≤5 atau Dobutamine', 'Dopamine 5–15 / Epi,NE≤0.1 μg/kg/mnt', 'Dopamine>15 / Epi,NE>0.1 μg/kg/mnt']
    add('Kardiovaskular — MAP/Vasopressor', n[pts], pts)
  } else skip('Kardiovaskular (MAP/Vasopressor)')

  // SSP — GCS
  if (i.gcs != null) {
    let pts: number, note: string
    if (i.gcs >= 15) { pts = 0; note = `GCS ${i.gcs} — Sadar penuh` }
    else if (i.gcs >= 13) { pts = 1; note = `GCS ${i.gcs} — Kebingungan ringan` }
    else if (i.gcs >= 10) { pts = 2; note = `GCS ${i.gcs} — Somnolen` }
    else if (i.gcs >= 6) { pts = 3; note = `GCS ${i.gcs} — Stupor` }
    else { pts = 4; note = `GCS ${i.gcs} — Koma` }
    add('SSP — GCS', note, pts)
  } else skip('SSP (GCS)')

  // Renal
  let renDone = false
  if (i.cr != null) {
    let pts: number, note: string
    if (i.cr < 1.2) { pts = 0; note = `Cr ${i.cr} — Normal` }
    else if (i.cr < 2) { pts = 1; note = `Cr ${i.cr} — Disfungsi ringan` }
    else if (i.cr < 3.5) { pts = 2; note = `Cr ${i.cr} — AKI sedang` }
    else if (i.cr < 5) { pts = 3; note = `Cr ${i.cr} — AKI berat` }
    else { pts = 4; note = `Cr ${i.cr} — Gagal ginjal` }
    if (i.uo != null) {
      if (i.uo < 200 && pts < 4) { pts = 4; note = `Cr ${i.cr}+UO ${i.uo}mL/hr — Anuria` }
      else if (i.uo < 500 && pts < 3) { pts = 3; note = `Cr ${i.cr}+UO ${i.uo}mL/hr — Oliguria` }
    }
    add('Renal — Kreatinin' + (i.uo != null ? ' + UO' : ''), note, pts); renDone = true
  } else if (i.uo != null) {
    let pts: number, note: string
    if (i.uo < 200) { pts = 4; note = `UO ${i.uo}mL/hari — Anuria` }
    else if (i.uo < 500) { pts = 3; note = `UO ${i.uo}mL/hari — Oliguria` }
    else { pts = 0; note = `UO ${i.uo}mL/hari — Cukup (tanpa kreatinin)` }
    add('Renal — UO (tanpa kreatinin)', note, pts); renDone = true
  }
  if (!renDone) skip('Renal (Kreatinin/UO)')

  const baseline = i.baseline ?? 0
  const delta = total - baseline
  let color: string, interp: string, detail: string
  if (total <= 6) { color = 'green'; interp = 'Risiko Rendah'; detail = 'Mortalitas ICU estimasi <10%' }
  else if (total <= 9) { color = 'amber'; interp = 'Risiko Sedang'; detail = 'Mortalitas ICU estimasi 15–20%' }
  else if (total <= 12) { color = 'coral'; interp = 'Risiko Tinggi'; detail = 'Mortalitas ICU estimasi 40–50%' }
  else { color = 'red'; interp = 'Risiko Sangat Tinggi'; detail = 'Mortalitas ICU estimasi >80%' }

  const sepsis3Delta = i.baseline != null && delta >= 2 ? delta : null

  return { total, rows, missing, color, interp, detail, sepsis3Delta, baseline }
}

/* ===== CFS / BFS ===== */
export interface CfsInterp { score: number; label: string; color: string; title: string; desc: string }

const CFS_LABELS = ['', 'Sangat Bugar', 'Bugar', 'Mengatasi dengan Baik', 'Frailty Sangat Ringan', 'Frailty Ringan', 'Frailty Sedang', 'Frailty Berat', 'Frailty Sangat Berat', 'Sakit Terminal']
const CFS_INTERP: ({ c: string; t: string; d: string } | null)[] = [
  null,
  { c: 'green', t: 'Tidak Frail', d: 'Risiko rendah, toleransi intervensi ICU baik. Tidak ada pembatasan berbasis frailty.' },
  { c: 'green', t: 'Tidak Frail', d: 'Kondisi medis terkontrol, risiko rendah. Tidak ada pembatasan berbasis frailty.' },
  { c: 'green', t: 'Pre-Frail Ringan', d: 'Risiko relatif rendah. Monitoring fungsional pasca-ICU dianjurkan.' },
  { c: 'teal', t: 'Pre-Frail', d: 'Mulai diskusikan tujuan perawatan lebih awal. Risiko komplikasi pasca-ICU meningkat.' },
  { c: 'amber', t: 'Frailty Ringan', d: 'Risiko moderat. Diskusi tujuan perawatan & harapan fungsional pasca-ICU penting bersama keluarga.' },
  { c: 'coral', t: 'Frailty Sedang', d: 'Risiko tinggi mortalitas ICU. Pertimbangkan eskalasi vs de-eskalasi secara hati-hati bersama keluarga & tim etik.' },
  { c: 'coral', t: 'Frailty Berat', d: 'Risiko sangat tinggi. Konsultasi tim paliatif dianjurkan. Manfaat intervensi intensif mungkin sangat terbatas.' },
  { c: 'red', t: 'Frailty Sangat Berat', d: 'Manfaat intervensi agresif sangat terbatas. Prioritaskan comfort care dan diskusi advance directive.' },
  { c: 'red', t: 'Sakit Terminal', d: 'Harapan hidup <6 bulan. Prioritaskan comfort care, advance directive, dan dukungan keluarga.' },
]

export const CFS_OPTIONS = CFS_LABELS.map((label, i) => ({ score: i, label })).filter((o) => o.score >= 1)

export function cfsInterp(score: number): CfsInterp {
  const d = CFS_INTERP[score]!
  return { score, label: CFS_LABELS[score], color: d.c, title: d.t, desc: d.d }
}

/* ===== CPIS ===== */
export interface CpisInput {
  temp?: number
  wbc?: number
  band: 'yes' | 'no'
  sec: number // 0..2
  pao2?: number
  fio2?: number
  ards: 'yes' | 'no'
  xray: number // 0..2
  culture: string // '' or '0'..'2'
}

export interface CpisResult {
  total: number
  rows: ScoreRow[]
  missing: string[]
  color: string
  interp: string
  action: string
  cultureProvided: boolean
}

export function computeCpis(i: CpisInput): CpisResult {
  let total = 0
  const rows: ScoreRow[] = []
  const missing: string[] = []
  const add = (param: string, val: string, pts: number, note: string) => {
    rows.push({ organ: param, detail: `${val} → ${note}`, pts }); total += pts
  }

  if (i.temp != null) {
    let pts: number, note: string
    if (i.temp >= 36.5 && i.temp <= 38.4) { pts = 0; note = 'Normal' }
    else if (i.temp >= 38.5 && i.temp <= 38.9) { pts = 1; note = 'Subfebris tinggi' }
    else { pts = 2; note = i.temp < 36.5 ? 'Hipotermia' : 'Hipertermia/Febris tinggi' }
    add('Suhu', `${i.temp}°C`, pts, note)
  } else missing.push('Suhu')

  if (i.wbc != null) {
    let pts: number, note: string
    if (i.wbc >= 4000 && i.wbc <= 11000) { pts = 0; note = 'Normal' }
    else { pts = 1; note = i.wbc < 4000 ? 'Leukopenia' : 'Leukositosis' }
    if (pts === 1 && i.band === 'yes') { pts = 2; note += ' + Band forms ≥50%' }
    add('Leukosit', `${i.wbc} sel/mm³`, pts, note)
  } else missing.push('Leukosit')

  const secN = ['Tidak ada/sedikit', 'Sedikit/non-purulen', 'Banyak/purulen']
  add('Sekret Trakeal', secN[i.sec], i.sec, secN[i.sec])

  if (i.pao2 != null && i.fio2 != null && i.fio2 > 0) {
    const pf = i.pao2 / i.fio2
    const isARDS = i.ards === 'yes'
    let pts: number, note: string
    if (pf > 240 || isARDS) { pts = 0; note = isARDS ? 'ARDS (skor 0)' : `P/F=${pf.toFixed(0)}>240` }
    else { pts = 2; note = `P/F=${pf.toFixed(0)}≤240 bukan ARDS` }
    add('Oksigenasi (P/F)', `P/F=${pf.toFixed(0)}`, pts, note)
  } else if (i.ards === 'yes') {
    add('Oksigenasi', 'ARDS', 0, 'ARDS → skor 0')
  } else missing.push('Oksigenasi (PaO₂/FiO₂)')

  const xrayN = ['Tidak ada infiltrat', 'Infiltrat difus/patchy', 'Infiltrat lokal/segmental']
  add('Rontgen Thorax', xrayN[i.xray], i.xray, xrayN[i.xray])

  const cultureProvided = i.culture !== ''
  if (cultureProvided) {
    const cPts = parseInt(i.culture, 10)
    const cN = ['Tidak ada kuman patogen', 'Kuman patogen ditemukan', 'Kuman + Gram stain sesuai']
    add('Kultur Trakeal', cN[cPts], cPts, cN[cPts])
  } else {
    rows.push({ organ: 'Kultur Trakeal', pts: null })
  }

  let color: string, interp: string, action: string
  if (total <= 6) { color = 'green'; interp = 'CPIS ≤6 — VAP Tidak Mungkin'; action = 'Pertimbangkan de-eskalasi/penghentian antibiotik (Protokol Singh hari ke-3). Evaluasi ulang 24-48 jam.' }
  else { color = 'red'; interp = 'CPIS >6 — VAP Kemungkinan Besar'; action = 'Lanjutkan antibiotik VAP sesuai panduan lokal. De-eskalasi berdasarkan kultur. Evaluasi dalam 48–72 jam.' }

  return { total, rows, missing, color, interp, action, cultureProvided }
}

/* ===== RASS ===== */
export interface RassInterp { score: number; label: string; color: string; title: string; action: string }

const RASS_DATA: Record<string, { c: string; t: string; a: string }> = {
  '4': { c: 'red', t: 'Combative (+4)', a: '⚠️ DARURAT: Amankan pasien & jalur IV/ETT segera! Analgesik IV bolus → sedatif titrasi. Evaluasi penyebab: nyeri, hipoksia, retensi urin, delirium hiperaktif.' },
  '3': { c: 'red', t: 'Very Agitated (+3)', a: 'Evaluasi nyeri (CPOT), hipoksia, distensi kandung kemih, withdrawal. Analgesik IV terlebih dahulu. Pertimbangkan midazolam bolus atau dexmedetomidine.' },
  '2': { c: 'coral', t: 'Agitated (+2)', a: 'Evaluasi penyebab reversibel. Titrasi sedatif ke atas. Pertimbangkan reposisi, analgesik, dexmedetomidine.' },
  '1': { c: 'amber', t: 'Restless (+1)', a: 'Cek kenyamanan: nyeri? posisi? kandung kemih? NGT bermasalah? Orientasikan pasien. Analgesik sebelum tambah sedatif.' },
  '0': { c: 'green', t: 'Alert & Calm (0) ✓', a: 'TARGET SEDASI IDEAL (PADIS 2018/eCASH). Pertahankan. Monitor setiap 4 jam. Lakukan SAT jika memenuhi syarat.' },
  '-1': { c: 'teal', t: 'Drowsy (-1)', a: 'Target ringan ICU tercapai. Monitor setiap 4 jam. Lakukan SAT (Spontaneous Awakening Trial) + SBT jika kondisi memungkinkan.' },
  '-2': { c: 'teal', t: 'Light Sedation (-2)', a: 'Dalam rentang target. Pertimbangkan kurangi dosis sedatif bertahap menuju RASS 0/-1 jika kondisi stabil.' },
  '-3': { c: 'blue', t: 'Moderate Sedation (-3)', a: 'Lebih dalam dari target standar. Kurangi dosis secara bertahap. CAM-ICU masih dapat dinilai. Pertimbangkan SAT.' },
  '-4': { c: 'purple', t: 'Deep Sedation (-4)', a: 'Hanya untuk indikasi khusus (HICP, NMB, status epileptikus refrakter). CAM-ICU TIDAK dapat dinilai (UTA). Re-evaluasi indikasi sedasi dalam setiap 24 jam.' },
  '-5': { c: 'gray', t: 'Unarousable (-5)', a: 'Sedasi paling dalam. Monitor BIS/EEG jika tersedia. CAM-ICU TIDAK dapat dinilai. Re-evaluasi indikasi segera.' },
}

export const RASS_OPTIONS: { score: number; name: string; desc: string }[] = [
  { score: 4, name: 'Combative', desc: 'Agresif, bahaya bagi staf' },
  { score: 3, name: 'Very Agitated', desc: 'Menarik/melepas selang, agresif' },
  { score: 2, name: 'Agitated', desc: 'Gerakan tidak bertujuan, melawan ventilator' },
  { score: 1, name: 'Restless', desc: 'Cemas, gerakan tidak agresif' },
  { score: 0, name: 'Alert & Calm', desc: 'Sadar, tenang' },
  { score: -1, name: 'Drowsy', desc: 'Membuka mata >10 dtk terhadap suara' },
  { score: -2, name: 'Light Sedation', desc: 'Membuka mata <10 dtk terhadap suara' },
  { score: -3, name: 'Moderate Sedation', desc: 'Gerakan terhadap suara (tanpa kontak mata)' },
  { score: -4, name: 'Deep Sedation', desc: 'Gerakan terhadap rangsang fisik' },
  { score: -5, name: 'Unarousable', desc: 'Tidak ada respons terhadap suara/fisik' },
]

export function rassInterp(score: number): RassInterp {
  const d = RASS_DATA[String(score)]
  const label = score >= 0 ? (score > 0 ? '+' : '') + score : String(score)
  return { score, label, color: d.c, title: d.t, action: d.a }
}

/* ===== CAM-ICU ===== */
export type YesNo = 'yes' | 'no' | null

export interface CamResult {
  result: 'positif' | 'negatif'
  features: { f1: YesNo; f2: YesNo; f3: YesNo; f4: YesNo }
  reason: string
  showThink: boolean
  showFeatureLine: boolean
}

export function computeCamIcu(f1: YesNo, f2: YesNo, f3: YesNo, f4: YesNo): CamResult | { error: string } {
  if (!f1 || !f2) return { error: 'Lengkapi minimal Fitur 1 dan Fitur 2 terlebih dahulu.' }
  const pos = f1 === 'yes' && f2 === 'yes' && (f3 === 'yes' || f4 === 'yes')
  const features = { f1, f2, f3, f4 }
  if (pos) {
    return { result: 'positif', features, reason: '', showThink: true, showFeatureLine: true }
  }
  if (f1 === 'no' || f2 === 'no') {
    return {
      result: 'negatif', features,
      reason: f1 === 'no' ? 'Fitur 1 negatif (tidak ada perubahan akut/fluktuasi) → hentikan penilaian.' : 'Fitur 2 lulus (tidak ada gangguan perhatian).',
      showThink: false, showFeatureLine: false,
    }
  }
  return {
    result: 'negatif', features,
    reason: 'F1+F2 ada, namun F3 dan F4 keduanya negatif → CAM-ICU Negatif.',
    showThink: false, showFeatureLine: false,
  }
}

/* ===== APACHE-II ===== */
export interface ApacheInput {
  temp?: number; map?: number; hr?: number; rr?: number
  fio2?: number; pao2?: number; paco2?: number; ph?: number
  na?: number; k?: number; cr?: number; aki: boolean
  hct?: number; wbc?: number; gcs?: number; age?: number
  chronic: boolean; chronicType: 'elective' | 'emergency'
}

export interface ApacheRow { label: string; val: string; pts: number; skipped: boolean }

export interface ApacheResult {
  aps: number; ageScore: number; chronicScore: number; total: number
  mort: string; color: string; rows: ApacheRow[]; missing: string[]
}

export function computeApache(i: ApacheInput): ApacheResult {
  let aps = 0
  const rows: ApacheRow[] = []
  const missing: string[] = []
  const row = (label: string, val: string, pts: number, skipped: boolean) => {
    if (skipped) { missing.push(label); rows.push({ label, val: '—', pts: 0, skipped: true }) }
    else { rows.push({ label, val, pts, skipped: false }); aps += pts }
  }

  if (i.temp != null) {
    let pts: number
    if (i.temp >= 41) pts = 4; else if (i.temp >= 39) pts = 3; else if (i.temp >= 38.5) pts = 1
    else if (i.temp >= 36) pts = 0; else if (i.temp >= 34) pts = 1; else if (i.temp >= 32) pts = 2
    else if (i.temp >= 30) pts = 3; else pts = 4
    row('Suhu rektal (°C)', i.temp.toFixed(1) + '°C', pts, false)
  } else row('Suhu rektal', '', 0, true)

  if (i.map != null) {
    let pts: number
    if (i.map >= 160) pts = 4; else if (i.map >= 130) pts = 3; else if (i.map >= 110) pts = 2
    else if (i.map >= 70) pts = 0; else if (i.map >= 50) pts = 2; else pts = 4
    row('MAP (mmHg)', i.map + ' mmHg', pts, false)
  } else row('MAP', '', 0, true)

  if (i.hr != null) {
    let pts: number
    if (i.hr >= 180) pts = 4; else if (i.hr >= 140) pts = 3; else if (i.hr >= 110) pts = 2
    else if (i.hr >= 70) pts = 0; else if (i.hr >= 55) pts = 2; else if (i.hr >= 40) pts = 3; else pts = 4
    row('Nadi (bpm)', i.hr + ' bpm', pts, false)
  } else row('Nadi', '', 0, true)

  if (i.rr != null) {
    let pts: number
    if (i.rr >= 50) pts = 4; else if (i.rr >= 35) pts = 3; else if (i.rr >= 25) pts = 1
    else if (i.rr >= 12) pts = 0; else if (i.rr >= 10) pts = 1; else if (i.rr >= 6) pts = 2; else pts = 4
    row('Frekuensi napas (/mnt)', i.rr + ' /mnt', pts, false)
  } else row('Frekuensi napas', '', 0, true)

  // Oksigenasi
  if (i.fio2 != null && i.pao2 != null) {
    let pts: number
    if (i.fio2 >= 0.5) {
      if (i.paco2 != null) {
        const alv = i.fio2 * (760 - 47) - i.paco2 / 0.8
        const aaDO2 = alv - i.pao2
        if (aaDO2 >= 500) pts = 4; else if (aaDO2 >= 350) pts = 3; else if (aaDO2 >= 200) pts = 2; else pts = 0
        row('Oksigenasi A-aDO₂ (FiO₂≥0.5)', `A-aDO₂=${aaDO2.toFixed(0)}`, pts, false)
      } else row('Oksigenasi (PaCO₂ diperlukan untuk FiO₂≥0.5)', '', 0, true)
    } else {
      if (i.pao2 > 70) pts = 0; else if (i.pao2 > 61) pts = 1; else if (i.pao2 >= 55) pts = 3; else pts = 4
      row('Oksigenasi PaO₂ (FiO₂<0.5)', `PaO₂=${i.pao2} mmHg`, pts, false)
    }
  } else row('Oksigenasi', '', 0, true)

  if (i.ph != null) {
    let pts: number
    if (i.ph >= 7.7) pts = 4; else if (i.ph >= 7.6) pts = 3; else if (i.ph >= 7.5) pts = 1
    else if (i.ph >= 7.33) pts = 0; else if (i.ph >= 7.25) pts = 2; else if (i.ph >= 7.15) pts = 3; else pts = 4
    row('pH Arteri', i.ph.toFixed(2), pts, false)
  } else row('pH Arteri', '', 0, true)

  if (i.na != null) {
    let pts: number
    if (i.na >= 180) pts = 4; else if (i.na >= 160) pts = 3; else if (i.na >= 155) pts = 2; else if (i.na >= 150) pts = 1
    else if (i.na >= 130) pts = 0; else if (i.na >= 120) pts = 2; else if (i.na >= 111) pts = 3; else pts = 4
    row('Natrium serum (mEq/L)', i.na + ' mEq/L', pts, false)
  } else row('Natrium serum', '', 0, true)

  if (i.k != null) {
    let pts: number
    if (i.k >= 7) pts = 4; else if (i.k >= 6) pts = 3; else if (i.k >= 5.5) pts = 1
    else if (i.k >= 3.5) pts = 0; else if (i.k >= 3) pts = 1; else if (i.k >= 2.5) pts = 2; else pts = 4
    row('Kalium serum (mEq/L)', i.k.toFixed(1) + ' mEq/L', pts, false)
  } else row('Kalium serum', '', 0, true)

  if (i.cr != null) {
    let pts: number
    if (i.cr >= 3.5) pts = 4; else if (i.cr >= 2) pts = 3; else if (i.cr >= 1.5) pts = 2; else if (i.cr >= 0.6) pts = 0; else pts = 2
    const raw = pts
    if (i.aki) pts = Math.min(pts * 2, 8)
    row(`Kreatinin${i.aki ? ' [AKI: skor×2]' : ''}`, i.cr.toFixed(1) + ' mg/dL' + (i.aki ? ` (${raw}pt×2)` : ''), pts, false)
  } else row('Kreatinin serum', '', 0, true)

  if (i.hct != null) {
    let pts: number
    if (i.hct >= 60) pts = 4; else if (i.hct >= 50) pts = 2; else if (i.hct >= 46) pts = 1
    else if (i.hct >= 30) pts = 0; else if (i.hct >= 20) pts = 2; else pts = 4
    row('Hematokrit (%)', i.hct.toFixed(1) + '%', pts, false)
  } else row('Hematokrit', '', 0, true)

  if (i.wbc != null) {
    let pts: number
    if (i.wbc >= 40) pts = 4; else if (i.wbc >= 20) pts = 2; else if (i.wbc >= 15) pts = 1
    else if (i.wbc >= 3) pts = 0; else if (i.wbc >= 1) pts = 2; else pts = 4
    row('Leukosit (×1000/mm³)', i.wbc.toFixed(1), pts, false)
  } else row('Leukosit', '', 0, true)

  if (i.gcs != null) {
    const pts = 15 - i.gcs
    row('GCS (poin = 15 − GCS)', `GCS ${i.gcs} → ${pts} poin`, pts, false)
  } else row('GCS', '', 0, true)

  let ageScore = 0
  if (i.age != null) {
    if (i.age < 45) ageScore = 0; else if (i.age < 55) ageScore = 2; else if (i.age < 65) ageScore = 3; else if (i.age < 75) ageScore = 5; else ageScore = 6
  }
  const chronicScore = i.chronic ? (i.chronicType === 'elective' ? 2 : 5) : 0
  const total = aps + ageScore + chronicScore

  let mort: string
  if (total <= 4) mort = '~4%'; else if (total <= 9) mort = '~8%'; else if (total <= 14) mort = '~15%'
  else if (total <= 19) mort = '~25%'; else if (total <= 24) mort = '~40%'
  else if (total <= 29) mort = '~55%'; else if (total <= 34) mort = '~73%'; else mort = '~85%'

  let color: string
  if (total <= 9) color = 'green'; else if (total <= 19) color = 'amber'; else if (total <= 29) color = 'coral'; else color = 'red'

  return { aps, ageScore, chronicScore, total, mort, color, rows, missing }
}

/* ===== Candida Score ===== */
export interface CandidaInput { surgery: boolean; tpn: boolean; colonize: boolean; sepsis: boolean }
export interface CandidaResult { score: number; high: boolean; color: string; interp: string; action: string; items: string[] }

export function computeCandida(i: CandidaInput): CandidaResult {
  let score = 0
  const items: string[] = []
  if (i.surgery) { score += 1; items.push('Operasi mayor (+1)') }
  if (i.tpn) { score += 1; items.push('TPN (+1)') }
  if (i.colonize) { score += 1; items.push('Kolonisasi multifocal (+1)') }
  if (i.sepsis) { score += 2; items.push('Sepsis berat (+2)') }
  const high = score >= 3
  return {
    score, high, color: high ? 'red' : 'green',
    interp: high ? 'RISIKO TINGGI — Skor ≥3' : 'RISIKO RENDAH — Skor <3',
    action: high
      ? 'Pertimbangkan antijamur empiris: Flukonazol 400 mg/hari (jika stabil, tidak ada riwayat azole) ATAU Ekinokandin (jika tidak stabil / riwayat azole / curiga C. glabrata). Evaluasi ulang dalam 4–5 hari; hentikan jika kultur negatif dan kondisi membaik.'
      : 'Antijamur empiris tidak direkomendasikan. Pantau ketat faktor risiko tambahan (CVC, antibiotik spektrum luas, hemodialisis). Kultur darah jika ada kecurigaan klinis.',
    items,
  }
}
