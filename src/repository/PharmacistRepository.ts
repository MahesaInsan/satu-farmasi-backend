import BaseREpository from "./helper/BaseRepository";
import Pharmacist from "../entity/Pharmacist"

export default class PharmacistRepository extends BaseREpository{
    constructor() {
        super();
    }

    public async emailIsExist(email: string): Promise<Boolean>{
        try{
            const admin = await this.Prisma.pharmacist.findUnique({where: {email: email}});
            return admin !== null;
        } catch (error) {
            console.error('Error checking email:', error);
            throw new Error('Failed to check email');
        }
    }

    public async addPharmacist(pharmacist: Pharmacist): Promise<Pharmacist>{
        try {
            console.log(pharmacist)
            return await this.Prisma.pharmacist.create({data: pharmacist})
        } catch (error) {
            console.error('Error adding admin:', error);
            throw new Error('Failed to add admin');
        }
    }

    public async getPharmacistByEmail(email: string): Promise<Pharmacist | null>{
        try {
            return await this.Prisma.pharmacist.findUnique({where: {email: email}});
        } catch (error) {
            console.error('Error getting pharmacist by email:', error);
            throw new Error('Failed to get pharmacist');
        }
    }
}