/* ============================================================
   scripts-kalkulator-nutrisi.js
   Target kalori & protein ICU — ESPEN 2023 · ASPEN/SCCM 2022
   ============================================================ */

function calcNutrisi() {
  var bb        = parseFloat(document.getElementById('nut-bb').value);
  var ibwIn     = parseFloat(document.getElementById('nut-ibw').value);
  var tb        = parseFloat(document.getElementById('nut-tb').value);
  var fase      = document.getElementById('nut-fase').value;
  var kondisi   = document.getElementById('nut-kondisi').value;
  var route     = document.getElementById('nut-route').value;
  var refeeding = document.getElementById('nut-refeeding').value;

  var resDiv = document.getElementById('nut-result');
  if (!resDiv) return;
  if (isNaN(bb)) { resDiv.style.display = 'none'; return; }
  resDiv.style.display = 'block';

  /* BMI */
  var bmi = (!isNaN(tb) && tb > 0) ? Math.round(bb / ((tb/100) * (tb/100)) * 10) / 10 : null;
  var isObese = (bmi !== null && bmi >= 30) || kondisi === 'obese';

  /* Determine dosing weight:
     - Obese: use IBW or adjusted (IBW + 0.25 × (ABW - IBW))
     - Non-obese: use actual BW */
  var ibw = !isNaN(ibwIn) && ibwIn > 0 ? ibwIn : bb;
  var adjBW = isObese ? Math.round((ibw + 0.25 * (bb - ibw)) * 10) / 10 : null;
  var dosingWt = isObese ? adjBW : bb;

  /* ---- Calorie targets (kcal/kg/day) ---- */
  var kcalMin, kcalMax, kcalNote;

  if (fase === 'akut-awal') {
    /* Avoid over-feeding in early acute phase — hypometabolic */
    kcalMin = Math.round(dosingWt * 8);
    kcalMax = Math.round(dosingWt * 15);
    kcalNote = '50–70% target — fase hipometabolik (0–48 jam)';
  } else if (fase === 'recovery') {
    kcalMin = Math.round(dosingWt * 25);
    kcalMax = Math.round(dosingWt * 35);
    kcalNote = '25–35 kkal/kg/hari — fase recovery >7 hari';
  } else {
    /* Acute late 48h-7d */
    if (kondisi === 'ards') {
      kcalMin = Math.round(dosingWt * 22);
      kcalMax = Math.round(dosingWt * 25);
      kcalNote = '22–25 kkal/kg — ARDS berat, hindari over-feeding (CO₂ ↑)';
    } else if (isObese) {
      kcalMin = Math.round(ibw * 22);
      kcalMax = Math.round(ibw * 25);
      kcalNote = '22–25 kkal/kg IBW — obesitas (BMI ≥30), gunakan IBW ' + ibw + ' kg';
    } else {
      kcalMin = Math.round(dosingWt * 25);
      kcalMax = Math.round(dosingWt * 30);
      kcalNote = '25–30 kkal/kg/hari — ICU umum (fase akut lanjut)';
    }
  }

  /* ---- Protein targets (g/kg/day) ---- */
  var protFactor, protMin, protMax, protNote;

  if (kondisi === 'renal-pre') {
    protFactor = 0.9;
    protMin = Math.round(dosingWt * 0.8 * 10) / 10;
    protMax = Math.round(dosingWt * 1.0 * 10) / 10;
    protNote = '0.8–1.0 g/kg — AKI/CKD pre-dialisis (hindari fosfat & K tinggi)';
  } else if (kondisi === 'crrt') {
    protMin = Math.round(dosingWt * 1.5 * 10) / 10;
    protMax = Math.round(dosingWt * 2.0 * 10) / 10;
    protNote = '1.5–2.0 g/kg — CRRT (kehilangan asam amino via effluen ~0.2 g/L)';
  } else if (kondisi === 'trauma') {
    protMin = Math.round(dosingWt * 2.0 * 10) / 10;
    protMax = Math.round(dosingWt * 2.5 * 10) / 10;
    protNote = '2.0–2.5 g/kg — trauma/luka bakar · muscle wasting tinggi';
  } else if (isObese) {
    protMin = Math.round(ibw * 2.0 * 10) / 10;
    protMax = Math.round(ibw * 2.5 * 10) / 10;
    protNote = '2.0–2.5 g/kg IBW — obesitas · lean mass preservation';
  } else if (fase === 'recovery') {
    protMin = Math.round(dosingWt * 1.5 * 10) / 10;
    protMax = Math.round(dosingWt * 2.0 * 10) / 10;
    protNote = '1.5–2.0 g/kg — recovery · rehabilitasi otot';
  } else {
    protMin = Math.round(dosingWt * 1.2 * 10) / 10;
    protMax = Math.round(dosingWt * 2.0 * 10) / 10;
    protNote = '1.2–2.0 g/kg — ICU kritis standar';
  }

  /* ---- CHO & Fat ---- */
  var choMin = Math.round(dosingWt * 3);
  var choMax = Math.round(dosingWt * 5);
  var fatMin = Math.round(dosingWt * 0.7 * 10) / 10;
  var fatMax = Math.round(dosingWt * 1.5 * 10) / 10;

  /* ---- Refeeding risk ---- */
  var rfBadge = refeeding === 'tinggi' ? '<span class="nut-rf-badge rf-high">⛔ RISIKO TINGGI — Mulai pelan!</span>'
              : refeeding === 'sedang' ? '<span class="nut-rf-badge rf-med">⚠️ Risiko Sedang — Monitor elektrolit</span>'
              : '<span class="nut-rf-badge rf-low">✓ Risiko Rendah</span>';

  var rfNote = '';
  if (refeeding === 'tinggi') {
    kcalMin = Math.round(dosingWt * 10);
    kcalMax = Math.round(dosingWt * 20);
    rfNote = 'Refeeding syndrome: mulai 10–20 kkal/kg/hari, tingkatkan 5–10 kkal/kg/hari setiap 2–3 hari. Suplementasi tiamin 200–300 mg/hari, fosfat, K, Mg rutin.';
  } else if (refeeding === 'sedang') {
    kcalMin = Math.round(dosingWt * 15);
    kcalMax = Math.round(dosingWt * 22);
    rfNote = 'Risiko refeeding sedang: mulai 15–22 kkal/kg/hari, cek fosfat/K/Mg tiap hari selama 3–5 hari.';
  }

  /* ---- Route-specific guidance ---- */
  var routeNote = '';
  if (route === 'en') routeNote = 'Enteral: mulai 20–30 mL/jam → titrasi tiap 4–8 jam → target dalam 24–48 jam. HOB 30–45°.';
  else if (route === 'pn') routeNote = 'Parenteral: mulai jika EN tidak mungkin / tidak mencapai 60% target setelah 3–5 hari. Pantau glukosa, TG, elektrolit harian.';
  else routeNote = 'Kombinasi EN + PN (SPN): tambahkan PN jika EN hanya mencapai <60% target di hari ke-3–5.';

  /* ---- Harris-Benedict REE (estimasi) ---- */
  var ree = null;
  if (!isNaN(tb)) {
    /* HB 1919 revised: men avg, as proxy — we don't know gender, show range */
    ree = Math.round(10 * bb + 6.25 * tb - 5 * 45 + 5); /* approximate male midrange */
    /* Since we don't have age/gender, just note this */
  }

  /* ---- HTML output ---- */
  var html = '';
  html += '<div style="margin-bottom:10px">' + rfBadge + '</div>';

  html += '<div class="nut-result-grid">';

  html += nutCard('Target Kalori / Hari', kcalMin + '–' + kcalMax + ' kkal', kcalNote, false);
  html += nutCard('Target Protein / Hari', protMin + '–' + protMax + ' g', protNote, true);
  html += nutCard('Karbohidrat (CHO)', choMin + '–' + choMax + ' g/hari', '3–5 g/kg/hari (maks 7) · ≈' + Math.round((choMin+choMax)/2*4) + ' kkal', false);
  html += nutCard('Lemak (Fat)', fatMin + '–' + fatMax + ' g/hari', '0.7–1.5 g/kg/hari · ≈' + Math.round((fatMin+fatMax)/2*9) + ' kkal', false);
  if (bmi !== null) nutCard('BMI', bmi + ' kg/m²', isObese ? '≥30 — gunakan IBW ' + ibw + ' kg untuk dosis' : 'Normal — gunakan BB aktual', false);
  html += nutCard('Berat Dosis',
    dosingWt + ' kg',
    isObese ? 'Adjusted BW (IBW+0.25×(ABW−IBW)) — obesitas' : 'BB aktual', false);

  html += '</div>';

  /* EN volume estimate */
  var enVol = null;
  if (route !== 'pn') {
    /* Assume standard 1.0–1.5 kkal/mL formula */
    enVol = Math.round(((kcalMin + kcalMax) / 2) / 1.2); /* 1.2 kkal/mL standard */
    html += '<div class="nut-res-card" style="margin-top:10px">';
    html += '<div class="nut-res-label">Estimasi Volume Formula Enteral (1.2 kkal/mL)</div>';
    html += '<div class="nut-res-value">' + enVol + ' mL/hari</div>';
    html += '<div class="nut-res-sub">≈ ' + Math.round(enVol/24) + ' mL/jam kontinyu · atau ' + Math.round(enVol/6) + ' mL per 6 bolus/hari</div>';
    html += '</div>';
  }

  /* Route note */
  if (routeNote) {
    html += '<div class="nut-warn" style="margin-top:10px"><strong>📋 Route:</strong> ' + routeNote + '</div>';
  }

  /* Refeeding note */
  if (rfNote) {
    html += '<div class="nut-warn" style="margin-top:8px;border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.08)"><strong>⛔ Refeeding:</strong> ' + rfNote + '</div>';
  }

  /* Monitoring checklist */
  html += '<div style="margin-top:12px;font-size:12px;font-weight:700;color:var(--text2)">📊 Monitoring Harian Nutrisi ICU</div>';
  html += '<ul style="font-size:12px;color:var(--text2);padding-left:18px;margin:6px 0;line-height:1.8">';
  html += '<li>Glukosa: target <strong>140–180 mg/dL</strong> — koreksi dengan insulin jika perlu</li>';
  html += '<li>Elektrolit: K, Na, Mg, PO₄ — terutama 3 hari pertama (refeeding)</li>';
  html += '<li>Trigliserida: <strong>&lt;400 mg/dL</strong> jika PN lipid (cek 2× seminggu)</li>';
  html += '<li>Toleransi EN: GRV 4–6 jam, distensi abdomen, aspirasi, diare</li>';
  html += '<li>Nitrogen balance: UUN 24 jam — target NB ≥0 di fase recovery</li>';
  if (refeeding !== 'rendah') {
    html += '<li style="color:#f59e0b"><strong>Fosfat, K, Mg HARIAN</strong> 3–5 hari pertama — refeeding monitoring</li>';
  }
  html += '</ul>';

  resDiv.innerHTML = html;

  if (typeof window.saveCalcHistory === 'function') {
    window.saveCalcHistory(
      'nutrisi',
      'Nutrisi ICU — BB ' + bb + ' kg, ' + kondisi,
      { bb: bb, ibw: ibw, kondisi: kondisi, fase: fase, route: route },
      'Kalori ' + kcalMin + '–' + kcalMax + ' kkal · Protein ' + protMin + '–' + protMax + ' g'
    );
  }
}

function nutCard(label, value, sub, highlight) {
  return '<div class="nut-res-card' + (highlight ? ' highlight' : '') + '">' +
    '<div class="nut-res-label">' + label + '</div>' +
    '<div class="nut-res-value">' + value + '</div>' +
    '<div class="nut-res-sub">' + sub + '</div>' +
    '</div>';
}
