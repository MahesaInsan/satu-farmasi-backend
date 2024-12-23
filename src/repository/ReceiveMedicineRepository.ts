import { Prisma, PrismaClient, ReceiveMedicine } from "@prisma/client";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";
import BaseRepository from "./helper/BaseRepository";
import TotalOutcomeReceiveVO from "../model/VOs/TotalOutcomeReceiveVO";

export default class ReceiveMedicineRepository extends BaseRepository{

    constructor() {
        super();
    }

    public async getTotalReceiveMedicines(): Promise<number> {
        try {
            return await this.Prisma.receiveMedicine.count();
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalSearchReceiveMedicine(parameter: string): Promise<number> {
        try {
            return await this.Prisma.receiveMedicine.count({
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
            return await this.Prisma.receiveMedicine.findMany({
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
                            classifications: {
                                select: {
                                    classification: {
                                        select: {
                                            id: true,
                                            label: true,
                                            value: true,
                                        }
                                    }
                                }
                            }
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
                    isArrived: true,
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
            return await this.Prisma.receiveMedicine.findMany({
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
                            classifications: {
                                select: {
                                    classification: {
                                        select: {
                                            id: true,
                                            label: true,
                                            value: true,
                                        }
                                    }
                                }
                            }
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
                    isArrived: true,
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

    public async getReceiveMedicineByMedicineIdIn(medicineId: number[]): Promise<ReceiveMedicineVO[]> {
        try {
            return await this.Prisma.receiveMedicine.findMany({
                where: {
                    medicineId: {
                        in: medicineId
                    }
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
                            classifications: {
                                select: {
                                    classification: {
                                        select: {
                                            id: true,
                                            label: true,
                                            value: true,
                                        }
                                    }
                                }
                            }
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
                    isArrived: true,
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

    public async getReceiveMedicineById(receiveMedicineId: number): Promise<ReceiveMedicineVO | null> {
        try {
            return await this.Prisma.receiveMedicine.findFirst({
                where: {
                    id: receiveMedicineId
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
                            classifications: {
                                select: {
                                    classification: {
                                        select: {
                                            id: true,
                                            label: true,
                                            value: true,
                                        }
                                    }
                                }
                            }
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
                    isArrived: true,
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

    public async getTotalCostReceiveMedicineByDate(startDate: Date, lastDate: Date): Promise<TotalOutcomeReceiveVO[]> {
        try {
            return this.Prisma.$queryRaw
                `SELECT
                    SUM(a."buyingPrice") as "buyingPrice"
                FROM "public"."ReceiveMedicine" a
                WHERE a."created_at" >= ${startDate} AND a."created_at" <= ${lastDate}
                FETCH FIRST 1 ROWS ONLY;`
        } catch (error) {
            throw error as string;
        }
    }

    public async createReceiveMedicine(data: ReceiveMedicine) {
        try {
            return await this.Prisma.receiveMedicine.create({
                data: data
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async updateReceiveMedicine(data: ReceiveMedicine) {
        try {
            return await this.Prisma.receiveMedicine.update({
                where: {
                    id: data.id
                },
                data: data
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async deleteReceiveMedicine(receiveMedicineId: number) {
        try {
            return await this.Prisma.receiveMedicine.delete({
                where: {
                    id: receiveMedicineId
                }
            })
        } catch (error) {
            throw error as string;
        }
    }
}