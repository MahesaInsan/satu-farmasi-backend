import { Packaging, PrismaClient } from "@prisma/client";

export default class PackagingRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createPackaging(dataPackaging: Packaging): Promise<Packaging> {
        try {
            return this.prisma.packaging.create({
                data: dataPackaging
            })
        } catch (error) {
            throw error as string;
        }
    }

    async getAllPackagings(): Promise<Packaging[]> {
        try {
            return this.prisma.packaging.findMany();
        } catch (error) {
            throw error as string;
        }
    }

    async getPackagingById(id: number): Promise<Packaging | null> {
        try {
            return this.prisma.packaging.findUnique({ where: { id: id } })
        } catch (error) {
            throw error as string;
        }
    }
}