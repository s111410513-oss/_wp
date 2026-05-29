const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_DIR = __dirname;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

function loadPosts() {
    const file = path.join(DATA_DIR, 'posts.json');
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, 'utf-8');
    return data ? JSON.parse(data) : [];
}

function savePosts(posts) {
    fs.writeFileSync(path.join(DATA_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
}

function loadUsers() {
    const file = path.join(DATA_DIR, 'users.json');
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, 'utf-8');
    return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
    fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));
}

function hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

app.get('/api/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

app.get('/api/posts/user/:username', (req, res) => {
    const posts = loadPosts();
    const userPosts = posts.filter(p => p.author === req.params.username);
    res.json(userPosts);
});

app.get('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '文章不存在' });
    res.json(post);
});

app.post('/api/posts', (req, res) => {
    const posts = loadPosts();
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    savePosts(posts);
    res.json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: '文章不存在' });
    posts[index] = { ...posts[index], title: req.body.title, content: req.body.content, updatedAt: new Date().toISOString() };
    savePosts(posts);
    res.json(posts[index]);
});

app.delete('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: '文章不存在' });
    posts.splice(index, 1);
    savePosts(posts);
    res.json({ message: '刪除成功' });
});

app.get('/api/users', (req, res) => {
    const users = loadUsers();
    res.json(users.map(u => ({ id: u.id, username: u.username })));
});

app.post('/api/register', (req, res) => {
    const users = loadUsers();
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '請輸入帳號和密碼' });
    if (users.find(u => u.username === username)) return res.status(400).json({ error: '帳號已存在' });
    const newUser = { id: Date.now(), username, password: hash(password) };
    users.push(newUser);
    saveUsers(users);
    res.json({ message: '註冊成功', user: { id: newUser.id, username: newUser.username } });
});

app.post('/api/login', (req, res) => {
    const users = loadUsers();
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === hash(password));
    if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' });
    res.json({ message: '登入成功', user: { id: user.id, username: user.username } });
});

app.listen(PORT, () => {
    console.log(`網誌系統已啟動：http://localhost:${PORT}`);
});
