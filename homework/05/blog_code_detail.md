# Blog 專案程式碼詳細解說

---

## 一、專案架構

```
blog/
├── server.js          # Express 後端伺服器
├── public/
│   └── index.html     # 前端頁面（HTML + CSS + JS）
├── posts.json         # 文章資料庫
├── users.json         # 使用者資料庫
├── package.json       # Node.js 專案配置
└── .gitignore         # Git 忽略清單
```

---

## 二、後端伺服器 (server.js)

### 2.1 初始化與中介軟體

```javascript
const app = express();
const PORT = 3001;
```

- **Express**：Node.js 最流行的 Web 框架
- **PORT 3001**：伺服器監聽的連接埠

```javascript
app.use(cors());                              # 允許跨域請求
app.use(bodyParser.json());                   # 解析 JSON 請求體
app.use(express.static('public'));           # 提供靜態檔案服務
```

### 2.2 資料讀寫函數

#### loadPosts() / savePosts()
```javascript
function loadPosts() {
    const file = path.join(DATA_DIR, 'posts.json');
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, 'utf-8');
    return data ? JSON.parse(data) : [];
}
```
- 從 `posts.json` 讀取文章資料
- 若檔案不存在，回傳空陣列
- 使用同步方式讀取檔案

#### loadUsers() / saveUsers()
- 與上述類似，讀寫 `users.json`

#### hash()
```javascript
function hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}
```
- **簡單的雜湊函數**：將密碼字串轉換為數字雜湊
- 這不是安全的加密，生產環境應使用 bcrypt
- 雜湊原理：將每個字元的 ASCII 碼與現有雜湊值進行運算

### 2.3 API 路由

#### 文章相關 API

| 方法 | 路徑 | 功能 |
|------|------|------|
| GET | `/api/posts` | 取得所有文章 |
| GET | `/api/posts/:id` | 取得單篇文章 |
| GET | `/api/posts/user/:username` | 取得特定使用者的文章 |
| POST | `/api/posts` | 發表新文章 |
| PUT | `/api/posts/:id` | 編輯文章 |
| DELETE | `/api/posts/:id` | 刪除文章 |

**發表文章 (POST /api/posts)**：
```javascript
app.post('/api/posts', (req, res) => {
    const posts = loadPosts();
    const newPost = {
        id: Date.now(),                    # 使用時間戳記作為 ID
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        createdAt: new Date().toISOString() # ISO 格式時間
    };
    posts.push(newPost);
    savePosts(posts);
    res.json(newPost);
});
```

#### 使用者相關 API

| 方法 | 路徑 | 功能 |
|------|------|------|
| GET | `/api/users` | 取得所有使用者列表 |
| POST | `/api/register` | 註冊新使用者 |
| POST | `/api/login` | 使用者登入 |

**註冊 (POST /api/register)**：
```javascript
app.post('/api/register', (req, res) => {
    const users = loadUsers();
    const { username, password } = req.body;
    
    # 驗證輸入
    if (!username || !password) return res.status(400).json({ error: '請輸入帳號和密碼' });
    
    # 檢查帳號是否已存在
    if (users.find(u => u.username === username)) return res.status(400).json({ error: '帳號已存在' });
    
    # 建立新使用者
    const newUser = { 
        id: Date.now(), 
        username, 
        password: hash(password)  # 密碼雜湊儲存
    };
    users.push(newUser);
    saveUsers(users);
    res.json({ message: '註冊成功', user: { id: newUser.id, username: newUser.username } });
});
```

**登入 (POST /api/login)**：
```javascript
app.post('/api/login', (req, res) => {
    const users = loadUsers();
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === hash(password));
    if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' });
    res.json({ message: '登入成功', user: { id: user.id, username: user.username } });
});
```

---

## 三、前端頁面 (index.html)

### 3.1 HTML 結構

```html
<body>
    <div class="layout">
        <div class="sidebar">         <!-- 側邊欄導航 -->
            <div class="logo">Threads</div>
            <a onclick="showSection('all')">所有貼文</a>
            <a onclick="showSection('personal')">我的貼文</a>
            <a onclick="showSection('users')">使用者</a>
        </div>
        
        <div class="main">            <!-- 主內容區 -->
            <div id="authSection">    <!-- 登入區塊 -->
            <div id="createPostSection"> <!-- 發表貼文 -->
            <div id="allPostsSection">  <!-- 所有貼文 -->
            <div id="personalPostsSection"> <!-- 我的貼文 -->
            <div id="usersSection">    <!-- 使用者專區 -->
        </div>
    </div>
    
    <div class="modal" id="authModal"> <!-- 登入/註冊 Modal -->
</body>
```

### 3.2 CSS 樣式設計

#### CSS 變數 (：root)
```css
:root {
    --bg-primary: #000000;      /* 黑色背景 */
    --bg-secondary: #1a1a1a;    /* 深灰卡片 */
    --bg-tertiary: #2a2a2a;     /* 輸入框背景 */
    --text-primary: #ffffff;    /* 白色文字 */
    --text-secondary: #a0a0a0;  /* 灰色文字 */
    --accent: #0095f6;          /* 藍色強調色 */
    --border: #333333;           /* 邊框顏色 */
}
```

