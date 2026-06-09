import { Accordion, InfoBox, SectionTable } from './parts'

export function Airway() {
  return (
    <div className="space-y-4">
      <InfoBox color="teal">
        <p className="font-bold mb-1">Framework 5 Pertanyaan — Jawab Sebelum Setiap Intubasi</p>
        <ol className="list-decimal list-inside space-y-0.5 mt-1">
          <li>Apakah intubasi benar-benar diperlukan?</li>
          <li>Apakah airway sulit?</li>
          <li>Bagaimana kondisi fisiologis pasien?</li>
          <li>Apa rencana utama?</li>
          <li>Apa rencana cadangan?</li>
        </ol>
      </InfoBox>

      <Accordion title="Pertanyaan 1 — Indikasi Intubasi (Walls, 6th ed. 2023)" defaultOpen>
        <SectionTable
          headers={['Indikasi', 'Contoh Klinis', 'Catatan']}
          rows={[
            ['Failure to maintain airway patency', 'GCS ≤8, stridor berat, angioedema progresif', 'Posisi lateral dulu jika ada refleks. Intubasi segera bila memburuk.'],
            ['Failure to protect airway', 'Gag reflex hilang, aspirasi aktif, muntah berulang', 'Bukan indikasi mutlak bila pasien masih bisa batuk efektif.'],
            ['Failure to ventilate', 'PaCO₂ ↑ progresif meski NIV, fatigue, pH <7.20', 'Trial NIV 1–2 jam pada PPOK (pH 7.25–7.35). Gagal → intubasi segera.'],
            ['Failure to oxygenate', 'SpO₂ <90% meski HFNC/NIV maks, P/F <100–150', 'P/F <150 dengan NIV tidak membaik 1–2 jam → intubasi.'],
            ['Anticipated deterioration', 'GBS VC <20 mL/kg, angioedema progresif, luka bakar wajah', 'Intubasi elektif jauh lebih aman dari emergensi.'],
          ]}
        />
        <SectionTable
          headers={['Kondisi', 'Alternatif Pertama', 'Batas Trial']}
          rows={[
            ['SpO₂ 90–95%, usaha napas sedang', 'HFNC 40–60 L/mnt, FiO₂ 0.6–1.0', '1–2 jam; evaluasi ROX index (≥4.88 = baik)'],
            ['PPOK eksaserbasi, pH 7.25–7.35', 'NIV BiPAP (IPAP 14–18, EPAP 4–6)', '1–2 jam; pH tidak membaik → intubasi'],
            ['Edema paru kardiogenik', 'NIV CPAP 5–10 cmH₂O atau BiPAP', '30–60 mnt; SpO₂ <88% persisten → intubasi'],
            ['Imunokompromis + infiltrat paru', 'HFNC atau NIV (hindari intubasi)', 'Ketat — mortalitas tinggi bila terintubasi'],
          ]}
        />
      </Accordion>

      <Accordion title="Pertanyaan 2 — Airway Sulit? (LEMON Assessment)">
        <SectionTable
          headers={['Huruf', 'Kriteria', 'Cara Penilaian', 'Prediksi Sulit Bila...']}
          rows={[
            ['L', 'Look externally', 'Amati wajah, leher, mulut, proporsi tubuh', 'Trauma wajah/leher, obesitas morbid (BMI >40), leher pendek/tebal, trismus'],
            ['E', 'Evaluate 3-3-2 rule', 'Jarak interincisor / chin-to-hyoid / thyroid-to-mouth floor (dalam lebar jari)', '<3 jari interincisor · <3 jari chin-to-hyoid · <2 jari thyroid-to-mouth'],
            ['M', 'Mallampati score', 'Duduk, buka mulut maks, lidah menjulur tanpa fonasi', 'Kelas III atau IV'],
            ['O', 'Obstruction / Obesity', 'Inspeksi, palpasi, auskultasi leher. Tanya riwayat stridor.', 'Abses, angioedema, epiglottitis, stridor, BMI >40'],
            ['N', 'Neck mobility', 'Fleksi + ekstensi maksimal. Normal: ekstensi 35°+', 'Rigid, spondylosis servikal, cervical collar, obesitas leher'],
          ]}
        />
        <SectionTable
          headers={['Mallampati', 'Struktur Terlihat', 'Implikasi']}
          rows={[
            ['Kelas I', 'Uvula, tonsil, palatum mole & durum penuh', 'Mudah — CL Grade I/II hampir pasti'],
            ['Kelas II', 'Uvula, palatum moe & durum; tonsil tertutup sebagian', 'Umumnya mudah'],
            ['Kelas III', 'Hanya dasar uvula dan palatum mole', 'Kemungkinan sulit — pertimbangkan VL atau bougie'],
            ['Kelas IV', 'Hanya palatum durum; uvula tidak terlihat', 'Diprediksi sulit — VL atau awake intubation'],
          ]}
        />
        <SectionTable
          headers={['Jumlah Kriteria LEMON Positif', 'Strategi']}
          rows={[
            ['0–1 positif', 'Airway mudah — DL atau VL sesuai ketersediaan'],
            ['2–3 positif', 'Airway sulit — VL sebagai pilihan utama, siapkan bougie + backup SGA'],
            ['4–5 positif', 'Airway sangat sulit — awake intubation, alert anestesi, siapkan surgical airway'],
          ]}
        />
      </Accordion>

      <Accordion title="Pertanyaan 3 — Optimasi Fisiologis Pra-Intubasi">
        <InfoBox color="amber">
          <strong>⚠️ The Physiologically Difficult Airway</strong> — Pasien dengan cadangan fisiologis terbatas berisiko kardiovaskular kolaps pasca induksi. Identifikasi dan optimasi SEBELUM memberikan obat.
        </InfoBox>
        <SectionTable
          headers={['Domain', 'Masalah', 'Optimasi Sebelum Intubasi']}
          rows={[
            ['Oksigenasi', 'SpO₂ <93% baseline', 'Head up 20–25° · NIV BiPAP/CPAP (superior vs HFNC — FLORALI-2) · HFNC 60 L/mnt FiO₂ 100% bila NIV tidak toleran · Apneic oxygenation: nasal kanul 15 L/mnt selama laryngoskopi'],
            ['Hemodinamik', 'MAP <65 mmHg', 'Push-dose epinefrin 10–20 mcg IV bolus tiap 2–5 mnt · Push-dose efedrin 5–10 mg IV · Norepinefrin 0.1–0.3 mcg/kg/mnt sebelum induksi · Bolus cairan 250–500 mL bila hypovolemia nyata'],
            ['Metabolik', 'pH <7.1 + PaCO₂ <35 (asidosis metabolik terkompensasi)', 'NaHCO₃ 100 mEq IV slow infusion · Pasca intubasi: pertahankan minute ventilation — jangan biarkan RR turun mendadak'],
          ]}
        />
        <InfoBox color="red">
          <strong>⚠️ Jangan mengintubasi pasien hipotensi yang belum diresusitasi.</strong> Induksi menghilangkan tonus simpatis → vasodilatasi masif → cardiac arrest pada cadangan rendah. Mulai vasopressor atau berikan bolus cairan dahulu.
        </InfoBox>
      </Accordion>

      <Accordion title="Pertanyaan 4 — Rencana Utama (RSI & Teknik)">
        <SectionTable
          headers={['Elemen', 'Pertimbangan & Rekomendasi']}
          rows={[
            ['Operator', 'Siapa dengan first-pass success rate tertinggi? Operator senior memimpin.'],
            ['Teknik laryngoskopi', 'Video laryngoscopy (VL) sebagai default — meta-analisis (Araújo et al. Critical Care 2024): first-pass success lebih tinggi vs DL di ICU. DL bila VL tidak tersedia.'],
            ['Posisi pasien', 'Ear-to-sternal-notch alignment. Obesitas: ramping position. Head up 20–25°.'],
            ['Teknik RSI', 'Fentanyl 1–3 mcg/kg IV → (Ketamine 1–2 mg/kg atau Etomidate 0.3 mg/kg) → Suksinilkolin 1.5 mg/kg atau Rocuronium 1.2 mg/kg. Awake intubation bila predicted very difficult airway.'],
            ['Equipment', 'Laryngoscope · ETT 7.0–8.0 (♂) / 6.5–7.5 (♀) · Stylet/bougie SELALU siap · BVM + PEEP valve · Suction aktif · ETCO₂ + capnografi'],
          ]}
        />
        <InfoBox color="teal">
          <strong>First-pass success &gt;95%</strong> dikaitkan dengan penurunan mortalitas in-hospital. Setiap attempt tambahan meningkatkan risiko: desaturasi, trauma, edema, cardiac arrest.
        </InfoBox>
      </Accordion>

      <Accordion title="Pertanyaan 5 — Rencana Cadangan (Failed Airway & CICO)">
        <InfoBox color="red">
          <p className="font-bold">Failed Airway = salah satu kondisi:</p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>≥3 usaha intubasi oleh operator terbaik, ATAU</li>
            <li>SpO₂ &lt;90% dan tidak bisa dipertahankan, ATAU</li>
            <li><strong>CICO</strong> — Cannot Intubate, Cannot Oxygenate</li>
          </ul>
        </InfoBox>
        <SectionTable
          headers={['Plan', 'Tindakan', 'Detail']}
          rows={[
            ['Plan A', 'Intubasi trakea via oral (DL atau VL)', 'Maks 3 attempt. Gunakan bougie sejak attempt ke-2 bila CL III–IV.'],
            ['Plan B', 'Supraglottic Airway (SGA)', 'LMA, i-gel — rescue oxygenation. Jembatan kritis, bukan solusi definitif.'],
            ['Plan C', 'Face mask ventilation + BVM', 'Kembali ke ventilasi dasar. Pertahankan oksigenasi sementara eskalasi dipanggil.'],
            ['Plan D', 'Emergency Front-of-Neck Airway (eFONA)', 'Scalpel-finger-bougie cricothyrotomy. Tindakan definitif pada CICO. Jangan tunda.'],
          ]}
        />
        <InfoBox color="amber">
          <strong>⚠️ Narrow-bore cannula (14G) TIDAK lagi direkomendasikan</strong> sebagai Plan D — DAS 2025: failure rate ~60%. <strong>Surgical eFONA (scalpel-bougie) = standar saat ini.</strong>
        </InfoBox>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Langkah eFONA (Scalpel-Finger-Bougie)</p>
          <ol className="space-y-0.5 text-slate-600 list-decimal list-inside">
            <li><strong>Declare CICO</strong> secara verbal kepada tim</li>
            <li><strong>Call for help</strong> — hubungi anestesi/bedah. Pertahankan SGA sementara.</li>
            <li><strong>Identifikasi membran krikotiroid</strong> — palpasi: kartilago tiroid → membran → kartilago krikoid</li>
            <li><strong>Insisi horizontal</strong> 1–1.5 cm dengan scalpel #10</li>
            <li><strong>Finger entry</strong> — masukkan jari, perlebar lumen, konfirmasi posisi</li>
            <li><strong>Bougie masuk</strong> — arahkan ke bawah (trakea distal). Sentuh tracheal rings.</li>
            <li><strong>ETT 6.0 cuff</strong> melalui bougie. Kembangkan cuff. Konfirmasi ETCO₂ + auskultasi.</li>
          </ol>
        </div>
      </Accordion>
    </div>
  )
}
