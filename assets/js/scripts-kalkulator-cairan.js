/* ============================================================
   Kalkulator Kebutuhan Cairan Harian ICU — ICU Helper · v2.0
   scripts-kalkulator-cairan.js
   Referensi: Malbrain 2018, CLASSIC 2022, NICE CG174,
              Boyd 2011, Sakr 2017, FACTT 2006
   ============================================================ */

/* ── Helpers ─────────────────────────────────────────────── */
function _f(n, dec) {
  if (isNaN(n)) return '—';
  return parseFloat(n.toFixed(dec === undefined ? 0 : dec))
    .toLocaleString('id-ID');
}

function resultRow(label, value, unit, highlight, note) {
  var s = highlight
    ? 'background:var(--accent-dim);border-color:var(--accent-dim2);font-weight:600;'
    : '';
  var noteHtml = note
    ? '<span style="display:block;font-size:10px;color:var(--muted);margin-top:2px">' + note + '</span>'
    : '';
  return '<div style="display:flex;justify-content:space-between;align-items:flex-start;' +
    'padding:7px 10px;border-radius:6px;border:1px solid var(--border);' +
    'background:var(--card);margin-bottom:6px;font-size:12px;' + s + '">' +
    '<span style="color:var(--text2);flex:1">' + label + noteHtml + '</span>' +
    '<span style="font-family:\'JetBrains Mono\',monospace;font-weight:700;color:var(--text);' +
    'flex-shrink:0;margin-left:10px">' + value +
    '<span style="color:var(--muted);font-weight:400;font-size:10px;margin-left:4px">' + (unit || '') + '</span></span>' +
    '</div>';
}

function divider(label) {
  return '<div style="margin:12px 0 6px;font-size:10px;font-weight:700;letter-spacing:.07em;' +
    'color:var(--text3);text-transform:uppercase;padding-left:2px">' + label + '</div>';
}

function alertBox(msg, color) {
  return '<div style="padding:10px 14px;border-radius:8px;border:1px solid ' + color + ';' +
    'background:var(--card);font-size:12px;margin-top:6px;line-height:1.6">' + msg + '</div>';
}

/* ── ROSE data ───────────────────────────────────────────── */
var ROSE_DATA = {
  R: {
    label: '🔴 Resuscitation', color: '#ef4444',
    target: '+500 s/d +1.500 mL/24 jam',
    targetMin: 500, targetMax: 1500,
    desc: '<strong>Resuscitation — Fase Akut Awal</strong><br>' +
      'Tujuan: pulihkan perfusi organ, atasi shock. Berikan bolus cairan terukur ' +
      '(250–500 mL kristaloid isotonik) dan nilai ulang setiap pemberian.<br>' +
      '<span style="color:var(--muted)">Hentikan resusitasi jika tidak ada fluid responsiveness ' +
      '(PLR negatif, PPV/SVV tidak berubah). Positive balance terbatas dan terukur.</span>'
  },
  O: {
    label: '🟠 Optimization', color: '#f97316',
    target: '0 s/d +500 mL/24 jam',
    targetMin: 0, targetMax: 500,
    desc: '<strong>Optimization — Stabilisasi Awal</strong><br>' +
      'Tujuan: fine-tune perfusi organ, titrasi vasopresor/inotropik, optimalkan preload.<br>' +
      '<span style="color:var(--muted)">Hindari volume loading berlebih. Gunakan parameter ' +
      'dinamik (PLR, PPV, SVV, IVC collapsibility). Balance mendekati nol.</span>'
  },
  S: {
    label: '🟢 Stabilization', color: '#22c55e',
    target: '±0 mL (net zero)',
    targetMin: -200, targetMax: 300,
    desc: '<strong>Stabilization — Pemeliharaan</strong><br>' +
      'Tujuan: pertahankan organ perfusion dengan cairan maintenance saja.<br>' +
      '<span style="color:var(--muted)">Ganti kehilangan yang terukur (urin, drain, NGT). ' +
      'Prioritas utama: <strong>jangan tambah positive balance</strong>. ' +
      'Mulai evaluasi apakah pasien siap masuk fase Evacuation.</span>'
  },
  E: {
    label: '🔵 Evacuation', color: '#3b82f6',
    target: '−500 s/d −1.500 mL/24 jam',
    targetMin: -1500, targetMax: -500,
    desc: '<strong>Evacuation (De-resuscitation) — Fase Evakuasi</strong><br>' +
      'Tujuan: mobilisasi dan eliminasi kelebihan cairan. Indikasi: FO &gt;10% BB baseline.<br>' +
      '<span style="color:var(--muted)">Strategi: furosemid IV (atau infus kontinu), ' +
      'pembatasan input agresif, CRRT jika gagal ginjal atau refrakter diuretik. ' +
      'Target negative balance −500 s/d −1.500 mL/hari secara bertahap.</span>'
  }
};

