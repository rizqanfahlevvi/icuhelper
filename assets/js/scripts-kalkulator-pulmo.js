/* ============================================================
   scripts-kalkulator-pulmo.js
   Halaman: kalkulator-pulmo.html
   Fungsi: convertPulmoUreum, syncCurbUreum, syncPsiUreum,
           calcCURB65, calcPSI, calcAAGradient
   ============================================================ */

function convertPulmoUreum(){
  const mgdl=parseFloat(document.getElementById('pulmo-ureum').value);
  const box=document.getElementById('pulmo-ureum-result-box');
  const placeholder=document.getElementById('pulmo-ureum-placeholder');
  const res=document.getElementById('pulmo-ureum-result');

  if(isNaN(mgdl)||mgdl<0){
    box.style.display='none';
    placeholder.style.display='flex';
    return;
  }

  const mmol=(mgdl/6.006).toFixed(2);
  const bun=(mgdl*0.4667).toFixed(1);
  const curbOk=mgdl>42;
  const psiOk=mgdl>64;

  document.getElementById('pulmo-res-mmol').textContent=mmol;
  document.getElementById('pulmo-res-bun').textContent=bun;

  const curbBadge=curbOk
    ?`<span style="background:var(--red-bg);color:var(--red);border:.5px solid var(--red);border-radius:5px;padding:3px 10px;font-size:11px;font-weight:600">✔ CURB U=1 — Ureum &gt;7 mmol/L</span>`
    :`<span style="background:var(--teal-bg);color:var(--teal);border:.5px solid var(--teal);border-radius:5px;padding:3px 10px;font-size:11px;font-weight:600">✘ CURB U=0 — Ureum ≤7 mmol/L</span>`;

  const psiBadge=psiOk
    ?`<span style="background:var(--red-bg);color:var(--red);border:.5px solid var(--red);border-radius:5px;padding:3px 10px;font-size:11px;font-weight:600">✔ PSI +20 poin — BUN &gt;30</span>`
    :`<span style="background:var(--teal-bg);color:var(--teal);border:.5px solid var(--teal);border-radius:5px;padding:3px 10px;font-size:11px;font-weight:600">✘ PSI 0 poin — BUN ≤30</span>`;

  res.innerHTML=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:2px">${curbBadge}${psiBadge}</div>`;

  box.style.display='block';
  placeholder.style.display='none';
}

function syncCurbUreum(){
  const mgdl=parseFloat(document.getElementById('curb-ureum').value);
  const note=document.getElementById('curb-ureum-note');
  if(isNaN(mgdl)||mgdl<0){note.textContent='';return;}
  const mmol=(mgdl/6.006).toFixed(2);
  const bun=(mgdl*0.4667).toFixed(1);
  if(mgdl>42){
    note.innerHTML=`= ${mmol} mmol/L = BUN ${bun} mg/dL &nbsp;<span style="color:var(--red);font-weight:600">✔ >7 mmol/L → Skor 1</span>`;
  }else{
    note.innerHTML=`= ${mmol} mmol/L = BUN ${bun} mg/dL &nbsp;<span style="color:var(--teal)">✘ ≤7 mmol/L → Skor 0</span>`;
  }
  if(document.getElementById('pulmo-ureum')){
    document.getElementById('pulmo-ureum').value=mgdl;
    convertPulmoUreum();
  }
}

function syncPsiUreum(){
  const mgdl=parseFloat(document.getElementById('psi-ureum').value);
  const note=document.getElementById('psi-ureum-note');
  if(isNaN(mgdl)||mgdl<0){note.textContent='Threshold: >64 mg/dL = BUN >30 mg/dL = >10.7 mmol/L';return;}
  const mmol=(mgdl/6.006).toFixed(2);
  const bun=(mgdl*0.4667).toFixed(1);
  if(mgdl>64){
    note.innerHTML=`= ${mmol} mmol/L = BUN ${bun} mg/dL &nbsp;<span style="color:var(--red);font-weight:600">✔ BUN >30 → +20 poin</span>`;
  }else{
    note.innerHTML=`= ${mmol} mmol/L = BUN ${bun} mg/dL &nbsp;<span style="color:var(--teal)">✘ BUN ≤30 → 0 poin</span>`;
  }
}

