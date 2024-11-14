import { PrismaClient, ReceiveMedicine } from "@prisma/client";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";

export default class ReceiveMedicineRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async getTotalReceiveMedicines(): Promise<number> {
        try {
            return await this.prisma.receiveMedicine.count();
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalSearchReceiveMedicine(parameter: string): Promise<number> {
        try {
            return await this.prisma.receiveMedicine.count({
                where: {
                    AND: [
                        {
                            OR: [
                                { documentNumber: { contains: parameter } },
                                { batchCode: { contains: parameter } },
                                { 
                                    medicine: { 
                                        code: { contains: parameter },
                                        name: { contains: parameter }
                                    } 
                                },
                                { 
                                    vendor: {
                                        name: { contains: parameter },
                                        address: { contains: parameter }
                                    } 
                                }
                            ]
                        }
                    ]
                }
            });
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllReceiveMedicines(limit: number, startIndex: number): Promise<ReceiveMedicineVO[]> {
        try {
            return await this.prisma.receiveMedicine.findMany({
                orderBy: [
                    { created_at: 'desc' }
                ],
                skip: startIndex,
                take: limit,
                select: {
                    id: true,
                    documentNumber: true,
                    batchCode: true,
                    medicine: {
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
                        }
                    },
                    quantity: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            phoneNum: true,
                            address: true,
                            city: true
                        }
                    },
                    buyingPrice: true,
                    paymentMethod: true,
                    deadline: true,
                    isPaid: true,
                    is_active: true,
                    created_at: true,
                    updated_at: true,
                    reportId: true
                }
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async searchReceiveMedicine(limit: number, startIndex: number, parameter: string): Promise<ReceiveMedicineVO[]> {
        try {
            return await this.prisma.receiveMedicine.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { documentNumber: { contains: parameter } },
                                { batchCode: { contains: parameter } },
                                { 
                                    medicine: { 
                                        code: { contains: parameter },
                                        name: { contains: parameter }
                                    } 
                                },
                                { 
                                    vendor: {
                                        name: { contains: parameter },
                                        address: { contains: parameter }
                                    } 
                                }
                            ]
                        }
                    ]
                },
                orderBy: [
                    { created_at: 'desc' }
                ],
                skip: startIndex,
                take: limit,
                select: {
                    id: true,
                    documentNumber: true,
                    batchCode: true,
                    medicine: {
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
                        }
                    },
                    quantity: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            phoneNum: true,
                            address: true,
                            city: true
                        }
                    },
                    buyingPrice: true,
                    paymentMethod: true,
                    deadline: true,
                    isPaid: true,
                    is_active: true,
                    created_at: true,
                    updated_at: true,
                    reportId: true
                }
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async getLatestReceiveMedicineByMedicineId(medicineId: number): Promise<ReceiveMedicineVO | null> {
        try {
            return await this.prisma.receiveMedicine.findFirst({
                where: {
                    medicineId: medicineId
                },
                select: {
                    id: true,
                    documentNumber: true,
                    batchCode: true,
                    medicine: {
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
                        }
                    },
                    quantity: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            phoneNum: true,
                            address: true,
                            city: true
                        }
                    },
                    buyingPrice: true,
                    paymentMethod: true,
                    deadline: true,
                    isPaid: true,
                    is_active: true,
                    created_at: true,
                    updated_at: true,
                    reportId: true
                }
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async createReceiveMedicine(data: ReceiveMedicine) {
        try {
            return await this.prisma.receiveMedicine.create({
                data: data
            })
        } catch (error) {
            throw error as string;
        }
    }
}