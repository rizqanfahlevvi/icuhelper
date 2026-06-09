/* Electrolyte correction calculators — port of scripts-kalkulator-electro.js */

/* ── Natrium ── */
export interface NaResult {
  type: 'hypo' | 'hyper' | 'normal'
  na: number; naCorr?: number; naCorrNote?: string
  tbw: number
  // hyponatremia
  naTarget?: number; vol3pct?: number; rateMlHr?: number; durationH?: number; limitLow?: number; limitHigh?: number
  // hypernatremia
  waterDeficitL?: number; rateD5W?: number
  sev?: string; color?: string
}

export function calcNa(na: number, sex: 'm' | 'f', bw: number, gluMgdl?: number, onset: 'akut' | 'kronik' = 'kronik', speed: 'standard' | 'emergency' = 'standard'): NaResult {
  const tbwF = sex === 'm' ? 0.6 : 0.5
  const tbw = bw * tbwF
  const naT = 140

  let naCorr = na, naCorrNote: string | undefined
  if (gluMgdl != null && gluMgdl > 100) {
    const corr = 1.6 * (gluMgdl - 100) / 100
    naCorr = parseFloat((na + corr).toFixed(1))
    naCorrNote = `Na terkoreksi hiperglikemia (Glukosa ${gluMgdl} mg/dL): ${na} + ${corr.toFixed(1)} = ${naCorr} mEq/L`
  }

  const limitLow = onset === 'akut' ? 10 : 6
  const limitHigh = onset === 'akut' ? 12 : 8

  if (na < 135) {
    const naTarget = Math.min(na + limitLow, naT)
    const deltaNa = naTarget - na
    const vol3pct = (deltaNa * tbw * 1000) / 513
    let rateMlHr: number, durationH: number
    if (speed === 'emergency') {
      durationH = deltaNa / 2
      rateMlHr = vol3pct / durationH
    } else {
      durationH = deltaNa / 0.5
      rateMlHr = vol3pct / durationH
    }
    const sev = na < 120 ? 'Berat (<120)' : na < 130 ? 'Sedang (120–129)' : 'Ringan (130–134)'
    const color = na < 120 ? 'red' : 'amber'
    return { type: 'hypo', na, naCorr, naCorrNote, tbw, naTarget, vol3pct: Math.round(vol3pct), rateMlHr: parseFloat(rateMlHr.toFixed(1)), durationH: parseFloat(durationH.toFixed(1)), limitLow, limitHigh, sev, color }
  }

  if (na > 145) {
    const waterDeficitL = tbw * (na / naT - 1)
    const rateD5W = waterDeficitL * 1000 / 48
    return { type: 'hyper', na, naCorr, naCorrNote, tbw, waterDeficitL: parseFloat(waterDeficitL.toFixed(2)), rateD5W: Math.round(rateD5W), color: 'amber' }
  }

  return { type: 'normal', na, naCorr, naCorrNote, tbw }
}

/* ── Kalium ── */
export interface KResult {
  type: 'hypo' | 'hyper' | 'normal'
  k: number; defLow?: number; defHigh?: number; maxRate?: number; maxConc?: number
  sev?: string; color?: string; phNote?: string
}

export function calcK(k: number, bw?: number, ph?: number, access: 'perifer' | 'sentral' = 'perifer'): KResult {
  let phNote: string | undefined
  if (ph != null) {
    const phEffect = (7.4 - ph) * 6
    const kTrue = k - phEffect
    const isAcidosis = ph < 7.4
    phNote = isAcidosis
      ? `Asidosis (pH ${ph}) meningkatkan K serum ~${Math.abs(phEffect).toFixed(2)} mEq/L. K intrasel sesungguhnya: ~${kTrue.toFixed(2)} mEq/L. Koreksi asidosis akan menurunkan K serum.`
      : ph > 7.4 ? `Alkalosis (pH ${ph}) menurunkan K serum ~${Math.abs(phEffect).toFixed(2)} mEq/L. K intrasel sesungguhnya: ~${kTrue.toFixed(2)} mEq/L.` : undefined
  }

  if (k < 3.5) {
    const bwFactor = bw && bw > 0 ? bw / 70 : 1
    const defLow = Math.round((3.5 - k) * 100 * bwFactor)
    const defHigh = Math.round((3.5 - k) * 200 * bwFactor)
    const maxRate = access === 'perifer' ? 10 : 20
    const maxConc = access === 'perifer' ? 40 : 80
    const sev = k < 2.5 ? 'Berat (<2.5 mEq/L)' : k < 3.0 ? 'Sedang (2.5–2.9)' : 'Ringan (3.0–3.4)'
    const color = k < 2.5 ? 'red' : 'amber'
    return { type: 'hypo', k, defLow, defHigh, maxRate, maxConc, sev, color, phNote }
  }

  if (k > 5.0) {
    const sev = k > 6.5 ? 'Berat (>6.5) — EMERGENSI' : k > 6.0 ? 'Berat (6.0–6.5)' : 'Sedang (5.1–6.0)'
    return { type: 'hyper', k, sev, color: 'red', phNote }
  }

  return { type: 'normal', k, phNote }
}

/* ── Kalsium ── */
export interface CaResult {
  caCorr: number; caIonEst: number; type: 'hypo' | 'hyper' | 'normal'; sev: string; color: string; tx: string
}

