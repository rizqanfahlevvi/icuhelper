/* ============================================================
   scripts-drugs.ts — ICU Helper Drug Reference Engine
   Depends on: ICU_DRUGS (assets/data/drugs.js)
   ============================================================ */

/*
 * Inline drug-database shapes below are intentionally looser than types.ts —
 * drugs.js uses optional/partial fields that don't fully satisfy the strict
 * types.ts Drug interface. These local interfaces match the actual data shape.
 * Do NOT replace with imports from types.ts without first ensuring drugs.js
 * conforms to the strict schema.
 */
interface RenalDoseEntry {
  dose?: string;
  interval?: string;
  route?: string | null;
  note?: string;
}

interface RenalAdjustment {
  ge60?:   RenalDoseEntry | string;
  r30_60?: RenalDoseEntry | string;
  r15_30?: RenalDoseEntry | string;
  r_lt15?: RenalDoseEntry | string;
  hd?:     RenalDoseEntry | string;
  crrt?:   RenalDoseEntry | string;
  badge?:  BadgeKey;
  dialyzable?: boolean;
  monitoring_renal?: string;
  [key: string]: RenalDoseEntry | string | boolean | BadgeKey | undefined;
}

interface HepaticAdjustment {
  child_a?: string;
  child_b?: string;
  child_c?: string;
  note?: string;
}

interface DrugIndications {
  icu_primary?:    string[];
  icu_secondary?:  string[];
  local_guideline?: string;
  intl_guideline?:  string;
}

interface Spectrum {
  gram_pos?:    string | boolean | null;
  gram_neg?:    string | boolean | null;
  anaerob?:     string | boolean | null;
  mrsa?:        boolean | null;
  esbl?:        boolean | null;
  pseudomonas?: boolean | null;
  [key: string]: string | boolean | null | undefined;
}

interface DrugDosing {
  standard?:      string;
  loading?:       string | null;
  maintenance?:   string;
  range_low?:     string;
  range_high?:    string;
  max?:           string;
  route?:         string[];
  dilution?:      string;
  rate?:          string;
  titration?:     string | null;
  special_notes?: string;
}

interface Pregnancy {
  fda_category?:  string;
  fetal_risk?:    string;
  trimester_1?:   string;
  trimester_2?:   string;
  trimester_3?:   string;
  labor_delivery?: string;
  lactation?:     string;
  lactation_note?: string;
}

interface DrugMonitoring {
  efficacy?:          string[];
  safety?:            string[];
  frequency?:         string;
  therapeutic_range?: string | null;
}

interface AdverseEffects {
  critical?: string[];
  common?:   string[];
  antidote?: string | null;
}

interface DrugInteractionEntry {
  drug?:       string;
  effect?:     string;
  management?: string;
}

interface DrugInteractions {
  major?:    Array<DrugInteractionEntry | string>;
  moderate?: Array<DrugInteractionEntry | string>;
  minor?:    Array<DrugInteractionEntry | string>;
}

interface Stewardship {
  empiric_sources?:   string[];
  duration_standard?: number | string;
  duration_short?:    number | string;
  duration_note?:     string;
  stop_criteria?:     string;
  deescalation_to?:   string[];
  avoid_for?:         string[];
  local_pattern_note?: string;
}

interface EvidenceRef {
  ref_id: string;
  note:   string;
}

interface Drug {
  name:                string;
  brand_id?:           string[];
  brand_id_notes?:     string;
  class?:              string;
  subclass?:           string;
  category?:           string[];
  mechanism?:          string;
  pkpd_type?:          string | null;
  pkpd_note?:          string | null;
  spectrum?:           Spectrum | null;
  indications?:        DrugIndications;
  contraindications?:  string[];
  precautions?:        string[];
  dosing?:             DrugDosing;
  renal_adjustment?:   RenalAdjustment;
  hepatic_adjustment?: HepaticAdjustment;
  pregnancy?:          Pregnancy;
  monitoring?:         DrugMonitoring;
  adverse_effects?:    AdverseEffects;
  interactions?:       DrugInteractions;
  stewardship?:        Stewardship | null;
  high_alert?:         boolean;
  high_alert_warnings?: string[];
  high_alert_protocol?: string | null;
  pump_link?:          boolean;
  pump_drug_key?:      string | null;
  evidence?:           EvidenceRef[];
}

declare const ICU_DRUGS: Record<string, Drug>;

/* ── Types ── */
type BadgeKey = 'safe' | 'adjust' | 'reduce' | 'avoid';
type BandKey  = 'all' | 'ge60' | 'r30_60' | 'r15_30' | 'r_lt15' | 'hd' | 'crrt';
type SortKey  = 'name' | 'category' | 'renal_flag';

interface BadgeConfig {
  label: string;
  cls:   string;
}

interface VasopressorStep {
  step:     number;
  agent:    string;
  dose:     string;
  note:     string;
  drug_key: string | null;
}

interface VasopressorGroup {
  label: string;
  icon:  string;
  color: string;
  steps: VasopressorStep[];
}

interface SedationAgent {
  name:     string;
  dose:     string;
  note:     string;
  drug_key: string;
}

interface SedationLevel {
  level:       number;
  label:       string;
  color:       string;
  description: string;
  agents:      SedationAgent[];
}

