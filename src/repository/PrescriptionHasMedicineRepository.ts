import {PrescriptionHasMedicine, PrismaClient} from "@prisma/client"

export default class PrescriptionHasMedicineRepository{
    private readonly prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createPrescriptionHasMedicine(prescriptionHasMedicineList: PrescriptionHasMedicine[]){
        try {
            await this.prisma.prescriptionHasMedicine.createMany({
                data: prescriptionHasMedicineList,
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getPrescriptionHasMedicine(prescriptionId: number) {
        try {
            return await this.prisma.prescriptionHasMedicine.findMany({
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
            return await this.prisma.prescriptionHasMedicine.groupBy({
                by: ["medicineId"],
                _sum: {
                    quantity: true
                },
                orderBy: {
                    _sum: {
                        quantity: "desc",
                    }
                },
                take: 3,
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

    public async deleteWherePrescriptionIdAndInId(prescriptionId: number, idList: number[]) {
        try {
            return await this.prisma.prescriptionHasMedicine.deleteMany({
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
            await this.prisma.prescriptionHasMedicine.update({
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