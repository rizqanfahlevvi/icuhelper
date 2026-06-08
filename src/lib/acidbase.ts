/* Acid-base correction calculators — faithful TS port of the 4 panels in
   scripts-abg.js (calcBicarb, calcAlk, calcKompensasi, calcAGStandalone).
   Each returns structured result cards for the React view. */

export type AcbcClass = 'ok' | 'warn' | 'bad' | 'info'

export interface AcbcResult {
  cls: AcbcClass
  title: string
  val?: string
  valSub?: string
  lines?: string[]
  formula?: string
  ref?: string
}

/* ===== PANEL 1: NaHCO3 ===== */
export type BicarbType = 'met' | 'dka' | 'card'

export function calcBicarb(bb: number, hco3act: number, type: BicarbType, hco3tgtInput: number): AcbcResult[] {
  let hco3tgt = hco3tgtInput
  if (type === 'dka') hco3tgt = 15
  if (type === 'card') hco3tgt = 14

  if (type === 'card') {
    const dose = bb * 1
    return [{
      cls: 'info',
      title: 'Cardiac Arrest — Bolus NaHCO₃ 8.4%',
      val: `${dose.toFixed(0)} mEq`,
      lines: [`(= ${dose.toFixed(0)} mL NaHCO₃ 8.4% IV bolus)`],
      formula: 'Dosis: 1 mEq/kg BB IV bolus. Ulangi tiap 10 menit jika diperlukan.',
      ref: 'AHA ACLS 2020',
    }]
  }

  if (hco3act >= hco3tgt) {
    return [{
      cls: 'ok',
      title: 'HCO₃⁻ sudah mencapai target',
      lines: [`HCO₃⁻ aktual (${hco3act} mEq/L) ≥ target (${hco3tgt} mEq/L). Tidak perlu koreksi NaHCO₃.`],
    }]
  }

  const dose = 0.5 * bb * (hco3tgt - hco3act)
  const half = dose / 2
  const typeLabel = type === 'dka' ? 'DKA (pH < 6.9)' : 'Asidosis Metabolik'

  const main: AcbcResult = {
    cls: dose > 200 ? 'warn' : 'ok',
    title: `Dosis NaHCO₃ — ${typeLabel}`,
    val: `${dose.toFixed(0)} mEq`,
    lines: [
      `Berikan ½ dosis dulu: ${half.toFixed(0)} mEq dalam 4–6 jam, lalu re-evaluasi AGD.`,
      'Sediaan umum:',
      `• NaHCO₃ 8.4% = 1 mEq/mL → butuh ${dose.toFixed(0)} mL`,
      `• NaHCO₃ 7.5% = 0.9 mEq/mL → butuh ${(dose / 0.9).toFixed(0)} mL`,
      `• NaHCO₃ 1.4% (isotonis) = 0.167 mEq/mL → butuh ${(dose / 0.167).toFixed(0)} mL`,
    ],
    formula: `Rumus: 0.5 × BB ideal (${bb} kg) × (target HCO₃⁻ ${hco3tgt} − aktual ${hco3act}) mEq/L`,
    ref: 'Seifter JL. NEJM 2014; Berend K. NEJM 2018',
  }

  const out = [main]
  if (dose > 200) {
    out.push({
      cls: 'warn',
      title: '⚠ Dosis Besar',
      lines: ['Dosis >200 mEq — pertimbangkan pemberian bertahap dengan monitoring ketat. Risiko: hipernatremia, volume overload, alkalosis rebound.'],
    })
  }
  return out
}