;(function (): void {
  'use strict';

  /* ── State ── */
  let currentBand:   BandKey  = 'all';
  let currentCat:    string   = 'all';
  let currentSearch: string   = '';
  let currentSort:   SortKey  = 'name';
  let allDrugIds:    string[] = [];

  /* ── Badge config ── */
  const BADGE_CONFIG: Record<BadgeKey, BadgeConfig> = {
    safe:   { label: '✓ AMAN',      cls: 'badge-safe'   },
    adjust: { label: '⚠ SESUAIKAN', cls: 'badge-adjust' },
    reduce: { label: '↓ KURANGI',   cls: 'badge-reduce' },
    avoid:  { label: '✗ HINDARI',   cls: 'badge-avoid'  }
  };

  const BAND_LABELS: Record<BandKey, string> = {
    all:    'Normal (≥60)',
    ge60:   '≥60 mL/min',
    r30_60: '30–60 mL/min',
    r15_30: '15–30 mL/min',
    r_lt15: '<15 mL/min',
    hd:     'Hemodialisis',
    crrt:   'CRRT'
  };

  /* ── Vasopressor Flowchart ── */
  const VASOPRESSOR_FLOWCHART: Record<string, VasopressorGroup> = {
    distributive: {
      label: 'Syok Distributif / Septik',
      icon: '🦠',
      color: '#f97316',
      steps: [
        { step: 1, agent: 'Norepinefrin',   dose: '0.01–0.5 mcg/kg/min',          note: 'First-line. SSC 2024. Titrasi MAP ≥65 mmHg.',                                                                                                       drug_key: 'norepinefrin' },
        { step: 2, agent: '+ Vasopressin',  dose: '0.03–0.04 IU/min (tetap)',      note: 'Tambahkan jika NE ≥0.25 mcg/kg/min. Sparing katekolamin.',                                                                                           drug_key: 'vasopressin'  },
        { step: 3, agent: '+ Epinefrin',    dose: '0.01–0.5 mcg/kg/min',          note: 'Jika MAP tetap <65 meski NE + vasopressin. Atau jika ada disfungsi miokard.',                                                                         drug_key: 'epinefrin'    },
        { step: 4, agent: '± Dobutamin',    dose: '2–20 mcg/kg/min',              note: 'Tambahkan jika ScvO₂ <70% atau tanda hipoperfusi persisten. Bukan untuk MAP.',                                                                        drug_key: 'dobutamin'    }
      ]
    },
    cardiogenic: {
      label: 'Syok Kardiogenik',
      icon: '🫀',
      color: '#ef4444',
      steps: [
        { step: 1, agent: 'Norepinefrin',      dose: '0.01–0.3 mcg/kg/min',              note: 'Pertahankan perfusi. MAP ≥65 mmHg. Gunakan dosis rendah.',                                                                    drug_key: 'norepinefrin' },
        { step: 2, agent: '+ Dobutamin',       dose: '2–20 mcg/kg/min',                  note: 'Tingkatkan cardiac output (CI target >2.2 L/min/m²). Kombinasi dengan NE.',                                                   drug_key: 'dobutamin'    },
        { step: 3, agent: 'Atau Milrinon',     dose: '0.375–0.75 mcg/kg/min',            note: 'Jika pasien dalam β-blocker kronik atau down-regulated β-receptor.',                                                           drug_key: 'milrinon'     },
        { step: 4, agent: 'Atau Levosimendan', dose: '0.05–0.2 mcg/kg/min × 24 jam',    note: 'Refrakter dobutamin/milrinon. Efek berlanjut 7–9 hari via OR-1896.',                                                           drug_key: 'levosimendan' }
      ]
    },
    hypovolemic: {
      label: 'Syok Hipovolemik',
      icon: '💧',
      color: '#3b82f6',
      steps: [
        { step: 1, agent: 'Resusitasi Cairan',       dose: '30 mL/kg kristaloid (jika sepsis)', note: 'KOREKSI VOLUME DULU. Vasopressor sebelum volume koreksi memperburuk outcome.',                                         drug_key: null           },
        { step: 2, agent: 'Norepinefrin (bridge)',   dose: '0.01–0.1 mcg/kg/min',               note: 'Bridge sementara jika MAP sangat rendah mengancam jiwa, sambil koreksi volume.',                                       drug_key: 'norepinefrin' }
      ]
    },
    obstructive: {
      label: 'Syok Obstruktif',
      icon: '🚧',
      color: '#a855f7',
      steps: [
        { step: 1, agent: 'Norepinefrin (bridge)', dose: '0.01–0.3 mcg/kg/min', note: 'Bridge sementara. KOREKSI PENYEBAB (PE → trombolisis/embolektomi; tension PTX → dekompresi; tamponade → perikardiosentesis).', drug_key: 'norepinefrin' }
      ]
    }
  };

  /* ── Sedation Ladder ── */
  const SEDATION_LADDER: SedationLevel[] = [
    {
      level: 1,
      label: 'Analgesia Saja (RASS 0 hingga -1)',
      color: '#22c55e',
      description: 'Pasien tidak terintubasi atau baru intubasi, tidak ada agitasi bermakna.',
      agents: [
        { name: 'Fentanil',       dose: '25–100 mcg/jam infus atau bolus PRN',   note: 'Analgesia-first. CPOT target 0–2.',                                         drug_key: 'fentanil'       },
        { name: 'Parasetamol IV', dose: '1g IV q6–8j (multimodal)',              note: 'Opioid-sparing. Aman semua kondisi kecuali gagal hati berat.',               drug_key: 'parasetamol_iv' },
        { name: 'Ketorolak',      dose: '15–30 mg IV q6j (maks 5 hari)',         note: 'Bila tidak ada kontraindikasi renal/GI.',                                    drug_key: 'ketorolak'      }
      ]
    },
    {
      level: 2,
      label: 'Sedasi Ringan (RASS -1 hingga -2)',
      color: '#3b82f6',
      description: 'Pasien terintubasi dengan agitasi ringan atau untuk memfasilitasi ventilasi.',
      agents: [
        { name: 'Deksmedetomidin', dose: '0.2–0.7 mcg/kg/jam',  note: 'Pilihan utama — pasien masih bisa komunikasi, non-GABA, preservasi napas.', drug_key: 'deksmedetomidin' },
        { name: 'Propofol',        dose: '5–30 mcg/kg/min',      note: 'Alternatif. Onset/offset cepat. Hitung kalori lemak.',                      drug_key: 'propofol'        }
      ]
    },
    {
      level: 3,
      label: 'Sedasi Dalam (RASS -3 hingga -4)',
      color: '#f97316',
      description: 'ARDS berat (P/F <150), asinkroni ventilator refrakter, prosedur.',
      agents: [
        { name: 'Propofol',             dose: '10–50 mcg/kg/min (maks 4 mg/kg/jam)', note: 'Monitor TG setiap 48 jam. Waspadai PRIS jika >48–72 jam dosis tinggi.',               drug_key: 'propofol'       },
        { name: 'Midazolam',            dose: '0.02–0.1 mg/kg/jam',                  note: 'Jika propofol tidak tersedia/kontraindikasi. Risiko delirium lebih tinggi.',            drug_key: 'midazolam'      },
        { name: '+ NMB (Sisatrakurium)',dose: '0.5–3 mcg/kg/min',                    note: 'Tambahkan jika P/F <150 + dyssynchrony persisten. PASTIKAN sedasi adekuat DULU.',      drug_key: 'sisatrakurium'  }
      ]
    },
    {
      level: 4,
      label: 'Sedasi Refrakter / Status Epileptikus',
      color: '#ef4444',
      description: 'Status epileptikus refrakter (RSE), agitasi berat tidak terkontrol.',
      agents: [
        { name: 'Propofol', dose: 'Hingga 4 mg/kg/jam (batas PRIS)',             note: 'Lini pertama RSE: 1–5 mg/kg/jam. EEG monitoring.',                                      drug_key: 'propofol'    },
        { name: 'Ketamin',  dose: '1–2 mg/kg/jam infus',                         note: 'Status epileptikus refrakter. Mempertahankan MAP — berguna pada syok bersamaan.',        drug_key: 'ketamin_icu' },
        { name: 'Tiopental',dose: '3–5 mg/kg bolus → 1–5 mg/kg/jam',            note: 'Lini ketiga RSE. EEG burst-suppression. Hemodinamik tidak stabil.',                      drug_key: 'tiopental'   }
      ]
    }
  ];

  /* ── Render Vasopressor Flowchart ── */
  function renderVasopressorFlowchart(): void {
    const container = document.getElementById('vasopressor-flowchart');
    if (!container) return;
    let html = '<div class="flowchart-grid">';
    Object.keys(VASOPRESSOR_FLOWCHART).forEach(function(key: string): void {
      const fc = VASOPRESSOR_FLOWCHART[key];
      html += '<div class="flowchart-card" style="border-color:' + fc.color + '20;background:' + fc.color + '08">';
      html += '<div class="flowchart-header" style="border-bottom:2px solid ' + fc.color + '">';
      html += '<span style="font-size:18px">' + fc.icon + '</span>';
      html += '<strong style="color:' + fc.color + '">' + esc(fc.label) + '</strong>';
      html += '</div>';
      html += '<div class="flowchart-steps">';
      fc.steps.forEach(function(s: VasopressorStep): void {
        html += '<div class="flowchart-step">';
        html += '<div class="step-num" style="background:' + fc.color + '">' + s.step + '</div>';
        html += '<div class="step-body">';
        html += '<div class="step-agent">' + esc(s.agent) + '</div>';
        html += '<div class="step-dose">' + esc(s.dose) + '</div>';
        html += '<div class="step-note">' + esc(s.note) + '</div>';
        if (s.drug_key && ICU_DRUGS[s.drug_key]) {
          html += '<button class="step-detail-btn" data-drug-key="' + esc(s.drug_key) + '">→ Lihat detail</button>';
        }
        html += '</div></div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /* ── Render Sedation Ladder ── */
  function renderSedationLadder(): void {
    const container = document.getElementById('sedation-ladder');
    if (!container) return;
    let html = '<div class="ladder-list">';
    SEDATION_LADDER.forEach(function(rung: SedationLevel): void {
      html += '<div class="ladder-rung" style="border-left:4px solid ' + rung.color + '">';
      html += '<div class="ladder-header">';
      html += '<span class="ladder-level" style="background:' + rung.color + '">Level ' + rung.level + '</span>';
      html += '<strong class="ladder-label">' + esc(rung.label) + '</strong>';
      html += '</div>';
      html += '<div class="ladder-desc">' + esc(rung.description) + '</div>';
      html += '<div class="ladder-agents">';
      rung.agents.forEach(function(a: SedationAgent): void {
        html += '<div class="ladder-agent">';
        html += '<span class="la-name">' + esc(a.name) + '</span>';
        html += '<span class="la-dose">' + esc(a.dose) + '</span>';
        html += '<span class="la-note">' + esc(a.note) + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /* ── Helpers ── */
  function esc(str: string | number | null | undefined): string {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getBandKey(band: BandKey): string {
    return band === 'all' ? 'ge60' : band;
  }

  /* ── Get eGFR badge for a drug at current band ── */
  function getEgfrBadge(drug: Drug, band: BandKey): BadgeConfig | null {
    if (!drug.renal_adjustment) return null;
    const badgeKey: BadgeKey | undefined = band === 'all' ? undefined : drug.renal_adjustment.badge as BadgeKey | undefined;
    if (!badgeKey || band === 'all') return null;
    return BADGE_CONFIG[badgeKey] ?? null;
  }

  /* ── Render compact card (click → modal) ── */
  function renderCard(id: string): string {
    const drug = ICU_DRUGS[id];
    if (!drug) return '';

    const ra = drug.renal_adjustment ?? {};
    const bandKey = getBandKey(currentBand);
    const badgeKey: BadgeKey | null = currentBand !== 'all' ? (ra.badge as BadgeKey | undefined) ?? null : null;
    const badge: BadgeConfig | null = badgeKey ? BADGE_CONFIG[badgeKey] : null;
    const isHighAlert = drug.high_alert === true;

    const cardClass = 'dr-card' +
      (isHighAlert ? ' high-alert-card' : '') +
      (badgeKey && badgeKey !== 'safe' && currentBand !== 'all' ? ' egfr-flagged' : '');

    let html = '<div class="' + cardClass + '" data-drug-id="' + esc(id) + '">';
    html += '<div class="dr-coll">';

    /* Name row + badges */
    html += '<div class="dr-name-row">';
    html += '<span class="dr-name">' + esc(drug.name) + '</span>';
    html += '<div class="dr-badges">';
    if (badge && currentBand !== 'all') {
      html += '<span class="badge ' + badge.cls + '">' + badge.label + '</span>';
    }
    if (isHighAlert) {
      html += '<span class="badge badge-high-alert">🚨</span>';
    }
    if (drug.pregnancy && (drug.pregnancy.fda_category === 'A' || drug.pregnancy.fda_category === 'B')) {
      html += '<span class="badge badge-pregnancy">🤰' + esc(drug.pregnancy.fda_category) + '</span>';
    }
    if (drug.pump_link && drug.pump_drug_key) {
      html += '<button class="badge badge-pump" onclick="event.stopPropagation();openPumpPopup(\'' + esc(drug.pump_drug_key) + '\')">⚡</button>';
    }
    html += '</div></div>';

    /* Class */
    html += '<div class="dr-class">' + esc(drug.class ?? '') + (drug.subclass ? ' · ' + esc(drug.subclass) : '') + '</div>';

    /* Brand */
    if (drug.brand_id && drug.brand_id.length) {
      html += '<div class="dr-brand">' + esc(drug.brand_id[0]) + (drug.brand_id.length > 1 ? ' +' + (drug.brand_id.length - 1) : '') + '</div>';
    }

    /* Dose preview */
    if (drug.dosing && drug.dosing.standard) {
      const doseShort = drug.dosing.standard.length > 55 ? drug.dosing.standard.slice(0, 52) + '…' : drug.dosing.standard;
      html += '<div class="dr-dose">' + esc(doseShort) + '</div>';
    }

    /* eGFR pill */
    if (currentBand !== 'all' && ra.badge) {
      const bk = ra.badge as BadgeKey;
      html += '<div class="dr-egfr-pill mode-' + bk + '">';
      if (bk === 'safe') html += '✓ AMAN';
      else html += BADGE_CONFIG[bk].label + ' [' + BAND_LABELS[currentBand] + ']';
      html += '</div>';
    }

    // suppress unused-variable warning for bandKey (kept for parity with JS)
    void bandKey;

    html += '</div></div>';
    return html;
  }

  /* ── Filter & sort drug IDs ── */
  function getFilteredIds(): string[] {
    let ids = Object.keys(ICU_DRUGS);
    const q = currentSearch.toLowerCase().trim();

    /* Filter by search */
    if (q) {
      ids = ids.filter(function(id: string): boolean {
        const drug = ICU_DRUGS[id];
        const searchFields = [
          drug.name ?? '',
          (drug.brand_id ?? []).join(' '),
          drug.class ?? '',
          drug.subclass ?? '',
          ((drug.indications && drug.indications.icu_primary) ?? []).join(' '),
          (drug.category ?? []).join(' ')
        ].join(' ').toLowerCase();
        return searchFields.indexOf(q) !== -1;
      });
    }

    /* Filter by category */
    if (currentCat !== 'all') {
      if (currentCat === 'pregnancy_safe') {
        ids = ids.filter(function(id: string): boolean {
          const pr = ICU_DRUGS[id].pregnancy;
          return !!(pr && (pr.fda_category === 'A' || pr.fda_category === 'B'));
        });
      } else {
        ids = ids.filter(function(id: string): boolean {
          return (ICU_DRUGS[id].category ?? []).indexOf(currentCat) !== -1;
        });
      }
    }

    /* Sort */
    if (currentSort === 'name') {
      ids.sort(function(a: string, b: string): number {
        return ICU_DRUGS[a].name.localeCompare(ICU_DRUGS[b].name);
      });
    } else if (currentSort === 'category') {
      ids.sort(function(a: string, b: string): number {
        const ca = (ICU_DRUGS[a].category ?? [''])[0];
        const cb = (ICU_DRUGS[b].category ?? [''])[0];
        return ca.localeCompare(cb);
      });
    } else if (currentSort === 'renal_flag') {
      const order: Record<string, number> = { avoid: 0, reduce: 1, adjust: 2, safe: 3 };
      ids.sort(function(a: string, b: string): number {
        const ba = order[(ICU_DRUGS[a].renal_adjustment ?? {}).badge as string] ?? 3;
        const bb = order[(ICU_DRUGS[b].renal_adjustment ?? {}).badge as string] ?? 3;
        return ba - bb;
      });
    }

    return ids;
  }

  /* ── Render grid ── */
  function renderGrid(): void {
    const grid    = document.getElementById('drug-grid');
    const countEl = document.getElementById('drug-count');
    if (!grid) return;

    const ids = getFilteredIds();
    if (countEl) countEl.textContent = 'Menampilkan ' + ids.length + ' dari ' + Object.keys(ICU_DRUGS).length + ' obat';

    if (ids.length === 0) {
      grid.innerHTML = '<div class="dr-empty"><p>Tidak ada obat yang sesuai.</p><p style="margin-top:4px;font-size:10px">Coba: nama generik, nama brand, atau kelas obat.</p></div>';
      return;
    }
    grid.innerHTML = ids.map(function(id: string): string { return renderCard(id); }).join('');
  }

  /* ── eGFR band selection ── */
  function setEgfrBand(band: BandKey): void {
    currentBand = band;

    /* Update band dropdown items */
    document.querySelectorAll<HTMLElement>('.dr-band-item').forEach(function(p: HTMLElement): void {
      p.classList.toggle('active', p.dataset['band'] === band);
    });

    /* Update band dropdown button label */
    const bandLabelEl = document.getElementById('dr-band-label');
    if (bandLabelEl) {
      if (band === 'all') {
        bandLabelEl.textContent = 'eGFR Mode';
      } else {
        const activeItem = document.querySelector<HTMLElement>('.dr-band-item[data-band="' + band + '"]');
        bandLabelEl.textContent = activeItem ? activeItem.textContent!.split('·')[0].trim() : 'eGFR Mode';
      }
    }

    /* Update status */
    const status = document.getElementById('egfr-status');
    if (status) {
      if (band === 'all') {
        status.textContent = '';
      } else {
        const needAdj = Object.keys(ICU_DRUGS).filter(function(id: string): boolean {
          const ra = ICU_DRUGS[id].renal_adjustment;
          return !!(ra && ra.badge && ra.badge !== 'safe');
        });
        status.textContent = 'Mode aktif: ' + BAND_LABELS[band] + ' | ' + needAdj.length + ' obat perlu penyesuaian';
      }
    }

    renderGrid();
  }

  /* ── Build modal HTML for a drug ── */
  function buildModalHTML(id: string): string {
    const drug = ICU_DRUGS[id];
    if (!drug) return '';
    const ra = drug.renal_adjustment ?? {};
    const bandKey = getBandKey(currentBand);
    const badgeKey: BadgeKey | null = currentBand !== 'all' ? (ra.badge as BadgeKey | undefined) ?? null : null;
    const badge: BadgeConfig | null = badgeKey ? BADGE_CONFIG[badgeKey] : null;
    const isHighAlert = drug.high_alert === true;

    // suppress unused-variable warning for bandKey (kept for parity with JS)
    void bandKey;

    /* ── Sticky wrapper: handle + header + tabs ── */
    let h = '<div class="drm-sticky">';
    h += '<div class="dr-modal-handle"></div>';

    /* Header */
    h += '<div class="drm-head">';
    h += '<div class="drm-head-info">';
    h += '<div class="drm-name">' + esc(drug.name) + '</div>';
    h += '<div class="drm-class">' + esc(drug.class ?? '') + (drug.subclass ? ' · ' + esc(drug.subclass) : '') + '</div>';
    h += '<div class="drm-badges">';
    if (badge && currentBand !== 'all') h += '<span class="badge ' + badge.cls + '">' + badge.label + '</span>';
    if (isHighAlert)                    h += '<span class="badge badge-high-alert">🚨 HIGH-ALERT</span>';
    if (drug.pregnancy && (drug.pregnancy.fda_category === 'A' || drug.pregnancy.fda_category === 'B')) {
      h += '<span class="badge badge-pregnancy">🤰 FDA ' + esc(drug.pregnancy.fda_category) + '</span>';
    }
    if (drug.pump_link && drug.pump_drug_key) {
      h += '<button class="badge badge-pump" onclick="openPumpPopup(\'' + esc(drug.pump_drug_key) + '\')">⚡ Pump ↗</button>';
    }
    h += '</div></div>';
    h += '<div class="drm-head-actions">';
    h += '<span class="toggle-label drm-theme-lbl" id="drm-theme-lbl"></span>';
    h += '<label class="toggle-switch drm-theme-toggle" title="Toggle tema">' +
           '<input type="checkbox" id="drm-theme-cb" onchange="toggleTheme()">' +
           '<div class="toggle-track"><div class="toggle-knob"></div></div>' +
         '</label>';
    h += '<button class="drm-close" onclick="closeDrugModal()"><i data-lucide="x" style="width:14px;height:14px;stroke-width:2px;vertical-align:-2px;margin-right:4px;"></i> Tutup</button>';
    h += '</div>';
    h += '</div>';

    /* Tabs */
    h += '<div class="drm-tabs" id="drm-tabs">';
    h += '<button class="drm-tab active" data-tab="umum">📋 Umum</button>';
    h += '<button class="drm-tab" data-tab="dosis">💉 Dosis</button>';
    h += '<button class="drm-tab" data-tab="ginjal">🫘 Ginjal</button>';
    h += '<button class="drm-tab" data-tab="keamanan">⚠ Keamanan</button>';
    h += '<button class="drm-tab" data-tab="interaksi">⚡ Lainnya</button>';
    h += '</div>';
    h += '</div>'; /* end drm-sticky */

    /* ── Body ── */
    h += '<div class="drm-body">';

    /* === TAB: UMUM === */
    h += '<div class="drm-panel active" id="drm-panel-umum">';

    /* High-alert warnings */
    if (isHighAlert && drug.high_alert_warnings && drug.high_alert_warnings.length) {
      h += '<div class="drm-warn-box">';
      drug.high_alert_warnings.forEach(function(w: string): void { h += '<div class="drm-warn-item">⚠ ' + esc(w) + '</div>'; });
      if (drug.high_alert_protocol) {
        h += '<div class="drm-protocol">📋 Protokol: ' + esc(drug.high_alert_protocol) + '</div>';
      }
      h += '</div>';
    }

    /* Indikasi */
    if (drug.indications) {
      const ind = drug.indications;
      h += '<span class="drm-sec-lbl">📋 Indikasi ICU</span>';
      if (ind.icu_primary && ind.icu_primary.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Primer:</strong>';
        h += '<ul class="drm-ul">';
        ind.icu_primary.forEach(function(i: string): void { h += '<li>' + esc(i) + '</li>'; });
        h += '</ul>';
      }
      if (ind.icu_secondary && ind.icu_secondary.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Sekunder:</strong>';
        h += '<ul class="drm-ul">';
        ind.icu_secondary.forEach(function(i: string): void { h += '<li>' + esc(i) + '</li>'; });
        h += '</ul>';
      }
      if (ind.local_guideline) h += '<div class="drm-block"><strong>Lokal:</strong> ' + esc(ind.local_guideline) + '</div>';
      if (ind.intl_guideline)  h += '<div class="drm-block"><strong>Int\'l:</strong> ' + esc(ind.intl_guideline) + '</div>';
    }

    /* Kontraindikasi & Perhatian */
    if ((drug.contraindications && drug.contraindications.length) || (drug.precautions && drug.precautions.length)) {
      h += '<span class="drm-sec-lbl">⚠ Kontraindikasi &amp; Perhatian</span>';
      if (drug.contraindications && drug.contraindications.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Kontraindikasi:</strong>';
        h += '<ul class="drm-ul">';
        drug.contraindications.forEach(function(c: string): void { h += '<li>' + esc(c) + '</li>'; });
        h += '</ul>';
      }
      if (drug.precautions && drug.precautions.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Perhatian:</strong>';
        h += '<ul class="drm-ul">';
        drug.precautions.forEach(function(p: string): void { h += '<li>' + esc(p) + '</li>'; });
        h += '</ul>';
      }
    }

    /* Farmakologi */
    if (drug.mechanism) {
      h += '<span class="drm-sec-lbl">🔬 Farmakologi</span>';
      h += '<div class="drm-p">' + esc(drug.mechanism) + '</div>';
      if (drug.pkpd_type) {
        h += '<div class="drm-p"><strong>PK/PD:</strong> ' + esc(drug.pkpd_type) + (drug.pkpd_note ? ' — ' + esc(drug.pkpd_note) : '') + '</div>';
      }
      if (drug.spectrum) {
        const sp = drug.spectrum;
        let tags = '';
        if (sp['gram_pos']) tags += '<span class="spectrum-tag stag-covered">Gram (+)</span>';
        if (sp['gram_neg']) tags += '<span class="spectrum-tag stag-covered">Gram (−)</span>';
        if (sp['anaerob'])  tags += '<span class="spectrum-tag stag-covered">Anaerob</span>';
        if (sp['esbl'])     tags += '<span class="spectrum-tag stag-covered">ESBL</span>';
        if (sp['pseudomonas']) tags += '<span class="spectrum-tag stag-partial">Pseudomonas ⚠</span>';
        if (sp['mrsa'])     tags += '<span class="spectrum-tag stag-covered">MRSA</span>';
        else if (sp['gram_pos']) tags += '<span class="spectrum-tag stag-no">No MRSA</span>';
        if (tags) h += '<div class="spectrum-tags">' + tags + '</div>';
        if (sp['gram_pos']) h += '<div class="drm-p" style="margin-top:.4rem"><strong>G(+):</strong> ' + esc(sp['gram_pos'] as string) + '</div>';
        if (sp['gram_neg']) h += '<div class="drm-p"><strong>G(−):</strong> ' + esc(sp['gram_neg'] as string) + '</div>';
        if (sp['anaerob'])  h += '<div class="drm-p"><strong>Anaerob:</strong> ' + esc(sp['anaerob'] as string) + '</div>';
      }
    }
    h += '</div>'; /* end panel-umum */

    /* === TAB: DOSIS === */
    h += '<div class="drm-panel" id="drm-panel-dosis">';
    if (drug.dosing) {
      const d = drug.dosing;
      h += '<span class="drm-sec-lbl">💉 Dosis &amp; Cara Pemberian</span>';
      if (d.standard)    h += '<div class="drm-p"><strong>Standar:</strong> ' + esc(d.standard) + '</div>';
      if (d.loading)     h += '<div class="drm-p"><strong>Loading:</strong> ' + esc(d.loading) + '</div>';
      if (d.maintenance) h += '<div class="drm-p"><strong>Maintenance:</strong> ' + esc(d.maintenance) + '</div>';
      if (d.range_low || d.range_high) {
        h += '<div class="drm-p"><strong>Range:</strong> ' + esc(d.range_low ?? '—') + ' → ' + esc(d.range_high ?? '—') + '</div>';
      }
      if (d.max)         h += '<div class="drm-p"><strong>Maks:</strong> ' + esc(d.max) + '</div>';
      if (d.route && d.route.length) {
        h += '<div class="drm-p"><strong>Route:</strong> ' + esc(d.route.join(', ')) + '</div>';
      }
      if (d.dilution) {
        h += '<span class="drm-sec-lbl">🧪 Pengenceran &amp; Rate</span>';
        h += '<div class="drm-block"><strong>Pengenceran:</strong> ' + esc(d.dilution) + '</div>';
      }
      if (d.rate)        h += '<div class="drm-block"><strong>Rate:</strong> ' + esc(d.rate) + '</div>';
      if (d.titration)   h += '<div class="drm-block"><strong>Titrasi:</strong> ' + esc(d.titration) + '</div>';
      if (d.special_notes) {
        h += '<div class="drm-block" style="border-color:rgba(255,159,67,.3);background:rgba(255,159,67,.05)">';
        h += '<strong style="color:var(--warn)">⚠ Catatan Penting:</strong><br>' + esc(d.special_notes);
        h += '</div>';
      }
    }
    h += '</div>'; /* end panel-dosis */

    /* === TAB: GINJAL === */
    h += '<div class="drm-panel" id="drm-panel-ginjal">';
    if (drug.renal_adjustment) {
      h += '<span class="drm-sec-lbl">🫘 Penyesuaian Renal</span>';
      const bands: Array<{ key: string; label: string }> = [
        { key: 'ge60',   label: '≥60' },
        { key: 'r30_60', label: '30–60' },
        { key: 'r15_30', label: '15–30' },
        { key: 'r_lt15', label: '<15' },
        { key: 'hd',     label: 'HD' },
        { key: 'crrt',   label: 'CRRT' }
      ];
      h += '<table class="drm-renal-tbl">';
      h += '<thead><tr><th>eGFR</th><th>Dosis</th><th>Interval</th><th>Cara Pemberian</th></tr></thead><tbody>';
      bands.forEach(function(b: { key: string; label: string }): void {
        const a = ra[b.key] ?? '';
        const isActive = (currentBand === b.key) || (currentBand === 'all' && b.key === 'ge60');
        h += '<tr' + (isActive ? ' class="active-band"' : '') + '>';
        h += '<td><strong>' + esc(b.label) + '</strong></td>';
        if (typeof a === 'string') {
          h += '<td colspan="3">' + esc(a) + '</td>';
        } else {
          const entry = a as RenalDoseEntry;
          const caraPemberian = [entry.route, entry.note].filter(Boolean).join(' — ');
          h += '<td>' + esc(entry.dose ?? '—') + '</td>';
          h += '<td>' + esc(entry.interval ?? '—') + '</td>';
          h += '<td>' + esc(caraPemberian || '—') + '</td>';
        }
        h += '</tr>';
      });
      h += '</tbody></table>';
      if (ra['monitoring_renal']) {
        h += '<div class="drm-p" style="margin-top:.6rem"><strong>Monitor:</strong> ' + esc(ra['monitoring_renal'] as string) + '</div>';
      }
      if (ra['dialyzable'] !== undefined) {
        h += '<div class="drm-p"><strong>Terdialisis:</strong> ' + (ra['dialyzable'] ? 'Ya' : 'Tidak') + '</div>';
      }
    }
    if (drug.hepatic_adjustment) {
      const ha = drug.hepatic_adjustment;
      h += '<span class="drm-sec-lbl">🫀 Penyesuaian Hepatik (Child-Pugh)</span>';
      h += '<table class="drm-renal-tbl">';
      h += '<thead><tr><th>Child-Pugh</th><th>Penyesuaian</th></tr></thead><tbody>';
      h += '<tr><td><strong>A</strong></td><td>' + esc(ha.child_a ?? '—') + '</td></tr>';
      h += '<tr><td><strong>B</strong></td><td>' + esc(ha.child_b ?? '—') + '</td></tr>';
      h += '<tr><td><strong>C</strong></td><td>' + esc(ha.child_c ?? '—') + '</td></tr>';
      h += '</tbody></table>';
      if (ha.note) h += '<div class="drm-p" style="margin-top:.5rem">' + esc(ha.note) + '</div>';
    }
    h += '</div>'; /* end panel-ginjal */

    /* === TAB: KEAMANAN === */
    h += '<div class="drm-panel" id="drm-panel-keamanan">';

    /* Monitoring */
    if (drug.monitoring) {
      const mon = drug.monitoring;
      h += '<span class="drm-sec-lbl">📊 Monitoring</span>';
      if (mon.efficacy && mon.efficacy.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Efikasi:</strong>';
        h += '<ul class="drm-ul">';
        mon.efficacy.forEach(function(e: string): void { h += '<li>' + esc(e) + '</li>'; });
        h += '</ul>';
      }
      if (mon.safety && mon.safety.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Keamanan:</strong>';
        h += '<ul class="drm-ul">';
        mon.safety.forEach(function(s: string): void { h += '<li>' + esc(s) + '</li>'; });
        h += '</ul>';
      }
      if (mon.therapeutic_range) h += '<div class="drm-block"><strong>Rentang Terapetik:</strong> ' + esc(mon.therapeutic_range) + '</div>';
      if (mon.frequency)         h += '<div class="drm-p"><strong>Frekuensi:</strong> ' + esc(mon.frequency) + '</div>';
    }

    /* Efek samping */
    if (drug.adverse_effects) {
      const ae = drug.adverse_effects;
      h += '<span class="drm-sec-lbl">⚠️ Efek Samping</span>';
      if (ae.critical && ae.critical.length) {
        h += '<strong style="font-size:11px;color:#ff6666">Kritis/Fatal:</strong>';
        h += '<ul class="drm-ul">';
        ae.critical.forEach(function(e: string): void { h += '<li style="color:#ff8888">' + esc(e) + '</li>'; });
        h += '</ul>';
      }
      if (ae.common && ae.common.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Umum:</strong>';
        h += '<ul class="drm-ul">';
        ae.common.forEach(function(e: string): void { h += '<li>' + esc(e) + '</li>'; });
        h += '</ul>';
      }
      if (ae.antidote) {
        h += '<div class="drm-antidote"><strong>💊 Antidot:</strong> ' + esc(ae.antidote) + '</div>';
      }
    }

    /* Kehamilan */
    if (drug.pregnancy) {
      const pr = drug.pregnancy;
      h += '<span class="drm-sec-lbl">🤰 Kehamilan &amp; Laktasi</span>';
      if (pr.fda_category)   h += '<div class="drm-p"><strong>Kategori FDA:</strong> ' + esc(pr.fda_category) + '</div>';
      if (pr.fetal_risk)     h += '<div class="drm-p"><strong>Risiko Fetal:</strong> ' + esc(pr.fetal_risk) + '</div>';
      if (pr.trimester_1)    h += '<div class="drm-p"><strong>TM 1:</strong> ' + esc(pr.trimester_1) + '</div>';
      if (pr.trimester_2)    h += '<div class="drm-p"><strong>TM 2:</strong> ' + esc(pr.trimester_2) + '</div>';
      if (pr.trimester_3)    h += '<div class="drm-p"><strong>TM 3:</strong> ' + esc(pr.trimester_3) + '</div>';
      if (pr.labor_delivery) h += '<div class="drm-p"><strong>Persalinan:</strong> ' + esc(pr.labor_delivery) + '</div>';
      if (pr.lactation)      h += '<div class="drm-p"><strong>Laktasi:</strong> ' + esc(pr.lactation) + (pr.lactation_note ? ' — ' + esc(pr.lactation_note) : '') + '</div>';
    }
    h += '</div>'; /* end panel-keamanan */

    /* === TAB: LAINNYA (Interaksi + Stewardship + Evidence) === */
    h += '<div class="drm-panel" id="drm-panel-interaksi">';

    /* Interaksi */
    if (drug.interactions) {
      const ix = drug.interactions;
      const hasMajor    = ix.major    && ix.major.length;
      const hasModerate = ix.moderate && ix.moderate.length;
      if (hasMajor || hasModerate) {
        h += '<span class="drm-sec-lbl">⚡ Interaksi Obat</span>';
        if (hasMajor && ix.major) {
          h += '<strong style="font-size:11px;color:#ff8888">Interaksi Mayor:</strong>';
          ix.major.forEach(function(i: DrugInteractionEntry | string): void {
            h += '<div class="drm-ixn major">';
            if (typeof i === 'object') {
              h += '<strong>' + esc(i.drug ?? '') + '</strong>';
              if (i.effect) h += ': ' + esc(i.effect);
              if (i.management) h += '<br><em style="color:var(--text3)">Manajemen: ' + esc(i.management) + '</em>';
            } else {
              h += esc(i);
            }
            h += '</div>';
          });
        }
        if (hasModerate && ix.moderate) {
          h += '<strong style="font-size:11px;color:#ffd700;display:block;margin-top:.5rem">Interaksi Moderat:</strong>';
          ix.moderate.forEach(function(i: DrugInteractionEntry | string): void {
            h += '<div class="drm-ixn moderate">';
            if (typeof i === 'object') {
              h += '<strong>' + esc(i.drug ?? '') + '</strong>';
              if (i.effect) h += ': ' + esc(i.effect);
            } else {
              h += esc(i);
            }
            h += '</div>';
          });
        }
      }
    }

    /* Stewardship */
    if (drug.stewardship) {
      const st = drug.stewardship;
      h += '<span class="drm-sec-lbl">🛡 Stewardship Antibiotik</span>';
      h += '<div class="drm-stew">';
      if (st.empiric_sources && st.empiric_sources.length) {
        h += '<div><strong>Indikasi Empiris:</strong> ' + esc(st.empiric_sources.join(', ')) + '</div>';
      }
      if (st.duration_standard !== undefined && st.duration_standard !== null) {
        h += '<div><strong>Durasi:</strong> ' + String(st.duration_standard) + ' hari';
        if (st.duration_short !== undefined && st.duration_short !== null) h += ' (short course: ' + String(st.duration_short) + ' hari)';
        h += '</div>';
      }
      if (st.duration_note)  h += '<div>' + esc(st.duration_note) + '</div>';
      if (st.stop_criteria)  h += '<div><strong>Kriteria Stop:</strong> ' + esc(st.stop_criteria) + '</div>';
      if (st.deescalation_to && st.deescalation_to.length) {
        h += '<div><strong>De-eskalasi ke:</strong> ' + esc(st.deescalation_to.join(', ')) + '</div>';
      }
      if (st.avoid_for && st.avoid_for.length) {
        h += '<div><strong>Hindari:</strong> ' + esc(st.avoid_for.join(' · ')) + '</div>';
      }
      if (st.local_pattern_note) {
        h += '<div style="margin-top:.4rem;padding-top:.4rem;border-top:1px solid rgba(255,215,0,.2)">' + esc(st.local_pattern_note) + '</div>';
      }
      h += '</div>';
    }

    /* Evidence */
    if (drug.evidence && drug.evidence.length) {
      h += '<span class="drm-sec-lbl">📚 Evidence &amp; Referensi</span>';
      drug.evidence.forEach(function(ev: EvidenceRef): void {
        h += '<div class="drm-block"><strong>' + esc(ev.ref_id) + '</strong>: ' + esc(ev.note) + '</div>';
      });
    }

    /* Brand notes */
    if (drug.brand_id_notes) {
      h += '<span class="drm-sec-lbl">💊 Brand &amp; Ketersediaan</span>';
      h += '<div class="drm-p">' + esc(drug.brand_id_notes) + '</div>';
      if (drug.brand_id && drug.brand_id.length) {
        h += '<ul class="drm-ul">';
        drug.brand_id.forEach(function(b: string): void { h += '<li>' + esc(b) + '</li>'; });
        h += '</ul>';
      }
    }

    h += '</div>'; /* end panel-interaksi */
    h += '</div>'; /* end drm-body */
    return h;
  }

  /* ── Open drug modal ── */
  function openDrugModal(id: string): void {
    const overlay = document.getElementById('drug-overlay');
    const content = document.getElementById('drug-modal-content');
    if (!overlay || !content || !ICU_DRUGS[id]) return;

    content.innerHTML = buildModalHTML(id);

    /* Sync theme toggle state */
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const drmCb  = document.getElementById('drm-theme-cb') as HTMLInputElement | null;
    if (drmCb)  drmCb.checked = isDark;
    const drmLbl = document.getElementById('drm-theme-lbl');
    if (drmLbl) drmLbl.textContent = isDark ? 'Dark' : 'Light';

    /* Tab switching */
    content.querySelectorAll<HTMLElement>('.drm-tab').forEach(function(tab: HTMLElement): void {
      tab.addEventListener('click', function(this: HTMLElement): void {
        const tabId = this.dataset['tab'];
        content.querySelectorAll<HTMLElement>('.drm-tab').forEach(function(t: HTMLElement): void { t.classList.remove('active'); });
        content.querySelectorAll<HTMLElement>('.drm-panel').forEach(function(p: HTMLElement): void { p.classList.remove('active'); });
        this.classList.add('active');
        const panel = content.querySelector<HTMLElement>('#drm-panel-' + tabId);
        if (panel) panel.classList.add('active');
      });
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* Scroll body to top */
    const body = overlay.querySelector<HTMLElement>('.drm-body');
    if (body) body.scrollTop = 0;

    /* Init SVG Icons */
    const w = window as unknown as Record<string, unknown>;
    if (w['lucide'] && typeof (w['lucide'] as Record<string, unknown>)['createIcons'] === 'function') {
      (w['lucide'] as { createIcons: () => void }).createIcons();
    }
  }

  /* ── Init event listeners ── */
  function init(): void {
    if (typeof ICU_DRUGS === 'undefined') {
      console.error('ICU_DRUGS not loaded — check drugs.js path');
      return;
    }

    allDrugIds = Object.keys(ICU_DRUGS);
    void allDrugIds; // used to populate state; suppress unused warning
    renderGrid();
    renderVasopressorFlowchart();
    renderSedationLadder();

    /* Card click → open modal (event delegation) */
    const grid = document.getElementById('drug-grid');
    if (grid) {
      grid.addEventListener('click', function(e: MouseEvent): void {
        const card = (e.target as HTMLElement).closest<HTMLElement>('[data-drug-id]');
        if (!card) return;
        /* Don't open modal if clicking pump badge link */
        if ((e.target as HTMLElement).closest('.badge-pump')) return;
        const drugId = card.dataset['drugId'];
        if (drugId) openDrugModal(drugId);
      });
    }

    /* eGFR input — inside the band dropdown */
    const egfrInput = document.getElementById('egfr-input') as HTMLInputElement | null;
    if (egfrInput) {
      /* prevent clicks on the input from closing the dropdown */
      egfrInput.addEventListener('click', function(e: MouseEvent): void { e.stopPropagation(); });
      egfrInput.addEventListener('input', function(this: HTMLInputElement): void {
        const val = parseInt(this.value);
        if (!val || isNaN(val)) { setEgfrBand('all'); return; }
        if (val >= 60)       setEgfrBand('ge60');
        else if (val >= 30)  setEgfrBand('r30_60');
        else if (val >= 15)  setEgfrBand('r15_30');
        else                 setEgfrBand('r_lt15');
      });
    }

    /* eGFR band dropdown items */
    document.querySelectorAll<HTMLElement>('.dr-band-item').forEach(function(item: HTMLElement): void {
      item.addEventListener('click', function(this: HTMLElement): void {
        const egfrInputEl = document.getElementById('egfr-input') as HTMLInputElement | null;
        if (egfrInputEl) egfrInputEl.value = '';
        setEgfrBand((this.dataset['band'] ?? 'all') as BandKey);
        const drop = document.getElementById('dr-band-drop');
        if (drop) drop.classList.remove('open');
      });
    });

    /* Band dropdown toggle */
    const bandBtn  = document.getElementById('dr-band-btn');
    const bandWrap = document.getElementById('dr-band-drop');
    if (bandBtn && bandWrap) {
      bandBtn.addEventListener('click', function(e: MouseEvent): void {
        e.stopPropagation();
        bandWrap.classList.toggle('open');
        /* close category dropdown if open */
        const catDrop = document.getElementById('dr-filter-drop');
        if (catDrop) catDrop.classList.remove('open');
      });
      document.addEventListener('click', function(e: MouseEvent): void {
        if (bandWrap && !bandWrap.contains(e.target as Node)) {
          bandWrap.classList.remove('open');
        }
      });
    }

    /* Category filter — shared handler for dropdown items and desktop pills */
    function applyFilter(cat: string): void {
      currentCat = cat;
      /* Update desktop pills */
      document.querySelectorAll<HTMLElement>('.dr-pill').forEach(function(p: HTMLElement): void {
        p.classList.toggle('active', p.dataset['cat'] === cat);
      });
      /* Update dropdown items */
      document.querySelectorAll<HTMLElement>('.dr-drop-item').forEach(function(p: HTMLElement): void {
        p.classList.toggle('active', p.dataset['cat'] === cat);
      });
      /* Update dropdown button label + dot */
      const activeItem = document.querySelector<HTMLElement>('.dr-drop-item[data-cat="' + cat + '"]');
      const labelEl    = document.getElementById('dr-drop-label');
      const dotEl      = document.getElementById('dr-drop-dot');
      if (labelEl) {
        if (cat === 'all') {
          labelEl.textContent = 'Semua Obat';
        } else if (activeItem) {
          labelEl.textContent = activeItem.textContent!.trim();
        }
      }
      if (dotEl) {
        dotEl.className = 'dr-drop-dot d-' + cat;
      }
      renderGrid();
    }

    document.querySelectorAll<HTMLElement>('.dr-pill').forEach(function(pill: HTMLElement): void {
      pill.addEventListener('click', function(this: HTMLElement): void { applyFilter(this.dataset['cat'] ?? 'all'); });
    });

    document.querySelectorAll<HTMLElement>('.dr-drop-item').forEach(function(item: HTMLElement): void {
      item.addEventListener('click', function(this: HTMLElement): void {
        applyFilter(this.dataset['cat'] ?? 'all');
        /* Close dropdown */
        const drop = document.getElementById('dr-filter-drop');
        if (drop) drop.classList.remove('open');
      });
    });

    /* Dropdown toggle */
    const dropBtn  = document.getElementById('dr-drop-btn');
    const dropWrap = document.getElementById('dr-filter-drop');
    if (dropBtn && dropWrap) {
      dropBtn.addEventListener('click', function(e: MouseEvent): void {
        e.stopPropagation();
        dropWrap.classList.toggle('open');
        /* close band dropdown if open */
        const bandDrop = document.getElementById('dr-band-drop');
        if (bandDrop) bandDrop.classList.remove('open');
      });
      document.addEventListener('click', function(e: MouseEvent): void {
        if (dropWrap && !dropWrap.contains(e.target as Node)) {
          dropWrap.classList.remove('open');
        }
      });
    }

    /* Search */
    const searchInput = document.getElementById('drug-search') as HTMLInputElement | null;
    const clearBtn    = document.getElementById('search-clear') as HTMLElement | null;
    if (searchInput) {
      searchInput.addEventListener('input', function(this: HTMLInputElement): void {
        currentSearch = this.value;
        if (clearBtn) clearBtn.style.display = this.value ? 'block' : 'none';
        renderGrid();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function(this: HTMLElement): void {
        if (searchInput) { searchInput.value = ''; searchInput.focus(); }
        currentSearch = '';
        this.style.display = 'none';
        renderGrid();
      });
    }

    /* Sort */
    const sortSel = document.getElementById('drug-sort') as HTMLSelectElement | null;
    if (sortSel) {
      sortSel.addEventListener('change', function(this: HTMLSelectElement): void {
        currentSort = this.value as SortKey;
        renderGrid();
      });
    }

    /* Keyboard shortcuts */
    document.addEventListener('keydown', function(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        const overlayEl = document.getElementById('drug-overlay');
        if (overlayEl && overlayEl.classList.contains('open')) {
          closeDrugModal();
          return;
        }
        if (searchInput) {
          searchInput.value = '';
          currentSearch = '';
          if (clearBtn) clearBtn.style.display = 'none';
          searchInput.blur();
          renderGrid();
        }
      }
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
    });

    /* Flowchart "Lihat detail" → open modal */
    document.addEventListener('click', function(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (target.classList.contains('step-detail-btn') && target.dataset['drugKey']) {
        openDrugModal(target.dataset['drugKey']);
      }
    });
  }

  /* ── Close drug modal (exposed globally for onclick) ── */
  function closeDrugModal(): void {
    const overlay = document.getElementById('drug-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  (window as unknown as Record<string, unknown>)['closeDrugModal'] = closeDrugModal;

  /* ── Pump calculator popup ── */
  function openPumpPopup(drugKey: string): void {
    const overlay = document.getElementById('pump-overlay');
    const iframe  = document.getElementById('pump-iframe') as HTMLIFrameElement | null;
    if (!overlay || !iframe) return;
    iframe.src = 'kalkulator/kalkulator-pump.html?drug=' + encodeURIComponent(drugKey) + '&embedded=1';
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  (window as unknown as Record<string, unknown>)['openPumpPopup'] = openPumpPopup;

  function closePumpPopup(): void {
    const overlay = document.getElementById('pump-overlay');
    const iframe  = document.getElementById('pump-iframe') as HTMLIFrameElement | null;
    if (overlay) {
      overlay.classList.remove('open');
      overlay.style.display = '';
      overlay.style.opacity = '';
      overlay.style.pointerEvents = '';
    }
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
  }
  (window as unknown as Record<string, unknown>)['closePumpPopup'] = closePumpPopup;

  /* Expose getEgfrBadge for completeness (used internally but typed) */
  void getEgfrBadge;

  /* ── Start ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
