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
}