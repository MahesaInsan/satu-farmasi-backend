import {Diagnose, PrismaClient} from "@prisma/client"
import SummaryDiagnoseVO from "../model/VOs/SummaryDiagnoseVO";
import DiagnoseDetailVO from "../model/VOs/DiagnoseDetailVO";

export default class DiagnoseRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createDiagnose(newDiagnose: Diagnose): Promise<Diagnose>{
        try {
            return this.prisma.diagnose.create({
                data: newDiagnose
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getDiagnoseCount(doctorId: number, patientName?: string): Promise<number>{
        try {
            return this.prisma.diagnose.count({
                where: {
                    AND: [
                        {
                            doctorId: doctorId
                        },
                        {
                            prescription: {
                                patient: {
                                    name: patientName
                                }
                            }
                        }
                    ]
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    async getDiagnoseSummary(doctorId: number, startIndex: number, limit: number, patientName?: string): Promise<SummaryDiagnoseVO[]> {
        try {
            return this.prisma.diagnose.findMany({
                where: {
                    AND: [
                        {
                            doctorId: doctorId
                        },
                        {
                            prescription: {
                                patient: {
                                    name: patientName,
                                }
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    prescription: {
                        select: {
                            status: true,
                            patient: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    is_active: true,
                    created_at: true
                },
                skip: startIndex,
                take: limit,
                orderBy: [
                    {
                        prescription: {
                            status: 'asc'
                        }
                    },
                    {
                        created_at: 'desc'
                    }
                ]
            })
        } catch (error) {
            throw error as string
        }
    }

    async getDiagnoseDetail(diagnoseId: number): Promise<DiagnoseDetailVO | null> {
        try {
            return this.prisma.diagnose.findFirst({
                where: {
                    id: diagnoseId
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    created_at: true,
                    prescription: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        } catch (error) {
            throw error as string
        }
    }
}