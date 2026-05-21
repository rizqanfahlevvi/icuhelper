/* ============================================================
   scripts-teori-b1b6.js — B1–B6 Bedside Assessment
   Tab switching only. Self-contained, no shared dependency.
   ============================================================ */
(function () {
  'use strict';

  var TABS = ['tab-b1','tab-b2','tab-b3','tab-b4','tab-b5','tab-b6','tab-ringkasan'];

  function showTab(tabId) {
    if (TABS.indexOf(tabId) < 0) tabId = 'tab-b1';

    var sections = document.querySelectorAll('.b-section');
    var buttons  = document.querySelectorAll('.b-tab-btn');

    for (var i = 0; i < sections.length; i++) sections[i].style.display = 'none';
    for (var j = 0; j < buttons.length;  j++) buttons[j].classList.remove('active');

    var sec = document.getElementById(tabId);
    var btn = document.querySelector('[data-tab="' + tabId + '"]');
    if (sec) sec.style.display = 'block';
    if (btn) btn.classList.add('active');

    if (history.replaceState) history.replaceState(null, '', '#' + tabId);
  }

  /* Public API */
  window.showB1B6Tab = showTab;

  document.addEventListener('DOMContentLoaded', function () {
    var hash = location.hash.replace('#', '');
    showTab(TABS.indexOf(hash) >= 0 ? hash : 'tab-b1');
  });
})();
