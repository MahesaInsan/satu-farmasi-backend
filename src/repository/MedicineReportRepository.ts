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
                        lte: endOfDay
                    },
                    isFinalized: false
                },
                select: { id: true, isFinalized: true, receiveMedicines: true, transactions: true, outputMedicines: true }
            });
        } catch (error) {
            console.error("Error getting today unfinalized medicine report:", error);
            throw new Error("Failed to get today unfinalized medicine report");
        }
    }

    public async finalizeReport(reportId: number): Promise<boolean> {
        try {
            const report = await this.Prisma.medicineReport.update({
                where: { id: reportId },
                data: { isFinalized: true }
            });
            return report !== null;
        } catch(error) {
            console.error("Error finalizing report:", error);
            throw new Error("Failed to finalize report");
        }
    }

    public async getMedicineReportById(reportId: number): Promise<MedicineReportVO | null> {
        try {
            return this.Prisma.medicineReport.findUnique({
                where: { id: reportId },
                select: {
                    id: true,
                    isFinalized: true,
                    receiveMedicines: true,
                    transactions: true,
                    outputMedicines: true
                }
            });
        } catch (error) {
            console.error("Error getting medicine report by id:", error);
            throw new Error("Failed to get medicine report by id");
        }
    }

    public async addMedicineReport(data: MedicineReport): Promise<MedicineReport> {
        try {
            return await this.Prisma.medicineReport.create({ data: data })
        } catch (error) {
            console.error("Error adding medicine report:", error);
            throw new Error("Failed to add medicine report");
        }
    }
}
