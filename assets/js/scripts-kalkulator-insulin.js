/* ============================================================
   scripts-kalkulator-insulin.js
   Halaman: kalkulator-insulin.html
   Fungsi: BBC (Basal-Bolus-Correction) & Sliding Scale insulin
   ============================================================ */

var _insMode = 'bbc';

function setInsMode(mode) {
  _insMode = mode;
  document.getElementById('mode-btn-bbc').classList.toggle('active', mode === 'bbc');
  document.getElementById('mode-btn-ss').classList.toggle('active', mode === 'ss');
  var extra = document.getElementById('bbc-extra-inputs');
  if (extra) extra.style.display = mode === 'bbc' ? '' : 'none';
  calcInsulin();
}

function calcInsulin() {
  var bb     = parseFloat(document.getElementById('ins-bb').value);
  var gds    = parseFloat(document.getElementById('ins-gds').value);
  var target = parseFloat(document.getElementById('ins-target').value) || 150;
  var resDiv = document.getElementById('ins-result');
  if (!resDiv) return;

  /* ---- Hypoglycemia guard ---- */
  if (!isNaN(gds) && gds < 70) {
    resDiv.style.display = 'block';
    resDiv.innerHTML =
      '<div class="ins-hipo">⛔ GDS ' + gds + ' mg/dL — HIPOGLIKEMIA!' +
        '<div style="font-size:12px;font-weight:400;margin-top:4px">Tatalaksana hipo dulu: D40% 25 mL IV bolus (atau D10% 150 mL). ' +
        'STOP semua insulin. Cek ulang GDS 15 menit. Jangan hitung dosis insulin saat hipo aktif.</div>' +
      '</div>';
    return;
  }

  if (isNaN(bb) || isNaN(gds)) {
    resDiv.style.display = 'none';
    return;
  }

  resDiv.style.display = 'block';

  if (_insMode === 'ss') {
    renderSlidingScale(gds, target, resDiv);
    return;
  }

  /* ---- BBC Mode ---- */
  var kondisi   = document.getElementById('ins-kondisi').value;
  var makanVal  = document.getElementById('ins-makan').value;
  var tddPrev   = parseFloat(document.getElementById('ins-tdd-prev').value);

  /* Faktor dosis awal berdasarkan kondisi */
  var doseFactor = 0.5;
  if (kondisi === 'ginjal' || kondisi === 'lansia') doseFactor = 0.3;
  else if (kondisi === 'kritis') doseFactor = 0.3;
  else if (kondisi === 'steroid') doseFactor = 0.6;

  var tdd = isNaN(tddPrev) || tddPrev <= 0
    ? Math.round(bb * doseFactor)
    : tddPrev;

  var basal  = Math.round(tdd * 0.5);
  var bolusTotal = tdd - basal;

  var mealCount = makanVal === 'makan' ? 3 : makanVal === 'sebagian' ? 2 : 0;
  var bolusPerMeal = mealCount > 0 ? Math.round(bolusTotal / mealCount * 10) / 10 : 0;

  /* Correction Factor (CF) */
  var cf = Math.round(1800 / tdd);
  var correctionRaw = (gds - target) / cf;
  var correction = Math.max(0, Math.round(correctionRaw * 10) / 10);

  /* Total now */
  var totalNow = mealCount > 0
    ? Math.round((bolusPerMeal + correction) * 10) / 10
    : correction;

  /* Sliding scale equivalent */
  var ssLabel = getSlidingScaleLabel(gds);

  /* Warnings */
  var warnings = [];
  if (kondisi === 'steroid') warnings.push('⚠️ Steroid: pertimbangkan <strong>NPH pagi</strong> jika steroid diberikan pagi sekali sehari (lebih cocok dengan pola hiperglikemia siang-sore).');
  if (kondisi === 'ginjal')  warnings.push('⚠️ GFR &lt;30/HD: insulin dieliminasi lebih lambat — mulai dengan dosis lebih rendah, pantau ketat hipoglikemia.');
  if (kondisi === 'kritis')  warnings.push('⚠️ Pasien ICU/kritis: pertimbangkan <strong>insulin infus IV</strong> untuk kontrol lebih presisi daripada SC basal-bolus.');
  if (kondisi === 'lansia')  warnings.push('⚠️ Lansia: target lebih longgar (160–180 mg/dL) dapat dipertimbangkan untuk minimalisasi hipoglikemia.');
  if (mealCount === 0)       warnings.push('ℹ️ Pasien puasa: bolus makan dihilangkan. Hanya basal + koreksi sesuai GDS tiap 4–6 jam.');
  if (gds > 350)             warnings.push('⚠️ GDS sangat tinggi (&gt;350): pertimbangkan insulin infus IV. Koreksi SC saja mungkin tidak cukup cepat.');

  var html = '';

  /* Result grid */
  html += '<div class="ins-result-grid">';

  html += resCard('TDD (Total Daily Dose)',
    tdd + ' unit',
    (!isNaN(tddPrev) && tddPrev > 0 ? 'dari input sebelumnya' : bb + ' kg × ' + doseFactor + ' unit/kg'),
    false);

  html += resCard('Basal (1× malam)',
    basal + ' unit',
    'Lantus / Levemir / Tresiba — tiap malam',
    false);

  if (mealCount > 0) {
    html += resCard('Bolus per Makan',
      bolusPerMeal + ' unit',
      'Novorapid/Humalog ' + mealCount + '× sehari (sebelum makan)',
      false);
  } else {
    html += resCard('Bolus Makan', '—', 'Pasien puasa/NPO — tidak diberikan', false);
  }

  html += resCard('Faktor Koreksi (CF)',
    cf + ' mg/dL per unit',
    '1800 ÷ TDD — 1 unit turunkan GDS ±' + cf + ' mg/dL',
    false);

  html += resCard('Koreksi Sekarang',
    correction + ' unit',
    'GDS ' + gds + ' → target ' + target + ' · selisih ' + Math.max(0, Math.round(gds - target)) + ' ÷ CF ' + cf,
    correction > 0);

  html += resCard('TOTAL Diberikan Sekarang',
    totalNow + ' unit',
    mealCount > 0
      ? 'Bolus ' + bolusPerMeal + ' + Koreksi ' + correction + ' unit (saat makan)'
      : 'Koreksi saja (puasa) · ulang tiap 4–6 jam',
    true);

  html += '</div>';

  /* Sliding scale comparison */
  html += '<div style="margin-top:14px">';
  html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px">📋 Ekuivalen Sliding Scale (referensi)</div>';
  html += buildSlidingScaleTable(gds, target);
  html += '</div>';

  /* Warnings */
  if (warnings.length) {
    html += '<div class="ins-warn"><strong>Perhatian:</strong><ul style="margin:6px 0 0;padding-left:18px">';
    warnings.forEach(function(w){ html += '<li style="margin-bottom:4px">' + w + '</li>'; });
    html += '</ul></div>';
  }

  resDiv.innerHTML = html;

  /* Save history */
  if (typeof window.saveCalcHistory === 'function') {
    var modeLabel = 'BBC';
    var summaryText = 'TDD ' + tdd + 'u · Basal ' + basal + 'u · Koreksi sekarang ' + correction + 'u';
    if (mealCount > 0) summaryText += ' · Bolus/makan ' + bolusPerMeal + 'u';
    window.saveCalcHistory(
      'insulin',
      'Insulin ' + modeLabel + ' — BB ' + bb + ' kg, GDS ' + gds,
      { bb: bb, gds: gds, target: target, tddPrev: tddPrev, kondisi: kondisi, makan: makanVal },
      summaryText
    );
  }
}

