/* ============================================================
   scripts-kalkulator-pump.js
   Halaman: kalkulator-pump.html
   Fungsi: updatePumpCategory, updatePumpForm, calcPump
   ============================================================ */

const pumpInfo = {
  /* --- Sedasi / Analgetik --- */
  fentanyl:     { info:'Dosis: 25–200 mcg/kg/jam. Syringe: 500 mcg dalam 50 mL NaCl = 10 mcg/mL.', unit:'mcg/kg/jam', conc:10 },
  morphin:      { info:'Dosis: 20–80 mcg/kg/jam. Syringe: 20 mg dalam 20 mL NaCl = 1 mg/mL.', unit:'mcg/kg/jam', conc:1000 },
  midazolam:    { info:'Dosis: 0.02–0.1 mg/kg/jam. Syringe: 50 mg dalam 50 mL NaCl = 1 mg/mL.', unit:'mg/kg/jam', conc:1 },
  propofol:     { info:'Dosis: 5–80 mcg/kg/mnt. Syringe: Propofol 1% (10 mg/mL) langsung pakai tanpa pengenceran.', unit:'mcg/kg/mnt', conc:10000 },
  dexmed:       { info:'Dosis: 0.2–1.4 mcg/kg/jam. Syringe: 200 mcg dalam 50 mL NaCl = 4 mcg/mL. Loading 1 mcg/kg selama 10 mnt (opsional).', unit:'mcg/kg/jam', conc:4 },
  thiopental:   { info:'Dosis drip (ICP / Status Epileptikus): 1–5 mg/kg/jam. Syringe: 500 mg dalam 50 mL NaCl = 10 mg/mL. Monitor hipotensi & penumpukan jaringan lemak.', unit:'mg/kg/jam', conc:10 },
  /* --- Vasopressor / Inotropik --- */
  norepinef:    { info:'Dosis: 0.01–1 mcg/kg/mnt. Syringe: 4 mg dalam 50 mL D5% = 80 mcg/mL. Jalur sentral diutamakan.', unit:'mcg/kg/mnt', conc:80 },
  epinefrin:    { info:'Dosis: 0.01–1 mcg/kg/mnt. Syringe: 4 mg dalam 50 mL D5% = 80 mcg/mL. Jalur sentral. Monitor aritmia.', unit:'mcg/kg/mnt', conc:80 },
  dopamin:      { info:'Dosis: 2–20 mcg/kg/mnt. Syringe: 200 mg dalam 50 mL NaCl = 4000 mcg/mL.', unit:'mcg/kg/mnt', conc:4000 },
  dobutamin:    { info:'Dosis: 2–20 mcg/kg/mnt. Syringe: 250 mg dalam 50 mL NaCl = 5000 mcg/mL.', unit:'mcg/kg/mnt', conc:5000 },
  vasopressin:  { info:'Dosis: 0.01–0.04 units/mnt (flat dose — tidak per kg). Syringe: 20 unit dalam 100 mL NaCl = 0.2 unit/mL. Biasanya fixed 0.03 units/mnt pada septic shock.', unit:'units/mnt', conc:0.2 },
  phenylephrine:{ info:'Dosis: 0.05–6 mcg/kg/mnt. Syringe: 10 mg dalam 100 mL NaCl = 100 mcg/mL. Pure α1-agonis — tidak ada efek β. Jalur sentral diutamakan, perifer dapat untuk jangka pendek.', unit:'mcg/kg/mnt', conc:100 },
  /* --- Antiaritmia --- */
  amiodarone:   { info:'Maintenance: 0.5–1 mg/mnt (flat dose). Syringe: 450 mg dalam 250 mL D5% = 1.8 mg/mL. HANYA D5%, jangan NaCl (presipitasi).', unit:'mg/mnt', conc:1.8 },
  lidokain:     { info:'Dosis: 1–4 mg/mnt (flat dose). Syringe: 1000 mg dalam 500 mL D5% = 2 mg/mL. Setelah loading bolus 1–1.5 mg/kg IV.', unit:'mg/mnt', conc:2 },
  /* --- Diuretik --- */
  furosemide:   { info:'Dosis drip: 5–20 mg/jam (flat dose — tidak per kg). Syringe: 100 mg dalam 100 mL NaCl 0.9% = 1 mg/mL. Monitor kalium, kreatinin tiap 6–8 jam.', unit:'mg/jam', conc:1 },
  /* --- Lainnya --- */
  atrakurium:   { info:'Dosis: 5–12 mcg/kg/mnt. Syringe: 250 mg dalam 50 mL NaCl = 5 mg/mL.', unit:'mcg/kg/mnt', conc:5000 },
  cisatrakurium:{ info:'Dosis: 1–3 mcg/kg/mnt. Syringe: 20 mg dalam 20 mL NaCl = 1 mg/mL.', unit:'mcg/kg/mnt', conc:1000 },
  nitrogliserin:{ info:'Dosis: 10–200 mcg/mnt (flat dose — tidak per kg). Syringe: 50 mg dalam 50 mL D5% = 1 mg/mL = 1000 mcg/mL.', unit:'mcg/mnt', conc:1000 }
};

