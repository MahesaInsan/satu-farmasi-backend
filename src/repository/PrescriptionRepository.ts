import {Prescription, PrismaClient} from "@prisma/client";
import IdVO from "../model/VOs/IdVO";
import PrescriptionSummaryVO from "../model/VOs/PrescriptionSummaryVO";
import PrescriptionDetailVO from "../model/VOs/PrescriptionDetailVO";

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

    public async getPrescriptionByPrescriptionId(prescriptionId: number): Promise<PrescriptionDetailVO | null> {
        try {
            return this.prisma.prescription.findFirst({
                where: {
                    id: prescriptionId,
                    is_active: true
                },
                select: {
                    id: true,
                    patient: {
                        select: {
                            name: true,
                            credentialNumber: true
                        }
                    },
                    medicineList: {
                        select: {
                            medicine: {
                                select: {
                                    id: true,
                                    code: true,
                                    name: true,
                                    merk: true,
                                    currStock: true,
                                    minStock: true,
                                    price: true,
                                    classifications: {
                                        select: {
                                            classification: {
                                                select: {
                                                    label: true
                                                }
                                            }
                                        }
                                    },
                                    packaging: {
                                        select: {
                                            label: true
                                        }
                                    },
                                    genericName: {
                                        select: {
                                            label: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } catch (error){
            throw error as string
        }
    }

    public async getAllPrescriptionByUsername(username: string): Promise<PrescriptionSummaryVO[]>{
        try {
            return this.prisma.prescription.findMany({
                where: {
                    patient: {
                        name: {
                            contains: username
                        }
                    },
                    is_active: true
                },
                select: {
                    id: true,
                    created_at: true,
                    patient: {
                        select: {
                            name: true
                        },
                    },
                    status: true
                },
                orderBy: [
                    {
                        status: "asc"
                    },
                    {
                        created_at: "asc"
                    }
                ]
            })
        } catch (error){
            throw error as string
        }
    }

    public async getAllPrescription(): Promise<PrescriptionSummaryVO[]>{
        try {
            return this.prisma.prescription.findMany({
                where: {
                  is_active: true
                },
                select: {
                    id: true,
                    created_at: true,
                    patient: {
                        select: {
                            name: true
                        },
                    },
                    status: true
                },
                orderBy: [
                    {
                        status: "asc"
                    },
                    {
                        created_at: "asc"
                    }
                ]
            })
        } catch (error){
            throw error as string
        }
    }
}