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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class MedicineHasClassificationRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createMedicineHasClassification(medicineHasClassificationList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicineHasClassification.createMany({ data: medicineHasClassificationList });
            }
            catch (error) {
                console.error('Error creating medicine has classification: ', error);
                throw new Error('Failed to create medicine has classification');
            }
        });
    }
    deleteMedicineHasClassification(medicineId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.medicineHasClassification.deleteMany({
                    where: {
                        medicineId: medicineId
                    }
                });
            }
            catch (error) {
                console.error('Error deleting medicine has classification: ', error);
                throw new Error('Failed to delete medicine has classification');
            }
        });
    }
}
exports.default = MedicineHasClassificationRepository;
