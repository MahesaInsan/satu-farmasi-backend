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
const PharmacistService_1 = __importDefault(require("../service/PharmacistService"));
class PharmacistController {
    constructor() {
        this.pharmacistService = new PharmacistService_1.default();
        this.responseHelper = new ResponseHelper_1.default();
    }
    addPharmacist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                console.log("request: ", request);
                // TODO: change response to boolean
                const createdPharmacist = yield this.pharmacistService.addPharmacist(request);
                res.status(200).send(this.responseHelper.constructAddPharmacistResponse(createdPharmacist));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = PharmacistController;
