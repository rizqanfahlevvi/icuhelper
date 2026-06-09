/* TypeScript interfaces for ICU Helper Drug Reference */

export interface DoseAdjustment {
  dose: string
  interval: string
  route?: string | null
  note?: string
}

export interface Drug {
  name: string
  brand_id: string[]
  brand_id_notes: string | null
  class: string
  subclass: string | null
  category: string[]
  common_in_id: boolean
  common_in_id_note: string | null
  mechanism: string
  pkpd_type: string | null
  pkpd_note: string | null
  spectrum: {
    gram_pos?: string | boolean
    gram_neg?: string | boolean
    anaerob?: string | boolean
    mrsa?: boolean
    vre?: boolean
    esbl?: boolean
    pseudomonas?: boolean
    acinetobacter?: boolean
    fungi?: boolean | null
    virus?: boolean | null
  } | null
  indications: {
    icu_primary: string[]
    icu_secondary: string[]
    local_guideline: string
    intl_guideline: string
  }
  contraindications: string[]
  precautions: string[]
  dosing: {
    standard: string
    range_low?: string
    range_high?: string
    max?: string
    loading?: string | null
    maintenance?: string
    route: string[]
    dilution?: string
    rate?: string
    titration?: string | null
    special_notes?: string
  }
  renal_adjustment: {
    ge60: DoseAdjustment | string
    r30_60: DoseAdjustment | string
    r15_30: DoseAdjustment | string
    r_lt15: DoseAdjustment | string
    hd: DoseAdjustment | string
    crrt: DoseAdjustment | string
    badge: 'safe' | 'adjust' | 'reduce' | 'avoid'
    dialyzable: boolean
    monitoring_renal: string
  }
  hepatic_adjustment: {
    child_a: string
    child_b: string
    child_c: string
    note: string
  }
  pregnancy: {
    fda_category: 'A' | 'B' | 'C' | 'D' | 'X' | null
    trimester_1: string
    trimester_2: string
    trimester_3: string
    labor_delivery: string
    fetal_risk: string
    lactation: string
    lactation_note?: string | null
  }
  monitoring: {
    efficacy: string[]
    safety: string[]
    frequency: string
    therapeutic_range?: string | null
  }
  adverse_effects: {
    critical: string[]
    common: string[]
    antidote?: string | null
  }
  interactions: {
    major: { drug: string; effect?: string; management?: string }[]
    moderate: { drug: string; effect?: string; management?: string }[]
  }
  stewardship: {
    empiric_sources?: string[]
    deescalation_to?: string[]
    duration_standard?: number
    duration_short?: number
    duration_note?: string
    stop_criteria?: string
    avoid_for?: string[]
    local_pattern_note?: string
  } | null
  high_alert: boolean
  high_alert_warnings: string[]
  high_alert_protocol: string | null
  pump_link: boolean
  pump_drug_key: string | null
  evidence: { ref_id: string; note: string }[]
}
