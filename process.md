# 開發歷程記錄

> 本文件記錄專案開發過程中的所有變更、問題與解決方案

---

## 2026-05-18 (v1.1 全面優化版)

### 20:30 - 完成系統全面升級與美化
- **視覺重構**：
  - 更新 `style.css` 導入專業醫療配色（Teal 600 / Sky 600）。
  - 使用 `Inter` 與 `Noto Sans TC` 字體，提升閱讀質感。
  - 重構 `index.html` 入口頁，採用現代化卡片網格佈局。
- **功能與 UI/UX 增強**：
  - **導入 Chart.js**：在後台實作「疼痛程度趨勢圖」，支援動態繪製特定病患的復健進度。
  - **互動反饋**：所有 fetch 操作加入 Loading Spinner 與 Toast 通知。
  - **表單優化**：Radio 與 Checkbox 放大點擊範圍，符合手機操作習慣。
- **後端邏輯強化 (Code.gs)**：
  - **實作動態標題偵測**：改用標題名稱尋找索引，徹底解決試算表欄位順序變動導致的崩潰問題。
  - **統一回應格式**：強化例外處理，確保前端接收到正確的 JSON 結構。

### 19:40 - 加入 Toast 訊息框 + Modal 實作
- 在 `admin.html` 實作 Modal 彈窗（新增 / 編輯患者）
- 替換所有 `alert()` 為自訂 Toast 通知
- Toast 支援 success / error 兩種樣式，右上角顯示，3秒自動消失
- 移除舊的「新增患者」表單，改用按鈕觸發 Modal
... (rest of the file)

### 19:20 - 角色權限控管完成
- 支援混合式登入（姓名 或 ID）
- 根據角色自動跳轉（patient → rehab-form / admin → admin.html）
- 各頁面加入角色權限檢查

### 18:57 - 建立 process.md
- 新增 `process.md` 作為開發歷程記錄文件
- 目的：追蹤所有變更、問題與解決方案，方便後續維護與回顧

### 18:40 - 更新 plan.md
- 新增「實作狀態」欄位
- 修正 records 工作表欄位名稱為「完成運動」
- 新增「實作過程實務經驗」區段
- 更新目前專案狀態

### 18:20 - 解決 admin.html CORS 問題
**問題：**
- 使用 Live Server (`http://127.0.0.1:5500`) 呼叫 Google Apps Script 時出現 CORS 錯誤
- 錯誤訊息：`No 'Access-Control-Allow-Origin' header is present`

**解決方案：**
- 將 `fetch` 的 `Content-Type` 從 `application/json` 改為 `text/plain`
- 修改 `apiRequest` 函式，先以 `text()` 讀取回應，再嘗試解析 JSON
- 重新整理頁面後即可正常運作

**修改檔案：** `admin.html`

### 18:10 - 修正 records 欄位顯示問題
**問題：**
- admin.html 中「完成運動」欄位無法顯示資料

**原因：**
- 程式碼使用 `record.運動完成度`，但 Google Sheet 實際欄位為「完成運動」

**解決方案：**
- 修改 `renderRecordsTable` 函式，同時支援兩種欄位名稱
- 更新 `Code.gs` 中的標題統一定義為「完成運動」

**修改檔案：** `admin.html`、`Code.gs`

### 17:50 - 新增 doGet 函式
**問題：**
- 直接開啟 Web App URL 時出現錯誤：「找不到以下指令碼函式：doGet」

**解決方案：**
- 在 `Code.gs` 加入 `doGet(e)` 函式
- 回傳包含可用操作列表的 JSON 健康檢查資訊

**修改檔案：** `Code.gs`

### 17:30 - 完成前端頁面實作
- `login.html`：整合真實 API 驗證，登入成功後導向復健表單
- `rehab-form.html`：自動帶入登入患者資料，提交時包含 patientId
- `admin.html`：完整患者與紀錄 CRUD 管理介面

### 17:00 - 部署 Google Apps Script
- 取得 Web App URL：`https://script.google.com/macros/s/AKfycbyb_GkXOiv8-soq6hOUVTHdKRsayFsP56WkA6SOhD9aOxmab5OxXUUbguWFpwnhiVDcjQ/exec`
- 設定 Spreadsheet ID：`1U4M04tiq4oln-rNKWDGjsLflQJ2xNgzUdrBlnFzBg74`

---

## 開發守則

1. **每次修改 Code.gs 後務必重新部署**
2. **遇到 CORS 錯誤時，優先嘗試將 Content-Type 改為 text/plain**
3. **所有欄位名稱需與 Google Sheet 實際標題完全一致**
4. **重要變更請同步更新本文件與 plan.md**