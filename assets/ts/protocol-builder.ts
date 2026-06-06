// protocol-builder.ts — Protocol Builder module for ICU Helper
// TypeScript strict mode

const PROTOCOL_STORAGE_KEY = 'icu-protocols'
const MAX_PROTOCOLS = 5

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ProtocolItem {
  id: string
  text: string
  checked: boolean
  addedAt: number
}

export interface Protocol {
  id: string
  name: string
  template: string
  items: ProtocolItem[]
  createdAt: number
  updatedAt: number
}

// ---------------------------------------------------------------------------
// Template data
// ---------------------------------------------------------------------------

const TEMPLATES: Record<string, string[]> = {
  ards: [
    'Posisi HOB 30-45°',
    'VT 6 mL/kg IBW',
    'Pplat ≤28 cmH₂O',
    'Driving pressure ≤15 cmH₂O',
    'PEEP per ARDSNet table',
    'FiO₂ titrasi target SpO₂ 92-96%',
    'Pertimbangkan prone ≥12 jam/hari jika P/F <150',
    'NMB 48 jam jika P/F <150 refrakter',
    'Conservative fluid strategy',
    'Hentikan sedasi daily (SAT)',
  ],
  sepsis: [
    'Ukur laktat (ulangi jika >2)',
    'Kultur darah 2 set sebelum antibiotik',
    'Antibiotik empirik dalam 1 jam',
    'Resusitasi 30 mL/kg kristaloid jika laktat ≥4 atau hipotensi',
    'Reassess fluid responsiveness (PLR/US)',
    'Norepinefrin jika MAP <65 setelah resusitasi',
    'Target MAP ≥65 mmHg',
    'Monitor output urin',
    'Kortikosteroid jika refrakter vasopressor',
    'Kontrol sumber infeksi dalam 6-12 jam',
  ],
  weaning: [
    'SAT: hentikan sedasi pagi hari',
    'SBT: T-piece atau PSV 5/5 selama 30-120 mnt',
    'Kriteria SBT passed: RR<35, SpO₂>90, HR<140, MAP>60, tidak distres',
    'Kekuatan: genggam tangan, angkat kepala 5 detik',
    'Batuk adekuat saat suction',
    'Sekret minimal dan bisa dikelola',
    'FiO₂ ≤0.5 dan PEEP ≤8',
    'Kesadaran: mengikuti perintah sederhana',
    'Pertimbangkan ekstubasi jika semua terpenuhi',
    'Siapkan NIV/HFNC sebagai backup post-ekstubasi',
  ],
  vap: [
    'HOB 30-45°',
    'Oral hygiene dengan chlorhexidine 0.12% tiap 8 jam',
    'Cuff pressure 20-30 cmH₂O (cek tiap 8 jam)',
    'Saluran subglotis suction (jika tersedia)',
    'Hindari pooling sekret di sirkuit',
    'Ganti sirkuit ventilator hanya jika kotor/rusak',
    'Daily assessment weaning readiness',
    'Profilaksis DVT',
    'Profilaksis stress ulcer (jika indikasi)',
    'Hand hygiene sebelum kontak ventilator',
  ],
  custom: [],
}

