// calc-history.ts — Calculation history module for ICU Helper
// TypeScript strict mode

const STORAGE_KEY = 'icu-calc-history'
const MAX_ENTRIES = 20

interface HistoryEntry {
  id: string
  module: string
  label: string
  inputs: Record<string, string>
  summary: string
  timestamp: number
}

// ── Storage helpers ──────────────────────────────────────────────────────────

function readStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as HistoryEntry[]
  } catch {
    return []
  }
}

function writeStorage(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage not available / quota exceeded — silently ignore
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export function saveHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const entries = readStorage()
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(36),
    timestamp: Date.now(),
  }
  // Prepend new entry, then keep only MAX_ENTRIES most recent
  const updated = [newEntry, ...entries].slice(0, MAX_ENTRIES)
  writeStorage(updated)
}

export function loadHistory(module?: string): HistoryEntry[] {
  const entries = readStorage()
  const filtered = module ? entries.filter((e) => e.module === module) : entries
  // Sort newest first (already stored newest-first, but sort to be safe)
  return filtered.sort((a, b) => b.timestamp - a.timestamp)
}

export function clearHistory(module?: string): void {
  if (!module) {
    writeStorage([])
    return
  }
  const entries = readStorage().filter((e) => e.module !== module)
  writeStorage(entries)
}

// ── Time formatting ──────────────────────────────────────────────────────────

function formatTime(timestamp: number): string {
  const now = new Date()
  const date = new Date(timestamp)

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = todayStart - 86400000

  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  const timeStr = `${hh}:${mm}`

  if (date.getTime() >= todayStart) {
    return `hari ini ${timeStr}`
  } else if (date.getTime() >= yesterdayStart) {
    return `kemarin ${timeStr}`
  } else {
    const dd = date.getDate().toString().padStart(2, '0')
    const mo = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${dd}/${mo} ${timeStr}`
  }
}

// ── Render ───────────────────────────────────────────────────────────────────

export function renderHistoryPanel(
  containerId: string,
  module: string,
  onRestore: (entry: HistoryEntry) => void,
): void {
  const container = document.getElementById(containerId)
  if (!container) return

  // Build panel
  const panel = document.createElement('div')
  panel.className = 'history-panel'

  const header = document.createElement('div')
  header.className = 'history-header'

  const headerLeft = document.createElement('span')
  headerLeft.textContent = '🕓 Riwayat Perhitungan'

  const clearBtn = document.createElement('button')
  clearBtn.className = 'history-delete'
  clearBtn.title = 'Hapus semua riwayat modul ini'
  clearBtn.textContent = 'Hapus Semua'
  clearBtn.style.fontSize = '11px'
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    clearHistory(module)
    rebuildList()
  })

  header.appendChild(headerLeft)
  header.appendChild(clearBtn)

  const listWrapper = document.createElement('div')
  listWrapper.className = 'history-list'
  listWrapper.style.display = 'none' // collapsed by default

  let isOpen = false
  header.addEventListener('click', () => {
    isOpen = !isOpen
    listWrapper.style.display = isOpen ? 'block' : 'none'
    if (isOpen) rebuildList()
  })

  function rebuildList(): void {
    listWrapper.innerHTML = ''
    const entries = loadHistory(module)

    if (entries.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'history-empty'
      empty.textContent = 'Belum ada riwayat perhitungan'
      listWrapper.appendChild(empty)
      return
    }

    entries.forEach((entry) => {
      const item = document.createElement('div')
      item.className = 'history-item'

      const labelEl = document.createElement('div')
      labelEl.className = 'history-label'
      labelEl.textContent = entry.label
      labelEl.title = entry.summary

      const timeEl = document.createElement('span')
      timeEl.className = 'history-time'
      timeEl.textContent = formatTime(entry.timestamp)

      const restoreBtn = document.createElement('button')
      restoreBtn.className = 'history-restore'
      restoreBtn.textContent = '↩ Pakai'
      restoreBtn.addEventListener('click', () => {
        onRestore(entry)
      })

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'history-delete'
      deleteBtn.title = 'Hapus entri ini'
      deleteBtn.textContent = '🗑'
      deleteBtn.addEventListener('click', () => {
        const all = readStorage().filter((e) => e.id !== entry.id)
        writeStorage(all)
        rebuildList()
      })

      item.appendChild(labelEl)
      item.appendChild(timeEl)
      item.appendChild(restoreBtn)
      item.appendChild(deleteBtn)
      listWrapper.appendChild(item)
    })
  }

  panel.appendChild(header)
  panel.appendChild(listWrapper)
  container.innerHTML = ''
  container.appendChild(panel)
}

// ── Window globals ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    saveCalcHistory: typeof saveHistory
    loadCalcHistory: typeof loadHistory
  }
}

window.saveCalcHistory = saveHistory
window.loadCalcHistory = loadHistory
