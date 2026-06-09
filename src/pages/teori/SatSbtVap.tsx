import { Accordion, InfoBox, SectionTable } from './parts'

export function SatSbtVap() {
  return (
    <div className="space-y-4">
      <InfoBox color="teal">
        <p className="font-bold mb-1">ABCDEF Bundle — ICU Liberation</p>
        <p>Pendekatan terstruktur mencegah komplikasi IMV: delirium, kelemahan otot, ICU-acquired weakness, ketergantungan ventilator.</p>
      </InfoBox>

      <Accordion title="ABCDEF Bundle" defaultOpen>
        <SectionTable
          headers={['Huruf', 'Komponen', 'Tujuan Utama']}
          rows={[
            ['A', 'Assess & manage Pain', 'CPOT ≤2 atau NRS ≤3; analgesia dulu sebelum sedasi (analgesia-first)'],
            ['B', 'Both SAT + SBT (koordinasi)', 'Minimalkan sedasi · percepat weaning · kurangi ventilator-days'],
            ['C', 'Choice of analgesia & sedation', 'Target RASS −1 sampai 0; pilih dexmedetomidine atau propofol; hindari benzodiazepin'],
            ['D', 'Assess, prevent & manage Delirium', 'CAM-ICU atau ICDSC 2× sehari; mobilisasi awal; pertahankan siklus siang-malam'],
            ['E', 'Early mobility & Exercise', 'Fisioterapi aktif sejak hari ke-1–2; hindari tirah baring total'],
            ['F', 'Family engagement & empowerment', 'Libatkan keluarga dalam ronde; edukasi kondisi; dukungan psikososial'],
          ]}
        />
      </Accordion>

      <Accordion title="SAT — Spontaneous Awakening Trial (Daily Sedation Interruption)">
        <InfoBox>
          Over-sedasi dikaitkan dengan IMV lebih lama, delirium lebih tinggi, mortalitas meningkat. SAT terbukti mengurangi durasi ventilator 2–3 hari dan ICU LOS 3–4 hari (Kress JP, NEJM 2000).
        </InfoBox>
        <p className="font-semibold text-slate-700 mt-3 mb-1">Safety Screen SAT — SAT TIDAK dilakukan bila ada kondisi ini:</p>
        <SectionTable
          headers={['Kondisi (GAGAL Screen)', 'Alasan']}
          rows={[
            ['Kejang aktif atau baru dalam 24 jam', 'Sedasi dipertahankan — risiko rekurensi'],
            ['CIWA-Ar >10 (alcohol withdrawal)', 'Titrasi benzodiazepin tetap berlanjut'],
            ['Agitasi berat (RASS +3 atau +4)', 'Atasi agitasi dulu, nilai ulang'],
            ['Sedasi untuk indikasi khusus (ICP, status epileptikus)', 'Konsultasi SpAnestesi/SpSaraf'],
            ['NMB (paralitik) aktif', 'Tunggu NMB habis'],
            ['FiO₂ >70% atau PEEP >12 cmH₂O', 'Paru belum stabil; risiko desaturasi'],
            ['Vasopressor eskalasi aktif', 'Agitasi pasca interupsi memperburuk hemodinamik'],
          ]}
        />
        <div className="mt-3">
          <p className="font-semibold text-slate-700 mb-1">Cara Melakukan SAT</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Hentikan semua infus sedasi (propofol, midazolam, dexmedetomidine)</li>
            <li>Pertahankan analgesia (fentanyl/morfin) — jangan ikut dihentikan</li>
            <li>Amati pasien setiap 30 menit selama maks 4 jam</li>
            <li>Nilai apakah pasien lulus SAT</li>
            <li>Bila lulus → lanjutkan ke assessment SBT</li>
            <li>Bila gagal → restart sedasi di <strong>50% dosis sebelumnya</strong>, evaluasi ulang esok hari</li>
          </ol>
        </div>
        <SectionTable
          headers={['Perintah Sederhana (LULUS bila mengikuti ≥1)', 'Tanda GAGAL (hentikan SAT)']}
          rows={[
            ['Buka mata · Genggam tangan · Julurkan lidah · Lihat ke sisi tertentu', 'SpO₂ <88% · RASS ≥+3 · RR >35 persisten · Nyeri tidak terkontrol · Distres akut'],
          ]}
        />
        <InfoBox color="teal">ABC Trial (Girard TD, Lancet 2008): SAT → SBT terkoordinasi mengurangi mortalitas 28 hari (HR 0.68) vs SBT saja, tanpa peningkatan signifikan self-extubation berbahaya.</InfoBox>
      </Accordion>

      <Accordion title="SBT — Spontaneous Breathing Trial">
        <p className="text-slate-600 mb-3">SBT adalah uji pernapasan mandiri 30–120 menit dengan dukungan ventilator minimal. Lakukan setiap hari pada pasien yang memenuhi syarat.</p>
        <p className="font-semibold text-slate-700 mb-1">Safety Screen SBT — Semua harus terpenuhi:</p>
        <SectionTable
          headers={['Kriteria LOLOS', 'Catatan']}
          rows={[
            ['Penyebab gagal napas membaik atau teratasi', 'Penilaian klinis; tidak ada kelainan baru'],
            ['Hemodinamik stabil: MAP ≥65 tanpa eskalasi vasopressor', 'Vasopressor dosis stabil/rendah masih boleh'],
            ['SpO₂ ≥90% dengan FiO₂ ≤50% dan PEEP ≤8 cmH₂O', 'Kriteria paling penting — cadangan oksigenasi cukup'],
            ['Sedasi ringan atau lulus SAT (RASS −1 sampai +1)', 'Pasien harus dapat bernapas secara inisiatif sendiri'],
            ['Tidak ada bronkospasme aktif berat', 'Bronkodilator pre-SBT bila ada riwayat'],
            ['Tidak ada rencana operasi dalam 24 jam', 'Hindari ekstubasi pra-operatif tidak perlu'],
          ]}
        />
        <p className="font-semibold text-slate-700 mt-3 mb-1">Metode SBT</p>
        <SectionTable
          headers={['Metode', 'Setting', 'Kelebihan / Kekurangan']}
          rows={[
            ['T-piece', 'ETT ke sumber O₂ tanpa ventilator (CPAP 0 + PS 0)', 'Ujian paling murni. Tidak ada dukungan. Risiko kelelahan lebih cepat.'],
            ['PSV rendah (paling umum)', 'PS 5–8 cmH₂O + PEEP 5 cmH₂O', 'Mengatasi resistensi ETT (~4–6 cmH₂O). Lebih nyaman. Non-inferior vs T-piece (Burns, JAMA 2021).'],
            ['CPAP', 'CPAP 5 cmH₂O, PS 0', 'Alternatif tanpa inspiratory support.'],
          ]}
        />
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center my-3">
          <p className="font-bold text-lg text-blue-700">RSBI = f / VT (L)</p>
          <p className="text-xs text-slate-500 mt-1">f = frekuensi napas spontan (bpm) · VT dalam liter · Diukur awal SBT pada dukungan minimal</p>
        </div>
        <SectionTable
          headers={['RSBI', 'Interpretasi', 'Probabilitas Sukses']}
          rows={[
            ['<80', 'Sangat menguntungkan', 'Tinggi (~80–90%)'],
            ['80–105', 'Intermediate', 'Sedang — pertimbangkan klinis keseluruhan'],
            ['>105', 'Diprediksi gagal', 'Rendah; pertimbangkan tunda SBT'],
          ]}
        />
        <p className="font-semibold text-slate-700 mt-3 mb-1">Kriteria LULUS / GAGAL SBT</p>
        <SectionTable
          headers={['Parameter', 'Kriteria LULUS', 'Tanda GAGAL → hentikan']}
          rows={[
            ['SpO₂', '≥90% (atau PaO₂ ≥60 mmHg)', '<88% persisten'],
            ['Frekuensi napas', '<35 bpm stabil', '≥35 bpm >5 menit'],
            ['Heart rate', '<140 bpm, tanpa aritmia baru', 'Aritmia baru atau HR ≥140'],
            ['Tekanan darah', 'SBP 90–180 mmHg', 'SBP <90 atau >180 mmHg'],
            ['Usaha napas', 'Tidak ada paradoks', 'Otot aksesori berat, paradoks abdominal-thoraks'],
            ['Kesadaran', 'Tidak agitasi berat', 'RASS ≥+3 atau distres nyata'],
            ['pH arteri', '≥7.32', '<7.32 (bila diukur)'],
          ]}
        />
        <InfoBox color="amber">
          <strong>SBT Gagal ≠ Ekstubasi Gagal</strong> — Kembali ke mode ventilasi penuh, cari penyebab (nyeri, sekresi, bronkospasme, hipervolemia, neuromuskuler), ulangi SBT esok hari.
        </InfoBox>
      </Accordion>

      <Accordion title="Penilaian Kesiapan Ekstubasi (Pasca SBT Lulus)">
        <p className="text-slate-600 mb-2">Lulus SBT tidak otomatis siap ekstubasi. Nilai 4 domain:</p>
        <SectionTable
          headers={['Domain', 'Cara Penilaian', 'Pertimbangan']}
          rows={[
            ['1. Kemampuan batuk', 'Minta batuk kuat. Cough Peak Flow >60 L/mnt bila tersedia.', 'Batuk lemah → risiko retensi sekret → pertimbangkan extubation to HFNC'],
            ['2. Beban sekresi', 'Frekuensi suction dalam 2 jam terakhir, viskositas sekret.', 'Suction >4×/jam atau sekret sangat kental → tunda ekstubasi'],
            ['3. Status neurologis', 'Ikuti 4 perintah sederhana: buka mata, lihat, genggam, julurkan lidah.', 'GCS ≥8 minimal. Lebih disukai ≥10.'],
            ['4. Cuff Leak Test', 'Deflasikan cuff ETT; nilai kebocoran udara saat ventilasi.', 'Tidak ada leak → risiko edema subglotis post-ekstubasi → pertimbangkan steroid'],
          ]}
        />
        <InfoBox color="teal">
          <strong>Ekstubasi ke HFNC</strong> pada risiko tinggi re-intubasi (COPD, CHF, usia &gt;65, RSBI borderline) — superior dibandingkan O₂ konvensional (Hernández G, JAMA 2016). NIV post-ekstubasi untuk COPD juga terbukti efektif (Ferrer M, Lancet 2009).
        </InfoBox>
      </Accordion>

      <Accordion title="VAP — Ventilator-Associated Pneumonia">
        <InfoBox color="red">
          VAP = pneumonia ≥48 jam setelah intubasi. Insiden: 6–52% pasien IMV. Attributable mortality: 13–25%. Memperpanjang ICU LOS rata-rata 6–10 hari. <strong>Sebagian besar dapat dicegah.</strong>
        </InfoBox>
        <p className="font-semibold text-slate-700 mt-3 mb-1">Kriteria Diagnosis VAP (CDC/NHSN)</p>
        <SectionTable
          headers={['Kriteria', 'Detail']}
          rows={[
            ['Durasi ventilasi', 'Terventilasi ≥2 hari kalender'],
            ['Radiologis', 'CXR/CT: infiltrat baru/progresif, konsolidasi, kavitasi'],
            ['Klinis (≥2 dari 3)', 'Demam >38°C atau <36°C · Leukositosis ≥12.000 atau <4.000 · Sekret purulen baru'],
            ['Mikrobial', 'BAL ≥10⁴ CFU/mL · ETA ≥10⁵ CFU/mL · PSB ≥10³ CFU/mL'],
          ]}
        />
        <p className="font-semibold text-slate-700 mt-3 mb-1">VAP Prevention Bundle — 9 Komponen</p>
        <SectionTable
          headers={['#', 'Intervensi', 'Bukti', 'Rasionale']}
          rows={[
            ['1', 'Elevasi kepala 30–45°', 'Kuat', 'Cegah mikroaspirasi. KI relatif: hemodinamik tidak stabil, fraktur spinal.'],
            ['2', 'SAT harian', 'Kuat', 'Kurangi durasi IMV → kurangi exposure ventilator → ↓ risiko VAP'],
            ['3', 'SBT harian', 'Kuat', 'Setiap hari ventilasi = risiko VAP tambahan. Percepat weaning.'],
            ['4', 'Perawatan mulut klorheksidin 0.12% 2×/hari', 'Moderat', 'Kurangi kolonisasi orofaring. Kontroversial pada pasien jantung.'],
            ['5', 'Drainase sekret subglotis (SSD/CASS)', 'Kuat', 'ETT khusus dengan port suction di atas cuff. Kurangi VAP ~50%.'],
            ['6', 'Tekanan cuff ETT 20–30 cmH₂O', 'Kuat', '<20: mikroaspirasi. >30: iskemia mukosa. Ukur dengan manometer, cek 8–12 jam.'],
            ['7', 'Sirkuit ventilator — JANGAN diganti rutin', 'Kuat (negatif)', 'Penggantian rutin ↑ kontaminasi. Ganti hanya bila rusak/bocor/terkontaminasi.'],
            ['8', 'Profilaksis DVT', 'Standar ICU', 'Farmakologis (heparin/LMWH) + mekanik (stoking kompresi/IPC)'],
            ['9', 'Profilaksis PUD', 'Standar risiko tinggi', 'PPI atau H₂ blocker pada IMV >48 jam, koagulopati, riwayat ulkus.'],
          ]}
        />
      </Accordion>
    </div>
  )
}
