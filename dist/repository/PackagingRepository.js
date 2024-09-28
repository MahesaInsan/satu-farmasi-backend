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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PackagingRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createPackaging(dataPackaging) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.packaging.create({
                    data: dataPackaging
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalPackagings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.count({ where: { is_active: true } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalPackagingsByLabel(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.count({
                    where: {
                        label: label,
                        is_active: true,
                        AND: [{
                                OR: [
                                    { label: { contains: label } },
                                    { label: { startsWith: label } },
                                    { label: { endsWith: label } }
                                ]
                            }]
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllPackagings(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.findMany({
                    where: { is_active: true },
                    skip: startIndex,
                    take: limit
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPackagingsDropdown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.findMany({
                    where: { is_active: true },
                    select: {
                        id: true,
                        label: true,
                        value: true
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPackagingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.findUnique({ where: { id: id, is_active: true } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPackagingByLabel(limit, startIndex, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.findMany({
                    skip: startIndex,
                    take: limit,
                    where: {
                        AND: [
                            {
                                OR: [
                                    { label: { contains: label } },
                                    { label: { startsWith: label } },
                                    { label: { endsWith: label } }
                                ]
                            },
                            { is_active: true }
                        ]
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    isPackagingExist(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packaging = yield this.prisma.packaging.findFirst({
                    where: {
                        label: label,
                        is_active: true
                    }
                });
                return packaging !== null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPackaging(dataPackaging) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.packaging.update({ where: { id: dataPackaging.id }, data: dataPackaging });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PackagingRepository;
