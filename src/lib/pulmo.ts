/* Pulmonology scoring — port of scripts-kalkulator-pulmo.js */

export interface Curb65Result {
  score: number; items: { name: string; pts: number; detail: string }[]
  interp: string; color: string; action: string; mort: string
}

export function calcCurb65(conf: boolean, ureumMgdl: number | undefined, rr: number | undefined, sbp: number | undefined, dbp: number | undefined, age: number | undefined): Curb65Result {
  let score = 0
  const items: Curb65Result['items'] = []

  const add = (name: string, pts: number, detail: string) => { score += pts; items.push({ name, pts, detail }) }

  add('C — Confusion', conf ? 1 : 0, conf ? 'Ya — disorientasi baru' : 'Tidak')
  if (ureumMgdl != null) {
    const mm = (ureumMgdl / 6.006).toFixed(2)
    const up = ureumMgdl > 42 ? 1 : 0
    add('U — Urea', up, `${ureumMgdl} mg/dL (${mm} mmol/L) — ${up ? '✓ >7 mmol/L' : '✗ ≤7 mmol/L'}`)
  } else add('U — Urea', 0, 'Tidak dimasukkan')
  if (rr != null) add('R — Frekuensi Napas', rr >= 30 ? 1 : 0, `${rr}/mnt — ${rr >= 30 ? '✓ ≥30' : '✗ <30'}`)
  if (sbp != null && dbp != null) add('B — Blood Pressure', (sbp < 90 || dbp <= 60) ? 1 : 0, `${sbp}/${dbp} mmHg — ${(sbp < 90 || dbp <= 60) ? '✓ Hipotensi' : '✗ Normal'}`)
  if (age != null) add('65 — Usia', age >= 65 ? 1 : 0, `${age} thn — ${age >= 65 ? '✓ ≥65' : '✗ <65'}`)

  let interp: string, color: string, action: string, mort: string
  if (score <= 1) { interp = 'Risiko Rendah'; color = 'teal'; action = 'Pertimbangkan rawat jalan dengan antibiotik oral.'; mort = '~1.5%' }
  else if (score === 2) { interp = 'Risiko Sedang'; color = 'amber'; action = 'Rawat inap singkat, terapi IV. Evaluasi tiap 24 jam.'; mort = '~9.2%' }
  else { interp = 'Risiko Tinggi'; color = 'red'; action = 'Rawat inap, pertimbangkan ICU/HDU. Evaluasi kebutuhan ventilasi mekanik.'; mort = `~22–57%` }

  return { score, items, interp, color, action, mort }
}

export interface PsiResult {
  score: number; pClass: string; mort: string; action: string; color: string
}

export function calcPsi(
  sex: 'f' | 'm', age: number, nursing: number, neo: number, liver: number,
  chf: number, cva: number, renal: number, ms: number,
  rr?: number, sbp?: number, temp?: number, hr?: number,
  ph?: number, ureum?: number, na?: number, glu?: number,
  hct?: number, pao2?: number, spo2?: number, effusion: number = 0
): PsiResult {
  let score = sex === 'f' ? age - 10 : age
  score += nursing + neo + liver + chf + cva + renal + ms
  if (rr != null && rr >= 30) score += 20
  if (sbp != null && sbp < 90) score += 20
  if (temp != null && (temp < 35 || temp >= 40)) score += 15
  if (hr != null && hr >= 125) score += 10
  if (ph != null && ph < 7.35) score += 30
  if (ureum != null && ureum > 64) score += 20
  if (na != null && na < 130) score += 20
  if (glu != null && glu >= 250) score += 10
  if (hct != null && hct < 30) score += 10
  if (pao2 != null && pao2 < 60) score += 10
  else if (pao2 == null && spo2 != null && spo2 < 90) score += 10
  score += effusion

  let pClass: string, mort: string, action: string, color: string
  if (score <= 70) { pClass = 'Kelas II'; mort = '0.6%'; action = 'Rawat jalan — risiko rendah.'; color = 'teal' }
  else if (score <= 90) { pClass = 'Kelas III'; mort = '0.9%'; action = 'Rawat jalan atau observasi singkat (<23 jam).'; color = 'teal' }
  else if (score <= 130) { pClass = 'Kelas IV'; mort = '9.3%'; action = 'Rawat inap — risiko sedang.'; color = 'amber' }
  else { pClass = 'Kelas V'; mort = '27.0%'; action = 'Rawat inap, pertimbangkan ICU — risiko tinggi.'; color = 'red' }

  return { score: Math.round(score), pClass, mort, action, color }
}

export interface SmartCopResult {
  score: number; risk: string; color: string; action: string; pct: string
}

export function calcSmartCop(s: number, m: number, a: number, r: number, t: number, c: number, o: number, p: number): SmartCopResult {
  const score = s + m + a + r + t + c + o + p
  let risk: string, color: string, action: string, pct: string
  if (score <= 2) { risk = 'Risiko Rendah'; color = 'teal'; action = 'Perawatan bangsal biasa. Pantau ketat jika ada komorbid.'; pct = '<5%' }
  else if (score <= 4) { risk = 'Risiko Sedang'; color = 'amber'; action = '~1 dari 8 pasien butuh vasopressor/ventilasi. Pertimbangkan IMC/HCU. Monitor ketat.'; pct = '~12%' }
  else if (score <= 6) { risk = 'Risiko Tinggi'; color = 'coral'; action = '~1 dari 3 pasien butuh PIIT. Konsul ICU. Evaluasi indikasi ATS/IDSA ICU.'; pct = '~33%' }
  else { risk = 'Risiko Sangat Tinggi'; color = 'red'; action = '~2 dari 3 pasien butuh vasopressor atau ventilasi mekanik. Admisi ICU diindikasikan.'; pct = '~67%' }
  return { score, risk, color, action, pct }
}

export interface AaGradientResult {
  paO2calc: number; aaGrad: number; normalAa: number; interp: string; color: string
}

export function calcAaGradient(fio2: number, paco2: number, pao2: number, patm: number = 760, age?: number): AaGradientResult {
  const paO2calc = fio2 * (patm - 47) - paco2 / 0.8
  const aaGrad = paO2calc - pao2
  const normalAa = age != null ? age / 4 + 4 : 15
  let interp: string, color: string
  if (aaGrad <= normalAa) { interp = 'Normal — hipoksemia kemungkinan dari hipoventilasi murni (periksa PaCO₂)'; color = 'teal' }
  else if (aaGrad <= 35) { interp = 'Meningkat ringan — V/Q mismatch ringan'; color = 'amber' }
  else if (aaGrad <= 100) { interp = 'Meningkat signifikan — V/Q mismatch, gangguan difusi, atau shunt parsial'; color = 'amber' }
  else { interp = '⚠ Meningkat berat — pertimbangkan shunt besar (intrakardiak atau intrapulmoner)'; color = 'red' }
  return { paO2calc: parseFloat(paO2calc.toFixed(1)), aaGrad: parseFloat(aaGrad.toFixed(1)), normalAa: parseFloat(normalAa.toFixed(0)), interp, color }
}
