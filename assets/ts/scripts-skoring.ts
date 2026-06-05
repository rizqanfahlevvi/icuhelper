// ============================================================
// scripts-skoring.ts — ICU Scoring Systems (TypeScript)
// Halaman: skoring.html
// ============================================================

// ─── Types ───────────────────────────────────────────────────

type CfsScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type RassScore = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4
type CamFeature = 1 | 2 | 3 | 4
type CamValue = 'yes' | 'no'

interface RassData {
  c: string
  t: string
  a: string
}

// ─── DOM helpers ─────────────────────────────────────────────

function getEl<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null
}

function getInputFloat(id: string): number {
  return parseFloat((document.getElementById(id) as HTMLInputElement)?.value ?? '')
}

function getSelectValue(id: string): string {
  return (document.getElementById(id) as HTMLSelectElement)?.value ?? ''
}

// ─── Nav ─────────────────────────────────────────────────────

export function showSkorSub(id: string, btn: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('[id^="skorsub-"]').forEach(el => el.classList.add('hidden'))
  getEl('skorsub-' + id)?.classList.remove('hidden')
  document.querySelectorAll<HTMLElement>('.subtab-bar .subtab-btn').forEach(b => b.classList.remove('active'))
  btn?.classList.add('active')
}

export function toggleTheory(id: string): void {
  const btn = (event as MouseEvent).currentTarget as HTMLElement
  const c   = getEl('theory-' + id)
  if (!c) return
  btn.classList.toggle('open')
  c.classList.toggle('visible')
}

// ─── SOFA ────────────────────────────────────────────────────

