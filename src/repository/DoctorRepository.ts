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
}