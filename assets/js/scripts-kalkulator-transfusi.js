/* ============================================================
   scripts-kalkulator-transfusi.js
   Halaman: kalkulator-transfusi.html
   Fungsi: switchTrxPanel, calcPRC, calcWB, calcFFP, calcTC, calcCryo,
           toggleKalcUnit (unit toggle fibrinogen mg/dL ↔ g/L)
   ============================================================ */

/* ──────────────────────────────────────────────────────────────
   THEORY DROPDOWN
   ────────────────────────────────────────────────────────────── */
function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

/* ──────────────────────────────────────────────────────────────
   UNIT TOGGLE — Fibrinogen (mg/dL ↔ g/L)
   ────────────────────────────────────────────────────────────── */
var _kalcUT = {
  'cryo-fib': { u:['mg/dL','g/L'], f:[1/100,100], d:[0,2], p:['cth: 80','cth: 0.80'] }
};
function toggleKalcUnit(id){
  var c=_kalcUT[id]; if(!c)return;
  var k='kalc-unit-'+id, cur=localStorage.getItem(k)||c.u[0], isBase=cur===c.u[0];
  var next=isBase?c.u[1]:c.u[0];
  var inp=document.getElementById(id);
  if(inp&&inp.value!==''){var v=parseFloat(inp.value);if(!isNaN(v))inp.value=(v*c.f[isBase?0:1]).toFixed(c.d[isBase?1:0]);}
  if(inp)inp.placeholder=isBase?c.p[1]:c.p[0];
  localStorage.setItem(k,next);
  var btn=document.querySelector('[data-unit="'+id+'"]');
  if(btn)btn.textContent=next;
}
function _asMgDL_t(id,factor){
  var v=parseFloat(document.getElementById(id).value);
  return (localStorage.getItem('kalc-unit-'+id)||'mg/dL')!=='mg/dL'?v*factor:v;
}
document.addEventListener('DOMContentLoaded',function(){
  ['cryo-fib'].forEach(function(id){
    var stored=localStorage.getItem('kalc-unit-'+id);
    if(stored){
      var btn=document.querySelector('[data-unit="'+id+'"]');
      if(btn)btn.textContent=stored;
      var inp=document.getElementById(id),c=_kalcUT[id];
      if(inp&&c)inp.placeholder=stored===c.u[0]?c.p[0]:c.p[1];
    }
  });
});

function switchTrxPanel(panel,btn){
  ['prc','wb','ffp','tc','cryo'].forEach(p=>{
    const el=document.getElementById('trx-panel-'+p);
    if(el)el.classList.toggle('hidden',p!==panel);
  });
  document.querySelectorAll('#trx-tab-prc,#trx-tab-wb,#trx-tab-ffp,#trx-tab-tc,#trx-tab-cryo').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
}

