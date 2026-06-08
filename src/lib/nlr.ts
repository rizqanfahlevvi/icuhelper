/* NLR / PLR / SII / MLR inflammatory ratios.
   Faithful TS port of scripts-kalkulator-nlr.js (calcNLR). Takes absolute
   counts (10³/µL); the page converts from percentage mode when needed. */

export interface NlrCard {
  label: string
  value: string
  color: string
  sub: string
}

export interface NlrMetrics {
  nlr: number
  plr: number | null
  sii: number | null
  mlr: number | null
  cards: NlrCard[]
  nlrInterp: string
  nlrCls: string
  wbcNote: string
}

interface Badge {
  color: string
  label: string
}

function badge(val: number, low: number, mid: number, lowLabel: string, midLabel: string, highLabel: string): Badge {
  if (val <= low) return { color: 'var(--green)', label: lowLabel }
  if (val <= mid) return { color: 'var(--amber)', label: midLabel }
  return { color: 'var(--red)', label: highLabel }
}

export function computeNlr(
  neut: number,
  lymph: number,
  mono?: number,
  plt?: number,
  wbc?: number | null,
): NlrMetrics {
  const nlr = neut / lymph
  const plr = plt ? plt / lymph : null
  const sii = plt ? (neut * plt) / lymph : null
  const mlr = mono ? mono / lymph : null

  let wbcNote = ''
  if (wbc && neut + lymph + (mono || 0) > 0) {
    const diff = neut + lymph + (mono || 0)
    const ratio = diff / wbc
    if (ratio < 0.6 || ratio > 1.1) {
      wbcNote = `⚠ Jumlah diff (${diff.toFixed(1)}) tidak sesuai dengan leukosit total (${wbc}) — periksa input nilai absolut vs persentase.`
    }
  }

  const nlrB = badge(nlr, 3, 5, 'Normal (1–3)', 'Meningkat (3–5)', 'Tinggi (>5)')
  const plrB = plr != null ? badge(plr, 150, 300, 'Normal (50–150)', 'Meningkat (150–300)', 'Tinggi (>300)') : null
  const siiB = sii != null ? badge(sii, 500, 1000, 'Normal (<500)', 'Meningkat (500–1000)', 'Kritis (>1000)') : null
  const mlrB = mlr != null ? badge(mlr, 0.3, 0.5, 'Normal (<0.3)', 'Meningkat (0.3–0.5)', 'Tinggi (>0.5)') : null

  const cards: NlrCard[] = [
    { label: 'NLR ⭐', value: nlr.toFixed(2), color: nlrB.color, sub: nlrB.label },
  ]
  if (plr != null && plrB) cards.push({ label: 'PLR', value: plr.toFixed(1), color: plrB.color, sub: plrB.label })
  if (sii != null && siiB) cards.push({ label: 'SII', value: String(Math.round(sii)), color: siiB.color, sub: siiB.label })
  if (mlr != null && mlrB) cards.push({ label: 'MLR', value: mlr.toFixed(2), color: mlrB.color, sub: mlrB.label })

  let nlrInterp: string
  let nlrCls: string
  if (nlr <= 3) {
    nlrInterp = 'NLR normal — tidak ada inflamasi sistemik signifikan.'
    nlrCls = 'teal'
  } else if (nlr <= 5) {
    nlrInterp = 'NLR meningkat — inflamasi aktif. Evaluasi konteks klinis (infeksi, stres, post-op).'
    nlrCls = 'amber'
  } else if (nlr <= 9) {
    nlrInterp = 'NLR tinggi — inflamasi berat. Berkorelasi dengan sepsis, pneumonia berat, AMI. Pertimbangkan eskalasi terapi.'
    nlrCls = 'amber'
  } else {
    nlrInterp = 'NLR sangat tinggi (>9) — prediktor mortalitas ICU. Indikator respons inflamasi masif. Monitor ketat.'
    nlrCls = 'red'
  }

  return { nlr, plr, sii, mlr, cards, nlrInterp, nlrCls, wbcNote }
}
