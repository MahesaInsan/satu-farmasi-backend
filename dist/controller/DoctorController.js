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
const DoctorService_1 = __importDefault(require("../service/DoctorService"));
const express_validator_1 = require("express-validator");
class DoctorController {
    constructor() {
        this.doctorService = new DoctorService_1.default();
        this.responseHelper = new ResponseHelper_1.default();
    }
    addDoctor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (0, express_validator_1.validationResult)(req);
                if (!result.isEmpty())
                    return res.status(400).send(this.responseHelper.constructBadRequest(result.mapped()));
                const request = req.body;
                const createdDoctor = yield this.doctorService.addDoctor(request);
                res.status(200).send(this.responseHelper.constructAddDoctorResponse(createdDoctor));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = DoctorController;
