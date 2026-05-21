/* ============================================================
   scripts-kalkulator-drug.js
   Halaman: kalkulator-drug.html
   Fungsi: toggleTheory, switchDrugPanel, iScenarios,
           updateItuScenario, calcIntubasi, drugData, calcDrug
   ============================================================ */

function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

function switchDrugPanel(panel,btn){
  document.getElementById('drug-panel-icu').classList.toggle('hidden',panel!=='icu');
  document.getElementById('drug-panel-intubasi').classList.toggle('hidden',panel!=='intubasi');
  document.querySelectorAll('#drug-tab-icu,#drug-tab-intubasi').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
}

const iScenarios={
  general:{
    label:'Kondisi Umum / Elektif',
    induction:'Propofol',color:'var(--blue)',
    text:'Propofol sebagai agen induksi standar. Fentanyl pre-medikasi dianjurkan. Suksinilkolin atau Rocuronium untuk NMB sesuai preferensi.',
    avoid:'',
    nmb:'Suksinilkolin (RSI) atau Rocuronium 0.6–1.2 mg/kg'
  },
  shock:{
    label:'Syok / Hemodinamik Tidak Stabil',
    induction:'Ketamine',color:'var(--amber)',
    text:'Ketamine mempertahankan tonus simpatis (↑SVR, ↑HR). Pilihan utama syok septik, hipovolemik, dan kardiogenik. Kurangi dosis 30–50% pada syok berat.',
    avoid:'Hindari: Propofol (vasodilatasi + kardiodepresi berat), Etomidate (supresi adrenal sepsis — pertimbangkan individu per MENDS-2 2024)',
    nmb:'Suksinilkolin atau Rocuronium RSI 1.2 mg/kg'
  },
  icp:{
    label:'Peningkatan TIK / Cedera Kepala',
    induction:'Propofol atau Etomidate',color:'var(--purple)',
    text:'Propofol/Etomidate menjaga hemodinamik serebral. Fentanyl 1–3 mcg/kg WAJIB untuk blunting ICP spike saat laringoskopi. Pertahankan CPP ≥60 mmHg.',
    avoid:'Hindari: Suksinilkolin jika ada denervasi kronik (fasikulasi meningkatkan TIK sementara). Rocuronium lebih dipilih. Ketamine dapat diterima jika ada syok bersamaan (mitos TIK sudah terbantahkan).',
    nmb:'Rocuronium 1.2 mg/kg (pilihan) — hindari fasikulasi suksinilkolin'
  },
  bronchospasm:{
    label:'Bronkospasme / Asma Berat',
    induction:'Ketamine',color:'var(--teal)',
    text:'Ketamine adalah bronkodilator via efek simpatomimetik. Pilihan UTAMA pada bronkospasme aktif dan asma berat yang memerlukan intubasi.',
    avoid:'Hindari: Morfin, Atrakurium (pelepasan histamin → bronkospasme). Thiopental dan Propofol dosis besar dapat memperburuk bronkospasme.',
    nmb:'Rocuronium 1.2 mg/kg (pilihan) atau Suksinilkolin — hindari Atrakurium dosis besar'
  },
  hyperkalemia:{
    label:'Hiperkalemia / KI Suksinilkolin',
    induction:'Propofol atau Ketamine',color:'var(--red)',
    text:'SUKSINILKOLIN MUTLAK DIKONTRAINDIKASIKAN. Gunakan Rocuronium RSI 1.2 mg/kg sebagai pengganti. Siapkan Sugammadex 16 mg/kg sebagai safety net.',
    avoid:'⚠ HINDARI SUKSINILKOLIN: Hiperkalemia, Luka bakar >24 jam, Crush injury >72 jam, Imobilisasi berkepanjangan, Lesi UMN kronik, Miopati, MH',
    nmb:'Rocuronium RSI 1.2 mg/kg — WAJIB sediakan Sugammadex 16 mg/kg'
  },
  seizure:{
    label:'Status Epileptikus',
    induction:'Propofol',color:'var(--blue)',
    text:'Propofol memiliki efek antikonvulsan. Pilihan utama untuk status epileptikus refrakter yang memerlukan intubasi. Midazolam sebagai alternatif jika propofol tidak tersedia.',
    avoid:'Ketamine: secara teoritis pro-konvulsan via NMDA — meski evidence klinis lemah, hindari pada status epileptikus jika ada alternatif.',
    nmb:'Rocuronium 1.2 mg/kg — jangan gunakan suksinilkolin jika ada risiko hiperkalemia pasca-kejang berkepanjangan'
  }
};

