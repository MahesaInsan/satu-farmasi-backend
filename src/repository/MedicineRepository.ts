import {Medicine, PrismaClient} from "@prisma/client"
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import GetMedicineRequest from "../model/request/GetMedicineRequest";
import { Decimal } from "@prisma/client/runtime/library";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";

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

    public async getTotalMedicines(): Promise<number> {
        try {
            return this.prisma.medicine.count({ where: { is_active: true }})
        } catch (error) {
            console.error('Error counting medicineList: ', error);
            throw new Error('Failed to count medicineList');
        }
    }

    public async getTotalSearchMedicines(name: string, code: string, merk: string): Promise<number> {
        try {
            return this.prisma.medicine.count({
                where: {
                    AND: [
                        {
                            OR: [
                                { name: { contains: name } },
                                { code: { startsWith: code } },
                                { merk: { contains: merk } }
                            ]
                        },
                        {
                            is_active: true
                        }
                    ]
                } 
            })
        } catch (error) {
            console.error('Error coounting search medicineList: ', error);
            throw new Error('Failed to count medicineList');
        }
    }

    public async getTotalMedicineByCode(code: string): Promise<number> {
        try {
            return this.prisma.medicine.count({
                where: {
                    code: { startsWith: code }
                }
            })
        } catch (error) {
            console.error('Error counting medicineList: ', error);
            throw new Error('Failed to count medicineList');
        }
    }


    public async getMedicines(startIndex: number, limit: number): Promise<Medicine[]> {
        try {
            return this.prisma.medicine.findMany({
                where: { is_active: true },
                skip: startIndex,
                take: limit
            });
        } catch (error) {
            console.error('Error getting medicineList:', error);
            throw new Error('Failed to get medicineList');
        }
    }

    public async getMedicineById(id: number): Promise<Medicine | null> {
        try {
            return this.prisma.medicine.findFirst({ where: { id: id } });
        } catch (error) {
            console.error('Error getting medicine by id:', error);
            throw new Error('Failed to get medicine by id');
        }
    }

    public async getMedicineByCode(code: string): Promise<Medicine | null> {
        try {
            return this.prisma.medicine.findFirst({ where: { code: code } });
        } catch (error) {
            console.error('Error getting medicine by code:', error);
            throw new Error('Failed to get medicine by code');
        }
    }

    public async searchMedicines(startIndex: number, limit: number, parameter: GetMedicineRequest): Promise<Medicine[]> {
        try {
            return this.prisma.medicine.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { name: { contains: parameter.name } },
                                { code: { startsWith: parameter.code } },
                                { merk: { contains: parameter.merk } }
                            ]
                        },
                        {
                            is_active: true
                        }
                    ],
                } 
            });
        } catch (error) {
            console.error('Error getting medicineList:', error);
            throw new Error('Failed to get medicineList');
        }
    }

    public async createMedicine(dataMedicine: Medicine): Promise<MedicineDisplayVO> {
        try {
            const newMedicine = await this.prisma.medicine.create({ 
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

            return {
                ...newMedicine,
                isActive: newMedicine.is_active,
                createdAt: newMedicine.created_at,
                updatedAt: newMedicine.updated_at
            };
        } catch (error) {
            console.error('Error creating medicine: ', error);
            throw new Error('Failed to create medicine');
        }
    }

    public async editMedicine(dataMedicine: Medicine): Promise<Medicine> {
        try {
            return this.prisma.medicine.update({ where: { id: dataMedicine.id }, data: dataMedicine });
        } catch (error) {
            console.error('Error editing medicine: ', error);
            throw new Error('Failed to edit medicine');
        }
    }

    public async checkExpiration(date: Date): Promise<Medicine[]> {
        try {
            return this.prisma.medicine.findMany({
                where: {
                    expiredDate: date
                }
            })
        } catch (error) {
            console.error('Error checking expiration: ', error);
            throw new Error('Failed to check expiration');
        }
    }
}