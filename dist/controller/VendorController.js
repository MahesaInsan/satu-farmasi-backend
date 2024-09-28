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
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
const VendorService_1 = __importDefault(require("../service/VendorService"));
const BaseController_1 = __importDefault(require("./BaseController"));
class VendorController extends BaseController_1.default {
    constructor() {
        super();
        this.vendorService = new VendorService_1.default();
    }
    getAllVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const name = req.query.label;
                const totalData = name
                    ? yield this.vendorService.getTotalVendorByName(name)
                    : (_a = yield this.vendorService.getTotalVendor()) !== null && _a !== void 0 ? _a : 0;
                const pagination = this.getPagination(totalData, req);
                const vendors = name
                    ? yield this.vendorService.getVendorByName(pagination.limit, pagination.startIndex, name)
                    : yield this.vendorService.getAllVendor(pagination.limit, pagination.startIndex);
                pagination.results = vendors;
                pagination.total = totalData;
                return res.status(200).send(new BaseResponse_1.default().ok(this.responseHelper.constructPaginationResponse(pagination)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    addVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const createdVendor = yield this.vendorService.addVendor(request);
                res.status(200).send(new BaseResponse_1.default().ok(createdVendor));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getVendorByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.query.label;
                const totalData = yield this.vendorService.getTotalVendorByName(name);
                const pagination = this.getPagination(totalData, req);
                const vendors = yield this.vendorService.getVendorByName(pagination.limit, pagination.startIndex, name);
                pagination.results = vendors;
                pagination.total = totalData;
                return res.status(200).send(new BaseResponse_1.default().ok(this.responseHelper.constructPaginationResponse(pagination)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getVendorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const vendor = yield this.vendorService.getVendorById(id);
                res.status(200).send(new BaseResponse_1.default().ok(vendor));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    editVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                data.id = id;
                const request = data;
                const editVendor = yield this.vendorService.editVendor(request);
                res.status(200).send(new BaseResponse_1.default().ok(editVendor));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    deleteVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                data.id = id;
                const request = data;
                const vendor = yield this.vendorService.deleteVendor(request);
                return res.status(200).send(new BaseResponse_1.default().ok(vendor));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = VendorController;
