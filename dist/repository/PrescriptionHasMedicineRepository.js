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
class PrescriptionHasMedicineRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createPrescriptionHasMedicine(prescriptionHasMedicineList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.prescriptionHasMedicine.createMany({
                    data: prescriptionHasMedicineList,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPrescriptionHasMedicine(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.prescriptionHasMedicine.findMany({
                    where: {
                        prescriptionId: prescriptionId
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteWherePrescriptionIdAndInId(prescriptionId, idList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.prescriptionHasMedicine.deleteMany({
                    where: {
                        prescriptionId: prescriptionId,
                        id: {
                            in: idList
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateWhereId(prescriptionHasMedicine, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.prescriptionHasMedicine.update({
                    where: {
                        id: id
                    },
                    data: prescriptionHasMedicine
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PrescriptionHasMedicineRepository;
