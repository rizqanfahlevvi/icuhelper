/* ============================================================
   calc-history.js — Log perhitungan, disimpan ke localStorage
   ============================================================ */

(function () {
  var STORAGE_KEY = 'icu-calc-history';
  var MAX_ENTRIES = 30;

  /* ── Storage ─────────────────────────────────────────────── */

  function readStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function writeStorage(entries) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch (e) {}
  }

  /* ── Public API ──────────────────────────────────────────── */

  window.saveCalcHistory = function (module, label, inputs, summary) {
    var entries = readStorage();
    entries.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      module: module,
      label: label,
      inputs: inputs,
      summary: summary,
      timestamp: Date.now()
    });
    writeStorage(entries.slice(0, MAX_ENTRIES));
  };

  window.loadCalcHistory = function (module) {
    var entries = readStorage();
    return module ? entries.filter(function (e) { return e.module === module; }) : entries;
  };

  /* Label modul untuk halaman riwayat terpusat. Tambahkan saat
     menyambungkan kalkulator baru ke saveCalcHistory(). */
  var MODULE_META = {
    abg:     { label: 'ABG',           icon: '🩸', href: 'abg.html' },
    egfr:    { label: 'eGFR',          icon: '🫘', href: 'kalkulator/kalkulator-renal.html' },
    aki:     { label: 'Staging AKI',   icon: '⚠️', href: 'kalkulator/kalkulator-renal.html' },
    fena:    { label: 'FENa/FEUrea',   icon: '⚖️', href: 'kalkulator/kalkulator-renal.html' },
    osm:     { label: 'Osmolalitas',   icon: '💧', href: 'kalkulator/kalkulator-renal.html' },
    buncr:   { label: 'BUN:Kreatinin', icon: '⚗️', href: 'kalkulator/kalkulator-renal.html' }
  };
  window.calcHistoryModuleMeta = MODULE_META;

  window.deleteCalcHistoryEntry = function (id) {
    writeStorage(readStorage().filter(function (e) { return e.id !== id; }));
  };

  window.clearCalcHistory = function (module) {
    if (!module) { writeStorage([]); return; }
    writeStorage(readStorage().filter(function (e) { return e.module !== module; }));
  };

  /* ── Time format ─────────────────────────────────────────── */

  function formatTime(ts) {
    var now = new Date();
    var d   = new Date(ts);
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var yestStart  = todayStart - 86400000;
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    var time = hh + ':' + mm;
    if (ts >= todayStart)  return 'Hari ini ' + time;
    if (ts >= yestStart)   return 'Kemarin ' + time;
    var dd = String(d.getDate()).padStart(2, '0');
    var mo = String(d.getMonth() + 1).padStart(2, '0');
    return dd + '/' + mo + ' ' + time;
  }
  window.formatCalcHistoryTime = formatTime;

  /* ── Render Panel ────────────────────────────────────────── */

  window.renderCalcHistory = function (containerId, module, onRestore) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    var entries = window.loadCalcHistory(module);

    /* Wrapper */
    var wrap = document.createElement('div');
    wrap.className = 'ch-wrap';

    /* Header toggle */
    var header = document.createElement('button');
    header.className = 'ch-header';
    header.type = 'button';
    header.innerHTML =
      '<span class="ch-title">🕓 Riwayat Perhitungan' +
        (entries.length ? ' <span class="ch-badge">' + entries.length + '</span>' : '') +
      '</span>' +
      '<span class="ch-chev">▼</span>';

    var body = document.createElement('div');
    body.className = 'ch-body';

    var open = false;
    header.addEventListener('click', function () {
      open = !open;
      body.style.display = open ? 'block' : 'none';
      header.querySelector('.ch-chev').style.transform = open ? 'rotate(180deg)' : '';
      if (open) rebuildList();
    });

    function rebuildList() {
      body.innerHTML = '';
      var list = window.loadCalcHistory(module);

      if (!list.length) {
        body.innerHTML = '<div class="ch-empty">Belum ada riwayat perhitungan</div>';
        return;
      }

      /* Clear all */
      var clearRow = document.createElement('div');
      clearRow.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:6px';
      var clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'ch-del-all';
      clearBtn.textContent = '🗑 Hapus Semua';
      clearBtn.addEventListener('click', function () {
        var all = readStorage().filter(function (e) { return e.module !== module; });
        writeStorage(all);
        rebuildList();
        /* Update badge */
        var badge = header.querySelector('.ch-badge');
        if (badge) badge.textContent = '0';
      });
      clearRow.appendChild(clearBtn);
      body.appendChild(clearRow);

      list.forEach(function (entry) {
        var item = document.createElement('div');
        item.className = 'ch-item';

        var left = document.createElement('div');
        left.className = 'ch-left';

        var lbl = document.createElement('div');
        lbl.className = 'ch-label';
        lbl.textContent = entry.label;

        var sum = document.createElement('div');
        sum.className = 'ch-summary';
        sum.textContent = entry.summary;

        var time = document.createElement('div');
        time.className = 'ch-time';
        time.textContent = formatTime(entry.timestamp);

        left.appendChild(lbl);
        left.appendChild(sum);
        left.appendChild(time);

        var actions = document.createElement('div');
        actions.className = 'ch-actions';

        var restoreBtn = document.createElement('button');
        restoreBtn.type = 'button';
        restoreBtn.className = 'ch-restore';
        restoreBtn.textContent = '↩ Pakai';
        restoreBtn.addEventListener('click', function () {
          if (onRestore) onRestore(entry);
        });

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'ch-del';
        delBtn.textContent = '✕';
        delBtn.title = 'Hapus';
        delBtn.addEventListener('click', function () {
          var remaining = readStorage().filter(function (e) { return e.id !== entry.id; });
          writeStorage(remaining);
          rebuildList();
        });

        actions.appendChild(restoreBtn);
        actions.appendChild(delBtn);
        item.appendChild(left);
        item.appendChild(actions);
        body.appendChild(item);
      });
    }

    wrap.appendChild(header);
    wrap.appendChild(body);
    container.appendChild(wrap);
  };
})();
