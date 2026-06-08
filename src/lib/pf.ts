/* P/F ratio, Oxygenation Index, Driving Pressure, OSI, gagal napas type.
   Faithful TS port of scripts-kalkulator-pf.js (calcPF). */

export interface PfInput {
  pao2: number
  fio2: number
  map?: number
  spo2?: number
  pplat?: number
  peep?: number
  paco2?: number
}

export interface PfBlock {
  label: string
  interp: string
  detail: string
  color: string
  cls: string
  borderColor?: string
}

export function computePf(input: PfInput): PfBlock[] {
  const { pao2, fio2, map, spo2, pplat, peep, paco2 } = input
  const blocks: PfBlock[] = []

  const pf = pao2 / fio2
  let pfClass: string
  let pfColor: string
  if (pf >= 400) { pfClass = 'Normal'; pfColor = 'var(--green)' }
  else if (pf >= 300) { pfClass = 'Hipoksemia Ringan'; pfColor = 'var(--teal)' }
  else if (pf >= 200) { pfClass = 'ARDS Mild (Berlin)'; pfColor = 'var(--amber)' }
  else if (pf >= 100) { pfClass = 'ARDS Moderate (Berlin)'; pfColor = 'var(--orange)' }
  else { pfClass = 'ARDS Severe (Berlin)'; pfColor = 'var(--red)' }

  blocks.push({
    label: 'P/F Ratio — Klasifikasi Oksigenasi',
    interp: `${pf.toFixed(0)} mmHg — ${pfClass}`,
    detail: `PaO₂ ${pao2} ÷ FiO₂ ${fio2} = ${pf.toFixed(1)}`,
    color: pfColor,
    cls: pf >= 300 ? 'abg-normal' : pf >= 200 ? 'abg-mild' : 'abg-severe',
  })

  if (map) {
    const oi = (map * fio2 * 100) / pao2
    const oiClass = oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat — pertimbangkan ECMO'
    const oiColor = oi < 5 ? 'var(--green)' : oi < 25 ? 'var(--amber)' : 'var(--red)'
    blocks.push({
      label: 'Oxygenation Index (OI)',
      interp: `${oi.toFixed(1)} — ${oiClass}`,
      detail: `OI = (MAP ${map} × FiO₂ ${fio2} × 100) / PaO₂ ${pao2}`,
      color: oiColor,
      cls: 'abg-mild',
    })
  }

  if (pplat != null && peep != null) {
    const dp = Math.round((pplat - peep) * 10) / 10
    const dpColor = dp <= 13 ? 'var(--green)' : dp <= 15 ? 'var(--amber)' : 'var(--red)'
    blocks.push({
      label: 'Driving Pressure',
      interp: `${dp} cmH₂O — ${dp <= 13 ? 'Optimal (≤13)' : dp <= 15 ? 'Batas (≤15)' : '⚠ Tinggi — risiko VILI'}`,
      detail: `Pplat ${pplat} − PEEP ${peep} = ${dp} cmH₂O · Target ≤15 (ideal ≤13)`,
      color: dpColor,
      cls: dp <= 15 ? 'abg-mild' : 'abg-severe',
    })
  }

  if (spo2 && map) {
    const osi = (map * fio2 * 100) / spo2
    blocks.push({
      label: 'OSI (SpO₂-based OI — jika tidak ada ABG)',
      interp: `OSI = ${osi.toFixed(1)}`,
      detail: `OSI = (MAP ${map} × FiO₂ × 100) / SpO₂ ${spo2}%`,
      color: 'var(--blue)',
      cls: 'abg-blue',
    })
  }

  if (paco2) {
    let failType: string
    let failDesc: string
    let failColor: string
    if (paco2 > 50) {
      failType = 'Tipe II (Hiperkapnik)'
      failDesc = 'Kegagalan ventilasi. PaCO₂ > 50 mmHg. Pertimbangkan NIV / intubasi jika asidosis berat.'
      failColor = 'var(--red)'
    } else if (pf < 300 || pao2 < 60) {
      failType = 'Tipe I (Hipoksemik)'
      failDesc = 'Kegagalan oksigenasi tanpa retensi CO₂ yang signifikan.'
      failColor = 'var(--amber)'
    } else {
      failType = 'Bukan Tipe I/II yang jelas'
      failDesc = 'Oksigenasi baik, PaCO₂ normal/rendah.'
      failColor = 'var(--green)'
    }
    blocks.push({
      label: 'Tipe Gagal Napas',
      interp: failType,
      detail: `${failDesc} (PaCO₂ = ${paco2} mmHg)`,
      color: failColor,
      cls: '',
      borderColor: failColor,
    })
  }

  return blocks
}
