/* ============================================================
   scripts-kalkulator-electro.js
   Halaman: kalkulator-electro.html
   Fungsi: toggleTheory, calcNaCorr, calcKCorr, calcCaCorr, calcMgCorr,
           selectVolStatus, calcOsmolalitas
   ============================================================ */

/* ──────────────────────────────────────────────────────────────
   UNIT TOGGLE — Glukosa (mg/dL ↔ mmol/L) · Ca (mg/dL ↔ mmol/L)
                 Mg (mg/dL ↔ mmol/L)
   Konsisten dengan pola ABG toggleUnit (konversi nilai in-place).
   ────────────────────────────────────────────────────────────── */
var _kalcU = {
  'na-glu':  { u:['mg/dL','mmol/L'], f:[1/18,18],      d:[0,2], p:['opsional','opsional']    },
  'osm-glu': { u:['mg/dL','mmol/L'], f:[1/18,18],      d:[0,2], p:['cth: 180','cth: 10.0']  },
  'ca-val':  { u:['mg/dL','mmol/L'], f:[1/4.008,4.008],d:[1,2], p:['cth: 6.8','cth: 1.70']  },
  'mg-val':  { u:['mg/dL','mmol/L'], f:[1/2.431,2.431],d:[1,2], p:['cth: 1.1','cth: 0.45']  }
};
function toggleKalcUnit(id){
  var c=_kalcU[id]; if(!c)return;
  var k='kalc-unit-'+id, cur=localStorage.getItem(k)||c.u[0], isBase=cur===c.u[0];
  var next=isBase?c.u[1]:c.u[0];
  var inp=document.getElementById(id);
  if(inp&&inp.value!==''){var v=parseFloat(inp.value);if(!isNaN(v))inp.value=(v*c.f[isBase?0:1]).toFixed(c.d[isBase?1:0]);}
  if(inp)inp.placeholder=isBase?c.p[1]:c.p[0];
  localStorage.setItem(k,next);
  var btn=document.querySelector('[data-unit="'+id+'"]');
  if(btn)btn.textContent=next;
}
/* Baca nilai input dan kembalikan selalu dalam mg/dL.
   factor = angka pengali unit-alternatif → mg/dL */
function _asMgDL(id,factor){
  var v=parseFloat(document.getElementById(id).value);
  return (localStorage.getItem('kalc-unit-'+id)||'mg/dL')!=='mg/dL'?v*factor:v;
}
document.addEventListener('DOMContentLoaded',function(){
  Object.keys(_kalcU).forEach(function(id){
    var stored=localStorage.getItem('kalc-unit-'+id);
    if(stored){
      var btn=document.querySelector('[data-unit="'+id+'"]');
      if(btn)btn.textContent=stored;
      var inp=document.getElementById(id),c=_kalcU[id];
      if(inp&&c)inp.placeholder=stored===c.u[0]?c.p[0]:c.p[1];
    }
  });
});

/* ──────────────────────────────────────────────────────────────
   OSMOLALITAS & STATUS VOLUME
   ────────────────────────────────────────────────────────────── */
var _selVol = null;

function selectVolStatus(v) {
  _selVol = v;
  document.querySelectorAll('.osm-vol-chip').forEach(function(c) {
    c.classList.toggle('active', c.dataset.vol === v);
  });
}

