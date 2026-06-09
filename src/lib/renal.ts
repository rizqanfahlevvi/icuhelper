/* Renal calculators — port of scripts-kalkulator-renal.js */

/* ── eGFR ── */
export interface EgfrResult {
  ckdEpi: number; cg: number | null; mdrd: number; ckdCys: number | null
  stage: string; stageLabel: string; color: string
  bunMgdl?: number; bunMmol?: number; bunCrRatio?: number; bunCrInterp?: string
}

export function calcEgfr(
  sex: 'm' | 'f', age: number, scrMgdl: number,
  bw?: number, cysc?: number, ureum?: number
): EgfrResult {
  const female = sex === 'f'
  const kappa = female ? 0.7 : 0.9, alpha = female ? -0.241 : -0.302, sexF = female ? 1.012 : 1.0
  const r = scrMgdl / kappa
  const ckdEpi = 142 * Math.pow(Math.min(r, 1), alpha) * Math.pow(Math.max(r, 1), -1.200) * Math.pow(0.9938, age) * sexF

  const cg = bw != null ? ((140 - age) * bw) / (72 * scrMgdl) * (female ? 0.85 : 1.0) : null
  const mdrd = 175 * Math.pow(scrMgdl, -1.154) * Math.pow(age, -0.203) * (female ? 0.742 : 1.0)

  let ckdCys: number | null = null
  if (cysc != null) {
    const kc = female ? 0.7 : 0.9, ac = female ? -0.219 : -0.144, sf = female ? 0.963 : 1.0
    const cr2 = scrMgdl / kc, cy2 = cysc / 0.8
    ckdCys = 135 * Math.pow(Math.min(cr2,1),ac) * Math.pow(Math.max(cr2,1),-0.544) * Math.pow(Math.min(cy2,1),-0.323) * Math.pow(Math.max(cy2,1),-0.778) * Math.pow(0.9961,age) * sf
  }

  let stage: string, stageLabel: string, color: string
  const v = ckdEpi
  if (v >= 90) { stage = 'G1'; stageLabel = '≥90 — Normal atau tinggi'; color = 'green' }
  else if (v >= 60) { stage = 'G2'; stageLabel = '60–89 — Sedikit menurun'; color = 'teal' }
  else if (v >= 45) { stage = 'G3a'; stageLabel = '45–59 — Penurunan ringan-sedang'; color = 'amber' }
  else if (v >= 30) { stage = 'G3b'; stageLabel = '30–44 — Penurunan sedang-berat'; color = 'amber' }
  else if (v >= 15) { stage = 'G4'; stageLabel = '15–29 — Penurunan berat'; color = 'red' }
  else { stage = 'G5'; stageLabel = '<15 — Gagal Ginjal'; color = 'red' }

  let bunMgdl: number | undefined, bunMmol: number | undefined, bunCrRatio: number | undefined, bunCrInterp: string | undefined
  if (ureum != null) {
    bunMgdl = parseFloat((ureum * 0.4667).toFixed(1))
    bunMmol = parseFloat((ureum / 6.006).toFixed(2))
    bunCrRatio = parseFloat((bunMgdl / scrMgdl).toFixed(1))
    if (bunCrRatio > 20) bunCrInterp = 'Sugestif pre-renal atau perdarahan GI atas'
    else if (bunCrRatio < 10) bunCrInterp = 'Sugestif penyakit ginjal intrinsik'
    else bunCrInterp = 'Normal'
  }

  return { ckdEpi: parseFloat(ckdEpi.toFixed(1)), cg: cg ? parseFloat(cg.toFixed(1)) : null, mdrd: parseFloat(mdrd.toFixed(1)), ckdCys: ckdCys ? parseFloat(ckdCys.toFixed(1)) : null, stage, stageLabel, color, bunMgdl, bunMmol, bunCrRatio, bunCrInterp }
}

/* ── AKI KDIGO ── */
export interface AkiResult {
  scrStage: number | null; scrLabel: string | null; scrColor: string | null
  uoStage: number | null; uoLabel: string | null; uoColor: string | null
  uoRate: number | null
}

export function calcAki(scrBase?: number, scrNow?: number, bw?: number, uoVol?: number, uoHr?: number): AkiResult {
  let scrStage: number | null = null, scrLabel: string | null = null, scrColor: string | null = null
  if (scrBase != null && scrNow != null) {
    const rise = scrNow - scrBase, ratio = scrNow / scrBase
    if (scrNow >= 4.0 || ratio >= 3.0) { scrStage = 3; scrLabel = 'Stage 3 — Berat'; scrColor = 'red' }
    else if (ratio >= 2.0) { scrStage = 2; scrLabel = 'Stage 2 — Sedang'; scrColor = 'amber' }
    else if (rise >= 0.3 || ratio >= 1.5) { scrStage = 1; scrLabel = 'Stage 1 — Ringan'; scrColor = 'coral' }
    else { scrStage = 0; scrLabel = 'Tidak memenuhi kriteria AKI'; scrColor = 'teal' }
  }

  let uoStage: number | null = null, uoLabel: string | null = null, uoColor: string | null = null, uoRate: number | null = null
  if (bw != null && uoVol != null && uoHr != null && bw > 0 && uoHr > 0) {
    uoRate = parseFloat((uoVol / (bw * uoHr)).toFixed(3))
    if (uoRate < 0.3 && uoHr >= 24) { uoStage = 3; uoLabel = 'Stage 3 — UO <0.3 mL/kg/jam ≥24 jam'; uoColor = 'red' }
    else if (uoRate < 0.5 && uoHr >= 12) { uoStage = 2; uoLabel = 'Stage 2 — UO <0.5 mL/kg/jam ≥12 jam'; uoColor = 'amber' }
    else if (uoRate < 0.5 && uoHr >= 6) { uoStage = 1; uoLabel = 'Stage 1 — UO <0.5 mL/kg/jam dalam 6–12 jam'; uoColor = 'coral' }
    else { uoStage = 0; uoLabel = 'UO dalam batas normal'; uoColor = 'teal' }
  }

  return { scrStage, scrLabel, scrColor, uoStage, uoLabel, uoColor, uoRate }
}

