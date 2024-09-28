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
const ResponseHelper_1 = __importDefault(require("./ResponseHelper/ResponseHelper"));
const PrescriptionService_1 = __importDefault(require("../service/PrescriptionService"));
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
class PrescriptionController {
    constructor() {
        this.prescriptionService = new PrescriptionService_1.default();
        this.responseHelper = new ResponseHelper_1.default();
    }
    getAllPrescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send(new BaseResponse_1.default().ok(yield this.prescriptionService.getAllPrescriptionList(req.params.username)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getPrescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("#getPrescriptionDetail with request:", req.params.id);
                res.status(200).send(new BaseResponse_1.default().ok(yield this.prescriptionService.getPrescription(parseInt(req.params.id))));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    addNewPrescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("#addNewPrescription with request:", req.body.data);
                const request = req.body.data;
                res.status(200).send(new BaseResponse_1.default().ok(yield this.prescriptionService.addNewPrescription(request)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    editPrescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body.data;
                console.log("#editPrescription with request:", request);
                res.status(200).send(new BaseResponse_1.default().ok(yield this.prescriptionService.editPrescription(request)));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = PrescriptionController;
