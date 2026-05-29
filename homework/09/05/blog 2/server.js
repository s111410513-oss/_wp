const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

function loadPosts() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
}

function savePosts(posts) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
}

app.get('/api/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ error: '文章不存在' });
    }
    res.json(post);
});

app.post('/api/posts', (req, res) => {
    const posts = loadPosts();
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    savePosts(posts);
    res.json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: '文章不存在' });
    }
    posts[index] = {
        ...posts[index],
        title: req.body.title,
        content: req.body.content,
        updatedAt: new Date().toISOString()
    };
    savePosts(posts);
    res.json(posts[index]);
});

app.delete('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: '文章不存在' });
    }
    posts.splice(index, 1);
    savePosts(posts);
    res.json({ message: '刪除成功' });
});

app.listen(PORT, () => {
    console.log(`網誌系統已啟動：http://localhost:${PORT}`);
});
