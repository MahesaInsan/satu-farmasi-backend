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
const DiagnoseRepository_1 = __importDefault(require("../repository/DiagnoseRepository"));
const PrescriptionService_1 = __importDefault(require("./PrescriptionService"));
const builder_pattern_1 = require("builder-pattern");
const PatientService_1 = __importDefault(require("./PatientService"));
const ValidationHelper_1 = __importDefault(require("./helper/ValidationHelper"));
class DiagnoseService {
    constructor() {
        this.diagnoseRepository = new DiagnoseRepository_1.default();
        this.prescriptionService = new PrescriptionService_1.default();
        this.patientService = new PatientService_1.default();
        this.validationHelper = new ValidationHelper_1.default();
    }
    createDiagnose(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validationHelper.validateDiagnoseRequest(request);
                if (request.prescription.patient.patientId === -1) {
                    return yield this.patientService.addNewPatient(request.prescription.patient)
                        .then((idVO) => __awaiter(this, void 0, void 0, function* () {
                        request.prescription.patient.patientId = idVO.id;
                        return yield this.prescriptionService.createNewPrescription(request.prescription)
                            .then((prescriptionId) => __awaiter(this, void 0, void 0, function* () {
                            const newDiagnose = this.constructDiagnose(request, prescriptionId);
                            return yield this.diagnoseRepository.createDiagnose(newDiagnose);
                        })).then(() => true);
                    }));
                }
                else {
                    return yield this.prescriptionService.createNewPrescription(request.prescription)
                        .then((prescriptionId) => __awaiter(this, void 0, void 0, function* () {
                        const newDiagnose = this.constructDiagnose(request, prescriptionId);
                        return yield this.diagnoseRepository.createDiagnose(newDiagnose);
                    })).then(() => true);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    constructDiagnose(request, prescriptionId) {
        return (0, builder_pattern_1.Builder)()
            .title(request.title)
            .description(request.description)
            .prescriptionId(prescriptionId)
            .doctorId(request.doctorId)
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .build();
    }
}
exports.default = DiagnoseService;