function calcOsmolalitas() {
  var na       = parseFloat(document.getElementById('osm-na').value);
  var glu      = _asMgDL('osm-glu',18);   /* mg/dL atau mmol/L → selalu mg/dL */
  var bunRaw   = parseFloat(document.getElementById('osm-bun').value);
  var bunUnit  = document.getElementById('osm-bun-unit').value;
  var osmMeas  = parseFloat(document.getElementById('osm-measured').value);
  var una      = parseFloat(document.getElementById('osm-una').value);
  var uosm     = parseFloat(document.getElementById('osm-uosm').value);
  var bun2     = parseFloat(document.getElementById('osm-bun2').value);
  var cr       = parseFloat(document.getElementById('osm-cr').value);

  if (isNaN(na) || isNaN(glu)) {
    alert('Masukkan minimal Na serum dan Glukosa'); return;
  }

  /* -- Konversi BUN ke kontribusi osmolalitas ------------------- */
  var bunOsm = 0;
  if (!isNaN(bunRaw)) {
    if (bunUnit === 'bun')  bunOsm = bunRaw / 2.8;
    else if (bunUnit === 'urea') bunOsm = bunRaw / 6;
    else bunOsm = bunRaw;          // mmol/L sudah langsung
  }

  /* -- Kalkulasi utama ------------------------------------------ */
  var osmCalc = 2 * na + glu / 18 + bunOsm;
  var osmEff  = 2 * na + glu / 18;   // tonisitas — BUN bebas difusi, tidak berkontribusi
  var osmGap  = isNaN(osmMeas) ? null : osmMeas - osmCalc;

  /* -- Klasifikasi osmolalitas ---------------------------------- */
  var osmClass, osmColor, osmNote;
  if (osmEff < 280) {
    osmClass = 'Hipotonik'; osmColor = 'var(--amber)';
    osmNote  = 'Hipotonik → evaluasi volume status untuk tentukan etiologi hiponatremia';
  } else if (osmEff <= 295) {
    osmClass = 'Isotonik'; osmColor = 'var(--green)';
    osmNote  = 'Isotonik → pertimbangkan pseudohiponatremia (hiperlipidemia, hiperproteinemia)';
  } else {
    osmClass = 'Hipertonik'; osmColor = 'var(--accent)';
    osmNote  = 'Hipertonik → curiga hiperglikemia, manitol, atau zat osmotik aktif lain';
  }

  /* -- Osmol gap interpretation --------------------------------- */
  var osmGapHtml = '';
  if (osmGap !== null) {
    var gapClass = osmGap > 10 ? 'amber' : 'teal';
    var gapNote  = osmGap > 20
      ? '⚠ Osmol gap >20 → curiga toksisitas alkohol (etanol, metanol, etilen glikol, isopropanol) atau asidosis laktat berat'
      : osmGap > 10
      ? 'Osmol gap sedikit meningkat — pertimbangkan penyebab toksik ringan atau kesalahan sampling'
      : 'Osmol gap normal (<10) — tidak ada bukti osmolen toksik tambahan';
    osmGapHtml = `<div class="cc ${gapClass}" style="margin-top:8px">
      <div class="ct">Osmol Gap: ${osmGap.toFixed(1)} mOsm/kg</div>
      <p>${gapNote}</p>
    </div>`;
  }

  /* -- BUN/Cr ratio --------------------------------------------- */
  var bunCrHtml = '';
  if (!isNaN(bun2) && !isNaN(cr) && cr > 0) {
    var ratio = bun2 / cr;
    var ratioNote = ratio > 20
      ? '↑ BUN/Cr >20 → dehidrasi pre-renal / penurunan perfusi ginjal (mendukung hipovolemik)'
      : ratio < 10
      ? '↓ BUN/Cr <10 → dapat dijumpai pada SIADH, overhydration, atau gagal hati'
      : 'BUN/Cr 10–20 → normal';
    bunCrHtml = `<div style="font-size:11px;color:var(--text2);font-family:'JetBrains Mono',monospace;margin-top:4px">
      BUN/Cr = ${ratio.toFixed(1)} — ${ratioNote}
    </div>`;
  }

  /* -- Volume status interpretation ----------------------------- */
  var volHtml = '';
  if (_selVol) {
    var volData = {
      hipo: {
        label: 'Hipovolemik', color: '#ef4444',
        signs: 'Tachycardia, hipotensi, turgor kulit turun, mukosa kering, oliguria, BUN/Cr >20',
        etiologi: [
          'Kehilangan GI: muntah, diare, NGT suction berkepanjangan',
          'Diuretik berlebih (thiazide — paling sering penyebab SIADH-like di lansia)',
          'Third-space losses: pankreatitis, luka bakar, peritonitis',
          'Insufisiensi adrenal (Addison), cerebral salt wasting'
        ],
        una_expect: 'UNa <20 (kehilangan ekstra-renal) atau >20 (kehilangan renal/diuretik)',
        treatment: 'NaCl 0.9% untuk restorasi volume → Na akan naik sendiri seiring volume pulih.<br>Monitor cermat agar koreksi tidak terlalu cepat (>8–10 mEq/24 jam).'
      },
      eu: {
        label: 'Euvolemik', color: '#22c55e',
        signs: 'Tidak ada tanda dehidrasi, tidak ada edema, tekanan darah dan nadi normal',
        etiologi: [
          'SIADH (paling umum) — ADH berlebih inappropriate',
          'Hipotiroid — TSH perlu dicek',
          'Insufisiensi adrenal sekunder (ACTH kurang)',
          'Polidipsia psikogenik (intake air berlebihan)',
          'Drug-induced: carbamezapine, SSRIs, antipsikotik, NSAIDs, cyclophosphamide'
        ],
        una_expect: 'SIADH: UNa >30 mEq/L, UOSM >100 (biasanya >300) mOsm/kg',
        treatment: 'Restriksi cairan 0.8–1.2 L/hari (lini pertama SIADH).<br>Hipertonik salin (NaCl 3%) untuk hiponatremia simtomatik.<br>Vaptans (tolvaptan) untuk SIADH refrakter — kontraindikasi pada gagal hati.'
      },
      hiper: {
        label: 'Hipervolemik', color: '#3b82f6',
        signs: 'Edema perifer, asites, JVP meningkat, ronki paru, BB meningkat',
        etiologi: [
          'Gagal jantung kongestif (CHF) — dilusi Na',
          'Sirosis hati — hipertensi portal + aldosteron sekunder',
          'Sindrom nefrotik — hipoalbuminemia + retensi Na',
          'AKI/CKD stadium lanjut — retensi air dan Na'
        ],
        una_expect: 'UNa <20 (CHF, sirosis, nefrotik) atau >20 (CKD)',
        treatment: 'Restriksi cairan + restriksi Na diet.<br>Diuretik (furosemide ± spironolactone untuk sirosis).<br>Atasi penyakit dasar. Hindari NaCl hipotonik.'
      }
    };
    var vd = volData[_selVol];
    var unaCheck = '';
    if (!isNaN(una)) {
      var unaLow = una < 20;
      if (_selVol === 'hipo') {
        unaCheck = `<br><strong>UNa ${una} mEq/L → ${unaLow ? 'Kehilangan <em>ekstra-renal</em> (GI, kulit)' : 'Kehilangan <em>renal</em> atau diuretik aktif'}</strong>`;
      } else if (_selVol === 'eu') {
        unaCheck = `<br><strong>UNa ${una} mEq/L → ${!unaLow ? 'Mendukung SIADH (UNa >20)' : 'UNa rendah — periksa ulang atau pertimbangkan intake Na sangat rendah'}</strong>`;
      } else {
        unaCheck = `<br><strong>UNa ${una} mEq/L → ${unaLow ? 'Mendukung CHF/Sirosis/Nefrotik (UNa <20)' : 'Mendukung CKD atau diuretik aktif (UNa >20)'}</strong>`;
      }
    }
    var uosmCheck = '';
    if (!isNaN(uosm) && _selVol === 'eu') {
      uosmCheck = uosm > 100
        ? `<br><strong>UOSM ${uosm} mOsm/kg — >${uosm >= 300 ? '300' : '100'} → ${uosm >= 300 ? 'Sangat mendukung SIADH (ADH aktif)' : 'Urin tidak dilusi maksimal — mendukung SIADH atau hipotiroid'}</strong>`
        : `<br><strong>UOSM ${uosm} mOsm/kg — <100 → curiga <em>polidipsia psikogenik</em> atau potomania (intake air berlebihan)</strong>`;
    }

    volHtml = `<div class="cc" style="margin-top:10px;border-color:${vd.color};background:${vd.color}15">
      <div class="ct" style="color:${vd.color}">Status Volume: ${vd.label}</div>
      <p>
        <strong>Tanda klinis khas:</strong> ${vd.signs}${unaCheck}${uosmCheck}
      </p>
      <p><strong>Etiologi yang perlu dipertimbangkan:</strong></p>
      <ul style="margin:4px 0 8px 16px;padding:0;font-size:12px;line-height:1.8">
        ${vd.etiologi.map(function(e){return '<li>'+e+'</li>';}).join('')}
      </ul>
      <p><strong>Ekspektasi UNa:</strong> ${vd.una_expect}</p>
      <p><strong>✦ Arah Tata Laksana:</strong> ${vd.treatment}</p>
    </div>`;
  }

  /* -- Bangun output -------------------------------------------- */
  var html = '<div class="result-grid">';
  html += `<div class="result-card">
    <div class="result-label">Osm Terhitung</div>
    <div class="result-value">${osmCalc.toFixed(1)}</div>
    <div class="result-sub">mOsm/kg (2Na + Glu/18 + BUN/2.8)</div>
  </div>`;
  html += `<div class="result-card">
    <div class="result-label">Osm Efektif (Tonisitas)</div>
    <div class="result-value" style="color:${osmColor}">${osmEff.toFixed(1)}</div>
    <div class="result-sub">mOsm/kg (2Na + Glu/18) — BUN tidak berkontribusi</div>
  </div>`;
  if (!isNaN(osmMeas)) {
    html += `<div class="result-card">
      <div class="result-label">Osmolalitas Terukur</div>
      <div class="result-value">${osmMeas.toFixed(0)}</div>
      <div class="result-sub">mOsm/kg (dari lab)</div>
    </div>`;
    html += `<div class="result-card">
      <div class="result-label">Osmol Gap</div>
      <div class="result-value" style="color:${Math.abs(osmGap)>10?'var(--amber)':'var(--green)'}">${osmGap.toFixed(1)}</div>
      <div class="result-sub">mOsm/kg (terukur − terhitung, normal &lt;10)</div>
    </div>`;
  }
  html += '</div>';

  html += `<div class="cc" style="margin-top:10px;border-color:${osmColor}">
    <div class="ct">Klasifikasi: Osmolalitas ${osmClass} — ${osmEff.toFixed(1)} mOsm/kg</div>
    <p>${osmNote}</p>
  </div>`;

  html += osmGapHtml;
  html += bunCrHtml;
  html += volHtml;

  /* -- Tabel ringkas diagnostik bersama ------------------------- */
  html += `<details style="margin-top:12px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📖 Tabel Diagnostik Cepat — Osmolalitas × Volume Status ▼
    </summary>
    <div style="padding:10px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card)">
      <table style="font-size:11px">
        <tr><th>Osm Efektif</th><th>Status Volume</th><th>Diagnosis Paling Mungkin</th><th>UNa</th></tr>
        <tr><td rowspan="3"><strong>Hipotonik<br>(&lt;280)</strong></td>
            <td>Hipovolemik</td><td>Kehilangan Na &gt; Air (diuretik, GI, insuf. adrenal)</td><td>&lt;20 (GI) / &gt;20 (renal)</td></tr>
        <tr><td>Euvolemik</td><td>SIADH, hipotiroid, insuf. adrenal sekunder, polidipsia</td><td>&gt;30 (SIADH)</td></tr>
        <tr><td>Hipervolemik</td><td>CHF, sirosis, nefrotik, CKD</td><td>&lt;20 (CHF/sirosis) / &gt;20 (CKD)</td></tr>
        <tr><td><strong>Isotonik<br>(280–295)</strong></td><td colspan="2">Pseudohiponatremia — hiperlipidemia berat, hiperproteinemia, mieloma</td><td>—</td></tr>
        <tr><td><strong>Hipertonik<br>(&gt;295)</strong></td><td colspan="2">Translokasi Na (hiperglikemia, manitol) — Na sebenarnya lebih tinggi</td><td>—</td></tr>
      </table>
      <div class="formula-note" style="margin-top:8px">
        📚 Sterns RH. NEJM 2015;372:55 · Adrogue HJ. NEJM 2000;342:1581 · Spasovski G (ERBP). Nephrol Dial Transplant 2014 · Verbalis JG. Am J Med 2013;126:S1 · Bhave G. CJASN 2017;12:2000
      </div>
    </div>
  </details>`;

  var res = document.getElementById('osm-results');
  res.classList.remove('hidden');
  document.getElementById('osm-result-content').innerHTML = html;
}

