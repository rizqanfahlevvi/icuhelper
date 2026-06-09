/* Navigation model ported from assets/js/nav.js.
   Strangler-fig migration: items already converted to React point to an
   internal SPA route via `to`; not-yet-migrated items keep `href` to the
   legacy MPA pages (absolute from site root). As waves progress, flip
   `href` -> `to`. */

export interface NavSub {
  label: string
  to?: string
  href?: string
}

export interface NavItem {
  id: string
  icon: string
  label: string
  to?: string
  href?: string
  title: string
  subtitle: string
  subs: NavSub[]
}

export const PAGES: NavItem[] = [
  {
    id: 'index', icon: 'home', label: 'Home', to: '/',
    title: 'ICU Helper',
    subtitle: 'Panduan Klinis Lengkap · Referensi Lokal & Internasional · v2.0 — 2026',
    subs: [],
  },
  {
    id: 'teori', icon: 'book-open', label: 'Teori', to: '/teori',
    title: 'Teori — Fisiologi & Patofisiologi ICU',
    subtitle: 'Gagal Napas · Fisiologi Paru · ARDS · Sepsis · B1–B6 · Airway & Intubasi · SAT/SBT/VAP',
    subs: [
      { label: 'Impending Gagal Napas', to: '/teori/impending' },
      { label: 'Fisiologi Pernapasan', to: '/teori/fisiologi' },
      { label: 'Gagal Napas & ARDS', to: '/teori/gagal-napas' },
      { label: 'Sepsis & Syok Septik', to: '/teori/sepsis' },
      { label: 'B1–B6 Bedside Assessment', to: '/teori/b1b6' },
      { label: 'Airway & Intubasi', to: '/teori/airway' },
      { label: 'SAT · SBT · VAP Bundle', to: '/teori/sat-sbt-vap' },
    ],
  },
  {
    id: 'kalkulator', icon: 'calculator', label: 'Kalkulator', to: '/kalkulator/ibw',
    title: 'Kalkulator Klinis',
    subtitle: 'IBW · Sedasi & RSI · Syringe Pump · P/F & OI · Renal · Pulmo · ElektroCorr · NLR · Transfusi · Cairan',
    subs: [
      { label: 'IBW & Ventilator', to: '/kalkulator/ibw' },
      { label: 'Sedasi & RSI', to: '/kalkulator/sedasi' },
      { label: 'Syringe Pump', to: '/kalkulator/pump' },
      { label: 'P/F & OI', to: '/kalkulator/pf' },
      { label: 'Renal', to: '/kalkulator/renal' },
      { label: 'Pulmo', to: '/kalkulator/pulmo' },
      { label: 'ElektroCorr', to: '/kalkulator/elektro' },
      { label: 'NLR & Biomarker', to: '/kalkulator/nlr' },
      { label: 'Transfusi', to: '/kalkulator/transfusi' },
      { label: 'Cairan Harian', to: '/kalkulator/cairan' },
    ],
  },
  {
    id: 'drug_ref', icon: 'pill', label: 'Drug Ref', to: '/drug-ref',
    title: 'Drug Reference ICU',
    subtitle: '~70 obat ICU · eGFR mode · Vasopressor · Antibiotik · High-Alert',
    subs: [],
  },
  {
    id: 'cairan', icon: 'droplet', label: 'Cairan', to: '/cairan-iv',
    title: 'Cairan IV',
    subtitle: 'Kristaloid · Koloid · Maintenance · Nutrisi Parenteral',
    subs: [],
  },
  {
    id: 'abg', icon: 'activity', label: 'ABG', to: '/abg',
    title: 'ABG Interpreter',
    subtitle: 'Analisis Gas Darah 6-Langkah · Delta-Delta · ROX Index · A-a Gradient',
    subs: [],
  },
  {
    id: 'skoring', icon: 'clipboard-list', label: 'Skoring', to: '/skoring',
    title: 'Skoring ICU',
    subtitle: 'SOFA · APACHE-II · RASS · CAM-ICU · CPIS · Frailty · Candida',
    subs: [
      { label: 'SOFA Score', to: '/skoring/sofa' },
      { label: 'APACHE-II', to: '/skoring/apache' },
      { label: 'RASS — Sedasi', to: '/skoring/rass' },
      { label: 'CAM-ICU — Delirium', to: '/skoring/camicu' },
      { label: 'CPIS — VAP', to: '/skoring/cpis' },
      { label: 'Frailty Scale', to: '/skoring/cfs' },
      { label: 'Candida Score', to: '/skoring/candida' },
    ],
  },
  {
    id: 'weaning', icon: 'arrow-down-circle', label: 'Weaning', to: '/weaning',
    title: 'Weaning & Ekstubasi',
    subtitle: 'Protokol SAT+SBT · Kriteria Ekstubasi · RSBI · HACOR · HFNC/NIV',
    subs: [],
  },
  {
    id: 'monitoring', icon: 'monitor', label: 'Monitoring', to: '/monitoring',
    title: 'Monitoring',
    subtitle: 'Monitoring, Troubleshooting & Komplikasi',
    subs: [],
  },
  {
    id: 'protocol', icon: 'clipboard', label: 'Protocol', to: '/protocol',
    title: 'Protocol Builder', subtitle: 'Buat & simpan protokol klinis ICU — ARDS · Sepsis · Weaning · VAP', subs: [],
  },
  {
    id: 'monitoring-dashboard', icon: 'trending-up', label: 'Vital Trend', to: '/monitoring-dashboard',
    title: 'Monitoring Dashboard', subtitle: 'Catat & visualisasikan tren vital signs — SpO₂ · HR · MAP · Laktat', subs: [],
  },
  {
    id: 'setting', icon: 'settings', label: 'Setting', to: '/setting',
    title: 'Setting Ventilator',
    subtitle: 'Setting per Kondisi Klinis · ARDS · PPOK · Asma · Sepsis',
    subs: [],
  },
  {
    id: 'referensi', icon: 'book-text', label: 'Referensi', to: '/referensi',
    title: 'Referensi',
    subtitle: 'Daftar Pustaka Internasional & Lokal Indonesia · Guidelines Terkini',
    subs: [],
  },
]

/* 5 thumb-friendly items for the mobile bottom bar. */
export const BOTTOM_NAV: { id: string; icon: string; label: string; to?: string; href?: string }[] = [
  { id: 'index', icon: 'home', label: 'Home', to: '/' },
  { id: 'kalkulator', icon: 'calculator', label: 'Kalkulator', to: '/kalkulator/ibw' },
  { id: 'abg', icon: 'activity', label: 'ABG', to: '/abg' },
  { id: 'skoring', icon: 'clipboard-list', label: 'Skoring', to: '/skoring' },
  { id: 'drug_ref', icon: 'pill', label: 'Obat', to: '/drug-ref' },
]
