import { useState } from 'react'
import { calcNa, calcK, calcCa, calcMg } from '../lib/elektro'

type Tab = 'na' | 'k' | 'ca' | 'mg'

const TABS: { id: Tab; label: string }[] = [
  { id: 'na', label: 'Natrium' },
  { id: 'k', label: 'Kalium' },
  { id: 'ca', label: 'Kalsium' },
  { id: 'mg', label: 'Magnesium' },
]

function colorCls(c?: string) {
  if (c === 'red') return 'bg-red-50 border-red-300 text-red-800'
  if (c === 'amber') return 'bg-amber-50 border-amber-300 text-amber-800'
  if (c === 'teal') return 'bg-teal-50 border-teal-300 text-teal-800'
  return 'bg-slate-50 border-slate-200 text-slate-700'
}

/* ── Natrium ── */
function NaPanel() {
  const [na, setNa] = useState('')
  const [sex, setSex] = useState<'m' | 'f'>('m')
  const [bw, setBw] = useState('')
  const [glu, setGlu] = useState('')
  const [onset, setOnset] = useState<'akut' | 'kronik'>('kronik')
  const [speed, setSpeed] = useState<'standard' | 'emergency'>('standard')

  const naV = parseFloat(na), bwV = parseFloat(bw)
  const valid = !isNaN(naV) && !isNaN(bwV) && bwV > 0
  const res = valid ? calcNa(naV, sex, bwV, glu ? parseFloat(glu) : undefined, onset, speed) : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Na Serum (mEq/L)
          <input type="number" className="input" value={na} onChange={e => setNa(e.target.value)} placeholder="135" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          BB (kg)
          <input type="number" className="input" value={bw} onChange={e => setBw(e.target.value)} placeholder="60" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Glukosa (mg/dL) <span className="text-xs text-slate-400">opsional</span>
          <input type="number" className="input" value={glu} onChange={e => setGlu(e.target.value)} placeholder="100" />
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <fieldset className="flex gap-2">
          <legend className="text-xs text-slate-500 mb-1 w-full">Jenis Kelamin</legend>
          {([['m', 'Laki-laki'], ['f', 'Perempuan']] as const).map(([v, l]) => (
            <label key={v} className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="na-sex" checked={sex === v} onChange={() => setSex(v)} /> {l}
            </label>
          ))}
        </fieldset>
        <fieldset className="flex gap-2">
          <legend className="text-xs text-slate-500 mb-1 w-full">Onset</legend>
          {([['akut', 'Akut (<48 jam)'], ['kronik', 'Kronik (≥48 jam)']] as const).map(([v, l]) => (
            <label key={v} className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="na-onset" checked={onset === v} onChange={() => setOnset(v)} /> {l}
            </label>
          ))}
        </fieldset>
        <fieldset className="flex gap-2">
          <legend className="text-xs text-slate-500 mb-1 w-full">Mode Koreksi</legend>
          {([['standard', 'Standar'], ['emergency', 'Emergensi']] as const).map(([v, l]) => (
            <label key={v} className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="na-speed" checked={speed === v} onChange={() => setSpeed(v)} /> {l}
            </label>
          ))}
        </fieldset>
      </div>

      {res && (
        <div className="space-y-3">
          {res.naCorrNote && (
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800 text-sm">{res.naCorrNote}</div>
          )}
          {res.type === 'hypo' && (
            <div className={`p-4 rounded-lg border ${colorCls(res.color)} space-y-2`}>
              <p className="font-semibold">Hiponatremia — {res.sev}</p>
              <p className="text-sm">TBW: {res.tbw.toFixed(1)} L · Target Na: {res.naTarget} mEq/L</p>
              <p className="text-sm">Volume NaCl 3%: <strong>{res.vol3pct} mL</strong></p>
              <p className="text-sm">Rate: <strong>{res.rateMlHr} mL/jam</strong> selama {res.durationH} jam</p>
              <p className="text-xs text-slate-600">Batas koreksi: {res.limitLow}–{res.limitHigh} mEq/L per 24 jam</p>
            </div>
          )}
          {res.type === 'hyper' && (
            <div className={`p-4 rounded-lg border ${colorCls(res.color)} space-y-2`}>
              <p className="font-semibold">Hipernatremia</p>
              <p className="text-sm">TBW: {res.tbw.toFixed(1)} L · Defisit air bebas: <strong>{res.waterDeficitL} L</strong></p>
              <p className="text-sm">Rate D5W: <strong>{res.rateD5W} mL/jam</strong> (koreksi dalam 48 jam)</p>
              <p className="text-xs text-slate-600">Koreksi tidak melebihi 10 mEq/L per 24 jam</p>
            </div>
          )}
          {res.type === 'normal' && (
            <div className="p-4 rounded-lg border bg-teal-50 border-teal-200 text-teal-800">
              <p className="font-semibold">Natrium Normal (135–145 mEq/L)</p>
              <p className="text-sm">Tidak diperlukan koreksi natrium.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Kalium ── */
function KPanel() {
  const [k, setK] = useState('')
  const [bw, setBw] = useState('')
  const [ph, setPh] = useState('')
  const [access, setAccess] = useState<'perifer' | 'sentral'>('perifer')

  const kV = parseFloat(k)
  const valid = !isNaN(kV)
  const res = valid ? calcK(kV, bw ? parseFloat(bw) : undefined, ph ? parseFloat(ph) : undefined, access) : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          K Serum (mEq/L)
          <input type="number" step="0.1" className="input" value={k} onChange={e => setK(e.target.value)} placeholder="3.8" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          BB (kg) <span className="text-xs text-slate-400">opsional</span>
          <input type="number" className="input" value={bw} onChange={e => setBw(e.target.value)} placeholder="60" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          pH Arteri <span className="text-xs text-slate-400">opsional</span>
          <input type="number" step="0.01" className="input" value={ph} onChange={e => setPh(e.target.value)} placeholder="7.40" />
        </label>
      </div>
      <fieldset className="flex gap-4 text-sm">
        <legend className="text-xs text-slate-500 mb-1 w-full">Akses IV</legend>
        {([['perifer', 'Perifer (max 10 mEq/jam, 40 mEq/L)'], ['sentral', 'Sentral (max 20 mEq/jam, 80 mEq/L)']] as const).map(([v, l]) => (
          <label key={v} className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="k-access" checked={access === v} onChange={() => setAccess(v)} /> {l}
          </label>
        ))}
      </fieldset>

      {res && (
        <div className="space-y-3">
          {res.phNote && (
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800 text-sm">{res.phNote}</div>
          )}
          {res.type === 'hypo' && (
            <div className={`p-4 rounded-lg border ${colorCls(res.color)} space-y-2`}>
              <p className="font-semibold">Hipokalemia — {res.sev}</p>
              <p className="text-sm">Estimasi defisit: <strong>{res.defLow}–{res.defHigh} mEq</strong></p>
              <p className="text-sm">Rate max: <strong>{res.maxRate} mEq/jam</strong> · Konsentrasi max: {res.maxConc} mEq/L</p>
              <p className="text-xs text-slate-600">Monitor EKG selama infus. Koreksi Mg bersamaan jika hipomagnesemia.</p>
            </div>
          )}
          {res.type === 'hyper' && (
            <div className={`p-4 rounded-lg border ${colorCls('red')} space-y-2`}>
              <p className="font-semibold">Hiperkalemia — {res.sev}</p>
              <p className="text-sm">Pasang monitor EKG segera. Cari dan atasi penyebab.</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Ca glukonat 10% 10 mL IV (stabilisasi membran)</li>
                <li>Insulin regular 10 IU + D50% 50 mL IV (shift K)</li>
                <li>Bikarbonat NaHCO₃ jika asidosis metabolik</li>
                <li>Kayexalate / Patiromer / Furosemid / Dialisis</li>
              </ul>
            </div>
          )}
          {res.type === 'normal' && (
            <div className="p-4 rounded-lg border bg-teal-50 border-teal-200 text-teal-800">
              <p className="font-semibold">Kalium Normal (3.5–5.0 mEq/L)</p>
              <p className="text-sm">Tidak diperlukan koreksi kalium.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Kalsium ── */
function CaPanel() {
  const [ca, setCa] = useState('')
  const [alb, setAlb] = useState('')
  const [ph, setPh] = useState('')
  const [bw, setBw] = useState('')

  const caV = parseFloat(ca), albV = parseFloat(alb)
  const valid = !isNaN(caV) && !isNaN(albV)
  const res = valid ? calcCa(caV, albV, ph ? parseFloat(ph) : undefined, bw ? parseFloat(bw) : undefined) : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Ca Total (mg/dL)
          <input type="number" step="0.1" className="input" value={ca} onChange={e => setCa(e.target.value)} placeholder="9.0" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Albumin (g/dL)
          <input type="number" step="0.1" className="input" value={alb} onChange={e => setAlb(e.target.value)} placeholder="4.0" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          pH <span className="text-xs text-slate-400">opsional</span>
          <input type="number" step="0.01" className="input" value={ph} onChange={e => setPh(e.target.value)} placeholder="7.40" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          BB (kg) <span className="text-xs text-slate-400">opsional</span>
          <input type="number" className="input" value={bw} onChange={e => setBw(e.target.value)} placeholder="60" />
        </label>
      </div>

      {res && (
        <div className={`p-4 rounded-lg border ${colorCls(res.color)} space-y-2`}>
          <p className="font-semibold">{res.sev}</p>
          <p className="text-sm">Ca terkoreksi albumin: <strong>{res.caCorr} mg/dL</strong> · Ca ionisasi estimasi: <strong>{res.caIonEst} mmol/L</strong></p>
          <p className="text-sm mt-1">{res.tx}</p>
        </div>
      )}
    </div>
  )
}

/* ── Magnesium ── */
function MgPanel() {
  const [mg, setMg] = useState('')
  const [bw, setBw] = useState('')
  const [egfr, setEgfr] = useState('')
  const [symp, setSymp] = useState(false)

  const mgV = parseFloat(mg)
  const valid = !isNaN(mgV)
  const res = valid ? calcMg(mgV, bw ? parseFloat(bw) : undefined, egfr ? parseFloat(egfr) : undefined, symp) : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Mg Serum (mg/dL)
          <input type="number" step="0.1" className="input" value={mg} onChange={e => setMg(e.target.value)} placeholder="2.0" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          BB (kg) <span className="text-xs text-slate-400">opsional</span>
          <input type="number" className="input" value={bw} onChange={e => setBw(e.target.value)} placeholder="60" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          eGFR (mL/min) <span className="text-xs text-slate-400">opsional</span>
          <input type="number" className="input" value={egfr} onChange={e => setEgfr(e.target.value)} placeholder="90" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={symp} onChange={e => setSymp(e.target.checked)} />
        Bergejala (tetani, aritmia, kejang)
      </label>

      {res && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 text-sm">
            Mg: <strong>{res.mg} mg/dL</strong> ({res.mgMmol} mmol/L)
          </div>
          {res.type !== 'normal' && (
            <div className={`p-4 rounded-lg border ${colorCls(res.color)} space-y-2`}>
              <p className="font-semibold">{res.type === 'hypo' ? 'Hipomagnesia' : 'Hipermagnesia'} — {res.sev}</p>
              {res.regime && <p className="text-sm">{res.regime}</p>}
              {res.renalWarning && (
                <p className="text-sm font-medium text-amber-700">⚠ Gangguan ginjal (eGFR &lt;30) — dosis dikurangi 50%. Monitor refleks patela dan laju napas.</p>
              )}
              {res.type === 'hyper' && (
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Hentikan semua suplemen Mg</li>
                  <li>Ca glukonat 10% 10 mL IV (antagonis gejala akut)</li>
                  <li>Hidrasi NaCl + Furosemid (jika fungsi ginjal baik)</li>
                  <li>Pertimbangkan dialisis jika gagal ginjal berat</li>
                </ul>
              )}
            </div>
          )}
          {res.type === 'normal' && (
            <div className="p-4 rounded-lg border bg-teal-50 border-teal-200 text-teal-800">
              <p className="font-semibold">Magnesium Normal (1.7–2.5 mg/dL)</p>
              <p className="text-sm">Tidak diperlukan koreksi magnesium.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Elektro() {
  const [tab, setTab] = useState<Tab>('na')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">ElektroCorr</h1>
        <p className="text-sm text-slate-500 mt-1">Koreksi Elektrolit — Na · K · Ca · Mg</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        {tab === 'na' && <NaPanel />}
        {tab === 'k' && <KPanel />}
        {tab === 'ca' && <CaPanel />}
        {tab === 'mg' && <MgPanel />}
      </div>
    </div>
  )
}
