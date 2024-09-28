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
const PatientRepository_1 = __importDefault(require("../repository/PatientRepository"));
const builder_pattern_1 = require("builder-pattern");
class PatientService {
    constructor() {
        this.patientRepository = new PatientRepository_1.default();
    }
    addNewPatient(newPatientRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.patientRepository.findIfExist(newPatientRequest.credentialNum)
                    .then((exist) => __awaiter(this, void 0, void 0, function* () {
                    if (exist === null || exist === void 0 ? void 0 : exist.id) {
                        throw new Error("Patient already exist");
                    }
                    else {
                        const newPatient = (0, builder_pattern_1.Builder)()
                            .name(newPatientRequest.patientName)
                            .credentialNumber(newPatientRequest.credentialNum)
                            .phoneNum(newPatientRequest.phoneNum)
                            .is_active(true)
                            .created_at(new Date())
                            .updated_at(new Date())
                            .build();
                        return yield this.patientRepository.createPatient(newPatient);
                    }
                }));
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchPatient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mapPatientById(yield this.patientRepository.findPatientDropdownOptions());
            }
            catch (error) {
                throw error;
            }
        });
    }
    mapPatientById(patientList) {
        return __awaiter(this, void 0, void 0, function* () {
            return patientList.reduce((patientByPatientId, patient) => {
                patientByPatientId.set(patient.id, patient);
                return patientByPatientId;
            }, new Map);
        });
    }
}
exports.default = PatientService;