function calcCURB65(){
  const conf=parseInt(document.getElementById('curb-c').value)||0;
  const ureumMgdl=parseFloat(document.getElementById('curb-ureum').value);
  const rr=parseFloat(document.getElementById('curb-rr').value);
  const sbp=parseFloat(document.getElementById('curb-sbp').value);
  const dbp=parseFloat(document.getElementById('curb-dbp').value);
  const age=parseFloat(document.getElementById('curb-age').value);

  let score=0,rows='';
  function row(name,detail,pts){
    const c=pts>0?'var(--red)':detail.includes('Tidak dimasukkan')?'var(--muted)':'var(--teal)';
    rows+=`<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;border:.5px solid var(--border);margin-bottom:5px;background:var(--bg)">
      <div style="flex:1;font-size:12px"><strong style="display:block;font-size:13px">${name}</strong><small style="color:var(--muted)">${detail}</small></div>
      <div style="font-weight:700;font-size:16px;min-width:24px;text-align:right;color:${c}">${detail.includes('Tidak dimasukkan')?'—':pts}</div>
    </div>`;
    score+=pts;
  }

  row('C — Confusion',conf?'Ya — disorientasi baru terdeteksi':'Tidak',conf);
  if(!isNaN(ureumMgdl)){
    const mm=(ureumMgdl/6.006).toFixed(2);
    const up=ureumMgdl>42?1:0;
    row('U — Urea',`${ureumMgdl} mg/dL (${mm} mmol/L) — ${up?'✔ >7 mmol/L':'✘ ≤7 mmol/L'}`,up);
  }else row('U — Urea','Tidak dimasukkan',0);
  if(!isNaN(rr)){const rp=rr>=30?1:0;row('R — Respiratory Rate',`${rr}/mnt — ${rp?'✔ ≥30':'✘ <30'}`,rp);}
  if(!isNaN(sbp)&&!isNaN(dbp)){const bp=(sbp<90||dbp<=60)?1:0;row('B — Blood Pressure',`${sbp}/${dbp} mmHg — ${bp?'✔ Hipotensi':'✘ Normal'}`,bp);}
  if(!isNaN(age)){const ap=age>=65?1:0;row('65 — Usia',`${age} tahun — ${ap?'✔ ≥65':'✘ <65'}`,ap);}

  let interp,ic,ics,action;
  if(score<=1){interp='Risiko Rendah';ic='var(--teal)';ics='teal';action='Pertimbangkan rawat jalan dengan antibiotik oral. Mortalitas 30-hari ~1.5%.';}
  else if(score===2){interp='Risiko Sedang';ic='var(--amber)';ics='amber';action='Rawat inap singkat, terapi IV. Evaluasi tiap 24 jam. Mortalitas ~9.2%.';}
  else{interp=`Risiko Tinggi`;ic='var(--red)';ics='red';action=`Rawat inap, pertimbangkan ICU/HDU. Evaluasi kebutuhan ventilasi mekanik. Mortalitas ~22–57% (bergantung skor).`;}

  let html=`<div style="text-align:center;margin-bottom:14px">
    <div style="font-size:52px;font-weight:700;line-height:1;color:${ic}">${score}</div>
    <div style="font-size:14px;font-weight:600;color:${ic};margin-top:4px">CURB-65 Skor ${score}/5 — ${interp}</div>
  </div>${rows}`;
  html+=`<div class="cc ${ics}" style="margin-top:10px"><div class="ct">Rekomendasi Disposisi</div><p>${action}</p></div>`;
  html+=`<div class="formula-note" style="margin-top:8px">CURB-65. Lim WS et al. Thorax 2003;58:377 · BTS Guidelines for CAP. Gunakan SMART-COP untuk prediksi kebutuhan vasopressor/ventilasi.</div>`;
  document.getElementById('curb-result-content').innerHTML=html;
  document.getElementById('curb-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('pulmo',
      'CURB-65 '+score+'/5 · '+interp,
      {'curb-c':String(conf),'curb-ureum':String(isNaN(ureumMgdl)?'':ureumMgdl),'curb-rr':String(isNaN(rr)?'':rr),'curb-sbp':String(isNaN(sbp)?'':sbp),'curb-dbp':String(isNaN(dbp)?'':dbp),'curb-age':String(isNaN(age)?'':age)},
      'CURB-65 skor '+score+'/5 — '+interp);
  }
}

