/* ============================================================
   scripts-kalkulator-ventilator-adv.js
   Compliance · Driving Pressure · Mechanical Power · Resistance
   PEEP-FiO₂ ARDSNet ladder · OI · Minute Ventilation
   ============================================================ */

/* SpO₂ → estimated PaO₂ (Ellis 1989 / Rice 2007 table) */
var SPO2_PAO2 = [
  [100,145],[99,129],[98,113],[97,104],[96,93],[95,84],[94,79],
  [93,74],[92,70],[91,65],[90,60],[89,57],[88,55],[87,52],[86,50],
  [85,48],[84,46],[83,44],[82,43],[81,41],[80,40],[79,38],[78,37],
  [77,36],[76,35],[75,34],[74,33],[73,32],[72,31],[71,30],[70,29]
];

function spo2ToPao2(spo2) {
  for (var i = 0; i < SPO2_PAO2.length; i++) {
    if (spo2 >= SPO2_PAO2[i][0]) return SPO2_PAO2[i][1];
    if (i + 1 < SPO2_PAO2.length) {
      var hi = SPO2_PAO2[i], lo = SPO2_PAO2[i+1];
      if (spo2 >= lo[0]) {
        var frac = (spo2 - lo[0]) / (hi[0] - lo[0]);
        return Math.round(lo[1] + frac * (hi[1] - lo[1]));
      }
    }
  }
  return 29;
}

/* ARDSNet PEEP-FiO₂ tables (FiO₂ as %) */
var PEEP_FIO2_LOWER = [
  [30,5],[40,5],[50,8],[60,10],[70,10],[80,10],[90,14],[100,14]
];
var PEEP_FIO2_HIGHER = [
  [30,5],[40,8],[50,10],[60,14],[70,14],[80,16],[90,18],[100,24]
];

function peepSuggestion(fio2pct, table) {
  var frac = fio2pct;
  for (var i = table.length - 1; i >= 0; i--) {
    if (frac >= table[i][0]) return table[i][1];
  }
  return table[0][1];
}