- 使用 CSS 變數方便統一管理主題顏色
- 黑色主題參考 Threads/ Twitter X 設計

#### 側邊欄 (Sidebar)
```css
.sidebar {
    width: 250px;
    position: fixed;
    height: 100vh;
    border-right: 1px solid var(--border);
}
```
- 固定寬度 250px
- 固定在左側，佔滿視窗高度

#### 貼文卡片 (Post Card)
```css
.post-card {
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid var(--border);
}
```
- 圓角 16px 的卡片設計
- 響應式間距

#### 頭像 (Avatar)
```css
.avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```
- 正圓形設計
- 漸層背景

### 3.3 JavaScript 邏輯

#### 狀態變數
```javascript
let currentUser = null;     # 目前登入的使用者
let currentSection = 'all';# 目前顯示的區塊
let authMode = 'login';    # 登入/註冊模式
```

#### 頭像顏色生成
```javascript
function getAvatarColor(username) {
    const colors = ['#667eea', '#764ba2', ...];
    let hash = 0;
    for (let i = 0; i < username.length; i++) 
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}
```
- 根據使用者名稱生成一致的顏色
- 使用雜湊演算法確保相同名稱產生相同顏色

#### XSS 防護 (escapeHtml)
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```
- 防止跨站腳本攻擊 (XSS)
- 將 HTML 特殊字元轉義

#### 資料載入
```javascript
async function loadPosts() {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    renderAllPosts(posts);
    
    if (currentUser) {
        const userRes = await fetch(`/api/posts/user/${currentUser.username}`);
        const userPosts = await userRes.json();
        renderPersonalPosts(userPosts);
    }
}
```
- 使用 Fetch API 呼叫後端
- 非同步 await 語法
- 載入所有貼文和個人貼文

#### 貼文渲染
```javascript
function renderAllPosts(posts) {
    container.innerHTML = posts.reverse().map(post => createPostCard(post)).join('');
}
```
- `.reverse()` 讓最新的貼文顯示在前面
- 使用模板字串動態生成 HTML

#### 使用者認證
```javascript
async function submitAuth() {
    const res = await fetch(`/api/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (!res.ok) {
        errorMsg.textContent = data.error;
        return;
    }
    
    currentUser = data.user;
    localStorage.setItem('user', JSON.stringify(currentUser)); # 記住登入狀態
}
```
- 根據 authMode 決定呼叫 `/api/login` 或 `/api/register`
- 登入成功後存入 localStorage，刷新頁面後仍保持登入

#### 區塊切換
```javascript
function showSection(section) {
    # 隱藏所有區塊
    document.getElementById('allPostsSection').style.display = 'none';
    document.getElementById('personalPostsSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    
    # 顯示指定區塊
    if (section === 'all') document.getElementById('allPostsSection').style.display = 'block';
    else if (section === 'personal') document.getElementById('personalPostsSection').style.display = 'block';
    else if (section === 'users') document.getElementById('usersSection').style.display = 'block';
}
```

---

## 四、資料流程

### 4.1 發表貼文流程
```
1. 使用者輸入標題和內容，點擊「發布」按鈕
2. createPost() 呼叫 POST /api/posts
3. server.js 建立新文章物件（含 ID、時間戳記、作者）
4. 寫入 posts.json
5. 前端呼叫 loadPosts() 重新載入並渲染
```

### 4.2 登入流程
```
1. 使用者輸入帳號密碼，點擊「確認」
2. submitAuth() 呼叫 POST /api/login
3. server.js 雜湊密碼並比對
4. 比對成功回傳使用者資訊
5. 前端存入 localStorage，更新 UI
```

### 4.3 查看使用者貼文流程
```
1. 使用者點擊使用者卡片
2. viewUserPosts(username) 呼叫 GET /api/posts/user/:username
3. server.js 篩選該作者的貼文
4. 前端渲染該使用者的貼文列表
```

---

## 五、安全性說明

### 5.1 已實作
- **XSS 防護**：使用 escapeHtml() 轉義輸出
- **密碼雜湊**：使用簡單雜湊儲存密碼（非明文）

### 5.2 需要改進
- **密碼加密**：應使用 bcrypt 而非自訂雜湊
- **SESSION 管理**：目前使用 localStorage，應使用 JWT 或 SESSION
- **輸入驗證**：增加更多伺服器端驗證
- **CORS 配置**：應設定允許的來源網域

---

## 六、啟動方式

```bash
# 安裝依賴
cd blog
npm install

# 啟動伺服器
npm start

# 訪問網站
http://localhost:3001
```

---

## 七、技術重點總結

| 技術領域 | 應用內容 |
|----------|----------|
| 後端框架 | Express.js |
| 前端框架 | 原生 HTML/CSS/JS |
| 資料儲存 | JSON 檔案 |
| API 設計 | RESTful API |
| 認證機制 | localStorage + 簡單雜湊 |
| CSS 設計 | CSS 變數、Flexbox、Grid |
| 安全防護 | XSS 轉義 |