export function calcCa(caMgdl: number, alb: number, ph?: number, bw?: number): CaResult {
  const caCorr = parseFloat((caMgdl + 0.8 * (4 - alb)).toFixed(2))
  let caIonEst = caCorr * 0.25
  if (ph != null) {
    const phDiff = 7.4 - ph
    caIonEst = caCorr * 0.25 + phDiff * 0.5
  }
  caIonEst = parseFloat(caIonEst.toFixed(2))

  let type: 'hypo' | 'hyper' | 'normal', sev: string, color: string, tx: string
  if (caCorr < 7.0) {
    type = 'hypo'; sev = 'Hipokalsemia Berat (<7.0 mg/dL) — Emergensi'; color = 'red'
    tx = `Ca glukonat 10% 10–20 mL IV bolus dalam 10 mnt. Pasang EKG monitor. Infus maintenans: 50 mL dalam 500 mL D5W selama 4–6 jam.${bw ? ` Dosis: 0.5 mL/kg = ${(0.5 * bw).toFixed(0)} mL.` : ''}`
  } else if (caCorr < 8.5) {
    type = 'hypo'; sev = 'Hipokalsemia'; color = 'amber'
    tx = `Ca glukonat 10% IV: ${bw ? `${(0.5 * bw).toFixed(0)}–${Math.min(bw, 20).toFixed(0)} mL (0.5–1 mL/kg) dalam 15–30 mnt. ` : '0.5–1 mL/kg max 20 mL IV. '}Lanjut oral Ca + Vitamin D jika indikasi.`
  } else if (caCorr <= 10.5) {
    type = 'normal'; sev = 'Ca Normal (8.5–10.5 mg/dL)'; color = 'teal'
    tx = 'Tidak diperlukan koreksi kalsium.'
  } else if (caCorr <= 12.0) {
    type = 'hyper'; sev = 'Hiperkalsemia Ringan-Sedang (>10.5–12.0 mg/dL)'; color = 'amber'
    tx = 'Hidrasi NaCl 0.9% 200–300 mL/jam. Evaluasi penyebab (hiperparatiroid, keganasan). Pertimbangkan bisphosphonate jika terkait keganasan.'
  } else {
    type = 'hyper'; sev = 'Hiperkalsemia Berat (>12.0 mg/dL) — Emergensi'; color = 'red'
    tx = 'NaCl 0.9% agresif 500 mL/jam, lalu Furosemid 20–40 mg IV setelah euvolemia. Kalsitonin 4–8 IU/kg tiap 12 jam. Zoledronic acid 4 mg IV jika terkait keganasan.'
  }

  return { caCorr, caIonEst, type, sev, color, tx }
}

/* ── Magnesium ── */
export interface MgResult {
  mg: number; mgMmol: number; type: 'hypo' | 'hyper' | 'normal'
  sev?: string; color?: string
  doseG?: number; regime?: string; renalWarning?: boolean
}

export function calcMg(mgMgdl: number, bw?: number, egfr?: number, symptomatic: boolean = false): MgResult {
  const mgMmol = parseFloat((mgMgdl / 12.15).toFixed(2))
  const renalImp = egfr != null && egfr < 30

  if (mgMgdl < 1.7) {
    let doseG: number
    if (symptomatic) doseG = bw != null ? Math.min(Math.max(2, 0.04 * bw), 4) : 2
    else if (mgMgdl < 1.2) doseG = bw != null ? Math.min(0.06 * bw, 6) : 4
    else doseG = bw != null ? Math.min(0.04 * bw, 4) : 2
    if (renalImp) doseG = doseG * 0.5

    let regime: string
    if (symptomatic) regime = `${doseG.toFixed(1)}g MgSO₄ dalam 100 mL NaCl 0.9%, habis dalam 15–20 mnt IV (emergensi). Maintenance: 6g dalam 500 mL selama 6 jam.`
    else if (mgMgdl < 1.2) regime = `${doseG.toFixed(1)}g MgSO₄ dalam 250 mL NaCl 0.9% selama 4–6 jam IV. Dapat diulang tiap 12 jam sesuai kadar.`
    else regime = `${doseG.toFixed(1)}g MgSO₄ IV dalam 250 mL NaCl 0.9% selama 4–6 jam, ATAU MgO 500 mg oral 2–4× sehari jika toleransi baik.`

    const sev = mgMgdl < 1.0 ? 'Berat (<1.0)' : mgMgdl < 1.4 ? 'Sedang (1.0–1.4)' : 'Ringan (1.4–1.7)'
    return { mg: mgMgdl, mgMmol, type: 'hypo', sev, color: mgMgdl < 1.2 ? 'red' : 'amber', doseG: parseFloat(doseG.toFixed(1)), regime, renalWarning: renalImp }
  }

  if (mgMgdl > 2.5) {
    const sev = mgMgdl > 4 ? 'Berat (>4 mg/dL) — Emergensi' : 'Ringan-Sedang (>2.5 mg/dL)'
    return { mg: mgMgdl, mgMmol, type: 'hyper', sev, color: mgMgdl > 4 ? 'red' : 'amber' }
  }

  return { mg: mgMgdl, mgMmol, type: 'normal' }
}
