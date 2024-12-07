import { PhysicalReport, PrismaClient } from "@prisma/client";

export default class PhysicalReportRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createPhysicalReport(physicalReport: PhysicalReport) {
        try {
            return await this.prisma.physicalReport.create({
                data: {...physicalReport,
                    data: JSON.parse(JSON.stringify(physicalReport.data))
                }
            })
        } catch (error) {
            throw error as string;
        }
    }
}