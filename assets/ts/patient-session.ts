// patient-session.ts
// Lightweight patient session store for ICU Helper (MPA, Vite + TypeScript strict)

const SESSION_KEY = 'icu-patient-session';

export interface PatientSession {
  nama?: string;
  jenisKelamin?: 'L' | 'P';
  tinggiBadan?: number;
  beratBadan?: number;
  usia?: number;
  ph?: number;
  pco2?: number;
  hco3?: number;
  po2?: number;
  kreatinin?: number;
  ureum?: number;
  updatedAt?: number;
}

// ---------------------------------------------------------------------------
// Core store
// ---------------------------------------------------------------------------

export function loadSession(): PatientSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PatientSession;
  } catch {
    return {};
  }
}

export function saveSession(patch: Partial<PatientSession>): PatientSession {
  const current = loadSession();
  const merged: PatientSession = { ...current, ...patch, updatedAt: Date.now() };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(merged));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
  return merged;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  // Re-render any existing session bars on the page
  const bars = document.querySelectorAll<HTMLElement>('[data-session-bar]');
  bars.forEach((el) => _renderSessionBarInto(el, loadSession()));
}

export function getSession(): PatientSession {
  return loadSession();
}

// ---------------------------------------------------------------------------
// Form helpers
// ---------------------------------------------------------------------------

export function autoFillForm(map: Record<string, keyof PatientSession>): void {
  const session = loadSession();
  for (const [elementId, sessionKey] of Object.entries(map)) {
    const el = document.getElementById(elementId);
    if (!(el instanceof HTMLInputElement)) {
      console.warn(`[patient-session] autoFillForm: #${elementId} tidak ditemukan atau bukan input`)
      continue;
    }
    if (el.value.trim() !== '') continue;
    const value = session[sessionKey];
    if (value !== undefined && value !== null) {
      el.value = String(value);
    }
  }
}

export function bindFormToSession(map: Record<string, keyof PatientSession>): void {
  for (const [elementId, sessionKey] of Object.entries(map)) {
    const el = document.getElementById(elementId);
    if (!(el instanceof HTMLInputElement)) {
      console.warn(`[patient-session] bindFormToSession: #${elementId} tidak ditemukan atau bukan input`)
      continue;
    }

    el.addEventListener('change', () => {
      const raw = el.value.trim();
      if (raw === '') return;

      const patch: Partial<PatientSession> = {};

      // Type-safe assignment based on known field types
      if (sessionKey === 'jenisKelamin') {
        if (raw === 'L' || raw === 'P') {
          patch[sessionKey] = raw;
        }
      } else if (
        sessionKey === 'tinggiBadan' ||
        sessionKey === 'beratBadan' ||
        sessionKey === 'usia' ||
        sessionKey === 'ph' ||
        sessionKey === 'pco2' ||
        sessionKey === 'hco3' ||
        sessionKey === 'po2' ||
        sessionKey === 'kreatinin' ||
        sessionKey === 'ureum' ||
        sessionKey === 'updatedAt'
      ) {
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          patch[sessionKey] = num;
        }
      } else if (sessionKey === 'nama') {
        patch[sessionKey] = raw;
      }

      saveSession(patch);
    });
  }
}

// ---------------------------------------------------------------------------
// Session bar rendering
// ---------------------------------------------------------------------------

function _hasSessionData(session: PatientSession): boolean {
  return !!(session.nama || session.jenisKelamin || session.tinggiBadan || session.beratBadan);
}

function _sexLabel(sex: 'L' | 'P'): string {
  return sex === 'L' ? 'Laki-laki' : 'Perempuan';
}

function _renderSessionBarInto(container: HTMLElement, session: PatientSession): void {
  container.innerHTML = '';

  if (!_hasSessionData(session)) {
    const prompt = document.createElement('span');
    prompt.style.cssText = 'font-size:11px;color:#6b7280;font-style:italic;';
    prompt.textContent = 'Belum ada data pasien aktif';
    container.appendChild(prompt);
    return;
  }

  // Wrapper
  const bar = document.createElement('div');
  bar.style.cssText =
    'display:flex;flex-direction:row;align-items:center;gap:8px;' +
    'background:rgba(37,99,235,0.08);border-radius:8px;padding:6px 10px;' +
    'font-size:11px;color:#1e3a5f;flex-wrap:wrap;';

  const addPill = (label: string, value: string): void => {
    const pill = document.createElement('span');
    pill.style.cssText = 'display:inline-flex;gap:3px;align-items:center;';
    const lbl = document.createElement('span');
    lbl.style.cssText = 'color:#6b7280;';
    lbl.textContent = label + ':';
    const val = document.createElement('strong');
    val.textContent = value;
    pill.appendChild(lbl);
    pill.appendChild(val);
    bar.appendChild(pill);
  };

  if (session.nama) addPill('Pasien', session.nama);
  if (session.jenisKelamin) addPill('JK', _sexLabel(session.jenisKelamin));
  if (session.tinggiBadan !== undefined) addPill('TB', `${session.tinggiBadan} cm`);
  if (session.beratBadan !== undefined) addPill('BB', `${session.beratBadan} kg`);
  if (session.usia !== undefined) addPill('Usia', `${session.usia} thn`);

  // Spacer
  const spacer = document.createElement('span');
  spacer.style.cssText = 'flex:1;';
  bar.appendChild(spacer);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.textContent = '✕ Reset';
  resetBtn.style.cssText =
    'background:none;border:1px solid rgba(37,99,235,0.3);border-radius:4px;' +
    'padding:2px 7px;font-size:10px;color:#2563eb;cursor:pointer;' +
    'line-height:1.4;transition:background 0.15s;';
  resetBtn.addEventListener('mouseenter', () => {
    resetBtn.style.background = 'rgba(37,99,235,0.12)';
  });
  resetBtn.addEventListener('mouseleave', () => {
    resetBtn.style.background = 'none';
  });
  resetBtn.addEventListener('click', () => {
    clearSession();
    // clearSession() already re-renders data-session-bar elements;
    // handle the case where this container has no attribute set
    _renderSessionBarInto(container, loadSession());
  });
  bar.appendChild(resetBtn);

  container.appendChild(bar);
}

export function renderSessionBar(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  // Mark so clearSession() can find and re-render it
  container.setAttribute('data-session-bar', containerId);
  _renderSessionBarInto(container, loadSession());
}

// ---------------------------------------------------------------------------
// Window exposure
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    clearPatientSession: () => void;
  }
}

window.clearPatientSession = clearSession;

// ---------------------------------------------------------------------------
// DOMContentLoaded — pages call their own init
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Individual pages initialise themselves
});
