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
const builder_pattern_1 = require("builder-pattern");
const PackagingRepository_1 = __importDefault(require("../repository/PackagingRepository"));
class PackagingService {
    constructor() {
        this.packagingRepository = new PackagingRepository_1.default();
    }
    createPackaging(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.isPackagingExist(request.label);
                const packaging = this.constructPackaging(request);
                return yield this.packagingRepository.createPackaging(packaging);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalPackagings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.packagingRepository.getTotalPackagings();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalPackagingsByLabel(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.packagingRepository.getTotalPackagingsByLabel(label);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllPackagings(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.packagingRepository.getAllPackagings(limit, startIndex);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPackagingsDropdown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.packagingRepository.getPackagingsDropdown();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPackagingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packaging = yield this.packagingRepository.getPackagingById(id);
                return packaging;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPackagingByLabel(limit, startIndex, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.packagingRepository.getPackagingByLabel(limit, startIndex, label);
            }
            catch (error) {
                throw error;
            }
        });
    }
    isPackagingExist(label) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield this.packagingRepository.isPackagingExist(label);
            if (isExist)
                throw new Error("Packaging is already exist");
        });
    }
    editPackaging(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.isPackagingExist(request.label);
                const packaging = this.constructEditPackaging(request);
                return yield this.packagingRepository.editPackaging(packaging);
            }
            catch (error) {
                throw error;
            }
        });
    }
    deletePackaging(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packaging = this.constructEditPackaging(request);
                return yield this.packagingRepository.editPackaging(packaging);
            }
            catch (error) {
                throw error;
            }
        });
    }
    constructPackaging(request) {
        return (0, builder_pattern_1.Builder)()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .label(request.label)
            .value(request.value)
            .build();
    }
    constructEditPackaging(request) {
        return (0, builder_pattern_1.Builder)()
            .id(request.id)
            .label(request.label)
            .value(request.value)
            .is_active(request.isActive)
            .created_at(request.createdAt)
            .updated_at(new Date())
            .build();
    }
}
exports.default = PackagingService;
