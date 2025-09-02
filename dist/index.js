"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //ESM語法
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const prisma_1 = require("./prisma");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
//test
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, cors_1.default)());
// JSON body parser
app.use(express_1.default.json());
//建立訊息
app.post('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author, content } = req.body;
    //console.log('start...');
    if (typeof author !== 'string' || typeof content !== 'string') {
        //if (!author || !content)
        return res.status(400).json({
            error: 'author and content must be strings'
        });
    }
    const newMessage = yield prisma_1.prisma.message.create({
        data: { author, content },
    });
    // 新訊息送出後,透過socket廣播
    io.emit('new-message', newMessage);
    res.status(201).json(newMessage); //201是create狀態碼
}));
//取得所有訊息
app.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma_1.prisma.message.findMany({
        orderBy: { createdAt: 'asc' }, //asc升冪,舊的在前,新的在後, desc降冪
    });
    res.json(messages);
}));
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
//# sourceMappingURL=index.js.map