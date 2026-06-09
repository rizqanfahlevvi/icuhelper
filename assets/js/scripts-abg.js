/* ============================================================
   scripts-abg.js · v2.0
   ABG Interpreter — ICU/IGD
   ============================================================ */

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function () {
  const unitDefaults = { paco2: 'mmHg', hco3: 'mmol/L', na: 'mmol/L', cl: 'mmol/L', alb: 'g/dL' };
  Object.keys(unitDefaults).forEach(param => {
    const stored = localStorage.getItem('abg-unit-' + param) || unitDefaults[param];
    const btn = document.querySelector(`[data-unit="${param}"]`);
    if (btn) btn.textContent = stored;
  });
  setSpo2Source('pulse');
  syncFiO2Direct();
});

/* ===== THEORY DROPDOWN ===== */
function toggleTheory(id) {
  const btn = event.currentTarget;
  const content = document.getElementById('theory-' + id);
  if (!content) return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

/* ===== UNIT TOGGLE ===== */
function toggleUnit(param) {
  const units = {
    paco2: ['mmHg', 'kPa'],
    hco3:  ['mmol/L', 'mEq/L'],
    na:    ['mmol/L', 'mEq/L'],
    cl:    ['mmol/L', 'mEq/L'],
    alb:   ['g/dL', 'mg/dL']
  };
  const inputMap = { paco2: 'abgCO2', hco3: 'abgHCO3', na: 'abgNa', cl: 'abgCl', alb: 'abgAlb' };
  const key = 'abg-unit-' + param;
  const arr = units[param];
  const current = localStorage.getItem(key) || arr[0];
  const next = current === arr[0] ? arr[1] : arr[0];

  const input = document.getElementById(inputMap[param]);
  if (input && input.value) {
    let val = parseFloat(input.value);
    if (!isNaN(val)) {
      if (param === 'paco2') {
        val = current === 'mmHg' ? val / 7.5006 : val * 7.5006;
        input.value = val.toFixed(current === 'mmHg' ? 2 : 0);
      } else if (param === 'alb') {
        val = current === 'g/dL' ? val * 1000 : val / 1000;
        input.value = val.toFixed(current === 'g/dL' ? 0 : 1);
      }
      // hco3 / na / cl: 1:1, hanya ganti label
    }
  }

  // Update atribut input agar UX konsisten
  if (param === 'paco2' && input) {
    if (next === 'kPa') { input.min = 1; input.max = 20; input.step = 0.1; input.placeholder = '4.7–6.0'; }
    else { input.min = 10; input.max = 150; input.step = 1; input.placeholder = '35–45'; }
  }
  if (param === 'alb' && input) {
    if (next === 'mg/dL') { input.max = 6000; input.step = 100; input.placeholder = '3500–5000 (opsional)'; }
    else { input.max = 6; input.step = 0.1; input.placeholder = '3.5–5 (opsional)'; }
  }

  localStorage.setItem(key, next);
  const btn = document.querySelector(`[data-unit="${param}"]`);
  if (btn) btn.textContent = next;
}

/* ===== FiO₂ DUAL MODE ===== */
function setFiO2Mode(mode) {
  const directWrap   = document.getElementById('fio2DirectWrap');
  const lowflowWrap  = document.getElementById('fio2LowflowWrap');
  const btnDirect    = document.getElementById('fio2BtnDirect');
  const btnLowflow   = document.getElementById('fio2BtnLowflow');
  if (mode === 'direct') {
    directWrap.style.display  = '';
    lowflowWrap.style.display = 'none';
    btnDirect.classList.add('active');
    btnLowflow.classList.remove('active');
    syncFiO2Direct();
  } else {
    directWrap.style.display  = 'none';
    lowflowWrap.style.display = '';
    btnDirect.classList.remove('active');
    btnLowflow.classList.add('active');
    estimateFiO2();
  }
}

function syncFiO2Direct() {
  const src    = document.getElementById('abgFiO2Direct');
  const hidden = document.getElementById('abgFiO2');
  if (src && hidden && src.value) hidden.value = src.value;
}

function estimateFiO2() {
  const deviceEl = document.getElementById('abgO2Device');
  const flowEl   = document.getElementById('abgO2Flow');
  if (!deviceEl) return;
  const device    = deviceEl.value;
  const flow      = parseFloat(flowEl ? flowEl.value : '');
  const isVenturi = device.startsWith('venturi');

  if (flowEl) flowEl.style.display = isVenturi ? 'none' : '';

  let fio2 = 0.21;
  if (isVenturi) {
    fio2 = parseInt(device.replace('venturi', '')) / 100;
  } else if (device === 'nasal' && !isNaN(flow)) {
    fio2 = Math.min(0.21 + 0.04 * flow, 0.44);
  } else if (device === 'simple' && !isNaN(flow)) {
    if (flow <= 6) fio2 = 0.35;
    else if (flow >= 10) fio2 = 0.60;
    else fio2 = 0.35 + (flow - 6) * 0.0625;
  } else if (device === 'nrm' && !isNaN(flow)) {
    if (flow <= 10) fio2 = 0.80;
    else if (flow >= 15) fio2 = 0.95;
    else fio2 = 0.80 + (flow - 10) * 0.03;
  }

  const hidden = document.getElementById('abgFiO2');
  if (hidden) hidden.value = fio2.toFixed(2);

  const est = document.getElementById('abgFiO2Est');
  if (est) {
    est.textContent = (isVenturi || !isNaN(flow))
      ? `Estimasi FiO₂ ≈ ${(fio2 * 100).toFixed(0)}% (${fio2.toFixed(2)})`
      : '';
  }
}

/* ===== SpO₂ SOURCE ===== */
function setSpo2Source(src) {
  const btnPulse = document.getElementById('spo2BtnPulse');
  const btnABG   = document.getElementById('spo2BtnABG');
  const note     = document.getElementById('spo2SourceNote');
  if (src === 'pulse') {
    if (btnPulse) btnPulse.classList.add('active');
    if (btnABG)   btnABG.classList.remove('active');
    if (note)     note.style.display = '';
  } else {
    if (btnPulse) btnPulse.classList.remove('active');
    if (btnABG)   btnABG.classList.add('active');
    if (note)     note.style.display = 'none';
  }
  // store in a hidden input for calcABG() to read
  let hidden = document.getElementById('spo2SourceVal');
  if (!hidden) {
    hidden = document.createElement('input');
    hidden.type = 'hidden'; hidden.id = 'spo2SourceVal';
    document.body.appendChild(hidden);
  }
  hidden.value = src;
}

/* ===== RESET ===== */
function resetABG() {
  ['abgPH','abgCO2','abgO2','abgHCO3','abgBE','abgSpO2',
   'abgFiO2','abgFiO2Direct','abgMAP','abgNa','abgCl',
   'abgAlb','abgLaktat','abgRR','abgO2Flow'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const est = document.getElementById('abgFiO2Est');
  if (est) est.textContent = '';
  setSpo2Source('pulse');
  setFiO2Mode('direct');
  document.getElementById('abg-results').classList.add('hidden');
}

/* ===== ABG INTERPRETER ===== */
function calcABG() {
  // Sync direct FiO₂ ke hidden field
  syncFiO2Direct();

  // === UNIT CONVERSION LAYER ===
  const paco2Unit = localStorage.getItem('abg-unit-paco2') || 'mmHg';
  const albUnit   = localStorage.getItem('abg-unit-alb')   || 'g/dL';

  const pH = parseFloat(document.getElementById('abgPH').value);
  let pco2 = parseFloat(document.getElementById('abgCO2').value);
  if (paco2Unit === 'kPa' && !isNaN(pco2)) pco2 = pco2 * 7.5006;

  const po2   = parseFloat(document.getElementById('abgO2').value);
  const hco3  = parseFloat(document.getElementById('abgHCO3').value);
  const be    = parseFloat(document.getElementById('abgBE').value) || 0;
  const spo2  = parseFloat(document.getElementById('abgSpO2').value) || null;
  const fio2  = parseFloat(document.getElementById('abgFiO2').value) || null;
  const mapV  = parseFloat(document.getElementById('abgMAP').value) || null;
  const na    = parseFloat(document.getElementById('abgNa').value) || null;
  const cl    = parseFloat(document.getElementById('abgCl').value) || null;
  let   alb   = parseFloat(document.getElementById('abgAlb').value) || null;
  if (alb && albUnit === 'mg/dL') alb = alb / 1000;
  const laktat  = parseFloat(document.getElementById('abgLaktat').value) || null;
  const rr      = parseFloat(document.getElementById('abgRR').value) || null;
  const kondisi = document.getElementById('abgKondisi').value;

  // SpO₂ source
  const spo2SourceVal = (document.getElementById('spo2SourceVal') || {value:'pulse'}).value;
  const spo2Source    = spo2SourceVal === 'pulse' ? 'SpO₂ (Pulse Ox)' : 'SaO₂ (ABG)';

  // Label satuan untuk Langkah 1
  const paco2Label = paco2Unit === 'kPa'
    ? `${(pco2 / 7.5006).toFixed(1)} kPa (= ${pco2.toFixed(0)} mmHg)`
    : `${pco2.toFixed(0)} mmHg`;

  if (!pH || !pco2 || !hco3) { alert('Minimal masukkan pH, PaCO₂, dan HCO₃⁻'); return; }

  let html = '';

  // LANGKAH 1: STATUS pH
  let phStatus, phColor, phClass;
  if (pH < 7.35) {
    phStatus = pH < 7.20 ? 'Asidemia BERAT (pH <7.20)' : 'Asidemia';
    phColor = 'var(--red)'; phClass = 'abg-severe';
  } else if (pH > 7.45) {
    phStatus = pH > 7.55 ? 'Alkalemia BERAT (pH >7.55)' : 'Alkalemia';
    phColor = 'var(--amber)'; phClass = 'abg-mild';
  } else {
    phStatus = 'pH Normal (7.35–7.45)';
    phColor = 'var(--green)'; phClass = 'abg-normal';
  }
  html += `<div class="abg-result ${phClass}">
    <div class="abg-label" style="color:${phColor}">Langkah 1 — Status pH</div>
    <div class="abg-interp">${phStatus}</div>
    <div class="abg-detail">pH = ${pH} · PaCO₂ = ${paco2Label} · HCO₃⁻ = ${hco3} mmol/L · BE = ${be} mEq/L${alb ? ` · Albumin = ${albUnit === 'mg/dL' ? (alb * 1000).toFixed(0) + ' mg/dL' : alb.toFixed(1) + ' g/dL'}` : ''}</div>
  </div>`;

  // LANGKAH 2: GANGGUAN PRIMER
  const acidosis = pH < 7.35, alkalosis = pH > 7.45;
  const respAcid = pco2 > 45, respAlk = pco2 < 35;
  const metAcid  = hco3 < 22 || be < -2, metAlk = hco3 > 26 || be > 2;
  let primary = '';
  if (acidosis) {
    if (respAcid && metAcid) primary = 'Mixed: Asidosis Respiratorik + Asidosis Metabolik';
    else if (respAcid) primary = 'Asidosis Respiratorik Primer';
    else if (metAcid) primary = 'Asidosis Metabolik Primer';
    else primary = 'Asidemia — penyebab tidak jelas (cek nilai)';
  } else if (alkalosis) {
    if (respAlk && metAlk) primary = 'Mixed: Alkalosis Respiratorik + Alkalosis Metabolik';
    else if (respAlk) primary = 'Alkalosis Respiratorik Primer';
    else if (metAlk) primary = 'Alkalosis Metabolik Primer';
    else primary = 'Alkalemia — penyebab tidak jelas';
  } else {
    if (respAcid && metAlk) primary = 'pH Normal — Mixed: Asidosis Resp terkompensasi oleh Alkalosis Met';
    else if (respAlk && metAcid) primary = 'pH Normal — Mixed: Alkalosis Resp terkompensasi oleh Asidosis Met';
    else if (!respAcid && !respAlk && !metAcid && !metAlk) primary = 'ABG Normal — tidak ada gangguan primer';
    else primary = 'pH Normal dengan kompensasi atau mixed disorder';
  }
  html += `<div class="abg-result abg-blue" style="margin-top:6px">
    <div class="abg-label" style="color:var(--blue)">Langkah 2 — Gangguan Primer</div>
    <div class="abg-interp">${primary}</div>
    <div class="abg-detail">PaCO₂ = ${pco2.toFixed(0)} mmHg (N:35–45) · HCO₃⁻ = ${hco3} mmol/L (N:22–26) · BE = ${be}</div>
  </div>`;

  // LANGKAH 3: KOMPENSASI
  let compNote = '';
  if (respAcid && !respAlk) {
    const expAcute   = 24 + 0.1  * (pco2 - 40);
    const expChronic = 24 + 0.35 * (pco2 - 40);
    if (Math.abs(hco3 - expAcute) <= 2)
      compNote = `Asidosis Resp AKUT — Kompensasi metabolik adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)}, actual: ${hco3})`;
    else if (Math.abs(hco3 - expChronic) <= 3)
      compNote = `Asidosis Resp KRONIK — Kompensasi metabolik adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)}, actual: ${hco3})`;
    else if (hco3 > expChronic + 3)
      compNote = `Asidosis Resp + Alkalosis Metabolik Concurrent (HCO₃⁻ ${hco3} > expected kronik ${expChronic.toFixed(1)}+3)`;
    else
      compNote = `Kompensasi TIDAK ADEKUAT — Mixed disorder? Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`;
  } else if (respAlk) {
    const expAcute   = 24 - 0.2 * (40 - pco2);
    const expChronic = 24 - 0.5 * (40 - pco2);
    if (Math.abs(hco3 - expAcute) <= 2.5)
      compNote = `Alkalosis Resp AKUT — Kompensasi adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)})`;
    else if (Math.abs(hco3 - expChronic) <= 2.5)
      compNote = `Alkalosis Resp KRONIK — Kompensasi adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)})`;
    else
      compNote = `Alkalosis Resp + kemungkinan Asidosis Met Concurrent. Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`;
  } else if (metAcid && hco3 < 22) {
    const expPCO2 = 1.5 * hco3 + 8;
    if (Math.abs(pco2 - expPCO2) <= 2)
      compNote = `Asidosis Metabolik — Kompensasi respiratorik adekuat (Winter's: expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`;
    else if (pco2 > expPCO2 + 2)
      compNote = `Asidosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > Winter's ${expPCO2.toFixed(0)})`;
    else
      compNote = `Asidosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < Winter's ${expPCO2.toFixed(0)})`;
  } else if (metAlk && hco3 > 26) {
    const expPCO2 = 0.7 * hco3 + 21;
    if (Math.abs(pco2 - expPCO2) <= 2)
      compNote = `Alkalosis Metabolik — Kompensasi respiratorik adekuat (Expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`;
    else if (pco2 < expPCO2 - 2)
      compNote = `Alkalosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < expected ${expPCO2.toFixed(0)})`;
    else
      compNote = `Alkalosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > expected ${expPCO2.toFixed(0)})`;
  } else {
    compNote = 'Tidak ada gangguan primer signifikan — kompensasi tidak applicable.';
  }
  html += `<div class="abg-result abg-mild" style="margin-top:6px">
    <div class="abg-label" style="color:var(--amber)">Langkah 3 — Evaluasi Kompensasi</div>
    <div class="abg-detail">${compNote}</div>
  </div>`;

  // LANGKAH 4: ANION GAP (agHigh dihoisting ke scope luar untuk Langkah 7)
  let agHigh = false;
  if (na && cl) {
    const ag     = na - (cl + hco3);
    const agCorr = alb ? ag + 2.5 * (4 - alb) : null;
    agHigh = agCorr ? agCorr > 14 : ag > 12;
    let agNote = `AG = ${na} − (${cl} + ${hco3}) = ${ag} mEq/L (Normal 8–12)`;
    if (agCorr !== null) agNote += ` · AG terkoreksi albumin: ${agCorr.toFixed(1)} (Albumin ${alb.toFixed(1)} g/dL)`;
    let ddNote = '';
    if (agHigh && metAcid) {
      const dd = (ag - 12) / (24 - hco3);
      if (dd < 0.4)      ddNote = `Delta-Delta = ${dd.toFixed(2)} (<0.4) → Mixed HAGMA + Non-AGMA (misalnya: ketoasidosis + RTA)`;
      else if (dd <= 1)  ddNote = `Delta-Delta = ${dd.toFixed(2)} (0.4–1.0) → Non-anion gap metabolic acidosis concurrent`;
      else if (dd <= 2)  ddNote = `Delta-Delta = ${dd.toFixed(2)} (1–2) → Pure HAGMA (tanpa komponen non-AG)`;
      else               ddNote = `Delta-Delta = ${dd.toFixed(2)} (>2) → HAGMA + Alkalosis Metabolik Concurrent (HCO₃⁻ lebih tinggi dari expected)`;
    }
    html += `<div class="abg-result ${agHigh ? 'abg-severe' : 'abg-normal'}" style="margin-top:6px">
      <div class="abg-label" style="color:${agHigh ? 'var(--red)' : 'var(--green)'}">Langkah 4 — Anion Gap${agCorr !== null ? ' (terkoreksi albumin)' : ''}</div>
      <div class="abg-interp">${agNote}</div>
      ${ddNote ? `<div class="abg-detail" style="margin-top:4px">${ddNote}</div>` : ''}
      ${agHigh ? `<div class="abg-detail" style="margin-top:4px">Penyebab HAGMA: Laktat, Ketoasidosis (DKA/alkohol), Uremia, Racun (metanol/etilen glikol), Salisilat — Mnemonic LKURS</div>` : ''}
    </div>`;
  }

  // LANGKAH 5: LAKTAT
  if (laktat) {
    const lakColor = laktat < 2 ? 'var(--green)' : laktat < 4 ? 'var(--amber)' : 'var(--red)';
    const lakNote  = laktat < 2
      ? 'Normal (<2 mmol/L)'
      : laktat < 4
        ? `Hiperlaktatemia (${laktat} mmol/L) — waspada hipoperfusi/HAGMA`
        : `Laktat BERAT (${laktat} mmol/L) — asidosis laktat, mortalitas ↑ signifikan`;
    html += `<div class="abg-result ${laktat < 2 ? 'abg-normal' : laktat < 4 ? 'abg-mild' : 'abg-severe'}" style="margin-top:6px">
      <div class="abg-label" style="color:${lakColor}">Langkah 5 — Laktat</div>
      <div class="abg-interp">${lakNote}</div>
      <div class="abg-detail">${laktat >= 2 ? 'Evaluasi: syok (Tipe A), DKA, gagal hati, metformin, thiamine def (Tipe B)' : ''}</div>
    </div>`;
  }

  // LANGKAH 6: OKSIGENASI
  if (po2 || fio2 || spo2) {
    let oxHtml = '';
    if (po2 && fio2) {
      const pf      = po2 / fio2;
      const pfClass = pf >= 400 ? 'Normal' : pf >= 300 ? 'Hipoksemia ringan' : pf >= 200 ? 'ARDS Mild' : pf >= 100 ? 'ARDS Moderate' : 'ARDS Severe';
      const pfColor = pf >= 300 ? 'var(--green)' : pf >= 200 ? 'var(--amber)' : 'var(--red)';
      oxHtml += `P/F Ratio = ${pf.toFixed(0)} → <strong style="color:${pfColor}">${pfClass}</strong> `;
      const pao2calc = (fio2 * (760 - 47)) - (pco2 / 0.8);
      const aaGrad   = pao2calc - po2;
      oxHtml += `· A-a Gradient = ${aaGrad.toFixed(0)} mmHg (normal &lt;20) → ${aaGrad > 20 ? 'MENINGKAT (V/Q mismatch/shunt)' : 'Normal (hipoventilasi murni jika hipoksemia ada)'} `;
    }
    if (po2 && fio2 && mapV) {
      const oi = (mapV * fio2 * 100) / po2;
      oxHtml += `· OI = ${oi.toFixed(1)} (${oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat — ECMO?'})`;
    }
    if (spo2 && fio2 && rr) {
      const rox      = (spo2 / fio2) / rr;
      const roxColor = rox >= 4.88 ? 'var(--green)' : rox >= 3.85 ? 'var(--amber)' : 'var(--red)';
      oxHtml += `<br>ROX Index = (${spo2}/FiO₂${fio2})/RR${rr} = <strong style="color:${roxColor}">${rox.toFixed(2)}</strong> [sumber: <em>${spo2Source}</em>] → ${rox >= 4.88 ? 'Risiko HFNC gagal RENDAH' : rox >= 3.85 ? 'Intermediate — evaluasi ketat' : 'Risiko HFNC gagal TINGGI → pertimbangkan intubasi'}`;
    }
    if (oxHtml) {
      html += `<div class="abg-result abg-blue" style="margin-top:6px">
        <div class="abg-label" style="color:var(--blue)">Langkah 6 — Oksigenasi &amp; Gagal Napas</div>
        <div class="abg-detail">${oxHtml}</div>
      </div>`;
    }
  }

  // KONSIDERASI KLINIS
  let sugg = [];
  if (po2 && fio2) {
    const pf = po2 / fio2;
    if (pf < 100)       sugg.push('P/F <100 (ARDS Severe): ↑ PEEP 13–18, prone position jika P/F <150, pertimbangkan NMB cisatrakurium, ECMO jika OI >40');
    else if (pf < 200)  sugg.push('P/F 100–200 (ARDS Moderate): ↑ PEEP 8–13, FiO₂ 0.4–0.7, pertimbangkan prone jika tidak membaik');
    else if (pf < 300)  sugg.push('P/F 200–300 (ARDS Mild): PEEP 5–8, FiO₂ titrasi, evaluasi ventilasi lung-protective');
  }
  if (pH < 7.25 && pco2 > 50)  sugg.push('Asidosis respiratorik berat: ↑ RR atau ↑ VT (hati-hati Pplat), pertimbangkan NaHCO₃ jika pH <7.10 dengan ventilasi adekuat');
  if (pco2 < 35 && pH > 7.45)  sugg.push('Alkalosis respiratorik: ↓ RR (bertahap), cek dead space, pastikan tidak ada pain/agitasi yang meningkatkan drive');
  if (metAcid && be < -5)       sugg.push('Asidosis metabolik: koreksi penyebab primer (sepsis, hipovolemia, DKA). NaHCO₃ hanya jika pH <7.10 DAN ventilasi adekuat');
  if (pH > 7.50 && hco3 > 30)   sugg.push('Alkalosis metabolik: koreksi hipokalemia, hipokloremia; hentikan diuretik; KCl replacement');
  if (kondisi === 'copd' && pco2 > 55) sugg.push('PPOK: TARGET PaCO₂ = baseline pasien, bukan normocapnia! Koreksi bertahap — risiko alkalosis metabolik berat');
  if (kondisi === 'ards')        sugg.push('ARDS: Pertahankan driving pressure ≤15 cmH₂O. Toleransi permissive hypercapnia (PaCO₂ 45–65) jika pH >7.20');
  if (sugg.length > 0) {
    html += `<div class="abg-result abg-blue" style="margin-top:6px">
      <div class="abg-label" style="color:var(--blue)">Konsiderasi Klinis &amp; Saran Ventilator</div>
      <ul style="padding-left:16px;margin-top:4px">${sugg.map(s => `<li style="font-size:12px;margin-bottom:4px">${s}</li>`).join('')}</ul>
    </div>`;
  }

  // LANGKAH 7: KOREKSI ASAM-BASA & STRATEGI TATALAKSANA
  let mgmt = [];
  const anyDisorder = acidosis || alkalosis || (respAcid && !acidosis) || (respAlk && !alkalosis) || metAcid || metAlk;

  // ── KOREKSI ASAM-BASA SPESIFIK ──────────────────────────────────────────
  if (metAcid) {
    const isHAGMA   = agHigh;
    const isNAGMA   = na && cl && !agHigh;
    const bicarInd  = pH < 7.10 ? '⚠ TERINDIKASI (pH <7.10)' : pH < 7.20 ? 'Pertimbangkan (pH 7.10–7.20, esp. AKI/NAGMA)' : 'Belum terindikasi — koreksi penyebab primer dulu';
    mgmt.push({
      judul: 'Koreksi Asidosis Metabolik',
      color: 'var(--red)',
      isi: [
        `NaHCO₃ IV: ${bicarInd}`,
        `Formula dosis: 0.5 × BBideal(kg) × (target HCO₃ − ${hco3.toFixed(0)} mmol/L) = mEq NaHCO₃ — targetkan HCO₃ 12–15, BUKAN normalisasi penuh`,
        'Pemberian: ½ dosis dalam 4 jam pertama → evaluasi AGD → ½ sisanya jika perlu. NaHCO₃ 8.4% = 1 mEq/mL; NaHCO₃ 7.5% = 0.9 mEq/mL',
        'Perhatian: NaHCO₃ → ↑ PaCO₂ transien (CO₂ release dari buffer) — pastikan ventilasi adekuat. Hindari jika alkalosis concurrent (Δ-Δ >2)',
        isHAGMA ? 'HAGMA: Prioritas koreksi kausa (laktat → resusitasi, DKA → insulin, uremia → RRT, toksik → eliminasi)' : '',
        isNAGMA ? 'NAGMA: Identifikasi etiologi — diarrhea → rehidrasi; RTA → NaHCO₃ kronik 1–2 mEq/kg/hari; dilutional → hentikan saline, ganti ke balanced crystalloid' : '',
        'Monitoring post-koreksi: pH, PaCO₂, K⁺ (hipokalemia memburuk saat pH naik), Na⁺ (hati-hati Na overload)'
      ].filter(Boolean),
      ref: 'Kraut JA, Madias NE. NEJM 2014 · Jaber S et al. Lancet 2018 (BICAR-ICU) · Berend K. NEJM 2014'
    });
  }

  if (metAlk) {
    const severeAlk = hco3 > 40 || pH > 7.55;
    mgmt.push({
      judul: 'Koreksi Alkalosis Metabolik',
      color: 'var(--amber)',
      isi: [
        'Tentukan tipe: Chloride-responsive (urin Cl⁻ <20 mEq/L) vs Chloride-resistant (urin Cl⁻ >20 mEq/L)',
        'Chloride-responsive (muntah, NGT suction, diuretik): NaCl 0.9% IV + KCl replacement',
        'KCl IV: 10–20 mEq/jam via central line — koreksi hipokalemia WAJIB dulu (target K⁺ ≥3.5 mEq/L)',
        'Chloride-resistant (hiperaldosteronisme, Cushing, Bartter): koreksi underlying + spironolakton/amiloride',
        hco3 > 35 ? 'Acetazolamide 250–500 mg IV/8 jam: pilihan untuk CHF/fluid-overloaded (hindari eGFR <30, sulfa allergy)' : '',
        severeAlk ? 'Alkalosis BERAT (pH >7.55): pertimbangkan HCl 0.1N via CVC — dosis: 0.1 × BB × (HCO₃ aktual − 24) mEq, berikan dalam 12–24 jam, pantau ketat' : '',
        'Stop penyebab iatrogenik: kurangi/stop diuretik, hindari antasid berlebihan, kurangi transfusi sitrat'
      ].filter(Boolean),
      ref: 'Emmett M. CJASN 2020 · Gennari FJ. NEJM 1998 · Laski ME. Am J Kidney Dis 2006'
    });
  }

  if (respAcid && acidosis) {
    const permHyperCap = kondisi === 'ards' || (po2 && fio2 && (po2/fio2) < 200);
    mgmt.push({
      judul: 'Koreksi Asidosis Respiratorik',
      color: 'var(--red)',
      isi: [
        kondisi === 'copd'
          ? 'PPOK: TARGET PaCO₂ = baseline pasien (bukan 40 mmHg!) — koreksi agresif risiko alkalosis rebound berat'
          : 'Target: perbaiki ventilasi alveolar, bukan buffer HCO₃',
        kondisi === 'copd' || kondisi === 'umum'
          ? 'NIV BiPAP lini pertama (GCS baik, kooperatif): IPAP 12–18 / EPAP 4–8 cmH₂O, titrasi PaCO₂ turun 5–8 mmHg/jam'
          : '',
        'Intubasi jika: NIV gagal/kontraindikasi, GCS ↓ berat, sekresi tidak terkontrol, instabilitas hemodinamik',
        'Pada ventilator: ↑ RR 2–3/mnt bertahap (max 35/mnt), awasi auto-PEEP. ↑ VT 6→8 mL/kgBBP hanya jika Pplat <28 cmH₂O',
        permHyperCap ? `Permissive hypercapnia (ARDS/lung-protective): toleransi PaCO₂ hingga 70 mmHg jika pH >7.20 dan driving pressure ≤15 cmH₂O — JANGAN ↑ VT untuk "normalisasi" CO₂` : '',
        'NaHCO₃ TIDAK diindikasikan untuk asidosis resp murni — hanya sebagai bridge jika pH <7.10 dan ventilasi optimal sudah tercapai',
        'Bronkodilator nebulisasi: salbutamol 2.5 mg + ipratropium 0.5 mg q4–6h (esp. PPOK/asma)'
      ].filter(Boolean),
      ref: 'GOLD 2024 · Rochwerg B. Eur Respir J 2017 (NIV) · Matthay MA. NEJM 2019 · Slutsky AS. NEJM 2013 (lung-protective)'
    });
  }

  if (respAlk && alkalosis) {
    mgmt.push({
      judul: 'Koreksi Alkalosis Respiratorik',
      color: 'var(--amber)',
      isi: [
        'Koreksi penyebab: nyeri → analgesia (morfin/fentanyl titrasi); agitasi → sedasi (propofol/midazolam titrasi); sepsis → kultur + antibiotik',
        'Pada ventilator: ↓ RR 2/mnt bertahap (min 10/mnt), atau tambah dead space connector (increase anatomical dead space)',
        'Target pH <7.50 secara bertahap — koreksi terlalu cepat dapat presipitasi seizure (alkalosis akut → vasokonstriksi serebral)',
        'Elektrolit yang sering terganggu: hipokalemia, hipofosfatemia, hipokalsemia ionik — koreksi bersamaan',
        'Liver failure: alkalosis resp persisten akibat hiperammonemia — tidak bisa dicegah tanpa koreksi kausa hepatik',
        'Cek VD/VT meningkat jika PaCO₂ rendah persisten meski RR sudah diturunkan (dead space patologis)'
      ],
      ref: 'Berend K. NEJM 2014 · Laffey JG. NEJM 2002 · Seifter JL. NEJM 2023'
    });
  }

  // ── TATALAKSANA KONDISI KLINIS SPESIFIK ─────────────────────────────────
  if (agHigh && laktat && laktat >= 2) {
    mgmt.push({
      judul: 'Asidosis Laktat / HAGMA',
      color: 'var(--blue)',
      isi: [
        'Target MAP ≥65 mmHg — resusitasi dengan Ringer Laktat atau PlasmaLyte (lebih sedikit dilutional acidosis vs NaCl 0.9%)',
        'Norepinefrin lini pertama jika MAP tidak respons cairan: 0.1–0.5 mcg/kg/mnt via central, titrasi',
        `Laktat clearance: target ≥10% penurunan per 2 jam. Laktat saat ini: ${laktat} mmol/L${laktat >= 4 ? ' — BERAT, mortalitas ↑' : ''}`,
        `NaHCO₃: ${pH < 7.10 ? 'TERINDIKASI (pH <7.10) — dosis 0.5 × BBideal × (15 − ' + hco3.toFixed(0) + ') mEq, berikan ½ dalam 4 jam' : pH < 7.20 ? 'Pertimbangkan jika AKI concurrent (BICAR-ICU benefit subgroup)' : 'Belum terindikasi — koreksi kausa primer dulu'}`,
        'Koreksi kausa primer: sepsis (antibiotik <1 jam dari onset), iskemia (revaskularisasi), DKA (insulin), hepatik (koreksi koagulopati)',
        'Tiamin IV 100–200 mg jika suspek defisiensi (alkohol, malnutrisi, refrakter terhadap resusitasi)'
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Jaber S. Lancet 2018 (BICAR-ICU) · Levy B. Chest 2015'
    });
  }

  if (agHigh && (!laktat || laktat < 4) && metAcid) {
    mgmt.push({
      judul: 'Kemungkinan DKA / Ketoasidosis',
      color: 'var(--blue)',
      isi: [
        'Cek GDS, keton darah (beta-hydroxybutyrate), K⁺, Mg²⁺, fosfat sebelum mulai terapi',
        'Resusitasi cairan: NaCl 0.9% 1 L/jam pertama (1–2 jam), lanjut 250–500 mL/jam sesuai hidrasi + output',
        '⚠ CEK K⁺ DAHULU — jika K⁺ <3.5: TUNDA insulin, berikan KCl 20–40 mEq/jam IV sampai K⁺ ≥3.5',
        'Insulin regular IV: 0.1 unit/kgBB/jam (setelah K⁺ ≥3.5). Target: ↓ GDS 50–75 mg/dL/jam, AG normalisasi',
        'Ganti ke D5%/D10% + insulin saat GDS <200 (DKA) atau <250 (HHS) mg/dL — jaga agar GDS 150–200',
        'Fosfat: koreksi jika <1 mg/dL atau ada kelemahan otot napas',
        'NaHCO₃ pada DKA: hanya jika pH <7.0 setelah 1 jam resusitasi (ADA 2024 — kontroversi)'
      ],
      ref: 'ADA Standards of Care 2024 · Kitabchi AE. Diabetes Care 2009 · Umpierrez GE. Endocr Rev 2023'
    });
  }

  if (kondisi === 'ards' || (po2 && fio2 && (po2/fio2) < 300)) {
    const pf = po2 && fio2 ? po2/fio2 : null;
    mgmt.push({
      judul: 'Manajemen ARDS',
      color: 'var(--blue)',
      isi: [
        'Lung-Protective Ventilation: VT 6 mL/kgBBP, Pplat ≤28 cmH₂O, Driving Pressure ≤15 cmH₂O, PEEP per ARDSNet table',
        pf && pf < 150 ? '🔄 Prone positioning: ≥16 jam/hari — wajib jika P/F <150 (PROSEVA 2013, NNT=8 untuk mortalitas)' : 'Prone positioning: pertimbangkan jika P/F tidak membaik 12–24 jam (threshold P/F <200–300 per PROSEVA update)',
        pf && pf < 120 ? '💊 Neuromuscular blockade: cisatracurium 37.5 mg bolus → 37.5 mg/jam drip IV (48 jam awal, jika RASS ≤-3)' : '',
        'Konservasi cairan: fluid-restrictive strategy hari 2–7 setelah stabilisasi hemodinamik (FACTT trial)',
        pf && pf < 80 ? '🔴 Pertimbangkan ECMO-VV: jika OI >40 atau P/F <80 refrakter ≥6 jam (EOLIA 2018 — konsultasi ECMO center segera)' : '',
        'Kortikosteroid: deksametason 6 mg/hari IV — dipertimbangkan pada ARDS moderate-severe (RECOVERY 2021, DEXA-ARDS 2020)',
        'Target: SpO₂ 92–96%, pH >7.20 (toleransi permissive hypercapnia), Pplat <28, driving pressure <15'
      ].filter(Boolean),
      ref: 'Matthay MA. NEJM 2019 · Guérin C. NEJM 2013 (PROSEVA) · Combes A. NEJM 2018 (EOLIA) · Villar J. Lancet Respir Med 2020 (DEXA-ARDS) · Slutsky AS. NEJM 2013'
    });
  }

  if (kondisi === 'sepsis' || (laktat && laktat >= 2 && agHigh)) {
    mgmt.push({
      judul: 'Manajemen Sepsis / Syok Septik (SSC 2021)',
      color: 'var(--blue)',
      isi: [
        '⏱ HOUR-1 BUNDLE: Kultur darah (2 set, aerob+anaerob) → Antibiotik broad-spectrum IV → Laktat → Akses IV → Resusitasi',
        'Cairan: 30 mL/kgBB balanced crystalloid (RL preferred) dalam 3 jam; nilai respons cairan dengan PLR / VTI / PPV — STOP jika tidak responsif (cegah fluid overload)',
        'Vasopressor: Norepinefrin lini pertama 0.01–0.5 mcg/kg/mnt via central/IO, target MAP ≥65 mmHg (atau ≥80 jika riwayat hipertensi)',
        'Vasopressin 0.03 unit/mnt: tambahkan jika dosis NE >0.25 mcg/kg/mnt (sparing effect, turunkan NE dose)',
        'Kortikosteroid: hidrokortison 200 mg/hari IV (50 mg/6 jam atau infus kontinu) jika refrakter vasopressor — bukan semua sepsis',
        `Laktat monitoring: target clearance ≥10%/2 jam (saat ini: ${laktat || '?'} mmol/L). ScvO₂ ≥70%; transfusi PRC jika Hb <7 dan ScvO₂ rendah`,
        'Antibiotik: de-eskalasi setelah 48–72 jam sesuai kultur. Durasi: 5–7 hari untuk respons klinis baik (IDSA/SSC)'
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Levy MM. Crit Care Med 2018 · Rhodes A. Intensive Care Med 2017'
    });
  }

  if (kondisi === 'cardiac') {
    mgmt.push({
      judul: 'Edema Paru Kardiogenik Akut',
      color: 'var(--blue)',
      isi: [
        'Posisi duduk 90°, oksigen → NIV (CPAP 5–10 cmH₂O atau BiPAP 8–12/5 cmH₂O) — turunkan preload, afterload, WOB',
        'Furosemide IV: 40–80 mg bolus (2× dosis oral harian) atau infus 5–10 mg/jam; target UO ≥100 mL/jam 2 jam pertama',
        'Nitrogliserin IV: mulai 10–20 mcg/mnt, titrasi 10–20 mcg/mnt tiap 5 mnt jika sistolik >100 mmHg (turunkan afterload)',
        'HINDARI cairan berlebihan — resusitasi hanya jika ada bukti hipovolemia konkuren (RV failure, tamponade)',
        'Low output / kardiogenik syok: dobutamin 2–10 mcg/kgBB/mnt (ionotropik) + NE jika MAP tidak tercapai',
        'Intubasi: jika gagal NIV, GCS ↓, asidosis berat (pH <7.20), atau distres napas yang tidak terkontrol',
        'Koreksi penyebab precipitating: ACS (kateterisasi emergent), AF rapid (rate control/kardioversi), hipertensif emergensi (NTG IV)'
      ],
      ref: 'McDonagh TA et al. Eur Heart J 2021 (ESC HF) · Mebazaa A. Intensive Care Med 2018 · Masip J. Eur Heart J Acute Cardiovasc Care 2022'
    });
  }

  if (mgmt.length > 0) {
    const mgmtHtml = mgmt.map(m => `
      <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)">
        <div style="font-weight:600;color:${m.color || 'var(--blue)'};margin-bottom:5px;font-size:12px;letter-spacing:0.02em">🎯 ${m.judul}</div>
        <ul style="padding-left:16px;margin:0">${m.isi.map(i => `<li style="font-size:12px;margin-bottom:3px;line-height:1.5">${i}</li>`).join('')}</ul>
        <span class="ref-tag" style="display:block;margin-top:5px">📚 ${m.ref}</span>
      </div>`).join('');
    html += `<div class="abg-result abg-blue" style="margin-top:6px">
      <div class="abg-label" style="color:var(--blue)">Langkah 7 — Koreksi Asam-Basa &amp; Strategi Tatalaksana</div>
      ${mgmtHtml}
    </div>`;
  }

  html += `<div class="warn" style="margin-top:8px;margin-bottom:0"><strong>⚠ Disclaimer Klinis</strong> Interpretasi ABG ini adalah panduan sistematis berbasis algoritma standar. Keputusan klinis tetap berdasarkan kondisi pasien secara keseluruhan dan kebijakan institusi. Konfirmasi dengan spesialis pada kasus kompleks.</div>`;
  document.getElementById('abg-result-content').innerHTML = html;
  document.getElementById('abg-results').classList.remove('hidden');

  /* ── Simpan ke history ─────────────────────────────────── */
  if (typeof window.saveCalcHistory === 'function') {
    var kondisiLabel = { umum:'Umum/ICU', ards:'ARDS', copd:'PPOK', asthma:'Asma', sepsis:'Sepsis', cardiac:'Ed. Paru Kardiogenik', postop:'Post-Op' };
    var label = 'pH ' + pH.toFixed(2) + ' · PaCO₂ ' + pco2.toFixed(0) + ' · HCO₃⁻ ' + hco3.toFixed(1);
    var pfText = (fio2 && po2) ? ' · P/F ' + Math.round(po2/fio2) : '';
    var summary = (kondisiLabel[kondisi] || kondisi) + pfText;
    var inputs = {
      abgPH: String(pH), abgCO2: document.getElementById('abgCO2').value,
      abgHCO3: document.getElementById('abgHCO3').value,
      abgO2: document.getElementById('abgO2').value || '',
      abgBE: document.getElementById('abgBE').value || '',
      abgSpO2: document.getElementById('abgSpO2').value || '',
      abgFiO2Direct: document.getElementById('abgFiO2Direct') ? document.getElementById('abgFiO2Direct').value : '',
      abgNa: document.getElementById('abgNa').value || '',
      abgCl: document.getElementById('abgCl').value || '',
      abgAlb: document.getElementById('abgAlb').value || '',
      abgLaktat: document.getElementById('abgLaktat').value || '',
      abgRR: document.getElementById('abgRR').value || '',
      abgKondisi: kondisi
    };
    window.saveCalcHistory('abg', label, inputs, summary);
    /* Re-render panel supaya badge terupdate */
    if (typeof window._abgHistoryOnRestore === 'function') {
      window.renderCalcHistory('abg-history-container', 'abg', window._abgHistoryOnRestore);
    }
  }
}

/* ============================================================
   KALKULATOR KOREKSI ASAM-BASA
   ============================================================ */

/* ===== TAB SWITCHER ===== */
function switchACBC(n) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('acbc-t' + i).classList.toggle('active', i === n);
    document.getElementById('acbc-p' + i).classList.toggle('active', i === n);
  }
}

/* ===== IMPORT FROM ABG INTERPRETER ===== */
function importFromABG(panel) {
  // Read values from the main ABG form (always in display unit; we read raw inputs)
  const ph    = parseFloat(document.getElementById('abgPH')?.value);
  const pco2Raw = parseFloat(document.getElementById('abgCO2')?.value);
  const hco3Raw = parseFloat(document.getElementById('abgHCO3')?.value);
  const naRaw   = parseFloat(document.getElementById('abgNa')?.value);
  const clRaw   = parseFloat(document.getElementById('abgCl')?.value);
  const albRaw  = parseFloat(document.getElementById('abgAlb')?.value);

  // Unit conversion helpers (same logic as calcABG)
  const pco2Unit = document.querySelector('[data-unit="paco2"]')?.textContent || 'mmHg';
  const hco3Unit = document.querySelector('[data-unit="hco3"]')?.textContent || 'mmol/L';
  const naUnit   = document.querySelector('[data-unit="na"]')?.textContent   || 'mmol/L';
  const clUnit   = document.querySelector('[data-unit="cl"]')?.textContent   || 'mmol/L';
  const albUnit  = document.querySelector('[data-unit="alb"]')?.textContent  || 'g/dL';

  const pco2 = pco2Unit === 'kPa' ? pco2Raw * 7.5006 : pco2Raw;
  const hco3 = hco3Raw; // mmol/L = mEq/L, no conversion needed
  const na   = naRaw;
  const cl   = clRaw;
  const alb  = albUnit === 'mg/dL' ? albRaw / 1000 : albRaw;

  let imported = 0;

  if (panel === 1) {
    if (!isNaN(hco3)) { document.getElementById('acbc1-hco3act').value = hco3.toFixed(1); imported++; }
    calcBicarb();
  } else if (panel === 2) {
    if (!isNaN(hco3)) { document.getElementById('acbc2-hco3').value = hco3.toFixed(1); imported++; }
    calcAlk();
  } else if (panel === 3) {
    if (!isNaN(ph))   { document.getElementById('acbc3-ph').value   = ph; imported++; }
    if (!isNaN(pco2)) { document.getElementById('acbc3-pco2').value = pco2.toFixed(1); imported++; }
    if (!isNaN(hco3)) { document.getElementById('acbc3-hco3').value = hco3.toFixed(1); imported++; }
    calcKompensasi();
  } else if (panel === 4) {
    if (!isNaN(na))  { document.getElementById('acbc4-na').value  = na.toFixed(1); imported++; }
    if (!isNaN(cl))  { document.getElementById('acbc4-cl').value  = cl.toFixed(1); imported++; }
    if (!isNaN(hco3)){ document.getElementById('acbc4-hco3').value = hco3.toFixed(1); imported++; }
    if (!isNaN(alb)) { document.getElementById('acbc4-alb').value  = alb.toFixed(1); imported++; }
    calcAGStandalone();
  }

  if (imported === 0) {
    alert('Belum ada nilai ABG yang diisi. Isi dulu form ABG Interpreter di atas.');
  }
}

/* ===== PANEL 1: NaHCO3 CALCULATOR ===== */
function calcBicarb() {
  const bb      = parseFloat(document.getElementById('acbc1-bb')?.value);
  const hco3act = parseFloat(document.getElementById('acbc1-hco3act')?.value);
  const type    = document.getElementById('acbc1-type')?.value || 'met';

  let hco3tgt = parseFloat(document.getElementById('acbc1-hco3tgt')?.value);
  if (type === 'dka')  hco3tgt = 15;
  if (type === 'card') hco3tgt = 14; // 1 mEq/kg bolus goal

  const el = document.getElementById('acbc1-result');
  if (!el) return;

  if (isNaN(bb) || isNaN(hco3act)) { el.innerHTML = ''; return; }

  if (type === 'card') {
    // Cardiac arrest: 1 mEq/kg bolus (8.4% NaHCO3 = 1 mEq/mL)
    const dose = bb * 1;
    el.innerHTML = `
      <div class="acbc-result info">
        <div class="acbc-result-title">Cardiac Arrest — Bolus NaHCO₃ 8.4%</div>
        <div class="acbc-val">${dose.toFixed(0)} mEq</div>
        <div>(= ${dose.toFixed(0)} mL NaHCO₃ 8.4% IV bolus)</div>
        <div class="acbc-formula">Dosis: 1 mEq/kg BB IV bolus. Ulangi tiap 10 menit jika diperlukan.</div>
        <span class="ref-tag">📚 AHA ACLS 2020</span>
      </div>`;
    return;
  }

  if (hco3act >= hco3tgt) {
    el.innerHTML = `<div class="acbc-result ok"><div class="acbc-result-title">HCO₃⁻ sudah mencapai target</div><div>HCO₃⁻ aktual (${hco3act} mEq/L) ≥ target (${hco3tgt} mEq/L). Tidak perlu koreksi NaHCO₃.</div></div>`;
    return;
  }

  // Standard formula: dose = 0.5 × BBI × (target − actual)
  const dose = 0.5 * bb * (hco3tgt - hco3act);
  // Give 1/2 over 4-6h, reassess
  const half = dose / 2;

  let typeLabel = 'Asidosis Metabolik';
  if (type === 'dka') typeLabel = 'DKA (pH < 6.9)';

  el.innerHTML = `
    <div class="acbc-result ${dose > 200 ? 'warn' : 'ok'}">
      <div class="acbc-result-title">Dosis NaHCO₃ — ${typeLabel}</div>
      <div class="acbc-val">${dose.toFixed(0)} mEq</div>
      <div style="font-size:12px;margin-bottom:4px">Berikan ½ dosis dulu: <strong>${half.toFixed(0)} mEq</strong> dalam 4–6 jam, lalu re-evaluasi AGD.</div>
      <hr class="acbc-divider">
      <div style="font-size:11px">
        <strong>Sediaan umum:</strong><br>
        • NaHCO₃ 8.4% = 1 mEq/mL → butuh <strong>${dose.toFixed(0)} mL</strong><br>
        • NaHCO₃ 7.5% = 0.9 mEq/mL → butuh <strong>${(dose/0.9).toFixed(0)} mL</strong><br>
        • NaHCO₃ 1.4% (isotonis) = 0.167 mEq/mL → butuh <strong>${(dose/0.167).toFixed(0)} mL</strong>
      </div>
      <div class="acbc-formula">Rumus: 0.5 × BB ideal (${bb} kg) × (target HCO₃⁻ ${hco3tgt} − aktual ${hco3act}) mEq/L</div>
      <span class="ref-tag">📚 Seifter JL. NEJM 2014; Berend K. NEJM 2018</span>
    </div>
    ${dose > 200 ? `<div class="acbc-result warn"><div class="acbc-result-title">⚠ Dosis Besar</div>Dosis >200 mEq — pertimbangkan pemberian bertahap dengan monitoring ketat. Risiko: hipernatremia, volume overload, alkalosis rebound.</div>` : ''}`;
}

/* ===== PANEL 2: KCl / HCl CALCULATOR ===== */
function calcAlk() {
  const bb   = parseFloat(document.getElementById('acbc2-bb')?.value);
  const hco3 = parseFloat(document.getElementById('acbc2-hco3')?.value);
  const k    = parseFloat(document.getElementById('acbc2-k')?.value);
  const cl   = parseFloat(document.getElementById('acbc2-cl')?.value);

  const el = document.getElementById('acbc2-result');
  if (!el) return;
  if (isNaN(bb) || isNaN(hco3)) { el.innerHTML = ''; return; }

  if (hco3 <= 26) {
    el.innerHTML = `<div class="acbc-result ok"><div class="acbc-result-title">HCO₃⁻ dalam batas normal</div>HCO₃⁻ ${hco3} mEq/L ≤ 26. Tidak ada alkalosis metabolik untuk dikoreksi.</div>`;
    return;
  }

  // Chloride-responsive vs resistant
  const clResponsive = !isNaN(cl) && cl < 95;
  const hypoK = !isNaN(k) && k < 3.5;

  // KCl deficit: target K+ 4.0, distribution 0.4 × BB
  let kclHtml = '';
  if (!isNaN(k)) {
    const kDeficit = (4.0 - k) * 0.4 * bb;
    const kRate    = Math.min(20, 10); // max 20 mEq/h peripheral
    kclHtml = `
      <div class="acbc-result ${hypoK ? 'warn' : 'info'}">
        <div class="acbc-result-title">Koreksi KCl IV</div>
        <div class="acbc-val">${kDeficit > 0 ? kDeficit.toFixed(0) + ' mEq' : 'K⁺ cukup'}</div>
        ${kDeficit > 0 ? `<div style="font-size:11px">Berikan dengan kecepatan ≤20 mEq/jam (perifer) atau ≤40 mEq/jam (sentral + monitor EKG).<br>Tambahkan MgSO₄ 1–2 g IV jika ada hipomagnesemia.</div>` : '<div>K⁺ serum sudah ≥ 4.0 mEq/L.</div>'}
        <div class="acbc-formula">Deficit K⁺ ≈ (4.0 − ${k}) × 0.4 × ${bb} kg</div>
        <span class="ref-tag">📚 Galla JH. JASN 2000</span>
      </div>`;
  }

  // HCl 0.1N for refractory alkalosis
  const hclTarget = 24;
  const hclDose   = 0.1 * bb * (hco3 - hclTarget);
  const hclHtml   = hco3 >= 40 ? `
    <div class="acbc-result bad">
      <div class="acbc-result-title">HCl 0.1N — Alkalosis Berat / Refrakter (HCO₃⁻ ≥ 40)</div>
      <div class="acbc-val">${hclDose.toFixed(0)} mEq HCl</div>
      <div style="font-size:11px">Berikan via kateter vena sentral dalam 4–24 jam. Monitor pH tiap 4 jam.<br>HCl 0.1N = 100 mEq/L → butuh <strong>${(hclDose/0.1).toFixed(0)} mL</strong>.</div>
      <div class="acbc-formula">Rumus: 0.1 × BB (${bb} kg) × (HCO₃ aktual ${hco3} − target ${hclTarget})</div>
      <span class="ref-tag">📚 Gennari FJ. NEJM 1998; Emmett M. CJASN 2020</span>
    </div>` : '';

  const responsiveNote = `
    <div class="acbc-result ${clResponsive ? 'warn' : 'info'}">
      <div class="acbc-result-title">${clResponsive ? '✅ Chloride-Responsive' : '⚡ Chloride-Resistant'}</div>
      <div style="font-size:11px">${clResponsive
        ? `Cl⁻ urin rendah atau Cl⁻ serum < 95 → kemungkinan penyebab: muntah, NG suction, diuretik. Koreksi dengan NaCl isotonis + KCl.`
        : `Cl⁻ serum normal/tinggi → kemungkinan penyebab: hiperaldosteronisme, Cushing, Bartter/Gitelman syndrome, steroid. Tangani penyebab primer.`
      }</div>
      ${!isNaN(cl) ? `<div class="acbc-formula">Cl⁻ serum: ${cl} mEq/L</div>` : ''}
    </div>`;

  el.innerHTML = responsiveNote + kclHtml + hclHtml;
}

/* ===== PANEL 3: KOMPENSASI CALCULATOR ===== */
function updateKompLabel() {
  // Just trigger recalculation; labels are set inside calcKompensasi
  calcKompensasi();
}

function calcKompensasi() {
  const ph      = parseFloat(document.getElementById('acbc3-ph')?.value);
  const pco2    = parseFloat(document.getElementById('acbc3-pco2')?.value);
  const hco3    = parseFloat(document.getElementById('acbc3-hco3')?.value);
  const disorder = document.getElementById('acbc3-disorder')?.value;

  const el = document.getElementById('acbc3-result');
  if (!el) return;
  if (!disorder) { el.innerHTML = '<div class="acbc-note">Pilih gangguan primer untuk melihat formula kompensasi.</div>'; return; }
  if (isNaN(pco2) && isNaN(hco3)) { el.innerHTML = ''; return; }

  let results = [];

  if (disorder === 'am') {
    // Asidosis Metabolik → kompensasi respiratorik (Winter's)
    if (!isNaN(hco3)) {
      const expPco2Lo = 1.5 * hco3 + 8 - 2;
      const expPco2Hi = 1.5 * hco3 + 8 + 2;
      const wintersMid = 1.5 * hco3 + 8;
      let status = '', cls = 'info';
      if (!isNaN(pco2)) {
        if (pco2 < expPco2Lo - 2) { status = `PaCO₂ aktual (${pco2}) LEBIH RENDAH dari ekspektasi → tambahan Alkalosis Respiratorik`; cls = 'warn'; }
        else if (pco2 > expPco2Hi + 2) { status = `PaCO₂ aktual (${pco2}) LEBIH TINGGI dari ekspektasi → tambahan Asidosis Respiratorik`; cls = 'warn'; }
        else { status = `PaCO₂ aktual (${pco2}) sesuai kompensasi → gangguan tunggal`; cls = 'ok'; }
      }
      results.push({ cls, title: "Asidosis Metabolik — Kompensasi Respiratorik (Winter's)", val: `${wintersMid.toFixed(1)} mmHg`, range: `[${expPco2Lo.toFixed(1)} – ${expPco2Hi.toFixed(1)}]`, formula: `PaCO₂ ekspektasi = 1.5 × HCO₃⁻ (${hco3}) + 8 ± 2`, status, ref: 'Winter SD. Ann Intern Med 1967' });
    }
  } else if (disorder === 'alm') {
    // Alkalosis Metabolik → kompensasi respiratorik
    if (!isNaN(hco3)) {
      const expPco2 = 0.7 * hco3 + 21;
      const lo = expPco2 - 2, hi = expPco2 + 2;
      let status = '', cls = 'info';
      if (!isNaN(pco2)) {
        if (pco2 < lo - 2) { status = `PaCO₂ aktual (${pco2}) lebih rendah → tambahan Alkalosis Respiratorik`; cls = 'warn'; }
        else if (pco2 > hi + 2) { status = `PaCO₂ aktual (${pco2}) lebih tinggi → tambahan Asidosis Respiratorik`; cls = 'warn'; }
        else { status = `PaCO₂ aktual (${pco2}) sesuai kompensasi`; cls = 'ok'; }
      }
      results.push({ cls, title: 'Alkalosis Metabolik — Kompensasi Respiratorik', val: `${expPco2.toFixed(1)} mmHg`, range: `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula: `PaCO₂ ekspektasi = 0.7 × HCO₃⁻ (${hco3}) + 21 ± 2`, status, ref: 'Martínez-Rueda. Rev Invest Clin 2020' });
    }
  } else if (disorder === 'ar') {
    // Asidosis Respiratorik Akut
    if (!isNaN(pco2)) {
      const expHco3 = 24 + 0.1 * (pco2 - 40);
      const lo = expHco3 - 1, hi = expHco3 + 1;
      let status = '', cls = 'info';
      if (!isNaN(hco3)) {
        if (hco3 < lo - 1) { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn'; }
        else if (hco3 > hi + 1) { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn'; }
        else { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi akut`; cls = 'ok'; }
      }
      results.push({ cls, title: 'Asidosis Respiratorik Akut — Kompensasi Renal Akut', val: `${expHco3.toFixed(1)} mEq/L`, range: `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula: `HCO₃⁻ ekspektasi = 24 + 0.1 × (PaCO₂ ${pco2} − 40) ± 1`, status, ref: 'Adrogue HJ. NEJM 1998' });
    }
  } else if (disorder === 'arc') {
    // Asidosis Respiratorik Kronik
    if (!isNaN(pco2)) {
      const expHco3 = 24 + 0.35 * (pco2 - 40);
      const lo = expHco3 - 3, hi = expHco3 + 3;
      let status = '', cls = 'info';
      if (!isNaN(hco3)) {
        if (hco3 < lo - 2) { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn'; }
        else if (hco3 > hi + 2) { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn'; }
        else { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi kronik`; cls = 'ok'; }
      }
      results.push({ cls, title: 'Asidosis Respiratorik Kronik — Kompensasi Renal Kronik', val: `${expHco3.toFixed(1)} mEq/L`, range: `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula: `HCO₃⁻ ekspektasi = 24 + 0.35 × (PaCO₂ ${pco2} − 40) ± 3`, status, ref: 'Adrogue HJ. NEJM 1998' });
    }
  } else if (disorder === 'alr') {
    // Alkalosis Respiratorik Akut
    if (!isNaN(pco2)) {
      const expHco3 = 24 - 0.2 * (40 - pco2);
      const lo = expHco3 - 1, hi = expHco3 + 1;
      let status = '', cls = 'info';
      if (!isNaN(hco3)) {
        if (hco3 < lo - 1) { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn'; }
        else if (hco3 > hi + 1) { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn'; }
        else { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi akut`; cls = 'ok'; }
      }
      results.push({ cls, title: 'Alkalosis Respiratorik Akut — Kompensasi Renal Akut', val: `${expHco3.toFixed(1)} mEq/L`, range: `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula: `HCO₃⁻ ekspektasi = 24 − 0.2 × (40 − PaCO₂ ${pco2}) ± 1`, status, ref: 'Adrogue HJ. NEJM 1998' });
    }
  } else if (disorder === 'alrc') {
    // Alkalosis Respiratorik Kronik
    if (!isNaN(pco2)) {
      const expHco3 = 24 - 0.5 * (40 - pco2);
      const lo = expHco3 - 2, hi = expHco3 + 2;
      let status = '', cls = 'info';
      if (!isNaN(hco3)) {
        if (hco3 < lo - 1) { status = `HCO₃⁻ aktual (${hco3}) lebih rendah → tambahan Asidosis Metabolik`; cls = 'warn'; }
        else if (hco3 > hi + 1) { status = `HCO₃⁻ aktual (${hco3}) lebih tinggi → tambahan Alkalosis Metabolik`; cls = 'warn'; }
        else { status = `HCO₃⁻ aktual (${hco3}) sesuai kompensasi kronik`; cls = 'ok'; }
      }
      results.push({ cls, title: 'Alkalosis Respiratorik Kronik — Kompensasi Renal Kronik', val: `${expHco3.toFixed(1)} mEq/L`, range: `[${lo.toFixed(1)} – ${hi.toFixed(1)}]`, formula: `HCO₃⁻ ekspektasi = 24 − 0.5 × (40 − PaCO₂ ${pco2}) ± 2`, status, ref: 'Adrogue HJ. NEJM 1998' });
    }
  }

  if (results.length === 0) { el.innerHTML = '<div class="acbc-note">Isi pH / PaCO₂ / HCO₃⁻ untuk melihat hasil kompensasi.</div>'; return; }

  el.innerHTML = results.map(r => `
    <div class="acbc-result ${r.cls}">
      <div class="acbc-result-title">${r.title}</div>
      <div class="acbc-val">${r.val} <span style="font-size:13px;font-weight:400">${r.range}</span></div>
      ${r.status ? `<div style="font-size:11px;margin-top:4px;font-weight:600">${r.status}</div>` : ''}
      <div class="acbc-formula">${r.formula}</div>
      <span class="ref-tag">📚 ${r.ref}</span>
    </div>`).join('');
}

/* ===== PANEL 4: ANION GAP + DELTA-DELTA ===== */
function calcAGStandalone() {
  const na   = parseFloat(document.getElementById('acbc4-na')?.value);
  const cl   = parseFloat(document.getElementById('acbc4-cl')?.value);
  const hco3 = parseFloat(document.getElementById('acbc4-hco3')?.value);
  const alb  = parseFloat(document.getElementById('acbc4-alb')?.value);

  const el = document.getElementById('acbc4-result');
  if (!el) return;
  if (isNaN(na) || isNaN(cl) || isNaN(hco3)) { el.innerHTML = ''; return; }

  const ag = na - (cl + hco3);
  const agNorm = 12;
  const albCorr = !isNaN(alb) ? (alb - 4.0) * 2.5 : 0; // negative if alb low
  const agCorr  = ag - albCorr; // add back if hypoalb

  const agHigh = agCorr > 16;
  const agLow  = agCorr < 8;

  let agClass = 'ok', agLabel = 'Normal';
  if (agHigh) { agClass = 'bad'; agLabel = '↑ HAGMA'; }
  else if (agLow) { agClass = 'info'; agLabel = '↓ Rendah (pertimbangkan hipoalbuminemia/mieloma)'; }

  // Delta-Delta ratio (only meaningful if HAGMA)
  let ddHtml = '';
  if (agHigh) {
    const dd = (agCorr - agNorm) / (agNorm - hco3); // (AG-12)/(24-HCO3)
    let ddInterp = '', ddCls = 'info';
    if (dd < 0.4) { ddInterp = '< 0.4 → NAGMA lebih dominan (mixed HAGMA + NAGMA)'; ddCls = 'warn'; }
    else if (dd <= 0.8) { ddInterp = '0.4–0.8 → HAGMA + NAGMA campuran'; ddCls = 'warn'; }
    else if (dd <= 2.0) { ddInterp = '0.8–2.0 → HAGMA murni (tipikal)'; ddCls = 'ok'; }
    else { ddInterp = '> 2.0 → kemungkinan ada tambahan Alkalosis Metabolik'; ddCls = 'warn'; }
    ddHtml = `
      <div class="acbc-result ${ddCls}">
        <div class="acbc-result-title">Delta-Delta Ratio</div>
        <div class="acbc-val">${isFinite(dd) ? dd.toFixed(2) : '—'}</div>
        <div style="font-size:11px">${ddInterp}</div>
        <div class="acbc-formula">Δ/Δ = (AG koreksi ${agCorr.toFixed(1)} − 12) / (24 − HCO₃⁻ ${hco3})</div>
        <span class="ref-tag">📚 Wrenn K. Ann Emerg Med 1990; Rastegar A. JASN 2007</span>
      </div>`;
  }

  // SID (Strong Ion Difference) simplified
  const sid = na - cl;
  let sidNote = sid > 38 ? 'SID > 38 → alkalosis respiratorik atau metabolik' : sid < 32 ? 'SID < 32 → mungkin ada asidosis hiperklor atau hyponatremia' : 'SID normal (32–38)';

  el.innerHTML = `
    <div class="acbc-result ${agClass}">
      <div class="acbc-result-title">Anion Gap ${!isNaN(alb) ? '(Terkoreksi Albumin)' : ''}</div>
      <div class="acbc-val">${agCorr.toFixed(1)} mEq/L <span style="font-size:13px;font-weight:400">${agLabel}</span></div>
      ${!isNaN(alb) && alb !== 4.0 ? `<div style="font-size:11px">AG raw: ${ag.toFixed(1)} | Koreksi albumin: ${albCorr >= 0 ? '+' : ''}${albCorr.toFixed(1)} | Albumin: ${alb} g/dL</div>` : ''}
      <div class="acbc-formula">AG = Na⁺ (${na}) − [Cl⁻ (${cl}) + HCO₃⁻ (${hco3})] = ${ag.toFixed(1)}${!isNaN(alb) ? ` | Koreksi alb: ${agCorr.toFixed(1)}` : ''}</div>
      <span class="ref-tag">📚 Fidkowski C. Anesthesiology 2009; Kraut JA. CJASN 2007</span>
    </div>
    ${ddHtml}
    <div class="acbc-result info">
      <div class="acbc-result-title">Strong Ion Difference (SID simpel)</div>
      <div class="acbc-val">${sid.toFixed(1)} mEq/L</div>
      <div style="font-size:11px">${sidNote}</div>
      <div class="acbc-formula">SID = Na⁺ (${na}) − Cl⁻ (${cl})</div>
      <span class="ref-tag">📚 Stewart PA. Can J Physiol Pharmacol 1983</span>
    </div>`
;
}
