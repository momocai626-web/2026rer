# 🏥 復健紀錄管理系統 (Rehabilitation Record System)

![Version](https://img.shields.io/badge/version-1.4-blue.svg)
![Status](https://img.shields.io/badge/status-Professional_v1.4-teal.svg)

專業、直覺且具備數據分析能力的醫療復健管理平台，旨在優化病患復健歷程的紀錄、追蹤與數據決策。

---

## 🌟 核心特色

本系統採用 **「行政管理」** 與 **「數據分析」** 二元化核心架構，專為物理治療師與復健個案設計：

### 1. 👥 患者帳號管理 (IAM)
*   **全方位帳號維護**：支援病患資料的 CRUD（新增、查詢、更新、刪除）。
*   **角色權限控管**：區分 `patient`（病患）與 `admin`（治療師）權限，確保資料安全。
*   **病歷號整合**：整合院內病歷編號，方便與現有醫療系統對接。

### 2. 📈 復健數據分析 (Clinical BI)
*   **全院趨勢統計**：自動計算每日全院病患平均疼痛數值，協助經營管理視角 (BI)。
*   **個案進度曲線**：動態繪製個人復健疼痛趨勢（Line Chart），一眼看穿康復進度。
*   **上下文關聯診斷**：在分析個案時同步展示「歷史紀錄明細」，結合主觀備註與客觀數據。

### 3. 📝 現代化病患體驗
*   **VAS 疼痛評分**：符合臨床標準的疼痛評估介面。
*   **混合式登入**：支援以「姓名」或「病患 ID」登入，降低操作門檻。
*   **專業醫療 UI**：採用 Noto Sans TC 與現代化醫療配色，提供穩重、專業的視覺感受。

---

## 🛠️ 技術棧 (Tech Stack)

*   **前端 (Frontend)**：HTML5, Vanilla CSS (Modern Grid/Flex), JavaScript (ES6+).
*   **數據視覺化 (Data Visualization)**：[Chart.js](https://www.chartjs.org/) v4.x.
*   **後端與資料庫 (Backend & DB)**：Google Apps Script (GAS) + Google Sheets.
*   **特色架構**：
    *   **Dynamic Headers**：GAS 端實作動態標題偵測，強化資料庫擴展性。
    *   **Contextual UI**：根據操作情境自動切換圖表與明細視圖。

---

## 📂 專案結構

```text
├── Code.gs             # Google Apps Script 後端邏輯 (動態標題偵測)
├── index.html          # 入口導覽頁 (Portal)
├── login.html          # 混合式登入頁面
├── rehab-form.html     # 病患復健紀錄表單
├── admin.html          # 醫療管理後台 (帳號管理 + 數據分析)
├── style.css           # 醫療專業級全局樣式表
├── plan.md             # 專案實作計畫書
├── process.md          # 開發歷程記錄
└── walkthrough.md      # 優化成果技術報告
```

---

## 🚀 快速開始 (Deployment)

### 1. 後端部署 (Google Apps Script)
1. 建立一個新的 [Google Sheet](https://sheets.new)。
2. 建立兩個工作表：`patients` 與 `records`。
3. 點擊「延伸功能」 > 「Apps Script」，貼上 `Code.gs` 的內容。
4. 修改 `SPREADSHEET_ID` 為您的試算表 ID。
5. 點擊「部署」 > 「新部署」，將類型選擇為「網頁應用程式」，並設定為「任何人」皆可存取。
6. 取得 `Web App URL`。

### 2. 前端設定
1. 開啟 `login.html`、`rehab-form.html` 與 `admin.html`。
2. 將腳本中的 `API_URL` 替換為您上一步取得的 `Web App URL`。
3. 透過 Live Server (VS Code) 啟動專案，或直接開啟 `index.html`。

---

## 📅 版本紀錄
*   **v1.0 - v1.2**：完成基礎 MVP、導入醫療 UI 與 Chart.js 基礎圖表。
*   **v1.3**：實作三維度（行政、統計、臨床）分離架構。
*   **v1.4 (Current)**：重構為二元化核心架構，整合數據分析模組，提升 UX 流程。

---

## ⚖️ 免責聲明
本系統僅供學術研究與復健輔助紀錄使用，不具備正式醫療診斷法律效力。正式臨床用途請諮詢專業醫療團隊。

© 2026 復健紀錄管理系統開發小組
