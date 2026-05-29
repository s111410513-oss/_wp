# Blog 專案完整對話紀錄

---

## 對話 1：建立簡易網誌系統

**使用者**：幫我寫一個簡易的網誌系統

**我**：請問你想用什麼技術來建立這個網誌系統？
- 靜態 HTML/JS
- Node.js 後端
- React 前端

需要哪些功能？
- 基本檢視
- 可發表文章
- 完整 CRUD

**使用者**：Node.js 後端、完整 CRUD

**我**：
- 建立 `blog/package.json`
- 建立 `blog/server.js` - Express 後端 API
- 建立 `blog/public/index.html` - 前端頁面
- 安裝依賴

功能：發表、編輯、刪除文章

---

## 對話 2：移動到 blog/ 目錄

**使用者**：將這段程式碼寫在 blog/ 下

**我**：
- 在 `C:\Jing\homework\js\_wp\homework\blog\` 建立完整專案
- 安裝依賴

---

## 對話 3：新增登入登出、註冊

**使用者**：幫我新增登入登出，註冊，等使用介面。

**我**：
- 更新 `server.js`：
  - 新增 users.json 資料庫
  - 新增 `/api/register` 註冊 API
  - 新增 `/api/login` 登入 API
  - 簡單密碼雜湊函數
- 更新 `index.html`：
  - 新增登入/註冊 modal 視窗
  - 權限控制：登入後才能發文
  - 只有作者能編輯/刪除自己的文章

---

## 對話 4：Threads 風格介面

**使用者**：幫我新增像是 threads.com 的風格，包含美術排版，還有個人貼文專區，跟公共貼文專區，能夠看到其他使用者的介面。

**我**：
- 大幅更新 `server.js`：
  - 新增 `/api/users` 取得所有使用者
  - 新增 `/api/posts/user/:username` 取得特定使用者貼文
- 大幅更新 `index.html`：
  - 黑色主題設計 (Threads 風格)
  - 側邊欄導航
  - 卡片式貼文排版
  - 漸層頭像
  - 所有貼文區 (公共)
  - 我的貼文區 (個人)
  - 探索使用者專區

---

## 對話 5：新增 .gitignore

**使用者**：在我的專案根目錄 C:\Jing\homework\js\_wp\homework/.gitignore 檔案中，加上 node.js 需要過濾的那些條件進去

**我**：
- 建立 `C:\Jing\homework\js\_wp\homework\.gitignore`
- 建立 `C:\Jing\homework\js\_wp\homework\blog\.gitignore`

過濾條件：
- node_modules/
- *.log
- dist/build/
- .env 相關檔案
- posts.json, users.json (僅 blog 目錄)

---

## 對話 6：將對話紀錄寫入 blog_summary

**使用者**：將這段程式碼寫在 blog_summary 中，只要摘要

**我**：建立 `blog_summary.md` 摘要檔案

**使用者**：將全部對話放在 blog_summary 裡面

**我**：更新 `blog_summary.md` 為完整對話紀錄

---

## 最終檔案結構
```
C:\Jing\homework\js\_wp\homework\
├── blog\
│   ├── package.json
│   ├── server.js
│   ├── posts.json (文章資料)
│   ├── users.json (使用者資料)
│   ├── .gitignore
│   └── public\
│       └── index.html
├── .gitignore
└── blog_summary.md
```

## 技術棧
- Node.js + Express
- 原生 HTML/CSS/JS
- JSON 檔案儲存

## 啟動方式
```bash
cd C:\Jing\homework\js\_wp\homework\blog
npm start
```
瀏覽 http://localhost:3001
