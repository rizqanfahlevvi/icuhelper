// export-pdf.ts — Print/PDF export untuk hasil kalkulator ICU Helper
// strict mode (tsconfig enforces this project-wide)

export interface ExportOptions {
  title: string;           // judul dokumen, e.g. "Hasil ABG Interpreter"
  resultSelector: string;  // CSS selector elemen yang akan di-print
  patientInfo?: string;    // info pasien opsional
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getPatientLabel(): string {
  try {
    const raw = localStorage.getItem('icu-patient-session');
    if (!raw) return '';
    const session = JSON.parse(raw) as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof session['nama'] === 'string' && session['nama']) {
      parts.push(session['nama']);
    }
    if (typeof session['tinggiBadan'] === 'number') {
      parts.push(`TB: ${session['tinggiBadan']}cm`);
    }
    if (typeof session['beratBadan'] === 'number') {
      parts.push(`BB: ${session['beratBadan']}kg`);
    }
    if (typeof session['usia'] === 'number') {
      parts.push(`Usia: ${session['usia']}thn`);
    }
    return parts.join('  ');
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Core export
// ---------------------------------------------------------------------------

export function exportToPDF(options: ExportOptions): void {
  const resultEl = document.querySelector(options.resultSelector);
  if (!resultEl) {
    console.warn(`[export-pdf] Elemen "${options.resultSelector}" tidak ditemukan.`);
    return;
  }

  const contentHtml = resultEl.innerHTML;
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const patientInfo = options.patientInfo ?? getPatientLabel();

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>${options.title} — ICU Helper</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    font-size: 12pt;
    color: #000;
    background: #fff;
    padding: 20mm 18mm 20mm 18mm;
  }
  .print-header {
    border-bottom: 2px solid #1a4080;
    padding-bottom: 10px;
    margin-bottom: 14px;
  }
  .print-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .print-app-name {
    font-size: 18pt;
    font-weight: 700;
    color: #1a4080;
    letter-spacing: -0.3px;
  }
  .print-datetime {
    font-size: 9pt;
    color: #555;
    text-align: right;
  }
  .print-doc-title {
    font-size: 13pt;
    font-weight: 600;
    color: #1a4080;
    margin-top: 6px;
  }
  .print-patient-info {
    margin-top: 4px;
    font-size: 9pt;
    color: #333;
    background: #f0f4ff;
    border-left: 3px solid #1a4080;
    padding: 4px 8px;
    border-radius: 2px;
  }
  .print-content {
    margin-top: 12px;
  }
  /* Flatten dark-mode colours in result content */
  .print-content * {
    color: #000 !important;
    background: #fff !important;
    border-color: #ccc !important;
    box-shadow: none !important;
  }
  .print-content .result-value {
    font-size: 16pt !important;
    font-weight: 700 !important;
  }
  .print-content table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .print-content th, .print-content td {
    border: 1px solid #bbb;
    padding: 4px 8px;
    font-size: 10pt;
    text-align: left;
  }
  .print-content th {
    background: #e8edf5 !important;
    font-weight: 600;
  }
  .print-content .hidden { display: none !important; }
  .print-footer {
    margin-top: 20px;
    padding-top: 8px;
    border-top: 1px solid #bbb;
    font-size: 8.5pt;
    color: #555;
    font-style: italic;
    text-align: center;
  }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>
  <div class="print-header">
    <div class="print-header-top">
      <div class="print-app-name">ICU Helper</div>
      <div class="print-datetime">${dateStr} · ${timeStr}</div>
    </div>
    <div class="print-doc-title">${options.title}</div>
    ${patientInfo ? `<div class="print-patient-info">Pasien: ${patientInfo}</div>` : ''}
  </div>
  <div class="print-content">${contentHtml}</div>
  <div class="print-footer">
    Dokumen ini hanya panduan klinis. Keputusan akhir ada di tangan dokter.
  </div>
</body>
</html>`;

  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    console.warn('[export-pdf] Tidak dapat mengakses iframe document.');
    return;
  }

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for resources to load then print
  const iframeWin = iframe.contentWindow;
  if (!iframeWin) {
    document.body.removeChild(iframe);
    return;
  }

  const doCleanup = (): void => {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  };

  iframeWin.onafterprint = doCleanup;

  // Small delay to ensure content is rendered before printing
  setTimeout(() => {
    iframeWin.focus();
    iframeWin.print();
  }, 300);
}

// ---------------------------------------------------------------------------
// Shortcuts
// ---------------------------------------------------------------------------

export function exportAbgResult(): void {
  exportToPDF({
    title: 'Hasil ABG Interpreter',
    resultSelector: '#abg-results',
    patientInfo: getPatientLabel(),
  });
}

export function exportSofaResult(): void {
  exportToPDF({
    title: 'Hasil Skor SOFA',
    resultSelector: '#sofa-results',
    patientInfo: getPatientLabel(),
  });
}

export function exportIbwResult(): void {
  exportToPDF({
    title: 'Hasil Kalkulator IBW & Parameter Ventilator',
    resultSelector: '#ibw-results',
    patientInfo: getPatientLabel(),
  });
}

// ---------------------------------------------------------------------------
// Inject export button
// ---------------------------------------------------------------------------

export function addExportButton(
  targetSelector: string,
  exportFn: () => void,
  label?: string,
): void {
  const target = document.querySelector<HTMLElement>(targetSelector);
  if (!target) return;

  // Don't show button if element is hidden or empty
  if (
    target.classList.contains('hidden') ||
    target.style.display === 'none' ||
    !target.textContent?.trim()
  ) {
    return;
  }

  // Avoid duplicate buttons
  const existingId = `export-btn-${targetSelector.replace(/[^a-zA-Z0-9]/g, '-')}`;
  if (document.getElementById(existingId)) return;

  const btn = document.createElement('button');
  btn.id = existingId;
  btn.type = 'button';
  btn.className = 'print-hide';
  btn.textContent = label ?? '⬇ Simpan / Cetak';
  btn.style.cssText =
    'display:inline-flex;align-items:center;gap:4px;' +
    'margin-top:10px;padding:5px 12px;' +
    'font-size:11px;font-family:inherit;' +
    'color:#6b7280;background:transparent;' +
    'border:1px solid #9ca3af;border-radius:6px;' +
    'cursor:pointer;transition:border-color 0.15s,color 0.15s;' +
    'line-height:1.4;';

  btn.addEventListener('mouseenter', () => {
    btn.style.borderColor = '#4b5563';
    btn.style.color = '#374151';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.borderColor = '#9ca3af';
    btn.style.color = '#6b7280';
  });
  btn.addEventListener('click', exportFn);

  target.insertAdjacentElement('afterend', btn);
}

// ---------------------------------------------------------------------------
// Window exposure
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    exportAbgResult: () => void;
    exportSofaResult: () => void;
    exportIbwResult: () => void;
  }
}

window.exportAbgResult = exportAbgResult;
window.exportSofaResult = exportSofaResult;
window.exportIbwResult = exportIbwResult;