const TEMPLATE_LABELS: Record<string, string> = {
  ards: 'ARDS Bundle (ARDSNet + prone positioning)',
  sepsis: 'Sepsis Bundle (SSC 2024)',
  weaning: 'Weaning Bundle (SAT + SBT + ekstubasi)',
  vap: 'VAP Prevention Bundle',
  custom: 'Custom (kosong)',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

export function createProtocol(name: string, templateKey: string): Protocol {
  const items: ProtocolItem[] = (TEMPLATES[templateKey] ?? []).map((text) => ({
    id: genId(),
    text,
    checked: false,
    addedAt: Date.now(),
  }))

  return {
    id: genId(),
    name: name.trim() || 'Protocol Baru',
    template: templateKey,
    items,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function saveProtocol(protocol: Protocol): void {
  const list = loadProtocols().filter((p) => p.id !== protocol.id)
  list.unshift({ ...protocol, updatedAt: Date.now() })
  const trimmed = list.slice(0, MAX_PROTOCOLS)
  try {
    localStorage.setItem(PROTOCOL_STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Storage quota — fail silently
  }
}

export function loadProtocols(): Protocol[] {
  try {
    const raw = localStorage.getItem(PROTOCOL_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Protocol[]
  } catch {
    return []
  }
}

export function deleteProtocol(id: string): void {
  const list = loadProtocols().filter((p) => p.id !== id)
  try {
    localStorage.setItem(PROTOCOL_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // fail silently
  }
}

export function toggleItem(protocol: Protocol, itemId: string): Protocol {
  return {
    ...protocol,
    items: protocol.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ),
    updatedAt: Date.now(),
  }
}

export function addItem(protocol: Protocol, text: string): Protocol {
  const trimmed = text.trim()
  if (!trimmed) return protocol
  const newItem: ProtocolItem = {
    id: genId(),
    text: trimmed,
    checked: false,
    addedAt: Date.now(),
  }
  return {
    ...protocol,
    items: [...protocol.items, newItem],
    updatedAt: Date.now(),
  }
}

export function removeItem(protocol: Protocol, itemId: string): Protocol {
  return {
    ...protocol,
    items: protocol.items.filter((item) => item.id !== itemId),
    updatedAt: Date.now(),
  }
}

export function moveItem(protocol: Protocol, itemId: string, direction: 'up' | 'down'): Protocol {
  const items = [...protocol.items]
  const idx = items.findIndex((i) => i.id === itemId)
  if (idx < 0) return protocol
  const newIdx = direction === 'up' ? idx - 1 : idx + 1
  if (newIdx < 0 || newIdx >= items.length) return protocol
  const temp = items[idx]!
  items[idx] = items[newIdx]!
  items[newIdx] = temp
  return { ...protocol, items, updatedAt: Date.now() }
}

// ---------------------------------------------------------------------------
// Render UI
// ---------------------------------------------------------------------------

export function renderProtocolBuilder(containerId: string): void {
  const container = document.getElementById(containerId)
  if (!container) return

  let currentProtocol: Protocol | null = null

  function render(): void {
    container!.innerHTML = ''

    // ── Session bar ──────────────────────────────────────────────────────────
    const sessionBar = document.createElement('div')
    sessionBar.id = 'pb-session-bar'
    sessionBar.style.cssText = 'margin-bottom:10px'
    container!.appendChild(sessionBar)

    // Lazy-init session bar if patient-session is available
    if (typeof window.renderSessionBar === 'function') {
      window.renderSessionBar('pb-session-bar')
    }

    // ── Panel wrapper ────────────────────────────────────────────────────────
    const panel = document.createElement('div')
    panel.className = 'calc-box'
    container!.appendChild(panel)

    // Header
    const header = document.createElement('div')
    header.className = 'calc-title'
    header.innerHTML = '<span>📋</span> Protocol Builder'
    panel.appendChild(header)

    // ── Template selector row ────────────────────────────────────────────────
    const templateRow = document.createElement('div')
    templateRow.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px'

    const templateLabel = document.createElement('label')
    templateLabel.textContent = 'Template:'
    templateLabel.style.cssText = 'font-size:13px;font-weight:600;color:var(--text);white-space:nowrap'
    templateRow.appendChild(templateLabel)

    const templateSelect = document.createElement('select')
    templateSelect.className = 'input-select'
    templateSelect.style.cssText = 'flex:1;min-width:180px'
    for (const [key, label] of Object.entries(TEMPLATE_LABELS)) {
      const opt = document.createElement('option')
      opt.value = key
      opt.textContent = label
      templateSelect.appendChild(opt)
    }
    templateRow.appendChild(templateSelect)

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Nama protokol…'
    nameInput.className = 'input-text'
    nameInput.style.cssText = 'flex:1;min-width:140px'
    if (currentProtocol) nameInput.value = currentProtocol.name
    templateRow.appendChild(nameInput)

    const createBtn = document.createElement('button')
    createBtn.className = 'calc-btn'
    createBtn.style.cssText = 'white-space:nowrap'
    createBtn.textContent = '+ Buat Baru'
    createBtn.addEventListener('click', () => {
      const tKey = templateSelect.value
      const pName = nameInput.value.trim() || (TEMPLATE_LABELS[tKey] ?? 'Protocol Baru')
      currentProtocol = createProtocol(pName, tKey)
      render()
    })
    templateRow.appendChild(createBtn)

    panel.appendChild(templateRow)

    // ── Active protocol editor ────────────────────────────────────────────────
    if (currentProtocol !== null) {
      const proto = currentProtocol

      // Progress bar
      const total = proto.items.length
      const done = proto.items.filter((i) => i.checked).length
      const pct = total > 0 ? Math.round((done / total) * 100) : 0

      const progressWrap = document.createElement('div')
      progressWrap.style.cssText = 'margin-bottom:10px'
      const progressMeta = document.createElement('div')
      progressMeta.style.cssText = 'display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:4px'
      progressMeta.innerHTML = `<span>${proto.name}</span><span>${done}/${total} selesai (${pct}%)</span>`
      const progressTrack = document.createElement('div')
      progressTrack.style.cssText = 'height:6px;background:var(--border,#e2e8f0);border-radius:3px;overflow:hidden'
      const progressFill = document.createElement('div')
      progressFill.style.cssText = `height:100%;width:${pct}%;background:var(--green,#16a34a);border-radius:3px;transition:width 0.3s`
      progressTrack.appendChild(progressFill)
      progressWrap.appendChild(progressMeta)
      progressWrap.appendChild(progressTrack)
      panel.appendChild(progressWrap)

      // Checklist
      const list = document.createElement('div')
      list.id = 'pb-checklist'

      proto.items.forEach((item, idx) => {
        const row = document.createElement('div')
        row.className = 'protocol-item' + (item.checked ? ' checked' : '')
        row.dataset['itemId'] = item.id

        const cb = document.createElement('input')
        cb.type = 'checkbox'
        cb.checked = item.checked
        cb.id = `pb-item-${item.id}`
        cb.addEventListener('change', () => {
          currentProtocol = toggleItem(proto, item.id)
          render()
        })

        const lbl = document.createElement('label')
        lbl.htmlFor = `pb-item-${item.id}`
        lbl.textContent = item.text

        // Move up
        const upBtn = document.createElement('button')
        upBtn.type = 'button'
        upBtn.textContent = '↑'
        upBtn.title = 'Naikan'
        upBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--muted);font-size:13px;padding:0 2px'
        upBtn.disabled = idx === 0
        upBtn.addEventListener('click', () => {
          currentProtocol = moveItem(proto, item.id, 'up')
          render()
        })

        // Move down
        const downBtn = document.createElement('button')
        downBtn.type = 'button'
        downBtn.textContent = '↓'
        downBtn.title = 'Turunkan'
        downBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--muted);font-size:13px;padding:0 2px'
        downBtn.disabled = idx === proto.items.length - 1
        downBtn.addEventListener('click', () => {
          currentProtocol = moveItem(proto, item.id, 'down')
          render()
        })

        // Delete
        const delBtn = document.createElement('button')
        delBtn.type = 'button'
        delBtn.textContent = '×'
        delBtn.title = 'Hapus item'
        delBtn.style.cssText =
          'background:none;border:none;cursor:pointer;color:var(--red,#dc2626);font-size:16px;line-height:1;padding:0 2px'
        delBtn.addEventListener('click', () => {
          currentProtocol = removeItem(proto, item.id)
          render()
        })

        row.appendChild(cb)
        row.appendChild(lbl)
        row.appendChild(upBtn)
        row.appendChild(downBtn)
        row.appendChild(delBtn)
        list.appendChild(row)
      })

      panel.appendChild(list)

      // Add item row
      const addRow = document.createElement('div')
      addRow.style.cssText = 'display:flex;gap:6px;margin-top:10px'

      const addInput = document.createElement('input')
      addInput.type = 'text'
      addInput.placeholder = 'Tambah item checklist…'
      addInput.className = 'input-text'
      addInput.style.cssText = 'flex:1'
      addInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doAdd()
      })

      const addItemBtn = document.createElement('button')
      addItemBtn.className = 'calc-btn'
      addItemBtn.textContent = 'Tambah'
      addItemBtn.style.cssText = 'white-space:nowrap'

      function doAdd(): void {
        const txt = addInput.value.trim()
        if (!txt) return
        currentProtocol = addItem(proto, txt)
        render()
      }

      addItemBtn.addEventListener('click', doAdd)
      addRow.appendChild(addInput)
      addRow.appendChild(addItemBtn)
      panel.appendChild(addRow)

      // Action buttons
      const actions = document.createElement('div')
      actions.className = 'protocol-actions'

      const saveBtn = document.createElement('button')
      saveBtn.className = 'calc-btn'
      saveBtn.textContent = '💾 Simpan'
      saveBtn.addEventListener('click', () => {
        if (!currentProtocol) return
        saveProtocol(currentProtocol)
        const msg = document.getElementById('pb-save-msg')
        if (msg) {
          msg.textContent = '✓ Tersimpan'
          msg.style.color = 'var(--green,#16a34a)'
          setTimeout(() => { msg.textContent = '' }, 2000)
        }
        render()
      })

      const printBtn = document.createElement('button')
      printBtn.className = 'calc-btn'
      printBtn.style.cssText = 'background:var(--surface,#f8fafc);color:var(--text);border:1px solid var(--border)'
      printBtn.textContent = '🖨 Print'
      printBtn.addEventListener('click', () => { window.print() })

      const clearBtn = document.createElement('button')
      clearBtn.className = 'calc-btn'
      clearBtn.style.cssText = 'background:none;color:var(--muted);border:1px solid var(--border)'
      clearBtn.textContent = '✕ Tutup'
      clearBtn.addEventListener('click', () => {
        currentProtocol = null
        render()
      })

      const saveMsg = document.createElement('span')
      saveMsg.id = 'pb-save-msg'
      saveMsg.style.cssText = 'font-size:12px;align-self:center'

      actions.appendChild(saveBtn)
      actions.appendChild(printBtn)
      actions.appendChild(clearBtn)
      actions.appendChild(saveMsg)
      panel.appendChild(actions)
    }

    // ── Saved protocols ──────────────────────────────────────────────────────
    const saved = loadProtocols()
    if (saved.length > 0) {
      const savedSection = document.createElement('div')
      savedSection.style.cssText = 'margin-top:18px'

      const savedHeader = document.createElement('div')
      savedHeader.className = 'sec'
      savedHeader.textContent = 'Protokol Tersimpan'
      savedSection.appendChild(savedHeader)

      saved.forEach((p) => {
        const card = document.createElement('div')
        card.className = 'card'
        card.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;padding:10px 14px'

        const cardInfo = document.createElement('div')
        cardInfo.style.cssText = 'flex:1;min-width:0'

        const cardTitle = document.createElement('div')
        cardTitle.style.cssText = 'font-weight:600;font-size:13px;color:var(--text)'
        cardTitle.textContent = p.name

        const doneCount = p.items.filter((i) => i.checked).length
        const cardMeta = document.createElement('div')
        cardMeta.style.cssText = 'font-size:11px;color:var(--muted);margin-top:2px'
        cardMeta.textContent = `${TEMPLATE_LABELS[p.template] ?? p.template} · ${doneCount}/${p.items.length} selesai · ${new Date(p.updatedAt).toLocaleDateString('id-ID')}`

        cardInfo.appendChild(cardTitle)
        cardInfo.appendChild(cardMeta)

        const cardBtns = document.createElement('div')
        cardBtns.style.cssText = 'display:flex;gap:6px'

        const loadBtn = document.createElement('button')
        loadBtn.className = 'calc-btn'
        loadBtn.style.cssText = 'font-size:12px;padding:4px 10px'
        loadBtn.textContent = '📂 Buka'
        loadBtn.addEventListener('click', () => {
          currentProtocol = p
          render()
        })

        const delBtn = document.createElement('button')
        delBtn.style.cssText =
          'font-size:12px;padding:4px 10px;background:none;border:1px solid var(--border);border-radius:6px;color:var(--red,#dc2626);cursor:pointer'
        delBtn.textContent = '🗑 Hapus'
        delBtn.addEventListener('click', () => {
          deleteProtocol(p.id)
          if (currentProtocol?.id === p.id) currentProtocol = null
          render()
        })

        cardBtns.appendChild(loadBtn)
        cardBtns.appendChild(delBtn)
        card.appendChild(cardInfo)
        card.appendChild(cardBtns)
        savedSection.appendChild(card)
      })

      container!.appendChild(savedSection)
    }
  }

  render()
}

// ---------------------------------------------------------------------------
// Window exposure
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    renderSessionBar?: (id: string) => void
    PB: {
      createProtocol: typeof createProtocol
      saveProtocol: typeof saveProtocol
      loadProtocols: typeof loadProtocols
      deleteProtocol: typeof deleteProtocol
      toggleItem: typeof toggleItem
      addItem: typeof addItem
      removeItem: typeof removeItem
      moveItem: typeof moveItem
      renderProtocolBuilder: typeof renderProtocolBuilder
    }
  }
}

window.PB = {
  createProtocol,
  saveProtocol,
  loadProtocols,
  deleteProtocol,
  toggleItem,
  addItem,
  removeItem,
  moveItem,
  renderProtocolBuilder,
}