function calcPSI(){
  const sex=document.getElementById('psi-sex').value;
  const age=parseFloat(document.getElementById('psi-age').value);
  if(!age){alert('Masukkan usia');return;}

  let score=sex==='f'?age-10:age;
  score+=parseInt(document.getElementById('psi-nursing').value)||0;
  score+=parseInt(document.getElementById('psi-neo').value)||0;
  score+=parseInt(document.getElementById('psi-liver').value)||0;
  score+=parseInt(document.getElementById('psi-chf').value)||0;
  score+=parseInt(document.getElementById('psi-cva').value)||0;
  score+=parseInt(document.getElementById('psi-renal').value)||0;
  score+=parseInt(document.getElementById('psi-ms').value)||0;

  const rr=parseFloat(document.getElementById('psi-rr').value);
  const sbp=parseFloat(document.getElementById('psi-sbp').value);
  const temp=parseFloat(document.getElementById('psi-temp').value);
  const hr=parseFloat(document.getElementById('psi-hr').value);
  if(!isNaN(rr)&&rr>=30)score+=20;
  if(!isNaN(sbp)&&sbp<90)score+=20;
  if(!isNaN(temp)&&(temp<35||temp>=40))score+=15;
  if(!isNaN(hr)&&hr>=125)score+=10;

  const ph=parseFloat(document.getElementById('psi-ph').value);
  const ureum=parseFloat(document.getElementById('psi-ureum').value);
  const na=parseFloat(document.getElementById('psi-na').value);
  const glu=parseFloat(document.getElementById('psi-glu').value);
  const hct=parseFloat(document.getElementById('psi-hct').value);
  const pao2=parseFloat(document.getElementById('psi-pao2').value);
  const spo2=parseFloat(document.getElementById('psi-spo2').value);

  if(!isNaN(ph)&&ph<7.35)score+=30;
  if(!isNaN(ureum)&&ureum>64)score+=20;
  if(!isNaN(na)&&na<130)score+=20;
  if(!isNaN(glu)&&glu>=250)score+=10;
  if(!isNaN(hct)&&hct<30)score+=10;
  if(!isNaN(pao2)&&pao2<60)score+=10;
  else if(isNaN(pao2)&&!isNaN(spo2)&&spo2<90)score+=10;
  score+=parseInt(document.getElementById('psi-effusion').value)||0;

  let pc,pmort,pact,pcls;
  if(score<=70){pc='Kelas II';pmort='0.6%';pact='Rawat jalan — risiko rendah.';pcls='teal';}
  else if(score<=90){pc='Kelas III';pmort='0.9%';pact='Rawat jalan atau observasi singkat (<23 jam).';pcls='teal';}
  else if(score<=130){pc='Kelas IV';pmort='9.3%';pact='Rawat inap — risiko sedang.';pcls='amber';}
  else{pc='Kelas V';pmort='27.0%';pact='Rawat inap, pertimbangkan ICU — risiko tinggi.';pcls='red';}

  const base=sex==='f'?age-10:age;
  let html=`<div style="text-align:center;margin-bottom:14px">
    <div style="font-size:52px;font-weight:700;line-height:1;color:var(--${pcls==='teal'?'teal':pcls==='amber'?'amber':'red'})">${Math.round(score)}</div>
    <div style="font-size:14px;font-weight:600;margin-top:4px">PSI ${pc} — Mortalitas 30-hari ${pmort}</div>
  </div>`;

  if(!isNaN(ureum)){
    const bun=(ureum*0.4667).toFixed(1),umm=(ureum/6.006).toFixed(2);
    html+=`<div class="formula-note" style="margin-bottom:10px">Ureum ${ureum} mg/dL = BUN ${bun} mg/dL = ${umm} mmol/L → ${ureum>64?'<span style="color:var(--red);font-weight:600">BUN >30 mg/dL → +20 poin</span>':'<span style="color:var(--teal)">BUN ≤30 mg/dL → 0 poin</span>'}</div>`;
  }

  html+=`<div class="cc ${pcls}" style="margin-top:4px"><div class="ct">${pc} — ${pact}</div><p>Skor dasar usia: ${Math.round(base)} &nbsp;|&nbsp; Total: ${Math.round(score)} poin &nbsp;|&nbsp; Mortalitas: ${pmort}</p></div>`;
  html+=`<div class="formula-note" style="margin-top:8px">PSI/PORT Score. Fine MJ et al. NEJM 1997;336:243 · Mandell LA (IDSA/ATS) Clin Infect Dis 2007;44:S27</div>`;
  document.getElementById('psi-result-content').innerHTML=html;
  document.getElementById('psi-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('pulmo',
      'PSI '+Math.round(score)+' poin · '+pc,
      {'psi-sex':String(sex),'psi-age':String(age)},
      'PSI '+pc+' ('+Math.round(score)+' poin) — mortalitas 30-hari '+pmort);
  }
}