var activeROSE = null;

function selectROSE(phase) {
  activeROSE = phase;
  document.querySelectorAll('.rose-chip').forEach(function(c) {
    c.classList.toggle('active', c.dataset.phase === phase);
  });
  var d = ROSE_DATA[phase];
  var el = document.getElementById('rose-desc');
  el.style.display = 'block';
  el.style.borderLeftColor = d.color;
  el.style.borderLeft = '3px solid ' + d.color;
  el.innerHTML = d.desc +
    '<div style="margin-top:6px;font-size:11px;font-weight:700;color:' + d.color + '">' +
    '📊 Target balans: ' + d.target + '</div>';
}

/* ── BOX 1: Kebutuhan Basal ICU (live) ──────────────────── */
function calcBasal() {
  var bw     = parseFloat(document.getElementById('b1-bw').value);
  var target = parseInt(document.getElementById('b1-target').value, 10);
  var el     = document.getElementById('b1-result');

  if (!bw || bw <= 0) { el.classList.add('hidden'); return; }

  var icuPerDay  = bw * target;
  var icuPerHour = icuPerDay / 24;

  /* Holliday-Segar untuk perbandingan */
  var hs;
  if (bw <= 10)      hs = bw * 100;
  else if (bw <= 20) hs = 1000 + (bw - 10) * 50;
  else               hs = 1500 + (bw - 20) * 20;

  var diff    = hs - icuPerDay;
  var diffPct = Math.round((diff / hs) * 100);

  var html = '';
  html += divider('Hasil — Pendekatan Restriksi Rasional ICU');
  html += resultRow(
    'Target maintenance (' + target + ' mL/kg/hari)',
    _f(icuPerDay), 'mL/hari', true,
    'NICE CG174 2013 · CLASSIC NEJM 2022'
  );
  html += resultRow('Rate infus IV', _f(icuPerHour, 1), 'mL/jam', true);

  html += divider('Perbandingan — Holliday-Segar (referensi)');
  html += resultRow(
    'Holliday-Segar (100/50/20)',
    _f(hs), 'mL/hari', false,
    'Dikembangkan untuk anak sehat — cenderung overestimate pada ICU dewasa [6]'
  );
  html += resultRow(
    'Selisih vs Holliday-Segar',
    '−' + _f(diff) + ' mL/hari (' + diffPct + '%)',
    '', false,
    'Restriksi rasional mengurangi risiko fluid overload'
  );

  el.innerHTML = html;
  el.classList.remove('hidden');
}

