/* ============================================================
   ICU Helper — scripts-theme.js · v6 · Arctic White + Clinical Slate
   Shared across all pages — Dark/Light theme toggle
   ============================================================ */

/* ---- v6 Theme Migration ----------------------------------------
   Resets saved theme to 'light' (Arctic White) jika belum pernah
   load dengan v6. Flag disimpan di localStorage 'icu-v'. */
(function () {
  if (localStorage.getItem('icu-v') !== '6') {
    localStorage.setItem('vent-theme', 'light');
    localStorage.setItem('icu-v', '6');
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  /* Pill toggle (nav.js) */
  var cb  = document.getElementById('theme-toggle-cb');
  var lbl = document.getElementById('toggle-lbl');
  if (cb)  cb.checked      = theme === 'dark';
  if (lbl) lbl.textContent = theme === 'dark' ? 'Dark' : 'Light';

  /* Modal pill toggle (drug-reference) */
  var drmCb = document.getElementById('drm-theme-cb');
  if (drmCb) drmCb.checked = theme === 'dark';
  var drmLbl = document.getElementById('drm-theme-lbl');
  if (drmLbl) drmLbl.textContent = theme === 'dark' ? 'Dark' : 'Light';

  /* Legacy button toggle (pages without nav.js) */
  var icon  = document.getElementById('theme-icon');
  var label = document.getElementById('theme-label');
  if (icon)  icon.textContent  = theme === 'dark' ? '🌙' : '☀️';
  if (label) label.textContent = theme === 'dark' ? 'Dark' : 'Light';
}

function getTheme() {
  var saved = localStorage.getItem('vent-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light'; /* Default: Arctic White */
}


function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || getTheme();
  var next    = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('vent-theme', next);

  /* Transition flash */
  document.body.classList.add('transitioning');
  setTimeout(function () { document.body.classList.remove('transitioning'); }, 300);

  applyTheme(next);
}

/* ── FONT SIZE ── */
var _FS_LEVELS = ['xs', 'sm', 'md', 'lg', 'xl'];
/* Migrate old keys from previous 3-level system */
(function () {
  var map = { 'normal': 'md', 'large': 'lg', 'xlarge': 'xl' };
  var v = localStorage.getItem('icu-fontsize');
  if (v && map[v]) localStorage.setItem('icu-fontsize', map[v]);
})();
function applyFontSize(size) {
  if (_FS_LEVELS.indexOf(size) === -1) size = 'md';
  document.documentElement.setAttribute('data-fontsize', size);
  localStorage.setItem('icu-fontsize', size);
  var idx = _FS_LEVELS.indexOf(size);
  var minus = document.getElementById('fs-minus');
  var plus  = document.getElementById('fs-plus');
  if (minus) minus.disabled = idx === 0;
  if (plus)  plus.disabled  = idx === _FS_LEVELS.length - 1;
}
function getFontSize() {
  var v = localStorage.getItem('icu-fontsize');
  return _FS_LEVELS.indexOf(v) !== -1 ? v : 'md';
}
function incFontSize() {
  var idx = _FS_LEVELS.indexOf(document.documentElement.getAttribute('data-fontsize') || 'md');
  if (idx < _FS_LEVELS.length - 1) applyFontSize(_FS_LEVELS[idx + 1]);
}
function decFontSize() {
  var idx = _FS_LEVELS.indexOf(document.documentElement.getAttribute('data-fontsize') || 'md');
  if (idx > 0) applyFontSize(_FS_LEVELS[idx - 1]);
}
/* Anti-FOUC: runs synchronously in <head> before first paint */
applyFontSize(getFontSize());

/* Expand / collapse all theory dropdowns */
function toggleAllTheory(btn) {
  var expanding = btn.dataset.state !== 'open';
  document.querySelectorAll('.theory-content').forEach(function (c) {
    c.classList.toggle('visible', expanding);
  });
  document.querySelectorAll('.theory-btn').forEach(function (b) {
    b.classList.toggle('open', expanding);
  });
  btn.dataset.state  = expanding ? 'open' : '';
  btn.textContent    = expanding ? '📕 Tutup Semua Teori' : '📖 Buka Semua Teori';
}

document.addEventListener('DOMContentLoaded', function () {
  applyTheme(getTheme());

  /* Active tab state is managed by nav.js (sidebar injection) */

  /* Auto-insert "Buka Semua Teori" if there are multiple dropdowns */
  var dropdowns = document.querySelectorAll('.theory-dropdown');
  if (dropdowns.length > 1) {
    var btn = document.createElement('button');
    btn.className = 'theory-expand-all';
    btn.textContent = '📖 Buka Semua Teori';
    btn.onclick = function () { toggleAllTheory(this); };
    dropdowns[0].parentNode.insertBefore(btn, dropdowns[0]);
  }

  /* Back-to-top button */
  var btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.title = 'Kembali ke atas';
  btt.textContent = '↑';
  btt.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  document.body.appendChild(btt);
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 300;
    btt.classList.toggle('visible', scrolled);
    /* Install button follows back-to-top exactly */
    var inst = document.getElementById('pwa-install-btn');
    if (inst) inst.classList.toggle('visible', scrolled);
  }, { passive: true });

  /* Wire font size buttons created by nav.js + sync disabled state */
  var fsMinus = document.getElementById('fs-minus');
  var fsPlus  = document.getElementById('fs-plus');
  if (fsMinus) fsMinus.onclick = decFontSize;
  if (fsPlus)  fsPlus.onclick  = incFontSize;
  applyFontSize(getFontSize());
});
