import { useState, useMemo, useCallback } from 'react'
import { ICU_DRUGS } from '../data/drugs'
import type { Drug, DoseAdjustment } from '../types/drug'

/* ── Constants ── */
const CATEGORIES = [
  { id: 'all', label: 'Semua Obat' },
  { id: 'vasopressor', label: 'Vasopressor' },
  { id: 'inotropik', label: 'Inotropik' },
  { id: 'sedasi', label: 'Sedasi' },
  { id: 'analgesia', label: 'Analgesia' },
  { id: 'nmb', label: 'NMB' },
  { id: 'antibiotik', label: 'Antibiotik' },
  { id: 'antifungal', label: 'Antifungal' },
  { id: 'antiviral', label: 'Antiviral' },
  { id: 'kardiovaskular', label: 'Kardio' },
  { id: 'steroid', label: 'Steroid' },
  { id: 'gi', label: 'GI' },
  { id: 'high_alert', label: '🚨 High-Alert' },
  { id: 'pregnancy_safe', label: '🤰 Aman Hamil' },
]

const BANDS = [
  { id: 'all', label: 'Normal / Semua' },
  { id: 'ge60', label: '≥60 mL/min' },
  { id: 'r30_60', label: '30–59 mL/min' },
  { id: 'r15_30', label: '15–29 mL/min' },
  { id: 'r_lt15', label: '<15 mL/min' },
  { id: 'hd', label: 'Hemodialisis' },
  { id: 'crrt', label: 'CRRT' },
] as const
type Band = typeof BANDS[number]['id']

const BADGE_CLS: Record<string, string> = {
  safe: 'bg-emerald-100 text-emerald-800',
  adjust: 'bg-amber-100 text-amber-800',
  reduce: 'bg-orange-100 text-orange-800',
  avoid: 'bg-red-100 text-red-800',
}
const BADGE_LABEL: Record<string, string> = {
  safe: '✓ Aman', adjust: '⚠ Sesuaikan', reduce: '↓ Kurangi', avoid: '✗ Hindari',
}

function doseText(adj: DoseAdjustment | string): string {
  if (typeof adj === 'string') return adj
  const parts = [adj.dose, adj.interval, adj.note].filter(Boolean)
  return parts.join(' · ')
}

/* ── Drug Modal ── */
type ModalTab = 'umum' | 'dosis' | 'ginjal' | 'keamanan' | 'lainnya'

