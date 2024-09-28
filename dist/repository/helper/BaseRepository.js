"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class BaseRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    get Prisma() {
        return this.prisma;
    }
}
exports.default = BaseRepository;