export function calcSOFA(): void {
  const pao2     = getInputFloat('sofa-pao2')
  const fio2     = getInputFloat('sofa-fio2')
  const vent     = getSelectValue('sofa-vent')
  const plt      = getInputFloat('sofa-plt')
  const bili     = getInputFloat('sofa-bili')
  const cvVal    = getSelectValue('sofa-cv')
  const gcs      = getInputFloat('sofa-gcs')
  const cr       = getInputFloat('sofa-cr')
  const uo       = getInputFloat('sofa-uo')
  const baseline = getInputFloat('sofa-baseline') || 0

  let total = 0
  const missing: string[] = []
  let rows = ''

  const addRow = (organ: string, detail: string, pts: number) => {
    const cls = ['spts-0','spts-1','spts-2','spts-3','spts-4'][Math.min(pts, 4)]
    rows += `<div class="sko-row"><div class="sp"><strong>${organ}</strong><small>${detail}</small></div><div class="spts ${cls}">${pts}</div></div>`
    total += pts
  }
  const addSkip = (organ: string) => {
    rows += `<div class="sko-row row-skip"><div class="sp"><strong>${organ}</strong><small>Tidak tersedia — tidak dihitung</small></div><div class="spts" style="color:var(--muted)">—</div></div>`
    missing.push(organ)
  }

  // Respirasi
  if (!isNaN(pao2) && !isNaN(fio2) && fio2 > 0) {
    const pf = pao2 / fio2, onV = vent === 'yes'
    let pts: number, note: string
    if      (pf >= 400)               { pts = 0; note = 'P/F≥400 — Normal' }
    else if (pf >= 300)               { pts = 1; note = `P/F ${pf.toFixed(0)} — Disfungsi ringan` }
    else if (pf >= 200)               { pts = 2; note = `P/F ${pf.toFixed(0)} — Disfungsi sedang` }
    else if (pf >= 100)               { pts = onV ? 3 : 2; note = `P/F ${pf.toFixed(0)} — ${onV ? 'Berat (ventilasi mekanik)' : 'Sedang (tanpa VM, max 2)'}` }
    else                              { pts = onV ? 4 : 3; note = `P/F ${pf.toFixed(0)} — ${onV ? 'Sangat berat (VM)' : 'Berat (tanpa VM)'}` }
    addRow('Respirasi — PaO₂/FiO₂', note, pts)
  } else addSkip('Respirasi (PaO₂/FiO₂)')

  // Koagulasi
  if (!isNaN(plt)) {
    let pts: number, note: string
    if      (plt >= 150) { pts = 0; note = `PLT ${plt} — Normal` }
    else if (plt >= 100) { pts = 1; note = `PLT ${plt} — Trombositopenia ringan` }
    else if (plt >= 50)  { pts = 2; note = `PLT ${plt} — Trombositopenia sedang` }
    else if (plt >= 20)  { pts = 3; note = `PLT ${plt} — Trombositopenia berat` }
    else                 { pts = 4; note = `PLT ${plt} — Sangat berat` }
    addRow('Koagulasi — Trombosit', note, pts)
  } else addSkip('Koagulasi (Trombosit)')

  // Hepar
  if (!isNaN(bili)) {
    let pts: number, note: string
    if      (bili < 1.2)  { pts = 0; note = `Bil ${bili} — Normal` }
    else if (bili < 2)    { pts = 1; note = `Bil ${bili} — Ringan` }
    else if (bili < 6)    { pts = 2; note = `Bil ${bili} — Sedang` }
    else if (bili < 12)   { pts = 3; note = `Bil ${bili} — Berat` }
    else                  { pts = 4; note = `Bil ${bili} — Gagal hati` }
    addRow('Hepar — Bilirubin', note, pts)
  } else addSkip('Hepar (Bilirubin)')

  // Kardiovaskular
  if (cvVal !== '') {
    const pts = parseInt(cvVal)
    const labels = [
      'MAP≥70 tanpa vasopressor',
      'MAP<70 tanpa vasopressor',
      'Dopamine≤5 atau Dobutamine',
      'Dopamine 5–15 / Epi,NE≤0.1 μg/kg/mnt',
      'Dopamine>15 / Epi,NE>0.1 μg/kg/mnt',
    ]
    addRow('Kardiovaskular — MAP/Vasopressor', labels[pts], pts)
  } else addSkip('Kardiovaskular (MAP/Vasopressor)')

  // GCS
  if (!isNaN(gcs)) {
    let pts: number, note: string
    if      (gcs >= 15) { pts = 0; note = `GCS ${gcs} — Sadar penuh` }
    else if (gcs >= 13) { pts = 1; note = `GCS ${gcs} — Kebingungan ringan` }
    else if (gcs >= 10) { pts = 2; note = `GCS ${gcs} — Somnolen` }
    else if (gcs >= 6)  { pts = 3; note = `GCS ${gcs} — Stupor` }
    else                { pts = 4; note = `GCS ${gcs} — Koma` }
    addRow('SSP — GCS', note, pts)
  } else addSkip('SSP (GCS)')

  // Renal
  let renDone = false
  if (!isNaN(cr)) {
    let pts: number, note: string
    if      (cr < 1.2)  { pts = 0; note = `Cr ${cr} — Normal` }
    else if (cr < 2)    { pts = 1; note = `Cr ${cr} — Disfungsi ringan` }
    else if (cr < 3.5)  { pts = 2; note = `Cr ${cr} — AKI sedang` }
    else if (cr < 5)    { pts = 3; note = `Cr ${cr} — AKI berat` }
    else                { pts = 4; note = `Cr ${cr} — Gagal ginjal` }
    if (!isNaN(uo)) {
      if      (uo < 200 && pts < 4) { pts = 4; note = `Cr ${cr}+UO ${uo}mL/hr — Anuria` }
      else if (uo < 500 && pts < 3) { pts = 3; note = `Cr ${cr}+UO ${uo}mL/hr — Oliguria` }
    }
    addRow('Renal — Kreatinin' + (!isNaN(uo) ? ' + UO' : ''), note, pts)
    renDone = true
  } else if (!isNaN(uo)) {
    let pts: number, note: string
    if      (uo < 200) { pts = 4; note = `UO ${uo}mL/hari — Anuria` }
    else if (uo < 500) { pts = 3; note = `UO ${uo}mL/hari — Oliguria` }
    else               { pts = 0; note = `UO ${uo}mL/hari — Cukup (tanpa kreatinin)` }
    addRow('Renal — UO (tanpa kreatinin)', note, pts)
    renDone = true
  }
  if (!renDone) addSkip('Renal (Kreatinin/UO)')

  const delta = total - baseline
  let colr: string, interp: string, detail: string
  if      (total <= 6)  { colr = 'green'; interp = 'Risiko Rendah';       detail = 'Mortalitas ICU estimasi <10%' }
  else if (total <= 9)  { colr = 'amber'; interp = 'Risiko Sedang';       detail = 'Mortalitas ICU estimasi 15–20%' }
  else if (total <= 12) { colr = 'coral'; interp = 'Risiko Tinggi';       detail = 'Mortalitas ICU estimasi 40–50%' }
  else                  { colr = 'red';   interp = 'Risiko Sangat Tinggi'; detail = 'Mortalitas ICU estimasi >80%' }

  const baselineInput = getInputFloat('sofa-baseline')
  const sepsis3 = !isNaN(baselineInput) && delta >= 2
    ? `<div class="warn" style="margin-top:10px"><strong>⚠️ Δ SOFA = +${delta}</strong> dari baseline ${baseline} → Kriteria disfungsi organ <strong>Sepsis-3</strong> terpenuhi (jika terdapat sumber infeksi)</div>`
    : ''

  const misNote = missing.length > 0
    ? `<div class="formula-note" style="margin-top:8px;border-color:var(--amber)"><strong style="color:var(--amber)">⚠ Parameter dilewati:</strong> ${missing.join(' · ')}<br>Skor ini adalah skor <strong>parsial</strong> — kemungkinan underestimate.</div>`
    : `<div class="formula-note" style="border-color:var(--green);margin-top:8px"><strong style="color:var(--green)">✓ Semua parameter tersedia</strong></div>`

  const content = getEl('sofa-result-content')
  if (content) content.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--${colr}-bg,var(--bg));border:.5px solid var(--${colr});border-radius:10px;margin-bottom:12px">
      <div class="big-total" style="color:var(--${colr})">${total}</div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)">SOFA Score${missing.length > 0 ? ' (parsial)' : ''}</div>
        <div style="font-size:16px;font-weight:700;color:var(--${colr})">${interp}</div>
        <div style="font-size:12px;color:var(--muted)">${detail}</div>
        ${missing.length > 0 ? `<div style="font-size:11px;color:var(--amber);margin-top:3px">⚠ ${missing.length} parameter dilewati</div>` : '<div style="font-size:11px;color:var(--green);margin-top:3px">✓ Data lengkap</div>'}
      </div>
    </div>
    <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px;font-weight:600">Detail Per Sistem Organ</div>
    ${rows}${sepsis3}${misNote}
    <div class="formula-note" style="margin-top:8px">📚 Singer M et al. JAMA 2016;315(8):801-810 · Vincent JL et al. Intensive Care Med 1996;22:707</div>`
  getEl('sofa-results')?.classList.remove('hidden')
}

// ─── CFS/BFS ─────────────────────────────────────────────────

export function selectCFS(score: CfsScore, el: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.cfs-item').forEach(i => i.classList.remove('sel-cfs'))
  el.classList.add('sel-cfs')

  const labels = ['','Sangat Bugar','Bugar','Mengatasi dengan Baik','Frailty Sangat Ringan','Frailty Ringan','Frailty Sedang','Frailty Berat','Frailty Sangat Berat','Sakit Terminal']
  const interps: Array<null | { c: string; t: string; d: string }> = [
    null,
    { c:'green',  t:'Tidak Frail',    d:'Risiko rendah, toleransi intervensi ICU baik. Tidak ada pembatasan berbasis frailty.' },
    { c:'green',  t:'Tidak Frail',    d:'Kondisi medis terkontrol, risiko rendah. Tidak ada pembatasan berbasis frailty.' },
    { c:'green',  t:'Pre-Frail Ringan', d:'Risiko relatif rendah. Monitoring fungsional pasca-ICU dianjurkan.' },
    { c:'teal',   t:'Pre-Frail',      d:'Mulai diskusikan tujuan perawatan lebih awal. Risiko komplikasi pasca-ICU meningkat.' },
    { c:'amber',  t:'Frailty Ringan', d:'Risiko moderat. Diskusi tujuan perawatan & harapan fungsional pasca-ICU penting bersama keluarga.' },
    { c:'coral',  t:'Frailty Sedang', d:'Risiko tinggi mortalitas ICU. Pertimbangkan eskalasi vs de-eskalasi secara hati-hati bersama keluarga & tim etik.' },
    { c:'coral',  t:'Frailty Berat',  d:'Risiko sangat tinggi. Konsultasi tim paliatif dianjurkan. Manfaat intervensi intensif mungkin sangat terbatas.' },
    { c:'red',    t:'Frailty Sangat Berat', d:'Manfaat intervensi agresif sangat terbatas. Prioritaskan comfort care dan diskusi advance directive.' },
    { c:'red',    t:'Sakit Terminal', d:'Harapan hidup <6 bulan. Prioritaskan comfort care, advance directive, dan dukungan keluarga.' },
  ]

  const d = interps[score]!
  const content = getEl('cfs-result-content')
  if (content) content.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--${d.c}-bg,var(--bg));border:.5px solid var(--${d.c});border-radius:10px;margin-bottom:10px">
      <div class="big-total" style="color:var(--${d.c})">${score}</div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)">CFS / BFS Score</div>
        <div style="font-size:15px;font-weight:700;color:var(--${d.c})">${labels[score]}</div>
        <div style="font-size:13px;font-weight:600;margin-top:2px;color:var(--${d.c})">${d.t}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">${d.d}</div>
      </div>
    </div>
    <div class="formula-note">📚 Rockwood K et al. CMAJ 2005;173(5):489-495 · Darvall JN et al. Crit Care 2019;23:220 · Hewitt J et al. JAMA IM 2020;180(11):1494</div>`
  getEl('cfs-result')?.classList.remove('hidden')
}