function calcPRC(){
  const hb=parseFloat(document.getElementById('prc-hb').value);
  const hbt=parseFloat(document.getElementById('prc-hbt').value);
  const bb=parseFloat(document.getElementById('prc-bb').value);
  const sex=document.getElementById('prc-sex').value;
  if(!hb||!hbt||!bb){alert('Masukkan Hb aktual, target Hb, dan berat badan');return;}
  if(hbt<=hb){alert('Target Hb harus lebih tinggi dari Hb aktual');return;}

  const dHb=hbt-hb;
  const volPRC=dHb*bb*4;
  const kolf=Math.ceil(volPRC/250);
  const ebv=bb*(sex==='m'?70:65);
  const dHbPerKolf=(250/(bb*4)).toFixed(2);

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:var(--red)"><div class="result-label">Volume PRC</div><div class="result-value" style="color:var(--red)">${Math.round(volPRC)}</div><div class="result-sub">mL total</div></div>`;
  html+=`<div class="result-card" style="border-color:var(--red)"><div class="result-label">Jumlah Kolf PRC</div><div class="result-value" style="color:var(--red)">${kolf}</div><div class="result-sub">kolf (1 kolf ≈ 250 mL)</div></div>`;
  html+=`<div class="result-card"><div class="result-label">ΔHb per 1 Kolf</div><div class="result-value">+${dHbPerKolf}</div><div class="result-sub">g/dL estimasi</div></div>`;
  html+=`<div class="result-card"><div class="result-label">EBV</div><div class="result-value">${(ebv/1000).toFixed(2)}</div><div class="result-sub">L (${sex==='m'?70:65} mL/kg)</div></div>`;
  html+=`<div class="result-card"><div class="result-label">Kecepatan Infus</div><div class="result-value" style="font-size:14px">${Math.round(volPRC/2)}<span style="font-size:11px"> mL/jam</span></div><div class="result-sub">standar (2 jam/kolf) · risiko tinggi: ${Math.round(volPRC/3)} mL/jam (3 jam)</div></div>`;
  html+='</div>';

  html+=`<div class="cc red" style="margin-top:10px"><div class="ct">Kebutuhan PRC: ${kolf} kolf (${Math.round(volPRC)} mL)</div>
  <p>ΔHb target: ${hb} → ${hbt} g/dL (+${dHb.toFixed(1)} g/dL) · Formula: ${dHb.toFixed(1)} × ${bb} × 4 = ${Math.round(volPRC)} mL<br>
  Estimasi: tiap 1 kolf PRC 250 mL ↑ Hb ±${dHbPerKolf} g/dL pada pasien ${bb} kg.<br>
  Cek Hb ulang 15–30 mnt pasca transfusi. Berikan per kolf, evaluasi respons sebelum lanjut.</p></div>`;

  const mabl=ebv*(hb-7)/hb;
  if(hb>7){
    html+=`<div class="formula-note" style="margin-top:8px"><strong>MABL (Trigger 7 g/dL):</strong> EBV ${(ebv/1000).toFixed(2)} L × (Hb ${hb} − 7) / Hb ${hb} = <strong>${Math.max(0,mabl).toFixed(0)} mL allowable blood loss</strong> sebelum transfusi diperlukan.</div>`;
  }

  const premed=document.getElementById('prc-premed')?document.getElementById('prc-premed').value:'none';
  if(premed==='furosemide'){
    html+=`<div class="warn" style="margin-top:8px;font-size:12px"><strong>Premedikasi (Risiko TACO):</strong> Berikan Furosemide 10–20 mg IV pre-transfusi atau di antara kolf. Jangan mencampur dengan darah.</div>`;
  }else if(premed==='diph_dexa'){
    html+=`<div class="warn" style="margin-top:8px;font-size:12px"><strong>Premedikasi (Riwayat Alergi):</strong> Berikan Diphenhydramine 25–50 mg IV/PO + Dexamethasone 4–10 mg IV.</div>`;
  }else if(premed==='dexa'){
    html+=`<div class="warn" style="margin-top:8px;font-size:12px"><strong>Premedikasi:</strong> Dexamethasone 4–10 mg IV untuk supresi imunologis (riwayat reaksi ringan).</div>`;
  }

  html+=`<div class="formula-note" style="margin-top:6px">Volume PRC = ΔHb × BB × 4 (k=4). 1 kolf PRC ≈ 250 mL, Hct 55–80%. &nbsp;|&nbsp; Stainsby D. Br J Haematol 2006;135:301 · AABB Technical Manual 20th ed.</div>`;

  if(kolf>=4){
    html+=`<div class="warn" style="margin-top:10px;font-size:12px">
      <strong>⚠ Pertimbangkan Suplementasi Ca-Glukonat (Transfusi ≥4 Kolf)</strong><br>
      Sitrat dalam produk darah mengikat Ca²⁺ ionisasi → hipokalsemia → disfungsi miokard + koagulopati.<br>
      <strong>Dosis:</strong> Ca-Glukonas 10% 1 g IV (10 mL) per 4 kolf &nbsp;|&nbsp;
      <strong>Target iCa²⁺:</strong> ≥ 1,1 mmol/L &nbsp;|&nbsp;
      <strong>Cek iCa:</strong> tiap 30–60 mnt<br>
      <strong>Cara pemberian:</strong> encerkan dalam 10 mL NaCl 0,9% → berikan IV PELAN 3–5 menit via jalur TERPISAH dari darah.<br>
      <em style="font-size:11px">Rossaint R. Eur J Anaesthesiol 2023;40:343 · Inaba K. J Trauma Acute Care Surg 2013;75:416</em>
    </div>`;
  }

  document.getElementById('prc-result-content').innerHTML=html;
  document.getElementById('prc-results').classList.remove('hidden');
}

