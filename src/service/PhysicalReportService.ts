import { Builder } from "builder-pattern";
import AddPhysicalReportRequest from "../model/request/AddPhysicalReportRequest";
import PhysicalReportRepository from "../repository/PhysicalReportRepository";
import { PhysicalReport } from "@prisma/client";
import PhysicalReportVO from "../model/VOs/PhysicalReportVO";

export default class PhysicalReportService {
    private readonly physicalReportRepository: PhysicalReportRepository;

    constructor() {
        this.physicalReportRepository = new PhysicalReportRepository();
    }

    public async getPhysicalReportById(id: number) {
        try {
            return await this.physicalReportRepository.getPhysicalReportById(id);
        } catch (error) {
            throw error as string;
        }
    }

    public async createPhysicalReport(request: AddPhysicalReportRequest): Promise<PhysicalReportVO> {
        try {
            const physicalReport: PhysicalReport = this.constructPhysicalReport(request);
            return await this.physicalReportRepository.createPhysicalReport(physicalReport);
        } catch (error) {
            throw error as string;
        }
    }

    private constructPhysicalReport(request: AddPhysicalReportRequest): PhysicalReport {
        return Builder<PhysicalReport>()
            .data(request.data)
            .created_at(new Date)
            .build()
    }
}