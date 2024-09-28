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
class PrescriptionRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createNewPrescription(newPrescription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.prescription.create({
                    data: newPrescription,
                    select: {
                        id: true
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPrescriptionByPrescriptionId(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.prescription.findFirst({
                    where: {
                        id: prescriptionId,
                        is_active: true
                    },
                    select: {
                        id: true,
                        patient: {
                            select: {
                                id: true,
                                name: true,
                                credentialNumber: true,
                                phoneNum: true
                            }
                        },
                        medicineList: {
                            select: {
                                quantity: true,
                                instruction: true,
                                totalPrice: true,
                                medicine: {
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
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllPrescriptionByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.prescription.findMany({
                    where: {
                        patient: {
                            name: {
                                contains: username
                            }
                        },
                        is_active: true
                    },
                    select: {
                        id: true,
                        created_at: true,
                        patient: {
                            select: {
                                name: true
                            },
                        },
                        status: true
                    },
                    orderBy: [
                        {
                            status: "asc"
                        },
                        {
                            created_at: "asc"
                        }
                    ]
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllPrescription() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.prescription.findMany({
                    where: {
                        is_active: true
                    },
                    select: {
                        id: true,
                        created_at: true,
                        patient: {
                            select: {
                                name: true
                            },
                        },
                        status: true
                    },
                    orderBy: [
                        {
                            status: "asc"
                        },
                        {
                            created_at: "asc"
                        }
                    ]
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PrescriptionRepository;