/* ── FENa / FEUrea ── */
export interface FenaResult {
  fena: number; fenaInterp: string; fenaColor: string
  feurea: number | null; feureaInterp: string | null; feureaColor: string | null
}

export function calcFena(sna: number, scr: number, una: number, ucr: number, sureum?: number, uureum?: number): FenaResult {
  const fena = (una * scr) / (sna * ucr) * 100
  let fenaInterp: string, fenaColor: string
  if (fena < 1) { fenaInterp = 'Pre-renal AKI — retensi Na, respons tubulus normal'; fenaColor = 'teal' }
  else if (fena < 2) { fenaInterp = 'Inkonklusif — evaluasi konteks klinis (pasien diuretik? obstruksi?)'; fenaColor = 'amber' }
  else { fenaInterp = 'Renal intrinsik AKI — tubular injury, kemampuan retensi Na hilang'; fenaColor = 'red' }

  let feurea: number | null = null, feureaInterp: string | null = null, feureaColor: string | null = null
  if (sureum != null && uureum != null && sureum > 0 && uureum > 0) {
    feurea = parseFloat(((uureum * scr) / (sureum * ucr) * 100).toFixed(2))
    if (feurea < 35) { feureaInterp = 'Pre-renal (valid meski ada diuretik)'; feureaColor = 'teal' }
    else if (feurea < 50) { feureaInterp = 'Inkonklusif'; feureaColor = 'amber' }
    else { feureaInterp = 'Renal intrinsik'; feureaColor = 'red' }
  }

  return { fena: parseFloat(fena.toFixed(2)), fenaInterp, fenaColor, feurea, feureaInterp, feureaColor }
}

/* ── Osmolalitas & Osmol Gap ── */
export interface OsmResult {
  osmCalc: number; osmGap: number | null; interp: string; color: string; gapInterp?: string; gapColor?: string
}

export function calcOsmolality(na: number, gluMgdl: number, ureumMgdl: number, measured?: number): OsmResult {
  const ureumMmol = ureumMgdl / 6.006
  const osmCalc = parseFloat((2 * na + gluMgdl / 18 + ureumMmol).toFixed(1))
  const osmGap = measured != null ? parseFloat((measured - osmCalc).toFixed(1)) : null

  let interp: string, color: string
  if (osmCalc < 285) { interp = 'Hipoosmolalitas — evaluasi konteks hiponatremia'; color = 'amber' }
  else if (osmCalc <= 295) { interp = 'Normal (285–295 mOsm/kg)'; color = 'teal' }
  else if (osmCalc <= 320) { interp = 'Hiperosmolalitas ringan-sedang'; color = 'amber' }
  else { interp = '⚠ Hiperosmolalitas berat — risiko koma hiperosmolar'; color = 'red' }

  let gapInterp: string | undefined, gapColor: string | undefined
  if (osmGap != null) {
    if (osmGap <= 10) { gapInterp = 'Normal (<10 mOsm/kg)'; gapColor = 'teal' }
    else if (osmGap <= 20) { gapInterp = 'Sedikit meningkat — evaluasi klinis'; gapColor = 'amber' }
    else { gapInterp = '⚠ Meningkat signifikan → curiga etanol, metanol, etilenglikol, manitol'; gapColor = 'red' }
  }

  return { osmCalc, osmGap, interp, color, gapInterp, gapColor }
}

/* ── BUN:Cr Ratio ── */
export interface BunCrResult { ratio: number; title: string; interp: string; color: string; giBleeding: boolean }

export function calcBunCr(bun: number, cr: number): BunCrResult {
  const ratio = parseFloat((bun / cr).toFixed(1))
  let title: string, interp: string, color: string
  if (ratio > 20) {
    color = 'amber'; title = `Rasio Tinggi (${ratio}) — Pre-renal atau Produksi Urea Meningkat`
    interp = 'BUN naik tidak proporsional terhadap kreatinin → curiga pre-renal, perdarahan GI atas, atau hipercatabolisme.'
  } else if (ratio >= 10) {
    color = 'teal'; title = `Rasio Normal (${ratio})`
    interp = 'BUN dan kreatinin naik proporsional → mendukung AKI intrinsik (ATN), CKD, atau kondisi normal.'
  } else {
    color = 'blue'; title = `Rasio Rendah (${ratio}) — Produksi Urea Berkurang`
    interp = 'Curiga gagal hati, malnutrisi berat, SIADH/overhydrasi, atau rhabdomiolisis.'
  }
  return { ratio, title, interp, color, giBleeding: ratio > 36 }
}
