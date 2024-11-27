import { ReceiveMedicine } from "@prisma/client";
import MedicineService from "./MedicineService";
import ReceiveMedicineRepository from "../repository/ReceiveMedicineRepository";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import AddReceiveMedicineRequest from "../model/request/AddReceiveMedicineRequest";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import TodayMedicineReportVO from "../model/VOs/TodayMedicineReportVO";
import { Builder } from "builder-pattern";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";
import MedicineReportService from "./MedicineReportService";
import AddMedicineReportRequest from "../model/request/AddMedicineReportRequest";
import MedicineReportHelper from "./helper/MedicineReportHelper";

export default class ReceiveMedicineService {
    private readonly receiveMedicineRepository: ReceiveMedicineRepository;
    private readonly medicineService: MedicineService;
    private readonly reportService: MedicineReportService;
    private readonly reportHelper: MedicineReportHelper;

    constructor() {
        this.receiveMedicineRepository = new ReceiveMedicineRepository();
        this.medicineService = new MedicineService();
        this.reportService = new MedicineReportService();
        this.reportHelper = new MedicineReportHelper();
    }

    public async getTotalReceiveMedicines(): Promise<number> {
        try {
            return await this.receiveMedicineRepository.getTotalReceiveMedicines();
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalSearchReceiveMedicines(parameter: string): Promise<number> {
        try {
            return await this.receiveMedicineRepository.getTotalSearchReceiveMedicine(parameter);
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllReceiveMedicines(limit: number, startIndex: number): Promise<ReceiveMedicineVO[]> {
        try {
            return await this.receiveMedicineRepository.getAllReceiveMedicines(limit, startIndex);
        } catch (error) {
            throw error as string;
        }
    }

    public async getReceiveMedicineByMedicineId(medicineID: number): Promise<ReceiveMedicineVO | null> {
        try {
            return await this.receiveMedicineRepository.getReceiveMedicineByMedicineId(medicineID);
        } catch (error) {
            throw error as string;
        }
    }

    public async searchReceiveMedicine(limit: number, startIndex: number, parameter: string): Promise<ReceiveMedicineVO[]> {
        try {
            return await this.receiveMedicineRepository.searchReceiveMedicine(limit, startIndex, parameter);
        } catch (error) {
            throw error as string;
        }
    }

    public async createReceiveMedicine(data: AddReceiveMedicineRequest) {
        try {
            // insert for report id
            let todayReport: TodayMedicineReportVO | null = await this.reportService.getTodayUnFinalizedMedicineReport();
            if (!todayReport) {
                const reportRequest: AddMedicineReportRequest = new AddMedicineReportRequest(false, true);
                todayReport = await this.reportService.addMedicineReport(this.reportHelper.createMedicineReport(reportRequest))
            }

            data.reportId = todayReport.id;
            console.log("data: ", data);

            // new medicine
            if (!data.medicineId || data.medicineId == 0) {
                return await this.medicineService.createMedicine(data.medicineRequest)
                    .then(async (newMedicine: MedicineDisplayVO) => {
                        data.medicineId = newMedicine.id;
                        const request: ReceiveMedicine = this.constructAddReceiveMedicine(data)
                        return await this.receiveMedicineRepository.createReceiveMedicine(request)
                    })
            } else { // existing medicine
                const request: ReceiveMedicine = this.constructAddReceiveMedicine(data)
                return await this.receiveMedicineRepository.createReceiveMedicine(request)
                    .then(async () => {
                        return await this.medicineService.createMedicine(data.medicineRequest)
                    })
            }
        } catch (error) {
            throw error as string;
        }
    }

    private constructAddReceiveMedicine(request: AddReceiveMedicineRequest): ReceiveMedicine {
        return Builder<ReceiveMedicine>()
            .documentNumber(request.documentNumber)
            .batchCode(request.batchCode)
            .medicineId(request.medicineId)
            .quantity(request.quantity)
            .vendorId(request.vendorId)
            .buyingPrice(request.buyingPrice)
            .paymentMethod(request.paymentMethod)
            .deadline(request.deadline)
            .isPaid(request.isPaid)
            .is_active(true)
            .created_at(new Date)
            .updated_at(new Date)
            .reportId(request.reportId)
            .build();
    }
}