const drugNames = {
  fentanyl:'Fentanyl', morphin:'Morfin', midazolam:'Midazolam', propofol:'Propofol 1%',
  dexmed:'Dexmedetomidine', thiopental:'Thiopental (Tiopol)', norepinef:'Norepinefrin', epinefrin:'Epinefrin',
  dopamin:'Dopamin', dobutamin:'Dobutamin', vasopressin:'Vasopressin', phenylephrine:'Phenylephrine (Phenerin)',
  amiodarone:'Amiodaron', lidokain:'Lidokain', furosemide:'Furosemide',
  atrakurium:'Atrakurium', cisatrakurium:'Cisatrakurium', nitrogliserin:'Nitrogliserin'
};

const pumpCategories = {
  sedasi:      [['fentanyl','Fentanyl'],['morphin','Morfin'],['midazolam','Midazolam'],['propofol','Propofol 1%'],['dexmed','Dexmedetomidine'],['thiopental','Thiopental (Tiopol)']],
  vasopressor: [['norepinef','Norepinefrin'],['epinefrin','Epinefrin'],['dopamin','Dopamin'],['dobutamin','Dobutamin'],['vasopressin','Vasopressin'],['phenylephrine','Phenylephrine (Phenerin)']],
  antiaritmia: [['amiodarone','Amiodaron'],['lidokain','Lidokain']],
  diuretik:    [['furosemide','Furosemide']],
  lainnya:     [['atrakurium','Atrakurium'],['cisatrakurium','Cisatrakurium'],['nitrogliserin','Nitrogliserin']]
};

function updatePumpCategory() {
  var cat = document.getElementById('pumpCat').value;
  var drugSel = document.getElementById('pumpDrug');
  if (!drugSel) return;
  var opts = pumpCategories[cat] || [];
  drugSel.innerHTML = '';
  opts.forEach(function(pair) {
    var o = document.createElement('option');
    o.value = pair[0]; o.textContent = pair[1];
    drugSel.appendChild(o);
  });
  updatePumpForm();
}

function updatePumpForm() {
  var drugEl = document.getElementById('pumpDrug');
  if (!drugEl) return;
  var drug = drugEl.value;
  var info = pumpInfo[drug];
  if (!info) return;
  var infoEl = document.getElementById('pump-drug-info');
  var unitEl = document.getElementById('pumpDoseUnit');
  if (infoEl) infoEl.innerHTML = '<strong>' + (drugNames[drug]||drug) + ':</strong><br>' + info.info;
  if (unitEl) unitEl.textContent = info.unit;
  /* Clear previous result */
  var res = document.getElementById('pump-results');
  if (res) res.classList.add('hidden');
}

