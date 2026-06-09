/* TypeScript interfaces for IV Fluid Reference */

export type FluidCategory = 'kristaloid' | 'hipertonik' | 'dextrose' | 'maintenance' | 'amino' | 'koloid' | 'elektrolit' | 'osmotik'

export interface FluidComposition {
  na?: number      // mEq/L
  k?: number
  ca?: number
  mg?: number
  cl?: number
  laktat?: number
  asetat?: number
  malat?: number
  glukonat?: number
  bikarbonat?: number
  fosfat?: number
  dextrose?: number   // g/L
  protein?: string    // free text e.g. "50–100 g/L"
  nitrogen?: string
  calories?: number   // kcal/L
  albumin?: number    // g/L
  gelatin?: number    // g/L
  mw?: string         // molecular weight
  other?: string      // any other notes
}

export interface IvFluid {
  id: string
  name: string
  category: FluidCategory
  osmolarity: number | string   // mOsm/L or descriptive
  tonicity?: string             // Isotonik / Hipotonik / Hipertonik
  ph?: string
  composition: FluidComposition
  halfLife?: string
  volumeExpansion?: string
  indications: string[]
  contraindications: string[]
  warnings: string[]
  tips: string[]
  populations?: string          // special populations note
}
