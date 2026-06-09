import { useState } from 'react'

interface RefRow { pub: string; topic: string; note: string }
interface RefSection { title: string; rows: RefRow[] }

const SECTIONS: RefSection[] = [
  {
    title: '🔥 Pembaruan Panduan & Studi Kunci 2022–2025',
    rows: [
      { pub: 'Evans L et al. SSC 2024. Intensive Care Med 2024;50:744', topic: 'Sepsis — SSC Update', note: 'Resusitasi berbasis perfusi (CRT vs laktat), de-eskalasi antibiotik dipandu PCT, balanced crystalloid direkomendasikan kuat.' },
      { pub: 'ESICM ARDS Guidelines 2023. Intensive Care Med 2023;49:727', topic: 'ARDS — Guidelines', note: 'Definisi ARDS baru (Global 2023): HFNC ≥30 L/mnt + SpO₂/FiO₂ ≥315 masuk kriteria. Driving pressure sebagai target utama.' },
      { pub: 'Devlin JW et al. SCCM PADIS 2025. Crit Care Med 2025;53:e711', topic: 'Sedasi ICU — PADIS', note: 'Update 2025: dexmedetomidine lebih diutamakan dari propofol untuk sedasi ringan. Penguatan ABCDEF bundle. Targeted light sedation (RASS −1 s/d 0) sebagai standar.' },
      { pub: 'Bhatt DL et al. MENDS-2. NEJM 2024;390:307', topic: 'RSI — Induksi', note: 'RCT 686 pasien ICU: etomidate vs ketamine — tidak ada perbedaan mortalitas, ventilator-free days, atau vasopressor. Etomidate aman pada sepsis.' },
      { pub: 'Brown CA et al. NEJM 2023;389:1943', topic: 'RSI — Video Laryngoscopy', note: 'First-pass success rate ≥95% dikaitkan ↓ mortalitas in-hospital. Video laryngoscopy sebagai first-line standard di setting emergensi.' },
      { pub: 'Torres A et al. ERS/ESICM HAP/VAP 2022. Eur Respir J 2022;60:2200', topic: 'VAP — Guidelines', note: 'CPIS bukan alat diagnosis utama VAP. Kultur kuantitatif (BAL ≥10⁴ CFU/mL). De-eskalasi 48–72 jam berbasis kultur. Durasi terapi 7–8 hari.' },
      { pub: 'Cornely OA et al. ESCMID/ECMM 2023. Clin Microbiol Infect 2023', topic: 'Kandidiasis Invasif', note: 'Echinocandin utama ICU. β-D-glucan ≥80 pg/mL sebagai biomarker diagnostik. De-eskalasi ke flukonazol hanya bila pasien stabil + isolat sensitif.' },
      { pub: 'Gaudry S et al. AKIKI-2. Lancet 2021;397:1293', topic: 'RRT — Timing', note: 'Delayed strategy lebih unggul: mortalitas serupa namun 40% pasien terhindar dari RRT. Bukti kuat menunda RRT jika tidak ada indikasi urgensi absolut.' },
      { pub: 'STARRT-AKI Investigators. NEJM 2020;383:240', topic: 'RRT — Timing', note: '3.019 pasien AKI berat: accelerated vs standard RRT — tidak ada perbedaan mortalitas 90-hari. 38,5% kelompok standard tidak butuh RRT.' },
      { pub: 'Hernández G et al. ANDROMEDA-SHOCK-2. JAMA 2023;329:1224', topic: 'Sepsis — Resusitasi', note: 'CRT-guided vs laktat-guided resusitasi: mortalitas 28-hari setara. CRT ≤3 detik sebagai target alternatif valid di sumber daya terbatas.' },
      { pub: 'Hjortrup PB et al. CLASSIC. NEJM 2022;386:2459', topic: 'Sepsis — Cairan Restriktif', note: 'Restrictive fluid strategy vs liberal: mortalitas serupa. Mendukung pendekatan deresusitasi aktif dan target cairan minimal.' },
      { pub: 'Lamontagne F et al. LOVIT. NEJM 2022;386:2387', topic: 'Vitamin C — Sepsis', note: 'Vitamin C dosis tinggi IV tidak menurunkan mortalitas atau organ failure pada sepsis. Tidak direkomendasikan rutin.' },
      { pub: 'Singer P et al. ESPEN Guidelines 2023. Clin Nutr 2023;42:1671', topic: 'Nutrisi ICU', note: 'Update ESPEN 2023: early enteral nutrition dalam 24–48 jam. Protein target 1.3 g/kg/hari. Hindari overfeeding fase akut.' },
    ],
  },
  {
    title: '📚 Ventilasi Mekanik & ARDS',
    rows: [
      { pub: 'ARDSNet. NEJM 2000;342:1301', topic: 'VT Rendah ARDS', note: 'VT 6 vs 12 mL/kg IBW ↓ mortalitas dari 39.8% → 31%. Landasan lung-protective ventilation.' },
      { pub: 'Guérin C (PROSEVA). NEJM 2013;368:2159', topic: 'Prone Position', note: 'Prone 16 jam/hari pada P/F <150 ↓ mortalitas 32.8% → 16%. NNT = 6. Standard of care ARDS severe.' },
      { pub: 'Amato MB. NEJM 2015;372:747', topic: 'Driving Pressure', note: 'Driving pressure (Pplat−PEEP) prediktor mortalitas terkuat. ↑1 cmH₂O DP → ↑4–7% mortalitas.' },
      { pub: 'ARDS Definition Task Force. JAMA 2012;307:2526', topic: 'Berlin Definition', note: 'Berlin 2012: mild/moderate/severe berdasar P/F ratio dalam 7 hari, bilateral infiltrat, PEEP ≥5.' },
      { pub: 'Papazian L et al. (ACURASYS). NEJM 2010;363:1107', topic: 'NMB ARDS', note: 'Cisatrakurium 48 jam pada ARDS severe ↓ mortalitas dan barotrauma. Efek terbesar pada P/F <120.' },
      { pub: 'Frat JP et al. (FLORALI). NEJM 2015;372:2185', topic: 'HFNC vs NIV', note: 'HFNC superior terhadap NIV dan oksigen konvensional untuk hypoxemic respiratory failure. ↓ intubasi pada P/F <200.' },
      { pub: 'Roca O et al. Am J Respir Crit Care Med 2016;194:773', topic: 'ROX Index', note: 'ROX =(SpO₂/FiO₂)/RR. ROX <3.85 pada jam ke-2 → prediksi kegagalan HFNC tinggi → pertimbangkan intubasi.' },
      { pub: 'Yang KL & Tobin MJ. NEJM 1991;324:1445', topic: 'RSBI', note: 'RSBI =RR/VT(L). <80 prediksi weaning sukses. Landmark study untuk spontaneous breathing trial.' },
      { pub: 'Girard TD et al. (ABC trial). Lancet 2008;371:126', topic: 'SAT+SBT Protocol', note: 'Koordinasi SAT+SBT (ABCDE bundle) ↓ durasi ventilasi, ICU length of stay, dan mortalitas 28-hari.' },
      { pub: 'GOLD Initiative. Global Strategy COPD 2024', topic: 'PPOK Guidelines', note: 'Panduan GOLD 2024: NIV first-line untuk eksaserbasi PPOK hipercapnik. Target SpO₂ 88–92%.' },
    ],
  },
  {
    title: '💉 RSI & Farmakologi Intubasi',
    rows: [
      { pub: 'Walls RM et al. Manual of Emergency Airway Management. 5th ed. 2022', topic: 'RSI — Algoritma', note: 'Standar referensi 7P RSI. Panduan komprehensif airway emergensi termasuk DSI dan difficult airway.' },
      { pub: 'Sorensen MK. Cochrane Database Syst Rev 2022;5:CD002788', topic: 'Sux vs Rocuronium', note: 'Rocuronium 1.2 mg/kg non-inferior terhadap suksinilkolin untuk intubating conditions pada RSI.' },
      { pub: 'Zeiler FA et al. Can J Anaesth 2014;61:1002', topic: 'Ketamine TIK', note: 'Ketamine tidak meningkatkan TIK secara bermakna pada pasien TBI. Aman digunakan bila ada indikasi lain (syok, bronkospasme).' },
      { pub: 'Weingart SD & Levitan RM. Ann Emerg Med 2012;59:165', topic: 'Delayed Sequence Intubation', note: 'DSI: sedasi dengan ketamine → pre-oksigenasi → RSI. Efektif untuk pasien uncooperative dengan hipoksemia.' },
      { pub: 'Devlin JW et al. PADIS 2018. Crit Care Med 2018;46:e825', topic: 'Sedasi ICU', note: 'PADIS guidelines: analgesia-first, light sedation target, daily SAT, dexmedetomidine untuk sedasi ringan-sedang.' },
    ],
  },
  {
    title: '🫘 Fungsi Ginjal, AKI & Elektrolit',
    rows: [
      { pub: 'Inker LA et al. NEJM 2021;385:1737', topic: 'CKD-EPI 2021', note: 'Formula eGFR tanpa variabel ras — lebih adil dan akurasi setara. Direkomendasikan NKF/ASN sebagai formula primer.' },
      { pub: 'KDIGO CKD Guideline 2024. Kidney Int Suppl 2024', topic: 'CKD — Guidelines', note: 'Konfirmasi CKD-EPI 2021. Staging G1–G5 + albuminuria. Rekomendasi SGLT2i untuk semua CKD + albuminuria.' },
      { pub: 'KDIGO AKI Guideline 2012. Kidney Int Suppl 2012;2:1', topic: 'AKI — Staging KDIGO', note: 'Kriteria AKI: SCr ↑0.3 mg/dL dalam 48 jam, atau ↑1.5× dalam 7 hari, atau UO <0.5 mL/kg/jam ≥6 jam.' },
      { pub: 'Adrogue HJ & Madias NE. NEJM 2000;342:1581', topic: 'Hiponatremia', note: 'Koreksi hiponatremia: tidak >8–10 mEq/L per 24 jam (kronik). Osmotic demyelination syndrome jika terlalu cepat.' },
      { pub: 'Payne RB et al. Ann Clin Biochem 1973;10:113', topic: 'Ca Terkoreksi', note: 'Ca terkoreksi = Ca total + 0.8 × (4 − albumin). Formula klasik untuk interpretasi kalsium pada hipoalbuminemia.' },
      { pub: 'Glasdam SM et al. Crit Care 2012;16:R108', topic: 'Mg ICU', note: 'Hipomagnesemia pada 52–60% pasien ICU. Terkait aritmia, seizure, weaning failure. Koreksi rutin meningkatkan outcome.' },
    ],
  },
  {
    title: '🦠 Pneumonia & Pulmonologi',
    rows: [
      { pub: 'Lim WS et al. Thorax 2003;58:377', topic: 'CURB-65', note: 'Skor 5 kriteria CAP. Skor 0–1: rawat jalan; 2: rawat inap; ≥3: ICU/high dependency. Sensitivitas baik untuk CAP.' },
      { pub: 'Fine MJ et al. NEJM 1997;336:243', topic: 'PSI / PORT Score', note: 'PSI — 20 variabel, 5 kelas risiko. Standar emas stratifikasi CAP di Amerika. Kelas IV–V: rawat inap/ICU.' },
      { pub: 'Charles PGP et al. Clin Infect Dis 2008;47:375', topic: 'SMART-COP', note: 'SMART-COP: 8 variabel, prediksi kebutuhan ventilasi/vasopressor. Skor ≥5 → ICU care intensif.' },
      { pub: 'Kalil AC et al. (IDSA/ATS). Clin Infect Dis 2016;63:e61', topic: 'HAP/VAP — Guidelines', note: 'IDSA/ATS 2016: VAP = pneumonia >48 jam post-intubasi. De-eskalasi berdasar kultur. Durasi 7 hari.' },
      { pub: 'West JB. Respiratory Physiology — The Essentials. 10th ed. 2016', topic: 'A-a Gradient', note: 'A-a gradient = PAO₂ − PaO₂. Normal <10–15 mmHg (muda). Meningkat pada shunt, V/Q mismatch, diffusion impairment.' },
    ],
  },
  {
    title: '🩸 Asam-Basa, ABG & Oksigenasi',
    rows: [
      { pub: 'Berend K et al. NEJM 2014;371:1517', topic: 'Pendekatan Asam-Basa', note: '5-step systematic approach to ABG: pH → PCO₂ → HCO₃ → kompensasi → anion gap → delta-delta.' },
      { pub: 'Schwartz WB et al. NEJM 1965;272:1388', topic: "Winter's Formula", note: 'Kompensasi respiratorik: PaCO₂ ekspektasi = 1.5 × HCO₃ + 8 ± 2. Valid untuk asidosis metabolik akut.' },
      { pub: 'Roca O et al. Am J Respir Crit Care Med 2016;194:773', topic: 'ROX Index', note: 'ROX = (SpO₂/FiO₂)/RR. Prediksi kegagalan HFNC: ROX <3.85 jam ke-2, <3.47 jam ke-12.' },
      { pub: 'Khemani RG et al. Intensive Care Med 2012;38:1929', topic: 'SpO₂/FiO₂ vs P/F', note: 'SpO₂/FiO₂: pengganti P/F noninvasif. SpO₂/FiO₂ ≤235 ≈ P/F ≤200; SpO₂/FiO₂ ≤315 ≈ P/F ≤300.' },
    ],
  },
  {
    title: '💧 Cairan IV',
    rows: [
      { pub: 'Semler MW et al. (SMART trial). NEJM 2018;378:829', topic: 'Balanced vs NS — ICU', note: '14.000+ pasien ICU: balanced crystalloid (RL/Physiolyte) vs NS ↓ MAKE30. Mendukung balanced crystalloid sebagai default.' },
      { pub: 'Self WH et al. (SALT-ED trial). NEJM 2018;378:819', topic: 'Balanced vs NS — IGD', note: 'Konfirmasi SMART di setting IGD: balanced crystalloid ↓ MAKE30. Berlaku untuk volume besar.' },
      { pub: 'Finfer S et al. (SAFE trial). NEJM 2004;350:2247', topic: 'Albumin vs Saline', note: '6.997 pasien ICU: albumin vs saline — mortalitas setara secara keseluruhan. Albumin lebih baik pada subgrup sepsis berat.' },
      { pub: 'Perner A et al. (6S trial). NEJM 2012;367:124', topic: 'HES — AKI', note: 'HES 130/0.42 vs RL pada sepsis berat: HES → ↑mortalitas dan ↑RRT. HES tidak direkomendasikan di ICU.' },
      { pub: 'Hjortrup PB et al. (CLASSIC). NEJM 2022;386:2459', topic: 'Cairan Restriktif Sepsis', note: 'Restrictive strategy (stop setelah 1L post-stabilisasi) vs liberal: mortalitas serupa. Dukung minimal fluid approach.' },
    ],
  },
  {
    title: '🩸 Transfusi Darah & Hemostasis',
    rows: [
      { pub: 'Hébert PC et al. (TRICC Trial). NEJM 1999;340:409', topic: 'Transfusi Restriktif', note: 'RCT 838 pasien ICU: target Hb 7–9 g/dL (restriktif) vs 10–12 g/dL — mortalitas setara, lebih sedikit transfusi.' },
      { pub: 'Villanueva C et al. NEJM 2013;368:11', topic: 'Transfusi GI Bleeding', note: 'RCT 921 pasien perdarahan GI atas akut: threshold Hb 7 g/dL ↓ mortalitas vs threshold 9 g/dL.' },
      { pub: 'Carson JL et al. AABB Guideline. Ann Intern Med 2016;165:519', topic: 'Panduan Transfusi', note: 'AABB: Hb ≤7 g/dL pada pasien stabil (≤8 pada kardiak/post-op). FFP: tidak rutin tanpa koagulopati.' },
      { pub: 'Holcomb JB et al. (PROPPR). JAMA 2015;313:471', topic: 'Transfusi Masif', note: 'Rasio FFP:PRC:TC = 1:1:1 pada trauma massive transfusion ↓ mortalitas 24-jam dan 30-hari.' },
    ],
  },
  {
    title: '🇮🇩 Referensi Lokal Indonesia',
    rows: [
      { pub: 'PERDICI', topic: 'Panduan Ventilasi Mekanik ICU', note: 'Panduan nasional VT, mode, target ABG, weaning untuk ICU Indonesia' },
      { pub: 'PAPDI — Div. Pulmonologi', topic: 'PPK Gagal Napas Akut', note: 'Pathway intubasi, NIV indikasi, monitoring, antibiotic bundle pneumonia' },
      { pub: 'PERDICI / PAPDI 2020', topic: 'Konsensus ARDS Indonesia', note: 'Adaptasi ARDSNet untuk konteks RS Indonesia; resource allocation ICU' },
      { pub: 'PERDICI 2021', topic: 'Panduan VAP Bundle', note: 'Adaptasi VAP bundle internasional untuk kondisi ICU Indonesia: CHX oral, HOB, daily SAT' },
      { pub: 'PAPDI', topic: 'PPK Sepsis & Syok Septik', note: 'Pathway diagnosis, resusitasi cairan, vasopressor, antibiotik empiris konteks Indonesia' },
      { pub: 'PERDICI / PAPDI', topic: 'Panduan Sedasi & Analgesia ICU', note: 'Adaptasi PADIS untuk ICU Indonesia: protokol RASS, SAT, delirium CAM-ICU' },
      { pub: 'PERNEFRI', topic: 'Panduan Tatalaksana AKI', note: 'Kriteria KDIGO adaptasi lokal, indikasi RRT, CRRT di Indonesia' },
    ],
  },
]

export function Referensi() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Referensi</h1>
        <p className="text-sm text-slate-500 mt-1">Daftar Pustaka Internasional & Lokal · Guidelines Terkini</p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((sec, si) => (
          <div key={si} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === si ? null : si)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <h2 className="font-semibold text-slate-800">{sec.title}</h2>
              <span className="text-slate-400 shrink-0 ml-2">{openIdx === si ? '▲' : '▼'}</span>
            </button>

            {openIdx === si && (
              <div className="overflow-x-auto border-t border-slate-100">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold text-slate-600 w-2/5">Publikasi / Panduan</th>
                      <th className="text-left px-4 py-2 font-semibold text-slate-600 w-1/5">Topik</th>
                      <th className="text-left px-4 py-2 font-semibold text-slate-600">Update / Kesimpulan Kunci</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sec.rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-slate-700 text-xs font-medium align-top">{row.pub}</td>
                        <td className="px-4 py-2.5 align-top">
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-700 font-medium whitespace-nowrap">{row.topic}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 text-xs align-top">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
