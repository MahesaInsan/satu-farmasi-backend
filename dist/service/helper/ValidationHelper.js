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
const DoctorService_1 = __importDefault(require("../DoctorService"));
const MedicineService_1 = __importDefault(require("../MedicineService"));
class ValidationHelper {
    constructor() {
        this.doctorService = new DoctorService_1.default();
        this.medicineService = new MedicineService_1.default();
    }
    validateDiagnoseRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.doctorService.getDoctorById(request.doctorId))) {
                throw new Error("Doctor does not exist");
            }
            if (!request.title) {
                throw new Error("Title must not be empty");
            }
            if (!request.description) {
                throw new Error("Description must not be empty");
            }
            yield this.validatePrescriptionRequest(request.prescription);
        });
    }
    validatePrescriptionRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const medicineListValidation = yield this.medicineService.getMedicineValidationList(request.medicineList
                .map((medicine) => medicine.medicineId));
            let indexByMedicineId = new Map();
            for (let i = 0; i < medicineListValidation.length; i++) {
                indexByMedicineId.set(medicineListValidation[i].id, i);
            }
            request.medicineList.forEach((medicineRequest) => {
                if (!indexByMedicineId.has(medicineRequest.medicineId)) {
                    throw new Error("Medicine is not found");
                }
                if (medicineRequest.quantity < 1) {
                    throw new Error("Quantity must be greater than 0");
                }
                const medicineValidation = medicineListValidation[indexByMedicineId.get(medicineRequest.medicineId)];
                if (medicineValidation.currStock - medicineRequest.quantity < medicineValidation.minStock) {
                    throw new Error("Insufficient medicine stock");
                }
            });
        });
    }
}
exports.default = ValidationHelper;
