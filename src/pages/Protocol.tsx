// Protocol.tsx — Protocol Builder page (React migration of protocol-builder.ts)
import { useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface ProtocolItem {
  id: string
  text: string
  checked: boolean
  addedAt: number
}

interface Protocol {
  id: string
  name: string
  template: string
  items: ProtocolItem[]
  createdAt: number
  updatedAt: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROTOCOL_STORAGE_KEY = 'icu-protocols'
const MAX_PROTOCOLS = 5

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

function loadProtocols(): Protocol[] {
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

function persistProtocols(list: Protocol[]): void {
  try {
    localStorage.setItem(PROTOCOL_STORAGE_KEY, JSON.stringify(list.slice(0, MAX_PROTOCOLS)))
  } catch {
    // Storage quota — fail silently
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Protocol() {
  const [protocols, setProtocols] = useState<Protocol[]>(() => loadProtocols())
  const [current, setCurrent] = useState<Protocol | null>(null)
  const [templateKey, setTemplateKey] = useState('ards')
  const [protocolName, setProtocolName] = useState('')
  const [addText, setAddText] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  // Sync to localStorage whenever protocols list changes
  useEffect(() => {
    persistProtocols(protocols)
  }, [protocols])

  function handleCreate() {
    const name = protocolName.trim() || (TEMPLATE_LABELS[templateKey] ?? 'Protocol Baru')
    const items: ProtocolItem[] = (TEMPLATES[templateKey] ?? []).map((text) => ({
      id: genId(),
      text,
      checked: false,
      addedAt: Date.now(),
    }))
    const proto: Protocol = {
      id: genId(),
      name,
      template: templateKey,
      items,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setCurrent(proto)
    setProtocolName('')
  }

  function handleToggleItem(itemId: string) {
    if (!current) return
    setCurrent({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
      updatedAt: Date.now(),
    })
  }

  function handleAddItem() {
    const trimmed = addText.trim()
    if (!trimmed || !current) return
    const newItem: ProtocolItem = { id: genId(), text: trimmed, checked: false, addedAt: Date.now() }
    setCurrent({ ...current, items: [...current.items, newItem], updatedAt: Date.now() })
    setAddText('')
  }

  function handleRemoveItem(itemId: string) {
    if (!current) return
    setCurrent({ ...current, items: current.items.filter((i) => i.id !== itemId), updatedAt: Date.now() })
  }

  function handleMoveItem(itemId: string, direction: 'up' | 'down') {
    if (!current) return
    const items = [...current.items]
    const idx = items.findIndex((i) => i.id === itemId)
    if (idx < 0) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= items.length) return
    const temp = items[idx]!
    items[idx] = items[newIdx]!
    items[newIdx] = temp
    setCurrent({ ...current, items, updatedAt: Date.now() })
  }

  function handleSave() {
    if (!current) return
    const updated = { ...current, updatedAt: Date.now() }
    setProtocols((prev) => {
      const filtered = prev.filter((p) => p.id !== updated.id)
      return [updated, ...filtered].slice(0, MAX_PROTOCOLS)
    })
    setCurrent(updated)
    setSaveMsg('✓ Tersimpan')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  function handleDelete(id: string) {
    setProtocols((prev) => prev.filter((p) => p.id !== id))
    if (current?.id === id) setCurrent(null)
  }

  function handleLoad(proto: Protocol) {
    setCurrent(proto)
  }

  const total = current?.items.length ?? 0
  const done = current?.items.filter((i) => i.checked).length ?? 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Protocol Builder</h1>
        <p className="text-sm text-slate-500 mt-1">Buat &amp; simpan protokol klinis ICU — ARDS · Sepsis · Weaning · VAP</p>
      </div>

      {/* Template selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-44">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Template</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
            >
              {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Protokol</label>
            <input
              type="text"
              placeholder="Nama protokol…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
            />
          </div>
          <button
            onClick={handleCreate}
            className="shrink-0 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            + Buat Baru
          </button>
        </div>
      </div>

      {/* Active protocol editor */}
      {current && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{current.name}</span>
              <span>{done}/{total} selesai ({pct}%)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1">
            {current.items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  item.checked ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleItem(item.id)}
                  className="w-4 h-4 accent-green-600 shrink-0"
                />
                <span className={`flex-1 text-sm ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => handleMoveItem(item.id, 'up')}
                  disabled={idx === 0}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-25 text-sm px-1"
                  title="Naikan"
                >↑</button>
                <button
                  onClick={() => handleMoveItem(item.id, 'down')}
                  disabled={idx === current.items.length - 1}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-25 text-sm px-1"
                  title="Turunkan"
                >↓</button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-600 text-base px-1 leading-none"
                  title="Hapus item"
                >×</button>
              </div>
            ))}
          </div>

          {/* Add item */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tambah item checklist…"
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddItem() }}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddItem}
              className="shrink-0 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Tambah
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 items-center pt-1">
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              💾 Simpan
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-lg border border-slate-300 bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              🖨 Print
            </button>
            <button
              onClick={() => setCurrent(null)}
              className="rounded-lg border border-slate-300 text-slate-500 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              ✕ Tutup
            </button>
            {saveMsg && <span className="text-sm text-green-600 font-medium">{saveMsg}</span>}
          </div>
        </div>
      )}

      {/* Saved protocols */}
      {protocols.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-700">Protokol Tersimpan</h2>
          <div className="space-y-2">
            {protocols.map((p) => {
              const doneCount = p.items.filter((i) => i.checked).length
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {TEMPLATE_LABELS[p.template] ?? p.template} · {doneCount}/{p.items.length} selesai · {new Date(p.updatedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleLoad(p)}
                      className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      📂 Buka
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded-lg border border-slate-300 text-red-500 px-3 py-1.5 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