/* ── BOX 2: Koreksi & Total Kebutuhan ───────────────────── */
function calcKoreksi() {
  var bw    = parseFloat(document.getElementById('b2-bw').value);
  var temp  = parseFloat(document.getElementById('b2-temp').value) || 37;
  var vent  = document.getElementById('b2-vent').value;
  var sweat = document.getElementById('b2-sweat').value;
  var uoTgt = parseFloat(document.getElementById('b2-uo').value) || 0.5;
  var ngt   = parseFloat(document.getElementById('b2-ngt').value)   || 0;
  var drain = parseFloat(document.getElementById('b2-drain').value) || 0;
  var other = parseFloat(document.getElementById('b2-other').value) || 0;
  var el    = document.getElementById('b2-result');

  if (!bw || bw <= 0) {
    el.innerHTML = alertBox('⚠️ Masukkan berat badan pasien.', 'var(--amber)');
    el.classList.remove('hidden'); return;
  }

  /* 1. Maintenance basal ICU — standar 25 mL/kg/hari */
  var maintenance = bw * 25;

  /* 2. IWL base per ventilasi (mL/hari) */
  var iwlBase;
  var iwlLabel;
  if (vent === 'ventilator') {
    iwlBase = bw * 6.5;
    iwlLabel = '~6.5 mL/kg/hari (gas terhumidifikasi)';
  } else if (vent === 'hfnc') {
    iwlBase = bw * 9;
    iwlLabel = '~9 mL/kg/hari (HFNC)';
  } else {
    iwlBase = bw * 12;
    iwlLabel = '~12 mL/kg/hari (spontan)';
  }

  /* 3. Koreksi suhu — +10% IWL per 1°C di atas 37.5°C */
  var tempCorr = 0;
  var tempDelta = temp - 37.5;
  if (tempDelta > 0) {
    tempCorr = maintenance * 0.10 * tempDelta;
  }

  /* 4. Koreksi diaphoresis */
  var sweatMap = { none: 0, mild: 200, moderate: 500, severe: 900 };
  var sweatCorr = sweatMap[sweat] || 0;

  /* 5. IWL total */
  var iwlTotal = iwlBase + tempCorr + sweatCorr;

  /* 6. UO target */
  var uoDay = uoTgt * bw * 24;

  /* 7. Total kebutuhan */
  var total     = maintenance + iwlTotal + uoDay + ngt + drain + other;
  var ratePerHr = total / 24;

  /* Render */
  var html = '';
  html += divider('Komponen Cairan');
  html += resultRow('Maintenance basal ICU (25 mL/kg/hari)', _f(maintenance), 'mL/hari');
  html += resultRow('IWL basal — ' + vent, _f(iwlBase), 'mL/hari', false, iwlLabel);

  if (tempCorr > 0)
    html += resultRow(
      'Koreksi demam (+' + tempDelta.toFixed(1) + '°C di atas 37.5°C)',
      '+' + _f(tempCorr),
      'mL/hari', false, '+10% maintenance per 1°C [6] · Holliday-Segar 1957'
    );
  if (sweatCorr > 0)
    html += resultRow('Koreksi diaphoresis (' + sweat + ')', '+' + _f(sweatCorr), 'mL/hari');

  html += resultRow('IWL total', _f(iwlTotal), 'mL/hari');
  html += resultRow(
    'Target UO (' + uoTgt + ' mL/kg/jam)',
    _f(uoDay), 'mL/hari'
  );
  if (ngt)   html += resultRow('Output NGT', _f(ngt), 'mL/hari');
  if (drain) html += resultRow('Output drain/WSD', _f(drain), 'mL/hari');
  if (other) html += resultRow('Kehilangan lain', _f(other), 'mL/hari');

  html += divider('TOTAL KEBUTUHAN (target net balance = 0)');
  html += resultRow('TOTAL per hari', _f(total), 'mL/hari', true);
  html += resultRow('Rate IV (single maintenance line)', _f(ratePerHr, 1), 'mL/jam', true);

  /* ROSE konteks jika ada */
  if (activeROSE) {
    var rd = ROSE_DATA[activeROSE];
    html += '<div style="margin-top:8px;padding:8px 12px;border-radius:6px;' +
      'border:1px solid ' + rd.color + ';background:var(--card);font-size:11px">' +
      '<strong>Fase ROSE aktif: ' + rd.label + '</strong><br>' +
      'Target balans: <strong>' + rd.target + '</strong><br>' +
      '<span style="color:var(--muted)">Sesuaikan input cairan dari angka di atas ' +
      'dengan menambah/mengurangi sesuai target balans fase ini.</span></div>';
  }

  html += '<div class="info" style="margin-top:10px;font-size:11px;color:var(--muted)">' +
    '⚠️ Angka ini adalah <strong>panduan awal (starting point)</strong>. Evaluasi ulang ' +
    'tiap 12–24 jam berdasarkan status hemodinamik, balans harian, dan fase ROSE. ' +
    'Tidak termasuk cairan untuk obat-obatan dan nutrisi parenteral.' +
    '</div>';

  el.innerHTML = html;
  el.classList.remove('hidden');
}

