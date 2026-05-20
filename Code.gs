// Google Apps Script backend for the rehabilitation record system.
// Sheets:
// patients: ID, 姓名, 密碼, 病歷號, 角色
// records: recordId, 日期, 疼痛程度, 完成運動, 備註, 病患ID

const SPREADSHEET_ID = '1U4M04tiq4oln-rNKWDGjsLflQJ2xNgzUdrBlnFzBg74';
const PATIENTS_SHEET_NAME = 'patients';
const RECORDS_SHEET_NAME = 'records';

const PATIENT_HEADERS = ['ID', '姓名', '密碼', '病歷號', '角色'];
const RECORD_HEADERS = ['recordId', '日期', '疼痛程度', '完成運動', '備註', '病患ID'];

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet(sheetName, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (headers && sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  if (headers && sheet.getLastRow() > 0) {
    const colCount = Math.max(sheet.getLastColumn(), headers.length, 1);
    const currentHeaders = sheet.getRange(1, 1, 1, colCount).getValues()[0];
    headers.forEach((header, index) => {
      if (!currentHeaders[index]) {
        sheet.getRange(1, index + 1).setValue(header);
      }
    });
  }

  return sheet;
}

function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((header, index) => {
    if (header) map[String(header).trim()] = index + 1;
  });
  return map;
}

