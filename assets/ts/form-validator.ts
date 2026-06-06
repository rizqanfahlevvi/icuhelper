'use strict'

// Konfigurasi range valid untuk setiap field medis
const MEDICAL_RANGES: Record<string, { min: number; max: number; label: string; unit: string }> = {
  abgPH:    { min: 6.5,  max: 8.0,  label: 'pH',     unit: '' },
  abgCO2:   { min: 10,   max: 150,  label: 'PaCO₂',  unit: 'mmHg' },
  abgHCO3:  { min: 5,    max: 60,   label: 'HCO₃⁻',  unit: 'mmol/L' },
  abgO2:    { min: 10,   max: 600,  label: 'PaO₂',   unit: 'mmHg' },
  abgBE:    { min: -30,  max: 30,   label: 'BE',      unit: 'mEq/L' },
  abgNa:    { min: 100,  max: 180,  label: 'Na⁺',     unit: 'mmol/L' },
  abgCl:    { min: 60,   max: 140,  label: 'Cl⁻',     unit: 'mmol/L' },
  abgAlb:   { min: 0.5,  max: 6,    label: 'Albumin', unit: 'g/dL' },
  abgLaktat:{ min: 0,    max: 20,   label: 'Laktat',  unit: 'mmol/L' },
  abgSpO2:  { min: 50,   max: 100,  label: 'SpO₂',   unit: '%' },
  abgRR:    { min: 5,    max: 60,   label: 'RR',      unit: '/mnt' },
  ibwHeight:{ min: 100,  max: 220,  label: 'Tinggi',  unit: 'cm' },
  ibwActual:{ min: 20,   max: 300,  label: 'Berat',   unit: 'kg' },
  ibwAge:   { min: 15,   max: 120,  label: 'Usia',    unit: 'tahun' },
}

export function validateField(inputEl: HTMLInputElement): boolean {
  const id = inputEl.id
  const range = MEDICAL_RANGES[id]
  if (!range) return true

  const raw = inputEl.value.trim()
  if (raw === '') {
    // Field kosong — hapus error state jika ada
    inputEl.classList.remove('input-error')
    const existing = inputEl.parentElement?.querySelector('.input-hint')
    if (existing) existing.remove()
    return true
  }

  const val = parseFloat(raw)
  const inRange = !isNaN(val) && val >= range.min && val <= range.max

  if (!inRange) {
    inputEl.classList.add('input-error')
    let hint = inputEl.parentElement?.querySelector<HTMLElement>('.input-hint')
    if (!hint) {
      hint = document.createElement('div')
      hint.className = 'input-hint'
      inputEl.insertAdjacentElement('afterend', hint)
    }
    const unitSuffix = range.unit ? ` ${range.unit}` : ''
    hint.textContent = `⚠ ${range.label} normal ${range.min}–${range.max}${unitSuffix}`
    return false
  } else {
    inputEl.classList.remove('input-error')
    const existing = inputEl.parentElement?.querySelector('.input-hint')
    if (existing) existing.remove()
    return true
  }
}

export function validateFieldById(id: string): boolean {
  const el = document.getElementById(id)
  if (!(el instanceof HTMLInputElement)) return true
  return validateField(el)
}

export function initValidation(ids: string[]): void {
  for (const id of ids) {
    if (!(id in MEDICAL_RANGES)) continue
    const el = document.getElementById(id)
    if (!(el instanceof HTMLInputElement)) continue
    el.addEventListener('change', () => { validateField(el) })
    el.addEventListener('blur', () => { validateField(el) })
  }
}

export function isFormValid(ids: string[]): boolean {
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!(el instanceof HTMLInputElement)) continue
    if (el.value.trim() === '') continue
    if (!validateField(el)) return false
  }
  return true
}

// Expose ke window untuk penggunaan non-module
declare global {
  interface Window {
    validateField: typeof validateField
    initValidation: typeof initValidation
  }
}

window.validateField = validateField
window.initValidation = initValidation