function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

function calcNaCorr(){
  const na=parseFloat(document.getElementById('na-val').value);
  const sex=document.getElementById('na-sex').value;
  const bw=parseFloat(document.getElementById('na-bw').value);
  const glu=_asMgDL('na-glu',18);   /* mg/dL atau mmol/L → selalu mg/dL */
  const onset=(document.querySelector('input[name="na-onset"]:checked')||{value:'kronik'}).value;
  const speed=document.getElementById('na-speed').value;
  if(!na||!bw){alert('Masukkan Na serum dan berat badan');return;}

  const tbwF=sex==='m'?0.6:0.5;
  const tbw=bw*tbwF;
  const naT=140;

  // Limit koreksi berdasarkan onset
  const limitLow=onset==='akut'?10:6;
  const limitHigh=onset==='akut'?12:8;

  let naCorr=na,naCorrNote='';
  if(!isNaN(glu)&&glu>100){
    const corr=1.6*(glu-100)/100;
    naCorr=na+corr;
    naCorrNote=`Na terkoreksi hiperglikemia (Glukosa ${glu} mg/dL): ${na} + ${corr.toFixed(1)} = <strong>${naCorr.toFixed(1)} mEq/L</strong>`;
  }

  let html='<div class="result-grid">';
  if(na<135){
    // Na target berdasarkan onset
    const naTarget=Math.min(na+(onset==='akut'?10:6), naT);
    const deltaNa=naTarget-na;

    // Volume NaCl 3% = (ΔNa × TBW × 1000) / 513
    const vol3=(deltaNa*tbw*1000)/513;

    // Rate berdasarkan speed
    let rateLabel,rateMl,durationH;
    if(speed==='emergency'){
      // 2 mEq/L per jam → duration = deltaNa/2
      durationH=deltaNa/2;
      rateMl=vol3/durationH;
      rateLabel='2 mEq/L/jam (emergensi)';
    }else{
      // 0.5 mEq/L per jam (standar) → duration = deltaNa/0.5
      durationH=deltaNa/0.5;
      rateMl=vol3/durationH;
      rateLabel='0.5 mEq/L/jam (standar)';
    }

    // Juga hitung rate 24/48 jam untuk referensi
    const rate24=vol3/24,rate48=vol3/48;

    html+=`<div class="result-card"><div class="result-label">Na Target (${limitLow} mEq naik)</div><div class="result-value">${naTarget.toFixed(0)}</div><div class="result-sub">mEq/L dari ${na} mEq/L</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Volume NaCl 3%</div><div class="result-value">${vol3.toFixed(0)}</div><div class="result-sub">mL total ke target</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Rate (${rateLabel})</div><div class="result-value">${rateMl.toFixed(1)}</div><div class="result-sub">mL/jam selama ${durationH.toFixed(1)} jam</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Rate 24 jam</div><div class="result-value">${rate24.toFixed(1)}</div><div class="result-sub">mL/jam (ke target 140)</div></div>`;
    html+='</div>';

    const sev=na<120?'Berat (<120)':na<130?'Sedang (120–129)':'Ringan (130–134)';
    const cls=na<120?'red':'amber';

    // Warning onset akut
    if(onset==='akut'){
      html+=`<div class="info" style="margin-top:10px;font-size:12px;border-color:var(--amber)">
        ⚡ <strong>Hiponatremia akut:</strong> Koreksi boleh lebih cepat (batas ${limitLow}–${limitHigh} mEq/L/24 jam), namun tetap monitor Na setiap 2–4 jam.
      </div>`;
    }

    // Box emergensi jika speed=emergency
    if(speed==='emergency'){
      html+=`<div class="cc red" style="margin-top:8px"><div class="ct">🚨 Protokol Bolus NaCl 3% — Emergensi</div>
      <p><strong>Bolus NaCl 3%: 150 mL IV dalam 20 menit</strong> (dapat diulang hingga 2×)<br>
      Target: Na naik 5 mEq/L — cukup untuk menghentikan gejala berat (kejang, herniasi)<br>
      Setelah gejala terkontrol → lanjutkan infus lambat sesuai rate di atas<br>
      <strong>Disclaimer: Cek Na serum ulang setiap 2–4 jam selama koreksi aktif</strong></p>
      <div class="formula-note">📚 Spasovski G (ERBP/ESE). Nephrol Dial Transplant 2014</div></div>`;
    }

    html+=`<div class="cc ${cls}" style="margin-top:10px"><div class="ct">Hiponatremia ${sev} — Na ${na} mEq/L | Onset: ${onset==='akut'?'Akut (<48 jam)':'Kronik (≥48 jam)'}</div>
    <p><strong>Batas koreksi aman (onset ${onset}):</strong> ↑${limitLow}–${limitHigh} mEq/L per 24 jam ${onset==='kronik'?'— ODS high risk':'— risiko ODS lebih rendah (otak belum sempat osmotic adaptation)'}.<br>
    <strong>Volume NaCl 3%:</strong> ${vol3.toFixed(0)} mL untuk Na naik ${deltaNa.toFixed(0)} mEq/L.<br>
    <strong>Rate:</strong> ${rateMl.toFixed(1)} mL/jam (${rateLabel}, durasi ${durationH.toFixed(1)} jam).<br>
    ${na<125?'<strong>Gejala berat (kejang/koma):</strong> Bolus 150 mL NaCl 3% IV dalam 20 mnt, dapat diulang 2× hingga gejala membaik.<br>':''}
    Monitor Na serum tiap 2–4 jam. Stop atau lambatkan jika koreksi sudah ${limitLow}–${limitHigh} mEq/L dalam 24 jam.</p></div>`;

    // Rescue protocol collapsible
    html+=`<details style="margin-top:10px">
      <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--amber);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border);border-radius:8px">
        📖 Rescue Protocol — Jika Na sudah terkoreksi &gt;10 mEq dalam 24 jam ▼
      </summary>
      <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.7">
        <strong style="color:var(--amber)">Jika Na sudah naik &gt;10 mEq/L dalam 24 jam (over-correction):</strong><br>
        <ol style="margin:8px 0 0 16px;padding:0">
          <li>STOP semua cairan hipotonik dan koreksi aktif</li>
          <li><strong>DDAVP (desmopressin) 2–4 μg SC/IV</strong> setiap 6–8 jam — membuat urin hipotonik, mencegah Na naik lebih lanjut</li>
          <li><strong>D5W (Dextrose 5%)</strong> infus lambat untuk "re-lower" Na jika perlu</li>
          <li>Target: Na tidak naik lebih dari 10 mEq/L dalam total 24 jam pertama</li>
        </ol>
        <div class="formula-note" style="margin-top:8px">📚 Sterns RH. NEJM 2015;372:55 · Verbalis JG. Am J Med 2013;126:S1</div>
      </div>
    </details>`;
  html+=`<details style="margin-top:8px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📋 Panduan Praktis Pemberian NaCl 3% ▼
    </summary>
    <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.9">
      <strong style="color:var(--accent)">Kandungan NaCl 3%:</strong><br>
      → Konsentrasi: 513 mEq/L ≈ <strong>0.5 mEq Na per mL</strong><br>
      → Sediaan: botol 500 mL ready-to-use atau per pharmacy preparation<br>
      → <strong>Wajib pompa infus</strong> — bukan tetes bebas (rate presisi kritis)<br><br>
      <strong style="color:var(--accent)">Rute pemberian:</strong><br>
      → Perifer: boleh untuk bolus emergensi (150 mL/20 mnt) atau infus jangka pendek<br>
      → Sentral (CVC): dianjurkan untuk infus berkelanjutan &gt;6 jam<br><br>
      <strong style="color:var(--accent)">Monitoring selama koreksi aktif:</strong><br>
      → Cek Na serum tiap <strong>2–4 jam</strong><br>
      → Kronik: STOP/lambatkan jika Na sudah naik 6 mEq/L dalam 24 jam<br>
      → Akut: batas aman 10–12 mEq/L per 24 jam, tetap monitor ketat<br>
      → Kaji neurologis tiap 2–4 jam: kesadaran, kejang, tanda herniasi<br>
      → Risiko ODS tinggi: hiponatremia kronik + malnutrisi + hipokalemia + alkoholisme
      <div class="formula-note" style="margin-top:8px">📚 Sterns RH. NEJM 2015;372:55 · Spasovski G (ERBP). Nephrol Dial Transplant 2014 · Hoorn EJ. NEJM 2023;388:2340</div>
    </div>
  </details>`;

  }else if(na>145){
    const wdef=tbw*(na/naT-1);
    const rateW=wdef*1000/48;
    html+=`<div class="result-card"><div class="result-label">Water Deficit</div><div class="result-value" style="color:var(--amber)">${wdef.toFixed(2)}</div><div class="result-sub">Liter (TBW ${tbw.toFixed(1)} L)</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Rate cairan bebas (48 jam)</div><div class="result-value">${rateW.toFixed(0)}</div><div class="result-sub">mL/jam D5W atau NaCl 0.45%</div></div>`;
    html+='</div>';
    html+=`<div class="cc amber" style="margin-top:10px"><div class="ct">Hipernatremia — Na ${na} mEq/L</div>
    <p>Water deficit: <strong>${wdef.toFixed(2)} L</strong>. Gunakan D5W atau NaCl 0.45%. <strong>Koreksi max 0.5 mEq/L/jam atau 10 mEq/L/hari</strong> (risiko edema serebral).<br>
    Rate: ${rateW.toFixed(0)} mL/jam selama 48 jam. Monitor Na tiap 4–6 jam.</p></div>`;
  html+=`<details style="margin-top:8px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📋 Panduan Praktis Koreksi Hipernatremia ▼
    </summary>
    <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.9">
      <strong style="color:var(--accent)">Pilihan cairan bebas (free water):</strong><br>
      → <strong>D5W</strong>: 1 L = ~1 L free water — pilihan utama<br>
      → <strong>NaCl 0.45%</strong>: 1 L = ~0.5 L free water — jika hiperglikemia atau DM<br>
      → Oral / NGT: jika pasien dapat minum atau NGT berfungsi, free water enteral lebih fisiologis<br><br>
      <strong style="color:var(--accent)">Monitoring:</strong><br>
      → Cek Na serum tiap <strong>4–6 jam</strong><br>
      → Target: Na turun ≤0.5 mEq/L/jam atau ≤10 mEq/L/24 jam<br>
      → Evaluasi penyebab ongoing: demam, hiperventilasi, poliuria, kehilangan GI<br>
      → Jika poliuria + urin sangat encer: curiga Diabetes Insipidus — uji DDAVP 1–2 μg SC/IV<br>
      → Pasang kateter urin untuk monitoring output per jam
      <div class="formula-note" style="margin-top:8px">📚 Adrogue HJ. NEJM 2000;342:1581 · Hoorn EJ. NEJM 2023;388:2340</div>
    </div>
  </details>`;
  }else{
    html+='</div>';
    html+=`<div class="cc teal" style="margin-top:10px"><div class="ct">Na Normal (135–145 mEq/L)</div><p>Tidak diperlukan koreksi Na.</p></div>`;
  }

  if(naCorrNote)html+=`<div class="formula-note" style="margin-top:8px">${naCorrNote}</div>`;
  html+=`<div class="formula-note" style="margin-top:6px">TBW = ${tbwF*100}% × BB · NaCl 3% = 513 mEq/L (3 mEq/mL) · Formula: Volume = ΔNa × TBW × 1000 / 513 &nbsp;|&nbsp; Adrogue HJ. NEJM 2000;342:1581 · Sterns RH. NEJM 2015;372:55 · Hoorn EJ. NEJM 2023;388:2340</div>`;
  document.getElementById('na-result-content').innerHTML=html;
  document.getElementById('na-results').classList.remove('hidden');
}

