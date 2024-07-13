import { Doctor, PrismaClient } from "@prisma/client";

export default class DoctorRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAllDoctors(): Promise<Doctor []>{
        try {
            return await this.prisma.doctor.findMany();
        } catch (error) {
            console.error('Error getting all doctor:', error);
            throw new Error('Failed to get doctor');
        }
    }

    public async getDoctorById(id: number): Promise<Doctor | null> {
        try {
            return await this.prisma.doctor.findUnique({where: {id: id}});
        } catch (error) {
            console.error('Error getting doctor by id:', error);
            throw new Error('Failed to get doctor');
        }
    }
}