import { useState } from 'react'

/* ── RSBI Calculator ── */
function RsbiCalc() {
  const [rr, setRr] = useState('')
  const [vt, setVt] = useState('')
  const [ibw, setIbw] = useState('')
  const [mip, setMip] = useState('')
  const [mep, setMep] = useState('')
  const [peep, setPeep] = useState('')
  const [ps, setPs] = useState('')

  const rrV = parseFloat(rr), vtV = parseFloat(vt), ibwV = parseFloat(ibw)
  const mipV = parseFloat(mip), mepV = parseFloat(mep)

  const rsbi = !isNaN(rrV) && !isNaN(vtV) && vtV > 0 ? rrV / (vtV / 1000) : null
  const vtKg = !isNaN(vtV) && !isNaN(ibwV) && ibwV > 0 ? vtV / ibwV : null

  let rsbiInterp = '', rsbiColor = ''
  if (rsbi !== null) {
    if (rsbi < 80) { rsbiInterp = 'Baik — pertimbangkan ekstubasi jika kriteria lain terpenuhi'; rsbiColor = 'teal' }
    else if (rsbi < 105) { rsbiInterp = 'Borderline — SBT lebih panjang; evaluasi faktor penghambat'; rsbiColor = 'amber' }
    else { rsbiInterp = 'Buruk — weaning kemungkinan gagal; optimalkan kondisi'; rsbiColor = 'red' }
  }

  let mipInterp = '', mipColor = ''
  if (!isNaN(mipV)) {
    if (mipV <= -30) { mipInterp = 'Adekuat — kekuatan otot napas cukup'; mipColor = 'teal' }
    else if (mipV <= -20) { mipInterp = 'Borderline — evaluasi faktor lain'; mipColor = 'amber' }
    else { mipInterp = 'Lemah — risiko gagal ekstubasi tinggi'; mipColor = 'red' }
  }

  const colorBox = (c: string) => c === 'teal' ? 'bg-teal-50 border-teal-300 text-teal-800'
    : c === 'amber' ? 'bg-amber-50 border-amber-300 text-amber-800'
    : 'bg-red-50 border-red-300 text-red-800'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          RR Spontan (/mnt)
          <input type="number" className="input" value={rr} onChange={e => setRr(e.target.value)} placeholder="20" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          VT Spontan (mL)
          <input type="number" className="input" value={vt} onChange={e => setVt(e.target.value)} placeholder="400" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          IBW (kg)
          <input type="number" className="input" value={ibw} onChange={e => setIbw(e.target.value)} placeholder="60" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          MIP/NIF (cmH₂O)
          <input type="number" className="input" value={mip} onChange={e => setMip(e.target.value)} placeholder="-35" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          MEP (cmH₂O)
          <input type="number" className="input" value={mep} onChange={e => setMep(e.target.value)} placeholder="50" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          PEEP (cmH₂O)
          <input type="number" className="input" value={peep} onChange={e => setPeep(e.target.value)} placeholder="5" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          PS (cmH₂O)
          <input type="number" className="input" value={ps} onChange={e => setPs(e.target.value)} placeholder="5" />
        </label>
      </div>

      {rsbi !== null && (
        <div className={`p-4 rounded-xl border ${colorBox(rsbiColor)}`}>
          <p className="font-bold text-lg">RSBI: {rsbi.toFixed(1)} bpm/L</p>
          <p className="text-sm mt-1">{rsbiInterp}</p>
          {vtKg !== null && <p className="text-sm mt-1">VT/kg IBW: <strong>{vtKg.toFixed(1)} mL/kg</strong>{vtKg >= 5 ? ' ✓' : ' ⚠ <5 mL/kg'}</p>}
        </div>
      )}
      {!isNaN(mipV) && mipInterp && (
        <div className={`p-3 rounded-xl border ${colorBox(mipColor)}`}>
          <p className="font-semibold">MIP/NIF: {mipV} cmH₂O — {mipInterp}</p>
        </div>
      )}
      {!isNaN(mepV) && (
        <div className={`p-3 rounded-xl border ${mepV >= 40 ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
          <p className="font-semibold">MEP: {mepV} cmH₂O{mepV >= 40 ? ' ✓ Adekuat (≥40)' : ' ⚠ Rendah (<40 cmH₂O)'}</p>
          {mepV < 60 && <p className="text-xs mt-0.5">GBS/MG: target MEP ≥60 cmH₂O</p>}
        </div>
      )}

      {/* RSBI Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Nilai RSBI</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Interpretasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr className={rsbi !== null && rsbi < 80 ? 'bg-teal-50' : ''}>
              <td className="px-3 py-2 font-medium">&lt;80 bpm/L</td>
              <td className="px-3 py-2 text-teal-700">Baik — pertimbangkan ekstubasi jika kriteria lain terpenuhi</td>
            </tr>
            <tr className={rsbi !== null && rsbi >= 80 && rsbi < 105 ? 'bg-amber-50' : ''}>
              <td className="px-3 py-2 font-medium">80–105 bpm/L</td>
              <td className="px-3 py-2 text-amber-700">Borderline — SBT lebih panjang; evaluasi faktor penghambat</td>
            </tr>
            <tr className={rsbi !== null && rsbi >= 105 ? 'bg-red-50' : ''}>
              <td className="px-3 py-2 font-medium">&gt;105 bpm/L</td>
              <td className="px-3 py-2 text-red-700">Buruk — weaning kemungkinan gagal; optimalkan kondisi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Readiness Checklist ── */
const CLINICAL_CRITERIA = [
  'Penyebab gagal napas terkontrol / membaik',
  'FiO₂ ≤0.40 dengan SpO₂ ≥90% (atau P/F ≥150)',
  'PEEP ≤8 cmH₂O',
  'Hemodinamik stabil (tanpa vasopressor atau dosis rendah)',
  'pH ≥7.25',
  'Sadar cukup (RASS −1 hingga +1)',
  'Tidak dalam NMB aktif',
]
const STRENGTH_CRITERIA = [
  'RSBI <80 breaths/mnt/L',
  'VT spontan ≥5 mL/kg IBW',
  'MIP/NIF ≤ −25 cmH₂O (idealnya ≤ −30)',
  'MEP ≥40 cmH₂O (GBS/MG: ≥60)',
  'Batuk efektif — sekret dapat dikeluarkan',
  'Cuff leak test positif (risiko stridor post-ekstubasi)',
  'CAM-ICU negatif (tidak ada delirium aktif)',
]

function ReadinessChecklist() {
  const [clinical, setClinical] = useState<boolean[]>(new Array(CLINICAL_CRITERIA.length).fill(false))
  const [strength, setStrength] = useState<boolean[]>(new Array(STRENGTH_CRITERIA.length).fill(false))
  const toggle = (arr: boolean[], i: number, set: (a: boolean[]) => void) => {
    const next = [...arr]; next[i] = !next[i]; set(next)
  }
  const clinScore = clinical.filter(Boolean).length
  const strScore = strength.filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-slate-700 mb-2">Kriteria Klinis ({clinScore}/{CLINICAL_CRITERIA.length})</p>
          <ul className="space-y-2">
            {CLINICAL_CRITERIA.map((c, i) => (
              <li key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => toggle(clinical, i, setClinical)}>
                <span className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${clinical[i] ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'}`}>
                  {clinical[i] && '✓'}
                </span>
                <span className={`text-sm ${clinical[i] ? 'text-teal-700 line-through' : 'text-slate-700'}`}>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-2">Kriteria Kekuatan Napas ({strScore}/{STRENGTH_CRITERIA.length})</p>
          <ul className="space-y-2">
            {STRENGTH_CRITERIA.map((c, i) => (
              <li key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => toggle(strength, i, setStrength)}>
                <span className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${strength[i] ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'}`}>
                  {strength[i] && '✓'}
                </span>
                <span className={`text-sm ${strength[i] ? 'text-teal-700 line-through' : 'text-slate-700'}`}>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`p-3 rounded-xl text-sm font-semibold ${clinScore === CLINICAL_CRITERIA.length && strScore >= 5 ? 'bg-teal-50 border border-teal-300 text-teal-800' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
        {clinScore === CLINICAL_CRITERIA.length && strScore >= 5
          ? '✓ Kriteria terpenuhi — lanjutkan ke SBT'
          : `Klinis: ${clinScore}/${CLINICAL_CRITERIA.length} · Kekuatan: ${strScore}/${STRENGTH_CRITERIA.length} · Belum semua terpenuhi`}
      </div>
    </div>
  )
}

/* ── SBT & Extubation Protocol ── */
const SBT_STEPS = [
  { step: 1, title: 'Pilih Metode SBT', content: 'T-piece (tidak ada support) ATAU PSV 5–8 cmH₂O + PEEP 5. Durasi: 30–120 menit.' },
  { step: 2, title: 'Monitor Selama SBT', content: 'RR · SpO₂ · HR · TD · work of breathing · agitasi. Evaluasi tiap 15–30 mnt.' },
  { step: 3, title: 'Kriteria Lulus SBT', content: 'SpO₂ ≥90% · RR <35/mnt · HR ±20% baseline · TD ±20% · Tidak ada distress napas berat.' },
  { step: 4, title: 'Gagal SBT', content: 'Kembalikan ke ventilator support sebelumnya. Identifikasi penyebab. Ulangi SAT esok hari.' },
]
const EXT_STEPS = [
  { step: 1, title: 'Persiapan', content: 'Posisi head up 30–45°. Siapkan suction · spuit 10cc · sungkup oksigen · ambu bag · kit intubasi darurat.' },
  { step: 2, title: 'Premedikasi & Suction', content: 'Suction ETT · subglotis · oral. Jika risiko edema laring (cuff leak negatif): Dexamethasone 5 mg IV.' },
  { step: 3, title: 'Pelepasan ETT', content: 'Kempiskan cuff (deflasi total). Cabut ETT perlahan di akhir inspirasi. Instruksikan pasien tarik napas dalam.' },
  { step: 4, title: 'Stridor / Bronkospasme', content: 'Nebul Epinefrin 1 mg + 3 cc NaCl 0.9%, atau Salbutamol nebulizer. Monitor jalan napas ketat.' },
]
const POST_STEPS = [
  { step: 1, title: 'HFNC Preventif', content: 'Risiko tinggi (lansia, obesitas, PPOK, hiperkapnia): HFNC 40–60 L/mnt segera setelah ekstubasi.' },
  { step: 2, title: 'NIV Post-Ekstubasi', content: 'PPOK: NIV (BiPAP) profilaksis menurunkan re-intubasi. IPAP 14–16, EPAP 5–8.' },
  { step: 3, title: 'Tanda Gagal Ekstubasi', content: 'Takipnea menetap · retraksi · stridor berat refrakter · asidosis respiratorik memburuk → re-intubasi segera.' },
]

function Protocol({ title, steps, color }: { title: string; steps: typeof SBT_STEPS; color: string }) {
  const bg = color === 'blue' ? 'bg-blue-600' : color === 'teal' ? 'bg-teal-600' : 'bg-amber-500'
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <div className="space-y-2">
        {steps.map(s => (
          <div key={s.step} className="flex gap-3">
            <span className={`w-6 h-6 rounded-full ${bg} text-white text-xs flex items-center justify-center shrink-0 mt-0.5`}>{s.step}</span>
            <div>
              <p className="font-medium text-slate-700 text-sm">{s.title}</p>
              <p className="text-sm text-slate-600">{s.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const WEANING_BARRIERS = [
  { cat: 'Kardiovaskular', text: 'Gagal jantung kiri tersembunyi — periksa echo, BNP' },
  { cat: 'Psikologis', text: 'Ketergantungan ventilator · anxietas · ICU-acquired weakness' },
  { cat: 'Metabolik', text: 'Hipofosfatemia · hipomagnesemia · hipotiroid → ↓ kekuatan otot napas' },
  { cat: 'Neuromuskuler', text: 'VIDD (diaphragm dysfunction) · polineuropati ICU' },
  { cat: 'Sekret Berlebihan', text: 'Suction tidak adekuat · bronkospasme residual' },
  { cat: 'Delirium', text: 'CAM-ICU positif → tunda ekstubasi · atasi delirium terlebih dahulu' },
]

type Tab = 'kalkulator' | 'checklist' | 'protokol' | 'hambatan'

const TABS: { id: Tab; label: string }[] = [
  { id: 'kalkulator', label: 'RSBI & MIP' },
  { id: 'checklist', label: 'Readiness Checklist' },
  { id: 'protokol', label: 'SBT & Ekstubasi' },
  { id: 'hambatan', label: 'Faktor Penghambat' },
]

export function Weaning() {
  const [tab, setTab] = useState<Tab>('kalkulator')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Weaning & Ekstubasi</h1>
        <p className="text-sm text-slate-500 mt-1">RSBI · MIP · Readiness Checklist · Protokol SBT · Post-Ekstubasi</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        {tab === 'kalkulator' && <RsbiCalc />}
        {tab === 'checklist' && <ReadinessChecklist />}
        {tab === 'protokol' && (
          <div className="space-y-8">
            <Protocol title="Protokol SBT — Spontaneous Breathing Trial" steps={SBT_STEPS} color="blue" />
            <Protocol title="Prosedur Ekstubasi" steps={EXT_STEPS} color="teal" />
            <Protocol title="Manajemen Post-Ekstubasi" steps={POST_STEPS} color="amber" />
          </div>
        )}
        {tab === 'hambatan' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 mb-2">Faktor yang sering menyebabkan weaning sulit atau berkepanjangan:</p>
            {WEANING_BARRIERS.map((b, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-semibold text-amber-700 text-sm shrink-0 w-28">{b.cat}</span>
                <span className="text-sm text-slate-700">{b.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
