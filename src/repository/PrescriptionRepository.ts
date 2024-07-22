import {Prescription, PrismaClient} from "@prisma/client";
import IdVO from "../model/VOs/IdVO";

export default class PrescriptionRepository{
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createNewPrescription(newPrescription: Prescription): Promise<IdVO>{
        try {
            return this.prisma.prescription.create({
                data: newPrescription,
                select: {
                    id:true
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getPrescriptionDetail(): Promise<Prescription[]>{
        try {
            return this.prisma.prescription.findMany({
                include: {
                    patient: true,
                    diagnose: true,
                    medicineList: true
                }
            })
        } catch (error){
            throw error as string
        }
    }
}