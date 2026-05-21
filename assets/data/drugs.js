/* ============================================================
   drugs.js — ICU Helper Drug Reference Database
   Phase 1–5: 68 entries
   ============================================================ */

const ICU_DRUGS = {

"norepinefrin": {
  name: "Norepinefrin",
  brand_id: ["Vascon", "Norepinefrin Fresenius Kabi", "Norepinefrin Hameln"],
  brand_id_notes: "Vascon paling umum di Indonesia. Fresenius tersedia di RS besar.",
  class: "Katekolamin",
  subclass: "Vasopressor adrenergik",
  category: ["vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia luas di ICU seluruh Indonesia",
  mechanism: "Agonis kuat α₁ (vasokonstriksi perifer, ↑SVR) dan agonis moderat β₁ (↑kontraktilitas, ↑HR). Efek β₂ minimal. Net effect: ↑MAP dengan preservasi cardiac output.",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Syok septik — first-line vasopressor (MAP target ≥65 mmHg)", "Syok distributif refrakter cairan"],
    icu_secondary: ["Syok kardiogenik dengan vasodilatasi (kombinasi dengan dobutamin)", "Syok vasoplegi post-cardiac surgery"],
    local_guideline: "PERDICI/PAPDI Panduan Sepsis 2022: Norepinefrin lini pertama jika MAP <65 setelah resusitasi cairan 30 mL/kg",
    intl_guideline: "SSC 2024: Norepinefrin first-line. Target MAP 65 mmHg pada sepsis, 80–85 pada TBI."
  },
  contraindications: ["Hipovolemia yang belum dikoreksi (relatif)", "Hipersensitivitas terhadap sulfit (beberapa formulasi)"],
  precautions: ["Iskemia mesenterika pada dosis tinggi", "Aritmia pada pasien dengan penyakit jantung iskemik", "Ekstravasasi menyebabkan nekrosis jaringan"],
  dosing: {
    standard: "0.01–0.5 mcg/kg/min IV kontinyu",
    range_low: "0.01 mcg/kg/min",
    range_high: "2–3 mcg/kg/min (refrakter)",
    max: "3 mcg/kg/min (dosis lebih tinggi: diskusikan dengan spesialis)",
    loading: null,
    maintenance: "Titrasi setiap 5–10 menit berdasar MAP",
    route: ["IV"],
    dilution: "4 mg dalam 46 mL NS/D5W → 80 mcg/mL. Atau 8 mg dalam 92 mL → 80 mcg/mL (syringe 50 mL).",
    rate: "Hitung: (mcg/kg/min × BB × 60) / konsentrasi (mcg/mL) = mL/jam",
    titration: "Naikan 0.02–0.05 mcg/kg/min setiap 5–10 menit sampai MAP ≥65 mmHg. De-eskalasi setiap 2–4 jam jika stabil.",
    special_notes: "HANYA via vena sentral (CVC/CVP). Vena perifer: maksimum 4 jam darurat, konsentrasi ≤0.1 mg/mL."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara signifikan" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output (target >0.5 mL/kg/jam) — vasokonstriksi dapat ↓ perfusi renal"
  },
  hepatic_adjustment: {
    child_a: "Normal",
    child_b: "Normal dengan monitoring ketat",
    child_c: "Gunakan dosis minimum efektif; risiko iskemia hepatik ↑",
    note: "Metabolisme: uptake neuronal dan MAO/COMT. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas. Hindari kecuali life-threatening.",
    trimester_2: "Dapat digunakan pada syok mengancam jiwa — manfaat >> risiko",
    trimester_3: "Idem. Monitor fetal heart rate secara kontinyu.",
    labor_delivery: "Vasokonstriksi uterus dapat ↓ perfusi utero-plasenta.",
    fetal_risk: "Vasokonstriksi uterus → risiko fetal distress pada dosis tinggi",
    lactation: "Data tidak ada. Hindari menyusui selama penggunaan.",
    lactation_note: "Waktu paruh pendek (~2 menit); jika harus menyusui, tunggu 4–6 jam setelah stop."
  },
  monitoring: {
    efficacy: ["MAP setiap 5–15 menit selama titrasi", "Laktat arteri setiap 2–4 jam (target <2 mmol/L)", "Urin output setiap jam (target >0.5 mL/kg/jam)"],
    safety: ["Tanda iskemia perifer: jari pucat, mottled skin", "EKG: aritmia", "Tanda ekstravasasi di area infus"],
    frequency: "Continuous hemodynamic monitoring",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Iskemia distal (jari tangan/kaki, hidung) — terutama dosis tinggi", "Aritmia ventrikel", "Nekrosis jaringan berat akibat ekstravasasi"],
    common: ["Hipertensi", "Bradikardi refleks", "Sakit kepala", "Ansietas"],
    antidote: "Ekstravasasi: Fentolamin 5 mg dilarutkan dalam 9 mL NS → injeksi subkutan di area ekstravasasi"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi fatal", management: "Kontraindikasi absolut. Tunggu 14 hari setelah stop MAOI." }
    ],
    moderate: [
      { drug: "β-blocker", effect: "Blok efek β₁ → hipertensi tanpa kompensasi HR" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "norepinefrin",
  evidence: [
    { ref_id: "ssc2024", note: "First-line vasopressor syok septik, MAP ≥65" }
  ]
},

"meropenem": {
  name: "Meropenem",
  brand_id: ["Meronem", "Meropenem Dexa Medica", "Granem", "Meropenem Kalbe"],
  brand_id_notes: "Meronem (AstraZeneca) brand originator. Generik lokal lebih umum di RS pemerintah.",
  class: "Antibiotik β-laktam",
  subclass: "Karbapenem",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di seluruh RS Indonesia. Termasuk obat formularium nasional.",
  mechanism: "Inhibisi sintesis dinding sel bakteri melalui ikatan dengan Penicillin-Binding Proteins (PBP). Lebih stabil terhadap DHP-1 renal dibanding imipenem.",
  pkpd_type: "time_dependent",
  pkpd_note: "Target T>MIC ≥40% (bakteriostatik) hingga ≥100% (bakterisidal optimal). Extended infusion 3–4 jam untuk patogen resisten.",
  spectrum: {
    gram_pos: "Streptokokus (baik), Enterokokus (moderat), Stafilokokus sensitif penisilin",
    gram_neg: "Sangat baik: Enterobacteriaceae (termasuk ESBL+), Pseudomonas aeruginosa (variabel)",
    anaerob: "Baik: Bacteroides fragilis dan anaerob lainnya",
    mrsa: false,
    vre: false,
    esbl: true,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["Sepsis berat/syok septik sumber tidak jelas (empiris)", "VAP/HAP berat dengan risiko Pseudomonas atau MDR", "Infeksi intra-abdominal kompleks"],
    icu_secondary: ["Febrile neutropenia (high-risk)", "Infeksi ESBL-producing Enterobacteriaceae", "Meningitis bakteri (dosis tinggi 2g/8jam)"],
    local_guideline: "PERDICI 2022: Lini kedua/empiris berat jika risiko MDR. Panduan VAP PERDICI 2021.",
    intl_guideline: "IDSA HAP/VAP 2016: Karbapenem untuk late-onset VAP atau risiko MDR. ESCMID 2023: Extended infusion direkomendasikan untuk MIC tinggi."
  },
  contraindications: ["Hipersensitivitas terhadap karbapenem", "Riwayat anafilaksis terhadap penisilin (risiko cross-reaktivitas ~1%)"],
  precautions: ["Risiko kejang meningkat pada dosis tinggi + eGFR rendah", "Penggunaan bersama asam valproat: ↓ kadar valproat → kejang"],
  dosing: {
    standard: "1g IV setiap 8 jam (infeksi berat)",
    range_low: "500mg IV setiap 8 jam",
    range_high: "2g IV setiap 8 jam (Pseudomonas, meningitis)",
    max: "2g setiap 8 jam (6g/hari)",
    loading: null,
    maintenance: "Dosis standar sesuai indikasi",
    route: ["IV"],
    dilution: "500mg atau 1g dalam 50–100 mL NS. Stabil 4–8 jam suhu ruang.",
    rate: "Infus standar: 15–30 menit. Extended infusion: 3–4 jam untuk MIC >2 mg/L.",
    titration: null,
    special_notes: "Extended infusion: larutkan dalam 100–250 mL NS. Superior pada Pseudomonas/Acinetobacter dengan MIC borderline."
  },
  renal_adjustment: {
    ge60:   { dose: "1–2g",  interval: "q8j",  note: "Dosis penuh" },
    r30_60: { dose: "1g",    interval: "q12j", note: "Kurangi frekuensi" },
    r15_30: { dose: "500mg", interval: "q12j", note: "Kurangi dosis dan frekuensi" },
    r_lt15: { dose: "500mg", interval: "q24j", note: "Monitor neurotoksisitas ketat" },
    hd:     { dose: "500mg", interval: "q24j", note: "Berikan SETELAH sesi HD. Suplementasi 500mg post-HD." },
    crrt:   { dose: "500mg–1g", interval: "q12j", note: "Sesuaikan dengan effluent rate CRRT." },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Tanda neurotoksisitas (myoklonus, kejang) jika eGFR <30 dan dosis tidak diturunkan"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian dosis pada gangguan fungsi hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Data hewan: tidak teratogenik. Gunakan jika indikasi kuat.",
    trimester_2: "Dapat digunakan.",
    trimester_3: "Dapat digunakan.",
    labor_delivery: "Dapat digunakan pada infeksi berat intrapartum",
    fetal_risk: "Tidak ada bukti teratogenisitas pada dosis terapeutik",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil (<0.2%). Umumnya aman.",
    lactation_note: "Monitor bayi untuk diare atau rash."
  },
  monitoring: {
    efficacy: ["Suhu dan tanda klinis setiap 12–24 jam", "Procalcitonin (PCT) setiap 48–72 jam", "Hasil kultur dan sensitivitas"],
    safety: ["Fungsi ginjal (kreatinin) setiap 48 jam", "Tanda neurotoksisitas jika eGFR rendah", "Kadar valproat jika pakai antikonvulsan"],
    frequency: "Kultur darah sebelum mulai. Evaluasi klinis 48–72 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Kejang (dosis tinggi + eGFR rendah)", "Anafilaksis (jarang, <0.01%)"],
    common: ["Diare / C. difficile colitis", "↑ LFT transien", "Tromboflebitis lokasi infus"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Asam Valproat", effect: "Meropenem ↓ kadar valproat 50–100% → risiko kejang breakthrough", management: "Hindari kombinasi jika memungkinkan. Monitor kadar valproat." }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["Sepsis berat/syok septik", "VAP late-onset (≥5 hari)", "Infeksi intra-abdominal kompleks"],
    deescalation_to: ["seftriakson", "ampi_sulbaktam"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "VAP: 7 hari. Infeksi abdomen terkontrol: 4–5 hari.",
    stop_criteria: "PCT turun >80% dari baseline, atau absolut <0.5 ng/mL + perbaikan klinis",
    avoid_for: ["CAP ringan-sedang tanpa risiko MDR", "Profilaksis operasi"],
    local_pattern_note: "Resistensi Pseudomonas terhadap karbapenem di ICU Indonesia: 20–40%. Periksa antibiogram lokal."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Antibiotik empiris sepsis berat dalam 1 jam" }
  ]
},

"kcl_konsentrat": {
  name: "Kalium Klorida (KCl) 7.46% — Konsentrat",
  brand_id: ["KCl 7.46% Otsuka", "Kalium Klorida Ikhapharmindo", "KCl Dexa"],
  brand_id_notes: "Tersedia luas. WAJIB diencerkan — TIDAK BOLEH diberikan undiluted.",
  class: "Elektrolit",
  subclass: "Suplemen kalium",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Termasuk daftar obat high-alert ISMP.",
  mechanism: "Menggantikan defisit kalium. Esensial untuk potensial aksi membran dan kontraksi otot.",
  pkpd_type: null,
  pkpd_note: "Setiap 1 mEq/L penurunan K serum ≈ defisit 100–200 mEq total body K.",
  spectrum: null,
  indications: {
    icu_primary: ["Hipokalemia sedang (K 2.5–3.0 mEq/L) dengan gejala atau EKG changes", "Hipokalemia berat (K <2.5 mEq/L) — IV wajib"],
    icu_secondary: ["Hipokalemia refrakter (koreksi setelah Mg dikoreksi terlebih dahulu)", "Pemeliharaan K pada pasien TPN"],
    local_guideline: "PERDICI: Koreksi K IV via CVC. Rate aman ≤20 mEq/jam sentral, ≤10 mEq/jam perifer.",
    intl_guideline: "Kraft MD. AJHSP 2005: Panduan komprehensif koreksi elektrolit ICU."
  },
  contraindications: ["Hiperkalemia (K ≥5.0 mEq/L)", "Anuria/oliguria berat tanpa monitoring ketat"],
  precautions: ["Gagal ginjal: akumulasi K — kurangi dosis 50%", "Digitalis: hipokalemia meningkatkan toksisitas digoksin"],
  dosing: {
    standard: "10–20 mEq dalam 100 mL NS, infus 1–2 jam",
    range_low: "10 mEq/100 mL NS",
    range_high: "40 mEq dalam 200 mL NS (via CVC, emergensi)",
    max: "Sentral: 20–40 mEq/jam. Perifer: 10 mEq/jam, konsentrasi ≤40 mEq/L",
    loading: null,
    maintenance: "Sesuai hasil K serial. Target K 3.5–5.0 mEq/L.",
    route: ["IV"],
    dilution: "WAJIB diencerkan. KCl 7.46% = 1 mEq/mL. Encerkan ke ≤80 mEq/L (CVC) atau ≤40 mEq/L (perifer).",
    rate: "Sentral: maks 20 mEq/jam dengan monitoring EKG. Perifer: maks 10 mEq/jam.",
    titration: "Cek K serum setiap 2 jam selama koreksi aktif. Stop jika K ≥3.8 mEq/L.",
    special_notes: "Koreksi Mg DULU jika Mg <1.7 mg/dL — hipokalemia refrakter tanpa normomagnesia."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25–50%", interval: "Monitor lebih ketat", note: "Cek K setiap 1–2 jam" },
    r15_30: { dose: "Kurangi 50%", interval: "Monitor setiap 1 jam", note: "Risiko akumulasi K tinggi" },
    r_lt15: { dose: "Dosis minimal 5–10 mEq dengan monitoring EKG kontinyu", interval: "Cek K setiap 30–60 menit", note: "Pertimbangkan RRT jika K sulit dikontrol" },
    hd:     { dose: "Hindari jika K >4.5 sebelum HD", interval: "Post-HD: monitor K", note: "HD menurunkan K secara efektif" },
    crrt:   { dose: "Monitor K setiap 4–6 jam", interval: "Mungkin perlu suplementasi rutin", note: "Dialysate K-free dapat menyebabkan hipokalemia" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "EKG kontinyu, K serum setiap 1–2 jam, waspadai hiperkalemia"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Hati-hati — sirosis sering disertai gangguan K",
    note: "Tidak dimetabolisme hepatik."
  },
  pregnancy: {
    fda_category: "A",
    trimester_1: "Aman — suplemen esensial",
    trimester_2: "Aman",
    trimester_3: "Aman — monitor K normal",
    labor_delivery: "Aman pada kadar fisiologis",
    fetal_risk: "Tidak ada risiko pada dosis terapeutik",
    lactation: "Aman — K adalah komponen normal ASI",
    lactation_note: "Tidak memerlukan pembatasan menyusui."
  },
  monitoring: {
    efficacy: ["K serum setiap 2 jam selama koreksi aktif", "Gejala hipokalemia: kelemahan otot, kram, palpitasi"],
    safety: ["EKG kontinyu (lead II) selama koreksi K >10 mEq/jam", "Tanda hiperkalemia: peaked T wave, PR prolongasi, wide QRS"],
    frequency: "Cek K serum setiap 2 jam selama infus. EKG sebelum dan sesudah koreksi.",
    therapeutic_range: "Target K serum 3.5–5.0 mEq/L (ICU: 4.0–4.5 lebih aman)"
  },
  adverse_effects: {
    critical: ["Hiperkalemia → cardiac arrest (VF/asistol) jika overdosis atau terlalu cepat", "Cardiac arrest dari pemberian bolus undiluted"],
    common: ["Iritasi vena (flebitis) jika perifer", "Rasa terbakar di lokasi infus"],
    antidote: "Hiperkalemia: Kalsium glukonat 10% 10–20 mL IV + Insulin 10 unit + D50 + pertimbangkan HD"
  },
  interactions: {
    major: [
      { drug: "Digoksin", effect: "Hipokalemia meningkatkan toksisitas digoksin", management: "Jaga K ≥4.0 mEq/L pada pasien digoksin" },
      { drug: "ACE Inhibitor / ARB / Spironolakton", effect: "↑ risiko hiperkalemia", management: "Monitor K ketat, kurangi dosis koreksi" }
    ],
    moderate: [
      { drug: "NSAID", effect: "↓ ekskresi K renal → risiko akumulasi" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ TIDAK BOLEH diberikan undiluted/bolus — menyebabkan CARDIAC ARREST",
    "⛔ HANYA via vena sentral jika >40 mEq/L atau rate >10 mEq/jam",
    "⛔ Selalu encerkan dalam minimal 100 mL sebelum diberikan",
    "⚠ Monitor EKG kontinyu jika rate >10 mEq/jam",
    "⚠ Koreksi Mg terlebih dahulu jika hipokalemia refrakter"
  ],
  high_alert_protocol: "Verifikasi ganda (double-check) oleh 2 perawat sebelum pemberian. Label merah pada infus.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "kraft2005", note: "Panduan koreksi elektrolit ICU dewasa komprehensif" }
  ]
},

"epinefrin": {
  name: "Epinefrin (Adrenalin)",
  brand_id: ["Adrenalin", "Epinefrin Hameln", "Epinefrin Fahrenheit"],
  brand_id_notes: "Ampul 1 mg/mL (1:1000). Sering tersedia di semua RS.",
  class: "Katekolamin",
  subclass: "Vasopressor & inotropik adrenergik",
  category: ["vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU dan UGD Indonesia",
  mechanism: "Agonis kuat α₁ (vasokonstriksi, ↑SVR), β₁ (↑HR, ↑kontraktilitas), β₂ (bronkodilatasi, vasodilatasi muskuloskeletal). Dosis rendah (<0.1 mcg/kg/min): dominan β. Dosis tinggi: dominan α.",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Syok anafilaktik — lini pertama (IM 0.3–0.5 mg)", "Henti jantung (VF/pVT/PEA/asistol) — ACLS"],
    icu_secondary: ["Syok septik refrakter norepinefrin (add-on)", "Syok kardiogenik dengan cardiac output rendah", "Bronkospasme berat refrakter inhalasi"],
    local_guideline: "AHA ACLS 2020: Epinefrin 1 mg IV/IO setiap 3–5 menit pada henti jantung",
    intl_guideline: "SSC 2024: Epinefrin sebagai vasopressor ke-2 jika norepinefrin tidak cukup. WAO 2020: IM epinefrin lini pertama anafilaksis."
  },
  contraindications: ["Tidak ada kontraindikasi absolut pada kondisi mengancam jiwa", "Hipertiroidisme berat (relatif)", "Feokromositoma (relatif)"],
  precautions: ["Aritmia berat — monitor EKG kontinyu", "Iskemia miokard — hindari takikardia berlebih", "Hipertensi berat"],
  dosing: {
    standard: "Infus ICU: 0.01–0.5 mcg/kg/min IV kontinyu",
    range_low: "0.01 mcg/kg/min",
    range_high: "1 mcg/kg/min (refrakter)",
    max: "Tidak ada batas mutlak — titrasi per respons",
    loading: "Anafilaksis: 0.3–0.5 mg IM paha lateral (1:1000). ACLS: 1 mg IV/IO bolus.",
    maintenance: "Titrasi infus setiap 5–10 menit",
    route: ["IV", "IM", "IO", "Intratrakheal (darurat)"],
    dilution: "1 mg dalam 49 mL NS → 20 mcg/mL. Atau 4 mg dalam 46 mL → 80 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / konsentrasi = mL/jam",
    titration: "Titrasi bertahap. MAP target ≥65 mmHg.",
    special_notes: "HANYA via CVC untuk infus kontinu. IM paha lateral > IM lengan pada anafilaksis."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor urin output — vasokonstriksi dapat ↓ perfusi renal"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme: MAO dan COMT. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali mengancam jiwa",
    trimester_2: "Gunakan jika indikasi anafilaksis/henti jantung",
    trimester_3: "Idem — manfaat >> risiko pada kondisi kritis",
    labor_delivery: "Dapat menyebabkan vasokonstriksi uterus",
    fetal_risk: "Vasokonstriksi uterus, aritmia fetal pada dosis tinggi",
    lactation: "Tidak ada data. Hindari menyusui selama penggunaan.",
    lactation_note: "Waktu paruh sangat pendek (~2 menit)"
  },
  monitoring: {
    efficacy: ["MAP setiap 5 menit selama titrasi", "HR kontinyu — hindari takikardia >120 bpm jika bisa"],
    safety: ["EKG kontinyu — aritmia", "Tanda iskemia perifer", "Glukosa darah — epinefrin → hiperglikemia"],
    frequency: "Monitoring hemodinamik kontinyu",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Takiaritmia berat (AF, VT)", "Iskemia miokard", "Nekrosis akibat ekstravasasi"],
    common: ["Takikardia", "Hipertensi", "Ansietas", "Tremor", "Hiperglikemia"],
    antidote: "Ekstravasasi: Fentolamin 5 mg subkutan di area ekstravasasi"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi fatal", management: "Kontraindikasi absolut" },
      { drug: "β-blocker non-selektif", effect: "Hipertensi paradoksal + bradikardia berat", management: "Pertimbangkan α-blocker terlebih dahulu" }
    ],
    moderate: [
      { drug: "Antidepresan trisiklik", effect: "Potensiasi efek simpatomimetik" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "epinefrin",
  evidence: [
    { ref_id: "ssc2024", note: "Vasopressor ke-2 syok septik refrakter norepinefrin" }
  ]
},

"dopamin": {
  name: "Dopamin",
  brand_id: ["Dopamin Hameln", "Dopamine Fresenius", "Giludop"],
  brand_id_notes: "Tersedia luas. Ampul 200 mg/5 mL.",
  class: "Katekolamin",
  subclass: "Vasopressor dopaminergik",
  category: ["vasopressor", "inotropik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia",
  mechanism: "Dosis-dependen: Renal (<3 mcg/kg/min): agonis DA1 → vasodilatasi renal, ↑ diuresis. Kardiak (3–10): agonis β₁ → ↑kontraktilitas, ↑HR. Vasopressor (>10): agonis α₁ → vasokonstriksi, ↑MAP. Catatan: 'dosis renal' tidak terbukti secara klinis melindungi ginjal.",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Syok kardiogenik dengan bradikardia (dopamin > norepinefrin)", "Bradikardia simtomatik refrakter atropin (dosis inotropik)"],
    icu_secondary: ["Alternatif norepinefrin bila tidak tersedia (syok septik)", "Syok kardiogenik — dosis inotropik 5–10 mcg/kg/min"],
    local_guideline: "PERDICI: Dopamin tidak lagi first-line syok septik. SSC 2016+ merekomendasikan norepinefrin.",
    intl_guideline: "SSC 2024: Dopamin hanya untuk subset syok septik dengan bradikardia atau disfungsi sistolik berat. ACLS 2020: Infus dopamin 2–10 mcg/kg/min untuk bradikardia simtomatik."
  },
  contraindications: ["Feokromositoma", "Fibrilasi ventrikel", "Hipovolemia tidak terkoreksi"],
  precautions: ["Risiko takiaritmia lebih tinggi dibanding norepinefrin", "Ekstravasasi: nekrosis jaringan", "Gangguan sirkulasi perifer berat"],
  dosing: {
    standard: "2–20 mcg/kg/min IV kontinyu",
    range_low: "1–3 mcg/kg/min (efek dopaminergik/diuresis)",
    range_high: "10–20 mcg/kg/min (vasopressor penuh)",
    max: "20–50 mcg/kg/min (sangat refrakter, jarang)",
    loading: null,
    maintenance: "Titrasi sesuai MAP dan HR target",
    route: ["IV"],
    dilution: "200 mg dalam 50 mL NS/D5W → 4000 mcg/mL. Atau 200 mg dalam 250 mL → 800 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 4000 = mL/jam (konsentrasi 4000 mcg/mL)",
    titration: "Naikan 1–4 mcg/kg/min setiap 10–30 menit per respons klinis",
    special_notes: "HANYA via CVC. Tidak direkomendasikan sebagai first-line vasopressor syok septik (SSC 2024)."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor HR ketat" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Monitor aritmia — akumulasi metabolit" },
    hd:     { dose: "Normal", interval: "Normal", note: "Sedikit terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output — 'dosis renal' tidak terbukti nefroprotektif"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme: MAO dan COMT."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Gunakan hanya jika indikasi kuat",
    trimester_3: "Idem — risiko vasokonstriksi uterus",
    labor_delivery: "Monitor fetal heart rate",
    fetal_risk: "Vasokonstriksi uterus pada dosis tinggi",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["MAP target ≥65 mmHg", "HR — hindari >120 bpm", "Urin output"],
    safety: ["EKG kontinyu — aritmia lebih sering vs norepinefrin", "Tanda ekstravasasi"],
    frequency: "Continuous hemodynamic monitoring",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Takiaritmia (AF, SVT, VT) — lebih sering dari norepinefrin", "Nekrosis jaringan berat akibat ekstravasasi"],
    common: ["Takikardia", "Nausea/vomiting", "Sakit kepala", "Ansietas"],
    antidote: "Ekstravasasi: Fentolamin 5 mg dalam 9 mL NS subkutan"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi fatal", management: "Kontraindikasi — tunggu 14 hari" },
      { drug: "Fenitoin IV", effect: "Hipotensi berat dan bradikardia", management: "Hindari kombinasi" }
    ],
    moderate: []
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "dopamin",
  evidence: [
    { ref_id: "ssc2024", note: "Tidak lagi first-line; dipertimbangkan pada syok dengan bradikardia" }
  ]
},

"vasopressin": {
  name: "Vasopressin (ADH)",
  brand_id: ["Vasopressin Hameln", "Pitressin", "Empressin"],
  brand_id_notes: "Tersedia di RS besar Indonesia. Ampul 20 IU/mL.",
  class: "Vasopresin endogen",
  subclass: "Non-adrenergik vasopressor",
  category: ["vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia di ICU RS rujukan. Ketersediaan terbatas di daerah.",
  mechanism: "Agonis reseptor V1 (vasokonstriksi otot polos vaskular, ↑SVR) dan V2 (retensi air renal). Mekanisme independen dari katekolamin — efektif pada syok yang relatif kehabisan vasopresin endogen. Tidak menyebabkan takikardia.",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Syok septik refrakter — add-on norepinefrin untuk spare dose katekolamin (VASST trial)", "Vasoplegia post-cardiac surgery"],
    icu_secondary: ["Diabetes insipidus sentral (dosis berbeda: 5–10 IU IM/IV)", "Perdarahan varises esofagus (terlipressin lebih sering digunakan)"],
    local_guideline: "PERDICI: Vasopressin 0.03 IU/min sebagai add-on norepinefrin pada syok septik refrakter",
    intl_guideline: "SSC 2024: Tambahkan vasopressin 0.03 IU/min jika norepinefrin ≥0.25 mcg/kg/min untuk target MAP."
  },
  contraindications: ["Syok kardiogenik tanpa vasopressor (relatif — ↓CO)", "Penyakit vaskular perifer berat (relatif)"],
  precautions: ["Iskemia koroner — vasokonstriksi koroner mungkin terjadi", "Hiponatremia — efek V2 retensi air", "Tidak dititrasi seperti katekolamin — dosis tetap"],
  dosing: {
    standard: "0.03–0.04 IU/min IV kontinyu (tetap, tidak dititrasi)",
    range_low: "0.01 IU/min",
    range_high: "0.04 IU/min (jarang >0.04)",
    max: "0.06 IU/min (dosis tinggi → iskemia)",
    loading: null,
    maintenance: "Dosis tetap — tidak dititrasi naik seperti katekolamin",
    route: ["IV"],
    dilution: "20 IU dalam 50 mL NS → 0.4 IU/mL. 0.03 IU/min = 4.5 mL/jam.",
    rate: "0.03 IU/min × 60 / 0.4 IU/mL = 4.5 mL/jam",
    titration: "TIDAK dititrasi seperti katekolamin. Tambahkan/kurangi norepinefrin sebagai vasopressor utama.",
    special_notes: "Dosis >0.04 IU/min meningkatkan risiko iskemia miokard dan digital. Selalu via CVC."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor Na+ — efek antidiuretik" },
    r_lt15: { dose: "Pertimbangkan dosis lebih rendah", interval: "Normal", note: "Risiko hiponatremia lebih tinggi" },
    hd:     { dose: "Normal", interval: "Normal", note: "" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Natrium serum, urin output, tanda retensi cairan berlebih"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — varises risiko perdarahan", child_c: "Hati-hati",
    note: "Degradasi oleh vasopressinase — tidak bergantung hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Gunakan hanya jika mutlak perlu",
    trimester_3: "Dapat menstimulasi kontraksi uterus",
    labor_delivery: "Risiko induksi kontraksi uterus",
    fetal_risk: "Vasokonstriksi uteroplasenta",
    lactation: "Data terbatas.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["MAP setiap 15–30 menit", "Respons terhadap penurunan kebutuhan norepinefrin"],
    safety: ["Na+ serum setiap 6–12 jam (hiponatremia)", "Tanda iskemia: EKG, nyeri dada", "Tanda iskemia perifer"],
    frequency: "Monitoring hemodinamik kontinyu",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Iskemia miokard", "Iskemia digital/mesenterika pada dosis tinggi", "Hiponatremia berat"],
    common: ["Bradikardia refleks", "Pucat kulit", "Retensi air/hiponatremia", "Nausea"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Indometasin", effect: "Potensiasi efek antidiuretik vasopressin → hiponatremia" },
      { drug: "Katekolamin dosis tinggi", effect: "Vasokonstriksi berlebih → iskemia" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Add-on vasopressin 0.03 IU/min bila NE ≥0.25 mcg/kg/min" }
  ]
},

"dobutamin": {
  name: "Dobutamin",
  brand_id: ["Dobutamin Hameln", "Inotrop", "Dobutamin Fresenius"],
  brand_id_notes: "Tersedia di ICU Indonesia. Ampul 250 mg/20 mL.",
  class: "Katekolamin sintetik",
  subclass: "Inotropik selektif β₁",
  category: ["inotropik", "vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia",
  mechanism: "Agonis selektif β₁ (↑kontraktilitas, ↑HR) dan β₂ ringan (vasodilatasi ringan, ↓SVR). Efek α sangat minimal. Net: ↑CO, sedikit ↓SVR. Tidak meningkatkan MAP secara langsung — bahkan dapat menurunkan pada dosis tinggi.",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Syok kardiogenik dengan cardiac output rendah dan SVR tinggi", "Dekompensasi akut gagal jantung dengan hipoperfusi"],
    icu_secondary: ["Kombinasi dengan norepinefrin: syok septik dengan disfungsi miokard (EF <40%)", "Stress echocardiography (dosis rendah 5–20 mcg/kg/min)"],
    local_guideline: "PERDICI/PERKI: Dobutamin untuk syok kardiogenik. Monitor CO/ScvO₂ untuk panduan titrasi.",
    intl_guideline: "ESC HF 2021: Dobutamin 2–20 mcg/kg/min pada dekompensasi akut dengan CO rendah. SSC 2024: Tambahkan dobutamin pada syok septik dengan disfungsi miokard."
  },
  contraindications: ["Stenosis aorta berat (obstruksi alur keluar) — meningkatkan gradient", "Kardiomiopati hipertrofik obstruktif", "Hipovolemia tidak terkoreksi"],
  precautions: ["Takikardia — dapat memperburuk iskemia miokard", "Aritmia atrial — gunakan hati-hati pada AF (meningkatkan ventricular rate)", "Toleransi setelah 72 jam penggunaan terus-menerus (down-regulation β)"],
  dosing: {
    standard: "2–20 mcg/kg/min IV kontinyu",
    range_low: "2–5 mcg/kg/min (inotropik ringan)",
    range_high: "15–20 mcg/kg/min (inotropik maksimal)",
    max: "40 mcg/kg/min (sangat jarang, risiko aritmia tinggi)",
    loading: null,
    maintenance: "Titrasi berdasar CO/ScvO₂/tanda perfusi",
    route: ["IV"],
    dilution: "250 mg dalam 50 mL NS/D5W → 5000 mcg/mL. Atau 250 mg dalam 250 mL → 1000 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 5000 = mL/jam",
    titration: "Naikan 2.5 mcg/kg/min setiap 10–15 menit. Target ScvO₂ >70% atau CI >2.2 L/min/m².",
    special_notes: "TIDAK meningkatkan MAP — jika hipotensi, tambahkan vasopressor (norepinefrin). Toleransi tachyphylaxis setelah 48–72 jam."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Monitor aritmia" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output sebagai marker CO. Monitor elektrolit."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme oleh COMT. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Data hewan aman. Gunakan jika indikasi kuat.",
    trimester_2: "Dapat digunakan pada syok kardiogenik",
    trimester_3: "Idem",
    labor_delivery: "Monitor fetal heart rate",
    fetal_risk: "Takikardia fetal mungkin terjadi",
    lactation: "Data tidak ada.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Cardiac output/index (target CI >2.2 L/min/m²)", "ScvO₂ (target >70%)", "Klirens laktat", "Urin output"],
    safety: ["EKG kontinyu — takiaritmia", "HR — hindari >120 bpm", "MAP — waspadai penurunan"],
    frequency: "Monitoring hemodinamik invasif direkomendasikan",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Takiaritmia (AF, VT)", "Memperburuk iskemia miokard pada dosis tinggi"],
    common: ["Takikardia", "Palpitasi", "Sakit kepala", "Nausea", "Hipotensi (efek β₂)"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "β-blocker", effect: "Antagonis efek inotropik — ↓ efektivitas dobutamin", management: "Jika harus diberikan, pertimbangkan dosis lebih tinggi atau agen lain" }
    ],
    moderate: [
      { drug: "Halothane / anestesi volatile", effect: "Potensiasi aritmia ventrikel" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "dobutamin",
  evidence: [
    { ref_id: "ssc2024", note: "Tambahkan dobutamin jika disfungsi miokard + CO rendah pada sepsis" }
  ]
},

"milrinon": {
  name: "Milrinon",
  brand_id: ["Primacor", "Milrinon Hameln", "Milrinon Hospira"],
  brand_id_notes: "Tersedia terbatas di RS besar/jantung Indonesia. Ampul 10 mg/10 mL.",
  class: "Inhibitor Fosfodiesterase III (PDE3i)",
  subclass: "Inodilator",
  category: ["vasopressor"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan terbatas — RS jantung dan ICU tersier",
  mechanism: "Inhibisi PDE3 → ↑cAMP intrasel → ↑kontraktilitas miokard (inotropik positif) + vasodilatasi sistemik dan pulmonal (↓SVR, ↓PVR). Mekanisme independen dari β-adrenergik — efektif pada pasien dengan β-blocker atau down-regulated β-receptor.",
  pkpd_type: null,
  pkpd_note: "Waktu paruh 2–3 jam. Ekskresi utama renal (85%). Akumulasi signifikan pada gagal ginjal.",
  spectrum: null,
  indications: {
    icu_primary: ["Syok kardiogenik dengan SVR tinggi refrakter dobutamin", "Gagal jantung akut dengan hipertensi pulmonal signifikan (↓PVR)", "Post-cardiac surgery low cardiac output syndrome"],
    icu_secondary: ["Pasien dengan β-blocker kronik — inotropik non-adrenergik", "Bridge ke LVAD atau transplantasi jantung"],
    local_guideline: "PERKI: Milrinon untuk syok kardiogenik refrakter atau hipertensi pulmonal berat",
    intl_guideline: "ESC HF 2021: Milrinon 0.375–0.75 mcg/kg/min pada syok kardiogenik, terutama bila pasien dalam β-blocker. AHA/ACC 2022 HF Guidelines: Level IIb."
  },
  contraindications: ["Stenosis aorta/pulmonal berat (obstruksi alur keluar)", "Hipovolemia tidak terkoreksi", "Syok hipovolemik"],
  precautions: ["Aritmia atrial dan ventrikel", "Hipotensi — vasodilatasi bermakna", "Gagal ginjal: akumulasi bermakna — kurangi dosis"],
  dosing: {
    standard: "0.375–0.75 mcg/kg/min IV kontinyu (tanpa loading di ICU)",
    range_low: "0.125–0.25 mcg/kg/min",
    range_high: "0.75 mcg/kg/min",
    max: "0.75 mcg/kg/min",
    loading: "50 mcg/kg selama 10 menit (sering dihindari di ICU — menyebabkan hipotensi akut)",
    maintenance: "0.375–0.5 mcg/kg/min, titrasi per CO dan MAP",
    route: ["IV"],
    dilution: "10 mg dalam 40 mL NS/D5W → 200 mcg/mL. Atau 20 mg dalam 80 mL → 200 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 200 = mL/jam",
    titration: "Tanpa loading — mulai maintenance langsung. Titrasi setiap 2–4 jam.",
    special_notes: "Hindari loading dose di ICU akut — menyebabkan hipotensi berat. Akumulasi bermakna pada eGFR <30."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal",            interval: "Normal", note: "" },
    r30_60: { dose: "0.25–0.375 mcg/kg/min", interval: "Normal", note: "Kurangi 25–50%" },
    r15_30: { dose: "0.2–0.3 mcg/kg/min",    interval: "Normal", note: "Kurangi 50%, monitor ketat" },
    r_lt15: { dose: "0.1–0.2 mcg/kg/min",    interval: "Normal", note: "Kurangi 75% — akumulasi bermakna" },
    hd:     { dose: "0.1 mcg/kg/min",         interval: "Normal", note: "Sedikit terdialisis. Monitor hipotensi." },
    crrt:   { dose: "0.2–0.25 mcg/kg/min",    interval: "Normal", note: "Monitoring ketat" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Tanda akumulasi: hipotensi berat, aritmia. Periksa kreatinin setiap 12 jam."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal dengan monitoring", child_c: "Hati-hati — data terbatas",
    note: "Metabolisme: minimal hepatik (12%). Utama ekskresi renal."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas",
    trimester_2: "Gunakan hanya emergensi",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Data tidak memadai",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Cardiac index (target >2.2 L/min/m²)", "ScvO₂", "Tekanan pulmonal jika ada kateter PA", "Klirens laktat"],
    safety: ["EKG kontinyu — aritmia supraventrikel dan ventrikel", "MAP — waspadai hipotensi berat", "Kreatinin setiap 12–24 jam"],
    frequency: "Monitoring hemodinamik invasif direkomendasikan",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Aritmia ventrikel (VT/VF) — dosis tinggi", "Hipotensi berat terutama dengan loading"],
    common: ["Sakit kepala", "Hipotensi", "Aritmia supraventrikel (AF/flutter)"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Furosemid", effect: "Presipitat jika dicampur dalam satu line — jangan campurkan" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Alternatif dobutamin pada pasien β-blocker atau down-regulated β-receptor" }
  ]
},

"levosimendan": {
  name: "Levosimendan",
  brand_id: ["Simdax"],
  brand_id_notes: "Simdax (Orion Pharma). Tersedia sangat terbatas di Indonesia. Harga tinggi.",
  class: "Sensitizer Kalsium",
  subclass: "Inodilator kalsium-sensitizing",
  category: ["vasopressor"],
  common_in_id: false,
  common_in_id_note: "Sangat terbatas — hanya RS tersier jantung Indonesia",
  mechanism: "Berikatan dengan troponin C → meningkatkan sensitivitas filamen kontraktil terhadap kalsium → ↑kontraktilitas tanpa ↑kalsium intrasel (tidak proaritmik). Membuka kanal KATP vaskular → vasodilatasi koroner dan sistemik (↓SVR, ↓PVR). Efek berlangsung 7–9 hari via metabolit aktif (OR-1896).",
  pkpd_type: null,
  pkpd_note: "Metabolit aktif OR-1896: t½ 70–80 jam. Efek berlanjut 7–9 hari setelah infus 24 jam — memungkinkan intermittent dosing.",
  spectrum: null,
  indications: {
    icu_primary: ["Syok kardiogenik refrakter dobutamin/milrinon", "Dekompensasi akut gagal jantung berat dengan CO rendah"],
    icu_secondary: ["Post-cardiac surgery LCOS (Low Cardiac Output Syndrome)", "Weaning dari ECMO/IABP", "Kardioproteksi peri-operatif (off-label)"],
    local_guideline: "Belum ada guideline lokal spesifik. Merujuk ESC.",
    intl_guideline: "ESC HF 2021: Levosimendan atau milrinon pada syok kardiogenik, terutama post-β-blocker. ESC/EACTS 2022 cardiac surgery: pertimbangkan levosimendan LCOS."
  },
  contraindications: ["Hipotensi berat (SBP <85 mmHg) — tanpa vasopressor backup", "Stenosis aorta/pulmonal berat", "Gagal ginjal berat (eGFR <30) — akumulasi metabolit"],
  precautions: ["Hipotensi — efek vasodilator kuat", "Aritmia — lebih jarang dari catecholamine tapi mungkin", "Hipokalemia meningkatkan risiko aritmia"],
  dosing: {
    standard: "0.05–0.2 mcg/kg/min IV selama 24 jam",
    range_low: "0.05–0.1 mcg/kg/min",
    range_high: "0.2 mcg/kg/min",
    max: "0.2 mcg/kg/min",
    loading: "6–12 mcg/kg IV selama 10 menit (sering dihindari di ICU kritis — hipotensi)",
    maintenance: "Infus 24 jam, kemudian stop — efek berlanjut 7–9 hari via OR-1896",
    route: ["IV"],
    dilution: "Simdax 2.5 mg/mL: encerkan ke 0.025–0.1 mg/mL dalam D5W atau NS.",
    rate: "0.1 mcg/kg/min × 70 kg × 60 / 250 mcg/mL = 1.68 mL/jam (contoh)",
    titration: "Mulai 0.05–0.1 mcg/kg/min. Naikan ke 0.2 bila toleransi baik setelah 4–6 jam.",
    special_notes: "Efek berlanjut 7–9 hari setelah infus 24 jam. Pertimbangkan intermittent weekly dosing pada HF refrakter."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal",             interval: "Normal", note: "" },
    r30_60: { dose: "Normal dengan monitoring", interval: "Normal", note: "Monitor hipotensi" },
    r15_30: { dose: "Kurangi 50%",        interval: "Normal", note: "Akumulasi OR-1896" },
    r_lt15: { dose: "Hindari",            interval: "—",      note: "Akumulasi metabolit aktif — risiko tinggi" },
    hd:     { dose: "Hindari",            interval: "—",      note: "Data tidak memadai" },
    crrt:   { dose: "Dosis rendah 0.05 mcg/kg/min", interval: "Normal", note: "Monitor ketat" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "Hindari pada eGFR <30. Akumulasi OR-1896 memperpanjang efek vasodilator."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi dosis", child_c: "Hindari — data sangat terbatas",
    note: "Metabolisme hepatik signifikan. Gangguan hati berat → akumulasi."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Kontraindikasi relatif",
    trimester_2: "Hanya emergensi mengancam jiwa",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Tidak diketahui",
    lactation: "Kontraindikasi — data tidak ada",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Cardiac index/CO", "ScvO₂", "Klirens laktat", "Perbaikan gejala HF selama 7–9 hari"],
    safety: ["MAP — hipotensi", "EKG — aritmia (AF)", "Kalium (koreksi hipokalemia sebelum mulai)"],
    frequency: "Monitoring hemodinamik invasif selama infus",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Hipotensi berat (terutama dengan loading)", "Aritmia supraventrikel (AF, atrial flutter)"],
    common: ["Sakit kepala", "Hipotensi", "Mual", "Hipokalemia"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Nitrat", effect: "Potensiasi vasodilatasi → hipotensi berat" },
      { drug: "Diuretik", effect: "Hipokalemia meningkatkan risiko aritmia" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Alternatif inotropik pada syok kardiogenik refrakter" }
  ]
},

"fenilefrin": {
  name: "Fenilefrin (Phenylephrine)",
  brand_id: ["Neo-Synephrine", "Fenilefrin Hameln"],
  brand_id_notes: "Ketersediaan terbatas di Indonesia. Lebih umum di setting anestesi.",
  class: "Katekolamin sintetik",
  subclass: "Vasopressor selektif α₁",
  category: ["vasopressor"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas — lebih umum di kamar operasi",
  mechanism: "Agonis selektif α₁ murni → vasokonstriksi perifer, ↑SVR, ↑MAP. TIDAK ada efek inotropik (β₁) → tidak meningkatkan HR, bahkan dapat menyebabkan bradikardia refleks. Pilihan pada takikardia dengan hipotensi.",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Hipotensi perioperatif/anestesi spinal", "Vasodilatory shock dengan takikardia (HR >120 bpm) dimana norepinefrin memperburuk takikardia"],
    icu_secondary: ["Hipotensi pada Fallot/RVOTO untuk meningkatkan SVR (mengurangi R→L shunt)", "SVT dengan hipotensi (refleks vagal via hipertensi akut)"],
    local_guideline: "Tidak ada guideline lokal spesifik. Merujuk SOAP/ASA.",
    intl_guideline: "SOAP 2017: Fenilefrin atau efedrin untuk hipotensi spinal pada SC. SSC tidak merekomendasikan sebagai first-line ICU."
  },
  contraindications: ["Bradikardi berat (efek refleks bradikardi)", "Syok kardiogenik dengan CO rendah (↑SVR → ↑afterload LV)", "Hipovolemia tidak terkoreksi"],
  precautions: ["Bradikardia refleks — siapkan atropin", "↑Afterload: buruk pada gagal jantung kiri berat", "Vasokonstriksi renal dan mesenterika"],
  dosing: {
    standard: "Bolus: 50–200 mcg IV; Infus: 0.5–6 mcg/kg/min",
    range_low: "0.5 mcg/kg/min",
    range_high: "6 mcg/kg/min",
    max: "6–10 mcg/kg/min",
    loading: "Bolus 50–100 mcg IV (hipotensi akut anestesi)",
    maintenance: "Infus 0.5–6 mcg/kg/min",
    route: ["IV"],
    dilution: "10 mg dalam 100 mL NS → 100 mcg/mL. Bolus: larutkan ke 100 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 100 = mL/jam",
    titration: "Titrasi per MAP. Waspadai bradikardia refleks.",
    special_notes: "Bradikardia refleks umum — siapkan atropin 0.5–1 mg. Tidak direkomendasikan sebagai vasopressor utama ICU."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output — vasokonstriksi renal mungkin terjadi"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme oleh MAO. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Pilihan untuk hipotensi spinal pada operasi caesar",
    trimester_3: "Lebih disukai dari efedrin untuk SC (SOAP guideline)",
    labor_delivery: "Aman untuk hipotensi spinal SC",
    fetal_risk: "Bradikardia fetal pada dosis tinggi",
    lactation: "Data tidak ada",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["MAP target", "HR — bradikardia refleks"],
    safety: ["EKG", "Tanda hipoperfusi CO rendah"],
    frequency: "Monitoring hemodinamik",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Bradikardia refleks berat (HR <40) bila dosis bolus berlebihan"],
    common: ["Bradikardia", "Hipertensi", "Sakit kepala", "Mual"],
    antidote: "Bradikardia: Atropin 0.5–1 mg IV"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi", management: "Kontraindikasi" }
    ],
    moderate: []
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Tidak direkomendasikan first-line ICU; pertimbangkan pada takikardia dengan hipotensi" }
  ]
},

"propofol": {
  name: "Propofol",
  brand_id: ["Recofol", "Diprivan", "Propofol Fresenius", "Propofol Hameln"],
  brand_id_notes: "Diprivan (AstraZeneca) originator. Recofol dan generik lokal umum di ICU Indonesia.",
  class: "Anastetik intravena",
  subclass: "Sedatif GABA-ergik",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Pilihan utama sedasi ICU.",
  mechanism: "Potensiasi reseptor GABA-A → inhibisi SSP. Onset cepat (30–60 detik), pemulihan cepat (meski infus berkepanjangan) melalui redistribusi. Sifat antiemetik, antikonvulsan ringan, dan vasodilator.",
  pkpd_type: null,
  pkpd_note: "Konteks-sensitif: waktu pemulihan meningkat pada infus >24–48 jam karena akumulasi di jaringan perifer. Namun tetap lebih predictable dari benzodiazepin.",
  spectrum: null,
  indications: {
    icu_primary: ["Sedasi ICU jangka pendek-menengah (<48–72 jam)", "Status epileptikus refrakter (dosis tinggi)"],
    icu_secondary: ["Sedasi selama bronkoskopi/prosedur ICU", "Sedasi pada ARDS (facilitating prone positioning)"],
    local_guideline: "PERDICI: Propofol pilihan utama sedasi ICU. Target RASS -2 hingga 0. Protokol SAT (Spontaneous Awakening Trial) harian.",
    intl_guideline: "SCCM PADIS 2018: Propofol atau deksmedetomidin lebih disukai dari benzodiazepin untuk sedasi ICU. Light sedation (RASS -1 to 0) superior."
  },
  contraindications: ["Hipersensitivitas terhadap propofol, soya, telur (mengandung lecithin telur dan soybean oil)", "Hipertrigliseridemia berat (TG >500 mg/dL)", "TIDAK untuk sedasi pada anak <3 tahun di ICU (PRIS risiko)"],
  precautions: ["PRIS (Propofol Infusion Syndrome) — lihat high_alert_warnings", "Hipotensi — efek vasodilator dan inotropik negatif ringan", "Hiperlipidemia — 1 mL = 0.1 g lemak (1.1 kkal/mL)", "Infeksi jika teknik aseptik tidak ketat (medium kultur bakteri)"],
  dosing: {
    standard: "5–50 mcg/kg/min IV kontinyu (0.3–3 mg/kg/jam)",
    range_low: "5–10 mcg/kg/min (sedasi ringan)",
    range_high: "50 mcg/kg/min (4 mg/kg/jam) — BATAS PRIS",
    max: "4 mg/kg/jam (66 mcg/kg/min) — JANGAN LEBIH dari 48–72 jam pada dosis tinggi",
    loading: "Tidak dianjurkan di ICU (hipotensi). Jika perlu: 0.5 mg/kg pelan-pelan.",
    maintenance: "Titrasi per RASS target. Turunkan dosis setiap 24 jam (SAT).",
    route: ["IV"],
    dilution: "Ready-to-use 10 mg/mL (1%). Tidak perlu diencerkan. Ganti line setiap 12 jam.",
    rate: "mcg/kg/min × BB × 60 / 10000 = mL/jam (konsentrasi 10 mg/mL)",
    titration: "Titrasi per RASS. Light sedation (RASS -1 s/d 0) direkomendasikan.",
    special_notes: "⚠ HITUNG kalori dari propofol: 1.1 kkal/mL → kurangi dari target nutrisi. Ganti set infus setiap 12 jam (media pertumbuhan bakteri)."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor TG" },
    r_lt15: { dose: "Normal — hati-hati akumulasi metabolit", interval: "Normal", note: "Monitor TG setiap 48 jam" },
    hd:     { dose: "Normal", interval: "Normal", note: "Sedikit terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Trigliserida setiap 48–72 jam pada infus >24 jam atau dosis >4 mg/kg/jam"
  },
  hepatic_adjustment: {
    child_a: "Normal dengan monitoring", child_b: "Monitor ketat — clearance ↓", child_c: "Kurangi dosis 25–50% — risiko akumulasi",
    note: "Metabolisme hepatik utama via glucuronidasi. Disfungsi hati berat → clearance ↓."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Gunakan dosis minimal yang efektif",
    trimester_3: "Idem — risiko depresi SSP neonatus",
    labor_delivery: "Tidak untuk analgesia persalinan. Dapat digunakan pada SC emergensi.",
    fetal_risk: "Depresi SSP neonatus, apnea",
    lactation: "Diekskresikan ke ASI. Hindari menyusui 24 jam post-infus berkepanjangan.",
    lactation_note: "Propofol larut lemak — exkresi ke ASI signifikan"
  },
  monitoring: {
    efficacy: ["RASS setiap 2–4 jam (target sesuai protokol)", "CAM-ICU harian untuk delirium screening"],
    safety: ["Trigliserida setiap 48–72 jam (target <400 mg/dL)", "pH arteri + laktat (tanda PRIS)", "EKG jika dosis tinggi >48 jam (RBBB/LBBB baru = tanda PRIS)", "Tekanan darah — hipotensi"],
    frequency: "Monitoring sedasi setiap 2 jam. Hematologi metabolik setiap 24–48 jam pada infus tinggi.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: [
      "PRIS (Propofol Infusion Syndrome): Dosis >4–5 mg/kg/jam >48 jam → asidosis metabolik anion gap tinggi, rhabdomiolisis, aritmia (RBBB, LBBB), gagal ginjal akut, gagal jantung. Angka mortalitas tinggi. STOP SEGERA jika dicurigai.",
      "Hipotensi berat — terutama bolus atau pada pasien hipovolemik"
    ],
    common: ["Hipotensi (terutama awal)", "Hipertrigliseridemia", "Nyeri injeksi (vena perifer)", "Urin hijau (metabolit — jinak)"],
    antidote: "PRIS: Hentikan propofol SEGERA, ganti sedasi (midazolam atau ketamin), koreksi asidosis, RRT jika diperlukan"
  },
  interactions: {
    major: [
      { drug: "Fentanil/Opioid", effect: "Sinergisme sedasi — risiko apnea dan hipotensi berat", management: "Kurangi dosis kedua obat. Monitor ketat." }
    ],
    moderate: [
      { drug: "Rifampisin", effect: "Menginduksi metabolisme propofol → dosis lebih tinggi dibutuhkan" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "propofol",
  evidence: [
    { ref_id: "devlin2018", note: "SCCM PADIS 2018: Propofol/deksmedetomidin lebih disukai dari benzodiazepin ICU" }
  ]
},

"deksmedetomidin": {
  name: "Deksmedetomidin",
  brand_id: ["Precedex", "Dexdor", "Deksmedetomidin Fresenius"],
  brand_id_notes: "Precedex (Pfizer) dan Dexdor (Orion). Tersedia terbatas di ICU Indonesia — harga lebih tinggi.",
  class: "Agonis alfa-2 adrenergik",
  subclass: "Sedatif non-GABA",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia, umumnya sebagai second-line atau pilihan weaning",
  mechanism: "Agonis selektif α₂-adrenergik di locus ceruleus (batang otak) → sedasi menyerupai tidur fisiologis. TIDAK menyebabkan depresi napas bermakna. Efek analgetik ringan via α₂ spinal. Antisialagog. Bradikardia dan hipotensi via α₂ vaskular.",
  pkpd_type: null,
  pkpd_note: "Onset 15 menit. Waktu paruh 2 jam. Clearance hepatik — penyesuaian pada gangguan hati berat.",
  spectrum: null,
  indications: {
    icu_primary: ["Sedasi ICU ringan-sedang (RASS 0 hingga -2) terutama pada pasien kooperatif", "Weaning ventilator — pasien dapat diajak komunikasi lebih baik"],
    icu_secondary: ["Pencegahan dan manajemen delirium ICU (MENDS-2 2024: tidak superior dari propofol)", "Agitasi berat post-operasi", "Manajemen withdrawal alkohol/opioid"],
    local_guideline: "PERDICI: Deksmedetomidin sebagai pilihan sedasi pada pasien yang perlu tetap komunikatif atau dalam protokol weaning.",
    intl_guideline: "SCCM PADIS 2018: Gunakan propofol atau deksmedetomidin (bukan benzodiazepin) untuk sedasi ICU. MENDS-2 (Hughes 2021, NEJM): Deksmedetomidin tidak mengurangi delirium dibanding propofol pada sepsis."
  },
  contraindications: ["Blok AV derajat 2–3 (tanpa pacemaker)", "Bradikardia berat (HR <50) tanpa backup", "Hipotensi berat tidak terkoreksi"],
  precautions: ["Bradikardia — sangat umum terutama loading", "Hipotensi — terutama pada hipovolemia", "Tidak untuk sedasi dalam (bila butuh RASS -3 sampai -5, kurang efektif)", "Waktu paruh pendek — agitasi rebound jika stop mendadak"],
  dosing: {
    standard: "0.2–0.7 mcg/kg/jam IV kontinyu",
    range_low: "0.2–0.4 mcg/kg/jam",
    range_high: "1.5 mcg/kg/jam (off-label, refrakter)",
    max: "1.5 mcg/kg/jam",
    loading: "1 mcg/kg selama 10 menit — SERING DIHINDARI ICU (bradikardia/hipotensi berat). Mulai maintenance langsung.",
    maintenance: "0.2–0.7 mcg/kg/jam, titrasi per RASS",
    route: ["IV"],
    dilution: "200 mcg dalam 50 mL NS → 4 mcg/mL. Atau 400 mcg dalam 100 mL → 4 mcg/mL.",
    rate: "(mcg/kg/jam × BB) / 4 = mL/jam",
    titration: "Naikan 0.1 mcg/kg/jam setiap 30 menit per RASS. Hindari loading di ICU.",
    special_notes: "Pasien dapat dibangunkan dan komunikasi saat deksmedetomidin — keunggulan utama vs propofol. Tapering bertahap saat stop."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal dengan monitoring", interval: "Normal", note: "Monitor hemodinamik ketat" },
    r_lt15: { dose: "Normal — clearance tidak berubah bermakna", interval: "Normal", note: "Monitor akumulasi metabolit" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitoring hemodinamik — gagal ginjal sering disertai hipovolemia"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 30–50%", child_c: "Mulai dosis rendah 0.2 mcg/kg/jam — clearance ↓ bermakna",
    note: "Metabolisme hepatik via glucuronidasi dan N-glukuronidasi. Sirosis berat: clearance ↓ signifikan."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas — hindari",
    trimester_2: "Hanya emergensi",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Tidak diketahui",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["RASS setiap 2 jam", "CAM-ICU harian (delirium)", "Kemampuan pasien untuk bangun dan komunikasi"],
    safety: ["HR — bradikardia (target >50 bpm)", "TD setiap 15 menit pertama", "EKG jika bradikardia berat"],
    frequency: "Monitoring RASS setiap 2–4 jam. Tanda vital setiap 15–30 menit selama titrasi.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Bradikardia berat (HR <40) — terutama dengan loading dose", "Hipotensi berat — terutama hipovolemia"],
    common: ["Bradikardia (21–42%)", "Hipotensi (25–54%)", "Mulut kering", "Nausea", "Agitasi rebound saat stop mendadak"],
    antidote: "Bradikardia berat: Atropin 0.5–1 mg IV. Stop infus sementara."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "β-blocker", effect: "Potensiasi bradikardia dan hipotensi" },
      { drug: "Digoksin", effect: "Bradikardia sinergistik" },
      { drug: "Anestesi/sedatif lain", effect: "Potensiasi sedasi — kurangi dosis" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "deksmedetomidin",
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Pilihan sedasi ICU non-GABA, preservasi napas spontan" }
  ]
},

"midazolam": {
  name: "Midazolam",
  brand_id: ["Dormicum", "Miloz", "Midazolam Hameln", "Midazolam Kalbe"],
  brand_id_notes: "Dormicum paling umum. Miloz (Pfizer). Tersedia di semua RS Indonesia.",
  class: "Benzodiazepin",
  subclass: "Sedatif GABA-ergik",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Harga murah.",
  mechanism: "Modulator allosterik positif reseptor GABA-A → ↑ frekuensi pembukaan kanal Cl⁻ → hiperpolarisasi → inhibisi SSP. Efek: sedasi, ansiolitik, amnesia anterograd, antikonvulsan, relaksasi otot.",
  pkpd_type: null,
  pkpd_note: "Konteks-sensitif: waktu pemulihan meningkat signifikan pada infus berkepanjangan karena akumulasi metabolit aktif (1-OH-midazolam) terutama pada gagal ginjal.",
  spectrum: null,
  indications: {
    icu_primary: ["Status epileptikus (first-line IM atau IV)", "Sedasi prosedural ICU jangka pendek", "Sedasi pada kondisi dimana propofol tidak tersedia/kontraindikasi"],
    icu_secondary: ["Withdrawal alkohol (CIWA protokol)", "Sedasi pada ARDS berat memerlukan RASS -4/-5 (setelah propofol/deks gagal)", "Premedikasi"],
    local_guideline: "PERDICI: Midazolam tidak direkomendasikan sebagai sedatif utama ICU (delirium ↑). Gunakan untuk status epileptikus.",
    intl_guideline: "SCCM PADIS 2018: HINDARI benzodiazepin sebagai sedatif rutin ICU — meningkatkan delirium dan durasi ventilasi. ESICM: Midazolam hanya jika propofol/deks tidak tersedia atau kontraindikasi."
  },
  contraindications: ["Glaukoma sudut sempit akut", "Hipersensitivitas terhadap benzodiazepin", "Miastenia gravis berat"],
  precautions: ["Delirium ICU — benzodiazepin signifikan meningkatkan risiko", "Akumulasi pada gagal ginjal (metabolit 1-OH-midazolam)", "Depresi napas — risiko apnea terutama dengan opioid", "Toleransi dan ketergantungan pada penggunaan berkepanjangan"],
  dosing: {
    standard: "Infus: 0.02–0.1 mg/kg/jam IV kontinyu",
    range_low: "0.01–0.02 mg/kg/jam",
    range_high: "0.2 mg/kg/jam (refrakter)",
    max: "0.2 mg/kg/jam (agitasi refrakter)",
    loading: "0.02–0.05 mg/kg IV pelan (prosedur). Status epileptikus: 0.1–0.2 mg/kg IV/IM.",
    maintenance: "Infus titrasi per RASS. Turunkan dosis setiap 24 jam (SAT).",
    route: ["IV", "IM", "Intranasal", "Bukal"],
    dilution: "50 mg dalam 50 mL NS → 1 mg/mL. Atau 100 mg dalam 100 mL → 1 mg/mL.",
    rate: "(mg/kg/jam × BB) / 1 = mL/jam",
    titration: "Titrasi per RASS. Light sedation lebih diutamakan.",
    special_notes: "Pada gagal ginjal: metabolit aktif 1-OH-midazolam berakumulasi → sedasi berkepanjangan tidak terduga. Monitor RASS lebih sering."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25%", interval: "Normal", note: "Akumulasi metabolit 1-OH-midazolam" },
    r15_30: { dose: "Kurangi 50%", interval: "Normal", note: "Risiko sedasi berkepanjangan" },
    r_lt15: { dose: "Kurangi 50–75%", interval: "Normal", note: "Akumulasi bermakna — pertimbangkan propofol" },
    hd:     { dose: "Kurangi 50%", interval: "Normal", note: "HD tidak menghilangkan metabolit aktif secara bermakna" },
    crrt:   { dose: "Kurangi 25–50%", interval: "Normal", note: "Monitor sedasi ketat" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "RASS setiap 2 jam — waspadai sedasi berkepanjangan. 1-OH-midazolam dapat toksik pada gagal ginjal."
  },
  hepatic_adjustment: {
    child_a: "Normal dengan monitoring", child_b: "Kurangi 25–50%", child_c: "Kurangi 50% — clearance sangat ↓",
    note: "Metabolisme utama CYP3A4 hepatik. Sirosis berat → clearance ↓ signifikan."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "Risiko palatoschisis — hindari",
    trimester_2: "Hindari kecuali emergensi",
    trimester_3: "Dapat menyebabkan floppy infant syndrome",
    labor_delivery: "Hindari — risiko depresi napas neonatus dan withdrawal",
    fetal_risk: "Depresi SSP neonatus, floppy infant, withdrawal",
    lactation: "Ekskresi ke ASI. Hindari menyusui atau tunggu 24 jam.",
    lactation_note: "Waktu paruh neonatus sangat panjang"
  },
  monitoring: {
    efficacy: ["RASS setiap 2 jam", "CAM-ICU harian — risiko delirium tinggi"],
    safety: ["RR dan SpO₂ — apnea", "Akumulasi pada gagal ginjal: RASS lebih dalam dari target"],
    frequency: "Monitoring sedasi setiap 2 jam. SAT harian.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Apnea — terutama kombinasi dengan opioid", "Delirium ICU (meningkatkan risiko 2–3×)", "Akumulasi pada gagal ginjal → koma berkepanjangan"],
    common: ["Sedasi berlebihan", "Amnesia", "Depresi napas", "Hipotensi", "Toleransi"],
    antidote: "Flumazenil 0.2 mg IV, dapat diulang setiap 1 menit, maks 1 mg. Waktu paruh flumazenil pendek — resedasi mungkin terjadi."
  },
  interactions: {
    major: [
      { drug: "Opioid", effect: "Sinergisme depresi napas — risiko apnea fatal", management: "Kurangi dosis keduanya. Monitor SpO₂ kontinyu." }
    ],
    moderate: [
      { drug: "CYP3A4 inhibitor (flukonazol, eritromisin)", effect: "↑ kadar midazolam 3–5× → sedasi berkepanjangan" },
      { drug: "CYP3A4 inducer (rifampisin, fenitoin)", effect: "↓ kadar midazolam → sedasi tidak adekuat" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "midazolam",
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Hindari benzodiazepin sebagai sedatif utama ICU" }
  ]
},

"ketamin_icu": {
  name: "Ketamin (ICU)",
  brand_id: ["Ketalar", "Ketamin Hameln", "Ketamin Dexa"],
  brand_id_notes: "Ketalar (Pfizer). Generik lokal tersedia. Tersedia di semua RS Indonesia.",
  class: "Anastetik disosiatif",
  subclass: "Antagonis NMDA",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Harga sangat terjangkau.",
  mechanism: "Antagonis non-kompetitif reseptor NMDA → amnesia, analgesia, dan sedasi ('anestesi disosiatif'). Uniknya: mempertahankan tonus otot pernapasan, refleks protektif jalan napas, dan bahkan merangsang kardiovaskular (simpatomimetik). Bronkodilator via β₂ simpatomimetik.",
  pkpd_type: null,
  pkpd_note: "Metabolit aktif: norkietamin (1/3–1/5 potensi). Onset IV: 30–60 detik. Durasi bolus: 10–15 menit.",
  spectrum: null,
  indications: {
    icu_primary: ["Analgesia/sedasi prosedural ICU (intubasi, drainase, debridemen) tanpa depresi napas", "Sedasi status asmatikus berat (bronkodilatasi)", "Analgesia opioid-sparing (dosis sub-disosiatif 0.1–0.3 mg/kg/jam)"],
    icu_secondary: ["Sedasi pada syok refrakter (efek simpatomimetik mempertahankan MAP)", "Status epileptikus refrakter", "Agen ko-sedasi saat stop propofol (PRIS atau ketersediaan terbatas)"],
    local_guideline: "Tersedia luas, terjangkau — pilihan praktis di ICU dengan keterbatasan sumber daya.",
    intl_guideline: "SCCM PADIS 2018: Ketamin sebagai adjun analgetik opioid-sparing. AHA/ACC: Ketamin untuk intubasi pada syok berat (mempertahankan MAP)."
  },
  contraindications: ["Hipertensi berat tidak terkontrol (efek simpatomimetik)", "Riwayat psikosis atau skizofrenia", "Peningkatan TIK yang signifikan (relatif — data terbaru kurang mendukung kontraindikasi ini)"],
  precautions: ["Emergence reactions (halusinasi, mimpi buruk) — premedikasi benzodiazepin mengurangi risiko", "Hipersalivasi — siapkan suction", "Sekresi oral meningkat — mungkin perlu atropin premedikasi", "Pada hipertensi berat: ↑HR dan BP"],
  dosing: {
    standard: "Bolus sedasi prosedural: 1–2 mg/kg IV (atau 4 mg/kg IM). Sub-disosiatif analgesia: 0.1–0.3 mg/kg/jam infus",
    range_low: "0.1 mg/kg/jam (analgesia adjun)",
    range_high: "2–3 mg/kg bolus (anestesi disosiatif)",
    max: "Infus: 2 mg/kg/jam (status epileptikus). Bolus: tidak ada batas mutlak.",
    loading: "1–2 mg/kg IV pelan (30 detik) atau 4 mg/kg IM",
    maintenance: "Infus 0.1–0.5 mg/kg/jam untuk sedasi. 1–2 mg/kg/jam untuk status epileptikus.",
    route: ["IV", "IM"],
    dilution: "500 mg dalam 50 mL NS → 10 mg/mL. Untuk infus harian: 500 mg dalam 250 mL → 2 mg/mL.",
    rate: "0.2 mg/kg/jam × 70 kg / 10 mg/mL = 1.4 mL/jam",
    titration: "Titrasi per respons klinis dan RASS",
    special_notes: "Premedikasi midazolam 0.03–0.05 mg/kg IV mengurangi emergence reactions. Monitor SpO₂ — ketamin aman namun apnea mungkin pada dosis besar cepat."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal dengan monitoring", interval: "Normal", note: "Akumulasi metabolit" },
    r_lt15: { dose: "Pertimbangkan dosis lebih rendah", interval: "Normal", note: "Data terbatas" },
    hd:     { dose: "Normal", interval: "Normal", note: "Terdialisis sebagian" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Monitoring sedasi ketat pada gagal ginjal"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25%", child_c: "Kurangi 50% — clearance ↓",
    note: "Metabolisme hepatik (CYP2B6, CYP3A4) ke norkietamin aktif."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan dengan monitoring",
    trimester_3: "Dapat digunakan pada prosedur emergensi",
    labor_delivery: "Induksi SC emergensi: 1–1.5 mg/kg IV (efek simpatomimetik berguna pada syok)",
    fetal_risk: "Depresi SSP neonatus pada dosis tinggi",
    lactation: "Data tidak ada. Hindari menyusui 12 jam post-bolus.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Level sedasi/analgesia", "RASS jika infus kontinu", "Nyeri (NRS/CPOT)"],
    safety: ["TD dan HR — hipertensi dan takikardia", "SpO₂ — meski aman, apnea mungkin pada dosis besar", "Tanda emergence reactions saat pemulihan"],
    frequency: "Monitoring tanda vital setiap 5 menit selama prosedur",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Emergence reactions: halusinasi, agitasi berat (5–30%) — premedikasi mengurangi", "Laringospasme (jarang, <1%)"],
    common: ["Hipertensi dan takikardia", "Hipersalivasi", "Mual/muntah", "Nystagmus", "Peningkatan TIO"],
    antidote: "Emergence reactions: Midazolam 0.05 mg/kg IV atau propofol 0.5 mg/kg IV"
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Obat antihipertensi", effect: "Ketamin dapat mengatasi efek antihipertensi" },
      { drug: "Tiroid hormone", effect: "Potensiasi efek simpatomimetik ketamin → hipertensi/takikardia" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Ketamin adjun analgetik opioid-sparing ICU" }
  ]
},

"tiopental": {
  name: "Tiopental Natrium",
  brand_id: ["Thiopental Hameln", "Intraval Sodium", "Tiopental Kalbe"],
  brand_id_notes: "Ketersediaan terbatas dan menurun di Indonesia. Gunakan hanya jika propofol tidak tersedia.",
  class: "Barbiturat",
  subclass: "Anastetik intravena ultrashort-acting",
  category: ["sedasi"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan sangat terbatas di Indonesia — propofol lebih sering dipakai",
  mechanism: "Potensiasi GABA-A (↑durasi pembukaan kanal Cl⁻) + inhibisi reseptor AMPA/kainat. Menekan metabolisme serebral (CMRO₂), menurunkan TIK, antikonvulsan kuat. Onset sangat cepat (10–30 detik). Durasi singkat via redistribusi.",
  pkpd_type: null,
  pkpd_note: "Konteks-sangat-sensitif: t½ eliminasi 5–12 jam. Akumulasi bermakna pada infus berkepanjangan. Sedasi hari-hari setelah stop.",
  spectrum: null,
  indications: {
    icu_primary: ["Status epileptikus refrakter (lini ketiga setelah benzodiazepin + fenitoin gagal)", "Induksi anestesi jika propofol tidak tersedia", "Koma barbiturat untuk TIK refrakter (neurosurgical ICU)"],
    icu_secondary: ["Perlindungan serebral pada TIK refrakter (kontroversial)", "Kejang refrakter pada pasien tidak toleransi propofol"],
    local_guideline: "Panduan status epileptikus Indonesia: Tiopental lini ketiga. Dosis koma barbiturat: target EEG burst-suppression.",
    intl_guideline: "NCS Status Epilepticus 2012/2016: Pentobarbital/tiopental sebagai agen anestesi untuk RSE. Neurocritical care: koma barbiturat TIK >25 cmH₂O refrakter terapi lain."
  },
  contraindications: ["Hipersensitivitas terhadap barbiturat", "Gagal napas tanpa intubasi", "Porfiri akut intermiten — KONTRAINDIKASI ABSOLUT"],
  precautions: ["Hipotensi berat — efek kardiodepresan + vasodilatasi", "Akumulasi bermakna — pemulihan tertunda berhari-hari", "Tidak untuk sedasi rutin ICU — terlalu banyak kelemahan vs propofol"],
  dosing: {
    standard: "Status epileptikus: 3–5 mg/kg IV bolus pelan → infus 1–5 mg/kg/jam",
    range_low: "1 mg/kg/jam (maintenance)",
    range_high: "10 mg/kg/jam (RSE berat)",
    max: "Tidak ada batas kaku — titrasi per EEG burst-suppression",
    loading: "3–5 mg/kg IV bolus (dilakukan pelan, 30–60 detik) untuk induksi/kontrol akut",
    maintenance: "Infus 1–5 mg/kg/jam titrasi per EEG",
    route: ["IV"],
    dilution: "500 mg dalam 20 mL WFI → 25 mg/mL (2.5% solusi). Jangan campurkan dengan larutan asam.",
    rate: "(mg/kg/jam × BB) / 25 = mL/jam",
    titration: "Titrasi per EEG — target burst-suppression (1 burst per 5–10 detik)",
    special_notes: "⚠ pH sangat basa (10–11) — nekrosis jaringan jika ekstravasasi. HANYA via CVC. Larutan 2.5% — JANGAN berikan konsentrasi lebih tinggi."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Kurangi 25%", interval: "Normal", note: "Akumulasi pada GFR rendah" },
    r_lt15: { dose: "Kurangi 50%", interval: "Normal", note: "Protein binding ↓ pada uremia → efek lebih besar" },
    hd:     { dose: "Kurangi 50%", interval: "Normal", note: "HD tidak efektif mengeluarkan tiopental (protein binding tinggi)" },
    crrt:   { dose: "Kurangi 25–50%", interval: "Normal", note: "" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Sedasi berkepanjangan lebih mungkin pada gagal ginjal. EEG monitoring."
  },
  hepatic_adjustment: {
    child_a: "Kurangi 25%", child_b: "Kurangi 50%", child_c: "Hindari jika memungkinkan — clearance sangat ↓",
    note: "Metabolisme hepatik utama (CYP2C19). Sirosis → clearance ↓ drastis."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan pada status epileptikus refrakter",
    trimester_3: "Idem",
    labor_delivery: "Dapat digunakan untuk induksi SC emergensi",
    fetal_risk: "Depresi SSP neonatus bermakna",
    lactation: "Hindari menyusui. Ekskresi ke ASI signifikan.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["EEG kontinyu — target burst-suppression untuk koma barbiturat", "TIK monitoring jika tersedia"],
    safety: ["TD — hipotensi berat sangat umum", "EKG — bradikardi", "SpO₂ — apnea", "Fungsi hati dan ginjal setiap 24–48 jam"],
    frequency: "EEG kontinyu wajib jika koma barbiturat. Monitoring hemodinamik invasif direkomendasikan.",
    therapeutic_range: "Target EEG: burst-suppression (koma barbiturat TIK)"
  },
  adverse_effects: {
    critical: ["Hipotensi berat — terutama bolus cepat", "Depresi miokard", "Apnea", "Nekrosis jaringan akibat ekstravasasi (pH sangat basa)"],
    common: ["Hipotensi", "Bradikardi", "Bronkospasme (histamine release)", "Pemulihan tertunda berhari-hari"],
    antidote: "Ekstravasasi: Injeksi NS 0.9% + prokain 0.5% subkutan. Tidak ada antidot spesifik."
  },
  interactions: {
    major: [
      { drug: "CYP2C19 inhibitor (omeprazol, flukonazol)", effect: "↑ kadar tiopental", management: "Monitor sedasi ketat" }
    ],
    moderate: [
      { drug: "Opioid", effect: "Potensiasi depresi napas dan kardiovaskular" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "devlin2018", note: "Barbiturat lini ketiga status epileptikus refrakter — PADIS 2018" }
  ]
},

"fentanil": {
  name: "Fentanil",
  brand_id: ["Fentanyl Hameln", "Fentanil Kalbe", "Durogesic (patch — bukan ICU)"],
  brand_id_notes: "Ampul 50 mcg/mL tersedia luas. Pilihan utama analgesia ICU Indonesia.",
  class: "Opioid",
  subclass: "Opioid sintetik kuat",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Pilihan utama analgesia ICU.",
  mechanism: "Agonis reseptor μ-opioid → analgesia, sedasi, euforia, depresi napas. Lipofilik tinggi → onset sangat cepat (1–2 menit IV). Durasi bolus 30–60 menit. Pada infus kontinu: akumulasi bermakna. TIDAK menyebabkan pelepasan histamin (berbeda dari morfin).",
  pkpd_type: null,
  pkpd_note: "Konteks-sangat-sensitif: t½ efektif meningkat drastis setelah infus >12 jam. Metabolit inaktif — tidak terakumulasi toksik pada gagal ginjal (keunggulan vs morfin).",
  spectrum: null,
  indications: {
    icu_primary: ["Analgesia pada pasien terintubasi (A1C protocol — Analgesia first)", "Infus kontinu: sedoanalgesia kompromi pada ARDS/syok"],
    icu_secondary: ["Analgesia prosedural (bronkoskopi, CVC insertion, chest tube)", "Analgesia pre-operatif dan perioperatif"],
    local_guideline: "PERDICI: Fentanil pilihan utama analgesia ICU. Protokol A1C (Analgesia, Light sedation, Cognitive status). Target CPOT 0–2.",
    intl_guideline: "SCCM PADIS 2018: Pendekatan analgesia-first. Fentanil atau hidromorfon untuk pasien intubasi. Titrasi per CPOT/NRS."
  },
  contraindications: ["Hipersensitivitas terhadap fentanil", "Depresi napas berat tanpa intubasi dan ventilator"],
  precautions: ["Akumulasi bermakna pada infus >12 jam", "Rigiditas dada pada bolus cepat dosis besar (>5 mcg/kg cepat) — tangani dengan NMB atau nalokson", "Ileus paralitik pada infus lama", "Toleransi dan ketergantungan"],
  dosing: {
    standard: "Infus: 25–100 mcg/jam. Bolus: 25–100 mcg IV pelan.",
    range_low: "25 mcg/jam",
    range_high: "200–400 mcg/jam (toleransi opioid tinggi)",
    max: "Tidak ada batas mutlak — titrasi per nyeri",
    loading: "Bolus 25–50 mcg IV pelan tiap 5–10 menit sampai nyeri terkontrol",
    maintenance: "Infus kontinu 25–100 mcg/jam, titrasi per CPOT/NRS",
    route: ["IV"],
    dilution: "500 mcg dalam 50 mL NS → 10 mcg/mL. Atau 1000 mcg dalam 100 mL → 10 mcg/mL.",
    rate: "mcg/jam / 10 = mL/jam",
    titration: "Naikan 25 mcg/jam tiap 1–2 jam per CPOT. SAT harian.",
    special_notes: "Lebih disukai dari morfin pada gagal ginjal (tidak ada metabolit aktif terakumulasi). Rotasi opioid jika toleransi tinggi."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor sedasi berlebih" },
    r_lt15: { dose: "Normal — metabolit inaktif", interval: "Normal", note: "Keunggulan vs morfin: tidak ada M6G. Monitor sedasi." },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Fentanil AMAN pada gagal ginjal — tidak ada metabolit aktif toksik. Tetap monitor sedasi."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25%", child_c: "Kurangi 50% — clearance ↓",
    note: "Metabolisme CYP3A4 hepatik ke norfentanil inaktif."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan pada nyeri berat",
    trimester_3: "Risiko depresi napas dan withdrawal neonatus",
    labor_delivery: "Gunakan dengan sangat hati-hati — siapkan nalokson neonatus",
    fetal_risk: "Depresi napas neonatus, NAS (neonatal abstinence syndrome)",
    lactation: "Diekskresikan ke ASI. Pantau bayi untuk sedasi.",
    lactation_note: "Kadar rendah di ASI — umumnya aman pada dosis terapeutik"
  },
  monitoring: {
    efficacy: ["CPOT (Critical-Care Pain Observation Tool) setiap 2–4 jam", "NRS jika pasien dapat berkomunikasi", "RR dan SpO₂"],
    safety: ["RR < 8/menit = bahaya depresi napas", "Ileus: bising usus, distensi abdomen", "Tanda opioid-induced sedation yang berlebihan"],
    frequency: "CPOT setiap 2–4 jam. SpO₂ kontinyu.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Depresi napas — apnea (dosis tinggi atau bolus cepat)", "Rigiditas dada pada bolus besar cepat"],
    common: ["Mual/muntah", "Konstipasi/ileus", "Retensi urin", "Bradikardi", "Pruritus (jarang vs morfin)", "Toleransi"],
    antidote: "Nalokson 0.04–0.4 mg IV, dapat diulang setiap 2–3 menit, maks 10 mg. Hati-hati: nalokson juga membalikkan analgesia."
  },
  interactions: {
    major: [
      { drug: "Benzodiazepin/propofol", effect: "Sinergisme depresi napas", management: "Kurangi dosis. Monitor SpO₂ kontinyu." }
    ],
    moderate: [
      { drug: "CYP3A4 inhibitor (flukonazol, eritromisin)", effect: "↑ kadar fentanil → depresi napas berlebih" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: "fentanil",
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Analgesia-first ICU — fentanil atau hidromorfon IV" }
  ]
},

"morfin": {
  name: "Morfin",
  brand_id: ["Morfin HCl Kimia Farma", "MST Continus (oral)", "Morfin Hameln"],
  brand_id_notes: "Ampul 10 mg/mL dan 20 mg/mL. Tersedia di semua RS Indonesia.",
  class: "Opioid",
  subclass: "Opioid alami",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Lebih murah dari fentanil.",
  mechanism: "Agonis reseptor μ-opioid. Metabolit aktif: M6G (morfin-6-glukoronid) — potensi analgetik 10× > morfin, diekskresikan renal. Menyebabkan pelepasan histamin (tidal vs fentanil) — pruritus dan bronkospasme.",
  pkpd_type: null,
  pkpd_note: "M6G berakumulasi pada gagal ginjal → sedasi berkepanjangan, depresi napas bermakna. HINDARI pada eGFR <30.",
  spectrum: null,
  indications: {
    icu_primary: ["Analgesia ICU bila fentanil tidak tersedia", "Nyeri kronik kanker di ICU", "Edema paru akut kardiogenik (vasodilatasi + analgesia)"],
    icu_secondary: ["Analgesia post-operasi", "Paliatif ICU"],
    local_guideline: "PERDICI: Fentanil lebih disukai dari morfin di ICU. Morfin sebagai alternatif bila fentanil tidak tersedia.",
    intl_guideline: "SCCM PADIS 2018: Morfin atau fentanil sama-sama direkomendasikan untuk analgesia ICU — namun morfin dihindari pada gagal ginjal."
  },
  contraindications: ["Gagal ginjal berat (eGFR <30) — akumulasi M6G → depresi napas fatal", "Asma berat aktif (histamine release)", "Ileus paralitik"],
  precautions: ["HINDARI pada eGFR <30 — gunakan fentanil sebagai gantinya", "Histamin release: pruritus, hipotensi, bronkospasme", "Akumulasi M6G lebih berbahaya dari morfin itu sendiri pada GFR rendah"],
  dosing: {
    standard: "Infus: 1–5 mg/jam IV. Bolus: 2–5 mg IV pelan.",
    range_low: "1–2 mg/jam",
    range_high: "10–15 mg/jam (toleransi tinggi)",
    max: "Titrasi per nyeri — tidak ada batas mutlak pada nyeri kronis kanker",
    loading: "Bolus 2–4 mg IV pelan, ulangi setiap 5–10 menit per respons",
    maintenance: "Infus 1–5 mg/jam, titrasi per CPOT/NRS",
    route: ["IV", "IM", "SC", "Oral"],
    dilution: "50 mg dalam 50 mL NS → 1 mg/mL.",
    rate: "mg/jam / 1 = mL/jam",
    titration: "Naikan 1 mg/jam tiap 2–4 jam per CPOT",
    special_notes: "⚠ GANTI dengan fentanil jika eGFR <30 mL/min — M6G berakumulasi dan menyebabkan depresi napas berkepanjangan."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal",  interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25–50%", interval: "q6–8j", note: "M6G mulai terakumulasi" },
    r15_30: { dose: "Kurangi 50–75%", interval: "q8–12j", note: "Risiko M6G tinggi — pertimbangkan fentanil" },
    r_lt15: { dose: "HINDARI", interval: "—", note: "Akumulasi M6G → depresi napas berkepanjangan, koma. Ganti dengan FENTANIL." },
    hd:     { dose: "HINDARI", interval: "—", note: "M6G tidak terdialisis efektif. GUNAKAN FENTANIL." },
    crrt:   { dose: "Dosis sangat rendah jika mutlak perlu", interval: "Monitor ketat", note: "Fentanil lebih aman" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI jika eGFR <30. M6G berakumulasi dan menyebabkan depresi napas FATAL yang tidak reversibel dengan nalokson standar."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25–50%", child_c: "Kurangi 50% — gunakan hati-hati",
    note: "Metabolisme hepatik via glucuronidasi (UGT2B7). Disfungsi hati: clearance ↓."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan dengan monitoring",
    trimester_3: "Risiko NAS neonatus",
    labor_delivery: "Gunakan dengan hati-hati — siapkan nalokson neonatus",
    fetal_risk: "Depresi napas neonatus, NAS",
    lactation: "Ekskresi rendah ke ASI. Monitor bayi.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["CPOT setiap 2–4 jam", "NRS jika pasien komunikatif"],
    safety: ["RR — apnea (<8/menit: bahaya)", "SpO₂ kontinyu", "Fungsi ginjal harian jika infus lama"],
    frequency: "CPOT setiap 2–4 jam. Kreatinin setiap 24–48 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Depresi napas — apnea, terutama pada gagal ginjal (M6G)", "Bronkospasme pada asma (histamine)"],
    common: ["Pruritus (histamine release)", "Mual/muntah", "Konstipasi berat", "Retensi urin", "Hipotensi", "Bradikardi"],
    antidote: "Nalokson 0.04–0.4 mg IV. Perhatian: t½ nalokson < t½ morfin/M6G — resedasi mungkin terjadi."
  },
  interactions: {
    major: [
      { drug: "Benzodiazepin", effect: "Sinergisme depresi napas", management: "Kurangi dosis. Monitor SpO₂." }
    ],
    moderate: [
      { drug: "MAO Inhibitor", effect: "Serotonin syndrome dan depresi napas berat", management: "Kontraindikasi — tunggu 14 hari" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Morfin atau fentanil — namun hindari morfin pada eGFR <30" }
  ]
},

"remifentanil": {
  name: "Remifentanil",
  brand_id: ["Ultiva", "Remifentanil Hameln"],
  brand_id_notes: "Ultiva (Aspen/GSK). Tersedia sangat terbatas dan harga sangat mahal di Indonesia.",
  class: "Opioid",
  subclass: "Opioid ultra-short-acting",
  category: ["analgesia"],
  common_in_id: false,
  common_in_id_note: "Tersedia sangat terbatas — RS tersier dan swasta besar Indonesia",
  mechanism: "Agonis μ-opioid. UNIK: Metabolisme oleh esterase plasma dan jaringan → t½ 3–10 menit TANPA akumulasi meski infus berkepanjangan. Prediktabilitas pemulihan yang sangat tinggi. Metabolit (remifentanil asam) inaktif — aman pada gagal ginjal.",
  pkpd_type: null,
  pkpd_note: "Tidak ada efek konteks-sensitif — t½ tetap 3–10 menit berapa pun lama infus. Pemulihan sempurna dalam 10–15 menit setelah stop.",
  spectrum: null,
  indications: {
    icu_primary: ["Sedoanalgesia ICU dengan kebutuhan pemulihan cepat (weaning, neurological assessment)", "Analgesia TIVA (total intravenous anesthesia) di OR"],
    icu_secondary: ["Prosedur ICU yang memerlukan analgesia kuat namun singkat", "Pasien neurologis yang perlu pemeriksaan neurologi berkala tanpa sedasi residual"],
    local_guideline: "Tidak ada guideline lokal spesifik. Mahal — penggunaan terbatas.",
    intl_guideline: "SCCM PADIS 2018: Remifentanil sebagai alternatif pada pasien yang butuh waktu pemulihan pendek (weaning cepat, neurological monitoring)."
  },
  contraindications: ["Hipersensitivitas terhadap remifentanil", "Tidak untuk injeksi neuraxial (formula mengandung glisin)"],
  precautions: ["Analgesic gap saat stop — WAJIB berikan analgesik transisi sebelum stop", "Rigiditas dada jika bolus cepat dosis besar", "Depresi napas — meski reversibel cepat"],
  dosing: {
    standard: "Analgesia ICU: 0.025–0.2 mcg/kg/min IV kontinyu",
    range_low: "0.025 mcg/kg/min",
    range_high: "0.2–0.5 mcg/kg/min (prosedur)",
    max: "1 mcg/kg/min (prosedur, jarang)",
    loading: "Tidak dianjurkan rutin (rigiditas). Jika perlu: 0.5–1 mcg/kg pelan 30–60 detik.",
    maintenance: "Infus titrasi per CPOT/NRS",
    route: ["IV"],
    dilution: "5 mg dalam 250 mL NS atau D5W → 20 mcg/mL. Atau 2 mg dalam 100 mL → 20 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 20 = mL/jam",
    titration: "Naikan/turunkan 0.025–0.05 mcg/kg/min setiap 5–10 menit",
    special_notes: "⚠ WAJIB siapkan analgesik transisi (fentanil atau morfin) 15–30 menit SEBELUM stop remifentanil — analgesic gap menyebabkan nyeri akut dan agitasi hebat."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Aman — metabolisme non-renal" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Metabolit inaktif. AMAN pada gagal ginjal." },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Remifentanil AMAN pada gagal ginjal — metabolisme esterase non-hepatik non-renal"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — metabolisme esterase, bukan hepatik",
    note: "TIDAK memerlukan penyesuaian pada gangguan hati — esterase plasma."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari",
    trimester_2: "Hanya emergensi",
    trimester_3: "Data SC: crossing plasenta namun metabolisme cepat pada neonatus",
    labor_delivery: "Dapat digunakan pada SC emergensi — pemulihan neonatus cepat",
    fetal_risk: "Depresi napas neonatus transien — pemulihan cepat",
    lactation: "Aman untuk menyusui — t½ sangat pendek",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["CPOT setiap 2–4 jam", "Persiapan analgesik transisi sebelum stop"],
    safety: ["SpO₂ kontinyu", "RR — apnea meski reversibel cepat"],
    frequency: "CPOT setiap 2 jam. SpO₂ kontinyu.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Analgesic gap saat stop mendadak → nyeri akut dan agitasi berat", "Apnea (reversibel dalam menit)"],
    common: ["Depresi napas (dosis-dependen)", "Bradikardi", "Rigiditas dada (bolus cepat)", "Mual"],
    antidote: "Nalokson 0.04–0.4 mg IV. Namun t½ remifentanil sangat pendek — mungkin tidak diperlukan."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Sedatif/anestesi", effect: "Sinergisme depresi napas" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "devlin2018", note: "Alternatif analgesia ICU pada kebutuhan weaning/pemeriksaan neurologis cepat" }
  ]
},

"parasetamol_iv": {
  name: "Parasetamol IV (Acetaminophen)",
  brand_id: ["Paracetamol Fresenius", "Perfalgan", "Paracetamol B. Braun"],
  brand_id_notes: "Perfalgan (Bristol-Myers Squibb) originator. Tersedia di RS besar Indonesia. Lebih mahal dari oral.",
  class: "Analgetik-antipiretik non-opioid",
  subclass: "Inhibitor COX sentral / aktivasi TRPV1 spinal",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS besar. Tablet/sirup lebih umum — IV untuk pasien tidak bisa oral.",
  mechanism: "Mekanisme belum sepenuhnya dipahami. Inhibisi COX-3 sentral, modulasi sistem endokanabinoid spinal (TRPV1), dan jalur serotoninergik desenden. Tidak memiliki efek antiinflamasi perifer bermakna (bukan NSAID). Analgesia dan antipiretik tanpa efek gastrointestinal atau antiplatelet.",
  pkpd_type: null,
  pkpd_note: "Onset IV: 15–30 menit. Durasi: 4–6 jam. Bioavailabilitas IV > oral pada kondisi syok/hipoperfusi GI.",
  spectrum: null,
  indications: {
    icu_primary: ["Analgesia non-opioid — bagian dari strategi opioid-sparing multimodal", "Demam — antipiretik lini pertama (lebih aman dari NSAID di ICU)", "Nyeri ringan-sedang pada pasien ICU"],
    icu_secondary: ["Ko-analgesia bersama opioid → mengurangi kebutuhan opioid 20–30%", "Pasien dengan kontraindikasi NSAID (gagal ginjal, peptic ulcer)"],
    local_guideline: "PERDICI: Parasetamol sebagai analgesik multimodal dan antipiretik lini pertama. Aman pada gagal ginjal.",
    intl_guideline: "SCCM PADIS 2018: Parasetamol sebagai ko-analgesik untuk mengurangi konsumsi opioid ICU."
  },
  contraindications: ["Gagal hati berat (Child-Pugh C — kontraindikasi relatif)", "Hipersensitivitas terhadap parasetamol", "Fenilketonuria (formulasi tertentu mengandung aspartam)"],
  precautions: ["Batas aman 4 g/hari — SANGAT PENTING diikuti", "Alkoholisme kronik: hepatotoksik pada dosis lebih rendah (2 g/hari lebih aman)", "Malnutrisi berat: cadangan glutathion ↓ → hepatotoksisitas"],
  dosing: {
    standard: "1 g IV setiap 6–8 jam (infus 15 menit)",
    range_low: "500 mg IV setiap 6 jam",
    range_high: "1 g IV setiap 4 jam (maks 4 g/hari)",
    max: "4 g/hari (3 g/hari pada elderly, alkoholisme, malnutrisi)",
    loading: null,
    maintenance: "1 g IV setiap 6 jam rutin (bukan PRN — kadar stabil lebih efektif)",
    route: ["IV", "Oral", "Rektal"],
    dilution: "Ready-to-use 10 mg/mL (100 mL = 1 g). Infus selama 15 menit.",
    rate: "100 mL selama 15 menit",
    titration: "Dosis reguler lebih efektif dari PRN untuk nyeri kronis/persisteren",
    special_notes: "Hindari double-dosis dari kombinasi yang mengandung parasetamol (kombinasi OBH, paracetamol oral, dll) — hepatotoksik."
  },
  renal_adjustment: {
    ge60:   { dose: "1 g",   interval: "q6j", note: "" },
    r30_60: { dose: "1 g",   interval: "q6j", note: "Aman" },
    r15_30: { dose: "1 g",   interval: "q6–8j", note: "Perpanjang interval" },
    r_lt15: { dose: "500mg–1g", interval: "q8j", note: "Akumulasi metabolit minor. Umumnya aman." },
    hd:     { dose: "1 g",   interval: "q8j post-HD", note: "Terdialisis sebagian" },
    crrt:   { dose: "1 g",   interval: "q6–8j", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Parasetamol AMAN pada gagal ginjal — pilih ini dibanding NSAID/morfin"
  },
  hepatic_adjustment: {
    child_a: "Normal (maks 3 g/hari)", child_b: "1 g q8j (maks 2 g/hari)", child_c: "Kontraindikasi relatif — bila mutlak: 500 mg q8j",
    note: "Metabolisme hepatik utama. Overdosis → NAPQI toksik → gagal hati akut."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman — pilihan analgesik/antipiretik pada kehamilan",
    trimester_2: "Aman",
    trimester_3: "Aman dalam dosis terapeutik",
    labor_delivery: "Aman",
    fetal_risk: "Tidak ada bukti teratogenik pada dosis terapeutik",
    lactation: "Aman — ekskresi ke ASI minimal",
    lactation_note: "Pilihan analgesik paling aman saat laktasi"
  },
  monitoring: {
    efficacy: ["NRS/CPOT setiap 4–6 jam", "Suhu tubuh jika sebagai antipiretik"],
    safety: ["LFT (ALT/AST) setiap 48–72 jam pada pasien risiko hepatotoksisitas", "Pastikan tidak ada double-dosing parasetamol dari sumber lain"],
    frequency: "Monitoring nyeri setiap 4–6 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Hepatotoksik pada overdosis (>4 g/hari, atau lebih rendah pada alkoholisme/malnutrisi)", "Gagal hati akut fulminan — NAC (N-acetylcysteine) sebagai antidot"],
    common: ["Umumnya sangat baik ditoleransi", "Trombositopenia (jarang)", "Hipersensitivitas (jarang)"],
    antidote: "Overdosis: N-acetylcysteine (NAC) IV. Loading 150 mg/kg dalam 200 mL D5W (60 menit) → 50 mg/kg/4 jam → 100 mg/kg/16 jam."
  },
  interactions: {
    major: [
      { drug: "Warfarin", effect: "↑ INR — parasetamol dosis tinggi (>2 g/hari reguler) → ↑ efek antikoagulan", management: "Monitor INR jika dosis tinggi reguler" }
    ],
    moderate: [
      { drug: "Alkohol kronik", effect: "↑ risiko hepatotoksisitas — gunakan dosis rendah" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Analgesik multimodal opioid-sparing di ICU" }
  ]
},

"ketorolak": {
  name: "Ketorolak (Ketorolac)",
  brand_id: ["Toradol", "Ketorolac Dexa", "Torasic", "Dolac"],
  brand_id_notes: "Tersedia luas di Indonesia. Ampoule 30 mg/mL. Relatif murah.",
  class: "NSAID",
  subclass: "Analgetik non-opioid (COX inhibitor)",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Sering digunakan post-operasi.",
  mechanism: "Inhibisi non-selektif COX-1 dan COX-2 → ↓ sintesis prostaglandin → analgesia dan antiinflamasi. TIDAK menyebabkan sedasi atau depresi napas. Analgesia setara morfin 6–12 mg untuk nyeri akut. Efek antiplatelet via COX-1.",
  pkpd_type: null,
  pkpd_note: "Dosis tunggal efektif 6–8 jam. Jangan gunakan >5 hari — risiko GI dan renal meningkat dramatis.",
  spectrum: null,
  indications: {
    icu_primary: ["Nyeri post-operasi akut — opioid-sparing", "Nyeri muskuloskeletal/pleuritik pada pasien ICU"],
    icu_secondary: ["Ko-analgesia dalam protokol multimodal", "Kolic renal (nyeri hebat tanpa indikasi opioid)"],
    local_guideline: "Digunakan luas post-operasi Indonesia. Hindari pada gagal ginjal.",
    intl_guideline: "SCCM PADIS 2018: NSAID sebagai adjun analgesia multimodal. Hindari pada pasien dengan risiko AKI, GI bleed, atau trombosit rendah."
  },
  contraindications: ["Gagal ginjal (AKI atau CKD eGFR <30) — nefrotoksik", "Riwayat ulkus peptikum aktif atau perdarahan GI", "Koagulopati atau trombositopenia <100.000", "Pasien post-CABG (meningkatkan risiko kardiovaskular)", "Dehidrasi berat"],
  precautions: ["Gunakan maksimum 5 hari", "Hindari kombinasi dengan antikoagulan (↑ risiko perdarahan GI)", "Monitoring urin output dan kreatinin", "Pada syok: hindari — vasokonstriksi renal memperburuk perfusi"],
  dosing: {
    standard: "15–30 mg IV/IM setiap 6 jam",
    range_low: "15 mg IV/IM (elderly, BB <50 kg, eGFR 30–60)",
    range_high: "30 mg IV/IM q6j",
    max: "120 mg/hari (atau 90 mg/hari pada elderly/BB rendah/CKD ringan)",
    loading: "Dosis pertama boleh 30–60 mg IM (dosis tunggal)",
    maintenance: "15–30 mg IV/IM setiap 6 jam — MAKS 5 HARI",
    route: ["IV", "IM"],
    dilution: "Dapat diberikan langsung undiluted IV pelan (>15 detik) atau diencerkan dalam 50 mL NS.",
    rate: "IV pelan >15 detik. Atau infus 15 menit jika diencerkan.",
    titration: null,
    special_notes: "⚠ BATAS 5 HARI KETAT — risiko GI dan renal meningkat tajam setelah hari ke-5. Transisi ke analgesik oral segera bila bisa."
  },
  renal_adjustment: {
    ge60:   { dose: "30 mg q6j", interval: "Normal", note: "" },
    r30_60: { dose: "15 mg q6j", interval: "Normal", note: "Kurangi dosis 50%. Monitor kreatinin." },
    r15_30: { dose: "HINDARI", interval: "—", note: "Risiko AKI sangat tinggi. Gunakan parasetamol." },
    r_lt15: { dose: "HINDARI", interval: "—", note: "Kontraindikasi — nefrotoksik berat" },
    hd:     { dose: "HINDARI", interval: "—", note: "Kontraindikasi" },
    crrt:   { dose: "HINDARI", interval: "—", note: "Kontraindikasi" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI pada eGFR <30. Monitor kreatinin setiap 24–48 jam jika eGFR 30–60."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Gunakan dengan hati-hati — risiko GI ↑", child_c: "Hindari — risiko perdarahan variseal dan GI",
    note: "Metabolisme hepatik. Sirosis: risiko perdarahan GI dan variseal ↑."
  },
  pregnancy: {
    fda_category: "C (TM 1–2) / D (TM 3)",
    trimester_1: "Hindari — teratogen pada hewan",
    trimester_2: "Hindari jika memungkinkan",
    trimester_3: "KONTRAINDIKASI — penutupan dukus arteriosus prematur, oligohidramnios",
    labor_delivery: "Kontraindikasi — perdarahan maternal dan neonatus",
    fetal_risk: "TM 3: penutupan dukus arteriosus, oligohidramnios, hipertensi pulmonal neonatus",
    lactation: "Hindari — ekskresi ke ASI bermakna",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["NRS/CPOT setiap 4–6 jam"],
    safety: ["Kreatinin dan urin output setiap 24–48 jam", "Tanda perdarahan GI (melena, hematemesis)", "Trombosit jika perdarahan"],
    frequency: "Monitor fungsi ginjal setiap 24–48 jam selama penggunaan",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["AKI (terutama pada hipovolemia, CKD, elderly)", "Perdarahan GI berat", "Perdarahan post-operasi (antiplatelet)"],
    common: ["Dispepsia", "Mual", "↑ kreatinin transien", "Retensi cairan", "Sakit kepala"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Antikoagulan (warfarin, heparin, LMWH)", effect: "↑ risiko perdarahan GI dan sistemik", management: "Hindari kombinasi atau monitor sangat ketat" }
    ],
    moderate: [
      { drug: "ACE Inhibitor/ARB", effect: "↑ risiko AKI (tripple whammy: NSAID+ACEi+diuretik)" },
      { drug: "Kortikosteroid", effect: "↑ risiko ulkus peptikum dan perdarahan GI" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: NSAID sebagai komponen analgesia multimodal; hindari pada risiko AKI/GI" }
  ]
},

"sisatrakurium": {
  name: "Sisatrakurium (Cisatracurium)",
  brand_id: ["Nimbex"],
  brand_id_notes: "Nimbex (AstraZeneca/GSK). Tersedia di RS besar Indonesia. Harga lebih tinggi dari rokuronium.",
  class: "Neuromuskular bloker",
  subclass: "Benzilisokuinolin NDNMB non-depolarizing",
  category: ["nmb"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia. Pilihan NMB untuk ARDS berat.",
  mechanism: "Blok kompetitif reseptor nikotinik asetilkolin di neuromuscular junction. UNIK: Eliminasi via degradasi Hofmann (spontan, pH dan suhu dependen) + hidrolisis ester enzim — TIDAK tergantung fungsi hati atau ginjal. Tidak melepaskan histamin.",
  pkpd_type: null,
  pkpd_note: "Onset 2–3 menit. Durasi 45–75 menit per bolus. Metabolit laudanosin inaktif (tidak toksik pada dosis ICU).",
  spectrum: null,
  indications: {
    icu_primary: ["ARDS berat (P/F ratio <150) — fasilitasi lung-protective ventilation", "Fasilitasi intubasi darurat dan sinkronisasi ventilator awal"],
    icu_secondary: ["Status asmatikus refrakter memerlukan ventilasi terkontrol penuh", "Hipotermia terapeutik post-cardiac arrest (mencegah shivering)"],
    local_guideline: "PERDICI: NMB pada ARDS berat (P/F <150) dalam 48 jam pertama. Protokol TOF monitoring.",
    intl_guideline: "ACURASYS trial (Papazian 2010, NEJM): CIS 48 jam pada ARDS berat ↓ 90-hari mortalitas. RE-EVAL (Moss 2019, NEJM): tidak konfirmasi manfaat jika sedasi dalam sudah adekuat. Panduan saat ini: pertimbangkan NMB pada ARDS berat jika dyssynchrony persisten."
  },
  contraindications: ["Hipersensitivitas terhadap sisatrakurium", "TANPA sedasi/analgesia adekuat (KONTRAINDIKASI ETIS — pasien conscious paralysis)"],
  precautions: ["SELALU berikan sedasi/analgesia adekuat sebelum dan selama NMB", "TOF monitoring wajib untuk titrasi dosis", "ICU-acquired weakness (ICUAW) — risiko pada penggunaan >48 jam"],
  dosing: {
    standard: "Infus: 0.5–3 mcg/kg/min IV kontinyu",
    range_low: "0.5–1 mcg/kg/min",
    range_high: "3 mcg/kg/min",
    max: "10 mcg/kg/min (jarang)",
    loading: "0.15–0.2 mg/kg IV bolus untuk intubasi (onset 2–3 menit)",
    maintenance: "Infus 0.5–3 mcg/kg/min, titrasi per TOF",
    route: ["IV"],
    dilution: "200 mg dalam 200 mL NS → 1 mg/mL. Atau 100 mg dalam 100 mL → 1 mg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 1000 = mL/jam (konsentrasi 1 mg/mL)",
    titration: "TOF (Train-of-Four): target 1–2/4 twitches. Kurangi dosis jika TOF 0/4.",
    special_notes: "WAJIB monitoring TOF setiap 4–8 jam. SELALU pastikan sedasi adekuat. Re-evaluasi kebutuhan NMB setiap 24–48 jam."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Degradasi Hofmann — aman" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "AMAN — tidak tergantung ginjal" },
    hd:     { dose: "Normal", interval: "Normal", note: "Degradasi Hofmann independen dialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Aman" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Sisatrakurium AMAN pada gagal ginjal — pilihan NMB terbaik pada AKI/CKD"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — degradasi Hofmann tidak hepatik",
    note: "TIDAK memerlukan penyesuaian pada gagal hati apapun derajatnya."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Data hewan aman",
    trimester_2: "Dapat digunakan jika diperlukan",
    trimester_3: "Dapat digunakan pada SC emergensi",
    labor_delivery: "Dapat digunakan dengan monitoring neonatus",
    fetal_risk: "NMB dapat melewati plasenta — monitor neonatus",
    lactation: "Data tidak ada. Kemungkinan aman — t½ pendek.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["TOF (Train-of-Four) setiap 4–8 jam — target 1–2/4", "Sinkronisasi ventilator", "Parameter ARDS: P/F ratio, driving pressure"],
    safety: ["Sedasi adekuat setiap 2 jam (RASS/BIS)", "Tanda ICUAW setelah stop NMB", "Suhu tubuh (Hofmann degrades lebih lambat pada hipotermia)"],
    frequency: "TOF monitoring setiap 4–8 jam. Re-evaluasi NMB setiap 24–48 jam.",
    therapeutic_range: "TOF: target 1–2/4 (tidak 0/4)"
  },
  adverse_effects: {
    critical: ["ICU-acquired weakness (ICUAW) — terutama penggunaan >48 jam dengan kortikosteroid", "Conscious paralysis jika sedasi tidak adekuat (etis berbahaya)"],
    common: ["Sedikit pelepasan histamin (sangat minimal vs atrakurium)", "Bradikardi (efek vagotonik ringan)"],
    antidote: "Sugammadex TIDAK efektif (bukan steroidal NMB). Neostigmin 0.04 mg/kg + atropin 0.02 mg/kg — efek reversal terbatas."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida", effect: "Potensiasi blok neuromuskular" },
      { drug: "Magnesium sulfat", effect: "Potensiasi blok — kurangi dosis NMB" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "papazian2010", note: "ACURASYS: CIS 48 jam pada ARDS berat P/F <150 — manfaat mortalitas (namun RE-EVAL 2019 tidak konfirmasi)" }
  ]
},

"rokuronium_icu": {
  name: "Rokuronium (ICU)",
  brand_id: ["Esmeron", "Rokuronium Hameln", "Rokuronium Fresenius"],
  brand_id_notes: "Esmeron (MSD/Merck) originator. Generik tersedia. Paling umum untuk RSI di Indonesia.",
  class: "Neuromuskular bloker",
  subclass: "Aminosteroid NDNMB non-depolarizing",
  category: ["nmb"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU dan OK Indonesia. Pilihan RSI.",
  mechanism: "Blok kompetitif reseptor nikotinik asetilkolin. Onset cepat (60–90 detik pada dosis RSI). Metabolisme hepatik dan ekskresi bilier. Reversal cepat dengan sugammadex (enkapsulasi langsung).",
  pkpd_type: null,
  pkpd_note: "Onset RSI: 60–90 detik. Durasi intubasi 30–60 menit. Pada gagal ginjal: durasi memanjang via akumulasi.",
  spectrum: null,
  indications: {
    icu_primary: ["RSI (Rapid Sequence Intubation) — pilihan utama menggantikan suksinilkolin jika ada kontraindikasi", "Fasilitasi intubasi elektif ICU"],
    icu_secondary: ["Infus NMB pada ARDS berat (alternatif sisatrakurium jika tidak tersedia)", "Fasilitasi prosedur ICU memerlukan immobilisasi"],
    local_guideline: "PERDICI: Rokuronium 1.2 mg/kg untuk RSI (setara suksinilkolin, terutama jika suksinilkolin kontraindikasi).",
    intl_guideline: "Rokuronium 1.2 mg/kg + sugammadex 16 mg/kg untuk reversal cepat RSI jika intubasi gagal. ACEP: Rokuronium setara suksinilkolin untuk RSI."
  },
  contraindications: ["Hipersensitivitas terhadap rokuronium", "TANPA sedasi/analgesia adekuat untuk infus ICU"],
  precautions: ["Akumulasi pada gagal ginjal — durasi memanjang", "Akumulasi pada gagal hati — durasi memanjang", "ICUAW pada infus berkepanjangan", "Selalu sediakan sugammadex jika RSI"],
  dosing: {
    standard: "RSI: 1.2 mg/kg IV bolus. Infus ICU: 0.3–0.6 mg/kg/jam",
    range_low: "Intubasi standar: 0.6 mg/kg",
    range_high: "RSI: 1.2 mg/kg (onset setara suksinilkolin)",
    max: "1.2 mg/kg untuk RSI",
    loading: "RSI: 1.2 mg/kg IV bolus cepat. Intubasi standar: 0.6 mg/kg.",
    maintenance: "Infus 0.3–0.6 mg/kg/jam titrasi per TOF",
    route: ["IV"],
    dilution: "Infus: 200 mg dalam 40 mL NS → 5 mg/mL.",
    rate: "(mg/kg/jam × BB) / 5 = mL/jam",
    titration: "Titrasi per TOF. Target 1–2/4.",
    special_notes: "Sugammadex 16 mg/kg tersedia sebagai reversal CEPAT jika RSI gagal/cannot intubate. WAJIB sediakan sugammadex sebelum RSI."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal bolus RSI", interval: "Interval infus ↑", note: "Durasi memanjang 20–30%" },
    r15_30: { dose: "Normal bolus RSI", interval: "Kurangi infus 25–50%", note: "Akumulasi bermakna" },
    r_lt15: { dose: "Normal bolus RSI", interval: "Kurangi infus 50%, monitor TOF ketat", note: "Durasi bolus bisa 2–3× normal" },
    hd:     { dose: "Normal bolus RSI", interval: "Monitor TOF ketat", note: "HD tidak efektif mengeluarkan rokuronium" },
    crrt:   { dose: "Normal bolus RSI", interval: "Monitor TOF", note: "" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "TOF wajib setiap 4 jam pada gagal ginjal — durasi memanjang tak terduga"
  },
  hepatic_adjustment: {
    child_a: "Normal bolus; kurangi infus 25%", child_b: "Kurangi infus 50%", child_c: "Bolus hanya jika diperlukan; hindari infus — akumulasi dramatis",
    note: "Ekskresi bilier hepatik utama. Sirosis → clearance ↓ signifikan."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali RSI emergensi",
    trimester_2: "RSI emergensi jika diperlukan",
    trimester_3: "Dapat digunakan pada SC emergensi (RSI)",
    labor_delivery: "Dapat melewati plasenta — monitor neonatus",
    fetal_risk: "Relaksasi otot neonatus transien",
    lactation: "Data tidak ada. Kemungkinan aman — t½ pendek.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["TOF setiap 4–8 jam untuk infus ICU", "Kondisi intubasi untuk RSI"],
    safety: ["Sedasi adekuat selama NMB", "Tanda ICUAW setelah stop"],
    frequency: "TOF setiap 4–8 jam jika infus ICU. RSI: satu kali bolus.",
    therapeutic_range: "TOF target 1–2/4 untuk infus ICU"
  },
  adverse_effects: {
    critical: ["ICUAW pada infus berkepanjangan", "Conscious paralysis jika sedasi tidak adekuat"],
    common: ["Takikardia ringan (efek vagolitik)", "Peningkatan bronkosekresi (jarang)"],
    antidote: "Sugammadex: reversal RSI (1.2 mg/kg) → 16 mg/kg. Reversal standar: 2–4 mg/kg. BEKERJA dalam 3 menit."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida / Magnesium sulfat", effect: "Potensiasi blok neuromuskular" },
      { drug: "Antibiotik (klindamisin, linkomisin)", effect: "Potensiasi NMB" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "RSI di ICU — rokuronium 1.2 mg/kg setara suksinilkolin" }
  ]
},

"vekuronum": {
  name: "Vekuronium",
  brand_id: ["Norcuron", "Vekuronium Hameln"],
  brand_id_notes: "Norcuron (MSD). Tersedia di beberapa RS Indonesia. Kurang umum dari rokuronium.",
  class: "Neuromuskular bloker",
  subclass: "Aminosteroid NDNMB non-depolarizing",
  category: ["nmb"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas — lebih jarang dari rokuronium",
  mechanism: "Blok kompetitif reseptor nikotinik. Onset intermediate (2–3 menit). Metabolisme hepatik ke metabolit 3-desasetil-vekuronium (aktif, akumulasi pada gagal ginjal). Tidak melepaskan histamin.",
  pkpd_type: null,
  pkpd_note: "Metabolit aktif 3-OH-vekuronium dapat berakumulasi pada gagal ginjal → blok berkepanjangan.",
  spectrum: null,
  indications: {
    icu_primary: ["Fasilitasi intubasi — alternatif rokuronium", "Infus NMB ICU jika rokuronium/sisatrakurium tidak tersedia"],
    icu_secondary: ["NMB perioperatif"],
    local_guideline: "Penggunaan menurun — rokuronium dan sisatrakurium lebih disukai.",
    intl_guideline: "Penggunaan ICU menurun drastis — sisatrakurium/rokuronium lebih dipilih karena keunggulan farmakokinetik."
  },
  contraindications: ["Hipersensitivitas terhadap vekuronium", "Tanpa sedasi/analgesia adekuat"],
  precautions: ["Akumulasi metabolit aktif pada gagal ginjal", "Akumulasi pada gagal hati", "ICUAW pada penggunaan lama + kortikosteroid"],
  dosing: {
    standard: "Intubasi: 0.1 mg/kg IV. Infus: 0.05–0.1 mg/kg/jam",
    range_low: "0.05 mg/kg/jam",
    range_high: "0.1 mg/kg/jam",
    max: "0.1 mg/kg bolus untuk intubasi",
    loading: "0.1 mg/kg IV bolus (onset 2–3 menit)",
    maintenance: "Infus 0.05–0.1 mg/kg/jam, titrasi per TOF",
    route: ["IV"],
    dilution: "10 mg (setelah rekonstitusi) dalam 50 mL NS → 0.2 mg/mL.",
    rate: "(mg/kg/jam × BB) / 0.2 = mL/jam",
    titration: "TOF target 1–2/4",
    special_notes: "Rekonstitusi dengan WFI: 5 mg powder + 5 mL WFI → 1 mg/mL."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal bolus", interval: "Kurangi infus 25%", note: "Metabolit 3-OH mulai akumulasi" },
    r15_30: { dose: "Normal bolus", interval: "Kurangi infus 50%", note: "Akumulasi bermakna" },
    r_lt15: { dose: "Normal bolus", interval: "Pertimbangkan sisatrakurium", note: "Akumulasi metabolit aktif — lebih baik ganti sisatrakurium" },
    hd:     { dose: "Hindari infus — gunakan sisatrakurium", interval: "—", note: "Metabolit aktif tidak terdialisis efektif" },
    crrt:   { dose: "Dosis rendah, TOF ketat", interval: "Monitor", note: "" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Pada eGFR <30: pertimbangkan ganti sisatrakurium. TOF wajib setiap 4 jam."
  },
  hepatic_adjustment: {
    child_a: "Kurangi 25%", child_b: "Kurangi 50%", child_c: "Hindari infus — gunakan sisatrakurium",
    note: "Metabolisme dan ekskresi bilier hepatik. Sirosis → akumulasi bermakna."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari", trimester_2: "Emergensi saja", trimester_3: "Emergensi saja",
    labor_delivery: "Dapat digunakan SC emergensi",
    fetal_risk: "Blok neuromuskular neonatus transien",
    lactation: "Data tidak ada",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["TOF setiap 4–8 jam"],
    safety: ["Sedasi adekuat", "ICUAW post-stop"],
    frequency: "TOF setiap 4–8 jam",
    therapeutic_range: "TOF 1–2/4"
  },
  adverse_effects: {
    critical: ["ICUAW", "Blok berkepanjangan pada gagal ginjal/hati"],
    common: ["Tidak ada efek otonom bermakna"],
    antidote: "Neostigmin 0.04 mg/kg + atropin 0.02 mg/kg. Sugammadex juga efektif (steroidal NMB)."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida / Magnesium", effect: "Potensiasi blok neuromuskular" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "NMB ICU — sisatrakurium lebih disukai pada gagal ginjal/hati" }
  ]
},

"pankuronum": {
  name: "Pankuronium",
  brand_id: ["Pavulon"],
  brand_id_notes: "Pavulon (MSD/Organon). Ketersediaan semakin berkurang. Paling murah dari semua NMB.",
  class: "Neuromuskular bloker",
  subclass: "Aminosteroid NDNMB long-acting",
  category: ["nmb"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan menurun di Indonesia — digantikan rokuronium/vekuronium",
  mechanism: "Blok kompetitif reseptor nikotinik. Long-acting (60–100 menit per bolus). Efek vagolitik kuat → takikardia (membedakan dari vekuronium). Akumulasi bermakna pada gagal ginjal dan hati.",
  pkpd_type: null,
  pkpd_note: "t½ eliminasi 100–120 menit. Sangat tidak predictable pada ICU — tidak dianjurkan untuk infus kontinu.",
  spectrum: null,
  indications: {
    icu_primary: ["Fasilitasi intubasi elektif jika rokuronium tidak tersedia"],
    icu_secondary: ["Bolus intermiten jika NMB lain tidak tersedia"],
    local_guideline: "Tidak direkomendasikan sebagai NMB utama ICU modern. Dipertahankan hanya jika tidak ada pilihan lain.",
    intl_guideline: "TIDAK direkomendasikan untuk infus kontinu ICU. Akumulasi tidak terprediksi. Gunakan rokuronium atau sisatrakurium."
  },
  contraindications: ["Gangguan ginjal atau hati signifikan (akumulasi)", "Takikardia signifikan (efek vagolitik)", "Tanpa sedasi/analgesia adekuat"],
  precautions: ["Akumulasi dramatis pada gagal ginjal/hati", "Takikardia berat via efek vagolitik", "Tidak untuk infus kontinu — tidak predictable", "ICUAW sangat tinggi"],
  dosing: {
    standard: "Intubasi: 0.08–0.1 mg/kg IV bolus",
    range_low: "0.08 mg/kg",
    range_high: "0.1 mg/kg",
    max: "0.1 mg/kg per bolus",
    loading: "0.08–0.1 mg/kg IV bolus (onset 3–5 menit)",
    maintenance: "Bolus intermiten 0.01–0.02 mg/kg jika diperlukan — BUKAN infus kontinu",
    route: ["IV"],
    dilution: "Ready-to-use 2 mg/mL",
    rate: "Hanya bolus",
    titration: "TOF monitoring jika berulang",
    special_notes: "⚠ TIDAK untuk infus kontinu ICU — akumulasi tidak terprediksi. Gunakan rokuronium atau sisatrakurium."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25–50%", interval: "Perpanjang interval", note: "Akumulasi" },
    r15_30: { dose: "HINDARI", interval: "—", note: "Akumulasi dramatis. Ganti sisatrakurium." },
    r_lt15: { dose: "HINDARI", interval: "—", note: "Kontraindikasi relatif. Gunakan sisatrakurium." },
    hd:     { dose: "HINDARI", interval: "—", note: "Tidak efektif terdialisis" },
    crrt:   { dose: "HINDARI", interval: "—", note: "Gunakan sisatrakurium" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI pada eGFR <30 — gunakan sisatrakurium sebagai gantinya"
  },
  hepatic_adjustment: {
    child_a: "Kurangi 50%", child_b: "Hindari", child_c: "Hindari — gunakan sisatrakurium",
    note: "Ekskresi bilier dan renal. Sirosis → akumulasi dramatis."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari", trimester_2: "Hindari", trimester_3: "Emergensi saja",
    labor_delivery: "Tidak dianjurkan",
    fetal_risk: "Blok neonatus berkepanjangan",
    lactation: "Data tidak ada",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["TOF jika bolus berulang"],
    safety: ["HR — takikardia vagolitik", "Durasi blok — sangat variabel"],
    frequency: "TOF setiap bolus",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Blok berkepanjangan tidak terprediksi pada gagal ginjal/hati", "ICUAW sangat tinggi"],
    common: ["Takikardia (vagolitik)", "Hipertensi", "Salivasi meningkat"],
    antidote: "Neostigmin 0.04 mg/kg + atropin 0.02 mg/kg. Sugammadex efektif (steroidal NMB)."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida / Magnesium", effect: "Potensiasi blok" }
    ]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Pankuronium tidak direkomendasikan untuk infus ICU modern" }
  ]
},

"insulin_infus": {
  name: "Insulin Regular (Infus ICU)",
  brand_id: ["Actrapid HM", "Humulin R", "Insulin Regular Novo Nordisk"],
  brand_id_notes: "Actrapid paling umum di Indonesia. Humulin R tersedia di RS besar.",
  class: "Hormon / Antidiabetik",
  subclass: "Insulin regular (soluble)",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Termasuk daftar obat HIGH-ALERT ISMP.",
  mechanism: "Berikatan reseptor insulin (RTK) → sinyal intraseluler → uptake glukosa oleh sel otot dan lemak, inhibisi glikogenolisis dan glukoneogenesis hati, anabolisme protein. Pada hiperglikemia ICU: manfaat dari kontrol glukosa moderat (140–180 mg/dL) tanpa hipoglikemia.",
  pkpd_type: null,
  pkpd_note: "Onset infus: 15–30 menit. t½ 5–10 menit. Efek bervariasi per resistensi insulin pasien.",
  spectrum: null,
  indications: {
    icu_primary: ["Hiperglikemia ICU — target glukosa 140–180 mg/dL (NICE-SUGAR 2009)", "Hiperosmoler hiperglikemik state (HHS)", "DKA berat (biasanya infus setelah loading)"],
    icu_secondary: ["Hiperkalemia darurat (insulin 10 unit + D50 → K masuk sel)", "Nutrisi parenteral total (TPN) — mengatur glukosa"],
    local_guideline: "PERDICI: Target glukosa ICU 140–180 mg/dL. Protokol sliding scale atau infus kontinu per algoritma.",
    intl_guideline: "NICE-SUGAR (2009, NEJM): Target 140–180 mg/dL aman. Intensive control (80–110) → ↑ mortalitas dan hipoglikemia. SCCM 2012: Konsisten 140–180 mg/dL."
  },
  contraindications: ["Hipoglikemia (BG <70 mg/dL) — STOP SEGERA", "Hipersensitivitas (sangat jarang)"],
  precautions: ["Hipoglikemia — efek samping paling berbahaya di ICU", "Variabilitas glukosa tinggi → outcome buruk", "Adsorpsi ke kantong dan selang IV — gunakan selang polipropilen, flush sebelum mulai"],
  dosing: {
    standard: "Infus: mulai 0.05–0.1 unit/kg/jam, titrasi per protokol glukosa",
    range_low: "0.02 unit/kg/jam",
    range_high: "0.2–0.5 unit/kg/jam (resistensi insulin berat)",
    max: "Tidak ada batas kaku — titrasi per glukosa",
    loading: "DKA: 0.1 unit/kg bolus IV. HHS: biasanya tanpa bolus.",
    maintenance: "Infus kontinu titrasi per protokol GCU (glucose control unit)",
    route: ["IV"],
    dilution: "50 unit dalam 50 mL NS → 1 unit/mL. Kocok perlahan. Flush 20 mL sebelum mulai (adsorpsi ke selang).",
    rate: "unit/jam / 1 = mL/jam",
    titration: "Cek glukosa setiap 1–2 jam. Naikkan/turunkan 0.01–0.02 unit/kg/jam per algoritma.",
    special_notes: "⚠ Adsorpsi insulin ke selang PVC: flush 20 mL larutan insulin sebelum mulai infus ke pasien. Gunakan selang polipropilen."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25%", interval: "Monitor GD lebih sering", note: "Waktu paruh insulin ↑ pada GFR rendah" },
    r15_30: { dose: "Kurangi 50%", interval: "GD setiap 1 jam", note: "Akumulasi insulin" },
    r_lt15: { dose: "Kurangi 50–75%", interval: "GD setiap 30–60 menit", note: "Risiko hipoglikemia sangat tinggi" },
    hd:     { dose: "Kurangi 50%", interval: "GD setiap 1 jam", note: "Clearance ↓. Monitor ketat." },
    crrt:   { dose: "Kurangi 25–50%", interval: "GD setiap 1–2 jam", note: "Glucose dari dialysate mungkin berubah" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Hipoglikemia sangat mudah terjadi pada gagal ginjal — kurangi dosis dan monitor GD lebih sering"
  },
  hepatic_adjustment: {
    child_a: "Kurangi 25% — glikogenolisis ↓", child_b: "Kurangi 50%", child_c: "Kurangi 50–75% — hipoglikemia sangat mudah",
    note: "Metabolisme insulin sebagian hepatik. Sirosis: hipoglikemia puasa dan pada koreksi."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman — insulin tidak melewati plasenta (protein besar)",
    trimester_2: "Aman — dosis mungkin lebih tinggi karena resistensi insulin",
    trimester_3: "Aman",
    labor_delivery: "Monitor glukosa ketat — target 80–140 mg/dL intrapartum",
    fetal_risk: "Hipoglikemia neonatus jika hipoglikemia maternal",
    lactation: "Aman — insulin tidak masuk ASI",
    lactation_note: "Aman menyusui"
  },
  monitoring: {
    efficacy: ["GD setiap 1–2 jam selama infus", "Target GD 140–180 mg/dL (NICE-SUGAR)"],
    safety: ["⚠ Hipoglikemia: GD <70 mg/dL = BAHAYA", "Tanda hipoglikemia: tremor, keringat, penurunan kesadaran (mungkin tidak tampak pada pasien terintubasi/sedasi)", "Kalium (insulin → ↓K)"],
    frequency: "GD setiap 1 jam selama titrasi, setiap 2 jam jika stabil",
    therapeutic_range: "Target GD 140–180 mg/dL (ICU). Hipoglikemia <70 mg/dL = STOP SEGERA."
  },
  adverse_effects: {
    critical: ["Hipoglikemia berat (GD <40 mg/dL) → seizure, kerusakan otak, kematian", "Hipokalemia (insulin memindahkan K ke intraseluler)"],
    common: ["Hipoglikemia ringan-sedang (GD 70–100)", "Hipokalemia", "Edema (efek anabolik)"],
    antidote: "Hipoglikemia: D50W 50 mL IV bolus (atau D10W 200 mL). Ulangi dan cek GD 15 menit."
  },
  interactions: {
    major: [
      { drug: "β-blocker", effect: "Menyembunyikan tanda takikardia hipoglikemia — keringat masih ada", management: "Monitor GD lebih ketat pada pasien β-blocker" }
    ],
    moderate: [
      { drug: "Kortikosteroid", effect: "Antagonis insulin → kebutuhan insulin ↑↑", management: "Tingkatkan dosis insulin saat mulai steroid" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ HIPOGLIKEMIA dapat terjadi tanpa gejala pada pasien sedasi/terintubasi — monitor GD setiap 1 jam",
    "⛔ Adsorpsi ke selang IV: FLUSH 20 mL larutan insulin sebelum sambung ke pasien",
    "⚠ Target GD ICU: 140–180 mg/dL — bukan <110 (NICE-SUGAR: intensif → ↑ mortalitas)",
    "⚠ Pada gagal ginjal: kurangi dosis 50% — insulin tidak terdialisis",
    "⚠ Hati-hati pada pasien β-blocker: gejala hipoglikemia (takikardia) tersembunyi"
  ],
  high_alert_protocol: "Double-check dosis oleh 2 perawat. Protap GCU (Glucose Control Unit) tertulis. GD setiap 1 jam.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "nice_sugar2009", note: "NICE-SUGAR 2009, NEJM: Target GD 140–180 lebih aman dari kontrol intensif 80–110" }
  ]
},

"heparin_ufh": {
  name: "Heparin Tidak Terfraksinasi (UFH)",
  brand_id: ["Heparin Sodium Inviclot", "Heparin Dexa", "Heparin B. Braun"],
  brand_id_notes: "Tersedia di semua RS Indonesia. Ampul 5000 IU/mL dan 25000 IU/5 mL.",
  class: "Antikoagulan",
  subclass: "Inhibitor trombin dan faktor Xa",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Paling umum untuk antikoagulasi akut.",
  mechanism: "Berikatan antitrombin III (AT-III) → kompleks AT-III-heparin mengaktifkan AT-III 1000× → inhibisi trombin (IIa) dan faktor Xa. Reversal dengan protamin sulfat.",
  pkpd_type: null,
  pkpd_note: "t½ 1–2 jam (dosis dependen). Monitoring via aPTT (target 60–100 detik) atau anti-Xa (target 0.3–0.7 IU/mL untuk full antikoagulasi).",
  spectrum: null,
  indications: {
    icu_primary: ["DVT/PE akut — antikoagulasi terapi", "ACS (STEMI, NSTEMI) bersama reperfusi", "CRRT antikoagulasi sirkuit"],
    icu_secondary: ["Profilaksis DVT pada pasien ICU berisiko tinggi (dosis rendah)", "Antikoagulasi ECMO/IABP/LVAD", "HIT type 2 — STOP dan ganti argatroban/bivalirudin"],
    local_guideline: "PERDICI: UFH untuk antikoagulasi akut ICU. Monitoring aPTT target 60–100 detik.",
    intl_guideline: "ACCP 2016: UFH atau LMWH untuk DVT/PE. UFH lebih disukai di ICU (reversibel cepat dengan protamin, dapat dialisis)."
  },
  contraindications: ["Perdarahan aktif mayor", "HIT type 2 (sejarah atau curent) — STOP HEPARIN SEGERA", "Trombositopenia berat <50.000 (relatif)"],
  precautions: ["HIT (Heparin-Induced Thrombocytopenia) — periksa trombosit setiap 2–3 hari", "Resistensi heparin pada defisiensi AT-III", "Monitor perdarahan aktif"],
  dosing: {
    standard: "DVT/PE: 80 unit/kg bolus → 18 unit/kg/jam infus. Profilaksis: 5000 unit SC q8–12j",
    range_low: "10 unit/kg/jam (profilaksis/CRRT)",
    range_high: "30–35 unit/kg/jam (trombosis masif)",
    max: "Titrasi per aPTT — tidak ada batas kaku",
    loading: "80 unit/kg IV bolus (DVT/PE). 60 unit/kg maksimal 4000 unit (ACS).",
    maintenance: "18 unit/kg/jam → titrasi per nomogram aPTT",
    route: ["IV", "SC"],
    dilution: "25000 unit dalam 50 mL NS → 500 unit/mL. Atau 25000 unit dalam 250 mL → 100 unit/mL.",
    rate: "(unit/kg/jam × BB) / 500 = mL/jam",
    titration: "Nomogram: aPTT <50: +4 unit/kg/jam; 50–59: +2; 60–100: tidak ubah; 101–120: -2; >120: stop 1 jam -3.",
    special_notes: "⚠ Periksa trombosit hari ke 4–14. Penurunan trombosit >50% → curiga HIT → stop heparin SEGERA."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Monitor aPTT lebih ketat" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor aPTT — clearance sedikit ↓" },
    r_lt15: { dose: "Normal dosis, monitor ketat", interval: "Normal", note: "Risiko perdarahan meningkat" },
    hd:     { dose: "Normal atau gunakan untuk antikoagulasi HD", interval: "Normal", note: "Monitoring aPTT post-HD" },
    crrt:   { dose: "10–15 unit/kg/jam antikoagulasi sirkuit", interval: "Normal", note: "Anti-Xa target 0.3–0.5 IU/mL untuk CRRT" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor aPTT setiap 6 jam. Risiko perdarahan meningkat pada AKI — pertimbangkan anti-Xa monitoring."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Monitor ketat — AT-III mungkin rendah", child_c: "Hati-hati — koagulopati baseline + AT-III rendah",
    note: "Metabolisme: retikulo-endotelial sistem. Tidak bergantung CYP hepatik."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Aman — tidak melewati plasenta",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Stop 4–6 jam sebelum persalinan atau regional anestesi",
    fetal_risk: "Tidak ada (tidak melewati plasenta)",
    lactation: "Aman — tidak masuk ASI",
    lactation_note: "Pilihan antikoagulan aman saat menyusui"
  },
  monitoring: {
    efficacy: ["aPTT setiap 6 jam sampai stabil, lalu setiap 24 jam", "Anti-Xa jika tersedia (lebih akurat, target 0.3–0.7 IU/mL)", "Tanda dan gejala trombosis"],
    safety: ["Trombosit setiap 2–3 hari (hari 4–14) — HIT screening", "Tanda perdarahan aktif", "Hb/Ht harian jika perdarahan dicurigai"],
    frequency: "aPTT setiap 6 jam saat titrasi. Trombosit setiap 2–3 hari.",
    therapeutic_range: "aPTT 60–100 detik (full antikoagulasi). Profilaksis: aPTT tidak perlu monitoring."
  },
  adverse_effects: {
    critical: ["HIT type 2 (Heparin-Induced Thrombocytopenia + Thrombosis) — paradoksal trombosis fatal", "Perdarahan mayor (intrakranial, retroperitoneal, GI)"],
    common: ["Trombositopenia ringan (HIT type 1, jinak, hari 1–4)", "Perdarahan minor", "Osteoporosis (penggunaan lama >3 bulan)"],
    antidote: "Perdarahan/overdosis: Protamin sulfat 1 mg per 100 unit UFH yang tersisa (infus <10 menit). Maks 50 mg."
  },
  interactions: {
    major: [
      { drug: "Antiplatelet (aspirin, klopidogrel)", effect: "↑ risiko perdarahan", management: "Monitor ketat — kombinasi kadang diperlukan pada ACS" }
    ],
    moderate: [
      { drug: "NSAID", effect: "↑ risiko perdarahan GI" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ HIT type 2: penurunan trombosit >50% hari ke-4–14 → STOP HEPARIN SEGERA, ganti argatroban/fondaparinux",
    "⚠ Periksa trombosit setiap 2–3 hari selama 2 minggu pertama",
    "⚠ Overdosis: Protamin sulfat 1 mg per 100 unit UFH (maks 50 mg, infus pelan)",
    "⚠ Monitor aPTT setiap 6 jam saat titrasi — aPTT >120 detik: STOP 1 jam lalu kurangi dosis"
  ],
  high_alert_protocol: "Double-check dosis oleh 2 perawat. Nomogram heparin tertulis. Trombosit rutin.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "UFH atau LMWH untuk profilaksis dan terapi VTE di ICU" }
  ]
},

"nacl_3pct": {
  name: "NaCl 3% (Saline Hipertonik)",
  brand_id: ["NaCl 3% Otsuka", "Hypertonic Saline 3% B. Braun"],
  brand_id_notes: "Tersedia di RS besar Indonesia. Harus diencerkan/dipersiapkan di beberapa institusi.",
  class: "Elektrolit",
  subclass: "Salin hipertonik",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS besar dan ICU tersier Indonesia",
  mechanism: "Osmolalitas tinggi (1026 mOsm/L) → menarik cairan dari intraseluler ke ekstraseluler → mengoreksi hiponatremia, ↓ edema serebral (↑ osmolalitas plasma → air keluar dari otak). Untuk ICP: ↓ volume otak dalam 15–30 menit.",
  pkpd_type: null,
  pkpd_note: "Koreksi Na terlalu cepat (>10–12 mEq/24 jam) → Osmotic Demyelination Syndrome (ODS) irreversibel.",
  spectrum: null,
  indications: {
    icu_primary: ["Hiponatremia simtomatik berat (Na <120 mEq/L dengan gejala neurologis)", "Hipertensi intrakranial (ICP >20 cmH₂O) — alternatif atau adjun mannitol"],
    icu_secondary: ["Hiponatremia akut (<48 jam) — koreksi lebih agresif aman", "Edema serebral post-stroke, TBI, post-reseksi massa"],
    local_guideline: "Panduan TBI Indonesia: NaCl 3% atau mannitol 20% untuk ICP. PERDICI: Koreksi hiponatremia tidak melebihi 10–12 mEq/L per 24 jam.",
    intl_guideline: "Spasiani 2022, ESICM: NaCl 3% untuk ICP. EAO/ESE 2014: Hiponatremia simtomatik berat → NaCl 3% 150 mL bolus 20 menit, ulangi bila perlu."
  },
  contraindications: ["Hipernatremia (Na >145 mEq/L)", "Edema paru berat (kelebihan cairan)", "Gagal jantung dekompensasi berat (relatif)"],
  precautions: ["Koreksi Na tidak boleh >10–12 mEq/L per 24 jam — ODS", "Pada hiponatremia kronik (>48 jam): lebih lambat, maksimal 8–10 mEq/24 jam", "Monitor Na setiap 2–4 jam selama koreksi"],
  dosing: {
    standard: "Hiponatremia berat: 1–2 mL/kg/jam sampai gejala membaik atau Na naik 5–6 mEq/L. ICP: 100–200 mL bolus 30 menit.",
    range_low: "0.5 mL/kg/jam",
    range_high: "2 mL/kg/jam (hiponatremia simtomatik akut)",
    max: "Tidak boleh menaikkan Na lebih dari 10–12 mEq/L dalam 24 jam",
    loading: "ICP emergensi: 100–250 mL bolus 15–30 menit. Hiponatremia gejala: 150 mL bolus 20 menit.",
    maintenance: "1–2 mL/kg/jam, monitor Na setiap 2 jam",
    route: ["IV"],
    dilution: "Ready-to-use 3% (513 mEq/L). HANYA via CVC — sangat iritatif ke vena perifer.",
    rate: "Volume (mL) / waktu (jam) = mL/jam",
    titration: "Cek Na setiap 2 jam. Stop atau turunkan rate jika Na naik >2 mEq/L per 2 jam.",
    special_notes: "⚠ HANYA via CVC. Perifer dapat menyebabkan flebitis berat. Batas 10–12 mEq/24 jam untuk hiponatremia kronik — ODS tidak reversibel."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Monitor Na dan volume lebih ketat", interval: "Normal", note: "" },
    r15_30: { dose: "Hati-hati — retensi Na dan volume", interval: "Monitor ketat", note: "Oliguria → akumulasi" },
    r_lt15: { dose: "Sangat hati-hati — gunakan dengan panduan nephrology", interval: "Na setiap 1–2 jam", note: "Oliguria/anuria: akumulasi Na cepat" },
    hd:     { dose: "Koordinasi dengan jadwal HD", interval: "Na setiap 1–2 jam", note: "HD dapat mengeluarkan Na berlebih" },
    crrt:   { dose: "Normal dengan monitoring Na ketat", interval: "Na setiap 2 jam", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Gagal ginjal → akumulasi Na dan volume. Na setiap 1–2 jam, urin output ketat."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — asites dapat memburuk", child_c: "Hati-hati — ascites dan edema",
    note: "Tidak ada penyesuaian metabolik — risiko volume overload pada sirosis."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Gunakan hanya emergensi", trimester_2: "Idem", trimester_3: "Idem",
    labor_delivery: "Gunakan dengan monitoring ketat",
    fetal_risk: "Hipernatremia fetal",
    lactation: "Aman dalam jangka singkat",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Na serum setiap 2 jam selama koreksi", "GCS/gejala neurologis jika hiponatremia", "ICP monitoring jika TBI"],
    safety: ["Na tidak boleh naik >12 mEq/24 jam (kronik) atau >18 mEq/24 jam (akut)", "Volume status: TD, edema paru", "Osmolalitas serum target <320 mOsm/L (ICP)"],
    frequency: "Na setiap 2 jam selama koreksi aktif. Setiap 4–6 jam jika stabil.",
    therapeutic_range: "Koreksi Na: maks 10–12 mEq/L per 24 jam (kronik). Target ICP: osmolalitas 300–320 mOsm/L."
  },
  adverse_effects: {
    critical: ["ODS (Osmotic Demyelination Syndrome) — koreksi Na terlalu cepat: paralisis, disfagia, kematian (IRREVERSIBEL)", "Overload cairan / edema paru", "Flebitis berat via vena perifer"],
    common: ["Hipernatremia", "Retensi air dan Na berlebih", "Mual (NaCl hypertonic)"],
    antidote: "ODS: Tidak ada antidot. Pencegahan adalah satu-satunya manajemen."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Kortikosteroid", effect: "Potensiasi retensi Na → hipernatremia dan volume overload" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ ODS (Osmotic Demyelination Syndrome): koreksi Na terlalu cepat → IRREVERSIBEL. Batas 10–12 mEq/24 jam (kronik)",
    "⛔ HANYA via CVC — flebitis berat pada vena perifer",
    "⚠ Monitor Na setiap 2 jam selama koreksi aktif",
    "⚠ Stop infus jika Na naik >2 mEq/L per 2 jam atau sudah naik 8–10 mEq/L"
  ],
  high_alert_protocol: "Verifikasi oleh 2 perawat. Protokol koreksi hiponatremia tertulis. Na setiap 2 jam wajib.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "kraft2005", note: "Panduan koreksi elektrolit ICU — koreksi Na aman" }
  ]
},

"mgso4_icu": {
  name: "Magnesium Sulfat (MgSO₄) ICU",
  brand_id: ["MgSO4 20% Otsuka", "Magnesium Sulfate 40% B. Braun", "Sulfas Magnesikus"],
  brand_id_notes: "Tersedia di semua RS Indonesia. Konsentrasi BERBEDA-BEDA (20%, 40%) — HARUS diperhatikan.",
  class: "Elektrolit / Antikonvulsan / Antiaritmia",
  subclass: "Antagonis kalsium endogen",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. HIGH-ALERT karena overdosis → cardiac arrest.",
  mechanism: "Kofaktor >300 enzim, antagonis kalsium endogen (kompetisi di kanal Ca²⁺). Efek: antiaritmia (mempersingkat aksi potensial), bronkodilatasi (otot polos relaksasi), antikonvulsan (pre-eklampsia/eklampsia — NMDA antagonis), tokolitik (relaksasi uterus), koreksi defisiensi.",
  pkpd_type: null,
  pkpd_note: "Level terapetik 4–7 mEq/L. Toksik >7 mEq/L. Lethal >15 mEq/L. Monitoring klonik patellar wajib.",
  spectrum: null,
  indications: {
    icu_primary: ["Pre-eklampsia/eklampsia — antikonvulsan LINI PERTAMA", "Torsades de Pointes (TdP) — 2g IV bolus", "Hipomagnesemia sedang-berat (Mg <1.7 mg/dL)"],
    icu_secondary: ["Status asmatikus berat — bronkodilatasi", "Hipokalemia refrakter (koreksi Mg dulu)", "Aritmia atrial refrakter (AF, flutter) dengan hipomagnesemia"],
    local_guideline: "POGI/PERDICI: MgSO4 antikonvulsan pre-eklampsia. Dosis Pritchard (IM) atau Zuspan (IV).",
    intl_guideline: "AHA 2019: Mg 2g IV untuk TdP. WHO: MgSO4 lini pertama pre-eklampsia berat/eklampsia."
  },
  contraindications: ["Blok AV derajat 2–3 (Mg menekan konduksi)", "Miastenia gravis — memperburuk NMJ blok", "Anuria (akumulasi dramatis)"],
  precautions: ["Monitor toksisitas: reflek patela hilang (level 7–10 mEq/L) → STOP. Depresi napas (level >10 mEq/L). Cardiac arrest (>15 mEq/L)", "Pemberian bolus terlalu cepat → flushing, hipotensi, cardiac arrest"],
  dosing: {
    standard: "Pre-eklampsia (IV Zuspan): 4g IV 15–20 menit → 1g/jam infus. TdP: 2g IV bolus 2–5 menit. Hipomagnesemia: 2g IV 15–60 menit.",
    range_low: "1g IV (defisiensi ringan)",
    range_high: "6–8g IV (preeklampsia berat loading)",
    max: "Loading: 4–6g. Maintenance: 2g/jam pada eklampsia refrakter (max 8g dalam 8 jam pertama)",
    loading: "Pre-eklampsia: 4g IV pelan 15–20 menit (20% MgSO4: 20 mL, atau 40%: 10 mL diencerkan ke 100 mL). TdP: 2g IV 2 menit.",
    maintenance: "1–2g/jam IV kontinu (pre-eklampsia). Hipomagnesemia: infus 4g dalam 4 jam.",
    route: ["IV", "IM"],
    dilution: "MgSO4 40% (1 mL = 0.4 g = 3.2 mEq). Encerkan ke konsentrasi ≤20% untuk IV perifer atau ≤50% untuk CVC.",
    rate: "1g/jam = 5 mL/jam (40% MgSO4 dalam 50 mL NS → 200 mg/mL = 0.2 g/mL)",
    titration: "Titrasi per gejala klinis dan level Mg. Stop jika reflek patela hilang.",
    special_notes: "⚠ Konsentrasi berbeda di pasaran (20% vs 40%) — VERIFIKASI SELALU. 1g MgSO4 = 8.1 mEq Mg²⁺. Antidot: kalsium glukonat."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi maintenance 25–50%", interval: "Monitor Mg setiap 4–6 jam", note: "Ekskresi renal ↓" },
    r15_30: { dose: "Kurangi 50%", interval: "Mg setiap 2–4 jam", note: "Akumulasi cepat" },
    r_lt15: { dose: "Bolus saja jika mutlak perlu", interval: "Monitor Mg setiap 1–2 jam", note: "Hindari infus kontinu" },
    hd:     { dose: "Hindari infus kontinu", interval: "Monitor Mg post-HD", note: "HD mengeluarkan Mg efektif" },
    crrt:   { dose: "Kurangi 50%", interval: "Mg setiap 2–4 jam", note: "CRRT menurunkan Mg — mungkin perlu suplementasi" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Mg serum setiap 2–4 jam pada gagal ginjal. Reflek patela wajib diperiksa sebelum setiap bolus."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak dimetabolisme hepatik."
  },
  pregnancy: {
    fda_category: "A",
    trimester_1: "Aman untuk suplementasi",
    trimester_2: "Aman",
    trimester_3: "LINI PERTAMA pre-eklampsia/eklampsia",
    labor_delivery: "Dosis loading 4g → maintenance 1g/jam. Monitor neonatus (hipermagnesemia).",
    fetal_risk: "Hipermagnesemia neonatus: hipotonia, depresi napas (transien)",
    lactation: "Aman — Mg normal di ASI",
    lactation_note: "Aman menyusui"
  },
  monitoring: {
    efficacy: ["Mg serum setiap 4–6 jam (target 4–7 mEq/L terapetik, atau 2–3 mEq/L suplementasi)", "Kejang (pre-eklampsia — tidak ada seizure = efektif)"],
    safety: ["Reflek patela sebelum setiap bolus dan setiap 1–2 jam — hilangnya reflek = STOP", "RR — depresi napas (target >12/menit)", "SpO₂ kontinyu", "Tekanan darah", "Urin output (≥25–30 mL/jam) — anuria → akumulasi fatal"],
    frequency: "Mg serum setiap 4–6 jam. Reflek patela setiap 1–2 jam. SpO₂ kontinyu.",
    therapeutic_range: "Suplementasi: 2–3 mEq/L. Antikonvulsan: 4–7 mEq/L. Toksik: >7 mEq/L."
  },
  adverse_effects: {
    critical: ["Depresi napas (Mg >10 mEq/L) → apnea", "Cardiac arrest (Mg >15 mEq/L — henti jantung)", "Hilang reflek patellar (Mg 7–10 mEq/L) = tanda awal toksisitas"],
    common: ["Flushing / rasa panas saat bolus", "Hipotensi", "Mual/muntah", "Kelemahan otot"],
    antidote: "TOKSISITAS MG: Kalsium glukonat 10% 10–20 mL IV pelan (10 menit). Antagonis Mg langsung. SIAP SELALU di samping bed."
  },
  interactions: {
    major: [
      { drug: "NMB (rokuronium, sisatrakurium)", effect: "Potensiasi blok neuromuskular — kurangi dosis NMB 25–50%", management: "TOF monitoring lebih ketat" }
    ],
    moderate: [
      { drug: "Nifedipin", effect: "Potensiasi hipotensi berat pada pre-eklampsia" },
      { drug: "Gentamisin/Aminoglikosida", effect: "Potensiasi toksisitas neuromuskular" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ TOKSISITAS: Reflek patela hilang → STOP SEGERA. Antidot: Kalsium glukonat 10% 10 mL IV pelan",
    "⛔ Bolus TERLALU CEPAT → flushing berat, hipotensi, dan cardiac arrest",
    "⛔ Anuria/oliguria berat: akumulasi → cardiac arrest. Pastikan urin output ≥25 mL/jam",
    "⚠ Konsentrasi di pasaran BERBEDA (20% vs 40%) — verifikasi konsentrasi sebelum hitung dosis",
    "⚠ Selalu siapkan Kalsium Glukonat 10% di samping bed selama infus MgSO4"
  ],
  high_alert_protocol: "Double-check konsentrasi dan dosis oleh 2 perawat. Kalsium glukonat siap di bed. Monitoring reflek patela.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "kraft2005", note: "Panduan koreksi elektrolit ICU — magnesium" }
  ]
},

"amiodarone": {
  name: "Amiodarone",
  brand_id: ["Cordarone", "Tiaryt", "Amiodarone Dexa", "Kendaron"],
  brand_id_notes: "Cordarone (Sanofi) originator. Generik lokal tersedia. Tersedia di semua RS Indonesia.",
  class: "Antiaritmia",
  subclass: "Kelas III (inhibitor kanal K) + I + II + IV",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Pilihan utama aritmia ventrikel ICU.",
  mechanism: "Multi-kelas antiaritmia: Kelas III dominan (inhibisi kanal K → ↑ durasi aksi potensial, ↑ refrakter), kelas I (Na channel), II (β-adrenergik antagonis), IV (Ca channel). Waktu paruh sangat panjang (40–55 hari).",
  pkpd_type: null,
  pkpd_note: "t½ 40–55 hari (sangat panjang karena akumulasi di jaringan lemak dan paru). Efek dapat bertahan berbulan-bulan setelah stop.",
  spectrum: null,
  indications: {
    icu_primary: ["VF/pulseless VT refrakter defibrilasi (ACLS: 300 mg bolus)", "VT/SVT stabil hemodinamik dengan LV disfungsi", "AF dengan rapid ventricular rate pada syok"],
    icu_secondary: ["Profilaksis post-cardiac surgery AF", "Konversi AF/flutter (IV)", "VT berulang refrakter antiaritmia lain"],
    local_guideline: "AHA ACLS 2020: Amiodarone 300 mg IV/IO pada VF/pVT setelah defibrilasi ke-3 tidak berhasil.",
    intl_guideline: "AHA 2019 Ventricular Arrhythmia: Amiodarone lini pertama VT/VF. AHA AF 2019: Rate control AF jika metoprolol kontraindikasi."
  },
  contraindications: ["Bradikardi sinus berat tanpa pacemaker", "Blok AV derajat 2–3 tanpa pacemaker", "Tirotoksikosis (mengandung yodium)", "Hipersensitivitas terhadap yodium"],
  precautions: ["Toksisitas paru (fibrosis paru) — infus >3 bulan", "Toksisitas tiroid (hipo/hipertiroid) — evaluasi TFT sebelum mulai dan berkala", "Hepatotoksik — LFT monitoring", "Interaksi luas — banyak obat dipengaruhi", "Hipotensi berat pada infus cepat IV"],
  dosing: {
    standard: "ACLS VF/pVT: 300 mg IV bolus. Infus loading: 150 mg dalam 10 menit → 1 mg/min × 6 jam → 0.5 mg/min × 18 jam.",
    range_low: "0.5 mg/min (maintenance infus)",
    range_high: "1 mg/min (loading 6 jam)",
    max: "2.2 g/hari (total loading + maintenance)",
    loading: "VF/pVT ACLS: 300 mg IV bolus. Infus loading elektif: 150 mg dalam 100 mL D5W (10 menit).",
    maintenance: "1 mg/min × 6 jam (360 mg) → 0.5 mg/min × 18 jam (540 mg). Oral setelah stabilisasi.",
    route: ["IV", "Oral"],
    dilution: "150 mg dalam 100 mL D5W → 1.5 mg/mL (gunakan D5W, BUKAN NS — presipitat). Infus via CVC untuk konsentrasi >2 mg/mL.",
    rate: "1 mg/min = 60 mL/jam (konsentrasi 1 mg/mL). HITUNG sesuai konsentrasi.",
    titration: "Loading elektif → maintenance. Oral setelah stabilisasi jangka panjang.",
    special_notes: "⚠ GUNAKAN D5W — presipitat dengan NS. Perifer hanya konsentrasi <2 mg/mL. Flebitis sangat umum via vena perifer — gunakan CVC."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak memerlukan penyesuaian dosis" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Ekskresi renal minimal — t½ tidak berubah bermakna" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis (t½ panjang, volume distribusi besar)" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak memerlukan penyesuaian pada gagal ginjal — ekskresi utama feses"
  },
  hepatic_adjustment: {
    child_a: "Normal dengan monitoring LFT", child_b: "Kurangi dosis maintenance 25%", child_c: "Kurangi 50% — hepatotoksik pada baseline penyakit hati",
    note: "Metabolisme hepatik (CYP3A4, CYP2C8) ke metabolit aktif desetilamiodarone. Sirosis → akumulasi."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "HINDARI — teratogen (mengandung yodium, hipotiroid neonatus)",
    trimester_2: "Hanya life-threatening arrhythmia",
    trimester_3: "Idem — yodium → hipotiroid/hipertiroid neonatus",
    labor_delivery: "Pertimbangkan alternatif",
    fetal_risk: "Hipotiroid neonatus, IUGR, prematur",
    lactation: "KONTRAINDIKASI — amiodarone dan metabolit masuk ASI bermakna",
    lactation_note: "Berhenti menyusui jika harus menggunakan amiodarone"
  },
  monitoring: {
    efficacy: ["EKG kontinyu selama infus IV", "Ritme kardiak (konversi ke SR atau kontrol rate)"],
    safety: ["TFT (TSH, fT4) sebelum mulai dan setiap 3–6 bulan", "LFT (ALT/AST) setiap 3–6 bulan", "Foto toraks setiap 6–12 bulan (toksisitas paru)", "QTc — perpanjangan QT (hati-hati TdP meski jarang dari amiodarone sendiri)", "TD selama infus IV (hipotensi)"],
    frequency: "EKG kontinyu selama IV. Foto toraks dan LFT berkala untuk penggunaan kronik.",
    therapeutic_range: "Level plasma tidak dipantau rutin (tidak korelasi baik dengan efikasi/toksisitas)"
  },
  adverse_effects: {
    critical: ["Toksisitas paru (pneumonitis, fibrosis) — dapat fatal, terutama penggunaan >6 bulan", "Hipotensi berat saat infus IV cepat"],
    common: ["Bradikardi", "Hipotensi IV", "Hipotiroid atau hipertiroid", "↑ LFT", "Fotosensitivitas kulit", "Deposit kornea (umum, jinak)", "Neuropati perifer"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Warfarin", effect: "↑ INR 33–50% — amiodarone inhibisi CYP2C9", management: "Kurangi warfarin 33–50% saat mulai amiodarone. Monitor INR ketat." },
      { drug: "Digoksin", effect: "↑ kadar digoksin 70–100% — inhibisi P-gp renal", management: "Kurangi digoksin 50% saat mulai amiodarone. Monitor level." },
      { drug: "Statin (simvastatin, lovastatin)", effect: "↑ kadar statin → miopati/rabdomiolisis", management: "Kurangi dosis statin atau ganti rosuvastatin" }
    ],
    moderate: [
      { drug: "β-blocker / Ca channel blocker", effect: "Sinergisme bradikardi dan blok AV" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ Infus IV cepat → HIPOTENSI BERAT — loading selalu ≥10 menit",
    "⛔ Toksisitas paru pada penggunaan kronik: batuk, dispnea, demam subfebrile → STOP dan evaluasi",
    "⚠ GUNAKAN PELARUT D5W — presipitat dengan NS",
    "⚠ Interaksi warfarin: kurangi dosis warfarin 33–50% + monitor INR ketat",
    "⚠ t½ 40–55 hari — efek samping dapat bertahan berbulan-bulan setelah stop"
  ],
  high_alert_protocol: "Verifikasi pelarut (D5W bukan NS). Double-check dosis. Monitoring EKG kontinyu selama IV.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "AHA ACLS 2020: Amiodarone 300 mg untuk VF/pVT refrakter defibrilasi" }
  ]
},

"nitroprusid": {
  name: "Natrium Nitroprusid (SNP)",
  brand_id: ["Nipride", "Nitroprusside Hameln"],
  brand_id_notes: "Tersedia sangat terbatas di Indonesia. Lebih jarang tersedia dibanding nikardipin. Harus terlindung cahaya.",
  class: "Vasodilator",
  subclass: "Donor nitrit oksida (NO)",
  category: ["high_alert"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan sangat terbatas di Indonesia — nikardipin atau labetolol lebih sering dipakai",
  mechanism: "Donor langsung NO (nitrit oksida) → aktivasi guanilat siklase → ↑ cGMP → relaksasi otot polos arteri DAN vena → ↓ preload DAN afterload. Onset 30–60 detik, durasi 1–10 menit. Metabolisme: sianida bebas (toksik) → tiosianat (renal ekskresi).",
  pkpd_type: null,
  pkpd_note: "Onset: <1 menit. Offset: 1–10 menit. Toksisitas sianida: >72 jam infus atau dosis tinggi >4 mcg/kg/min.",
  spectrum: null,
  indications: {
    icu_primary: ["Hipertensi emergensi berat (SBP >220 mmHg dengan end-organ damage)", "Syok kardiogenik — ↓ afterload dan preload (kombinasi dengan inotropik)"],
    icu_secondary: ["Diseksi aorta (kombinasi esmolol + nitroprusid)", "Hypertensive emergency perioperatif"],
    local_guideline: "Tersedia terbatas — nikardipin IV lebih umum tersedia di Indonesia.",
    intl_guideline: "AHA Hypertensive Emergency 2017: Nitroprusid untuk hipertensi emergensi dengan HF akut. Hindari pada iskemia serebral (coronary steal)."
  },
  contraindications: ["Hipertensi kompensatoria (coarctation, AV shunt)", "Gangguan ginjal berat (akumulasi tiosianat)", "Defisiensi B12 atau hipotiroid (risiko toksisitas sianida ↑)", "Atrofi optik Leber"],
  precautions: ["Toksisitas sianida — infus >72 jam atau >4 mcg/kg/min", "LINDUNGI dari cahaya — solusi terurai cepat dengan cahaya (gunakan foil/lindungi set)", "Hipotensi berat (titrasi hati-hati)", "Rebound hipertensi saat stop mendadak"],
  dosing: {
    standard: "0.3–10 mcg/kg/min IV kontinyu",
    range_low: "0.3–0.5 mcg/kg/min",
    range_high: "10 mcg/kg/min (maks 10 menit saja pada dosis ini)",
    max: "10 mcg/kg/min (sangat singkat). Dosis >4 mcg/kg/min >72 jam → RISIKO SIANIDA",
    loading: null,
    maintenance: "Titrasi per tekanan darah target. Kurangi dosis segera jika tekanan darah tercapai.",
    route: ["IV"],
    dilution: "50 mg dalam 250 mL D5W → 200 mcg/mL. LINDUNGI DARI CAHAYA (foil/kantong gelap).",
    rate: "(mcg/kg/min × BB × 60) / 200 = mL/jam",
    titration: "Naikan/turunkan 0.5 mcg/kg/min setiap 2–3 menit per respons MAP.",
    special_notes: "⚠ LINDUNGI DARI CAHAYA — ganti larutan setiap 4–8 jam. ⚠ Jika tidak respon dalam 10 menit pada dosis maks → stop dan ganti agen lain."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal, batasi durasi", interval: "Normal", note: "Tiosianat mulai akumulasi" },
    r15_30: { dose: "Kurangi — monitor tiosianat", interval: "Normal", note: "Akumulasi tiosianat bermakna" },
    r_lt15: { dose: "HINDARI infus >24 jam", interval: "—", note: "Tiosianat akumulasi → toksisitas. Ganti nikardipin." },
    hd:     { dose: "Hindari atau durasi sangat singkat", interval: "Monitor tiosianat", note: "HD mengeluarkan tiosianat efektif" },
    crrt:   { dose: "Hati-hati — batasi durasi", interval: "Normal", note: "" },
    badge: "avoid",
    dialyzable: true,
    monitoring_renal: "⚠ HINDARI pada eGFR <30 mL/min — tiosianat akumulasi. Ganti nikardipin IV."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — defisiensi B12 mungkin", child_c: "Hati-hati",
    note: "Konversi sianida ke tiosianat via tiosulfat/rhodanase (hati dan jaringan lain)."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "HINDARI — sianida melewati plasenta",
    trimester_2: "Hanya emergensi singkat",
    trimester_3: "Hindari jika ada alternatif (labetolol, nikardipin lebih aman)",
    labor_delivery: "Gunakan <10 menit jika emergensi",
    fetal_risk: "Toksisitas sianida fetal",
    lactation: "Kontraindikasi",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["MAP setiap 1–2 menit selama titrasi (monitoring arterial line direkomendasikan)", "Target MAP biasanya turun 10–25% dalam 1 jam pertama"],
    safety: ["Tiosianat serum jika infus >24–48 jam (target <10 mg/dL)", "Tanda toksisitas sianida: laktat meningkat, metabolik asidosis anion gap, tanda CNS (confused, seizure)", "TD — hipotensi"],
    frequency: "MAP arterial line kontinyu. Tiosianat serum jika infus >24 jam atau gagal ginjal.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Toksisitas sianida: asidosis metabolik, hipotensi refrakter, kejang, kematian (dosis tinggi/lama/gagal ginjal)", "Hipotensi berat", "Toksisitas tiosianat (kronik): gangguan tiroid, neurotoksisitas"],
    common: ["Hipotensi", "Mual/muntah", "Sakit kepala", "Rebound hipertensi saat stop"],
    antidote: "Toksisitas sianida: Natrium tiosulfat 12.5 g IV (atau 25 mL larutan 50%) + Hidroksikobalamin 5g IV (Cyanokit). Stop nitroprusid SEGERA."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Antihipertensi lain / PDE5i (sildenafil)", effect: "Hipotensi berat — efek vasodilator aditif" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ LINDUNGI DARI CAHAYA — larutan terurai dengan cahaya. Ganti setiap 4–8 jam, tutup dengan foil",
    "⛔ Toksisitas SIANIDA pada infus >72 jam atau >4 mcg/kg/min: laktat ↑, asidosis → STOP SEGERA",
    "⛔ HINDARI pada eGFR <30 — akumulasi tiosianat. Ganti nikardipin IV",
    "⚠ Antidot toksisitas sianida: Hidroksikobalamin 5g IV + Natrium tiosulfat 12.5g IV",
    "⚠ Monitoring arterial line sangat dianjurkan — onset/offset sangat cepat"
  ],
  high_alert_protocol: "Lindungi larutan dari cahaya (foil). Monitoring arterial line. Double-check dosis.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Hipertensi emergensi ICU — nitroprusid jika tidak ada nikardipin" }
  ]
},

"digoksin": {
  name: "Digoksin",
  brand_id: ["Lanoxin", "Digoxin Hameln", "Fargoxin"],
  brand_id_notes: "Lanoxin (GSK) originator. Generik tersedia. Ampul 0.25 mg/mL dan tablet 0.25 mg.",
  class: "Glikosida jantung",
  subclass: "Inhibitor Na-K ATPase",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Indeks terapi sempit — HIGH-ALERT.",
  mechanism: "Inhibisi Na-K ATPase → ↑ Na intraseluler → ↑ Ca via Na-Ca exchanger → ↑ kontraktilitas (inotropik positif). Efek vagotonik (↑ tonus vagal) → kronotropik negatif, dromotropik negatif → ↓ HR, ↓ konduksi AV. Indeks terapi sangat sempit.",
  pkpd_type: null,
  pkpd_note: "t½ 36–48 jam. Level terapetik 0.5–0.9 ng/mL (HF) hingga 0.8–2.0 ng/mL (rate control). Cek level 6–8 jam setelah dosis.",
  spectrum: null,
  indications: {
    icu_primary: ["Rate control AF dengan disfungsi LV (EF <40%) — ketika β-blocker atau Ca blocker kontraindikasi", "Gagal jantung sistolik kronik (sebagai adjun — bukan lini pertama)"],
    icu_secondary: ["AF stabil dengan ventricular response cepat", "SVT (jarang — adenosin lebih disukai)"],
    local_guideline: "PERKI: Digoksin untuk rate control AF pada HF sistolik. Level monitoring wajib.",
    intl_guideline: "ESC HF 2021: Digoksin untuk rate control AF pada HF dengan EF rendah (IIa). AHA AF 2019: Digoksin alternatif rate control jika β-blocker/Ca blocker kontraindikasi."
  },
  contraindications: ["Blok AV derajat 2–3", "WPW syndrome (fasilitasi konduksi aksesori → VF)", "Kardiomiopati hipertrofik obstruktif", "Toksisitas digoksin aktif"],
  precautions: ["Indeks terapi sangat sempit — overdosis mudah terjadi", "Hipokalemia SANGAT MENINGKATKAN toksisitas (jaga K ≥4.0 mEq/L)", "Gagal ginjal: akumulasi dramatis — kurangi dosis dan pantau level", "Tiroid: hipotiroid ↑ sensitif terhadap digoksin"],
  dosing: {
    standard: "Loading: 0.5 mg IV pelan, lalu 0.25 mg × 2 selang 6 jam. Maintenance: 0.125–0.25 mg/hari PO/IV.",
    range_low: "0.0625 mg/hari (elderly, gagal ginjal)",
    range_high: "0.375 mg/hari",
    max: "0.5 mg/hari",
    loading: "0.5–1 mg IV dalam dosis terbagi (tidak bolus cepat). Onset rate control: 1–4 jam.",
    maintenance: "0.125–0.25 mg/hari. Kurangi pada elderly dan gagal ginjal.",
    route: ["IV", "PO"],
    dilution: "Encerkan minimal 1:4 dengan NS atau D5W untuk IV. Berikan pelan >5–10 menit.",
    rate: "IV pelan >5–10 menit.",
    titration: "Cek level 6–8 jam setelah dosis. Target 0.5–0.9 ng/mL (HF) atau 0.8–1.5 ng/mL (AF rate control).",
    special_notes: "⚠ JAGA K ≥4.0 mEq/L — hipokalemia + digoksin = toksisitas fatal. Koreksi K/Mg sebelum mulai digoksin."
  },
  renal_adjustment: {
    ge60:   { dose: "0.125–0.25 mg/hari", interval: "q24j", note: "" },
    r30_60: { dose: "0.0625–0.125 mg/hari", interval: "q24–48j", note: "Kurangi 50%. Monitor level." },
    r15_30: { dose: "0.0625 mg/hari", interval: "q48j", note: "Akumulasi bermakna" },
    r_lt15: { dose: "0.0625 mg q48–72j atau HINDARI", interval: "q48–72j", note: "Akumulasi dramatis — pertimbangkan alternatif" },
    hd:     { dose: "0.0625 mg setelah HD", interval: "Post-HD saja", note: "HD tidak efektif (Vd besar)" },
    crrt:   { dose: "0.0625 mg/hari", interval: "q48j", note: "Monitor level ketat" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Level digoksin setiap 3–5 hari pada gagal ginjal. Kalium wajib dipantau — hipokalemia mempotensiate toksisitas."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal — ekskresi renal", child_c: "Normal",
    note: "Ekskresi utama renal (70%). Tidak memerlukan penyesuaian dosis pada gangguan hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas — hindari kecuali indikasi kuat",
    trimester_2: "Dapat digunakan pada AF/SVT berat",
    trimester_3: "Monitor level lebih sering (Vd berubah)",
    labor_delivery: "Level berubah saat persalinan — monitor ketat",
    fetal_risk: "Crossing plasenta — aritmia fetal pada toksisitas",
    lactation: "Ekskresi ke ASI minimal. Umumnya aman.",
    lactation_note: "Monitor bayi untuk bradikardi"
  },
  monitoring: {
    efficacy: ["Laju ventrikel pada AF (target <80/menit istirahat)", "Level digoksin 6–8 jam setelah dosis"],
    safety: ["EKG — PR memanjang, ST scooping, aritmia baru", "Kalium setiap 24–48 jam (jaga K ≥4.0)", "Kreatinin setiap 48 jam", "Level digoksin jika dicurigai toksisitas"],
    frequency: "Level setiap 5–7 hari (kronik) atau 3–5 hari (gagal ginjal). K harian.",
    therapeutic_range: "HF: 0.5–0.9 ng/mL. Rate control AF: 0.8–1.5 ng/mL. Toksik: >2.0 ng/mL."
  },
  adverse_effects: {
    critical: ["Toksisitas: AV blok, VT bidireksional, VF → cardiac arrest", "Dipicu hipokalemia meski level 'normal'"],
    common: ["Mual/muntah (awal toksisitas)", "Anoreksia", "Bradikardia", "Xanthopsia (penglihatan kuning/hijau)", "Bingung pada elderly"],
    antidote: "Toksisitas berat: Digoxin-specific Fab (DigiFab/Digibind) — jarang tersedia di Indonesia. Hipokalemia: koreksi K. AV blok: Atropin atau pacemaker."
  },
  interactions: {
    major: [
      { drug: "Amiodarone", effect: "↑ kadar digoksin 70–100% (inhibisi P-gp renal)", management: "Kurangi digoksin 50% saat mulai amiodarone. Monitor level." },
      { drug: "Hipokalemia (furosemid, tiazid)", effect: "Hipokalemia + digoksin = toksisitas meski level normal", management: "Jaga K ≥4.0 mEq/L SELALU" }
    ],
    moderate: [
      { drug: "Verapamil / Diltiazem", effect: "↑ kadar digoksin + potensiasi bradikardia dan blok AV" }
    ]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: [
    "⛔ Indeks terapi SANGAT SEMPIT — overdosis mudah, bedanya tipis dengan efek terapi",
    "⛔ JAGA K ≥4.0 mEq/L — hipokalemia memotensiate toksisitas bahkan pada level normal",
    "⛔ Gagal ginjal: akumulasi dramatis — kurangi dosis dan monitor level setiap 3–5 hari",
    "⚠ Amiodarone meningkatkan kadar digoksin 70–100% — kurangi dosis digoksin 50% bila dikombinasi",
    "⚠ Tanda awal toksisitas: mual, muntah, bradikardia, gangguan visual — PERIKSA LEVEL"
  ],
  high_alert_protocol: "Double-check dosis. Monitor K+ harian. Level digoksin setiap 5–7 hari atau jika ada perubahan renal/obat.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "ESC HF 2021: Digoksin rate control AF dengan HF sistolik (EF rendah)" }
  ]
},

"ampisilin_sulbaktam": {
  name: "Ampisilin-Sulbaktam",
  brand_id: ["Unasyn", "Sultamisilin", "Ampisulb", "Ampisilin-Sulbaktam Dexa"],
  brand_id_notes: "Unasyn (Pfizer) originator. Generik lokal luas. Tersedia di formularium nasional Indonesia.",
  class: "Antibiotik β-laktam",
  subclass: "Aminopenisilin + inhibitor β-laktamase",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Pilihan empiris infeksi community-onset.",
  mechanism: "Ampisilin: inhibisi PBP → gangguan sintesis dinding sel. Sulbaktam: inhibitor β-laktamase (kelas A dan C) → melindungi ampisilin dari degradasi. Spektrum lebih luas dari ampisilin saja. Sulbaktam juga memiliki aktivitas intrinsik terhadap Acinetobacter baumannii (PBP2).",
  pkpd_type: "time_dependent",
  pkpd_note: "Target T>MIC ≥40–50%. Extended infusion meningkatkan PK/PD target pada MIC borderline.",
  spectrum: {
    gram_pos: "Baik: Streptokokus, Stafilokokus sensitif penisilin, Enterokokus faecalis",
    gram_neg: "Baik: E. coli (bukan ESBL), Klebsiella non-ESBL, H. influenzae. Sulbaktam aktif terhadap A. baumannii.",
    anaerob: "Baik: Bacteroides fragilis, Peptostreptococcus",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: true,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["CAP ringan-sedang (step-down dari IV ke oral)", "Infeksi intra-abdominal komunitas", "Infeksi kulit dan jaringan lunak komunitas berat"],
    icu_secondary: ["Acinetobacter baumannii (sulbaktam dosis tinggi 3g/q8j atau infus 9g/24jam)", "Aspirasi pneumonia/abses paru komunitas", "Meningitis (ampisilin komponen coverage Listeria)"],
    local_guideline: "PERDICI: Ampisilin-sulbaktam untuk CAP non-berat, infeksi abdomen komunitas. Bukan untuk VAP/HAP.",
    intl_guideline: "IDSA CAP 2019: Ampisilin-sulbaktam sebagai pilihan monoterapi CAP rawat inap. IDSA Acinetobacter: Sulbaktam dosis tinggi untuk CRAB."
  },
  contraindications: ["Hipersensitivitas terhadap penisilin (alergi silang ~1–10%)", "Riwayat anafilaksis penisilin"],
  precautions: ["Rash morbiliform tinggi pada pasien mononukleosis (bukan alergi sejati)", "Risiko Clostridioides difficile", "Penyesuaian pada gagal ginjal"],
  dosing: {
    standard: "1.5–3 g IV setiap 6–8 jam (rasio ampisilin:sulbaktam = 2:1)",
    range_low: "1.5 g IV q8j",
    range_high: "3 g IV q6j (Acinetobacter: 9 g/24 jam extended infusion)",
    max: "12 g/hari (sulbaktam komponen 4 g/hari maksimum)",
    loading: null,
    maintenance: "Dosis standar sesuai indikasi. Extended infusion 3 jam untuk Acinetobacter.",
    route: ["IV", "IM"],
    dilution: "1.5g atau 3g dalam 50–100 mL NS. Stabil 8 jam suhu ruang.",
    rate: "Standar: infus 15–30 menit. Extended: 3–4 jam.",
    titration: null,
    special_notes: "Untuk Acinetobacter: sulbaktam 3g IV q8j (sebagai sulbaktam murni) atau ampisilin-sulbaktam 3g q4j — konsultasi DPJP."
  },
  renal_adjustment: {
    ge60:   { dose: "1.5–3g",   interval: "q6–8j", note: "" },
    r30_60: { dose: "1.5–3g",   interval: "q8–12j", note: "" },
    r15_30: { dose: "1.5–3g",   interval: "q12j", note: "" },
    r_lt15: { dose: "1.5g",     interval: "q24j", note: "Monitor neurotoksisitas" },
    hd:     { dose: "1.5g",     interval: "q24j + suplementasi post-HD", note: "Terdialisis bermakna" },
    crrt:   { dose: "1.5–3g",   interval: "q8–12j", note: "" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Sesuaikan interval pada eGFR <30. Monitor tanda neurotoksisitas (myoklonus)."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian pada gangguan hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman — data hewan tidak teratogenik",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Dapat digunakan pada sepsis intrapartum",
    fetal_risk: "Tidak ada bukti teratogenisitas",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil. Umumnya aman.",
    lactation_note: "Monitor bayi untuk diare atau rash"
  },
  monitoring: {
    efficacy: ["Suhu dan tanda klinis setiap 24 jam", "Kultur dan sensitivitas", "PCT/CRP setiap 48–72 jam"],
    safety: ["Fungsi ginjal setiap 48 jam", "Tanda C. difficile colitis", "Rash (bukan alergi — morbiliform EBV)"],
    frequency: "Evaluasi klinis 48–72 jam. De-eskalasi jika kultur memungkinkan.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Anafilaksis (jarang <0.01%)", "Kejang pada dosis sangat tinggi + gagal ginjal"],
    common: ["Diare (10–15%)", "C. difficile colitis", "↑ LFT transien", "Rash (tinggi pada EBV mononukleosis)"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Metotreksat", effect: "Penisilin ↓ ekskresi renal MTX → toksisitas MTX", management: "Hindari kombinasi atau monitor MTX level" }
    ],
    moderate: [
      { drug: "Warfarin", effect: "Antibiotik mengganggu flora usus → ↑ INR", management: "Monitor INR" }
    ]
  },
  stewardship: {
    empiric_sources: ["CAP non-berat", "Infeksi abdomen komunitas", "Kulit dan jaringan lunak komunitas"],
    deescalation_to: ["amoksisilin_oral", "kotrimoksazol (jika sensitif)"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "CAP: 5 hari jika respons baik. Infeksi abdomen terkontrol: 4–5 hari.",
    stop_criteria: "PCT turun >80% atau <0.5 ng/mL + perbaikan klinis",
    avoid_for: ["VAP/HAP (spektrum tidak cukup)", "Infeksi dengan risiko ESBL atau Pseudomonas"],
    local_pattern_note: "Resistensi E. coli terhadap ampisilin-sulbaktam di komunitas Indonesia >30% — periksa kultur lokal."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Antibiotik empiris CAP dan infeksi komunitas" }
  ]
},

"seftriakson": {
  name: "Seftriakson",
  brand_id: ["Rocephin", "Seftriakson Dexa", "Ceftriaxone Kalbe", "Tricefin"],
  brand_id_notes: "Rocephin (Roche) originator. Generik sangat luas. Tersedia di semua RS Indonesia.",
  class: "Antibiotik β-laktam",
  subclass: "Sefalosporin generasi 3",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Paling banyak digunakan di kelas sefalosporin.",
  mechanism: "Inhibisi PBP → gangguan sintesis dinding sel bakteri gram-negatif dan gram-positif. Stabil terhadap banyak β-laktamase, tidak terhadap ESBL/AmpC/KPC. Ekskresi bilier 40% — unik pada sefalosporin.",
  pkpd_type: "time_dependent",
  pkpd_note: "T>MIC target ≥40–70%. t½ 6–9 jam memungkinkan dosis sekali sehari.",
  spectrum: {
    gram_pos: "Baik: Streptokokus pneumoniae, Streptokokus pyogenes. Lemah: Stafilokokus, Enterokokus",
    gram_neg: "Baik: E. coli (non-ESBL), Klebsiella (non-ESBL), H. influenzae, N. meningitidis, N. gonorrhoeae",
    anaerob: "Lemah — tidak untuk infeksi anaerob",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["CAP berat — dikombinasi dengan azitromisin/doksisiklin (atypical coverage)", "Meningitis bakteri komunitas — bersama deksametason", "Sepsis komunitas (step-down dari karbapenem jika ESBL negatif)"],
    icu_secondary: ["Gonore", "Endokarditis (bersama gentamisin)", "Profilaksis meningitis meningokokus"],
    local_guideline: "PERDICI CAP 2022: Seftriakson + makrolid untuk CAP rawat inap. Panduan meningitis PERDOSSI: Seftriakson lini pertama.",
    intl_guideline: "IDSA CAP 2019: Seftriakson + azitromisin untuk CAP rawat inap. ESCMID meningitis 2016: Seftriakson 2g IV q12j dewasa."
  },
  contraindications: ["Hipersensitivitas terhadap sefalosporin", "Neonatus hiperbilirubinemia (menggantikan bilirubin dari albumin)", "Jangan berikan bersamaan dengan kalsium IV pada neonatus"],
  precautions: ["Kolelitik pseudobiliaris — curah bilier tinggi dapat membentuk endapan", "Penyesuaian dosis minimal pada gagal ginjal"],
  dosing: {
    standard: "1–2 g IV/IM sekali sehari atau q12j",
    range_low: "1 g IV q24j",
    range_high: "2 g IV q12j (meningitis, endokarditis)",
    max: "4 g/hari",
    loading: null,
    maintenance: "Dosis standar sesuai indikasi",
    route: ["IV", "IM"],
    dilution: "1–2g dalam 50–100 mL NS. Stabil 24 jam di kulkas, 6 jam suhu ruang.",
    rate: "Infus 30 menit",
    titration: null,
    special_notes: "JANGAN encerkan dengan larutan mengandung kalsium (precipitate). IM: 1g dalam 3.5 mL lidokain 1%."
  },
  renal_adjustment: {
    ge60:   { dose: "1–2g",  interval: "q12–24j", note: "" },
    r30_60: { dose: "1–2g",  interval: "q12–24j", note: "Tidak perlu penyesuaian bermakna" },
    r15_30: { dose: "1–2g",  interval: "q12–24j", note: "Ekskresi bilier meningkat kompensasi" },
    r_lt15: { dose: "1–2g",  interval: "q12–24j", note: "Tidak perlu penyesuaian — ekskresi bilier dominan" },
    hd:     { dose: "1–2g",  interval: "q24j", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "1–2g",  interval: "q24j", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak memerlukan penyesuaian bermakna pada gagal ginjal — keunggulan dibanding karbapenem/penisilin."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Monitor pada gagal hati BERAT + gagal ginjal bersamaan — kurangi dosis",
    note: "Ekskresi bilier 40–60%. Pada gagal hati + gagal ginjal bersamaan: akumulasi mungkin."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman",
    trimester_2: "Aman",
    trimester_3: "Aman. Hindari dekat persalinan pada neonatus ikterus.",
    labor_delivery: "Dapat digunakan",
    fetal_risk: "Minimal. Hindari pada neonatus hiperbilirubinemia.",
    lactation: "Aman — ekskresi ASI kecil",
    lactation_note: "Monitor bayi diare"
  },
  monitoring: {
    efficacy: ["Suhu dan tanda klinis setiap 24 jam", "Kultur dan sensitivitas"],
    safety: ["Tanda pseudolithiasis bilier (nyeri perut kanan atas) pada infus lama", "Tanda C. difficile"],
    frequency: "Evaluasi klinis 48–72 jam",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Anafilaksis (jarang)", "Pseudolithiasis bilier (kolelitiasis transien — biasanya asimtomatik)"],
    common: ["Diare", "C. difficile colitis", "↑ LFT transien", "Eosinofilia"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Warfarin", effect: "Gangguan flora usus → ↑ INR pada dosis tinggi/lama" }
    ]
  },
  stewardship: {
    empiric_sources: ["CAP rawat inap", "Meningitis komunitas", "Sepsis komunitas non-berat"],
    deescalation_to: ["amoksisilin_oral", "sefuroksim_oral"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "CAP: 5 hari. Meningitis: 10–14 hari. Sepsis komunitas: 7 hari.",
    stop_criteria: "PCT <0.5 ng/mL + perbaikan klinis + afebris >48 jam",
    avoid_for: ["VAP/HAP (spektrum tidak cukup)", "Infeksi risiko ESBL atau Pseudomonas"],
    local_pattern_note: "Resistensi Klebsiella ESBL di ICU Indonesia sangat tinggi (>40%) — seftriakson tidak untuk infeksi HAP/nosokomial."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Antibiotik empiris sepsis komunitas dan CAP rawat inap" }
  ]
},

"piperasilin_tazobaktam": {
  name: "Piperasilin-Tazobaktam",
  brand_id: ["Tazocin", "Piptaz", "Piperasilin-Tazobaktam Hameln", "Piperzo"],
  brand_id_notes: "Tazocin (Pfizer) originator. Generik lokal tersedia. Tersedia di RS ICU Indonesia.",
  class: "Antibiotik β-laktam",
  subclass: "Ureidopenisilin + inhibitor β-laktamase",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia. Pilihan empiris HAP/VAP non-ESBL.",
  mechanism: "Piperasilin: inhibisi PBP spektrum luas termasuk Pseudomonas. Tazobaktam: inhibitor β-laktamase kelas A (termasuk beberapa ESBL, TEM, SHV) dan C. Tidak menginhibisi KPC, MBL, OXA-48.",
  pkpd_type: "time_dependent",
  pkpd_note: "T>MIC target ≥50%. Extended infusion 4 jam meningkatkan target PK/PD untuk Pseudomonas dan ESBL dengan MIC borderline.",
  spectrum: {
    gram_pos: "Baik: Streptokokus, Enterokokus faecalis, Stafilokokus sensitif penisilin",
    gram_neg: "Sangat baik: Pseudomonas aeruginosa, E. coli, Klebsiella (termasuk ESBL sebagian), H. influenzae, Enterobacter",
    anaerob: "Baik: Bacteroides fragilis dan anaerob gram-negatif",
    mrsa: false,
    vre: false,
    esbl: true,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["HAP/VAP dengan risiko Pseudomonas aeruginosa (non-ESBL, non-KPC)", "Sepsis berat sumber tidak jelas — spektrum luas empiris", "Infeksi intra-abdominal kompleks (termasuk nosokomial)"],
    icu_secondary: ["Infeksi saluran kemih nosokomial", "Febrile neutropenia (kombinasi dengan aminoglikosida)", "Infeksi kulit dan jaringan lunak berat nosokomial"],
    local_guideline: "PERDICI VAP 2021: Piperasilin-tazobaktam pilihan empiris VAP jika risiko Pseudomonas. Kombinasikan dengan aminoglikosida atau siprofloksasin pada risiko MDR.",
    intl_guideline: "IDSA HAP/VAP 2016: Piperasilin-tazobaktam untuk VAP dengan risiko Pseudomonas (non-MDR). Extended infusion meningkatkan efikasi."
  },
  contraindications: ["Hipersensitivitas terhadap penisilin atau β-laktam", "Riwayat anafilaksis penisilin berat"],
  precautions: ["Penyesuaian dosis signifikan pada gagal ginjal", "Neurotoksisitas (ensefalopati) pada gagal ginjal + dosis tidak disesuaikan", "Hipokalemia — piperasilin mengandung Na tinggi"],
  dosing: {
    standard: "4.5 g IV setiap 8 jam (infus 30 menit) atau extended infusion 4 jam",
    range_low: "2.25 g IV q8j",
    range_high: "4.5 g IV q6j (infeksi berat, Pseudomonas)",
    max: "18 g/hari (piperasilin komponen)",
    loading: null,
    maintenance: "4.5 g q8j standar. Extended infusion: 4.5 g dalam 250 mL NS infus 4 jam q8j.",
    route: ["IV"],
    dilution: "4.5g dalam 50–250 mL NS. Extended infusion: stabil 4 jam suhu ruang.",
    rate: "Standar: 30 menit. Extended: 4 jam.",
    titration: null,
    special_notes: "Extended infusion sangat direkomendasikan untuk Pseudomonas dengan MIC ≥8 mg/L. MERGE trial mendukung extended infusion."
  },
  renal_adjustment: {
    ge60:   { dose: "4.5g",   interval: "q8j",  note: "" },
    r30_60: { dose: "4.5g",   interval: "q8j",  note: "" },
    r15_30: { dose: "2.25g",  interval: "q8j",  note: "Kurangi dosis atau frekuensi" },
    r_lt15: { dose: "2.25g",  interval: "q12j", note: "Monitor neurotoksisitas" },
    hd:     { dose: "2.25g",  interval: "q12j + 0.75g post-HD", note: "Terdialisis bermakna" },
    crrt:   { dose: "4.5g",   interval: "q8–12j", note: "Sesuaikan dengan effluent rate" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Neurotoksisitas (ensefalopati, myoklonus) pada dosis tidak disesuaikan + gagal ginjal. Monitor kreatinin setiap 48 jam."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian pada gangguan hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman — data hewan tidak teratogenik",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Dapat digunakan pada sepsis intrapartum",
    fetal_risk: "Minimal",
    lactation: "Ekskresi ke ASI minimal. Umumnya aman.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Suhu dan tanda klinis setiap 24 jam", "Kultur BAL/sputum", "PCT setiap 48–72 jam"],
    safety: ["Kreatinin setiap 48 jam", "Neurotoksisitas: bingung, myoklonus", "Kalium serum (hipokalemia)"],
    frequency: "Evaluasi klinis dan kultur 48–72 jam",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Ensefalopati/neurotoksisitas pada gagal ginjal + dosis tinggi", "Anafilaksis (jarang)"],
    common: ["Diare", "C. difficile colitis", "Hipokalemia", "↑ LFT transien", "Trombositopenia"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Metotreksat", effect: "↓ ekskresi renal MTX → toksisitas", management: "Hindari atau monitor level MTX" }
    ],
    moderate: [
      { drug: "Vankomisin", effect: "COMBIVAS meta-analysis: pip-tazo + vankomisin → ↑ AKI dibanding karbapenem + vankomisin", management: "Pertimbangkan ganti ke karbapenem jika kombinasi diperlukan" }
    ]
  },
  stewardship: {
    empiric_sources: ["HAP/VAP risiko Pseudomonas", "Sepsis nosokomial non-ESBL", "Febrile neutropenia"],
    deescalation_to: ["seftriakson", "ampisilin_sulbaktam"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "VAP: 7–8 hari. Sepsis nosokomial: 7 hari.",
    stop_criteria: "PCT turun >80% + perbaikan klinis + kultur de-eskalasi memungkinkan",
    avoid_for: ["Infeksi ESBL confirmed (efektivitas terbatas)", "Infeksi KPC atau MBL"],
    local_pattern_note: "Resistensi Pseudomonas terhadap pip-tazo di ICU Indonesia bervariasi 20–50%. Periksa antibiogram lokal."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Antibiotik empiris sepsis nosokomial dan VAP risiko Pseudomonas" }
  ]
},

"vankomisin": {
  name: "Vankomisin",
  brand_id: ["Vancocin", "Vankomisin Hameln", "Vankomisin Fresenius", "Vancomycin Dexa"],
  brand_id_notes: "Vancocin (Pfizer) originator. Generik luas. Tersedia di RS ICU Indonesia.",
  class: "Antibiotik glikopeptida",
  subclass: "Inhibitor sintesis dinding sel gram-positif",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia. First-line untuk MRSA dan Enterokokus.",
  mechanism: "Berikatan dengan D-Ala-D-Ala pada prekursor peptidoglikan → inhibisi transpeptidase → gangguan sintesis dinding sel. Hanya aktif terhadap gram-positif. Nefrotoksik dan ototoksik pada kadar tinggi.",
  pkpd_type: null,
  pkpd_note: "AUC/MIC target 400–600 mg·h/L (ASHP/IDSA/SIDP 2020 — menggantikan trough target). Monitoring AUC via Bayesian pharmacokinetics lebih optimal.",
  spectrum: {
    gram_pos: "Sangat baik: MRSA, Streptokokus, Enterokokus (non-VRE), S. epidermidis",
    gram_neg: "TIDAK aktif terhadap gram-negatif",
    anaerob: "Aktif terhadap Clostridium difficile (oral saja)",
    mrsa: true,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["MRSA — semua jenis infeksi (BSI, pneumonia, endokarditis, kulit)", "Infeksi gram-positif berat nosokomial pada pasien alergi β-laktam", "Endokarditis katup prostetik (bersama gentamisin)"],
    icu_secondary: ["Meningitis nosokomial (MRSA atau resisten penisilin)", "C. difficile berat (oral vankomisin 125 mg q6j)", "MRSA osteomielitis"],
    local_guideline: "PERDICI: Vankomisin untuk infeksi MRSA yang dikonfirmasi atau dicurigai kuat. Monitoring level wajib.",
    intl_guideline: "ASHP/IDSA/SIDP 2020: Target AUC/MIC 400–600 mg·h/L. Trough monitoring tidak lagi direkomendasikan sebagai satu-satunya parameter."
  },
  contraindications: ["Hipersensitivitas terhadap vankomisin", "Ototoksisitas berat yang sudah ada"],
  precautions: ["Nefrotoksisitas — terutama bersama aminoglikosida", "Red Man Syndrome (bukan alergi — histamine release akibat infus cepat)", "Ototoksisitas (tinnitus, gangguan pendengaran) pada kadar tinggi", "VRE: Vankomisin tidak aktif terhadap Enterokokus resisten vankomisin"],
  dosing: {
    standard: "25–30 mg/kg loading → 15–20 mg/kg IV q8–12j (individualisasi per BB dan GFR)",
    range_low: "15 mg/kg q12j",
    range_high: "30 mg/kg loading, 25 mg/kg q8j (infeksi berat MRSA)",
    max: "3g per dosis (loading). 60 mg/kg/hari maintenance (jarang).",
    loading: "25–30 mg/kg IV (maks 3g) dalam 1–3 jam untuk infeksi berat. Onset coverage lebih cepat.",
    maintenance: "15–20 mg/kg q8–12j, titrasi per AUC/MIC atau trough.",
    route: ["IV"],
    dilution: "Konsentrasi ≤5 mg/mL untuk infus perifer. 500 mg dalam 100 mL NS → 5 mg/mL. Rate ≤10 mg/menit.",
    rate: "Infus >60 menit per gram. Jangan >10 mg/menit (Red Man Syndrome).",
    titration: "Target AUC/MIC 400–600. Trough (jika AUC tidak tersedia): 15–20 mcg/mL.",
    special_notes: "⚠ Red Man Syndrome: melambatkan infus, premedikasi difenhidramin. BUKAN alergi — dapat dilanjutkan dengan infus lebih lambat."
  },
  renal_adjustment: {
    ge60:   { dose: "15–20 mg/kg", interval: "q8–12j", note: "" },
    r30_60: { dose: "15 mg/kg",    interval: "q12–24j", note: "Monitoring level/AUC lebih ketat" },
    r15_30: { dose: "15 mg/kg",    interval: "q24–48j", note: "Risiko akumulasi dan nefrotoksisitas" },
    r_lt15: { dose: "Loading 25 mg/kg, lalu dosis berdasar level", interval: "Monitor setiap 48–72j", note: "Highly variable — gunakan TDM" },
    hd:     { dose: "Loading 25 mg/kg post-HD, lalu suplementasi per level", interval: "Post-HD monitoring", note: "Terdialisis 30–50% tergantung membran" },
    crrt:   { dose: "15–20 mg/kg q24–48j", interval: "Monitor level setiap 24–48j", note: "CRRT meningkatkan clearance vankomisin" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "TDM (therapeutic drug monitoring) WAJIB pada gagal ginjal. Trough atau AUC setiap 2–3 hari."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian dosis pada gangguan hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali indikasi MRSA mengancam jiwa",
    trimester_2: "Dapat digunakan dengan monitoring level",
    trimester_3: "Idem — Vd berubah, perlu monitoring lebih sering",
    labor_delivery: "Dapat digunakan pada sepsis MRSA",
    fetal_risk: "Ototoksisitas fetal pada kadar tinggi",
    lactation: "Ekskresi ke ASI minimal. Umumnya aman — absorbsi oral bayi minimal.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["AUC/MIC target 400–600 (atau trough 15–20 jika AUC tidak tersedia)", "Perbaikan klinis 48–72 jam", "Kultur darah/luka repeat"],
    safety: ["Kreatinin setiap 48–72 jam (nefrotoksisitas)", "Audiometri jika penggunaan >7–10 hari atau dosis tinggi", "Tanda Red Man Syndrome selama infus"],
    frequency: "Level vankomisin: trough setelah dosis ke-4 atau ke-5 (steady state). AUC: 2 titik sampling post-distribusi.",
    therapeutic_range: "AUC/MIC: 400–600 mg·h/L. Trough: 15–20 mcg/mL (infeksi berat). <10: subterapi."
  },
  adverse_effects: {
    critical: ["Nefrotoksisitas (7–17%) — terutama kombinasi aminoglikosida", "Ototoksisitas (tinnitus, gangguan pendengaran)"],
    common: ["Red Man Syndrome (30% — infus cepat): flushing, eritema leher/wajah/dada, hipotensi", "Tromboflebitis", "↑ kreatinin transien"],
    antidote: "Red Man Syndrome: Perlambat infus, difenhidramin 25–50 mg IV."
  },
  interactions: {
    major: [
      { drug: "Aminoglikosida", effect: "↑ nefrotoksisitas sinergistik", management: "Monitor kreatinin setiap 48 jam. Hindari jika bisa." },
      { drug: "Piperasilin-tazobaktam", effect: "COMBIVAS: pip-tazo + vankomisin ↑ AKI vs karbapenem + vankomisin", management: "Pertimbangkan ganti pip-tazo ke karbapenem" }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["MRSA dicurigai (SSTI, BSI, pneumonia nosokomial)", "Alergi β-laktam berat pada gram-positif berat"],
    deescalation_to: ["kloksasilin (jika MSSA)", "ampi-sulbaktam (non-MRSA)"],
    duration_standard: 14,
    duration_short: 7,
    duration_note: "MRSA BSI: minimal 14 hari. Endokarditis: 6 minggu.",
    stop_criteria: "Kultur negatif + perbaikan klinis + de-eskalasi ke agen lebih sempit jika MSSA",
    avoid_for: ["Dekolonisasi MRSA (bukan indikasi IV)", "Infeksi gram-negatif (tidak aktif)"],
    local_pattern_note: "Prevalensi MRSA di ICU Indonesia: 30–60% S. aureus. Vankomisin masih efektif — MIC umumnya ≤1 mg/L."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Antibiotik empiris MRSA dan gram-positif nosokomial berat" }
  ]
},

"linezolid": {
  name: "Linezolid",
  brand_id: ["Zyvox", "Linezia", "Linezolid Fresenius"],
  brand_id_notes: "Zyvox (Pfizer) originator. Tersedia terbatas di RS besar Indonesia. Harga tinggi.",
  class: "Antibiotik oksazolidinon",
  subclass: "Inhibitor sintesis protein (50S ribosom)",
  category: ["antibiotik"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas di RS tersier Indonesia. Harga mahal.",
  mechanism: "Berikatan subunit ribosom 50S bakteri → inhibisi pembentukan kompleks inisiasi translasi (unik — tidak ada resistensi silang dengan kelas lain). Bersifat bakteriostatik terhadap stafilokokus dan enterokokus, bakterisidal terhadap streptokokus.",
  pkpd_type: null,
  pkpd_note: "AUC/MIC target >80–100. Bioavailabilitas oral 100% — dapat switch IV ke PO segera jika toleransi baik.",
  spectrum: {
    gram_pos: "Sangat baik: MRSA, VRE (Enterococcus faecium), MRSE, Streptokokus pneumoniae resisten",
    gram_neg: "TIDAK aktif",
    anaerob: "Aktivitas terbatas",
    mrsa: true,
    vre: true,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["MRSA pneumonia (terutama HAP/VAP — penetrasi paru superior vs vankomisin)", "VRE (Vancomycin-Resistant Enterococcus) infeksi berat", "Infeksi gram-positif pada gagal ginjal berat (hindari vankomisin)"],
    icu_secondary: ["MRSA endokarditis katup trikuspid (alternatif vankomisin)", "Osteomielitis MRSA (bioavailabilitas oral 100%)"],
    local_guideline: "PERDICI: Linezolid cadangan MRSA jika vankomisin gagal atau gagal ginjal berat. Stewardship ketat.",
    intl_guideline: "IDSA MRSA 2011: Linezolid setara vankomisin untuk MRSA HAP/VAP (mungkin superior). ESCMID VRE 2019: Linezolid lini pertama VRE."
  },
  contraindications: ["Penggunaan MAOI dalam 14 hari (serotonin syndrome)", "Hipertensi tidak terkontrol", "Hipersensitivitas terhadap linezolid"],
  precautions: ["Trombositopenia — monitor CBC setiap 1–2 minggu (>2 minggu penggunaan)", "Serotonin syndrome dengan SSRI/opioid serotonergik (trisiklik, meperidin)", "Asidosis laktat pada penggunaan >4 minggu (inhibisi mitokondria)", "Neuropati perifer dan optik pada penggunaan sangat lama (>28 hari)"],
  dosing: {
    standard: "600 mg IV/PO setiap 12 jam",
    range_low: "600 mg q12j",
    range_high: "600 mg q12j (tidak dititrasi)",
    max: "1200 mg/hari",
    loading: null,
    maintenance: "600 mg q12j — dosis sama IV dan oral (bioavailabilitas 100%)",
    route: ["IV", "PO"],
    dilution: "Ready-to-use bag 2 mg/mL (300 mL = 600 mg). Infus 30–120 menit.",
    rate: "Infus 30–120 menit",
    titration: null,
    special_notes: "Switch IV ke PO segera jika toleransi oral baik — bioavailabilitas identik, efektif, dan jauh lebih murah."
  },
  renal_adjustment: {
    ge60:   { dose: "600 mg q12j", interval: "Normal", note: "" },
    r30_60: { dose: "600 mg q12j", interval: "Normal", note: "Metabolit terakumulasi — monitor CBC" },
    r15_30: { dose: "600 mg q12j", interval: "Normal", note: "Akumulasi metabolit — pertimbangkan monitor TDM" },
    r_lt15: { dose: "600 mg q12j", interval: "Normal", note: "Tidak perlu penyesuaian dosis linezolid murni" },
    hd:     { dose: "600 mg q12j", interval: "Normal", note: "Berikan setelah HD atau suplementasi 600 mg post-HD" },
    crrt:   { dose: "600 mg q12j", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Tidak perlu penyesuaian dosis pada gagal ginjal — keunggulan vs vankomisin."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Hati-hati — data terbatas pada sirosis berat",
    note: "Metabolisme oksidasi non-enzimatik. Tidak bergantung CYP. Perlu monitoring pada sirosis berat."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas — hindari kecuali tidak ada alternatif",
    trimester_2: "Hanya jika mutlak perlu",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Data tidak memadai",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["CBC setiap 1–2 minggu", "Perbaikan klinis 48–72 jam", "Kultur repeat"],
    safety: ["Trombosit setiap 1–2 minggu (trombositopenia)", "Tanda serotonin syndrome: tremor, mioklonus, diaphoresis, agitasi", "Laktat jika penggunaan >28 hari"],
    frequency: "CBC mingguan. Klinis 48–72 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Trombositopenia berat (>2 minggu)", "Serotonin syndrome (kombinasi SSRI/opioid serotonergik)", "Asidosis laktat (penggunaan sangat lama)"],
    common: ["Trombositopenia (>2 minggu, reversibel)", "Mual/diare", "↑ LFT transien", "Sakit kepala"],
    antidote: "Serotonin syndrome: Stop linezolid + siproheptadin 8 mg PO atau IV benzodiazepin."
  },
  interactions: {
    major: [
      { drug: "SSRI/SNRI (sertralin, venlafaksin)", effect: "Serotonin syndrome — linezolid adalah inhibitor MAO lemah", management: "Hindari kombinasi. Jika harus: stop SSRI minimal 2 minggu sebelum linezolid." },
      { drug: "Tramadol / Meperidin", effect: "Serotonin syndrome", management: "Hindari kombinasi — gunakan opioid non-serotonergik (morfin, fentanil)" }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["MRSA pneumonia HAP/VAP (superior penetrasi paru)", "VRE bacteremia/endokarditis"],
    deescalation_to: ["vankomisin (jika sensitivitas terkonfirmasi)"],
    duration_standard: 14,
    duration_short: 7,
    duration_note: "MRSA pneumonia: 7–14 hari. VRE bacteremia: 14 hari.",
    stop_criteria: "Kultur negatif + klinis membaik. Pertimbangkan switch PO.",
    avoid_for: ["Penggunaan empiris tanpa konfirmasi MRSA/VRE", "Penggunaan >28 hari tanpa evaluasi"],
    local_pattern_note: "Linezolid sebagai antibiotik cadangan — gunakan hanya jika vankomisin tidak dapat digunakan atau gagal."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Cadangan MRSA dan VRE — superior penetrasi paru untuk MRSA HAP/VAP" }
  ]
},

"kolistin": {
  name: "Kolistin (Polimiksin E)",
  brand_id: ["Colistimethate Sodium Xellia", "Colistin Haupt Pharma"],
  brand_id_notes: "Tersedia sangat terbatas di Indonesia. Colistimethate sodium (prodrug) untuk parenteral.",
  class: "Antibiotik polipeptida",
  subclass: "Polimiksin (last-resort)",
  category: ["antibiotik"],
  common_in_id: false,
  common_in_id_note: "Tersedia sangat terbatas — RS tersier dengan kasus MDR. Harga sangat mahal.",
  mechanism: "Berikatan dengan LPS membrane luar bakteri gram-negatif → disrupsi integritas membran sel → kebocoran sitoplasma → lisis. Aktivitas konsentrasi-dependen (CID-PD). Prodrug colistimethate sodium → kolistin aktif.",
  pkpd_type: "concentration_dependent",
  pkpd_note: "Target AUC/MIC dan Cmax/MIC. Dosis loading WAJIB untuk mencapai kadar efektif cepat. Nefrotoksik — kurangi dosis pada gagal ginjal.",
  spectrum: {
    gram_pos: "TIDAK aktif",
    gram_neg: "Aktif: Acinetobacter baumannii (CRAB), Pseudomonas aeruginosa, Klebsiella pneumoniae (KPC/ESBL) — patogen ESKAPE MDR",
    anaerob: "Tidak aktif",
    mrsa: false,
    vre: false,
    esbl: true,
    pseudomonas: true,
    acinetobacter: true,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["CRAB (Carbapenem-Resistant Acinetobacter baumannii) — LAST RESORT", "CRKP (Carbapenem-Resistant Klebsiella pneumoniae)", "Pseudomonas aeruginosa extensively drug-resistant (XDR)"],
    icu_secondary: ["Kombinasi dengan meropenem atau tigesiklin untuk XDR/PDR patogen"],
    local_guideline: "PERDICI: Kolistin untuk patogen XDR/PDR hanya setelah semua karbapenem, pip-tazo, dan antibiotik lini 2 gagal/tidak sensitif. Konsultasi DPJP dan farmasi klinis.",
    intl_guideline: "IDSA/ESCMID: Kolistin lini terakhir CRAB. Kombinasi dengan meropenem atau rifampisin mungkin sinergistik. Monoterapi kolistin sering tidak cukup."
  },
  contraindications: ["Hipersensitivitas terhadap kolistin/polimiksin", "Miastenia gravis (blok neuromuskular)"],
  precautions: ["Nefrotoksisitas sangat tinggi (25–60%)", "Neurotoksisitas (parestesi, ataksia)", "Dosis loading WAJIB — tanpa loading, kadar terapetik tidak tercapai hari pertama", "SELALU kombinasi dengan antibiotik lain — resistensi cepat terjadi pada monoterapi"],
  dosing: {
    standard: "Loading: 9 MIU IV dalam 30 menit → Maintenance: 3 MIU IV q8j atau 4.5 MIU q12j (titrasi per GFR)",
    range_low: "1.5 MIU q12j (gagal ginjal berat)",
    range_high: "4.5 MIU q8j (fungsi ginjal normal)",
    max: "9 MIU/hari maintenance",
    loading: "9 MIU IV dalam 30–60 menit (WAJIB pada hari pertama — tanpa loading onset lambat)",
    maintenance: "Mulai 12–24 jam setelah loading. Titrasi per eGFR.",
    route: ["IV", "Inhalasi (adjun VAP — nebulisasi 2 MIU q12j)"],
    dilution: "Larutkan dalam NS 50–250 mL. Berikan dalam 30–60 menit.",
    rate: "Loading: 30–60 menit. Maintenance: 30–60 menit.",
    titration: "Sesuaikan maintenance per GFR (lihat renal_adjustment). Monitor kreatinin setiap 24–48 jam.",
    special_notes: "1 MIU colistimethate sodium = 80 mg CMS = ~33 mg kolistin base. Inhalasi adjun: 2 MIU nebulisasi q12j untuk VAP CRAB refrakter IV."
  },
  renal_adjustment: {
    ge60:   { dose: "Loading 9 MIU → 3 MIU", interval: "q8j", note: "" },
    r30_60: { dose: "Loading 9 MIU → 2.5 MIU", interval: "q12j", note: "Kurangi frekuensi" },
    r15_30: { dose: "Loading 9 MIU → 1.5–2 MIU", interval: "q12–24j", note: "Risiko nefrotoksisitas sangat tinggi" },
    r_lt15: { dose: "Loading 4.5 MIU → 1.5 MIU", interval: "q24j", note: "Monitor kreatinin setiap 12 jam" },
    hd:     { dose: "Suplementasi post-HD: 2–3 MIU", interval: "q24j + post-HD", note: "Terdialisis sebagian" },
    crrt:   { dose: "2–3 MIU", interval: "q12–24j", note: "Monitor level dan klirens CRRT" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Kreatinin setiap 24–48 jam WAJIB. Nefrotoksisitas sangat umum (25–60%). Hidrasi adekuat membantu."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak memerlukan penyesuaian pada gangguan hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari",
    trimester_2: "Hanya life-threatening MDR",
    trimester_3: "Idem — nefrotoksik fetal",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Nefrotoksisitas fetal",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Perbaikan klinis VAP/BSI 48–72 jam", "Kultur repeat 48–72 jam", "PCT/CRP"],
    safety: ["Kreatinin SETIAP 24–48 jam", "Urin output setiap jam", "Tanda neurotoksisitas (parestesi, gangguan bicara)", "Level kolistin (jika tersedia) — target 2–4 mg/L"],
    frequency: "Kreatinin setiap 24–48 jam. Klinis harian.",
    therapeutic_range: "Kolistin steady-state target: 2–4 mg/L (Cmin)"
  },
  adverse_effects: {
    critical: ["Nefrotoksisitas (25–60%) — AKI sering berat", "Neurotoksisitas (10–20%): parestesi wajah, ataksia, kelemahan otot"],
    common: ["↑ kreatinin (hampir universal pada dosis tinggi)", "Elektrolt: hiponatremia, hipokalemia"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Aminoglikosida", effect: "Nefrotoksisitas sinergistik dramatis", management: "Hindari kombinasi jika memungkinkan" },
      { drug: "NMB", effect: "Potensiasi blok neuromuskular", management: "Monitor TOF jika bersamaan" }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["CRAB sepsis/VAP terkonfirmasi atau sangat dicurigai", "XDR Pseudomonas refrakter semua karbapenem"],
    deescalation_to: ["Tidak ada de-eskalasi — last resort"],
    duration_standard: 10,
    duration_short: 7,
    duration_note: "Sesingkat mungkin — nefrotoksisitas meningkat dengan durasi. VAP: 10–14 hari. BSI: 14 hari.",
    stop_criteria: "Klinis membaik + kultur negatif",
    avoid_for: ["Profilaksis", "Kolonisasi tanpa infeksi klinis", "Monoterapi (risiko resistensi tinggi)"],
    local_pattern_note: "CRAB di ICU Indonesia sangat umum (30–70% Acinetobacter). Kombinasi kolistin + sulbaktam dosis tinggi atau kolistin + meropenem dosis tinggi lebih efektif."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Last-resort untuk patogen MDR/XDR (CRAB, CRKP, XDR Pseudomonas)" }
  ]
},

"amikasin": {
  name: "Amikasin",
  brand_id: ["Amikin", "Amikasin Dexa", "Amikasin Kalbe", "Amikacin Hameln"],
  brand_id_notes: "Amikin (Pfizer) originator. Generik luas. Tersedia di semua RS Indonesia.",
  class: "Antibiotik aminoglikosida",
  subclass: "Inhibitor ribosom 30S",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Paling stabil terhadap enzim modifikasi aminoglikosida.",
  mechanism: "Berikatan irreversibel dengan subunit ribosom 30S → misreading mRNA → protein abnormal → gangguan membran sel → lisis. Aktivitas konsentrasi-dependen (Cmax/MIC). Sinergistik dengan β-laktam terhadap gram-negatif.",
  pkpd_type: "concentration_dependent",
  pkpd_note: "Cmax/MIC target ≥8–10. Extended interval dosing (once daily) mencapai Cmax lebih tinggi + PAE (Post-Antibiotic Effect) lebih lama + nefrotoksisitas lebih rendah.",
  spectrum: {
    gram_pos: "Sinergis dengan β-laktam terhadap Streptokokus dan Enterokokus. Tidak cukup monoterapi.",
    gram_neg: "Sangat baik: Pseudomonas aeruginosa, Klebsiella, E. coli, Acinetobacter baumannii, Enterobacter. Lebih stabil vs enzim resistensi dibanding gentamisin.",
    anaerob: "Tidak aktif — memerlukan oksigen untuk transport",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: true,
    acinetobacter: true,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["Terapi kombinasi gram-negatif berat (VAP, sepsis): bersama β-laktam aktif", "MDR gram-negatif (Pseudomonas, Acinetobacter) — ketika patogen masih sensitif amikasin"],
    icu_secondary: ["TB berat (lini kedua)", "Sinergis pada endokarditis gram-negatif bersama β-laktam"],
    local_guideline: "PERDICI: Amikasin sebagai agen kombinasi gram-negatif berat, bukan monoterapi. Extended interval dosing dianjurkan.",
    intl_guideline: "IDSA HAP/VAP 2016: Aminoglikosida sebagai agen tambahan (bukan monoterapi) untuk empiric coverage Pseudomonas. Once-daily dosing lebih efektif dan kurang nefrotoksik."
  },
  contraindications: ["Hipersensitivitas terhadap aminoglikosida", "Miastenia gravis (potensiasi blok NMJ)", "Kehamilan (ototoksisitas fetal)"],
  precautions: ["Nefrotoksisitas — terutama kombinasi vankomisin atau NSAID", "Ototoksisitas ireversibel (koklear dan vestibular)", "Extended interval dosing mengurangi toksisitas", "Monitoring level wajib"],
  dosing: {
    standard: "15–20 mg/kg IV sekali sehari (extended interval/once-daily dosing)",
    range_low: "15 mg/kg q24j",
    range_high: "25–30 mg/kg q24j (dosis tinggi extended interval untuk MDR)",
    max: "1.5–2 g per dosis",
    loading: "Sama dengan dosis harian pertama",
    maintenance: "15–20 mg/kg q24j. Titrasi per level dan GFR.",
    route: ["IV", "IM"],
    dilution: "500 mg dalam 100–200 mL NS. Infus 30–60 menit.",
    rate: "Infus 30–60 menit",
    titration: "Monitor peak (30 menit post-infus: target 56–64 mcg/mL) dan trough (<4–5 mcg/mL). Atau AUC-guided.",
    special_notes: "Once-daily dosing: 15–20 mg/kg IV q24j. Peak 30 menit post-infus target 56–64 mcg/mL. Durasi maksimum 5–7 hari untuk mengurangi nefrotoksisitas."
  },
  renal_adjustment: {
    ge60:   { dose: "15–20 mg/kg", interval: "q24j", note: "" },
    r30_60: { dose: "15 mg/kg",    interval: "q36–48j", note: "Perpanjang interval berdasar trough" },
    r15_30: { dose: "10 mg/kg",    interval: "q48–72j", note: "Monitor trough <5 mcg/mL sebelum dosis berikut" },
    r_lt15: { dose: "Hindari atau dosis tunggal saja", interval: "Monitor trough ketat", note: "Akumulasi dramatis" },
    hd:     { dose: "Dosis tunggal post-HD berdasar trough", interval: "Post-HD saja", note: "Terdialisis 50–70%" },
    crrt:   { dose: "10 mg/kg", interval: "q24–48j berdasar trough", note: "CRRT meningkatkan clearance" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Trough <5 mcg/mL sebelum dosis berikutnya. Kreatinin setiap 48 jam. Hindari jika eGFR <30 jika ada alternatif."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak dimetabolisme hepatik."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "KONTRAINDIKASI — ototoksisitas fetal ireversibel",
    trimester_2: "KONTRAINDIKASI",
    trimester_3: "KONTRAINDIKASI",
    labor_delivery: "Hindari",
    fetal_risk: "Tuli sensorineural ireversibel pada fetus",
    lactation: "Hindari — ekskresi ke ASI bermakna",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Perbaikan klinis 48–72 jam", "Kultur repeat"],
    safety: ["Trough sebelum dosis berikutnya (target <5 mcg/mL)", "Kreatinin setiap 48 jam", "Audiometri jika penggunaan >5 hari", "Urin output"],
    frequency: "Level setiap 2–3 hari. Klinis harian.",
    therapeutic_range: "Peak (once-daily): 56–64 mcg/mL. Trough: <5 mcg/mL."
  },
  adverse_effects: {
    critical: ["Ototoksisitas ireversibel (koklear: tuli; vestibular: vertigo)", "Nefrotoksisitas (ATN akut)"],
    common: ["↑ kreatinin", "Proteinuria", "Neuromuscular blokade (jarang, pada dosis sangat tinggi)"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Vankomisin", effect: "Nefrotoksisitas sinergistik", management: "Monitor kreatinin setiap 24 jam" },
      { drug: "Furosemid (dosis tinggi)", effect: "Ototoksisitas sinergistik", management: "Hati-hati pada kombinasi" }
    ],
    moderate: [
      { drug: "NMB", effect: "Potensiasi blok neuromuskular" }
    ]
  },
  stewardship: {
    empiric_sources: ["Kombinasi empiris gram-negatif berat (VAP, sepsis) bersama β-laktam"],
    deescalation_to: ["Hentikan amikasin setelah 48–72 jam jika β-laktam sudah mencukupi"],
    duration_standard: 5,
    duration_short: 3,
    duration_note: "Durasi aminoglikosida dibatasi 3–7 hari untuk minimalisasi toksisitas. Monoterapi TIDAK dianjurkan.",
    stop_criteria: "De-eskalasi setelah 3–5 hari jika β-laktam memadai dan klinis membaik",
    avoid_for: ["Monoterapi infeksi berat", "Penggunaan >7 hari tanpa indikasi kuat"],
    local_pattern_note: "Amikasin paling stabil terhadap enzim modifikasi aminoglikosida di Indonesia — pilih amikasin jika gentamisin resisten."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Kombinasi gram-negatif berat — bukan monoterapi. Once-daily lebih efektif dan kurang toksik." }
  ]
},

"siprofloksasin": {
  name: "Siprofloksasin",
  brand_id: ["Ciproxin", "Baquinor", "Siflox", "Siprofloksasin Dexa"],
  brand_id_notes: "Ciproxin (Bayer) originator. Generik sangat luas. Tersedia di semua RS Indonesia.",
  class: "Antibiotik fluorokuinolon",
  subclass: "Inhibitor DNA gyrase dan topoisomerase IV",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Bioavailabilitas oral sangat tinggi (70–80%).",
  mechanism: "Inhibisi DNA gyrase (gram-negatif) dan topoisomerase IV (gram-positif) → gangguan replikasi dan transkripsi DNA → bakterisidal. Aktivitas konsentrasi-dependen. Penetrasi jaringan sangat baik (paru, prostat, tulang, urin).",
  pkpd_type: "concentration_dependent",
  pkpd_note: "AUC/MIC target ≥125 (gram-negatif). Penetrasi jaringan luar biasa. Bioavailabilitas oral 70–80% — switch IV ke PO segera jika toleransi baik.",
  spectrum: {
    gram_pos: "Moderat: Streptokokus pneumoniae (lemah). TIDAK untuk MRSA.",
    gram_neg: "Sangat baik: Pseudomonas aeruginosa, E. coli, Klebsiella, Enterobacter, H. influenzae, Legionella",
    anaerob: "Lemah — tidak untuk infeksi anaerob",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["VAP/HAP kombinasi dengan β-laktam untuk Pseudomonas aeruginosa coverage", "ISK nosokomial berat (urosepsis)", "Tifoid berat (step-down)"],
    icu_secondary: ["Antraks (bioterrorism)", "Infeksi tulang (osteomielitis gram-negatif)", "Kombinasi febrile neutropenia"],
    local_guideline: "PERDICI: Siprofloksasin untuk kombinasi VAP risiko Pseudomonas atau ISK nosokomial. Resistensi meningkat — periksa sensitivitas.",
    intl_guideline: "IDSA HAP/VAP 2016: Siprofloksasin atau levofloksasin sebagai alternatif aminoglikosida untuk kombinasi Pseudomonas coverage."
  },
  contraindications: ["Hipersensitivitas terhadap fluorokuinolon", "QTc memanjang >500 ms", "Anak <18 tahun (relatif — artropati pada hewan muda)", "Miastenia gravis (eksaserbasi)"],
  precautions: ["Pemanjangan QTc — hindari bersama obat pemanjang QT lain", "Tendinitis/ruptur tendon Achilles — terutama pasien >60 tahun + kortikosteroid", "Resistensi meningkat cepat terutama pada Pseudomonas", "CLABSI: C. difficile"],
  dosing: {
    standard: "400 mg IV q8–12j atau 500–750 mg PO q12j",
    range_low: "200 mg IV q12j (ISK ringan)",
    range_high: "400 mg IV q8j (Pseudomonas, infeksi berat)",
    max: "1200 mg/hari IV",
    loading: null,
    maintenance: "400 mg IV q8j untuk Pseudomonas. 400 mg IV q12j untuk non-Pseudomonas.",
    route: ["IV", "PO"],
    dilution: "400 mg dalam 100–200 mL NS. Stabil 14 hari suhu ruang.",
    rate: "Infus 60 menit",
    titration: null,
    special_notes: "Switch IV ke PO segera jika toleransi oral baik — bioavailabilitas setara. Jangan berikan bersamaan dengan antasida, Fe, Ca, Mg — absorbsi PO ↓."
  },
  renal_adjustment: {
    ge60:   { dose: "400 mg IV", interval: "q8–12j", note: "" },
    r30_60: { dose: "400 mg IV", interval: "q12j", note: "" },
    r15_30: { dose: "400 mg IV", interval: "q12–24j", note: "" },
    r_lt15: { dose: "200–400 mg IV", interval: "q24j", note: "Monitor QTc" },
    hd:     { dose: "200–400 mg", interval: "q24j post-HD", note: "Terdialisis sebagian (30–50%)" },
    crrt:   { dose: "400 mg", interval: "q12j", note: "" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Kurangi dosis pada eGFR <30. Monitor QTc."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Kurangi dosis 25–50% — clearance hepatik ↓",
    note: "Metabolisme parsial hepatik. Sirosis berat → clearance ↓."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari — potensi artropati",
    trimester_2: "Hindari kecuali tidak ada alternatif",
    trimester_3: "Idem",
    labor_delivery: "Hindari",
    fetal_risk: "Artropati (teori — belum terbukti pada manusia)",
    lactation: "Ekskresi ke ASI. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Perbaikan klinis 48–72 jam", "Kultur dan sensitivitas"],
    safety: ["EKG — QTc (target <500 ms)", "Tanda tendinitis (nyeri tumit/Achilles)", "Kreatinin"],
    frequency: "EKG saat mulai dan 48 jam kemudian jika QTc borderline",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["QTc pemanjangan → TdP aritmia", "Ruptur tendon Achilles (terutama >60 tahun + kortikosteroid)", "Eksaserbasi miastenia gravis"],
    common: ["Mual/diare", "↑ LFT transien", "Sakit kepala", "Fotosensitivitas", "C. difficile colitis"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Obat pemanjang QT (amiodarone, metadon)", effect: "Risiko QTc sangat panjang → TdP", management: "Hindari kombinasi atau EKG ketat" }
    ],
    moderate: [
      { drug: "Teofilin", effect: "Siprofloksasin inhibisi CYP1A2 → toksisitas teofilin (seizure)", management: "Kurangi dosis teofilin 50%." },
      { drug: "Warfarin", effect: "↑ INR (inhibisi CYP1A2/CYP3A4)", management: "Monitor INR" }
    ]
  },
  stewardship: {
    empiric_sources: ["Kombinasi VAP Pseudomonas coverage", "ISK nosokomial berat"],
    deescalation_to: ["Obat lebih sempit spektrum berdasar kultur"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "VAP: 7 hari. ISK: 7 hari. Osteomielitis: 4–6 minggu (PO).",
    stop_criteria: "Kultur sensitif + klinis membaik",
    avoid_for: ["Monoterapi Pseudomonas berat (resistensi cepat)", "CAP (aktivitas streptokokus lemah)"],
    local_pattern_note: "Resistensi E. coli terhadap siprofloksasin di komunitas Indonesia >50%. Periksa kultur sebelum menggunakan."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Kombinasi empiris VAP/HAP coverage Pseudomonas. Bioavailabilitas oral tinggi — switch PO segera." }
  ]
},

"tigesiklin": {
  name: "Tigesiklin",
  brand_id: ["Tygacil"],
  brand_id_notes: "Tygacil (Pfizer). Tersedia sangat terbatas di Indonesia. Harga sangat mahal.",
  class: "Antibiotik glisisilsiklin",
  subclass: "Inhibitor ribosom 30S (generasi ke-3 tetrasiklin)",
  category: ["antibiotik"],
  common_in_id: false,
  common_in_id_note: "Tersedia sangat terbatas — RS tersier Indonesia. Harga sangat mahal.",
  mechanism: "Berikatan dengan ribosom 30S bakteri (affinity 5× lebih besar dari tetrasiklin) → inhibisi translasi. Mengatasi mekanisme resistensi ribosomal protection dan efflux pump (mengatasi resistensi tetrasiklin). Bakteriostatik (tidak untuk bacteremia primer).",
  pkpd_type: null,
  pkpd_note: "AUC/MIC. Distribusi jaringan sangat luas (Vd 500–700 L). Kadar serum RENDAH — tidak efektif untuk bacteremia atau ISK.",
  spectrum: {
    gram_pos: "Sangat baik: MRSA, VRE, S. pneumoniae resisten",
    gram_neg: "Baik: Klebsiella, E. coli, Enterobacter, Acinetobacter baumannii (termasuk CRAB). Buruk: Pseudomonas (resisten intrinsik), Proteus (resisten intrinsik)",
    anaerob: "Baik: Bacteroides fragilis dan anaerob lainnya",
    mrsa: true,
    vre: true,
    esbl: true,
    pseudomonas: false,
    acinetobacter: true,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["CRAB (kombinasi dengan kolistin atau sulbaktam dosis tinggi)", "Infeksi intra-abdominal kompleks MDR (gram-positif + gram-negatif + anaerob)", "cSSSI (complicated skin and soft tissue infection) MDR"],
    icu_secondary: ["HAP/VAP CRAB atau MDR (tambahan — bukan monoterapi)"],
    local_guideline: "PERDICI: Tigesiklin sebagai komponen regimen kombinasi CRAB atau MDR — BUKAN monoterapi. Konsultasi DPJP dan PPRA.",
    intl_guideline: "ESCMID 2019: Tigesiklin kombinasi untuk CRAB. Meta-analysis: tigesiklin monoterapi → mortalitas lebih tinggi vs perbandingan — SELALU KOMBINASI."
  },
  contraindications: ["Hipersensitivitas terhadap tigesiklin atau tetrasiklin", "Kehamilan (toksik pada tulang dan gigi fetus)"],
  precautions: ["Monoterapi → mortalitas lebih tinggi — SELALU kombinasi", "Tidak untuk bacteremia, ISK, pneumonia CAP sebagai monoterapi", "Mual/muntah sangat tinggi (26–35%) — premedikasi antiemetik", "Pankreatitis (jarang, monitor lipase)"],
  dosing: {
    standard: "Loading 100 mg IV → 50 mg IV q12j",
    range_low: "50 mg q12j maintenance",
    range_high: "100 mg q12j (dosis tinggi — beberapa studi CRAB, off-label)",
    max: "200 mg/hari",
    loading: "100 mg IV dalam 30–60 menit (loading wajib)",
    maintenance: "50 mg IV q12j. Beberapa protokol CRAB: 100 mg q12j (off-label).",
    route: ["IV"],
    dilution: "50–100 mg dalam 100 mL NS atau D5W. Infus 30–60 menit.",
    rate: "Infus 30–60 menit",
    titration: null,
    special_notes: "Premedikasi ondansetron 4–8 mg IV sebelum tigesiklin — mual sangat umum. Dosis tinggi 100 mg q12j digunakan beberapa protokol MDR — off-label."
  },
  renal_adjustment: {
    ge60:   { dose: "50 mg q12j", interval: "Normal", note: "" },
    r30_60: { dose: "50 mg q12j", interval: "Normal", note: "" },
    r15_30: { dose: "50 mg q12j", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "50 mg q12j", interval: "Normal", note: "Ekskresi bilier dominan — aman pada GFR rendah" },
    hd:     { dose: "50 mg q12j", interval: "Normal", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "50 mg q12j", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak memerlukan penyesuaian pada gagal ginjal — keunggulan untuk MDR pada AKI."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi maintenance 25%", child_c: "Loading 100 mg → maintenance 25 mg q12j",
    note: "Ekskresi bilier utama. Sirosis berat → clearance ↓ bermakna."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "KONTRAINDIKASI — toksik pada tulang dan gigi fetus",
    trimester_2: "KONTRAINDIKASI",
    trimester_3: "KONTRAINDIKASI",
    labor_delivery: "KONTRAINDIKASI",
    fetal_risk: "Diskolorasi gigi permanen, hipoplasia email, retardasi skeletal",
    lactation: "KONTRAINDIKASI",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Perbaikan klinis 48–72 jam", "Kultur repeat", "PCT/CRP"],
    safety: ["Mual/muntah — antiemetik rutin", "Lipase/amilase jika nyeri perut (pankreatitis)", "INR — tigesiklin dapat memanjangkan PT/INR"],
    frequency: "Klinis harian. Lipase jika nyeri perut.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Mortalitas lebih tinggi pada monoterapi vs comparator — SELALU KOMBINASI", "Pankreatitis akut (jarang)"],
    common: ["Mual berat (26–35%)", "Muntah (20%)", "Diare", "↑ PT/INR", "Fotosensitivitas"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Warfarin", effect: "Tigesiklin memanjangkan PT/INR", management: "Monitor INR ketat" }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["Kombinasi CRAB", "Infeksi abdomen MDR polimikroba"],
    deescalation_to: ["De-eskalasi berdasar kultur — tigesiklin sering tidak bisa de-eskalasi"],
    duration_standard: 14,
    duration_short: 7,
    duration_note: "Infeksi abdomen: 7–14 hari. CRAB: 14–21 hari.",
    stop_criteria: "Klinis membaik + kultur memungkinkan de-eskalasi",
    avoid_for: ["Monoterapi (mortalitas ↑)", "Bacteremia primer", "ISK (kadar urin tidak memadai)", "Pseudomonas (resisten intrinsik)"],
    local_pattern_note: "Kombinasi tigesiklin + kolistin atau tigesiklin + sulbaktam dosis tinggi adalah regimen utama CRAB berat di Indonesia."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Komponen kombinasi regimen MDR/CRAB — BUKAN monoterapi" }
  ]
},

"flukonazol": {
  name: "Flukonazol",
  brand_id: ["Diflucan", "Fluconazole Pfizer", "Fluxar", "Flucoral"],
  brand_id_notes: "Diflucan (Pfizer) originator. Generik sangat luas. Tersedia di semua RS Indonesia.",
  class: "Antijamur triazol",
  subclass: "Inhibitor ergosterol synthesis (CYP51/lanosterol demethylase)",
  category: ["antifungal"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Pilihan utama kandidosis.",
  mechanism: "Inhibisi CYP51 jamur (lanosterol 14α-demethylase) → ↓ sintesis ergosterol → gangguan membran sel jamur. Fungisidal terhadap Candida (spesies tertentu), fungistatik terhadap lainnya. Bioavailabilitas oral ~100%.",
  pkpd_type: null,
  pkpd_note: "AUC/MIC target ≥100 (Candida). Resistensi intrinsik: C. glabrata (sering), C. krusei (selalu). Mutasi ERG11 pada C. albicans menyebabkan resistensi dosis-dependen.",
  spectrum: {
    gram_pos: null,
    gram_neg: null,
    anaerob: null,
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: "Aktif: Candida albicans, C. tropicalis, C. parapsilosis. Variabel: C. glabrata (sering resisten). Resisten intrinsik: C. krusei. Tidak aktif: Aspergillus, Mucor.",
    virus: null
  },
  indications: {
    icu_primary: ["Kandidiasis invasif/kandidemia (jika bukan C. glabrata/krusei dan tidak kritis)", "Kandidosis orofaringeal/esofagus (oral)",  "Profilaksis Candida pada pasien bedah abdominal berisiko tinggi"],
    icu_secondary: ["Infeksi Cryptococcus neoformans (meningitis kriptokokal — dosis tinggi)", "Step-down dari echinocandin pada kandidemia stabil"],
    local_guideline: "PERDICI: Flukonazol untuk kandidemia non-kritis pada Candida sensitif. Echinocandin untuk kasus kritis atau C. glabrata/krusei.",
    intl_guideline: "IDSA Candida 2016: Flukonazol untuk kandidemia non-ICU. Echinocandin disukai untuk ICU/kritis. ECMM: Step-down flukonazol setelah 5–7 hari echinocandin jika stabil + sensitivitas terkonfirmasi."
  },
  contraindications: ["Hipersensitivitas terhadap azol", "Elongasi QTc berat (perpanjang QT)", "Penggunaan bersama cisaprid, astemizol, pimozid, kuinidin (inhibisi CYP3A4 → QTc fatal)"],
  precautions: ["Banyak interaksi obat via CYP2C9, CYP3A4, CYP2C19", "Hepatotoksik — monitor LFT", "QTc pemanjangan — EKG jika dikombinasi obat pemanjang QT", "C. glabrata dan C. krusei: jangan gunakan tanpa konfirmasi sensitivitas"],
  dosing: {
    standard: "Loading 800 mg IV/PO (hari 1) → 400 mg/hari IV/PO maintenance",
    range_low: "150 mg sekali (vaginitis)",
    range_high: "800 mg/hari (kriptokokal meningitis atau infeksi berat)",
    max: "800 mg/hari",
    loading: "800 mg IV (12 mg/kg) pada hari pertama — wajib untuk mencapai kadar terapetik cepat",
    maintenance: "400 mg/hari (6 mg/kg/hari). Durasi: hingga 14 hari post-kandidemia + klinis membaik.",
    route: ["IV", "PO"],
    dilution: "Ready-to-use 2 mg/mL (200 mg/100 mL). Infus 30–60 menit.",
    rate: "200 mg/jam maks (jangan lebih cepat — flushing, bronkospasme)",
    titration: null,
    special_notes: "Bioavailabilitas PO = IV → switch oral segera jika toleransi baik. Identifikasi spesies Candida WAJIB sebelum atau selama terapi — ganti echinocandin jika C. glabrata/krusei."
  },
  renal_adjustment: {
    ge60:   { dose: "Loading 800 mg → 400 mg/hari", interval: "q24j", note: "" },
    r30_60: { dose: "Loading 800 mg → 200 mg/hari", interval: "q24j", note: "Kurangi 50% maintenance" },
    r15_30: { dose: "Loading 800 mg → 200 mg/hari", interval: "q24j", note: "" },
    r_lt15: { dose: "Loading 800 mg → 100–200 mg/hari", interval: "q24j", note: "Akumulasi signifikan" },
    hd:     { dose: "400 mg post-HD (dosis penuh)", interval: "Post-HD saja", note: "Terdialisis 50% — berikan setelah HD" },
    crrt:   { dose: "200–400 mg/hari", interval: "q24j", note: "CRRT meningkatkan clearance" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Kurangi maintenance 50% pada eGFR <30. Dosis loading tetap penuh."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25%", child_c: "Kurangi 50% — monitor LFT ketat",
    note: "Metabolisme parsial hepatik. Sirosis: clearance ↓."
  },
  pregnancy: {
    fda_category: "D (dosis tinggi) / C (dosis tunggal)",
    trimester_1: "HINDARI dosis tinggi/lama — teratogen (malformasi neonatus dilaporkan)",
    trimester_2: "Hindari dosis berulang",
    trimester_3: "Hindari dosis berulang",
    labor_delivery: "Hindari",
    fetal_risk: "Malformasi kraniofasial dan kardiak pada dosis >150 mg berulang TM1",
    lactation: "Diekskresikan ke ASI. Hindari dosis tinggi saat menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Identifikasi spesies Candida dan sensitivitas dalam 48–72 jam", "Kultur darah serial tiap 24–48 jam sampai negatif", "Perbaikan klinis"],
    safety: ["LFT (ALT/AST) setiap 1–2 minggu", "QTc jika bersama obat pemanjang QT", "Interaksi obat — review semua medikasi"],
    frequency: "Kultur darah setiap 24–48 jam sampai negatif. LFT setiap 1–2 minggu.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["QTc pemanjangan → TdP pada kombinasi obat pemanjang QT", "Hepatotoksisitas berat (jarang)"],
    common: ["Mual/diare", "↑ LFT transien", "Sakit kepala", "Rash"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Warfarin", effect: "Inhibisi CYP2C9 → ↑ INR 2–3×", management: "Kurangi warfarin 50% + monitor INR ketat" },
      { drug: "Fenitoin / Karbamazepin", effect: "Inhibisi CYP2C19 → ↑ kadar antikonvulsan → toksisitas", management: "Monitor level antikonvulsan" },
      { drug: "Tacrolimus / Siklosporin", effect: "Inhibisi CYP3A4 → ↑ kadar imunosupresan → nefrotoksisitas", management: "Kurangi dosis imunosupresan, monitor level" }
    ],
    moderate: [
      { drug: "Statin (simvastatin, lovastatin)", effect: "↑ kadar statin → miopati/rabdomiolisis" }
    ]
  },
  stewardship: {
    empiric_sources: ["Kandidemia non-kritis pada pasien stabil tanpa C. glabrata/krusei", "Step-down dari echinocandin setelah 5–7 hari jika stabil + sensitivitas"],
    deescalation_to: ["Step-down oral flukonazol → de-eskalasi dari echinocandin"],
    duration_standard: 14,
    duration_short: 14,
    duration_note: "Kandidemia: 14 hari setelah kultur darah negatif terakhir. Orofaringeal: 7–14 hari.",
    stop_criteria: "Kultur darah negatif minimal 2× + perbaikan klinis + sumber infeksi disingkirkan",
    avoid_for: ["C. glabrata/krusei (resistensi intrinsik)", "Aspergillosis (tidak aktif)", "Pasien kritis/ICU (echinocandin lebih disukai)"],
    local_pattern_note: "C. tropicalis paling umum di ICU Indonesia — umumnya sensitif flukonazol. Selalu identifikasi spesies."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "IDSA Candida 2016: Flukonazol untuk kandidemia non-kritis Candida sensitif" }
  ]
},

"kaspofungin": {
  name: "Kaspofungin",
  brand_id: ["Cancidas"],
  brand_id_notes: "Cancidas (MSD/Merck). Tersedia terbatas di RS besar Indonesia. Harga sangat mahal.",
  class: "Antijamur echinocandin",
  subclass: "Inhibitor β-(1,3)-D-glukan sintase",
  category: ["antifungal"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas di RS tersier Indonesia. Harga sangat mahal.",
  mechanism: "Inhibisi β-(1,3)-D-glukan sintase → gangguan sintesis dinding sel jamur (komponen yang tidak ada pada sel mamalia) → osmotik lysis. Fungisidal terhadap Candida, fungistatik terhadap Aspergillus. Aktivitas konsentrasi-dependen.",
  pkpd_type: "concentration_dependent",
  pkpd_note: "AUC/MIC. Tidak ada resistensi bermakna terhadap Candida non-krusei sejauh ini. Spektrum lebar vs echinocandin — Candida semua spesies termasuk C. glabrata dan C. krusei.",
  spectrum: {
    gram_pos: null,
    gram_neg: null,
    anaerob: null,
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: "Fungisidal: Candida semua spesies (termasuk C. glabrata, C. krusei, C. parapsilosis). Fungistatik: Aspergillus (tidak untuk mukormikosis/Cryptococcus).",
    virus: null
  },
  indications: {
    icu_primary: ["Kandidemia — lini pertama pada pasien ICU/kritis (SSC, IDSA)", "Candida invasif non-kandidemia (peritonitis, pneumonia Candida)", "Aspergillosis invasif — lini kedua (alternatif vorikonazol)"],
    icu_secondary: ["Kandidemia C. glabrata atau C. krusei (resistensi azol intrinsik)", "Empiris antijamur pada neutropenia febris refrakter antibiotik 4–7 hari"],
    local_guideline: "PERDICI: Kaspofungin first-line kandidemia ICU/kritis. Step-down flukonazol setelah 5–7 hari jika stabil + Candida sensitif azol.",
    intl_guideline: "IDSA Candida 2016: Echinocandin (kaspofungin, mikafungin, anidulafungin) first-line kandidemia ICU. ESCMM: Kaspofungin = mikafungin = anidulafungin ekuivalen."
  },
  contraindications: ["Hipersensitivitas terhadap kaspofungin atau echinocandin lain"],
  precautions: ["Hepatotoksik — LFT monitoring", "Penyesuaian pada gagal hati (Child-Pugh B/C)", "Interaksi dengan siklosporin (↑ LFT)"],
  dosing: {
    standard: "Loading 70 mg IV hari pertama → 50 mg/hari IV maintenance",
    range_low: "50 mg/hari",
    range_high: "70 mg/hari (infeksi refrakter — off-label)",
    max: "70 mg/hari",
    loading: "70 mg IV dalam 60 menit (hari pertama). WAJIB loading.",
    maintenance: "50 mg IV q24j mulai hari ke-2",
    route: ["IV"],
    dilution: "70 mg/50 mg dilarutkan dalam 10.5 mL NS atau WFI → encerkan ke 250 mL NS. JANGAN gunakan D5W (precipitat). Stabil 24 jam di kulkas.",
    rate: "Infus 60 menit",
    titration: null,
    special_notes: "Step-down ke flukonazol oral setelah 5–7 hari jika: (1) kultur stabil/negatif, (2) spesies sensitif azol, (3) klinis membaik, (4) toleransi oral baik."
  },
  renal_adjustment: {
    ge60:   { dose: "Loading 70 mg → 50 mg/hari", interval: "q24j", note: "" },
    r30_60: { dose: "Loading 70 mg → 50 mg/hari", interval: "q24j", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Loading 70 mg → 50 mg/hari", interval: "q24j", note: "AMAN — tidak perlu penyesuaian" },
    r_lt15: { dose: "Loading 70 mg → 50 mg/hari", interval: "q24j", note: "AMAN pada gagal ginjal" },
    hd:     { dose: "50 mg/hari", interval: "q24j", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "50 mg/hari", interval: "q24j", note: "Aman" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak perlu penyesuaian dosis pada gagal ginjal — keunggulan utama vs azol pada AKI."
  },
  hepatic_adjustment: {
    child_a: "Normal (50 mg/hari)", child_b: "Kurangi ke 35 mg/hari (setelah loading 70 mg)", child_c: "Data terbatas — kurangi ke 35 mg/hari",
    note: "Metabolisme hepatik. Sirosis Child-Pugh B/C: kurangi maintenance ke 35 mg/hari."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas — hindari kecuali life-threatening",
    trimester_2: "Hanya jika mutlak perlu",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Embriotoksik pada hewan (tidak ada data manusia memadai)",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Kultur Candida serial setiap 24–48 jam sampai negatif", "Perbaikan klinis 48–72 jam"],
    safety: ["LFT (ALT/AST) setiap 1–2 minggu", "Tanda reaksi infus (histamine-like: flushing, rash)"],
    frequency: "Kultur darah setiap 24–48 jam. LFT mingguan.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Hepatotoksisitas (jarang)", "Anafilaksis (sangat jarang)"],
    common: ["↑ LFT transien", "Flushing/rash saat infus", "Demam", "Hipokalemia", "Mual"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Siklosporin", effect: "↑ LFT 5× pada kombinasi (mekanisme tidak jelas)", management: "Kombinasi hanya jika manfaat >> risiko. Monitor LFT setiap 48 jam." }
    ],
    moderate: [
      { drug: "Rifampisin / Fenitoin / Deksametason (inducer)", effect: "↓ kadar kaspofungin — pertimbangkan tingkatkan ke 70 mg/hari" }
    ]
  },
  stewardship: {
    empiric_sources: ["Kandidemia ICU/kritis", "Kandidemia C. glabrata/krusei"],
    deescalation_to: ["Flukonazol oral (step-down setelah 5–7 hari jika stabil + sensitif azol)"],
    duration_standard: 14,
    duration_short: 14,
    duration_note: "Kandidemia: minimal 14 hari setelah kultur negatif terakhir. Step-down flukonazol oral setelah stabilisasi.",
    stop_criteria: "Kultur darah negatif 2× + perbaikan klinis + sumber disingkirkan",
    avoid_for: ["Aspergillosis invasif (vorikonazol lebih baik)", "Mukormikosis (tidak aktif)", "Cryptococcus (tidak aktif)"],
    local_pattern_note: "C. tropicalis dan C. parapsilosis dominan di ICU Indonesia — keduanya sangat sensitif echinocandin."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "IDSA 2016: Echinocandin first-line kandidemia ICU/kritis" }
  ]
},

"vorikonazol": {
  name: "Vorikonazol",
  brand_id: ["Vfend", "Vorikonazol Pfizer", "Voricef"],
  brand_id_notes: "Vfend (Pfizer) originator. Generik tersedia. Tersedia terbatas di RS besar Indonesia.",
  class: "Antijamur triazol generasi 2",
  subclass: "Inhibitor ergosterol synthesis (CYP51) spektrum luas",
  category: ["antifungal"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas di RS besar Indonesia. Lebih tersedia sebagai PO.",
  mechanism: "Inhibisi CYP51 jamur dengan afinitas dan spektrum lebih luas dari flukonazol. Aktif terhadap Aspergillus dan Candida (termasuk C. krusei dan C. glabrata). Tidak aktif terhadap Mucor.",
  pkpd_type: null,
  pkpd_note: "Farmakokinetik non-linear (saturasi CYP2C19) — variabilitas antar-individu besar. TDM (therapeutic drug monitoring) sangat dianjurkan. Target trough 1–5.5 mcg/mL.",
  spectrum: {
    gram_pos: null,
    gram_neg: null,
    anaerob: null,
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: "Aktif: Aspergillus semua spesies (first-line IPA), Candida (termasuk C. krusei dan C. glabrata). Tidak aktif: Mucor/Rhizopus (mukormikosis — gunakan amfoterisin B).",
    virus: null
  },
  indications: {
    icu_primary: ["Aspergillosis paru invasif (IPA) — LINI PERTAMA (IDSA, ECMM)", "Kandidemia C. krusei atau C. glabrata (setelah stabil dari echinocandin)"],
    icu_secondary: ["Infeksi jamur invasif refrakter flukonazol", "Fusariosis invasif"],
    local_guideline: "PERDICI: Vorikonazol lini pertama IPA. TDM dianjurkan untuk optimasi dosis.",
    intl_guideline: "IDSA Aspergillus 2016: Vorikonazol lini pertama IPA — superior amfoterisin B (HERMES trial). ECMM: TDM trough target 1–5.5 mcg/mL."
  },
  contraindications: ["Hipersensitivitas terhadap vorikonazol atau azol", "Gangguan visual berat yang ada", "Kombinasi rifampisin, karbamazepin, fenobarbital (induksi CYP → kadar sub-terapi)"],
  precautions: ["Gangguan visual transien (15–30%) — fotopsia, penglihatan buram, buta warna", "Hepatotoksisitas — LFT monitoring", "QTc pemanjangan", "Fotosensitivitas — risiko karsinoma sel skuamosa pada penggunaan lama", "Farmakokinetik non-linear — TDM wajib"],
  dosing: {
    standard: "Loading: 6 mg/kg IV q12j × 2 dosis → Maintenance: 4 mg/kg IV q12j",
    range_low: "3 mg/kg q12j (maintenance jika efek samping)",
    range_high: "6 mg/kg q12j (loading dan infeksi berat)",
    max: "Tidak ada batas mutlak — titrasi per TDM",
    loading: "6 mg/kg IV q12j × 2 dosis pada hari pertama",
    maintenance: "4 mg/kg IV q12j. Atau PO: <40 kg: 100 mg q12j; ≥40 kg: 200 mg q12j.",
    route: ["IV", "PO"],
    dilution: "Encerkan ke 5 mg/mL dalam NS atau D5W. Infus 1–2 jam.",
    rate: "Maks 3 mg/kg/jam",
    titration: "TDM trough: target 1–5.5 mcg/mL. Naikan dosis jika trough <1, turunkan jika >5.5.",
    special_notes: "⚠ HINDARI IV pada gagal ginjal (eGFR <50) — eksipien SBECD dalam formulasi IV terakumulasi (nefrotoksik). Gunakan PO jika eGFR <50."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal IV", interval: "Normal", note: "" },
    r30_60: { dose: "Normal IV dengan monitoring", interval: "Normal", note: "SBECD eksipien mulai akumulasi" },
    r15_30: { dose: "Gunakan PO — hindari IV", interval: "Normal", note: "SBECD akumulasi nefrotoksik" },
    r_lt15: { dose: "PO wajib — HINDARI IV", interval: "Normal", note: "SBECD akumulasi dramatis pada IV" },
    hd:     { dose: "PO wajib (IV kontraindikasi relatif)", interval: "Normal", note: "SBECD tidak terdialisis efektif" },
    crrt:   { dose: "PO lebih aman", interval: "Normal", note: "Pertimbangkan IV hanya jika PO tidak memungkinkan" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI IV pada eGFR <50 — SBECD eksipien nefrotoksik. Gunakan PO (bioavailabilitas 90%). TDM tetap diperlukan."
  },
  hepatic_adjustment: {
    child_a: "Loading normal → maintenance 50% kurangi", child_b: "Idem", child_c: "Kontraindikasi relatif — hepatotoksisitas sangat tinggi",
    note: "Metabolisme CYP2C19 (utama), CYP2C9, CYP3A4. Polimorfisme CYP2C19 menyebabkan variabilitas besar (extensive vs poor metabolizer)."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "KONTRAINDIKASI — teratogen pada hewan",
    trimester_2: "KONTRAINDIKASI",
    trimester_3: "KONTRAINDIKASI",
    labor_delivery: "KONTRAINDIKASI",
    fetal_risk: "Teratogen pada hewan. Data manusia tidak ada.",
    lactation: "KONTRAINDIKASI",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["CT toraks serial (IPA: respons dalam 2 minggu)", "Galaktomanan serum/BAL", "Perbaikan klinis"],
    safety: ["TDM trough setelah 5–7 hari: target 1–5.5 mcg/mL", "LFT setiap 1–2 minggu", "EKG (QTc)", "Tanda gangguan visual — fotopsia, buta warna", "Fotosensitivitas kulit"],
    frequency: "TDM setelah 5–7 hari, lalu setiap 1–2 minggu. LFT mingguan.",
    therapeutic_range: "Trough: 1–5.5 mcg/mL. <1: risiko kegagalan. >5.5: risiko neurotoksisitas dan hepatotoksisitas."
  },
  adverse_effects: {
    critical: ["Hepatotoksisitas berat — gagal hati akut (jarang)", "Neurotoksisitas (trough >5.5 mcg/mL)"],
    common: ["Gangguan visual transien (fotopsia, penglihatan buram) 15–30%", "↑ LFT", "Fotosensitivitas", "Rash", "Halusinasi visual"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Rifampisin / Karbamazepin / Fenobarbital", effect: "Induksi CYP → ↓ kadar vorikonazol >90% → kegagalan terapi", management: "KONTRAINDIKASI — ganti antijamur lain" },
      { drug: "Warfarin", effect: "↑ INR dramatis (CYP2C9 inhibisi)", management: "Kurangi warfarin 50–75% + monitor INR harian" },
      { drug: "Tacrolimus / Siklosporin", effect: "↑ kadar 2–3× → nefrotoksisitas", management: "Kurangi dosis imunosupresan 67–75% + monitor level" }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["IPA dicurigai atau terkonfirmasi pada pasien imunokompromis"],
    deescalation_to: ["Tidak ada de-eskalasi untuk IPA — durasi panjang (6–12 minggu)"],
    duration_standard: 84,
    duration_short: 42,
    duration_note: "IPA: 6–12 minggu (tergantung respons CT dan status imun). Jangan hentikan prematur.",
    stop_criteria: "CT scan membaik + galaktomanan negatif + imun recovery (jika transplant)",
    avoid_for: ["Mukormikosis (tidak aktif — gunakan amfoterisin B liposomal)", "Penggunaan tanpa diagnosis jamur yang jelas"],
    local_pattern_note: "IPA meningkat di ICU Indonesia terutama post-COVID dan imunosupresi steroid berkepanjangan."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "IDSA 2016: Vorikonazol lini pertama aspergillosis invasif" }
  ]
},

"oseltamivir": {
  name: "Oseltamivir (Tamiflu)",
  brand_id: ["Tamiflu", "Oseltamivir Roche"],
  brand_id_notes: "Tamiflu (Roche). Tersedia di semua RS Indonesia via program pemerintah. Stok strategis.",
  class: "Antiviral",
  subclass: "Inhibitor neuraminidase influenza",
  category: ["antiviral"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Digunakan luas saat outbreak influenza.",
  mechanism: "Inhibisi neuraminidase influenza A dan B → mencegah pelepasan virion dari sel terinfeksi → menghambat penyebaran infeksi. Efektif jika dimulai dalam 48 jam onset gejala. Prodrug: oseltamivir fosfat → oseltamivir karboksilat (aktif) via esterase intestinal.",
  pkpd_type: null,
  pkpd_note: "Onset maksimum efikasi: <48 jam gejala. Pada ICU dengan influenza berat: tetap berikan meski >48 jam (viral shedding berlanjut). Resistance: H275Y mutasi neuraminidase (H1N1 resistensi oseltamivir).",
  spectrum: {
    gram_pos: null,
    gram_neg: null,
    anaerob: null,
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: "Aktif: Influenza A (H1N1, H3N2, H5N1, H7N9) dan Influenza B. Tidak aktif: virus lain (COVID-19, RSV, parainfluenza)."
  },
  indications: {
    icu_primary: ["Influenza berat memerlukan rawat ICU/ventilasi", "Influenza pada pasien immunocompromised", "Influenza avian (H5N1, H7N9) — dosis tinggi"],
    icu_secondary: ["Profilaksis post-eksposur influenza pada kontak berisiko tinggi", "Influenza ringan dalam 48 jam gejala"],
    local_guideline: "Kemenkes Indonesia: Oseltamivir untuk influenza berat, kasus konfirmasi H5N1/H7N9, dan risiko tinggi. Tidak perlu konfirmasi lab untuk mulai terapi pada suspect berat.",
    intl_guideline: "WHO: Oseltamivir untuk influenza berat — mulai segera tanpa menunggu lab konfirmasi. AHA: Pada ICU, tetap berikan meski >48 jam onset."
  },
  contraindications: ["Hipersensitivitas terhadap oseltamivir", "Gagal ginjal terminal (eGFR <10) tanpa HD — akumulasi"],
  precautions: ["Penyesuaian dosis pada gagal ginjal", "Halusinasi/delirium (jarang, terutama anak-anak)", "Resistensi H275Y pada H1N1 — gunakan zanamivir sebagai gantinya"],
  dosing: {
    standard: "75 mg PO dua kali sehari × 5 hari. ICU berat: 150 mg PO q12j × 10 hari.",
    range_low: "75 mg q12j (standar)",
    range_high: "150 mg q12j (influenza berat ICU, H5N1)",
    max: "150 mg per dosis (dosis tinggi influenza berat)",
    loading: null,
    maintenance: "75 mg q12j standar. 150 mg q12j untuk ICU/H5N1.",
    route: ["PO", "NG tube (suspense/kapsul)"],
    dilution: "Kapsul 75 mg dapat dibuka → larutkan dalam air untuk NG tube. Suspensi 12 mg/mL tersedia.",
    rate: "Oral",
    titration: null,
    special_notes: "Pada pasien ICU dengan malabsorpsi atau gastroparesis: pertimbangkan IV peramivir (jika tersedia) atau inhaled zanamivir sebagai alternatif."
  },
  renal_adjustment: {
    ge60:   { dose: "75 mg q12j",  interval: "Normal", note: "" },
    r30_60: { dose: "75 mg q12j",  interval: "Normal", note: "" },
    r15_30: { dose: "30–75 mg q12j", interval: "Normal", note: "Beberapa protokol kurangi dosis" },
    r_lt15: { dose: "30 mg q24j",  interval: "q24j", note: "Akumulasi bermakna" },
    hd:     { dose: "30 mg post-HD", interval: "Post-HD saja", note: "Terdialisis 30–50%. Berikan setelah HD." },
    crrt:   { dose: "75 mg q24j",  interval: "q24j", note: "" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Kurangi dosis pada eGFR <30. Berikan setelah HD pada pasien dialisis."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — tidak perlu penyesuaian",
    note: "Hidrolisis oleh esterase intestinal dan hepatik. Tidak bergantung CYP."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Manfaat >> risiko pada influenza berat — GUNAKAN",
    trimester_2: "Aman digunakan",
    trimester_3: "Aman — influenza pada kehamilan berat, berikan segera",
    labor_delivery: "Aman",
    fetal_risk: "Manfaat mengobati influenza ibu >> risiko obat",
    lactation: "Diekskresikan ke ASI minimal. Umumnya aman saat menyusui.",
    lactation_note: "CDC: Aman untuk ibu menyusui"
  },
  monitoring: {
    efficacy: ["Perbaikan klinis (demam, gejala pernafasan) dalam 48–72 jam", "Viral load influenza jika tersedia (H5N1)", "SpO₂ dan parameter ventilasi (ICU)"],
    safety: ["Fungsi ginjal", "Tanda neuropsikiatri (halusinasi — terutama anak)"],
    frequency: "Klinis harian",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Bronkospasme (jarang)", "Neuropsikiatri: halusinasi, delirium (jarang, anak-anak)"],
    common: ["Mual/muntah (10–15%) — berkurang jika diminum bersama makanan", "Sakit kepala", "Insomnia"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Probenesid", effect: "↑ kadar oseltamivir (↓ ekskresi tubular renal)", management: "Tidak signifikan secara klinis" }
    ]
  },
  stewardship: {
    empiric_sources: ["Suspect influenza berat memerlukan ICU atau IMC"],
    deescalation_to: ["Stop setelah 5 hari (standar) atau 10 hari (ICU berat)"],
    duration_standard: 5,
    duration_short: 5,
    duration_note: "Standar: 5 hari. Influenza berat ICU: 10 hari. H5N1/imunokompromi berat: >10 hari.",
    stop_criteria: "Perbaikan klinis + viral shedding tidak bermakna",
    avoid_for: ["COVID-19, RSV, influenza yang dikonfirmasi resisten oseltamivir (H275Y)"],
    local_pattern_note: "Influenza A H3N2 dan B paling umum di Indonesia. Stok oseltamivir di Dinkes sebagai cadangan strategis."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "WHO: Oseltamivir untuk influenza berat — mulai segera tanpa menunggu konfirmasi lab" }
  ]
},

"asiklovir_iv": {
  name: "Asiklovir IV",
  brand_id: ["Zovirax IV", "Asiklovir Dexa", "Herlovir", "Acyclovir Hameln"],
  brand_id_notes: "Zovirax (GSK) originator. Generik sangat luas. Tersedia di semua RS Indonesia.",
  class: "Antiviral",
  subclass: "Analog nukleosida (inhibitor DNA polimerase herpesvirus)",
  category: ["antiviral"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Generik murah.",
  mechanism: "Prodrug: Asiklovir → diaktivasi oleh timidin kinase virus (spesifisitas virus) → asiklovir trifosfat → inhibisi DNA polimerase herpesvirus dan terminasi rantai DNA. Selektif terhadap sel terinfeksi virus — toksisitas ke sel manusia minimal.",
  pkpd_type: null,
  pkpd_note: "Ekskresi renal dominan (tubular sekresi). Kristaluria pada infus cepat atau hidrasi tidak adekuat. Bioavailabilitas PO rendah (15–30%) — IV untuk infeksi berat.",
  spectrum: {
    gram_pos: null,
    gram_neg: null,
    anaerob: null,
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: "Aktif: HSV-1, HSV-2, VZV (varisela-zoster). Moderat: EBV. Lemah: CMV (gansiklovir lebih aktif). Tidak aktif: virus lain."
  },
  indications: {
    icu_primary: ["Ensefalitis herpes simplex (HSV) — EMERGENSI, mulai sebelum konfirmasi", "VZV disseminata atau VZV berat pada imunokompromis", "HSV berat (hepatitis, pneumonitis, esofagitis)"],
    icu_secondary: ["Profilaksis HSV/VZV pada transplantasi atau kemoterapi berat", "Herpes zoster ophthalmicus", "Neonatal herpes"],
    local_guideline: "PERDOSSI: Asiklovir IV untuk ensefalitis HSV — mulai segera jika klinis mencurigai (jangan tunggu PCR).",
    intl_guideline: "IDSA HSV encephalitis: Asiklovir 10 mg/kg IV q8j × 14–21 hari. Mulai empiris segera jika suspect — mortalitas tanpa terapi sangat tinggi."
  },
  contraindications: ["Hipersensitivitas terhadap asiklovir atau valasiklovir"],
  precautions: ["Nefrotoksisitas — kristaluria jika infus cepat atau dehidrasi", "Neurotoksisitas pada gagal ginjal (tremor, agitasi, ensefalopati)", "Penyesuaian dosis pada gagal ginjal wajib"],
  dosing: {
    standard: "Ensefalitis HSV: 10 mg/kg IV q8j × 14–21 hari. VZV berat: 10–12 mg/kg IV q8j.",
    range_low: "5 mg/kg q8j (HSV mukokutan pada imunokompeten)",
    range_high: "12 mg/kg q8j (VZV berat, imunokompromis)",
    max: "60 mg/kg/hari",
    loading: null,
    maintenance: "10 mg/kg q8j untuk ensefalitis. Durasi 14–21 hari HSV, 7–10 hari VZV.",
    route: ["IV"],
    dilution: "250 mg dalam 100 mL NS (konsentrasi ≤7 mg/mL). INFUS PELAN ≥1 JAM — bukan bolus. Kristaluria pada infus cepat.",
    rate: "Infus >60 menit. Konsentrasi ≤7 mg/mL.",
    titration: null,
    special_notes: "⚠ Hidrasi adekuat WAJIB — infus 0.9% NS 1–2 L/hari selama terapi untuk mencegah kristaluria. Infus MINIMAL 1 JAM — kristaluria pada infus cepat."
  },
  renal_adjustment: {
    ge60:   { dose: "10 mg/kg", interval: "q8j",  note: "" },
    r30_60: { dose: "10 mg/kg", interval: "q12j", note: "Perpanjang interval" },
    r15_30: { dose: "10 mg/kg", interval: "q24j", note: "Akumulasi bermakna" },
    r_lt15: { dose: "5 mg/kg",  interval: "q24j", note: "Risiko neurotoksisitas tinggi" },
    hd:     { dose: "5 mg/kg post-HD", interval: "Post-HD saja", note: "Terdialisis 60% — berikan setelah HD" },
    crrt:   { dose: "5–7.5 mg/kg", interval: "q12–24j", note: "Sesuaikan dengan effluent rate" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Penyesuaian dosis wajib pada gagal ginjal. Hidrasi adekuat mencegah kristaluria. Monitor kreatinin setiap 48 jam."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak dimetabolisme hepatik secara bermakna."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman jika indikasi jelas (ensefalitis HSV)",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Dapat digunakan untuk HSV primer peripartum",
    fetal_risk: "Tidak ada bukti teratogenisitas pada dosis terapeutik",
    lactation: "Ekskresi ke ASI bermakna. Umumnya aman jika diperlukan.",
    lactation_note: "Monitor bayi — kadar ASI ~0.6× kadar serum ibu"
  },
  monitoring: {
    efficacy: ["Perbaikan klinis ensefalitis (kesadaran, demam)", "PCR HSV/VZV CSS jika baseline positif — cek setelah 14 hari", "GCS monitoring"],
    safety: ["Kreatinin setiap 48 jam", "Urin output — kristaluria", "Tanda neurotoksisitas: tremor, agitasi, bingung (pada gagal ginjal)"],
    frequency: "Kreatinin setiap 48 jam. Klinis harian.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Nefrotoksisitas (kristaluria, ATN) — infus cepat + dehidrasi", "Neurotoksisitas pada gagal ginjal: tremor, agitasi, ensefalopati (tidak berhubungan dengan infeksi)"],
    common: ["Flebitis di lokasi infus", "Mual/vomiting", "Sakit kepala", "↑ kreatinin transien"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Probenesid", effect: "↑ kadar asiklovir (↓ ekskresi tubular)", management: "Tidak signifikan secara klinis" }
    ],
    moderate: [
      { drug: "Nefrotoksik lain (aminoglikosida, amfoterisin)", effect: "Nefrotoksisitas sinergistik" }
    ]
  },
  stewardship: {
    empiric_sources: ["Suspect ensefalitis HSV — mulai SEGERA sebelum konfirmasi PCR"],
    deescalation_to: ["Asiklovir oral (valasiklovir) setelah stabilisasi klinis — untuk step-down"],
    duration_standard: 14,
    duration_short: 14,
    duration_note: "Ensefalitis HSV: 14–21 hari IV (PCR negatif tidak cukup untuk stop dini). VZV disseminata: 7–10 hari.",
    stop_criteria: "PCR negatif + klinis membaik — namun tetap minimal 14 hari untuk ensefalitis HSV",
    avoid_for: ["CMV (gansiklovir lebih aktif)", "Influenza/COVID-19 (tidak aktif)"],
    local_pattern_note: "Ensefalitis HSV sering underdiagnosis di Indonesia — mortalitas tinggi tanpa terapi. Inisiasi empiris sebelum hasil PCR sangat direkomendasikan."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "IDSA: Asiklovir IV untuk ensefalitis HSV — mulai segera empiris" }
  ]
},

"gansiklovir": {
  name: "Gansiklovir",
  brand_id: ["Cymevene", "Ganciclovir Roche"],
  brand_id_notes: "Cymevene (Roche). Tersedia sangat terbatas di Indonesia. Mahal.",
  class: "Antiviral",
  subclass: "Analog nukleosida (inhibitor DNA polimerase CMV)",
  category: ["antiviral"],
  common_in_id: false,
  common_in_id_note: "Tersedia sangat terbatas — RS tersier transplantasi dan onkologi Indonesia.",
  mechanism: "Analog guanosin: diaktivasi oleh UL97 kinase CMV → gansiklovir trifosfat → inhibisi kompetitif DNA polimerase CMV (pUL54) dan terminasi rantai DNA. Jauh lebih aktif terhadap CMV dibanding asiklovir.",
  pkpd_type: null,
  pkpd_note: "Ekskresi renal dominan. Penyesuaian dosis wajib pada gagal ginjal. Myelosupresan — monitor CBC.",
  spectrum: {
    gram_pos: null,
    gram_neg: null,
    anaerob: null,
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: "Aktif: CMV (Cytomegalovirus) — potens jauh lebih tinggi dari asiklovir. Juga aktif: HSV, VZV, EBV. Resistensi CMV via mutasi UL97 atau UL54."
  },
  indications: {
    icu_primary: ["CMV end-organ disease pada imunokompromis: pneumonitis CMV, retinitis CMV, kolitis CMV, ensefalitis CMV", "CMV disease post-transplantasi solid organ atau HSCT"],
    icu_secondary: ["Profilaksis CMV post-transplantasi berisiko tinggi (donor D+/resipien R-)", "CMV viremia bermakna pada imunokompromis dengan gejala"],
    local_guideline: "PERDICI/IDAI: Gansiklovir untuk CMV end-organ disease pada pasien imunosupresi. Monitoring CBC ketat — myelosupresi.",
    intl_guideline: "IDSA CMV 2023: Gansiklovir atau valgansiklovir untuk CMV end-organ disease. IV gansiklovir untuk gastrointestinal/pneumonitis berat. Valgansiklovir oral setara untuk stable disease."
  },
  contraindications: ["Hipersensitivitas terhadap gansiklovir atau valgansiklovir", "Neutrofil <500/mm³ (tidak dapat dimulai)", "Trombosit <25.000/mm³ (relatif)"],
  precautions: ["Myelosupresi berat — neutropenia, trombositopenia", "Nefrotoksisitas — penyesuaian dosis wajib", "Teratogen dan karsinogenik potensial", "G-CSF mungkin diperlukan jika neutropenia"],
  dosing: {
    standard: "Induksi: 5 mg/kg IV q12j × 14–21 hari → Maintenance: 5 mg/kg IV q24j",
    range_low: "2.5 mg/kg q24j (gagal ginjal)",
    range_high: "5 mg/kg q12j (induksi)",
    max: "10 mg/kg/hari (induksi)",
    loading: null,
    maintenance: "5 mg/kg q12j (induksi 14–21 hari) → 5 mg/kg q24j (maintenance)",
    route: ["IV"],
    dilution: "500 mg dilarutkan dalam 10 mL WFI → encerkan ke konsentrasi ≤10 mg/mL dalam 100 mL NS. Infus 60 menit.",
    rate: "Infus >60 menit — infus cepat → toksisitas",
    titration: null,
    special_notes: "Valgansiklovir oral (900 mg q12j) setara gansiklovir IV untuk penyakit yang tidak memerlukan IV. Switch PO segera jika toleransi oral baik."
  },
  renal_adjustment: {
    ge60:   { dose: "5 mg/kg", interval: "q12j (induksi), q24j (maintenance)", note: "" },
    r30_60: { dose: "2.5 mg/kg", interval: "q12j (induksi), q24j (maintenance)", note: "" },
    r15_30: { dose: "2.5 mg/kg", interval: "q24j (induksi), q48j (maintenance)", note: "" },
    r_lt15: { dose: "1.25 mg/kg", interval: "q24–48j", note: "Risiko akumulasi dan myelosupresi" },
    hd:     { dose: "1.25 mg/kg post-HD", interval: "Post-HD saja", note: "Terdialisis 50–60%" },
    crrt:   { dose: "2.5 mg/kg", interval: "q24j", note: "Monitor CBC ketat" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Penyesuaian dosis wajib dan signifikan pada gagal ginjal. CBC dan kreatinin setiap 48–72 jam."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak dimetabolisme hepatik bermakna."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "KONTRAINDIKASI — teratogen dan karsinogenik potensial",
    trimester_2: "KONTRAINDIKASI",
    trimester_3: "KONTRAINDIKASI",
    labor_delivery: "KONTRAINDIKASI",
    fetal_risk: "Teratogen dan karsinogenik pada hewan. Infertilitas pria.",
    lactation: "KONTRAINDIKASI",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["CMV viral load setiap 1–2 minggu (target tidak deteksi)", "Perbaikan klinis organ yang terinfeksi (retina, GI, paru)"],
    safety: ["CBC 2× seminggu — neutropenia (utama), trombositopenia", "Kreatinin setiap 48–72 jam", "Tanda resistensi CMV jika viral load naik saat terapi"],
    frequency: "CBC 2× seminggu. CMV viral load tiap 1–2 minggu. Kreatinin tiap 48–72 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Neutropenia berat (20–40%) — risiko infeksi sekunder", "Trombositopenia berat — risiko perdarahan"],
    common: ["Mual/vomiting", "Flebitis", "↑ kreatinin", "Demam", "Diare"],
    antidote: "Neutropenia: G-CSF (filgrastim) 5 mcg/kg/hari SC. Stop gansiklovir jika ANC <500."
  },
  interactions: {
    major: [
      { drug: "Imipenem/Meropenem", effect: "Kombinasi → ↑ risiko kejang (laporan kasus)", management: "Pantau tanda seizure" },
      { drug: "Zidovudin (AZT)", effect: "Myelosupresi aditif → neutropenia berat", management: "Hindari kombinasi jika memungkinkan" }
    ],
    moderate: [
      { drug: "Probenesid", effect: "↑ kadar gansiklovir (↓ ekskresi tubular)" }
    ]
  },
  stewardship: {
    empiric_sources: ["CMV end-organ disease pada imunokompromis terkonfirmasi atau sangat dicurigai"],
    deescalation_to: ["Valgansiklovir oral 900 mg q12j (setara IV) — switch segera jika toleransi oral baik"],
    duration_standard: 21,
    duration_short: 14,
    duration_note: "Induksi: 14–21 hari. Maintenance: hingga imun recovery. Retinitis: seumur hidup pada HIV tidak terkontrol.",
    stop_criteria: "CMV viral load tidak deteksi + perbaikan klinis + imun recovery",
    avoid_for: ["CMV viremia asimtomatik pada imunokompeten (tidak perlu terapi)", "Profil lab resisten gansiklovir (mutasi UL97) — gunakan foskarnet atau sidofovir"],
    local_pattern_note: "CMV end-organ disease terutama pada post-transplantasi, HIV stadium lanjut, dan terapi imunosupresan berat — semua meningkat di Indonesia."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "IDSA 2023: Gansiklovir IV untuk CMV end-organ disease berat pada imunokompromis" }
  ]
}

,

/* ============================================================
   FASE 4 — KARDIOVASKULAR
   ============================================================ */

"nikardipin": {
  name: "Nikardipin",
  brand_id: ["Perdipine", "Nicardipine HCl"],
  brand_id_notes: "Perdipine adalah brand utama di Indonesia",
  class: "Antihipertensi",
  subclass: "Calcium Channel Blocker (Dihidropiridin)",
  category: ["antihipertensi", "kardiovaskular"],
  common_in_id: true,
  mechanism: "Memblokir kanal kalsium tipe-L pada otot polos vaskular → vasodilatasi arteri perifer dan koroner → penurunan afterload dan tekanan darah. Tidak mempengaruhi konduksi AV secara signifikan.",
  pkpd_type: "Titrasi kontinu",
  pkpd_note: "Onset IV: 5–15 menit. Durasi: 15–30 menit setelah stop. Metabolisme hepatik ekstensif (first-pass >95%). Efek BP turun proporsional dengan dosis — titrasi bertahap.",
  spectrum: {},
  indications: {
    icu_primary: ["Hipertensi berat / krisis hipertensi pada ICU", "Hipertensi pasca-operasi (bedah kardiak, vaskular, neurosurgeri)", "Hipertensi pada stroke iskemik atau perdarahan intrakranial"],
    icu_secondary: ["Angina tidak stabil (jika beta-blocker kontraindikasi)", "Hipertensi pada preeklampsia berat (alternatif hydralazine)"],
    local_guideline: "PERDOSSI 2019: Nikardipin IV pilihan untuk hipertensi emergensi pada stroke",
    intl_guideline: "JNC 8, AHA/ACC 2018: Nikardipin IV untuk krisis hipertensi dengan target BP reduction ≤25% dalam 1 jam pertama"
  },
  contraindications: ["Stenosis aorta berat", "Gagal jantung dekompensasi akut (kardiogenik syok)", "Hipersensitivitas nikardipin/dihidropiridin"],
  precautions: ["Reflex tachycardia — kombinasikan dengan beta-blocker jika perlu", "Monitor tekanan darah tiap 5–15 menit saat titrasi", "Hati-hati pada penyakit hati berat (metabolisme terganggu)", "Flebitis pada vena perifer — gunakan vena sentral jika >12 jam"],
  dosing: {
    standard: "5 mg/jam IV, titrasi 2.5 mg/jam tiap 5–15 menit",
    range_low: "2.5 mg/jam",
    range_high: "15 mg/jam",
    max: "15 mg/jam",
    loading: null,
    maintenance: "Titrasi hingga target BP tercapai, lanjutkan dosis efektif",
    route: ["IV kontinyu"],
    dilution: "25 mg dalam 240 mL NaCl 0.9% atau D5% (konsentrasi 0.1 mg/mL). Atau 50 mg dalam 500 mL (0.1 mg/mL).",
    rate: "5 mg/jam = 50 mL/jam (0.1 mg/mL). Sesuaikan sesuai titrasi.",
    titration: "Naik 2.5 mg/jam tiap 5–15 menit hingga target. Turunkan jika BP overshooting.",
    special_notes: "Hindari paparan cahaya langsung (photosensitive). Ganti syringe/line tiap 24 jam. Jangan campur dengan NaHCO3 (presipitasi). Periksa vena perifer tiap shift."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal — monitor BP lebih ketat",
    r15_30: "Mulai dosis rendah (2.5 mg/jam) — metabolisme hepatik tidak berubah, tapi akumulasi metabolit mungkin",
    r_lt15: "Mulai dosis rendah, titrasi hati-hati",
    hd: "Tidak terdialisis secara signifikan — dosis normal",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor BP dan tanda hipoperfusi ginjal"
  },
  hepatic_adjustment: {
    child_a: "Pertimbangkan dosis awal lebih rendah",
    child_b: "Mulai 2.5 mg/jam, titrasi lambat — metabolisme terganggu",
    child_c: "Gunakan dengan sangat hati-hati — risiko akumulasi tinggi",
    note: "Metabolisme hepatik ekstensif. Pada sirosis berat, bioavailabilitas meningkat dan klirens menurun."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali manfaat jelas melebihi risiko",
    trimester_2: "Dapat digunakan untuk hipertensi berat — monitor janin",
    trimester_3: "Digunakan untuk preeklampsia berat (off-label) — monitor CTG",
    labor_delivery: "Dapat memperpanjang persalinan; tidak ada data yang cukup",
    fetal_risk: "Teratogenisitas pada hewan. Data manusia terbatas.",
    lactation: "Perhatian",
    lactation_note: "Ekskresi ke ASI — pertimbangkan risiko/manfaat"
  },
  monitoring: {
    efficacy: ["Tekanan darah arteri (target sesuai kondisi)", "Mean arterial pressure (MAP)"],
    safety: ["Denyut jantung (reflex tachycardia)", "Tanda hipoperfusi (perubahan kesadaran, urine output)", "Situs infus (flebitis)"],
    frequency: "Tiap 5–15 menit saat titrasi, tiap 1 jam setelah stabil",
    therapeutic_range: "Target BP sesuai indikasi (stroke: ≤180/105 mmHg dalam 24 jam pertama; krisis umum: turun ≤25% dari baseline dalam 1 jam)"
  },
  adverse_effects: {
    critical: ["Hipotensi berat dan hipoperfusi organ", "Reflex tachycardia → memperburuk angina"],
    common: ["Sakit kepala", "Mual", "Flushing", "Flebitis perifer", "Peningkatan kreatinin transien"],
    antidote: "Calcium gluconate IV dapat membantu hipotensi berat. Hentikan infus. Vasopressor (norepinefrin) jika syok."
  },
  interactions: {
    major: ["Siklosporin — nikardipin meningkatkan kadar siklosporin signifikan (inhibisi CYP3A4)", "Tacrolimus — potensi peningkatan kadar"],
    moderate: ["Beta-blocker — potensiasi efek antihipertensi", "Digoksin — nikardipin dapat meningkatkan kadar digoksin", "Cimetidine — meningkatkan bioavailabilitas nikardipin"]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: ["Obat Vasoaktif Kontinu — risiko hipotensi berat jika dosis terlalu cepat dinaikkan", "Photosensitive — lindungi dari cahaya, ganti line tiap 24 jam"],
  high_alert_protocol: "Pasang di infusion pump. Label 'VASOAKTIF'. Titrasi oleh tenaga terlatih. Monitor BP tiap 5–15 menit.",
  pump_link: true,
  pump_drug_key: "nikardipin",
  evidence: [
    { ref_id: "perdossi2019", note: "PERDOSSI 2019: Nikardipin IV pilihan untuk krisis hipertensi pada stroke" },
    { ref_id: "aha2018", note: "AHA/ACC 2018 Hypertension Guidelines: IV agents for hypertensive emergency" }
  ]
},

"labetolol": {
  name: "Labetalol",
  brand_id: ["Trandate"],
  brand_id_notes: "Trandate tersedia di Indonesia namun terbatas; sering harus indent",
  class: "Antihipertensi",
  subclass: "Alpha-1 + Beta (1&2) Blocker Kombinasi",
  category: ["antihipertensi", "kardiovaskular", "antiaritmia"],
  common_in_id: false,
  mechanism: "Blokade alfa-1 (vasodilatasi) dan beta-1/beta-2 (kronotrop negatif, inotropik negatif). Rasio alfa:beta blockade = 1:3 (IV) hingga 1:7 (oral). Menurunkan SVR tanpa reflex tachycardia — keunggulan vs nikardipin.",
  pkpd_type: "Bolus atau infusi",
  pkpd_note: "Onset bolus IV: 2–5 menit. Durasi: 2–4 jam. Eliminasi hepatik (konjugasi glukuronida). Tidak terdialisis secara bermakna.",
  spectrum: {},
  indications: {
    icu_primary: ["Hipertensi emergensi pada preeklampsia/eklampsia", "Krisis hipertensi pada diseksi aorta (bersama nitroprusid)", "Hipertensi pasca-stroke hemoragik", "Feokromositoma (bersama alpha-blocker dosis penuh)"],
    icu_secondary: ["Rate control SVT jika beta-blocker diperlukan", "Hipertensi perioperatif"],
    local_guideline: "POGI 2016: Labetalol IV pilihan pertama hipertensi berat pada preeklampsia",
    intl_guideline: "ACOG 2019: Labetalol IV 20 mg bolus, dapat ulang 40–80 mg tiap 10 menit (max 300 mg) untuk preeklampsia berat"
  },
  contraindications: ["Asma bronkial atau PPOK berat (bronkospasme)", "Bradikardia (HR <60 bpm)", "Blok AV derajat 2–3", "Gagal jantung dekompensasi (low-output)", "Hipersensitivitas labetalol"],
  precautions: ["Monitor bronkospasme pada PPOK ringan-sedang", "Gagal hati berat — metabolisme terganggu", "Pheochromocytoma — gunakan bersama alpha-blocker (jangan labetalol tunggal — paradoxical hypertension)", "Neonatus dari ibu yang mendapat labetalol — risiko bradikardia, hipoglikemia"],
  dosing: {
    standard: "Bolus: 20 mg IV selama 2 menit; ulang 40–80 mg tiap 10 menit jika perlu",
    range_low: "20 mg bolus",
    range_high: "300 mg total dosis kumulatif (bolus) atau 2 mg/menit infusi",
    max: "300 mg total bolus; infusi maksimal 2 mg/menit",
    loading: "20 mg IV bolus lambat (2 menit)",
    maintenance: "Infusi 1–2 mg/menit IV, atau bolus berulang tiap 10 menit",
    route: ["IV bolus", "IV infusi"],
    dilution: "Infusi: 200 mg dalam 160 mL NaCl 0.9% atau D5% (konsentrasi 1 mg/mL)",
    rate: "1–2 mg/menit = 1–2 mL/menit (konsentrasi 1 mg/mL)",
    titration: "Bolus: naik 20→40→80 mg tiap 10 menit. Infusi: titrasi 0.5–2 mg/menit.",
    special_notes: "Setelah dosis kumulatif tercapai target, pertahankan dengan infusi atau switch ke oral. Pada preeklampsia: target SBP <160, DBP <110."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal — monitor hemodinamik",
    r15_30: "Dosis normal — eliminasi terutama hepatik",
    r_lt15: "Mulai dosis rendah — data terbatas, monitor ketat",
    hd: "Tidak terdialisis bermakna — dosis normal",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor urine output dan kreatin — hipotensi dapat memperburuk perfusi ginjal"
  },
  hepatic_adjustment: {
    child_a: "Pertimbangkan dosis lebih rendah",
    child_b: "Kurangi dosis — metabolisme terganggu",
    child_c: "Hindari atau dosis sangat rendah dengan monitoring ketat",
    note: "Metabolisme hepatik ekstensif. Sirosis → bioavailabilitas meningkat, klirens berkurang."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali manfaat jelas",
    trimester_2: "Dapat digunakan — pilihan utama di UK untuk hipertensi kehamilan",
    trimester_3: "Digunakan untuk preeklampsia berat — tetap dengan monitoring fetomaternal",
    labor_delivery: "Aman digunakan saat persalinan; pantau neonatus untuk bradikardia dan hipoglikemia",
    fetal_risk: "Beta-blockade pada neonatus: bradikardia, hipoglikemia, respiratory depression",
    lactation: "Perhatian",
    lactation_note: "Ekskresi minimal ke ASI — umumnya dianggap aman saat menyusui"
  },
  monitoring: {
    efficacy: ["Tekanan darah tiap 5–10 menit saat bolus", "MAP"],
    safety: ["Denyut jantung (hindari bradikardia)", "SpO2 (bronkospasme)", "Tanda gagal jantung akut", "CTG jika digunakan pada ibu hamil"],
    frequency: "Tiap 5 menit selama titrasi bolus, tiap 15 menit saat infusi",
    therapeutic_range: "Target BP sesuai indikasi klinis"
  },
  adverse_effects: {
    critical: ["Bradikardia berat", "Bronkospasme", "Hipotensi dengan hipoperfusi organ", "Gagal jantung akut (blokade beta-2)"],
    common: ["Pusing", "Mual", "Sakit kepala", "Kelelahan", "Postural hipotensi"],
    antidote: "Bradikardia: Atropin 0.5–1 mg IV; isoproterenol drip jika berat. Bronkospasme: Salbutamol nebulisasi. Hipotensi: vasopressor."
  },
  interactions: {
    major: ["Verapamil/diltiazem IV — risiko blok AV lengkap dan bradikardia berat", "Clonidine — withdrawal hypertension jika labetalol dihentikan lebih dulu"],
    moderate: ["Antidiabetik — beta-blockade menutupi tanda hipoglikemia (tremor, takikardia)", "Anestesi inhalasi — potensiasi efek hipotensif"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "acog2019", note: "ACOG 2019: Labetalol IV 20–80 mg bolus untuk severe-range BP pada preeklampsia" },
    { ref_id: "pogi2016", note: "POGI 2016: Labetalol IV pilihan utama hipertensi berat pada kehamilan di Indonesia" }
  ]
},

"esmolol": {
  name: "Esmolol",
  brand_id: ["Brevibloc", "Esmolol HCl"],
  brand_id_notes: "Brevibloc tersedia terbatas di Indonesia; alternatif metoprolol IV lebih mudah ditemukan",
  class: "Antiaritmia / Antihipertensi",
  subclass: "Beta-1 Selektif Blocker (Ultra-Short Acting)",
  category: ["antiaritmia", "antihipertensi", "kardiovaskular"],
  common_in_id: false,
  mechanism: "Blokade selektif reseptor beta-1 → dromotropik dan kronotrop negatif → penurunan HR dan BP. Dimetabolisme oleh esterase eritrosit (bukan hepatik/renal) → onset sangat cepat (onset 60 detik), durasi sangat pendek (efek hilang 10–20 menit setelah stop).",
  pkpd_type: "Titrasi kontinu / bolus",
  pkpd_note: "Half-life: ~9 menit. Metabolisme oleh red blood cell esterase — tidak dipengaruhi oleh fungsi hati/ginjal. Sangat mudah dititrasi — ideal untuk situasi akut.",
  spectrum: {},
  indications: {
    icu_primary: ["SVT (AVNRT, AF/Flutter dengan HR cepat) — rate control akut", "Hipertensi perioperatif dan takikardia", "Diseksi aorta akut tipe A atau B (bersama vasodilator untuk kontrol HR dan BP)"],
    icu_secondary: ["Thyroid storm (bersama thionamide)", "NSTEMI dengan takikardia", "Kontrol HR pada anestesi umum"],
    local_guideline: "PERKI 2020: Beta-blocker IV (termasuk esmolol) untuk rate control pada AF dengan instabilitas hemodinamik",
    intl_guideline: "ACC/AHA 2014 AF Guidelines: Esmolol IV untuk rate control akut AF jika tidak ada WPW"
  },
  contraindications: ["Bradikardia sinus (HR <50 bpm)", "Blok AV derajat 2–3 (tanpa pacu jantung)", "Syok kardiogenik", "Asma bronkial berat / bronkospasme aktif", "Hipersensitivitas esmolol"],
  precautions: ["Lakukan loading dose dan titrasi sesuai protokol", "Monitor HR dan BP kontinyu saat titrasi", "PPOK — selektivitas beta-1 berkurang pada dosis tinggi", "DM — menutupi tanda hipoglikemia"],
  dosing: {
    standard: "Loading: 500 mcg/kg IV selama 1 menit; maintenance: mulai 50 mcg/kg/menit",
    range_low: "50 mcg/kg/menit maintenance",
    range_high: "300 mcg/kg/menit maintenance",
    max: "300 mcg/kg/menit",
    loading: "500 mcg/kg IV bolus selama 1 menit (dapat diulang tiap 5 menit jika perlu)",
    maintenance: "50–300 mcg/kg/menit titrasi tiap 5 menit (naik 50 mcg/kg/menit)",
    route: ["IV bolus", "IV infusi kontinu"],
    dilution: "Konsentrasi standar: 10 mg/mL (ready-use ampul). Untuk infusi: encerkan ke 10 mg/mL dengan NaCl 0.9% atau D5%.",
    rate: "50 mcg/kg/menit → hitung: [berat (kg) × 50 mcg/menit × 60 menit] / 10.000 mcg per mL = mL/jam",
    titration: "Naik 50 mcg/kg/menit tiap 4–5 menit. Bolus ulang 500 mcg/kg sebelum tiap titrasi naik.",
    special_notes: "Jika bradikardi atau hipotensi: kurangi dosis 50% atau stop. Efek hilang dalam 10–20 menit setelah stop — ideal untuk titrasi akut."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal — metabolisme tidak bergantung ginjal/hati",
    r15_30: "Dosis normal",
    r_lt15: "Dosis normal — monitor ketat",
    hd: "Tidak terdialisis — dosis normal",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak ada penyesuaian khusus — esterase metabolism"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal",
    child_c: "Dosis normal — tidak bergantung metabolisme hati",
    note: "Unik: dimetabolisme oleh esterase eritrosit, bukan hepatik — tidak ada penyesuaian untuk gagal hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Data terbatas — gunakan hanya jika indikasi kuat",
    trimester_3: "Data terbatas — pantau neonatus",
    labor_delivery: "Gunakan dengan monitoring fetomaternal ketat",
    fetal_risk: "Beta-blockade neonatal: bradikardia, hipoglikemia",
    lactation: "Data tidak ada — hindari atau pause menyusui selama penggunaan",
    lactation_note: "Tidak ada data yang memadai"
  },
  monitoring: {
    efficacy: ["Heart rate (target sesuai indikasi: AF rate control <110 bpm)", "Tekanan darah"],
    safety: ["Bradikardia", "Hipotensi", "Bronkospasme (SpO2, wheezing)", "EKG kontinyu saat loading"],
    frequency: "Kontinyu saat titrasi, tiap 5–15 menit setelah stabil",
    therapeutic_range: "Heart rate sesuai target klinis; MAP ≥65 mmHg"
  },
  adverse_effects: {
    critical: ["Bradikardia berat / asistol (overdosis)", "Hipotensi berat", "Bronkospasme pada pasien asma"],
    common: ["Hipotensi ringan", "Mual", "Flebitis perifer (konsentrasi tinggi)", "Diaforesis"],
    antidote: "Bradikardia berat: Atropine, isoproterenol, atau pacu jantung. Bronkospasme: salbutamol. Efek hilang spontan 10–20 menit setelah stop."
  },
  interactions: {
    major: ["Verapamil/diltiazem IV — risiko blok AV lengkap", "Digoksin — potensiasi bradikardia"],
    moderate: ["Antidiabetik oral/insulin — menutupi tanda hipoglikemia", "Morfin — meningkatkan kadar plasma esmolol"]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: ["Obat Kardiologis Titrasi Cepat — harus di monitoring EKG kontinyu", "Risiko bradikardia berat dan hipotensi jika dosis berlebihan"],
  high_alert_protocol: "Pasang di infusion pump. EKG monitor kontinyu. Hanya boleh diberikan oleh tenaga terlatih dengan resusitasi tersedia.",
  pump_link: true,
  pump_drug_key: "esmolol",
  evidence: [
    { ref_id: "accaha2014", note: "ACC/AHA 2014 AF Guideline: Beta-blocker IV untuk rate control akut" },
    { ref_id: "perki2020", note: "PERKI 2020: Esmolol/metoprolol IV untuk rate control AF dengan hemodinamik stabil" }
  ]
},

"furosemid": {
  name: "Furosemid",
  brand_id: ["Lasix", "Furosemide Generik", "Diuvar"],
  brand_id_notes: "Lasix adalah brand originator; generik tersedia luas di Indonesia",
  class: "Diuretik",
  subclass: "Loop Diuretic",
  category: ["diuretik", "kardiovaskular", "gagal jantung"],
  common_in_id: true,
  mechanism: "Menghambat transporter Na-K-2Cl (NKCC2) di lengkung Henle asendens → inhibisi reabsorbsi NaCl → diuresis masif. Juga memiliki efek venodilator akut (melalui prostaglandin) → penurunan preload cepat sebelum diuresis terjadi.",
  pkpd_type: "Bolus atau infusi",
  pkpd_note: "Onset IV: 5–15 menit. Durasi: 2–4 jam (bolus). Eliminasi: 50% ginjal (bentuk utuh), 50% hepatik. Pada AKI, dosis lebih tinggi diperlukan karena ekskresi tubular berkurang.",
  spectrum: {},
  indications: {
    icu_primary: ["Fluid overload akut (edema paru, gagal jantung akut dekompensasi)", "Oliguria pada AKI dengan fluid overload (untuk mencapai keseimbangan cairan negatif)", "Hiperkalemia — membantu ekskresi kalium", "Hiperkalsemia — bersama hidrasi agresif"],
    icu_secondary: ["Hipertensi berat (bersama vasodilator)", "SIADH dengan hiponatremi simtomatik berat (adjuvan)"],
    local_guideline: "PERKI 2020: Furosemid IV pilihan utama untuk dekongesti pada ADHF",
    intl_guideline: "ESC 2021 HF Guidelines: Loop diuretic IV (furosemid) lini pertama untuk dekongesti akut"
  },
  contraindications: ["Anuria atau oliguria tanpa fluid overload (bukan indikasi)", "Hipovolemia tidak terkoreksi", "Hipokalemia berat tidak terkoreksi", "Hipersensitivitas furosemid atau sulfonamida (silang)"],
  precautions: ["Monitor elektrolit (K, Na, Mg) — risiko hipokalemia, hiponatremia, hipomagnesemia", "Ototoksisitas — risiko meningkat pada dosis tinggi, infusi cepat, aminoglikosida bersamaan", "Hiperurisemia dan gout", "Dehidrasi dan hipotensi pada pemberian berlebihan"],
  dosing: {
    standard: "20–40 mg IV bolus; dapat diulang atau dinaikkan tiap 2–4 jam",
    range_low: "20 mg IV",
    range_high: "Infusi 40 mg/jam (dosis tinggi); bolus tunggal hingga 200 mg",
    max: "Infusi kontinu 4 mg/menit; total harian tidak ditetapkan kaku — sesuaikan dengan respons",
    loading: "Bolus awal: 40 mg IV (naive); atau setara 2.5× dosis oral",
    maintenance: "Infusi 5–40 mg/jam setelah dosis efektif bolus tercapai, atau bolus berulang tiap 4–6 jam",
    route: ["IV bolus", "IV infusi kontinu", "IM (tidak direkomendasikan ICU)"],
    dilution: "Infusi: encerkan ke 1–2 mg/mL dengan NaCl 0.9% (bukan D5% — presipitasi). Lindungi dari cahaya.",
    rate: "Bolus: berikan selama ≥2 menit (max 4 mg/menit). Infusi: 5–40 mg/jam.",
    titration: "Titrasi berdasarkan urine output target (0.5–1 mL/kg/jam). Jika tidak respons dalam 2 jam, dosis lipat dua.",
    special_notes: "CARA Trial (NEJM 2011): Infusi kontinu vs bolus — tidak ada perbedaan signifikan outcome. Pilih berdasarkan kemudahan titrasi. Pantau hipovolemia."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Tingkatkan dosis — ekskresi tubular berkurang, memerlukan konsentrasi intralumen lebih tinggi",
    r15_30: "Dosis lebih tinggi diperlukan (40–80 mg bolus atau infusi 20–40 mg/jam) — respon berkurang",
    r_lt15: "Dosis sangat tinggi (80–200 mg bolus). Pertimbangkan terapi pengganti ginjal jika refrakter.",
    hd: "Tidak efektif saat sesi HD (klirens cepat). Bolus pasca-HD lebih efektif.",
    crrt: "Dapat diberikan bersama CRRT untuk tambahan diuresis residu — titrasi individual",
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Monitor urine output (target sesuai klinis), kreatinin, elektrolit tiap 4–8 jam"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal — monitor elektrolit dan ensefalopati hepatik",
    child_b: "Mulai dosis rendah — risiko ensefalopati dan alkalosis hipokalemik",
    child_c: "Hati-hati — furosemid dapat memicu ensefalopati hepatikum; gunakan kombinasi dengan spironolakton",
    note: "Pada sirosis: risiko ensefalopati dan hiponatremia. Kombinasi dengan spironolakton (rasio 10:4) lebih aman."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari jika mungkin",
    trimester_2: "Gunakan hanya jika indikasi kuat (edema paru akut ibu)",
    trimester_3: "Risiko hipoperfusi uteroplasenta",
    labor_delivery: "Gunakan dengan hati-hati",
    fetal_risk: "Dapat menyebabkan elektrolit imbalance fetal, oligohidramnion pada penggunaan kronik",
    lactation: "Perhatian — diekskresikan ke ASI",
    lactation_note: "Monitor neonatus untuk tanda dehidrasi atau elektrolit abnormal"
  },
  monitoring: {
    efficacy: ["Urine output (target sesuai klinis: dekongestif = 200 mL/jam atau negatif 1–2 L/hari)", "Berat badan harian", "Tanda edema (klinis dan foto toraks)"],
    safety: ["Elektrolit: K, Na, Mg tiap 4–8 jam saat diuresis agresif", "Kreatinin dan BUN (AKI pre-renal)", "Pendengaran (ototoksisitas pada dosis tinggi)"],
    frequency: "Urine output per jam; elektrolit tiap 4–8 jam selama diuresis aktif",
    therapeutic_range: "Urine output ≥0.5 mL/kg/jam; target negatif cairan sesuai kondisi klinis"
  },
  adverse_effects: {
    critical: ["Hipovolemia dan hipotensi berat (diuresis berlebihan)", "Ototoksisitas (tinnitus, gangguan pendengaran) — terutama infusi cepat atau kombinasi aminoglikosida", "Hipokalemia berat → aritmia"],
    common: ["Hipokalemia", "Hiponatremia", "Hipomagnesemia", "Hiperurisemia", "Hipokloremia dan alkalosis metabolik"],
    antidote: "Tidak ada antidot spesifik. Hipovolemia: resusitasi cairan. Hipokalemia: suplemen KCl. Hipomagnesemia: MgSO4."
  },
  interactions: {
    major: ["Aminoglikosida — ototoksisitas aditif (hindari kombinasi atau monitor ketat)", "Lithium — furosemid meningkatkan kadar lithium (ekskresi Na↓ → retensi Li)", "Digoksin — hipokalemia akibat furosemid meningkatkan toksisitas digoksin"],
    moderate: ["NSAID — antagonisme efek diuretik", "ACE inhibitor / ARB — risiko hipotensi dan AKI", "Kortikosteroid — hipokalemia aditif"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "esc2021", note: "ESC 2021 HF Guidelines: Furosemid IV lini pertama untuk dekongesti pada ADHF" },
    { ref_id: "cara2011", note: "CARA Trial (NEJM 2011): Infusi vs bolus furosemid — tidak ada perbedaan outcome bermakna" }
  ]
},

"spironolakton": {
  name: "Spironolakton",
  brand_id: ["Aldactone", "Spironolactone Generik", "Letonal"],
  brand_id_notes: "Aldactone adalah originator; generik tersedia luas di Indonesia",
  class: "Diuretik",
  subclass: "Aldosterone Antagonist (Potassium-Sparing Diuretic)",
  category: ["diuretik", "kardioprotektif", "kardiovaskular"],
  common_in_id: true,
  mechanism: "Kompetitif antagonis aldosteron di reseptor mineralokortikoid sel tubulus distal dan duktus kolektivus → inhibisi retensi Na dan ekskresi K → diuresis ringan hemat kalium. Efek kardioprotektif independent dari efek diuretik (anti-fibrosis miokard).",
  pkpd_type: "Oral (tidak tersedia IV; ICU biasanya via NGT)",
  pkpd_note: "Onset: 1–3 hari (efek penuh). Durasi: 2–3 hari setelah stop. Metabolit aktif utama: kanrenon. T½: 1.4 jam (spironolakton) / 16.5 jam (kanrenon). Tidak untuk kondisi akut.",
  spectrum: {},
  indications: {
    icu_primary: ["CHF dengan EF rendah (NYHA II–IV) — bukti mortalitas (RALES trial)", "Hiperaldosteronisme primer (diagnosis dan terapi sementara)", "Asites sirosis hepatis (bersama furosemid, rasio 10:4)"],
    icu_secondary: ["Hipokalemia refrakter akibat furosemid", "Hipertensi resisten"],
    local_guideline: "PERKI 2020: Spironolakton atau eplerenon untuk HFrEF EF ≤35%, NYHA II–IV, tanpa hiperkalemia",
    intl_guideline: "ESC 2021: MRA (spironolakton/eplerenon) direkomendasikan untuk HFrEF — class I evidence"
  },
  contraindications: ["Hiperkalemia (K >5.5 mEq/L)", "eGFR <30 mL/min/1.73m² (risiko hiperkalemia fatal)", "Insufisiensi adrenal", "Kombinasi dengan ACEi/ARB + eGFR rendah (triple whammy)"],
  precautions: ["Monitor kalium ketat terutama jika dikombinasi dengan ACEi/ARB atau dalam kondisi asidosis", "Payudara ginekomastia pada penggunaan jangka panjang", "Onset lambat — bukan untuk krisis akut", "Gagal ginjal kronik: batasi penggunaan, pantau K setiap 1–2 minggu awal"],
  dosing: {
    standard: "25–50 mg per hari oral/NGT",
    range_low: "12.5–25 mg/hari",
    range_high: "100–400 mg/hari (hiperaldosteronisme/sirosis)",
    max: "400 mg/hari",
    loading: null,
    maintenance: "Mulai 25 mg/hari; titrasi berdasarkan K dan respons klinik",
    route: ["PO", "NGT"],
    dilution: null,
    rate: null,
    titration: "Titrasi setiap 2–4 minggu berdasarkan K, BP, dan edema. Turunkan jika K >5.0 mEq/L.",
    special_notes: "Onset lambat 1–3 hari — tidak untuk diuresis akut. Pada sirosis: kombinasikan furosemid 40 mg + spironolakton 100 mg (rasio 10:4 untuk menjaga K normal)."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Mulai 12.5–25 mg/hari; monitor K tiap 3–7 hari",
    r15_30: "Hindari atau sangat hati-hati (25 mg tiap 2 hari, monitor K ketat)",
    r_lt15: "Kontraindikasi — risiko hiperkalemia fatal",
    hd: "Hindari — tidak efektif pada anuria; risiko akumulasi kanrenon",
    crrt: "Data tidak ada — hindari",
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "Monitor kalium setiap 3–7 hari awal terapi; stop jika K >5.5 mEq/L"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal — digunakan untuk asites sirosis",
    child_c: "Dosis normal (100–400 mg/hari untuk asites), namun monitor ketat Na, K, dan ensefalopati",
    note: "Metabolisme hepatik — penurunan signifikan pada sirosis berat dapat menyebabkan akumulasi. Monitor efek samping."
  },
  pregnancy: {
    fda_category: "C/D",
    trimester_1: "Kontraindikasi (antiandrogen — feminisasi fetus laki-laki)",
    trimester_2: "Kontraindikasi",
    trimester_3: "Kontraindikasi",
    labor_delivery: "Kontraindikasi",
    fetal_risk: "Aktivitas antiandrogen: feminisasi genitalia eksterna pada fetus laki-laki",
    lactation: "Tidak direkomendasikan",
    lactation_note: "Kanrenon (metabolit aktif) diekskresikan ke ASI — hindari selama menyusui"
  },
  monitoring: {
    efficacy: ["Urine output", "Berat badan harian (asites/edema)", "NYHA class (CHF)"],
    safety: ["Kalium serum (risiko hiperkalemia)", "Natrium serum", "Kreatinin", "Tanda ginekomastia"],
    frequency: "Elektrolit tiap 3–7 hari awal terapi; tiap 2–4 minggu saat maintenance",
    therapeutic_range: "K 3.5–5.0 mEq/L; natrium normal"
  },
  adverse_effects: {
    critical: ["Hiperkalemia berat (K >6 mEq/L) → aritmia fatal"],
    common: ["Hiperkalemia ringan-sedang", "Hiponatremia", "Ginekomastia (pria)", "Gangguan siklus menstruasi (wanita)", "Mual, kram perut", "Disfungsi ginjal"],
    antidote: "Hiperkalemia: Kalsium glukonat, insulin+dekstrosa, kayeksalat, HD/CRRT. Stop spironolakton segera."
  },
  interactions: {
    major: ["ACE inhibitor + ARB — triple whammy (ACEi + ARB + spironolakton) risiko hiperkalemia dan AKI sangat tinggi", "NSAID — mengurangi efek diuretik dan meningkatkan hiperkalemia", "Kalium suplemen — hiperkalemia aditif"],
    moderate: ["Digoksin — spironolakton dapat meningkatkan kadar digoksin", "Lithium — retensi Na terganggu → akumulasi Li"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "rales1999", note: "RALES Trial (NEJM 1999): Spironolakton 25 mg/hari menurunkan mortalitas 30% pada HFrEF berat" },
    { ref_id: "esc2021", note: "ESC 2021 HF: MRA direkomendasikan kuat (Class I) untuk HFrEF EF ≤35%" }
  ]
},

"manitol": {
  name: "Manitol",
  brand_id: ["Osmofundin", "Manitol 20%", "Manitol Generik"],
  brand_id_notes: "Tersedia sebagai larutan 20% di Indonesia; Osmofundin adalah brand umum",
  class: "Diuretik Osmotik / Agen Antiedema Serebral",
  subclass: "Osmotic Diuretic",
  category: ["neurologi", "diuretik", "antiedema", "kardiovaskular"],
  common_in_id: true,
  mechanism: "Meningkatkan osmolaritas plasma → menarik cairan dari jaringan otak (dan interstitial) ke intravaskular → menurunkan volume otak dan ICP. Efek diuretik: filtrasi bebas di glomerulus, tidak direabsorbsi → diuresis osmotik.",
  pkpd_type: "Bolus intermiten",
  pkpd_note: "Onset penurunan ICP: 15–30 menit. Durasi: 4–6 jam. Eliminasi: ginjal. Akumulasi terjadi pada AKI → memperburuk osmolal gap dan fungsi ginjal.",
  spectrum: {},
  indications: {
    icu_primary: ["Peningkatan tekanan intrakranial (TIK) akut — cedera kepala berat, stroke hemoragik, tumor", "Herniasi serebral (transtentorial) — terapi emergensi sambil menunggu tindakan definitif", "Edema serebral pada ensefalopati hepatik fulminan"],
    icu_secondary: ["Glaukoma akut sudut tertutup (penurunan TIO emergensi)", "Oliguria pada rhabdomiolisis (untuk mencegah gagal ginjal — kontroversi)", "Overdosis obat yang perlu force diuresis (data terbatas)"],
    local_guideline: "PERDOSSI 2019: Manitol untuk peningkatan TIK pada stroke hemoragik — 0.25–0.5 g/kg tiap 4–6 jam",
    intl_guideline: "Brain Trauma Foundation 2016: Manitol efektif untuk ICP bersama normal saline atau hipertonik salin"
  },
  contraindications: ["Anuria (AKI oliguria berat — manitol tidak dapat diekskresikan, akumulasi toksik)", "Dehidrasi / hipovolemia berat", "Gagal jantung kongestif berat (tidak toleran volume loading awal)", "Edema paru", "Osmolalitas serum >320 mOsm/kg"],
  precautions: ["Monitor osmolal gap (seharusnya <10) — stop jika >20 (akumulasi berbahaya)", "Ekspansi volume intravaskular awal sebelum diuresis → beri cairan tambahan", "Rebound ICP setelah beberapa hari penggunaan — pertimbangkan alternatif (hipertonik salin)", "Elektrolit: hipernatremia dan hipokalemia setelah diuresis masif"],
  dosing: {
    standard: "0.25–1 g/kg IV bolus selama 15–20 menit",
    range_low: "0.25 g/kg per dosis",
    range_high: "1.5 g/kg per dosis (emergensi hernisi)",
    max: "1.5 g/kg per dosis; interval minimum 4 jam",
    loading: "0.25–1 g/kg IV untuk ICP akut; atau 1–1.5 g/kg untuk herniasi",
    maintenance: "0.25–0.5 g/kg tiap 4–6 jam sesuai osmolalitas dan respons",
    route: ["IV bolus"],
    dilution: "Manitol 20% siap pakai (200 g/1000 mL). Hangatkan jika kristalisasi terlihat. Gunakan filter 5 mikron.",
    rate: "Berikan selama 15–20 menit untuk ICP akut; 30 menit untuk indikasi lain",
    titration: "Titrasi berdasarkan ICP monitor atau respons klinis. Stop jika osmolalitas >320 mOsm/kg atau osmolal gap >20.",
    special_notes: "Pasang kateter urin sebelum pemberian. Pantau osmolalitas serum tiap 4–6 jam. Jika tidak ada ICP monitor, titrasi berdasarkan klinis (GCS, pupil, posturing)."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Hati-hati — pantau osmolalitas dan diuresis ketat",
    r15_30: "Dosis rendah (0.25 g/kg); monitor ketat — risiko akumulasi",
    r_lt15: "Hindari jika mungkin. Gunakan hipertonik salin sebagai alternatif.",
    hd: "Terdialisis — berikan setelah HD; monitor ICP pasca-HD karena rebound",
    crrt: "Tidak efektif — klirens cepat oleh CRRT. Pertimbangkan bolus sebelum CRRT.",
    badge: "avoid",
    dialyzable: true,
    monitoring_renal: "Osmolalitas serum tiap 4–6 jam; urine output (foley wajib); kreatinin dan BUN"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal dengan monitor elektrolit ketat",
    child_c: "Hati-hati — pada gagal hati fulminan dengan ICP, gunakan dengan hati-hati; risiko overload volume",
    note: "Metabolisme minimal; eliminasi terutama renal."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali life-threatening",
    trimester_2: "Gunakan hanya jika emergensi maternal — risiko dehidrasi fetal",
    trimester_3: "Sama — risiko fetal",
    labor_delivery: "Hanya dalam emergensi absolut",
    fetal_risk: "Dehidrasi fetal, elektrolit imbalance",
    lactation: "Data tidak ada — hindari atau pause menyusui",
    lactation_note: "Data tidak ada"
  },
  monitoring: {
    efficacy: ["ICP (jika ICP monitor terpasang — target <20 mmHg)", "Respon klinis: GCS, reflek pupil, posturing", "Osmolalitas serum"],
    safety: ["Osmolalitas serum (stop jika >320 mOsm/kg)", "Osmolal gap (stop jika >20)", "Elektrolit (Na, K)", "Urine output (oliguria = stop)", "Kreatinin"],
    frequency: "Osmolalitas tiap 4–6 jam; elektrolit tiap 4–8 jam; urine output per jam",
    therapeutic_range: "Osmolalitas target: 300–320 mOsm/kg. ICP target <20 mmHg."
  },
  adverse_effects: {
    critical: ["Akumulasi toksik pada AKI oliguria → rebound edema otak dan gagal ginjal", "Hiperosmolalitas (>320 mOsm/kg)", "Ekspansi volume intravaskular → edema paru pada gagal jantung"],
    common: ["Hipernatremia", "Hipokalemia", "Poliuria masif", "Dehidrasi", "Rebound ICP setelah penghentian"],
    antidote: "Tidak ada antidot. Hentikan manitol, pertimbangkan dialisis jika akumulasi berat. Hipertonik salin sebagai alternatif."
  },
  interactions: {
    major: ["Litium — manitol meningkatkan ekskresi litium", "Aminoglikosida — ototoksisitas dan nefrotoksisitas aditif"],
    moderate: ["Digoksin — hipokalemia meningkatkan toksisitas digoksin", "Diuretik loop — potensiasi hipovolemia"]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: ["Diuretik Osmotik Kuat — risiko akumulasi fatal pada oliguria/anuria", "Kontraindikasi mutlak pada AKI oliguria", "Monitor osmolalitas serum wajib setiap 4–6 jam"],
  high_alert_protocol: "Pasang foley kateter sebelum pemberian. Monitor osmolalitas tiap dosis. Stop jika osmolalitas >320 atau diuresis berhenti.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "btf2016", note: "Brain Trauma Foundation 2016: Manitol 0.25–1 g/kg untuk TIK pada TBI" },
    { ref_id: "perdossi2019", note: "PERDOSSI 2019: Manitol untuk edema serebral pada stroke hemoragik" }
  ]
}

,

/* ============================================================
   FASE 4 — KORTIKOSTEROID
   ============================================================ */

"hidrokortison": {
  name: "Hidrokortison",
  brand_id: ["Solu-Cortef", "Hidrokortison Generik"],
  brand_id_notes: "Solu-Cortef (hidrokortison suksinat) tersedia di Indonesia; generik terbatas",
  class: "Kortikosteroid",
  subclass: "Glukokortikoid + Mineralokortikoid",
  category: ["kortikosteroid", "steroid", "anti-inflamasi", "syok-septik"],
  common_in_id: true,
  mechanism: "Agonis reseptor glukokortikoid → transkripsi gen anti-inflamasi (IL-10) dan represi gen pro-inflamasi (IL-1, TNF-α, NF-κB). Efek mineralokortikoid → retensi Na dan air. Pada syok septik refrakter: memulihkan sensitivitas vasopressor dan memperbaiki hemodinamik.",
  pkpd_type: "Bolus atau infusi kontinu",
  pkpd_note: "Onset IV: menit. Durasi biologis: 8–12 jam (setara potens 1:4 vs prednisolon). Metabolisme hepatik. Memiliki aktivitas mineralokortikoid yang signifikan (1:1 vs aldosteron).",
  spectrum: {},
  indications: {
    icu_primary: ["Syok septik refrakter (vasopressor-dependent setelah resusitasi adekuat)", "Krisis adrenal akut / insufisiensi adrenal primer", "Stress dosing perioperatif pada pasien kortikosteroid kronik"],
    icu_secondary: ["ARDS — evidence terbatas (tidak direkomendasikan rutin)", "Hipoglikemia neonatus (kondisi tertentu)", "Reaksi anafilaksis berat (bersama epinefrin)"],
    local_guideline: "PERDICI 2022: Hidrokortison 200 mg/hari IV untuk syok septik refrakter (MAP <65 meski vasopressor adekuat)",
    intl_guideline: "SSC 2021: Hidrokortison 200 mg/hari IV direkomendasikan jika vasopressor tidak cukup untuk MAP ≥65 mmHg"
  },
  contraindications: ["Infeksi sistemik tidak terkontrol tanpa antimikroba adekuat (relatif)", "Hipersensitivitas hidrokortison"],
  precautions: ["Hiperglikemia — monitor gula darah dan titrasi insulin jika perlu", "Infeksi oportunistik — monitor tanda infeksi baru", "Kelemahan otot (miopati steroid pada penggunaan lama)", "Jangan hentikan tiba-tiba setelah penggunaan >7 hari — tapering"],
  dosing: {
    standard: "200 mg/hari IV — bolus 50 mg tiap 6 jam, atau infusi kontinu 200 mg/24 jam",
    range_low: "100 mg/hari (stress dosing ringan)",
    range_high: "300 mg/hari (krisis adrenal akut)",
    max: "300 mg/hari untuk syok; tidak ada batas mutlak pada krisis adrenal",
    loading: "Krisis adrenal: 100 mg IV bolus segera",
    maintenance: "Infusi 200 mg/hari. Tapering setelah syok teratasi: 50 mg tiap 6 jam → 50 mg tiap 8 jam → 50 mg tiap 12 jam → stop.",
    route: ["IV bolus", "IV infusi kontinu"],
    dilution: "Infusi: 200 mg dalam 50–100 mL NaCl 0.9% atau D5%. Atau larutkan dalam 500 mL untuk 24 jam.",
    rate: "200 mg/24 jam = ~8.3 mg/jam. Sesuaikan konsentrasi larutan.",
    titration: "Tidak dititrasi untuk syok septik — dosis tetap 200 mg/hari. Tapering bertahap saat syok teratasi.",
    special_notes: "ADRENAL Trial (2018) dan APROCCHSS (2018): Infusi kontinu mungkin lebih stabil daripada bolus intermiten. Monitor glukosa darah tiap 4–6 jam selama terapi."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal",
    r15_30: "Dosis normal",
    r_lt15: "Dosis normal — metabolisme hepatik",
    hd: "Dosis normal; sebagian terdialisis — tidak perlu suplemen",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor glukosa darah dan elektrolit"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal dengan monitor ketat",
    child_c: "Hati-hati — metabolisme terganggu; monitor tanda toksisitas steroid",
    note: "Metabolisme hepatik; pada sirosis berat akumulasi mungkin terjadi."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Dapat digunakan pada kondisi life-threatening (krisis adrenal)",
    trimester_2: "Dapat digunakan",
    trimester_3: "Dapat digunakan — pemantauan glukosa maternal dan fetal",
    labor_delivery: "Stress dosing diperlukan pada ibu dengan insufisiensi adrenal",
    fetal_risk: "Risiko cleft palate pada hewan (trimester 1); data manusia terbatas",
    lactation: "Perhatian — diekskresikan ke ASI dalam jumlah kecil",
    lactation_note: "Dosis rendah umumnya aman saat menyusui"
  },
  monitoring: {
    efficacy: ["MAP dan kebutuhan vasopressor (target weaning norepinefrin)", "Tanda klinis resolusi syok"],
    safety: ["Glukosa darah tiap 4–6 jam (risiko hiperglikemia)", "Kalium serum (risiko hipokalemia — efek mineralokortikoid)", "Tekanan darah (hipertensi)", "Tanda infeksi baru"],
    frequency: "Glukosa tiap 4–6 jam; elektrolit tiap 12–24 jam",
    therapeutic_range: "Glukosa <180 mg/dL dengan insulin titrasi"
  },
  adverse_effects: {
    critical: ["Hiperglikemia berat", "Infeksi oportunistik (pada penggunaan lama/dosis tinggi)"],
    common: ["Hiperglikemia", "Hipokalemia", "Hipertensi", "Retensi natrium dan edema", "Miopati (penggunaan lama)", "GI: mual, perdarahan GI (bersama NSAID)"],
    antidote: "Tidak ada antidot. Insulinisasi untuk hiperglikemia. Tapering bertahap untuk menghindari insufisiensi adrenal."
  },
  interactions: {
    major: ["NSAID — risiko perdarahan GI aditif", "Vaksin hidup (kontraindikasi relatif saat imunosupresi)"],
    moderate: ["Insulin/antidiabetik — hiperglikemia antagonis efek", "Diuretik — hipokalemia aditif", "Warfarin — efek antikoagulan terganggu"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2021", note: "SSC 2021: Hidrokortison IV untuk syok septik refrakter — Class 2B (weak recommendation)" },
    { ref_id: "adrenal2018", note: "ADRENAL Trial (NEJM 2018): Hidrokortison kontinu vs placebo — tidak ada perbedaan mortalitas 90 hari, namun faster shock reversal" },
    { ref_id: "aprocchss2018", note: "APROCCHSS Trial (NEJM 2018): Hidrokortison + fludrokortison menurunkan mortalitas pada syok septik" }
  ]
},

"metilprednisolon": {
  name: "Metilprednisolon",
  brand_id: ["Solu-Medrol", "Methylprednisolone Generik", "Medixon"],
  brand_id_notes: "Solu-Medrol tersedia luas di Indonesia; generik juga tersedia",
  class: "Kortikosteroid",
  subclass: "Glukokortikoid Sintetis (Potensial Sedang)",
  category: ["kortikosteroid", "steroid", "anti-inflamasi", "imunosupresan"],
  common_in_id: true,
  mechanism: "Agonis reseptor glukokortikoid poten → represi kuat gen pro-inflamasi → penurunan sitokin (IL-1, IL-6, TNF-α), inhibisi fosfolipase A2 → anti-inflamasi dan imunosupresi. Potens 5× prednisolon; tidak ada aktivitas mineralokortikoid bermakna.",
  pkpd_type: "Bolus IV atau infusi",
  pkpd_note: "Onset IV: menit. Durasi biologis: 18–36 jam. T½ plasma: 3 jam (suksinat). Metabolisme hepatik. Tidak ada aktivitas mineralokortikoid (berbeda dari hidrokortison).",
  spectrum: {},
  indications: {
    icu_primary: ["Eksaserbasi asma akut berat / status asmatikus (IV saat tidak bisa oral)", "Eksaserbasi PPOK berat (IV saat tidak toleran oral)", "Reaksi anafilaksis berat (bersama epinefrin)"],
    icu_secondary: ["ARDS sedang-berat (evidence lemah — kontroversi, tidak direkomendasikan rutin)", "Edema serebral peritumor", "Krisis miastenia gravis", "Transplantasi: terapi penolakan akut"],
    local_guideline: "PDPI 2019: Metilprednisolon IV 62.5–125 mg tiap 6 jam untuk asma akut berat yang tidak respons bronkodilator",
    intl_guideline: "GINA 2023: Steroid sistemik (oral atau IV) kunci manajemen asma eksaserbasi berat"
  },
  contraindications: ["Infeksi sistemik tidak terkontrol (relatif)", "Hipersensitivitas metilprednisolon", "Vaksin hidup aktif saat imunosupresi"],
  precautions: ["Hiperglikemia — monitor gula darah", "Psikosis steroid pada dosis tinggi", "Perdarahan GI bersama NSAID/aspirin", "Tidak boleh hentikan tiba-tiba setelah penggunaan lama", "Pada COVID-19 ARDS: deksametason lebih direkomendasikan (RECOVERY trial)"],
  dosing: {
    standard: "Asma/PPOK eksaserbasi: 40–80 mg/hari IV. Anafilaksis: 125 mg IV bolus.",
    range_low: "40 mg/hari",
    range_high: "1 g/hari (pulse therapy untuk kondisi berat tertentu)",
    max: "1 g/hari (pulse therapy); tidak ada batas mutlak untuk kondisi life-threatening",
    loading: "Anafilaksis/asma berat: 125 mg IV bolus. Pulse therapy: 500–1000 mg IV/hari × 3 hari.",
    maintenance: "Asma: 0.5–1 mg/kg/hari dalam 1–2 dosis. Tapering setelah 5–7 hari ke oral.",
    route: ["IV bolus", "IV infusi", "IM", "PO"],
    dilution: "Encerkan dalam NaCl 0.9% atau D5%. Dosis kecil (<250 mg): bolus langsung. Dosis besar: encerkan dalam 50–100 mL.",
    rate: "Berikan lambat: dosis <250 mg selama 5 menit; dosis >250 mg selama 15–30 menit (aritmia jika terlalu cepat).",
    titration: "Tidak dititrasi. Dosis tetap sesuai indikasi. Tapering bertahap saat kondisi membaik.",
    special_notes: "Jangan campur dengan kalsium, heparin, atau 5-FU dalam syringe. Pulse therapy: berikan LAMBAT (>30 menit) — aritmia pernah dilaporkan pada infusi cepat."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal",
    r15_30: "Dosis normal",
    r_lt15: "Dosis normal — metabolisme hepatik",
    hd: "Dosis normal; tidak bermakna terdialisis",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor glukosa darah dan tekanan darah"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal dengan monitoring lebih ketat",
    child_c: "Hati-hati — akumulasi mungkin; monitor toksisitas steroid",
    note: "Metabolisme hepatik; pada sirosis berat dapat terjadi akumulasi."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali indikasi kuat (teratogenisitas pada hewan)",
    trimester_2: "Dapat digunakan untuk kondisi life-threatening",
    trimester_3: "Gunakan dengan indikasi jelas — pantau glukosa maternal",
    labor_delivery: "Stress dosing jika pasien mendapat steroid kronik",
    fetal_risk: "Supresi adrenal neonatus pada penggunaan dosis tinggi jangka panjang",
    lactation: "Perhatian — diekskresikan ke ASI",
    lactation_note: "Jika dosis tinggi: pause menyusui 4–6 jam setelah dosis"
  },
  monitoring: {
    efficacy: ["Fungsi paru: SpO2, FEV1 (jika bisa), wheeze", "Tanda klinis resolusi inflamasi"],
    safety: ["Glukosa darah tiap 4–6 jam", "Tekanan darah", "Tanda infeksi baru", "Gejala psikosis (dosis tinggi)"],
    frequency: "Glukosa tiap 4–6 jam; monitor klinis harian",
    therapeutic_range: "Glukosa <180 mg/dL"
  },
  adverse_effects: {
    critical: ["Hiperglikemia berat", "Psikosis steroid akut (dosis tinggi)", "Perforasi GI (bersama NSAID)", "Aritmia saat pulse therapy diberikan terlalu cepat"],
    common: ["Hiperglikemia", "Insomnia", "Kenaikan nafsu makan", "Wajah moonface (penggunaan lama)", "Miopati steroid", "Osteoporosis (penggunaan lama)"],
    antidote: "Tidak ada antidot. Tapering bertahap. Insulinisasi untuk hiperglikemia."
  },
  interactions: {
    major: ["NSAID — perdarahan GI aditif", "Vaksin hidup — kontraindikasi"],
    moderate: ["Insulin/antidiabetik — hiperglikemia antagonis", "Warfarin — efek antikoagulan terganggu", "Diuretik — hipokalemia aditif", "Siklosporin — inhibisi CYP3A4 mutual"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "gina2023", note: "GINA 2023: Kortikosteroid sistemik kunci dalam eksaserbasi asma berat" },
    { ref_id: "pdpi2019", note: "PDPI 2019: Metilprednisolon IV untuk asma akut berat tidak respons bronkodilator" }
  ]
},

"deksametason": {
  name: "Deksametason",
  brand_id: ["Decadron", "Dexamethasone Generik", "Kalmethasone"],
  brand_id_notes: "Generik tersedia sangat luas di Indonesia; Kalmethasone brand lokal umum",
  class: "Kortikosteroid",
  subclass: "Glukokortikoid Poten (Long-Acting)",
  category: ["kortikosteroid", "steroid", "anti-inflamasi", "neurologi", "covid-ards"],
  common_in_id: true,
  mechanism: "Glukokortikoid sintetis poten (25× prednisolon). Represi kuat NF-κB dan sitokin pro-inflamasi. Penetrasi SSP baik. Tidak ada aktivitas mineralokortikoid. Digunakan dalam COVID-19 ARDS berdasarkan RECOVERY Trial 2020.",
  pkpd_type: "Bolus IV atau PO",
  pkpd_note: "Onset IV: menit. Durasi biologis: 36–54 jam (long-acting). T½ plasma: 3–4 jam. Metabolisme hepatik. Penetrasi SSP: baik → efektif untuk edema serebral dan meningitis.",
  spectrum: {},
  indications: {
    icu_primary: ["COVID-19 ARDS dengan O2 dependency (RECOVERY Trial 2020)", "Edema serebral: peritumor, pasca-bedah, abses serebri", "Meningitis bakterial (4× sebelum atau saat antibiotik pertama)", "Pencegahan PONV (profilaksis mual pasca-operasi)"],
    icu_secondary: ["Eksaserbasi asma/PPOK (jika metilprednisolon tidak tersedia)", "Croup (laringotrakeobronkitis) pada anak", "Anti-emesis kemoterapi", "Hypercalcemia of malignancy"],
    local_guideline: "PDPI/PERKI/PERDOSSI 2020 (COVID-19): Deksametason 6 mg/hari × 10 hari untuk pasien dengan O2 supplemental atau ventilasi mekanik",
    intl_guideline: "WHO 2021: Deksametason 6 mg/hari × 10 hari — strong recommendation untuk COVID-19 berat/kritis. RECOVERY Trial: menurunkan mortalitas 28 hari secara signifikan."
  },
  contraindications: ["Infeksi sistemik tidak terkontrol tanpa antimikroba (relatif)", "Hipersensitivitas deksametason"],
  precautions: ["Hiperglikemia — monitor gula darah", "Pada COVID-19: hanya untuk pasien dengan O2 dependency — MERUGIKAN pada tanpa O2 supplemental", "Tidak ada aktivitas mineralokortikoid → tidak cocok untuk syok septik (hidrokortison lebih baik)", "Supresi aksis HPA pada penggunaan >2 minggu"],
  dosing: {
    standard: "COVID-19: 6 mg sekali sehari IV atau PO × 10 hari. Meningitis: 0.15 mg/kg IV tiap 6 jam × 4 hari.",
    range_low: "4 mg/hari",
    range_high: "24 mg/hari (edema serebral berat)",
    max: "24 mg/hari (edema serebral); tidak ada batas mutlak pada kondisi life-threatening",
    loading: "Edema serebral akut: 10 mg IV bolus segera, lanjut 4 mg tiap 6 jam",
    maintenance: "COVID-19: 6 mg/hari. Edema serebral: 4–8 mg tiap 6 jam, tapering setelah 48–72 jam.",
    route: ["IV bolus", "IM", "PO"],
    dilution: "Bolus IV langsung atau encerkan dalam 10–50 mL NaCl 0.9% / D5%",
    rate: "Berikan selama 3–5 menit IV",
    titration: "Tidak dititrasi — dosis tetap sesuai indikasi. Tapering pada penggunaan >7 hari.",
    special_notes: "RECOVERY Trial: deksametason menurunkan mortalitas 35% pada pasien COVID-19 ventilasi mekanik. TIDAK bermanfaat (mungkin merugikan) pada COVID-19 ringan tanpa O2 supplemental."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal",
    r15_30: "Dosis normal",
    r_lt15: "Dosis normal",
    hd: "Dosis normal; tidak bermakna terdialisis",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor glukosa darah dan tekanan darah"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal",
    child_c: "Hati-hati — akumulasi mungkin",
    note: "Metabolisme hepatik; pada gagal hati berat monitor toksisitas."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali life-threatening",
    trimester_2: "Dapat digunakan",
    trimester_3: "Digunakan untuk maturasi paru janin prematur (standar praktek: 24–34 minggu gestation)",
    labor_delivery: "Stress dosing jika pasien steroid kronik",
    fetal_risk: "Maturasi paru janin (positif pada prematur). Supresi adrenal neonatus pada dosis tinggi.",
    lactation: "Perhatian",
    lactation_note: "Diekskresikan ke ASI; dosis rendah umumnya aman"
  },
  monitoring: {
    efficacy: ["Kebutuhan O2 / SpO2 (COVID-19 ARDS)", "Tanda klinis perbaikan edema serebral (GCS, pupil)", "Marker inflamasi (CRP, ferritin, D-dimer pada COVID-19)"],
    safety: ["Glukosa darah tiap 4–6 jam", "Tekanan darah", "Tanda infeksi sekunder/oportunistik"],
    frequency: "Glukosa tiap 4–6 jam; klinis harian",
    therapeutic_range: "Glukosa <180 mg/dL"
  },
  adverse_effects: {
    critical: ["Hiperglikemia berat", "Infeksi oportunistik (pada penggunaan lama/dosis tinggi)", "Supresi adrenal pada penggunaan lama"],
    common: ["Hiperglikemia", "Insomnia", "Eforia atau labilitas mood", "Miopati steroid (penggunaan lama)", "Osteoporosis (penggunaan lama)"],
    antidote: "Tidak ada antidot. Insulinisasi untuk hiperglikemia. Tapering bertahap."
  },
  interactions: {
    major: ["Vaksin hidup — kontraindikasi", "NSAID — perdarahan GI"],
    moderate: ["Insulin/antidiabetik — hiperglikemia", "Warfarin — INR terganggu", "Fenitoin/rifampisin — percepatan metabolisme deksametason → efek berkurang"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "recovery2020", note: "RECOVERY Trial (NEJM 2020): Deksametason 6 mg/hari × 10 hari menurunkan mortalitas 28 hari signifikan pada COVID-19 dengan O2 atau ventilasi" },
    { ref_id: "who2021", note: "WHO 2021 COVID-19 Guidelines: Strong recommendation deksametason untuk COVID-19 berat/kritis" }
  ]
},

/* ============================================================
   FASE 4 — GASTROENTEROLOGI / GASTROPROTEKSI
   ============================================================ */

"pantoprazol": {
  name: "Pantoprazol",
  brand_id: ["Pantoprazole Generik", "Controloc", "Pantozol"],
  brand_id_notes: "Tersedia sangat luas di Indonesia; injeksi dan tablet tersedia",
  class: "Gastroproteksi",
  subclass: "Proton Pump Inhibitor (PPI)",
  category: ["gi", "GI", "gastroproteksi", "antiulkus"],
  common_in_id: true,
  mechanism: "Prodrug — diaktifkan di lingkungan asam lambung (kanalikuli sel parietal) → ikatan kovalen ireversibel dengan H+/K+-ATPase → inhibisi sekresi asam lambung secara maksimal.",
  pkpd_type: "Oral atau IV",
  pkpd_note: "Onset IV: 1 jam (penekanan asam bermakna). Durasi: 24–72 jam (ireversibel — bergantung sintesis pompa baru). Bioavailabilitas oral: ~77%. Metabolisme CYP2C19/3A4.",
  spectrum: {},
  indications: {
    icu_primary: ["Profilaksis ulkus stres pada pasien risiko tinggi ICU (ventilasi mekanik >48 jam, koagulopati)", "Perdarahan GI atas aktif (pre-endoskopi, stabilisasi)", "Esofagitis erosif / GERD berat"],
    icu_secondary: ["Pasien yang mendapat NSAID/aspirin/kortikosteroid dosis tinggi", "Sindrom Zollinger-Ellison"],
    local_guideline: "PAPDI 2019: PPI IV untuk perdarahan GI atas aktif; SUP pada pasien kritis risiko tinggi",
    intl_guideline: "ASHP 2022: SUP direkomendasikan hanya pada pasien kritis risiko tinggi (MV >48 jam atau koagulopati) — tidak untuk semua ICU"
  },
  contraindications: ["Hipersensitivitas pantoprazol atau PPI lain", "Kombinasi dengan atazanavir atau nelfinavir (penurunan kadar antiretroviral)"],
  precautions: ["Penggunaan jangka panjang: hipomagnesemia, fraktur tulang, infeksi Clostridium difficile", "Stop jika tidak ada indikasi — PPI over-prescribing umum di ICU", "Interaksi CYP2C19 dengan clopidogrel (minimalkan jika pasien menggunakan clopidogrel)"],
  dosing: {
    standard: "40 mg IV sekali sehari (profilaksis/maintenance) atau dua kali sehari (perdarahan aktif)",
    range_low: "20 mg/hari (dosis rendah)",
    range_high: "80 mg IV bolus lalu 8 mg/jam infusi (perdarahan variseal atau peptic ulcer berat)",
    max: "240 mg/hari untuk Zollinger-Ellison",
    loading: "Perdarahan GI atas berat: 80 mg IV bolus",
    maintenance: "Perdarahan: 8 mg/jam infusi kontinu × 72 jam. Profilaksis/maintenance: 40 mg sekali sehari.",
    route: ["IV bolus", "IV infusi kontinu", "PO"],
    dilution: "Bolus: larutkan 40 mg dalam 10 mL NaCl 0.9%. Infusi: 80–160 mg dalam 100 mL NaCl 0.9%.",
    rate: "Bolus 40 mg: berikan selama 2–15 menit. Infusi: 8 mg/jam = 10 mL/jam (8 mg/mL).",
    titration: "Tidak dititrasi. Dosis tetap sesuai indikasi.",
    special_notes: "De-eskalasi ke oral ketika pasien toleransi oral — bioavailabilitas setara. Stop saat keluar ICU jika tidak ada indikasi onkrak."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal",
    r15_30: "Dosis normal",
    r_lt15: "Dosis normal — eliminasi hepatik utama",
    hd: "Dosis normal; tidak bermakna terdialisis",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak perlu penyesuaian khusus"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Pertimbangkan dosis lebih rendah (20 mg/hari)",
    child_c: "Maksimal 20 mg/hari — metabolisme sangat terganggu",
    note: "Metabolisme hepatik CYP2C19/3A4; sirosis berat meningkatkan AUC secara signifikan."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Relatif aman — data manusia tidak menunjukkan risiko bermakna",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Dapat digunakan",
    fetal_risk: "Data manusia tidak menunjukkan peningkatan risiko malformasi",
    lactation: "Perhatian — diekskresikan ke ASI dalam jumlah kecil",
    lactation_note: "Umumnya dianggap aman saat menyusui"
  },
  monitoring: {
    efficacy: ["Tanda perdarahan GI (hematesis, melena, drop Hb)", "pH nasogastric jika diukur (target >6 untuk SUP)"],
    safety: ["Magnesium serum (penggunaan >7 hari)", "Tanda infeksi C. difficile (diare)", "Tanda pneumonia aspirasi (perubahan pH lambung)"],
    frequency: "Klinis harian; Mg jika penggunaan >7 hari",
    therapeutic_range: "pH lambung >4 untuk SUP; >6 untuk hemostasis aktif"
  },
  adverse_effects: {
    critical: ["Hipomagnesemia berat (penggunaan lama) → tetani, aritmia"],
    common: ["Sakit kepala", "Diare", "Mual", "Hipomagnesemia (kronik)", "Infeksi C. difficile (risiko meningkat)", "Peningkatan risiko fraktur (kronik)"],
    antidote: "Tidak ada antidot. Stop PPI dan suplementasi magnesium jika hipomagnesemia."
  },
  interactions: {
    major: ["Atazanavir/nelfinavir — penurunan absorbsi dramatis → virological failure"],
    moderate: ["Clopidogrel — CYP2C19 inhibisi → penurunan efek antiplatelet (gunakan PPI lain atau ranitidine)", "Metotreksat — PPI menghambat ekskresi tubular metotreksat → toksisitas", "Warfarin — CYP2C19 inhibisi potensial → monitor INR"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ashp2022", note: "ASHP 2022 SUP Guidelines: PPI hanya untuk pasien kritis risiko tinggi MV >48 jam atau koagulopati" },
    { ref_id: "papdi2019", note: "PAPDI 2019: PPI IV untuk perdarahan GI atas dan SUP kritis" }
  ]
},

"sukralfat": {
  name: "Sukralfat",
  brand_id: ["Ulsidex", "Inpepsa", "Sukralfat Generik"],
  brand_id_notes: "Tersedia luas di Indonesia; suspensi oral dan tablet",
  class: "Gastroproteksi",
  subclass: "Cytoprotective Agent",
  category: ["gi", "GI", "gastroproteksi", "antiulkus"],
  common_in_id: true,
  mechanism: "Garam aluminium sukrosa — di pH asam lambung terurai menjadi polimer anionik yang berikatan dengan protein eksudat tukak → membentuk lapisan pelindung lokal di permukaan tukak. Tidak mempengaruhi pH lambung (tidak menaikkan pH).",
  pkpd_type: "Oral / NGT",
  pkpd_note: "Aksi lokal (tidak diabsorpsi signifikan). Onset: 1–2 jam. Mempertahankan pH lambung normal — kelebihan vs PPI: tidak meningkatkan pH → mungkin risiko pneumonia aspirasi lebih rendah.",
  spectrum: {},
  indications: {
    icu_primary: ["Profilaksis ulkus stres pada pasien ICU (alternatif PPI — bukti setara, VAP lebih rendah)", "Tukak peptic (duodenum/lambung) — terapi adjuvan"],
    icu_secondary: ["Esofagitis radiasi", "Mukositis oral (suction/bilas)"],
    local_guideline: "PAPDI 2019: Sukralfat sebagai alternatif PPI untuk SUP — khususnya pada pasien yang tidak berisiko tinggi VAP",
    intl_guideline: "ASHP 2022: Sukralfat vs PPI untuk SUP — PPI sedikit lebih efektif, namun sukralfat memiliki risiko VAP lebih rendah (debat berkelanjutan)"
  },
  contraindications: ["Disfagia berat (tidak bisa menelan suspensi)", "Hipersensitivitas sukralfat"],
  precautions: ["Aluminium: akumulasi pada gagal ginjal berat → toksisitas aluminium (ensefalopati, osteodistrofi)", "Tidak efektif jika pH lambung sudah tinggi (antasid bersamaan mengurangi efektivitas)", "Berikan 1 jam sebelum makan atau 2 jam setelah makan untuk efek maksimal", "Dapat mengurangi absorpsi obat lain — berikan minimal 2 jam terpisah"],
  dosing: {
    standard: "1 gram (10 mL suspensi) 4× sehari (tiap 6 jam) melalui NGT atau oral",
    range_low: "1 g tiap 12 jam",
    range_high: "1 g tiap 4 jam (6 kali sehari)",
    max: "8 g/hari",
    loading: null,
    maintenance: "1 g tiap 6 jam via NGT — berikan saat lambung kosong jika memungkinkan",
    route: ["PO", "NGT"],
    dilution: "Suspensi 1 g/5 mL — berikan langsung atau encerkan dengan sedikit air untuk NGT",
    rate: null,
    titration: null,
    special_notes: "Berikan obat lain 2 jam sebelum sukralfat (mengurangi absorpsi fluorokuinolon, fenitoin, digoksin). Kocok suspensi sebelum digunakan."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Hati-hati — sebagian kecil aluminium diabsorpsi",
    r15_30: "Pertimbangkan penggunaan alternatif (PPI) — risiko akumulasi aluminium",
    r_lt15: "Hindari — akumulasi aluminium → toksisitas (ensefalopati, osteodistrofi)",
    hd: "Hindari — aluminium tidak terdialisis dengan baik, akumulasi",
    crrt: "Hindari — data terbatas, risiko akumulasi aluminium",
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Monitor tanda toksisitas aluminium pada gagal ginjal: tremor, konfusi, kejang"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal",
    child_c: "Dosis normal — aksi lokal, absorpsi minimal",
    note: "Tidak ada penyesuaian hepatik yang diperlukan."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Relatif aman — absorpsi sistemik minimal",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Dapat digunakan",
    fetal_risk: "Absorpsi sistemik minimal — risiko fetal sangat rendah",
    lactation: "Aman",
    lactation_note: "Absorpsi minimal — tidak ada risiko bermakna pada bayi"
  },
  monitoring: {
    efficacy: ["Tanda perdarahan GI", "Toleransi enteral (distensi lambung)"],
    safety: ["Pada AKI/CKD: tanda toksisitas aluminium (konfusi, tremor)", "Absorpsi obat bersamaan (fenitoin, fluorokuinolon — cek level)"],
    frequency: "Klinis harian",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Toksisitas aluminium pada gagal ginjal berat — ensefalopati, osteodistrofi (jarang pada penggunaan akut ICU)"],
    common: ["Konstipasi (efek aluminium)", "Mual", "Bezoar pada dosis tinggi", "Mulut kering", "Mengurangi absorpsi obat lain"],
    antidote: "Toksisitas aluminium: Deferoksamin (chelation therapy). Hentikan sukralfat."
  },
  interactions: {
    major: ["Fenitoin — sukralfat mengurangi absorpsi fenitoin >50% → sub-terapeutik"],
    moderate: ["Fluorokuinolon (siprofloksasin, levofloksasin) — berikan 2 jam sebelum sukralfat", "Digoksin, warfarin, teofilin — absorpsi terganggu; berikan terpisah 2 jam"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ashp2022", note: "ASHP 2022: Sukralfat vs PPI untuk SUP — setara efektivitas, profil VAP sukralfat lebih baik" },
    { ref_id: "cook1998", note: "Cook et al. NEJM 1998: Sukralfat vs ranitidine untuk SUP — ranitidine lebih efektif cegah perdarahan bermakna" }
  ]
},

"metoklopramid": {
  name: "Metoklopramid",
  brand_id: ["Primperan", "Metoclopramide Generik", "Vometa"],
  brand_id_notes: "Tersedia luas di Indonesia; injeksi dan tablet tersedia",
  class: "Prokinetik / Antiemetik",
  subclass: "Dopamine D2 Antagonist",
  category: ["gi", "GI", "prokinetik", "antiemetik"],
  common_in_id: true,
  mechanism: "Blokade reseptor dopamin D2 sentral dan perifer → prokinetik (motilitas GI meningkat, lower esophageal sphincter tonus naik) + antiemetik (blokade chemoreceptor trigger zone). Dosis tinggi juga memblokade reseptor 5-HT3 dan 5-HT4.",
  pkpd_type: "Bolus atau infusi",
  pkpd_note: "Onset IV: 1–3 menit. Durasi: 1–2 jam. Eliminasi: ginjal (~85% utuh). Pada gagal ginjal: akumulasi → efek samping neurologis.",
  spectrum: {},
  indications: {
    icu_primary: ["Gastroparesis dan intoleransi enteral pada pasien ICU ventilasi mekanik", "Mual/muntah pasca-operasi (PONV)", "Fasilitasi penempatan post-pyloric feeding tube"],
    icu_secondary: ["Refluks gastroesofageal", "Pencegahan aspirasi sebelum intubasi (rapid sequence intubation — data lemah)"],
    local_guideline: "PERDICI 2022: Prokinetik (metoklopramid atau eritromisin) untuk intoleransi enteral pada pasien ICU",
    intl_guideline: "SCCM/ASPEN 2022: Prokinetik direkomendasikan untuk intoleransi enteral pada MV patients dengan GRV tinggi"
  },
  contraindications: ["Obstruksi mekanik GI", "Perdarahan GI aktif", "Pheochromocytoma (krisis hipertensi)", "Epilepsi tidak terkontrol (ambang kejang turun)", "Tardive dyskinesia dari metoklopramid sebelumnya"],
  precautions: ["Efek ekstrapiramidal — terutama pada dosis tinggi, lansia, atau gagal ginjal", "Gunakan maksimal 5 hari berturut-turut (risiko tardive dyskinesia meningkat setelah 12 minggu)", "Hindari kombinasi dengan antipsikotik tipikal (aditif EPS)", "Parkinson disease — perburukan (blokade dopamin)"],
  dosing: {
    standard: "10 mg IV tiap 6–8 jam; atau 10 mg oral/NGT tiap 6–8 jam",
    range_low: "5 mg per dosis",
    range_high: "10 mg per dosis (20 mg jika pasien >60 kg dan tidak ada risiko EPS)",
    max: "30–40 mg/hari",
    loading: null,
    maintenance: "10 mg tiap 6–8 jam; evaluasi setiap 48–72 jam — stop jika sudah toleransi enteral",
    route: ["IV bolus", "IM", "PO", "NGT"],
    dilution: "IV: berikan langsung (10 mg/2 mL); atau encerkan dalam 50 mL untuk infusi 15 menit",
    rate: "Berikan IV selama 3–5 menit (bolus lambat mengurangi efek akut kecemasan/restlessness)",
    titration: null,
    special_notes: "Stop segera jika muncul tanda distonia atau restlessness akut (akathisia). Durasi total ≤5 hari untuk prokinetik ICU. Eritromisin 250 mg IV merupakan alternatif prokinetik yang lebih poten."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Kurangi dosis 50% (5 mg tiap 6–8 jam)",
    r15_30: "Kurangi dosis 75% (5 mg tiap 12 jam) atau hindari",
    r_lt15: "Hindari — akumulasi signifikan → efek samping neurologis",
    hd: "Terdialisis sebagian — berikan pasca-HD. Dosis sangat rendah.",
    crrt: "Dosis rendah (5 mg tiap 12 jam) dengan monitoring ketat",
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Monitor efek ekstrapiramidal (distonia, akathisia) — lebih sering pada gagal ginjal"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Pertimbangkan dosis lebih rendah",
    child_c: "Hati-hati — metabolisme terganggu; mulai dosis rendah",
    note: "Metabolisme hepatik parsial; pada sirosis berat akumulasi dapat terjadi."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Relatif aman berdasarkan data yang ada",
    trimester_2: "Aman",
    trimester_3: "Hati-hati — risiko efek ekstrapiramidal neonatus jika dosis tinggi dekat persalinan",
    labor_delivery: "Hati-hati — dapat menyebabkan distonia atau sedasi neonatus",
    fetal_risk: "Efek ekstrapiramidal neonatus pada penggunaan dosis tinggi",
    lactation: "Digunakan untuk augmentasi ASI — tetapi tidak direkomendasikan sebagai indikasi utama; monitor bayi",
    lactation_note: "Diekskresikan ke ASI; dosis rendah umumnya aman saat menyusui"
  },
  monitoring: {
    efficacy: ["Gastric residual volume (GRV) tiap 4–6 jam", "Toleransi enteral (volume tercapai)"],
    safety: ["Efek ekstrapiramidal: distonia, akathisia, tardive dyskinesia", "Sedasi berlebihan"],
    frequency: "GRV tiap 4–6 jam; evaluasi EPS tiap hari",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Tardive dyskinesia (ireversibel pada penggunaan lama)", "Distonia akut berat", "Neuroleptic malignant syndrome (jarang)"],
    common: ["Restlessness / akathisia akut", "Distonia akut (khususnya torticollis)", "Mengantuk", "Diare", "Galaktore (efek antiprolaktin)"],
    antidote: "Distonia akut: Difenhidramin 25–50 mg IV atau benztropin 1–2 mg IV. Stop metoklopramid."
  },
  interactions: {
    major: ["Antipsikotik tipikal (haloperidol, klorpromazin) — EPS aditif"],
    moderate: ["Opioid — antagonisme efek prokinetik", "Siklosporin — metoklopramid meningkatkan absorpsi siklosporin", "Digoksin — absorpsi terganggu (berikan terpisah 2 jam)"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "sccmaspen2022", note: "SCCM/ASPEN 2022 Nutrition Guidelines: Prokinetik untuk intoleransi enteral pada MV" },
    { ref_id: "perdici2022", note: "PERDICI 2022: Metoklopramid atau eritromisin untuk gastroparesis ICU" }
  ]
},

"ondansetron": {
  name: "Ondansetron",
  brand_id: ["Zofran", "Ondansetron Generik", "Vomceran"],
  brand_id_notes: "Tersedia sangat luas di Indonesia; injeksi dan tablet tersedia",
  class: "Antiemetik",
  subclass: "5-HT3 Receptor Antagonist",
  category: ["antiemetik", "gi", "GI"],
  common_in_id: true,
  mechanism: "Blokade selektif reseptor 5-HT3 (serotonin) perifer (aferen vagus GI) dan sentral (area postrema / chemoreceptor trigger zone) → inhibisi mual dan muntah. Tidak mempengaruhi motilitas GI secara bermakna (berbeda dari metoklopramid).",
  pkpd_type: "Bolus IV atau oral",
  pkpd_note: "Onset IV: 30 menit. Durasi: 8–12 jam. Metabolisme hepatik CYP3A4/1A2. T½: 3–6 jam. Bioavailabilitas oral: ~60%.",
  spectrum: {},
  indications: {
    icu_primary: ["Mual/muntah pasca-operasi (PONV) — profilaksis dan terapi", "Mual/muntah akibat opioid pada pasien ICU", "Mual selama prosedur invasif (endoskopi, tindakan)"],
    icu_secondary: ["Mual akibat kemoterapi (CINV)", "Mual/muntah akibat radiasi", "Gastroenteritis akut (off-label)"],
    local_guideline: "PAPDI 2019: Ondansetron antiemetik lini pertama untuk mual/muntah pasca-operasi dan mual terkait opioid",
    intl_guideline: "ASHP/SCCM: 5-HT3 antagonis direkomendasikan untuk PONV dan mual terkait opioid di ICU"
  },
  contraindications: ["Hipersensitivitas ondansetron", "Sindrom QT panjang (QTc >500 ms) — risiko aritmia", "Kombinasi dengan apomorphine (vasodepressor berat)"],
  precautions: ["Pemanjangan QTc — monitor EKG pada pasien dengan risiko QT (hipokalemia, hipomagnesemia, obat QT prolonging lain)", "Obstruksi usus — mual bisa tersembunyi; pastikan tidak ada ileus berat", "Pasca-kolesistektomi — dapat menimbulkan spasme sfingter Oddi (jarang)", "Sakit kepala adalah efek samping paling sering"],
  dosing: {
    standard: "4–8 mg IV tiap 8–12 jam; atau 4 mg oral/NGT tiap 8 jam",
    range_low: "4 mg per dosis",
    range_high: "8 mg per dosis",
    max: "32 mg/hari (infus CINV); 24 mg/hari untuk PONV",
    loading: null,
    maintenance: "4–8 mg tiap 8–12 jam sesuai kebutuhan. Kurangi frekuensi atau hentikan saat mual teratasi.",
    route: ["IV bolus", "IM", "PO", "NGT", "Sublingual (ODT)"],
    dilution: "IV: bolus langsung 4–8 mg dalam 2–4 mL; atau encerkan dalam 50 mL NaCl 0.9% untuk infusi 15 menit",
    rate: "IV bolus: berikan perlahan selama 2–5 menit (tidak bolus cepat — aritmia)",
    titration: null,
    special_notes: "Tidak boleh diberikan IV bolus cepat (<30 detik) — dapat menyebabkan QT prolongation dan aritmia. Selalu berikan perlahan atau infusi 15 menit."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal",
    r15_30: "Dosis normal — metabolisme hepatik utama",
    r_lt15: "Dosis normal; pertimbangkan 8 mg/hari pada dialisis",
    hd: "Tidak bermakna terdialisis — dosis normal",
    crrt: "Dosis normal",
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor QTc — hipokalemia/hipomagnesemia pada AKI meningkatkan risiko QT"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Maksimal 8 mg/hari — metabolisme terganggu",
    child_c: "Maksimal 8 mg/hari — risiko akumulasi tinggi",
    note: "Metabolisme CYP3A4/1A2 hepatik; sirosis berat meningkatkan AUC 2–3×."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Relatif aman — data tidak menunjukkan teratogenisitas bermakna",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Dapat digunakan untuk PONV pasca-seksio sesarea",
    fetal_risk: "Tidak ada risiko bermakna berdasarkan data yang ada",
    lactation: "Perhatian",
    lactation_note: "Diekskresikan ke ASI — monitor bayi untuk tanda sedasi atau distres GI"
  },
  monitoring: {
    efficacy: ["Skor mual (NRS) — target mual ringan atau tidak ada", "Frekuensi muntah"],
    safety: ["QTc interval (dasar dan monitor jika risiko) — stop jika QTc >500 ms atau meningkat >60 ms", "Elektrolit (K, Mg) — hipokalemia/hipomagnesemia meningkatkan risiko QT"],
    frequency: "Klinis tiap shift; EKG baseline jika pasien risiko QT",
    therapeutic_range: "QTc <500 ms"
  },
  adverse_effects: {
    critical: ["QT prolongation dan aritmia ventricular (terutama IV bolus cepat atau dosis tinggi)"],
    common: ["Sakit kepala (paling sering)", "Konstipasi", "Flushing", "Sedikit peningkatan aminotransferase (sementara)"],
    antidote: "Tidak ada antidot. Hentikan ondansetron. QT prolonged: koreksi elektrolit, kardioversi jika Torsades de Pointes."
  },
  interactions: {
    major: ["Apomorphine — sinkop berat", "Obat QT prolonging (amiodaron, eritromisin, haloperidol, sotalol) — QT prolongation aditif"],
    moderate: ["Tramadol — ondansetron dapat mengurangi efek analgetik tramadol (blokade 5-HT3)", "Fenitoin/karbamazepin — menginduksi CYP3A4 → menurunkan kadar ondansetron"]
  },
  stewardship: null,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ashp2022", note: "ASHP/SCCM: 5-HT3 antagonis untuk PONV dan mual terkait opioid di ICU" },
    { ref_id: "papdi2019", note: "PAPDI 2019: Ondansetron antiemetik lini pertama untuk mual/muntah pascaoperasi" }
  ]
},

"nac_iv": {
  name: "N-Acetylcysteine (NAC) IV",
  brand_id: ["Fluimucil IV", "Acetylcysteine Injeksi", "Parvolex"],
  brand_id_notes: "Fluimucil tersedia di Indonesia (IV dan oral); Parvolex untuk kedaruratan paracetamol",
  class: "Antidot / Hepatoprotektif",
  subclass: "Thiol-donating Antioxidant",
  category: ["antidot", "hepatoprotektif", "gi", "GI"],
  common_in_id: true,
  mechanism: "Prekursor glutathione — mengisi cadangan glutathione hepatik yang habis akibat metabolit toksik paracetamol (NAPQI) → mencegah nekrosis hepatosit. Juga: antiinflamasi, antioksidan, meningkatkan suplai oksigen jaringan. Pada hepatitis fulminan non-paracetamol: mekanisme sitoprotektif independen.",
  pkpd_type: "Infusi bertahap (protokol 3-bag)",
  pkpd_note: "Onset: bekerja optimal jika diberikan dalam 8 jam setelah konsumsi paracetamol. Efektivitas menurun tetapi tetap bermakna hingga 24 jam (atau lebih pada overdosis masif). T½ plasma: 2–6 jam.",
  spectrum: {},
  indications: {
    icu_primary: ["Overdosis/toksisitas paracetamol (acetaminophen) — indikasi utama dan terkuat", "Hepatitis fulminan non-paracetamol sebagai adjuvan (off-label — data mendukung)"],
    icu_secondary: ["Pencegahan nefropati kontras (contrast-induced AKI) — evidence debatable, bukan standar", "ARDS adjuvan (antioksidan) — belum cukup evidence untuk rekomendasi rutin"],
    local_guideline: "PAPDI/IDAI 2020: NAC IV protokol 3-bag untuk toksisitas paracetamol — berikan segera tanpa menunggu kadar paracetamol",
    intl_guideline: "Rumack-Matthew nomogram + NAC IV (MHRA, FDA): dosis berdasarkan kadar paracetamol dan waktu sejak ingesti. Mulai NAC jika di atas garis toksik."
  },
  contraindications: ["Hipersensitivitas N-acetylcysteine (anaphylactoid reactions dapat terjadi — bukan kontraindikasi mutlak; manajemen dengan antihistamin dan perlambatan infusi)"],
  precautions: ["Reaksi anaphylactoid (bukan IgE-mediated) — terutama saat loading dose cepat. Perlambat infusi dan berikan antihistamin jika terjadi.", "Asma bronkial — risiko bronkospasme lebih tinggi saat infusi NAC", "Monitor glukosa (paracetamol overdosis dapat menyebabkan hipoglikemia)", "Pada kehamilan: berikan — overdosis paracetamol LEBIH berbahaya dari NAC"],
  dosing: {
    standard: "Protokol 3-bag (21 jam total): Loading 150 mg/kg dalam 200 mL D5% × 1 jam, lalu 50 mg/kg dalam 500 mL D5% × 4 jam, lalu 100 mg/kg dalam 1000 mL D5% × 16 jam",
    range_low: "Protokol 3-bag standar",
    range_high: "Dosis diperpanjang jika INR belum membaik atau AST/ALT masih naik",
    max: "Tidak ada batas absolut jika indikasi kuat",
    loading: "150 mg/kg IV dalam 200 mL D5% selama 1 jam (atau 60 menit)",
    maintenance: "50 mg/kg × 4 jam lalu 100 mg/kg × 16 jam. Lanjutkan 100 mg/kg/16 jam jika INR >2 atau transaminase masih tinggi.",
    route: ["IV infusi"],
    dilution: "Larutkan dalam D5% (bukan NaCl — dapat terjadi kristalisasi). Bag 1: 150 mg/kg + 200 mL D5%. Bag 2: 50 mg/kg + 500 mL D5%. Bag 3: 100 mg/kg + 1000 mL D5%.",
    rate: "Bag 1: 200 mL/jam (1 jam). Bag 2: 125 mL/jam (4 jam). Bag 3: 62.5 mL/jam (16 jam). Sesuaikan volume per berat badan.",
    titration: "Jika reaksi anaphylactoid: stop 15 menit, berikan difenhidramin 25 mg IV, ulangi dengan kecepatan lebih lambat (1/2 kecepatan).",
    special_notes: "Protokol 3-bag 21 jam adalah standar. Beberapa center menggunakan protokol 2-bag (12 jam) — efikasi serupa. Jangan campur dengan ampisilin atau ampisilin-sulbaktam (inkompatibel)."
  },
  renal_adjustment: {
    ge60: "Dosis normal",
    r30_60: "Dosis normal",
    r15_30: "Dosis normal — manfaat mencegah hepatotoksisitas melebihi risiko",
    r_lt15: "Dosis normal — manfaat tetap",
    hd: "Terdialisis — berikan dosis tambahan pasca-HD jika paracetamol overdosis",
    crrt: "Dosis normal — pertimbangkan suplementasi pasca-CRRT",
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Monitor kreatinin dan urine output — overdosis paracetamol sendiri dapat menyebabkan AKI"
  },
  hepatic_adjustment: {
    child_a: "Dosis normal",
    child_b: "Dosis normal — justru sangat diperlukan untuk hepatoproteksi",
    child_c: "Dosis normal — fungsi hati sudah terganggu, NAC untuk mencegah perburukan lebih lanjut",
    note: "Tidak ada penyesuaian hepatik; NAC diberikan karena gagal hati, bukan meski gagal hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "BERIKAN — overdosis paracetamol pada kehamilan sangat berbahaya (kematian janin)",
    trimester_2: "BERIKAN",
    trimester_3: "BERIKAN — manfaat jauh melebihi risiko",
    labor_delivery: "BERIKAN jika indikasi",
    fetal_risk: "NAC melintasi plasenta — melindungi janin dari hepatotoksisitas NAPQI",
    lactation: "BERIKAN jika indikasi — manfaat jauh melebihi risiko",
    lactation_note: "Berikan — tidak ada risiko bermakna pada bayi menyusui"
  },
  monitoring: {
    efficacy: ["AST, ALT tiap 4–8 jam (target penurunan atau tidak naik)", "INR (koagulopati hepatik)", "Bilirubin total", "Kreatinin dan glukosa darah", "Kadar paracetamol serum (jika tersedia)"],
    safety: ["Tanda reaksi anaphylactoid (flushing, urtikaria, bronkospasme)", "Elektrolit (infusi volume besar D5%)"],
    frequency: "LFT dan INR tiap 4–8 jam selama 21 jam pertama; evaluasi lanjut jika perlu",
    therapeutic_range: "AST/ALT turun mendekati normal; INR <2 dalam 24–48 jam pada toksisitas non-masif"
  },
  adverse_effects: {
    critical: ["Reaksi anaphylactoid — flushing, urtikaria, bronkospasme, hipotensi (terutama saat loading dose cepat)", "Hipoglikemia (overdosis paracetamol sendiri, bukan akibat NAC)"],
    common: ["Mual/muntah (terutama saat loading)", "Flushing", "Gatal-gatal", "Bronkospasme ringan pada asma"],
    antidote: "Reaksi anaphylactoid: perlambat infusi, difenhidramin 25–50 mg IV, hidrokortison 100 mg IV jika berat."
  },
  interactions: {
    major: ["Ampisilin/ampisilin-sulbaktam — inkompatibel secara fisik; jangan campur dalam syringe/line yang sama"],
    moderate: ["Nitrogliserin — NAC dapat meningkatkan efek vasodilatasi nitrogliserin (klinis tidak bermakna biasanya)", "Karbon aktif — mengurangi absorpsi NAC oral (tidak relevan untuk IV)"]
  },
  stewardship: null,
  high_alert: true,
  high_alert_warnings: ["Risiko Reaksi Anaphylactoid — terutama saat loading dose. Siapkan antihistamin dan epinefrin.", "Protokol 3-bag harus diikuti dengan ketat — dosis dan kecepatan sangat penting"],
  high_alert_protocol: "Mulai loading dose di bawah pengawasan langsung. Siapkan difenhidramin 25 mg IV dan epinefrin 1:1000. Monitor SpO2 dan BP selama loading.",
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "rumackmatthew", note: "Rumack-Matthew Nomogram: Dasar keputusan terapi NAC pada overdosis paracetamol berdasarkan kadar dan waktu" },
    { ref_id: "papdi2020", note: "PAPDI/IDAI 2020: NAC IV protokol 3-bag untuk toksisitas paracetamol" },
    { ref_id: "lee2009", note: "Lee et al. 2009 (N Engl J Med): NAC untuk hepatitis fulminan non-paracetamol — peningkatan transplant-free survival pada stadium awal" }
  ]
},

"atrakurium": {
  name: "Atrakurium",
  brand_id: ["Tracrium", "Atracurium Hameln", "Atracurium Fresenius"],
  brand_id_notes: "Tersedia di ICU Indonesia. Ampul 25 mg/2.5 mL dan 50 mg/5 mL.",
  class: "Pelumpuh otot non-depolarisasi",
  subclass: "Benzylisoquinolinium NMB",
  category: ["nmb", "high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia luas di ICU Indonesia — alternatif cisatracurium",
  mechanism: "Blokade kompetitif reseptor asetilkolin nikotinik pada neuromuscular junction → paralisis flaksid. Tidak tergantung metabolisme hati/ginjal: dieliminasi via degradasi Hofmann (spontan, pH/suhu-dependen) dan hidrolisis ester plasma. Menghasilkan metabolit laudanosine yang bisa prokonvulsan pada akumulasi tinggi (ICU panjang).",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Fasilitasi intubasi trakea (RSI jika suksinilkolin kontraindikasi)", "Paralisis terkontrol pada ARDS berat (P/F <150, dyssinkroni ventilator)", "Status asmatikus refrakter — mengurangi peak airway pressure", "Hipotermia terapeutik — mencegah shivering"],
    icu_secondary: ["Tetanus berat — kontrol spasme refrakter", "Elevasi TIK refrakter dengan agitasi"],
    local_guideline: "PERDICI: Atrakurium tersedia luas di Indonesia sebagai alternatif cisatracurium. Monitor TOF wajib saat infus kontinu.",
    intl_guideline: "ACURASYS 2010 / ROSE 2019: Cisatracurium lebih disukai pada ARDS berat (studi besar). Atrakurium: alternatif yang valid terutama pada gagal ginjal dan hati karena eliminasi Hofmann."
  },
  contraindications: ["Hipersensitivitas atrakurium atau benzylisoquinolinium"],
  precautions: ["Tidak memiliki efek analgesik/sedatif — HARUS diberikan bersama sedasi dan analgesia adekuat", "Histamine release — dapat menyebabkan hipotensi/bronkospasme (lebih sering dari cisatracurium)", "Akumulasi laudanosine pada infus lama — potensi neurotoksik pada gagal ginjal/hati berat", "Monitor TOF (train-of-four) setiap 4–6 jam — target 1–2 twitches", "Hindari NMB berkepanjangan tanpa indikasi kuat — ICU-acquired weakness"],
  dosing: {
    standard: "Intubasi: 0.4–0.5 mg/kg IV bolus. Infus kontinu: 5–10 mcg/kg/min.",
    range_low: "0.3–0.4 mg/kg (intubasi elektif)",
    range_high: "0.5–0.6 mg/kg (RSI, kesulitan jalan napas)",
    max: "Infus: hingga 15 mcg/kg/min (titrasi ke TOF)",
    loading: "0.4–0.5 mg/kg IV bolus selama 10–15 detik",
    maintenance: "Infus 5–10 mcg/kg/min. Titrasi agar TOF 1–2/4. Evaluasi daily untuk kebutuhan lanjut.",
    route: ["IV"],
    dilution: "50 mg dalam 50 mL NS/D5W → 1 mg/mL. Atau 250 mg dalam 250 mL → 1 mg/mL. Jangan campur dengan thiopental atau obat alkalis.",
    special_populations: {
      renal: "Aman — eliminasi Hofmann tidak bergantung fungsi ginjal. Akumulasi laudanosine pada GFR sangat rendah — monitor neurologis.",
      hepatic: "Aman — eliminasi tidak bergantung hati. Onset bisa sedikit memanjang pada sirosis berat.",
      elderly: "Onset dan durasi sedikit memanjang — titrasi sesuai TOF.",
      pediatric: "0.3–0.5 mg/kg IV bolus; infus 6–10 mcg/kg/min. Clearance lebih cepat pada anak."
    }
  },
  renal_adjustment: {
    badge: "safe",
    ge60: "Dosis standar",
    r30_60: "Dosis standar — eliminasi Hofmann tidak bergantung GFR",
    r15_30: "Dosis standar. Monitor akumulasi laudanosine.",
    lt15: "Dosis standar. Perhatikan akumulasi laudanosine — monitor neurologis post-weaning.",
    hd: "Dosis standar. Laudanosine tidak terdialisis — monitoring klinis penting.",
    crrt: "Dosis standar."
  },
  hepatic_adjustment: "Tidak diperlukan penyesuaian. Onset mungkin sedikit memanjang pada sirosis berat.",
  pregnancy: { category: "C", notes: "Dapat melewati plasenta dalam jumlah kecil. Digunakan untuk intubasi emergency pada ibu hamil bila manfaat > risiko." },
  monitoring: {
    primary: ["TOF (train-of-four): target 1–2 twitches dari 4 setiap 4–6 jam", "Sedasi dan analgesia adekuat (RASS, BPS/NRS) — NMB tidak boleh tanpa sedasi"],
    secondary: ["SpO2, kapnografi", "Peak airway pressure dan compliance paru", "Tanda histamine release: hipotensi, kemerahan, bronkospasme"],
    frequency: "TOF setiap 4–6 jam atau setelah perubahan dosis. Evaluasi harian untuk kebutuhan NMB."
  },
  adverse_effects: {
    common: ["Histamine release: flushing, hipotensi, bronkospasme (lebih sering dibanding cisatracurium)", "Takikardia refleks", "Kelemahan otot berkepanjangan"],
    serious: ["ICU-acquired weakness (ICUAW) — terutama pada penggunaan >2–3 hari", "Akumulasi laudanosine: agitasi, kejang (pada infus sangat lama + gagal ginjal)", "Kesadaran intraoperatif jika sedasi tidak adekuat"],
    antidote: "Neostigmin 0.04–0.07 mg/kg + atropin 0.01–0.02 mg/kg IV (reversal). Sugammadex tidak efektif untuk atrakurium (hanya untuk rocuronium/vecuronium)."
  },
  interactions: {
    major: [
      { drug: "Aminoglikosida (amikasin, gentamisin)", effect: "Potensiasi blokade neuromuskular — ↑ durasi dan kedalaman paralisis", management: "Monitor TOF ketat. Pertimbangkan dosis NMB lebih rendah." },
      { drug: "Magnesium sulfat", effect: "Potensiasi signifikan blokade neuromuskular", management: "Kurangi dosis atrakurium 25–50%. Monitor TOF." }
    ],
    moderate: [
      { drug: "Kortikosteroid", effect: "Steroid myopathy + NMB prolonged → risiko ICUAW meningkat", management: "Hindari kombinasi berkepanjangan. Batasi durasi NMB." },
      { drug: "Furosemid dosis tinggi", effect: "Dapat mempotensiasi atau mengantagonis NMB (dosis-dependen)", management: "Monitor TOF jika diberikan bersamaan." }
    ]
  },
  stewardship: "Gunakan NMB hanya jika indikasi jelas (ARDS P/F <150 + dyssinkroni, status asmatikus refrakter). Evaluasi harian untuk weaning NMB. SELALU pastikan sedasi + analgesia adekuat sebelum dan selama NMB. Prefer cisatracurium jika tersedia (lebih sedikit histamine release, metabolit lebih aman). TOF monitoring wajib.",
  high_alert: true,
  high_alert_warnings: ["PARALISIS TANPA KESADARAN ADALAH SIKSAAN — sedasi dan analgesia HARUS adekuat sebelum NMB", "Monitor TOF wajib — tidak boleh memberikan NMB tanpa monitor TOF tersedia", "Akses IV harus terjamin — hilangnya akses saat paralisis = krisis jalan napas"],
  high_alert_protocol: "Verifikasi sedasi RASS -3 sampai -5 sebelum mulai NMB. Pasang TOF monitor. Dokumentasi indikasi. Evaluasi harian untuk weaning. Siapkan reversal (neostigmin + atropin).",
  pump_link: true,
  pump_drug_key: null,
  evidence: [
    { ref_id: "acurasys2010", note: "ACURASYS 2010: Cisatracurium 48 jam pada ARDS berat → perbaikan mortalitas 90 hari (studi referensi untuk NMB ARDS)" },
    { ref_id: "rose2019", note: "ROSE 2019: NMB rutin tidak lebih baik dari sedasi dalam pada ARDS — gunakan selektif jika dyssinkroni tidak teratasi" },
    { ref_id: "sccm2018padis", note: "SCCM PADIS 2018: NMB hanya jika sedasi dalam gagal mengatasi dyssinkroni pada ARDS berat" }
  ]
},

"diltiazem": {
  name: "Diltiazem",
  brand_id: ["Herbeser", "Diltiazem HCl", "Farmabes"],
  brand_id_notes: "Herbeser (Tanabe) tersedia luas di ICU Indonesia. Ampul 10 mg/2 mL dan 50 mg/vial.",
  class: "Calcium channel blocker",
  subclass: "Non-dihidropiridin CCB (benzothiazepine)",
  category: ["kardiovaskular"],
  common_in_id: true,
  common_in_id_note: "Herbeser tersedia di ICU Indonesia",
  mechanism: "Blokade kanal kalsium tipe-L di nodus SA dan AV → menurunkan denyut jantung (kronotropik negatif) dan memperlambat konduksi AV (dromotropik negatif). Efek vasodilator koroner dan perifer (inotropik negatif ringan). Lebih selektif kardiak dibanding dihidropiridin (amlodipin, nifedipin).",
  pkpd_type: null,
  pkpd_note: null,
  spectrum: null,
  indications: {
    icu_primary: ["Rate control atrial fibrilasi (AF) dengan RVR — konversi cepat", "Rate control atrial flutter dengan konduksi cepat", "SVT (AVNRT, AVRT) refrakter adenosin atau manuver vagal", "Angina vasospastik (Prinzmetal) — relaksasi vasospasme koroner"],
    icu_secondary: ["Hipertensi urgensi/emergensi dengan takikardia", "Rate control AF pada pasien dengan bronkospasme (kontraindikasi β-blocker)"],
    local_guideline: "PERKI 2020: Diltiazem IV pilihan rate control AF jika β-blocker kontraindikasi. Herbeser tersedia di mayoritas ICU Indonesia.",
    intl_guideline: "AHA/ACC AF 2023: Diltiazem IV 0.25 mg/kg bolus → infus 5–15 mg/jam untuk rate control AF dengan RVR. ESC 2020: CCB non-dihidropiridin efektif untuk rate control AF akut."
  },
  contraindications: ["Sindrom sinus sakit tanpa pacu jantung", "Blok AV derajat 2–3 tanpa pacu jantung", "Hipotensi berat (SBP <90 mmHg)", "Sindrom WPW dengan AF (risiko konduksi aksesori)", "Gagal jantung dengan EF sangat rendah (<30%) — inotropik negatif", "Kombinasi dengan β-blocker IV (risiko bradikardia/blok AV berat)", "Infark miokard akut dengan kongesti"],
  precautions: ["Monitor EKG kontinu selama titrasi — perhatikan PR interval", "Gagal jantung sistolik — gunakan dengan hati-hati (inotropik negatif)", "Bradikardia sinus atau blok AV derajat 1 — monitor ketat", "Hipotermia — memperlambat metabolisme"],
  dosing: {
    standard: "Bolus: 0.25 mg/kg IV selama 2 menit. Infus: 5–15 mg/jam.",
    range_low: "Bolus: 0.15 mg/kg (pasien lansia, EF borderline)",
    range_high: "Bolus ulang: 0.35 mg/kg jika tidak respons setelah 15 menit",
    max: "Infus: 15 mg/jam. Durasi: umumnya ≤24 jam IV, transisi ke oral.",
    loading: "0.25 mg/kg IV bolus selama 2 menit (rata-rata 15–25 mg). Jika tidak respons 15 menit: bolus kedua 0.35 mg/kg.",
    maintenance: "Infus 5–15 mg/jam, titrasi setiap 15–30 menit sesuai HR target (60–100 bpm). Transisi ke diltiazem oral 120–360 mg/hari ketika stabil.",
    route: ["IV"],
    dilution: "Herbeser 50 mg dalam 50 mL NS → 1 mg/mL (siap pakai). Atau 125 mg dalam 125 mL NS → 1 mg/mL untuk infus panjang.",
    special_populations: {
      renal: "Tidak diperlukan penyesuaian dosis pada gagal ginjal.",
      hepatic: "Penyesuaian pada sirosis — metabolisme hepatik (CYP3A4) terganggu. Mulai dosis rendah, titrasi hati-hati.",
      elderly: "Mulai dengan bolus 0.15 mg/kg. Risiko hipotensi dan bradikardia lebih tinggi.",
      pediatric: "0.1–0.25 mg/kg IV bolus; infus 0.11–0.35 mg/kg/jam (konsultasi kardiologi anak)."
    }
  },
  renal_adjustment: {
    badge: "safe",
    ge60: "Dosis standar",
    r30_60: "Dosis standar — tidak tergantung eliminasi renal",
    r15_30: "Dosis standar. Monitor hemodinamik.",
    lt15: "Mulai dosis lebih rendah. Akumulasi metabolit aktif — titrasi hati-hati.",
    hd: "Dosis standar. Tidak terdialisis signifikan.",
    crrt: "Dosis standar. Monitor hemodinamik."
  },
  hepatic_adjustment: "Kurangi dosis 25–50% pada sirosis. Metabolisme via CYP3A4 hepatik — bioavailabilitas meningkat dan half-life memanjang pada gangguan hati berat.",
  pregnancy: { category: "C", notes: "Data terbatas. Gunakan hanya jika manfaat > risiko. β-blocker IV (metoprolol, labetalol) lebih disukai untuk rate control selama kehamilan." },
  monitoring: {
    primary: ["HR target 60–100 bpm", "EKG kontinu: PR interval, ritme, ada blok AV baru", "Tekanan darah setiap 15 menit selama titrasi"],
    secondary: ["Saturasi oksigen", "Tanda gagal jantung jika EF borderline"],
    frequency: "EKG dan hemodinamik setiap 15 menit selama bolus dan titrasi awal. Setelah stabil: setiap 1–2 jam."
  },
  adverse_effects: {
    common: ["Bradikardia sinus (dosis-dependen)", "Hipotensi — terutama bolus cepat", "Blok AV derajat 1 (PR memanjang)", "Flushing, pusing"],
    serious: ["Blok AV derajat 2–3 — hentikan infus, pertimbangkan atropin/pacu jantung", "Henti sinus — pada sinus sakit tidak terdiagnosis", "Gagal jantung akut pada pasien EF rendah"],
    antidote: "Kalsium glukonat 1–2 g IV atau CaCl₂ 0.5–1 g IV untuk overdosis/bradikardia berat. Atropin 0.5–1 mg IV untuk bradikardia simtomatik. Glukagon 2–10 mg IV jika refrakter."
  },
  interactions: {
    major: [
      { drug: "β-blocker IV (esmolol, metoprolol)", effect: "Bradikardia berat dan blok AV — efek sinergistik pada nodus AV", management: "KONTRAINDIKASI kombinasi IV. Jika harus berganti, tunggu washout." },
      { drug: "Digoksin", effect: "Diltiazem meningkatkan kadar digoksin 20–40% (inhibisi P-gp dan CYP3A4)", management: "Monitor kadar digoksin. Kurangi dosis digoksin 25–30%." }
    ],
    moderate: [
      { drug: "Statin (simvastatin, lovastatin)", effect: "Inhibisi CYP3A4 → ↑ kadar statin → risiko miopati/rhabdomiolisis", management: "Hindari simvastatin >20 mg/hari. Gunakan rosuvastatin/pravastatin." },
      { drug: "Siklosporin/takrolimus", effect: "Inhibisi CYP3A4 → peningkatan signifikan kadar imunosupresan", management: "Monitor kadar imunosupresan ketat. Pertimbangkan penyesuaian dosis." }
    ]
  },
  stewardship: "Indikasi utama: rate control AF dengan RVR jika β-blocker kontraindikasi (bronkospasme, decompensated HF ringan-sedang). Hindari pada gagal jantung berat (EF <30%) — β-blocker lebih aman. Transisi ke oral dalam 24 jam. Jangan kombinasikan dengan β-blocker IV.",
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: true,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ahaacc_af2023", note: "AHA/ACC/ACCP/HRS 2023 AF Guidelines: Diltiazem IV kelas I untuk rate control AF akut" },
    { ref_id: "esc_af2020", note: "ESC 2020 AF: CCB non-dihidropiridin IV efektif rate control AF — hindari pada HFrEF" }
  ]
},

/* ============================================================
   FASE 5 — ANTIBIOTIK TAMBAHAN
   ============================================================ */

"moxifloksasin": {
  name: "Moxifloxacin",
  brand_id: ["Avelox", "Moxifloxacin Dexa", "Moxigra"],
  brand_id_notes: "Avelox (Bayer) originator. Generik tersedia di Indonesia.",
  class: "Antibiotik fluorokuinolon",
  subclass: "Fluorokuinolon generasi ke-4 — inhibitor DNA gyrase & topoisomerase IV",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS Indonesia. Sering digunakan untuk CAP dan infeksi saluran napas.",
  mechanism: "Inhibisi simultan DNA gyrase (topoisomerase II) dan topoisomerase IV → gangguan supercoiling, replikasi, dan transkripsi DNA bakteri → bakterisidal. Spektrum lebih luas dari siprofloksasin: mencakup gram-positif, atipikal, dan anaerob. Tidak aktif terhadap Pseudomonas.",
  pkpd_type: "concentration_dependent",
  pkpd_note: "AUC/MIC target ≥125. Bioavailabilitas oral ~91% — IV dan PO setara. Ekskresi campuran: hepatik (bilier) dan renal — tidak memerlukan penyesuaian dosis ginjal.",
  spectrum: {
    gram_pos: "Sangat baik: S. pneumoniae (termasuk PRSP), S. aureus MSSA, Streptokokus grup A. Lemah terhadap MRSA.",
    gram_neg: "Baik: H. influenzae, M. catarrhalis, Klebsiella, E. coli. Lemah: Enterobacter. TIDAK AKTIF: Pseudomonas aeruginosa.",
    anaerob: "Baik: Bacteroides fragilis, Clostridium, Peptostreptococcus — keunggulan dibanding generasi lebih tua.",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["CAP (community-acquired pneumonia) berat yang memerlukan rawat ICU", "HAP/VAP ringan-sedang tanpa risiko Pseudomonas"],
    icu_secondary: ["Sinusitis bakteri berat", "Infeksi intra-abdominal kompleks (kombinasi)", "Exacerbasi PPOK berat"],
    local_guideline: "PDPI 2022: Moxifloxacin sebagai monoterapi CAP rawat inap (non-ICU) atau kombinasi untuk berat.",
    intl_guideline: "IDSA/ATS CAP 2019: Moxifloxacin/levofloxacin sebagai monoterapi CAP — alternatif β-laktam + makrolid."
  },
  contraindications: ["Riwayat perpanjangan QTc atau aritmia ventrikel", "Kombinasi obat QT-prolonging lain", "Miastenia gravis (perburukan neuromuskular)", "Hipersensitivitas fluorokuinolon"],
  precautions: ["QTc prolongation — EKG sebelum mulai jika risiko", "Ruptur tendon (terutama tendon Achilles) — usia >60 tahun, kortikosteroid bersamaan", "Hepatotoksisitas", "Tidak digunakan untuk ISK (kadar urin sangat rendah)"],
  dosing: {
    standard: "400 mg IV/PO sekali sehari",
    range_low: "400 mg sekali sehari",
    range_high: "400 mg sekali sehari (dosis tunggal harian — tidak dinaikkan)",
    max: "400 mg/hari",
    loading: null,
    maintenance: "400 mg sekali sehari selama 5–14 hari tergantung indikasi",
    route: ["IV", "PO"],
    dilution: "400 mg dalam 250 mL NaCl 0.9% atau D5W. Infus 60 menit.",
    rate: "Infus IV: 60 menit. Jangan infus cepat — risiko QT.",
    titration: null,
    special_notes: "TIDAK untuk infeksi saluran kemih — ekskresi urin rendah. Switch IV ke PO segera (bioavailabilitas oral 91%)."
  },
  renal_adjustment: {
    ge60:   { dose: "400 mg", interval: "q24j", note: "Dosis penuh" },
    r30_60: { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian — eliminasi bilier dominan" },
    r15_30: { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian dosis" },
    r_lt15: { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian — gunakan dengan hati-hati" },
    hd:     { dose: "400 mg", interval: "q24j", note: "Tidak terdialisis secara signifikan" },
    crrt:   { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak memerlukan penyesuaian dosis pada gagal ginjal — keunggulan vs fluorokuinolon lain."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — monitor LFT", child_c: "Hindari — eliminasi bilier utama, akumulasi signifikan",
    note: "Metabolisme hepatik dan bilier dominan. Hindari pada gangguan hati berat (Child-Pugh C)."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari — data tidak cukup, risiko artropati pada hewan",
    trimester_2: "Hindari jika ada alternatif",
    trimester_3: "Hindari",
    labor_delivery: "Tidak direkomendasikan",
    fetal_risk: "Artropati potensial pada hewan. Data manusia tidak cukup.",
    lactation: "Diekskresikan ke ASI. Tidak direkomendasikan.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Perbaikan klinis 48–72 jam", "Suhu, leukosit, CRP/PCT", "Foto toraks jika pneumonia"],
    safety: ["EKG: QTc sebelum mulai dan 24 jam setelah (jika risiko)", "LFT jika penggunaan >7 hari", "Tanda tendinopati"],
    frequency: "Klinis harian. EKG jika ada risiko QT.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["QTc prolongation → aritmia ventrikel (Torsades de Pointes)", "Ruptur tendon (jarang tapi irreversibel)", "Hepatotoksisitas berat (sangat jarang)"],
    common: ["Mual/diare (5–10%)", "Sakit kepala", "Pusing", "↑ LFT transien"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Obat QT-prolonging (amiodaron, haloperidol, klorokuin)", effect: "Risiko Torsades de Pointes sinergistik", management: "Hindari kombinasi. EKG monitoring ketat jika tidak dapat dihindari." }
    ],
    moderate: [
      { drug: "Antasida/Sukralfat (Mg, Al, Ca, Fe)", effect: "Khelasi → ↓ absorpsi oral 50–90%", management: "Berikan moxifloxacin 2 jam sebelum atau 4 jam setelah antasida." }
    ]
  },
  stewardship: {
    empiric_sources: ["CAP rawat inap/ICU tanpa risiko Pseudomonas", "HAP early-onset tanpa MDR"],
    deescalation_to: ["Sesuai hasil kultur"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "CAP: 5–7 hari. HAP: 7–8 hari.",
    stop_criteria: "PCT turun >80% atau <0.5 ng/mL + klinis membaik",
    avoid_for: ["Infeksi saluran kemih (kadar urin tidak cukup)", "Infeksi risiko Pseudomonas (VAP late-onset, bronkiektasis)", "Monoterapi pada sepsis berat tanpa patogen terkonfirmasi"],
    local_pattern_note: "Di Indonesia, sering digunakan untuk CAP dan HAP early-onset. Hati-hati resistensi: S. aureus dan Enterobacteriaceae resistensi kuinolon meningkat di beberapa RS."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "idsa_cap2019", note: "Monoterapi CAP rawat inap — setara β-laktam + makrolid" }
  ]
},

"levofloksasin": {
  name: "Levofloxacin",
  brand_id: ["Cravit", "Levofloxacin Dexa", "Lefos", "Levocin"],
  brand_id_notes: "Cravit (Sanofi/Daiichi) originator. Generik sangat luas di Indonesia.",
  class: "Antibiotik fluorokuinolon",
  subclass: "Fluorokuinolon generasi ke-3 — inhibitor DNA gyrase & topoisomerase IV",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Bioavailabilitas oral sangat tinggi (99%).",
  mechanism: "Inhibisi DNA gyrase dan topoisomerase IV → gangguan replikasi DNA bakteri → bakterisidal. L-isomer aktif dari ofloksasin — aktivitas 2× lebih tinggi. Konsentrasi-dependen. Ekskresi renal dominan — kadar urin sangat tinggi (baik untuk ISK).",
  pkpd_type: "concentration_dependent",
  pkpd_note: "AUC/MIC target ≥125 (gram-negatif), ≥30 (gram-positif). Bioavailabilitas PO 99% — switch IV→PO segera. Penyesuaian dosis wajib pada gagal ginjal (ekskresi renal dominan).",
  spectrum: {
    gram_pos: "Baik: S. pneumoniae (termasuk PRSP), S. aureus MSSA, Streptokokus. Lemah: MRSA.",
    gram_neg: "Sangat baik: H. influenzae, M. catarrhalis, Klebsiella, E. coli, Legionella. Moderat: Pseudomonas aeruginosa (lebih baik dari moxifloxacin, lebih lemah dari siprofloksasin).",
    anaerob: "Lemah — tidak untuk infeksi anaerob",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["CAP berat rawat ICU", "HAP/VAP early-onset tanpa risiko MDR tinggi", "ISK komplikata / pielonefritis berat"],
    icu_secondary: ["Infeksi saluran napas bawah pada PPOK eksaserbasi berat", "Legionellosis", "Infeksi kulit dan jaringan lunak"],
    local_guideline: "PDPI 2022: Levofloxacin 750 mg untuk CAP rawat inap sebagai monoterapi atau kombinasi.",
    intl_guideline: "IDSA/ATS CAP 2019: Levofloxacin/moxifloxacin — respiratory fluoroquinolone pilihan utama."
  },
  contraindications: ["Riwayat perpanjangan QTc", "Miastenia gravis (perburukan)", "Hipersensitivitas fluorokuinolon", "Epilepsi tidak terkontrol (turunkan ambang kejang)"],
  precautions: ["QTc prolongation", "Ruptur tendon — risiko tinggi pada usia lanjut + kortikosteroid", "Penyesuaian dosis wajib pada gagal ginjal", "Hipoglikemia pada diabetik yang minum antidiabetik oral"],
  dosing: {
    standard: "500–750 mg IV/PO sekali sehari",
    range_low: "250 mg sekali sehari (ISK tanpa komplikasi)",
    range_high: "750 mg sekali sehari (pneumonia berat, infeksi berat)",
    max: "750 mg/hari",
    loading: null,
    maintenance: "500–750 mg sekali sehari sesuai indikasi",
    route: ["IV", "PO"],
    dilution: "500 mg dalam 100 mL atau 750 mg dalam 150 mL NaCl 0.9%/D5W. Infus minimal 60–90 menit.",
    rate: "500 mg: infus 60 menit. 750 mg: infus 90 menit. Jangan infus cepat.",
    titration: null,
    special_notes: "Bioavailabilitas PO 99% — switch IV ke PO segera jika toleransi baik. Untuk Pseudomonas: 750 mg lebih efektif, pertimbangkan kombinasi."
  },
  renal_adjustment: {
    ge60:   { dose: "500–750 mg", interval: "q24j", note: "Dosis penuh" },
    r30_60: { dose: "500 mg hari 1, lalu 250 mg", interval: "q24j", note: "Atau 750 mg hari 1, lalu 500 mg q24j" },
    r15_30: { dose: "250–500 mg hari 1, lalu 250 mg", interval: "q48j", note: "Penyesuaian signifikan diperlukan" },
    r_lt15: { dose: "250 mg hari 1, lalu 250 mg", interval: "q48j", note: "Monitor ketat" },
    hd:     { dose: "250 mg hari 1, lalu 250 mg", interval: "q48j", note: "Tidak terdialisis secara signifikan. Berikan setelah HD." },
    crrt:   { dose: "250–500 mg", interval: "q24j", note: "Sesuaikan dengan effluent rate" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Penyesuaian dosis wajib pada eGFR <50. Monitor tanda neurotoksisitas."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak perlu penyesuaian pada gangguan hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari — risiko artropati",
    trimester_2: "Hindari jika ada alternatif",
    trimester_3: "Hindari",
    labor_delivery: "Tidak direkomendasikan",
    fetal_risk: "Artropati potensial. Data manusia tidak cukup.",
    lactation: "Diekskresikan ke ASI. Tidak direkomendasikan.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Perbaikan klinis 48–72 jam", "PCT/CRP setiap 48–72 jam", "Kultur repeat jika klinis tidak membaik"],
    safety: ["EKG: QTc jika risiko", "Kreatinin setiap 48–72 jam (penyesuaian dosis)", "Tanda hipoglikemia pada diabetik", "Tanda tendinopati"],
    frequency: "Klinis harian. Renal function setiap 48 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["QTc prolongation → Torsades de Pointes", "Ruptur tendon", "Seizure (jarang)"],
    common: ["Mual/diare", "Sakit kepala, insomnia", "↑ LFT transien", "Hipoglikemia (pada DM + antidiabetik oral)"],
    antidote: null
  },
  interactions: {
    major: [
      { drug: "Obat QT-prolonging", effect: "Torsades de Pointes sinergistik", management: "Hindari atau monitor EKG ketat." }
    ],
    moderate: [
      { drug: "Antidiabetik oral (sulfonilurea)", effect: "Hipoglikemia berat", management: "Monitor gula darah ketat." },
      { drug: "Antasida/Sukralfat (Mg, Al, Fe)", effect: "↓ absorpsi oral 50–70%", management: "Berikan 2 jam sebelum atau 4 jam sesudah antasida." }
    ]
  },
  stewardship: {
    empiric_sources: ["CAP rawat inap/ICU", "HAP early-onset", "ISK komplikata/pielonefritis"],
    deescalation_to: ["Sesuai sensitivitas kultur"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "CAP: 5–7 hari. HAP: 7 hari. ISK komplikata: 5–10 hari. Pielonefritis: 5–7 hari (750 mg).",
    stop_criteria: "Perbaikan klinis + PCT <0.5 atau turun >80%",
    avoid_for: ["Infeksi risiko Pseudomonas tinggi tanpa kombinasi", "MRSA (tidak efektif)"],
    local_pattern_note: "Resistensi E. coli terhadap fluorokuinolon di Indonesia tinggi (>30% di beberapa RS). Konfirmasi kultur penting."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "idsa_cap2019", note: "Respiratory fluoroquinolone pilihan untuk CAP rawat inap" }
  ]
},

"sefotaksim": {
  name: "Cefotaxime",
  brand_id: ["Claforan", "Cefotaxim Dexa", "Cefotax", "Broadced"],
  brand_id_notes: "Claforan (Sanofi) originator. Generik luas di Indonesia. Satu-satunya sefalosporin gen-3 dengan penetrasi CSS terbaik.",
  class: "Antibiotik β-laktam",
  subclass: "Sefalosporin generasi ke-3",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Pilihan utama meningitis dan infeksi SSP.",
  mechanism: "Berikatan dengan Penicillin-Binding Proteins (PBP) → inhibisi sintesis dinding sel bakteri → lisis osmotik. Stabil terhadap banyak β-laktamase (tidak termasuk ESBL dan karbapenemase). Penetrasi CSS sangat baik — pilihan utama meningitis.",
  pkpd_type: "time_dependent",
  pkpd_note: "T>MIC target ≥40–70%. Waktu paruh pendek (1 jam) → dosis terbagi 6–8 jam diperlukan untuk T>MIC optimal. Metabolit aktif: desacetylcefotaxime.",
  spectrum: {
    gram_pos: "Baik: S. pneumoniae, S. pyogenes, Streptokokus viridans. Lemah: Enterokokus. Tidak: MRSA.",
    gram_neg: "Sangat baik: E. coli, Klebsiella, Proteus, H. influenzae, N. meningitidis, N. gonorrhoeae. Lemah: Pseudomonas aeruginosa.",
    anaerob: "Lemah — tidak untuk infeksi anaerob signifikan",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["Meningitis bakteri (pilihan utama — penetrasi CSS terbaik)", "Sepsis community-acquired tanpa risiko MDR", "Infeksi intra-abdominal ringan-sedang (kombinasi dengan metronidazol)"],
    icu_secondary: ["Pneumonia community-acquired berat (kombinasi dengan makrolid/fluorokuinolon)", "Infeksi saluran kemih komplikata", "Epiglotitis, infeksi jaringan leher"],
    local_guideline: "PERDOSSI 2016: Cefotaxim 2g IV q6h untuk meningitis bakteri dewasa. PDPI: kombinasi CAP.",
    intl_guideline: "IDSA Meningitis 2004 (update 2017): Cefotaxim atau seftriakson untuk meningitis S. pneumoniae dan N. meningitidis."
  },
  contraindications: ["Hipersensitivitas terhadap sefalosporin", "Riwayat anafilaksis terhadap penisilin (cross-reaktivitas ~1%)"],
  precautions: ["Risiko kejang pada dosis tinggi + gagal ginjal", "Penyesuaian dosis pada eGFR <20"],
  dosing: {
    standard: "1–2 g IV setiap 8 jam",
    range_low: "1 g IV q12j (infeksi ringan-sedang)",
    range_high: "2 g IV q4–6j (meningitis, sepsis berat)",
    max: "12 g/hari (meningitis)",
    loading: null,
    maintenance: "Sesuaikan dengan indikasi dan fungsi ginjal",
    route: ["IV", "IM"],
    dilution: "1–2 g dalam 50–100 mL NaCl 0.9% atau D5W. Infus 20–30 menit.",
    rate: "Infus IV 20–30 menit. Injeksi IV bolus lambat (3–5 menit) untuk dosis ≤2g.",
    titration: null,
    special_notes: "Meningitis: 2g IV q4–6h (dosis tinggi + frekuensi tinggi untuk penetrasi CSS optimal). Tidak cukup aktif terhadap Pseudomonas."
  },
  renal_adjustment: {
    ge60:   { dose: "1–2 g", interval: "q6–8j", note: "Dosis penuh" },
    r30_60: { dose: "1–2 g", interval: "q8–12j", note: "Perpanjang interval" },
    r15_30: { dose: "1 g",   interval: "q12j",  note: "Kurangi dosis dan frekuensi" },
    r_lt15: { dose: "1 g",   interval: "q24j",  note: "Penyesuaian signifikan. Monitor neurotoksisitas." },
    hd:     { dose: "1 g",   interval: "q24j",  note: "Berikan setelah sesi HD. Suplementasi 1g post-HD." },
    crrt:   { dose: "1 g",   interval: "q12j",  note: "Sesuaikan dengan effluent rate" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Penyesuaian diperlukan pada eGFR <20. Monitor kejang pada dosis tinggi."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian pada gangguan hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Dapat digunakan jika indikasi kuat",
    trimester_2: "Dapat digunakan",
    trimester_3: "Dapat digunakan",
    labor_delivery: "Aman — digunakan untuk profilaksis/terapi intrapartum",
    fetal_risk: "Tidak ada bukti teratogenisitas",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil. Umumnya aman.",
    lactation_note: "Monitor bayi untuk diare."
  },
  monitoring: {
    efficacy: ["Klinis 24–48 jam", "CSS repeat setelah 24–48 jam (meningitis)", "PCT/CRP setiap 48–72 jam"],
    safety: ["Kreatinin setiap 48–72 jam", "Monitor kejang pada dosis tinggi + gagal ginjal"],
    frequency: "Klinis harian. Renal function setiap 48 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Anafilaksis (jarang)", "Kejang pada dosis tinggi + gagal ginjal"],
    common: ["Diare", "↑ LFT transien", "Tromboflebitis infus", "Eosinofilia"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Probenesid", effect: "↓ ekskresi tubular cefotaxim → ↑ kadar serum", management: "Monitor efek dan efek samping." }
    ]
  },
  stewardship: {
    empiric_sources: ["Meningitis bakteri (first-line)", "Sepsis CAP tanpa risiko MDR", "Infeksi intra-abdominal ringan"],
    deescalation_to: ["Amoksisilin-klavulanat PO (jika memungkinkan)", "Sesuai sensitivitas kultur"],
    duration_standard: 7,
    duration_short: 5,
    duration_note: "Meningitis: 10–14 hari. Sepsis: 7 hari. Pneumonia: 5–7 hari.",
    stop_criteria: "PCT <0.5 ng/mL + klinis membaik",
    avoid_for: ["Pseudomonas (tidak aktif)", "ESBL (tidak cukup stabil)", "Infeksi anaerob signifikan"],
    local_pattern_note: "Di Indonesia, sering digunakan untuk meningitis dan infeksi CAP. Pertimbangkan seftriakson jika dosis sekali sehari lebih praktis."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Sefalosporin gen-3 untuk sepsis CAP tanpa MDR. Meningitis: pilihan utama bersama seftriakson." }
  ]
},

"sefoperazon_sulbaktam": {
  name: "Cefoperazone-Sulbactam",
  brand_id: ["Sulperazon", "Cefoperazone-Sulbactam Dexa", "Bakprazon"],
  brand_id_notes: "Sulperazon (Pfizer) originator. Tersedia di RS Indonesia. Kombinasi tetap 1:1 (500mg/500mg) atau 2:1 (1g/500mg).",
  class: "Antibiotik β-laktam",
  subclass: "Sefalosporin gen-3 + inhibitor β-laktamase (sulbaktam memiliki aktivitas intrinsik terhadap Acinetobacter)",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di banyak RS Indonesia. Pilihan untuk Acinetobacter baumannii — sulbaktam aktif intrinsik.",
  mechanism: "Cefoperazone: inhibisi PBP → gangguan sintesis dinding sel. Sulbaktam: inhibisi β-laktamase (kelas A dan C) + aktivitas intrinsik bakterisidal terhadap Acinetobacter baumannii (berikatan dengan PBP1 dan PBP3 Acinetobacter). Kombinasi memperluas spektrum dan mengatasi resistensi β-laktamase.",
  pkpd_type: "time_dependent",
  pkpd_note: "T>MIC untuk keduanya. Sulbaktam: target T>MIC ≥40% (Acinetobacter). Eliminasi bilier dominan (70%) untuk cefoperazone — penyesuaian hepatik penting. Sulbaktam: eliminasi renal.",
  spectrum: {
    gram_pos: "Baik: Streptokokus, S. aureus MSSA. Tidak: MRSA, Enterokokus.",
    gram_neg: "Baik: Enterobacteriaceae (termasuk β-laktamase penghasil). Acinetobacter baumannii: sulbaktam aktif intrinsik. Moderat: Pseudomonas (cefoperazone aktif, tidak se-kuat antipseudomonal khusus).",
    anaerob: "Baik: Bacteroides fragilis (cefoperazone stabil terhadap β-laktamase anaerob)",
    mrsa: false,
    vre: false,
    esbl: true,
    pseudomonas: true,
    acinetobacter: true,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["Infeksi Acinetobacter baumannii (CRAB — sulbaktam lini utama)", "VAP/HAP late-onset dengan risiko Acinetobacter", "Sepsis nosokomial dengan risiko MDR gram-negatif"],
    icu_secondary: ["Infeksi intra-abdominal kompleks", "Infeksi saluran bilier berat", "Kombinasi dengan aminoglikosida atau kolistin untuk CRAB berat"],
    local_guideline: "PERDICI 2022: Cefoperazone-sulbactam untuk CRAB — sulbaktam adalah satu-satunya β-laktam dengan aktivitas intrinsik vs Acinetobacter.",
    intl_guideline: "IDSA MDR 2022: Sulbaktam-durlobactam (baru) preferred untuk CRAB. Cefoperazone-sulbactam: sulbaktam dosis tinggi sebagai alternatif."
  },
  contraindications: ["Hipersensitivitas terhadap sefalosporin atau penisilin"],
  precautions: ["Penyesuaian dosis pada gagal hati (cefoperazone — eliminasi bilier)", "Efek disulfiram-like dengan alkohol (chain N-methylthiotetrazole)", "Perpanjangan PT/INR — monitor koagulasi", "Penyesuaian sulbaktam pada gagal ginjal"],
  dosing: {
    standard: "2 g (1g/1g) IV setiap 12 jam",
    range_low: "1 g (0.5g/0.5g) IV q12j",
    range_high: "4 g (2g/2g) IV q8j atau q6j (CRAB berat — sulbaktam dosis tinggi)",
    max: "8 g sulbaktam/hari (CRAB berat)",
    loading: null,
    maintenance: "Sesuaikan dengan indikasi dan berat infeksi",
    route: ["IV"],
    dilution: "1–2 g dalam 100 mL NaCl 0.9% atau D5W. Infus 30–60 menit.",
    rate: "Infus IV 30–60 menit. Extended infusion 3–4 jam untuk Acinetobacter MIC borderline.",
    titration: null,
    special_notes: "Untuk CRAB: Sulbaktam total dosis ≥4 g/hari (berikan sebagai 2g q8j atau 2g q6j). Kombinasikan dengan kolistin atau tigesiklin untuk CRAB berat. Hindari alkohol selama penggunaan — efek disulfiram."
  },
  renal_adjustment: {
    ge60:   { dose: "2 g q12j", interval: "Normal", note: "Dosis penuh" },
    r30_60: { dose: "2 g q12j", interval: "Normal", note: "Cefoperazone tidak perlu penyesuaian (bilier). Sulbaktam: monitor." },
    r15_30: { dose: "1–2 g q12j", interval: "Normal", note: "Kurangi dosis sulbaktam. Cefoperazone tidak berubah." },
    r_lt15: { dose: "1 g q12j",   interval: "Normal", note: "Sulbaktam dosis max 1g/hari pada eGFR <15" },
    hd:     { dose: "1 g q12j",   interval: "Normal", note: "Sulbaktam terdialisis — berikan setelah HD" },
    crrt:   { dose: "1–2 g q12j", interval: "Normal", note: "Sesuaikan sulbaktam dengan effluent rate" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Penyesuaian sulbaktam pada eGFR <30. Cefoperazone tidak perlu penyesuaian ginjal."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi dosis maks cefoperazone 2g/hari", child_c: "Cefoperazone max 1–2g/hari + monitor ketat. Sulbaktam normal.",
    note: "Cefoperazone eliminasi bilier dominan — penyesuaian pada gangguan hati berat. Batasi cefoperazone ≤2g/hari pada Child-Pugh B/C."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Dapat digunakan jika indikasi kuat",
    trimester_2: "Dapat digunakan",
    trimester_3: "Dapat digunakan",
    labor_delivery: "Dapat digunakan",
    fetal_risk: "Tidak ada bukti teratogenisitas",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil. Pertimbangkan risiko-manfaat.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Klinis 48–72 jam", "Kultur repeat", "PCT/CRP setiap 48–72 jam"],
    safety: ["PT/INR setiap 48–72 jam (perpanjangan koagulasi)", "LFT setiap 1 minggu", "Kreatinin untuk sulbaktam", "Larangan alkohol selama terapi"],
    frequency: "Klinis harian. PT/INR setiap 48 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Koagulopati / perdarahan (defisiensi vitamin K — chain NMTT)", "Anafilaksis (jarang)"],
    common: ["Diare", "↑ LFT", "Tromboflebitis", "Reaksi disulfiram dengan alkohol"],
    antidote: "Koagulopati: Vitamin K 10 mg IV/SC"
  },
  interactions: {
    major: [
      { drug: "Alkohol (etanol)", effect: "Reaksi disulfiram — flushing, mual, muntah, takikardia", management: "Kontraindikasi alkohol selama terapi dan 72 jam setelah." },
      { drug: "Warfarin / antikoagulan", effect: "↑ efek antikoagulan — risiko perdarahan", management: "Monitor PT/INR setiap 24–48 jam. Pertimbangkan vitamin K profilaksis." }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["VAP/HAP dengan risiko Acinetobacter", "Sepsis nosokomial dengan riwayat CRAB di RS"],
    deescalation_to: ["Sesuai sensitivitas kultur"],
    duration_standard: 10,
    duration_short: 7,
    duration_note: "VAP/HAP: 7–10 hari. Infeksi berat CRAB: 10–14 hari.",
    stop_criteria: "Klinis membaik + kultur negatif",
    avoid_for: ["Infeksi MRSA", "Infeksi anaerob dominan tanpa patogen gram-negatif"],
    local_pattern_note: "Acinetobacter baumannii resistensi karbapenem (CRAB) sangat umum di ICU Indonesia (30–70%). Sulbaktam adalah backbone terapi CRAB — kombinasikan dengan kolistin atau tigesiklin untuk berat."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Sulbaktam — satu-satunya β-laktam dengan aktivitas intrinsik vs Acinetobacter baumannii" }
  ]
},

"gentamisin": {
  name: "Gentamisin",
  brand_id: ["Garamycin", "Gentamicin Dexa", "Sagestam"],
  brand_id_notes: "Garamycin (Schering) originator. Generik sangat luas. Tersedia di semua RS Indonesia.",
  class: "Antibiotik aminoglikosida",
  subclass: "Inhibitor ribosom 30S (generasi pertama)",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Murah. Digunakan luas namun resistensi lebih tinggi dari amikasin.",
  mechanism: "Berikatan dengan subunit ribosom 30S → misreading mRNA → protein abnormal → gangguan membran sel bakteri → lisis. Bakterisidal konsentrasi-dependen. Lebih rentan terhadap enzim modifikasi aminoglikosida (AME) dibanding amikasin — resistensi lebih sering.",
  pkpd_type: "concentration_dependent",
  pkpd_note: "Cmax/MIC target ≥8–10. Extended interval (once-daily 5–7 mg/kg) mencapai Cmax lebih tinggi + PAE + toksisitas lebih rendah. Hartford nomogram untuk monitoring kadar. TDM sangat dianjurkan.",
  spectrum: {
    gram_pos: "Sinergis dengan β-laktam/glikopeptida terhadap Streptokokus dan Enterokokus. Tidak cukup monoterapi.",
    gram_neg: "Baik: E. coli, Klebsiella, Pseudomonas aeruginosa, Enterobacter, Serratia. Lebih rentan resistensi dibanding amikasin. Tidak aktif: Stenotrophomonas, Acinetobacter (bervariasi).",
    anaerob: "Tidak aktif",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["Kombinasi empiris sepsis gram-negatif berat (dengan β-laktam)", "Endokarditis Enterokokus/Streptokokus (sinergi)", "VAP/HAP — kombinasi untuk coverage Pseudomonas"],
    icu_secondary: ["Infeksi saluran kemih komplikata (gram-negatif)", "Profilaksis bedah kolorektal (kombinasi)", "Infeksi Brucella (kombinasi dengan doksisiklin)"],
    local_guideline: "PERDICI: Gentamisin sebagai kombinasi empiris sepsis berat. TDM direkomendasikan untuk dosis optimal dan mencegah toksisitas.",
    intl_guideline: "IDSA Endocarditis 2015: Gentamisin sinergistik untuk Streptokokus viridans dan Enterokokus. Once-daily dosing lebih aman dan sama efektifnya."
  },
  contraindications: ["Hipersensitivitas aminoglikosida", "Kehamilan (ototoksisitas fetal)", "Miastenia gravis (blok neuromuskular)"],
  precautions: ["Nefrotoksisitas — monitor kreatinin ketat", "Ototoksisitas vestibular dan koklear (sering ireversibel)", "Penyesuaian dosis wajib pada gagal ginjal", "Hindari kombinasi dengan furosemid dosis tinggi (ototoksisitas sinergistik)", "TDM wajib untuk penggunaan >48 jam"],
  dosing: {
    standard: "5–7 mg/kg IV sekali sehari (extended interval)",
    range_low: "3 mg/kg/hari (dosis terbagi q8j — metode tradisional)",
    range_high: "7 mg/kg IV sekali sehari (extended interval — disukai)",
    max: "7 mg/kg/dosis (once-daily)",
    loading: null,
    maintenance: "Once-daily 5–7 mg/kg. Sesuaikan dengan TDM.",
    route: ["IV", "IM"],
    dilution: "Dalam 100 mL NaCl 0.9% atau D5W. Infus 30–60 menit.",
    rate: "Infus IV 30–60 menit. Jangan bolus cepat — blok neuromuskular.",
    titration: "Hartford nomogram: kadar 6–14 jam post-dosis → sesuaikan interval (q24j/q36j/q48j).",
    special_notes: "TDM: once-daily — cek kadar 6–14 jam post-infus (Hartford nomogram). Jika q8j: Cmax target 5–10 mcg/mL, Cmin <2 mcg/mL. Hindari penggunaan >5–7 hari jika memungkinkan."
  },
  renal_adjustment: {
    ge60:   { dose: "5–7 mg/kg", interval: "q24j", note: "Dosis standar once-daily" },
    r30_60: { dose: "5–7 mg/kg", interval: "q36j", note: "Perpanjang interval. TDM wajib." },
    r15_30: { dose: "5 mg/kg",   interval: "q48j", note: "Perpanjang interval signifikan. TDM ketat." },
    r_lt15: { dose: "Hindari",   interval: "—",    note: "Risiko akumulasi dan toksisitas sangat tinggi. Gunakan amikasin dengan TDM jika harus." },
    hd:     { dose: "2–3 mg/kg", interval: "post-HD", note: "Berikan SETELAH setiap sesi HD. Monitor kadar." },
    crrt:   { dose: "2–3 mg/kg", interval: "q24–48j", note: "TDM ketat diperlukan." },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "TDM wajib. Monitor kreatinin setiap 24 jam. Hentikan jika kreatinin naik >0.5 mg/dL dari baseline."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak perlu penyesuaian pada gangguan hati. Waspadai asites — Vd meningkat."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "KONTRAINDIKASI — ototoksisitas fetal (nervus VIII)",
    trimester_2: "Hindari — risiko ototoksisitas dan nefrotoksisitas fetal",
    trimester_3: "Hindari",
    labor_delivery: "Hindari",
    fetal_risk: "Ototoksisitas permanen pada fetus (kategori D)",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil. Hindari jika memungkinkan.",
    lactation_note: "Absorpsi oral bayi minimal. Risiko rendah tapi data tidak cukup."
  },
  monitoring: {
    efficacy: ["Perbaikan klinis 48–72 jam", "Kultur repeat", "PCT/CRP"],
    safety: ["Kreatinin SETIAP 24 jam", "Urin output setiap jam", "Kadar gentamisin (TDM): cek 6–14 jam post-dosis (Hartford)", "Tanda ototoksisitas: gangguan keseimbangan, tinitus (evaluasi harian)"],
    frequency: "Kreatinin setiap 24 jam. TDM setelah 2–3 dosis atau segera jika ada perubahan ginjal.",
    therapeutic_range: "Once-daily: level 6–14 jam post-dosis → Hartford nomogram. Trad. q8j: Cmax 5–10 mcg/mL, Cmin <2 mcg/mL"
  },
  adverse_effects: {
    critical: ["Nefrotoksisitas AKI (10–25%) — tubular", "Ototoksisitas vestibular (5–10%) dan koklear — sering ireversibel", "Blok neuromuskular (bolus cepat atau overdosis)"],
    common: ["↑ kreatinin (dosis-dependen)", "Elektrolit: hipomagnesemia, hipokalemia", "Tromboflebitis infus"],
    antidote: "Overdosis/blok NMB: Kalsium glukonat IV. Hentikan obat segera."
  },
  interactions: {
    major: [
      { drug: "Furosemid dosis tinggi", effect: "Ototoksisitas sinergistik — kerusakan sel rambut koklea", management: "Hindari kombinasi bila mungkin. Jika harus: monitoring audiologi." },
      { drug: "Kolistin / Vankomisin", effect: "Nefrotoksisitas sinergistik", management: "Hindari kombinasi tiga serangkai." },
      { drug: "NMB (vekuronium, pankuronium)", effect: "Potensiasi blok neuromuskular", management: "Monitor TOF. Waspadai residual blok post-operasi." }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["Kombinasi sepsis gram-negatif berat", "Endokarditis Enterokokus (sinergi)"],
    deescalation_to: ["De-eskalasi ke β-laktam saja setelah 48–72 jam klinis membaik"],
    duration_standard: 5,
    duration_short: 3,
    duration_note: "Gunakan sesingkat mungkin — 3–5 hari untuk sinergi. Monoterapi: maks 7 hari. Stop jika kreatinin naik.",
    stop_criteria: "Klinis membaik + kultur sensitivitas terkonfirmasi → de-eskalasi ke β-laktam",
    avoid_for: ["Monoterapi (risiko resistensi dan toksisitas)", "Penggunaan >7 hari tanpa TDM", "Gagal ginjal berat tanpa TDM"],
    local_pattern_note: "Resistensi gentamisin di ICU Indonesia lebih tinggi dari amikasin. Pertimbangkan amikasin sebagai alternatif jika pola resistensi lokal mendukung."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "ssc2024", note: "Kombinasi aminoglikosida untuk sepsis gram-negatif berat — bukan monoterapi. Once-daily lebih efektif dan kurang toksik." }
  ]
},

"seftazidim": {
  name: "Ceftazidime",
  brand_id: ["Fortum", "Ceftazidim Dexa", "Glazidim", "Ceftazidime Kalbe"],
  brand_id_notes: "Fortum (GSK) originator. Generik luas di Indonesia. Sefalosporin gen-3 anti-pseudomonal.",
  class: "Antibiotik β-laktam",
  subclass: "Sefalosporin generasi ke-3 anti-pseudomonal",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Pilihan sefalosporin untuk infeksi Pseudomonas.",
  mechanism: "Berikatan dengan PBP Pseudomonas (PBP3 > PBP1) dan gram-negatif lainnya → inhibisi sintesis dinding sel → lisis. Stabil terhadap banyak β-laktamase gram-negatif (termasuk sefalosporinase). Tidak stabil terhadap ESBL dan metallo-β-laktamase. Aktivitas anti-Pseudomonas lebih baik dari sefalosporin gen-3 lain.",
  pkpd_type: "time_dependent",
  pkpd_note: "T>MIC target ≥40–70%. Extended infusion 3–4 jam dapat meningkatkan T>MIC untuk Pseudomonas dengan MIC intermediate. Tidak ada aktivitas terhadap gram-positif yang bermakna.",
  spectrum: {
    gram_pos: "Lemah — tidak untuk gram-positif. Tidak aktif: MRSA, Enterokokus, S. aureus.",
    gram_neg: "Sangat baik: Pseudomonas aeruginosa (pilihan utama sefalosporin). Baik: Klebsiella, E. coli, Enterobacter, H. influenzae, Proteus. Lemah: Acinetobacter.",
    anaerob: "Tidak aktif",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null,
    virus: null
  },
  indications: {
    icu_primary: ["VAP/HAP dengan risiko Pseudomonas aeruginosa (late-onset)", "Sepsis dengan sumber nosokomial risiko Pseudomonas", "Infeksi pada pasien neutropenia febris (kombinasi)"],
    icu_secondary: ["Infeksi saluran kemih komplikata (Pseudomonas atau gram-negatif MDR)", "Melioidosis (Burkholderia pseudomallei — pilihan utama)", "Infeksi paru kistik fibrosis"],
    local_guideline: "PERDICI: Ceftazidim untuk VAP/HAP risiko Pseudomonas. Melioidosis: PDPI — ceftazidim atau meropenem IV fase intensif.",
    intl_guideline: "IDSA HAP/VAP 2016: Ceftazidime sebagai pilihan anti-pseudomonal untuk VAP. Melioidosis: ceftazidim 120 mg/kg/hari IV fase intensif."
  },
  contraindications: ["Hipersensitivitas terhadap sefalosporin atau penisilin"],
  precautions: ["Penyesuaian dosis wajib pada gagal ginjal (ekskresi renal 80–90%)", "Tidak untuk gram-positif — pertimbangkan coverage tambahan", "Risiko seleksi ESBL dan AmpC β-laktamase pada Enterobacter, Serratia"],
  dosing: {
    standard: "1–2 g IV setiap 8 jam",
    range_low: "1 g IV q12j (infeksi ringan)",
    range_high: "2 g IV q8j atau q6j (Pseudomonas berat, melioidosis)",
    max: "6 g/hari (infeksi berat)",
    loading: null,
    maintenance: "Sesuaikan dengan fungsi ginjal",
    route: ["IV", "IM"],
    dilution: "1–2 g dalam 50–100 mL NaCl 0.9% atau D5W. Infus 30 menit (standar) atau 3–4 jam (extended).",
    rate: "Standar: infus 30 menit. Extended: 3–4 jam untuk Pseudomonas MIC borderline.",
    titration: null,
    special_notes: "Extended infusion 3–4 jam dianjurkan untuk Pseudomonas dengan MIC ≥4 mg/L. Tidak ada aktivitas gram-positif — tambahkan vankomisin/linezolid jika perlu coverage MRSA."
  },
  renal_adjustment: {
    ge60:   { dose: "1–2 g", interval: "q8j",  note: "Dosis penuh" },
    r30_60: { dose: "1–2 g", interval: "q12j", note: "Perpanjang interval" },
    r15_30: { dose: "1 g",   interval: "q24j", note: "Kurangi dosis dan frekuensi signifikan" },
    r_lt15: { dose: "500 mg–1 g", interval: "q24–48j", note: "Monitor neurotoksisitas (ensefalopati)" },
    hd:     { dose: "1 g",   interval: "q24j", note: "Suplementasi 1g post-HD (sangat terdialisis). Berikan setelah HD." },
    crrt:   { dose: "1–2 g", interval: "q12j", note: "Sesuaikan dengan effluent rate CRRT." },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Penyesuaian wajib pada eGFR <50. Monitor ensefalopati dan mioklonus pada dosis tinggi + gagal ginjal."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian pada gangguan hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Dapat digunakan jika indikasi kuat",
    trimester_2: "Dapat digunakan",
    trimester_3: "Dapat digunakan",
    labor_delivery: "Dapat digunakan",
    fetal_risk: "Tidak ada bukti teratogenisitas",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil. Umumnya aman.",
    lactation_note: null
  },
  monitoring: {
    efficacy: ["Klinis 48–72 jam", "Kultur repeat 48–72 jam", "PCT/CRP"],
    safety: ["Kreatinin setiap 48 jam", "Tanda neurotoksisitas (ensefalopati, mioklonus) pada gagal ginjal + dosis tinggi"],
    frequency: "Klinis harian. Renal function setiap 48 jam.",
    therapeutic_range: null
  },
  adverse_effects: {
    critical: ["Ensefalopati/mioklonus (dosis tinggi + gagal ginjal)", "Anafilaksis (jarang)"],
    common: ["Diare/C. difficile", "↑ LFT transien", "Tromboflebitis infus", "Eosinofilia"],
    antidote: null
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida (campuran)", effect: "Inaktivasi kimia jika dicampur dalam satu syringe/infus", management: "Berikan TERPISAH. Jangan campur dalam satu kantung infus." }
    ]
  },
  stewardship: {
    empiric_sources: ["VAP/HAP risiko Pseudomonas", "Sepsis nosokomial risiko Pseudomonas", "Neutropenia febris (kombinasi)"],
    deescalation_to: ["Sesuai sensitivitas kultur — narrowing jika Pseudomonas terkonfirmasi sensitivitas"],
    duration_standard: 8,
    duration_short: 7,
    duration_note: "VAP: 7–8 hari. Melioidosis fase intensif: 10–14 hari IV lalu step-down ko-trimoksazol.",
    stop_criteria: "Kultur negatif + klinis membaik + PCT turun",
    avoid_for: ["Infeksi gram-positif (tidak aktif)", "ESBL terkonfirmasi (tidak stabil)", "Monoterapi Pseudomonas berat (risiko resistensi)"],
    local_pattern_note: "Pseudomonas resistensi ceftazidim di ICU Indonesia 20–40%. Pertimbangkan meropenem atau piperasilin-tazobaktam jika resistensi tinggi secara lokal. Melioidosis endemik di Kalimantan, NTT, Papua — ceftazidim pilihan utama fase intensif."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null,
  pump_link: false,
  pump_drug_key: null,
  evidence: [
    { ref_id: "idsa_hapvap2016", note: "Anti-pseudomonal sefalosporin untuk VAP — pilihan utama coverage Pseudomonas aeruginosa" }
  ]
}

};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ICU_DRUGS;
}
