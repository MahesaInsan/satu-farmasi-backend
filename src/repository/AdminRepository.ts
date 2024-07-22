import Admin from "../entity/Admin";
import BaseREpository from "./helper/BaseRepository";

export default class AdminRepository extends BaseREpository {
    constructor() {
        super();
    }

    public async emailIsExist(email: string): Promise<Boolean> {
        try {
            const admin = await this.Prisma.admin.findUnique({
                where: { email: email },
                select: { email: true }
            });
            return admin !== null;
        } catch (error) {
            console.error("Error checking email:", error);
            throw new Error("Failed to check email");
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
}