function calcPump() {
  var bb   = parseFloat(document.getElementById('pumpBB').value);
  var drug = document.getElementById('pumpDrug').value;
  var dose = parseFloat(document.getElementById('pumpDose').value);
  var vol  = parseFloat(document.getElementById('pumpVol').value);
  if (!bb || !dose) { alert('Masukkan BB dan dosis target'); return; }
  var info  = pumpInfo[drug];
  var dname = drugNames[drug] || drug;
  var unit  = info.unit;
  var conc  = info.conc; /* mcg/mL, mg/mL, atau unit/mL tergantung obat */

  var rateMlH;
  if (unit === 'mg/jam') {
    /* Flat hourly: furosemide */
    rateMlH = dose / conc;
  } else if (unit === 'mg/mnt' || unit === 'mcg/mnt' || unit === 'units/mnt') {
    /* Flat per-minute: nitrogliserin, amiodaron, lidokain, vasopressin */
    rateMlH = (dose * 60) / conc;
  } else if (unit === 'mcg/kg/jam' || unit === 'mg/kg/jam') {
    rateMlH = (dose * bb) / conc;
  } else {
    /* mcg/kg/mnt — default (norepinefrin, dopamin, propofol, dll) */
    rateMlH = (dose * bb * 60) / conc;
  }

  var duration = (vol / rateMlH).toFixed(1);
  var isFlatDose = (unit === 'mg/jam' || unit === 'mg/mnt' || unit === 'mcg/mnt' || unit === 'units/mnt');

  var html = '<div class="pump-result">' +
    '<div class="plabel">Rate Syringe Pump — ' + dname + '</div>' +
    '<div class="pval">' + rateMlH.toFixed(2) + ' mL/jam</div>' +
    '<div class="psub">Dosis: ' + dose + ' ' + unit + (isFlatDose ? '' : ' · BB: ' + bb + ' kg') + ' · Syringe: ' + vol + ' mL</div>' +
    '</div>' +
    '<div class="result-grid" style="margin-top:10px">' +
    '<div class="result-card"><div class="result-label">Rate</div><div class="result-value">' + rateMlH.toFixed(2) + '</div><div class="result-sub">mL/jam</div></div>' +
    '<div class="result-card"><div class="result-label">Durasi Syringe</div><div class="result-value">' + duration + '</div><div class="result-sub">jam (' + vol + ' mL)</div></div>' +
    '<div class="result-card"><div class="result-label">Dosis Aktual</div><div class="result-value">' + dose + '</div><div class="result-sub">' + unit + '</div></div>' +
    '</div>' +
    '<div class="formula-note" style="margin-top:8px">' + info.info + '</div>';

  if (drug === 'furosemide') {
    html += '<div class="warn" style="margin-top:8px;font-size:12px"><strong>⚠ Monitoring Furosemide Drip:</strong> Cek K⁺ dan kreatinin tiap 6–8 jam · Target UO 0.5–1 mL/kg/jam · Kurangi dosis jika oliguria persisten atau K &lt;3.5 mEq/L</div>';
  }
  if (drug === 'vasopressin') {
    html += '<div class="info" style="margin-top:8px;font-size:12px"><strong>Vasopressin pada Septic Shock:</strong> Dosis tetap 0.03 units/mnt — tidak dititrasi seperti NE. Tambahkan ke NE, bukan gantikan. SSC 2024.</div>';
  }
  if (drug === 'phenylephrine') {
    html += '<div class="info" style="margin-top:8px;font-size:12px"><strong>Phenylephrine — Pure α1-agonis:</strong> Tidak ada efek β → tidak meningkatkan HR. Dapat menyebabkan <em>refleks bradikardia</em>. Keunggulan vs norepinefrin pada pasien dengan takikardia (AF rapid ventricular response, HOCM). Hindari pada disfungsi miokard atau curah jantung rendah karena meningkatkan afterload tanpa kompensasi inotrop. Referensi: SCCM Vasopressor Guidelines 2023.</div>';
  }

  document.getElementById('pump-result-content').innerHTML = html;
  document.getElementById('pump-results').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('pumpCat')) {
    updatePumpCategory();
  }
});