// ─── CPIS ────────────────────────────────────────────────────

export function calcCPIS(): void {
  const temp  = getInputFloat('cpis-temp')
  const wbc   = getInputFloat('cpis-wbc')
  const band  = getSelectValue('cpis-band')
  const sec   = parseInt(getSelectValue('cpis-sec'))
  const pao2  = getInputFloat('cpis-pao2')
  const fio2  = getInputFloat('cpis-fio2')
  const ards  = getSelectValue('cpis-ards')
  const xray  = parseInt(getSelectValue('cpis-xray'))
  const cult  = getSelectValue('cpis-culture')
  let total = 0; let rows = ''; const missing: string[] = []

  const addRow = (param: string, val: string, pts: number, note: string) => {
    const cls = ['spts-0','spts-1','spts-2','spts-3','spts-4'][Math.min(pts, 4)]
    rows += `<div class="sko-row"><div class="sp"><strong>${param}</strong><small>${val} → ${note}</small></div><div class="spts ${cls}">${pts}</div></div>`
    total += pts
  }

  if (!isNaN(temp)) {
    const pts = temp >= 36.5 && temp <= 38.4 ? 0 : temp >= 38.5 && temp <= 38.9 ? 1 : 2
    const note = temp >= 36.5 && temp <= 38.4 ? 'Normal' : temp >= 38.5 && temp <= 38.9 ? 'Subfebris tinggi' : temp < 36.5 ? 'Hipotermia' : 'Hipertermia/Febris tinggi'
    addRow('Suhu', `${temp}°C`, pts, note)
  } else missing.push('Suhu')

  if (!isNaN(wbc)) {
    let pts = wbc >= 4000 && wbc <= 11000 ? 0 : 1
    let note = wbc >= 4000 && wbc <= 11000 ? 'Normal' : wbc < 4000 ? 'Leukopenia' : 'Leukositosis'
    if (pts === 1 && band === 'yes') { pts = 2; note += ' + Band forms ≥50%' }
    addRow('Leukosit', `${wbc} sel/mm³`, pts, note)
  } else missing.push('Leukosit')

  const secN = ['Tidak ada/sedikit','Sedikit/non-purulen','Banyak/purulen']
  addRow('Sekret Trakeal', secN[sec], sec, secN[sec])

  if (!isNaN(pao2) && !isNaN(fio2) && fio2 > 0) {
    const pf = pao2 / fio2, isARDS = ards === 'yes'
    const pts = pf > 240 || isARDS ? 0 : 2
    const note = isARDS ? 'ARDS (skor 0)' : pf > 240 ? `P/F=${pf.toFixed(0)}>240` : `P/F=${pf.toFixed(0)}≤240 bukan ARDS`
    addRow('Oksigenasi (P/F)', `P/F=${pf.toFixed(0)}`, pts, note)
  } else if (ards === 'yes') {
    addRow('Oksigenasi', 'ARDS', 0, 'ARDS → skor 0')
  } else missing.push('Oksigenasi (PaO₂/FiO₂)')

  const xrayN = ['Tidak ada infiltrat','Infiltrat difus/patchy','Infiltrat lokal/segmental']
  addRow('Rontgen Thorax', xrayN[xray], xray, xrayN[xray])

  if (cult !== '') {
    const cPts = parseInt(cult)
    const cN = ['Tidak ada kuman patogen','Kuman patogen ditemukan','Kuman + Gram stain sesuai']
    addRow('Kultur Trakeal', cN[cPts], cPts, cN[cPts])
  } else {
    rows += `<div class="sko-row row-skip"><div class="sp"><strong>Kultur Trakeal</strong><small>Belum tersedia — tidak dihitung</small></div><div class="spts" style="color:var(--muted)">—</div></div>`
  }

  const high = total > 6
  const colr  = high ? 'red' : 'green'
  const interp = high ? 'CPIS >6 — VAP Kemungkinan Besar' : 'CPIS ≤6 — VAP Tidak Mungkin'
  const action = high
    ? 'Lanjutkan antibiotik VAP sesuai panduan lokal. De-eskalasi berdasarkan kultur. Evaluasi dalam 48–72 jam.'
    : 'Pertimbangkan de-eskalasi/penghentian antibiotik (Protokol Singh hari ke-3). Evaluasi ulang 24-48 jam.'

  const content = getEl('cpis-result-content')
  if (content) content.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--${colr}-bg,var(--bg));border:.5px solid var(--${colr});border-radius:10px;margin-bottom:12px">
      <div class="big-total" style="color:var(--${colr})">${total}</div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)">CPIS Score${cult === '' ? ' (tanpa kultur)' : ''}</div>
        <div style="font-size:14px;font-weight:700;color:var(--${colr})">${interp}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">${action}</div>
      </div>
    </div>${rows}
    ${missing.length > 0 ? `<div class="formula-note" style="border-color:var(--amber);margin-top:8px"><strong style="color:var(--amber)">⚠ Parameter dilewati:</strong> ${missing.join(', ')}</div>` : ''}
    <div class="formula-note" style="margin-top:8px">📚 Singh N et al. Am J Respir Crit Care Med 2000;162(2):505-511 · Kalil AC et al. Clin Infect Dis 2016;63(5):e61</div>`
  getEl('cpis-results')?.classList.remove('hidden')
}

// ─── RASS ────────────────────────────────────────────────────

const RASS_DATA: Record<string, RassData> = {
  '4':  { c:'red',    t:'Combative (+4)',        a:'⚠️ DARURAT: Amankan pasien & jalur IV/ETT segera! Analgesik IV bolus → sedatif titrasi. Evaluasi penyebab: nyeri, hipoksia, retensi urin, delirium hiperaktif.' },
  '3':  { c:'red',    t:'Very Agitated (+3)',    a:'Evaluasi nyeri (CPOT), hipoksia, distensi kandung kemih, withdrawal. Analgesik IV terlebih dahulu. Pertimbangkan midazolam bolus atau dexmedetomidine.' },
  '2':  { c:'coral',  t:'Agitated (+2)',         a:'Evaluasi penyebab reversibel. Titrasi sedatif ke atas. Pertimbangkan reposisi, analgesik, dexmedetomidine.' },
  '1':  { c:'amber',  t:'Restless (+1)',         a:'Cek kenyamanan: nyeri? posisi? kandung kemih? NGT bermasalah? Orientasikan pasien. Analgesik sebelum tambah sedatif.' },
  '0':  { c:'green',  t:'Alert & Calm (0) ✓',   a:'TARGET SEDASI IDEAL (PADIS 2018/eCASH). Pertahankan. Monitor setiap 4 jam. Lakukan SAT jika memenuhi syarat.' },
  '-1': { c:'teal',   t:'Drowsy (-1)',           a:'Target ringan ICU tercapai. Monitor setiap 4 jam. Lakukan SAT (Spontaneous Awakening Trial) + SBT jika kondisi memungkinkan.' },
  '-2': { c:'teal',   t:'Light Sedation (-2)',   a:'Dalam rentang target. Pertimbangkan kurangi dosis sedatif bertahap menuju RASS 0/-1 jika kondisi stabil.' },
  '-3': { c:'blue',   t:'Moderate Sedation (-3)', a:'Lebih dalam dari target standar. Kurangi dosis secara bertahap. CAM-ICU masih dapat dinilai. Pertimbangkan SAT.' },
  '-4': { c:'purple', t:'Deep Sedation (-4)',    a:'Hanya untuk indikasi khusus (HICP, NMB, status epileptikus refrakter). CAM-ICU TIDAK dapat dinilai (UTA). Re-evaluasi indikasi sedasi dalam setiap 24 jam.' },
  '-5': { c:'gray',   t:'Unarousable (-5)',      a:'Sedasi paling dalam. Monitor BIS/EEG jika tersedia. CAM-ICU TIDAK dapat dinilai. Re-evaluasi indikasi segera.' },
}

export function selectRASS(score: RassScore, el: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.rass-item').forEach(i => i.classList.remove('sel-pos','sel-zero','sel-neg'))
  if      (score > 0)  el.classList.add('sel-pos')
  else if (score === 0) el.classList.add('sel-zero')
  else                 el.classList.add('sel-neg')

  const d = RASS_DATA[score.toString()]
  const label = score >= 0 ? (score > 0 ? '+' : '') + score : score

  const content = getEl('rass-result-content')
  if (content) content.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--${d.c}-bg,var(--bg));border:.5px solid var(--${d.c});border-radius:10px;margin-bottom:10px">
      <div class="big-total" style="color:var(--${d.c})">${label}</div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)">RASS Score</div>
        <div style="font-size:16px;font-weight:700;color:var(--${d.c})">${d.t}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">${d.a}</div>
      </div>
    </div>
    <div class="formula-note">📚 Sessler CN et al. Am J Respir Crit Care Med 2002;166(10):1338-1344 · Devlin JW et al. Crit Care Med 2018;46(9):e825</div>`
  getEl('rass-result')?.classList.remove('hidden')
}

