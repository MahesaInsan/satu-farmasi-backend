// import Admin from "../entity/Admin";
import { Admin } from "@prisma/client";
import BaseRepository from "./helper/BaseRepository";

export default class AdminRepository extends BaseRepository{
    constructor() {
        super();
    }

    public async nikIsExist(nik: string): Promise<Boolean> {
        try {
            const admin = await this.Prisma.admin.findUnique({
                where: { nik: nik },
                select: { nik: true }
            });
            return admin !== null;
        } catch (error) {
            console.error('Error checking nik:', error);
            throw new Error('Failed to check nik');
        }
    }

    public async emailIsExist(email: string): Promise<Boolean> {
        try {
            const admin = await this.Prisma.admin.findUnique({
                where: { email: email },
                select: { email: true }
            });
            return admin !== null;
        } catch (error) {
            console.error('Error checking email:', error);
            throw new Error('Failed to check email');
        }
    }

    public async addAdmin(admin: Admin): Promise<Admin> {
        try {
            console.log(admin);
            return await this.Prisma.admin.create({ data: admin });
        } catch (error) {
            console.error("Error adding admin:", error);
            throw new Error("Failed to add admin");
        }
    }

    public async getAdminByEmail(email: string): Promise<Admin | null> {
        try {
            return await this.Prisma.admin.findUnique({ where: { email: email }, });
        } catch (error) {
            console.error("Error getting admin by email:", error);
            throw new Error("Failed to get admin");
        }
    }

    public async getAllAdmins(): Promise<Admin[]> {
        try {
            return await this.Prisma.admin.findMany();
        } catch (error) {
            console.error("Error getting all admins:", error);
            throw new Error("Failed to add admin");
        }
    }

    public async getAdminById(id: number): Promise<Admin | null> {
        try {
            return await this.Prisma.admin.findUnique({ where: { id: id } });
        } catch (error) {
            console.error('Error getting admin by id:', error);
            throw new Error('Failed to get admin');
        }
    }

    public async getAdminByNik(nik: string): Promise<Admin | null> {
        try {
            return await this.Prisma.admin.findUnique({ where: { nik: nik } });
        } catch (error) {
            console.error('Error getting admin by nik:', error);
            throw new Error('Failed to get admin');
        }
    }

    public async editAdmin(admin: Admin): Promise<Admin> {
        try {
            console.log("admin : ", admin);
            return await this.Prisma.admin.update({ where: { nik: admin.nik }, data: admin });
        } catch (error) {
            console.error('Error editing admin:', error);
            throw new Error('Failed to edit admin');
        }
    }
}
