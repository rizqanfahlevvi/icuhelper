import { create } from 'zustand'

/* Mirrors the shape & localStorage key of legacy patient-session.ts
   so the shared patient context works across SPA and legacy pages. */
export interface PatientSession {
  nama?: string
  jenisKelamin?: 'm' | 'f'
  tinggiBadan?: number
  beratBadan?: number
  usia?: number
  ph?: number
  pco2?: number
  hco3?: number
  po2?: number
  kreatinin?: number
  ureum?: number
  updatedAt?: number
}

const KEY = 'icu-patient-session'

function read(): PatientSession {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PatientSession) : {}
  } catch {
    return {}
  }
}

interface PatientState {
  session: PatientSession
  patch: (p: Partial<PatientSession>) => void
  clear: () => void
}

export const usePatientStore = create<PatientState>((set, get) => ({
  session: read(),
  patch: (p) => {
    const next: PatientSession = { ...get().session, ...p, updatedAt: Date.now() }
    localStorage.setItem(KEY, JSON.stringify(next))
    set({ session: next })
  },
  clear: () => {
    localStorage.removeItem(KEY)
    set({ session: {} })
  },
}))
