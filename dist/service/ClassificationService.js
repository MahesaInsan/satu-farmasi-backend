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
const ClassificationRepository_1 = __importDefault(require("../repository/ClassificationRepository"));
const ClassificationHelper_1 = __importDefault(require("./helper/ClassificationHelper"));
class ClassificationService {
    constructor() {
        this.classificationRepository = new ClassificationRepository_1.default();
        this.classificationHelper = new ClassificationHelper_1.default();
    }
    getTotalClassifications() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.classificationRepository.getTotalClassifications();
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getTotalClassificationByLabel(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.classificationRepository.getTotalClassificationByLabel(label);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getAllClassifications(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.classificationRepository.getAllClassifications(limit, startIndex);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getClassificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.classificationRepository.getClassificationById(id);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    addClassification(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classification = this.classificationHelper.createClassification(request);
                return yield this.classificationRepository.addClassification(classification);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getClassificationByLabel(limit, startIndex, label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.classificationRepository.getClassificationByLabel(limit, startIndex, label);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    editClassification(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classification = this.classificationHelper.editClassification(request);
                return yield this.classificationRepository.editClassification(classification);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    deleteClassification(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classification = this.classificationHelper.editClassification(request);
                return yield this.classificationRepository.editClassification(classification);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = ClassificationService;
