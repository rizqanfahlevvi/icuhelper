/* ============================================================
   scripts-kalkulator-renal.js
   Halaman: kalkulator-renal.html
   Fungsi: toggleTheory, convertUreum, calcEGFR, calcAKI,
           calcFENa, calcOsmolality, buncrConvUreum, calcBUNCr,
           toggleKalcUnit (unit toggle — konsisten dengan ABG)
   ============================================================ */

/* ──────────────────────────────────────────────────────────────
   UNIT TOGGLE — Glukosa (mg/dL ↔ mmol/L)
                 Kreatinin serum/urin (mg/dL ↔ µmol/L)
   Konversi nilai in-place; calc functions selalu baca mg/dL.
   ────────────────────────────────────────────────────────────── */
var _kalcUR = {
  'osm-glu':      { u:['mg/dL','mmol/L'], f:[1/18,18],       d:[0,2], p:['cth: 180','cth: 10.0']  },
  'egfr-scr':     { u:['mg/dL','µmol/L'], f:[88.42,1/88.42], d:[2,0], p:['cth: 1.2','cth: 106']   },
  'aki-scr-base': { u:['mg/dL','µmol/L'], f:[88.42,1/88.42], d:[2,0], p:['cth: 0.9','cth: 80']    },
  'aki-scr-now':  { u:['mg/dL','µmol/L'], f:[88.42,1/88.42], d:[2,0], p:['cth: 2.1','cth: 186']   },
  'fena-scr':     { u:['mg/dL','µmol/L'], f:[88.42,1/88.42], d:[2,0], p:['cth: 2.1','cth: 186']   },
  'fena-ucr':     { u:['mg/dL','µmol/L'], f:[88.42,1/88.42], d:[0,0], p:['cth: 120','cth: 10614'] },
  'buncr-cr':     { u:['mg/dL','µmol/L'], f:[88.42,1/88.42], d:[2,0], p:['cth: 1.8','cth: 159']   }
};
function toggleKalcUnit(id){
  var c=_kalcUR[id]; if(!c)return;
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
  Object.keys(_kalcUR).forEach(function(id){
    var stored=localStorage.getItem('kalc-unit-'+id);
    if(stored){
      var btn=document.querySelector('[data-unit="'+id+'"]');
      if(btn)btn.textContent=stored;
      var inp=document.getElementById(id),c=_kalcUR[id];
      if(inp&&c)inp.placeholder=stored===c.u[0]?c.p[0]:c.p[1];
    }
  });
});

function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

function convertUreum(from){
  let mgdl,mmol,bun;
  if(from==='mgdl'){
    mgdl=parseFloat(document.getElementById('uBUN-ureum-mgdl').value);
    if(isNaN(mgdl)||mgdl<0){
      document.getElementById('uBUN-ureum-mmol').value='';
      document.getElementById('uBUN-bun').value='';
      document.getElementById('ureum-conv-note').classList.add('hidden');return;
    }
    mmol=mgdl/6.006;bun=mgdl*0.4667;
    document.getElementById('uBUN-ureum-mmol').value=mmol.toFixed(2);
    document.getElementById('uBUN-bun').value=bun.toFixed(1);
  }else{
    mmol=parseFloat(document.getElementById('uBUN-ureum-mmol').value);
    if(isNaN(mmol)||mmol<0){
      document.getElementById('uBUN-ureum-mgdl').value='';
      document.getElementById('uBUN-bun').value='';
      document.getElementById('ureum-conv-note').classList.add('hidden');return;
    }
    mgdl=mmol*6.006;bun=mmol*2.8;
    document.getElementById('uBUN-ureum-mgdl').value=mgdl.toFixed(1);
    document.getElementById('uBUN-bun').value=bun.toFixed(1);
  }
  const curbOk=mgdl>42;const psiOk=mgdl>64;
  const note=document.getElementById('ureum-conv-note');
  note.innerHTML=`Ureum <strong>${mgdl.toFixed(1)} mg/dL</strong> = <strong>${mmol.toFixed(2)} mmol/L</strong> = BUN <strong>${bun.toFixed(1)} mg/dL</strong> &nbsp;|&nbsp; `+
    `CURB-65 U-criterion (&gt;7 mmol/L): ${curbOk?'<span style="color:var(--red);font-weight:600">✔ Skor 1</span>':'<span style="color:var(--green)">✘ Skor 0</span>'} &nbsp;|&nbsp; `+
    `PSI BUN &gt;30 (&gt;64 mg/dL): ${psiOk?'<span style="color:var(--red);font-weight:600">✔ +20 poin</span>':'<span style="color:var(--green)">✘ 0 poin</span>'}`;
  note.classList.remove('hidden');
}

