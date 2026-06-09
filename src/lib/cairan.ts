/* Daily fluid calculators — port of scripts-kalkulator-cairan.js */

export type RosePhase = 'R' | 'O' | 'S' | 'E'
export interface RoseData { label: string; color: string; target: string; targetMin: number; targetMax: number; desc: string }

export const ROSE_DATA: Record<RosePhase, RoseData> = {
  R: {
    label: 'Resuscitation', color: '#ef4444',
    target: '+500 s/d +1.500 mL/24 jam', targetMin: 500, targetMax: 1500,
    desc: 'Tujuan: pulihkan perfusi organ, atasi syok. Berikan bolus cairan terukur (250–500 mL kristaloid isotonik) dan nilai ulang setiap pemberian. Hentikan resusitasi jika tidak ada fluid responsiveness. Positive balance terbatas dan terukur.',
  },
  O: {
    label: 'Optimization', color: '#f97316',
    target: '0 s/d +500 mL/24 jam', targetMin: 0, targetMax: 500,
    desc: 'Tujuan: fine-tune perfusi organ, titrasi vasopresor/inotropik, optimalkan preload. Hindari volume loading berlebih. Gunakan parameter dinamik (PLR, PPV, SVV, IVC collapsibility). Balance mendekati nol.',
  },
  S: {
    label: 'Stabilization', color: '#22c55e',
    target: '±0 mL (net zero)', targetMin: -200, targetMax: 300,
    desc: 'Tujuan: pertahankan organ perfusion dengan cairan maintenance saja. Ganti kehilangan yang terukur (urin, drain, NGT). Prioritas: jangan tambah positive balance. Mulai evaluasi apakah siap Evacuation.',
  },
  E: {
    label: 'Evacuation', color: '#3b82f6',
    target: '−500 s/d −1.500 mL/24 jam', targetMin: -1500, targetMax: -500,
    desc: 'Tujuan: mobilisasi dan eliminasi kelebihan cairan. Indikasi: FO >10% BB baseline. Strategi: furosemid IV, pembatasan input agresif, CRRT jika gagal ginjal atau refrakter diuretik. Target negative balance −500 s/d −1.500 mL/hari.',
  },
}

export interface BasalResult { icuPerDay: number; icuPerHour: number; hs: number }

export function calcBasal(bw: number, targetMlKgDay: number): BasalResult {
  const icuPerDay = bw * targetMlKgDay
  const icuPerHour = icuPerDay / 24
  let hs: number
  if (bw <= 10) hs = bw * 100
  else if (bw <= 20) hs = 1000 + (bw - 10) * 50
  else hs = 1500 + (bw - 20) * 20
  return { icuPerDay, icuPerHour, hs }
}

export type VentType = 'ventilator' | 'hfnc' | 'spontan'
export type SweatLevel = 'none' | 'mild' | 'moderate' | 'severe'

export interface KoreksiResult {
  maintenance: number; iwlBase: number; iwlLabel: string
  tempCorr: number; sweatCorr: number; iwlTotal: number
  uoDay: number; total: number; ratePerHr: number; perKgDay: number
}

export function calcKoreksi(
  bw: number, targetMlKgDay: number, temp: number,
  vent: VentType, sweat: SweatLevel, uoTgt: number,
  ngt: number, drain: number, other: number
): KoreksiResult {
  const maintenance = bw * targetMlKgDay
  let iwlBase: number, iwlLabel: string
  if (vent === 'ventilator') { iwlBase = bw * 6.5; iwlLabel = '~6.5 mL/kg/hari (gas terhumidifikasi)' }
  else if (vent === 'hfnc') { iwlBase = bw * 9; iwlLabel = '~9 mL/kg/hari (HFNC)' }
  else { iwlBase = bw * 12; iwlLabel = '~12 mL/kg/hari (spontan)' }

  const tempDelta = temp - 37.5
  const tempCorr = tempDelta > 0 ? maintenance * 0.10 * tempDelta : 0
  const sweatMap: Record<SweatLevel, number> = { none: 0, mild: 200, moderate: 500, severe: 900 }
  const sweatCorr = sweatMap[sweat]
  const iwlTotal = iwlBase + tempCorr + sweatCorr
  const uoDay = uoTgt * bw * 24
  const total = maintenance + iwlTotal + uoDay + ngt + drain + other
  return { maintenance, iwlBase, iwlLabel, tempCorr, sweatCorr, iwlTotal, uoDay, total, ratePerHr: total / 24, perKgDay: total / bw }
}

