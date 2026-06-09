import { useState } from 'react'

type Condition = 'hfnc' | 'niv' | 'ards' | 'ppok' | 'asma' | 'pneumonia' | 'sepsis' | 'edemaparu' | 'postop' | 'gbs'

interface ParamRow { param: string; value: string; note?: string }
interface Condition_ { id: Condition; label: string; color: string; rows: ParamRow[]; alerts?: string[]; extras?: string[] }

const CONDITIONS: Condition_[] = [
  {
    id: 'hfnc', label: 'HFNC', color: 'blue',
    rows: [
      { param: 'Flow', value: '40–60 L/mnt', note: 'Mulai 30–40, titrasi tiap 5–10 mnt' },
      { param: 'FiO₂', value: 'Titrasi ke SpO₂ 92–96%', note: 'Target SpO₂ — bukan FiO₂ absolut' },
      { param: 'Suhu', value: '37°C', note: 'Turunkan ke 34°C jika intoleran' },
      { param: 'ROX Index', value: '(SpO₂/FiO₂) / RR', note: 'Ukur jam ke-2, 6, 12. ROX <3.85 → risiko intubasi tinggi' },
    ],
    alerts: [
      'Indikasi: Gagal napas hipoksemik akut (Tipe I), post-ekstubasi profilaksis, pre-oksigenasi',
      'KI: Henti napas, tidak mampu lindungi jalan napas, trauma wajah berat',
    ],
  },
  {
    id: 'niv', label: 'NIV/BiPAP', color: 'blue',
    rows: [
      { param: 'IPAP', value: '10–12 cmH₂O', note: 'Naikan 2 cmH₂O tiap 5–10 mnt sesuai toleransi' },
      { param: 'EPAP', value: '5–8 cmH₂O', note: 'PPOK: 4–5 cmH₂O (≈80% auto-PEEP)' },
      { param: 'FiO₂', value: 'Titrasi ke target SpO₂', note: 'PPOK: target SpO₂ 88–92%; Edema paru: 92–96%' },
      { param: 'Evaluasi', value: '1–2 jam', note: 'Jika tidak membaik → Segera Intubasi' },
    ],
    alerts: [
      'Indikasi utama: Eksaserbasi PPOK hiperkapnik, Edema Paru Kardiogenik akut',
      'KI: Apnea, syok, sekresi napas banyak, operasi GI atas, kesadaran menurun berat',
    ],
  },
  {
    id: 'ards', label: 'ARDS', color: 'red',
    rows: [
      { param: 'Mode', value: 'VC-AC', note: 'Lebih terkontrol untuk VT & Pplat' },
      { param: 'VT', value: '4–6 mL/kg IBW', note: 'Mulai 6, turunkan ke 4 jika Pplat >28' },
      { param: 'RR', value: 'Mild: 14–20 · Moderate: 18–25 · Severe: 20–30 bpm' },
      { param: 'PEEP', value: 'Mild: 5–8 · Moderate: 8–13 · Severe: 13–18 cmH₂O', note: 'Titrasi dengan ARDSNet PEEP-FiO₂ table' },
      { param: 'Pplat', value: '≤30 cmH₂O MUTLAK · Target ≤28' },
      { param: 'Driving Pressure', value: 'Pplat − PEEP ≤15 cmH₂O', note: 'Target ≤13' },
      { param: 'FiO₂', value: 'Mild: ≤0.40 · Moderate: 0.40–0.70 · Severe: 0.70–1.0' },
      { param: 'SpO₂ target', value: '88–95%', note: 'Hindari hiperoksia' },
      { param: 'PaCO₂ target', value: 'Mild: 35–50 · Moderate: 40–55 · Severe: 45–65 mmHg', note: 'Permissive hypercapnia OK jika pH >7.20' },
      { param: 'pH minimal', value: '>7.20' },
    ],
    alerts: [
      'Prone position: P/F <150 + FiO₂ ≥0.6 >12 jam → Prone 16 jam/hari',
      'NMB: Cisatrakurium 48 jam jika P/F <120 dengan sedasi dalam',
    ],
  },
  {
    id: 'ppok', label: 'PPOK', color: 'amber',
    rows: [
      { param: 'Mode', value: 'VC-AC atau PC-AC', note: 'VC lebih mudah monitor VT & Pplat' },
      { param: 'VT', value: '6–8 mL/kg IBW', note: 'Lebih tinggi dari ARDS — paru obstruktif' },
      { param: 'RR', value: '10–14 bpm', note: '⚠ RENDAH — waktu ekspirasi panjang wajib' },
      { param: 'I:E ratio', value: '1:3 sampai 1:5', note: 'Ekspirasi panjang → cegah air trapping' },
      { param: 'PEEP', value: '5–8 cmH₂O', note: '≈ 75–85% auto-PEEP terukur' },
      { param: 'FiO₂', value: 'Titrasi ke SpO₂ 88–92%', note: '⚠ JANGAN normalisasi → hilangkan hypoxic drive' },
      { param: 'PaCO₂ target', value: 'Baseline pasien', note: 'Koreksi bertahap! Alkalosis post-hiperkapni berbahaya' },
      { param: 'Flow rate', value: '60–80 L/mnt', note: 'Flow tinggi → I:E lebih baik; kurangi WOB' },
    ],
    alerts: ['Auto-PEEP >10 cmH₂O → risiko hemodinamik signifikan'],
  },
  {
    id: 'asma', label: 'Asma Berat', color: 'amber',
    rows: [
      { param: 'Mode', value: 'VC-AC', note: 'Kontrol VT; PC sulit karena resistensi berubah' },
      { param: 'VT', value: '6–8 mL/kg IBW', note: 'Monitor Pplat <30 cmH₂O ketat' },
      { param: 'RR', value: '8–12 bpm', note: '⚠ SANGAT LAMBAT — ekspirasi minimal 4–5 detik' },
      { param: 'I:E ratio', value: '1:4 sampai 1:5' },
      { param: 'PEEP', value: '0–5 cmH₂O', note: 'PEEP rendah/0 — auto-PEEP sudah ada' },
      { param: 'FiO₂', value: '1.0 awal → titrasi', note: 'Target SpO₂ 94–98%' },
      { param: 'PaCO₂', value: '45–70 mmHg', note: 'Permissive hypercapnia — pH >7.20 dapat diterima' },
      { param: 'Sedasi', value: 'Ketamin 1–2 mg/kg/jam', note: 'Bronkodilator + sedasi; hindari histamin-releaser' },
    ],
    extras: ['Bronkodilator adjuvant: Salbutamol inline nebulisasi · Ipratropium · MgSO₄ 2g IV 20 mnt · Aminofilin · Helioks (He:O₂ 70:30)'],
  },
  {
    id: 'pneumonia', label: 'Pneumonia', color: 'teal',
    rows: [
      { param: 'Mode', value: 'VC-AC atau PC-AC' },
      { param: 'VT', value: '6–8 mL/kg IBW', note: 'Lung-protective; turunkan ke 4–6 jika P/F <200' },
      { param: 'PEEP', value: '5–10 cmH₂O', note: 'Titrasi SpO₂; hindari overdistensi' },
      { param: 'RR', value: '16–22 bpm', note: 'Sesuai kebutuhan asidosis' },
      { param: 'FiO₂', value: 'Titrasi ke SpO₂ 92–96%', note: 'Hindari hiperoksia kronis' },
      { param: 'Pplat', value: '<30 cmH₂O', note: 'Jika ARDS concurrent → turunkan VT' },
    ],
    extras: [
      'VAP Bundle: HOB 30–45° · Oral hygiene CHX 0.12% tiap 6–8 jam · SAT + SBT harian · Cuff pressure 20–30 cmH₂O · Subglottic suction · DVT + stress ulcer profilaksis',
    ],
  },
  {
    id: 'sepsis', label: 'Syok Septik', color: 'red',
    rows: [
      { param: 'VT', value: '6 mL/kg IBW', note: 'ARDS protocol jika P/F <300' },
      { param: 'PEEP', value: '8–12 cmH₂O' },
      { param: 'FiO₂', value: '1.0 awal → titrasi ke SpO₂ 92–96%' },
      { param: 'RR', value: '20–25 bpm', note: 'Hindari alkalosis respiratorik' },
    ],
    alerts: [
      'Timing intubasi: RR >35, SpO₂ <90% pada FiO₂ tinggi, penggunaan otot aksesori, kesadaran menurun',
      'Induksi pilihan: Ketamin 1–1.5 mg/kg IV. Siapkan norepinefrin sebelum intubasi.',
    ],
  },
  {
    id: 'edemaparu', label: 'Edema Paru', color: 'purple',
    rows: [
      { param: 'NIV Awal', value: 'CPAP 8–10 atau BiPAP IPAP 14–18 / EPAP 6–8 cmH₂O', note: 'Menurunkan preload + afterload' },
      { param: 'VT (jika intubasi)', value: '6–8 mL/kg IBW' },
      { param: 'PEEP', value: '8–12 cmH₂O', note: 'Jika NIV gagal, aritmia, penurunan kesadaran, syok' },
      { param: 'FiO₂', value: 'Titrasi ke SpO₂ 92–96%', note: 'Hiperoksia → ↑ afterload, vasokonstriksi koroner' },
      { param: 'RR', value: '16–20 bpm', note: 'Normocapnia kecuali ada komorbid' },
    ],
  },
  {
    id: 'postop', label: 'Post-Op', color: 'teal',
    rows: [
      { param: 'Mode', value: 'SIMV-VC + PSV atau PC-AC', note: 'Transisi ke PSV untuk weaning bertahap' },
      { param: 'VT', value: '6–8 mL/kg IBW', note: 'Lung-protective meski paru normal' },
      { param: 'PEEP', value: '5–8 cmH₂O', note: 'Cegah atelektasis post-anestesi' },
      { param: 'RR', value: '12–16 bpm', note: 'Kurangi bertahap saat PS meningkat' },
      { param: 'Rekruitmen', value: 'Staircase 20/30/40 cmH₂O × 30 detik', note: 'Pada atelektasis masif post-op' },
      { param: 'Target ekstubasi', value: '4–8 jam post-op kardiak elektif' },
    ],
  },
  {
    id: 'gbs', label: 'GBS / MG', color: 'purple',
    rows: [
      { param: 'Mode', value: 'VC-AC atau SIMV-VC + PSV' },
      { param: 'VT', value: '10–12 mL/kg IBW', note: 'Lebih tinggi — paru normal, otot lemah' },
      { param: 'RR', value: '12–16 bpm' },
      { param: 'PEEP', value: '5 cmH₂O' },
      { param: 'FiO₂', value: 'Titrasi ke SpO₂ ≥95%' },
    ],
    alerts: [
      'Indikasi intubasi (Rule of 20-30-40): VC <20 mL/kg · MIP/NIF < −30 cmH₂O · MEP <40 cmH₂O · Bulbar involvement',
      'Weaning sangat lambat. Pertimbangkan trakeostomi dini pada GBS berat.',
    ],
  },
]