function calcEGFR(){
  const sex=document.getElementById('egfr-sex').value;
  const age=parseFloat(document.getElementById('egfr-age').value);
  const bw=parseFloat(document.getElementById('egfr-bw').value);
  const scr=_asMgDL('egfr-scr',1/88.42);  /* mg/dL atau µmol/L → selalu mg/dL */
  const cysc=parseFloat(document.getElementById('egfr-cysc').value);
  const ureum=parseFloat(document.getElementById('egfr-ureum').value);
  if(!age||!scr){alert('Masukkan usia dan kreatinin serum');return;}
  const female=sex==='f';

  const kappa=female?0.7:0.9,alpha=female?-0.241:-0.302,sexF=female?1.012:1.0;
  const r=scr/kappa;
  const ckdEPI=142*Math.pow(Math.min(r,1),alpha)*Math.pow(Math.max(r,1),-1.200)*Math.pow(0.9938,age)*sexF;

  let cg=null;
  if(bw&&!isNaN(bw))cg=((140-age)*bw)/(72*scr)*(female?0.85:1.0);

  const mdrd=175*Math.pow(scr,-1.154)*Math.pow(age,-0.203)*(female?0.742:1.0);

  let ckdCys=null;
  if(cysc&&!isNaN(cysc)){
    const kc=female?0.7:0.9,ac=female?-0.219:-0.144,sf=female?0.963:1.0;
    const cr2=scr/kc,cy2=cysc/0.8;
    ckdCys=135*Math.pow(Math.min(cr2,1),ac)*Math.pow(Math.max(cr2,1),-0.544)*Math.pow(Math.min(cy2,1),-0.323)*Math.pow(Math.max(cy2,1),-0.778)*Math.pow(0.9961,age)*sf;
  }

  function stage(v){
    if(v>=90)return{s:'G1',l:'≥90 — Normal atau tinggi',c:'var(--green)',css:'teal'};
    if(v>=60)return{s:'G2',l:'60–89 — Sedikit menurun',c:'var(--teal)',css:'teal'};
    if(v>=45)return{s:'G3a',l:'45–59 — Penurunan ringan-sedang',c:'var(--amber)',css:'amber'};
    if(v>=30)return{s:'G3b',l:'30–44 — Penurunan sedang-berat',c:'var(--amber)',css:'amber'};
    if(v>=15)return{s:'G4',l:'15–29 — Penurunan berat',c:'var(--red)',css:'red'};
    return{s:'G5',l:'<15 — Gagal Ginjal',c:'var(--red)',css:'red'};
  }
  const st=stage(ckdEPI);

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:${st.c}"><div class="result-label">CKD-EPI 2021 ★</div><div class="result-value" style="color:${st.c}">${ckdEPI.toFixed(1)}</div><div class="result-sub">mL/mnt/1.73m² · Stadium ${st.s}</div></div>`;
  if(cg!==null)html+=`<div class="result-card"><div class="result-label">Cockcroft-Gault (CrCl)</div><div class="result-value">${cg.toFixed(1)}</div><div class="result-sub">mL/mnt · Untuk dosis obat</div></div>`;
  html+=`<div class="result-card"><div class="result-label">MDRD-4 (legacy)</div><div class="result-value">${mdrd.toFixed(1)}</div><div class="result-sub">mL/mnt/1.73m²</div></div>`;
  if(ckdCys!==null)html+=`<div class="result-card" style="border-color:var(--purple)"><div class="result-label">CKD-EPI Cys-C 2021</div><div class="result-value" style="color:var(--purple)">${ckdCys.toFixed(1)}</div><div class="result-sub">mL/mnt/1.73m² · Lebih akurat</div></div>`;
  html+='</div>';

  html+=`<div class="cc ${st.css}" style="margin-top:10px"><div class="ct">Stadium CKD — ${st.s}</div><p>${st.l} mL/mnt/1.73m²</p></div>`;

  if(ureum&&!isNaN(ureum)){
    const bun=(ureum*0.4667).toFixed(1);
    const umm=(ureum/6.006).toFixed(2);
    const ratio=(parseFloat(bun)/scr).toFixed(1);
    let ri,rc;
    if(parseFloat(ratio)>20){ri='Sugestif pre-renal atau perdarahan GI atas';rc='var(--amber)';}
    else if(parseFloat(ratio)<10){ri='Sugestif penyakit ginjal intrinsik';rc='var(--blue)';}
    else{ri='Normal';rc='var(--teal)';}
    html+=`<div class="formula-note" style="margin-top:10px"><strong>Ureum/BUN:</strong> ${ureum} mg/dL = ${umm} mmol/L = BUN ${bun} mg/dL<br><strong>Rasio BUN/SCr:</strong> ${ratio} — <span style="color:${rc}">${ri}</span><br><span style="color:var(--muted)">Ureum/SCr ratio: ${(ureum/scr).toFixed(1)} (setara nilai klinis di RS yang melaporkan Ureum)</span></div>`;
  }

  html+=`<div class="formula-note" style="margin-top:8px">★ CKD-EPI 2021 race-free adalah formula primer per KDIGO 2024. CG untuk penyesuaian dosis. &nbsp;|&nbsp; Inker LA et al. NEJM 2021;385:1737 · Kidney Int Suppl 2024</div>`;
  document.getElementById('egfr-result-content').innerHTML=html;
  document.getElementById('egfr-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('egfr',
      'eGFR '+ckdEPI.toFixed(1)+' mL/mnt · '+st.s,
      {sex:sex,age:String(age),bw:String(bw||''),scr:String(scr)},
      'CKD-EPI '+ckdEPI.toFixed(1)+(cg!==null?' · CG '+cg.toFixed(1):'')+' · MDRD '+mdrd.toFixed(1)+' — '+st.l);
  }
}

