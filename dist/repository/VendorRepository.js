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
class VendorRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    getAllVendors(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.findMany({
                    where: { is_active: true },
                    skip: startIndex,
                    take: limit,
                });
            }
            catch (error) {
                console.error("Error getting all vendors:", error);
                throw new Error("Failed to get all vendors");
            }
        });
    }
    getTotalVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.count({
                    where: { is_active: true },
                });
            }
            catch (error) {
                console.log("Error getting total vendors:", error);
                throw new Error("Failed to get total vendors");
            }
        });
    }
    getTotalVendorsByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.count({
                    where: {
                        AND: [
                            {
                                name: {
                                    contains: name
                                }
                            },
                            {
                                is_active: true
                            }
                        ]
                    }
                });
            }
            catch (error) {
                console.error("Error getting total vendors by name:", error);
                throw new Error("Failed to get total vendors by name");
            }
        });
    }
    getVendorByName(limit, startIndex, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.findMany({
                    where: {
                        AND: [
                            {
                                name: {
                                    contains: name
                                }
                            },
                            {
                                is_active: true
                            }
                        ],
                    },
                    skip: startIndex,
                    take: limit,
                });
            }
            catch (error) {
                console.error("Error getting vendor by name:", error);
                throw new Error("Failed to get vendor by name");
            }
        });
    }
    getVendorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.findUnique({
                    where: { id: id },
                });
            }
            catch (error) {
                console.error("Error getting vendor by id:", error);
                throw new Error("Failed to get vendor by id");
            }
        });
    }
    addVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.create({ data: vendor });
            }
            catch (error) {
                console.error("Error adding vendor:", error);
                throw new Error("Failed to add vendor");
            }
        });
    }
    editVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.vendor.update({
                    where: { id: vendor.id },
                    data: vendor,
                });
            }
            catch (error) {
                console.error("Error editing vendor:", error);
                throw new Error("Failed to edit vendor");
            }
        });
    }
}
exports.default = VendorRepository;
