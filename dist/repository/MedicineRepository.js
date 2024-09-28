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
class MedicineRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    fetchMedicineList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findMany({
                    where: {
                        is_active: true,
                        currStock: {
                            gt: 0
                        },
                        expiredDate: {
                            gt: new Date(Date.now() + 7)
                        }
                    },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        merk: true,
                        currStock: true,
                        minStock: true,
                        price: true,
                        classifications: {
                            select: {
                                classification: {
                                    select: {
                                        label: true
                                    }
                                }
                            }
                        },
                        packaging: {
                            select: {
                                label: true
                            }
                        },
                        genericName: {
                            select: {
                                label: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('Error getting medicineList:', error);
                throw new Error('Failed to get medicineList');
            }
        });
    }
    decreaseStock(medicineId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.medicine.update({
                    where: {
                        id: medicineId
                    },
                    data: {
                        currStock: {
                            decrement: quantity
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    increaseStock(medicineId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.medicine.update({
                    where: {
                        id: medicineId
                    },
                    data: {
                        currStock: {
                            increment: quantity
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMedicineIdIn(medicineId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findMany({
                    where: {
                        id: {
                            in: medicineId
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalMedicines() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.count({ where: { is_active: true } });
            }
            catch (error) {
                console.error('Error counting medicineList: ', error);
                throw new Error('Failed to count medicineList');
            }
        });
    }
    getTotalSearchMedicines(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.count({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { name: { contains: parameter } },
                                    { code: { startsWith: parameter } },
                                    { merk: { contains: parameter } }
                                ]
                            },
                            {
                                is_active: true
                            }
                        ]
                    }
                });
            }
            catch (error) {
                console.error('Error coounting search medicineList: ', error);
                throw new Error('Failed to count medicineList');
            }
        });
    }
    getTotalMedicineByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.count({
                    where: {
                        code: { contains: code }
                    }
                });
            }
            catch (error) {
                console.error('Error counting medicineList: ', error);
                throw new Error('Failed to count medicineList');
            }
        });
    }
    getMedicines(startIndex, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findMany({
                    where: { is_active: true },
                    skip: startIndex,
                    take: limit,
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        merk: true,
                        description: true,
                        unitOfMeasure: true,
                        price: true,
                        expiredDate: true,
                        currStock: true,
                        minStock: true,
                        maxStock: true,
                        sideEffect: true,
                        is_active: true,
                        created_at: true,
                        updated_at: true,
                        genericName: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        packaging: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        classifications: {
                            select: {
                                classification: {
                                    select: {
                                        id: true,
                                        label: true,
                                        value: true
                                    }
                                }
                            }
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error getting medicineList:', error);
                throw new Error('Failed to get medicineList');
            }
        });
    }
    getMedicineById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findFirst({ where: { id: id } });
            }
            catch (error) {
                console.error('Error getting medicine by id:', error);
                throw new Error('Failed to get medicine by id');
            }
        });
    }
    getMedicineByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findFirst({
                    where: {
                        code: code,
                        is_active: true
                    },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        merk: true,
                        description: true,
                        unitOfMeasure: true,
                        price: true,
                        expiredDate: true,
                        currStock: true,
                        minStock: true,
                        maxStock: true,
                        sideEffect: true,
                        is_active: true,
                        created_at: true,
                        updated_at: true,
                        genericName: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        packaging: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        classifications: {
                            select: {
                                classification: {
                                    select: {
                                        id: true,
                                        label: true,
                                        value: true
                                    }
                                }
                            }
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error getting medicine by code:', error);
                throw new Error('Failed to get medicine by code');
            }
        });
    }
    searchMedicines(startIndex, limit, parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findMany({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { name: { contains: parameter } },
                                    { code: { startsWith: parameter } },
                                    { merk: { contains: parameter } },
                                    { description: { contains: parameter } },
                                    { sideEffect: { contains: parameter } }
                                ]
                            },
                            {
                                is_active: true
                            }
                        ],
                    },
                    skip: startIndex,
                    take: limit,
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        merk: true,
                        description: true,
                        unitOfMeasure: true,
                        price: true,
                        expiredDate: true,
                        currStock: true,
                        minStock: true,
                        maxStock: true,
                        sideEffect: true,
                        is_active: true,
                        created_at: true,
                        updated_at: true,
                        genericName: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        packaging: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        classifications: {
                            select: {
                                classification: {
                                    select: {
                                        id: true,
                                        label: true,
                                        value: true
                                    }
                                }
                            }
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error getting medicineList:', error);
                throw new Error('Failed to get medicineList');
            }
        });
    }
    createMedicine(dataMedicine) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMedicine = yield this.prisma.medicine.create({
                    data: dataMedicine,
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        merk: true,
                        description: true,
                        unitOfMeasure: true,
                        price: true,
                        expiredDate: true,
                        currStock: true,
                        minStock: true,
                        maxStock: true,
                        sideEffect: true,
                        is_active: true,
                        created_at: true,
                        updated_at: true,
                        classifications: {
                            select: {
                                classification: {
                                    select: {
                                        id: true,
                                        label: true,
                                        value: true
                                    }
                                }
                            }
                        },
                        packaging: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        genericName: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        }
                    }
                });
                return newMedicine;
            }
            catch (error) {
                console.error('Error creating medicine: ', error);
                throw new Error('Failed to create medicine');
            }
        });
    }
    editMedicine(dataMedicine) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMedicine = yield this.prisma.medicine.update({
                    where: { id: dataMedicine.id },
                    data: dataMedicine,
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        merk: true,
                        description: true,
                        unitOfMeasure: true,
                        price: true,
                        expiredDate: true,
                        currStock: true,
                        minStock: true,
                        maxStock: true,
                        sideEffect: true,
                        is_active: true,
                        created_at: true,
                        updated_at: true,
                        classifications: {
                            select: {
                                classification: {
                                    select: {
                                        id: true,
                                        label: true,
                                        value: true
                                    }
                                }
                            }
                        },
                        packaging: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        },
                        genericName: {
                            select: {
                                id: true,
                                label: true,
                                value: true
                            }
                        }
                    }
                });
                return newMedicine;
            }
            catch (error) {
                console.error('Error editing medicine: ', error);
                throw new Error('Failed to edit medicine');
            }
        });
    }
    checkExpiration(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.medicine.findMany({
                    where: {
                        expiredDate: date
                    }
                });
            }
            catch (error) {
                console.error('Error checking expiration: ', error);
                throw new Error('Failed to check expiration');
            }
        });
    }
}
exports.default = MedicineRepository;
