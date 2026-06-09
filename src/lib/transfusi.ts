/* Transfusion calculators — port of scripts-kalkulator-transfusi.js */

export interface PrcResult {
  volMl: number; kolf: number; dHb: number; dHbPerKolf: number
  ebvL: number; rateStd: number; mablMl: number; needCa: boolean
}

export function calcPrc(hb: number, hbt: number, bb: number, sex: 'm' | 'f'): PrcResult {
  const dHb = hbt - hb
  const volMl = dHb * bb * 4
  const kolf = Math.ceil(volMl / 250)
  const dHbPerKolf = parseFloat((250 / (bb * 4)).toFixed(2))
  const ebvL = (bb * (sex === 'm' ? 70 : 65)) / 1000
  const rateStd = Math.round(volMl / 2)
  const mablMl = Math.max(0, ebvL * 1000 * (hb - 7) / hb)
  return { volMl: Math.round(volMl), kolf, dHb, dHbPerKolf, ebvL, rateStd, mablMl: Math.round(mablMl), needCa: kolf >= 4 }
}

export interface WbResult {
  volMl: number; kolf: number; dHb: number; dHbPerKolf: number; needCa: boolean
}

export function calcWb(hb: number, hbt: number, bb: number): WbResult {
  const dHb = hbt - hb
  const volMl = dHb * bb * 6
  const kolf = Math.ceil(volMl / 450)
  const dHbPerKolf = parseFloat((450 / (bb * 6)).toFixed(2))
  return { volMl: Math.round(volMl), kolf, dHb, dHbPerKolf, needCa: kolf >= 4 }
}

export interface FfpResult {
  volMl: number; kolf: number; rate: number; inrNote: string | null
}

export function calcFfp(bb: number, dose: number, inr?: number): FfpResult {
  const volMl = dose * bb
  const kolf = Math.ceil(volMl / 250)
  const rate = Math.round(volMl / 2)
  let inrNote: string | null = null
  if (inr != null) {
    if (inr < 1.5) inrNote = 'low'
    else if (inr < 2) inrNote = 'mild'
    else inrNote = 'significant'
  }
  return { volMl: Math.round(volMl), kolf, rate, inrNote }
}

export interface TcResult {
  tipe: 'rd' | 'apheresis'
  unitRec: number; volTotal: number; expIncrement: number
}

export function calcTc(plt: number, pltt: number, bb: number, tipe: 'rd' | 'apheresis'): TcResult {
  const dPlt = Math.max(0, pltt - plt)
  if (tipe === 'rd') {
    const unitStd = Math.ceil(bb / 10)
    const unitTarget = Math.ceil(dPlt / 7.5 * (bb / 70))
    const unitRec = Math.max(unitStd, Math.min(unitTarget, 10))
    const volTotal = unitRec * 60
    const expIncrement = Math.min(Math.round(unitRec * 7500 * (70 / bb)), dPlt)
    return { tipe, unitRec, volTotal, expIncrement }
  } else {
    const expIncrement = Math.min(Math.round(45 * (70 / bb)), dPlt)
    return { tipe, unitRec: 1, volTotal: 250, expIncrement }
  }
}

export interface CryoResult {
  fibDeficit: number; kolfFormula: number; kolfRuleOfThumb: number
  kolfRec: number; volTotal: number; fibExpected: number; severe: boolean
}

export function calcCryo(fib: number, fibTarget: number, bb: number): CryoResult {
  const plasmaVol = bb * 40
  const fibDeficit = Math.max(0, (fibTarget - fib) * plasmaVol / 100)
  const fibPerKolf = 200
  const kolfFormula = Math.ceil(fibDeficit / fibPerKolf)
  const kolfRuleOfThumb = Math.ceil(bb / 10)
  const kolfRec = Math.max(kolfFormula, kolfRuleOfThumb)
  const volTotal = kolfRec * 17
  const fibExpected = Math.min(fib + (kolfRec * fibPerKolf * 100 / plasmaVol), fibTarget + 30)
  return {
    fibDeficit: Math.round(fibDeficit), kolfFormula, kolfRuleOfThumb,
    kolfRec, volTotal, fibExpected: Math.round(fibExpected), severe: fib < 100
  }
}