function calcWB(){
  const hb=parseFloat(document.getElementById('wb-hb').value);
  const hbt=parseFloat(document.getElementById('wb-hbt').value);
  const bb=parseFloat(document.getElementById('wb-bb').value);
  if(!hb||!hbt||!bb){alert('Masukkan Hb aktual, target Hb, dan berat badan');return;}
  if(hbt<=hb){alert('Target Hb harus lebih tinggi dari Hb aktual');return;}

  const dHb=hbt-hb;
  const volWB=dHb*bb*6;
  const kolf=Math.ceil(volWB/450);
  const dHbPerKolf=(450/(bb*6)).toFixed(2);

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:var(--teal)"><div class="result-label">Volume WB</div><div class="result-value" style="color:var(--teal)">${Math.round(volWB)}</div><div class="result-sub">mL total</div></div>`;
  html+=`<div class="result-card" style="border-color:var(--teal)"><div class="result-label">Jumlah Kolf WB</div><div class="result-value" style="color:var(--teal)">${kolf}</div><div class="result-sub">kolf (1 kolf ≈ 450 mL)</div></div>`;
  html+=`<div class="result-card"><div class="result-label">ΔHb per 1 Kolf</div><div class="result-value">+${dHbPerKolf}</div><div class="result-sub">g/dL estimasi</div></div>`;
  html+='</div>';

  html+=`<div class="cc teal" style="margin-top:10px"><div class="ct">Kebutuhan Whole Blood: ${kolf} kolf (${Math.round(volWB)} mL)</div>
  <p>ΔHb target: ${hb} → ${hbt} g/dL (+${dHb.toFixed(1)} g/dL) · Formula: ${dHb.toFixed(1)} × ${bb} × 6 = ${Math.round(volWB)} mL<br>
  1 kolf WB 450 mL ↑ Hb ±${dHbPerKolf} g/dL pada pasien ${bb} kg (lebih rendah dari PRC karena Hct lebih rendah).<br>
  <strong>Catatan:</strong> WB jarang tersedia di BDRS Indonesia — biasanya segera diproses menjadi komponen (PRC + FFP + TC).</p></div>`;
  html+=`<div class="formula-note" style="margin-top:8px">Volume WB = ΔHb × BB × 6 (k=6, Hct WB ≈ 38–45%). 1 kolf WB ≈ 450 mL. &nbsp;|&nbsp; AABB Technical Manual 20th ed. 2020</div>`;

  if(kolf>=4){
    html+=`<div class="warn" style="margin-top:10px;font-size:12px">
      <strong>⚠ Pertimbangkan Suplementasi Ca-Glukonat (Transfusi ≥4 Kolf)</strong><br>
      Sitrat dalam produk darah mengikat Ca²⁺ ionisasi → hipokalsemia → disfungsi miokard + koagulopati.<br>
      <strong>Dosis:</strong> Ca-Glukonas 10% 1 g IV (10 mL) per 4 kolf &nbsp;|&nbsp;
      <strong>Target iCa²⁺:</strong> ≥ 1,1 mmol/L &nbsp;|&nbsp;
      <strong>Cek iCa:</strong> tiap 30–60 mnt<br>
      <strong>Cara pemberian:</strong> encerkan dalam 10 mL NaCl 0,9% → berikan IV PELAN 3–5 menit via jalur TERPISAH dari darah.<br>
      <em style="font-size:11px">Rossaint R. Eur J Anaesthesiol 2023;40:343 · Inaba K. J Trauma Acute Care Surg 2013;75:416</em>
    </div>`;
  }

  document.getElementById('wb-result-content').innerHTML=html;
  document.getElementById('wb-results').classList.remove('hidden');
}