function calcKCorr(){
  const k=parseFloat(document.getElementById('k-val').value);
  const bw=parseFloat(document.getElementById('k-bw').value);
  const ph=parseFloat(document.getElementById('k-ph').value);
  const access=document.getElementById('k-access').value;
  if(!k){alert('Masukkan nilai K serum');return;}

  let phHtml='';
  if(!isNaN(ph)){
    // 1 unit pH change = ~6 mEq/L change in K serum (Macdonald 2004)
    const phEffect=(7.4-ph)*6; // positive = asidosis raised K
    const kTrue=k-phEffect;
    const isAcidosis=ph<7.4;
    const isAlkalosis=ph>7.4;
    let phInterp='';
    if(isAcidosis){
      phInterp=`<br>→ Asidosis (pH ${ph}) meningkatkan K serum ~<strong>${Math.abs(phEffect).toFixed(2)} mEq/L</strong><br>
      → K intrasel sesungguhnya lebih rendah: estimasi <strong>${kTrue.toFixed(2)} mEq/L</strong><br>
      → Koreksi asidosis akan menurunkan K serum`;
      if(k<3.5){
        phInterp+=`<br><span style="color:var(--red);font-weight:700">⚠ Koreksi asidosis berisiko memperparah hipokalemia — koreksi K lebih dulu atau bersamaan</span>`;
      }
    }else if(isAlkalosis){
      phInterp=`<br>→ Alkalosis (pH ${ph}) menurunkan K serum ~<strong>${Math.abs(phEffect).toFixed(2)} mEq/L</strong><br>
      → K intrasel sesungguhnya lebih tinggi: estimasi <strong>${kTrue.toFixed(2)} mEq/L</strong>`;
    }
    phHtml=`<div class="formula-note" style="margin-top:8px"><strong>Efek pH pada K serum:</strong><br>
    K serum terukur: ${k} mEq/L (pH ${ph})${phInterp}<br>
    <span style="color:var(--muted)">Macdonald JE. Heart 2004;90:1098 · Aronson PS. Am J Physiol 2011 · Palmer BF. NEJM 2020;382:2152</span></div>`;
  }

  let html='';
  if(k<3.5){
    const bwFactor=(bw&&bw>0)?(bw/70):1;
    const defLow=(3.5-k)*100*bwFactor;
    const defHigh=(3.5-k)*200*bwFactor;
    const defMid=(defLow+defHigh)/2;
    const bwNote=(!bw||bw<=0)?'<span style="color:var(--amber)">⚠ BB belum diisi — estimasi untuk 70 kg</span>':'BB-adjusted (BB '+bw+' kg, \xd7'+bwFactor.toFixed(2)+')';
    const maxDayWard=bw>0?(bw*1).toFixed(0)+'–'+(bw*2).toFixed(0):'—';
    const maxDayICU=bw>0?(bw*3).toFixed(0):'—';
    const maxDayHtml=bw>0?'<div class="info" style="font-size:12px;margin-top:8px;line-height:1.8"><strong>Batas dosis harian KCl (BB '+bw+' kg):</strong><br>Rawat biasa / perifer: max <strong>'+maxDayWard+' mEq/hari</strong> (0.5–1 mEq/kg/hari)<br>ICU sentral + EKG monitor: max <strong>'+maxDayICU+' mEq/hari</strong> (3 mEq/kg/hari)</div>':'';
    const phase1=Math.max(10,Math.round(defMid*0.4/10)*10);
    const recheckTime=k<2.5?'1–2':'2–4';
    const maxRate=access==='perifer'?10:20;
    const maxConc=access==='perifer'?40:80;
    const sev=k<2.5?'Berat (<2.5 mEq/L)':k<3.0?'Sedang (2.5–2.9)':'Ringan (3.0–3.4)';
    const cls=k<2.5?'red':'amber';
    html=`<div class="result-grid">
      <div class="result-card" style="border-color:var(--${cls})"><div class="result-label">K Serum</div><div class="result-value" style="color:var(--${cls})">${k}</div><div class="result-sub">mEq/L — Hipokalemia ${sev}</div></div>
      <div class="result-card"><div class="result-label">Estimasi Defisit K</div><div class="result-value" style="font-size:22px">${defLow.toFixed(0)}–${defHigh.toFixed(0)}</div><div class="result-sub">mEq total · ${bwNote}</div></div>
      <div class="result-card"><div class="result-label">Rate max (${access})</div><div class="result-value">${maxRate}</div><div class="result-sub">mEq/jam KCl</div></div>
      <div class="result-card"><div class="result-label">Konsentrasi max</div><div class="result-value">${maxConc}</div><div class="result-sub">mEq/100 mL</div></div>
    </div>
    ${maxDayHtml}
    <div class="cc ${cls}" style="margin-top:10px"><div class="ct">Hipokalemia ${sev}</div>
    <p>Defisit estimasi <strong>${defLow.toFixed(0)}–${defHigh.toFixed(0)} mEq</strong>${bw>0?' (BB '+bw+' kg, skala BB/70)':''}. Koreksi via ${access==='perifer'?'vena perifer':'vena sentral dengan monitor EKG'}:<br>
    KCl max <strong>${maxRate} mEq/jam</strong>, konsentrasi max <strong>${maxConc} mEq/100 mL</strong>.<br>
    ${k<3.0?'⚠ Monitor EKG kontinyu. Koreksi Mg serum jika hipomagnesemia ikut menyertai (Mg sering menyebabkan hipokalemia refrakter).':'Cek ulang K serum setelah tiap 20–40 mEq KCl intravena.'}</p></div>
    <div style="border:1px solid var(--amber);border-radius:10px;padding:12px;margin-top:8px;background:rgba(255,160,0,0.07)">
      <div style="font-weight:700;color:var(--amber);font-family:'JetBrains Mono',monospace;font-size:12px;margin-bottom:6px">📋 STRATEGI PEMBERIAN BERTAHAP (Clinical Best Practice)</div>
      <div style="font-size:12px;line-height:1.9">
        → <strong>Sesi 1:</strong> Berikan ~${phase1} mEq terlebih dahulu (40% estimasi defisit)<br>
        → <strong>Cek K serum</strong> setelah ${recheckTime} jam<br>
        → <strong>Sesi 2:</strong> Evaluasi ulang — lanjutkan jika K masih &lt;3.5 mEq/L<br>
        <span style="color:var(--amber)">⚠ Jangan berikan seluruh estimasi defisit sekaligus — distribusi K ke intrasel memerlukan 4–6 jam</span>
      </div>
    </div>`;
  html+=`<details style="margin-top:8px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📋 Panduan Praktis Pemberian KCl — Mixing &amp; Timing ▼
    </summary>
    <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.9">
      <strong style="color:var(--accent)">Via Vena Perifer:</strong><br>
      → KCl 10–20 mEq + <strong>NS 0.9%</strong> 100 mL → pompa infus 1–2 jam (max 10 mEq/jam)<br>
      → Max konsentrasi: 40 mEq/100 mL | Wajib pompa infus, bukan tetes bebas<br>
      → Gunakan <strong>NS</strong> — bukan D5W (glukosa → insulin release → K shift intrasel transien → risiko overcorrection)<br>
      → RL mengandung 4 mEq/L K — bukan first choice untuk koreksi K aktif<br><br>
      <strong style="color:var(--accent)">Via Vena Sentral (ICU):</strong><br>
      → KCl 20–40 mEq + NS 100 mL → 1–4 jam, max 20 mEq/jam (wajib EKG monitor)<br>
      → Syringe pump tanpa pengencer: KCl 7.46% = <strong>1 mEq/mL</strong><br>
      &nbsp;&nbsp;Rate: 5–10 mEq/jam standar | max 20 mEq/jam dengan EKG kontinyu<br>
      → <span style="color:var(--red)">TIDAK BOLEH syringe pump tanpa pengencer via perifer</span> — phlebitis berat, risiko aritmia<br><br>
      <strong style="color:var(--accent)">Kapan Cek Ulang K Serum:</strong><br>
      → K &lt;2.5: tiap <strong>1–2 jam</strong> | K 2.5–3.0: tiap <strong>2–4 jam</strong> | K 3.0–3.5: tiap <strong>4–6 jam</strong>
      <div class="formula-note" style="margin-top:8px">📚 Kraft MD. Am J Health-Syst Pharm 2005;62:1663 · ASHP 2020 · Palmer BF. NEJM 2020;382:2152 · Gennari FJ. Am J Med 1998;104:367</div>
    </div>
  </details>`;
  }else if(k>5.0){
    const sev=k>6.5?'Berat (>6.5) — EMERGENSI':k>6.0?'Berat (6.0–6.5)':'Sedang (5.1–6.0)';
    html=`<div class="result-grid">
      <div class="result-card" style="border-color:var(--red)"><div class="result-label">K Serum</div><div class="result-value" style="color:var(--red)">${k}</div><div class="result-sub">mEq/L — Hiperkalemia ${sev}</div></div>
    </div>
    <div class="cc red" style="margin-top:10px"><div class="ct">Hiperkalemia ${sev}</div>
    <p>${k>6.0?'<strong>1. Stabilisasi membran (onset &lt;5 mnt):</strong> Ca glukonat 10% 10 mL IV dalam 10 mnt. Dapat diulang jika EKG tidak membaik.<br>':''}
    <strong>${k>6.0?'2.':'1.'} Geser K ke intrasel:</strong> Insulin Regular 10 IU + Dekstrose 40% 50 mL IV; Salbutamol nebulisasi 10–20 mg; NaHCO₃ jika asidosis metabolik berat.<br>
    <strong>${k>6.0?'3.':'2.'} Eliminasi K:</strong> Furosemid 40 mg IV; Sodium Polystyrene / Patiromer oral/rektal; Hemodialisis jika refrakter atau oliguria berat.</p></div>`;

    // 3-step algorithm jika K > 5.5
    if(k>5.5){
      html+=`
      <div style="border:2px solid var(--red);border-radius:10px;padding:12px;margin-top:12px;background:rgba(255,60,60,0.07)">
        <div style="font-weight:700;color:var(--red);font-family:'JetBrains Mono',monospace;font-size:12px;margin-bottom:6px">🚨 STEP 1 — STABILISASI MEMBRAN (lakukan jika EKG berubah atau K >6.5)</div>
        <div style="font-size:12px;line-height:1.8">
          → <strong>Kalsium Glukonat 10%: 10–20 mL (1–2g) IV dalam 5–10 menit</strong><br>
          → CaCl₂ 10%: 5–10 mL — lebih poten, harus via vena sentral<br>
          → Onset: 1–3 menit | Durasi: 30–60 menit<br>
          → <em>Tidak menurunkan K — hanya proteksi jantung sementara</em>
        </div>
        <div class="formula-note">📚 ACLS AHA 2020</div>
      </div>
      <div style="border:2px solid var(--amber);border-radius:10px;padding:12px;margin-top:8px;background:rgba(255,160,0,0.07)">
        <div style="font-weight:700;color:var(--amber);font-family:'JetBrains Mono',monospace;font-size:12px;margin-bottom:6px">⚡ STEP 2 — SHIFT K KE INTRASEL (onset 15–30 menit)</div>
        <div style="font-size:12px;line-height:1.8">
          → <strong>Insulin Reguler 10 unit IV + Dextrose 50% 50 mL (25g) IV simultan</strong><br>
          &nbsp;&nbsp;(Jika gula >250 mg/dL: insulin saja tanpa dextrose) — turunkan K ~0.5–1.5 mEq/L<br><br>
          → <strong>Salbutamol/Albuterol nebulisasi: 10–20 mg (2.5–5 ampul)</strong><br>
          &nbsp;&nbsp;(Bisa dikombinasi insulin — efek sinergis) — turunkan K ~0.5–1 mEq/L<br><br>
          → <strong>NaHCO₃ 8.4%: 50 mEq IV dalam 5 menit</strong> — hanya jika asidosis metabolik pH &lt;7.2
        </div>
        <div class="formula-note">📚 Kovesdy CP. Kidney Int 2023 · Alfonzo AV. Nephrol Dial Transplant 2006;21:3474</div>
        <div style="margin-top:10px;border-top:1px solid rgba(255,160,0,0.3);padding-top:10px">
          <div style="font-weight:700;color:var(--amber);font-family:'JetBrains Mono',monospace;font-size:11px;margin-bottom:4px">⏱ ALTERNATIF — INFUS KONTINU (ICU / Perioperatif)</div>
          <div style="font-size:12px;line-height:1.9">
            → Indikasi: K 5.5–6.5 tanpa EKG emergency; atau pasca-bolus untuk sustained control<br>
            → <strong>Regular insulin 1.5–2 IU/jam</strong> via syringe pump selama 6 jam<br>
            → Prep syringe pump: Regular insulin 50 IU + NS 48 mL = <strong>1 IU/mL</strong> → set rate 1.5–2 mL/jam<br>
            → Pairing glukosa:<br>
            &nbsp;&nbsp;<strong>Opsi A (NPO/puasa):</strong> D10W 50–100 mL/jam berjalan bersamaan<br>
            &nbsp;&nbsp;<strong>Opsi B (dapat oral/sudah ada infus glukosa):</strong> cek GDS q1–2j, koreksi PRN<br>
            → Stop jika: K &lt;4.5 mEq/L ATAU GDS &lt;100 mg/dL<br>
            → K q2–4j · GDS q1–2j selama infus · Total dosis 6 jam = 9–12 IU
          </div>
          <div class="formula-note" style="margin-top:6px">📚 Dépret F. Ann Intensive Care 2019;9:32 · Kovesdy CP. Rev Endocr Metab Disord 2017;18:41 · Miller's Anesthesia 9th ed (2019) Ch.47</div>
        </div>
      </div>
      <div style="border:2px solid var(--teal,#22d3ee);border-radius:10px;padding:12px;margin-top:8px;background:rgba(34,211,238,0.07)">
        <div style="font-weight:700;color:var(--teal,#22d3ee);font-family:'JetBrains Mono',monospace;font-size:12px;margin-bottom:6px">🔵 STEP 3 — ELIMINASI K DARI TUBUH</div>
        <div style="font-size:12px;line-height:1.8">
          → <strong>Diuretik:</strong> Furosemide 40–80 mg IV (jika fungsi ginjal masih ada)<br><br>
          → <strong>Resin penukar ion:</strong> Sodium Polystyrene Sulfonate 15–60 g oral/rectal (onset 4–6 jam)<br>
          &nbsp;&nbsp;Patiromer 8.4 g oral — lebih selektif, onset 4–7 jam<br><br>
          → <strong>Hemodialisis / CRRT:</strong> Indikasi K >6.5 + EKG changes ATAU refrakter — paling efektif ~1 mEq/L/jam
        </div>
        <div class="formula-note">📚 Kovesdy CP. Kidney Int 2023 · KDIGO AKI 2012</div>
      </div>
      <div style="border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-top:8px;background:var(--card);font-size:12px;line-height:1.8">
        <strong style="font-family:'JetBrains Mono',monospace">MONITORING SELAMA TERAPI:</strong><br>
        → EKG kontinyu selama K >6.0 mEq/L<br>
        → K serum ulang 1–2 jam setelah bolus, atau tiap 2–4 jam selama infus kontinu<br>
        → Insulin bolus: cek glukosa 30 menit setelah (risiko hipoglikemia akut)<br>
        → Insulin infus kontinu: cek glukosa tiap 1–2 jam — stop infus jika GDS &lt;100 mg/dL
      </div>`;
    }
  }else{
    html=`<div class="cc teal" style="margin-top:10px"><div class="ct">K Normal (3.5–5.0 mEq/L)</div><p>Tidak diperlukan koreksi K.</p></div>`;
  }

  html+=phHtml;
  html+=`<div class="formula-note" style="margin-top:6px">Defisit K: ↓0.1 mEq/L ≈ 100–200 mEq defisit/70kg (BB-adjusted: ×BB/70). Efek pH: ±6 mEq/L K per unit pH. &nbsp;|&nbsp; Palmer BF. NEJM 2020;382:2152 · Gennari FJ. Am J Med 1998;104:367 · Kraft MD. Am J Health-Syst Pharm 2005 · Macdonald JE. Heart 2004;90:1098</div>`;
  document.getElementById('k-result-content').innerHTML=html;
  document.getElementById('k-results').classList.remove('hidden');
}

