/* ============================================================
   scripts-kalkulator-nlr.js
   Halaman: kalkulator-nlr.html
   Fungsi: setNLRMode, updateNLRPctPreview, calcNLR
   ============================================================ */

var _nlrMode = 'abs';

function setNLRMode(mode) {
  _nlrMode = mode;
  var absDiv = document.getElementById('nlr-input-abs');
  var pctDiv = document.getElementById('nlr-input-pct');
  var btnAbs = document.getElementById('nlr-btn-abs');
  var btnPct = document.getElementById('nlr-btn-pct');
  if (mode === 'abs') {
    absDiv.style.display = '';
    pctDiv.style.display = 'none';
    btnAbs.style.background = 'var(--accent)';
    btnAbs.style.color = '#000';
    btnAbs.style.borderColor = 'var(--accent)';
    btnPct.style.background = 'transparent';
    btnPct.style.color = 'var(--muted)';
    btnPct.style.borderColor = 'var(--border)';
  } else {
    absDiv.style.display = 'none';
    pctDiv.style.display = '';
    btnPct.style.background = 'var(--accent)';
    btnPct.style.color = '#000';
    btnPct.style.borderColor = 'var(--accent)';
    btnAbs.style.background = 'transparent';
    btnAbs.style.color = 'var(--muted)';
    btnAbs.style.borderColor = 'var(--border)';
  }
  var res = document.getElementById('nlr-results');
  if (res) res.classList.add('hidden');
}

function updateNLRPctPreview() {
  var wbc = parseFloat(document.getElementById('nlr-wbc-pct').value);
  var np  = parseFloat(document.getElementById('nlr-neut-pct').value);
  var lp  = parseFloat(document.getElementById('nlr-lymph-pct').value);
  var mp  = parseFloat(document.getElementById('nlr-mono-pct').value);
  var el  = document.getElementById('nlr-pct-preview');
  if (!el) return;
  if (isNaN(wbc) || isNaN(np) || isNaN(lp)) { el.textContent = ''; return; }
  var neut  = (np  / 100 * wbc).toFixed(2);
  var lymph = (lp  / 100 * wbc).toFixed(2);
  var mono  = isNaN(mp) ? '—' : (mp / 100 * wbc).toFixed(2);
  el.innerHTML = 'Absolut dihitung: Neutrofil <strong>' + neut + '</strong> · Limfosit <strong>' + lymph + '</strong> · Monosit <strong>' + mono + '</strong> (10³/µL)';
}

