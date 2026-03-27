# Opencode 對話記憶 - Blog 專案

## 對話時間
2026-03-27

## 專案概述
在 `C:\Jing\homework\js\_wp\homework\blog\` 建立了一個仿 Threads 風格的社群部落格系統。

## 開發過程

### 第一階段：基礎網誌系統
- 使用 Node.js + Express 建立後端 API
- HTML + JS 前端頁面
- 功能：發表、編輯、刪除文章
- 資料儲存：posts.json

### 第二階段：會員系統
- 新增註冊、登入功能
- 使用 users.json 儲存使用者資料
- 密碼使用簡單雜湊函數處理
- 權限控制：登入後才能發文

### 第三階段：Threads 風格介面
- 黑色主題設計
- 側邊欄導航
- 卡片式貼文排版
- 漸層頭像
- 三個專區：
  - 所有貼文（公共）
  - 我的貼文（個人）
  - 探索使用者（查看其他使用者）

### 文件建立
- `.gitignore` - 過濾 node_modules、posts.json、users.json 等
- `blog_summary.md` - 對話紀錄摘要
- `blog_code_detail.md` - 程式碼詳細解說

## 技術棧
- Node.js + Express（後端）
- 原生 HTML/CSS/JS（前端）
- JSON 檔案儲存（資料庫）

## 啟動命令
```bash
cd C:\Jing\homework\js\_wp\homework\blog
npm start
```
伺服器：http://localhost:3001

## 檔案結構
```
blog/
├── server.js
├── public/index.html
├── package.json
├── .gitignore
posts.json
users.json

C:\Jing\homework\js\_wp\homework\
├── .gitignore
├── blog_summary.md
└── blog_code_detail.md
```

## 待完成事項
- 伺服器連線問題（使用者回報無法連線）
- 需手動啟動伺服器
