import { useState } from 'react'
import {
  calcRsi, calcIcuDrug,
  SCENARIO_INFO,
  type Scenario, type NmbChoice, type PremedChoice, type RassTarget, type PainLevel,
  type DrugRow, type RsiSection, type IcuDrugSection,
} from '../lib/sedasi'

type Tab = 'rsi' | 'icu'

/* ── Shared ── */
function colorBadge(c: string) {
  const map: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    purple: 'bg-purple-100 text-purple-800',
    teal: 'bg-teal-100 text-teal-800',
    red: 'bg-red-100 text-red-800',
  }
  return map[c] ?? 'bg-slate-100 text-slate-700'
}

function DrugTable({ rows }: { rows: DrugRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-600">
            <th className="text-left px-2 py-1.5 font-medium">Obat</th>
            <th className="text-left px-2 py-1.5 font-medium">Dosis / Total</th>
            <th className="text-left px-2 py-1.5 font-medium hidden sm:table-cell">Konsentrasi</th>
            <th className="text-left px-2 py-1.5 font-medium">Onset</th>
            <th className="text-left px-2 py-1.5 font-medium hidden md:table-cell">Durasi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className={r.warning ? 'bg-red-50' : ''}>
              <td className="px-2 py-2 font-medium text-slate-800 align-top">{r.drug}</td>
              <td className="px-2 py-2 align-top">
                <div className="font-semibold text-teal-700">{r.volume ?? r.rate ?? r.totalDose}</div>
                {r.rate && r.volume !== r.rate && <div className="text-slate-500 text-xs">{r.totalDose}</div>}
                {r.rate && <div className="text-slate-600 text-xs">Rate: {r.rate}</div>}
                {r.note && <div className="text-slate-500 text-xs mt-0.5 italic">{r.note}</div>}
                {r.warning && <div className="text-red-700 font-bold text-xs mt-0.5">{r.warning}</div>}
              </td>
              <td className="px-2 py-2 text-slate-500 hidden sm:table-cell align-top">{r.concentration}</td>
              <td className="px-2 py-2 text-slate-600 align-top">{r.onset}</td>
              <td className="px-2 py-2 text-slate-500 hidden md:table-cell align-top">{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── RSI Panel ── */
function RsiPanel() {
  const [bw, setBw] = useState('')
  const [scenario, setScenario] = useState<Scenario>('general')
  const [nmb, setNmb] = useState<NmbChoice>('roc_rsi')
  const [premed, setPremed] = useState<PremedChoice>('fentanyl')
  const [lidocaine, setLidocaine] = useState(false)
  const [atropine, setAtropine] = useState(false)
  const [showAlt, setShowAlt] = useState(false)

  const bwV = parseFloat(bw)
  const valid = !isNaN(bwV) && bwV >= 20 && bwV <= 250
  const sections: RsiSection[] = valid ? calcRsi(bwV, scenario, nmb, premed, lidocaine, atropine, showAlt) : []
  const info = SCENARIO_INFO[scenario]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 col-span-2 sm:col-span-1">
          Berat Badan (kg)
          <input type="number" className="input" value={bw} onChange={e => setBw(e.target.value)} placeholder="60" min={20} max={250} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 col-span-2">
          Skenario Klinis
          <select className="input" value={scenario} onChange={e => setScenario(e.target.value as Scenario)}>
            {(Object.entries(SCENARIO_INFO) as [Scenario, typeof info][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 col-span-2 sm:col-span-1">
          NMB (Relaksan Otot)
          <select className="input" value={nmb} onChange={e => setNmb(e.target.value as NmbChoice)}>
            <option value="roc_rsi">Rocuronium RSI 1.2 mg/kg</option>
            <option value="sux">Suksinilkolin 1.5 mg/kg</option>
            <option value="roc_std">Rocuronium Standar 0.6 mg/kg</option>
            <option value="atracurium">Atrakurium 0.5 mg/kg</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 col-span-2 sm:col-span-1">
          Analgesik Pre-medikasi
          <select className="input" value={premed} onChange={e => setPremed(e.target.value as PremedChoice)}>
            <option value="fentanyl">Fentanyl 2 mcg/kg</option>
            <option value="remifentanil">Remifentanil 1 mcg/kg</option>
            <option value="alfentanil">Alfentanil 15 mcg/kg</option>
            <option value="none">Tidak ada (emergensi cepat)</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={lidocaine} onChange={e => setLidocaine(e.target.checked)} /> Lidokain 1.5 mg/kg IV</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={atropine} onChange={e => setAtropine(e.target.checked)} /> Atropin pre-NMB</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showAlt} onChange={e => setShowAlt(e.target.checked)} /> Tampilkan dosis alternatif</label>
      </div>

      {/* Scenario guidance box */}
      <div className={`p-3 rounded-lg text-sm ${colorBadge(info.color)} border border-current border-opacity-20`}>
        <p className="font-semibold mb-1">Rekomendasi: {info.induction} · NMB: {info.nmbRec}</p>
        <p>{info.guidance}</p>
      </div>

      {valid && sections.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700 text-sm">{s.title}</h3>
          </div>
          <DrugTable rows={s.rows} />
          {s.guidance && <p className="px-4 py-2 text-xs text-slate-500 italic">{s.guidance}</p>}
        </div>
      ))}

      {valid && (
        <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-700">Checklist Pasca Intubasi</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Konfirmasi posisi ETT — EtCO₂ + auskultasi bilateral</li>
            <li>Foto toraks segera pasca intubasi</li>
            <li>Fiksasi ETT, catat kedalaman di gigi (cm)</li>
            <li>Set ventilator awal: VT 6–8 mL/kgIBW, RR 14–16, PEEP 5</li>
            <li>Mulai sedasi + analgesia maintenans</li>
            <li>Monitor SpO₂, EtCO₂, NIBP, HR terus-menerus</li>
          </ul>
        </div>
      )}

      {!valid && bw && (
        <p className="text-sm text-amber-600">Masukkan berat badan valid (20–250 kg).</p>
      )}
    </div>
  )
}

/* ── ICU Maintenance Panel ── */
function IcuPanel() {
  const [bw, setBw] = useState('')
  const [rass, setRass] = useState<RassTarget>('moderate')
  const [pain, setPain] = useState<PainLevel>('moderate')

  const bwV = parseFloat(bw)
  const valid = !isNaN(bwV) && bwV >= 20 && bwV <= 200
  const sections: IcuDrugSection[] = valid ? calcIcuDrug(bwV, rass, pain) : []

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Berat Badan (kg)
          <input type="number" className="input" value={bw} onChange={e => setBw(e.target.value)} placeholder="60" min={20} max={200} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Target RASS
          <select className="input" value={rass} onChange={e => setRass(e.target.value as RassTarget)}>
            <option value="light">Light (RASS −1 hingga 0)</option>
            <option value="moderate">Moderate (RASS −2 hingga −3)</option>
            <option value="deep">Deep (RASS −4 hingga −5)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Tingkat Nyeri
          <select className="input" value={pain} onChange={e => setPain(e.target.value as PainLevel)}>
            <option value="mild">Ringan (NRS 1–3)</option>
            <option value="moderate">Sedang (NRS 4–6)</option>
            <option value="severe">Berat (NRS 7–10)</option>
          </select>
        </label>
      </div>

      {valid && sections.map((s, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700 text-sm">{s.title}</h3>
            {s.note && <p className="text-xs text-amber-700 mt-0.5">{s.note}</p>}
          </div>
          <DrugTable rows={s.rows} />
        </div>
      ))}

      {valid && (
        <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-700">Monitoring Wajib</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>RASS setiap 4 jam (target: {rass === 'light' ? '−1 hingga 0' : rass === 'moderate' ? '−2 hingga −3' : '−4 hingga −5'})</li>
            <li>CPOT/NRS untuk nyeri setiap 4 jam</li>
            <li>CAM-ICU untuk delirium setiap shift</li>
            <li>SAT (Spontaneous Awakening Trial) setiap pagi</li>
            {rass === 'deep' && <li>TOF (Train-of-Four) jika menggunakan NMB — target 2/4</li>}
            {rass === 'deep' && <li>Cek TG jika propofol &gt;48 jam</li>}
          </ul>
        </div>
      )}

      {!valid && bw && (
        <p className="text-sm text-amber-600">Masukkan berat badan valid (20–200 kg).</p>
      )}
    </div>
  )
}

/* ── Page ── */
export function Sedasi() {
  const [tab, setTab] = useState<Tab>('rsi')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Sedasi & RSI</h1>
        <p className="text-sm text-slate-500 mt-1">Induksi Intubasi (RSI) · Maintenans Sedasi & Analgesia ICU</p>
      </div>

      <div className="flex gap-2">
        {([['rsi', 'Induksi / RSI'], ['icu', 'ICU Maintenans']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        {tab === 'rsi' ? <RsiPanel /> : <IcuPanel />}
      </div>
    </div>
  )
}
