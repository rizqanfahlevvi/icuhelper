/* ============================================================
   scripts-kalkulator-ventilator.js
   Halaman: kalkulator-ventilator.html
   Fungsi: Kalkulator Ventilator Lanjutan — Compliance, Driving
           Pressure, Mechanical Power, Resistance, P/F, OI,
           PEEP saran (ARDSNet), Minute Ventilation
   Referensi: ARDS Network 2000, ESICM ARDS 2023, KDIGO 2024
   ES5 Compatible
   ============================================================ */

/* ---- SpO2 → PaO2 konversi tabel (interpolasi linier) ---- */
var _spo2Table = [
  { spo2: 88,  pao2: 55  },
  { spo2: 90,  pao2: 60  },
  { spo2: 92,  pao2: 70  },
  { spo2: 94,  pao2: 79  },
  { spo2: 96,  pao2: 93  },
  { spo2: 98,  pao2: 113 },
  { spo2: 100, pao2: 145 }
];

function spo2ToPao2(spo2) {
  if (spo2 <= 88) return 55;
  if (spo2 >= 100) return 145;
  for (var i = 0; i < _spo2Table.length - 1; i++) {
    var lo = _spo2Table[i];
    var hi = _spo2Table[i + 1];
    if (spo2 >= lo.spo2 && spo2 <= hi.spo2) {
      var frac = (spo2 - lo.spo2) / (hi.spo2 - lo.spo2);
      return Math.round((lo.pao2 + frac * (hi.pao2 - lo.pao2)) * 10) / 10;
    }
  }
  return null;
}

/* ---- ARDSNet FiO2-PEEP Tables ---- */
/* Lower PEEP Table (FiO2 0–1 → PEEP in cmH2O) */
var _lowerPeepTable = [
  { fio2: 0.30, peep: 5  },
  { fio2: 0.40, peep: 5  },
  { fio2: 0.50, peep: 8  },
  { fio2: 0.60, peep: 10 },
  { fio2: 0.70, peep: 10 },
  { fio2: 0.80, peep: 10 },
  { fio2: 0.90, peep: 14 },
  { fio2: 1.00, peep: 14 }
];

/* Higher PEEP Table */
var _higherPeepTable = [
  { fio2: 0.30, peep: 5  },
  { fio2: 0.40, peep: 8  },
  { fio2: 0.50, peep: 10 },
  { fio2: 0.60, peep: 14 },
  { fio2: 0.70, peep: 14 },
  { fio2: 0.80, peep: 16 },
  { fio2: 0.90, peep: 18 },
  { fio2: 1.00, peep: 22 }
];

function getArdsnetPeep(fio2Frac, useHigher) {
  var table = useHigher ? _higherPeepTable : _lowerPeepTable;
  /* find closest FiO2 bracket */
  var best = table[0];
  var bestDiff = Math.abs(fio2Frac - table[0].fio2);
  for (var i = 1; i < table.length; i++) {
    var diff = Math.abs(fio2Frac - table[i].fio2);
    if (diff < bestDiff) { bestDiff = diff; best = table[i]; }
  }
  return best.peep;
}

/* ---- resCard (sama pola dengan insulin kalkulator) ---- */
function resCard(label, value, sub, highlight) {
  return '<div class="ins-res-card' + (highlight ? ' highlight' : '') + '">' +
    '<div class="ins-res-label">' + label + '</div>' +
    '<div class="ins-res-value">' + value + '</div>' +
    '<div class="ins-res-sub">' + (sub || '') + '</div>' +
    '</div>';
}

/* ---- buildWarnings ---- */
function buildWarnings(warnings) {
  if (!warnings || !warnings.length) return '';
  var html = '<div class="ins-warn"><strong>Perhatian Klinis:</strong>';
  html += '<ul style="margin:6px 0 0;padding-left:18px">';
  for (var i = 0; i < warnings.length; i++) {
    html += '<li style="margin-bottom:4px">' + warnings[i] + '</li>';
  }
  html += '</ul></div>';
  return html;
}

