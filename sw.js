/* ============================================================
   ICU Helper — Service Worker v2
   ============================================================
   DEPLOY CHECKLIST: bump CACHE_VERSION below on every deploy.
   This invalidates the old cache and forces fresh assets.
   Format: 'icu-helper-v2.0.' + deploy date (YYYYMMDD)
   ============================================================

   Cache strategies:
   - HTML pages          → Network-first  (always latest structure)
   - JS logic + data     → Network-first  (always latest code/data)
   - CSS + images        → Cache-first    (stable, optimise speed)
   ============================================================ */

var CACHE_VERSION = 'icu-helper-v2.0.20260610e';   /* ← bump on each deploy */
var CACHE_NAME    = CACHE_VERSION;

/* Paths that MUST always be fresh from the network.
   Anything matching these patterns uses network-first. */
var NETWORK_FIRST_PATTERNS = [
  /\/assets\/js\//,
  /\/assets\/data\//
];

/* Pre-cache only stable assets (CSS + images + HTML shells).
   JS/data are intentionally excluded — fetched live on every load. */
var STATIC_ASSETS = [
  /* Root */
  './index.html',
  './manifest.json',

  /* CSS */
  './assets/css/styles.css',

  /* Pages — depth 1 */
  './pages/abg.html',
  './pages/drug-reference.html',
  './pages/cairan.html',
  './pages/kalkulator.html',
  './pages/monitoring.html',
  './pages/referensi.html',
  './pages/riwayat.html',
  './pages/setting.html',
  './pages/skoring.html',
  './pages/teori.html',
  './pages/weaning.html',

  /* Pages — kalkulator */
  './pages/kalkulator/kalkulator-drug.html',
  './pages/kalkulator/kalkulator-electro.html',
  './pages/kalkulator/kalkulator-ibw.html',
  './pages/kalkulator/kalkulator-nlr.html',
  './pages/kalkulator/kalkulator-pf.html',
  './pages/kalkulator/kalkulator-pulmo.html',
  './pages/kalkulator/kalkulator-pump.html',
  './pages/kalkulator/kalkulator-renal.html',
  './pages/kalkulator/kalkulator-transfusi.html',
  './pages/kalkulator/kalkulator-cairan.html',
  './pages/kalkulator/kalkulator-insulin.html',
  './pages/kalkulator/kalkulator-nutrisi.html',
  './pages/kalkulator/kalkulator-ventilator-adv.html',

  /* Pages — skoring */
  './pages/skoring/skoring-apache.html',
  './pages/skoring/skoring-bfs.html',
  './pages/skoring/skoring-camicu.html',
  './pages/skoring/skoring-candida.html',
  './pages/skoring/skoring-cpis.html',
  './pages/skoring/skoring-rass.html',
  './pages/skoring/skoring-sofa.html',

  /* Pages — teori */
  './pages/teori/teori-b1b6.html',
  './pages/teori/teori-fisiologi.html',
  './pages/teori/teori-gagalnapas.html',
  './pages/teori/teori-impending.html',
  './pages/teori/teori-sepsis.html',
  './pages/teori/teori-airway.html',
  './pages/teori/teori-sat-sbt-vap.html',
  './pages/teori/teori-dka-hhs.html',
  './pages/teori/teori-syok.html',
  './pages/teori/teori-nutrisi.html',
  './pages/teori/teori-aki-crrt.html',

  /* Icons */
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

/* ── Install: pre-cache stable assets ─────────────────────── */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ── Activate: delete old caches + notify clients to reload ── */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      /* Tell all open tabs to reload once so they get fresh assets */
      return self.clients.matchAll({ type: 'window' });
    }).then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
      });
    })
  );
});

/* ── Helpers ────────────────────────────────────────────────── */
function networkFirst(req) {
  return fetch(req).then(function (res) {
    if (res && res.status === 200 && res.type !== 'opaque') {
      var clone = res.clone();
      caches.open(CACHE_NAME).then(function (c) { c.put(req, clone); });
    }
    return res;
  }).catch(function () {
    /* Offline / network failure → serve the cached copy of THE SAME url
       only. NEVER fall back to index.html for a different URL: doing so
       serves the homepage under e.g. /pages/teori.html, whose relative
       links then compound into /pages/pages/pages/... and freeze. */
    return caches.match(req);
  });
}

function cacheFirst(req) {
  return caches.match(req).then(function (cached) {
    if (cached) return cached;
    return fetch(req).then(function (res) {
      if (!res || res.status !== 200 || res.type === 'opaque') return res;
      var clone = res.clone();
      caches.open(CACHE_NAME).then(function (c) { c.put(req, clone); });
      return res;
    });
  });
}

/* ── Fetch ──────────────────────────────────────────────────── */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = new URL(req.url);

  /* Only handle same-origin requests */
  if (url.origin !== location.origin) return;

  var isHTML = req.headers.get('accept') &&
               req.headers.get('accept').includes('text/html');

  var isNetworkFirst = isHTML || NETWORK_FIRST_PATTERNS.some(function (p) {
    return p.test(url.pathname);
  });

  e.respondWith(
    isNetworkFirst ? networkFirst(req) : cacheFirst(req)
  );
});