function calcAKI(){
  const scrBase=_asMgDL('aki-scr-base',1/88.42);  /* mg/dL atau µmol/L → selalu mg/dL */
  const scrNow =_asMgDL('aki-scr-now', 1/88.42);
  const bw=parseFloat(document.getElementById('aki-bw').value);
  const uoVol=parseFloat(document.getElementById('aki-uo-vol').value);
  const uoHr=parseFloat(document.getElementById('aki-uo-hr').value);
  let html='';
  let histParts=[];

  if(!isNaN(scrBase)&&!isNaN(scrNow)){
    const rise=scrNow-scrBase,ratio=scrNow/scrBase;
    let stage,slabel,scolor,scls;
    if(scrNow>=4.0||ratio>=3.0){stage=3;slabel='Stage 3 — Berat';scolor='var(--red)';scls='severe';}
    else if(ratio>=2.0){stage=2;slabel='Stage 2 — Sedang';scolor='var(--amber)';scls='mild';}
    else if(rise>=0.3||ratio>=1.5){stage=1;slabel='Stage 1 — Ringan';scolor='var(--orange)';scls='mild';}
    else{stage=0;slabel='Tidak memenuhi kriteria AKI';scolor='var(--teal)';scls='normal';}
    histParts.push('SCr: '+slabel);
    html+=`<div class="abg-result abg-${scls}">
      <div class="abg-label" style="color:${scolor}">Berdasarkan SCr${stage>0?' — AKI KDIGO Stage '+stage:''}</div>
      <div class="abg-interp">${slabel}</div>
      <div class="abg-detail">
        Kenaikan absolut: ${rise>=0?'+':''}${rise.toFixed(2)} mg/dL ${rise>=0.3?'<strong>✔ ≥0.3 mg/L dalam 48 jam</strong>':''}<br>
        Rasio SCr: ×${ratio.toFixed(2)} (baseline ${scrBase} → sekarang ${scrNow} mg/dL)
      </div>
    </div>`;
  }

  if(!isNaN(bw)&&!isNaN(uoVol)&&!isNaN(uoHr)&&bw>0&&uoHr>0){
    const rate=uoVol/(bw*uoHr);
    let us,ul,uc,ucls;
    if(rate<0.3&&uoHr>=24){us=3;ul='Stage 3 — UO <0.3 mL/kg/jam ≥24 jam';uc='var(--red)';ucls='severe';}
    else if(rate<0.5&&uoHr>=12){us=2;ul='Stage 2 — UO <0.5 mL/kg/jam ≥12 jam';uc='var(--amber)';ucls='mild';}
    else if(rate<0.5&&uoHr>=6){us=1;ul='Stage 1 — UO <0.5 mL/kg/jam dalam 6–12 jam';uc='var(--orange)';ucls='mild';}
    else{us=0;ul='UO dalam batas normal';uc='var(--teal)';ucls='normal';}
    histParts.push('UO: '+ul);
    html+=`<div class="abg-result abg-${ucls}" style="margin-top:8px">
      <div class="abg-label" style="color:${uc}">Berdasarkan Urine Output${us>0?' — AKI KDIGO Stage '+us:''}</div>
      <div class="abg-interp">${ul}</div>
      <div class="abg-detail">Rate UO: <strong>${rate.toFixed(3)} mL/kg/jam</strong> (${uoVol} mL / ${uoHr} jam / ${bw} kg)</div>
    </div>`;
  }

  if(!html)html='<div class="info">Masukkan setidaknya salah satu: (a) SCr baseline + saat ini, atau (b) BB + volume urin + durasi</div>';
  else html+=`<div class="formula-note" style="margin-top:8px">KDIGO 2012: staging diambil dari kriteria yang paling berat (SCr atau UO). Stage 3 juga jika ada kebutuhan RRT. &nbsp;|&nbsp; Kidney Int Suppl 2012;2:1</div>`;

  document.getElementById('aki-result-content').innerHTML=html;
  document.getElementById('aki-results').classList.remove('hidden');

  if(histParts.length&&typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('aki',
      'Staging AKI',
      {scrBase:String(scrBase||''),scrNow:String(scrNow||''),bw:String(bw||''),uoVol:String(uoVol||''),uoHr:String(uoHr||'')},
      histParts.join(' · '));
  }
}

