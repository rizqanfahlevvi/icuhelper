/* ============================================================
   scripts-kalkulator-pf.js
   Halaman: kalkulator-pf.html
   Fungsi: toggleTheory, calcPF
   ============================================================ */

function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

function calcPF(){
  const pao2=parseFloat(document.getElementById('pfPaO2').value);
  const fio2=parseFloat(document.getElementById('pf-fio2').value);
  const map=parseFloat(document.getElementById('pfMAP').value)||null;
  const spo2=parseFloat(document.getElementById('pfSpO2').value)||null;
  const pplat=parseFloat(document.getElementById('pfPplat').value)||null;
  const peep=parseFloat(document.getElementById('pfPEEP').value)||null;
  if(!pao2||!fio2){alert('Masukkan PaO₂ dan FiO₂');return;}
  const pf=pao2/fio2;
  let pfClass,pfColor;
  if(pf>=400){pfClass='Normal';pfColor='var(--green)';}
  else if(pf>=300){pfClass='Hipoksemia Ringan';pfColor='var(--teal)';}
  else if(pf>=200){pfClass='ARDS Mild (Berlin)';pfColor='var(--amber)';}
  else if(pf>=100){pfClass='ARDS Moderate (Berlin)';pfColor='var(--orange)';}
  else{pfClass='ARDS Severe (Berlin)';pfColor='var(--red)';}
  let html=`
  <div class="abg-result ${pf>=300?'abg-normal':pf>=200?'abg-mild':'abg-severe'}">
    <div class="abg-label" style="color:${pfColor}">P/F Ratio — Klasifikasi Oksigenasi</div>
    <div class="abg-interp">${pf.toFixed(0)} mmHg — ${pfClass}</div>
    <div class="abg-detail">PaO₂ ${pao2} ÷ FiO₂ ${fio2} = ${pf.toFixed(1)}</div>
  </div>`;
  if(map){
    const oi=(map*fio2*100)/pao2;
    const oiClass=oi<5?'Ringan':oi<25?'Moderate':oi<40?'Berat':'Sangat Berat — pertimbangkan ECMO';
    const oiColor=oi<5?'var(--green)':oi<25?'var(--amber)':'var(--red)';
    html+=`<div class="abg-result abg-mild" style="margin-top:6px">
      <div class="abg-label" style="color:${oiColor}">Oxygenation Index (OI)</div>
      <div class="abg-interp">${oi.toFixed(1)} — ${oiClass}</div>
      <div class="abg-detail">OI = (MAP ${map} × FiO₂ ${fio2} × 100) / PaO₂ ${pao2}</div>
    </div>`;
  }
  if(pplat!==null&&peep!==null){
    const dp=pplat-peep;
    const dpColor=dp<=13?'var(--green)':dp<=15?'var(--amber)':'var(--red)';
    html+=`<div class="abg-result ${dp<=15?'abg-mild':'abg-severe'}" style="margin-top:6px">
      <div class="abg-label" style="color:${dpColor}">Driving Pressure</div>
      <div class="abg-interp">${dp} cmH₂O — ${dp<=13?'Optimal (≤13)':dp<=15?'Batas (≤15)':'⚠ Tinggi — risiko VILI'}</div>
      <div class="abg-detail">Pplat ${pplat} − PEEP ${peep} = ${dp} cmH₂O · Target ≤15 (ideal ≤13)</div>
    </div>`;
  }
  if(spo2&&map){
    const osi=(map*fio2*100)/spo2;
    html+=`<div class="abg-result abg-blue" style="margin-top:6px">
      <div class="abg-label" style="color:var(--blue)">OSI (SpO₂-based OI — jika tidak ada ABG)</div>
      <div class="abg-interp">OSI = ${osi.toFixed(1)}</div>
      <div class="abg-detail">OSI = (MAP ${map} × FiO₂ × 100) / SpO₂ ${spo2}%</div>
    </div>`;
  }
  const paco2=parseFloat(document.getElementById('pfPaCO2').value)||null;
  if (paco2) {
    let failType = '';
    let failDesc = '';
    let failColor = '';
    if (paco2 > 50) {
      failType = 'Tipe II (Hiperkapnik)';
      failDesc = 'Kegagalan ventilasi. PaCO₂ > 50 mmHg. Pertimbangkan NIV / intubasi jika asidosis berat.';
      failColor = 'var(--red)';
    } else if (pf < 300 || pao2 < 60) {
      failType = 'Tipe I (Hipoksemik)';
      failDesc = 'Kegagalan oksigenasi tanpa retensi CO₂ yang signifikan.';
      failColor = 'var(--amber)';
    } else {
      failType = 'Bukan Tipe I/II yang jelas';
      failDesc = 'Oksigenasi baik, PaCO₂ normal/rendah.';
      failColor = 'var(--green)';
    }
    html+=`<div class="abg-result" style="margin-top:6px; border-left-color:${failColor}">
      <div class="abg-label" style="color:${failColor}">Tipe Gagal Napas</div>
      <div class="abg-interp">${failType}</div>
      <div class="abg-detail">${failDesc} (PaCO₂ = ${paco2} mmHg)</div>
    </div>`;
  }
  document.getElementById('pf-result-content').innerHTML=html;
  document.getElementById('pf-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('pf',
      'P/F '+pf.toFixed(0)+' · '+pfClass,
      {pfPaO2:String(pao2),'pf-fio2':String(fio2),pfMAP:String(map||''),pfSpO2:String(spo2||''),pfPplat:String(pplat||''),pfPEEP:String(peep||'')},
      'P/F '+pf.toFixed(0)+' mmHg — '+pfClass);
  }
}
