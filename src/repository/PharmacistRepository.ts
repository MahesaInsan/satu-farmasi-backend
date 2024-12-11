import BaseRepository from "./helper/BaseRepository";
import { CustomError } from "../validator/helper/ErrorHelper";
import PharmacistVO from "../model/VOs/PharmacistVO";
import { User } from "@prisma/client";

export default class PharmacistRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async emailIsExist(
        emailTarget: string,
        selfEmail?: string,
    ): Promise<Boolean> {
        try {
            if (selfEmail === emailTarget) return false;
            const admin = await this.Prisma.user.findUnique({
                where: { email: emailTarget },
            });
            return admin !== null;
        } catch (error) {
            console.error("Error checking email:", error);
            throw new Error("Failed to check email");
        }
    }

    public async addPharmacist(pharmacist: User): Promise<boolean> {
        try {
            const data: User = await this.Prisma.user.create({
                data: pharmacist,
            });
            return data !== null;
        } catch (error) {
            throw new CustomError().handlePrismaError(
                error,
                "Failed to add pharmacist",
            );
        }
    }

    public async getPharmacistByEmail(email: string): Promise<User | null> {
        try {
            const pharmacist: User | null = await this.Prisma.user.findUnique({
                where: { email: email, role: "PHARMACIST" },
            });
            if (pharmacist && !pharmacist.is_active) throw new CustomError().formatError("Akun sudah tidak aktif lagi", "custom");
            return pharmacist
        } catch (error) {
            console.error("Error getting pharmacist by email:", error);
            throw error;
        }
    }

    public async getTotalPharmacist(param?: string): Promise<number> {
        try {
            return await this.Prisma.user.count({
                where: {
                    AND: [
                        {
                            is_active: true,
                            OR: [
                                { firstName: { contains: param } },
                                { lastName: { contains: param } },
                            ],
                        },
                    ],
                },
                orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
            });
        } catch (error) {
            console.error("Error getting total pharmacist:", error);
            throw new Error("Failed to get total pharmacist");
        }
    }

    public async getAllPharmacists(
        limit: number,
        startIndex: number,
        param?: string,
    ): Promise<PharmacistVO[]> {
        try {
            return this.Prisma.user.findMany({
                omit: { password: true },
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    firstName: {
                                        contains: param,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    lastName: {
                                        contains: param,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        },
                        {
                            role: "PHARMACIST",
                        },
                    ],
                },
                orderBy: [
                    { is_active: "desc" },
                    { updated_at: "desc" },
                    { created_at: "desc" },
                ],
                skip: startIndex,
                take: limit,
            });
        } catch (error) {
            console.error("Error getting all pharmacist:", error);
            throw new Error("Failed to get pharmacist");
        }
    }

    public async getPharmacistById(id: number): Promise<PharmacistVO | null> {
        try {
            return this.Prisma.user.findUnique({
                omit: { password: true },
                where: { id: id },
            });
        } catch (error) {
            console.error("Error getting pharmacist by id:", error);
            throw new Error("Failed to get pharmacist");
        }
    }

    public async getPharmacistByNik(nik: string): Promise<PharmacistVO | null> {
        try {
            return this.Prisma.user.findFirst({
                omit: { password: true },
                where: { nik: nik },
            });
        } catch (error) {
            console.error("Error getting pharmacist by nik:", error);
            throw new Error("Failed to get pharmacist");
        }
    }

    public async editPharmacist(pharmacist: User): Promise<boolean> {
        try {
            const editedPharmacist = await this.Prisma.user.update({
                omit: { password: true },
                where: { nik: pharmacist.nik },
                data: pharmacist,
            });
            return editedPharmacist !== null;
        } catch (error) {
            throw new CustomError().handlePrismaError(
                error,
                "Failed to edit pharmacist",
            );
        }
    }
}