function calcFENa(){
  const sna=parseFloat(document.getElementById('fena-sna').value);
  const scr=_asMgDL('fena-scr',1/88.42);  /* mg/dL atau µmol/L → selalu mg/dL */
  const una=parseFloat(document.getElementById('fena-una').value);
  const ucr=_asMgDL('fena-ucr',1/88.42);  /* mg/dL atau µmol/L → selalu mg/dL */
  const sureum=parseFloat(document.getElementById('fena-sureum').value);
  const uureum=parseFloat(document.getElementById('fena-uureum').value);
  if(!sna||!scr||!una||!ucr){alert('Masukkan Na serum, SCr, Na urin, dan Cr urin');return;}

  const fena=(una*scr)/(sna*ucr)*100;
  let fi,fc,fcls;
  if(fena<1){fi='Pre-renal AKI — retensi Na, respons tubulus masih normal';fc='var(--teal)';fcls='normal';}
  else if(fena<2){fi='Inkonklusif — evaluasi konteks klinis (pasien diuretik? obstruksi?)';fc='var(--amber)';fcls='mild';}
  else{fi='Renal intrinsik AKI — tubular injury, kemampuan retensi Na hilang';fc='var(--red)';fcls='severe';}

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:${fc}"><div class="result-label">FENa</div><div class="result-value" style="color:${fc}">${fena.toFixed(2)}%</div><div class="result-sub">${fena<1?'Pre-renal (<1%)':fena<2?'Equivocal (1–2%)':'Renal intrinsik (>2%)'}</div></div>`;

  let fuHtml='';
  if(!isNaN(sureum)&&!isNaN(uureum)&&sureum>0&&uureum>0){
    const feurea=(uureum*scr)/(sureum*ucr)*100;
    let fui,fuc,fucls;
    if(feurea<35){fui='Pre-renal (valid meski ada diuretik)';fuc='var(--teal)';fucls='normal';}
    else if(feurea<50){fui='Inkonklusif';fuc='var(--amber)';fucls='mild';}
    else{fui='Renal intrinsik';fuc='var(--red)';fucls='severe';}
    html+=`<div class="result-card" style="border-color:${fuc}"><div class="result-label">FEUrea</div><div class="result-value" style="color:${fuc}">${feurea.toFixed(2)}%</div><div class="result-sub">${feurea<35?'Pre-renal (<35%)':feurea<50?'Equivocal':'Renal (>50%)'}</div></div>`;
    fuHtml=`<div class="abg-result abg-${fucls}" style="margin-top:8px"><div class="abg-label" style="color:${fuc}">FEUrea: ${feurea.toFixed(2)}%</div><div class="abg-interp">${fui}</div><div class="abg-detail">FEUrea = (Ureum urin ${uureum} × SCr ${scr}) / (Ureum serum ${sureum} × Cr urin ${ucr}) × 100</div></div>`;
  }
  html+='</div>';

  html+=`<div class="abg-result abg-${fcls}" style="margin-top:10px"><div class="abg-label" style="color:${fc}">FENa: ${fena.toFixed(2)}%</div><div class="abg-interp">${fi}</div><div class="abg-detail">FENa = (UNa ${una} × SCr ${scr}) / (SNa ${sna} × UCr ${ucr}) × 100</div></div>`;
  html+=fuHtml;
  html+=`<div class="formula-note" style="margin-top:8px">FENa tidak valid pada pasien diuretik → gunakan FEUrea. &nbsp;|&nbsp; Miller TR. Ann Intern Med 1978;89:47 · Espinal CH. Am Fam Physician 2000</div>`;
  document.getElementById('fena-result-content').innerHTML=html;
  document.getElementById('fena-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('fena',
      'FENa '+fena.toFixed(2)+'%',
      {sna:String(sna),scr:String(scr),una:String(una),ucr:String(ucr),sureum:String(sureum||''),uureum:String(uureum||'')},
      'FENa '+fena.toFixed(2)+'% — '+fi);
  }
}

