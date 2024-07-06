import Admin from "../entity/Admin";
import {PrismaClient, Role} from "@prisma/client"

export default class AdminRepository{
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    public async addAdmin(admin: Admin): Promise<Admin>{
        try {
            console.log(admin)
            return await this.prisma.admin.create({data: admin})
        } catch (error) {
            console.error('Error adding admin:', error);
            throw new Error('Failed to add admin');
        }
    }

    public async getAllAdmins(): Promise<Admin []>{
        try {
            return await this.prisma.admin.findMany();
        } catch (error) {
            console.error('Error getting all admins:', error);
            throw new Error('Failed to add admin');
        }
    }
}