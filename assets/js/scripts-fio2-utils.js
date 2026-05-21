/* ============================================================
   scripts-fio2-utils.js
   Generic FiO₂ dual-mode & SpO₂ dual-source helpers.
   Used by: kalkulator-pf, skoring-sofa, skoring-cpis, skoring-apache

   ID convention (prefix = e.g. 'sofa', 'pf', 'ap', 'cpis'):
     {prefix}-fio2              → hidden canonical value (read by calc functions)
     {prefix}-fio2-direct       → direct number input
     {prefix}-fio2-btn-direct   → mode toggle button
     {prefix}-fio2-btn-lowflow  → mode toggle button
     {prefix}-fio2-direct-wrap  → wrapper div for direct input
     {prefix}-fio2-lowflow-wrap → wrapper div for low-flow inputs
     {prefix}-o2-device         → device select
     {prefix}-o2-flow           → flow number input
     {prefix}-fio2-est          → estimation display text
   SpO₂ source (optional):
     {prefix}-spo2-btn-pulse    → pulse ox button
     {prefix}-spo2-btn-abg     → ABG SaO₂ button
     {prefix}-spo2-note        → reliability note
   ============================================================ */

function setFiO2ModeFor(prefix, mode) {
  const el = id => document.getElementById(id);
  const direct   = el(prefix + '-fio2-btn-direct');
  const lowflow  = el(prefix + '-fio2-btn-lowflow');
  const dWrap    = el(prefix + '-fio2-direct-wrap');
  const lfWrap   = el(prefix + '-fio2-lowflow-wrap');
  if (!direct || !dWrap) return;

  direct.classList.toggle('active', mode === 'direct');
  if (lowflow) lowflow.classList.toggle('active', mode !== 'direct');
  dWrap.style.display  = mode === 'direct' ? '' : 'none';
  if (lfWrap) lfWrap.style.display = mode !== 'direct' ? '' : 'none';

  if (mode === 'direct') syncFiO2DirectFor(prefix);
  else estimateFiO2For(prefix);
}

function syncFiO2DirectFor(prefix) {
  const src    = document.getElementById(prefix + '-fio2-direct');
  const hidden = document.getElementById(prefix + '-fio2');
  if (src && hidden) hidden.value = src.value;
}

function estimateFiO2For(prefix) {
  const deviceEl = document.getElementById(prefix + '-o2-device');
  const flowEl   = document.getElementById(prefix + '-o2-flow');
  const estEl    = document.getElementById(prefix + '-fio2-est');
  const hidden   = document.getElementById(prefix + '-fio2');
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

  if (hidden) hidden.value = fio2.toFixed(2);
  if (estEl) {
    estEl.textContent = (isVenturi || !isNaN(flow))
      ? `Estimasi FiO₂ ≈ ${(fio2 * 100).toFixed(0)}% (${fio2.toFixed(2)})`
      : '';
  }
}

function setSpo2SourceFor(prefix, src) {
  const btnPulse = document.getElementById(prefix + '-spo2-btn-pulse');
  const btnABG   = document.getElementById(prefix + '-spo2-btn-abg');
  const note     = document.getElementById(prefix + '-spo2-note');
  if (btnPulse) btnPulse.classList.toggle('active', src === 'pulse');
  if (btnABG)   btnABG.classList.toggle('active', src !== 'pulse');
  if (note)     note.style.display = src === 'pulse' ? '' : 'none';
}

/* Auto-init all prefixes present on this page */
document.addEventListener('DOMContentLoaded', function () {
  ['pf', 'sofa', 'cpis', 'ap'].forEach(function (prefix) {
    if (document.getElementById(prefix + '-fio2-direct')) {
      syncFiO2DirectFor(prefix);
    }
    if (document.getElementById(prefix + '-spo2-btn-pulse')) {
      setSpo2SourceFor(prefix, 'pulse');
    }
  });
});
