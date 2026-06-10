/* ============================================================
   MD Kit — Feedback Widget  ·  feedback.js  ·  v2
   Floating button + modal form → Google Apps Script webhook
   Self-contained: injects own CSS, reads CSS vars from styles.css
   ============================================================ */
(function () {
  'use strict';

  var WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxbWDxYKapZO4KXt1ovfT_neb3_R5UenGySUnOZ5UYbCAjGEkX3kdwWrltogq44522a/exec';
  var MAX_CHARS   = 1000;

  var SVG_BUG     = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle"><path d="M8 2h8"/><path d="M9 3a4 4 0 0 0-2.52 1.34L4 7"/><path d="M15 3a4 4 0 0 1 2.52 1.34L20 7"/><path d="M20 13c0 4.418-3.582 8-8 8s-8-3.582-8-8V9a8 8 0 1 1 16 0v4z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>';
  var SVG_FEATURE = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>';
  var SVG_COMMENT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var TYPES = [
    { id: 'bug',     svg: SVG_BUG,     label: 'Bug Report / Error Konten' },
    { id: 'feature', svg: SVG_FEATURE, label: 'Saran Fitur Baru'          },
    { id: 'comment', svg: SVG_COMMENT, label: 'Komentar Bebas'            }
  ];

  /* Produk MD Kit yang dapat diberi feedback */
  var PRODUCTS = [
    { id: 'mdkit',  label: 'MD Kit (Keseluruhan)' },
    { id: 'icu',    label: 'ICU Helper' },
    { id: 'acls',   label: 'ACLS Helper' },
    { id: 'resneo', label: 'ResNeo Helper' },
    { id: 'picnic', label: 'PICNIC Helper' }
  ];

  /* Dari mana menemukan MD Kit */
  var SOURCES = [
    'Teman / Sejawat',
    'Media Sosial (IG/WA/dll)',
    'Google / Pencarian',
    'Seminar / Workshop / Pelatihan',
    'Rumah Sakit / Tempat Kerja',
    'Lainnya'
  ];

  /* Platform kontak */
  var CONTACTS = ['WhatsApp', 'Instagram', 'LinkedIn'];

  var _selectedType = 'bug';
  var _rating       = 0;
  var _isOpen       = false;

  /* ── CSS ─────────────────────────────────────────────────────── */
  function injectStyles() {
    var old = document.getElementById('fb-styles');
    if (old) old.parentNode.removeChild(old);
    var s = document.createElement('style');
    s.id = 'fb-styles';
    s.textContent = [
      /* FAB — hidden, trigger now lives in sidebar */
      '#fb-fab{display:none !important;}',

      /* Overlay */
      '#fb-overlay{',
        'position:fixed;inset:0;',
        'background:rgba(0,0,0,.4);',
        'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);',
        'z-index:10000;',
        'display:flex;align-items:center;justify-content:center;',
        'padding:16px;',
        'opacity:0;pointer-events:none;',
        'transition:opacity .25s ease;',
      '}',
      '#fb-overlay.fb-open{opacity:1;pointer-events:all;}',

      /* Modal */
      '#fb-modal{',
        'width:100%;max-width:360px;',
        'background:var(--card);',
        'border:1px solid var(--border);',
        'border-radius:16px;overflow-y:auto;',
        'max-height:90vh;box-shadow:0 24px 60px rgba(0,0,0,.35);',
        'transform:translateY(24px) scale(.95);',
        'transition:transform .35s cubic-bezier(0.2, 0.8, 0.2, 1);',
        'scrollbar-width:none;', /* hidden scrollbar for sleekness */
      '}',
      '[data-theme="light"] #fb-modal{box-shadow:0 12px 40px rgba(0,0,0,.12);}',
      '[data-theme="dark"] #fb-modal{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);}',
      '[data-theme="light"] #fb-modal{backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}',
      '[data-theme="dark"] #fb-overlay{background:rgba(0,0,0,.55);}',
      '[data-theme="light"] #fb-overlay{background:rgba(0,0,0,.25);}',
      '#fb-modal::-webkit-scrollbar{display:none;}',
      '#fb-overlay.fb-open #fb-modal{transform:translateY(0) scale(1);}',
      /* Tablet/desktop — 3-col 1-baris, emoji + label sebaris */
      '@media(min-width:480px){',
        '#fb-modal{max-width:560px;}',
        '#fb-types{',
          'display:grid !important;',
          'grid-template-columns:repeat(3,1fr);',
          'gap:.4rem;',
        '}',
        '.fb-type-btn{',
          'width:100%;flex-direction:row;',
          'align-items:center;justify-content:center;',
          'gap:.4rem;padding:.55rem .35rem;',
          'text-align:center;',
        '}',
        '.fb-t-check{display:none;}',
      '}',
      '@media(min-width:680px){',
        '#fb-modal{max-width:620px;}',
        '#fb-hdr{padding:.9rem 1.5rem;}',
        '#fb-body{padding:1rem 1.5rem 1.4rem;}',
      '}',

      /* Header */
      '#fb-hdr{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:.85rem 1.15rem .8rem;',
        'border-bottom:1px solid var(--border);',
        'background:var(--bg);',
        'position:sticky;top:0;z-index:2;border-radius:16px 16px 0 0;',
      '}',
      '#fb-title{',
        'font-family:var(--font-mono);',
        'font-size:11px;font-weight:700;',
        'color:var(--text);letter-spacing:.05em;text-transform:uppercase;',
        'display:flex;align-items:center;gap:.45rem;',
      '}',
      '#fb-title .fb-dot{',
        'width:7px;height:7px;border-radius:50%;',
        'background:var(--accent);flex-shrink:0;',
      '}',
      '#fb-close-btn{',
        'font-family:var(--font-mono);font-size:11px;',
        'padding:.28rem .6rem;border-radius:6px;',
        'border:1px solid var(--border);background:transparent;',
        'color:var(--text2);cursor:pointer;',
        'transition:color .14s,border-color .14s;',
      '}',
      '#fb-close-btn:hover{color:var(--text);border-color:var(--border-hi);}',

      /* Body */
      '#fb-body{padding:1rem 1.15rem 1.3rem;}',

      /* Intro message */
      '#fb-intro{',
        'background:var(--bg);border:1px solid var(--border);border-radius:8px;',
        'padding:.7rem .9rem;margin-bottom:1rem;',
        'font-family:var(--font-sans);font-size:12px;line-height:1.65;',
        'color:var(--text2);',
      '}',
      '#fb-intro .fb-intro-sig{',
        'display:block;margin-top:.45rem;',
        'font-family:var(--font-mono);font-size:10px;',
        'color:var(--accent);font-weight:600;',
      '}',

      /* Name input */
      '#fb-name{',
        'width:100%;box-sizing:border-box;',
        'background:var(--bg);border:1px solid var(--border);border-radius:7px;',
        'padding:.55rem .8rem;margin-bottom:.95rem;',
        'font-family:var(--font-sans);font-size:12.5px;',
        'color:var(--text);outline:none;',
        'transition:border-color .15s,background .15s;',
      '}',
      '#fb-name:focus{border-color:var(--accent2);background:var(--bg2);}',
      '#fb-name::placeholder{color:var(--text3);}',

      /* Generic select + text input shared with name */
      '.fb-select,.fb-input{',
        'width:100%;box-sizing:border-box;',
        'background:var(--bg);border:1px solid var(--border);border-radius:7px;',
        'padding:.55rem .8rem;margin-bottom:.95rem;',
        'font-family:var(--font-sans);font-size:12.5px;',
        'color:var(--text);outline:none;',
        'transition:border-color .15s,background .15s;',
      '}',
      '.fb-select:focus,.fb-input:focus{border-color:var(--accent2);background:var(--bg2);}',
      '.fb-input::placeholder{color:var(--text3);}',
      '.fb-select option{background:var(--card);color:var(--text);}',

      /* Required asterisk */
      '.fb-req{color:var(--danger);font-weight:700;margin-left:2px;}',

      /* Rating stars */
      '#fb-rating{display:flex;gap:.35rem;margin-bottom:.95rem;align-items:center;}',
      '.fb-star{',
        'cursor:pointer;font-size:24px;line-height:1;',
        'color:var(--border-hi);transition:color .12s,transform .1s;',
        'user-select:none;',
      '}',
      '.fb-star:hover{transform:scale(1.15);}',
      '.fb-star.fb-star-on{color:#f5b301;}',
      '#fb-rating-val{',
        'font-family:var(--font-mono);font-size:10px;',
        'color:var(--text3);margin-left:.4rem;',
      '}',

      /* Contact row: platform select + handle input */
      '#fb-contact-row{display:flex;gap:.5rem;margin-bottom:.95rem;}',
      '#fb-contact-platform{flex:0 0 38%;margin-bottom:0;}',
      '#fb-contact-value{flex:1;margin-bottom:0;}',

      /* Page chip */
      '#fb-page-chip{',
        'display:inline-flex;align-items:center;gap:.3rem;',
        'font-family:var(--font-mono);font-size:9.5px;',
        'color:var(--text3);',
        'background:var(--bg);border:1px solid var(--border);',
        'border-radius:20px;padding:.18rem .6rem;',
        'margin-bottom:.9rem;max-width:100%;overflow:hidden;',
        'white-space:nowrap;text-overflow:ellipsis;',
      '}',
      '#fb-page-chip .fb-page-ico{color:var(--accent2);flex-shrink:0;}',

      /* Section label */
      '.fb-lbl{',
        'font-family:var(--font-mono);',
        'font-size:9px;font-weight:700;',
        'text-transform:uppercase;letter-spacing:.08em;',
        'color:var(--text2);margin-bottom:.45rem;',
      '}',

      /* Type buttons */
      '#fb-types{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.95rem;}',
      '.fb-type-btn{',
        'display:flex;align-items:center;gap:.55rem;',
        'width:100%;padding:.46rem .75rem;',
        'border-radius:7px;border:1px solid var(--border);',
        'background:var(--bg);color:var(--text2);',
        'cursor:pointer;text-align:left;',
        'font-family:var(--font-mono);font-size:11px;font-weight:500;',
        'transition:background .12s,border-color .12s,color .12s;',
      '}',
      '.fb-type-btn:hover{background:var(--bg2);color:var(--text);border-color:var(--border-hi);}',
      '.fb-type-btn.fb-active{',
        'border-color:var(--accent);background:var(--accent-dim);color:var(--text);',
      '}',
      '.fb-t-svg{display:flex;align-items:center;flex-shrink:0;line-height:1;color:inherit;}',
      '.fb-t-txt{flex:1;}',
      '.fb-t-check{font-size:10px;color:var(--accent);opacity:0;transition:opacity .12s;}',
      '.fb-type-btn.fb-active .fb-t-check{opacity:1;}',

      /* Textarea */
      '#fb-msg{',
        'width:100%;box-sizing:border-box;',
        'background:var(--bg);border:1px solid var(--border);border-radius:7px;',
        'padding:.65rem .8rem;',
        'font-family:var(--font-sans);font-size:12.5px;line-height:1.65;',
        'color:var(--text);',
        'resize:vertical;min-height:88px;max-height:220px;',
        'outline:none;',
        'transition:border-color .15s,background .15s;',
      '}',
      '#fb-msg:focus{border-color:var(--accent2);background:var(--bg2);}',
      '#fb-msg::placeholder{color:var(--text3);}',

      /* Footer row */
      '#fb-footer{',
        'display:flex;align-items:center;justify-content:space-between;',
        'margin-top:.8rem;gap:.5rem;',
      '}',
      '#fb-char{',
        'font-family:var(--font-mono);font-size:9.5px;',
        'color:var(--text3);flex-shrink:0;',
      '}',
      '#fb-char.fb-over{color:var(--danger);}',

      '#fb-submit{',
        'font-family:var(--font-mono);font-size:11px;font-weight:700;',
        'padding:.42rem 1.1rem;border-radius:7px;border:none;',
        'background:var(--accent);color:#000;',
        'cursor:pointer;letter-spacing:.03em;',
        'transition:opacity .15s,transform .12s;',
      '}',
      '#fb-submit:hover:not(:disabled){opacity:.85;}',
      '#fb-submit:active:not(:disabled){transform:scale(.96);}',
      '#fb-submit:disabled{opacity:.35;cursor:not-allowed;}',

      /* Status */
      '#fb-status{',
        'margin-top:.7rem;',
        'font-family:var(--font-mono);font-size:11px;line-height:1.5;',
        'padding:.5rem .75rem;border-radius:7px;',
        'display:none;',
      '}',
      '#fb-status.fb-ok{',
        'display:block;',
        'background:var(--accent-dim);color:var(--accent);',
        'border:1px solid var(--accent-dim2);',
      '}',
      '#fb-status.fb-err{',
        'display:block;',
        'background:var(--danger-dim);color:var(--danger);',
        'border:1px solid rgba(255,59,92,.18);',
      '}',

      /* Spinner */
      '@keyframes fb-spin{to{transform:rotate(360deg)}}',
      '.fb-spin{display:inline-block;animation:fb-spin .7s linear infinite;margin-right:.3rem;}',

      /* Success popup overlay */
      '#fb-success-overlay{',
        'position:fixed;inset:0;',
        'background:rgba(0,0,0,.65);',
        'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
        'z-index:700;',
        'display:flex;align-items:center;justify-content:center;',
        'padding:20px;',
        'opacity:0;pointer-events:none;',
        'transition:opacity .22s ease;',
      '}',
      '#fb-success-overlay.fb-open{opacity:1;pointer-events:all;}',
      '#fb-success-box{',
        'width:100%;max-width:360px;',
        'background:var(--card);border:1px solid var(--border);border-radius:14px;',
        'padding:2rem 1.75rem 1.75rem;',
        'text-align:center;',
        'transform:scale(.92);',
        'transition:transform .22s ease;',
      '}',
      '#fb-success-overlay.fb-open #fb-success-box{transform:scale(1);}',
      '#fb-success-icon{font-size:42px;line-height:1;margin-bottom:.9rem;}',
      '#fb-success-title{',
        'font-family:var(--font-mono);font-size:13px;font-weight:700;',
        'color:var(--accent);margin-bottom:.75rem;letter-spacing:.03em;',
      '}',
      '#fb-success-msg{',
        'font-family:var(--font-sans);font-size:13px;line-height:1.7;',
        'color:var(--text2);margin-bottom:1.4rem;',
      '}',
      '#fb-success-close{',
        'font-family:var(--font-mono);font-size:11px;font-weight:700;',
        'padding:.5rem 1.6rem;border-radius:8px;border:none;',
        'background:var(--accent);color:#000;',
        'cursor:pointer;letter-spacing:.03em;',
        'transition:opacity .15s,transform .12s;',
      '}',
      '#fb-success-close:hover{opacity:.85;}',
      '#fb-success-close:active{transform:scale(.96);}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── DOM ─────────────────────────────────────────────────────── */
  function buildDOM() {
    var root = document.getElementById('feedback-root');
    if (!root) return;

    var typeBtns = TYPES.map(function (t) {
    var SVG_CHECK = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      return '<button class="fb-type-btn' + (t.id === 'bug' ? ' fb-active' : '') +
        '" data-type="' + t.id + '" type="button">' +
        '<span class="fb-t-svg">' + t.svg + '</span>' +
        '<span class="fb-t-txt">'   + t.label  + '</span>' +
        '<span class="fb-t-check">' + SVG_CHECK + '</span>' +
        '</button>';
    }).join('');

    var productOpts = PRODUCTS.map(function (p) {
      return '<option value="' + p.label + '"' + (p.id === 'mdkit' ? ' selected' : '') + '>' + p.label + '</option>';
    }).join('');

    var sourceOpts = '<option value="" selected disabled>Pilih salah satu…</option>' +
      SOURCES.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');

    var contactOpts = CONTACTS.map(function (c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join('');

    var starsHtml = '';
    for (var i = 1; i <= 5; i++) {
      starsHtml += '<span class="fb-star" data-val="' + i + '">★</span>';
    }
    starsHtml += '<span id="fb-rating-val">belum dinilai</span>';

    root.innerHTML =
      /* FAB — hidden (trigger is in sidebar) */
      '<span id="fb-fab" aria-hidden="true"></span>' +

      /* Success popup */
      '<div id="fb-success-overlay">' +
        '<div id="fb-success-box">' +
          '<div id="fb-success-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>' +
          '<div id="fb-success-title">Feedback Terkirim!</div>' +
          '<div id="fb-success-msg">' +
            'Terima kasih telah memberikan feedback, feedback rekan sejawat akan ' +
            'digunakan untuk pengembangan aplikasi ini menjadi lebih baik.' +
          '</div>' +
          '<button id="fb-success-close" type="button">Tutup</button>' +
        '</div>' +
      '</div>' +

      /* Overlay */
      '<div id="fb-overlay" role="dialog" aria-modal="true" aria-label="Form Feedback">' +
        '<div id="fb-modal">' +

          /* Header */
          '<div id="fb-hdr">' +
            '<div id="fb-title"><span class="fb-dot"></span>Feedback MD Kit</div>' +
            '<button id="fb-close-btn" type="button"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:middle;margin-right:4px;margin-top:-2px"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Tutup</button>' +
          '</div>' +

          /* Body */
          '<div id="fb-body">' +

            /* Intro message */
            '<div id="fb-intro">' +
              'MD Kit dibuat berdasarkan pengalaman dan bantuan dari AI, namun dalam penyempurnaannya, ' +
              'saya sangat memerlukan bantuan rekan-rekan sejawat terutama dalam hal pengembangan. ' +
              'Berikan kritik, saran, dan saran fitur untuk ICU Helper, ACLS Helper, ResNeo Helper, ' +
              'PICNIC Helper, maupun MD Kit secara keseluruhan :)' +
              '<span class="fb-intro-sig">— Rizqan</span>' +
            '</div>' +

            /* Page chip */
            '<div id="fb-page-chip">' +
              '<span class="fb-page-ico">◈</span>' +
              '<span id="fb-page-name"></span>' +
            '</div>' +

            /* Produk */
            '<div class="fb-lbl">Feedback untuk<span class="fb-req">*</span></div>' +
            '<select id="fb-product" class="fb-select">' + productOpts + '</select>' +

            /* Name (required) */
            '<div class="fb-lbl">Nama<span class="fb-req">*</span></div>' +
            '<input id="fb-name" type="text" maxlength="80" placeholder="Nama kamu..." autocomplete="name">' +

            /* Kontak */
            '<div class="fb-lbl">Kontak <span style="font-weight:400;opacity:.6">(opsional)</span></div>' +
            '<div id="fb-contact-row">' +
              '<select id="fb-contact-platform" class="fb-select">' + contactOpts + '</select>' +
              '<input id="fb-contact-value" class="fb-input" type="text" maxlength="80" placeholder="No. WA / username IG / LinkedIn">' +
            '</div>' +

            /* Rating */
            '<div class="fb-lbl">Beri Rating <span style="font-weight:400;opacity:.6">(opsional)</span></div>' +
            '<div id="fb-rating">' + starsHtml + '</div>' +

            /* Type */
            '<div class="fb-lbl">Jenis Feedback</div>' +
            '<div id="fb-types">' + typeBtns + '</div>' +

            /* Sumber */
            '<div class="fb-lbl">Dari mana Anda menemukan MD Kit? <span style="font-weight:400;opacity:.6">(opsional)</span></div>' +
            '<select id="fb-source" class="fb-select">' + sourceOpts + '</select>' +

            /* Message */
            '<div class="fb-lbl">Pesan<span class="fb-req">*</span></div>' +
            '<textarea id="fb-msg" maxlength="' + MAX_CHARS + '" ' +
              'placeholder="Deskripsikan feedback kamu..."></textarea>' +

            '<div id="fb-footer">' +
              '<span id="fb-char">0 / ' + MAX_CHARS + '</span>' +
              '<button id="fb-submit" type="button" disabled>Kirim →</button>' +
            '</div>' +
            '<div id="fb-status"></div>' +
          '</div>' +

        '</div>' +
      '</div>';
  }

  /* ── Events ──────────────────────────────────────────────────── */
  function wireEvents() {
    var fab      = document.getElementById('fb-fab');
    var overlay  = document.getElementById('fb-overlay');
    var closeBtn = document.getElementById('fb-close-btn');
    var msgEl    = document.getElementById('fb-msg');
    var charEl   = document.getElementById('fb-char');
    var submitBtn= document.getElementById('fb-submit');
    var pageEl   = document.getElementById('fb-page-name');

    /* Page name */
    if (pageEl) pageEl.textContent = document.title || location.pathname;

    /* Open */
    fab.addEventListener('click', openModal);

    /* Close */
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _isOpen) closeModal();
    });

    /* Type selection */
    document.querySelectorAll('.fb-type-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.fb-type-btn').forEach(function (b) {
          b.classList.remove('fb-active');
        });
        btn.classList.add('fb-active');
        _selectedType = btn.dataset.type;
      });
    });

    /* Rating stars */
    var ratingVal = document.getElementById('fb-rating-val');
    document.querySelectorAll('.fb-star').forEach(function (star) {
      star.addEventListener('click', function () {
        _rating = parseInt(star.dataset.val, 10);
        paintStars(_rating);
        if (ratingVal) ratingVal.textContent = _rating + ' / 5';
      });
      star.addEventListener('mouseenter', function () {
        paintStars(parseInt(star.dataset.val, 10));
      });
    });
    var ratingWrap = document.getElementById('fb-rating');
    if (ratingWrap) ratingWrap.addEventListener('mouseleave', function () {
      paintStars(_rating);
    });

    /* Validation: Nama + Pesan wajib */
    var nameEl = document.getElementById('fb-name');
    function refreshSubmit() {
      var hasMsg  = (msgEl.value || '').trim().length > 0;
      var hasName = nameEl && (nameEl.value || '').trim().length > 0;
      submitBtn.disabled = !(hasMsg && hasName);
    }

    /* Char counter + validation */
    msgEl.addEventListener('input', function () {
      var len = msgEl.value.length;
      charEl.textContent = len + ' / ' + MAX_CHARS;
      charEl.classList.toggle('fb-over', len >= MAX_CHARS * 0.9);
      refreshSubmit();
    });
    if (nameEl) nameEl.addEventListener('input', refreshSubmit);

    /* Submit */
    submitBtn.addEventListener('click', submitFeedback);

    /* Success popup close */
    var successClose   = document.getElementById('fb-success-close');
    var successOverlay = document.getElementById('fb-success-overlay');
    function closeSuccess() {
      successOverlay.classList.remove('fb-open');
      document.body.style.overflow = '';
    }
    if (successClose)   successClose.addEventListener('click', closeSuccess);
    if (successOverlay) successOverlay.addEventListener('click', function(e) {
      if (e.target === successOverlay) closeSuccess();
    });
  }

  /* ── Open / Close ────────────────────────────────────────────── */
  function openModal() {
    _isOpen = true;
    document.getElementById('fb-overlay').classList.add('fb-open');
    document.getElementById('fb-fab').classList.add('fb-hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var msg = document.getElementById('fb-msg');
      if (msg) msg.focus();
    }, 210);
  }

  function closeModal() {
    _isOpen = false;
    document.getElementById('fb-overlay').classList.remove('fb-open');
    document.getElementById('fb-fab').classList.remove('fb-hidden');
    document.body.style.overflow = '';
  }

  /* ── Rating helper ───────────────────────────────────────────── */
  function paintStars(n) {
    document.querySelectorAll('.fb-star').forEach(function (s) {
      s.classList.toggle('fb-star-on', parseInt(s.dataset.val, 10) <= n);
    });
  }

  /* ── Submit ──────────────────────────────────────────────────── */
  function submitFeedback() {
    var msgEl     = document.getElementById('fb-msg');
    var statusEl  = document.getElementById('fb-status');
    var submitBtn = document.getElementById('fb-submit');
    var message   = (msgEl.value || '').trim();
    if (!message) return;

    var nameEl  = document.getElementById('fb-name');
    var nama    = nameEl ? (nameEl.value || '').trim() : '';
    if (!nama) return; /* Nama wajib */

    var typeObj    = TYPES.filter(function (t) { return t.id === _selectedType; })[0] || TYPES[0];
    var productEl  = document.getElementById('fb-product');
    var produk     = productEl ? productEl.value : '-';
    var sourceEl   = document.getElementById('fb-source');
    var sumber     = sourceEl && sourceEl.value ? sourceEl.value : '-';
    var cPlatEl    = document.getElementById('fb-contact-platform');
    var cValEl     = document.getElementById('fb-contact-value');
    var cVal       = cValEl ? (cValEl.value || '').trim() : '';
    var kontak     = cVal ? ((cPlatEl ? cPlatEl.value : '') + ': ' + cVal) : '-';
    var rating     = _rating > 0 ? String(_rating) : '-';

    /* Loading */
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="fb-spin">◌</span>Mengirim…';
    statusEl.className = '';
    statusEl.style.display = 'none';

    /* ── GET + URL params ───────────────────────────────────────────
       POST ke Apps Script dari browser selalu gagal karena redirect 302
       mengubah POST → GET dan body hilang. GET dengan query params
       tidak punya masalah ini — params tetap ada setelah redirect.
    ─────────────────────────────────────────────────────────────── */
    var qs = [
      'produk='    + encodeURIComponent(produk),
      'type='      + encodeURIComponent(typeObj.label),
      'rating='    + encodeURIComponent(rating),
      'nama='      + encodeURIComponent(nama),
      'kontak='    + encodeURIComponent(kontak),
      'sumber='    + encodeURIComponent(sumber),
      'page='      + encodeURIComponent(document.title),
      'url='       + encodeURIComponent(location.href),
      'message='   + encodeURIComponent(message),
      'timestamp=' + encodeURIComponent(new Date().toISOString())
    ].join('&');

    var img = new Image();
    img.onload = img.onerror = function () {
      /* Apps Script redirect ke HTML → browser parse error normal,
         tapi data sudah diterima. Perlakukan sebagai sukses. */
      /* Tutup form modal, buka success popup terpisah */
      closeModal();
      resetForm();
      var successOverlay = document.getElementById('fb-success-overlay');
      if (successOverlay) {
        successOverlay.classList.add('fb-open');
        document.body.style.overflow = 'hidden';
      }
    };
    img.src = WEBHOOK_URL + '?' + qs;
  }

  /* ── Reset ───────────────────────────────────────────────────── */
  function resetForm() {
    var statusEl  = document.getElementById('fb-status');
    var msgEl     = document.getElementById('fb-msg');
    var nameEl    = document.getElementById('fb-name');
    var submitBtn = document.getElementById('fb-submit');
    if (statusEl)  { statusEl.className = ''; statusEl.style.display = 'none'; }
    if (msgEl)     { msgEl.value = ''; }
    if (nameEl)    { nameEl.value = ''; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Kirim →'; }
    var charEl = document.getElementById('fb-char');
    if (charEl) charEl.textContent = '0 / ' + MAX_CHARS;

    /* Reset produk, sumber, kontak */
    var productEl = document.getElementById('fb-product');
    if (productEl) productEl.selectedIndex = 0;
    var sourceEl  = document.getElementById('fb-source');
    if (sourceEl)  sourceEl.selectedIndex = 0;
    var cPlatEl   = document.getElementById('fb-contact-platform');
    if (cPlatEl)   cPlatEl.selectedIndex = 0;
    var cValEl    = document.getElementById('fb-contact-value');
    if (cValEl)    cValEl.value = '';

    /* Reset rating */
    _rating = 0;
    paintStars(0);
    var ratingVal = document.getElementById('fb-rating-val');
    if (ratingVal) ratingVal.textContent = 'belum dinilai';

    _selectedType = 'bug';
    document.querySelectorAll('.fb-type-btn').forEach(function (b) {
      b.classList.toggle('fb-active', b.dataset.type === 'bug');
    });
  }

  /* ── Init ────────────────────────────────────────────────────── */
  function init() {
    if (!document.getElementById('feedback-root')) return;
    injectStyles();
    buildDOM();
    wireEvents();
    /* Expose opener globally so sidebar button can trigger modal */
    window.fbOpenFeedback = openModal;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
