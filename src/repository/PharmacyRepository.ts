import BaseRepository from "./helper/BaseRepository";
import {Pharmacy} from "@prisma/client";

export default class PharmacyRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async getPharmacyInfo(): Promise<Pharmacy | null> {
        try {
            return await this.Prisma.pharmacy.findFirst();
        } catch (error) {
            console.error("Error getting pharmacy");
            throw new Error("Failed to get pharmacy by id");
        }
    }

    public async addPharmacyInfo(pharmacy: Pharmacy): Promise<Pharmacy> {
        try {
            pharmacy.created_at = new Date();
            return await this.Prisma.pharmacy.create({
                data: pharmacy
            });
        } catch (error) {
            console.error("Error adding pharmacy:", error);
            throw new Error("Failed to add pharmacy");
        }
    }

    public async editPharmacyInfo(pharmacy: Pharmacy): Promise<boolean> {
        try {
            await this.Prisma.pharmacy.updateMany({
                data: pharmacy
            });
            return true
        } catch (error) {
            console.error("Error editing pharmacy:", error);
            throw new Error("Failed to edit pharmacy");
        }
    }
}
