/* IBW & initial ventilator parameters — faithful TypeScript port of
   assets/js/scripts-kalkulator-ibw.js (calcIBW). Pure function: takes
   parsed inputs, returns a structured result for the React view to render. */

export type Sex = 'm' | 'f'
export type Condition = 'normal' | 'ards' | 'copd' | 'asthma' | 'neuro'

export interface IbwInput {
  sex: Sex
  height: number
  actualBW?: number
  condition: Condition
  age?: number
  hb?: number
}

export interface VentRow {
  param: string
  value: string
  note: string
}

export interface IbwActual {
  diffPct: number
  vtActLow: number
  bmi: number
  bmiLabel: string
  bmiColor: string
  bsa: number
  lbw: number
  ebvL: number
  ebvRaw: number
  abw?: number    // ABW for obese (aBW > IBW)
  adjBW?: number  // AdjBW shown in main grid (BMI > 30 && aBW > IBW)
}

export interface IbwNutrition {
  ree: number
  calMin: number
  calMax: number
  protMin: number
  protMax: number
}

export interface IbwBlood {
  type: 'mabl' | 'low'
  hb: number
  mabl?: number
  prcKolf?: number
}

export interface IbwResult {
  ibwR: number
  vtLow: number
  vtHigh: number
  vtLowML: number
  vtHighML: number
  mv: number
  vtNote: string
  condition: Condition
  ventRows: VentRow[]
  actual?: IbwActual
  nutrition?: IbwNutrition
  blood?: IbwBlood
}

function bmiBand(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'var(--blue)' }
  if (bmi < 25) return { label: 'Normal', color: 'var(--green)' }
  if (bmi < 30) return { label: 'Overweight', color: 'var(--amber)' }
  if (bmi < 35) return { label: 'Obesitas I', color: 'var(--red)' }
  if (bmi < 40) return { label: 'Obesitas II', color: 'var(--red)' }
  return { label: 'Obesitas III', color: 'var(--red)' }
}

function buildVentRows(
  cond: Condition,
  vtLowML: number,
  vtHighML: number,
  vtLow: number,
  vtHigh: number,
): VentRow[] {
  const vtRow: VentRow = {
    param: 'VT',
    value: `${vtLowML}–${vtHighML} mL`,
    note: `${vtLow}–${vtHigh} mL/kg IBW`,
  }
  switch (cond) {
    case 'ards':
      return [
        { param: 'Mode', value: 'VC-AC', note: 'Kontrol VT ketat' },
        vtRow,
        { param: 'RR', value: '16–22 bpm', note: 'Sesuai kebutuhan; naikkan jika pH drop' },
        { param: 'PEEP', value: '8–13 cmH₂O', note: 'Titrasi FiO₂/PEEP table ARDSNet' },
        { param: 'Pplat target', value: '<30 cmH₂O', note: 'Lakukan inspiratory hold 0.5 det' },
        { param: 'Driving pressure', value: '≤15 cmH₂O', note: 'Pplat − PEEP; target ≤13 ideal' },
      ]
    case 'copd':
      return [
        { param: 'Mode', value: 'VC-AC', note: 'Flow tinggi 60–80 L/mnt' },
        vtRow,
        { param: 'RR', value: '10–14 bpm', note: 'Rendah — ekspirasi panjang' },
        { param: 'I:E ratio', value: '1:3 sampai 1:5', note: 'Cegah auto-PEEP' },
        { param: 'PEEP', value: '5–8 cmH₂O', note: '75–85% auto-PEEP terukur' },
        { param: 'PaCO₂ target', value: 'Baseline pasien', note: 'Koreksi bertahap' },
      ]
    case 'asthma':
      return [
        { param: 'Mode', value: 'VC-AC', note: 'Kontrol VT; PC tidak ideal' },
        vtRow,
        { param: 'RR', value: '8–12 bpm', note: 'SANGAT LAMBAT' },
        { param: 'I:E ratio', value: '1:4 sampai 1:5', note: 'Ekspirasi panjang wajib' },
        { param: 'PEEP', value: '0–5 cmH₂O', note: 'Rendah — auto-PEEP sudah ada' },
        { param: 'PaCO₂ target', value: '45–70 mmHg', note: 'Permissive hypercapnia' },
      ]
    case 'neuro':
      return [
        { param: 'Mode', value: 'VC-AC atau SIMV+PSV', note: 'Preserve spontaneous effort' },
        vtRow,
        { param: 'RR', value: '12–16 bpm', note: 'Backup; spontan diutamakan' },
        { param: 'PEEP', value: '5 cmH₂O', note: 'Standar' },
        { param: 'Monitor', value: 'VC serial tiap 4–6 jam', note: 'Target VC >20 mL/kg sebelum ekstubasi' },
      ]
    default:
      return [
        { param: 'Mode', value: 'VC-AC atau PC-AC', note: 'Sesuai kondisi' },
        vtRow,
        { param: 'RR', value: '12–18 bpm', note: 'Sesuai target ventilasi' },
        { param: 'PEEP', value: '5–8 cmH₂O', note: 'Cegah atelektasis' },
        { param: 'FiO₂', value: '1.0 → titrasi', note: 'Target SpO₂ 94–98%' },
      ]
  }
}

