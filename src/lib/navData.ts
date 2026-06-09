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
    id: 'teori', icon: 'book-open', label: 'Teori', href: '/pages/teori.html',
    title: 'Teori — Fisiologi & Patofisiologi ICU',
    subtitle: 'Gagal Napas · Fisiologi Paru · ARDS · Sepsis · B1–B6 · Airway & Intubasi · SAT/SBT/VAP',
    subs: [
      { label: 'Impending Gagal Napas', href: '/pages/teori/teori-impending.html' },
      { label: 'Fisiologi Pernapasan', href: '/pages/teori/teori-fisiologi.html' },
      { label: 'Gagal Napas & ARDS', href: '/pages/teori/teori-gagalnapas.html' },
      { label: 'Sepsis & Syok Septik', href: '/pages/teori/teori-sepsis.html' },
      { label: 'B1–B6 Bedside Assessment', href: '/pages/teori/teori-b1b6.html' },
      { label: 'Airway & Intubasi', href: '/pages/teori/teori-airway.html' },
      { label: 'SAT · SBT · VAP Bundle', href: '/pages/teori/teori-sat-sbt-vap.html' },
    ],
  },
  {
    id: 'kalkulator', icon: 'calculator', label: 'Kalkulator', href: '/pages/kalkulator.html',
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
    id: 'cairan', icon: 'droplet', label: 'Cairan', href: '/pages/cairan.html',
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
    id: 'weaning', icon: 'arrow-down-circle', label: 'Weaning', href: '/pages/weaning.html',
    title: 'Weaning & Ekstubasi',
    subtitle: 'Protokol SAT+SBT · Kriteria Ekstubasi · RSBI · HACOR · HFNC/NIV',
    subs: [],
  },
  {
    id: 'monitoring', icon: 'monitor', label: 'Monitoring', href: '/pages/monitoring.html',
    title: 'Monitoring',
    subtitle: 'Monitoring, Troubleshooting & Komplikasi',
    subs: [],
  },
  {
    id: 'setting', icon: 'settings', label: 'Setting', href: '/pages/setting.html',
    title: 'Setting Ventilator',
    subtitle: 'Setting per Kondisi Klinis · ARDS · PPOK · Asma · Sepsis',
    subs: [],
  },
  {
    id: 'referensi', icon: 'book-text', label: 'Referensi', href: '/pages/referensi.html',
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
