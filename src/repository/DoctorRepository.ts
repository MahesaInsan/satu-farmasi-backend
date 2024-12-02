import BaseRepository from "./helper/BaseRepository";
import DoctorVO from "../model/VOs/DoctorVO";
import { CustomError } from "../validator/helper/ErrorHelper";
import { User } from "@prisma/client";

export default class DoctorRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async emailIsExist(
        emailTarget: string,
        selfEmail?: string,
    ): Promise<Boolean> {
        try {
            if (emailTarget === selfEmail) return false;
            const doctor = await this.Prisma.user.findUnique({
                where: { email: emailTarget },
            });
            return doctor !== null;
        } catch (error) {
            console.error("Error checking email:", error);
            throw new Error("Failed to check email");
        }
    }

    public async addDoctor(doctor: User): Promise<User> {
        try {
            return await this.Prisma.user.create({ data: doctor });
        } catch (error) {
            throw new CustomError().handlePrismaError(
                error,
                "Failed to add doctor",
            );
        }
    }

    public async getDoctorByEmail(email: string): Promise<User | null> {
        try {
            return await this.Prisma.user.findUnique({
                where: { email: email },
            });
        } catch (error) {
            console.error("Error getting doctor by email:", error);
            throw new Error("Failed to get doctor");
        }
    }

    public async getTotalDoctor(param?: string): Promise<number> {
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
            console.log("Error getting total doctor:", error);
            throw new Error("Failed to get total doctor");
        }
    }

    public async getAllDoctors(
        limit: number,
        startIndex: number,
        param?: string,
    ): Promise<DoctorVO[]> {
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
                            role: "DOCTOR",
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
            console.error("Error getting all doctor:", error);
            throw new Error("Failed to get doctor");
        }
    }

    public async getDoctorById(id: number): Promise<DoctorVO | null> {
        try {
            return await this.Prisma.user.findUnique({
                omit: { password: true },
                where: { id: id },
            });
        } catch (error) {
            console.error("Error getting doctor by id:", error);
            throw new Error("Failed to get doctor");
        }
    }

    public async getDoctorByNik(nik: string): Promise<DoctorVO | null> {
        try {
            return await this.Prisma.user.findUnique({
                omit: { password: true },
                where: { nik: nik },
            });
        } catch (error) {
            console.error("Error getting doctor by nik:", error);
            throw new Error("Failed to get doctor");
        }
    }

    public async editDoctor(doctor: User): Promise<boolean> {
        try {
            const editedDoctor: DoctorVO = await this.Prisma.user.update({
                omit: { password: true },
                where: { nik: doctor.nik },
                data: doctor,
            });
            return editedDoctor !== null;
        } catch (error) {
            throw new CustomError().handlePrismaError(
                error,
                "Failed to edit doctor",
            );
        }
    }
}