function updateItuScenario(){
  const sc=document.getElementById('itu-scenario').value;
  const d=iScenarios[sc];
  const box=document.getElementById('itu-scenario-info');
  if(sc==='hyperkalemia'||sc==='icp'||sc==='bronchospasm'){
    document.getElementById('itu-nmb').value='roc_rsi';
  }
  if(sc==='icp'){document.getElementById('itu-premed').value='fentanyl';}
  box.innerHTML=`<strong style="color:${d.color}">${d.induction} — ${d.label}</strong><br>${d.text}${d.avoid?`<br><span style="color:var(--red);font-size:11px">${d.avoid}</span>`:''}`;
}

function calcIntubasi(){
  const bb=parseFloat(document.getElementById('itu-bb').value);
  const sc=document.getElementById('itu-scenario').value;
  const nmbPref=document.getElementById('itu-nmb').value;
  const premed=document.getElementById('itu-premed').value;
  const useLido=document.getElementById('itu-lidocaine').checked;
  const useAtrop=document.getElementById('itu-atropine').checked;
  const showAlt=document.getElementById('itu-show-alt').checked;
  if(!bb){alert('Masukkan berat badan');return;}

  const sd=iScenarios[sc];

  function drow(name,dosePerKg,unit,concMgml,concLabel,onset,duration,note,isRec,ref){
    const isMcg=unit.includes('mcg');
    const totalDose=dosePerKg*bb;
    const vol=concMgml>0?totalDose/concMgml:null;
    const recStyle=isRec?'background:var(--blue-bg);border-color:var(--blue)':'';
    const recBadge=isRec?`<span style="font-size:10px;background:var(--blue);color:#fff;border-radius:3px;padding:1px 6px;margin-left:4px">★ Pilihan</span>`:'';
    const volStr=vol!=null?`<strong>${vol.toFixed(1)} mL</strong>`:'—';
    return `<tr style="${recStyle}">
      <td class="drug-name">${name}${recBadge}</td>
      <td class="dose-val">${dosePerKg} ${unit}/kg → <strong>${totalDose.toFixed(isMcg?0:1)} ${unit}</strong></td>
      <td>${volStr}<br><span style="font-size:10px;color:var(--muted)">${concLabel}</span></td>
      <td style="font-size:11px">${onset}</td>
      <td style="font-size:11px;color:var(--muted)">${note}</td>
      <td style="font-size:10px;color:var(--muted)">${ref}</td>
    </tr>`;
  }

  const recInduction=sc==='shock'||sc==='bronchospasm'?'ketamine':sc==='seizure'?'propofol':sc==='icp'?'propofol_etomidate':'propofol';
  const recNMB=nmbPref==='sux'&&sc!=='hyperkalemia'?'sux':nmbPref==='atracurium'?'atracurium':nmbPref==='roc_rsi'||sc==='hyperkalemia'||sc==='icp'||sc==='bronchospasm'?'roc_rsi':'roc_std';

  let html='';

  html+=`<div class="cc blue" style="margin-bottom:14px"><div class="ct">Skenario: ${sd.label}</div><p>${sd.induction} direkomendasikan sebagai agen induksi.</p></div>`;

  html+=`<div class="subsec">✅ Persiapan & Pre-oxygenation</div>
  <div class="formula-note" style="margin-bottom:12px">
    <strong>Alat:</strong> Laryngoscope (blade siap) · ETT 7.0–8.0 mm + stylet · BVM + O₂ · Suction aktif · ETCO₂ · Monitor EKG/SpO₂/NIBP/ETCO₂ · Akses IV paten<br>
    <strong>Posisi:</strong> Head-up 20–30° (ear-to-sternal-notch alignment) · Ramped position jika obesitas<br>
    <strong>Pre-oxygenasi:</strong> NRM 15 L/mnt minimal 3 mnt ATAU HFNO 40–60 L/mnt untuk apneic oxygenation · Target SpO₂ &gt;95% sebelum induksi
  </div>`;

  html+=`<div class="subsec">⏱ T minus 3 menit — Pre-medikasi (Analgesik)</div>`;
  html+=`<div style="overflow-x:auto"><table class="drug-table"><tr><th>Obat</th><th>Dosis/kg → Total</th><th>Volume &amp; Konsentrasi</th><th>Onset</th><th>Catatan</th><th>Ref</th></tr>`;

  if(premed==='fentanyl'){
    html+=drow('Fentanyl',2,'mcg',50,'50 mcg/mL (undiluted ampul)','60–90 dtk','—','Blunting hemodynamic response saat laringoskopi. Berikan IV lambat.',true,'Reves JG. BJA 1984');
  }else if(premed==='remifentanil'){
    html+=drow('Remifentanil',1,'mcg',50,'50 mcg/mL (rekonstitusi 1 mg + 20 mL NS)','60–90 dtk','T½ 3–10 mnt','Ultra-short acting. Wajib pump untuk maintenance. Awake intubation: 0.5 mcg/kg.',true,'Mingo OH. Anaesthesia 2004');
  }else if(premed==='alfentanil'){
    html+=drow('Alfentanil',15,'mcg',100,'100 mcg/mL (dilusi dari 5 mg/mL)','45–60 dtk','—','Onset lebih cepat dari fentanyl. Dosis 10–20 mcg/kg.',true,'Schüttler J. Anaesthesist 1991');
  }

  if(useLido){
    const lidoMg=1.5*bb; const lidoMl=lidoMg/20;
    html+=`<tr><td class="drug-name">Lidokain</td><td class="dose-val">1.5 mg/kg → <strong>${lidoMg.toFixed(0)} mg</strong></td><td><strong>${lidoMl.toFixed(1)} mL</strong><br><span style="font-size:10px;color:var(--muted)">20 mg/mL (larutan 2%)</span></td><td style="font-size:11px">—</td><td style="font-size:11px;color:var(--muted)">Berikan 3 mnt sebelum laringoskopi. Blunting hemodynamic response &amp; bronkospasme. Evidence untuk ↓TIK masih debatable.</td><td style="font-size:10px;color:var(--muted)">Habre W. Eur J Anaesthesiol 2004</td></tr>`;
  }
  if(premed==='none'&&!useLido){
    html+=`<tr><td colspan="6" style="color:var(--muted);font-size:12px;text-align:center">Tidak ada pre-medikasi dipilih — lanjut langsung ke induksi</td></tr>`;
  }
  html+='</table></div>';

  html+=`<div class="subsec" style="margin-top:14px">💉 T-0 — Induksi + NMB (berikan simultan atau NMB segera setelah induksi)</div>`;
  html+=`<div style="overflow-x:auto"><table class="drug-table"><tr><th>Obat</th><th>Dosis/kg → Total</th><th>Volume &amp; Konsentrasi</th><th>Onset / Durasi</th><th>Catatan</th><th>Ref</th></tr>`;

  const isRecProp=recInduction==='propofol'||recInduction==='propofol_etomidate';
  const isRecKet=recInduction==='ketamine';
  const isRecEto=recInduction==='propofol_etomidate';

  html+=drow('Propofol 1%',sc==='shock'?'0.5–1.0':'1.5–2.5','mg',10,'10 mg/mL (ready-to-use 1%)','30–60 dtk','5–10 mnt',sc==='shock'?'⚠ Kurangi dosis 50–75% pada syok. Vasodilatasi + kardiodepresi → hindari jika MAP rendah.':'Agen induksi standar. Kurangi dosis 30–50% pada elderly, ASA III–IV, atau hipovolemia ringan.',isRecProp,'Reves JG. Anesthesiology 2005');

  html+=drow('Ketamine',sc==='shock'?1.0:1.5,'mg',10,'10 mg/mL (dilusi: 200 mg + 20 mL NS)','30–60 dtk','10–15 mnt',sc==='shock'||sc==='bronchospasm'?'★ PILIHAN UTAMA. Preservasi tonus simpatis, bronkodilator. Kurangi dosis pada syok berat (1 mg/kg).':'Alternatif untuk pasien hemodinamik marginal. Bronkodilator kuat. Mitos peningkatan TIK sudah terbantahkan pada pasien ventilasi mekanik.',isRecKet,'Cohen L. Emerg Med J 2015');

  const etomMg=0.3*bb; const etomMl=etomMg/2;
  html+=`<tr style="${isRecEto?'background:var(--blue-bg);border-color:var(--blue)':''}">
    <td class="drug-name">Etomidate${isRecEto?'<span style="font-size:10px;background:var(--blue);color:#fff;border-radius:3px;padding:1px 6px;margin-left:4px">★ Pilihan</span>':''}</td>
    <td class="dose-val">0.3 mg/kg → <strong>${etomMg.toFixed(1)} mg</strong></td>
    <td><strong>${etomMl.toFixed(1)} mL</strong><br><span style="font-size:10px;color:var(--muted)">2 mg/mL (20 mg/10 mL)</span></td>
    <td style="font-size:11px">15–45 dtk / 3–5 mnt</td>
    <td style="font-size:11px;color:var(--muted)"><span style="color:var(--red);font-weight:600">DOSIS TUNGGAL SAJA</span> — supresi adrenal 12–24 jam. Stabilitas hemodinamik terbaik. MENDS-2 (NEJM 2024): aman pada sepsis.</td>
    <td style="font-size:10px;color:var(--muted)">MENDS-2 NEJM 2024</td>
  </tr>`;

  if(showAlt){
    html+=drow('Midazolam',0.2,'mg',1,'1 mg/mL (5 mg + 5 mL NS)','90–120 dtk','15–30 mnt','Onset lambat — BUKAN pilihan utama RSI. Gunakan bersama opioid/ketamine. Risko amnesia & depresi napas lebih panjang. Pertimbangkan jika obat lain tidak ada.',false,'Reves JG. Anesthesiology 2005');
  }

  html+='</table></div>';

  html+=`<div style="overflow-x:auto;margin-top:8px"><table class="drug-table"><tr><th>NMB</th><th>Dosis/kg → Total</th><th>Volume &amp; Konsentrasi</th><th>Onset / Durasi</th><th>Catatan</th><th>Ref</th></tr>`;

  if(useAtrop){
    const atropDose=Math.max(0.1,0.02*bb); const atropMl=atropDose/0.25;
    html+=`<tr><td class="drug-name">Atropin (pre-NMB)</td><td class="dose-val">0.02 mg/kg → <strong>${atropDose.toFixed(2)} mg</strong> (min 0.1 mg)</td><td><strong>${atropMl.toFixed(1)} mL</strong><br><span style="font-size:10px;color:var(--muted)">0.25 mg/mL</span></td><td style="font-size:11px">1–2 mnt sebelum NMB</td><td style="font-size:11px;color:var(--muted)">Cegah bradikardia vagal. Indikasi: anak &lt;5 thn, bradikardia sebelum RSI, suksinilkolin dosis ke-2.</td><td style="font-size:10px;color:var(--muted)">Lexicomp 2024</td></tr>`;
  }

  const suxMg=1.5*bb; const suxMl=suxMg/20;
  const suxRec=recNMB==='sux'&&sc!=='hyperkalemia';
  html+=`<tr style="${suxRec?'background:var(--blue-bg);border-color:var(--blue)':''}">
    <td class="drug-name">Suksinilkolin${suxRec?'<span style="font-size:10px;background:var(--blue);color:#fff;border-radius:3px;padding:1px 6px;margin-left:4px">★ Pilihan</span>':''}${sc==='hyperkalemia'?'<span style="font-size:10px;background:var(--red-bg);color:var(--red);border-radius:3px;padding:1px 6px;margin-left:4px">⛔ KI</span>':''}</td>
    <td class="dose-val">1.5 mg/kg → <strong>${suxMg.toFixed(0)} mg</strong><br><span style="font-size:10px;color:var(--muted)">IM 4 mg/kg jika tdk ada IV</span></td>
    <td><strong>${suxMl.toFixed(1)} mL</strong><br><span style="font-size:10px;color:var(--muted)">20 mg/mL (200 mg/10 mL)</span></td>
    <td style="font-size:11px">45–60 dtk<br>Durasi 8–12 mnt</td>
    <td style="font-size:11px;color:${sc==='hyperkalemia'?'var(--red)':'var(--muted)'}">Depolarizing NMB. ${sc==='hyperkalemia'?'⛔ MUTLAK KONTRAINDIKASI pada skenario ini. Gunakan Rocuronium.':'Reversal spontan. KI: hiperkalemia, luka bakar >24 jam, crush injury >72 jam, miopati, MH, denervasi kronik.'}</td>
    <td style="font-size:10px;color:var(--muted)">Sorensen Cochrane 2022</td>
  </tr>`;

  const rocRsiMg=1.2*bb; const rocRsiMl=rocRsiMg/10;
  const rocRsiRec=recNMB==='roc_rsi';
  html+=drow('Rocuronium RSI',1.2,'mg',10,'10 mg/mL (50 mg/5 mL, undiluted)','60–75 dtk — 60–90 mnt',rocRsiRec?'★ PILIHAN RSI pada skenario ini. Sediakan Sugammadex 16 mg/kg sebagai safety net.':'Alternatif RSI. Non-inferior to suksinilkolin (Cochrane 2022) jika Sugammadex tersedia.',rocRsiRec,'Sorensen Cochrane 2022');

  const rocStdMg=0.6*bb; const rocStdMl=rocStdMg/10;
  const rocStdRec=recNMB==='roc_std';
  html+=drow('Rocuronium standar',0.6,'mg',10,'10 mg/mL (50 mg/5 mL, undiluted)','90 dtk — 30–45 mnt','Untuk intubasi non-RSI atau jika kondisi memungkinkan onset lebih lambat.',rocStdRec,'Lexicomp 2024');

  const atrRec=recNMB==='atracurium';
  if(showAlt || atrRec){
    html+=drow('Atrakurium',0.5,'mg',10,'10 mg/mL (25 mg/2.5 mL)','2–3 mnt — 20–35 mnt','Bukan pilihan RSI (onset lambat). Hoffman elimination — aman gagal ginjal & hepar. Hindari pada bronkospasme (histamine release).',atrRec,'Lexicomp 2024');
  }

  if(showAlt){
    html+=drow('Vecuronium',0.1,'mg',2,'2 mg/mL (rekonstitusi: 10 mg + 5 mL NS)','2–3 mnt — 25–40 mnt','Modified RSI: 0.2 mg/kg. Eliminasi hepatik — kurangi dosis pada gagal hepar.',false,'Miller RD. Miller Anesthesia 2020');
    html+=drow('Cisatrakurium',0.2,'mg',2,'2 mg/mL (10 mg/5 mL)','2–3 mnt — 40–60 mnt','Bukan RSI (onset lambat). Pilihan ICU maintenance. Histamine-free, aman pada bronkospasme.',false,'Papazian NEJM 2010');
  }
  html+='</table></div>';

  const sugMg=16*bb; const sugMl=sugMg/100;
  const sugBox=(recNMB==='roc_rsi'||sc==='hyperkalemia')?'warn':'info';
  html+=`<div class="${sugBox}" style="margin-top:12px;font-size:12px">
    <strong>${recNMB==='roc_rsi'||sc==='hyperkalemia'?'⚠ SIAPKAN SEBELUM INTUBASI — ':'💡 '}Sugammadex Rescue (jika Rocuronium digunakan)</strong><br>
    Dosis reversal RSI (rocuronium 1.2 mg/kg): <strong>16 mg/kg = ${sugMg.toFixed(0)} mg = ${sugMl.toFixed(1)} mL</strong> (100 mg/mL, 200 mg/2 mL)<br>
    Berikan IV bolus → blokade terangkat dalam ~3 mnt → skenario "can't intubate, can't oxygenate" teratasi.
    <span style="color:var(--muted);display:block;margin-top:4px">STRIVE Hi Trial. Anaesthesia 2021;76:460</span>
  </div>`;

  html+=`<div class="subsec" style="margin-top:16px">💊 Pasca Intubasi — Maintenance Sedasi & Analgesia (ICU)</div>`;
  html+=`<div style="overflow-x:auto"><table class="drug-table"><tr><th>Obat</th><th>Dosis Maintenance</th><th>Syringe 50 mL</th><th>Rate (mL/jam)</th><th>Catatan</th></tr>`;

  const fentMid=50;const fentMl=(fentMid*bb)/(10*60);
  html+=`<tr><td class="drug-name">Fentanyl</td><td class="dose-val">25–200 mcg/kg/jam<br><span style="font-size:10px">Middle: ${fentMid} mcg/kg/jam</span></td><td>500 mcg dalam 50 mL NaCl<br><span style="font-size:10px;color:var(--muted)">= 10 mcg/mL</span></td><td class="vol-val">${fentMl.toFixed(1)} mL/jam</td><td style="font-size:11px">Pilihan utama analgesia ICU. Titrasi tiap 15–30 mnt. Akumulasi pada gagal ginjal.</td></tr>`;

  const remiMid=0.1;
  html+=`<tr><td class="drug-name">Remifentanil</td><td class="dose-val">0.05–2 mcg/kg/mnt<br><span style="font-size:10px">Middle: ${remiMid} mcg/kg/mnt</span></td><td>2.5 mg dalam 50 mL NaCl<br><span style="font-size:10px;color:var(--muted)">= 50 mcg/mL</span></td><td class="vol-val">${((remiMid*bb*60)/50).toFixed(1)} mL/jam</td><td style="font-size:11px">Tidak akumulasi, titrasi mudah. Harus via pump. Analgesik hilang segera saat dihentikan — siapkan opioid lain sebelum stop.</td></tr>`;

  const propMid=20;const propMlM=(propMid*bb*60)/10000;
  html+=`<tr><td class="drug-name">Propofol 1%</td><td class="dose-val">25–75 mcg/kg/mnt<br><span style="font-size:10px">Middle: ${propMid} mcg/kg/mnt</span></td><td>Propofol 1% ready-to-use<br><span style="font-size:10px;color:var(--muted)">= 10 mg/mL</span></td><td class="vol-val">${propMlM.toFixed(1)} mL/jam</td><td style="font-size:11px">Sedasi pilihan ICU. Monitor TG jika >48 jam atau dosis >70 mcg/kg/mnt (PRIS).</td></tr>`;

  const ketMid=0.2;const ketMlM=(ketMid*bb)/10;
  html+=`<tr><td class="drug-name">Ketamine (subanestesi)</td><td class="dose-val">0.1–0.5 mg/kg/jam<br><span style="font-size:10px">Middle: ${ketMid} mg/kg/jam</span></td><td>100 mg dalam 50 mL NaCl<br><span style="font-size:10px;color:var(--muted)">= 2 mg/mL</span></td><td class="vol-val">${ketMlM.toFixed(1)} mL/jam</td><td style="font-size:11px">Adjuvan analgesia + anti-delirium. Mengurangi kebutuhan opioid. Dapat dikombinasi dengan propofol.</td></tr>`;

  const midMid=0.05;const midMlM=(midMid*bb*60)/1000;
  html+=`<tr><td class="drug-name">Midazolam</td><td class="dose-val">0.02–0.1 mg/kg/jam<br><span style="font-size:10px">Middle: ${midMid} mg/kg/jam</span></td><td>50 mg dalam 50 mL NaCl<br><span style="font-size:10px;color:var(--muted)">= 1 mg/mL</span></td><td class="vol-val">${midMlM.toFixed(1)} mL/jam</td><td style="font-size:11px">Hindari rutin ICU (delirium, withdrawal). Gunakan jika propofol tidak tersedia atau kontraindikasi.</td></tr>`;

  const cisMid=2;const cisMlM=(cisMid*bb*60)/1000;
  html+=`<tr><td class="drug-name">Cisatrakurium</td><td class="dose-val">1–3 mcg/kg/mnt<br><span style="font-size:10px">Middle: ${cisMid} mcg/kg/mnt</span></td><td>20 mg dalam 20 mL NaCl<br><span style="font-size:10px;color:var(--muted)">= 1 mg/mL</span></td><td class="vol-val">${cisMlM.toFixed(1)} mL/jam</td><td style="font-size:11px">NMB pilihan ICU. Histamine-free. Indikasi: ARDS P/F&lt;120, ECMO. Monitor TOF wajib.</td></tr>`;
  html+=`<tr><td class="drug-name">Rocuronium (infus)</td><td class="dose-val">10–12 mcg/kg/mnt</td><td>100 mg dalam 50 mL NaCl<br><span style="font-size:10px;color:var(--muted)">= 2 mg/mL</span></td><td class="vol-val">${((11*bb*60)/2000).toFixed(1)} mL/jam</td><td style="font-size:11px">Maintenance jika rocuronium digunakan untuk intubasi. Monitor TOF. Reversal: Sugammadex.</td></tr>`;

  html+='</table></div>';

  html+=`<div class="formula-note" style="margin-top:12px">
    <strong>Checklist Pasca Intubasi</strong><br>
    □ Konfirmasi posisi ETT — ETCO₂ waveform + auskultasi bilateral · □ CXR dalam 30 mnt<br>
    □ Ventilasi protektif: VT 6 mL/kg IBW, PEEP 5–8, FiO₂ titrasi SpO₂ 94–98%<br>
    □ Mulai sedasi + analgesia IV segera · □ Target RASS -1 sd 0 (PADIS 2018)<br>
    □ NGT + posisi head-up 30–45° · □ Profilaksis DVT &amp; stress ulcer<br>
    □ Monitor: SpO₂, ETCO₂, ABG dalam 30–60 mnt pasca intubasi<br>
    <span style="color:var(--muted)">BB ${bb} kg · Skenario: ${sd.label} · NMB: ${nmbPref} · Ref: Walls RM 2022 · Brown CA NEJM 2023</span>
  </div>`;

  document.getElementById('itu-result-content').innerHTML=html;
  document.getElementById('itu-results').classList.remove('hidden');
}

