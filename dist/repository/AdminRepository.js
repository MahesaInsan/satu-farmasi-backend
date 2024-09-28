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
const BaseRepository_1 = __importDefault(require("./helper/BaseRepository"));
class AdminRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    emailIsExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.Prisma.admin.findUnique({
                    where: { email: email },
                    select: { email: true }
                });
                return admin !== null;
            }
            catch (error) {
                console.error('Error checking email:', error);
                throw new Error('Failed to check email');
            }
        });
    }
    addAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(admin);
                return yield this.Prisma.admin.create({ data: admin });
            }
            catch (error) {
                console.error("Error adding admin:", error);
                throw new Error("Failed to add admin");
            }
        });
    }
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.admin.findUnique({ where: { email: email }, });
            }
            catch (error) {
                console.error("Error getting admin by email:", error);
                throw new Error("Failed to get admin");
            }
        });
    }
    getAllAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.admin.findMany();
            }
            catch (error) {
                console.error("Error getting all admins:", error);
                throw new Error("Failed to add admin");
            }
        });
    }
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.admin.findUnique({ where: { id: id } });
            }
            catch (error) {
                console.error('Error getting admin by id:', error);
                throw new Error('Failed to get admin');
            }
        });
    }
    getAdminByNik(nik) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.admin.findUnique({ where: { nik: nik } });
            }
            catch (error) {
                console.error('Error getting admin by nik:', error);
                throw new Error('Failed to get admin');
            }
        });
    }
    editAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("admin : ", admin);
                return yield this.Prisma.admin.update({ where: { nik: admin.nik }, data: admin });
            }
            catch (error) {
                console.error('Error editing admin:', error);
                throw new Error('Failed to edit admin');
            }
        });
    }
}
exports.default = AdminRepository;
