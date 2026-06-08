/* ABG Interpreter — faithful TypeScript port of calcABG() in
   assets/js/scripts-abg.js. Pure function: canonical-unit inputs ->
   structured result blocks for the React view to render. */

export type Kondisi = 'umum' | 'ards' | 'copd' | 'asthma' | 'sepsis' | 'cardiac' | 'postop'

export interface AbgInput {
  pH: number
  pco2: number // mmHg (canonical)
  hco3: number // mmol/L
  be: number
  po2?: number | null
  spo2?: number | null
  fio2?: number | null
  mapV?: number | null
  na?: number | null
  cl?: number | null
  alb?: number | null // g/dL (canonical)
  laktat?: number | null
  rr?: number | null
  kondisi: Kondisi
  spo2Source: 'pulse' | 'abg'
  paco2Unit: 'mmHg' | 'kPa'
  albUnit: 'g/dL' | 'mg/dL'
}

export interface MgmtCard {
  judul: string
  color: string
  isi: string[]
  ref: string
}

export type AbgBlock =
  | { kind: 'step'; cls: string; labelColor: string; label: string; interp?: string; details?: string[] }
  | { kind: 'list'; cls: string; labelColor: string; label: string; items: string[] }
  | { kind: 'mgmt'; label: string; cards: MgmtCard[] }
  | { kind: 'warn'; text: string }

export function estimateFiO2(device: string, flow: number): { fio2: number; text: string } {
  const isVenturi = device.startsWith('venturi')
  let fio2 = 0.21
  if (isVenturi) {
    fio2 = parseInt(device.replace('venturi', ''), 10) / 100
  } else if (device === 'nasal' && !Number.isNaN(flow)) {
    fio2 = Math.min(0.21 + 0.04 * flow, 0.44)
  } else if (device === 'simple' && !Number.isNaN(flow)) {
    if (flow <= 6) fio2 = 0.35
    else if (flow >= 10) fio2 = 0.6
    else fio2 = 0.35 + (flow - 6) * 0.0625
  } else if (device === 'nrm' && !Number.isNaN(flow)) {
    if (flow <= 10) fio2 = 0.8
    else if (flow >= 15) fio2 = 0.95
    else fio2 = 0.8 + (flow - 10) * 0.03
  }
  const text = isVenturi || !Number.isNaN(flow)
    ? `Estimasi FiO₂ ≈ ${(fio2 * 100).toFixed(0)}% (${fio2.toFixed(2)})`
    : ''
  return { fio2, text }
}