function calcOsmolality(){
  const na=parseFloat(document.getElementById('osm-na').value);
  const glu=_asMgDL('osm-glu',18);  /* mg/dL atau mmol/L → selalu mg/dL */
  const ureum=parseFloat(document.getElementById('osm-ureum').value);
  const measured=parseFloat(document.getElementById('osm-measured').value);
  if(!na||!glu||!ureum){alert('Masukkan Na, Glukosa, dan Ureum');return;}

  const ureumMmol=ureum/6.006;
  const osmCalc=2*na+glu/18+ureumMmol;

  let html='<div class="result-grid">';
  html+=`<div class="result-card"><div class="result-label">Osmolalitas Kalkulasi</div><div class="result-value" style="color:${osmCalc<285?'var(--blue)':osmCalc<=295?'var(--teal)':osmCalc<=320?'var(--amber)':'var(--red)'}">${osmCalc.toFixed(1)}</div><div class="result-sub">mOsm/kg · Normal 285–295</div></div>`;
  html+=`<div class="result-card"><div class="result-label">Ureum (konversi)</div><div class="result-value">${ureumMmol.toFixed(2)}</div><div class="result-sub">mmol/L (dari ${ureum} mg/dL)</div></div>`;

  if(!isNaN(measured)){
    const gap=measured-osmCalc;
    let gi,gc,gcls;
    if(gap<=10){gi='Normal (<10 mOsm/kg)';gc='var(--teal)';gcls='normal';}
    else if(gap<=20){gi='Sedikit meningkat — evaluasi klinis';gc='var(--amber)';gcls='mild';}
    else{gi='⚠ Meningkat signifikan → curiga etanol, metanol, etilenglikol, manitol';gc='var(--red)';gcls='severe';}
    html+=`<div class="result-card" style="border-color:${gc}"><div class="result-label">Osmol Gap</div><div class="result-value" style="color:${gc}">${gap.toFixed(1)}</div><div class="result-sub">mOsm/kg — ${gap<=10?'Normal':'⚠ Abnormal'}</div></div>`;
    html+='</div>';
    html+=`<div class="abg-result abg-${gcls}" style="margin-top:10px"><div class="abg-label" style="color:${gc}">Osmol Gap: ${gap.toFixed(1)} mOsm/kg</div><div class="abg-interp">${gi}</div><div class="abg-detail">Terukur ${measured} − Kalkulasi ${osmCalc.toFixed(1)} = ${gap.toFixed(1)} mOsm/kg</div></div>`;
  }else html+='</div>';

  let oi;
  if(osmCalc<285)oi='Hipoosmolalitas — evaluasi konteks hiponatremia';
  else if(osmCalc<=295)oi='Normal (285–295 mOsm/kg)';
  else if(osmCalc<=320)oi='Hiperosmolalitas ringan-sedang';
  else oi='⚠ Hiperosmolalitas berat — risiko koma hiperosmolar';

  html+=`<div class="formula-note" style="margin-top:10px"><strong>Kalkulasi:</strong> 2×${na} + ${glu}/18 + ${ureumMmol.toFixed(2)} = <strong>${osmCalc.toFixed(1)} mOsm/kg</strong> — ${oi}<br><span style="color:var(--muted)">BUN/2.8 = Ureum(mmol/L) — formula setara untuk RS yang menggunakan Ureum. Bhagat CI. Ann Clin Biochem 2001</span></div>`;
  document.getElementById('osm-result-content').innerHTML=html;
  document.getElementById('osm-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('osm',
      'Osmolalitas '+osmCalc.toFixed(1)+' mOsm/kg',
      {na:String(na),glu:String(glu),ureum:String(ureum),measured:String(measured||'')},
      (isNaN(measured)?'':'Osmol gap '+(measured-osmCalc).toFixed(1)+' mOsm/kg · ')+oi);
  }
}