const COLOR_CLS: Record<string, string> = {
  blue: 'border-blue-300 bg-blue-50',
  red: 'border-red-300 bg-red-50',
  amber: 'border-amber-300 bg-amber-50',
  teal: 'border-teal-300 bg-teal-50',
  purple: 'border-purple-300 bg-purple-50',
}
const LABEL_CLS: Record<string, string> = {
  blue: 'bg-blue-600', red: 'bg-red-600', amber: 'bg-amber-500', teal: 'bg-teal-600', purple: 'bg-purple-600',
}

export function Setting() {
  const [active, setActive] = useState<Condition>('ards')
  const cond = CONDITIONS.find(c => c.id === active)!

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Setting Ventilator</h1>
        <p className="text-sm text-slate-500 mt-1">Parameter per kondisi klinis · ARDS · PPOK · Asma · Sepsis · Post-Op · GBS</p>
      </div>

      {/* Condition selector */}
      <div className="flex flex-wrap gap-2">
        {CONDITIONS.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${active === c.id ? `${LABEL_CLS[c.color]} text-white` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Setting card */}
      <div className={`rounded-xl border-2 ${COLOR_CLS[cond.color]} p-5 space-y-4`}>
        <h2 className="text-lg font-bold text-slate-800">{cond.label}</h2>

        {cond.alerts && cond.alerts.map((a, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/70 border border-current border-opacity-30 text-sm text-slate-700">
            {a}
          </div>
        ))}

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-white/60">
              <th className="text-left px-3 py-2 font-semibold text-slate-600 w-1/3">Parameter</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Nilai Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {cond.rows.map((r, i) => (
              <tr key={i} className="bg-white/40">
                <td className="px-3 py-2 font-medium text-slate-700 align-top">{r.param}</td>
                <td className="px-3 py-2 align-top">
                  <span className="font-semibold text-slate-800">{r.value}</span>
                  {r.note && <span className="block text-xs text-slate-500 mt-0.5">{r.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cond.extras && cond.extras.map((e, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/70 border border-current border-opacity-20 text-sm text-slate-600">
            {e}
          </div>
        ))}
      </div>
    </div>
  )
}
