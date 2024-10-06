import BaseRepository from "./helper/BaseRepository";
import TodayMedicineReportVO from "../model/VOs/TodayMedicineReportVO";
import { MedicineReport } from "@prisma/client";

export default class MedicineReportRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async getTodayUnFinalizedMedicineReport(): Promise<TodayMedicineReportVO | null> {
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
                select: { id: true, isFinalized: true }
            });
        } catch (error) {
            console.error("Error getting today unfinalized medicine report:", error);
            throw new Error("Failed to get today unfinalized medicine report");
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
