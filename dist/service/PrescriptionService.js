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
const PrescriptionRepository_1 = __importDefault(require("../repository/PrescriptionRepository"));
const client_1 = require("@prisma/client");
const builder_pattern_1 = require("builder-pattern");
const PrescriptionHasMedicineRepository_1 = __importDefault(require("../repository/PrescriptionHasMedicineRepository"));
const MedicineService_1 = __importDefault(require("./MedicineService"));
const PatientService_1 = __importDefault(require("./PatientService"));
const ValidationHelper_1 = __importDefault(require("./helper/ValidationHelper"));
class PrescriptionService {
    constructor() {
        this.prescriptionRepository = new PrescriptionRepository_1.default();
        this.prescriptionHasMedicineRepository = new PrescriptionHasMedicineRepository_1.default();
        this.medicineService = new MedicineService_1.default();
        this.patientService = new PatientService_1.default();
        this.validationHelper = new ValidationHelper_1.default();
    }
    addNewPrescription(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (request.patient.patientId === -1) {
                    return yield this.patientService.addNewPatient(request.patient)
                        .then((idVO) => __awaiter(this, void 0, void 0, function* () {
                        request.patient.patientId = idVO.id;
                        return yield this.createNewPrescription(request);
                    }));
                }
                else {
                    return yield this.createNewPrescription(request);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPrescription(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.prescriptionRepository.getPrescriptionByPrescriptionId(prescriptionId);
                if (result === null) {
                    new Error("Not Found");
                }
                else
                    return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createNewPrescription(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPrescription = (0, builder_pattern_1.Builder)()
                    .patientId(request.patient.patientId)
                    .status(client_1.Status.UNPROCESSED)
                    .is_active(true)
                    .created_at(new Date())
                    .updated_at(new Date())
                    .build();
                return yield this.prescriptionRepository.createNewPrescription(newPrescription)
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    yield this.createNewPrescriptionHasMedicine(request.medicineList, result.id);
                    return result.id;
                }));
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPrescription(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tuple;
                yield this.validationHelper.validatePrescriptionRequest(request);
                tuple = yield this.mapOldPrescriptionHasMedicine(yield this.findPrescriptionMedicine(request.prescriptionId));
                return yield this.compareAndUpdatePrescriptionHasMedicine(tuple[0], request.medicineList, request.prescriptionId, tuple[1]).then(result => true);
            }
            catch (error) {
                throw error;
            }
        });
    }
    findPrescriptionMedicine(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prescriptionHasMedicineRepository.getPrescriptionHasMedicine(prescriptionId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    compareAndUpdatePrescriptionHasMedicine(prescriptionHasMedicineByMedicineId, newPrescriptionHasMedicine, prescriptionId, prescriptionHasMedicineById) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPrescriptionHasMedicineUpdate = [];
            newPrescriptionHasMedicine.forEach(newPrescription => {
                if (prescriptionHasMedicineByMedicineId.has(newPrescription.medicineId)) {
                    const updatedPrescriptionHasMedicine = prescriptionHasMedicineByMedicineId.get(newPrescription.medicineId);
                    this.updateMedicineStock(updatedPrescriptionHasMedicine.quantity, newPrescription.quantity, updatedPrescriptionHasMedicine.medicineId);
                    this.prescriptionHasMedicineRepository.updateWhereId(this.constructPrescriptionHasMedicine(newPrescription, prescriptionId), updatedPrescriptionHasMedicine.id);
                    prescriptionHasMedicineById.delete(updatedPrescriptionHasMedicine.id);
                }
                else {
                    this.medicineService.decreaseMedicineStock(newPrescription.medicineId, newPrescription.quantity);
                    newPrescriptionHasMedicineUpdate.push(this.constructPrescriptionHasMedicine(newPrescription, prescriptionId));
                }
            });
            prescriptionHasMedicineById.forEach(deletedPrescriptionHasMedicine => {
                console.log(deletedPrescriptionHasMedicine);
                this.updateMedicineStock(deletedPrescriptionHasMedicine.quantity, 0, deletedPrescriptionHasMedicine.medicineId);
            });
            yield this.prescriptionHasMedicineRepository.deleteWherePrescriptionIdAndInId(prescriptionId, Array.from(prescriptionHasMedicineById.keys()));
            if (newPrescriptionHasMedicineUpdate.length > 0) {
                this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescriptionHasMedicineUpdate);
            }
        });
    }
    updateMedicineStock(oldPrescriptionQuantity, newPrescriptionQuantity, medicineId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPrescriptionQuantity > oldPrescriptionQuantity) {
                yield this.medicineService.decreaseMedicineStock(medicineId, newPrescriptionQuantity - oldPrescriptionQuantity);
            }
            else if (oldPrescriptionQuantity > newPrescriptionQuantity) {
                yield this.medicineService.increaseMedicineStock(medicineId, oldPrescriptionQuantity - newPrescriptionQuantity);
            }
        });
    }
    mapOldPrescriptionHasMedicine(oldPrescriptionHasMedicine) {
        return __awaiter(this, void 0, void 0, function* () {
            let prescriptionHasMedicineByMedicineId = new Map;
            let prescriptionHasMedicineById = new Map;
            oldPrescriptionHasMedicine.forEach(prescriptionHasMedicine => {
                prescriptionHasMedicineById.set(prescriptionHasMedicine.id, prescriptionHasMedicine);
                prescriptionHasMedicineByMedicineId.set(prescriptionHasMedicine.medicineId, prescriptionHasMedicine);
            });
            return [prescriptionHasMedicineByMedicineId, prescriptionHasMedicineById];
        });
    }
    createNewPrescriptionHasMedicine(medicineList, prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPrescribeMedicineList = medicineList
                    .map((prescribedMedicineRequest) => {
                    this.medicineService.decreaseMedicineStock(prescribedMedicineRequest.medicineId, prescribedMedicineRequest.quantity);
                    return this.constructPrescriptionHasMedicine(prescribedMedicineRequest, prescriptionId);
                });
                console.log("prescribedMedicineList: ", newPrescribeMedicineList);
                return yield this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescribeMedicineList);
            }
            catch (error) {
                throw error;
            }
        });
    }
    constructPrescriptionHasMedicine(prescribeMedicineRequest, prescriptionId) {
        return (0, builder_pattern_1.Builder)()
            .prescriptionId(prescriptionId)
            .medicineId(prescribeMedicineRequest.medicineId)
            .quantity(prescribeMedicineRequest.quantity)
            .instruction(prescribeMedicineRequest.instruction)
            .totalPrice(new client_1.Prisma.Decimal(Number(prescribeMedicineRequest.price) * prescribeMedicineRequest.quantity))
            .build();
    }
    getAllPrescriptionList(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (username) {
                    return yield this.prescriptionRepository.getAllPrescription().then(prescriptions => {
                        return prescriptions.map(prescription => {
                            return this.constructPrescriptionSummaryVO(prescription);
                        });
                    });
                }
                else {
                    return yield this.prescriptionRepository.getAllPrescription().then(prescriptions => {
                        return prescriptions.map(prescription => {
                            return this.constructPrescriptionSummaryVO(prescription);
                        });
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    constructPrescriptionSummaryVO(prescription) {
        return (0, builder_pattern_1.Builder)()
            .prescriptionId(prescription.id)
            .timestamps(prescription.created_at)
            .patientName(prescription.patient.name)
            .status(prescription.status)
            .build();
    }
}
exports.default = PrescriptionService;