// ─── CAM-ICU ─────────────────────────────────────────────────

const camA: Record<CamFeature, CamValue | null> = { 1: null, 2: null, 3: null, 4: null }

export function setCamRASS(val: 'ok' | 'uta', btn: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.cam-feature:first-of-type .yn-btn').forEach(b => b.classList.remove('y-active','n-active'))
  btn.classList.add(val === 'ok' ? 'y-active' : 'n-active')
  getEl('cam-main')?.classList.toggle('hidden', val !== 'ok')
  getEl('cam-uta')?.classList.toggle('hidden', val === 'ok')
  getEl('cam-results')?.classList.add('hidden')
}

export function setCam(f: CamFeature, val: CamValue, btn: HTMLElement): void {
  btn.parentElement?.querySelectorAll<HTMLElement>('.yn-btn').forEach(b => b.classList.remove('y-active','n-active'))
  btn.classList.add(val === 'yes' ? 'y-active' : 'n-active')
  camA[f] = val
}

export function calcCAMICU(): void {
  const { 1: f1, 2: f2, 3: f3, 4: f4 } = camA
  if (!f1 || !f2) { alert('Lengkapi minimal Fitur 1 dan Fitur 2 terlebih dahulu.'); return }

  const pos = f1 === 'yes' && f2 === 'yes' && (f3 === 'yes' || f4 === 'yes')
  let html: string

  if (pos) {
    html = `<div style="padding:16px;background:var(--red-bg);border:.5px solid var(--red);border-radius:10px;margin-bottom:10px">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:4px">CAM-ICU Hasil</div>
      <div style="font-size:22px;font-weight:700;color:var(--red);margin-bottom:4px">⚠️ CAM-ICU POSITIF</div>
      <div style="font-size:13px;font-weight:600;color:var(--red)">DELIRIUM TERDETEKSI</div>
      <div style="font-size:11px;color:var(--muted);margin-top:6px">F1(Akut/Fluktuatif):${f1==='yes'?'✓':'✗'} · F2(Inattention):${f2==='yes'?'✓':'✗'} · F3(RASS≠0):${f3==='yes'?'✓':'✗'} · F4(Disorganized):${f4==='yes'?'✓':'✗'}</div>
    </div>
    <div class="info" style="font-size:12px"><strong>Tindakan — Mnemonic THINK:</strong><br>
    <strong>T</strong>oxic (sepsis, obat, withdrawal) · <strong>H</strong>ypoxemia · <strong>I</strong>mmobilization (mobilisasi dini) · <strong>N</strong>on-pharma first (orientasi, siklus tidur) · <strong>K</strong>ey drugs avoid (benzo, antihistamin)<br>
    Dokumentasikan. Nilai setiap shift.</div>`
  } else if (f1 === 'no' || f2 === 'no') {
    html = `<div style="padding:16px;background:var(--green-bg);border:.5px solid var(--green);border-radius:10px;margin-bottom:10px">
      <div style="font-size:22px;font-weight:700;color:var(--green);margin-bottom:4px">✓ CAM-ICU NEGATIF</div>
      <div style="font-size:13px;font-weight:600;color:var(--green)">TIDAK ADA DELIRIUM SAAT INI</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${f1==='no'?'Fitur 1 negatif (tidak ada perubahan akut/fluktuasi) → hentikan penilaian.':'Fitur 2 lulus (tidak ada gangguan perhatian).'}</div>
    </div>
    <div class="info" style="font-size:12px">Ulangi setiap shift. Pertahankan orientasi, siklus tidur-bangun, mobilisasi dini.</div>`
  } else {
    html = `<div style="padding:16px;background:var(--green-bg);border:.5px solid var(--green);border-radius:10px">
      <div style="font-size:22px;font-weight:700;color:var(--green)">✓ CAM-ICU NEGATIF</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">F1+F2 ada, namun F3 dan F4 keduanya negatif → CAM-ICU Negatif.</div>
    </div>`
  }

  const content = getEl('cam-result-content')
  if (content) content.innerHTML = html + `<div class="formula-note" style="margin-top:8px">📚 Ely EW et al. JAMA 2001;286(21):2703-2710 · Devlin JW et al. Crit Care Med 2018;46(9):e825</div>`
  getEl('cam-results')?.classList.remove('hidden')
}

