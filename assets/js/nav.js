  /* ============================================================
   nav.js — ICU Helper Shared Navigation v2
   Injects top bar + collapsible sidebar into every page.
   Loaded as last <script> before </body> on all pages.

   All hrefs in PAGES are stored as paths from the project
   root (e.g. "pages/setting.html"). A depth-based base
   prefix (base) is prepended at link-generation time so the
   same file works correctly from any directory level.
   ============================================================ */
;(function () {
  'use strict';

  /* ---- Detect current filename ------------------------------ */
  var file = (location.pathname.split('/').pop() || 'index.html').replace(/[?#].*$/, '') || 'index.html';
  if (file.indexOf('.') === -1 && file !== '') file += '.html';

  /* ---- Compute depth from project root ----------------------
     depth 0 → root:            index.html, referensi.html
     depth 1 → pages/:          monitoring, abg, weaning, setting, cairan
     depth 2 → pages/sub/:      teori-*, skoring-*, kalkulator-*  */
  var depth = 0;
  if (/^(monitoring|abg|weaning|setting|kalkulator|skoring|teori|cairan|drug-reference|referensi)\.html$/.test(file)) {
    depth = 1;
  } else if (/^(teori-|skoring-|kalkulator-)/.test(file)) {
    depth = 2;
  }
  var base = ['', '../', '../../'][depth];

  /* rel(rootPath) → relative path from current page to rootPath */
  function rel(path) { return base + path; }
  /* fn(rootPath)  → just the filename, no hash, no directory   */
  function fn(path)  { return path.split('/').pop().split('#')[0]; }

  /* ---- Page / nav data (hrefs = from project root) ---------- */
  var PAGES = [
    {
      id: 'index', icon: 'home', label: 'Home',
      href: 'index.html',
      title: 'ICU Helper',
      subtitle: 'Panduan Klinis Lengkap · Referensi Lokal & Internasional · v2.0 — 2026',
      subs: []
    },
    {
      id: 'teori', icon: 'book-open', label: 'Teori',
      href: 'pages/teori.html',
      title: 'Teori — Fisiologi & Patofisiologi ICU',
      subtitle: 'Gagal Napas · Fisiologi Paru · ARDS · Sepsis · B1–B6 · Airway & Intubasi · SAT/SBT/VAP · v2.0 — 2026',
      subs: [
        { label: 'Impending Gagal Napas',    href: 'pages/teori/teori-impending.html' },
        { label: 'Fisiologi Pernapasan',     href: 'pages/teori/teori-fisiologi.html' },
        { label: 'Gagal Napas & ARDS',       href: 'pages/teori/teori-gagalnapas.html' },
        { label: 'Sepsis & Syok Septik',     href: 'pages/teori/teori-sepsis.html' },
        { label: 'B1–B6 Bedside Assessment', href: 'pages/teori/teori-b1b6.html' },
        { label: 'Airway & Intubasi',        href: 'pages/teori/teori-airway.html' },
        { label: 'SAT · SBT · VAP Bundle',   href: 'pages/teori/teori-sat-sbt-vap.html' }
      ]
    },
    {
      id: 'kalkulator', icon: 'calculator', label: 'Kalkulator',
      href: 'pages/kalkulator.html',
      title: 'Kalkulator Klinis',
      subtitle: 'IBW · Sedasi & RSI · Syringe Pump · P/F & OI · Renal · Pulmo · ElektroCorr · NLR · Transfusi · Cairan',
      subs: [
        { label: 'IBW & Ventilator',        href: 'pages/kalkulator/kalkulator-ibw.html' },
        { label: 'Sedasi & RSI',            href: 'pages/kalkulator/kalkulator-drug.html' },
        { label: 'Syringe Pump',            href: 'pages/kalkulator/kalkulator-pump.html' },
        { label: 'P/F & OI',               href: 'pages/kalkulator/kalkulator-pf.html' },
        { label: 'Renal',                   href: 'pages/kalkulator/kalkulator-renal.html' },
        { label: 'Pulmo',                   href: 'pages/kalkulator/kalkulator-pulmo.html' },
        { label: 'ElektroCorr',             href: 'pages/kalkulator/kalkulator-electro.html' },
        { label: 'NLR & Biomarker',         href: 'pages/kalkulator/kalkulator-nlr.html' },
        { label: 'Transfusi',               href: 'pages/kalkulator/kalkulator-transfusi.html' },
        { label: 'Cairan Harian',           href: 'pages/kalkulator/kalkulator-cairan.html' }
      ]
    },
    {
      id: 'drug_ref', icon: 'pill', label: 'Drug Ref',
      href: 'pages/drug-reference.html',
      title: 'Drug Reference ICU',
      subtitle: '~70 obat ICU · eGFR mode · Vasopressor · Antibiotik · High-Alert',
      subs: []
    },
    {
      id: 'cairan', icon: 'droplet', label: 'Cairan',
      href: 'pages/cairan.html',
      title: 'Cairan IV',
      subtitle: 'Kristaloid · Koloid · Maintenance · Nutrisi Parenteral · v2.0 — 2026',
      subs: []
    },
    {
      id: 'abg', icon: 'activity', label: 'ABG',
      href: 'pages/abg.html',
      title: 'ABG Interpreter',
      subtitle: 'Analisis Gas Darah 6-Langkah · Delta-Delta · ROX Index · A-a Gradient · v2.0 — 2026',
      subs: []
    },
    {
      id: 'skoring', icon: 'clipboard-list', label: 'Skoring',
      href: 'pages/skoring.html',
      title: 'Skoring ICU',
      subtitle: 'SOFA · APACHE-II · RASS · CAM-ICU · CPIS · Frailty · Candida · v2.0 — 2026',
      subs: [
        { label: 'SOFA Score',         href: 'pages/skoring/skoring-sofa.html' },
        { label: 'APACHE-II',          href: 'pages/skoring/skoring-apache.html' },
        { label: 'RASS — Sedasi',      href: 'pages/skoring/skoring-rass.html' },
        { label: 'CAM-ICU — Delirium', href: 'pages/skoring/skoring-camicu.html' },
        { label: 'CPIS — VAP',         href: 'pages/skoring/skoring-cpis.html' },
        { label: 'Frailty Scale',      href: 'pages/skoring/skoring-bfs.html' },
        { label: 'Candida Score',      href: 'pages/skoring/skoring-candida.html' }
      ]
    },
    {
      id: 'weaning', icon: 'arrow-down-circle', label: 'Weaning',
      href: 'pages/weaning.html',
      title: 'Weaning & Ekstubasi',
      subtitle: 'Protokol SAT+SBT · Kriteria Ekstubasi · RSBI · HACOR · HFNC/NIV · v2.0 — 2026',
      subs: []
    },
    {
      id: 'monitoring', icon: 'monitor', label: 'Monitoring',
      href: 'pages/monitoring.html',
      title: 'Monitoring',
      subtitle: 'Monitoring, Troubleshooting & Komplikasi · v2.0 — 2026',
      subs: [
        { label: 'DOPE',             href: 'pages/monitoring.html#dope' },
        { label: 'Target Parameter', href: 'pages/monitoring.html#targets' },
        { label: 'Komplikasi',       href: 'pages/monitoring.html#komplikasi' },
        { label: 'Waveform & Loop',  href: 'pages/monitoring.html#waveform' }
      ]
    },
    {
      id: 'setting', icon: 'settings', label: 'Setting',
      href: 'pages/setting.html',
      title: 'Setting Ventilator',
      subtitle: 'Setting per Kondisi Klinis · ARDS · PPOK · Asma · Sepsis · v2.0 — 2026',
      subs: [
        { label: 'ARDS',        href: 'pages/setting.html#ards' },
        { label: 'PPOK',        href: 'pages/setting.html#ppok' },
        { label: 'Asma',        href: 'pages/setting.html#asma' },
        { label: 'CAP/HAP',     href: 'pages/setting.html#cap' },
        { label: 'Sepsis',      href: 'pages/setting.html#sepsis' },
        { label: 'Kardiogenik', href: 'pages/setting.html#epk' },
        { label: 'Post-Op',     href: 'pages/setting.html#postop' },
        { label: 'GBS/MG',      href: 'pages/setting.html#neuro' }
      ]
    },
    {
      id: 'riwayat', icon: 'history', label: 'Riwayat',
      href: 'pages/riwayat.html',
      title: 'Riwayat Perhitungan',
      subtitle: 'Log semua perhitungan kalkulator yang tersimpan di perangkat ini · v2.0 — 2026',
      subs: []
    },
    {
      id: 'referensi', icon: 'book-text', label: 'Referensi',
      href: 'pages/referensi.html',
      title: 'Referensi',
      subtitle: 'Daftar Pustaka Internasional & Lokal Indonesia · Guidelines Terkini · v2.0 — 2026',
      subs: []
    }
  ];

  /* ---- Detect active page (match by filename only) ---------- */
  var activePage = PAGES[0];
  var activeSub  = null;

  outer: for (var i = 0; i < PAGES.length; i++) {
    var p = PAGES[i];
    if (file === fn(p.href)) { activePage = p; break; }
    for (var j = 0; j < p.subs.length; j++) {
      var s = p.subs[j];
      if (file === fn(s.href)) { activePage = p; activeSub = s; break outer; }
    }
  }

  /* ---- Sidebar state ---------------------------------------- */
  var SB_KEY   = 'icu-sb';
  var isMobile = window.innerWidth < 769;
  var isCollapsed = !isMobile && localStorage.getItem(SB_KEY) === 'collapsed';

  /* ---- Build: top bar --------------------------------------- */
  function buildTopbar() {
    var el = document.createElement('header');
    el.id = 'icu-topbar';
    el.innerHTML =
      '<button class="tb-ham" id="tb-ham" aria-label="Toggle menu">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<a class="tb-brand" href="' + rel('index.html') + '">' +
        '<div class="brand-dot"></div>' +
        'ICU_HELPER' +
      '</a>' +
      '<div class="tb-right">' +
        '<div class="tb-clock" id="tb-clock">--:--:--</div>' +
        '<div class="toggle-wrap">' +
          '<span class="toggle-label" id="toggle-lbl">Dark</span>' +
          '<label class="toggle-switch" title="Toggle Light/Dark">' +
            '<input type="checkbox" id="theme-toggle-cb" checked>' +
            '<div class="toggle-track"><div class="toggle-knob"></div></div>' +
          '</label>' +
        '</div>' +
      '</div>';
    return el;
  }

  /* ---- Build: sidebar --------------------------------------- */
  function buildSidebar() {
    var el = document.createElement('aside');
    el.id = 'icu-sidebar';
    var html = '<nav class="sb-nav">';

    for (var i = 0; i < PAGES.length; i++) {
      var p       = PAGES[i];
      var isAct   = activePage === p;
      var hasSubs = p.subs.length > 0;
      var isOpen  = isAct && hasSubs;

      html += '<div class="sb-item' + (hasSubs ? ' has-subs' : '') + (isOpen ? ' open' : '') + '">';

      if (!hasSubs) {
        html +=
          '<a class="sb-link' + (isAct ? ' active' : '') + '" href="' + rel(p.href) + '">' +
            '<i data-lucide="' + p.icon + '" class="sb-icon"></i>' +
            '<span class="sb-label">' + p.label + '</span>' +
          '</a>';
      } else {
        html +=
          '<div class="sb-link-row">' +
            '<a class="sb-link sb-main-link' + (isAct ? ' active' : '') + '" href="' + rel(p.href) + '">' +
              '<i data-lucide="' + p.icon + '" class="sb-icon"></i>' +
              '<span class="sb-label">' + p.label + '</span>' +
            '</a>' +
            '<button class="sb-chev-btn sb-toggle" aria-label="Buka submenu">' +
              '<span class="sb-chev"></span>' +
            '</button>' +
          '</div>' +
          '<div class="sb-subs">';

        for (var j = 0; j < p.subs.length; j++) {
          var sub = p.subs[j];
          var isSubAct = activeSub === sub;
          html += '<a class="sb-sub-link' + (isSubAct ? ' active' : '') + '" href="' + rel(sub.href) + '">' + sub.label + '</a>';
        }
        html += '</div>';

        /* Collapsed-mode popover */
        html += '<div class="sb-pop">' +
          '<div class="sb-pop-title"><i data-lucide="' + p.icon + '" style="width:12px;height:12px;vertical-align:-2px"></i> ' + p.label + '</div>';
        for (var k = 0; k < p.subs.length; k++) {
          html += '<a class="sb-pop-link" href="' + rel(p.subs[k].href) + '">' + p.subs[k].label + '</a>';
        }
        html += '</div>';
      }

      html += '</div>';
    }

    html += '</nav>';
    html +=
      '<button class="sb-feedback" onclick="if(typeof fbOpenFeedback===\'function\')fbOpenFeedback()" type="button">' +
        '<span class="sb-icon">💬</span>' +
        '<span class="sb-label">Beri Feedback</span>' +
      '</button>';
    el.innerHTML = html;
    return el;
  }

  /* ---- Build: page header ----------------------------------- */
  function buildPageHeader() {
    var el = document.createElement('div');
    el.className = 'page-header';
    var title = activeSub
      ? (activePage.label + ' — ' + activeSub.label)
      : activePage.title;
    el.innerHTML =
      '<div class="ph-title">' +
        '<h1>' + title + '</h1>' +
        '<p class="subtitle" style="margin-bottom:0">' + activePage.subtitle + '</p>' +
      '</div>' +
      '<div class="ph-font-ctrl" id="ph-font-ctrl">' +
        '<button id="fs-toggle" class="fs-toggle-btn" title="Ukuran Font">Aa</button>' +
        '<div id="fs-panel" class="fs-panel">' +
          '<span class="fs-lbl-s">Aa</span>' +
          '<div class="fs-slider-wrap">' +
            '<input type="range" id="fs-slider" min="0" max="4" step="1" list="fs-ticks">' +
            '<datalist id="fs-ticks">' +
              '<option value="0"><option value="1"><option value="2"><option value="3"><option value="4">' +
            '</datalist>' +
          '</div>' +
          '<span class="fs-lbl-l">Aa</span>' +
        '</div>' +
      '</div>';
    return el;
  }

  /* ---- Build: breadcrumb ------------------------------------ */
  function buildBreadcrumb() {
    if (activePage.id === 'index') return null;

    var el = document.createElement('nav');
    el.className = 'breadcrumb';
    el.setAttribute('aria-label', 'breadcrumb');

    var parts = [];
    parts.push('<a class="bc-link" href="' + rel('index.html') + '">🏠 Home</a>');

    if (activeSub) {
      parts.push('<a class="bc-link" href="' + rel(activePage.href) + '">' + activePage.label + '</a>');
      parts.push('<span class="bc-current">' + activeSub.label + '</span>');
    } else {
      parts.push('<span class="bc-current">' + activePage.label + '</span>');
    }

    el.innerHTML = parts.join('<span class="bc-sep">›</span>');
    return el;
  }

  /* ---- Build: mobile overlay -------------------------------- */
  function buildOverlay() {
    var el = document.createElement('div');
    el.id = 'icu-overlay';
    return el;
  }

  /* ---- Sidebar toggle --------------------------------------- */
  function openMobile()  { document.body.classList.add('sb-open'); overlay.style.display = 'block'; var b = document.getElementById('tb-ham'); if(b) b.classList.add('is-active'); }
  function closeMobile() { document.body.classList.remove('sb-open'); overlay.style.display = ''; var b = document.getElementById('tb-ham'); if(b) b.classList.remove('is-active'); }

  function toggleSidebar() {
    if (isMobile) {
      document.body.classList.contains('sb-open') ? closeMobile() : openMobile();
    } else {
      isCollapsed = !isCollapsed;
      document.body.classList.toggle('sb-collapsed', isCollapsed);
      var b = document.getElementById('tb-ham');
      if(b) isCollapsed ? b.classList.remove('is-active') : b.classList.add('is-active');
      localStorage.setItem(SB_KEY, isCollapsed ? 'collapsed' : 'open');
    }
  }

  /* ---- Apply state immediately (before DOMContentLoaded) ---- */
  document.body.classList.add('has-sidebar');
  if (isCollapsed) document.body.classList.add('sb-collapsed');

  /* Hide legacy nav instantly — avoids layout flash */
  var _h = document.querySelector('.hbar');       if (_h) _h.style.display = 'none';
  var _tb = document.querySelector('.tab-bar');   if (_tb) _tb.style.display = 'none';
  var _sb = document.querySelector('.subtab-bar');if (_sb) _sb.style.display = 'none';

  /* ---- Inject DOM ------------------------------------------- */
  var overlay = buildOverlay();
  var sidebar = buildSidebar();
  var topbar  = buildTopbar();

  document.body.insertBefore(overlay, document.body.firstChild);
  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.insertBefore(topbar,  document.body.firstChild);

  /* Bottom nav removed — mobile navigation handled by sidebar (hamburger). */

  /* Index page has its own hero section — skip generic page header */
  if (activePage.id !== 'index') {
    var pageHdr = buildPageHeader();
    topbar.insertAdjacentElement('afterend', pageHdr);
    var breadcrumb = buildBreadcrumb();
    if (breadcrumb) pageHdr.insertAdjacentElement('afterend', breadcrumb);
  }

  /* Sync theme toggle state immediately */
  if (typeof applyTheme === 'function' && typeof getTheme === 'function') {
    applyTheme(getTheme());
  }

  /* Wire pill checkbox after injection */
  var _cb = document.getElementById('theme-toggle-cb');
  if (_cb) {
    var _t = localStorage.getItem('vent-theme') ||
             (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    _cb.checked = _t === 'dark';
  }

  /* ---- Wire events ------------------------------------------ */
  document.getElementById('tb-ham').addEventListener('click', toggleSidebar);

  overlay.addEventListener('click', closeMobile);

  /* Accordion */
  var toggleBtns = sidebar.querySelectorAll('.sb-toggle');
  for (var t = 0; t < toggleBtns.length; t++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        btn.closest('.sb-item').classList.toggle('open');
      });
    })(toggleBtns[t]);
  }

  /* Theme toggle — pill checkbox */
  var themeCb = document.getElementById('theme-toggle-cb');
  if (themeCb) {
    themeCb.addEventListener('change', function () {
      if (typeof toggleTheme === 'function') toggleTheme();
    });
  }

  /* Resize */
  window.addEventListener('resize', function () {
    isMobile = window.innerWidth < 769;
    if (!isMobile) closeMobile();
  }, { passive: true });

  /* ---- Live clock ------------------------------------------- */
  (function () {
    var clockEl = document.getElementById('tb-clock');
    if (!clockEl) return;
    function tick() {
      var now = new Date();
      var h = String(now.getHours()).padStart(2, '0');
      var m = String(now.getMinutes()).padStart(2, '0');
      var s = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = h + ':' + m + ':' + s;
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ---- Cleanup + theme sync after DOMContentLoaded ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    ['.hbar', '.tab-bar', '.subtab-bar'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    if (typeof applyTheme === 'function' && typeof getTheme === 'function') {
      applyTheme(getTheme());
    }

    /* Auto-scroll to results when a calc button is clicked (mobile UX) */
    if (window.innerWidth < 769) {
      document.querySelectorAll('.calc-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          setTimeout(function () {
            var results = document.querySelector('[id$="-results"]:not(.hidden), .result-grid:not(:empty), #abg-result:not(:empty)');
            if (results) {
              var top = results.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top: top, behavior: 'smooth' });
            }
          }, 120);
        }, true);
      });
    }
  });

  /* ---- PWA: inject manifest + load pwa.js ------------------- */
  (function () {
    /* Favicon */
    if (!document.querySelector('link[rel="icon"]')) {
      var ico = document.createElement('link');
      ico.rel = 'icon';
      ico.type = 'image/x-icon';
      ico.href = base + 'favicon.ico';
      document.head.appendChild(ico);
    }

    /* Apple touch icon */
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      var apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      apple.href = base + 'assets/img/icon-192.png';
      document.head.appendChild(apple);
    }

    /* Manifest link */
    if (!document.querySelector('link[rel="manifest"]')) {
      var mani = document.createElement('link');
      mani.rel = 'manifest';
      mani.href = base + 'manifest.json';
      document.head.appendChild(mani);
    }

    /* Load lucide shim (inline SVG, ~4KB vs 284KB) */
    if (!document.getElementById('lucide-script')) {
      var sL = document.createElement('script');
      sL.id = 'lucide-script';
      sL.src = base + 'assets/js/lucide-shim.js';
      sL.onload = function() { if(window.lucide) window.lucide.createIcons(); };
      document.head.appendChild(sL);
    }

    /* Load pwa.js once */
    if (!document.getElementById('pwa-script')) {
      var s = document.createElement('script');
      s.id = 'pwa-script';
      s.src = base + 'assets/js/pwa.js';
      s.defer = true;
      document.head.appendChild(s);
    }
  })();

})();
