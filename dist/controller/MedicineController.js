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
const MedicineService_1 = __importDefault(require("../service/MedicineService"));
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
const BaseController_1 = __importDefault(require("./BaseController"));
class MedicineController extends BaseController_1.default {
    constructor() {
        super();
        this.medicineService = new MedicineService_1.default();
    }
    getMedicineList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("#getMedicineDropdownOption");
                const medicineDropdownOption = yield this.medicineService.getAllMedicineList();
                res.status(200).send(Object.fromEntries(medicineDropdownOption));
            }
            catch (error) {
                res.status(400).send("error");
                throw new Error(error);
            }
        });
    }
    getMedicines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parameter = req.query.parameter;
                const totalMedicine = parameter
                    ? yield this.medicineService.getTotalSearchMedicines(parameter)
                    : yield this.medicineService.getTotalMedicines();
                const pagination = this.getPagination(totalMedicine, req);
                const medicines = parameter
                    ? yield this.medicineService.searchMedicines(pagination.startIndex, pagination.limit, parameter)
                    : yield this.medicineService.getAllMedicines(pagination.startIndex, pagination.limit);
                pagination.results = medicines;
                pagination.total = totalMedicine;
                return res.status(200).send(new BaseResponse_1.default().ok(this.responseHelper.constructPaginationResponse(pagination), "Succeed fetch medicines"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][getMedicines] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    createMedicine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const medicine = yield this.medicineService.createMedicine(request);
                return res.status(200).send(new BaseResponse_1.default().ok("Succeed create medicine"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][createMedicine] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    editMedicine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const medicine = yield this.medicineService.editMedicine(request);
                return res.status(200).send(new BaseResponse_1.default().ok(medicine, "Succeed edit medicine"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][editMedicine] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    addStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                yield this.medicineService.addStock(request.id, request.currStock);
                return res.status(200).send(new BaseResponse_1.default().ok("Succeed add stock"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][addStock] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    checkStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const result = yield this.medicineService.checkStock(request.id);
                return result.flag == 1
                    ? res.status(200).send(new BaseResponse_1.default().ok("Stock is ok"))
                    : res.status(200).send(new BaseResponse_1.default().ok("Medicine should be restocked"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][checkStock] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    deleteMedicine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const medicine = yield this.medicineService.deleteMedicine(request.id);
                return res.status(200).send(new BaseResponse_1.default().ok(medicine, "Succeed delete medicine"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][deleteMedicine] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
    checkExpiration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const medicine = yield this.medicineService.checkExpiration(request.expiredDate);
                return res.status(200).send(new BaseResponse_1.default().ok(medicine, "Succeed check expiration"));
            }
            catch (error) {
                console.log("[src][controller][MedicineController][checkExpiration] ", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return res.status(400).send(new BaseResponse_1.default().badRequest(errorMessage));
            }
        });
    }
}
exports.default = MedicineController;
