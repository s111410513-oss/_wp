# 《_wp》課程作業總整理

> 本文件由 AI 工具輔助產出：**opencode（AI CLI 協作工具）、ChatGPT、Gemini**
>
> opencode 對話紀錄（08 猜數字遊戲）：`08/CONVERSATION.md`
>
> ChatGPT 對話紀錄：
> - <https://chatgpt.com/share/6a190c1e-d834-83a5-851c-5469987e4b54>
> - <https://chatgpt.com/share/6a190c32-3ee8-8320-8e6a-423545abea58>
> - <https://chatgpt.com/share/6a190c4c-5f00-8324-9d70-9617efcdab21>
> - <https://chatgpt.com/share/6a190c59-cabc-83a5-88a4-21407039fc58>
> - <https://chatgpt.com/share/6a190c6a-036c-8320-9ab3-116dcecade0d>
> - <https://chatgpt.com/share/6a190c7a-60a8-8321-b52a-5fcce09800fd>
> - <https://chatgpt.com/share/6a190c86-613c-83a7-866d-f17dfa294055>
> - <https://chatgpt.com/share/6a190c91-9430-8322-87bf-00f6b03b3c3e>
> - <https://chatgpt.com/share/6a190cb2-1fb8-8323-92f6-4402985a27ba>

---

## 目錄結構總覽

```
homework/
├── 01/          自我介紹（HTML + CSS — 吳京）
├── 02/          HTML 表單範例（各種 HTML 輸入類型）
├── 03/          JavaScript 入門 — Hello World
├── 04/          JavaScript 基礎語法練習（if/for/while/function/array/object/JSON）
├── 05/          Node.js 部落格系統（Express + CRUD + 會員系統 + Threads 風格 UI）
├── 06/          JavaScript 進階函數（Callback / IIFE / Arrow / Higher-Order / 傳址陷阱）
├── 07/          JavaScript 實戰應用（物件操作 / 解構 / forEach / JSON / Error-First Callback）
├── 08/          猜數字遊戲（Next.js + Prisma + SQLite，含排行榜、成就系統、深色模式）
└── 09/          本總整理資料夾
```

---

## 01 — 自我介紹

**檔案：** `01/自我介紹.吳京.html`

作者吳京（金門大學 資工一）的個人介紹頁面，包含基本資料、關於我、興趣三大區塊。使用綠色系 header + 卡片式排版。

---

## 02 — HTML 表單範例

**檔案：** `02/html`

一個完整的 HTML 表單教學頁面，展示各種 HTML 輸入類型：

- **基本資料：** text、password、email、tel、number、url、search
- **日期時間：** date、time、datetime-local、month、week
- **選項：** radio（單選）、checkbox（多選）
- **下拉選單：** select + option
- **建議輸入：** input + datalist
- **其他輸入：** color、range、file、textarea
- **隱藏欄位：** hidden
- **狀態顯示：** progress、meter

每個欄位都有中文註解說明用途。

---

## 03 — JavaScript Hello World

**檔案：** `03/hello.js`

```js
console.log('hello 你好')
```

最簡單的 Node.js 入門程式。

---

## 04 — JavaScript 基礎語法練習

**共 10 個練習檔，涵蓋核心 JS 語法：**

| 檔案 | 主題 | 說明 |
|------|------|------|
| `01-if.js` | if 條件判斷 | 判斷奇數 / 偶數 |
| `02-for.js` | for 迴圈 | 計算 1~10 總和 |
| `03-while.js` | while 迴圈 | 從 1 數到 5 |
| `04-function.js` | 函式 | Hello, John 問候函式 |
| `05-array.js` | 陣列操作 | push / for 遍歷 |
| `06-object.js` | 物件 | 存取 person.name / age |
| `07-json.js` | JSON 解析 | JSON.parse 轉物件 |
| `08-gradepass.js` | 函式 + if | 判斷成績及格 / 不及格 |
| `09-maximum.js` | 陣列找最大值 | for + if 找最大值 |
| `10-score.js` | while + object | 學生成績遍歷判斷 |

此目錄另有 README.md 記錄 ChatGPT 輔助學習的連結與測試輸出結果。

---

## 05 — Node.js 部落格系統

**一個使用 Node.js + Express 開發的仿 Threads 風格社群部落格。**

### 核心功能
- **文章 CRUD：** 發表、編輯、刪除文章（RESTful API）
- **會員系統：** 註冊 / 登入（密碼雜湊）
- **Threads 風格 UI：** 黑色主題、側邊欄導航、卡片式貼文、漸層頭像
- **三大專區：** 所有貼文（公共）、我的貼文（個人）、探索使用者

### 子目錄 / 檔案
| 路徑 | 說明 |
|------|------|
| `blog/` | 主專案（含 server.js、public/index.html、package.json） |
| `blog 1/` ~ `blog 3/` | 開發過程中的版本迭代 |
| `doc/` | 相關文件 |
| `blog_summary.md` | 開發對話紀錄摘要 |
| `blog_code_detail.md` | 程式碼詳細解說 |
| `blog_opencode_memory.md` | opencode 記憶檔案 |
| `.gitignore` | Git 過濾規則 |