export function interpretAbg(input: AbgInput): AbgBlock[] {
  const {
    pH, pco2, hco3, be, po2, spo2, fio2, mapV, na, cl, alb, laktat, rr,
    kondisi, spo2Source, paco2Unit, albUnit,
  } = input

  const blocks: AbgBlock[] = []
  const spo2SourceLabel = spo2Source === 'pulse' ? 'SpO₂ (Pulse Ox)' : 'SaO₂ (ABG)'
  const paco2Label = paco2Unit === 'kPa'
    ? `${(pco2 / 7.5006).toFixed(1)} kPa (= ${pco2.toFixed(0)} mmHg)`
    : `${pco2.toFixed(0)} mmHg`

  // LANGKAH 1 — Status pH
  let phStatus: string, phColor: string, phClass: string
  if (pH < 7.35) {
    phStatus = pH < 7.20 ? 'Asidemia BERAT (pH <7.20)' : 'Asidemia'
    phColor = 'var(--red)'; phClass = 'abg-severe'
  } else if (pH > 7.45) {
    phStatus = pH > 7.55 ? 'Alkalemia BERAT (pH >7.55)' : 'Alkalemia'
    phColor = 'var(--amber)'; phClass = 'abg-mild'
  } else {
    phStatus = 'pH Normal (7.35–7.45)'
    phColor = 'var(--green)'; phClass = 'abg-normal'
  }
  const albDisplay = alb
    ? (albUnit === 'mg/dL' ? `${(alb * 1000).toFixed(0)} mg/dL` : `${alb.toFixed(1)} g/dL`)
    : ''
  blocks.push({
    kind: 'step', cls: phClass, labelColor: phColor, label: 'Langkah 1 — Status pH',
    interp: phStatus,
    details: [`pH = ${pH} · PaCO₂ = ${paco2Label} · HCO₃⁻ = ${hco3} mmol/L · BE = ${be} mEq/L${alb ? ` · Albumin = ${albDisplay}` : ''}`],
  })

  // LANGKAH 2 — Gangguan Primer
  const acidosis = pH < 7.35, alkalosis = pH > 7.45
  const respAcid = pco2 > 45, respAlk = pco2 < 35
  const metAcid = hco3 < 22 || be < -2, metAlk = hco3 > 26 || be > 2
  let primary = ''
  if (acidosis) {
    if (respAcid && metAcid) primary = 'Mixed: Asidosis Respiratorik + Asidosis Metabolik'
    else if (respAcid) primary = 'Asidosis Respiratorik Primer'
    else if (metAcid) primary = 'Asidosis Metabolik Primer'
    else primary = 'Asidemia — penyebab tidak jelas (cek nilai)'
  } else if (alkalosis) {
    if (respAlk && metAlk) primary = 'Mixed: Alkalosis Respiratorik + Alkalosis Metabolik'
    else if (respAlk) primary = 'Alkalosis Respiratorik Primer'
    else if (metAlk) primary = 'Alkalosis Metabolik Primer'
    else primary = 'Alkalemia — penyebab tidak jelas'
  } else {
    if (respAcid && metAlk) primary = 'pH Normal — Mixed: Asidosis Resp terkompensasi oleh Alkalosis Met'
    else if (respAlk && metAcid) primary = 'pH Normal — Mixed: Alkalosis Resp terkompensasi oleh Asidosis Met'
    else if (!respAcid && !respAlk && !metAcid && !metAlk) primary = 'ABG Normal — tidak ada gangguan primer'
    else primary = 'pH Normal dengan kompensasi atau mixed disorder'
  }
  blocks.push({
    kind: 'step', cls: 'abg-blue', labelColor: 'var(--blue)', label: 'Langkah 2 — Gangguan Primer',
    interp: primary,
    details: [`PaCO₂ = ${pco2.toFixed(0)} mmHg (N:35–45) · HCO₃⁻ = ${hco3} mmol/L (N:22–26) · BE = ${be}`],
  })

  // LANGKAH 3 — Kompensasi
  let compNote = ''
  if (respAcid && !respAlk) {
    const expAcute = 24 + 0.1 * (pco2 - 40)
    const expChronic = 24 + 0.35 * (pco2 - 40)
    if (Math.abs(hco3 - expAcute) <= 2)
      compNote = `Asidosis Resp AKUT — Kompensasi metabolik adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)}, actual: ${hco3})`
    else if (Math.abs(hco3 - expChronic) <= 3)
      compNote = `Asidosis Resp KRONIK — Kompensasi metabolik adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)}, actual: ${hco3})`
    else if (hco3 > expChronic + 3)
      compNote = `Asidosis Resp + Alkalosis Metabolik Concurrent (HCO₃⁻ ${hco3} > expected kronik ${expChronic.toFixed(1)}+3)`
    else
      compNote = `Kompensasi TIDAK ADEKUAT — Mixed disorder? Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`
  } else if (respAlk) {
    const expAcute = 24 - 0.2 * (40 - pco2)
    const expChronic = 24 - 0.5 * (40 - pco2)
    if (Math.abs(hco3 - expAcute) <= 2.5)
      compNote = `Alkalosis Resp AKUT — Kompensasi adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)})`
    else if (Math.abs(hco3 - expChronic) <= 2.5)
      compNote = `Alkalosis Resp KRONIK — Kompensasi adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)})`
    else
      compNote = `Alkalosis Resp + kemungkinan Asidosis Met Concurrent. Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`
  } else if (metAcid && hco3 < 22) {
    const expPCO2 = 1.5 * hco3 + 8
    if (Math.abs(pco2 - expPCO2) <= 2)
      compNote = `Asidosis Metabolik — Kompensasi respiratorik adekuat (Winter's: expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`
    else if (pco2 > expPCO2 + 2)
      compNote = `Asidosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > Winter's ${expPCO2.toFixed(0)})`
    else
      compNote = `Asidosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < Winter's ${expPCO2.toFixed(0)})`
  } else if (metAlk && hco3 > 26) {
    const expPCO2 = 0.7 * hco3 + 21
    if (Math.abs(pco2 - expPCO2) <= 2)
      compNote = `Alkalosis Metabolik — Kompensasi respiratorik adekuat (Expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`
    else if (pco2 < expPCO2 - 2)
      compNote = `Alkalosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < expected ${expPCO2.toFixed(0)})`
    else
      compNote = `Alkalosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > expected ${expPCO2.toFixed(0)})`
  } else {
    compNote = 'Tidak ada gangguan primer signifikan — kompensasi tidak applicable.'
  }
  blocks.push({
    kind: 'step', cls: 'abg-mild', labelColor: 'var(--amber)', label: 'Langkah 3 — Evaluasi Kompensasi',
    details: [compNote],
  })

  // LANGKAH 4 — Anion Gap
  let agHigh = false
  if (na && cl) {
    const ag = na - (cl + hco3)
    const agCorr = alb ? ag + 2.5 * (4 - alb) : null
    agHigh = agCorr ? agCorr > 14 : ag > 12
    let agNote = `AG = ${na} − (${cl} + ${hco3}) = ${ag} mEq/L (Normal 8–12)`
    if (agCorr !== null) agNote += ` · AG terkoreksi albumin: ${agCorr.toFixed(1)} (Albumin ${alb!.toFixed(1)} g/dL)`
    const details: string[] = []
    if (agHigh && metAcid) {
      const dd = (ag - 12) / (24 - hco3)
      if (dd < 0.4) details.push(`Delta-Delta = ${dd.toFixed(2)} (<0.4) → Mixed HAGMA + Non-AGMA (misalnya: ketoasidosis + RTA)`)
      else if (dd <= 1) details.push(`Delta-Delta = ${dd.toFixed(2)} (0.4–1.0) → Non-anion gap metabolic acidosis concurrent`)
      else if (dd <= 2) details.push(`Delta-Delta = ${dd.toFixed(2)} (1–2) → Pure HAGMA (tanpa komponen non-AG)`)
      else details.push(`Delta-Delta = ${dd.toFixed(2)} (>2) → HAGMA + Alkalosis Metabolik Concurrent (HCO₃⁻ lebih tinggi dari expected)`)
    }
    if (agHigh) details.push('Penyebab HAGMA: Laktat, Ketoasidosis (DKA/alkohol), Uremia, Racun (metanol/etilen glikol), Salisilat — Mnemonic LKURS')
    blocks.push({
      kind: 'step',
      cls: agHigh ? 'abg-severe' : 'abg-normal',
      labelColor: agHigh ? 'var(--red)' : 'var(--green)',
      label: `Langkah 4 — Anion Gap${agCorr !== null ? ' (terkoreksi albumin)' : ''}`,
      interp: agNote,
      details,
    })
  }

  // LANGKAH 5 — Laktat
  if (laktat) {
    const lakColor = laktat < 2 ? 'var(--green)' : laktat < 4 ? 'var(--amber)' : 'var(--red)'
    const lakNote = laktat < 2
      ? 'Normal (<2 mmol/L)'
      : laktat < 4
        ? `Hiperlaktatemia (${laktat} mmol/L) — waspada hipoperfusi/HAGMA`
        : `Laktat BERAT (${laktat} mmol/L) — asidosis laktat, mortalitas ↑ signifikan`
    blocks.push({
      kind: 'step',
      cls: laktat < 2 ? 'abg-normal' : laktat < 4 ? 'abg-mild' : 'abg-severe',
      labelColor: lakColor, label: 'Langkah 5 — Laktat', interp: lakNote,
      details: laktat >= 2 ? ['Evaluasi: syok (Tipe A), DKA, gagal hati, metformin, thiamine def (Tipe B)'] : [],
    })
  }

  // LANGKAH 6 — Oksigenasi
  if (po2 || fio2 || spo2) {
    const ox: string[] = []
    if (po2 && fio2) {
      const pf = po2 / fio2
      const pfClass = pf >= 400 ? 'Normal' : pf >= 300 ? 'Hipoksemia ringan' : pf >= 200 ? 'ARDS Mild' : pf >= 100 ? 'ARDS Moderate' : 'ARDS Severe'
      const pao2calc = fio2 * (760 - 47) - pco2 / 0.8
      const aaGrad = pao2calc - po2
      ox.push(`P/F Ratio = ${pf.toFixed(0)} → ${pfClass} · A-a Gradient = ${aaGrad.toFixed(0)} mmHg (normal <20) → ${aaGrad > 20 ? 'MENINGKAT (V/Q mismatch/shunt)' : 'Normal (hipoventilasi murni jika hipoksemia ada)'}`)
      if (mapV) {
        const oi = (mapV * fio2 * 100) / po2
        ox.push(`OI = ${oi.toFixed(1)} (${oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat — ECMO?'})`)
      }
    }
    if (spo2 && fio2 && rr) {
      const rox = (spo2 / fio2) / rr
      ox.push(`ROX Index = (${spo2}/FiO₂${fio2})/RR${rr} = ${rox.toFixed(2)} [sumber: ${spo2SourceLabel}] → ${rox >= 4.88 ? 'Risiko HFNC gagal RENDAH' : rox >= 3.85 ? 'Intermediate — evaluasi ketat' : 'Risiko HFNC gagal TINGGI → pertimbangkan intubasi'}`)
    }
    if (ox.length) {
      blocks.push({
        kind: 'step', cls: 'abg-blue', labelColor: 'var(--blue)',
        label: 'Langkah 6 — Oksigenasi & Gagal Napas', details: ox,
      })
    }
  }

  // Konsiderasi Klinis & Saran Ventilator
  const sugg: string[] = []
  if (po2 && fio2) {
    const pf = po2 / fio2
    if (pf < 100) sugg.push('P/F <100 (ARDS Severe): ↑ PEEP 13–18, prone position jika P/F <150, pertimbangkan NMB cisatrakurium, ECMO jika OI >40')
    else if (pf < 200) sugg.push('P/F 100–200 (ARDS Moderate): ↑ PEEP 8–13, FiO₂ 0.4–0.7, pertimbangkan prone jika tidak membaik')
    else if (pf < 300) sugg.push('P/F 200–300 (ARDS Mild): PEEP 5–8, FiO₂ titrasi, evaluasi ventilasi lung-protective')
  }
  if (pH < 7.25 && pco2 > 50) sugg.push('Asidosis respiratorik berat: ↑ RR atau ↑ VT (hati-hati Pplat), pertimbangkan NaHCO₃ jika pH <7.10 dengan ventilasi adekuat')
  if (pco2 < 35 && pH > 7.45) sugg.push('Alkalosis respiratorik: ↓ RR (bertahap), cek dead space, pastikan tidak ada pain/agitasi yang meningkatkan drive')
  if (metAcid && be < -5) sugg.push('Asidosis metabolik: koreksi penyebab primer (sepsis, hipovolemia, DKA). NaHCO₃ hanya jika pH <7.10 DAN ventilasi adekuat')
  if (pH > 7.50 && hco3 > 30) sugg.push('Alkalosis metabolik: koreksi hipokalemia, hipokloremia; hentikan diuretik; KCl replacement')
  if (kondisi === 'copd' && pco2 > 55) sugg.push('PPOK: TARGET PaCO₂ = baseline pasien, bukan normocapnia! Koreksi bertahap — risiko alkalosis metabolik berat')
  if (kondisi === 'ards') sugg.push('ARDS: Pertahankan driving pressure ≤15 cmH₂O. Toleransi permissive hypercapnia (PaCO₂ 45–65) jika pH >7.20')
  if (sugg.length > 0) {
    blocks.push({ kind: 'list', cls: 'abg-blue', labelColor: 'var(--blue)', label: 'Konsiderasi Klinis & Saran Ventilator', items: sugg })
  }

  // LANGKAH 7 — Koreksi Asam-Basa & Strategi Tatalaksana
  const mgmt: MgmtCard[] = []
  if (metAcid) {
    const isHAGMA = agHigh
    const isNAGMA = !!(na && cl && !agHigh)
    const bicarInd = pH < 7.10 ? '⚠ TERINDIKASI (pH <7.10)' : pH < 7.20 ? 'Pertimbangkan (pH 7.10–7.20, esp. AKI/NAGMA)' : 'Belum terindikasi — koreksi penyebab primer dulu'
    mgmt.push({
      judul: 'Koreksi Asidosis Metabolik', color: 'var(--red)',
      isi: [
        `NaHCO₃ IV: ${bicarInd}`,
        `Formula dosis: 0.5 × BBideal(kg) × (target HCO₃ − ${hco3.toFixed(0)} mmol/L) = mEq NaHCO₃ — targetkan HCO₃ 12–15, BUKAN normalisasi penuh`,
        'Pemberian: ½ dosis dalam 4 jam pertama → evaluasi AGD → ½ sisanya jika perlu. NaHCO₃ 8.4% = 1 mEq/mL; NaHCO₃ 7.5% = 0.9 mEq/mL',
        'Perhatian: NaHCO₃ → ↑ PaCO₂ transien (CO₂ release dari buffer) — pastikan ventilasi adekuat. Hindari jika alkalosis concurrent (Δ-Δ >2)',
        isHAGMA ? 'HAGMA: Prioritas koreksi kausa (laktat → resusitasi, DKA → insulin, uremia → RRT, toksik → eliminasi)' : '',
        isNAGMA ? 'NAGMA: Identifikasi etiologi — diarrhea → rehidrasi; RTA → NaHCO₃ kronik 1–2 mEq/kg/hari; dilutional → hentikan saline, ganti ke balanced crystalloid' : '',
        'Monitoring post-koreksi: pH, PaCO₂, K⁺ (hipokalemia memburuk saat pH naik), Na⁺ (hati-hati Na overload)',
      ].filter(Boolean),
      ref: 'Kraut JA, Madias NE. NEJM 2014 · Jaber S et al. Lancet 2018 (BICAR-ICU) · Berend K. NEJM 2014',
    })
  }
  if (metAlk) {
    const severeAlk = hco3 > 40 || pH > 7.55
    mgmt.push({
      judul: 'Koreksi Alkalosis Metabolik', color: 'var(--amber)',
      isi: [
        'Tentukan tipe: Chloride-responsive (urin Cl⁻ <20 mEq/L) vs Chloride-resistant (urin Cl⁻ >20 mEq/L)',
        'Chloride-responsive (muntah, NGT suction, diuretik): NaCl 0.9% IV + KCl replacement',
        'KCl IV: 10–20 mEq/jam via central line — koreksi hipokalemia WAJIB dulu (target K⁺ ≥3.5 mEq/L)',
        'Chloride-resistant (hiperaldosteronisme, Cushing, Bartter): koreksi underlying + spironolakton/amiloride',
        hco3 > 35 ? 'Acetazolamide 250–500 mg IV/8 jam: pilihan untuk CHF/fluid-overloaded (hindari eGFR <30, sulfa allergy)' : '',
        severeAlk ? 'Alkalosis BERAT (pH >7.55): pertimbangkan HCl 0.1N via CVC — dosis: 0.1 × BB × (HCO₃ aktual − 24) mEq, berikan dalam 12–24 jam, pantau ketat' : '',
        'Stop penyebab iatrogenik: kurangi/stop diuretik, hindari antasid berlebihan, kurangi transfusi sitrat',
      ].filter(Boolean),
      ref: 'Emmett M. CJASN 2020 · Gennari FJ. NEJM 1998 · Laski ME. Am J Kidney Dis 2006',
    })
  }
  if (respAcid && acidosis) {
    const permHyperCap = kondisi === 'ards' || !!(po2 && fio2 && po2 / fio2 < 200)
    mgmt.push({
      judul: 'Koreksi Asidosis Respiratorik', color: 'var(--red)',
      isi: [
        kondisi === 'copd'
          ? 'PPOK: TARGET PaCO₂ = baseline pasien (bukan 40 mmHg!) — koreksi agresif risiko alkalosis rebound berat'
          : 'Target: perbaiki ventilasi alveolar, bukan buffer HCO₃',
        kondisi === 'copd' || kondisi === 'umum'
          ? 'NIV BiPAP lini pertama (GCS baik, kooperatif): IPAP 12–18 / EPAP 4–8 cmH₂O, titrasi PaCO₂ turun 5–8 mmHg/jam'
          : '',
        'Intubasi jika: NIV gagal/kontraindikasi, GCS ↓ berat, sekresi tidak terkontrol, instabilitas hemodinamik',
        'Pada ventilator: ↑ RR 2–3/mnt bertahap (max 35/mnt), awasi auto-PEEP. ↑ VT 6→8 mL/kgBBP hanya jika Pplat <28 cmH₂O',
        permHyperCap ? 'Permissive hypercapnia (ARDS/lung-protective): toleransi PaCO₂ hingga 70 mmHg jika pH >7.20 dan driving pressure ≤15 cmH₂O — JANGAN ↑ VT untuk "normalisasi" CO₂' : '',
        'NaHCO₃ TIDAK diindikasikan untuk asidosis resp murni — hanya sebagai bridge jika pH <7.10 dan ventilasi optimal sudah tercapai',
        'Bronkodilator nebulisasi: salbutamol 2.5 mg + ipratropium 0.5 mg q4–6h (esp. PPOK/asma)',
      ].filter(Boolean),
      ref: 'GOLD 2024 · Rochwerg B. Eur Respir J 2017 (NIV) · Matthay MA. NEJM 2019 · Slutsky AS. NEJM 2013 (lung-protective)',
    })
  }
  if (respAlk && alkalosis) {
    mgmt.push({
      judul: 'Koreksi Alkalosis Respiratorik', color: 'var(--amber)',
      isi: [
        'Koreksi penyebab: nyeri → analgesia (morfin/fentanyl titrasi); agitasi → sedasi (propofol/midazolam titrasi); sepsis → kultur + antibiotik',
        'Pada ventilator: ↓ RR 2/mnt bertahap (min 10/mnt), atau tambah dead space connector (increase anatomical dead space)',
        'Target pH <7.50 secara bertahap — koreksi terlalu cepat dapat presipitasi seizure (alkalosis akut → vasokonstriksi serebral)',
        'Elektrolit yang sering terganggu: hipokalemia, hipofosfatemia, hipokalsemia ionik — koreksi bersamaan',
        'Liver failure: alkalosis resp persisten akibat hiperammonemia — tidak bisa dicegah tanpa koreksi kausa hepatik',
        'Cek VD/VT meningkat jika PaCO₂ rendah persisten meski RR sudah diturunkan (dead space patologis)',
      ],
      ref: 'Berend K. NEJM 2014 · Laffey JG. NEJM 2002 · Seifter JL. NEJM 2023',
    })
  }
  if (agHigh && laktat && laktat >= 2) {
    mgmt.push({
      judul: 'Asidosis Laktat / HAGMA', color: 'var(--blue)',
      isi: [
        'Target MAP ≥65 mmHg — resusitasi dengan Ringer Laktat atau PlasmaLyte (lebih sedikit dilutional acidosis vs NaCl 0.9%)',
        'Norepinefrin lini pertama jika MAP tidak respons cairan: 0.1–0.5 mcg/kg/mnt via central, titrasi',
        `Laktat clearance: target ≥10% penurunan per 2 jam. Laktat saat ini: ${laktat} mmol/L${laktat >= 4 ? ' — BERAT, mortalitas ↑' : ''}`,
        `NaHCO₃: ${pH < 7.10 ? `TERINDIKASI (pH <7.10) — dosis 0.5 × BBideal × (15 − ${hco3.toFixed(0)}) mEq, berikan ½ dalam 4 jam` : pH < 7.20 ? 'Pertimbangkan jika AKI concurrent (BICAR-ICU benefit subgroup)' : 'Belum terindikasi — koreksi kausa primer dulu'}`,
        'Koreksi kausa primer: sepsis (antibiotik <1 jam dari onset), iskemia (revaskularisasi), DKA (insulin), hepatik (koreksi koagulopati)',
        'Tiamin IV 100–200 mg jika suspek defisiensi (alkohol, malnutrisi, refrakter terhadap resusitasi)',
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Jaber S. Lancet 2018 (BICAR-ICU) · Levy B. Chest 2015',
    })
  }
  if (agHigh && (!laktat || laktat < 4) && metAcid) {
    mgmt.push({
      judul: 'Kemungkinan DKA / Ketoasidosis', color: 'var(--blue)',
      isi: [
        'Cek GDS, keton darah (beta-hydroxybutyrate), K⁺, Mg²⁺, fosfat sebelum mulai terapi',
        'Resusitasi cairan: NaCl 0.9% 1 L/jam pertama (1–2 jam), lanjut 250–500 mL/jam sesuai hidrasi + output',
        '⚠ CEK K⁺ DAHULU — jika K⁺ <3.5: TUNDA insulin, berikan KCl 20–40 mEq/jam IV sampai K⁺ ≥3.5',
        'Insulin regular IV: 0.1 unit/kgBB/jam (setelah K⁺ ≥3.5). Target: ↓ GDS 50–75 mg/dL/jam, AG normalisasi',
        'Ganti ke D5%/D10% + insulin saat GDS <200 (DKA) atau <250 (HHS) mg/dL — jaga agar GDS 150–200',
        'Fosfat: koreksi jika <1 mg/dL atau ada kelemahan otot napas',
        'NaHCO₃ pada DKA: hanya jika pH <7.0 setelah 1 jam resusitasi (ADA 2024 — kontroversi)',
      ],
      ref: 'ADA Standards of Care 2024 · Kitabchi AE. Diabetes Care 2009 · Umpierrez GE. Endocr Rev 2023',
    })
  }
  if (kondisi === 'ards' || (po2 && fio2 && po2 / fio2 < 300)) {
    const pf = po2 && fio2 ? po2 / fio2 : null
    mgmt.push({
      judul: 'Manajemen ARDS', color: 'var(--blue)',
      isi: [
        'Lung-Protective Ventilation: VT 6 mL/kgBBP, Pplat ≤28 cmH₂O, Driving Pressure ≤15 cmH₂O, PEEP per ARDSNet table',
        pf && pf < 150 ? '🔄 Prone positioning: ≥16 jam/hari — wajib jika P/F <150 (PROSEVA 2013, NNT=8 untuk mortalitas)' : 'Prone positioning: pertimbangkan jika P/F tidak membaik 12–24 jam (threshold P/F <200–300 per PROSEVA update)',
        pf && pf < 120 ? '💊 Neuromuscular blockade: cisatracurium 37.5 mg bolus → 37.5 mg/jam drip IV (48 jam awal, jika RASS ≤-3)' : '',
        'Konservasi cairan: fluid-restrictive strategy hari 2–7 setelah stabilisasi hemodinamik (FACTT trial)',
        pf && pf < 80 ? '🔴 Pertimbangkan ECMO-VV: jika OI >40 atau P/F <80 refrakter ≥6 jam (EOLIA 2018 — konsultasi ECMO center segera)' : '',
        'Kortikosteroid: deksametason 6 mg/hari IV — dipertimbangkan pada ARDS moderate-severe (RECOVERY 2021, DEXA-ARDS 2020)',
        'Target: SpO₂ 92–96%, pH >7.20 (toleransi permissive hypercapnia), Pplat <28, driving pressure <15',
      ].filter(Boolean),
      ref: 'Matthay MA. NEJM 2019 · Guérin C. NEJM 2013 (PROSEVA) · Combes A. NEJM 2018 (EOLIA) · Villar J. Lancet Respir Med 2020 (DEXA-ARDS) · Slutsky AS. NEJM 2013',
    })
  }
  if (kondisi === 'sepsis' || (laktat && laktat >= 2 && agHigh)) {
    mgmt.push({
      judul: 'Manajemen Sepsis / Syok Septik (SSC 2021)', color: 'var(--blue)',
      isi: [
        '⏱ HOUR-1 BUNDLE: Kultur darah (2 set, aerob+anaerob) → Antibiotik broad-spectrum IV → Laktat → Akses IV → Resusitasi',
        'Cairan: 30 mL/kgBB balanced crystalloid (RL preferred) dalam 3 jam; nilai respons cairan dengan PLR / VTI / PPV — STOP jika tidak responsif (cegah fluid overload)',
        'Vasopressor: Norepinefrin lini pertama 0.01–0.5 mcg/kg/mnt via central/IO, target MAP ≥65 mmHg (atau ≥80 jika riwayat hipertensi)',
        'Vasopressin 0.03 unit/mnt: tambahkan jika dosis NE >0.25 mcg/kg/mnt (sparing effect, turunkan NE dose)',
        'Kortikosteroid: hidrokortison 200 mg/hari IV (50 mg/6 jam atau infus kontinu) jika refrakter vasopressor — bukan semua sepsis',
        `Laktat monitoring: target clearance ≥10%/2 jam (saat ini: ${laktat || '?'} mmol/L). ScvO₂ ≥70%; transfusi PRC jika Hb <7 dan ScvO₂ rendah`,
        'Antibiotik: de-eskalasi setelah 48–72 jam sesuai kultur. Durasi: 5–7 hari untuk respons klinis baik (IDSA/SSC)',
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Levy MM. Crit Care Med 2018 · Rhodes A. Intensive Care Med 2017',
    })
  }
  if (kondisi === 'cardiac') {
    mgmt.push({
      judul: 'Edema Paru Kardiogenik Akut', color: 'var(--blue)',
      isi: [
        'Posisi duduk 90°, oksigen → NIV (CPAP 5–10 cmH₂O atau BiPAP 8–12/5 cmH₂O) — turunkan preload, afterload, WOB',
        'Furosemide IV: 40–80 mg bolus (2× dosis oral harian) atau infus 5–10 mg/jam; target UO ≥100 mL/jam 2 jam pertama',
        'Nitrogliserin IV: mulai 10–20 mcg/mnt, titrasi 10–20 mcg/mnt tiap 5 mnt jika sistolik >100 mmHg (turunkan afterload)',
        'HINDARI cairan berlebihan — resusitasi hanya jika ada bukti hipovolemia konkuren (RV failure, tamponade)',
        'Low output / kardiogenik syok: dobutamin 2–10 mcg/kgBB/mnt (ionotropik) + NE jika MAP tidak tercapai',
        'Intubasi: jika gagal NIV, GCS ↓, asidosis berat (pH <7.20), atau distres napas yang tidak terkontrol',
        'Koreksi penyebab precipitating: ACS (kateterisasi emergent), AF rapid (rate control/kardioversi), hipertensif emergensi (NTG IV)',
      ],
      ref: 'McDonagh TA et al. Eur Heart J 2021 (ESC HF) · Mebazaa A. Intensive Care Med 2018 · Masip J. Eur Heart J Acute Cardiovasc Care 2022',
    })
  }
  if (mgmt.length > 0) {
    blocks.push({ kind: 'mgmt', label: 'Langkah 7 — Koreksi Asam-Basa & Strategi Tatalaksana', cards: mgmt })
  }

  blocks.push({
    kind: 'warn',
    text: 'Interpretasi ABG ini adalah panduan sistematis berbasis algoritma standar. Keputusan klinis tetap berdasarkan kondisi pasien secara keseluruhan dan kebijakan institusi. Konfirmasi dengan spesialis pada kasus kompleks.',
  })

  return blocks
}