function renderSlidingScale(gds, target, resDiv) {
  var ssLabel = getSlidingScaleLabel(gds);
  var html = '<div style="margin-bottom:12px">';
  html += '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">';
  html += 'GDS ' + gds + ' mg/dL → ';
  if (gds < 70) {
    html += '<span style="color:#ef4444">⛔ HIPOGLIKEMIA — STOP insulin</span>';
  } else if (gds <= 200) {
    html += '<span style="color:var(--green,#30d158)">✓ Target tercapai — tidak perlu koreksi insulin</span>';
  } else {
    html += '<span style="color:var(--accent)">' + ssLabel + '</span>';
  }
  html += '</div>';
  html += buildSlidingScaleTable(gds, target);
  html += '</div>';
  html += '<div class="ins-warn"><strong>⚠️ Sliding scale murni:</strong> hanya koreksi reaktif — tidak ada komponen basal. ' +
    'Gunakan mode <em>Basal–Bolus–Koreksi</em> untuk manajemen lebih optimal.</div>';
  resDiv.innerHTML = html;
}

function buildSlidingScaleTable(gds, target) {
  var rows = [
    { min: 0,   max: 69,  label: '⛔ &lt;70',    dose: '—',  note: 'HIPOGLIKEMIA — stop insulin, koreksi hipo', cls: 'hipo' },
    { min: 70,  max: 200, label: '70–200',  dose: '—',  note: 'Target / tidak perlu koreksi', cls: '' },
    { min: 201, max: 250, label: '201–250', dose: '2N', note: '2 unit Novorapid/Actrapid SC', cls: '' },
    { min: 251, max: 300, label: '251–300', dose: '4N', note: '4 unit', cls: '' },
    { min: 301, max: 350, label: '301–350', dose: '6N', note: '6 unit', cls: '' },
    { min: 351, max: 999, label: '&gt;350',   dose: '8N', note: '8 unit — atau lapor dokter', cls: '' }
  ];

  var html = '';
  rows.forEach(function(r) {
    var isActive = gds >= r.min && gds <= r.max;
    html += '<div class="ss-row' + (isActive ? ' active-row' : '') + '">';
    html += '<div class="ss-range">' + r.label + '</div>';
    html += '<div class="ss-dose">' + r.dose + '</div>';
    html += '<div class="ss-arrow">' + r.note + (isActive ? ' ← <strong>GDS Anda</strong>' : '') + '</div>';
    html += '</div>';
  });
  return html;
}

function getSlidingScaleLabel(gds) {
  if (gds < 70)  return '⛔ HIPOGLIKEMIA';
  if (gds <= 200) return 'Tidak perlu koreksi';
  if (gds <= 250) return '2N (2 unit)';
  if (gds <= 300) return '4N (4 unit)';
  if (gds <= 350) return '6N (6 unit)';
  return '8N (8 unit)';
}

function resCard(label, value, sub, highlight) {
  return '<div class="ins-res-card' + (highlight ? ' highlight' : '') + '">' +
    '<div class="ins-res-label">' + label + '</div>' +
    '<div class="ins-res-value">' + value + '</div>' +
    '<div class="ins-res-sub">' + sub + '</div>' +
    '</div>';
}
