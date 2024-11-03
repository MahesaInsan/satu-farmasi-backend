import TodayMedicineReportVOs from "../model/VOs/TodayMedicineReportVO";
import MedicineReportRepository from "../repository/MedicineReportRepository";
import MedicineReportVO from "../model/VOs/TodayMedicineReportVO";

export default class MedicineReportService {
    private readonly reportRepository: MedicineReportRepository;
    //private readonly vendorHelper: VendorHelper;

    constructor() {
        this.reportRepository = new MedicineReportRepository();
        //this.vendorHelper = new VendorHelper();
    }

    public async getTodayUnFinalizedMedicineReport(): Promise<TodayMedicineReportVOs | null> {
        try {
            return await this.reportRepository.getTodayUnFinalizedMedicineReport();
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async finalizeReport(reportId: number): Promise<boolean> {
        try {
            return await this.reportRepository.finalizeReport(reportId);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getMedicineReportById(reportId: number): Promise<MedicineReportVO | null> {
        try {
            return await this.reportRepository.getMedicineReportById(reportId);
        } catch (error) {
            throw new Error(error as string);
        }
    }

}
