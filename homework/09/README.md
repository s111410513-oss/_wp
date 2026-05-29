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

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>吳京自我介紹</title>
    <style>
        body{
            font-family: Arial, "Microsoft JhengHei", sans-serif;
            background-color:#f4f4f4;
            margin:0;
            padding:0;
        }
        header{
            background:#4CAF50;
            color:white;
            text-align:center;
            padding:30px;
        }
        .container{
            width:80%;
            margin:auto;
            overflow:hidden;
        }
        .card{
            background:white;
            padding:20px;
            margin-top:20px;
            border-radius:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.1);
        }
        h2{ color:#333; }
        ul{ line-height:1.8; }
        footer{
            text-align:center;
            padding:15px;
            margin-top:20px;
            background:#333;
            color:white;
        }
    </style>
</head>
<body>
<header>
    <h1>我的自我介紹</h1>
    <p>Welcome to My Personal Page</p>
</header>
<div class="container">
    <div class="card">
        <h2>基本資料</h2>
        <p>姓名：吳京</p>
        <p>學校：金門大學</p>
        <p>科系 / 班級：資工一</p>
    </div>
    <div class="card">
        <h2>關於我</h2>
        <p>喜歡電腦、看電影，透過運動維持健康。</p>
    </div>
    <div class="card">
        <h2>興趣</h2>
        <ul>
            <li>運動</li>
            <li>聽音樂</li>
            <li>打遊戲</li>
            <li>看電影</li>
        </ul>
    </div>
</div>
</body>
</html>
```

---

## 02 — HTML 表單範例

**檔案：** `02/html`

一個完整的 HTML 表單教學頁面，展示各種 HTML 輸入類型（基本資料、日期時間、選項、下拉選單、建議輸入、顏色/範圍/檔案、隱藏欄位、進度條），每個欄位都有中文註解。

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>表單範例</title>
<style>
body{ font-family:Arial; background:#f0f0f0; padding:30px; }
.container{ background:white; padding:20px; width:500px; margin:auto; border-radius:10px; }
label{ display:block; margin-top:10px; font-weight:bold; }
input,select,textarea{ width:100%; padding:6px; margin-top:4px; }
.option{ width:auto; }
button{ margin-top:15px; padding:10px; }
</style>
</head>
<body>
<div class="container">
<h2>HTML 表單</h2>
<form>
<fieldset><legend>基本資料</legend>
  <label>姓名</label><input type="text" name="name">
  <label>密碼</label><input type="password" name="password">
  <label>Email</label><input type="email" name="email">
  <label>電話</label><input type="tel" name="phone">
  <label>年齡</label><input type="number" name="age" min="0" max="120">
  <label>網站</label><input type="url" name="website">
  <label>搜尋</label><input type="search" name="search">
</fieldset>
<fieldset><legend>日期時間</legend>
  <label>生日</label><input type="date" name="birthday">
  <label>時間</label><input type="time" name="time">
  <label>日期時間</label><input type="datetime-local" name="datetime">
  <label>月份</label><input type="month" name="month">
  <label>週</label><input type="week" name="week">
</fieldset>
<fieldset><legend>選項</legend>
  <label>性別</label>
  <input class="option" type="radio" name="gender"> 男
  <input class="option" type="radio" name="gender"> 女
  <input class="option" type="radio" name="gender"> 其他
  <label>興趣</label>
  <input class="option" type="checkbox"> 音樂
  <input class="option" type="checkbox"> 運動
  <input class="option" type="checkbox"> 遊戲
  <input class="option" type="checkbox"> 閱讀
</fieldset>
<fieldset><legend>下拉選單</legend>
  <label>城市</label>
  <select name="city">
    <option value="">請選擇</option>
    <option>台北</option><option>台中</option>
    <option>台南</option><option>高雄</option>
  </select>
</fieldset>
<fieldset><legend>建議輸入</legend>
  <input list="browsers" name="browser">
  <datalist id="browsers">
    <option value="Chrome"><option value="Edge">
    <option value="Firefox"><option value="Safari">
  </datalist>
</fieldset>
<fieldset><legend>其他輸入</legend>
  <label>顏色</label><input type="color" name="color">
  <label>範圍</label><input type="range" name="range" min="0" max="100">
  <label>檔案上傳</label><input type="file" name="file">
  <label>留言</label><textarea name="message" rows="4"></textarea>
</fieldset>
<fieldset><legend>隱藏資料</legend>
  <input type="hidden" name="userid" value="12345">
</fieldset>
<fieldset><legend>狀態顯示</legend>
  <label>下載進度</label><progress value="70" max="100"></progress>
  <label>使用率</label><meter value="0.6"></meter>
</fieldset>
<br>
<button type="submit">送出</button>
<button type="reset">重設</button>
<button type="button">普通按鈕</button>
</form>
</div>
</body>
</html>
```

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

### 01-if.js — if 條件判斷（奇數 / 偶數）
```js
let num = 7;
if (num % 2 === 0) {
    console.log("偶數");
} else {
    console.log("奇數");
}
```

### 02-for.js — for 迴圈（1~10 總和）
```js
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log(sum);
```

### 03-while.js — while 迴圈（1 數到 5）
```js
let i = 1;
while (i <= 5) {
    console.log(i);
    i++;
}
```

### 04-function.js — 函式（Hello, John）
```js
function greet(name) {
    return "Hello, " + name;
}
console.log(greet("John"));
```

### 05-array.js — 陣列操作（push / for 遍歷）
```js
let fruits = ["apple", "banana", "orange"];
fruits.push("grape");
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}
```

### 06-object.js — 物件存取
```js
let person = {
    name: "Tom",
    age: 20
};
console.log(person.name);
console.log(person.age);
```

### 07-json.js — JSON 解析
```js
let jsonString = '{"name":"Amy","age":25}';
let obj = JSON.parse(jsonString);
console.log(obj.name);
```

### 08-gradepass.js — 函式 + if（及格判斷）
```js
function checkScore(score) {
    if (score >= 60) {
        return "及格";
    } else {
        return "不及格";
    }
}
console.log(checkScore(75));
```

### 09-maximum.js — 陣列找最大值
```js
let numbers = [3, 7, 2, 9, 5];
let max = numbers[0];
for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
        max = numbers[i];
    }
}
console.log("最大值:", max);
```

### 10-score.js — while + object（學生成績）
```js
let students = [
    { name: "A", score: 80 },
    { name: "B", score: 55 },
    { name: "C", score: 90 }
];
let i = 0;
while (i < students.length) {
    if (students[i].score >= 60) {
        console.log(students[i].name + " 及格");
    } else {
        console.log(students[i].name + " 不及格");
    }
    i++;
}
```

此目錄另有 README.md 記錄 ChatGPT 輔助學習的連結與測試輸出結果。

---

## 05 — Node.js 部落格系統

**一個使用 Node.js + Express 開發的仿 Threads 風格社群部落格。**

### 核心功能
- **文章 CRUD：** 發表、編輯、刪除文章（RESTful API）
- **會員系統：** 註冊 / 登入（密碼雜湊）
- **Threads 風格 UI：** 黑色主題、側邊欄導航、卡片式貼文、漸層頭像
- **三大專區：** 所有貼文（公共）、我的貼文（個人）、探索使用者

### 後端 server.js（主要 API 路由）
```js
const app = express();
const PORT = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 文章 CRUD
app.get('/api/posts', (req, res) => { /* 取得所有文章 */ });
app.get('/api/posts/:id', (req, res) => { /* 取得單篇文章 */ });
app.get('/api/posts/user/:username', (req, res) => { /* 取得特定使用者文章 */ });

app.post('/api/posts', (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        createdAt: new Date().toISOString()
    };
    // 存入 posts.json
});

app.put('/api/posts/:id', (req, res) => { /* 編輯文章 */ });
app.delete('/api/posts/:id', (req, res) => { /* 刪除文章 */ });

// 會員系統
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '請輸入帳號和密碼' });
    // 檢查重複、雜湊密碼、存入 users.json
});
app.post('/api/login', (req, res) => {
    // 驗證帳號密碼、回傳使用者資訊
});
app.get('/api/users', (req, res) => { /* 取得所有使用者 */ });
```

### 前端 index.html（Threads 風格結構）
```html
<body>
    <div class="layout">
        <div class="sidebar">
            <div class="logo">Threads</div>
            <a onclick="showSection('all')">所有貼文</a>
            <a onclick="showSection('personal')">我的貼文</a>
            <a onclick="showSection('users')">使用者</a>
        </div>
        <div class="main">
            <div id="authSection">登入區塊</div>
            <div id="createPostSection">發表貼文</div>
            <div id="allPostsSection">所有貼文</div>
            <div id="personalPostsSection">我的貼文</div>
            <div id="usersSection">使用者專區</div>
        </div>
    </div>
</body>
```

### 資料流程
```
發表貼文：使用者輸入 → createPost() → POST /api/posts → 寫入 posts.json → 重新渲染
登入流程：輸入帳密 → submitAuth() → POST /api/login → 密碼雜湊比對 → 存入 localStorage
```

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

### 1. Callback 基礎實作
```js
function mathTool(num1, num2, action) {
  return action(num1, num2);
}
console.log(mathTool(10, 5, function(a, b) { return a + b; }));
console.log(mathTool(10, 5, function(a, b) { return a - b; }));
```

### 2. IIFE（立即執行函數）
```js
(function () {
    var count = 100;
    console.log("Count is: " + count);
})();
```

### 3. 箭頭函數與陣列轉換
```js
const prices = [100, 200, 300, 400];
const discounted = prices.map(p => p * 0.8);
console.log(discounted);
```

### 4. 破壞性修改（傳址）
```js
function cleanData(arr) {
  arr.pop();
  arr.unshift("Start");
}
let myData = [1, 2, 3];
cleanData(myData);
console.log(myData); // ["Start", 1, 2]
```

### 5. Higher-Order Function
```js
const double = multiplier(2);
console.log(double(10)); // 20
const triple = multiplier(3);
console.log(triple(10)); // 30
```

### 6. Callback 篩選器
```js
function myFilter(arr, callback) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i])) result.push(arr[i]);
  }
  return result;
}
const nums = [1, 5, 8, 12];
const filtered = myFilter(nums, function(item) { return item > 7; });
console.log(filtered);
```

### 7. 箭頭函數處理物件
```js
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 }
];
const adults = users.filter(user => user.age >= 18);
console.log(adults);
```

### 8. 參數傳址陷阱
```
一、a.push(99) 會改到原陣列（.push() 修改內容不是重新指派）
二、b = [100] 不會影響 listB（重新指派指向新記憶體位置）
```

### 9. 延遲執行的 Callback
```js
setTimeout(() => {
  const arr = ["Task", "Completed"];
  console.log(arr.join(" "));
}, 2000);
```

### 10. 綜合應用：計算總價
```js
function calculateTotal(cart, discountFunc) {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) sum += cart[i];
  return discountFunc(sum);
}
const result = calculateTotal([100, 200, 300], function(total) { return total - 50; });
console.log(result); // 550
```

---

## 07 — JavaScript 實戰應用練習

**共 10+ 個練習，聚焦實用程式設計模式：**

### 1. 物件屬性存取
```js
let post = {
  id: 1,
  title: "Hello World",
  content: "Markdown content"
};
console.log(post.title);
console.log(post["title"]);
```

### 2. 物件解構賦值
```js
const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };
const { title, content } = req.body;
console.log(title);
console.log(content);
```

### 3. forEach & 模板字串
```js
const posts = [
  { id: 1, t: "A" },
  { id: 2, t: "B" }
];
let html = "";
posts.forEach(post => {
  html += `<div>${post.t}</div>`;
});
console.log(html);
```

### 4. 字典與動態參數
```js
let params = {};
params["id"] = 99;
console.log(params);
```

### 6. JSON 處理
```js
const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';
let obj = JSON.parse(jsonStr);
console.log(obj.tags[1]);
```

### 7. 模擬資料庫查詢
```js
function fakeGet(sql, params, callback) {
  const fakeRow = {
    id: 1,
    title: "掌握 JavaScript 函數",
    content: "這是一篇關於 Callback 的文章..."
  };
  callback(null, fakeRow);
}
fakeGet("SELECT * FROM posts WHERE id = ?", [1], (err, row) => {
  console.log("抓到的文章標題是：", row.title);
});
```

### 8. 模板字串邏輯運算
```js
const user = "Guest";
const html = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;
console.log(html);
```

### 9. 排序與切片
```js
const arr = [
  "Very long content here",
  "Another Very long content here",
  "3rd Very long content here"
];
const result = arr.map(str => str.slice(0, 10) + "...");
console.log(result);
```

### 10. Error-First Callback
```js
function checkAdmin(role, callback) {
    if (role !== "admin") return callback("Access Denied");
    callback(null, "Welcome");
}
checkAdmin("user", (err, result) => {
    if (err) console.log("錯誤：", err);
    else console.log("成功：", result);
});
checkAdmin("admin", (err, result) => {
    if (err) console.log("錯誤：", err);
    else console.log("成功：", result);
});
```

### 額外 — Error-First Callback 實作
```js
function fetchData(id, callback) {
    const fakeData = { id: id, status: "success" };
    callback(null, fakeData);
}
fetchData(101, (err, data) => {
    if (err) console.log("發生錯誤：" + err);
    else console.log("成功取得資料：", data);
});
```

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

### Prisma 資料庫模型
```prisma
model User {
  id        String  @id @default(cuid())
  username  String  @unique
  password  String
  title     String  @default("beginner")
  challengerUnlocked Boolean @default(false)
  godlyUnlocked      Boolean @default(false)
  scores    Score[]
  createdAt DateTime @default(now())
}

model Score {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  mode      String   // "normal" or "challenge"
  difficulty String?
  attempts  Int
  maxLevel  Int?
  won       Boolean  @default(true)
  timeTaken Int      @default(0)
  hintsUsed Int      @default(0)
  createdAt DateTime @default(now())
}
```

### 闖關模式公式（challenge.ts）
```ts
export function getRange(level: number): number {
  return 1000 + 255 * (level - 1);
}
export function getMaxAttempts(level: number, difficulty: string): number {
  const base = Math.ceil(Math.log2(getRange(level) + 1));
  const bonus = { easy: 5, medium: 3, hard: 0 };
  return base + (bonus[difficulty] ?? 3);
}
```

### 遊戲核心邏輯（guess route）
```ts
// 檢查猜測、計算溫度、驗證時限、更新遊戲狀態
// 終局時：檢查成就解鎖、寫入 Score DB、回傳 unlocks
```

### 成就系統（achievements.ts）
```ts
const achievements = [
  { id: "first_win",    name: "初次勝利",   condition: (s) => s.totalWins >= 1 },
  { id: "speed_demon",  name: "閃電快手",   condition: (s) => s.fastestTime <= 10 },
  { id: "marathon",     name: "馬拉松選手", condition: (s) => s.maxChallengeLevel >= 5 },
  { id: "hint_master",  name: "提示大師",   condition: (s) => s.noHintWins >= 1 },
  { id: "persistent",   name: "堅持不懈",   condition: (s) => s.totalGames >= 10 },
];
```

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
