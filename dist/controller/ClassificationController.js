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
const BaseController_1 = __importDefault(require("./BaseController"));
const ClassificationService_1 = __importDefault(require("../service/ClassificationService"));
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
class ClassificationController extends BaseController_1.default {
    constructor() {
        super();
        this.classificationService = new ClassificationService_1.default();
    }
    getClassification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const label = req.query.label;
                const totalClassification = label
                    ? yield this.classificationService.getTotalClassificationByLabel(label)
                    : yield this.classificationService.getTotalClassifications();
                const pagination = this.getPagination(totalClassification, req);
                const classifications = label
                    ? yield this.classificationService.getClassificationByLabel(pagination.limit, pagination.startIndex, label)
                    : yield this.classificationService.getAllClassifications(pagination.limit, pagination.startIndex);
                pagination.results = classifications;
                pagination.total = totalClassification;
                res.status(200).send(new BaseResponse_1.default().ok(this.responseHelper.constructPaginationResponse(pagination)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    addClassification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const result = yield this.classificationService.addClassification(request);
                res.status(200).send(new BaseResponse_1.default().ok(result));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    editClassification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.classificationService.editClassification(req.body);
                res.status(200).send(new BaseResponse_1.default().ok(result));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    deleteClassification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.classificationService.deleteClassification(req.body);
                res.status(200).send(new BaseResponse_1.default().ok(result));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = ClassificationController;
