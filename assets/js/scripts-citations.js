/* ============================================================
   scripts-citations.js — ICU Helper Global Citation Engine
   Vancouver auto-numbering, click popup, footer ref list.
   Depends on: ICU_REFS (assets/data/references.js)
   ============================================================ */
;(function () {
  'use strict';

  /* ---- Helpers ---- */
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getRef(id) {
    if (typeof ICU_REFS === 'undefined') return null;
    var r = ICU_REFS[id];
    return (r && typeof r === 'object') ? r : null;
  }

  /* Format one reference entry in Vancouver style (null-safe) */
  function formatVancouver(ref, num) {
    if (!ref) {
      return '<span style="color:var(--muted);font-style:italic">Referensi tidak ditemukan.</span>';
    }
    var out = '';
    out += '<strong style="color:var(--text)">' + escHtml(ref.authors || '') + '</strong> ';
    out += '<em>' + escHtml(ref.title || '') + '</em>. ';
    if (ref.journal) out += '<em style="color:var(--text2)">' + escHtml(ref.journal) + '</em>';
    if (ref.year)    out += '. ' + ref.year;
    if (ref.vol)     out += ';' + escHtml(ref.vol);
    if (ref.pages)   out += ':' + escHtml(ref.pages);
    out += '.';
    if (ref.doi) {
      out += ' <a href="https://doi.org/' + escHtml(ref.doi) +
        '" target="_blank" rel="noopener" class="ref-doi">doi:' + escHtml(ref.doi) + '</a>';
    }
    return out;
  }

  /* ---- Page-level state ---- */
  var pageIndex = {};
  var pageOrder = [];
  var nextNum   = 1;

  function getOrAssignNum(id) {
    if (!pageIndex[id]) {
      pageIndex[id] = nextNum++;
      pageOrder.push(id);
    }
    return pageIndex[id];
  }

  /* ---- Popup ---- */
  var popup     = null;
  var popupOpen = false;

  function buildPopup() {
    if (document.getElementById('cite-popup')) return;
    popup = document.createElement('div');
    popup.id = 'cite-popup';
    popup.setAttribute('role', 'tooltip');
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML = '<div class="cite-popup-inner" id="cite-popup-inner"></div>';
    document.body.appendChild(popup);

    document.addEventListener('click', function (e) {
      if (popupOpen && popup && !popup.contains(e.target) &&
          !e.target.classList.contains('cite-ref')) {
        hidePopup();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popupOpen) hidePopup();
    });
  }

  function showPopup(refIds, anchorEl) {
    if (!popup) return;
    var inner = document.getElementById('cite-popup-inner');
    if (!inner) return;

    var html = '';
    refIds.forEach(function (id) {
      var ref = getRef(id);
      var num = getOrAssignNum(id);

      html += '<div class="cite-entry' + (!ref ? ' cite-entry-missing' : '') + '">';

      if (!ref) {
        html += '<span class="cite-num">[' + escHtml(id) + ']</span> ' +
                '<span style="color:var(--muted);font-style:italic">Referensi tidak ditemukan.</span>';
      } else {
        html += '<span class="cite-num">[' + num + ']</span>';
        html += '<div class="cite-body">';
        html += '<span class="cite-authors">' + escHtml(ref.authors || '') + '</span>';
        html += '<span class="cite-title">' + escHtml(ref.title || '') + '</span>';
        html += '<span class="cite-journal">';
        if (ref.journal) html += '<em>' + escHtml(ref.journal) + '</em>';
        if (ref.year)    html += '. ' + ref.year;
        if (ref.vol)     html += ';' + escHtml(ref.vol);
        if (ref.pages)   html += ':' + escHtml(ref.pages);
        html += '.';
        html += '</span>';
        if (ref.doi) {
          html += '<a href="https://doi.org/' + escHtml(ref.doi) +
            '" target="_blank" rel="noopener" class="cite-badge">DOI ↗</a>';
        }
        html += '</div>';
      }
      html += '</div>';
    });

    inner.innerHTML = html;
    popupOpen = true;
    popup.style.left = '-9999px';
    popup.style.top  = '-9999px';
    popup.classList.add('cite-popup-visible');

    /* Position after layout paint so dimensions are accurate */
    requestAnimationFrame(function () {
      positionPopup(anchorEl);
    });
  }

  function positionPopup(anchor) {
    if (!popup || !anchor) return;
    var rect = anchor.getBoundingClientRect();
    var pw   = popup.offsetWidth  || 320;
    var ph   = popup.offsetHeight || 120;
    var vw   = window.innerWidth;
    var vh   = window.innerHeight;

    /* position:fixed — coords are viewport-relative, no scroll offset needed */
    var top  = rect.bottom + 8;
    var left = rect.left;

    /* Clamp horizontally within viewport */
    if (left + pw > vw - 12) left = Math.max(8, vw - pw - 12);
    if (left < 8)             left = 8;

    /* Flip above anchor if popup would overflow bottom of viewport */
    if (top + ph + 12 > vh) {
      top = rect.top - ph - 8;
    }

    popup.style.top  = top  + 'px';
    popup.style.left = left + 'px';
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.remove('cite-popup-visible');
    popupOpen = false;
  }

  /* ---- Process all cite-ref elements on the page ---- */
  function processCiteRefs() {
    var refs = document.querySelectorAll('.cite-ref[data-refs]');
    refs.forEach(function (el) {
      var ids = el.getAttribute('data-refs')
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);

      var nums = ids.map(function (id) { return getOrAssignNum(id); });
      el.textContent = nums.map(function (n) { return '[' + n + ']'; }).join('');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Referensi ' + nums.join(', '));
      el.setAttribute('role', 'button');

      el.addEventListener('click', function (e) {
        e.stopPropagation();
        /* Toggle: close if same anchor is clicked again */
        if (popupOpen && popup) {
          var prevAnchor = popup._anchor;
          if (prevAnchor === el) { hidePopup(); return; }
        }
        popup._anchor = el;
        showPopup(ids, el);
      });

      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showPopup(ids, el);
        }
      });
    });
  }

  /* ---- Build footer reference list ---- */
  function buildFooterRefList() {
    if (pageOrder.length === 0) return;

    var section = document.getElementById('page-ref-section');
    if (!section) {
      section = document.createElement('section');
      section.id = 'page-ref-section';
      section.className = 'page-ref-section';

      /* Insert BEFORE <footer> if present, else before </body> */
      var footer = document.querySelector('footer.ix-footer') ||
                   document.querySelector('footer');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(section, footer);
      } else {
        document.body.appendChild(section);
      }
    }

    var detailsEl = document.createElement('details');
    detailsEl.className = 'ref-details';

    var summary = document.createElement('summary');
    summary.className = 'ref-summary';
    summary.textContent = '📚 Daftar Referensi (' + pageOrder.length + ')';
    detailsEl.appendChild(summary);

    var list = document.createElement('ol');
    list.className = 'ref-list';

    pageOrder.forEach(function (id) {
      var ref = getRef(id);
      var num = pageIndex[id];
      var li  = document.createElement('li');
      li.className = 'ref-item';
      li.id = 'ref-' + id.replace(/[^a-zA-Z0-9_-]/g, '_');

      /* Number badge */
      var numBadge = document.createElement('span');
      numBadge.className = 'ref-num-badge';
      numBadge.textContent = num;
      li.appendChild(numBadge);

      /* Content */
      var content = document.createElement('span');
      content.className = 'ref-item-content';
      content.innerHTML = formatVancouver(ref, num);
      li.appendChild(content);

      /* Open article link */
      if (ref && ref.doi) {
        var fullLink = document.createElement('a');
        fullLink.href = 'https://doi.org/' + ref.doi;
        fullLink.target = '_blank';
        fullLink.rel = 'noopener';
        fullLink.className = 'ref-full-link';
        fullLink.textContent = 'Buka artikel ↗';
        li.appendChild(fullLink);
      }

      list.appendChild(li);
    });

    detailsEl.appendChild(list);
    section.innerHTML = '';
    section.appendChild(detailsEl);
  }

  /* ---- Init ---- */
  function init() {
    buildPopup();
    processCiteRefs();
    buildFooterRefList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
