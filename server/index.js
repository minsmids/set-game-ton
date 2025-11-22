const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const crypto = require('crypto');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.post('/api/auth/telegram', (req, res) => {
    const { initData } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
        return res.status(500).json({ error: 'Bot token not configured' });
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
        dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash === hash) {
        const userData = JSON.parse(urlParams.get('user'));
        res.json({ success: true, user: userData });
    } else {
        res.status(401).json({ error: 'Invalid hash' });
    }
});

const GameManager = require('./gameManager');

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

const gameManager = new GameManager(io);

io.on('connection', (socket) => {
    gameManager.handleConnection(socket);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