const drugData={
  fentanyl:{name:'Fentanyl',unit:'mcg/kg/jam',low:25,mid:50,high:100,syringe:'Fentanyl 500 mcg dalam 50 mL NaCl (10 mcg/mL)',note:'Opioid paling sering ICU. Hati-hati akumulasi pada gagal ginjal.',reff:'PADIS 2018'},
  morphin:{name:'Morphin',unit:'mcg/kg/jam',low:20,mid:40,high:80,syringe:'Morphin 20 mg dalam 20 mL NaCl (1 mg/mL)',note:'Histamin-releaser; hindari pada asma/bronkospasme. Akumulasi gagal ginjal.',reff:'Lexicomp 2024'},
  midazolam:{name:'Midazolam',unit:'mcg/kg/mnt',low:0.02,mid:0.05,high:0.1,syringe:'Midazolam 50 mg dalam 50 mL NaCl (1 mg/mL)',note:'Hindari rutin ICU (risiko delirium, withdrawal). Gunakan jika propofol kontraindikasi.',reff:'PADIS 2018'},
  propofol:{name:'Propofol 1%',unit:'mcg/kg/mnt',low:5,mid:15,high:50,syringe:'Propofol 1% ready-to-use (10 mg/mL)',note:'Onset cepat, titrasi mudah. Propofol infusion syndrome >48 jam dosis >70 mcg/kg/mnt. Monitor TG.',reff:'BNF 2024'},
  dexmed:{name:'Dexmedetomidine',unit:'mcg/kg/jam',low:0.2,mid:0.5,high:1.4,syringe:'Dexmedetomidine 200 mcg dalam 50 mL NaCl (4 mcg/mL)',note:'Alpha-2 agonist. Tidak depresi napas. Menurunkan delirium. Hindari bradikardia/blok jantung.',reff:'Riker RR. JAMA 2009 (MENDS)'},
  norepinef:{name:'Norepinefrin',unit:'mcg/kg/mnt',low:0.05,mid:0.15,high:0.5,syringe:'Norepinefrin 4 mg dalam 50 mL D5% (80 mcg/mL)',note:'Vasopressor lini pertama syok septik. Target MAP ≥65 mmHg.',reff:'SSC 2021'},
  dopamin:{name:'Dopamin',unit:'mcg/kg/mnt',low:3,mid:10,high:20,syringe:'Dopamin 200 mg dalam 50 mL D5% (4000 mcg/mL)',note:'<3: renal dose. 3–10: inotropik. >10: vasopressor. Lebih aritmogenik dari NE.',reff:'De Backer D. NEJM 2010'},
  dobutamin:{name:'Dobutamin',unit:'mcg/kg/mnt',low:2,mid:5,high:15,syringe:'Dobutamin 250 mg dalam 50 mL D5% (5000 mcg/mL)',note:'Inotropik pada syok kardiogenik. Dapat turunkan MAP (vasodilatasi).',reff:'ESC HF Guidelines 2021'},
  atrakurium:{name:'Atrakurium',unit:'mcg/kg/mnt',low:5,mid:8,high:12,syringe:'Atrakurium 250 mg dalam 50 mL NaCl (5 mg/mL)',note:'NMB non-depolarizing. Metabolisme Hoffman (tidak tergantung organ). Monitor TOF.',reff:'Lexicomp 2024'},
  cisatrakurium:{name:'Cisatrakurium',unit:'mcg/kg/mnt',low:1,mid:2,high:3,syringe:'Cisatrakurium 20 mg dalam 20 mL NaCl (1 mg/mL)',note:'Pilihan utama NMB ICU. Histamine-free. Terbukti pada ARDS P/F <120 (ACURASYS).',reff:'Papazian NEJM 2010'},
  nitrogliserin:{name:'Nitrogliserin',unit:'mcg/mnt',low:10,mid:40,high:200,syringe:'Nitrogliserin 50 mg dalam 50 mL D5% (1 mg/mL)',note:'Venodilator → ↓ preload. Pada edema paru, ACS. Hindari hipotensi berat.',reff:'ESC ACS Guidelines 2023'},
  amiodarone:{name:'Amiodarone',unit:'mg/jam',low:0.5,mid:1,high:1.5,syringe:'Amiodarone 450 mg dalam 250 mL D5% (1.8 mg/mL)',note:'Maintenance: 0.5–1 mg/mnt. Loading: 150–300 mg IV bolus (AF/VT). Kompatibel D5% saja.',reff:'ACC/AHA 2023'}
};