### 技術棧
Node.js + Express + JSON 檔案儲存 + 原生 HTML/CSS/JS

---

## 06 — JavaScript 進階函數練習

**共 10 個練習，涵蓋 JS 進階函數概念：**

| # | 主題 | 說明 |
|---|------|------|
| 1 | Callback 基礎實作 | 傳入不同 action 函數處理加/減法 |
| 2 | IIFE（立即執行函數） | 匿名函數立即執行，封裝變數作用域 |
| 3 | 箭頭函數與陣列轉換 | map + 箭頭函數計算八折價格 |
| 4 | 破壞性修改 | pop / unshift 直接修改原陣列 |
| 5 | Higher-Order Function | 函數回傳函數（multiplier 工廠） |
| 6 | Callback 篩選器 | 自訂 myFilter 搭配 callback |
| 7 | 箭頭函數處理物件 | filter + 箭頭函數篩選成年人 |
| 8 | 參數傳址陷阱 | push vs 重新賦值的差異 |
| 9 | 延遲執行的 Callback | setTimeout + 箭頭函數 |
| 10 | 綜合應用：計算總價 | 購物車總價 + discount callback |

---

## 07 — JavaScript 實戰應用練習

**共 10+ 個練習，聚焦實用程式設計模式：**

| # | 主題 | 說明 |
|---|------|------|
| 1 | 物件屬性存取 | 點記法 vs 括號記法存取物件 |
| 2 | 物件解構賦值 | 從 req.body 解構 title / content / author |
| 3 | forEach & 模板字串 | 遍歷貼文陣列產生 HTML |
| 4 | 字典與動態參數 | 動態新增物件 key |
| 6 | JSON 處理 | JSON.parse 解析 tags 陣列 |
| 7 | 模擬資料庫查詢 | fakeGet 模擬 SQL 查詢 + Callback |
| 8 | 模板字串邏輯運算 | 三元運算子決定顯示內容 |
| 9 | 排序與切片 | map + slice 截斷長字串 |
| 10 | Error-First Callback | 錯誤優先回呼模式（checkAdmin） |
| 額外 | Error-First Callback 實作 | fetchData 模擬資料庫回傳 |

---

## 08 — 猜數字遊戲（Next.js 全端專案）

**一個具備公開排名的猜數字遊戲，使用 opencode（AI CLI）協作開發。**

### 功能一覽
- **一般模式：** 三種難度（簡單 0-100 / 困難 0-500 / 超困難 0-2000）+ 自訂範圍
- **闖關模式：** 有限嘗試次數（公式計算）、逐關挑戰，通過 10 關獲勝
- **提示系統：** 奇偶 / 大小區間 / 個位數字（每局 3 次）
- **帳號系統：** 註冊 / 登入（sha256）、訪客模式、4 種稱號
- **排行榜：** 每位玩家每個難度僅顯示最佳紀錄
- **成就系統：** 5 種成就（初次勝利、閃電快手、馬拉松選手等）
- **個人統計：** 勝率 / 平均 attempts / 總遊玩時間
- **深色模式：** CSS variables + localStorage 持久化
- **音效：** Web Audio API 產生（免外部檔案）
- **動畫：** 結果彈入、溫度提示淡入、通知展開

### 技術架構
| 層 | 技術 |
|---|------|
| 前端 | Next.js 15 (App Router), React 19, TypeScript |
| 後端 | Next.js API Routes (RESTful) |
| 資料庫 | SQLite (via Prisma ORM) |
| 音效 | Web Audio API |
| 認證 | sha256 hash + localStorage session |

### 關鍵檔案
```
08/
├── prisma/schema.prisma     # 資料庫模型
├── src/app/
│   ├── page.tsx             # 遊戲主頁面
│   ├── leaderboard/         # 排行榜頁面
│   ├── stats/               # 個人統計頁面
│   └── api/                 # RESTful API 路由
├── src/lib/                 # 工具函數（成就 / 闖關公式 / 音效等）
├── CONVERSATION.md          # 完整 AI 開發對話紀錄（opencode）
└── README.md                # 專案說明（開頭註明使用 opencode）
```

---

## 學習路徑建議

```
入門  →  自我介紹（01）
        ↓
      HTML 表單（02）
        ↓
基礎  →  JS 語法練習（03 → 04）
        ↓
後端  →  Node.js 部落格（05）
        ↓
進階  →  JS 進階函數（06 → 07）
        ↓
全端  →  Next.js 猜數字遊戲（08）
```

每週作業循序漸進，從 HTML 表單、JavaScript 基礎、Node.js 後端、JS 進階概念，到最後的全端 Next.js 專案，完整涵蓋網頁開發的核心技術。
