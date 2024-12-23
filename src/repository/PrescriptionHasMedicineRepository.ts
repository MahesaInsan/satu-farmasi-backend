import {PrescriptionHasMedicine, PrismaClient} from "@prisma/client"
import BaseRepository from "./helper/BaseRepository";

export default class PrescriptionHasMedicineRepository extends BaseRepository{

    constructor() {
        super();
    }

    public async createPrescriptionHasMedicine(prescriptionHasMedicineList: PrescriptionHasMedicine[]){
        try {
            await this.Prisma.prescriptionHasMedicine.createMany({
                data: prescriptionHasMedicineList,
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getPrescriptionHasMedicine(prescriptionId: number) {
        try {
            return await this.Prisma.prescriptionHasMedicine.findMany({
                where: {
                    prescriptionId: prescriptionId
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getMostSalesMedicineByPrescription(startDate: Date, lastDate: Date) {
        try {
            return await this.Prisma.prescriptionHasMedicine.groupBy({
                by: ["medicineId"],
                _sum: {
                    quantity: true
                },
                orderBy: {
                    _sum: {
                        quantity: "desc",
                    }
                },
                where: {
                    AND: [
                        {
                            draft: false
                        },
                        {
                            prescription: {
                                created_at: {
                                    gte: startDate,
                                    lte: lastDate,
                                }
                            }
                        }
                    ]
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getSoldCountMedicineByCode(medicineCodeList: string[], startDate: Date, lastDate: Date) {
        try {
            console.log(medicineCodeList, startDate, lastDate)
            return await this.Prisma.prescriptionHasMedicine.groupBy({
                by: ["medicineCode"],
                _sum: {
                    quantity: true,
                },
                where: {
                    AND: [
                        {
                          medicineCode: {
                              in: medicineCodeList
                          }
                        },
                        {
                            draft: false
                        },
                        {
                            prescription: {
                                created_at: {
                                    gte: startDate,
                                    lte: lastDate,
                                }
                            }
                        }
                    ]
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async deleteWherePrescriptionIdAndInId(prescriptionId: number, idList: number[]) {
        try {
            return await this.Prisma.prescriptionHasMedicine.deleteMany({
                where: {
                    prescriptionId: prescriptionId,
                    id: {
                        in: idList
                    }
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async updateWhereId(prescriptionHasMedicine: PrescriptionHasMedicine, id: number) {
        try {
            await this.Prisma.prescriptionHasMedicine.update({
                where: {
                    id: id
                },
                data: prescriptionHasMedicine
            })
        } catch (error) {
            throw error as string
        }
    }
}