function calcCaCorr(){
  const ca=_asMgDL('ca-val',4.008);   /* mg/dL atau mmol/L → selalu mg/dL */
  const alb=parseFloat(document.getElementById('ca-alb').value);
  const caIon=parseFloat(document.getElementById('ca-ion').value);
  const bw=parseFloat(document.getElementById('ca-bw').value);
  const caPh=parseFloat(document.getElementById('ca-ph').value);
  if(!ca||!alb){alert('Masukkan Ca total dan albumin serum');return;}

  const caCorr=ca+0.8*(4-alb);

  // Estimasi Ca ionized dari Ca total terkoreksi
  // Ca ionized (mmol/L) ≈ caCorr × 0.25 (baseline pH 7.4)
  let caIonEst=caCorr*0.25;
  let phAdjNote='';
  if(!isNaN(caPh)){
    const phDiff=7.4-caPh; // positive = asidosis
    // Asidosis (pH turun) → Ca ionized naik; alkalosis (pH naik) → Ca ionized turun
    // tiap ↑0.1 pH → Ca ionized ↓0.05 mmol/L
    caIonEst=(caCorr*0.25)+(phDiff*0.5);
    const dir=caPh<7.4?'naik':'turun';
    const mag=Math.abs(phDiff*0.5).toFixed(2);
    phAdjNote=`pH ${caPh}: Ca ionized estimasi ${dir} ${mag} mmol/L dari baseline (${caPh<7.4?'asidosis meningkatkan':'alkalosis menurunkan'} Ca ionized)`;
  }

  const ionRef=!isNaN(caIon);
  const ionEstColor=caIonEst<1.12?'var(--red)':caIonEst>1.32?'var(--amber)':'var(--teal)';

  let html=`<div class="result-grid">
    <div class="result-card"><div class="result-label">Ca Total (terukur)</div><div class="result-value">${ca}</div><div class="result-sub">mg/dL</div></div>
    <div class="result-card" style="border-color:${caCorr<8.5?'var(--red)':caCorr>10.5?'var(--amber)':'var(--teal)'}"><div class="result-label">Ca Terkoreksi Albumin ★</div><div class="result-value" style="color:${caCorr<8.5?'var(--red)':caCorr>10.5?'var(--amber)':'var(--teal)'}">${caCorr.toFixed(2)}</div><div class="result-sub">mg/dL · Normal 8.5–10.5</div></div>
    <div class="result-card" style="border-color:${ionEstColor}"><div class="result-label">Ca Ionized (estimasi${!isNaN(caPh)?' + pH korr':''})</div><div class="result-value" style="color:${ionEstColor}">${caIonEst.toFixed(2)}</div><div class="result-sub">mmol/L · Normal 1.12–1.32</div></div>
    ${ionRef?`<div class="result-card" style="border-color:${caIon<1.12?'var(--red)':caIon>1.32?'var(--amber)':'var(--teal)'}"><div class="result-label">Ca Ionized (terukur)</div><div class="result-value" style="color:${caIon<1.12?'var(--red)':caIon>1.32?'var(--amber)':'var(--teal)'}">${caIon}</div><div class="result-sub">mmol/L · Normal 1.12–1.32</div></div>`:''}
  </div>`;

  // Discordance warning
  if(ionRef){
    const diff=Math.abs(caIon-caIonEst);
    if(diff>0.15){
      html+=`<div class="warn" style="font-size:12px;margin-top:8px">
        ⚠ <strong>Diskordansi Ca total terkoreksi vs Ca ionized terukur (Δ ${diff.toFixed(2)} mmol/L).</strong><br>
        Pertimbangkan pengukuran Ca ionized langsung — terutama pada asidosis berat, hipoalbuminemia masif, atau kelainan globulin.
      </div>`;
    }
  }
  if(phAdjNote){
    html+=`<div class="info" style="font-size:12px;margin-top:8px">${phAdjNote}</div>`;
  }

  const useCa=caCorr;
  let cl,cc,ccls,tx;
  if(useCa<7.0){
    cl='Hipokalsemia Berat (<7.0 mg/dL) — Emergensi';cc='var(--red)';ccls='red';
    tx=`Ca glukonat 10% 10–20 mL IV bolus dalam 10 mnt (93–186 mg Ca²⁺). Pasang EKG monitor. Infus maintenans: Ca glukonat 10% 50 mL dalam 500 mL D5W selama 4–6 jam. ${!isNaN(bw)?`Dosis: 0.5 mL/kg = ${(0.5*bw).toFixed(0)} mL.`:''}`;
  }else if(useCa<8.5){
    cl='Hipokalsemia';cc='var(--amber)';ccls='amber';
    tx=`Ca glukonat 10% IV: ${!isNaN(bw)?`${(0.5*bw).toFixed(0)}–${Math.min(bw,20).toFixed(0)} mL (0.5–1 mL/kg, max 20 mL) dalam 15–30 mnt. `:'0.5–1 mL/kg max 20 mL IV. '}Lanjut maintenans oral Ca (kalsium karbonat/sitrat) + Vitamin D jika indikasi.`;
  }else if(useCa<=10.5){
    cl='Ca Normal (8.5–10.5 mg/dL)';cc='var(--teal)';ccls='teal';
    tx='Tidak diperlukan koreksi kalsium.';
  }else if(useCa<=12.0){
    cl='Hiperkalsemia Ringan-Sedang (>10.5–12.0 mg/dL)';cc='var(--amber)';ccls='amber';
    tx='Hidrasi NaCl 0.9% 200–300 mL/jam. Evaluasi penyebab (hiperparatiroid, keganasan, vitamin D). Pertimbangkan bisphosphonate jika terkait keganasan.';
  }else{
    cl='Hiperkalsemia Berat (>12.0 mg/dL) — Emergensi';cc='var(--red)';ccls='red';
    tx='NaCl 0.9% agresif 500 mL/jam, lalu Furosemid 20–40 mg IV setelah euvolemia. Kalsitonin 4–8 IU/kg SC/IM tiap 12 jam. Zoledronic acid 4 mg IV jika terkait keganasan.';
  }

  html+=`<div class="cc ${ccls}" style="margin-top:10px"><div class="ct">${cl}</div><p>${tx}</p></div>`;
  if(useCa<8.5){
    html+=`<details style="margin-top:8px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📋 Panduan Praktis Pemberian Kalsium IV ▼
    </summary>
    <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.9">
      <strong style="color:var(--accent)">Ca Glukonat 10% (1 ampul = 10 mL = 93 mg Ca²⁺ = 4.65 mEq):</strong><br>
      → Emergensi (tetani/seizure): 1–2 ampul (10–20 mL) IV pelan 5–10 mnt + EKG monitor<br>
      → Koreksi sedang: 1 ampul dalam 100 mL NS/D5W → infus 30 mnt–1 jam<br>
      → Maintenans: 5 ampul (50 mL) dalam 500 mL D5W → 4–6 jam (12.5 mL/jam)<br>
      → Via perifer: OK, namun hati-hati ekstravasasi (phlebitis)<br><br>
      <strong style="color:var(--accent)">Ca Klorida 10% (1 ampul = 10 mL = 273 mg Ca²⁺ = 13.6 mEq — 3× lebih poten):</strong><br>
      → <span style="color:var(--red)">HANYA via CVC</span> — nekrosis jaringan berat jika ekstravasasi perifer<br>
      → Indikasi: syok hipovolemik berat, henti jantung, transfusi masif<br><br>
      <strong style="color:var(--accent)">Monitoring &amp; Perhatian:</strong><br>
      → EKG monitor selama bolus (risiko bradikardi, QT pendek, aritmia)<br>
      → Cek Ca ionized ulang <strong>2–4 jam</strong> setelah bolus IV<br>
      → Jangan campur Ca dengan NaHCO₃ atau fosfat dalam satu jalur IV (presipitasi)<br>
      → Pasien digitalis: Ca IV potensasi toksisitas digoksin — lambatkan rate, monitor EKG ketat
      <div class="formula-note" style="margin-top:8px">📚 Cooper MS. BMJ 2003;326:417 · Dickerson RN. Pharmacotherapy 2004;24:1501 · Bushinsky DA. Lancet 1998</div>
    </div>
  </details>`;
  }else if(useCa>10.5){
    html+=`<details style="margin-top:8px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📋 Panduan Praktis Tatalaksana Hiperkalsemia ▼
    </summary>
    <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.9">
      <strong style="color:var(--accent)">Hidrasi agresif (prioritas pertama):</strong><br>
      → NaCl 0.9% 200–500 mL/jam (sesuai toleransi jantung) — pasang kateter urin<br>
      → Target urine output: 100–150 mL/jam<br>
      → Furosemide 20–40 mg IV <strong>hanya setelah euvolemia</strong> — jangan diberikan sebelum volume cukup<br><br>
      <strong style="color:var(--accent)">Terapi tambahan (hiperkalsemia berat atau terkait keganasan):</strong><br>
      → Kalsitonin 4–8 IU/kg SC/IM tiap 12 jam — onset cepat (4–6 jam), efek tachyphylaxis dalam 48 jam<br>
      → Zoledronic acid 4 mg IV dalam 15 mnt — onset 48–72 jam, efek tahan lama<br>
      → Denosumab 120 mg SC — alternatif jika gagal ginjal (tidak tergantung renal clearance)<br><br>
      <strong style="color:var(--accent)">Monitoring:</strong><br>
      → Cek Ca serum tiap 6–12 jam selama terapi aktif<br>
      → Monitor EKG: hiperkalsemia → QT pendek, PR panjang, blok konduksi
      <div class="formula-note" style="margin-top:8px">📚 Hypercalcemia of Malignancy. NEJM 2005;352:373 · Endocrine Society Guidelines 2022</div>
    </div>
  </details>`;
  }
  html+=`<div class="formula-note" style="margin-top:8px">Ca terkoreksi = Ca total + 0.8 × (4 − Albumin) · Estimasi Ca ionized ≈ Ca terkoreksi × 0.25 (±pH adj 0.05 mmol/L per 0.1 unit pH) &nbsp;|&nbsp; Payne RB. BMJ 1973 · Cooper MS. BMJ 2003;326:417 · Dickerson RN. Pharmacotherapy 2004;24:1501 · Bushinsky DA. Lancet 1998</div>`;
  document.getElementById('ca-result-content').innerHTML=html;
  document.getElementById('ca-results').classList.remove('hidden');
}

