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
class GenericNameRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    getTotalGenericName() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.count({
                    where: {
                        is_active: true,
                    }
                });
            }
            catch (error) {
                console.error("Error getting total generic name:", error);
                throw new Error("Failed to get total generic name");
            }
        });
    }
    getTotalGenericNameByLabel(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.count({
                    where: {
                        AND: [
                            {
                                OR: [
                                    {
                                        label: {
                                            contains: label,
                                        },
                                    },
                                    {
                                        label: {
                                            startsWith: label,
                                        },
                                    },
                                    {
                                        label: {
                                            endsWith: label,
                                        },
                                    },
                                ],
                            },
                            {
                                is_active: true,
                            },
                        ],
                    },
                });
            }
            catch (error) {
                console.error("Error getting total generic name by label:", error);
                throw new Error("Failed to get total generic name by label");
            }
        });
    }
    getAllGenericName(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.findMany({
                    where: { is_active: true },
                    skip: startIndex,
                    take: limit,
                });
            }
            catch (error) {
                console.error("Error getting all generic name:", error);
                throw new Error("Failed to get all generic name");
            }
        });
    }
    getGenericNameDropdown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.findMany({
                    where: { is_active: true },
                    select: {
                        id: true,
                        label: true,
                        value: true
                    }
                });
            }
            catch (error) {
                console.error("Error getting generic name dropdown:", error);
                throw new Error("Failed to get generic name dropdown");
            }
        });
    }
    addGenericName(genericName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.create({ data: genericName });
            }
            catch (error) {
                console.error("Error adding generci name:", error);
                throw new Error("Failed to add generic name");
            }
        });
    }
    editGenericName(genericName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                genericName.id = Number(genericName.id);
                yield this.Prisma.genericName.update({
                    where: { id: genericName.id },
                    data: genericName,
                });
                return true;
            }
            catch (error) {
                console.error("Error updating generic name:", error);
                throw new Error("Failed to edit generic name");
            }
        });
    }
    getGenericNameById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.findUnique({
                    where: { id: id },
                });
            }
            catch (error) {
                console.error("Error getting generic name by id:", error);
                throw new Error("Failed to get generic name by id");
            }
        });
    }
    getGenericNameByLabel(limit, startIndex, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.genericName.findMany({
                    where: {
                        AND: [
                            {
                                OR: [
                                    {
                                        label: {
                                            contains: label,
                                        },
                                    },
                                    {
                                        label: {
                                            startsWith: label,
                                        },
                                    },
                                    {
                                        label: {
                                            endsWith: label,
                                        },
                                    },
                                ],
                            },
                            {
                                is_active: true,
                            },
                        ],
                    },
                    skip: startIndex,
                    take: limit,
                });
            }
            catch (error) {
                console.error("Error getting generic name by label:", error);
                throw new Error("Failed to get generic name by label");
            }
        });
    }
    deleteGenericName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.Prisma.genericName.delete({ where: { id: id } });
                return true;
            }
            catch (error) {
                console.error("Error deleting generic name:", error);
                throw new Error("Failed to delete generic name");
            }
        });
    }
}
exports.default = GenericNameRepository;