/* ── BOX 3: Balans Kumulatif ─────────────────────────────── */
function calcCumulative() {
  var ids    = ['cb-d1','cb-d2','cb-d3','cb-d4','cb-d5','cb-d6','cb-d7'];
  var values = ids.map(function(id) {
    var v = parseFloat(document.getElementById(id).value);
    return isNaN(v) ? null : v;
  });

  var filledDays = values.filter(function(v) { return v !== null; });
  if (filledDays.length === 0) {
    document.getElementById('cb-result').innerHTML =
      alertBox('⚠️ Masukkan minimal 1 hari data balans.', 'var(--amber)');
    document.getElementById('cb-result').classList.remove('hidden');
    return;
  }

  var cumulative = 0;
  var html = '';
  html += divider('Balans Per Hari & Kumulatif');

  values.forEach(function(v, i) {
    if (v === null) return;
    cumulative += v;
    var sign = v >= 0 ? '+' : '';
    var cumSign = cumulative >= 0 ? '+' : '';

    /* Warning row warna */
    var rowColor = '';
    if (cumulative > 10000)       rowColor = 'color:var(--red)';
    else if (cumulative > 5000)   rowColor = 'color:var(--amber)';
    else if (cumulative > 2000)   rowColor = 'color:var(--warn,#f59e0b)';
    else if (cumulative < -1500)  rowColor = 'color:var(--accent)';

    html += '<div style="display:flex;justify-content:space-between;' +
      'padding:6px 10px;border-radius:6px;border:1px solid var(--border);' +
      'background:var(--card);margin-bottom:5px;font-size:12px;' +
      'font-family:\'JetBrains Mono\',monospace">' +
      '<span style="color:var(--text2)">Hari ' + (i + 1) + '</span>' +
      '<span>' +
        '<span style="color:var(--text)">' + sign + _f(v) + ' mL</span>' +
        '<span style="color:var(--muted);margin:0 6px">·</span>' +
        '<span style="' + rowColor + ';font-weight:700">Kumulatif: ' + cumSign + _f(cumulative) + ' mL</span>' +
      '</span>' +
      '</div>';
  });

  /* Summary */
  var avgBalance = cumulative / filledDays.length;
  html += divider('Ringkasan');
  html += resultRow('Balans kumulatif total', (cumulative >= 0 ? '+' : '') + _f(cumulative), 'mL', true);
  html += resultRow('Rata-rata balans per hari', (avgBalance >= 0 ? '+' : '') + _f(avgBalance), 'mL/hari');

  /* Interpretasi */
  var color, label, msg;
  var cumL = cumulative / 1000;
  if (cumulative <= 0) {
    color = 'var(--accent)'; label = 'Balans Kumulatif Negatif / Euvolemia';
    msg = 'Target terpenuhi. Pastikan tidak ada tanda hipovolemia: MAP, laktat, UO.';
  } else if (cumL < 2) {
    color = 'var(--green)'; label = 'Balans Kumulatif Ringan';
    msg = 'Balans kumulatif dalam batas aman. Pertahankan monitoring ketat.';
  } else if (cumL < 5) {
    color = 'var(--warn, #f59e0b)'; label = 'Balans Kumulatif Sedang — Perlu Perhatian';
    msg = 'Balans kumulatif ' + _f(cumL, 1) + ' L. Pertimbangkan fase Evacuation jika hemodinamik stabil. ' +
      'Boyd et al. melaporkan peningkatan mortalitas sepsis pada positive balance berkepanjangan [7].';
  } else if (cumL < 10) {
    color = 'var(--amber)'; label = 'Balans Kumulatif Tinggi — Risiko Meningkat';
    msg = 'Balans kumulatif ' + _f(cumL, 1) + ' L. Risiko disfungsi organ, ARDS, dan mortalitas meningkat. ' +
      'Target active de-resuscitation (fase E). Sakr et al. 2017: setiap 1 L positive balance ' +
      'tambahan meningkatkan risiko kematian [8].';
  } else {
    color = 'var(--red)'; label = 'Balans Kumulatif Berat — Intervensi Segera';
    msg = 'Balans kumulatif ' + _f(cumL, 1) + ' L (≥10 L). Berhubungan dengan mortalitas signifikan. ' +
      'Intervensi aktif: furosemid IV kontinu, pertimbangkan CRRT. ' +
      'Evakuasi terstruktur −500 s/d −1.500 mL/hari.';
  }
  html += alertBox('<strong>' + label + '</strong><br>' + msg, color);

  document.getElementById('cb-result').innerHTML = html;
  document.getElementById('cb-result').classList.remove('hidden');
}