function calcFFP(){
  const bb=parseFloat(document.getElementById('ffp-bb').value);
  const dose=parseInt(document.getElementById('ffp-indikasi').value);
  const inr=parseFloat(document.getElementById('ffp-inr').value)||null;
  if(!bb){alert('Masukkan berat badan');return;}

  const volFFP=dose*bb;
  const kolf=Math.ceil(volFFP/250);
  const rate=Math.round(volFFP/2);

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:var(--amber)"><div class="result-label">Volume FFP</div><div class="result-value" style="color:var(--amber)">${Math.round(volFFP)}</div><div class="result-sub">mL total (${dose} mL/kg)</div></div>`;
  html+=`<div class="result-card" style="border-color:var(--amber)"><div class="result-label">Jumlah Kolf FFP</div><div class="result-value" style="color:var(--amber)">${kolf}</div><div class="result-sub">kolf (1 kolf ≈ 250 mL)</div></div>`;
  html+=`<div class="result-card"><div class="result-label">Rate (2 jam)</div><div class="result-value">${rate}</div><div class="result-sub">mL/jam (200–400 range)</div></div>`;
  html+='</div>';

  let inrNote='';
  if(inr){
    if(inr<1.5)inrNote=`<div class="info" style="margin-top:8px;font-size:12px">INR ${inr} — di bawah threshold standar (&lt;1.5). FFP mungkin tidak diperlukan jika tidak ada perdarahan aktif. Evaluasi ulang indikasi.</div>`;
    else if(inr<2)inrNote=`<div class="formula-note" style="margin-top:8px">INR ${inr} — koagulopati ringan. FFP dapat membantu jika ada perdarahan aktif atau prosedur invasif segera.</div>`;
    else inrNote=`<div class="formula-note" style="margin-top:8px">INR ${inr} — koagulopati signifikan. FFP diindikasikan.</div>`;
  }

  html+=`<div class="cc amber" style="margin-top:10px"><div class="ct">Kebutuhan FFP: ${kolf} kolf (${Math.round(volFFP)} mL)</div>
  <p>Dosis ${dose} mL/kg × ${bb} kg = ${Math.round(volFFP)} mL = ${kolf} kolf FFP.<br>
  Rate: ${rate} mL/jam (habis dalam 2 jam). Gunakan dalam 4 jam setelah thaw.<br>
  Pastikan ABO compatible. Pasang filter 170–260 μm. Monitor tanda overload (TACO).</p></div>`;
  html+=inrNote;
  html+=`<div class="formula-note" style="margin-top:8px">Dosis FFP 10–30 mL/kg bergantung indikasi. 1 kolf FFP ≈ 250 mL, semua faktor koagulasi aktif. &nbsp;|&nbsp; Roback JD. Transfusion 2010;50:1227 · SHOT Annual Report 2023</div>`;

  document.getElementById('ffp-result-content').innerHTML=html;
  document.getElementById('ffp-results').classList.remove('hidden');
}

function calcTC(){
  const plt=parseFloat(document.getElementById('tc-plt').value);
  const pltt=parseFloat(document.getElementById('tc-pltt').value);
  const bb=parseFloat(document.getElementById('tc-bb').value);
  const tipe=document.getElementById('tc-tipe').value;
  if(!plt||!pltt||!bb){alert('Masukkan Plt aktual, target, dan berat badan');return;}

  const dPlt=Math.max(0,pltt-plt);
  let html='<div class="result-grid">';

  if(tipe==='rd'){
    const unitStd=Math.ceil(bb/10);
    const unitTarget=Math.ceil(dPlt/7.5*(bb/70));
    const unitRec=Math.max(unitStd,Math.min(unitTarget,10));
    const volTotal=unitRec*60;
    const expIncrement=(unitRec*7500*(70/bb)).toFixed(0);

    html+=`<div class="result-card" style="border-color:var(--orange)"><div class="result-label">Unit TC Random Donor</div><div class="result-value" style="color:var(--orange)">${unitRec}</div><div class="result-sub">unit (≈${unitRec*60} mL total)</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Estimasi ΔPlt</div><div class="result-value">+${Math.min(parseInt(expIncrement),dPlt)}</div><div class="result-sub">×10³/μL setelah transfusi</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Volume Total</div><div class="result-value">${volTotal}</div><div class="result-sub">mL (60 mL/unit)</div></div>`;
    html+='</div>';
    html+=`<div class="cc amber" style="margin-top:10px"><div class="ct">TC Random Donor: ${unitRec} unit (${volTotal} mL)</div>
    <p>ΔPlt target: ${plt} → ${pltt} × 10³/μL. Dosis: ${unitRec} unit RD (≈${unitRec*60} mL).<br>
    Estimasi increment: +${Math.min(parseInt(expIncrement),dPlt)} × 10³/μL (1 unit ≈ +5.000–10.000/μL untuk 70 kg).<br>
    Cek platelet 1 jam post-transfusi. CCI target &gt;7.500. Jika CCI rendah → curiga refraktori (HLA/HPA antibodi).</p></div>`;
  }else{
    const expInc=Math.round(45*(70/bb));
    html+=`<div class="result-card" style="border-color:var(--orange)"><div class="result-label">TC Apheresis (SDA)</div><div class="result-value" style="color:var(--orange)">1</div><div class="result-sub">kantong (≈250 mL)</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Estimasi ΔPlt</div><div class="result-value">+${Math.min(expInc,dPlt)}</div><div class="result-sub">×10³/μL setelah transfusi</div></div>`;
    html+=`<div class="result-card"><div class="result-label">Setara RD</div><div class="result-value">4–6</div><div class="result-sub">unit random donor</div></div>`;
    html+='</div>';
    html+=`<div class="cc amber" style="margin-top:10px"><div class="ct">TC Apheresis: 1 kantong (250 mL)</div>
    <p>1 kantong apheresis = setara 4–6 unit random donor. Estimasi ↑Plt: +${Math.min(expInc,dPlt)} × 10³/μL.<br>
    Keuntungan SDA: donor tunggal (↓ alloimmunisasi, ↓ transmisi infeksi), HLA-matched tersedia jika refraktori.<br>
    Jika target &gt;+50.000 tidak tercapai: pertimbangkan 2 kantong atau HLA-matched SDA.</p></div>`;
  }

  html+=`<div class="formula-note" style="margin-top:8px">CCI = (Post−Pre Plt × BSA) / unit. Target CCI &gt;7.500 pada 1 jam · &gt;4.500 pada 24 jam. &nbsp;|&nbsp; Slichter SJ. Hematology ASH 2007 · British Committee 2003</div>`;

  document.getElementById('tc-result-content').innerHTML=html;
  document.getElementById('tc-results').classList.remove('hidden');
}

