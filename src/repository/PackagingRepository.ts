import { Packaging, PrismaClient } from "@prisma/client";

export default class PackagingRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createPackaging(dataPackaging: Packaging): Promise<Packaging> {
        try {
            return this.prisma.packaging.create({
                data: dataPackaging
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalPackagings(): Promise<number> {
        try {
            return await this.prisma.packaging.count();
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllPackagings(limit: number, startIndex: number): Promise<Packaging[]> {
        try {
            return this.prisma.packaging.findMany({ 
                where: { is_active: true },
                skip: startIndex,
                take: limit
            });
        } catch (error) {
            throw error as string;
        }
    }

    public async getPackagingById(id: number): Promise<Packaging | null> {
        try {
            return this.prisma.packaging.findUnique({ where: { id: id, is_active: true } })
        } catch (error) {
            throw error as string;
        }
    }

    public async getPackagingByLabel(label: string): Promise<Packaging | null> {
        try {
            return this.prisma.packaging.findFirst({ where: { label: label, is_active: true } })
        } catch (error) {
            throw error as string;
        }
    }

    public async isPackagingExist(label: string): Promise<Boolean> {
        try {
            const packaging: Packaging | null = await this.getPackagingByLabel(label);
            return packaging !== null;
        } catch (error) {
            throw error as string;
        }
    }

    public async editPackaging(dataPackaging: Packaging): Promise<Packaging> {
        try {
            return this.prisma.packaging.update({ where: { id: dataPackaging.id }, data: dataPackaging });
        } catch (error) {
            throw error as string;
        }
    }
}