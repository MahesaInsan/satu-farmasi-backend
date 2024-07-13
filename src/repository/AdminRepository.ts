import Admin from "../entity/Admin";
import {PrismaClient, Role} from "@prisma/client"
import User from "../entity/User";

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

    public async getAdminById(id: number): Promise<Admin | null>{
        try {
            return await this.prisma.admin.findUnique({where: {id: id }});
        } catch (error) {
            console.error('Error getting admin by id:', error);
            throw new Error('Failed to get admin');
        }
    }

    public async editAdminById(admin: Admin): Promise<Admin> {
        try {
            console.log(admin);
            return await this.prisma.admin.update({where: {id: admin.id}, data: admin});
        } catch (error) {
            console.error('Error editing admin by id:', error);
            throw new Error('Failed to edit admin');
        }
    }
}