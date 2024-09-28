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
const GenericNameService_1 = __importDefault(require("../service/GenericNameService"));
const BaseController_1 = __importDefault(require("./BaseController"));
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
class GenericNameController extends BaseController_1.default {
    constructor() {
        super();
        this.genericNameService = new GenericNameService_1.default();
    }
    getAllGenericName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const label = req.query.label;
                const totalData = label
                    ? yield this.genericNameService.getTotalGenericNameByLabel(label)
                    : (_a = yield this.genericNameService.getTotalGenericName()) !== null && _a !== void 0 ? _a : 0;
                const pagination = this.getPagination(totalData, req);
                const genericNames = label
                    ? yield this.genericNameService.getGenericNameByLabel(pagination.limit, pagination.startIndex, label)
                    : yield this.genericNameService.getAllGenericName(pagination.limit, pagination.startIndex);
                pagination.results = genericNames;
                pagination.total = totalData;
                return res.status(200).send(new BaseResponse_1.default().ok(this.responseHelper.constructPaginationResponse(pagination)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getGenericNameDropdown(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genericName = yield this.genericNameService.getGenericNameDropdown();
                return res.status(200).send(new BaseResponse_1.default().ok(genericName));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    addGenericName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const createdGenericName = yield this.genericNameService.addGenericName(request);
                res.status(200).send(new BaseResponse_1.default().ok(createdGenericName));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getGenericNameById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const genericName = yield this.genericNameService.getGenericNameById(id);
                res.status(200).send(new BaseResponse_1.default().ok(genericName));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    editGenericName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                data.id = id;
                const request = data;
                const editedGenericName = yield this.genericNameService.editGenericName(request);
                res.status(200).send(new BaseResponse_1.default().ok(editedGenericName));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    deleteGenericName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const isDeleted = yield this.genericNameService.deleteGenericName(id);
                res.status(200).send(new BaseResponse_1.default().ok(isDeleted));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = GenericNameController;
