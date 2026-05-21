/* ============================================================
   Cheatsheet Ventilator Dewasa — ICU/IGD
   scripts-teori.js · v4
   Halaman: teori.html
   Fungsi: toggleTheory, showTeoriSub
   ============================================================ */

/* ===== THEORY DROPDOWN ===== */
function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}

/* showTeoriSub() dihapus — navigasi subtab kini via <a href> antar halaman (v4 refactor) */
