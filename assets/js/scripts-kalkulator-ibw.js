/* ============================================================
   scripts-kalkulator-ibw.js
   Halaman: kalkulator-ibw.html
   Fungsi: toggleTheory, calcIBW
   ============================================================ */

function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

function calcIBW(){
  const sex=document.getElementById('ibwSex').value;
  const h=parseFloat(document.getElementById('ibwHeight').value);
  const aBW=parseFloat(document.getElementById('ibwActual').value);
  const cond=document.getElementById('ibwCondition').value;
  if(!h){alert('Masukkan tinggi badan');return;}
  const ibw=sex==='m'?50+0.91*(h-152.4):45.5+0.91*(h-152.4);
  const ibwR=Math.max(ibw,30);

  let vtLow,vtHigh,vtNote;
  if(cond==='ards'){vtLow=4;vtHigh=6;vtNote='Lung-protective ARDS — ARDSNet Protocol';}
  else if(cond==='copd'){vtLow=6;vtHigh=8;vtNote='PPOK — permissive hypercapnia; ekspirasi panjang';}
  else if(cond==='asthma'){vtLow=6;vtHigh=8;vtNote='Asma — controlled hypoventilation; Pplat <30';}
  else if(cond==='neuro'){vtLow=10;vtHigh=12;vtNote='NMD — paru normal, butuh VT lebih besar';}
  else{vtLow=6;vtHigh=8;vtNote='Ventilasi standar';}

  const vtLowML=(vtLow*ibwR).toFixed(0);
  const vtHighML=(vtHigh*ibwR).toFixed(0);
  const mv=(ibwR*vtLow*0.001*16).toFixed(1);

  /* Pre-calculate AdjBW for main grid display */
  let adjBW_val=null, bmi_early=null;
  if(aBW&&!isNaN(aBW)){
    bmi_early=aBW/((h/100)*(h/100));
    if(bmi_early>30&&aBW>ibwR) adjBW_val=ibwR+0.4*(aBW-ibwR);
  }

  let grid=`
  <div class="result-card"><div class="result-label">IBW</div><div class="result-value">${ibwR.toFixed(1)} kg</div><div class="result-sub">Devine formula — dasar VT</div></div>
  <div class="result-card"><div class="result-label">VT Rendah (${vtLow} mL/kg)</div><div class="result-value">${vtLowML} mL</div><div class="result-sub">Target awal</div></div>
  <div class="result-card"><div class="result-label">VT Tinggi (${vtHigh} mL/kg)</div><div class="result-value">${vtHighML} mL</div><div class="result-sub">Batas atas</div></div>
  <div class="result-card"><div class="result-label">MV Estimasi</div><div class="result-value">${mv} L/mnt</div><div class="result-sub">RR 16, VT rendah</div></div>`;
  if(aBW&&!isNaN(aBW)){
    const diff=((aBW-ibwR)/ibwR*100).toFixed(0);
    const vtActLow=(vtLow*aBW).toFixed(0);
    grid+=`<div class="result-card"><div class="result-label">VT Jika Actual BW</div><div class="result-value" style="color:var(--red)">${vtActLow} mL</div><div class="result-sub">↑${diff}% vs IBW — risiko overdistensi</div></div>`;
  }
  if(adjBW_val!==null){
    grid+=`<div class="result-card" style="border-color:var(--amber)"><div class="result-label">AdjBW — Obesitas (BMI ${bmi_early.toFixed(1)})</div><div class="result-value" style="color:var(--amber)">${adjBW_val.toFixed(1)} kg</div><div class="result-sub">IBW + 0.4×(ABW−IBW) · dosis obat</div></div>`;
  }
  document.getElementById('ibw-result-grid').innerHTML=grid;

  let ventTable=`<div class="subsec">Rekomendasi Setting Awal — ${cond.toUpperCase()}</div><table>
    <tr><th>Parameter</th><th>Nilai</th><th>Keterangan</th></tr>`;
  if(cond==='ards'){
    ventTable+=`<tr><td>Mode</td><td>VC-AC</td><td>Kontrol VT ketat</td></tr>
    <tr><td>VT</td><td>${vtLowML}–${vtHighML} mL</td><td>${vtLow}–${vtHigh} mL/kg IBW</td></tr>
    <tr><td>RR</td><td>16–22 bpm</td><td>Sesuai kebutuhan; naikkan jika pH drop</td></tr>
    <tr><td>PEEP</td><td>8–13 cmH₂O</td><td>Titrasi FiO₂/PEEP table ARDSNet</td></tr>
    <tr><td>Pplat target</td><td>&lt;30 cmH₂O</td><td>Lakukan inspiratory hold 0.5 det</td></tr>
    <tr><td>Driving pressure</td><td>≤15 cmH₂O</td><td>Pplat − PEEP; target ≤13 ideal</td></tr>`;
  } else if(cond==='copd'){
    ventTable+=`<tr><td>Mode</td><td>VC-AC</td><td>Flow tinggi 60–80 L/mnt</td></tr>
    <tr><td>VT</td><td>${vtLowML}–${vtHighML} mL</td><td>${vtLow}–${vtHigh} mL/kg IBW</td></tr>
    <tr><td>RR</td><td>10–14 bpm</td><td>Rendah — ekspirasi panjang</td></tr>
    <tr><td>I:E ratio</td><td>1:3 sampai 1:5</td><td>Cegah auto-PEEP</td></tr>
    <tr><td>PEEP</td><td>5–8 cmH₂O</td><td>75–85% auto-PEEP terukur</td></tr>
    <tr><td>PaCO₂ target</td><td>Baseline pasien</td><td>Koreksi bertahap</td></tr>`;
  } else if(cond==='asthma'){
    ventTable+=`<tr><td>Mode</td><td>VC-AC</td><td>Kontrol VT; PC tidak ideal</td></tr>
    <tr><td>VT</td><td>${vtLowML}–${vtHighML} mL</td><td>${vtLow}–${vtHigh} mL/kg IBW</td></tr>
    <tr><td>RR</td><td>8–12 bpm</td><td>SANGAT LAMBAT</td></tr>
    <tr><td>I:E ratio</td><td>1:4 sampai 1:5</td><td>Ekspirasi panjang wajib</td></tr>
    <tr><td>PEEP</td><td>0–5 cmH₂O</td><td>Rendah — auto-PEEP sudah ada</td></tr>
    <tr><td>PaCO₂ target</td><td>45–70 mmHg</td><td>Permissive hypercapnia</td></tr>`;
  } else if(cond==='neuro'){
    ventTable+=`<tr><td>Mode</td><td>VC-AC atau SIMV+PSV</td><td>Preserve spontaneous effort</td></tr>
    <tr><td>VT</td><td>${vtLowML}–${vtHighML} mL</td><td>${vtLow}–${vtHigh} mL/kg IBW</td></tr>
    <tr><td>RR</td><td>12–16 bpm</td><td>Backup; spontan diutamakan</td></tr>
    <tr><td>PEEP</td><td>5 cmH₂O</td><td>Standar</td></tr>
    <tr><td>Monitor</td><td>VC serial tiap 4–6 jam</td><td>Target VC &gt;20 mL/kg sebelum ekstubasi</td></tr>`;
  } else {
    ventTable+=`<tr><td>Mode</td><td>VC-AC atau PC-AC</td><td>Sesuai kondisi</td></tr>
    <tr><td>VT</td><td>${vtLowML}–${vtHighML} mL</td><td>${vtLow}–${vtHigh} mL/kg IBW</td></tr>
    <tr><td>RR</td><td>12–18 bpm</td><td>Sesuai target ventilasi</td></tr>
    <tr><td>PEEP</td><td>5–8 cmH₂O</td><td>Cegah atelektasis</td></tr>
    <tr><td>FiO₂</td><td>1.0 → titrasi</td><td>Target SpO₂ 94–98%</td></tr>`;
  }
  ventTable+='</table>';
  document.getElementById('ibw-vent-table').innerHTML=ventTable;
  let adjBWBox='';
  if(adjBW_val!==null){
    adjBWBox=`<div class="warn" style="margin-top:10px;margin-bottom:0">
      <strong>⚠ BMI ${bmi_early.toFixed(1)} — Pasien Obesitas: Perhatikan Pilihan Berat Badan</strong><br>
      <strong>AdjBW = IBW + 0.4 × (ABW − IBW) = ${adjBW_val.toFixed(1)} kg</strong><br>
      <table style="margin-top:6px;font-size:12px"><tr><th>Tujuan</th><th>Gunakan</th><th>Nilai</th></tr>
      <tr><td>VT Ventilator</td><td><strong>IBW</strong></td><td>${ibwR.toFixed(1)} kg</td></tr>
      <tr><td>Aminoglikosida, Heparin berat-badan</td><td><strong>AdjBW</strong></td><td>${adjBW_val.toFixed(1)} kg</td></tr>
      <tr><td>Vancomycin loading</td><td><strong>Actual BW</strong></td><td>${aBW} kg</td></tr>
      <tr><td>LMWH (enoxaparin) obesitas</td><td><strong>AdjBW</strong></td><td>${adjBW_val.toFixed(1)} kg</td></tr>
      <tr><td>Kebutuhan kalori ICU fase akut</td><td><strong>IBW atau AdjBW</strong></td><td>ESPEN 2023: hindari overfeeding</td></tr>
      </table>
      <span style="font-size:11px;color:var(--muted)">ESPEN Guidelines 2023 (Singer P. Clin Nutr 2023) · ASPEN 2022 · Rice TW. Crit Care Med 2012</span>
    </div>`;
  }
  document.getElementById('ibw-note').innerHTML=`<strong>Catatan:</strong> ${vtNote} · IBW = ${ibwR.toFixed(1)} kg (${sex==='m'?'Laki-laki':'Perempuan'}, TB ${h} cm) · Formula Devine BJ 1974${adjBWBox?'<br>'+adjBWBox:''}`;

  if(aBW&&!isNaN(aBW)){
    const bmi=aBW/((h/100)*(h/100));
    const bsa=Math.sqrt(h*aBW/3600);
    const abw=aBW>ibwR?ibwR+0.4*(aBW-ibwR):null;
    const lbw=sex==='m'?9270*aBW/(6680+216*bmi):9270*aBW/(8780+244*bmi);
    const ebv=aBW*(sex==='m'?70:65);
    const age=parseFloat(document.getElementById('ibwAge').value)||null;
    const hbVal=parseFloat(document.getElementById('ibwHb').value)||null;

    let bmiLabel,bmiColor;
    if(bmi<18.5){bmiLabel='Underweight';bmiColor='var(--blue)';}
    else if(bmi<25){bmiLabel='Normal';bmiColor='var(--green)';}
    else if(bmi<30){bmiLabel='Overweight';bmiColor='var(--amber)';}
    else if(bmi<35){bmiLabel='Obesitas I';bmiColor='var(--red)';}
    else if(bmi<40){bmiLabel='Obesitas II';bmiColor='var(--red)';}
    else{bmiLabel='Obesitas III';bmiColor='var(--red)';}

    let extraCards=`
    <div class="subsec" style="margin-top:14px">Anthropometri & Parameter Klinis Lanjutan</div>
    <div class="result-grid">
      <div class="result-card" style="border-color:${bmiColor}"><div class="result-label">BMI</div><div class="result-value" style="color:${bmiColor}">${bmi.toFixed(1)}</div><div class="result-sub">kg/m² — ${bmiLabel}</div></div>
      <div class="result-card"><div class="result-label">BSA (Mosteller)</div><div class="result-value">${bsa.toFixed(2)}</div><div class="result-sub">m² — dosis kemoterapi</div></div>
      <div class="result-card"><div class="result-label">LBW (Janmahasatian)</div><div class="result-value">${lbw.toFixed(1)}</div><div class="result-sub">kg — propofol/rocuronium</div></div>
      <div class="result-card"><div class="result-label">EBV</div><div class="result-value">${(ebv/1000).toFixed(2)}</div><div class="result-sub">L (${sex==='m'?70:65} mL/kg)</div></div>
      ${abw?`<div class="result-card" style="border-color:var(--amber)"><div class="result-label">ABW (Obesitas)</div><div class="result-value" style="color:var(--amber)">${abw.toFixed(1)}</div><div class="result-sub">kg — aminoglikosida/heparin</div></div>`:''}
    </div>`;

    if(age&&!isNaN(age)){
      const ree=sex==='m'?88.4+13.4*aBW+4.8*h-5.68*age:447.6+9.25*aBW+3.1*h-4.33*age;
      const calMin=Math.round(25*aBW);const calMax=Math.round(30*aBW);
      const protMin=(1.2*aBW).toFixed(0);const protMax=(2.0*aBW).toFixed(0);
      extraCards+=`
      <div class="result-grid" style="margin-top:8px">
        <div class="result-card"><div class="result-label">REE (Harris-Benedict)</div><div class="result-value">${Math.round(ree)}</div><div class="result-sub">kcal/hari (istirahat)</div></div>
        <div class="result-card"><div class="result-label">Target ICU (25–30 kcal/kg)</div><div class="result-value">${calMin}–${calMax}</div><div class="result-sub">kcal/hari (fase akut)</div></div>
        <div class="result-card"><div class="result-label">Target Protein ICU</div><div class="result-value">${protMin}–${protMax}</div><div class="result-sub">g/hari (1.2–2.0 g/kg)</div></div>
      </div>`;
    }

    if(hbVal&&!isNaN(hbVal)){
      const hbMin=7;
      const mabl=ebv*(hbVal-hbMin)/hbVal;
      const mablKolf=Math.ceil(Math.max(0,(hbMin-hbVal)*aBW*4)/250);
      if(hbVal>hbMin){
        extraCards+=`<div class="formula-note" style="margin-top:8px"><strong>MABL (Max Allowable Blood Loss):</strong> EBV ${(ebv/1000).toFixed(2)} L × (Hb ${hbVal} − trigger 7) / Hb ${hbVal} = <strong>${Math.max(0,mabl).toFixed(0)} mL</strong><br>Perdarahan &gt;${Math.max(0,mabl).toFixed(0)} mL → pertimbangkan transfusi PRC. Pre-operatif: evaluasi autologous donation atau cell saver.</div>`;
      }else{
        extraCards+=`<div class="warn" style="margin-top:8px;margin-bottom:0"><strong>⚠ Hb di Bawah Trigger Transfusi</strong>Hb ${hbVal} g/dL &lt; 7 g/dL — pertimbangkan transfusi PRC. Estimasi kebutuhan PRC: ±${mablKolf} kolf. Gunakan tab 🩸 Transfusi untuk kalkulasi lengkap.</div>`;
      }
    }

    extraCards+=`
    <div class="subsec" style="margin-top:14px">Panduan Pilihan BB untuk Dosis Obat</div>
    <table><tr><th>Obat / Kategori</th><th>BB yang Digunakan</th><th>Nilai</th><th>Alasan</th></tr>
    <tr><td>VT Ventilator</td><td>IBW</td><td>${ibwR.toFixed(1)} kg</td><td>Volume paru bergantung TB, bukan massa</td></tr>
    <tr><td>Aminoglikosida (${bmi>=30?'obesitas':'BMI normal'})</td><td>${bmi>=30?'ABW':'IBW'}</td><td>${bmi>=30?abw?abw.toFixed(1)+'kg':'-':ibwR.toFixed(1)+' kg'}</td><td>${bmi>=30?'ABW mencerminkan distribusi aminoglikosida pada jaringan lemak':'BMI normal: gunakan IBW atau actual'}</td></tr>
    <tr><td>Propofol induction / Rocuronium</td><td>LBW</td><td>${lbw.toFixed(1)} kg</td><td>Distribusi ke lean tissue</td></tr>
    <tr><td>Heparin (APTT-guided)</td><td>${bmi>=30?'ABW':'Actual BW'}</td><td>${bmi>=30&&abw?abw.toFixed(1)+' kg':aBW+' kg'}</td><td>Berbasis actual atau ABW pada obesitas</td></tr>
    <tr><td>Obat umum (parasetamol, ibuprofen, dll)</td><td>Actual BW</td><td>${aBW} kg</td><td>Standar dosis umum</td></tr>
    <tr><td>Kemoterapi</td><td>BSA</td><td>${bsa.toFixed(2)} m²</td><td>Berdasarkan luas permukaan tubuh</td></tr>
    </table>
    <div class="formula-note" style="margin-top:6px">Harris JA & Benedict FG 1919 · Janmahasatian S. Clin Pharmacokinet 2005;44:1051 · Mosteller RD. NEJM 1987;317:1098 · ASPEN Critical Care Guidelines 2021</div>`;

    let extraDiv=document.getElementById('ibw-extra');
    if(!extraDiv){
      extraDiv=document.createElement('div');
      extraDiv.id='ibw-extra';
      document.getElementById('ibw-note').after(extraDiv);
    }
    extraDiv.innerHTML=extraCards;
  }
  document.getElementById('ibw-results').classList.remove('hidden');

  if(typeof window.saveCalcHistory==='function'){
    window.saveCalcHistory('ibw',
      'IBW '+ibwR.toFixed(1)+' kg',
      {ibwSex:String(sex),ibwHeight:String(h),ibwActual:String(aBW||''),ibwCondition:String(cond)},
      'IBW '+ibwR.toFixed(1)+' kg · VT '+vtLowML+'–'+vtHighML+' mL ('+vtLow+'–'+vtHigh+' mL/kg) — '+vtNote);
  }
}
