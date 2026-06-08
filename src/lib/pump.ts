/* Syringe pump rate calculator + drug database.
   Faithful TS port of scripts-kalkulator-pump.js. */

export interface PumpDrug {
  info: string
  unit: string
  conc: number // mcg/mL, mg/mL, or unit/mL depending on drug
}

export const PUMP_INFO: Record<string, PumpDrug> = {
  fentanyl: { info: 'Dosis: 25–200 mcg/kg/jam. Syringe: 500 mcg dalam 50 mL NaCl = 10 mcg/mL.', unit: 'mcg/kg/jam', conc: 10 },
  morphin: { info: 'Dosis: 20–80 mcg/kg/jam. Syringe: 20 mg dalam 20 mL NaCl = 1 mg/mL.', unit: 'mcg/kg/jam', conc: 1000 },
  midazolam: { info: 'Dosis: 0.02–0.1 mg/kg/jam. Syringe: 50 mg dalam 50 mL NaCl = 1 mg/mL.', unit: 'mg/kg/jam', conc: 1 },
  propofol: { info: 'Dosis: 5–80 mcg/kg/mnt. Syringe: Propofol 1% (10 mg/mL) langsung pakai tanpa pengenceran.', unit: 'mcg/kg/mnt', conc: 10000 },
  dexmed: { info: 'Dosis: 0.2–1.4 mcg/kg/jam. Syringe: 200 mcg dalam 50 mL NaCl = 4 mcg/mL. Loading 1 mcg/kg selama 10 mnt (opsional).', unit: 'mcg/kg/jam', conc: 4 },
  thiopental: { info: 'Dosis drip (ICP / Status Epileptikus): 1–5 mg/kg/jam. Syringe: 500 mg dalam 50 mL NaCl = 10 mg/mL. Monitor hipotensi & penumpukan jaringan lemak.', unit: 'mg/kg/jam', conc: 10 },
  norepinef: { info: 'Dosis: 0.01–1 mcg/kg/mnt. Syringe: 4 mg dalam 50 mL D5% = 80 mcg/mL. Jalur sentral diutamakan.', unit: 'mcg/kg/mnt', conc: 80 },
  epinefrin: { info: 'Dosis: 0.01–1 mcg/kg/mnt. Syringe: 4 mg dalam 50 mL D5% = 80 mcg/mL. Jalur sentral. Monitor aritmia.', unit: 'mcg/kg/mnt', conc: 80 },
  dopamin: { info: 'Dosis: 2–20 mcg/kg/mnt. Syringe: 200 mg dalam 50 mL NaCl = 4000 mcg/mL.', unit: 'mcg/kg/mnt', conc: 4000 },
  dobutamin: { info: 'Dosis: 2–20 mcg/kg/mnt. Syringe: 250 mg dalam 50 mL NaCl = 5000 mcg/mL.', unit: 'mcg/kg/mnt', conc: 5000 },
  vasopressin: { info: 'Dosis: 0.01–0.04 units/mnt (flat dose — tidak per kg). Syringe: 20 unit dalam 100 mL NaCl = 0.2 unit/mL. Biasanya fixed 0.03 units/mnt pada septic shock.', unit: 'units/mnt', conc: 0.2 },
  phenylephrine: { info: 'Dosis: 0.05–6 mcg/kg/mnt. Syringe: 10 mg dalam 100 mL NaCl = 100 mcg/mL. Pure α1-agonis — tidak ada efek β. Jalur sentral diutamakan, perifer dapat untuk jangka pendek.', unit: 'mcg/kg/mnt', conc: 100 },
  amiodarone: { info: 'Maintenance: 0.5–1 mg/mnt (flat dose). Syringe: 450 mg dalam 250 mL D5% = 1.8 mg/mL. HANYA D5%, jangan NaCl (presipitasi).', unit: 'mg/mnt', conc: 1.8 },
  lidokain: { info: 'Dosis: 1–4 mg/mnt (flat dose). Syringe: 1000 mg dalam 500 mL D5% = 2 mg/mL. Setelah loading bolus 1–1.5 mg/kg IV.', unit: 'mg/mnt', conc: 2 },
  furosemide: { info: 'Dosis drip: 5–20 mg/jam (flat dose — tidak per kg). Syringe: 100 mg dalam 100 mL NaCl 0.9% = 1 mg/mL. Monitor kalium, kreatinin tiap 6–8 jam.', unit: 'mg/jam', conc: 1 },
  atrakurium: { info: 'Dosis: 5–12 mcg/kg/mnt. Syringe: 250 mg dalam 50 mL NaCl = 5 mg/mL.', unit: 'mcg/kg/mnt', conc: 5000 },
  cisatrakurium: { info: 'Dosis: 1–3 mcg/kg/mnt. Syringe: 20 mg dalam 20 mL NaCl = 1 mg/mL.', unit: 'mcg/kg/mnt', conc: 1000 },
  nitrogliserin: { info: 'Dosis: 10–200 mcg/mnt (flat dose — tidak per kg). Syringe: 50 mg dalam 50 mL D5% = 1 mg/mL = 1000 mcg/mL.', unit: 'mcg/mnt', conc: 1000 },
}