export interface DayBalance { day: number; balance: number; cumulative: number }

export function calcCumulative(days: (number | null)[]): DayBalance[] {
  let cum = 0
  return days
    .map((v, i) => v == null ? null : { day: i + 1, balance: v, cumulative: (cum += v) })
    .filter(Boolean) as DayBalance[]
}

export interface FoResult { diffKg: number; diffMl: number; foPercent: number; label: string; color: string; msg: string; roseHint: string }

export function calcFluidOverload(dry: number, current: number): FoResult {
  const diffKg = current - dry
  const diffMl = diffKg * 1000
  const foPercent = (diffKg / dry) * 100
  let color: string, label: string, msg: string, roseHint: string
  if (foPercent < 0) {
    color = 'blue'; label = 'Defisit / Kemungkinan Hipovolemia'
    msg = `Berat turun ${Math.abs(foPercent).toFixed(1)}% dari baseline. Evaluasi tanda hipovolemia.`
    roseHint = 'Pertimbangkan fase R atau O jika ada tanda hipoperfusi.'
  } else if (foPercent < 5) {
    color = 'green'; label = 'Euvolemia (FO <5%)'
    msg = 'Fluid overload dalam batas normal.'
    roseHint = 'Pertahankan fase S (Stabilization).'
  } else if (foPercent < 10) {
    color = 'amber'; label = 'Overload Ringan (FO 5–10%)'
    msg = 'Monitor ketat. Batasi input cairan. Pertimbangkan transisi ke fase Evacuation.'
    roseHint = 'Evaluasi kesiapan masuk fase E (Evacuation).'
  } else if (foPercent < 15) {
    color = 'coral'; label = 'Overload Sedang (FO 10–15%) ⚠️'
    msg = 'Melebihi threshold 10% — indikasi fase Evacuation aktif. Pertimbangkan diuretik furosemid IV. Sutherland et al.: FO ≥10% berhubungan dengan mortalitas meningkat.'
    roseHint = '→ Masuk fase E (Evacuation). Target balans negatif −500 s/d −1.500 mL/hari.'
  } else {
    color = 'red'; label = 'Overload Berat (FO ≥15%) 🚨'
    msg = 'Overload berat — risiko edema paru, ARDS, disfungsi organ. Intervensi segera diperlukan. Pertimbangkan CRRT jika furosemid tidak respons.'
    roseHint = '→ Fase E (Evacuation) — target negatif agresif, konsultasikan nefrologi.'
  }
  return { diffKg, diffMl, foPercent, label, color, msg, roseHint }
}

export interface FbResult { totalIn: number; totalOut: number; balance: number; label: string; color: string; msg: string }

export function calcFluidBalance(
  inputs: [number, number, number, number, number],
  outputs: [number, number, number, number, number]
): FbResult {
  const totalIn = inputs.reduce((a, b) => a + b, 0)
  const totalOut = outputs.reduce((a, b) => a + b, 0)
  const balance = totalIn - totalOut
  let color: string, label: string, msg: string
  if (balance > 2000) { color = 'red'; label = 'Balance Positif Berat (>2 L)'; msg = 'Akumulasi >2 L — risiko edema, disfungsi organ, dan mortalitas meningkat. Intervensi aktif.' }
  else if (balance > 1000) { color = 'coral'; label = 'Balance Positif Sedang (1–2 L)'; msg = 'Pertimbangkan pembatasan input dan evaluasi kebutuhan diuretik.' }
  else if (balance >= -500) { color = 'green'; label = 'Balance Netral / Euvolemia'; msg = 'Fluid balance dalam rentang target (−500 s/d +1.000 mL). Pertahankan.' }
  else if (balance >= -1500) { color = 'blue'; label = 'Balance Negatif (De-resusitasi)'; msg = 'Balance negatif ringan-sedang — dapat diterima pada fase Evacuation.' }
  else { color = 'red'; label = 'Balance Negatif Berat (<−1.5 L)'; msg = 'Balance sangat negatif — periksa tanda hipovolemia dan kehilangan yang tidak terhitung.' }
  return { totalIn, totalOut, balance, label, color, msg }
}