function calcMgCorr(){
  const mg=_asMgDL('mg-val',2.431);   /* mg/dL atau mmol/L → selalu mg/dL */
  const bw=parseFloat(document.getElementById('mg-bw').value);
  const egfr=parseFloat(document.getElementById('mg-egfr').value);
  const sym=document.getElementById('mg-symptomatic').value;
  if(!mg){alert('Masukkan nilai Mg serum');return;}

  const mgMmol=(mg/12.15).toFixed(2);
  const renalImp=!isNaN(egfr)&&egfr<30;

  let html=`<div class="result-grid">
    <div class="result-card" style="border-color:${mg<1.7?'var(--red)':mg>2.5?'var(--amber)':'var(--teal)'}">
      <div class="result-label">Mg Serum</div>
      <div class="result-value" style="color:${mg<1.7?'var(--red)':mg>2.5?'var(--amber)':'var(--teal)'}">${mg}</div>
      <div class="result-sub">mg/dL (${mgMmol} mmol/L) · Normal 1.7–2.2</div>
    </div>
  </div>`;

  if(mg<1.7){
    let doseG,regime,extra;
    if(sym==='yes'){
      doseG=!isNaN(bw)?Math.min(Math.max(2,0.04*bw),4):2;
      regime=`<strong>${doseG.toFixed(1)}g MgSO₄</strong> dalam 100 mL NaCl 0.9%, habis dalam 15–20 mnt IV (emergensi). Maintenance: 6g MgSO₄ dalam 500 mL selama 6 jam.`;
      extra='Monitor EKG, SpO₂, dan refleks patella selama infus.';
    }else if(mg<1.2){
      doseG=!isNaN(bw)?Math.min(0.06*bw,6):4;
      regime=`<strong>${doseG.toFixed(1)}g MgSO₄</strong> dalam 250 mL NaCl 0.9% selama 4–6 jam IV. Dapat diulang tiap 12 jam sesuai kadar.`;
      extra='Cek Mg ulang setelah 12–24 jam.';
    }else{
      doseG=!isNaN(bw)?Math.min(0.04*bw,4):2;
      regime=`<strong>${doseG.toFixed(1)}g MgSO₄</strong> IV dalam 250 mL NaCl 0.9% selama 4–6 jam, ATAU MgO 500 mg oral 2–4× sehari jika toleransi baik.`;
      extra='Pertimbangkan rute oral jika kondisi stabil.';
    }

    const renalNote=renalImp?`<br><strong>⚠ CrCl/eGFR <30 mL/mnt:</strong> Turunkan dosis 50% → ${(doseG*0.5).toFixed(1)}g. Monitor refleks patella (hilang jika Mg >4 mg/dL → hentikan infus segera).`:'';
    const sev=mg<1.0?'Berat (<1.0)':mg<1.4?'Sedang (1.0–1.4)':'Ringan (1.4–1.7)';
    html+=`<div class="cc ${mg<1.2?'red':'amber'}" style="margin-top:10px"><div class="ct">Hipomagnesemia ${sev} — Mg ${mg} mg/dL (${mgMmol} mmol/L)</div>
    <p>${regime}<br>${extra}${renalNote}<br>
    <strong>Monitoring:</strong> Mg serum tiap 12–24 jam · Refleks patella · SpO₂ · Urine output (pastikan cukup sebelum koreksi).</p></div>`;
    html+=`<div class="info" style="font-size:12px;margin-top:8px"><strong>💡 Koreksi hipokalemia/hipokalsemia refrakter:</strong> Jika K atau Ca tidak naik meski dikoreksi, periksa dan koreksi Mg terlebih dahulu — hipomagnesemia menyebabkan gangguan handling K dan Ca di tubulus.</div>`;
    html+=`<details style="margin-top:8px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📋 Panduan Praktis Pemberian MgSO₄ ▼
    </summary>
    <div style="padding:10px 12px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card);font-size:12px;line-height:1.9">
      <strong style="color:var(--accent)">Sediaan MgSO₄:</strong><br>
      → MgSO₄ 20%: 1 ampul 10 mL = <strong>2 g = 16.2 mEq Mg²⁺</strong><br>
      → MgSO₄ 40%: 1 ampul 25 mL = 10 g = 81 mEq Mg²⁺ (encerkan sebelum pakai)<br>
      → MgSO₄ 1 g = 4 mmol = 8.1 mEq Mg²⁺<br><br>
      <strong style="color:var(--accent)">Cara pengenceran &amp; rate:</strong><br>
      → Emergensi (tetani/torsades/eklampsia):<br>
      &nbsp;&nbsp;2–4 g dalam 100 mL NS → habis 15–20 menit via pompa<br>
      → Koreksi sedang/berat (asimtomatis):<br>
      &nbsp;&nbsp;2–4 g dalam 250 mL NS → 4–6 jam (rate ~40–60 mL/jam)<br>
      → Oral (hipomagnesemia ringan/stabil): MgO 500 mg 2–3× sehari (perhatikan efek diare)<br>
      → <span style="color:var(--red)">TIDAK BOLEH bolus IV tanpa pengencer</span> — risiko cardiac arrest<br><br>
      <strong style="color:var(--accent)">Monitoring wajib selama infus MgSO₄:</strong><br>
      → Refleks patella tiap 1–2 jam: <strong>jika hilang → STOP infus segera</strong> (tanda Mg toksik)<br>
      → SpO₂ dan frekuensi napas tiap 30 menit (Mg >5 mEq/L → depresi napas)<br>
      → Urine output: pastikan ≥25 mL/jam sebelum dan selama koreksi (Mg diekskresi ginjal)<br>
      → Antidot toksisitas Mg: <strong>Ca glukonat 10% 10–20 mL IV pelan (2–3 menit)</strong>
      <div class="formula-note" style="margin-top:8px">📚 Glasdam SM. AACN Adv Crit Care 2012 · de Baaij JH. Physiol Rev 2015;95:791 · Swaminathan R. Clin Biochem Rev 2003;24:47</div>
    </div>
  </details>`;
  }else{
    html+=`<div class="cc ${mg>2.5?'amber':'teal'}" style="margin-top:10px"><div class="ct">${mg>2.5?'Hipermagnesemia':'Mg Normal'} — Mg ${mg} mg/dL</div>
    <p>${mg>2.5?`Hentikan semua sumber Mg eksogen. ${mg>4?'Gejala berat (>4 mg/dL): Ca glukonat 10% 1g IV sebagai antidot (10 mL dalam 3 mnt). Pertimbangkan hemodialisis jika sangat berat atau gagal ginjal.':'Monitor gejala (nausea, kelemahan, penurunan refleks).'}`:
    'Mg dalam rentang normal. Tidak diperlukan koreksi.'}</p></div>`;
  }

  html+=`<div class="formula-note" style="margin-top:8px">MgSO₄ 1g = 4 mmol Mg²⁺. Mg 1 mg/dL ≈ 0.41 mmol/L (atau ÷ 2.43). &nbsp;|&nbsp; Glasdam SM. AACN Adv Crit Care 2012 · de Baaij JH. Physiol Rev 2015;95:791 · Swaminathan R. Clin Biochem Rev 2003;24:47</div>`;
  document.getElementById('mg-result-content').innerHTML=html;
  document.getElementById('mg-results').classList.remove('hidden');
}
