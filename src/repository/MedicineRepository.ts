import {PrismaClient} from "@prisma/client"
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import GenericName from "../entity/GenericName";

export default class MedicineRepository{
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    public async fetchMedicineList(): Promise<MedicineDropdownVO[]>{
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
        } catch (error) {
            console.error('Error getting medicineList:', error);
            throw new Error('Failed to get medicineList');
        }
    }
}