function rowsToObjects(sheet) {
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(header => String(header).trim());
  return values.slice(1).filter(row => row.some(cell => cell !== '')).map((row, index) => {
    const item = { _row: index + 2 };
    headers.forEach((header, columnIndex) => {
      if (header) item[header] = row[columnIndex];
    });
    return item;
  });
}

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function createPatient(patientData) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME, PATIENT_HEADERS);
    const headerMap = getHeaderMap(sheet);
    const row = new Array(sheet.getLastColumn()).fill('');

    row[headerMap.ID - 1] = patientData.id || generateId();
    row[headerMap['姓名'] - 1] = patientData.name || '';
    row[headerMap['密碼'] - 1] = patientData.password || '';
    row[headerMap['病歷號'] - 1] = patientData.medicalRecordNumber || '';
    row[headerMap['角色'] - 1] = patientData.role || 'patient';

    sheet.appendRow(row);
    return { success: true, message: '帳號已新增' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function getPatients(id) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME, PATIENT_HEADERS);
    const patients = rowsToObjects(sheet);
    if (id) {
      const patient = patients.find(item => item.ID == id);
      return patient ? { success: true, data: patient } : { success: false, message: '找不到該帳號' };
    }
    return { success: true, data: patients };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updatePatient(id, patientData) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME, PATIENT_HEADERS);
    const headerMap = getHeaderMap(sheet);
    const rows = sheet.getDataRange().getValues();
    const idIndex = headerMap.ID - 1;
    const rowIndex = rows.slice(1).findIndex(row => row[idIndex] == id);

    if (rowIndex === -1) return { success: false, message: '找不到該帳號' };

    const rowNumber = rowIndex + 2;
    sheet.getRange(rowNumber, headerMap['姓名']).setValue(patientData.name || '');
    sheet.getRange(rowNumber, headerMap['密碼']).setValue(patientData.password || '');
    sheet.getRange(rowNumber, headerMap['病歷號']).setValue(patientData.medicalRecordNumber || '');
    sheet.getRange(rowNumber, headerMap['角色']).setValue(patientData.role || 'patient');

    return { success: true, message: '帳號已更新' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deletePatient(id) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME, PATIENT_HEADERS);
    const headerMap = getHeaderMap(sheet);
    const rows = sheet.getDataRange().getValues();
    const rowIndex = rows.slice(1).findIndex(row => row[headerMap.ID - 1] == id);

    if (rowIndex === -1) return { success: false, message: '找不到該帳號' };
    sheet.deleteRow(rowIndex + 2);
    return { success: true, message: '帳號已刪除' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function createRecord(recordData) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME, RECORD_HEADERS);
    const headerMap = getHeaderMap(sheet);
    const row = new Array(sheet.getLastColumn()).fill('');
    const exercise = Array.isArray(recordData.exercise) ? recordData.exercise.join(', ') : (recordData.exercise || '');

    row[headerMap['recordId'] - 1] = generateId();
    row[headerMap['日期'] - 1] = recordData.date || new Date();
    row[headerMap['疼痛程度'] - 1] = recordData.painLevel || '';
    row[headerMap['完成運動'] - 1] = exercise;
    row[headerMap['備註'] - 1] = recordData.remarks || '';
    row[headerMap['病患ID'] - 1] = recordData.patientId || '';

    sheet.appendRow(row);
    return { success: true, message: '紀錄已送出' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function getRecords(patientId) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME, RECORD_HEADERS);
    const records = rowsToObjects(sheet);
    if (patientId) {
      return { success: true, data: records.filter(item => item['病患ID'] == patientId) };
    }
    return { success: true, data: records };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updateRecord(recordId, recordData) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME, RECORD_HEADERS);
    const headerMap = getHeaderMap(sheet);
    const rows = sheet.getDataRange().getValues();
    const idIndex = headerMap['recordId'] - 1;

    const rowIndex = rows.slice(1).findIndex(row => String(row[idIndex]) === String(recordId));
    if (rowIndex === -1) return { success: false, message: '找不到該筆紀錄' };

    const rowNumber = rowIndex + 2;
    const exercise = Array.isArray(recordData.exercise)
      ? recordData.exercise.join(', ')
      : (recordData.exercise || '');

    if (recordData.date !== undefined)      sheet.getRange(rowNumber, headerMap['日期']).setValue(recordData.date);
    if (recordData.painLevel !== undefined) sheet.getRange(rowNumber, headerMap['疼痛程度']).setValue(recordData.painLevel);
    if (recordData.exercise !== undefined)  sheet.getRange(rowNumber, headerMap['完成運動']).setValue(exercise);
    if (recordData.remarks !== undefined)   sheet.getRange(rowNumber, headerMap['備註']).setValue(recordData.remarks);

    return { success: true, message: '紀錄已更新' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deleteRecord(recordId) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME, RECORD_HEADERS);
    const headerMap = getHeaderMap(sheet);
    const rows = sheet.getDataRange().getValues();
    const idIndex = headerMap['recordId'] - 1;

    // 從第 2 行開始找（跳過標頭）
    const rowIndex = rows.slice(1).findIndex(row => String(row[idIndex]) === String(recordId));
    if (rowIndex === -1) return { success: false, message: '找不到該筆紀錄' };

    sheet.deleteRow(rowIndex + 2);
    return { success: true, message: '紀錄已刪除' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function loginPatient(username, password) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME, PATIENT_HEADERS);
    const patients = rowsToObjects(sheet);
    const patient = patients.find(item =>
      (String(item['姓名']) === username || String(item.ID) === username) &&
      String(item['密碼']) === password
    );
    if (!patient) return { success: false, message: '帳號或密碼錯誤' };
    // 回傳時移除密碼欄位，不讓密碼流出前端
    const { 密碼: _omit, ...safePatient } = patient;
    return { success: true, data: safePatient };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents || '{}');
    let result;

    switch (params.action) {
      case 'login':
        result = loginPatient(params.username, params.password);
        break;
      case 'createPatient':
        result = createPatient(params.data || {});
        break;
      case 'getPatients':
        result = getPatients(params.id);
        break;
      case 'updatePatient':
        result = updatePatient(params.id, params.data || {});
        break;
      case 'deletePatient':
        result = deletePatient(params.id);
        break;
      case 'createRecord':
        result = createRecord(params.data || {});
        break;
      case 'getRecords':
        result = getRecords(params.patientId || params.id);
        break;
      case 'deleteRecord':
        result = deleteRecord(params.id);
        break;
      case 'updateRecord':
        result = updateRecord(params.id, params.data || {});
        break;
      default:
        result = { success: false, message: '未知的操作' };
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script Web App 正常運行',
    timestamp: new Date().toISOString(),
    note: '此端點接受 POST 請求進行 CRUD 操作。請使用前端頁面或 Postman 等工具進行測試。',
    availableActions: ['login', 'createPatient', 'getPatients', 'updatePatient', 'deletePatient', 'createRecord', 'getRecords', 'updateRecord', 'deleteRecord'],
    spreadsheetId: SPREADSHEET_ID
  })).setMimeType(ContentService.MimeType.JSON);
}
