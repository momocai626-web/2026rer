# 每日復健紀錄系統 - 臨床實用版 v1.6

## 專案概述
本專案為「臺大醫院雲林分院 斗六院區 復健部」設計，旨在建立一個極簡、溫馨、實用的**每日復健紀錄回報系統**。個案（病患）每日可透過手機回報疼痛、運動完成項目與備註，物理治療師則能透過後端管理帳號並以 BI 圖表追蹤康復趨勢。

## 核心分頁與功能結構

| 分頁 | 核心價值 | 主要功能 |
|------|----------|----------|
| **首頁 (index.html)** | 門戶與衛教 | 提供系統登入入口、免責聲明，並置入 **五十肩居家復健衛教海報專區**，提供個案隨時查閱。 |
| **復健回報表單 (rehab-form.html)** | 個案每日回報 | 個案登入後，快速勾選當日完成運動、評估疼痛（0-4分）與撰寫備註，一鍵提交至雲端資料庫。疼痛程度與完成運動旁附有衛教海報說明按鈕。 |
| **後台管理系統 (admin.html)** | 治療師追蹤與 BI | 帳號維護（CRUD）、動態患者復健紀錄趨勢分析（全院平均/個人曲線）、歷史明細對照。完整 RWD 手機卡片模式。 |
| **雲端 API (Code.gs)** | 強健後端 | 基於 Google Sheets 的輕量 CRUD，支援動態標題偵測、穩定 recordId 刪除機制與後端登入驗證。 |

## v1.6 優化重點（2026-05-20）
- **資安強化**：登入驗證移至後端 `loginPatient()`，密碼不再流出前端；修正 `openEditModal` XSS 漏洞；修正 `rehab-form` 角色判斷空值漏洞。
- **資料穩定性**：records sheet 新增 `recordId` 唯一欄位，刪除紀錄改用 ID 查找，解決行號競態問題；新增 `updateRecord` action。
- **後台 RWD**：手機版表格改為卡片堆疊模式（`data-label`），`admin-container` 修正 flex child 置中問題（`align-self: center`）。
- **表單 RWD**：補齊 `form-container`、`radio-group`、`checkbox-group` 完整 CSS；疼痛/運動選項改為純視覺 pill 按鈕，隱藏原生 input，消除點擊抖動。
- **衛教指南整合**：`rehab-form.html` 疼痛程度與完成運動欄位旁新增「說明」/「示範」按鈕，點擊開啟對應衛教海報燈箱。
- **後端修正**：`getOrCreateSheet` 空表 crash 修正；`formatDate` 時區偏移修正（改用本地時間）；`window.onclick` 改為 `addEventListener`。