/* ---- Mode-specific VT suggestion ---- */
function vtSuggestion(mode, ibw) {
  if (!ibw || isNaN(ibw) || ibw <= 0) return null;
  var ranges = {
    ards:   { lo: 4, hi: 6,  label: 'ARDS: 4–6 mL/kg IBW (lung protective)' },
    copd:   { lo: 7, hi: 8,  label: 'PPOK: 7–8 mL/kg IBW' },
    neuro:  { lo: 6, hi: 8,  label: 'Neuro/Normal: 6–8 mL/kg IBW' },
    assist: { lo: 6, hi: 8,  label: 'Assist/Normal: 6–8 mL/kg IBW' }
  };
  var r = ranges[mode] || ranges['assist'];
  return {
    loVt: Math.round(r.lo * ibw),
    hiVt: Math.round(r.hi * ibw),
    label: r.label
  };
}

/* ============================================================
   MAIN FUNCTION — calcVentilator()
   Dipanggil dari tombol / oninput pada form
   ============================================================ */
function calcVentilator() {
  var resDiv = document.getElementById('vent-adv-result');
  if (!resDiv) return;

  /* --- Ambil Input --- */
  var mode   = (document.getElementById('ventadv-mode')   || {}).value || 'assist';
  var ibw    = parseFloat((document.getElementById('ventadv-ibw')    || {}).value);
  var ppeak  = parseFloat((document.getElementById('ventadv-ppeak')  || {}).value);
  var pplat  = parseFloat((document.getElementById('ventadv-pplat')  || {}).value);
  var peep   = parseFloat((document.getElementById('ventadv-peep')   || {}).value);
  var vt     = parseFloat((document.getElementById('ventadv-vt')     || {}).value);
  var rr     = parseFloat((document.getElementById('ventadv-rr')     || {}).value);
  var fio2   = parseFloat((document.getElementById('ventadv-fio2')   || {}).value);
  var spo2   = parseFloat((document.getElementById('ventadv-spo2')   || {}).value);
  var pao2   = parseFloat((document.getElementById('ventadv-pao2')   || {}).value);
  var ieStr  = (document.getElementById('ventadv-ie') || {}).value || '1:2';

  /* --- Validasi minimal --- */
  var missing = [];
  if (isNaN(ppeak)) missing.push('Ppeak');
  if (isNaN(pplat)) missing.push('Pplat');
  if (isNaN(peep))  missing.push('PEEP');
  if (isNaN(vt))    missing.push('VT');
  if (isNaN(rr))    missing.push('RR');
  if (isNaN(fio2))  missing.push('FiO₂');

  if (missing.length) {
    resDiv.style.display = 'none';
    return;
  }

  resDiv.style.display = 'block';

  /* --- FiO2 sebagai fraksi (input dalam %) --- */
  var fio2Frac = fio2 / 100;

  /* --- Tentukan PaO2 --- */
  var pao2Used = null;
  var pao2Source = '';
  if (!isNaN(pao2) && pao2 > 0) {
    pao2Used = pao2;
    pao2Source = 'dari input PaO₂ AGD';
  } else if (!isNaN(spo2) && spo2 > 0) {
    pao2Used = spo2ToPao2(spo2);
    pao2Source = 'estimasi dari SpO₂ ' + spo2 + '% (tabel konversi)';
  }

  /* --- Parse I:E ratio untuk Ti --- */
  var ieParts = ieStr.split(':');
  var ieI = parseFloat(ieParts[0]) || 1;
  var ieE = parseFloat(ieParts[1]) || 2;
  /* Ti = (1/(1 + I:E)) × (60/RR) */
  var tiSec = (ieI / (ieI + ieE)) * (60 / rr);
  /* Flow (L/min) = VT(L) / Ti(min) */
  var flowLMin = (vt / 1000) / (tiSec / 60);

  /* ============================================================
     KALKULASI UTAMA
     ============================================================ */

  /* 1. Compliance Statis (mL/cmH2O) */
  var deltaPlat = pplat - peep;
  var cstat = deltaPlat > 0 ? Math.round((vt / deltaPlat) * 10) / 10 : null;

  /* 2. Driving Pressure (ΔP) */
  var deltaP = pplat - peep;

  /* 3. Mechanical Power (J/min)
     Formula: MP = 0.098 × RR × VT(L) × (Ppeak − ΔP/2)
     (Gattinoni et al. 2016, simplified)
  */
  var vtL = vt / 1000;
  var mp = Math.round(0.098 * rr * vtL * (ppeak - deltaP / 2) * 10) / 10;

  /* 4. Resistance (cmH2O/L/sec)
     R = (Ppeak − Pplat) / Flow(L/sec)
  */
  var flowLSec = flowLMin / 60;
  var resistance = flowLSec > 0
    ? Math.round(((ppeak - pplat) / flowLSec) * 10) / 10
    : null;

  /* 5. P/F Ratio */
  var pfRatio = pao2Used ? Math.round(pao2Used / fio2Frac) : null;

  /* 6. PEEP Saran (ARDSNet Lower dan Higher) */
  var peepLower  = getArdsnetPeep(fio2Frac, false);
  var peepHigher = getArdsnetPeep(fio2Frac, true);

  /* 7. Oxygenation Index (OI)
     MAP ventilator ≈ (Ppeak + 2×PEEP) / 3
     OI = (FiO2% × MAP × 100) / PaO2
     Catatan: FiO2 dalam % (tidak fraksi) untuk OI klasik
  */
  var mapVent = (ppeak + 2 * peep) / 3;
  var oi = pao2Used && pao2Used > 0
    ? Math.round((fio2 * mapVent * 100) / pao2Used * 10) / 10
    : null;

  /* Versi alternatif OSI (dari SpO2 jika tidak ada PaO2): */
  var osi = null;
  if (!isNaN(spo2) && spo2 > 0 && spo2 <= 100) {
    osi = Math.round((fio2 * mapVent * 100) / spo2 * 10) / 10;
  }

  /* 8. Minute Ventilation */
  var ve = Math.round((vtL * rr) * 10) / 10;

  /* ============================================================
     INTERPRETASI P/F dan ARDS Severity
     ============================================================ */
  var pfLabel = '';
  var pfColor = 'var(--text)';
  if (pfRatio !== null) {
    if (pfRatio >= 400) { pfLabel = 'Normal (≥400)'; }
    else if (pfRatio >= 300) { pfLabel = 'Ringan (Berlin: 200–300)'; }
    else if (pfRatio >= 200) { pfLabel = 'ARDS Ringan (200–300)'; }
    else if (pfRatio >= 100) { pfLabel = 'ARDS Sedang (100–200)'; }
    else { pfLabel = 'ARDS Berat (<100)'; }
  }

  /* ============================================================
     VT / IBW per mode
     ============================================================ */
  var vtPerIbw = (!isNaN(ibw) && ibw > 0) ? Math.round(vt / ibw * 10) / 10 : null;
  var vtSug = vtSuggestion(mode, ibw);

  /* ============================================================
     WARNINGS
     ============================================================ */
  var warnings = [];

  if (deltaP > 15) {
    warnings.push('<strong>⚠️ Driving Pressure tinggi (' + deltaP + ' cmH₂O &gt;15)</strong> — pertimbangkan turunkan VT (prioritaskan ΔP ≤15 pada ARDS). PROVE-IT trial: setiap ↑1 cmH₂O DP → mortalitas ↑ 3–5%.');
  }
  if (mp > 17) {
    warnings.push('<strong>⚠️ Mechanical Power tinggi (' + mp + ' J/min &gt;17)</strong> — risiko VILI (Ventilator-Induced Lung Injury) meningkat. Pertimbangkan: turunkan RR, VT, atau Ppeak.');
  }
  if (cstat !== null && cstat < 30) {
    warnings.push('<strong>⚠️ Compliance statis sangat rendah (' + cstat + ' mL/cmH₂O &lt;30)</strong> — indikator ARDS berat atau fibrosis. Verifikasi tidak ada obstruksi ETT atau mucus plug.');
  } else if (cstat !== null && cstat < 50) {
    warnings.push('<strong>ℹ️ Compliance statis rendah (' + cstat + ' mL/cmH₂O, normal &gt;50)</strong> — lungs stiff. Monitor tren, pertimbangkan penyebab (ARDS, atelektasis, efusi, pneumonia).');
  }
  if (resistance !== null && resistance > 15) {
    warnings.push('<strong>⚠️ Resistensi tinggi (' + resistance + ' cmH₂O/L/det &gt;15)</strong> — kemungkinan bronkospasme atau mucus plug. Lakukan suction, bronkodilator inhalasi, atau cek posisi ETT.');
  }
  if ((ppeak - pplat) > 10) {
    warnings.push('<strong>⚠️ Ppeak − Pplat (' + (ppeak - pplat) + ' cmH₂O &gt;10)</strong> — resistensi jalan napas sangat tinggi. Periksa: kinking selang, mucus plug masif, bronkospasme berat.');
  }
  if (pplat > 30) {
    warnings.push('<strong>⚠️ Pplat tinggi (' + pplat + ' cmH₂O &gt;30)</strong> — risiko VILI. Turunkan VT (target Pplat ≤30 cmH₂O pada ARDS — ARDSNet).');
  }
  if (vtPerIbw !== null && mode === 'ards' && vtPerIbw > 6) {
    warnings.push('<strong>⚠️ VT/IBW ' + vtPerIbw + ' mL/kg pada mode ARDS (&gt;6)</strong> — target lung-protective VT 4–6 mL/kg IBW. VT saat ini: ' + vt + ' mL / IBW ' + ibw + ' kg.');
  }
  if (pfRatio !== null && pfRatio < 150) {
    warnings.push('<strong>⚠️ P/F &lt;150 — pertimbangkan prone positioning</strong> (PROSEVA trial: prone ≥16 jam/hari → mortalitas ↓ 16% pada ARDS berat). Pastikan kriteria lain terpenuhi.');
  }
  if (ve > 12) {
    warnings.push('<strong>ℹ️ Minute ventilation tinggi (' + ve + ' L/mnt)</strong> — pada ARDS: permissive hypercapnia diterima (pH ≥7.2). Tidak perlu koreksi VE hanya untuk normalisasi PaCO₂.');
  }
  if (ve < 5) {
    warnings.push('<strong>⚠️ Minute ventilation rendah (' + ve + ' L/mnt)</strong> — risiko hipoventilasi. Cek RR dan VT, terutama pada mode tanpa backup RR yang memadai.');
  }

  /* ============================================================
     BUILD HTML OUTPUT
     ============================================================ */
  var html = '';

  /* --- Card Grid --- */
  html += '<div class="ins-result-grid">';

  /* Compliance */
  html += resCard(
    'Compliance Statis (Cst)',
    cstat !== null ? cstat + ' mL/cmH₂O' : '—',
    cstat !== null
      ? (cstat >= 50 ? '✅ Normal (≥50)' : cstat >= 30 ? '⚠️ Berkurang' : '🔴 Sangat rendah (<30)')
      + ' · VT ' + vt + ' ÷ (Pplat ' + pplat + ' − PEEP ' + peep + ')'
      : 'Pplat − PEEP = 0, tidak dapat dihitung',
    cstat !== null && cstat < 30
  );

  /* Driving Pressure */
  html += resCard(
    'Driving Pressure (ΔP)',
    deltaP + ' cmH₂O',
    (deltaP <= 15 ? '✅ Aman (≤15)' : '⚠️ Tinggi (>15)') + ' · Pplat ' + pplat + ' − PEEP ' + peep,
    deltaP > 15
  );

  /* Mechanical Power */
  html += resCard(
    'Mechanical Power',
    mp + ' J/min',
    (mp <= 17 ? '✅ Aman (≤17)' : '⚠️ Tinggi (>17, risiko VILI)') +
      ' · 0.098 × RR × VT(L) × (Ppeak − ΔP/2)',
    mp > 17
  );

  /* Resistance */
  html += resCard(
    'Resistensi Jalan Napas',
    resistance !== null ? resistance + ' cmH₂O/L/det' : '—',
    resistance !== null
      ? (resistance <= 15 ? '✅ Normal (≤15)' : '⚠️ Tinggi') +
        ' · (Ppeak−Pplat) ÷ Flow ' + Math.round(flowLSec * 100) / 100 + ' L/det'
      : 'Tidak dapat dihitung (flow = 0)',
    resistance !== null && resistance > 15
  );

  /* P/F Ratio */
  if (pao2Used !== null) {
    html += resCard(
      'P/F Ratio (PaO₂/FiO₂)',
      pfRatio,
      pfLabel + ' · PaO₂ ' + pao2Used + ' mmHg ' + pao2Source,
      pfRatio !== null && pfRatio < 200
    );
  } else {
    html += resCard(
      'P/F Ratio',
      '—',
      'Masukkan SpO₂ atau PaO₂ untuk menghitung',
      false
    );
  }

  /* OI */
  if (oi !== null) {
    html += resCard(
      'Oxygenation Index (OI)',
      oi,
      (oi < 5 ? '✅ Normal' : oi < 16 ? '⚠️ Meningkat' : '🔴 Berat') +
        ' · (FiO₂% × MAP×100) ÷ PaO₂ · MAP ventilator ≈ ' + Math.round(mapVent * 10) / 10,
      oi >= 16
    );
  } else if (osi !== null) {
    html += resCard(
      'Oxygenation Saturation Index (OSI)',
      osi,
      '(FiO₂% × MAP×100) ÷ SpO₂ · Surrogate OI bila tidak ada AGD',
      osi >= 16
    );
  }

  /* Minute Ventilation */
  html += resCard(
    'Minute Ventilation (VE)',
    ve + ' L/mnt',
    (ve >= 8 && ve <= 12 ? '✅ Target (8–12 L/mnt normal)' :
     ve < 8 ? '⚠️ Rendah' : '⚠️ Tinggi') +
    ' · VT ' + vtL + ' L × RR ' + rr,
    false
  );

  /* VT per IBW */
  if (vtPerIbw !== null) {
    html += resCard(
      'VT per IBW',
      vtPerIbw + ' mL/kg IBW',
      (vtSug ? vtSug.label + ' · IBW ' + ibw + ' kg' : 'IBW ' + ibw + ' kg'),
      vtPerIbw > 8 || (mode === 'ards' && vtPerIbw > 6)
    );
  }

  html += '</div>'; /* end ins-result-grid */

  /* --- PEEP Saran ARDSNet --- */
  html += '<div style="margin-top:14px">';
  html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px">📋 Rekomendasi PEEP — ARDSNet FiO₂-PEEP Table (FiO₂ ' + fio2 + '%)</div>';
  html += '<div class="grid2" style="gap:8px">';

  /* Lower PEEP */
  html += '<div class="ins-res-card' + (Math.abs(peep - peepLower) <= 2 ? ' highlight' : '') + '">';
  html += '<div class="ins-res-label">Lower PEEP Table</div>';
  html += '<div class="ins-res-value">' + peepLower + ' cmH₂O</div>';
  html += '<div class="ins-res-sub">FiO₂ ' + fio2 + '% · Untuk ARDS ringan–sedang atau compliance masih baik' + (peep === peepLower ? ' ← PEEP Anda saat ini' : '') + '</div>';
  html += '</div>';

  /* Higher PEEP */
  html += '<div class="ins-res-card' + (Math.abs(peep - peepHigher) <= 2 ? ' highlight' : '') + '">';
  html += '<div class="ins-res-label">Higher PEEP Table</div>';
  html += '<div class="ins-res-value">' + peepHigher + ' cmH₂O</div>';
  html += '<div class="ins-res-sub">FiO₂ ' + fio2 + '% · Untuk ARDS sedang–berat, recruitment strategy' + (peep === peepHigher ? ' ← PEEP Anda saat ini' : '') + '</div>';
  html += '</div>';

  html += '</div>'; /* end grid2 */
  html += '<p style="font-size:11px;color:var(--muted);margin-top:6px">PEEP saat ini: <strong>' + peep + ' cmH₂O</strong> · Lower PEEP saran: <strong>' + peepLower + '</strong> · Higher PEEP saran: <strong>' + peepHigher + '</strong>. Pilihan tabel berdasarkan strategi lung protection dan respons rekrutmen individual.</p>';
  html += '</div>';

  /* --- VT Suggestion --- */
  if (vtSug) {
    html += '<div style="margin-top:12px;padding:10px 14px;background:var(--bg);border:1.5px solid var(--border);border-radius:12px">';
    html += '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Saran VT Berdasarkan Mode & IBW</div>';
    html += '<div style="font-size:14px;color:var(--text)">' + vtSug.label + '</div>';
    html += '<div style="font-size:13px;color:var(--accent);font-family:var(--font-mono);font-weight:700;margin-top:4px">';
    html += vtSug.loVt + '–' + vtSug.hiVt + ' mL';
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--text2);margin-top:2px">IBW ' + ibw + ' kg · VT saat ini: ' + vt + ' mL (' + (vtPerIbw !== null ? vtPerIbw + ' mL/kg IBW' : '—') + ')</div>';
    html += '</div>';
  }

  /* --- Warnings --- */
  html += buildWarnings(warnings);

  /* --- Summary Interpretasi Mode --- */
  html += '<div style="margin-top:14px;padding:10px 14px;background:var(--bg);border:1.5px solid var(--border);border-radius:12px">';
  html += '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Ringkasan Parameter Ventilator</div>';
  html += '<table style="font-size:12px">';
  html += '<tr><th>Parameter</th><th>Nilai</th><th>Target / Interpretasi</th></tr>';
  html += '<tr><td>Mode</td><td>' + mode.toUpperCase() + '</td><td>' + getModeDesc(mode) + '</td></tr>';
  html += '<tr><td>Ppeak / Pplat / PEEP</td><td>' + ppeak + ' / ' + pplat + ' / ' + peep + ' cmH₂O</td><td>Pplat ≤30, PEEP titasi per FiO₂</td></tr>';
  html += '<tr><td>Driving Pressure (ΔP)</td><td>' + deltaP + ' cmH₂O</td><td>Target ≤15 cmH₂O (ARDS)</td></tr>';
  html += '<tr><td>Compliance Statis</td><td>' + (cstat !== null ? cstat + ' mL/cmH₂O' : '—') + '</td><td>Normal &gt;50, &lt;30 = ARDS berat</td></tr>';
  html += '<tr><td>Mechanical Power</td><td>' + mp + ' J/min</td><td>Target &lt;17 J/min</td></tr>';
  if (resistance !== null) html += '<tr><td>Resistensi</td><td>' + resistance + ' cmH₂O/L/det</td><td>Normal &lt;15</td></tr>';
  if (pfRatio !== null) html += '<tr><td>P/F Ratio</td><td>' + pfRatio + '</td><td>' + pfLabel + '</td></tr>';
  if (oi !== null) html += '<tr><td>OI</td><td>' + oi + '</td><td>&lt;5 normal, 5–15 mild/mod, &gt;16 berat</td></tr>';
  html += '<tr><td>VE (Minute Ventilation)</td><td>' + ve + ' L/mnt</td><td>Normal 8–10 L/mnt; ARDS: permissive hypercapnia</td></tr>';
  html += '</table>';
  html += '</div>';

  resDiv.innerHTML = html;

  /* --- Simpan History --- */
  if (typeof window.saveCalcHistory === 'function') {
    var sumParts = [
      'ΔP ' + deltaP + ' cmH₂O',
      'Cst ' + (cstat !== null ? cstat : '—') + ' mL/cmH₂O',
      'MP ' + mp + ' J/min'
    ];
    if (pfRatio !== null) sumParts.push('P/F ' + pfRatio);
    window.saveCalcHistory(
      'ventilator-adv',
      'Ventilator Lanjutan — Mode ' + mode.toUpperCase() + ', VT ' + vt + ' mL, RR ' + rr,
      {
        mode: mode, ibw: ibw, ppeak: ppeak, pplat: pplat,
        peep: peep, vt: vt, rr: rr, fio2: fio2, spo2: spo2, pao2: pao2
      },
      sumParts.join(' · ')
    );
  }
}

/* ---- Mode description helper ---- */
function getModeDesc(mode) {
  var descs = {
    ards:   'ARDS — lung protective, ΔP ≤15, VT 4–6 mL/kg IBW',
    copd:   'PPOK — hindari auto-PEEP, I:E 1:3–1:4, VT 7–8 mL/kg',
    neuro:  'Neuro/Normal — normocapnia, VT 6–8 mL/kg IBW',
    assist: 'Assist/Normal — sesuai kebutuhan pasien, VT 6–8 mL/kg IBW'
  };
  return descs[mode] || descs['assist'];
}
