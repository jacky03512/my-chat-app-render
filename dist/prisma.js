"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
//建立PrismaClient實例並將其導出,讓給其他檔案使用
exports.prisma = new client_1.PrismaClient();
//可改寫
//const prisma = new PrismaClient();
//export default prisma;
//# sourceMappingURL=prisma.js.map