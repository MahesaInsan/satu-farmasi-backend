import BaseRepository from "./helper/BaseRepository";
import AdminVO from "../model/VOs/AdminVO";
import { CustomError } from "../validator/helper/ErrorHelper";
import { User } from "@prisma/client";
import Admin from "../entity/Admin";

export default class AdminRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async nikIsExist(
        nikTarget: string,
        selfNik?: string,
    ): Promise<Boolean> {
        try {
            if (selfNik === nikTarget) return false;
            const admin = await this.Prisma.user.findUnique({
                where: { nik: nikTarget },
                select: { nik: true },
            });
            return admin !== null;
        } catch (error) {
            console.error("Error checking nik:", error);
            throw new Error("Failed to check nik");
        }
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

    public async addAdmin(admin: Admin): Promise<User> {
        try {
            return await this.Prisma.user.create({
                data: {
                    ...admin,
                    password: admin.password as string,
                    specialist: null,
                    sipaNum: null,
                },
            });
        } catch (error) {
            throw new CustomError().handlePrismaError(
                error,
                "Failed to add admin",
            );
        }
    }

    public async getAdminByEmail(email: string): Promise<User | null> {
        try {
            return await this.Prisma.user.findUnique({
                where: { email: email, role: "ADMIN" },
            });
        } catch (error) {
            console.error("Error getting admin by email:", error);
            throw new Error("Failed to get admin");
        }
    }

    public async getTotalAdmin(param?: string): Promise<number> {
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
            console.log("Error getting total admins:", error);
            throw new Error("Failed to get total admins");
        }
    }

    public async getAllAdmins(
        limit: number,
        startIndex: number,
        param?: string,
    ): Promise<AdminVO[]> {
        try {
            return await this.Prisma.user.findMany({
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
                            role: "ADMIN",
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
            console.error("Error getting all admins:", error);
            throw new Error("Failed to add admin");
        }
    }

    public async getAdminById(id: number): Promise<AdminVO | null> {
        try {
            return await this.Prisma.user.findUnique({
                omit: { password: true },
                where: { id: id },
            });
        } catch (error) {
            console.error("Error getting admin by id:", error);
            throw new Error("Failed to get admin");
        }
    }

    public async getAdminByNik(nik: string): Promise<AdminVO | null> {
        try {
            return await this.Prisma.user.findUnique({
                omit: { password: true },
                where: { nik: nik },
            });
        } catch (error) {
            console.error("Error getting admin by nik:", error);
            throw new Error("Failed to get admin");
        }
    }

    public async editAdmin(admin: Admin): Promise<boolean> {
        try {
            const editedAdmin: AdminVO = await this.Prisma.user.update({
                omit: { password: true },
                where: { nik: admin.nik },
                data: admin,
            });
            return editedAdmin !== null;
        } catch (error) {
            throw new CustomError().handlePrismaError(
                error,
                "Failed to edit admin",
            );
        }
    }
}
