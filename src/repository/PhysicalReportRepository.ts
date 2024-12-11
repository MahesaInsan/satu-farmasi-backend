import { PhysicalReport, PrismaClient } from "@prisma/client";
import PhysicalReportVO from "../model/VOs/PhysicalReportVO";
import BaseRepository from "./helper/BaseRepository";

export default class PhysicalReportRepository extends BaseRepository{

    constructor() {
        super();
    }

    public async getPhysicalReportById(id: number): Promise<PhysicalReportVO | null> {
        try {
            return await this.Prisma.physicalReport.findFirst({
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
            return await this.Prisma.physicalReport.create({
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