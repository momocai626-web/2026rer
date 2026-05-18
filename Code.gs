// Google App Script for CRUD operations with Dynamic Header Detection
// 最後更新：2026-05-18 v1.1

const SPREADSHEET_ID = '1U4M04tiq4oln-rNKWDGjsLflQJ2xNgzUdrBlnFzBg74';
const PATIENTS_SHEET_NAME = 'patients';
const RECORDS_SHEET_NAME = 'records';

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet(sheetName, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) sheet.appendRow(headers);
  }
  return sheet;
}

// 輔助函式：動態獲取欄位索引對照表
function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((h, i) => { if(h) map[h] = i + 1; });
  return map;
}

// ========== PATIENTS CRUD ==========

function createPatient(patientData) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME, ['ID', '姓名', '密碼', '病歷號', '角色']);
    const headerMap = getHeaderMap(sheet);
    const lastCol = sheet.getLastColumn();
    const rowData = new Array(lastCol).fill('');
    
    rowData[headerMap['ID'] - 1] = patientData.id || generateId();
    rowData[headerMap['姓名'] - 1] = patientData.name;
    rowData[headerMap['密碼'] - 1] = patientData.password;
    rowData[headerMap['病歷號'] - 1] = patientData.medicalRecordNumber;
    rowData[headerMap['角色'] - 1] = patientData.role || 'patient';
    
    sheet.appendRow(rowData);
    return { success: true, message: '新增患者成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function getPatients(id) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const patients = rows.map(row => {
      const p = {};
      headers.forEach((h, i) => { p[h] = row[i]; });
      return p;
    });

    if (id) {
      const patient = patients.find(p => p['ID'] == id);
      return patient ? { success: true, data: patient } : { success: false, message: '找不到該患者' };
    }
    return { success: true, data: patients };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updatePatient(id, patientData) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headerMap = getHeaderMap(sheet);
    const idIndex = headerMap['ID'] - 1;
    
    const rowIndex = data.slice(1).findIndex(row => row[idIndex] == id);
    if (rowIndex === -1) return { success: false, message: '找不到該患者' };
    
    const rowNum = rowIndex + 2;
    if (patientData.name) sheet.getRange(rowNum, headerMap['姓名']).setValue(patientData.name);
    if (patientData.password) sheet.getRange(rowNum, headerMap['密碼']).setValue(patientData.password);
    if (patientData.medicalRecordNumber) sheet.getRange(rowNum, headerMap['病歷號']).setValue(patientData.medicalRecordNumber);
    if (patientData.role) sheet.getRange(rowNum, headerMap['角色']).setValue(patientData.role);
    
    return { success: true, message: '更新成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deletePatient(id) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const idIdx = data[0].indexOf('ID');
    const rowIndex = data.slice(1).findIndex(row => row[idIdx] == id);
    if (rowIndex === -1) return { success: false, message: '找不到該患者' };
    sheet.deleteRow(rowIndex + 2);
    return { success: true, message: '刪除成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// ========== RECORDS CRUD ==========

function createRecord(recordData) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME, ['日期', '疼痛程度', '完成運動', '備註', '病患ID']);
    const headerMap = getHeaderMap(sheet);
    const rowData = new Array(sheet.getLastColumn()).fill('');
    
    rowData[headerMap['日期'] - 1] = recordData.date || new Date();
    rowData[headerMap['疼痛程度'] - 1] = recordData.painLevel;
    rowData[headerMap['完成運動'] - 1] = Array.isArray(recordData.exercise) ? recordData.exercise.join(', ') : recordData.exercise;
    rowData[headerMap['備註'] - 1] = recordData.remarks;
    rowData[headerMap['病患ID'] - 1] = recordData.patientId;
    
    sheet.appendRow(rowData);
    return { success: true, message: '紀錄成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function getRecords(patientId) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // 增加一個虛擬 ID (Row Number) 方便刪除
    const records = rows.map((row, i) => {
      const r = { '': i + 2 }; 
      headers.forEach((h, j) => { r[h] = row[j]; });
      return r;
    });

    if (patientId) {
      const filtered = records.filter(r => r['病患ID'] == patientId);
      return { success: true, data: filtered };
    }
    return { success: true, data: records };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deleteRecord(rowId) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME);
    const rowNum = parseInt(rowId);
    if (isNaN(rowNum) || rowNum < 2) return { success: false, message: '無效 ID' };
    sheet.deleteRow(rowNum);
    return { success: true, message: '刪除成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ========== WEB APP ENTRY POINTS ==========

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    let result;
    switch (params.action) {
      case 'createPatient': result = createPatient(params.data); break;
      case 'getPatients': result = getPatients(params.id); break;
      case 'updatePatient': result = updatePatient(params.id, params.data); break;
      case 'deletePatient': result = deletePatient(params.id); break;
      case 'createRecord': result = createRecord(params.data); break;
      case 'getRecords': result = getRecords(params.patientId); break;
      case 'deleteRecord': result = deleteRecord(params.id); break;
      default: result = { success: false, message: '不支援的操作' };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true, 
    status: 'online', 
    version: '1.1 (Dynamic Headers Enabled)'
  })).setMimeType(ContentService.MimeType.JSON);
}