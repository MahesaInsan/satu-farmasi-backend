import Pharmacist from "../entity/Pharmacist"
import { PrismaClient } from "@prisma/client";

export default class PharmacistRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAllPharmacists(): Promise<Pharmacist []> {
        try {
            return this.prisma.pharmacist.findMany();
        } catch (error) {
            console.error('Error getting all pharmacist:', error);
            throw new Error('Failed to get pharmacist');
        }
    }

    public async getPharmacistById(id: number): Promise<Pharmacist | null> {
        try {
            return this.prisma.pharmacist.findUnique({ where: { id: id } });
        } catch (error) {
            console.error('Error getting pharmacist by id:', error);
            throw new Error('Failed to get pharmacist');
        }
    }
}