import express from 'express' //ESM語法
import { createServer } from 'http'
import { Server } from 'socket.io'
import { prisma } from './prisma'
import cors from 'cors'

import path from 'path'

const app = express();
const port = 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

//test
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());

// JSON body parser
app.use(express.json());



//建立訊息
app.post('/messages', async (req, res) => {
    const { author, content } = req.body;
    //console.log('start...');
    if (typeof author !== 'string' || typeof content !== 'string'){
    //if (!author || !content)
        return res.status(400).json({
            error: 'author and content must be strings'
        });
    }
    const newMessage = await prisma.message.create({
        data: {author, content},
    })    

    // 新訊息送出後,透過socket廣播
    io.emit('new-message', newMessage);

    res.status(201).json(newMessage); //201是create狀態碼
});

//取得所有訊息
app.get('/messages', async (req, res) => {
    const messages = await prisma.message.findMany({
        orderBy: {createdAt: 'asc'}, //asc升冪,舊的在前,新的在後, desc降冪
    });
    res.json(messages);
});

// webSocket: 當用戶連線
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user discnnected');
    });
});

//啟動伺服器
httpServer.listen(port, () => {
    //程式碼寫的是 單引號 ' '，而不是 反引號 `，所以 JavaScript 不會做字串插值，${port} 只是普通字串
    //console.log('Server is running on http://localhost:${port}');
    console.log(`Server is running on http://localhost:${port}`);
});