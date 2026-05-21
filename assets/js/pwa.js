/* ============================================================
   pwa.js — ICU Helper PWA Install Handler
   - Registers service worker
   - Captures beforeinstallprompt → adds .pwa-ready to button
   - Scroll visibility handled by scripts-theme.js (same as back-to-top)
   - First-visit install suggestion popup
   ============================================================ */
;(function () {
  'use strict';

  var SESSION_KEY = 'icu-install-dismissed';   /* sessionStorage: per-tab dismiss only */
  var INSTALLED_KEY = 'icu-install-done';      /* localStorage: permanently hide once installed */
  var deferredPrompt = null;

  /* ---- Register Service Worker ---- */
  if ('serviceWorker' in navigator) {
    var swPath = (function () {
      var depth = 0;
      var file = (location.pathname.split('/').pop() || 'index.html').replace(/[?#].*$/, '') || 'index.html';
      if (/^(monitoring|abg|weaning|setting|kalkulator|skoring|teori|cairan|drug-reference|ekg)\.html$/.test(file)) depth = 1;
      else if (/^(teori-|skoring-|kalkulator-)/.test(file)) depth = 2;
      return ['', '../', '../../'][depth] + 'sw.js';
    })();
    navigator.serviceWorker.register(swPath).catch(function (err) {
      console.warn('[ICU PWA] SW registration failed:', err);
    });

    /* Listen for SW_UPDATED message → show toast then reload */
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'SW_UPDATED') {
        showUpdateToast();
      }
    });
  }

  /* ---- Capture install prompt ---- */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;

    /* Unlock button: display:none → display:flex (opacity still 0 until scroll) */
    var btn = document.getElementById('pwa-install-btn');
    if (btn) btn.classList.add('pwa-ready');

    /* Show popup every new session (unless already installed or dismissed this tab) */
    if (!localStorage.getItem(INSTALLED_KEY) && !sessionStorage.getItem(SESSION_KEY)) {
      setTimeout(showInstallPopup, 1800);
    }
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    var btn = document.getElementById('pwa-install-btn');
    if (btn) btn.classList.remove('pwa-ready', 'visible');
    hideInstallPopup();
    localStorage.setItem(INSTALLED_KEY, '1');
  });

  /* ---- Build install button ---- */
  function buildInstallBtn() {
    if (document.getElementById('pwa-install-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.type = 'button';
    btn.title = 'Install App';
    btn.innerHTML = '<span class="pwa-icon">⬇</span><span>Install App</span>';
    btn.addEventListener('click', triggerInstall);
    document.body.appendChild(btn);
  }

  /* ---- Build install suggestion popup ---- */
  function buildInstallPopup() {
    if (document.getElementById('pwa-popup-overlay')) return;

    /* Inject popup styles */
    var s = document.createElement('style');
    s.id = 'pwa-popup-styles';
    s.textContent =
      '#pwa-popup-overlay{display:none;position:fixed;inset:0;z-index:10100;' +
        'background:rgba(0,0,0,.4);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
        'align-items:center;justify-content:center;padding:20px;}' +
      '#pwa-popup-overlay.pwa-open{display:flex;}' +
      '#pwa-popup-box{background:rgba(30,30,32,0.75);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);' +
        'border:1px solid rgba(255,255,255,0.1);border-radius:24px;' +
        'padding:28px 24px 24px;max-width:320px;width:100%;box-shadow:0 24px 48px rgba(0,0,0,.4);' +
        'display:flex;flex-direction:column;gap:16px;animation:pwaPopIn .35s cubic-bezier(0.2, 0.8, 0.2, 1);}' +
      '[data-theme="light"] #pwa-popup-box{background:rgba(255,255,255,0.75);border-color:rgba(0,0,0,0.1);box-shadow:0 12px 36px rgba(0,0,0,.15);}' +
      '@keyframes pwaPopIn{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}' +
      '#pwa-popup-box .pwa-pop-icon{font-size:42px;text-align:center;line-height:1;margin-bottom:-4px;}' +
      '#pwa-popup-box h3{margin:0;font-size:17px;font-weight:600;color:var(--text);text-align:center;letter-spacing:-0.02em;}' +
      '#pwa-popup-box p{margin:0;font-size:13px;line-height:1.4;color:var(--text2);text-align:center;}' +
      '.pwa-pop-actions{display:flex;gap:10px;flex-direction:column;margin-top:4px;}' +
      '#pwa-popup-install-btn{height:44px;border-radius:14px;border:none;background:var(--accent);color:var(--btn-fg);' +
        'font-size:15px;font-weight:600;cursor:pointer;transition:transform .15s,opacity .15s;}' +
      '#pwa-popup-install-btn:active{transform:scale(.97);}' +
      '#pwa-popup-dismiss-btn{height:44px;border-radius:14px;border:none;background:rgba(150,150,150,0.15);' +
        'color:var(--text);font-size:15px;font-weight:600;cursor:pointer;' +
        'transition:background .15s,transform .15s;}' +
      '[data-theme="light"] #pwa-popup-dismiss-btn{background:rgba(0,0,0,0.06);}' +
      '#pwa-popup-dismiss-btn:active{transform:scale(.97);}';
    document.head.appendChild(s);

    var overlay = document.createElement('div');
    overlay.id = 'pwa-popup-overlay';
    overlay.innerHTML =
      '<div id="pwa-popup-box">' +
        '<div class="pwa-pop-icon">📲</div>' +
        '<h3>Install ICU/ER Helper</h3>' +
        '<p>Akses panduan klinis lebih cepat — tersedia offline, langsung dari layar utama tanpa perlu buka browser.</p>' +
        '<div class="pwa-pop-actions">' +
          '<button id="pwa-popup-install-btn" type="button">⬇ Install Sekarang</button>' +
          '<button id="pwa-popup-dismiss-btn" type="button">Nanti saja</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('pwa-popup-install-btn').addEventListener('click', function () {
      hideInstallPopup();
      triggerInstall();
    });
    document.getElementById('pwa-popup-dismiss-btn').addEventListener('click', function () {
      hideInstallPopup();
      sessionStorage.setItem(SESSION_KEY, '1');  /* hanya dismiss tab ini; muncul lagi next visit */
    });
  }

  function showInstallPopup() {
    var overlay = document.getElementById('pwa-popup-overlay');
    if (overlay) { overlay.classList.add('pwa-open'); document.body.style.overflow = 'hidden'; }
  }

  function hideInstallPopup() {
    var overlay = document.getElementById('pwa-popup-overlay');
    if (overlay) { overlay.classList.remove('pwa-open'); document.body.style.overflow = ''; }
  }

  /* ---- Trigger native install prompt ---- */
  function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (choice) {
      if (choice.outcome === 'accepted') localStorage.setItem(INSTALLED_KEY, '1');
      deferredPrompt = null;
      var btn = document.getElementById('pwa-install-btn');
      if (btn) btn.classList.remove('pwa-ready', 'visible');
    });
  }

  /* ---- Update toast (shown when new SW activates) ---- */
  function showUpdateToast() {
    if (document.getElementById('sw-update-toast')) return;

    var s = document.createElement('style');
    s.textContent =
      '#sw-update-toast{position:fixed;bottom:72px;left:50%;transform:translateX(-50%);' +
        'background:var(--card);border:1.5px solid var(--accent);border-radius:10px;' +
        'padding:10px 18px;display:flex;align-items:center;gap:10px;' +
        'font-family:"JetBrains Mono",monospace;font-size:11px;color:var(--text);' +
        'box-shadow:0 4px 20px rgba(0,0,0,.4);z-index:9999;white-space:nowrap;' +
        'animation:swToastIn .3s ease;}' +
      '@keyframes swToastIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}' +
        'to{opacity:1;transform:translateX(-50%) translateY(0)}}' +
      '#sw-update-toast .sw-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);' +
        'animation:swPulse 1s ease-in-out infinite;}' +
      '@keyframes swPulse{0%,100%{opacity:1}50%{opacity:.3}}';
    document.head.appendChild(s);

    var toast = document.createElement('div');
    toast.id = 'sw-update-toast';
    toast.innerHTML = '<span class="sw-dot"></span>App diperbarui — memuat ulang...';
    document.body.appendChild(toast);

    setTimeout(function () { window.location.reload(); }, 2500);
  }

  /* ---- Init ---- */
  function init() {
    buildInstallBtn();
    buildInstallPopup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