function calcSMARTCOP(){
  var s=parseInt(document.getElementById('sc-s').value)||0;
  var m=parseInt(document.getElementById('sc-m').value)||0;
  var a=parseInt(document.getElementById('sc-a').value)||0;
  var r=parseInt(document.getElementById('sc-r').value)||0;
  var t=parseInt(document.getElementById('sc-t').value)||0;
  var c=parseInt(document.getElementById('sc-c').value)||0;
  var o=parseInt(document.getElementById('sc-o').value)||0;
  var p=parseInt(document.getElementById('sc-p').value)||0;
  var score=s+m+a+r+t+c+o+p;

  var risk,col,colcls,action,pct;
  if(score<=2){risk='Risiko Rendah';col='var(--teal)';colcls='teal';action='Perawatan bangsal biasa. Pantau ketat jika ada komorbid.';pct='<5%';}
  else if(score<=4){risk='Risiko Sedang';col='var(--amber)';colcls='amber';action='~1 dari 8 pasien butuh vasopressor/ventilasi. Pertimbangkan IMC/HCU. Monitor ketat.';pct='~12%';}
  else if(score<=6){risk='Risiko Tinggi';col='var(--red)';colcls='red';action='~1 dari 3 pasien butuh PIIT. Konsul ICU. Evaluasi indikasi ATS/IDSA ICU.';pct='~33%';}
  else{risk='Risiko Sangat Tinggi';col='var(--red)';colcls='red';action='~2 dari 3 pasien butuh vasopressor atau ventilasi mekanik. Admisi ICU diindikasikan.';pct='~67%';}

  var items=[
    ['S — Sistolik <90 mmHg',s,2],['M — Multilobar X-ray',m,1],['A — Albumin <3.5 g/dL',a,1],
    ['R — RR tinggi (age-adjusted)',r,1],['T — Takikardia ≥125',t,1],['C — Confusion baru',c,1],
    ['O — Oksigenasi rendah',o,2],['P — pH <7.35',p,2]
  ];
  var rows='';
  items.forEach(function(it){
    var pts=it[1];var max=it[2];
    var cc=pts>0?'var(--red)':'var(--teal)';
    rows+='<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:7px;border:.5px solid var(--border);margin-bottom:4px;background:var(--bg)">'
      +'<div style="flex:1;font-size:12px">'+it[0]+'</div>'
      +'<div style="font-weight:700;font-size:15px;min-width:30px;text-align:right;color:'+cc+'">'+pts+' / '+max+'</div>'
      +'</div>';
  });

  var html='<div style="text-align:center;margin-bottom:12px">'
    +'<div style="font-size:52px;font-weight:700;line-height:1;color:'+col+'">'+score+'</div>'
    +'<div style="font-size:14px;font-weight:600;color:'+col+';margin-top:4px">SMART-COP '+score+'/11 — '+risk+'</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-top:2px">Estimasi risiko PIIT: '+pct+'</div>'
    +'</div>'+rows
    +'<div class="cc '+colcls+'" style="margin-top:10px"><div class="ct">Rekomendasi</div><p>'+action+'</p></div>'
    +'<div class="formula-note" style="margin-top:8px">SMART-COP: Charles PG et al. Clin Infect Dis 2008;47:375 · PIIT = Prolonged Intensive Inpatient Treatment (vasopressor dan/atau ventilasi mekanik invasif)</div>';

  document.getElementById('sc-result-content').innerHTML=html;
  document.getElementById('sc-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('pulmo',
      'SMART-COP '+score+'/11 · '+risk,
      {'sc-s':String(s),'sc-m':String(m),'sc-a':String(a),'sc-r':String(r),'sc-t':String(t),'sc-c':String(c),'sc-o':String(o),'sc-p':String(p)},
      'SMART-COP skor '+score+'/11 — '+risk+' (risiko PIIT '+pct+')');
  }
}

