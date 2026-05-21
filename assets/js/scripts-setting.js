/* ============================================================
   Cheatsheet Ventilator Dewasa — ICU/IGD
   scripts-setting.js · v4
   Halaman: setting.html
   Fungsi: toggleTheory
   ============================================================ */

/* ===== THEORY DROPDOWN ===== */
function toggleTheory(id){
  const btn=event.currentTarget;
  const content=document.getElementById('theory-'+id);
  if(!content)return;
  btn.classList.toggle('open');
  content.classList.toggle('visible');
}
