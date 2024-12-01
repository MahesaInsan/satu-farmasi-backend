import {Prescription, PrismaClient, Status} from "@prisma/client";
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

    public async getPrescriptionById(prescriptionId: number) {
        try {
            return this.prisma.prescription.findFirst({
                where: {
                    id: prescriptionId,
                    is_active: true
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async updatePrescriptionStatusAndIsActiveById(prescriptionId: number) {
        try {
            return this.prisma.prescription.update({
                where: {
                    id: prescriptionId
                },
                data: {
                    status: Status.CANCELED,
                    is_active: false
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
                },
                select: {
                    id: true,
                    status: true,
                    patient: {
                        select: {
                            id: true,
                            name: true,
                            credentialNumber: true,
                            phoneNum: true
                        }
                    },
                    medicineList: {
                        select: {
                            quantity: true,
                            instruction: true,
                            totalPrice: true,
                            medicineCode: true,
                            medicine: {
                                select: {
                                    id: true,
                                    code: true,
                                    name: true,
                                    merk: true,
                                    currStock: true,
                                    minStock: true,
                                    reservedStock: true,
                                    maxStock: true,
                                    description: true,
                                    expiredDate: true,
                                    price: true,
                                    unitOfMeasure: true,
                                    sideEffect: true,
                                    classifications: {
                                        select: {
                                            classification: {
                                                select: {
                                                    id: true,
                                                    label: true,
                                                    value: true
                                                }
                                            }
                                        }
                                    },
                                    packaging: {
                                        select: {
                                            id: true,
                                            label: true
                                        }
                                    },
                                    genericName: {
                                        select: {
                                            id: true,
                                            label: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }).then(result => result as PrescriptionDetailVO | null)
        } catch (error){
            throw error as string
        }
    }

    public async getAllPrescriptionByUsername(patientName: string | undefined, status: Status | undefined,
                                              startIndex: number, limit: number): Promise<PrescriptionSummaryVO[]> {
        try {
            return this.prisma.prescription.findMany({
                where: {
                    patient: {
                        name: {
                            contains: patientName,
                            mode: "insensitive",
                        }
                    },
                    status: status,
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
                skip: startIndex,
                take: limit,
                orderBy: [
                    {
                        status: "asc"
                    },
                    {
                        updated_at: "asc"
                    }
                ]
            })
        } catch (error){
            throw error as string
        }
    }

    public async getAllPrescriptionPerMonth(startDate: Date, lastDate: Date): Promise<Prescription[]> {
        try {
            return await this.prisma.prescription.findMany({
                where: {
                    AND: [
                        { created_at: { gte: startDate } }
                    ]
                }
            })
        } catch (error) {
            throw error as string;
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

    public async findIfExistById(id: number): Promise<IdVO | null> {
        try {
            return this.prisma.prescription.findUnique({
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

    public async countPrescriptionByPatientName(patientName: string | undefined, status: Status | undefined) {
        try {
            return this.prisma.prescription.count({
                where: {
                    patient: {
                        name: {
                            contains: patientName
                        }
                    },
                    status: status,
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async updatePrescriptionStatusById(status: Status, id: number) {
        try {
            console.log("saved")
            return this.prisma.prescription.update({
                where: {
                    id: id
                },
                data: {
                    status: status,
                    updated_at: new Date()
                }
            })
        } catch (error) {
            console.error("error here")
            throw error as string
        }
    }
}
