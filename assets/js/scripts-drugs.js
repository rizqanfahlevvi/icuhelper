/* ============================================================
   scripts-drugs.js — ICU Helper Drug Reference Engine
   Depends on: ICU_DRUGS (assets/data/drugs.js)
   ============================================================ */
;(function () {
  'use strict';

  /* ── State ── */
  var currentBand    = 'all';
  var currentCat     = 'all';
  var currentSearch  = '';
  var currentSort    = 'name';
  var allDrugIds     = [];

  /* ── Badge config ── */
  var BADGE_CONFIG = {
    safe:   { label: '✓ AMAN',      cls: 'badge-safe'   },
    adjust: { label: '⚠ SESUAIKAN', cls: 'badge-adjust' },
    reduce: { label: '↓ KURANGI',   cls: 'badge-reduce' },
    avoid:  { label: '✗ HINDARI',   cls: 'badge-avoid'  }
  };

  var BAND_LABELS = {
    all:    'Normal (≥60)',
    ge60:   '≥60 mL/min',
    r30_60: '30–60 mL/min',
    r15_30: '15–30 mL/min',
    r_lt15: '<15 mL/min',
    hd:     'Hemodialisis',
    crrt:   'CRRT'
  };

  /* ── Vasopressor Flowchart ── */
  var VASOPRESSOR_FLOWCHART = {
    distributive: {
      label: 'Syok Distributif / Septik',
      icon: '🦠',
      color: '#f97316',
      steps: [
        { step: 1, agent: 'Norepinefrin', dose: '0.01–0.5 mcg/kg/min', note: 'First-line. SSC 2024. Titrasi MAP ≥65 mmHg.', drug_key: 'norepinefrin' },
        { step: 2, agent: '+ Vasopressin', dose: '0.03–0.04 IU/min (tetap)', note: 'Tambahkan jika NE ≥0.25 mcg/kg/min. Sparing katekolamin.', drug_key: 'vasopressin' },
        { step: 3, agent: '+ Epinefrin', dose: '0.01–0.5 mcg/kg/min', note: 'Jika MAP tetap <65 meski NE + vasopressin. Atau jika ada disfungsi miokard.', drug_key: 'epinefrin' },
        { step: 4, agent: '± Dobutamin', dose: '2–20 mcg/kg/min', note: 'Tambahkan jika ScvO₂ <70% atau tanda hipoperfusi persisten. Bukan untuk MAP.', drug_key: 'dobutamin' }
      ]
    },
    cardiogenic: {
      label: 'Syok Kardiogenik',
      icon: '🫀',
      color: '#ef4444',
      steps: [
        { step: 1, agent: 'Norepinefrin', dose: '0.01–0.3 mcg/kg/min', note: 'Pertahankan perfusi. MAP ≥65 mmHg. Gunakan dosis rendah.', drug_key: 'norepinefrin' },
        { step: 2, agent: '+ Dobutamin', dose: '2–20 mcg/kg/min', note: 'Tingkatkan cardiac output (CI target >2.2 L/min/m²). Kombinasi dengan NE.', drug_key: 'dobutamin' },
        { step: 3, agent: 'Atau Milrinon', dose: '0.375–0.75 mcg/kg/min', note: 'Jika pasien dalam β-blocker kronik atau down-regulated β-receptor.', drug_key: 'milrinon' },
        { step: 4, agent: 'Atau Levosimendan', dose: '0.05–0.2 mcg/kg/min × 24 jam', note: 'Refrakter dobutamin/milrinon. Efek berlanjut 7–9 hari via OR-1896.', drug_key: 'levosimendan' }
      ]
    },
    hypovolemic: {
      label: 'Syok Hipovolemik',
      icon: '💧',
      color: '#3b82f6',
      steps: [
        { step: 1, agent: 'Resusitasi Cairan', dose: '30 mL/kg kristaloid (jika sepsis)', note: 'KOREKSI VOLUME DULU. Vasopressor sebelum volume koreksi memperburuk outcome.', drug_key: null },
        { step: 2, agent: 'Norepinefrin (bridge)', dose: '0.01–0.1 mcg/kg/min', note: 'Bridge sementara jika MAP sangat rendah mengancam jiwa, sambil koreksi volume.', drug_key: 'norepinefrin' }
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
  var SEDATION_LADDER = [
    {
      level: 1,
      label: 'Analgesia Saja (RASS 0 hingga -1)',
      color: '#22c55e',
      description: 'Pasien tidak terintubasi atau baru intubasi, tidak ada agitasi bermakna.',
      agents: [
        { name: 'Fentanil', dose: '25–100 mcg/jam infus atau bolus PRN', note: 'Analgesia-first. CPOT target 0–2.', drug_key: 'fentanil' },
        { name: 'Parasetamol IV', dose: '1g IV q6–8j (multimodal)', note: 'Opioid-sparing. Aman semua kondisi kecuali gagal hati berat.', drug_key: 'parasetamol_iv' },
        { name: 'Ketorolak', dose: '15–30 mg IV q6j (maks 5 hari)', note: 'Bila tidak ada kontraindikasi renal/GI.', drug_key: 'ketorolak' }
      ]
    },
    {
      level: 2,
      label: 'Sedasi Ringan (RASS -1 hingga -2)',
      color: '#3b82f6',
      description: 'Pasien terintubasi dengan agitasi ringan atau untuk memfasilitasi ventilasi.',
      agents: [
        { name: 'Deksmedetomidin', dose: '0.2–0.7 mcg/kg/jam', note: 'Pilihan utama — pasien masih bisa komunikasi, non-GABA, preservasi napas.', drug_key: 'deksmedetomidin' },
        { name: 'Propofol', dose: '5–30 mcg/kg/min', note: 'Alternatif. Onset/offset cepat. Hitung kalori lemak.', drug_key: 'propofol' }
      ]
    },
    {
      level: 3,
      label: 'Sedasi Dalam (RASS -3 hingga -4)',
      color: '#f97316',
      description: 'ARDS berat (P/F <150), asinkroni ventilator refrakter, prosedur.',
      agents: [
        { name: 'Propofol', dose: '10–50 mcg/kg/min (maks 4 mg/kg/jam)', note: 'Monitor TG setiap 48 jam. Waspadai PRIS jika >48–72 jam dosis tinggi.', drug_key: 'propofol' },
        { name: 'Midazolam', dose: '0.02–0.1 mg/kg/jam', note: 'Jika propofol tidak tersedia/kontraindikasi. Risiko delirium lebih tinggi.', drug_key: 'midazolam' },
        { name: '+ NMB (Sisatrakurium)', dose: '0.5–3 mcg/kg/min', note: 'Tambahkan jika P/F <150 + dyssynchrony persisten. PASTIKAN sedasi adekuat DULU.', drug_key: 'sisatrakurium' }
      ]
    },
    {
      level: 4,
      label: 'Sedasi Refrakter / Status Epileptikus',
      color: '#ef4444',
      description: 'Status epileptikus refrakter (RSE), agitasi berat tidak terkontrol.',
      agents: [
        { name: 'Propofol', dose: 'Hingga 4 mg/kg/jam (batas PRIS)', note: 'Lini pertama RSE: 1–5 mg/kg/jam. EEG monitoring.', drug_key: 'propofol' },
        { name: 'Ketamin', dose: '1–2 mg/kg/jam infus', note: 'Status epileptikus refrakter. Mempertahankan MAP — berguna pada syok bersamaan.', drug_key: 'ketamin_icu' },
        { name: 'Tiopental', dose: '3–5 mg/kg bolus → 1–5 mg/kg/jam', note: 'Lini ketiga RSE. EEG burst-suppression. Hemodinamik tidak stabil.', drug_key: 'tiopental' }
      ]
    }
  ];

  /* ── Render Vasopressor Flowchart ── */
  function renderVasopressorFlowchart() {
    var container = document.getElementById('vasopressor-flowchart');
    if (!container) return;
    var html = '<div class="flowchart-grid">';
    Object.keys(VASOPRESSOR_FLOWCHART).forEach(function(key) {
      var fc = VASOPRESSOR_FLOWCHART[key];
      html += '<div class="flowchart-card" style="border-color:' + fc.color + '20;background:' + fc.color + '08">';
      html += '<div class="flowchart-header" style="border-bottom:2px solid ' + fc.color + '">';
      html += '<span style="font-size:18px">' + fc.icon + '</span>';
      html += '<strong style="color:' + fc.color + '">' + esc(fc.label) + '</strong>';
      html += '</div>';
      html += '<div class="flowchart-steps">';
      fc.steps.forEach(function(s) {
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
  function renderSedationLadder() {
    var container = document.getElementById('sedation-ladder');
    if (!container) return;
    var html = '<div class="ladder-list">';
    SEDATION_LADDER.forEach(function(rung) {
      html += '<div class="ladder-rung" style="border-left:4px solid ' + rung.color + '">';
      html += '<div class="ladder-header">';
      html += '<span class="ladder-level" style="background:' + rung.color + '">Level ' + rung.level + '</span>';
      html += '<strong class="ladder-label">' + esc(rung.label) + '</strong>';
      html += '</div>';
      html += '<div class="ladder-desc">' + esc(rung.description) + '</div>';
      html += '<div class="ladder-agents">';
      rung.agents.forEach(function(a) {
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
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getBandKey(band) {
    return band === 'all' ? 'ge60' : band;
  }

  /* ── Get eGFR badge for a drug at current band ── */
  function getEgfrBadge(drug, band) {
    if (!drug.renal_adjustment) return null;
    var badgeKey = band === 'all' ? null : drug.renal_adjustment.badge;
    if (!badgeKey || band === 'all') return null;
    return BADGE_CONFIG[badgeKey] || null;
  }

  /* ── Render compact card (click → modal) ── */
  function renderCard(id) {
    var drug = ICU_DRUGS[id];
    if (!drug) return '';

    var ra = drug.renal_adjustment || {};
    var bandKey = getBandKey(currentBand);
    var badgeKey = currentBand !== 'all' ? ra.badge : null;
    var badge = badgeKey ? BADGE_CONFIG[badgeKey] : null;
    var isHighAlert = drug.high_alert === true;

    var cardClass = 'dr-card' +
      (isHighAlert ? ' high-alert-card' : '') +
      (badgeKey && badgeKey !== 'safe' && currentBand !== 'all' ? ' egfr-flagged' : '');

    var html = '<div class="' + cardClass + '" data-drug-id="' + esc(id) + '">';
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
    html += '<div class="dr-class">' + esc(drug.class || '') + (drug.subclass ? ' · ' + esc(drug.subclass) : '') + '</div>';

    /* Brand */
    if (drug.brand_id && drug.brand_id.length) {
      html += '<div class="dr-brand">' + esc(drug.brand_id[0]) + (drug.brand_id.length > 1 ? ' +' + (drug.brand_id.length - 1) : '') + '</div>';
    }

    /* Dose preview */
    if (drug.dosing && drug.dosing.standard) {
      var doseShort = drug.dosing.standard.length > 55 ? drug.dosing.standard.slice(0, 52) + '…' : drug.dosing.standard;
      html += '<div class="dr-dose">' + esc(doseShort) + '</div>';
    }

    /* eGFR pill */
    if (currentBand !== 'all' && ra.badge) {
      var bk = ra.badge;
      html += '<div class="dr-egfr-pill mode-' + bk + '">';
      if (bk === 'safe') html += '✓ AMAN';
      else html += BADGE_CONFIG[bk].label + ' [' + BAND_LABELS[currentBand] + ']';
      html += '</div>';
    }

    html += '</div></div>';
    return html;
  }

  /* ── Filter & sort drug IDs ── */
  function getFilteredIds() {
    var ids = Object.keys(ICU_DRUGS);
    var q = currentSearch.toLowerCase().trim();

    /* Filter by search */
    if (q) {
      ids = ids.filter(function(id) {
        var drug = ICU_DRUGS[id];
        var searchFields = [
          drug.name || '',
          (drug.brand_id || []).join(' '),
          drug.class || '',
          drug.subclass || '',
          (drug.indications && drug.indications.icu_primary || []).join(' '),
          (drug.category || []).join(' ')
        ].join(' ').toLowerCase();
        return searchFields.indexOf(q) !== -1;
      });
    }

    /* Filter by category */
    if (currentCat !== 'all') {
      if (currentCat === 'pregnancy_safe') {
        ids = ids.filter(function(id) {
          var pr = ICU_DRUGS[id].pregnancy;
          return pr && (pr.fda_category === 'A' || pr.fda_category === 'B');
        });
      } else {
        ids = ids.filter(function(id) {
          return (ICU_DRUGS[id].category || []).indexOf(currentCat) !== -1;
        });
      }
    }

    /* Sort */
    if (currentSort === 'name') {
      ids.sort(function(a, b) {
        return ICU_DRUGS[a].name.localeCompare(ICU_DRUGS[b].name);
      });
    } else if (currentSort === 'category') {
      ids.sort(function(a, b) {
        var ca = (ICU_DRUGS[a].category || [''])[0];
        var cb = (ICU_DRUGS[b].category || [''])[0];
        return ca.localeCompare(cb);
      });
    } else if (currentSort === 'renal_flag') {
      var order = { avoid: 0, reduce: 1, adjust: 2, safe: 3 };
      ids.sort(function(a, b) {
        var ba = order[(ICU_DRUGS[a].renal_adjustment || {}).badge] || 3;
        var bb = order[(ICU_DRUGS[b].renal_adjustment || {}).badge] || 3;
        return ba - bb;
      });
    }

    return ids;
  }

  /* ── Render grid ── */
  function renderGrid() {
    var grid = document.getElementById('drug-grid');
    var countEl = document.getElementById('drug-count');
    if (!grid) return;

    var ids = getFilteredIds();
    if (countEl) countEl.textContent = 'Menampilkan ' + ids.length + ' dari ' + Object.keys(ICU_DRUGS).length + ' obat';

    if (ids.length === 0) {
      grid.innerHTML = '<div class="dr-empty"><p>Tidak ada obat yang sesuai.</p><p style="margin-top:4px;font-size:10px">Coba: nama generik, nama brand, atau kelas obat.</p></div>';
      return;
    }
    grid.innerHTML = ids.map(function(id) { return renderCard(id); }).join('');
  }

  /* ── eGFR band selection ── */
  function setEgfrBand(band) {
    currentBand = band;

    /* Update band dropdown items */
    document.querySelectorAll('.dr-band-item').forEach(function(p) {
      p.classList.toggle('active', p.dataset.band === band);
    });

    /* Update band dropdown button label */
    var bandLabelEl = document.getElementById('dr-band-label');
    if (bandLabelEl) {
      if (band === 'all') {
        bandLabelEl.textContent = 'eGFR Mode';
      } else {
        var activeItem = document.querySelector('.dr-band-item[data-band="' + band + '"]');
        bandLabelEl.textContent = activeItem ? activeItem.textContent.split('·')[0].trim() : 'eGFR Mode';
      }
    }

    /* Update status */
    var status = document.getElementById('egfr-status');
    if (status) {
      if (band === 'all') {
        status.textContent = '';
      } else {
        var needAdj = Object.keys(ICU_DRUGS).filter(function(id) {
          var ra = ICU_DRUGS[id].renal_adjustment;
          return ra && ra.badge && ra.badge !== 'safe';
        });
        status.textContent = 'Mode aktif: ' + BAND_LABELS[band] + ' | ' + needAdj.length + ' obat perlu penyesuaian';
      }
    }

    renderGrid();
  }

  /* ── Build modal HTML for a drug ── */
  function buildModalHTML(id) {
    var drug = ICU_DRUGS[id];
    if (!drug) return '';
    var ra = drug.renal_adjustment || {};
    var bandKey = getBandKey(currentBand);
    var badgeKey = currentBand !== 'all' ? ra.badge : null;
    var badge = badgeKey ? BADGE_CONFIG[badgeKey] : null;
    var isHighAlert = drug.high_alert === true;

    /* ── Sticky wrapper: handle + header + tabs ── */
    var h = '<div class="drm-sticky">';
    h += '<div class="dr-modal-handle"></div>';

    /* Header */
    h += '<div class="drm-head">';
    h += '<div class="drm-head-info">';
    h += '<div class="drm-name">' + esc(drug.name) + '</div>';
    h += '<div class="drm-class">' + esc(drug.class || '') + (drug.subclass ? ' · ' + esc(drug.subclass) : '') + '</div>';
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
      drug.high_alert_warnings.forEach(function(w) { h += '<div class="drm-warn-item">⚠ ' + esc(w) + '</div>'; });
      if (drug.high_alert_protocol) {
        h += '<div class="drm-protocol">📋 Protokol: ' + esc(drug.high_alert_protocol) + '</div>';
      }
      h += '</div>';
    }

    /* Indikasi */
    if (drug.indications) {
      var ind = drug.indications;
      h += '<span class="drm-sec-lbl">📋 Indikasi ICU</span>';
      if (ind.icu_primary && ind.icu_primary.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Primer:</strong>';
        h += '<ul class="drm-ul">';
        ind.icu_primary.forEach(function(i) { h += '<li>' + esc(i) + '</li>'; });
        h += '</ul>';
      }
      if (ind.icu_secondary && ind.icu_secondary.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Sekunder:</strong>';
        h += '<ul class="drm-ul">';
        ind.icu_secondary.forEach(function(i) { h += '<li>' + esc(i) + '</li>'; });
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
        drug.contraindications.forEach(function(c) { h += '<li>' + esc(c) + '</li>'; });
        h += '</ul>';
      }
      if (drug.precautions && drug.precautions.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Perhatian:</strong>';
        h += '<ul class="drm-ul">';
        drug.precautions.forEach(function(p) { h += '<li>' + esc(p) + '</li>'; });
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
        var sp = drug.spectrum;
        var tags = '';
        if (sp.gram_pos) tags += '<span class="spectrum-tag stag-covered">Gram (+)</span>';
        if (sp.gram_neg) tags += '<span class="spectrum-tag stag-covered">Gram (−)</span>';
        if (sp.anaerob)  tags += '<span class="spectrum-tag stag-covered">Anaerob</span>';
        if (sp.esbl)     tags += '<span class="spectrum-tag stag-covered">ESBL</span>';
        if (sp.pseudomonas) tags += '<span class="spectrum-tag stag-partial">Pseudomonas ⚠</span>';
        if (sp.mrsa)     tags += '<span class="spectrum-tag stag-covered">MRSA</span>';
        else if (sp.gram_pos) tags += '<span class="spectrum-tag stag-no">No MRSA</span>';
        if (tags) h += '<div class="spectrum-tags">' + tags + '</div>';
        if (sp.gram_pos) h += '<div class="drm-p" style="margin-top:.4rem"><strong>G(+):</strong> ' + esc(sp.gram_pos) + '</div>';
        if (sp.gram_neg) h += '<div class="drm-p"><strong>G(−):</strong> ' + esc(sp.gram_neg) + '</div>';
        if (sp.anaerob)  h += '<div class="drm-p"><strong>Anaerob:</strong> ' + esc(sp.anaerob) + '</div>';
      }
    }
    h += '</div>'; /* end panel-umum */

    /* === TAB: DOSIS === */
    h += '<div class="drm-panel" id="drm-panel-dosis">';
    if (drug.dosing) {
      var d = drug.dosing;
      h += '<span class="drm-sec-lbl">💉 Dosis &amp; Cara Pemberian</span>';
      if (d.standard)    h += '<div class="drm-p"><strong>Standar:</strong> ' + esc(d.standard) + '</div>';
      if (d.loading)     h += '<div class="drm-p"><strong>Loading:</strong> ' + esc(d.loading) + '</div>';
      if (d.maintenance) h += '<div class="drm-p"><strong>Maintenance:</strong> ' + esc(d.maintenance) + '</div>';
      if (d.range_low || d.range_high) {
        h += '<div class="drm-p"><strong>Range:</strong> ' + esc(d.range_low || '—') + ' → ' + esc(d.range_high || '—') + '</div>';
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
      var bands = [
        { key: 'ge60',   label: '≥60' },
        { key: 'r30_60', label: '30–60' },
        { key: 'r15_30', label: '15–30' },
        { key: 'r_lt15', label: '<15' },
        { key: 'hd',     label: 'HD' },
        { key: 'crrt',   label: 'CRRT' }
      ];
      h += '<table class="drm-renal-tbl">';
      h += '<thead><tr><th>eGFR</th><th>Penyesuaian</th></tr></thead><tbody>';
      bands.forEach(function(b) {
        var a = ra[b.key] || '';
        var isActive = (currentBand === b.key) || (currentBand === 'all' && b.key === 'ge60');
        h += '<tr' + (isActive ? ' class="active-band"' : '') + '>';
        h += '<td><strong>' + esc(b.label) + '</strong></td>';
        h += '<td>' + esc(typeof a === 'string' ? a : (a.dose || a.note || '—')) + '</td>';
        h += '</tr>';
      });
      h += '</tbody></table>';
      if (ra.monitoring_renal) {
        h += '<div class="drm-p" style="margin-top:.6rem"><strong>Monitor:</strong> ' + esc(ra.monitoring_renal) + '</div>';
      }
      if (ra.dialyzable !== undefined) {
        h += '<div class="drm-p"><strong>Terdialisis:</strong> ' + (ra.dialyzable ? 'Ya' : 'Tidak') + '</div>';
      }
    }
    if (drug.hepatic_adjustment) {
      var ha = drug.hepatic_adjustment;
      h += '<span class="drm-sec-lbl">🫀 Penyesuaian Hepatik (Child-Pugh)</span>';
      h += '<table class="drm-renal-tbl">';
      h += '<thead><tr><th>Child-Pugh</th><th>Penyesuaian</th></tr></thead><tbody>';
      h += '<tr><td><strong>A</strong></td><td>' + esc(ha.child_a || '—') + '</td></tr>';
      h += '<tr><td><strong>B</strong></td><td>' + esc(ha.child_b || '—') + '</td></tr>';
      h += '<tr><td><strong>C</strong></td><td>' + esc(ha.child_c || '—') + '</td></tr>';
      h += '</tbody></table>';
      if (ha.note) h += '<div class="drm-p" style="margin-top:.5rem">' + esc(ha.note) + '</div>';
    }
    h += '</div>'; /* end panel-ginjal */

    /* === TAB: KEAMANAN === */
    h += '<div class="drm-panel" id="drm-panel-keamanan">';

    /* Monitoring */
    if (drug.monitoring) {
      var mon = drug.monitoring;
      h += '<span class="drm-sec-lbl">📊 Monitoring</span>';
      if (mon.efficacy && mon.efficacy.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Efikasi:</strong>';
        h += '<ul class="drm-ul">';
        mon.efficacy.forEach(function(e) { h += '<li>' + esc(e) + '</li>'; });
        h += '</ul>';
      }
      if (mon.safety && mon.safety.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Keamanan:</strong>';
        h += '<ul class="drm-ul">';
        mon.safety.forEach(function(s) { h += '<li>' + esc(s) + '</li>'; });
        h += '</ul>';
      }
      if (mon.therapeutic_range) h += '<div class="drm-block"><strong>Rentang Terapetik:</strong> ' + esc(mon.therapeutic_range) + '</div>';
      if (mon.frequency)         h += '<div class="drm-p"><strong>Frekuensi:</strong> ' + esc(mon.frequency) + '</div>';
    }

    /* Efek samping */
    if (drug.adverse_effects) {
      var ae = drug.adverse_effects;
      h += '<span class="drm-sec-lbl">⚠️ Efek Samping</span>';
      if (ae.critical && ae.critical.length) {
        h += '<strong style="font-size:11px;color:#ff6666">Kritis/Fatal:</strong>';
        h += '<ul class="drm-ul">';
        ae.critical.forEach(function(e) { h += '<li style="color:#ff8888">' + esc(e) + '</li>'; });
        h += '</ul>';
      }
      if (ae.common && ae.common.length) {
        h += '<strong style="font-size:11px;color:var(--text)">Umum:</strong>';
        h += '<ul class="drm-ul">';
        ae.common.forEach(function(e) { h += '<li>' + esc(e) + '</li>'; });
        h += '</ul>';
      }
      if (ae.antidote) {
        h += '<div class="drm-antidote"><strong>💊 Antidot:</strong> ' + esc(ae.antidote) + '</div>';
      }
    }

    /* Kehamilan */
    if (drug.pregnancy) {
      var pr = drug.pregnancy;
      h += '<span class="drm-sec-lbl">🤰 Kehamilan &amp; Laktasi</span>';
      if (pr.fda_category) h += '<div class="drm-p"><strong>Kategori FDA:</strong> ' + esc(pr.fda_category) + '</div>';
      if (pr.fetal_risk)   h += '<div class="drm-p"><strong>Risiko Fetal:</strong> ' + esc(pr.fetal_risk) + '</div>';
      if (pr.trimester_1)  h += '<div class="drm-p"><strong>TM 1:</strong> ' + esc(pr.trimester_1) + '</div>';
      if (pr.trimester_2)  h += '<div class="drm-p"><strong>TM 2:</strong> ' + esc(pr.trimester_2) + '</div>';
      if (pr.trimester_3)  h += '<div class="drm-p"><strong>TM 3:</strong> ' + esc(pr.trimester_3) + '</div>';
      if (pr.labor_delivery) h += '<div class="drm-p"><strong>Persalinan:</strong> ' + esc(pr.labor_delivery) + '</div>';
      if (pr.lactation)    h += '<div class="drm-p"><strong>Laktasi:</strong> ' + esc(pr.lactation) + (pr.lactation_note ? ' — ' + esc(pr.lactation_note) : '') + '</div>';
    }
    h += '</div>'; /* end panel-keamanan */

    /* === TAB: LAINNYA (Interaksi + Stewardship + Evidence) === */
    h += '<div class="drm-panel" id="drm-panel-interaksi">';

    /* Interaksi */
    if (drug.interactions) {
      var ix = drug.interactions;
      var hasMajor    = ix.major    && ix.major.length;
      var hasModerate = ix.moderate && ix.moderate.length;
      if (hasMajor || hasModerate) {
        h += '<span class="drm-sec-lbl">⚡ Interaksi Obat</span>';
        if (hasMajor) {
          h += '<strong style="font-size:11px;color:#ff8888">Interaksi Mayor:</strong>';
          ix.major.forEach(function(i) {
            h += '<div class="drm-ixn major">';
            if (typeof i === 'object') {
              h += '<strong>' + esc(i.drug || '') + '</strong>';
              if (i.effect) h += ': ' + esc(i.effect);
              if (i.management) h += '<br><em style="color:var(--text3)">Manajemen: ' + esc(i.management) + '</em>';
            } else {
              h += esc(i);
            }
            h += '</div>';
          });
        }
        if (hasModerate) {
          h += '<strong style="font-size:11px;color:#ffd700;display:block;margin-top:.5rem">Interaksi Moderat:</strong>';
          ix.moderate.forEach(function(i) {
            h += '<div class="drm-ixn moderate">';
            if (typeof i === 'object') {
              h += '<strong>' + esc(i.drug || '') + '</strong>';
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
      var st = drug.stewardship;
      h += '<span class="drm-sec-lbl">🛡 Stewardship Antibiotik</span>';
      h += '<div class="drm-stew">';
      if (st.empiric_sources && st.empiric_sources.length) {
        h += '<div><strong>Indikasi Empiris:</strong> ' + esc(st.empiric_sources.join(', ')) + '</div>';
      }
      if (st.duration_standard) {
        h += '<div><strong>Durasi:</strong> ' + st.duration_standard + ' hari';
        if (st.duration_short) h += ' (short course: ' + st.duration_short + ' hari)';
        h += '</div>';
      }
      if (st.duration_note) h += '<div>' + esc(st.duration_note) + '</div>';
      if (st.stop_criteria) h += '<div><strong>Kriteria Stop:</strong> ' + esc(st.stop_criteria) + '</div>';
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
      drug.evidence.forEach(function(ev) {
        h += '<div class="drm-block"><strong>' + esc(ev.ref_id) + '</strong>: ' + esc(ev.note) + '</div>';
      });
    }

    /* Brand notes */
    if (drug.brand_id_notes) {
      h += '<span class="drm-sec-lbl">💊 Brand &amp; Ketersediaan</span>';
      h += '<div class="drm-p">' + esc(drug.brand_id_notes) + '</div>';
      if (drug.brand_id && drug.brand_id.length) {
        h += '<ul class="drm-ul">';
        drug.brand_id.forEach(function(b) { h += '<li>' + esc(b) + '</li>'; });
        h += '</ul>';
      }
    }

    h += '</div>'; /* end panel-interaksi */
    h += '</div>'; /* end drm-body */
    return h;
  }

  /* ── Open drug modal ── */
  function openDrugModal(id) {
    var overlay = document.getElementById('drug-overlay');
    var content = document.getElementById('drug-modal-content');
    if (!overlay || !content || !ICU_DRUGS[id]) return;

    content.innerHTML = buildModalHTML(id);

    /* Sync theme toggle state */
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var drmCb = document.getElementById('drm-theme-cb');
    if (drmCb) drmCb.checked = isDark;
    var drmLbl = document.getElementById('drm-theme-lbl');
    if (drmLbl) drmLbl.textContent = isDark ? 'Dark' : 'Light';

    /* Tab switching */
    content.querySelectorAll('.drm-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        var tabId = this.dataset.tab;
        content.querySelectorAll('.drm-tab').forEach(function(t) { t.classList.remove('active'); });
        content.querySelectorAll('.drm-panel').forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        var panel = content.querySelector('#drm-panel-' + tabId);
        if (panel) panel.classList.add('active');
      });
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* Scroll body to top */
    var body = overlay.querySelector('.drm-body');
    if (body) body.scrollTop = 0;

    /* Init SVG Icons */
    if (window.lucide) window.lucide.createIcons();
  }

  /* ── Init event listeners ── */
  function init() {
    if (typeof ICU_DRUGS === 'undefined') {
      console.error('ICU_DRUGS not loaded — check drugs.js path');
      return;
    }

    allDrugIds = Object.keys(ICU_DRUGS);
    renderGrid();
    renderVasopressorFlowchart();
    renderSedationLadder();

    /* Card click → open modal (event delegation) */
    var grid = document.getElementById('drug-grid');
    if (grid) {
      grid.addEventListener('click', function(e) {
        var card = e.target.closest('[data-drug-id]');
        if (!card) return;
        /* Don't open modal if clicking pump badge link */
        if (e.target.closest('.badge-pump')) return;
        openDrugModal(card.dataset.drugId);
      });
    }

    /* eGFR input — inside the band dropdown */
    var egfrInput = document.getElementById('egfr-input');
    if (egfrInput) {
      /* prevent clicks on the input from closing the dropdown */
      egfrInput.addEventListener('click', function(e) { e.stopPropagation(); });
      egfrInput.addEventListener('input', function() {
        var val = parseInt(this.value);
        if (!val || isNaN(val)) { setEgfrBand('all'); return; }
        if (val >= 60)       setEgfrBand('ge60');
        else if (val >= 30)  setEgfrBand('r30_60');
        else if (val >= 15)  setEgfrBand('r15_30');
        else                 setEgfrBand('r_lt15');
      });
    }

    /* eGFR band dropdown items */
    document.querySelectorAll('.dr-band-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var egfrInput = document.getElementById('egfr-input');
        if (egfrInput) egfrInput.value = '';
        setEgfrBand(this.dataset.band);
        var drop = document.getElementById('dr-band-drop');
        if (drop) drop.classList.remove('open');
      });
    });

    /* Band dropdown toggle */
    var bandBtn  = document.getElementById('dr-band-btn');
    var bandWrap = document.getElementById('dr-band-drop');
    if (bandBtn && bandWrap) {
      bandBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        bandWrap.classList.toggle('open');
        /* close category dropdown if open */
        var catDrop = document.getElementById('dr-filter-drop');
        if (catDrop) catDrop.classList.remove('open');
      });
      document.addEventListener('click', function(e) {
        if (bandWrap && !bandWrap.contains(e.target)) {
          bandWrap.classList.remove('open');
        }
      });
    }

    /* Category filter — shared handler for dropdown items and desktop pills */
    function applyFilter(cat) {
      currentCat = cat;
      /* Update desktop pills */
      document.querySelectorAll('.dr-pill').forEach(function(p) {
        p.classList.toggle('active', p.dataset.cat === cat);
      });
      /* Update dropdown items */
      document.querySelectorAll('.dr-drop-item').forEach(function(p) {
        p.classList.toggle('active', p.dataset.cat === cat);
      });
      /* Update dropdown button label + dot */
      var activeItem = document.querySelector('.dr-drop-item[data-cat="' + cat + '"]');
      var labelEl = document.getElementById('dr-drop-label');
      var dotEl   = document.getElementById('dr-drop-dot');
      if (labelEl) {
        if (cat === 'all') {
          labelEl.textContent = 'Semua Obat';
        } else if (activeItem) {
          labelEl.textContent = activeItem.textContent.trim();
        }
      }
      if (dotEl) {
        dotEl.className = 'dr-drop-dot d-' + cat;
      }
      renderGrid();
    }

    document.querySelectorAll('.dr-pill').forEach(function(pill) {
      pill.addEventListener('click', function() { applyFilter(this.dataset.cat); });
    });

    document.querySelectorAll('.dr-drop-item').forEach(function(item) {
      item.addEventListener('click', function() {
        applyFilter(this.dataset.cat);
        /* Close dropdown */
        var drop = document.getElementById('dr-filter-drop');
        if (drop) drop.classList.remove('open');
      });
    });

    /* Dropdown toggle */
    var dropBtn  = document.getElementById('dr-drop-btn');
    var dropWrap = document.getElementById('dr-filter-drop');
    if (dropBtn && dropWrap) {
      dropBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropWrap.classList.toggle('open');
        /* close band dropdown if open */
        var bandDrop = document.getElementById('dr-band-drop');
        if (bandDrop) bandDrop.classList.remove('open');
      });
      document.addEventListener('click', function(e) {
        if (dropWrap && !dropWrap.contains(e.target)) {
          dropWrap.classList.remove('open');
        }
      });
    }

    /* Search */
    var searchInput = document.getElementById('drug-search');
    var clearBtn    = document.getElementById('search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        currentSearch = this.value;
        if (clearBtn) clearBtn.style.display = this.value ? 'block' : 'none';
        renderGrid();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (searchInput) { searchInput.value = ''; searchInput.focus(); }
        currentSearch = '';
        this.style.display = 'none';
        renderGrid();
      });
    }

    /* Sort */
    var sortSel = document.getElementById('drug-sort');
    if (sortSel) {
      sortSel.addEventListener('change', function() {
        currentSort = this.value;
        renderGrid();
      });
    }

    /* Keyboard shortcuts */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var overlay = document.getElementById('drug-overlay');
        if (overlay && overlay.classList.contains('open')) {
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
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('step-detail-btn') && e.target.dataset.drugKey) {
        openDrugModal(e.target.dataset.drugKey);
      }
    });
  }

  /* ── Close drug modal (exposed globally for onclick) ── */
  window.closeDrugModal = function() {
    var overlay = document.getElementById('drug-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ── Pump calculator popup ── */
  window.openPumpPopup = function(drugKey) {
    var overlay = document.getElementById('pump-overlay');
    var iframe  = document.getElementById('pump-iframe');
    if (!overlay || !iframe) return;
    iframe.src = 'kalkulator/kalkulator-pump.html?drug=' + encodeURIComponent(drugKey) + '&embedded=1';
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closePumpPopup = function() {
    var overlay = document.getElementById('pump-overlay');
    var iframe  = document.getElementById('pump-iframe');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.style.display = '';
      overlay.style.opacity = '';
      overlay.style.pointerEvents = '';
    }
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
  };

  /* ── Start ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