function calcCryo(){
  const fib=_asMgDL_t('cryo-fib',100);  /* mg/dL atau g/L → selalu mg/dL */
  const fibTarget=parseInt(document.getElementById('cryo-target').value);
  const bb=parseFloat(document.getElementById('cryo-bb').value);
  if(!fib||!bb){alert('Masukkan fibrinogen aktual dan berat badan');return;}

  const plasmaVol=bb*40;
  const fibDeficit=Math.max(0,(fibTarget-fib)*plasmaVol/100);
  const fibPerKolf=200;
  const kolfFormula=Math.ceil(fibDeficit/fibPerKolf);
  const kolfRuleOfThumb=Math.ceil(bb/10);
  const kolfRec=Math.max(kolfFormula,kolfRuleOfThumb);
  const volTotal=kolfRec*17;

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:var(--blue)"><div class="result-label">Defisit Fibrinogen</div><div class="result-value" style="color:var(--blue)">${Math.round(fibDeficit)}</div><div class="result-sub">mg</div></div>`;
  html+=`<div class="result-card" style="border-color:var(--blue)"><div class="result-label">Jumlah Kolf Cryo</div><div class="result-value" style="color:var(--blue)">${kolfRec}</div><div class="result-sub">kolf (≈${volTotal} mL total)</div></div>`;
  html+=`<div class="result-card"><div class="result-label">Formula (defisit)</div><div class="result-value">${kolfFormula}</div><div class="result-sub">kolf (via kalkulasi)</div></div>`;
  html+=`<div class="result-card"><div class="result-label">Rule of Thumb</div><div class="result-value">${kolfRuleOfThumb}</div><div class="result-sub">kolf (1/10 kg BB)</div></div>`;
  html+='</div>';

  const fibExpected=Math.min(fib+(kolfRec*fibPerKolf*100/plasmaVol),fibTarget+30);
  html+=`<div class="cc blue" style="margin-top:10px"><div class="ct">Cryoprecipitate: ${kolfRec} kolf (${volTotal} mL)</div>
  <p>Fibrinogen aktual: ${fib} mg/dL → Target: ${fibTarget} mg/dL. Defisit: ${Math.round(fibDeficit)} mg.<br>
  Volume plasma: ${bb} kg × 40 mL/kg = ${plasmaVol} mL. Fibrinogen per kolf: ≈200 mg.<br>
  Estimasi fibrinogen post-transfusi: ≈${fibExpected.toFixed(0)} mg/dL.<br>
  Cek fibrinogen ulang 30–60 mnt pasca transfusi. Gunakan dalam 6 jam setelah thaw.</p></div>`;

  if(fib<100)html+=`<div class="warn" style="margin-top:8px;margin-bottom:0"><strong>⚠ Hipofibrinogenemia Berat (&lt;100 mg/dL)</strong>Risiko perdarahan sangat tinggi. Pertimbangkan cryoprecipitate + FFP bersamaan jika ada koagulopati multipel. Pada DIC: atasi penyebab primer.</div>`;
  html+=`<div class="formula-note" style="margin-top:8px">Defisit Fib = (Target−Aktual) × PV / 100. PV = BB × 40 mL/kg. 1 kolf Cryo ≈ 15–20 mL, fibrinogen 150–250 mg. &nbsp;|&nbsp; Spahn DR. Crit Care 2019;23:98 · WOMAN Trial. Lancet 2017;389:2105</div>`;

  document.getElementById('cryo-result-content').innerHTML=html;
  document.getElementById('cryo-results').classList.remove('hidden');
}
