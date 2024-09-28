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
const MedicineRepository_1 = __importDefault(require("../repository/MedicineRepository"));
const client_1 = require("@prisma/client");
const builder_pattern_1 = require("builder-pattern");
const GenericNameService_1 = __importDefault(require("./GenericNameService"));
const MedicineHasClassificationRepository_1 = __importDefault(require("../repository/MedicineHasClassificationRepository"));
class MedicineService {
    constructor() {
        this.medicineRepository = new MedicineRepository_1.default();
        this.genericNameService = new GenericNameService_1.default();
        this.medicineHasClassificationRepository = new MedicineHasClassificationRepository_1.default();
    }
    getAllMedicineList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mapMedicineDropdownList(yield this.medicineRepository.fetchMedicineList());
        });
    }
    getTotalMedicines() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.getTotalMedicines();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalSearchMedicines(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.getTotalSearchMedicines(parameter);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalMedicineByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.getTotalMedicineByCode(code);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllMedicines(startIndex, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.getMedicines(startIndex, limit);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMedicineById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.getMedicineById(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMedicineByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.getMedicineByCode(code);
            }
            catch (error) {
                throw error;
            }
        });
    }
    searchMedicines(startIndex, limit, parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.medicineRepository.searchMedicines(startIndex, limit, parameter);
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMedicine(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                request.code = yield this.generateMedicineCode(request.genericNameId);
                const medicine = this.constructMedicine(request);
                return yield this.medicineRepository.createMedicine(medicine)
                    .then((newMedicine) => __awaiter(this, void 0, void 0, function* () {
                    yield this.createNewMedicineHasClassification(request.classificationList, newMedicine.id);
                    return newMedicine;
                }));
            }
            catch (error) {
                throw error;
            }
        });
    }
    createNewMedicineHasClassification(classificationList, medicineId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMedicineHasClassification = classificationList
                    .map((classification) => {
                    return this.constructMedicineHasClassification(classification.classificationId, medicineId);
                });
                console.log("newMedicineClassification: ", newMedicineHasClassification);
                return yield this.medicineHasClassificationRepository.createMedicineHasClassification(newMedicineHasClassification);
            }
            catch (error) {
                throw error;
            }
        });
    }
    editMedicine(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldMedicine = yield this.getMedicineById(request.id);
                if (!oldMedicine)
                    throw new Error("Medicine not found");
                request.code = oldMedicine && oldMedicine.genericNameId === request.genericNameId
                    ? request.code
                    : yield this.generateMedicineCode(request.genericNameId);
                const medicine = this.constructEditMedicine(request);
                return yield this.medicineRepository.editMedicine(medicine)
                    .then((newMedicine) => __awaiter(this, void 0, void 0, function* () {
                    yield this.medicineHasClassificationRepository.deleteMedicineHasClassification(request.id);
                    yield this.createNewMedicineHasClassification(request.classificationList, request.id);
                    return newMedicine;
                }));
            }
            catch (error) {
                throw error;
            }
        });
    }
    addStock(id, currStock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const medicine = yield this.getMedicineById(id);
                if (!medicine)
                    throw new Error("Medicine not found");
                medicine.currStock += currStock;
                if (medicine.currStock > medicine.maxStock)
                    throw new Error("Max stock reached");
                return (yield this.medicineRepository.editMedicine(medicine)) != null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkStock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const medicine = yield this.getMedicineById(id);
                if (!medicine)
                    throw new Error("Medicine not found");
                const vo = { isReady: true, flag: -1 };
                if (medicine.currStock == medicine.minStock)
                    vo.flag = 0;
                else if (medicine.currStock > medicine.minStock && medicine.currStock <= medicine.maxStock)
                    vo.flag = 1;
                return vo;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMedicine(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const medicine = yield this.getMedicineById(id);
                if (!medicine)
                    throw new Error("Medicine not found");
                medicine.is_active = false;
                return yield this.medicineRepository.editMedicine(medicine);
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkExpiration(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const expiredDate: string = date.toString();
                return yield this.medicineRepository.checkExpiration(date);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // ganti jadi count all (jangan spesifik per generic name)
    generateMedicineCode(genericNameId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genericName = yield this.genericNameService.getGenericNameById(genericNameId);
                if (!genericName)
                    throw new Error("Generic name not found");
                console.log(genericName.value);
                const totalMedicine = yield this.getTotalMedicineByCode(genericName.value);
                const formatNumber = (totalMedicine + 1).toString().padStart(6, "0");
                console.log("medicine code: ", formatNumber);
                return `${genericName.value}-${formatNumber}`;
            }
            catch (error) {
                throw error;
            }
        });
    }
    constructMedicine(request) {
        return (0, builder_pattern_1.Builder)()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .code(request.code)
            .name(request.name)
            .genericNameId(request.genericNameId)
            .merk(request.merk)
            .description(request.description)
            .unitOfMeasure(client_1.UnitOfMeasure.MILLIGRAM)
            .price(request.price)
            .expiredDate(request.expiredDate)
            .packagingId(request.packagingId)
            .currStock(request.currStock)
            .minStock(request.minStock)
            .maxStock(request.maxStock)
            .sideEffect(request.sideEffect)
            .build();
    }
    constructEditMedicine(request) {
        return (0, builder_pattern_1.Builder)()
            .id(request.id)
            .code(request.code)
            .name(request.name)
            .merk(request.merk)
            .description(request.description)
            .unitOfMeasure(request.unitOfMeasure)
            .price(request.price)
            .expiredDate(request.expiredDate)
            .packagingId(request.packagingId)
            .genericNameId(request.genericNameId)
            .currStock(request.currStock)
            .minStock(request.minStock)
            .maxStock(request.maxStock)
            .sideEffect(request.sideEffect)
            .is_active(request.isActive)
            .created_at(request.createdAt)
            .updated_at(new Date())
            .build();
    }
    constructMedicineHasClassification(classificationId, medicineId) {
        return (0, builder_pattern_1.Builder)()
            .medicineId(medicineId)
            .classificationId(classificationId)
            .build();
    }
    decreaseMedicineStock(medicineId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.medicineRepository.decreaseStock(medicineId, quantity);
        });
    }
    increaseMedicineStock(medicineId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.medicineRepository.increaseStock(medicineId, quantity);
        });
    }
    getMedicineValidationList(medicineIdList) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.medicineRepository.getMedicineIdIn(medicineIdList);
        });
    }
    mapMedicineDropdownList(medicineList) {
        return __awaiter(this, void 0, void 0, function* () {
            return medicineList.reduce((medicineByMedicineId, medicine) => {
                medicineByMedicineId.set(medicine.id, medicine);
                return medicineByMedicineId;
            }, new Map);
        });
    }
}
exports.default = MedicineService;
