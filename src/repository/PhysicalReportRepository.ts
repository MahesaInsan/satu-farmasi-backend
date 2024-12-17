import { PhysicalReport, Prisma, PrismaClient } from "@prisma/client";
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

    public async editPhysicalReport(physicalReport: PhysicalReport) {
        try {
            console.log("physicalReport: ", physicalReport)
            console.log("witness: ", physicalReport.data)
            return await this.Prisma.physicalReport.update({
                data: {
                    data: JSON.parse(JSON.stringify(physicalReport.data))
                },
                where: {
                    id: physicalReport.id
                }
            })
        } catch (error) {
            throw error as string;
        }
    }

    public async deletePhysicalReport(id: number) {
        try {
            return await this.Prisma.physicalReport.delete({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw error as string;
        }
    }
}