/* ══════════════════════════════════════════════════════════
   BUN : KREATININ RATIO
   ══════════════════════════════════════════════════════════ */

function buncrConvUreum() {
  const ureum = parseFloat(document.getElementById('buncr-ureum').value);
  if (!isNaN(ureum) && ureum > 0)
    document.getElementById('buncr-bun').value = (ureum / 2.14).toFixed(1);
}

function calcBUNCr() {
  let bun     = parseFloat(document.getElementById('buncr-bun').value);
  const ureumRaw = parseFloat(document.getElementById('buncr-ureum').value);
  const cr    = _asMgDL('buncr-cr',1/88.42);  /* mg/dL atau µmol/L → selalu mg/dL */

  /* auto-convert ureum → BUN jika BUN kosong */
  if (isNaN(bun) && !isNaN(ureumRaw)) bun = ureumRaw / 2.14;
  if (isNaN(bun) || isNaN(cr) || cr <= 0) {
    alert('Masukkan BUN (atau Ureum) dan Kreatinin serum'); return;
  }

  const ratio = bun / cr;

  /* ── klasifikasi utama ─────────────────────────────── */
  let cls, color, title, interp;
  if (ratio > 20) {
    cls   = 'amber'; color = 'var(--amber)';
    title = `Rasio Tinggi (${ratio.toFixed(1)}) — Pre-renal atau Produksi Urea Meningkat`;
    interp = 'BUN naik tidak proporsional terhadap kreatinin → curiga pre-renal, perdarahan GI atas, atau hipercatabolisme.';
  } else if (ratio >= 10) {
    cls   = 'teal'; color = 'var(--teal)';
    title = `Rasio Normal (${ratio.toFixed(1)})`;
    interp = 'BUN dan kreatinin naik proporsional → mendukung AKI intrinsik (ATN), CKD, atau kondisi normal.';
  } else {
    cls   = 'accent'; color = 'var(--accent)';
    title = `Rasio Rendah (${ratio.toFixed(1)}) — Produksi Urea Berkurang atau Kreatinin Relatif Tinggi`;
    interp = 'Curiga gagal hati, malnutrisi berat, SIADH/overhydrasi, atau rhabdomiolisis.';
  }

  /* ── flag GI bleeding (BUN/Cr > 36) ───────────────── */
  const giBleeding = ratio > 36;

  /* ── result cards ──────────────────────────────────── */
  let html = '<div class="result-grid">';
  html += `<div class="result-card"><div class="result-label">BUN</div><div class="result-value">${bun.toFixed(1)}</div><div class="result-sub">mg/dL</div></div>`;
  html += `<div class="result-card"><div class="result-label">Kreatinin</div><div class="result-value">${cr}</div><div class="result-sub">mg/dL</div></div>`;
  html += `<div class="result-card" style="border-color:${color}"><div class="result-label">Rasio BUN:Cr</div><div class="result-value" style="color:${color}">${ratio.toFixed(1)}</div><div class="result-sub">Normal: 10–20</div></div>`;
  if (!isNaN(ureumRaw))
    html += `<div class="result-card"><div class="result-label">Ureum → BUN</div><div class="result-value">${ureumRaw.toFixed(1)}</div><div class="result-sub">mg/dL → ${bun.toFixed(1)} mg/dL</div></div>`;
  html += '</div>';

  /* ── interpretasi utama ────────────────────────────── */
  html += `<div class="cc ${cls}" style="margin-top:10px"><div class="ct">${title}</div><p>${interp}</p></div>`;

  /* ── GI bleeding flag ──────────────────────────────── */
  if (giBleeding) {
    html += `<div class="cc red" style="margin-top:8px">
      <div class="ct">🩸 BUN:Cr >36 — Curiga Perdarahan GI Atas</div>
      <p>Rasio >36 memiliki <strong>spesifisitas ~97%</strong> untuk perdarahan GI atas (sensitivitas ~45%).<br>
      Darah di lumen usus dicerna sebagai sumber protein → BUN naik cepat tanpa kenaikan kreatinin setara.<br>
      <strong>Pertimbangkan endoskopi segera jika ada tanda klinis (melena, hematemesis, anemia akut).</strong></p>
      <div class="formula-note" style="margin-top:4px">📚 Srygley FD. Ann Intern Med 2012;156:48 · Witting MD. Ann Emerg Med 2004;44:580</div>
    </div>`;
  }

  /* ── tabel diferensial lengkap ─────────────────────── */
  html += `<details style="margin-top:12px">
    <summary style="cursor:pointer;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600;padding:8px 12px;background:var(--card);border:1px solid var(--border-hi);border-radius:8px;list-style:none">
      📖 Tabel Diferensial Lengkap Berdasarkan Rasio BUN:Cr ▼
    </summary>
    <div style="padding:10px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--card)">
      <table style="font-size:11px">
        <tr><th>Rasio</th><th>Kondisi</th><th>Mekanisme</th><th>Tanda Klinis Tambahan</th></tr>
        <tr style="background:rgba(251,146,60,.08)">
          <td rowspan="5"><strong style="color:var(--amber)">&gt;20</strong></td>
          <td>Dehidrasi / Hipovolemia</td>
          <td>GFR turun → reabsorpsi BUN pasif meningkat di tubulus proksimal</td>
          <td>Mukosa kering, oliguria, takikardia, BUN/Cr naik sebelum Cr naik signifikan</td></tr>
        <tr style="background:rgba(251,146,60,.08)">
          <td>Gagal jantung / Syok</td>
          <td>Hipoperfusi renal → reabsorpsi urea tubular meningkat</td>
          <td>JVP ↑ (CHF), MAP rendah, laktat ↑, ronki paru</td></tr>
        <tr style="background:rgba(251,146,60,.08)">
          <td>Perdarahan GI atas</td>
          <td>Protein darah dicerna usus → absorbsi urea masif → BUN naik cepat</td>
          <td>Melena, hematemesis. Rasio >36 → sangat spesifik GI atas</td></tr>
        <tr style="background:rgba(251,146,60,.08)">
          <td>Hipercatabolisme (sepsis, trauma, luka bakar)</td>
          <td>Proteolisis otot masif → produksi urea meningkat</td>
          <td>SOFA ↑, CRP ↑, albumin turun, nitrogen balance negatif</td></tr>
        <tr style="background:rgba(251,146,60,.08)">
          <td>Steroid dosis tinggi / Tetracycline</td>
          <td>Steroid → gluconeogenesis protein ↑. Tetrasiklin → efek anti-anabolik</td>
          <td>Riwayat steroid atau terapi tetrasiklin aktif</td></tr>
        <tr style="background:rgba(34,197,94,.06)">
          <td><strong style="color:var(--green)">10–20</strong></td>
          <td>AKI intrinsik (ATN), CKD stabil, kondisi normal</td>
          <td>BUN dan Cr naik proporsional — disfungsi glomerular + tubular seimbang</td>
          <td>Sedimen urin granular cast, FENa >2%, riwayat paparan nefrotoksin</td></tr>
        <tr style="background:rgba(59,130,246,.08)">
          <td rowspan="4"><strong style="color:var(--accent)">&lt;10</strong></td>
          <td>Gagal hati / Sirosis</td>
          <td>Siklus urea di hati terganggu → sintesis urea turun</td>
          <td>Ikterus, asites, PT memanjang, albumin sangat rendah</td></tr>
        <tr style="background:rgba(59,130,246,.08)">
          <td>Malnutrisi berat / Intake protein rendah</td>
          <td>Substrat asam amino untuk sintesis urea kurang</td>
          <td>Albumin rendah, BMI rendah, riwayat puasa / diet sangat rendah protein</td></tr>
        <tr style="background:rgba(59,130,246,.08)">
          <td>SIADH / Overhydrasi</td>
          <td>Dilusi BUN relatif lebih banyak dari Cr karena distribusi di TBW luas</td>
          <td>Na serum rendah, euvolemik, UOSM >100 mOsm/kg</td></tr>
        <tr style="background:rgba(59,130,246,.08)">
          <td>Rhabdomiolisis</td>
          <td>Kreatinin sangat tinggi dari lisis otot, BUN naik lebih lambat relatif</td>
          <td>CK >5000 IU/L, urin "teh pekat" (mioglobinuria), nyeri otot</td></tr>
      </table>
      <div class="warn" style="font-size:12px;margin-top:10px">
        ⚠ <strong>Keterbatasan Rasio BUN:Cr:</strong><br>
        Nilai 10–20 tidak menyingkirkan pre-renal — pasien CKD atau hipercatabolisme bisa tetap 10–20 meski pre-renal.<br>
        Pada lansia dan malnutrisi, massa otot rendah → Cr serum rendah → rasio palsu tinggi.<br>
        Selalu integrasikan dengan konteks klinis, FENa/FEUrea, urine output, dan respon terhadap cairan.
      </div>
      <div class="formula-note" style="margin-top:8px">
        📚 Szabo S. Clin Biochem Rev 2012 · Morgan DB. Clin Nephrol 1977;8:189 · Srygley FD. Ann Intern Med 2012;156:48 · Witting MD. Ann Emerg Med 2004;44:580
      </div>
    </div>
  </details>`;

  document.getElementById('buncr-result-content').innerHTML = html;
  document.getElementById('buncr-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('buncr',
      'Rasio BUN:Cr '+ratio.toFixed(1),
      {bun:String(bun.toFixed(1)),ureum:String(isNaN(ureumRaw)?'':ureumRaw),cr:String(cr)},
      title.replace(/\s*\(.*?\)\s*/,' ')+(giBleeding?' · ⚠ curiga perdarahan GI atas':''));
  }
}