/* ===== PANEL 2: KCl / HCl ===== */
export function calcAlk(bb: number, hco3: number, k?: number, cl?: number): AcbcResult[] {
  if (hco3 <= 26) {
    return [{
      cls: 'ok',
      title: 'HCO₃⁻ dalam batas normal',
      lines: [`HCO₃⁻ ${hco3} mEq/L ≤ 26. Tidak ada alkalosis metabolik untuk dikoreksi.`],
    }]
  }

  const clResponsive = cl != null && cl < 95
  const hypoK = k != null && k < 3.5

  const out: AcbcResult[] = [{
    cls: clResponsive ? 'warn' : 'info',
    title: clResponsive ? '✅ Chloride-Responsive' : '⚡ Chloride-Resistant',
    lines: [clResponsive
      ? 'Cl⁻ urin rendah atau Cl⁻ serum < 95 → kemungkinan penyebab: muntah, NG suction, diuretik. Koreksi dengan NaCl isotonis + KCl.'
      : 'Cl⁻ serum normal/tinggi → kemungkinan penyebab: hiperaldosteronisme, Cushing, Bartter/Gitelman syndrome, steroid. Tangani penyebab primer.'],
    formula: cl != null ? `Cl⁻ serum: ${cl} mEq/L` : undefined,
  }]

  if (k != null) {
    const kDeficit = (4.0 - k) * 0.4 * bb
    out.push({
      cls: hypoK ? 'warn' : 'info',
      title: 'Koreksi KCl IV',
      val: kDeficit > 0 ? `${kDeficit.toFixed(0)} mEq` : 'K⁺ cukup',
      lines: kDeficit > 0
        ? ['Berikan dengan kecepatan ≤20 mEq/jam (perifer) atau ≤40 mEq/jam (sentral + monitor EKG).', 'Tambahkan MgSO₄ 1–2 g IV jika ada hipomagnesemia.']
        : ['K⁺ serum sudah ≥ 4.0 mEq/L.'],
      formula: `Deficit K⁺ ≈ (4.0 − ${k}) × 0.4 × ${bb} kg`,
      ref: 'Galla JH. JASN 2000',
    })
  }

  if (hco3 >= 40) {
    const hclDose = 0.1 * bb * (hco3 - 24)
    out.push({
      cls: 'bad',
      title: 'HCl 0.1N — Alkalosis Berat / Refrakter (HCO₃⁻ ≥ 40)',
      val: `${hclDose.toFixed(0)} mEq HCl`,
      lines: ['Berikan via kateter vena sentral dalam 4–24 jam. Monitor pH tiap 4 jam.', `HCl 0.1N = 100 mEq/L → butuh ${(hclDose / 0.1).toFixed(0)} mL.`],
      formula: `Rumus: 0.1 × BB (${bb} kg) × (HCO₃ aktual ${hco3} − target 24)`,
      ref: 'Gennari FJ. NEJM 1998; Emmett M. CJASN 2020',
    })
  }

  return out
}

/* ===== PANEL 3: Kompensasi ===== */
export type Disorder = 'am' | 'alm' | 'ar' | 'arc' | 'alr' | 'alrc'

