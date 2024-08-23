const express = require('express');
const path = require('path');
const app = express();

const hostname = 'localhost'
const port = 3000;

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// 라우팅 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'index.html'));
});

app.get('/fancam/:id', (req, res) => {
    // `fancam.html` 파일을 클라이언트에 전송
    res.sendFile(path.join(__dirname, 'template', 'fancam.html'));
});

app.get('/login', (req, res) => {
    // `fancam.html` 파일을 클라이언트에 전송
    res.sendFile(path.join(__dirname, 'template', 'login.html'));
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
