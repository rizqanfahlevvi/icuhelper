import { Accordion, InfoBox, SectionTable } from './parts'

export function Impending() {
  return (
    <div className="space-y-4">
      <InfoBox color="red">
        <p className="font-bold mb-1">Impending Respiratory Failure — Window 30–60 Menit</p>
        <p>Kenali tanda sebelum dekompensasi. Intervensi dini menghindari intubasi emergensi.</p>
      </InfoBox>

      <Accordion title="Tanda Klinis Impending Gagal Napas" defaultOpen>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-slate-700 mb-2">Tanda Klinis Utama</p>
            <ul className="space-y-1 text-slate-600">
              <li>• RR &gt;30 atau &lt;8 /mnt</li>
              <li>• Penggunaan otot aksesori (SCM, intercostal)</li>
              <li>• Pernapasan paradoks (dada naik, perut turun)</li>
              <li>• Retraksi suprasternal / interkostal</li>
              <li>• Posisi tripod — duduk condong ke depan</li>
              <li>• Sianosis sentral</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-2">Tanda Neurologis / Sistemik</p>
            <ul className="space-y-1 text-slate-600">
              <li>• Agitasi atau konfusi mendadak</li>
              <li>• Diaforesis (berkeringat berlebihan)</li>
              <li>• Takikardia kompensatorik</li>
              <li>• Pulsus paradoksus &gt;10 mmHg</li>
              <li>• SpO₂ &lt;90% pada O₂ aliran tinggi</li>
              <li>• Suara napas menurun / menghilang</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="HACOR Score — Prediksi Kegagalan NIV">
        <SectionTable
          headers={['Parameter', 'Nilai', 'Skor']}
          rows={[
            ['Heart Rate (bpm)', '≤120 / 121–150 / >150', '0 / 1 / 2'],
            ['Acidosis (pH)', '≥7.35 / 7.25–7.34 / <7.25', '0 / 2 / 4'],
            ['Consciousness (GCS)', '15 / 13–14 / 11–12 / ≤10', '0 / 1 / 3 / 5'],
            ['Oxygenation (P/F)', '≥201 / 101–200 / ≤100', '0 / 1 / 2'],
            ['Respiratory Rate', '≤30 / 31–40 / >40', '0 / 1 / 2'],
          ]}
        />
        <InfoBox color="teal">Skor 0–4: NIV kemungkinan berhasil · Skor ≥5: risiko kegagalan NIV tinggi → pertimbangkan intubasi dini</InfoBox>
      </Accordion>

      <Accordion title="ROX Index — Prediksi Kegagalan HFNC">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center mb-3">
          <p className="font-bold text-lg text-teal-700">ROX = (SpO₂ / FiO₂) / RR</p>
          <p className="text-xs text-slate-500 mt-1">Ukur pada jam ke-2, 6, dan 12</p>
        </div>
        <SectionTable
          headers={['Nilai ROX', 'Risiko Kegagalan HFNC', 'Tindakan']}
          rows={[
            ['≥4.88', 'Rendah', 'Lanjutkan HFNC, pantau'],
            ['3.85–4.87', 'Sedang', 'Monitor ketat tiap 1–2 jam'],
            ['2.85–3.84', 'Tinggi', 'Pertimbangkan intubasi dini'],
            ['<2.85', 'Sangat tinggi', 'Intubasi segera — jangan tunda'],
          ]}
        />
      </Accordion>

      <Accordion title="Algoritma NIV vs HFNC vs Intubasi Segera">
        <SectionTable
          headers={['Modalitas', 'Indikasi Utama', 'Setting Awal', 'Kontraindikasi']}
          rows={[
            ['HFNC', 'Gagal napas hipoksemik akut (Tipe I), P/F 200–300, SpO₂ <94% pada kanul biasa', 'Flow 40–60 L/mnt, FiO₂ titrasi, suhu 37°C', 'Apnea, tidak dapat melindungi jalan napas, kesadaran sangat menurun'],
            ['NIV BiPAP', 'PPOK eksaserbasi (Tipe II), edema paru kardiogenik, post-ekstubasi PPOK', 'IPAP 10–12, EPAP 5–8, FiO₂ titrasi', 'Apnea, syok, sekresi masif, GI atas baru, fraktur wajah'],
            ['Intubasi Segera', 'HACOR ≥5, ROX <2.85, NIV/HFNC gagal 1–2 jam, GCS ≤8, syok, henti napas', 'RSI dengan induksi sesuai kondisi', '—'],
          ]}
        />
      </Accordion>
    </div>
  )
}