/* ── BOX 4: Fluid Overload ───────────────────────────────── */
function calcFluidOverload() {
  var dry     = parseFloat(document.getElementById('fo-dry').value);
  var current = parseFloat(document.getElementById('fo-current').value);
  var el      = document.getElementById('fo-result');

  if (!dry || !current || dry <= 0 || current <= 0) {
    el.innerHTML = alertBox('⚠️ Masukkan berat badan kering dan saat ini.', 'var(--amber)');
    el.classList.remove('hidden'); return;
  }

  var diffKg    = current - dry;
  var diffML    = diffKg * 1000;
  var foPercent = (diffKg / dry) * 100;

  var color, label, msg, roseHint;
  if (foPercent < 0) {
    color = 'var(--accent)'; label = 'Defisit / Kemungkinan Hipovolemia';
    msg = 'Berat turun ' + _f(Math.abs(foPercent), 1) + '% dari baseline. Evaluasi tanda hipovolemia.';
    roseHint = 'Pertimbangkan fase <strong>R atau O</strong> jika ada tanda hipoperfusi.';
  } else if (foPercent < 5) {
    color = 'var(--green)'; label = 'Euvolemia (FO <5%)';
    msg = 'Fluid overload dalam batas normal.';
    roseHint = 'Pertahankan fase <strong>S (Stabilization)</strong>.';
  } else if (foPercent < 10) {
    color = 'var(--warn, #f59e0b)'; label = 'Overload Ringan (FO 5–10%)';
    msg = 'Monitor ketat. Batasi input cairan. Pertimbangkan transisi ke fase Evacuation.';
    roseHint = 'Evaluasi kesiapan masuk fase <strong>E (Evacuation)</strong>.';
  } else if (foPercent < 15) {
    color = 'var(--amber)'; label = 'Overload Sedang (FO 10–15%) ⚠️';
    msg = 'Melebihi threshold 10% — indikasi fase Evacuation aktif. Pertimbangkan diuretik furosemid IV. ' +
      'Sutherland et al.: FO ≥10% berhubungan dengan mortalitas meningkat [9].';
    roseHint = '→ Masuk fase <strong>🔵 E (Evacuation)</strong>. Target balans negatif −500 s/d −1.500 mL/hari.';
  } else {
    color = 'var(--red)'; label = 'Overload Berat (FO ≥15%) 🚨';
    msg = 'Overload berat — risiko edema paru, ARDS, disfungsi organ. Intervensi segera diperlukan. ' +
      'Pertimbangkan CRRT jika furosemid tidak respons atau ada AKI.';
    roseHint = '→ Fase <strong>🔵 E (Evacuation)</strong> — target negatif agresif, konsultasikan nefrologi.';
  }

  var html = '';
  html += resultRow('Selisih BB', (diffKg >= 0 ? '+' : '') + _f(diffKg, 1), 'kg');
  html += resultRow('Estimasi volume berlebih', (diffML >= 0 ? '+' : '') + _f(diffML), 'mL');
  html += resultRow('Fluid Overload %', (foPercent >= 0 ? '+' : '') + _f(foPercent, 1), '%', true);
  html += alertBox(
    '<strong>' + label + '</strong><br>' + msg +
    '<div style="margin-top:6px;font-size:11px;color:var(--accent)">' + roseHint + '</div>',
    color
  );

  el.innerHTML = html;
  el.classList.remove('hidden');
}

