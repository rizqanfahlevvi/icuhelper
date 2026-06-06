// ============================================================
// types.ts — ICU Helper Global Type Definitions
// ============================================================

// ─── Drug Database ───────────────────────────────────────────

export type RenalBadge = 'safe' | 'caution' | 'avoid' | 'dose-reduce' | 'monitor'
export type DrugRoute = 'IV' | 'PO' | 'IM' | 'SC' | 'SL' | 'INH' | 'TOP'
export type DrugCategory =
  | 'vasopressor'
  | 'inotrope'
  | 'sedatif'
  | 'analgesik'
  | 'nmb'
  | 'antibiotik'
  | 'antijamur'
  | 'antivirus'
  | 'antikoagulan'
  | 'antiaritmia'
  | 'bronkodilator'
  | 'diuretik'
  | 'steroid'
  | 'lainnya'

export type PkpdType = 'time_dependent' | 'concentration_dependent' | 'auc_dependent' | null

export interface RenalDoseEntry {
  dose: string
  interval: string
  route?: string | null
  note: string
}

export interface RenalAdjustment {
  ge60: RenalDoseEntry
  r30_60: RenalDoseEntry
  r15_30: RenalDoseEntry
  r_lt15: RenalDoseEntry
  hd: RenalDoseEntry
  crrt: RenalDoseEntry
  badge: RenalBadge
  dialyzable: boolean
  monitoring_renal: string
}

export interface HepaticAdjustment {
  child_a: string
  child_b: string
  child_c: string
  note: string
}

export interface DrugIndications {
  icu_primary: string[]
  icu_secondary: string[]
  local_guideline: string
  intl_guideline: string
}

export interface Spectrum {
  gram_pos: string | null
  gram_neg: string | null
  anaerob: string | null
  mrsa: boolean | null
  vre: boolean | null
  esbl: boolean | null
  pseudomonas: boolean | null
  acinetobacter: boolean | null
  fungi: boolean | null
  virus: boolean | null
}

export interface DrugDosing {
  standard: string
  range_low: string
  range_high: string
  max: string
  loading: string | null
  maintenance: string
  route: DrugRoute[]
  dilution: string
  rate: string
  titration: string | null
  special_notes: string
}

export interface Pregnancy {
  fda_category: string
  trimester_1: string
  trimester_2: string
  trimester_3: string
  labor_delivery: string
  fetal_risk: string
  lactation: string
  lactation_note: string
}

export interface DrugMonitoring {
  efficacy: string[]
  safety: string[]
  frequency: string
  therapeutic_range: string | null
}

export interface AdverseEffects {
  critical: string[]
  common: string[]
  antidote: string | null
}

export interface DrugInteraction {
  drug: string
  effect: string
  management?: string
}

export interface DrugInteractions {
  major: DrugInteraction[]
  moderate?: DrugInteraction[]
  minor?: DrugInteraction[]
}

export interface EvidenceRef {
  ref_id: string
  note: string
}

export interface Drug {
  name: string
  brand_id: string[]
  brand_id_notes: string
  class: string
  subclass: string
  category: DrugCategory[]
  common_in_id: boolean
  common_in_id_note: string
  mechanism: string
  pkpd_type: PkpdType
  pkpd_note: string | null
  spectrum: Spectrum | null
  indications: DrugIndications
  contraindications: string[]
  precautions: string[]
  dosing: DrugDosing
  renal_adjustment: RenalAdjustment
  hepatic_adjustment: HepaticAdjustment
  pregnancy: Pregnancy
  monitoring: DrugMonitoring
  adverse_effects: AdverseEffects
  interactions: DrugInteractions
  stewardship: string | null
  high_alert: boolean
  high_alert_warnings: string[]
  high_alert_protocol: string | null
  pump_link: boolean
  pump_drug_key: string | null
  evidence: EvidenceRef[]
}

export type DrugDatabase = Record<string, Drug>

// ─── Calculator: IBW ─────────────────────────────────────────

export type Sex = 'm' | 'f'
export type VentCondition = 'ards' | 'copd' | 'asthma' | 'neuro' | 'standard'

