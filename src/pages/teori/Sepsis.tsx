import { Accordion, InfoBox, SectionTable } from './parts'

export function Sepsis() {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <InfoBox color="red">
          <p className="font-bold mb-1">Definisi Sepsis-3 (JAMA 2016)</p>
          <p><strong>Sepsis:</strong> Disfungsi organ mengancam jiwa akibat respons tubuh tidak terkontrol terhadap infeksi. Kriteria: dugaan infeksi + <strong>SOFA ≥2 (akut)</strong>.</p>
        </InfoBox>
        <InfoBox color="red">
          <p className="font-bold mb-1">Syok Septik</p>
          <p>Subset sepsis dengan kelainan sirkulasi dan metabolisme berat. Kriteria: Sepsis + <strong>vasopressor untuk MAP ≥65</strong> + <strong>laktat &gt;2 mmol/L</strong> meski resusitasi adekuat.</p>
        </InfoBox>
      </div>

      <Accordion title="Screening: qSOFA & SOFA Score" defaultOpen>
        <p className="text-slate-600 mb-2">qSOFA ≥2 → curiga sepsis → ukur SOFA lengkap + laktat.</p>
        <SectionTable
          headers={['Kriteria qSOFA', 'Abnormal', 'Skor']}
          rows={[
            ['Altered mentation (GCS <15)', 'GCS menurun dari baseline', '1'],
            ['Respiratory Rate', '≥22 x/menit', '1'],
            ['Systolic Blood Pressure', '≤100 mmHg', '1'],
          ]}
        />
        <InfoBox>Limitasi qSOFA: sensitivitas rendah (51–65%) — jangan digunakan sebagai satu-satunya kriteria eksklusi sepsis. NEWS-2 lebih sensitif untuk skrining.</InfoBox>
        <p className="font-semibold text-slate-700 mt-3 mb-1">SOFA Score — Konfirmasi Disfungsi Organ</p>
        <SectionTable
          headers={['Sistem Organ', 'Parameter', 'Skor 1', 'Skor 2', 'Skor 3', 'Skor 4']}
          rows={[
            ['Respirasi', 'P/F ratio (mmHg)', '300–400', '200–299', '100–199 + VM', '<100 + VM'],
            ['Koagulasi', 'Trombosit (×10³/μL)', '100–149', '50–99', '20–49', '<20'],
            ['Hepar', 'Bilirubin (mg/dL)', '1.2–1.9', '2.0–5.9', '6.0–11.9', '≥12'],
            ['Kardiovaskular', 'MAP/Vasopressor', 'MAP <70', 'Dopa ≤5 / Dobu', 'Dopa 5–15 / Epi ≤0.1 / NE ≤0.1', 'Dopa >15 / Epi/NE >0.1'],
            ['SSP', 'GCS', '13–14', '10–12', '6–9', '<6'],
            ['Renal', 'Kreatinin (mg/dL)', '1.2–1.9', '2.0–3.4', '3.5–4.9 / UO <500 mL/hr', '≥5 / UO <200 mL/hr'],
          ]}
        />
        <InfoBox color="teal">
          <p>SOFA ≥2 akut dari baseline = definisi sepsis. ΔSOFA ≥2 dalam 24 jam = memburuk.</p>
          <p className="text-xs mt-1">Mortalitas: SOFA 0–6: &lt;10% · 7–9: ~15–20% · 10–12: ~40% · ≥13: &gt;80%</p>
        </InfoBox>
      </Accordion>

      <Accordion title="Sepsis Bundle — SSC 2021 & Update 2024 (1-Hour Bundle)">
        <InfoBox color="amber">
          <p className="font-bold">⏱️ 1-Hour Bundle Sepsis — Lakukan dalam 1 jam pertama</p>
          <p className="text-xs mt-1">Setiap jam keterlambatan → mortalitas ↑ 7%</p>
        </InfoBox>
        <SectionTable
          headers={['#', 'Aksi', 'Detail']}
          rows={[
            ['1', '🩸 Ukur Laktat', 'Laktat serum. Re-ukur 2 jam jika laktat awal >2 mmol/L. Target <2 mmol/L.'],
            ['2', '🏺 Kultur Darah', '2 set kultur (aerob + anaerob) SEBELUM antibiotik. Jangan tunda AB >45 mnt.'],
            ['3', '💊 Antibiotik Broad-Spectrum', 'Berikan SEBELUM 1 jam. Sesuai sumber dugaan, pola lokal, risiko resistensi.'],
            ['4', '💧 Resusitasi Cairan', 'Kristaloid 30 mL/kg IV dalam 3 jam jika hipotensi atau laktat ≥4 mmol/L. Nilai respons cairan.'],
            ['5', '💊 Vasopressor', 'Jika MAP <65 selama/setelah resusitasi → mulai norepinefrin. Target MAP ≥65 mmHg.'],
          ]}
        />
        <div className="mt-3">
          <p className="font-semibold text-slate-700 mb-1">Update SSC 2024 — Perubahan Penting</p>
          <ul className="space-y-1 text-slate-600">
            <li>• <strong>Cairan lebih restriktif (CLASSIC trial 2022):</strong> Resusitasi restriktif setelah stabilisasi awal — guided resuscitation vs liberal</li>
            <li>• <strong>Dynamic predictor:</strong> Gunakan PLR, VTI, End-expiratory occlusion test — bukan CVP statik</li>
            <li>• <strong>Laktat-guided:</strong> Target normalisasi laktat &lt;2 mmol/L dalam 6 jam (ANDROMEDA-SHOCK 2018)</li>
            <li>• <strong>Steroid diperketat:</strong> Hidrokortison hanya jika NE ≥0.25 μg/kg/mnt setelah resusitasi adekuat</li>
            <li>• <strong>AB de-eskalasi 48–72 jam</strong> setelah kultur tersedia. PCT membantu panduan durasi</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="Antibiotik Empiris — Berdasarkan Sumber Infeksi">
        <InfoBox color="amber">⚠️ Sesuaikan dengan antibiogram institusi. De-eskalasi 48–72 jam berdasarkan kultur.</InfoBox>
        <SectionTable
          headers={['Sumber Infeksi', 'Patogen Dugaan', 'Pilihan AB Empiris', 'Alternatif']}
          rows={[
            ['Paru (CAP berat)', 'S. pneumoniae, H. influenzae, Legionella', 'Ceftriaxone 1–2 g/24 jam + Azithromycin 500 mg/24 jam', 'Jika MRSA risk: + Vancomycin'],
            ['Paru (HAP/VAP)', 'Klebsiella, Pseudomonas, MRSA, Acinetobacter', 'Pip-tazo 4.5 g/6 jam atau Meropenem 1 g/8 jam', '+ Vancomycin/Linezolid jika MRSA. Kolistin jika MDR.'],
            ['Abdomen (peritonitis)', 'E. coli, Klebsiella, Bacteroides', 'Pip-tazo 4.5 g/6 jam atau Cefepime + Metronidazole 500 mg/8 jam', 'Meropenem jika ESBL. + Flukonazol jika Candida risk.'],
            ['Saluran Kemih', 'E. coli, Klebsiella, Enterococcus', 'Ceftriaxone 2 g/24 jam atau Ciprofloxacin 400 mg/12 jam', 'Meropenem jika ESBL. Pip-tazo jika Pseudomonas risk.'],
            ['Kulit/Jaringan Lunak', 'S. aureus, Streptococcus, anaerob', 'Kloksasilin 2 g/4 jam atau Ampicillin-sulbaktam 3 g/6 jam', 'Necrotizing: + Klindamisin. MRSA: Vancomycin.'],
            ['SSP (meningitis)', 'N. meningitidis, S. pneumoniae, Listeria', 'Ceftriaxone 4 g/24 jam + Ampicillin 2 g/4 jam + Deksametason', 'HSV ensefalitis: Asiklovir 10 mg/kg/8 jam'],
            ['Sumber tidak jelas', 'Broad coverage', 'Meropenem 1 g/8 jam atau Pip-tazo 4.5 g/6 jam', '+ Vancomycin jika MRSA risk. + Flukonazol jika Candida risk.'],
          ]}
        />
        <div className="mt-2">
          <p className="font-semibold text-slate-700 mb-1">Faktor Risiko Resistensi</p>
          <ul className="space-y-0.5 text-slate-600">
            <li>• <strong>MRSA:</strong> Rawat inap &gt;72 jam, dialisis, kolonisasi diketahui</li>
            <li>• <strong>ESBL/KPC:</strong> AB sebelumnya, rawat inap berulang, perjalanan ke Asia Selatan/Tenggara</li>
            <li>• <strong>Candida:</strong> Imunosupresi, TPN &gt;5 hari, AB broad-spectrum &gt;5 hari</li>
            <li>• <strong>Pseudomonas:</strong> Bronkiektasis, PPOK berat, immunocompromised</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="Resusitasi Cairan — Strategi & Guided Assessment">
        <SectionTable
          headers={['Dimensi (4D)', 'Pertanyaan', 'Alat Evaluasi']}
          rows={[
            ['Drug (Jenis)', 'Kristaloid atau Koloid?', 'Albumin untuk MAP rendah setelah kristaloid'],
            ['Dose (Jumlah)', 'Berapa banyak?', 'PLR, VTI, pulse pressure variasi'],
            ['Duration (Fase)', 'Fase mana saat ini?', 'ROSE: Resuscitation → Optimization → Stabilization → De-escalation'],
            ['De-escalation', 'Kapan hentikan?', 'Fluid balance negatif target setelah 24–48 jam'],
          ]}
        />
        <SectionTable
          headers={['Cairan', 'Keunggulan', 'Keterbatasan', 'Rekomendasi']}
          rows={[
            ['NaCl 0.9% (NS)', 'Murah, tersedia', 'Asidosis hiperkloremik, AKI jika berlebihan', 'Hindari sebagai pilihan utama'],
            ['Ringer Laktat (RL)', 'Balanced crystalloid, fisiologis', 'Laktat aditif (minimal)', '✅ Pilihan UTAMA (SSC 2021)'],
            ['PlasmaLyte', 'Balanced, pH fisiologis, tanpa laktat', 'Biaya lebih tinggi', '✅ Alternatif baik RL'],
            ['Albumin 4–5%', 'Onkotik, anti-inflamasi; ALBIOS trial', 'Mahal', 'Pertimbangkan jika albumin <2 g/dL'],
            ['HES / Starches', '—', 'AKI lebih banyak (6S, CHEST trial)', '🚫 KONTRAINDIKASI pada sepsis'],
          ]}
        />
        <div className="mt-2">
          <p className="font-semibold text-slate-700 mb-1">Penilaian Fluid Responsiveness</p>
          <ul className="space-y-0.5 text-slate-600">
            <li>• <strong>PLR:</strong> ↑ CO ≥10% → fluid responsive. Sensitivitas 85%, spesifisitas 91%</li>
            <li>• <strong>PPV:</strong> &gt;13% → fluid responsive. Tidak valid: aritmia, napas spontan</li>
            <li>• <strong>End-Expiratory Occlusion:</strong> Okludir 15 detik → ↑ CO ≥5% → fluid responsive</li>
            <li>• <strong>CVP:</strong> TIDAK direkomendasikan sebagai panduan resusitasi</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="Vasopressor & Inotropik">
        <SectionTable
          headers={['Obat', 'Mekanisme', 'Dosis', 'Peran']}
          rows={[
            ['Norepinefrin (NE)', 'α₁ > β₁ → vasokonstriksi + sedikit inotropik', '0.01–3 μg/kg/mnt', '🥇 VASOPRESSOR LINI PERTAMA'],
            ['Vasopressin', 'V1 receptor → vasokonstriksi', '0.01–0.04 unit/mnt (fixed)', 'Tambahkan jika NE >0.25–0.5 μg/kg/mnt'],
            ['Epinefrin', 'α₁ + β₁ + β₂ → vasopresor + inotropik', '0.01–0.5 μg/kg/mnt', 'Lini ketiga: NE + Vasopressin masih tidak stabil'],
            ['Dopamin', 'DA/β₁/α₁ dose-dependent', '5–20 μg/kg/mnt', '⚠️ Tidak direkomendasikan lini pertama — lebih banyak aritmia'],
            ['Dobutamin', 'β₁ >> β₂ → inotropik + kronotropik', '2.5–20 μg/kg/mnt', 'Tambahkan jika disfungsi miokard + CO rendah'],
          ]}
        />
        <InfoBox color="teal">
          <p><strong>Target:</strong> MAP ≥65 mmHg (↑80 pada hipertensi kronik — SEPSISPAM trial).</p>
          <p className="mt-1"><strong>Hidrokortison:</strong> 200 mg/hari IV jika NE ≥0.25 μg/kg/mnt setelah resusitasi adekuat (ADRENAL trial). Tapering 5–7 hari. ACTH stimulation test TIDAK diperlukan.</p>
        </InfoBox>
      </Accordion>
    </div>
  )
}