// ─── APACHE-II ───────────────────────────────────────────────

export function calcAPACHE(): void {
  const temp   = getInputFloat('ap-temp')
  const map    = getInputFloat('ap-map')
  const hr     = getInputFloat('ap-hr')
  const rr     = getInputFloat('ap-rr')
  const fio2   = getInputFloat('ap-fio2')
  const pao2   = getInputFloat('ap-pao2')
  const paco2  = getInputFloat('ap-paco2')
  const ph     = getInputFloat('ap-ph')
  const na     = getInputFloat('ap-na')
  const k      = getInputFloat('ap-k')
  const cr     = getInputFloat('ap-cr')
  const aki    = getSelectValue('ap-aki') === 'yes'
  const hct    = getInputFloat('ap-hct')
  const wbc    = getInputFloat('ap-wbc')
  const gcs    = getInputFloat('ap-gcs')
  const age    = getInputFloat('ap-age')
  const chType = getSelectValue('ap-chronic-type')
  const hasChron = getSelectValue('ap-chronic') === 'yes'

  let aps = 0
  const missing: string[] = []
  let rows = ''

  const apsRow = (label: string, val: string, pts: number, skipped: boolean) => {
    if (skipped) {
      missing.push(label)
      rows += `<tr><td>${label}</td><td style="color:var(--muted)">—</td><td style="color:var(--muted)">—</td></tr>`
    } else {
      const c = pts >= 3 ? 'var(--red)' : pts >= 2 ? 'var(--amber)' : pts === 1 ? 'var(--blue)' : 'var(--green)'
      rows += `<tr><td>${label}</td><td>${val}</td><td style="font-weight:700;color:${c}">${pts}</td></tr>`
      aps += pts
    }
  }

  if (!isNaN(temp)) {
    let pts: number
    if      (temp >= 41)  pts = 4
    else if (temp >= 39)  pts = 3
    else if (temp >= 38.5) pts = 1
    else if (temp >= 36)  pts = 0
    else if (temp >= 34)  pts = 1
    else if (temp >= 32)  pts = 2
    else if (temp >= 30)  pts = 3
    else                  pts = 4
    apsRow('Suhu rektal (°C)', temp.toFixed(1) + '°C', pts, false)
  } else apsRow('Suhu rektal', '', 0, true)

  if (!isNaN(map)) {
    let pts: number
    if      (map >= 160) pts = 4
    else if (map >= 130) pts = 3
    else if (map >= 110) pts = 2
    else if (map >= 70)  pts = 0
    else if (map >= 50)  pts = 2
    else                 pts = 4
    apsRow('MAP (mmHg)', map + ' mmHg', pts, false)
  } else apsRow('MAP', '', 0, true)

  if (!isNaN(hr)) {
    let pts: number
    if      (hr >= 180) pts = 4
    else if (hr >= 140) pts = 3
    else if (hr >= 110) pts = 2
    else if (hr >= 70)  pts = 0
    else if (hr >= 55)  pts = 2
    else if (hr >= 40)  pts = 3
    else                pts = 4
    apsRow('Nadi (bpm)', hr + ' bpm', pts, false)
  } else apsRow('Nadi', '', 0, true)

  if (!isNaN(rr)) {
    let pts: number
    if      (rr >= 50)  pts = 4
    else if (rr >= 35)  pts = 3
    else if (rr >= 25)  pts = 1
    else if (rr >= 12)  pts = 0
    else if (rr >= 10)  pts = 1
    else if (rr >= 6)   pts = 2
    else                pts = 4
    apsRow('Frekuensi napas (/mnt)', rr + ' /mnt', pts, false)
  } else apsRow('Frekuensi napas', '', 0, true)

  if (!isNaN(fio2) && !isNaN(pao2)) {
    let pts: number
    if (fio2 >= 0.5) {
      if (!isNaN(paco2)) {
        const alv = fio2 * (760 - 47) - paco2 / 0.8, aaDO2 = alv - pao2
        if      (aaDO2 >= 500) pts = 4
        else if (aaDO2 >= 350) pts = 3
        else if (aaDO2 >= 200) pts = 2
        else                   pts = 0
        apsRow('Oksigenasi A-aDO₂ (FiO₂≥0.5)', `A-aDO₂=${aaDO2.toFixed(0)}`, pts, false)
      } else apsRow('Oksigenasi (PaCO₂ diperlukan untuk FiO₂≥0.5)', '', 0, true)
    } else {
      if      (pao2 > 70)  pts = 0
      else if (pao2 > 61)  pts = 1
      else if (pao2 >= 55) pts = 3
      else                 pts = 4
      apsRow('Oksigenasi PaO₂ (FiO₂<0.5)', `PaO₂=${pao2} mmHg`, pts, false)
    }
  } else apsRow('Oksigenasi', '', 0, true)

  if (!isNaN(ph)) {
    let pts: number
    if      (ph >= 7.7)   pts = 4
    else if (ph >= 7.6)   pts = 3
    else if (ph >= 7.5)   pts = 1
    else if (ph >= 7.33)  pts = 0
    else if (ph >= 7.25)  pts = 2
    else if (ph >= 7.15)  pts = 3
    else                  pts = 4
    apsRow('pH Arteri', ph.toFixed(2), pts, false)
  } else apsRow('pH Arteri', '', 0, true)

  if (!isNaN(na)) {
    let pts: number
    if      (na >= 180) pts = 4
    else if (na >= 160) pts = 3
    else if (na >= 155) pts = 2
    else if (na >= 150) pts = 1
    else if (na >= 130) pts = 0
    else if (na >= 120) pts = 2
    else if (na >= 111) pts = 3
    else                pts = 4
    apsRow('Natrium serum (mEq/L)', na + ' mEq/L', pts, false)
  } else apsRow('Natrium serum', '', 0, true)

  if (!isNaN(k)) {
    let pts: number
    if      (k >= 7)   pts = 4
    else if (k >= 6)   pts = 3
    else if (k >= 5.5) pts = 1
    else if (k >= 3.5) pts = 0
    else if (k >= 3)   pts = 1
    else if (k >= 2.5) pts = 2
    else               pts = 4
    apsRow('Kalium serum (mEq/L)', k.toFixed(1) + ' mEq/L', pts, false)
  } else apsRow('Kalium serum', '', 0, true)

  if (!isNaN(cr)) {
    let pts: number
    if      (cr >= 3.5) pts = 4
    else if (cr >= 2)   pts = 3
    else if (cr >= 1.5) pts = 2
    else if (cr >= 0.6) pts = 0
    else                pts = 2
    const raw = pts
    if (aki) pts = Math.min(pts * 2, 8)
    apsRow(`Kreatinin${aki ? ' [AKI: skor×2]' : ''}`, cr.toFixed(1) + ' mg/dL' + (aki ? ` (${raw}pt×2)` : ''), pts, false)
  } else apsRow('Kreatinin serum', '', 0, true)

  if (!isNaN(hct)) {
    let pts: number
    if      (hct >= 60) pts = 4
    else if (hct >= 50) pts = 2
    else if (hct >= 46) pts = 1
    else if (hct >= 30) pts = 0
    else if (hct >= 20) pts = 2
    else                pts = 4
    apsRow('Hematokrit (%)', hct.toFixed(1) + '%', pts, false)
  } else apsRow('Hematokrit', '', 0, true)

  if (!isNaN(wbc)) {
    let pts: number
    if      (wbc >= 40) pts = 4
    else if (wbc >= 20) pts = 2
    else if (wbc >= 15) pts = 1
    else if (wbc >= 3)  pts = 0
    else if (wbc >= 1)  pts = 2
    else                pts = 4
    apsRow('Leukosit (×1000/mm³)', wbc.toFixed(1), pts, false)
  } else apsRow('Leukosit', '', 0, true)

  if (!isNaN(gcs)) {
    const pts = 15 - gcs
    apsRow('GCS (poin = 15 − GCS)', `GCS ${gcs} → ${pts} poin`, pts, false)
  } else apsRow('GCS', '', 0, true)

  let ageScore = 0
  if (!isNaN(age)) {
    if      (age < 45) ageScore = 0
    else if (age < 55) ageScore = 2
    else if (age < 65) ageScore = 3
    else if (age < 75) ageScore = 5
    else               ageScore = 6
  }
  const chronicScore = hasChron ? (chType === 'elective' ? 2 : 5) : 0
  const total = aps + ageScore + chronicScore

  const mort =
    total <= 4  ? '~4%' :
    total <= 9  ? '~8%' :
    total <= 14 ? '~15%' :
    total <= 19 ? '~25%' :
    total <= 24 ? '~40%' :
    total <= 29 ? '~55%' :
    total <= 34 ? '~73%' : '~85%'

  const colr =
    total <= 9  ? 'green' :
    total <= 19 ? 'amber' :
    total <= 29 ? 'coral' : 'red'

  const content = getEl('apache-result-content')
  if (content) content.innerHTML = `
    <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;padding:14px;background:var(--${colr}-bg,var(--bg));border:.5px solid var(--${colr});border-radius:10px;margin-bottom:14px">
      <div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)">APACHE-II Total</div>
      <div class="big-total" style="color:var(--${colr})">${total}</div></div>
      <div style="font-size:13px">
        <div><span style="color:var(--muted)">APS (12 variabel):</span> <strong>${aps}</strong></div>
        <div><span style="color:var(--muted)">Skor Usia (${!isNaN(age) ? age + 'th' : '—'}):</span> <strong>${ageScore}</strong></div>
        <div><span style="color:var(--muted)">Chronic Health:</span> <strong>${chronicScore}</strong></div>
        <div style="margin-top:6px;font-size:15px;font-weight:700;color:var(--${colr})">Mortalitas prediksi: ${mort}</div>
      </div>
    </div>
    <table><tr><th>Parameter APS (12 variabel, nilai terburuk 24 jam)</th><th>Nilai</th><th>Poin</th></tr>${rows}
    <tr style="background:var(--bg)"><td><strong>Total APS</strong></td><td></td><td><strong>${aps}</strong></td></tr></table>
    ${missing.length > 0 ? `<div class="formula-note" style="border-color:var(--amber);margin-top:8px"><strong style="color:var(--amber)">⚠ Parameter dilewati:</strong> ${missing.join(', ')}</div>` : ''}
    <div class="formula-note" style="margin-top:8px">📚 Knaus WA et al. Crit Care Med 1985;13(10):818-829 · Zimmerman JE et al. Crit Care Med 2006;34(5):1297</div>`
  getEl('apache-results')?.classList.remove('hidden')
}