function DrugModal({ drug, band, onClose }: { drug: Drug; band: Band; onClose: () => void }) {
  const [tab, setTab] = useState<ModalTab>('umum')
  const ra = drug.renal_adjustment

  const MODAL_TABS: { id: ModalTab; label: string }[] = [
    { id: 'umum', label: 'Umum' },
    { id: 'dosis', label: 'Dosis' },
    { id: 'ginjal', label: 'Ginjal' },
    { id: 'keamanan', label: 'Keamanan' },
    { id: 'lainnya', label: 'Lainnya' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-5 pt-5 pb-3 border-b ${drug.high_alert ? 'border-red-200 bg-red-50' : 'border-slate-200'}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{drug.name}</h2>
              <p className="text-sm text-slate-500">{drug.class}{drug.subclass ? ` · ${drug.subclass}` : ''}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1">✕</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {drug.high_alert && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">🚨 HIGH-ALERT</span>}
            {band !== 'all' && <span className={`px-2 py-0.5 rounded text-xs font-semibold ${BADGE_CLS[ra.badge]}`}>{BADGE_LABEL[ra.badge]}</span>}
            {(drug.pregnancy.fda_category === 'A' || drug.pregnancy.fda_category === 'B') && (
              <span className="px-2 py-0.5 rounded text-xs bg-pink-100 text-pink-800">🤰 FDA {drug.pregnancy.fda_category}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-2 pb-0 border-b border-slate-200 overflow-x-auto">
          {MODAL_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 text-sm">
          {tab === 'umum' && (
            <>
              {drug.high_alert && drug.high_alert_warnings.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-bold text-red-700 mb-1">⚠ Peringatan High-Alert</p>
                  <ul className="space-y-0.5 text-red-700">{drug.high_alert_warnings.map((w, i) => <li key={i}>• {w}</li>)}</ul>
                  {drug.high_alert_protocol && <p className="mt-2 text-red-600 text-xs">{drug.high_alert_protocol}</p>}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-700 mb-1">Indikasi Utama ICU</p>
                <ul className="space-y-0.5">{drug.indications.icu_primary.map((ind, i) => <li key={i} className="text-slate-600">• {ind}</li>)}</ul>
              </div>
              {drug.indications.icu_secondary.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Indikasi Sekunder</p>
                  <ul className="space-y-0.5">{drug.indications.icu_secondary.map((ind, i) => <li key={i} className="text-slate-500">• {ind}</li>)}</ul>
                </div>
              )}
              {drug.indications.local_guideline && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-700 mb-0.5">Panduan Lokal (Indonesia)</p>
                  <p className="text-blue-700">{drug.indications.local_guideline}</p>
                </div>
              )}
              {drug.indications.intl_guideline && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="font-semibold text-slate-700 mb-0.5">Panduan Internasional</p>
                  <p className="text-slate-600">{drug.indications.intl_guideline}</p>
                </div>
              )}
              {drug.contraindications.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Kontraindikasi</p>
                  <ul className="space-y-0.5">{drug.contraindications.map((c, i) => <li key={i} className="text-red-700">• {c}</li>)}</ul>
                </div>
              )}
              {drug.precautions.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Perhatian</p>
                  <ul className="space-y-0.5">{drug.precautions.map((p, i) => <li key={i} className="text-amber-700">• {p}</li>)}</ul>
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-700 mb-1">Mekanisme</p>
                <p className="text-slate-600">{drug.mechanism}</p>
              </div>
              {drug.spectrum && (
                <div>
                  <p className="font-semibold text-slate-700 mb-2">Spektrum Antimikroba</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(drug.spectrum).map(([k, v]) => v ? (
                      <span key={k} className="px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-800">{k.replace(/_/g, ' ')}{typeof v === 'string' ? `: ${v}` : ''}</span>
                    ) : null)}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'dosis' && (
            <>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <p className="font-semibold text-teal-800 mb-0.5">Dosis Standar</p>
                <p className="text-teal-700 font-mono">{drug.dosing.standard}</p>
              </div>
              {drug.dosing.loading && (
                <div><p className="font-semibold text-slate-700">Loading Dose</p><p className="text-slate-600 font-mono">{drug.dosing.loading}</p></div>
              )}
              {drug.dosing.maintenance && (
                <div><p className="font-semibold text-slate-700">Dosis Maintenans</p><p className="text-slate-600">{drug.dosing.maintenance}</p></div>
              )}
              {drug.dosing.max && (
                <div><p className="font-semibold text-slate-700">Dosis Maksimal</p><p className="text-slate-600">{drug.dosing.max}</p></div>
              )}
              <div><p className="font-semibold text-slate-700">Rute</p><p className="text-slate-600">{drug.dosing.route.join(', ')}</p></div>
              {drug.dosing.dilution && (
                <div><p className="font-semibold text-slate-700">Pengenceran / Persiapan</p><p className="text-slate-600">{drug.dosing.dilution}</p></div>
              )}
              {drug.dosing.rate && (
                <div><p className="font-semibold text-slate-700">Rate / Kecepatan</p><p className="text-slate-600">{drug.dosing.rate}</p></div>
              )}
              {drug.dosing.titration && (
                <div><p className="font-semibold text-slate-700">Titrasi</p><p className="text-slate-600">{drug.dosing.titration}</p></div>
              )}
              {drug.dosing.special_notes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="font-semibold text-amber-800 mb-0.5">Catatan Khusus</p>
                  <p className="text-amber-700">{drug.dosing.special_notes}</p>
                </div>
              )}
            </>
          )}

          {tab === 'ginjal' && (
            <>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left px-2 py-1.5 font-medium">eGFR / RRT</th>
                    <th className="text-left px-2 py-1.5 font-medium">Dosis & Interval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BANDS.filter(b => b.id !== 'all').map(b => {
                    const adj = ra[b.id as keyof typeof ra] as DoseAdjustment | string
                    const isActive = band === b.id
                    return (
                      <tr key={b.id} className={isActive ? 'bg-amber-50 font-semibold' : ''}>
                        <td className="px-2 py-2 text-slate-600 whitespace-nowrap">{b.label}{isActive ? ' ◀' : ''}</td>
                        <td className="px-2 py-2 text-slate-700">{doseText(adj)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className={`px-2 py-0.5 rounded font-semibold ${BADGE_CLS[ra.badge]}`}>{BADGE_LABEL[ra.badge]}</span>
                <span>{ra.dialyzable ? '✓ Terdialisis' : '✗ Tidak terdialisis'}</span>
              </div>
              {ra.monitoring_renal && <p className="text-slate-600 text-xs">{ra.monitoring_renal}</p>}
              <div>
                <p className="font-semibold text-slate-700 mb-1">Penyesuaian Hepatik</p>
                <table className="w-full text-xs border-collapse">
                  <tbody className="divide-y divide-slate-100">
                    {[['Child A', drug.hepatic_adjustment.child_a], ['Child B', drug.hepatic_adjustment.child_b], ['Child C', drug.hepatic_adjustment.child_c]].map(([label, val]) => (
                      <tr key={label}><td className="px-2 py-1.5 text-slate-500 w-20">{label}</td><td className="px-2 py-1.5 text-slate-700">{val}</td></tr>
                    ))}
                  </tbody>
                </table>
                {drug.hepatic_adjustment.note && <p className="text-xs text-slate-500 mt-1">{drug.hepatic_adjustment.note}</p>}
              </div>
            </>
          )}

          {tab === 'keamanan' && (
            <>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Monitoring Efikasi</p>
                <ul className="space-y-0.5">{drug.monitoring.efficacy.map((m, i) => <li key={i} className="text-slate-600">• {m}</li>)}</ul>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Monitoring Keamanan</p>
                <ul className="space-y-0.5">{drug.monitoring.safety.map((m, i) => <li key={i} className="text-amber-700">• {m}</li>)}</ul>
              </div>
              {drug.monitoring.therapeutic_range && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  <span className="font-semibold">Target terapeutik: </span>{drug.monitoring.therapeutic_range}
                </div>
              )}
              {drug.adverse_effects.critical.length > 0 && (
                <div>
                  <p className="font-semibold text-red-700 mb-1">Efek Samping Kritis</p>
                  <ul className="space-y-0.5">{drug.adverse_effects.critical.map((e, i) => <li key={i} className="text-red-600">• {e}</li>)}</ul>
                </div>
              )}
              {drug.adverse_effects.common.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Efek Samping Umum</p>
                  <ul className="space-y-0.5">{drug.adverse_effects.common.map((e, i) => <li key={i} className="text-slate-600">• {e}</li>)}</ul>
                </div>
              )}
              {drug.adverse_effects.antidote && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="font-semibold text-emerald-700">Antidot: {drug.adverse_effects.antidote}</p>
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-700 mb-1">Kehamilan & Laktasi</p>
                <div className="space-y-1 text-slate-600">
                  {drug.pregnancy.fda_category && <p><span className="font-medium">FDA:</span> Kategori {drug.pregnancy.fda_category}</p>}
                  <p><span className="font-medium">Trimester 1:</span> {drug.pregnancy.trimester_1}</p>
                  <p><span className="font-medium">Trimester 2:</span> {drug.pregnancy.trimester_2}</p>
                  <p><span className="font-medium">Trimester 3:</span> {drug.pregnancy.trimester_3}</p>
                  <p><span className="font-medium">Laktasi:</span> {drug.pregnancy.lactation}</p>
                </div>
              </div>
            </>
          )}

          {tab === 'lainnya' && (
            <>
              {drug.interactions.major.length > 0 && (
                <div>
                  <p className="font-semibold text-red-700 mb-1">Interaksi Mayor</p>
                  <div className="space-y-2">
                    {drug.interactions.major.map((ix, i) => (
                      <div key={i} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                        <p className="font-semibold text-red-700">{ix.drug}</p>
                        {ix.effect && <p className="text-red-600">{ix.effect}</p>}
                        {ix.management && <p className="text-slate-600 mt-0.5">{ix.management}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {drug.interactions.moderate.length > 0 && (
                <div>
                  <p className="font-semibold text-amber-700 mb-1">Interaksi Moderat</p>
                  <div className="space-y-1">
                    {drug.interactions.moderate.map((ix, i) => (
                      <div key={i} className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                        <p className="font-semibold text-amber-700">{ix.drug}</p>
                        {ix.effect && <p className="text-amber-600">{ix.effect}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {drug.stewardship && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Antibiotic Stewardship</p>
                  <div className="space-y-1 text-slate-600 text-xs">
                    {drug.stewardship.empiric_sources && <p><span className="font-medium">Empiris untuk:</span> {drug.stewardship.empiric_sources.join(', ')}</p>}
                    {drug.stewardship.duration_standard && <p><span className="font-medium">Durasi standar:</span> {drug.stewardship.duration_standard} hari</p>}
                    {drug.stewardship.stop_criteria && <p><span className="font-medium">Stop jika:</span> {drug.stewardship.stop_criteria}</p>}
                    {drug.stewardship.deescalation_to && <p><span className="font-medium">De-eskalasi ke:</span> {drug.stewardship.deescalation_to.join(', ')}</p>}
                    {drug.stewardship.local_pattern_note && (
                      <p className="p-2 bg-blue-50 border border-blue-200 rounded mt-1">{drug.stewardship.local_pattern_note}</p>
                    )}
                  </div>
                </div>
              )}
              {drug.evidence.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Referensi Kunci</p>
                  <ul className="space-y-1">
                    {drug.evidence.map((ev, i) => (
                      <li key={i} className="text-xs text-slate-600">• [{ev.ref_id}] {ev.note}</li>
                    ))}
                  </ul>
                </div>
              )}
              {drug.brand_id.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Brand di Indonesia</p>
                  <p className="text-slate-600">{drug.brand_id.join(', ')}</p>
                  {drug.brand_id_notes && <p className="text-xs text-slate-500 mt-0.5">{drug.brand_id_notes}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Drug Card ── */
function DrugCard({ drug, band, onClick }: { drug: Drug; band: Band; onClick: () => void }) {
  const ra = drug.renal_adjustment
  const showBadge = band !== 'all'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${
        drug.high_alert ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white hover:border-teal-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{drug.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
          {drug.high_alert && <span className="text-red-600 text-xs font-bold">🚨</span>}
          {showBadge && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${BADGE_CLS[ra.badge]}`}>
              {BADGE_LABEL[ra.badge]}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-2">{drug.class}{drug.subclass ? ` · ${drug.subclass}` : ''}</p>
      <p className="text-xs font-mono text-teal-700 truncate">{drug.dosing.standard}</p>
    </button>
  )
}

/* ── Main Page ── */
export function DrugRef() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [band, setBand] = useState<Band>('all')
  const [egfrInput, setEgfrInput] = useState('')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const handleEgfr = useCallback((val: string) => {
    setEgfrInput(val)
    const v = parseFloat(val)
    if (isNaN(v)) { setBand('all'); return }
    if (v >= 60) setBand('ge60')
    else if (v >= 30) setBand('r30_60')
    else if (v >= 15) setBand('r15_30')
    else setBand('r_lt15')
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return Object.entries(ICU_DRUGS).filter(([, d]) => {
      if (q) {
        const hay = [d.name, ...d.brand_id, d.class, d.subclass ?? '', ...d.indications.icu_primary].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (cat === 'high_alert') return d.high_alert
      if (cat === 'pregnancy_safe') return d.pregnancy.fda_category === 'A' || d.pregnancy.fda_category === 'B'
      if (cat !== 'all') return d.category.includes(cat)
      return true
    }).sort(([, a], [, b]) => a.name.localeCompare(b.name))
  }, [search, cat])

  const openDrug = openKey ? ICU_DRUGS[openKey] : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Drug Reference ICU</h1>
        <p className="text-sm text-slate-500 mt-1">{Object.keys(ICU_DRUGS).length} obat · Dosis · Renal adjustment · Interaksi · Stewardship</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="input w-full pl-9"
              placeholder="Cari obat, brand, indikasi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="input w-24 text-sm"
              placeholder="eGFR"
              value={egfrInput}
              onChange={e => handleEgfr(e.target.value)}
            />
            <select className="input text-sm" value={band} onChange={e => { setBand(e.target.value as Band); setEgfrInput('') }}>
              {BANDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${cat === c.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400">Menampilkan {filtered.length} obat{band !== 'all' ? ` · Mode eGFR aktif` : ''}</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(([key, drug]) => (
          <DrugCard key={key} drug={drug} band={band} onClick={() => setOpenKey(key)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-2">💊</p>
          <p>Tidak ada obat ditemukan untuk pencarian ini.</p>
        </div>
      )}

      {/* Modal */}
      {openKey && openDrug && (
        <DrugModal drug={openDrug} band={band} onClose={() => setOpenKey(null)} />
      )}
    </div>
  )
}
