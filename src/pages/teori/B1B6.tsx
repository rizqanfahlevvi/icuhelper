import { useState } from 'react'
import { InfoBox, SectionTable } from './parts'

const TABS = [
  { id: 'b1', label: 'B1 · Breathing' },
  { id: 'b2', label: 'B2 · Blood' },
  { id: 'b3', label: 'B3 · Brain' },
  { id: 'b4', label: 'B4 · Bladder' },
  { id: 'b5', label: 'B5 · Bowel' },
  { id: 'b6', label: 'B6 · Bone' },
  { id: 'summary', label: 'Ringkasan' },
]

export function B1B6() {
  const [tab, setTab] = useState('b1')

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-200">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t.id ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'b1' && (
        <div className="space-y-3">
          <InfoBox color="blue">
            <p className="font-bold mb-1">B1 — Breathing / Pernapasan</p>
            <p>RR (normal 12–20; ≥30 = distress berat) · SpO₂ (sesuai target kondisi) · WOB: otot aksesori, retraksi, tripod · Auskultasi: vesikuler, ronkhi, wheezing, stridor · Pernapasan paradoks → kelelahan diafragma → ancaman intubasi</p>
          </InfoBox>
          <SectionTable
            headers={['Kondisi', 'Target SpO₂', 'Catatan']}
            rows={[
              ['Umum / pasca-resusitasi', '94–98%', 'Hindari hiperoksia'],
              ['ARDS sedang–berat', '88–95%', 'Toleransi hipoksemia permisif'],
              ['PPOK / hiperkapnia kronik', '88–92%', 'Hindari supresi drive napas'],
              ['Stroke / post-cardiac arrest', '94–98%', 'Hiperoksia berbahaya untuk otak'],
            ]}
          />
          <SectionTable
            headers={['ARDS (Berlin 2012)', 'P/F Ratio', 'SpO₂/FiO₂ Setara', 'PEEP Min.']}
            rows={[
              ['Ringan', '200–300', '≤315', '≥5 cmH₂O'],
              ['Sedang', '100–200', '≤264', '≥5 cmH₂O'],
              ['Berat', '<100', '≤221', '≥5 cmH₂O'],
            ]}
          />
          <SectionTable
            headers={['Parameter Ventilator', 'Target', 'Batas Aman']}
            rows={[
              ['Tidal Volume', '6 mL/kg IBW', '4–8 mL/kg IBW'],
              ['Plateau Pressure (Pplat)', '≤28 cmH₂O', '≤30 cmH₂O MUTLAK'],
              ['Driving Pressure (ΔP)', '≤15 cmH₂O', '≤15 ideal (Amato 2015)'],
              ['RR', '14–25 x/mnt', 'Sesuai pH & PaCO₂'],
              ['FiO₂', 'Titrasi ke SpO₂ target', 'Turunkan secepat mungkin'],
            ]}
          />
        </div>
      )}

      {tab === 'b2' && (
        <div className="space-y-3">
          <InfoBox color="blue">
            <p className="font-bold mb-1">B2 — Blood / Sirkulasi</p>
            <p>HR (60–100; takikardia = kompensasi?) · BP & MAP (tekanan nadi menyempit = low CO) · JVP (tinggi = gagal jantung kanan/tamponade) · CRT (&gt;2 dtk = hipoperfusi perifer) · Laktat (target &lt;2 mmol/L; clearance ≥10%/2 jam) · ScvO₂ (&lt;70% = inadequate DO₂)</p>
          </InfoBox>
          <SectionTable
            headers={['Kondisi', 'Target MAP', 'Catatan']}
            rows={[
              ['Septic shock (umum)', '≥65 mmHg', 'SSC 2021/2026'],
              ['Septic shock ≥65 tahun / HT kronik', '60–65 mmHg', '65+ mmHg tidak meningkatkan outcome (65 Trial)'],
              ['TBI / Stroke iskemik akut', '≥80 mmHg', 'Lindungi CPP'],
              ['Post-cardiac arrest', '≥65–80 mmHg', 'Sesuai guideline lokal'],
            ]}
          />
          <SectionTable
            headers={['Fluid Responsiveness — Metode', 'Nilai Prediktif Positif', 'Syarat']}
            rows={[
              ['Passive Leg Raise (PLR)', '↑ CO ≥10–15% dalam 60–90 dtk', 'Semua pasien'],
              ['Pulse Pressure Variation (PPV)', '>13%', 'VM, sinus rhythm, VT 8 mL/kg'],
              ['Stroke Volume Variation (SVV)', '>10%', 'VM, sinus rhythm'],
              ['End-expiratory Occlusion Test', '↑ CO ≥5%', 'VM, tolerasi apnea 15 dtk'],
            ]}
          />
          <SectionTable
            headers={['Vasopressor', 'Dosis Awal', 'Dosis Maks.', 'Indikasi']}
            rows={[
              ['Norepinefrin', '0.01–0.05 mcg/kg/mnt', '0.5–1 mcg/kg/mnt', 'Lini 1 — septic shock'],
              ['Vasopressin', '0.03–0.04 U/mnt (fixed)', '0.06 U/mnt', 'Add-on jika NE ≥0.25 mcg/kg/mnt'],
              ['Epinefrin', '0.01–0.05 mcg/kg/mnt', '0.5 mcg/kg/mnt', 'Anafilaksis; lini 2 septic shock'],
              ['Dobutamin', '2.5–5 mcg/kg/mnt', '20 mcg/kg/mnt', 'Low CO, gagal jantung kardiogenik'],
            ]}
          />
          <SectionTable
            headers={['Laktat', 'Interpretasi', 'Tindakan']}
            rows={[
              ['<2 mmol/L', 'Normal', 'Observasi'],
              ['2–4 mmol/L', 'Hipoperfusi subklinis', 'Optimasi hemodinamik, evaluasi 2 jam'],
              ['>4 mmol/L', 'Syok / hipoperfusi berat', 'Resusitasi agresif, pertimbangkan CRRT'],
            ]}
          />
        </div>
      )}

      {tab === 'b3' && (
        <div className="space-y-3">
          <InfoBox color="blue">
            <p className="font-bold mb-1">B3 — Brain / Persarafan</p>
            <p>GCS: Mata (1–4) + Verbal (1–5) + Motorik (1–6); total 3–15. GCS ≤8 → pertimbangkan proteksi jalan napas. Pupil: normal 2–5 mm bilateral; anisokoria &gt;1 mm + fixed → herniasi uncal? Pinpoint = opiat/pontin lesion.</p>
          </InfoBox>
          <SectionTable
            headers={['RASS', 'Deskripsi', 'Kondisi']}
            rows={[
              ['0', 'Alert, tenang', 'Target umum (weaning, post-op)'],
              ['-1', 'Mengantuk, buka mata >10 dtk terhadap suara', 'Target ICU'],
              ['-2', 'Sedasi ringan, buka mata <10 dtk', 'Dapat diterima bila diperlukan'],
              ['-3 s/d -5', 'Sedasi dalam hingga tidak responsif', 'Hindari kecuali indikasi khusus'],
            ]}
          />
          <div>
            <p className="font-semibold text-slate-700 mb-1">Pilihan Agen Sedasi (PADIS 2025)</p>
            <ul className="space-y-0.5 text-slate-600">
              <li>• <strong>Dexmedetomidine</strong> — direkomendasikan (kondisional) di atas propofol; ↓ durasi delirium</li>
              <li>• <strong>Propofol</strong> — alternatif; awasi hipertrigliseridemia dan propofol infusion syndrome &gt;48 jam</li>
              <li>• <strong>Midazolam</strong> — hindari untuk sedasi rutin; risiko akumulasi dan delirium lebih tinggi</li>
            </ul>
          </div>
          <SectionTable
            headers={['Skala Nyeri', 'Digunakan Pada', 'Skor Signifikan']}
            rows={[
              ['CPOT', 'Pasien tidak bisa komunikasi verbal / terintubasi', '≥3 dari 8'],
              ['NRS', 'Pasien sadar dan dapat berkomunikasi', '≥4 dari 10'],
              ['BPS', 'Alternatif CPOT — pasien terintubasi', '≥6 dari 12'],
            ]}
          />
          <SectionTable
            headers={['Penilaian Delirium', 'Setting', 'Positif Jika']}
            rows={[
              ['CAM-ICU', 'Pasien terintubasi / ICU ventilator', 'Fitur 1+2 AND (3 OR 4) positif'],
              ['ICDSC', 'Pasien ICU non-intubasi', 'Skor ≥4 dari 8'],
            ]}
          />
          <InfoBox color="teal">
            <p><strong>Pencegahan Delirium (PADIS 2025):</strong> Melatonin 3–5 mg malam hari (kondisional). Antipsikotik TIDAK direkomendasikan rutin. Orientasi ulang, mobilisasi dini, siklus tidur/bangun, kurangi sedasi.</p>
          </InfoBox>
        </div>
      )}

      {tab === 'b4' && (
        <div className="space-y-3">
          <InfoBox color="blue">
            <p className="font-bold mb-1">B4 — Bladder / Renal & Balans Cairan</p>
            <p>UO target ≥0.5 mL/kgBB/jam. Oliguria: &lt;0.5 mL/kg/jam (&gt;6 jam). Anuria: &lt;50 mL/hari. Evaluasi: kateter paten? Pre-renal vs renal vs post-renal. FENa &lt;1% = pre-renal; &gt;2% = renal.</p>
          </InfoBox>
          <SectionTable
            headers={['Staging AKI — KDIGO', 'Kreatinin', 'Urine Output']}
            rows={[
              ['Stage 1', '↑1.5–1.9× baseline atau ↑≥0.3 mg/dL dalam 48 jam', '<0.5 mL/kg/jam selama 6–12 jam'],
              ['Stage 2', '↑2.0–2.9× baseline', '<0.5 mL/kg/jam ≥12 jam'],
              ['Stage 3', '↑≥3× baseline atau ≥4.0 mg/dL atau mulai RRT', '<0.3 mL/kg/jam ≥24 jam atau anuria ≥12 jam'],
            ]}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="font-semibold text-slate-700 mb-1">Intake (hitung semua)</p>
              <ul className="text-slate-600 space-y-0.5">
                <li>• Cairan IV (kristaloid, koloid)</li>
                <li>• Nutrisi enteral / parenteral</li>
                <li>• Obat-obatan terlarut</li>
                <li>• Produk darah</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">Output (catat semua)</p>
              <ul className="text-slate-600 space-y-0.5">
                <li>• Urine (kateter / spontan)</li>
                <li>• NGT / gastric drainage</li>
                <li>• Drain luka / chest tube</li>
                <li>• IWL: 10–15 mL/kgBB/hari + koreksi demam</li>
              </ul>
            </div>
          </div>
          <SectionTable
            headers={['Indikasi RRT', 'Ambang']}
            rows={[
              ['Fluid overload refrakter', '>10–15% berat badan; gagal respons diuretik'],
              ['Hiperkalemia refrakter', 'K⁺ >6.5 mEq/L atau EKG changes'],
              ['Uremia simtomatik', 'Perikarditis, ensefalopati, perdarahan uremik'],
              ['Keracunan dialyzable', 'Metanol, etilen glikol, litium, salisilat'],
            ]}
          />
        </div>
      )}

      {tab === 'b5' && (
        <div className="space-y-3">
          <InfoBox color="blue">
            <p className="font-bold mb-1">B5 — Bowel / Pencernaan & Nutrisi</p>
            <p>Inspeksi: distensi, skar, ostomi, hernia. Perkusi: timpani (gas), pekak (cairan/massa). Palpasi: nyeri tekan, defense, rigiditas.</p>
          </InfoBox>
          <SectionTable
            headers={['Target Nutrisi ICU', 'Target', 'Catatan']}
            rows={[
              ['Kalori total', '25–30 kkal/kgBB/hari', 'Gunakan berat aktual atau IBW (jika obesitas)'],
              ['Protein', '1.2–2.0 g/kgBB/hari', '↑ 2.0–2.5 pada luka bakar, CRRT'],
              ['Target GDS', '140–180 mg/dL', 'Protokol insulin jika >180 berulang'],
            ]}
          />
          <div>
            <p className="font-semibold text-slate-700 mb-1">Early Enteral Nutrition</p>
            <ul className="space-y-0.5 text-slate-600">
              <li>• Mulai EN dalam <strong>24–48 jam</strong> setelah masuk ICU bila hemodinamik stabil</li>
              <li>• Target laju: 10–20 mL/jam → eskalasi bertahap ke target kalori dalam 48–72 jam</li>
              <li>• Posisi kepala 30–45° untuk mengurangi risiko aspirasi</li>
              <li>• Pantau toleransi tiap 4–6 jam</li>
            </ul>
          </div>
          <SectionTable
            headers={['Tanda Intoleransi Feeding', 'Ambang', 'Tindakan']}
            rows={[
              ['Distensi abdomen', 'Lingkar abdomen ↑ >3 cm', 'Kurangi/tunda EN, evaluasi penyebab'],
              ['Muntah / regurgitasi', 'Volume >yang diberikan', 'Stop sementara, posisikan ulang, prokinetik'],
              ['Gastric Residual Volume (GRV)', '>500 mL/4–6 jam', 'Tahan EN, prokinetik, cek posisi NGT'],
              ['Diare', '>3× defekasi cair/hari', 'Evaluasi C. diff, osmolaritas, infeksi'],
            ]}
          />
          <SectionTable
            headers={['Tekanan Intraabdominal (IAP)', 'Klasifikasi']}
            rows={[
              ['<12 mmHg', 'Normal'],
              ['12–15 mmHg', 'IAH Grade I'],
              ['16–20 mmHg', 'IAH Grade II'],
              ['21–25 mmHg', 'IAH Grade III'],
              ['>25 mmHg', 'IAH Grade IV → risiko Abdominal Compartment Syndrome (ACS)'],
            ]}
          />
        </div>
      )}

      {tab === 'b6' && (
        <div className="space-y-3">
          <InfoBox color="blue">
            <p className="font-bold mb-1">B6 — Bone, Integumen & Other</p>
            <p>Kekuatan otot (MRC Scale), mobilisasi, pressure injury, mottling score, CRT, edema.</p>
          </InfoBox>
          <SectionTable
            headers={['MRC Scale', 'Deskripsi']}
            rows={[
              ['0', 'Tidak ada kontraksi otot sama sekali'],
              ['1', 'Kedutan / flicker, tidak ada gerakan sendi'],
              ['2', 'Gerakan aktif, tidak melawan gravitasi'],
              ['3', 'Gerakan aktif melawan gravitasi tanpa resistensi'],
              ['4', 'Gerakan aktif melawan gravitasi + resistensi sebagian'],
              ['5', 'Kekuatan normal'],
            ]}
          />
          <InfoBox color="amber">
            <p><strong>ICU-Acquired Weakness (ICUAW):</strong> Insidensi 25–50% pada ICU ≥7 hari. Kriteria: MRC sum score &lt;48/60. Faktor risiko: imobilisasi, kortikosteroid, hiperglikemia, NMB berkepanjangan.</p>
          </InfoBox>
          <SectionTable
            headers={['Mottling Score', 'Area']}
            rows={[
              ['0', 'Tidak ada'],
              ['1', 'Terbatas pada lutut'],
              ['2', 'Meluas ke paha atas'],
              ['3', 'Meluas ke lipatan inguinal'],
              ['4', 'Meluas ke umbilikus'],
              ['5', 'Seluruh ekstremitas bawah + batang tubuh'],
            ]}
          />
          <SectionTable
            headers={['Pressure Injury — NPUAP/EPUAP', 'Deskripsi']}
            rows={[
              ['Stage 1', 'Eritema non-blanching, kulit intak'],
              ['Stage 2', 'Hilangnya lapisan parsial dermis; luka terbuka/merah'],
              ['Stage 3', 'Hilangnya lapisan penuh; lemak subkutan terlihat'],
              ['Stage 4', 'Hilangnya lapisan penuh + keterlibatan otot/tendon/tulang'],
              ['Unstageable', 'Luka penuh ditutupi slough/eschar'],
              ['Deep Tissue (DTI)', 'Kulit intak/melepuh, warna ungu — kerusakan dalam'],
            ]}
          />
          <div>
            <p className="font-semibold text-slate-700 mb-1">Early Mobilization</p>
            <ul className="space-y-0.5 text-slate-600">
              <li>• Mulai sedini mungkin bila hemodinamik stabil</li>
              <li>• Tangga: latihan pasif → aktif-bantu → duduk di tempat tidur → duduk di kursi → berdiri → berjalan</li>
              <li>• Ventilasi mekanik <strong>bukan kontraindikasi mutlak</strong> — pasien intubasi bisa latihan di TT</li>
              <li>• Koordinasikan dengan SAT dan SBT</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'summary' && (
        <div className="space-y-3">
          <InfoBox color="teal">
            <p className="font-bold mb-1">Keterkaitan B1–B6 dengan Ventilasi Mekanik</p>
          </InfoBox>
          <SectionTable
            headers={['Sistem', 'Hubungan dengan Ventilasi Mekanik']}
            rows={[
              ['B1 · Breathing', 'Setting primer: VT, PEEP, FiO₂, mode, RR, driving pressure — langsung mempengaruhi oksigenasi & ventilasi'],
              ['B2 · Blood', 'PEEP tinggi → ↓ preload → ↓ CO; resusitasi berlebih → edema paru → perburukan ventilasi'],
              ['B3 · Brain', 'Sedasi dalam → ↑ durasi VM; delirium memperpanjang ICU-LOS; SAT+SBT ↓ durasi ventilasi'],
              ['B4 · Bladder', 'Fluid overload → edema paru → FRC ↓ → hipoksemia. Balans negatif → ↑ keberhasilan weaning'],
              ['B5 · Bowel', 'Distensi → ↑ IAP → ↑ Pplat → barotrauma. Nutrisi adekuat ↑ kekuatan otot napas → ↑ kemampuan weaning'],
              ['B6 · Bone', 'ICUAW → kegagalan weaning. Mobilisasi dini ↓ durasi VM. Pressure injury ↑ infeksi → sepsis → perburukan'],
            ]}
          />
          <div>
            <p className="font-semibold text-slate-700 mb-2">Checklist Bedside Cepat</p>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <p className="font-semibold text-teal-700">🫁 B1 · Breathing</p>
                <ul className="mt-1 space-y-0.5">
                  <li>☐ RR & SpO₂ dalam target?</li>
                  <li>☐ WOB berlebihan? Otot aksesori?</li>
                  <li>☐ Setting ventilator aman?</li>
                </ul>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <p className="font-semibold text-red-700">❤️ B2 · Blood</p>
                <ul className="mt-1 space-y-0.5">
                  <li>☐ MAP & HR dalam target?</li>
                  <li>☐ Laktat clearance ≥10%/2 jam?</li>
                  <li>☐ Vasopressor dosis stabil?</li>
                </ul>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <p className="font-semibold text-purple-700">🧠 B3 · Brain</p>
                <ul className="mt-1 space-y-0.5">
                  <li>☐ RASS target tercapai?</li>
                  <li>☐ CAM-ICU hari ini?</li>
                  <li>☐ Analgesia adekuat?</li>
                </ul>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <p className="font-semibold text-blue-700">💧 B4 · Bladder</p>
                <ul className="mt-1 space-y-0.5">
                  <li>☐ UO ≥0.5 mL/kg/jam?</li>
                  <li>☐ Balans cairan 24 jam?</li>
                  <li>☐ Kreatinin tren stabil?</li>
                </ul>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <p className="font-semibold text-amber-700">🍽️ B5 · Bowel</p>
                <ul className="mt-1 space-y-0.5">
                  <li>☐ EN berjalan? Toleransi baik?</li>
                  <li>☐ GDS dalam target?</li>
                  <li>☐ Distensi abdomen?</li>
                </ul>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-700">🦴 B6 · Bone</p>
                <ul className="mt-1 space-y-0.5">
                  <li>☐ Mobilisasi dilakukan hari ini?</li>
                  <li>☐ Pressure injury dicegah?</li>
                  <li>☐ DVT profilaksis aktif?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
