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
  document.getElementById('mode-btn-hipo').classList.toggle('active', mode === 'hipo');

  var mainInputs = document.getElementById('ins-main-inputs');
  var hipoInputs = document.getElementById('ins-hipo-inputs');
  var extra      = document.getElementById('bbc-extra-inputs');

  if (mode === 'hipo') {
    if (mainInputs) mainInputs.style.display = 'none';
    if (hipoInputs) hipoInputs.style.display = '';
  } else {
    if (mainInputs) mainInputs.style.display = '';
    if (hipoInputs) hipoInputs.style.display = 'none';
    if (extra) extra.style.display = mode === 'bbc' ? '' : 'none';
  }

  var resDiv = document.getElementById('ins-result');
  if (resDiv) { resDiv.style.display = 'none'; resDiv.innerHTML = ''; }
  calcInsulin();
}

function calcInsulin() {
  var resDiv = document.getElementById('ins-result');
  if (!resDiv) return;

  /* ---- Hipo correction mode ---- */
  if (_insMode === 'hipo') {
    var hGds  = parseFloat(document.getElementById('hipo-gds').value);
    var hBb   = parseFloat(document.getElementById('hipo-bb').value);
    var hTgt  = parseFloat(document.getElementById('hipo-target').value) || 150;
    var hKes  = document.getElementById('hipo-kesadaran').value;
    var hRoute= document.getElementById('hipo-route').value;
    if (isNaN(hGds) || isNaN(hBb)) { resDiv.style.display = 'none'; return; }
    resDiv.style.display = 'block';
    renderHipoCorrection(hGds, hBb, hTgt, hKes, hRoute, resDiv);
    return;
  }

  var bb     = parseFloat(document.getElementById('ins-bb').value);
  var gds    = parseFloat(document.getElementById('ins-gds').value);
  var target = parseFloat(document.getElementById('ins-target').value) || 150;

  /* ---- Hypoglycemia guard (BBC/SS mode) ---- */
  if (!isNaN(gds) && gds < 70) {
    resDiv.style.display = 'block';
    resDiv.innerHTML =
      '<div class="ins-hipo">⛔ GDS ' + gds + ' mg/dL — HIPOGLIKEMIA!' +
        '<div style="font-size:12px;font-weight:400;margin-top:4px">Tatalaksana hipo dulu: D40% 25 mL IV bolus (atau D10% 150 mL). ' +
        'STOP semua insulin. Cek ulang GDS 15 menit. Gunakan tab <strong>Koreksi Hipoglikemia</strong> untuk kalkulasi lengkap.</div>' +
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

/* ============================================================
   HIPO CORRECTION
   Formula: glucose(g) = ΔGlucose(mg/dL) × 0.2 × BB(kg) / 100
   ADA Standards of Care 2025 · Endocrine Society 2024 · JBDS
   ============================================================ */
function renderHipoCorrection(gds, bb, target, kesadaran, route, resDiv) {
  /* Severity classification — ADA 2025 */
  var level, levelLabel, levelCls, levelDesc;
  if (kesadaran === 'tidak-sadar') {
    level = 3; levelLabel = 'Level 3 — Berat'; levelCls = 'hipo-level-3';
    levelDesc = 'Penurunan kesadaran / tidak bisa menelan → butuh bantuan orang lain';
  } else if (gds < 54) {
    level = 2; levelLabel = 'Level 2 — Klinis Signifikan'; levelCls = 'hipo-level-2';
    levelDesc = 'GDS &lt;54 mg/dL — tanda neuroglikopenia kemungkinan ada';
  } else {
    level = 1; levelLabel = 'Level 1 — Alert'; levelCls = 'hipo-level-1';
    levelDesc = 'GDS 54–70 mg/dL — gejala ringan, biasanya masih bisa dikoreksi oral';
  }

  /* Glucose needed (g) */
  var delta    = Math.max(target - gds, 30);   /* minimum raise 30 mg/dL */
  var glucoseG = Math.round(delta * 0.2 * bb / 100 * 10) / 10;

  /* Solution volumes */
  var volD40  = Math.round(glucoseG / 0.4 * 10) / 10;   /* D40% = 400 mg/mL = 0.4 g/mL */
  var volD20  = Math.round(glucoseG / 0.2 * 10) / 10;   /* D20% = 200 mg/mL = 0.2 g/mL */
  var volD10  = Math.round(glucoseG / 0.1 * 10) / 10;   /* D10% = 100 mg/mL = 0.1 g/mL */

  /* D40% standard bolus protocol */
  var d40Bolus = volD40 <= 25 ? '25 mL' : Math.ceil(volD40 / 25) * 25 + ' mL';

  var html = '';

  /* Level badge */
  html += '<div style="margin-bottom:10px">';
  html += '<span class="hipo-level ' + levelCls + '">' + levelLabel + '</span>';
  html += '<div style="font-size:12px;color:var(--text2);margin-top:4px">' + levelDesc + '</div>';
  html += '</div>';

  /* Glucose requirement card */
  html += '<div class="hipo-sol-card" style="border-color:var(--accent)">';
  html += '<div class="hipo-sol-title">Kebutuhan Glukosa</div>';
  html += '<div class="hipo-sol-row">';
  html += '<span class="hipo-sol-label">Kenaikan target (Δ)</span>';
  html += '<span class="hipo-sol-value">' + delta + ' mg/dL</span>';
  html += '</div>';
  html += '<div class="hipo-sol-row">';
  html += '<span class="hipo-sol-label">Glukosa dibutuhkan</span>';
  html += '<span class="hipo-sol-value">' + glucoseG + ' g</span>';
  html += '</div>';
  html += '<div class="hipo-sol-note">Formula: Δ × 0.2 × BB / 100 · BB ' + bb + ' kg · GDS ' + gds + ' → target ' + target + ' mg/dL</div>';
  html += '</div>';

  /* IV solutions */
  if (route === 'iv') {
    html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin:12px 0 6px">💉 Pilihan Larutan IV</div>';

    html += '<div class="hipo-sol-card">';
    html += '<div class="hipo-sol-title">D40% (Dextrose 40%) ★ Pilihan utama IV</div>';
    html += '<div class="hipo-sol-row"><span class="hipo-sol-label">Volume kalkulasi</span><span class="hipo-sol-value">' + volD40 + ' mL</span></div>';
    html += '<div class="hipo-sol-row"><span class="hipo-sol-label">Protokol standar</span><span class="hipo-sol-value">' + d40Bolus + ' IV bolus pelan</span></div>';
    html += '<div class="hipo-sol-note">0.4 g/mL · berikan pelan 1–3 menit via vena besar · flush NaCl setelahnya · cek GDS 15 menit</div>';
    html += '</div>';

    html += '<div class="hipo-sol-card">';
    html += '<div class="hipo-sol-title">D20% (Dextrose 20%) — jika tidak ada D40%</div>';
    html += '<div class="hipo-sol-row"><span class="hipo-sol-label">Volume</span><span class="hipo-sol-value">' + volD20 + ' mL</span></div>';
    html += '<div class="hipo-sol-note">0.2 g/mL · dapat diberikan via vena perifer · lebih aman dari D40% untuk vena perifer kecil</div>';
    html += '</div>';

    html += '<div class="hipo-sol-card">';
    html += '<div class="hipo-sol-title">D10% (Dextrose 10%) — alternatif / drip</div>';
    html += '<div class="hipo-sol-row"><span class="hipo-sol-label">Volume</span><span class="hipo-sol-value">' + volD10 + ' mL</span></div>';
    html += '<div class="hipo-sol-note">0.1 g/mL · cocok untuk infus rumatan pasca koreksi · atau bila tidak ada D20%/D40%</div>';
    html += '</div>';
  }

  /* Oral / NGT route */
  if (route === 'oral') {
    html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin:12px 0 6px">🥤 Rule of 15 — Oral / NGT</div>';
    html += '<div class="hipo-sol-card">';
    html += '<div class="hipo-sol-title">Rule of 15 (ADA 2025)</div>';
    html += '<div style="font-size:13px;color:var(--text);line-height:1.6">';
    html += '1. Berikan <strong>15 g</strong> karbohidrat cepat:<br>';
    html += '&nbsp;&nbsp;• 150 mL jus buah / minuman manis<br>';
    html += '&nbsp;&nbsp;• 3–4 tablet glukosa (@ 5 g)<br>';
    html += '&nbsp;&nbsp;• 30 mL madu / sirup gula<br>';
    html += '&nbsp;&nbsp;• Via NGT: D10% 150 mL atau D20% 75 mL<br>';
    html += '2. Tunggu <strong>15 menit</strong>, cek ulang GDS<br>';
    html += '3. Ulangi bila GDS masih &lt;70 mg/dL<br>';
    html += '4. Setelah GDS ≥70: makan camilan (snack) untuk mencegah rebound hipo';
    html += '</div>';
    html += '<div class="hipo-sol-note" style="margin-top:8px">Untuk pasien sadar + bisa menelan · Jangan berikan oral bila ada risiko aspirasi</div>';
    html += '</div>';

    html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin:10px 0 6px">💉 Volume Larutan via NGT / IV Cadangan</div>';
    html += '<div class="hipo-sol-card">';
    html += '<div class="hipo-sol-row"><span class="hipo-sol-label">D10% via NGT/IV</span><span class="hipo-sol-value">' + volD10 + ' mL</span></div>';
    html += '<div class="hipo-sol-row"><span class="hipo-sol-label">D20% via NGT</span><span class="hipo-sol-value">' + volD20 + ' mL</span></div>';
    html += '<div class="hipo-sol-note">Ekuivalen ' + glucoseG + ' g glukosa untuk Δ ' + delta + ' mg/dL</div>';
    html += '</div>';
  }

  /* IM glucagon */
  if (route === 'im') {
    html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin:12px 0 6px">💉 Glucagon — Tidak Ada Akses IV</div>';
    html += '<div class="hipo-sol-card">';
    html += '<div class="hipo-sol-title">Glucagon IM / SC (Endocrine Society 2024)</div>';
    html += '<div style="font-size:13px;color:var(--text);line-height:1.6">';
    html += '• Dewasa/anak &gt;25 kg: <strong>Glucagon 1 mg IM atau SC</strong><br>';
    html += '• Anak &lt;25 kg: 0.5 mg IM/SC<br>';
    html += '• Efek: GDS naik dalam 10–15 menit<br>';
    html += '• Setelah sadar: segera berikan makanan/minuman karbohidrat oral<br>';
    html += '• Bila tidak ada respons dalam 15 menit: ulangi 1 dosis';
    html += '</div>';
    html += '<div class="hipo-sol-note" style="margin-top:8px">Jika tersedia: Nasal glucagon (Baqsimi) 3 mg intranasal — non-inferior dengan IM (FDA-approved)</div>';
    html += '</div>';

    html += '<div class="ins-warn"><strong>⚠️ Pasang akses IV segera</strong> setelah pasien sadar untuk monitoring dan kemungkinan pemberian D40% lanjutan jika GDS kembali turun.</div>';
  }

  /* Monitoring plan */
  html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin:12px 0 6px">📊 Monitoring & Tindak Lanjut</div>';
  html += '<div class="hipo-sol-card">';
  html += '<div style="font-size:12px;color:var(--text);line-height:1.8">';
  html += '• Cek GDS <strong>15 menit</strong> setelah koreksi — ulangi koreksi bila GDS masih &lt;70<br>';
  html += '• Setelah GDS ≥70: cek ulang tiap <strong>30–60 menit</strong> × 2–3 kali<br>';
  html += '• <strong>STOP semua insulin</strong> aktif · identifikasi penyebab hipoglikemia<br>';
  html += '• Infus rumatan: D5% atau D10% untuk cegah rebound bila penyebab belum teratasi<br>';
  html += '• Jika hipo berulang: pertimbangkan <strong>insulin infus titrasi ketat</strong> (ICU)<br>';
  html += '• Dokumentasi episode hipo di rekam medis — lapor DPJP';
  html += '</div>';
  html += '</div>';

  /* Cause checklist */
  html += '<div class="ins-warn">';
  html += '<strong>🔍 Cari Penyebab Hipoglikemia:</strong>';
  html += '<ul style="margin:6px 0 0;padding-left:18px;font-size:12px;line-height:1.7">';
  html += '<li>Dosis insulin terlalu tinggi atau tidak disesuaikan kondisi</li>';
  html += '<li>Pasien tidak makan / asupan turun tiba-tiba setelah dosis bolus</li>';
  html += '<li>Steroid diturunkan / distop tanpa penyesuaian insulin</li>';
  html += '<li>Perbaikan kondisi akut (resolusi infeksi/kritis) → kebutuhan insulin turun</li>';
  html += '<li>Fungsi ginjal memburuk → klirens insulin melambat</li>';
  html += '<li>Interaksi obat (quinilon, sulfonil urea, dll)</li>';
  html += '</ul>';
  html += '</div>';

  resDiv.innerHTML = html;

  if (typeof window.saveCalcHistory === 'function') {
    window.saveCalcHistory(
      'insulin',
      'Hipo Koreksi — GDS ' + gds + ' mg/dL, BB ' + bb + ' kg',
      { gds: gds, bb: bb, target: target, kesadaran: kesadaran, route: route },
      levelLabel + ' · butuh ' + glucoseG + 'g glukosa · D40% ' + volD40 + ' mL'
    );
  }
}
