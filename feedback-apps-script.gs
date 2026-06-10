/* ============================================================
   MD Kit Feedback — Google Apps Script
   Deploy as: Web App → Execute as: Me → Who has access: Anyone
   ============================================================
   Kolom sheet: Timestamp · Produk · Jenis · Rating · Nama ·
                Kontak · Sumber · Pesan · Halaman · URL
   ============================================================ */

var SHEET_NAME = 'Sheet1'; // ganti jika nama sheet berbeda

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    /* Baca dari query params (GET) atau form body (POST) */
    var p = e.parameter || {};

    var timestamp = p.timestamp || new Date().toISOString();
    var produk    = p.produk    || '-';
    var type      = p.type      || '-';
    var rating    = p.rating    || '-';
    var nama      = p.nama      || '-';
    var kontak    = p.kontak    || '-';
    var sumber    = p.sumber    || '-';
    var message   = p.message   || '-';
    var page      = p.page      || '-';
    var url       = p.url       || '-';

    var HEADERS = ['Timestamp', 'Produk', 'Jenis', 'Rating', 'Nama',
                   'Kontak', 'Sumber', 'Pesan', 'Halaman', 'URL'];

    /* Tulis header jika sheet kosong */
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    sheet.appendRow([timestamp, produk, type, rating, nama,
                     kontak, sumber, message, page, url]);

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService
      .createTextOutput('ERROR: ' + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
