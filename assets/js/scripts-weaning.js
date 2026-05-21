/* ============================================================
   Cheatsheet Ventilator Dewasa — ICU/IGD
   scripts-weaning.js · v4
   Halaman: weaning.html
   Fungsi: toggleTheory, calcRSBI
   ============================================================ */

/* ===== THEORY DROPDOWN ===== */
function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

/* ===== RSBI CALCULATOR ===== */
function calcRSBI(){
  const rr=parseFloat(document.getElementById('rsbRR').value);
  const vt=parseFloat(document.getElementById('rsbVT').value);
  const bb=parseFloat(document.getElementById('rsbBB').value);
  const mip=parseFloat(document.getElementById('rsbMIP').value)||null;
  const mep=parseFloat(document.getElementById('rsbMEP').value)||null;
  const peep=parseFloat(document.getElementById('rsbPEEP').value)||0;
  const ps=parseFloat(document.getElementById('rsbPS').value)||0;
  const mv=parseFloat(document.getElementById('rsbMV').value)||null;
  if(!rr||!vt){alert('Masukkan RR dan VT spontan');return;}

  const vtL=vt/1000;
  const rsbi=rr/vtL;
  const vtPerKg=bb?vt/bb:null;

  let rsbiColor,rsbiInterp,rsbiRec;
  if(rsbi<80){rsbiColor='var(--green)';rsbiInterp='Baik — Pertimbangkan Ekstubasi';rsbiRec='RSBI <80: Prediksi weaning sukses. Evaluasi kriteria klinis lengkap dan SBT.';}
  else if(rsbi<=105){rsbiColor='var(--amber)';rsbiInterp='Borderline';rsbiRec='RSBI 80–105: SBT lebih lama (60–120 mnt). Evaluasi faktor penghambat: delirium, nyeri, sekret, hipofosfatemia.';}
  else{rsbiColor='var(--red)';rsbiInterp='Risiko Gagal Weaning Tinggi';rsbiRec='RSBI >105: Weaning kemungkinan gagal. Identifikasi & koreksi penyebab. Pertimbangkan tunda ekstubasi.';}

  let html=`
  <div class="rsbi-box">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--purple);margin-bottom:4px">RSBI Dewasa</div>
    <div class="rsbi-value" style="color:${rsbiColor}">${rsbi.toFixed(0)} breaths/mnt/L</div>
    <div class="rsbi-interp" style="color:${rsbiColor}">${rsbiInterp}</div>
    <div style="font-size:12px;color:var(--muted);margin-top:4px">${rsbiRec}</div>
  </div>
  <div class="result-grid" style="margin-top:10px">
    <div class="result-card"><div class="result-label">RR Spontan</div><div class="result-value">${rr}</div><div class="result-sub">napas/menit</div></div>
    <div class="result-card"><div class="result-label">VT Spontan</div><div class="result-value">${vt}</div><div class="result-sub">mL${vtPerKg?` · ${vtPerKg.toFixed(1)} mL/kg`:''}</div></div>
    <div class="result-card"><div class="result-label">RSBI</div><div class="result-value" style="color:${rsbiColor}">${rsbi.toFixed(0)}</div><div class="result-sub">bpm/L</div></div>
    ${mv?`<div class="result-card"><div class="result-label">MV</div><div class="result-value">${mv.toFixed(1)}</div><div class="result-sub">L/mnt${mv>10?' ⚠ Tinggi':''}${mv<5?' ⚠ Rendah':''}</div></div>`:''}
  </div>`;

  if(mip){
    const mipAbs=Math.abs(mip);
    const mipColor=mipAbs>=30?'var(--green)':mipAbs>=20?'var(--amber)':'var(--red)';
    html+=`<div class="formula-note" style="margin-top:8px">
      MIP/NIF = ${mip} cmH₂O → <strong style="color:${mipColor}">${mipAbs>=30?'Adekuat (≥-30): kekuatan otot napas baik':mipAbs>=20?'Borderline (-20 s/d -30): evaluasi faktor lain':'Lemah (<-20): risiko gagal ekstubasi — tunda'}</strong>
    </div>`;
  }
  if(mep){
    const mepColor=mep>=60?'var(--green)':mep>=40?'var(--amber)':'var(--red)';
    html+=`<div class="formula-note" style="margin-top:6px">
      MEP = ${mep} cmH₂O → <strong style="color:${mepColor}">${mep>=60?'Normal (≥60): batuk efektif':mep>=40?'Borderline (40–60): monitor batuk':'Lemah (<40): risiko aspirasi, batuk tidak efektif'}</strong>
    </div>`;
  }
  if(peep>5||ps>8){
    html+=`<div class="warn" style="margin-top:8px;margin-bottom:0"><strong>⚠ Support Tidak Minimal</strong>RSBI valid hanya pada support minimal (PEEP ≤5, PS ≤5–8 cmH₂O, atau T-piece). PEEP ${peep} cmH₂O / PS ${ps} cmH₂O saat ini terlalu tinggi. Turunkan support dulu, lalu ukur RSBI kembali.</div>`;
  }

  document.getElementById('rsbi-result-content').innerHTML=html;
  document.getElementById('rsbi-results').classList.remove('hidden');
}
