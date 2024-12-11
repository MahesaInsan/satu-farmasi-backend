import { MedicineHasClassification, PrismaClient } from "@prisma/client";
import BaseRepository from "./helper/BaseRepository";

export default class MedicineHasClassificationRepository extends BaseRepository{

    constructor() {
        super();
    }

    public async createMedicineHasClassification(medicineHasClassificationList: MedicineHasClassification[]) {
        try {
            return this.Prisma.medicineHasClassification.createMany({ data: medicineHasClassificationList });
        } catch (error) {
            console.error('Error creating medicine has classification: ', error);
            throw new Error('Failed to create medicine has classification');
        }
    }

    public async deleteMedicineHasClassification(medicineId: number) {
        try {
            return await this.Prisma.medicineHasClassification.deleteMany({
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