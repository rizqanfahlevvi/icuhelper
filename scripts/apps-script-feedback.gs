/* ============================================================
   ICU Helper Feedback — Google Apps Script
   Deploy as: Web App → Execute as: Me → Who has access: Anyone
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

    var timestamp = p.timestamp  || new Date().toISOString();
    var type      = p.type       || '-';
    var nama      = p.nama       || '-';
    var page      = p.page       || '-';
    var message   = p.message    || '-';
    var url       = p.url        || '-';

    /* Tulis header jika sheet kosong */
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Jenis', 'Nama', 'Halaman', 'Pesan', 'URL']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }

    sheet.appendRow([timestamp, type, nama, page, message, url]);

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService
      .createTextOutput('ERROR: ' + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