export function computeIbw(input: IbwInput): IbwResult {
  const { sex, height: h, actualBW: aBW, condition: cond, age, hb } = input

  const ibw = sex === 'm' ? 50 + 0.91 * (h - 152.4) : 45.5 + 0.91 * (h - 152.4)
  const ibwR = Math.max(ibw, 30)

  let vtLow: number
  let vtHigh: number
  let vtNote: string
  if (cond === 'ards') { vtLow = 4; vtHigh = 6; vtNote = 'Lung-protective ARDS — ARDSNet Protocol' }
  else if (cond === 'copd') { vtLow = 6; vtHigh = 8; vtNote = 'PPOK — permissive hypercapnia; ekspirasi panjang' }
  else if (cond === 'asthma') { vtLow = 6; vtHigh = 8; vtNote = 'Asma — controlled hypoventilation; Pplat <30' }
  else if (cond === 'neuro') { vtLow = 10; vtHigh = 12; vtNote = 'NMD — paru normal, butuh VT lebih besar' }
  else { vtLow = 6; vtHigh = 8; vtNote = 'Ventilasi standar' }

  const vtLowML = Math.round(vtLow * ibwR)
  const vtHighML = Math.round(vtHigh * ibwR)
  const mv = Number((ibwR * vtLow * 0.001 * 16).toFixed(1))

  const result: IbwResult = {
    ibwR, vtLow, vtHigh, vtLowML, vtHighML, mv, vtNote, condition: cond,
    ventRows: buildVentRows(cond, vtLowML, vtHighML, vtLow, vtHigh),
  }

  if (aBW && !Number.isNaN(aBW)) {
    const bmi = aBW / ((h / 100) * (h / 100))
    const diffPct = Math.round(((aBW - ibwR) / ibwR) * 100)
    const vtActLow = Math.round(vtLow * aBW)
    const bsa = Math.sqrt((h * aBW) / 3600)
    const abw = aBW > ibwR ? ibwR + 0.4 * (aBW - ibwR) : undefined
    const adjBW = bmi > 30 && aBW > ibwR ? ibwR + 0.4 * (aBW - ibwR) : undefined
    const lbw = sex === 'm'
      ? (9270 * aBW) / (6680 + 216 * bmi)
      : (9270 * aBW) / (8780 + 244 * bmi)
    const ebvRaw = aBW * (sex === 'm' ? 70 : 65)
    const band = bmiBand(bmi)

    result.actual = {
      diffPct, vtActLow, bmi, bmiLabel: band.label, bmiColor: band.color,
      bsa, lbw, ebvL: ebvRaw / 1000, ebvRaw, abw, adjBW,
    }

    if (age && !Number.isNaN(age)) {
      const ree = sex === 'm'
        ? 88.4 + 13.4 * aBW + 4.8 * h - 5.68 * age
        : 447.6 + 9.25 * aBW + 3.1 * h - 4.33 * age
      result.nutrition = {
        ree: Math.round(ree),
        calMin: Math.round(25 * aBW),
        calMax: Math.round(30 * aBW),
        protMin: Math.round(1.2 * aBW),
        protMax: Math.round(2.0 * aBW),
      }
    }

    if (hb && !Number.isNaN(hb)) {
      const hbMin = 7
      if (hb > hbMin) {
        const mabl = ebvRaw * ((hb - hbMin) / hb)
        result.blood = { type: 'mabl', hb, mabl: Math.max(0, mabl) }
      } else {
        const prcKolf = Math.ceil(Math.max(0, (hbMin - hb) * aBW * 4) / 250)
        result.blood = { type: 'low', hb, prcKolf }
      }
    }
  }

  return result
}
