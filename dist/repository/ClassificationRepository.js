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
class ClassificationRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    getClassificationByLabel(limit, startIndex, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.findMany({
                    where: {
                        label: label,
                        is_active: true,
                        AND: [{
                                label: { contains: label }
                            }],
                    },
                    skip: startIndex,
                    take: limit
                });
            }
            catch (error) {
                console.error("Error getting classification by label:", error);
                throw new Error("Failed to get classification by label");
            }
        });
    }
    getTotalClassificationByLabel(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.count({
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
                console.error("Error getting total classification by label:", error);
                throw new Error("Failed to get total classification by label");
            }
        });
    }
    getTotalClassifications() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.count({
                    where: { is_active: true }
                });
            }
            catch (error) {
                console.error("Error getting total classifications:", error);
                throw new Error("Failed to get total classifications");
            }
        });
    }
    getAllClassifications(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.findMany({
                    where: { is_active: true },
                    skip: startIndex,
                    take: limit
                });
            }
            catch (error) {
                console.error("Error getting all classifications:", error);
                throw new Error("Failed to get all classifications");
            }
        });
    }
    getClassificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.findUnique({ where: { id: id, is_active: true } });
            }
            catch (error) {
                console.error("Error getting classification by id:", error);
                throw new Error("Failed to get classification by id");
            }
        });
    }
    addClassification(classification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.create({
                    data: {
                        value: classification.value,
                        label: classification.label,
                        is_active: true,
                        created_at: new Date(),
                    }
                });
            }
            catch (error) {
                console.error("Error adding classification:", error);
                throw new Error("Failed to add classification");
            }
        });
    }
    editClassification(classification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.classification.update({
                    where: { id: Number(classification.id) },
                    data: {
                        value: classification.value,
                        label: classification.label,
                        is_active: classification.is_active,
                        updated_at: new Date(),
                    }
                });
            }
            catch (error) {
                console.error("Error deleting classification:", error);
                throw new Error("Failed to delete classification");
            }
        });
    }
}
exports.default = ClassificationRepository;
