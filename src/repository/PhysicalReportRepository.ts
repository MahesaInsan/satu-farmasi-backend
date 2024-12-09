import { PhysicalReport, PrismaClient } from "@prisma/client";
import PhysicalReportVO from "../model/VOs/PhysicalReportVO";

export default class PhysicalReportRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async getPhysicalReportById(id: number): Promise<PhysicalReportVO | null> {
        try {
            return await this.prisma.physicalReport.findFirst({
                where: { id: id },
                select: {
                    id: true,
                    data: true,
                    created_at: true
                }
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async createPhysicalReport(physicalReport: PhysicalReport): Promise<PhysicalReportVO> {
        try {
            return await this.prisma.physicalReport.create({
                data: {...physicalReport,
                    data: JSON.parse(JSON.stringify(physicalReport.data))
                },
                select: {
                    id: true,
                    data: true,
                    created_at: true
                }
            })
        } catch (error) {
            throw error as string;
        }
    }
}