function updateATSCheck(){
  var maj1=document.getElementById('ats-maj-1');
  var maj2=document.getElementById('ats-maj-2');
  var isMajor=(maj1&&maj1.checked)||(maj2&&maj2.checked);

  // Style major cards
  [['ats-maj-1','ats-maj-card-1'],['ats-maj-2','ats-maj-card-2']].forEach(function(p){
    var cb=document.getElementById(p[0]);
    var card=document.getElementById(p[1]);
    if(cb&&card) card.classList.toggle('checked',cb.checked);
  });

  // Count + style minor cards
  var minorCount=0;
  for(var i=1;i<=9;i++){
    var cb=document.getElementById('ats-min-'+i);
    var card=document.getElementById('ats-min-card-'+i);
    if(cb){
      if(cb.checked) minorCount++;
      if(card) card.classList.toggle('checked',cb.checked);
    }
  }

  // Counter
  var ctr=document.getElementById('ats-minor-count');
  if(ctr) ctr.textContent=minorCount+' dari 9 kriteria minor terpenuhi';

  // Result badge
  var badge=document.getElementById('ats-result-badge');
  if(!badge) return;
  if(isMajor){
    badge.className='ats-result-badge severe';
    badge.innerHTML='⚠️ <span>SEVERE CAP — Indikasi Masuk ICU<br><span style="font-size:11px;font-weight:400;opacity:0.85">Kriteria mayor terpenuhi — admisi ICU langsung</span></span>';
  } else if(minorCount>=3){
    badge.className='ats-result-badge severe';
    badge.innerHTML='⚠️ <span>SEVERE CAP — Indikasi Masuk ICU<br><span style="font-size:11px;font-weight:400;opacity:0.85">'+minorCount+' dari 9 kriteria minor terpenuhi (threshold ≥3)</span></span>';
  } else {
    badge.className='ats-result-badge ok';
    badge.innerHTML='✅ <span>Non-Severe CAP<br><span style="font-size:11px;font-weight:400;opacity:0.85">'+minorCount+' kriteria minor — belum memenuhi threshold. Pertimbangkan bangsal/HDU.</span></span>';
  }
}

