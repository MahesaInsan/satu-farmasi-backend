import BaseREpository from "./helper/BaseRepository";
import Doctor from "../entity/Doctor";

export default class DoctorRepository extends BaseREpository{
    constructor() {
        super();
    }

    public async emailIsExist(email: string): Promise<Boolean>{
        try{
            const doctor = await this.Prisma.doctor.findUnique({where: {email: email}});
            return doctor !== null;
        } catch (error) {
            console.error('Error checking email:', error);
            throw new Error('Failed to check email');
        }
    }

    public async addDoctor(doctor: Doctor): Promise<Doctor>{
        try {
            console.log(doctor)
            return await this.Prisma.doctor.create({data: doctor})
        } catch (error) {
            console.error('Error adding admin:', error);
            throw new Error('Failed to add admin');
        }
    }

    public async getDoctorByEmail(email: string): Promise<Doctor | null>{
        try {
            return await this.Prisma.doctor.findUnique({where: {email: email}});
        } catch (error) {
            console.error('Error getting doctor by email:', error);
            throw new Error('Failed to get doctor');
        }
    }

    public async getAllDoctors(): Promise<Doctor []>{
        try {
            return await this.Prisma.doctor.findMany();
        } catch (error) {
            console.error('Error getting all doctor:', error);
            throw new Error('Failed to get doctor');
        }
    }

    public async getDoctorById(id: number): Promise<Doctor | null> {
        try {
            return await this.Prisma.doctor.findUnique({where: {id: id}});
        } catch (error) {
            console.error('Error getting doctor by id:', error);
            throw new Error('Failed to get doctor');
        }
    }

    public async getDoctorByNik(nik: string): Promise<Doctor | null> {
        try {
            return await this.Prisma.doctor.findUnique({where: {nik: nik}});
        } catch (error) {
            console.error('Error getting doctor by nik:', error);
            throw new Error('Failed to get doctor');
        }
    }

    public async editDoctor(doctor: Doctor): Promise<Doctor> {
        try {
            return await this.Prisma.doctor.update({where: {nik: doctor.nik}, data: doctor});
        } catch (error) {
            console.error('Error editing doctor:', error);
            throw new Error('Failed to edit doctor');
        }
    }
}