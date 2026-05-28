# 開發對話完整紀錄

> 本專案全程使用 [opencode](https://opencode.ai) CLI 工具，以 AI 協作方式開發。
> 對話日期：2026-05-25 ~ 2026-05-28

---

## Session 1：專案初始化與核心功能

### Q: 初始目標
建立一個具備公開排名的猜數字遊戲，支援一般模式與闖關模式，含時間限制、帳號系統、稱號與溫度提示。

### 技術選擇
- Next.js (App Router) + Prisma (SQLite)
- 部署至 GitHub `s111410513-oss/_wp homework/08`

### 實作項目
- 一般模式：不限嘗試次數，依 attempts 排名；三種難度 + 自訂範圍（含 0）
- 闖關模式：有限嘗試、逐關挑戰，範圍初始 1000、每關 +255
- 嘗試次數公式：`T(n) = ceil(log₂(1000+255(n-1)))` + 難度 bonus
- 提示系統（奇偶/質數/區間），每局 3 次
- 10 分鐘遊戲倒數 + 3 分鐘閒置自動關閉
- 溫度提示（超燙/很接近/普通/很遠）
- 帳號註冊/登入（sha256 hash）
- 訪客模式（名稱固定 "unknown"，不計分數）
- 排行榜（每位玩家每個難度最佳紀錄）
- 稱號系統（管理員/初心者/挑戰者/神之一筆）

---

## Session 2：稱號解鎖系統

### Q: 將初心者設為預設，挑戰者/神之一筆設為代解鎖
- 遊玩闖關模式一次 → 解鎖「挑戰者」
- 一次猜中答案 → 解鎖「神之一筆」
- King 不受限制

### 實作
- Prisma User 新增 `challengerUnlocked` / `godlyUnlocked` 欄位
- guess route 終局時檢查條件，回傳 `unlocks` 陣列
- titles/set API 驗證解鎖狀態
- 前端顯示解鎖通知 + 選單鎖定狀態

---

## Session 3：登入狀態持久化

### Q: 前往排行榜再回來就被登出，改為除非手動登出否則保持登入

### 實作
- 登入狀態儲存至 localStorage（`ng_login`）
- 頁面載入時自動恢復
- `forceReset()`（閒置超時）不再清除登入狀態

---

## Session 4：加入音效

### Q: 可以加入音效嗎

### 實作
- 使用 Web Audio API 產生音效，無需外部檔案
- 6 種音效：猜對/猜錯/升階/遊戲結束/超時/提示

---

## Session 5：猜測歷史紀錄

### Q: 顯示猜過的數字讓玩家參考

### 實作
- 新增 `guessHistory` 狀態（陣列）
- 每次送出猜測後加入歷史
- 以 chip 標籤顯示在輸入區下方
- 最新一次猜測藍色高亮

---

## Session 6：溫度提示詞加範圍解釋

### Q: 超燙/很接近/普通/很遠 後面顯示 ±5 / ±20 / ±50 / >50

### 實作
- 溫度提示詞右側顯示範圍標示

---

## Session 7：猜測紀錄按關卡分組 + 訊息置中

### Q: 闖關模式猜過的分 level 顯示；灰色提示訊息改置中醒目

### 實作
- 猜測改為 `{value, level}` 物件，依 level 分組顯示
- 訊息改為置中 + 灰底圓角區塊

---

## Session 8：大功能批次實作

### Q: 建議深色模式/動畫/Session 認證/DB 儲存/統計頁面/成就系統/關卡 bonus

### 選擇實作（5 項）：
1. 深色模式
2. 動畫效果
3. DB 遊戲紀錄擴充
4. 成就系統
5. 個人統計頁面

### 實作細節

#### 深色模式
- CSS variables 多主題切換
- 主題儲存於 localStorage + script 預載（避免閃白）
- 所有頁面（主頁/排行榜/統計）支援

#### 動畫
- 結果彈入（pop-in）
- 溫度提示上滑淡入（fade-in-up）
- 通知展開（slide-down）

#### Score Model 擴充
- 新增 `timeTaken`、`hintsUsed`、`won` 欄位
- 所有終局路徑寫入完整紀錄

#### 成就系統
- 5 個成就定義
- 自動檢查 + DB 寫入
- 結算畫面顯示通知

#### 個人統計頁面 `/stats`
- 勝率/平均/最佳紀錄/總時間
- 成就進度一覽

---

## Session 9：提示改版

### Q: 質數提示不好用，想要更好的提示

### 選擇方案 B
1. 奇數/偶數
2. 大小區間（上半部/下半部）
3. 個位數字

---

## Session 10：三項 UX 改進

### Q: 闖關模式時限改 5 分鐘、英文 Higher/Lower 改中文、提示不蓋住遊戲訊息

### 實作
- 時限依 mode 區分（challenge 5min / normal 10min）
- Higher/Lower → 大/小
- 提示訊息獨立 `hintMessage` 顯示在遊戲訊息下方

---

## Session 11：輸入框自動聚焦

### Q: 每次猜數字都要重新點選輸入框，希望自動聚焦

### 實作
- inputRef + autoFocus
- useEffect 在 loading 結束後自動聚焦

---

## Session 12：勝利條件

### Q: 闖關模式設為通過 10 關即獲勝，新增備註

### 實作
- 第 10 關猜中 → `result: "victory"`，遊戲結束
- 統計頁面顯示「勝利條件：通過 10 關」

---

## Session 13：同步至 GitHub

### Q: 確認完整專案已上傳至 GitHub

### 實作
- 同步 `number-game` → `_wp/homework/08`
- 提交並推送至 `https://github.com/s111410513-oss/_wp`

---

## Session 14：README 與對話紀錄

### Q: 新增 README.md（開頭註明用 opencode），分享完整聊天紀錄

### 實作
- 撰寫 README.md（專案說明、功能一覽、技術架構、快速開始）
- 撰寫 CONVERSATION.md（完整開發對話紀錄）

---

## 最終提交紀錄

```
79e2104 homework 08: remove test file
c1118c8 homework 08: full game - auth, titles, challenges, stats, achievements, dark mode
8f678ae homework 08: admin title locked to King account only
c4ca112 homework 08: add title system with 4 titles
a3b30b5 homework 08: make lobby and logout buttons more visible
10b64c3 homework 08: leaderboard shows only best record per player+difficulty using distinct
17e1a19 homework 08: add user registration/login system with guest mode
77c8eda homework 08: include 0 in all guess ranges (0 to max)
13f687b homework 08: add custom difficulty for normal mode with user-defined range
...
```
