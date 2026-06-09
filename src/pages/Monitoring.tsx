const DOPE = [
  {
    letter: 'D', title: 'Displacement', color: 'red',
    items: [
      'ETT keluar atau masuk bronkus kanan',
      'Cek suara napas bilateral',
      'Konfirmasi posisi ETT di CXR (tip T2–T3)',
      'Kedalaman oral ≈ TB (cm) / 10 + 4',
    ],
  },
  {
    letter: 'O', title: 'Obstruction', color: 'amber',
    items: [
      'Sekret, bite block tidak terpasang, kinking ETT',
      'SpO₂ ↓ · PIP ↑ · VT ↓',
      'Suction in-line; cek sirkuit',
      'Jika buntu total: lepas ETT → BVM manual',
    ],
  },
  {
    letter: 'P', title: 'Pneumothorax', color: 'purple',
    items: [
      'SpO₂ drop mendadak + TD drop',
      'Suara napas menghilang unilateral',
      'PIP ↑↑ · deviasi trakea (tension)',
      '⚡ Jarum dekompresi ICS 2 MCL segera',
    ],
  },
  {
    letter: 'E', title: 'Equipment', color: 'teal',
    items: [
      'Sirkuit bocor · humidifier mati',
      'Ventilator malfunction / listrik padam',
      'Cek semua koneksi sirkuit',
      'Backup: BVM selalu di sisi tempat tidur',
    ],
  },
]

const TARGET_ROWS = [
  { cond: 'Normal / Post-op', ph: '7.35–7.45', pao2: '80–100', paco2: '35–45', spo2: '94–98%', pplat: '<25' },
  { cond: 'ARDS Mild', ph: '7.30–7.45', pao2: '55–80', paco2: '35–50 (perm)', spo2: '88–95%', pplat: '<30' },
  { cond: 'ARDS Moderate-Severe', ph: '>7.20', pao2: '55–80', paco2: '45–65 (perm)', spo2: '88–95%', pplat: '≤28' },
  { cond: 'PPOK Eksaserbasi', ph: '7.25–7.40', pao2: '55–70', paco2: 'Baseline ↑ (perm)', spo2: '88–92%', pplat: '<30' },
  { cond: 'Asma Berat', ph: '>7.20', pao2: '60–90', paco2: '45–70 (perm)', spo2: '94–98%', pplat: '<30' },
  { cond: 'Sepsis / Pneumonia', ph: '7.30–7.45', pao2: '60–100', paco2: '35–50', spo2: '92–96%', pplat: '<30' },
  { cond: 'GBS / MG', ph: '7.35–7.45', pao2: '80–100', paco2: '35–45', spo2: '≥95%', pplat: '<28' },
  { cond: 'Edema Paru Kardiogenik', ph: '7.35–7.45', pao2: '70–100', paco2: '35–45', spo2: '92–96%', pplat: '<25' },
]

const COMPLICATIONS = [
  {
    title: 'VILI — Ventilator Induced Lung Injury', color: 'red',
    mechanism: 'Volutrauma · Barotrauma · Atelectrauma · Biotrauma',
    prevention: 'VT 6 mL/kg IBW · Pplat ≤30 · Driving pressure ≤15 · PEEP titrasi optimal',
  },
  {
    title: 'VAP — Ventilator-Associated Pneumonia', color: 'amber',
    mechanism: 'Pneumonia >48 jam setelah intubasi, mikroaspirasi sekret oral/gastrik',
    prevention: 'Bundle: HOB 30° · Oral CHX · SAT+SBT harian · Cuff pressure 20–30 cmH₂O',
  },
  {
    title: 'VIDD — Diaphragm Dysfunction', color: 'purple',
    mechanism: 'Controlled ventilation → disuse atrophy diafragma dalam 18–69 jam pertama',
    prevention: 'Preserve spontaneous breathing · Hindari deep sedation lama · Gunakan PSV mode',
  },
]

const DOPE_BG: Record<string, string> = {
  red: 'bg-red-50 border-red-300', amber: 'bg-amber-50 border-amber-300',
  purple: 'bg-purple-50 border-purple-300', teal: 'bg-teal-50 border-teal-300',
}
const DOPE_BADGE: Record<string, string> = {
  red: 'bg-red-600', amber: 'bg-amber-500', purple: 'bg-purple-600', teal: 'bg-teal-600',
}
const COMP_BG: Record<string, string> = {
  red: 'border-red-200 bg-red-50', amber: 'border-amber-200 bg-amber-50', purple: 'border-purple-200 bg-purple-50',
}

export function Monitoring() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">Troubleshooting · Target Parameter · Komplikasi · Waveform</p>
      </div>

      {/* DOPE */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Troubleshooting Cepat — DOPE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOPE.map(d => (
            <div key={d.letter} className={`rounded-xl border p-4 ${DOPE_BG[d.color]}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${DOPE_BADGE[d.color]}`}>{d.letter}</span>
                <span className="font-semibold text-slate-800">{d.title}</span>
              </div>
              <ul className="space-y-1 text-sm text-slate-700">
                {d.items.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Target Parameters Table */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Target Parameter per Kondisi</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-100">
              <tr>
                {['Kondisi', 'pH', 'PaO₂', 'PaCO₂', 'SpO₂', 'Pplat'].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {TARGET_ROWS.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-700">{r.cond}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.ph}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.pao2}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.paco2}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.spo2}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{r.pplat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-1">perm = permissive hypercapnia diterima</p>
      </section>

      {/* Complications */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Komplikasi Ventilasi Mekanik</h2>
        <div className="space-y-3">
          {COMPLICATIONS.map((c, i) => (
            <div key={i} className={`rounded-xl border p-4 ${COMP_BG[c.color]}`}>
              <p className="font-semibold text-slate-800 mb-2">{c.title}</p>
              <p className="text-sm text-slate-600"><span className="font-medium">Mekanisme:</span> {c.mechanism}</p>
              <p className="text-sm text-slate-600 mt-1"><span className="font-medium">Pencegahan:</span> {c.prevention}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waveform tips */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Monitoring Waveform & Loop</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-700 mb-2">Deteksi Auto-PEEP</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Flow-time: garis ekspirasi tidak kembali ke nol sebelum napas berikutnya</li>
              <li>• Expiratory hold 0.5–1 dtk: baca auto-PEEP dari display</li>
              <li>• Klinis: PIP ↑, TD drop, sinkronisasi buruk</li>
              <li>• Aksi: ↓ RR · ↓ I:E (perpanjang ekspirasi) · ↑ flow rate · bronkodilator</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-700 mb-2">P-V Loop Abnormal</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• <span className="font-medium">Upper inflection point:</span> Overdistensi → turunkan VT/Pplat</li>
              <li>• <span className="font-medium">Lower inflection point:</span> Atelektasis → naikkan PEEP di atas LIP</li>
              <li>• <span className="font-medium">Penduluft:</span> Alveoli buka-tutup siklik → ubah PEEP</li>
              <li>• <span className="font-medium">Beaked loop:</span> Air trapping/auto-PEEP (asma/PPOK)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
