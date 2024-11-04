import {Patient, PrismaClient} from "@prisma/client";
import IdVO from "../model/VOs/IdVO";

export default class PatientRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async findPatientDropdownOptions(): Promise<Patient[]>{
        try {
            return this.prisma.patient.findMany({
                where:{
                    is_active: true
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async createPatient(newPatient: Patient): Promise<IdVO>{
        try {
            return this.prisma.patient.create(
                {
                    data: newPatient,
                    select: {
                        id: true
                    }
                }
            );
        } catch (error) {
            throw new Error("failed to create Patient")
        }
    }

    public async findIfExist(credentialNum: string): Promise<IdVO | null>{
        try {
            return this.prisma.patient.findUnique({
                where: {
                    credentialNumber: credentialNum
                },
                select: {
                    id: true
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async findIfExistById(id: number): Promise<IdVO | null>{
        try {
            return this.prisma.patient.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getTotalPatient(): Promise<number> {
        try {
            return this.prisma.patient.count({
                where: {
                    is_active: true
                }
            })
        } catch (error) {
            throw error as string
        }
    }
}