// ─── Candida Score ───────────────────────────────────────────

export function calcCandida(): void {
  let score = 0
  const items: string[] = []
  if ((document.getElementById('cs-surgery') as HTMLInputElement)?.checked)  { score += 1; items.push('Operasi mayor (+1)') }
  if ((document.getElementById('cs-tpn')     as HTMLInputElement)?.checked)  { score += 1; items.push('TPN (+1)') }
  if ((document.getElementById('cs-colonize') as HTMLInputElement)?.checked) { score += 1; items.push('Kolonisasi multifocal (+1)') }
  if ((document.getElementById('cs-sepsis')  as HTMLInputElement)?.checked)  { score += 2; items.push('Sepsis berat (+2)') }

  const high   = score >= 3
  const colr   = high ? 'red' : 'green'
  const interp = high ? 'RISIKO TINGGI — Skor ≥3' : 'RISIKO RENDAH — Skor <3'
  const action = high
    ? 'Pertimbangkan antijamur empiris: Flukonazol 400 mg/hari (jika stabil, tidak ada riwayat azole) ATAU Ekinokandin (jika tidak stabil / riwayat azole / curiga C. glabrata). Evaluasi ulang dalam 4–5 hari; hentikan jika kultur negatif dan kondisi membaik.'
    : 'Antijamur empiris tidak direkomendasikan. Pantau ketat faktor risiko tambahan (CVC, antibiotik spektrum luas, hemodialisis). Kultur darah jika ada kecurigaan klinis.'

  const content = getEl('candida-result-content')
  if (content) content.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--${colr}-bg,var(--bg));border:.5px solid var(--${colr});border-radius:10px;margin-bottom:10px">
      <div class="big-total" style="color:var(--${colr})">${score}</div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)">Candida Score</div>
        <div style="font-size:15px;font-weight:700;color:var(--${colr})">${interp}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">${action}</div>
        ${items.length > 0 ? `<div style="font-size:11px;margin-top:6px;color:var(--muted)">Faktor ada: ${items.join(' · ')}</div>` : ''}
      </div>
    </div>
    <div class="formula-note">📚 León C et al. Crit Care Med 2006;34(3):730-737 · León C et al. Crit Care Med 2009;37(9):2619-2625 · Pappas PG et al. Clin Infect Dis 2016;62(4):e1</div>`
  getEl('candida-results')?.classList.remove('hidden')
}

// ─── Global exposure ─────────────────────────────────────────

const g = window as unknown as Record<string, unknown>
g.showSkorSub  = showSkorSub
g.toggleTheory = toggleTheory
g.calcSOFA     = calcSOFA
g.selectCFS    = selectCFS
g.calcCPIS     = calcCPIS
g.selectRASS   = selectRASS
g.setCamRASS   = setCamRASS
g.setCam       = setCam
g.calcCAMICU   = calcCAMICU
g.calcAPACHE   = calcAPACHE
g.calcCandida  = calcCandida
