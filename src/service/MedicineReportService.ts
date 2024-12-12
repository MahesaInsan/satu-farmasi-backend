import TodayMedicineReportVOs from "../model/VOs/TodayMedicineReportVO";
import MedicineReportRepository from "../repository/MedicineReportRepository";
import MedicineReportVO from "../model/VOs/TodayMedicineReportVO";
import { CustomError } from "../validator/helper/ErrorHelper";
import {Medicine, MedicineReport} from "@prisma/client";
import MedicineService from "./MedicineService";

export default class MedicineReportService {
    private readonly reportRepository: MedicineReportRepository;
    private readonly medicineService: MedicineService;
    //private readonly vendorHelper: VendorHelper;

    constructor() {
        this.reportRepository = new MedicineReportRepository();
        this.medicineService = new MedicineService();
        //this.vendorHelper = new VendorHelper();
    }

    public async getTodayUnFinalizedMedicineReport(): Promise<TodayMedicineReportVOs | null> {
        try {
            return await this.reportRepository.getTodayUnFinalizedMedicineReport();
        } catch (error) {
            throw error as string;
        }
    }

    public async finalizeReport(reportId: number): Promise<boolean> {
        try {
            const unFinalizedReport: MedicineReportVO | null =
                await this.getUnFinalizedReportd();
            if (unFinalizedReport) {
                const currentReportId: MedicineReportVO | null =
                    await this.getMedicineReportById(reportId);
                if (!currentReportId) {
                    throw new CustomError().formatError(
                        "Report Not Found",
                        "reportId",
                    );
                }
                const currReportCreated = new Date(
                    currentReportId.created_at,
                ).getTime();
                const unFinalizedReportCreated = new Date(
                    unFinalizedReport.created_at,
                ).getTime();
                if (currReportCreated !== unFinalizedReportCreated) {
                    throw new CustomError().formatError(
                        "Unfinalized Report",
                        "unFinalizedReport",
                        unFinalizedReport,
                    );
                }
                const medicineList: Medicine[] = await this.medicineService.checkIfExpiredMedicineStillExist(unFinalizedReport?.created_at)
                if (medicineList.length > 0) {
                    throw new Error("Some medicine are expired and hasn't been output, please click check expired medicine")
                }
            }
            return await this.reportRepository.finalizeReport(reportId);
        } catch (error) {
            throw error as string;
        }
    }

    public async getUnFinalizedReportd(): Promise<MedicineReportVO | null> {
        try {
            return await this.reportRepository.getUnFinalizedReportd();
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalMedicineReports(): Promise<number> {
        try {
            return await this.reportRepository.getTotalMedicineReports();
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllMedicineReports(
        limit: number,
        startIndex: number,
    ): Promise<MedicineReportVO[]> {
        try {
            return await this.reportRepository.getAllMedicineReports(
                limit,
                startIndex,
            );
        } catch (error) {
            throw error as string;
        }
    }

    public async checkExpiredMedicine(todayDate: Date) {
        try {
            return await this.medicineService.getExpiredMedicineBeforeToday(todayDate)
        } catch (error) {
            throw error as string
        }
    }

    public async getMedicineReportById(
        reportId: number,
    ): Promise<MedicineReportVO | null> {
        try {
            return await this.reportRepository.getMedicineReportById(reportId);
        } catch (error) {
            throw error as string;
        }
    }

    public async addMedicineReport(
        data: MedicineReport,
    ): Promise<MedicineReport> {
        try {
            return await this.reportRepository.addMedicineReport(data);
        } catch (error) {
            throw error as string;
        }
    }
}
