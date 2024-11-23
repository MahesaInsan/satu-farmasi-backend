import BaseRepository from "./helper/BaseRepository";
import TodayMedicineReportVOs from "../model/VOs/TodayMedicineReportVO";
import { MedicineReport } from "@prisma/client";
import MedicineReportVO from "../model/VOs/TodayMedicineReportVO";

export default class MedicineReportRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async getTodayUnFinalizedMedicineReport(): Promise<TodayMedicineReportVOs | null> {
        try {
            const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
            const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

            return await this.Prisma.medicineReport.findFirst({
                where: {
                    created_at: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    isFinalized: false,
                },
                include: {
                    receiveMedicines: true,
                    transactions: true,
                    outputMedicines: true,
                },
            });
        } catch (error) {
            console.error(
                "Error getting today unfinalized medicine report:",
                error,
            );
            throw new Error("Failed to get today unfinalized medicine report");
        }
    }

    public async getUnFinalizedReportd(): Promise<MedicineReportVO | null> {
        try {
            return await this.Prisma.medicineReport.findFirst({
                where: { isFinalized: false },
                select: { id: true, isFinalized: true, created_at: true },
            });
        } catch (error) {
            console.error("Error getting unfinalized report:", error);
            throw new Error("Failed to get unfinalized report");
        }
    }

    public async finalizeReport(reportId: number): Promise<boolean> {
        try {
            const report = await this.Prisma.medicineReport.update({
                where: { id: reportId },
                data: { isFinalized: true },
            });
            return report !== null;
        } catch (error) {
            console.error("Error finalizing report:", error);
            throw new Error("Failed to finalize report");
        }
    }

    public async getTotalMedicineReports(): Promise<number> {
        try {
            return this.Prisma.medicineReport.count();
        } catch (error) {
            console.error("Error getting total medicine reports:", error);
            throw new Error("Failed to get total medicine reports");
        }
    }

    public async getAllMedicineReports(
        limit: number,
        startIndex: number,
    ): Promise<MedicineReportVO[]> {
        try {
            return this.Prisma.medicineReport.findMany({
                skip: startIndex,
                take: limit,
                select: {
                    id: true,
                    isFinalized: true,
                    created_at: true,
                    updated_at: true,
                    _count: {
                        select: {
                            receiveMedicines: true,
                            transactions: true,
                            outputMedicines: true,
                        },
                    },
                },
                orderBy: [{ isFinalized: "asc" }, { created_at: "desc" }],
            });
        } catch (error) {
            console.error("Error getting all medicine reports:", error);
            throw new Error("Failed to get all medicine reports");
        }
    }

    public async getMedicineReportById(
        reportId: number,
    ): Promise<MedicineReportVO | null> {
        try {
            return this.Prisma.medicineReport.findUnique({
                where: { id: reportId },
                select: {
                    id: true,
                    isFinalized: true,
                    transactions: {
                        select: {
                            id: true,
                            patient: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            prescription: {
                                omit: {
                                    patientId: true,
                                },
                                include: {
                                    medicineList: {
                                        omit: {
                                            medicineId: true,
                                            prescriptionId: true,
                                        },
                                        include: {
                                            medicine: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    price: true,
                                                },
                                            },
                                        },
                                    },
                                    diagnose: {
                                        omit: {
                                            prescriptionId: true,
                                        },
                                        include: {
                                            doctor: {
                                                select: {
                                                    id: true,
                                                    firstName: true,
                                                    lastName: true,
                                                    specialist: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            pharmacist: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            totalPrice: true,
                        },
                    },
                    receiveMedicines: {
                        omit: {
                            medicineId: true,
                            vendorId: true,
                            reportId: true,
                        },
                        include: {
                            medicine: {
                                omit: {
                                    packagingId: true,
                                    genericNameId: true,
                                },
                                include: {
                                    packaging: {
                                        select: {
                                            id: true,
                                            value: true,
                                        }
                                    },
                                    genericName: {
                                        select: {
                                            id: true,
                                            value: true,
                                        }
                                    },
                                    classifications: {
                                        select: {
                                            classification: {
                                                select: {
                                                    id: true,
                                                    value: true,
                                                }
                                            }
                                        }
                                    },
                                }
                            },
                            vendor: true,
                        },
                    },
                    outputMedicines: {
                        omit: {
                            medicineId: true,
                            reportId: true,
                        },
                        include: {
                            medicine: true,
                        },
                    },
                    created_at: true,
                    updated_at: true,
                },
            });
        } catch (error) {
            console.error("Error getting medicine report by id:", error);
            throw new Error("Failed to get medicine report by id");
        }
    }

    public async addMedicineReport(
        data: MedicineReport,
    ): Promise<MedicineReport> {
        try {
            return await this.Prisma.medicineReport.create({ data: data });
        } catch (error) {
            console.error("Error adding medicine report:", error);
            throw new Error("Failed to add medicine report");
        }
    }
}