function calcVentAdv() {
  var kondisi = document.getElementById('vl-kondisi').value;
  var ibw     = parseFloat(document.getElementById('vl-ibw').value);
  var vt      = parseFloat(document.getElementById('vl-vt').value);
  var rr      = parseFloat(document.getElementById('vl-rr').value);
  var fio2    = parseFloat(document.getElementById('vl-fio2').value);
  var ppeak   = parseFloat(document.getElementById('vl-ppeak').value);
  var pplat   = parseFloat(document.getElementById('vl-pplat').value);
  var peep    = parseFloat(document.getElementById('vl-peep').value);
  var spo2    = parseFloat(document.getElementById('vl-spo2').value);
  var pao2in  = parseFloat(document.getElementById('vl-pao2').value);

  var resDiv = document.getElementById('vl-result');
  if (!resDiv) return;

  /* Require at minimum VT + RR + Ppeak + Pplat + PEEP */
  if (isNaN(vt) || isNaN(rr) || isNaN(ppeak) || isNaN(pplat) || isNaN(peep)) {
    resDiv.style.display = 'none';
    return;
  }

  resDiv.style.display = 'block';

  /* ---- Core mechanics ---- */
  var dp        = pplat - peep;                              /* Driving Pressure */
  var cstat     = Math.round(vt / dp * 10) / 10;            /* Static Compliance mL/cmH₂O */
  var ve        = Math.round(vt * rr / 1000 * 10) / 10;     /* Minute Ventilation L/min */

  /* Mechanical Power (Gattinoni 2016): J/min
     MP = 0.098 × RR × VT(L) × (Ppeak − ΔP/2)             */
  var vtL   = vt / 1000;
  var mp    = Math.round(0.098 * rr * vtL * (ppeak - dp / 2) * 10) / 10;

  /* Resistance: Ti estimate = 60 / (RR × (1+IE)) with IE=2 → Ti = 60/(RR×3) */
  var ti   = 60 / (rr * 3);
  var flow = vtL / ti;       /* L/s */
  var res  = flow > 0 ? Math.round((ppeak - pplat) / flow * 10) / 10 : null;

  /* VT per IBW */
  var vtPerIbw = (!isNaN(ibw) && ibw > 0) ? Math.round(vt / ibw * 10) / 10 : null;

  /* PaO₂ from ABG or SpO₂ estimate */
  var pao2 = !isNaN(pao2in) && pao2in > 0 ? pao2in : (!isNaN(spo2) ? spo2ToPao2(spo2) : null);

  /* P/F and OI */
  var pf = (pao2 && !isNaN(fio2)) ? Math.round(pao2 / (fio2/100)) : null;
  /* OI = (FiO₂% × MAP × 100) / PaO₂; MAP approx = (Ppeak + 2×PEEP) / 3 */
  var map_aw = (ppeak + 2 * peep) / 3;
  var oi  = (pao2 && !isNaN(fio2)) ? Math.round(fio2 * map_aw / pao2 * 10) / 10 : null;

  /* ---- Status classes ---- */
  function dpClass(v)    { return v > 20 ? 'danger' : v > 15 ? 'warn' : 'ok'; }
  function mpClass(v)    { return v > 25 ? 'danger' : v > 17 ? 'warn' : 'ok'; }
  function cstatClass(v) { return v < 20 ? 'danger' : v < 35 ? 'warn' : 'ok'; }
  function pfClass(v)    { return v < 100 ? 'danger' : v < 200 ? 'warn' : 'ok'; }

  /* ---- Targets by kondisi ---- */
  var vtTarget = kondisi === 'ards' ? '4–6' : kondisi === 'copd' ? '7–8' : '6–8';

  /* ---- Build HTML ---- */
  var html = '<div class="vent-result-grid">';

  /* Driving Pressure */
  html += ventCard('Driving Pressure (ΔP)', dp + ' cmH₂O', 'Pplat − PEEP · target ≤15', dpClass(dp));

  /* Mechanical Power */
  html += ventCard('Mechanical Power', mp + ' J/min', '0.098 × RR × VT × (Ppeak − ΔP/2) · target <17', mpClass(mp));

  /* Compliance */
  html += ventCard('Compliance Statis (Cstat)', cstat + ' mL/cmH₂O', 'VT ÷ (Pplat − PEEP) · normal >50', cstatClass(cstat));

  /* Resistance */
  if (res !== null) {
    var resClass = res > 15 ? 'warn' : 'ok';
    html += ventCard('Resistensi', res + ' cmH₂O/L/s', '(Ppeak − Pplat) ÷ Flow · normal <10', resClass);
  }

  /* VT per IBW */
  if (vtPerIbw !== null) {
    var vtClass = (kondisi === 'ards' && (vtPerIbw < 4 || vtPerIbw > 7)) ? 'warn'
               : vtPerIbw > 9 ? 'warn' : 'ok';
    html += ventCard('VT per IBW', vtPerIbw + ' mL/kg', 'Target ' + vtTarget + ' mL/kg · IBW ' + ibw + ' kg', vtClass);
  }

  /* Minute Ventilation */
  var veClass = (ve < 5 || ve > 12) ? 'warn' : 'ok';
  html += ventCard('Minute Ventilation (VE)', ve + ' L/min', 'VT × RR · normal 8–10 L/min', veClass);

  /* P/F ratio */
  if (pf !== null) {
    html += ventCard('P/F Ratio', pf, (!isNaN(pao2in) ? 'dari PaO₂ ABG ' : 'estimasi dari SpO₂ ' + spo2 + '%') + ' · FiO₂ ' + fio2 + '%', pfClass(pf));
  }

  /* OI */
  if (oi !== null) {
    var oiClass = oi > 16 ? 'danger' : oi > 8 ? 'warn' : 'ok';
    html += ventCard('Oxygenation Index (OI)', oi, 'FiO₂% × MAP_aw / PaO₂ · severe >16', oiClass);
  }

  html += '</div>';

  /* PEEP-FiO₂ table */
  if (!isNaN(fio2)) {
    html += '<div style="margin-top:16px">';
    html += '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px">📊 ARDSNet PEEP-FiO₂ Ladder — FiO₂ saat ini ' + fio2 + '%</div>';
    html += buildPeepTable(fio2, peep);
    html += '</div>';
  }

  /* ARDS classification */
  if (pf !== null) {
    var ardsLabel = pf < 100 ? '🔴 ARDS Berat (<100)' : pf < 200 ? '🟠 ARDS Sedang (100–199)' : pf < 300 ? '🟡 ARDS Ringan (200–299)' : '🟢 Bukan ARDS (≥300)';
    html += '<div class="vent-warn-box" style="margin-top:10px"><strong>Berlin Classification:</strong> ' + ardsLabel + '</div>';
  }

  /* Warnings */
  var warnings = [];
  if (dp > 15)  warnings.push('⚠️ <strong>Driving pressure > 15 cmH₂O</strong> — risiko VILI meningkat signifikan. Turunkan VT atau tingkatkan PEEP.');
  if (dp > 20)  warnings.push('🔴 <strong>Driving pressure > 20 cmH₂O</strong> — korelasi kuat dengan mortalitas ARDS. Atasi segera.');
  if (mp > 17)  warnings.push('⚠️ <strong>Mechanical power > 17 J/min</strong> — risiko VILI. Turunkan RR, VT, atau Ppeak.');
  if (cstat < 20) warnings.push('🔴 <strong>Compliance sangat rendah (<20)</strong> — ARDS berat atau edema paru masif. Pertimbangkan prone positioning.');
  if (cstat < 35 && cstat >= 20) warnings.push('⚠️ <strong>Compliance rendah (<35)</strong> — curiga proses alveolar (ARDS, atelektasis, edema).');
  if (res !== null && res > 15) warnings.push('⚠️ <strong>Resistensi tinggi (>' + res + ')</strong> — bronkospasme, sekret, atau ETT tersumbat? Cek tube, suction, nebulisasi.');
  if (pplat > 30) warnings.push('🔴 <strong>Pplat > 30 cmH₂O</strong> — melebihi target ARDS. Turunkan VT 1 mL/kg IBW.');
  if (vtPerIbw !== null && vtPerIbw > 8) warnings.push('⚠️ <strong>VT > 8 mL/kg IBW</strong> — volutrauma. Turunkan VT terutama pada ARDS.');
  if (kondisi === 'ards' && vtPerIbw !== null && vtPerIbw > 6) warnings.push('⚠️ <strong>VT ARDS > 6 mL/kg IBW</strong> — targetkan 4–6 mL/kg. Toleransi permissive hypercapnia PaCO₂ 45–60 mmHg.');
  if (ppeak - pplat > 10) warnings.push('⚠️ <strong>Ppeak − Pplat > 10 cmH₂O</strong> — resistensi sangat tinggi. Periksa ETT, bronkospasme, atau auto-PEEP.');

  if (warnings.length) {
    html += '<div class="vent-warn-box" style="margin-top:10px"><strong>Perhatian:</strong><ul style="margin:6px 0 0;padding-left:18px">';
    warnings.forEach(function(w){ html += '<li style="margin-bottom:4px">' + w + '</li>'; });
    html += '</ul></div>';
  }

  resDiv.innerHTML = html;

  if (typeof window.saveCalcHistory === 'function') {
    window.saveCalcHistory(
      'ventilator-adv',
      'Ventilator Adv — VT ' + vt + ' mL, RR ' + rr,
      { kondisi: kondisi, vt: vt, rr: rr, ppeak: ppeak, pplat: pplat, peep: peep },
      'ΔP ' + dp + ' cmH₂O · Cstat ' + cstat + ' mL/cmH₂O · MP ' + mp + ' J/min'
    );
  }
}

function ventCard(label, value, sub, cls) {
  return '<div class="vent-res-card ' + (cls || '') + '">' +
    '<div class="vent-res-label">' + label + '</div>' +
    '<div class="vent-res-value">' + value + '</div>' +
    '<div class="vent-res-target">' + sub + '</div>' +
    '</div>';
}

function buildPeepTable(fio2, currentPeep) {
  var rows = [
    [30,5,5],[40,5,8],[50,8,10],[60,10,14],[70,10,14],[80,10,16],[90,14,18],[100,14,24]
  ];
  var html = '<table class="peep-table"><tr><th>FiO₂ (%)</th><th>PEEP Lower (cmH₂O)</th><th>PEEP Higher (cmH₂O)</th></tr>';
  rows.forEach(function(r) {
    var isActive = fio2 >= r[0] && (rows.indexOf(r) === rows.length - 1 || fio2 < rows[rows.indexOf(r)+1][0]);
    html += '<tr' + (isActive ? ' class="active-peep"' : '') + '>';
    html += '<td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td>';
    html += '</tr>';
  });
  html += '</table>';
  return html;
}
