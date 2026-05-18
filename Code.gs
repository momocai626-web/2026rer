// Google App Script for CRUD operations on Patients and Records sheets
// Web App URL: https://script.google.com/macros/s/AKfycbyb_GkXOiv8-soq6hOUVTHdKRsayFsP56WkA6SOhD9aOxmab5OxXUUbguWFpwnhiVDcjQ/exec
// 最後更新：2026-05-18

// Constants
const SPREADSHEET_ID = '1U4M04tiq4oln-rNKWDGjsLflQJ2xNgzUdrBlnFzBg74';
const PATIENTS_SHEET_NAME = 'patients';
const RECORDS_SHEET_NAME = 'records';

// Helper function to get the spreadsheet
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// Helper function to get or create a sheet
function getOrCreateSheet(sheetName, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

// Initialize sheets when the script loads (optional)
function onOpen() {
  initializeSheets();
}

// Initialize sheets with headers
function initializeSheets() {
  getOrCreateSheet(PATIENTS_SHEET_NAME, ['ID', '姓名', '密碼', '病歷號', '角色']);
  getOrCreateSheet(RECORDS_SHEET_NAME, ['日期', '疼痛程度', '完成運動', '備註', '病患ID']);
}

// ========== PATIENTS CRUD OPERATIONS ==========

function createPatient(patientData) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME);
    const newRow = [
      patientData.id || generateId(),
      patientData.name,
      patientData.password,
      patientData.medicalRecordNumber,
      patientData.role || 'patient'   // 新增角色欄位，預設為 patient
    ];
    sheet.appendRow(newRow);
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
    
    if (id) {
      const idIndex = headers.indexOf('ID');
      const patientRow = rows.find(row => row[idIndex] == id);
      if (patientRow) {
        const patient = {};
        headers.forEach((header, index) => {
          patient[header] = patientRow[index];
        });
        return { success: true, data: patient };
      } else {
        return { success: false, message: '找不到該患者' };
      }
    } else {
      const patients = rows.map(row => {
        const patient = {};
        headers.forEach((header, index) => {
          patient[header] = row[index];
        });
        return patient;
      });
      return { success: true, data: patients };
    }
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updatePatient(id, patientData) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const idIndex = headers.indexOf('ID');
    const rowIndex = rows.findIndex(row => row[idIndex] == id);
    
    if (rowIndex === -1) {
      return { success: false, message: '找不到該患者' };
    }
    
    const rowNum = rowIndex + 2;
    const updateRow = [
      id,
      patientData.name || rows[rowIndex][headers.indexOf('姓名')],
      patientData.password || rows[rowIndex][headers.indexOf('密碼')],
      patientData.medicalRecordNumber || rows[rowIndex][headers.indexOf('病歷號')],
      patientData.role || rows[rowIndex][headers.indexOf('角色')]
    ];
    
    sheet.getRange(rowNum, 1, 1, updateRow.length).setValues([updateRow]);
    return { success: true, message: '更新患者成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deletePatient(id) {
  try {
    const sheet = getOrCreateSheet(PATIENTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const idIndex = headers.indexOf('ID');
    const rowIndex = rows.findIndex(row => row[idIndex] == id);
    
    if (rowIndex === -1) {
      return { success: false, message: '找不到該患者' };
    }
    
    sheet.deleteRow(rowIndex + 2);
    return { success: true, message: '刪除患者成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// ========== RECORDS CRUD OPERATIONS ==========

function createRecord(recordData) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME);
    const exerciseStr = Array.isArray(recordData.exercise) 
      ? recordData.exercise.join(', ') 
      : recordData.exercise;
    
    const newRow = [
      recordData.date,
      recordData.painLevel,
      exerciseStr,
      recordData.remarks,
      recordData.patientId
    ];
    sheet.appendRow(newRow);
    return { success: true, message: '新增紀錄成功' };
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
    
    if (patientId) {
      const patientIdIndex = headers.indexOf('病患ID');
      const filteredRows = rows.filter(row => row[patientIdIndex] == patientId);
      
      const records = filteredRows.map(row => {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = row[index];
        });
        return record;
      });
      return { success: true, data: records };
    } else {
      const records = rows.map(row => {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = row[index];
        });
        return record;
      });
      return { success: true, data: records };
    }
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function updateRecord(recordId, recordData) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const rowNum = parseInt(recordId);
    if (isNaN(rowNum) || rowNum < 2 || rowNum > data.length) {
      return { success: false, message: '無效的紀錄 ID' };
    }
    
    const exerciseStr = Array.isArray(recordData.exercise) 
      ? recordData.exercise.join(', ') 
      : recordData.exercise;
    
    const updateRow = [
      recordData.date || sheet.getRange(rowNum, 1).getValue(),
      recordData.painLevel || sheet.getRange(rowNum, 2).getValue(),
      exerciseStr || sheet.getRange(rowNum, 3).getValue(),
      recordData.remarks || sheet.getRange(rowNum, 4).getValue(),
      recordData.patientId || sheet.getRange(rowNum, 5).getValue()
    ];
    
    sheet.getRange(rowNum, 1, 1, updateRow.length).setValues([updateRow]);
    return { success: true, message: '更新紀錄成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function deleteRecord(recordId) {
  try {
    const sheet = getOrCreateSheet(RECORDS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const rowNum = parseInt(recordId);
    if (isNaN(rowNum) || rowNum < 2 || rowNum > data.length) {
      return { success: false, message: '無效的紀錄 ID' };
    }
    
    sheet.deleteRow(rowNum);
    return { success: true, message: '刪除紀錄成功' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Helper function to generate a simple ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== WEB APP ENDPOINT (doPost) ==========
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    let result;
    
    switch (action) {
      case 'createPatient':
        result = createPatient(params.data);
        break;
      case 'getPatients':
        result = getPatients(params.id);
        break;
      case 'updatePatient':
        result = updatePatient(params.id, params.data);
        break;
      case 'deletePatient':
        result = deletePatient(params.id);
        break;
      case 'createRecord':
        result = createRecord(params.data);
        break;
      case 'getRecords':
        result = getRecords(params.patientId);
        break;
      case 'updateRecord':
        result = updateRecord(params.id, params.data);
        break;
      case 'deleteRecord':
        result = deleteRecord(params.id);
        break;
      default:
        result = { success: false, message: '不支援的操作' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// For testing in the script editor (optional)
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'createPatient',
        data: {
          name: '測試病患',
          password: '123456',
          medicalRecordNumber: 'MR001'
        }
      })
    }
  };
  console.log(doPost(mockEvent));
}

// ========== HANDLE GET REQUESTS ==========
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Google Apps Script Web App 正常運行',
      timestamp: new Date().toISOString(),
      note: '此端點接受 POST 請求進行 CRUD 操作。請使用前端頁面或 Postman 等工具進行測試。',
      availableActions: [
        'createPatient', 'getPatients', 'updatePatient', 'deletePatient',
        'createRecord', 'getRecords', 'updateRecord', 'deleteRecord'
      ],
      spreadsheetId: SPREADSHEET_ID
    }))
    .setMimeType(ContentService.MimeType.JSON);
}