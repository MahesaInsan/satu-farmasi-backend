import { MedicineHasClassification, PrismaClient } from "@prisma/client";

export default class MedicineHasClassificationRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createMedicineHasClassification(medicineHasClassificationList: MedicineHasClassification[]) {
        try {
            return this.prisma.medicineHasClassification.createMany({ data: medicineHasClassificationList });
        } catch (error) {
            console.error('Error creating medicine has classification: ', error);
            throw new Error('Failed to create medicine has classification');
        }
    }

    public async deleteMedicineHasClassification(medicineId: number) {
        try {
            return await this.prisma.medicineHasClassification.deleteMany({
                where: {
                    medicineId: medicineId
                }
            })
        } catch (error) {
            console.error('Error deleting medicine has classification: ', error);
            throw new Error('Failed to delete medicine has classification');
        }
    }
}