# 🔢 Number Guessing Game

> 本專案全程使用 [opencode](https://opencode.ai)（AI CLI 協作工具）開發，完整對話紀錄請見 [CONVERSATION.md](./CONVERSATION.md)。

一個具備公開排名的猜數字遊戲，支援一般模式與闖關模式，含時間限制、帳號系統、稱號解鎖、成就系統、深色模式等功能。

## 功能一覽

### 遊戲模式
- **一般模式**：不限嘗試次數，依 attempts 排名（越少越高）。內建三種難度（簡單 0-100 / 困難 0-500 / 超困難 0-2000）+ 自訂範圍
- **闖關模式**：有限嘗試次數、逐關挑戰。範圍初始 1000，每關 +255。勝利條件：通過 10 關（第 10 關猜中即獲勝）
  - 嘗試次數公式：`T(n) = ceil(log₂(1000+255(n-1)))`，各難度再加 bonus
  - 每次闖關有 3 次提示可用（奇偶 / 大小區間 / 個位數字）
  - 時限：闖關模式 5 分鐘、一般模式 10 分鐘

### 帳號系統
- 註冊 / 登入（密碼 sha256 hash）
- 訪客模式（名稱固定 "unknown"，不計分數）
- 稱號系統：初心者（預設）、挑戰者（需遊玩闖關解鎖）、神之一筆（需一次猜中解鎖）、管理員（僅 King 可用）
- 登入狀態持久化（localStorage），手動登出前保持登入

### 排行榜
- 每位玩家每個難度僅顯示最佳紀錄
- 一般模式：最低 attempts
- 闖關模式：最高關卡數 + 最低 attempts

### 成就系統 🏆
| 成就 | 名稱 | 條件 |
|------|------|------|
| first_win | 初次勝利 | 贏得第一場遊戲 |
| speed_demon | 閃電快手 | 10 秒內猜中答案 |
| marathon | 馬拉松選手 | 闖關通過 5 關 |
| hint_master | 提示大師 | 不使用提示獲勝 |
| persistent | 堅持不懈 | 完成 10 場遊戲 |

### 個人統計 📊
- 總遊戲次數 / 勝場 / 勝率
- 平均 attempts / 最佳紀錄
- 總遊玩時間
- 成就進度一覽

### UI / UX
- 🌙 深色模式切換（與淺色模式皆支援，主題儲存於 localStorage）
- ✨ CSS 動畫（結果彈入、溫度提示淡入、通知展開）
- 🔍 溫度提示系統（超燙 ±5 / 很接近 ±20 / 普通 ±50 / 很遠 >50）
- 📝 猜測歷史紀錄（闖關模式按關卡分組）
- 🎵 Web Audio API 音效（猜對、猜錯、升階、遊戲結束、超時、提示）
- ⌨️ 輸入框自動聚焦，連續遊玩不需點擊

## 技術架構

| 層 | 技術 |
|------|------|
| 前端 | Next.js 15 (App Router), React 19, TypeScript |
| 後端 | Next.js API Routes (RESTful) |
| 資料庫 | SQLite (via Prisma ORM) |
| 音效 | Web Audio API（免安裝） |
| 認證 | sha256 hash + localStorage session |
| 部署 | GitHub Pages (`_wp/homework/08`) |

## 快速開始

```bash
# 安裝依賴
cd homework/08
npm install

# 初始化資料庫
npx prisma db push

# 啟動開發伺服器
npm run dev

# 或使用 start.bat（雙擊執行）
```

開啟 http://localhost:3000 即可遊玩。

## 專案結構

```
homework/08/
├── prisma/
│   └── schema.prisma          # 資料庫模型（User, Score）
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── achievements/  # 成就查詢 API
│   │   │   ├── auth/          # 註冊 / 登入 API
│   │   │   ├── game/          # 遊戲 start / guess / hint API
│   │   │   ├── leaderboard/   # 排行榜 API
│   │   │   ├── stats/         # 個人統計 API
│   │   │   └── titles/        # 稱號設定 API
│   │   ├── globals.css        # 全域樣式 + CSS 變數 + 動畫
│   │   ├── layout.tsx         # 根佈局（含主題初始化）
│   │   ├── page.tsx           # 遊戲主頁面（全部邏輯）
│   │   ├── leaderboard/       # 排行榜頁面
│   │   └── stats/             # 個人統計頁面
│   └── lib/
│       ├── achievements.ts    # 成就定義與檢查邏輯
│       ├── challenge.ts       # 闖關公式
│       ├── game-store.ts      # 遊戲狀態記憶體儲存
│       ├── prisma.ts          # Prisma client singleton
│       └── sound.ts           # Web Audio API 音效
├── package.json
├── start.bat
└── tsconfig.json
```

## 開發者備註

- 遊戲狀態使用記憶體 `Map<string, GameState>` + `globalThis` 持久化，避免 dev hot-reload 遺失
- 提示次數跨關卡保留（不重置）
- 時間檢查在 server-side（guess route 驗證），倒數顯示在 client-side（setInterval）
- 閒置 3 分鐘自動關閉遊戲（client-side 計時）