export interface IbwInput {
  sex: Sex
  heightCm: number
  actualWeightKg?: number
  condition: VentCondition
}

export interface IbwResult {
  ibw: number
  adjBW: number | null
  bmi: number | null
  vtLowMl: number
  vtHighMl: number
  vtRangeLow: number
  vtRangeHigh: number
  vtNote: string
  mvEstimate: number
}

// ─── Calculator: P/F Ratio ───────────────────────────────────

export type FiO2Source = 'direct' | 'device'
export type PaO2Unit = 'mmhg' | 'kpa'

export interface PFInput {
  pao2: number
  pao2Unit: PaO2Unit
  fio2: number           // 0.21 – 1.0
  peep?: number
  frc?: number
  paco2?: number
  ph?: number
}

export interface PFResult {
  pf: number
  ardsBerlin: 'Mild' | 'Moderate' | 'Severe' | 'Normal'
  oi: number | null
  osi: number | null
  drivingPressure: number | null
  aaGradient: number | null
}

// ─── Calculator: Renal ───────────────────────────────────────

export type AkiStage = 1 | 2 | 3 | null

export interface RenalInput {
  sex: Sex
  ageTahun: number
  weightKg: number
  creatinineMgdl: number
  baselineCr?: number
  urineOutputMlKgJam?: number
}

export interface RenalResult {
  crcl: number
  egfr: number
  akiStage: AkiStage
  akiReason: string | null
  renalBand: 'ge60' | 'r30_60' | 'r15_30' | 'r_lt15'
}

// ─── Calculator: Electrolyte ─────────────────────────────────

export interface ElectroInput {
  weightKg: number
  na?: number
  k?: number
  ca?: number
  mg?: number
  albumin?: number
}

export interface ElectroResult {
  naDeficit?: number
  kDeficit?: number
  correctedCa?: number
  caDeficit?: number
  mgDeficit?: number
}

// ─── Calculator: Syringe Pump ────────────────────────────────

export interface PumpDrug {
  key: string
  name: string
  unit: 'mcg/kg/min' | 'mcg/min' | 'mg/kg/jam' | 'unit/jam' | 'mL/jam'
  concentration: number   // mcg/mL or mg/mL
  concentrationUnit: string
  dilution: string
  doseMin: number
  doseMax: number
  doseStep: number
}

export interface PumpInput {
  drugKey: string
  weightKg: number
  dose: number
  concentration?: number
}

export interface PumpResult {
  rateMLJam: number
  doseMcgKgMin?: number
  totalDoseMg?: number
}

// ─── Scoring Systems ─────────────────────────────────────────

export type SofaOrganScore = 0 | 1 | 2 | 3 | 4

export interface SofaInput {
  pf: number
  ventilated: boolean
  platelets: number
  bilirubin: number
  map: number
  vasopressor: string
  gcs: number
  creatinine: number
  urineOutputMlDay?: number
}

export interface SofaResult {
  respiratory: SofaOrganScore
  coagulation: SofaOrganScore
  liver: SofaOrganScore
  cardiovascular: SofaOrganScore
  cns: SofaOrganScore
  renal: SofaOrganScore
  total: number
  mortalityEstimate: string
}

// ─── ABG Interpreter ─────────────────────────────────────────

export type AbgUnit = 'mmhg' | 'kpa'
export type AbgHco3Unit = 'mmoll' | 'meql'
export type AbgHbUnit = 'gdl' | 'mgdl'

export interface AbgInput {
  ph: number
  paco2: number
  paco2Unit: AbgUnit
  hco3: number
  pao2: number
  pao2Unit: AbgUnit
  fio2: number
  hb?: number
  hbUnit?: AbgHbUnit
  temp?: number
}

export interface AbgResult {
  primaryDisorder: string
  compensation: string
  oxygenation: string
  deltaDelta: string | null
  aaGradient: number
  roxIndex: number | null
  interpretation: string[]
}

// ─── Navigation ──────────────────────────────────────────────

export interface NavPage {
  id: string
  label: string
  icon: string
  href: string
  children?: NavPage[]
}

// ─── Theme ───────────────────────────────────────────────────

export type Theme = 'dark' | 'light'
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