export const DRUG_NAMES: Record<string, string> = {
  fentanyl: 'Fentanyl', morphin: 'Morfin', midazolam: 'Midazolam', propofol: 'Propofol 1%',
  dexmed: 'Dexmedetomidine', thiopental: 'Thiopental (Tiopol)', norepinef: 'Norepinefrin', epinefrin: 'Epinefrin',
  dopamin: 'Dopamin', dobutamin: 'Dobutamin', vasopressin: 'Vasopressin', phenylephrine: 'Phenylephrine (Phenerin)',
  amiodarone: 'Amiodaron', lidokain: 'Lidokain', furosemide: 'Furosemide',
  atrakurium: 'Atrakurium', cisatrakurium: 'Cisatrakurium', nitrogliserin: 'Nitrogliserin',
}

export const PUMP_CATEGORIES: Record<string, [string, string][]> = {
  sedasi: [['fentanyl', 'Fentanyl'], ['morphin', 'Morfin'], ['midazolam', 'Midazolam'], ['propofol', 'Propofol 1%'], ['dexmed', 'Dexmedetomidine'], ['thiopental', 'Thiopental (Tiopol)']],
  vasopressor: [['norepinef', 'Norepinefrin'], ['epinefrin', 'Epinefrin'], ['dopamin', 'Dopamin'], ['dobutamin', 'Dobutamin'], ['vasopressin', 'Vasopressin'], ['phenylephrine', 'Phenylephrine (Phenerin)']],
  antiaritmia: [['amiodarone', 'Amiodaron'], ['lidokain', 'Lidokain']],
  diuretik: [['furosemide', 'Furosemide']],
  lainnya: [['atrakurium', 'Atrakurium'], ['cisatrakurium', 'Cisatrakurium'], ['nitrogliserin', 'Nitrogliserin']],
}

export const CATEGORY_LABELS: [string, string][] = [
  ['sedasi', 'Sedasi / Analgetik'],
  ['vasopressor', 'Vasopressor / Inotropik'],
  ['antiaritmia', 'Antiaritmia'],
  ['diuretik', 'Diuretik'],
  ['lainnya', 'Lainnya (Paralitik / Vasodilator)'],
]

export interface PumpResult {
  rateMlH: number
  duration: number
  isFlatDose: boolean
  dname: string
  unit: string
  dose: number
  vol: number
  bb: number
  info: string
  drugKey: string
}

export function computePump(bb: number, drugKey: string, dose: number, vol: number): PumpResult {
  const info = PUMP_INFO[drugKey]
  const unit = info.unit
  const conc = info.conc

  let rateMlH: number
  if (unit === 'mg/jam') {
    rateMlH = dose / conc
  } else if (unit === 'mg/mnt' || unit === 'mcg/mnt' || unit === 'units/mnt') {
    rateMlH = (dose * 60) / conc
  } else if (unit === 'mcg/kg/jam' || unit === 'mg/kg/jam') {
    rateMlH = (dose * bb) / conc
  } else {
    // mcg/kg/mnt — default
    rateMlH = (dose * bb * 60) / conc
  }

  const isFlatDose = unit === 'mg/jam' || unit === 'mg/mnt' || unit === 'mcg/mnt' || unit === 'units/mnt'

  return {
    rateMlH,
    duration: vol / rateMlH,
    isFlatDose,
    dname: DRUG_NAMES[drugKey] || drugKey,
    unit,
    dose,
    vol,
    bb,
    info: info.info,
    drugKey,
  }
}