function calcDrug(){
  const bb=parseFloat(document.getElementById('drugBB').value);
  const rass=document.getElementById('drugRASS').value;
  const pain=document.getElementById('drugPain').value;
  if(!bb){alert('Masukkan berat badan');return;}
  let html='';
  html+='<div class="subsec">Analgesik (Analgesia First)</div>';
  html+='<table class="drug-table"><tr><th>Obat</th><th>Dosis Awal</th><th>Dosis Target</th><th>Dosis Max</th><th>Syringe 50 mL</th></tr>';
  const fentDose=pain==='mild'?25:pain==='moderate'?50:75;
  const fentMl=(fentDose*bb)/(10*60);
  html+=`<tr><td class="drug-name">Fentanyl</td><td class="dose-val">${fentDose} mcg/kg/jam</td><td>${(fentDose*bb/1000).toFixed(2)} mg/jam</td><td>200 mcg/kg/jam</td><td class="vol-val">${fentMl.toFixed(2)} mL/jam</td></tr>`;
  const morphDose=pain==='mild'?20:pain==='moderate'?40:60;
  const morphMl=(morphDose*bb)/(1000*60);
  html+=`<tr><td class="drug-name">Morphin (alt)</td><td class="dose-val">${morphDose} mcg/kg/jam</td><td>${(morphDose*bb/1000).toFixed(2)} mg/jam</td><td>80 mcg/kg/jam</td><td class="vol-val">${morphMl.toFixed(2)} mL/jam</td></tr>`;
  html+='</table>';
  html+='<div class="subsec" style="margin-top:12px">Sedatif (Setelah Analgesia Adekuat)</div>';
  html+='<table class="drug-table"><tr><th>Obat</th><th>Dosis</th><th>Konsentrasi</th><th>Rate</th><th>Catatan</th></tr>';
  const propDose=rass==='light'?5:rass==='moderate'?15:30;
  const propMl=(propDose*bb*60)/(10000);
  html+=`<tr><td class="drug-name">Propofol 1%</td><td class="dose-val">${propDose} mcg/kg/mnt</td><td>10 mg/mL (ready)</td><td class="vol-val">${propMl.toFixed(1)} mL/jam</td><td>Monitor TG >48 jam</td></tr>`;
  const dexDose=rass==='light'?0.3:rass==='moderate'?0.6:1.0;
  const dexMl=(dexDose*bb)/4;
  html+=`<tr><td class="drug-name">Dexmedetomidine</td><td class="dose-val">${dexDose} mcg/kg/jam</td><td>4 mcg/mL (200mcg/50mL)</td><td class="vol-val">${dexMl.toFixed(1)} mL/jam</td><td>Anti-delirium; tidak depresi napas</td></tr>`;
  if(rass==='deep'){
    const midDose=0.05;const midMl=(midDose*bb*60)/1000;
    html+=`<tr><td class="drug-name">Midazolam (deep)</td><td class="dose-val">${midDose} mg/kg/jam</td><td>1 mg/mL (50mg/50mL)</td><td class="vol-val">${midMl.toFixed(1)} mL/jam</td><td>Hanya jika propofol/dex tidak cukup</td></tr>`;
  }
  html+='</table>';
  if(rass==='deep'){
    html+='<div class="subsec" style="margin-top:12px">Paralitik (NMB) — Jika Diperlukan</div>';
    html+='<table class="drug-table"><tr><th>Obat</th><th>Dosis</th><th>Konsentrasi</th><th>Rate</th><th>Indikasi</th></tr>';
    const cisDose=2;const cisMl=(cisDose*bb*60)/(1000);
    html+=`<tr><td class="drug-name">Cisatrakurium</td><td class="dose-val">${cisDose} mcg/kg/mnt</td><td>1 mg/mL (20mg/20mL)</td><td class="vol-val">${cisMl.toFixed(1)} mL/jam</td><td>ARDS P/F &lt;120; status epileptikus; ECMO</td></tr>`;
    const atrDose=8;const atrMl=(atrDose*bb*60)/(5000);
    html+=`<tr><td class="drug-name">Atrakurium (alt)</td><td class="dose-val">${atrDose} mcg/kg/mnt</td><td>5 mg/mL</td><td class="vol-val">${atrMl.toFixed(1)} mL/jam</td><td>Monitor TOF (train-of-four) wajib</td></tr>`;
    html+='</table>';
  }
  html+=`<div class="warn" style="margin-top:12px;margin-bottom:0"><strong>⚠ Monitoring Wajib</strong>RASS setiap 4 jam · CPOT untuk nyeri · CAM-ICU untuk delirium · SAT setiap pagi · TOF jika menggunakan NMB · TG jika propofol &gt;48 jam</div>`;
  html+=`<div class="formula-note" style="margin-top:8px">BB digunakan: ${bb} kg · Target RASS: ${rass} · Nyeri: ${pain} · Semua dosis berbasis PADIS Guidelines 2018 (Devlin JW, Crit Care Med 2018)</div>`;
  document.getElementById('drug-result-content').innerHTML=html;
  document.getElementById('drug-results').classList.remove('hidden');
}