function resetATSCheck(){
  ['ats-maj-1','ats-maj-2'].forEach(function(id){
    var cb=document.getElementById(id);
    var card=document.getElementById(id.replace('maj-','maj-card-'));
    if(cb) cb.checked=false;
    if(card) card.classList.remove('checked');
  });
  for(var i=1;i<=9;i++){
    var cb=document.getElementById('ats-min-'+i);
    var card=document.getElementById('ats-min-card-'+i);
    if(cb) cb.checked=false;
    if(card) card.classList.remove('checked');
  }
  var badge=document.getElementById('ats-result-badge');
  if(badge){ badge.className='ats-result-badge'; badge.innerHTML='Pilih kriteria untuk melihat klasifikasi'; }
  var ctr=document.getElementById('ats-minor-count');
  if(ctr) ctr.textContent='0 dari 9 kriteria minor terpenuhi';
}

function calcAAGradient(){
  const fio2=parseFloat(document.getElementById('aa-fio2').value);
  const paco2=parseFloat(document.getElementById('aa-paco2').value);
  const pao2=parseFloat(document.getElementById('aa-pao2').value);
  const patm=parseFloat(document.getElementById('aa-patm').value)||760;
  const aaAge=parseFloat(document.getElementById('aa-age').value);
  if(!fio2||!paco2||!pao2){alert('Masukkan FiO₂, PaCO₂, dan PaO₂');return;}

  const paO2calc=fio2*(patm-47)-paco2/0.8;
  const aaGrad=paO2calc-pao2;
  const normalAa=!isNaN(aaAge)?(aaAge/4+4):15;

  let ai,ac,acls;
  if(aaGrad<=normalAa){ai='Normal — hipoksemia kemungkinan dari hipoventilasi murni (periksa PaCO₂)';ac='var(--teal)';acls='normal';}
  else if(aaGrad<=35){ai='Meningkat ringan — V/Q mismatch ringan';ac='var(--amber)';acls='mild';}
  else if(aaGrad<=100){ai='Meningkat signifikan — V/Q mismatch, gangguan difusi, atau shunt parsial';ac='var(--amber)';acls='mild';}
  else{ai='⚠ Meningkat berat — pertimbangkan shunt besar (intrakardiak atau intrapulmoner)';ac='var(--red)';acls='severe';}

  const html=`<div class="result-grid">
    <div class="result-card" style="border-color:${ac}"><div class="result-label">A-a Gradient</div><div class="result-value" style="color:${ac}">${aaGrad.toFixed(1)}</div><div class="result-sub">mmHg · Normal ≤${normalAa.toFixed(0)}</div></div>
    <div class="result-card"><div class="result-label">PAO₂ (alveolar)</div><div class="result-value">${paO2calc.toFixed(1)}</div><div class="result-sub">mmHg — kalkulasi</div></div>
    <div class="result-card"><div class="result-label">PaO₂ (arteri)</div><div class="result-value">${pao2}</div><div class="result-sub">mmHg — terukur</div></div>
  </div>
  <div class="abg-result abg-${acls}" style="margin-top:10px">
    <div class="abg-label" style="color:${ac}">A-a Gradient: ${aaGrad.toFixed(1)} mmHg</div>
    <div class="abg-interp">${ai}</div>
    <div class="abg-detail">PAO₂ = ${fio2} × (${patm}−47) − ${paco2}/0.8 = ${paO2calc.toFixed(1)} mmHg &nbsp;|&nbsp; Nilai normal ≈ Usia/4 + 4 = ${normalAa.toFixed(0)} mmHg</div>
  </div>
  <div class="formula-note" style="margin-top:8px">West JB. Respiratory Physiology 9th ed. 2012 · Sarkar M. Lung India 2017;34:47</div>`;
  document.getElementById('aa-result-content').innerHTML=html;
  document.getElementById('aa-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('pulmo',
      'A-a Gradient '+aaGrad.toFixed(1)+' mmHg',
      {'aa-fio2':String(fio2),'aa-paco2':String(paco2),'aa-pao2':String(pao2),'aa-patm':String(patm),'aa-age':String(isNaN(aaAge)?'':aaAge)},
      'A-a gradient '+aaGrad.toFixed(1)+' mmHg (normal ≤'+normalAa.toFixed(0)+') — '+ai);
  }
}