function calcNLR(){
  var neut, lymph, mono, plt, wbc;

  if (_nlrMode === 'pct') {
    var wbcPct  = parseFloat(document.getElementById('nlr-wbc-pct').value);
    var np      = parseFloat(document.getElementById('nlr-neut-pct').value);
    var lp      = parseFloat(document.getElementById('nlr-lymph-pct').value);
    var mp      = parseFloat(document.getElementById('nlr-mono-pct').value);
    if (isNaN(wbcPct) || isNaN(np) || isNaN(lp)) { alert('Masukkan WBC total, Neutrofil%, dan Limfosit%'); return; }
    neut  = np  / 100 * wbcPct;
    lymph = lp  / 100 * wbcPct;
    mono  = isNaN(mp) ? NaN : mp / 100 * wbcPct;
    plt   = parseFloat(document.getElementById('nlr-plt-pct').value);
    wbc   = wbcPct;
  } else {
    neut  = parseFloat(document.getElementById('nlr-neut').value);
    lymph = parseFloat(document.getElementById('nlr-lymph').value);
    mono  = parseFloat(document.getElementById('nlr-mono').value);
    plt   = parseFloat(document.getElementById('nlr-plt').value);
    wbc   = parseFloat(document.getElementById('nlr-wbc').value)||null;
  }

  if(!neut||!lymph){alert('Masukkan minimal neutrofil dan limfosit');return;}
  if(!neut||!lymph){alert('Masukkan minimal neutrofil dan limfosit absolut');return;}

  const nlr=neut/lymph;
  const plr=plt?plt/lymph:null;
  const sii=(plt)?(neut*plt)/lymph:null;
  const mlr=mono?mono/lymph:null;

  let wbcNote='';
  if(wbc&&(neut+lymph+(mono||0))>0){
    const diff=neut+(lymph)+(mono||0);
    const ratio=diff/wbc;
    if(ratio<0.6||ratio>1.1)wbcNote=`⚠ Jumlah diff (${diff.toFixed(1)}) tidak sesuai dengan leukosit total (${wbc}) — periksa input nilai absolut vs persentase.`;
  }

  function badge(val,low,mid,high,lowLabel,midLabel,highLabel){
    if(val<=low)return{cls:'abg-normal',color:'var(--green)',label:lowLabel};
    if(val<=mid)return{cls:'abg-mild',color:'var(--amber)',label:midLabel};
    return{cls:'abg-severe',color:'var(--red)',label:highLabel};
  }

  const nlrB=badge(nlr,3,5,9,'Normal (1–3)','Meningkat (3–5)','Tinggi (>5)');
  const plrB=plr?badge(plr,150,300,999,'Normal (50–150)','Meningkat (150–300)','Tinggi (>300)'):null;
  const siiB=sii?badge(sii,500,1000,9999,'Normal (<500)','Meningkat (500–1000)','Kritis (>1000)'):null;
  const mlrB=mlr?badge(mlr,0.3,0.5,999,'Normal (<0.3)','Meningkat (0.3–0.5)','Tinggi (>0.5)'):null;

  let html='<div class="result-grid">';
  html+=`<div class="result-card" style="border-color:${nlrB.color}"><div class="result-label">NLR ⭐</div><div class="result-value" style="color:${nlrB.color}">${nlr.toFixed(2)}</div><div class="result-sub">${nlrB.label}</div></div>`;
  if(plr!==null)html+=`<div class="result-card" style="border-color:${plrB.color}"><div class="result-label">PLR</div><div class="result-value" style="color:${plrB.color}">${plr.toFixed(1)}</div><div class="result-sub">${plrB.label}</div></div>`;
  if(sii!==null)html+=`<div class="result-card" style="border-color:${siiB.color}"><div class="result-label">SII</div><div class="result-value" style="color:${siiB.color}">${Math.round(sii)}</div><div class="result-sub">${siiB.label}</div></div>`;
  if(mlr!==null)html+=`<div class="result-card" style="border-color:${mlrB.color}"><div class="result-label">MLR</div><div class="result-value" style="color:${mlrB.color}">${mlr.toFixed(2)}</div><div class="result-sub">${mlrB.label}</div></div>`;
  html+='</div>';

  let nlrInterp,nlrCls;
  if(nlr<=3){nlrInterp='NLR normal — tidak ada inflamasi sistemik signifikan.';nlrCls='teal';}
  else if(nlr<=5){nlrInterp='NLR meningkat — inflamasi aktif. Evaluasi konteks klinis (infeksi, stres, post-op).';nlrCls='amber';}
  else if(nlr<=9){nlrInterp='NLR tinggi — inflamasi berat. Berkorelasi dengan sepsis, pneumonia berat, AMI. Pertimbangkan eskalasi terapi.';nlrCls='amber';}
  else{nlrInterp='NLR sangat tinggi (>9) — prediktor mortalitas ICU. Indikator respons inflamasi masif. Monitor ketat.';nlrCls='red';}

  html+=`<div class="cc ${nlrCls}" style="margin-top:10px"><div class="ct">Interpretasi NLR: ${nlr.toFixed(2)}</div><p>${nlrInterp}</p></div>`;

  html+=`<div class="subsec" style="margin-top:12px">Interpretasi per Konteks Klinis</div>
  <table><tr><th>Kondisi</th><th>NLR Cut-off</th><th>Signifikansi</th></tr>
  <tr><td>Sepsis / Infeksi berat</td><td>&gt;5–7</td><td>Prediktor outcome buruk, mortalitas 28-hari meningkat</td></tr>
  <tr><td>COVID-19</td><td>&gt;3.13</td><td>Prediksi ICU admission (Sen 77%, Spes 79%)</td></tr>
  <tr><td>Pneumonia (CAP)</td><td>&gt;5</td><td>Berkorelasi dengan CURB-65 ≥3 dan mortalitas</td></tr>
  <tr><td>Infark Miokard Akut</td><td>&gt;3.4</td><td>Prediktor mortalitas jangka panjang</td></tr>
  <tr><td>Post-operasi</td><td>&gt;5 (hari ke-1)</td><td>Risiko komplikasi infeksi post-op meningkat</td></tr>
  <tr><td>Keganasan (onkologi)</td><td>&gt;3–5</td><td>Prognostik negatif pada berbagai jenis kanker</td></tr>
  </table>`;

  if(wbcNote)html+=`<div class="warn" style="margin-top:10px;margin-bottom:0"><strong>⚠ Periksa Input</strong>${wbcNote}</div>`;
  html+=`<div class="formula-note" style="margin-top:8px">NLR = Neutrofil/Limfosit · PLR = Trombosit/Limfosit · SII = (Neutrofil×Trombosit)/Limfosit · MLR = Monosit/Limfosit<br>Input harus berupa nilai <strong>absolut</strong> (10³/μL), bukan persentase. &nbsp;|&nbsp; Zahorec R. Bratisl Lek Listy 2001 · Hu B. J Cancer 2014;5:442</div>`;

  document.getElementById('nlr-result-content').innerHTML=html;
  document.getElementById('nlr-results').classList.remove('hidden');
}