export function calcKompensasi(pco2: number | undefined, hco3: number | undefined, disorder: Disorder): AcbcResult[] {
  const results: AcbcResult[] = []
  const hasPco2 = pco2 != null && !Number.isNaN(pco2)
  const hasHco3 = hco3 != null && !Number.isNaN(hco3)

  const make = (
    cls: AcbcClass, title: string, val: string, range: string, formula: string, status: string, ref: string,
  ): AcbcResult => ({ cls, title, val, valSub: range, formula, lines: status ? [status] : undefined, ref })

  if (disorder === 'am' && hasHco3) {
    const h = hco3!
    const expLo = 1.5 * h + 8 - 2
    const expHi = 1.5 * h + 8 + 2
    const mid = 1.5 * h + 8
    let status = '', cls: AcbcClass = 'info'
    if (hasPco2) {
      if (pco2! < expLo - 2) { status = `PaCO₂ aktual (${pco2}) LEBIH RENDAH dari ekspektasi → tambahan Alkalosis Respiratorik`; cls = 'warn' }
      else if (pco2! > expHi + 2) { status = `PaCO₂ aktual (${pco2}) LEBIH TINGGI dari ekspektasi → tambahan Asidosis Respiratorik`; cls = 'warn' }
      else { status = `PaCO₂ aktual (${pco2}) sesuai kompensasi → gangguan tunggal`; cls = 'ok' }
    }
    results.push(make(cls, "Asidosis Metabolik — Kompensasi Respiratorik (Winter's)", `${mid.toFixed(1)} mmHg`, `[${expLo.toFixed(1)} – ${expHi.toFixed(1)}]`, `PaCO₂ ekspektasi = 1.5 × HCO₃⁻ (${h}) + 8 ± 2`, status, 'Winter SD. Ann Intern Med 1967'))
  } else if (disorder === 'alm' && hasHco3) {
    const h = hco3!
    const exp = 0.7 * h + 21
    const lo = exp - 2, hi = exp + 2
    let status = '', cls: AcbcClass = 'info'
    if (hasPco2) {
      if (pco2! < lo - 2) { status = `PaCO₂ aktual (${pco2}) lebih rendah → tambahan Alkalosis Respiratorik`; cls = 'warn' }
      else if (pco2! > hi + 2) { status = `PaCO₂ aktual (${pco2}) lebih tinggi → tambahan Asidosis Respiratorik`; cls = 'warn' }
      else { status = `PaCO₂ aktual (${pco2}) sesuai kompensasi`; cls = 'ok' }
    }
    results.push(make(cls, 'Alkalosis Metabolik — Kompensasi Respiratorik', `${exp.toFixed(1)} mmHg`, `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, `PaCO₂ ekspektasi = 0.7 × HCO₃⁻ (${h}) + 21 ± 2`, status, 'Martínez-Rueda. Rev Invest Clin 2020'))
  } else if ((disorder === 'ar' || disorder === 'arc' || disorder === 'alr' || disorder === 'alrc') && hasPco2) {
    const p = pco2!
    let exp: number, lo: number, hi: number, title: string, formula: string
    let loTol: number, hiTol: number
    if (disorder === 'ar') {
      exp = 24 + 0.1 * (p - 40); lo = exp - 1; hi = exp + 1; loTol = 1; hiTol = 1
      title = 'Asidosis Respiratorik Akut — Kompensasi Renal Akut'
      formula = `HCO₃⁻ ekspektasi = 24 + 0.1 × (PaCO₂ ${p} − 40) ± 1`
    } else if (disorder === 'arc') {
      exp = 24 + 0.35 * (p - 40); lo = exp - 3; hi = exp + 3; loTol = 2; hiTol = 2
      title = 'Asidosis Respiratorik Kronik — Kompensasi Renal Kronik'
      formula = `HCO₃⁻ ekspektasi = 24 + 0.35 × (PaCO₂ ${p} − 40) ± 3`
    } else if (disorder === 'alr') {
      exp = 24 - 0.2 * (40 - p); lo = exp - 1; hi = exp + 1; loTol = 1; hiTol = 1
      title = 'Alkalosis Respiratorik Akut — Kompensasi Renal Akut'
      formula = `HCO₃⁻ ekspektasi = 24 − 0.2 × (40 − PaCO₂ ${p}) ± 1`
    } else {
      exp = 24 - 0.5 * (40 - p); lo = exp - 2; hi = exp + 2; loTol = 1; hiTol = 1
      title = 'Alkalosis Respiratorik Kronik — Kompensasi Renal Kronik'
      formula = `HCO₃⁻ ekspektasi = 24 − 0.5 × (40 − PaCO₂ ${p}) ± 2`
    }
    let status = '', cls: AcbcClass = 'info'
    if (hco3 != null && !Number.isNaN(hco3)) {
      if (hco3 < lo - loTol) { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn' }
      else if (hco3 > hi + hiTol) { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn' }
      else { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi ${disorder === 'arc' || disorder === 'alrc' ? 'kronik' : 'akut'}`; cls = 'ok' }
    }
    results.push(make(cls, title, `${exp.toFixed(1)} mEq/L`, `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula, status, 'Adrogue HJ. NEJM 1998'))
  }

  return results
}

/* ===== PANEL 4: Anion Gap + Delta-Delta + SID ===== */
export function calcAGStandalone(na: number, cl: number, hco3: number, alb?: number): AcbcResult[] {
  const ag = na - (cl + hco3)
  const agNorm = 12
  const albCorr = alb != null ? (alb - 4.0) * 2.5 : 0
  const agCorr = ag - albCorr

  const agHigh = agCorr > 16
  const agLow = agCorr < 8

  let agClass: AcbcClass = 'ok'
  let agLabel = 'Normal'
  if (agHigh) { agClass = 'bad'; agLabel = '↑ HAGMA' }
  else if (agLow) { agClass = 'info'; agLabel = '↓ Rendah (pertimbangkan hipoalbuminemia/mieloma)' }

  const out: AcbcResult[] = [{
    cls: agClass,
    title: `Anion Gap ${alb != null ? '(Terkoreksi Albumin)' : ''}`.trim(),
    val: `${agCorr.toFixed(1)} mEq/L`,
    valSub: agLabel,
    lines: (alb != null && alb !== 4.0)
      ? [`AG raw: ${ag.toFixed(1)} | Koreksi albumin: ${albCorr >= 0 ? '+' : ''}${albCorr.toFixed(1)} | Albumin: ${alb} g/dL`]
      : undefined,
    formula: `AG = Na⁺ (${na}) − [Cl⁻ (${cl}) + HCO₃⁻ (${hco3})] = ${ag.toFixed(1)}${alb != null ? ` | Koreksi alb: ${agCorr.toFixed(1)}` : ''}`,
    ref: 'Fidkowski C. Anesthesiology 2009; Kraut JA. CJASN 2007',
  }]

  if (agHigh) {
    // Delta-Delta = (AG corrected − 12) / (24 − HCO₃). Note: corrected from a
    // legacy bug where the denominator baseline used 12 instead of 24.
    const dd = (agCorr - agNorm) / (24 - hco3)
    let ddInterp = '', ddCls: AcbcClass = 'info'
    if (dd < 0.4) { ddInterp = '< 0.4 → NAGMA lebih dominan (mixed HAGMA + NAGMA)'; ddCls = 'warn' }
    else if (dd <= 0.8) { ddInterp = '0.4–0.8 → HAGMA + NAGMA campuran'; ddCls = 'warn' }
    else if (dd <= 2.0) { ddInterp = '0.8–2.0 → HAGMA murni (tipikal)'; ddCls = 'ok' }
    else { ddInterp = '> 2.0 → kemungkinan ada tambahan Alkalosis Metabolik'; ddCls = 'warn' }
    out.push({
      cls: ddCls,
      title: 'Delta-Delta Ratio',
      val: Number.isFinite(dd) ? dd.toFixed(2) : '—',
      lines: [ddInterp],
      formula: `Δ/Δ = (AG koreksi ${agCorr.toFixed(1)} − 12) / (24 − HCO₃⁻ ${hco3})`,
      ref: 'Wrenn K. Ann Emerg Med 1990; Rastegar A. JASN 2007',
    })
  }

  const sid = na - cl
  const sidNote = sid > 38 ? 'SID > 38 → alkalosis respiratorik atau metabolik'
    : sid < 32 ? 'SID < 32 → mungkin ada asidosis hiperklor atau hyponatremia'
    : 'SID normal (32–38)'
  out.push({
    cls: 'info',
    title: 'Strong Ion Difference (SID simpel)',
    val: `${sid.toFixed(1)} mEq/L`,
    lines: [sidNote],
    formula: `SID = Na⁺ (${na}) − Cl⁻ (${cl})`,
    ref: 'Stewart PA. Can J Physiol Pharmacol 1983',
  })

  return out
}
