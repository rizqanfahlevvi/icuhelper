/* ============================================================
   Cheatsheet Ventilator Dewasa — ICU/IGD
   scripts-referensi.js · v4
   Halaman: referensi.html
   Fitur: Global Search untuk Accordions & Database
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const globalSearch = document.getElementById('global-search');
  if (!globalSearch) return;

  const accordions = document.querySelectorAll('.theory-dropdown');

  globalSearch.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    accordions.forEach(acc => {
      // Find all rows except the header
      const rows = acc.querySelectorAll('tr:not(:first-child)');
      if (rows.length === 0) return;

      let hasMatch = false;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (term === '' || text.includes(term)) {
          row.style.display = '';
          hasMatch = true;
        } else {
          row.style.display = 'none';
        }
      });

      // Show/hide the entire accordion based on match
      if (hasMatch || term === '') {
        acc.style.display = '';
        // If there's a search term, auto-expand
        if (term !== '') {
          const content = acc.querySelector('.theory-content');
          const btn = acc.querySelector('.theory-btn');
          if (content && !content.classList.contains('show')) {
            content.classList.add('show');
            if (btn) btn.classList.add('active');
          }
        }
      } else {
        acc.style.display = 'none';
      }
    });
  });
});
