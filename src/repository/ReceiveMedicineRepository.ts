import { PrismaClient, ReceiveMedicine } from "@prisma/client";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";

export default class ReceiveMedicineRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
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
                    vendorId: true,
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