/* ── BOX 5: Fluid Balance 24 jam ────────────────────────── */
function calcFluidBalance() {
  var inputs  = [
    parseFloat(document.getElementById('fb-iv').value)    || 0,
    parseFloat(document.getElementById('fb-med').value)   || 0,
    parseFloat(document.getElementById('fb-nutri').value) || 0,
    parseFloat(document.getElementById('fb-bolus').value) || 0,
    parseFloat(document.getElementById('fb-oral').value)  || 0
  ];
  var outputs = [
    parseFloat(document.getElementById('fb-uo').value)    || 0,
    parseFloat(document.getElementById('fb-iwl').value)   || 0,
    parseFloat(document.getElementById('fb-ngt').value)   || 0,
    parseFloat(document.getElementById('fb-drain').value) || 0,
    parseFloat(document.getElementById('fb-other').value) || 0
  ];
  var el = document.getElementById('fb-result');

  var totalIn  = inputs.reduce(function(a, b) { return a + b; }, 0);
  var totalOut = outputs.reduce(function(a, b) { return a + b; }, 0);
  var balance  = totalIn - totalOut;

  /* Tentukan fase ROSE yang relevan */
  var roseCtx = '';
  if (activeROSE) {
    var rd = ROSE_DATA[activeROSE];
    var inTarget = balance >= rd.targetMin && balance <= rd.targetMax;
    roseCtx = '<div style="margin-top:8px;padding:8px 12px;border-radius:6px;' +
      'border:1px solid ' + rd.color + ';background:var(--card);font-size:11px">' +
      'Fase ROSE aktif: <strong>' + rd.label + '</strong> — Target: <strong>' + rd.target + '</strong><br>' +
      (inTarget
        ? '<span style="color:' + rd.color + '">✓ Balans hari ini sesuai target fase.</span>'
        : '<span style="color:var(--red)">✗ Balans hari ini <strong>di luar target</strong> fase. Evaluasi manajemen cairan.</span>'
      ) + '</div>';
  }

  var color, label, msg;
  if (balance > 2000) {
    color = 'var(--red)'; label = 'Balance Positif Berat (>2 L)';
    msg = 'Akumulasi >2 L — risiko edema, disfungsi organ, dan mortalitas meningkat. Intervensi aktif.';
  } else if (balance > 1000) {
    color = 'var(--amber)'; label = 'Balance Positif Sedang (1–2 L)';
    msg = 'Pertimbangkan pembatasan input dan evaluasi kebutuhan diuretik.';
  } else if (balance >= -500) {
    color = 'var(--green)'; label = 'Balance Netral / Euvolemia';
    msg = 'Fluid balance dalam rentang target (–500 s/d +1.000 mL). Pertahankan.';
  } else if (balance >= -1500) {
    color = 'var(--accent)'; label = 'Balance Negatif (De-resusitasi)';
    msg = 'Balance negatif ringan-sedang — dapat diterima pada fase Evacuation.';
  } else {
    color = 'var(--red)'; label = 'Balance Negatif Berat (<−1.5 L)';
    msg = 'Balance sangat negatif — periksa tanda hipovolemia dan kehilangan yang tidak terhitung.';
  }

  var html = '';
  html += divider('Ringkasan');
  html += resultRow('Total Input', _f(totalIn), 'mL');
  html += resultRow('Total Output', _f(totalOut), 'mL');
  html += resultRow('BALANCE 24 JAM', (balance >= 0 ? '+' : '') + _f(balance), 'mL', true);
  html += alertBox('<strong>' + label + '</strong><br>' + msg, color);
  html += roseCtx;

  el.innerHTML = html;
  el.classList.remove('hidden');
}
