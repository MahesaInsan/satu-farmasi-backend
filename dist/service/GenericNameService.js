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
const CreateMedicineHelper_1 = __importDefault(require("./helper/CreateMedicineHelper"));
const GenericNameRepository_1 = __importDefault(require("../repository/GenericNameRepository"));
const builder_pattern_1 = require("builder-pattern");
const EditGenericNameHelper_1 = __importDefault(require("./helper/EditGenericNameHelper"));
class GenericNameService {
    constructor() {
        this.genericNameRepository = new GenericNameRepository_1.default();
        this.createMedicineHelper = new CreateMedicineHelper_1.default();
        this.editGenericNameHelper = new EditGenericNameHelper_1.default();
    }
    getTotalGenericName() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.getTotalGenericName();
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getTotalGenericNameByLabel(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.getTotalGenericNameByLabel(label);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getAllGenericName(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.getAllGenericName(limit, startIndex);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getGenericNameDropdown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.getGenericNameDropdown();
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getGenericNameById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.getGenericNameById(id);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getGenericNameByLabel(limit, startIndex, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.getGenericNameByLabel(limit, startIndex, label);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    addGenericName(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genericName = this.createMedicineHelper.createGenericName(request);
                return yield this.genericNameRepository.addGenericName((0, builder_pattern_1.Builder)(genericName).label(request.label).value(request.value).build());
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    editGenericName(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genericName = this.editGenericNameHelper.editGenericName(request);
                return yield this.genericNameRepository.editGenericName((0, builder_pattern_1.Builder)(genericName).id(request.id).label(request.label).value(request.value).build());
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    deleteGenericName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.genericNameRepository.deleteGenericName(id);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = GenericNameService;
