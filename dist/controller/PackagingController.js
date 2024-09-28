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
const PackagingService_1 = __importDefault(require("../service/PackagingService"));
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
const BaseController_1 = __importDefault(require("./BaseController"));
class PackagingController extends BaseController_1.default {
    constructor() {
        super();
        this.packagingService = new PackagingService_1.default();
    }
    createPackaging(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const packaging = yield this.packagingService.createPackaging(request);
                return res.status(200).send(new BaseResponse_1.default().ok(packaging));
            }
            catch (error) {
                console.log("[src][controller][PackagingController][createPackaging] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    getPackaging(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const label = req.query.label;
                const totalPackaging = label
                    ? yield this.packagingService.getTotalPackagingsByLabel(label)
                    : yield this.packagingService.getTotalPackagings();
                const pagination = this.getPagination(totalPackaging, req);
                const packagings = label
                    ? yield this.packagingService.getPackagingByLabel(pagination.limit, pagination.startIndex, label)
                    : yield this.packagingService.getAllPackagings(pagination.limit, pagination.startIndex);
                pagination.results = packagings;
                pagination.total = totalPackaging;
                return res.status(200).send(new BaseResponse_1.default().ok(this.responseHelper.constructPaginationResponse(pagination)));
            }
            catch (error) {
                console.log("[src][controller][PackagingController][getPackaging] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    getPackagingsDropdown(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packagings = yield this.packagingService.getPackagingsDropdown();
                return res.status(200).send(new BaseResponse_1.default().ok(packagings));
            }
            catch (error) {
                console.log("[src][controller][PackagingController][getPackagingsDropdown] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    editPackaging(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packaging = yield this.packagingService.editPackaging(req.body);
                return res.status(200).send(new BaseResponse_1.default().ok(packaging));
            }
            catch (error) {
                console.log("[src][controller][PackagingController][editPackaging] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    deletePackaging(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packaging = yield this.packagingService.deletePackaging(req.body);
                return res.status(200).send(new BaseResponse_1.default().ok(packaging));
            }
            catch (error) {
                console.log("[src][controller][PackagingController][deletePackaging] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
}
exports.default = PackagingController;
