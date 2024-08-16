import Vendor from "../entity/Vendor";
import BaseRepository from "./helper/BaseRepository";

export default class VendorRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async getAllVendors(limit: number, startIndex: number): Promise<Vendor[]> {
        try {
            return await this.Prisma.vendor.findMany({
                where: { is_active: true },
                skip: startIndex,
                take: limit,
            });
        } catch (error) {
            console.error("Error getting all vendors:", error);
            throw new Error("Failed to get all vendors");
        }
    }

    public async getTotalVendors(): Promise<number> {
        try {
            return await this.Prisma.vendor.count({
                where: { is_active: true },
            });
        } catch (error) {
            console.log("Error getting total vendors:", error);
            throw new Error("Failed to get total vendors");
        }
    }

    public async getTotalVendorsByName(name: string): Promise<number> {
        try {
            return await this.Prisma.vendor.count({
                where: {
                    AND: [
                        {
                            name: {
                                contains: name
                            }
                        },
                        {
                            is_active: true
                        }
                    ]
                }
            });
        } catch (error) {
            console.error("Error getting total vendors by name:", error);
            throw new Error("Failed to get total vendors by name");
        }
    }

    public async getVendorByName(limit: number, startIndex: number, name: string): Promise<Vendor[]> {
        try {
            return await this.Prisma.vendor.findMany({
                where: {
                    AND: [
                        {
                            name: {
                                contains: name
                            }
                        },
                        {
                            is_active: true
                        }
                    ],
                },
                skip: startIndex,
                take: limit,
            });
        } catch (error) {
            console.error("Error getting vendor by name:", error);
            throw new Error("Failed to get vendor by name");
        }
    }

    public async getVendorById(id: number): Promise<Vendor | null> {
        try {
            return await this.Prisma.vendor.findUnique({
                where: { id: id },
            });
        } catch (error) {
            console.error("Error getting vendor by id:", error);
            throw new Error("Failed to get vendor by id");
        }
    }

    public async addVendor(vendor: Vendor): Promise<Vendor> {
        try {
            return await this.Prisma.vendor.create({ data: vendor });
        } catch (error) {
            console.error("Error adding vendor:", error);
            throw new Error("Failed to add vendor");
        }
    }

    public async editVendor(vendor: Vendor): Promise<Vendor> {
        try {
            return await this.Prisma.vendor.update({
                where: { id: vendor.id },
                data: vendor,
            });
        } catch (error) {
            console.error("Error editing vendor:", error);
            throw new Error("Failed to edit vendor");
        }
    }
}