import { Medicine, ReceiveMedicine } from "@prisma/client";
import MedicineService from "./MedicineService";
import ReceiveMedicineRepository from "../repository/ReceiveMedicineRepository";
import AddReceiveMedicineRequest from "../model/request/AddReceiveMedicineRequest";
import EditReceiveMedicineRequest from "../model/request/EditReceiveMedicineRequest";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import { Builder } from "builder-pattern";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";
import MedicineReportService from "./MedicineReportService";
import MedicineReportHelper from "./helper/MedicineReportHelper";
import AddMedicineReportRequest from "../model/request/AddMedicineReportRequest";
import TodayMedicineReportVO from "../model/VOs/TodayMedicineReportVO";
import { CustomError } from "../validator/helper/ErrorHelper";

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

    public async getReceiveMedicineById(receiveMedicineId: number): Promise<ReceiveMedicineVO | null> {
        try {
            return await this.receiveMedicineRepository.getReceiveMedicineById(receiveMedicineId);
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
            // assing medicine batchCode from data.batchCode
            data.medicineRequest.batchCode = data.batchCode;
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
                const validation: boolean = await this.isQuantityStockEnable(data.medicineRequest.code, data.quantity);
                if (!validation) {
                    throw new Error("Error: Jumlah stok melebih maksimum stok!");
                }
                return this.medicineService.createMedicine(data.medicineRequest)
                    .then(async (newMedicine: MedicineDisplayVO) => {
                        request.medicineId = newMedicine.id;
                        return await this.receiveMedicineRepository.createReceiveMedicine(request)
                    })
            }

        } catch (error) {
            throw error as string;
        }
    }

    public async confirmReceiveMedicine(data: EditReceiveMedicineRequest) {
        try {
            // insert for report id
            let todayReport: TodayMedicineReportVO | null = await this.reportService.getTodayUnFinalizedMedicineReport();
            if (!todayReport) {
                const reportRequest: AddMedicineReportRequest = new AddMedicineReportRequest(false, true);
                todayReport = await this.reportService.addMedicineReport(this.reportHelper.createMedicineReport(reportRequest))
            }
            data.reportId = todayReport.id;

            // Get medicine data by medicineid
            console.log("data edit receive: ", data);
            const medicine: Medicine | null = await this.medicineService.getMedicineById(data.medicineId);
            console.log("medicine data from receive: ", medicine);
            if (!medicine) throw new Error("Data obat tidak ditemukan!");
            
            // Update is active = true (receiveMedicine & medicine by id)
            const receiveMedicine: ReceiveMedicine = this.constructEditReceiveMedicine(data);

            // Ensure receive medicine is paid & validation quantity
            if (!receiveMedicine.isPaid) throw new Error("Error: penerimaan obat wajib lunas!");
            const validation: boolean = await this.isConfirmQuantityStockEnable(receiveMedicine.id, medicine?.code, receiveMedicine.quantity);
            if (!validation) throw new Error("Error: Jumlah stok melebihi maksimum Stok!");

            medicine.currStock = data.quantity;
            medicine.expiredDate = data.expiredDate;
            medicine.is_active = data.is_active;
            console.log("medicine request for edit: ", medicine)
            await this.receiveMedicineRepository.updateReceiveMedicine(receiveMedicine)
            await this.medicineService.editMedicineForReceiveById(medicine);
        } catch (error) {
            throw error as string;
        }
    }

    public async deleteReceiveMedicine(receiveMedicineId: number) {
        try {
            const receiveMedicine: ReceiveMedicineVO | null = await this.getReceiveMedicineById(receiveMedicineId);
            if (!receiveMedicine) throw new CustomError().formatError("Data tidak ditemukan!", "custom");

            return await this.receiveMedicineRepository.deleteReceiveMedicine(receiveMedicineId)
                .then(() => {
                    this.medicineService.hardDeleteMedicineById(receiveMedicine.medicine.id)
                });
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
            .is_active(false)
            .created_at(new Date)
            .updated_at(new Date)
            .reportId(null)
            .build();
    }

    private constructEditReceiveMedicine(request: EditReceiveMedicineRequest): ReceiveMedicine {
        return Builder<ReceiveMedicine>()
            .id(request.id)
            .documentNumber(request.documentNumber)
            .batchCode(request.batchCode)
            .medicineId(request.medicineId)
            .quantity(request.quantity)
            .vendorId(request.vendorId)
            .buyingPrice(request.buyingPrice)
            .paymentMethod(request.paymentMethod)
            .deadline(request.deadline)
            .isPaid(request.isPaid)
            .is_active(request.is_active)
            .updated_at(new Date)
            .reportId(request.reportId)
            .build();
    }

    private async isQuantityStockEnable(medicineCode: string, quantity: number): Promise<boolean> {
        try {
            const summaryMedicine = await this.medicineService.getMedicineSummaryByCode(0, 1, medicineCode, "code", "asc");
            console.log("summaryMedicine: ", summaryMedicine);
            for (let i = 0; i < summaryMedicine.length; i++) {
                if (summaryMedicine[i].currStock + quantity > summaryMedicine[i].maxStock 
                    || quantity > summaryMedicine[i].maxStock) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            throw error as string;
        }
    }

    private async isConfirmQuantityStockEnable(receiveMedicineId: number, medicineCode: string, quantity: number): Promise<boolean> {
        try {
            const receiveMedicine = await this.getReceiveMedicineById(receiveMedicineId);
            if (!receiveMedicine) throw new Error("Error: Data not found!");
            const summaryMedicine = await this.medicineService.getMedicineSummaryByCode(0, 1, medicineCode, "code", "asc");
            console.log("summaryMedicine: ", summaryMedicine);
            for (const obj of summaryMedicine) {
                if (!obj.is_active && (quantity > obj.maxStock || (obj.currStock - receiveMedicine.quantity + quantity > obj.maxStock))) {
                    return false;
                }
            }
            console.log("masuk true");
            return true;
        } catch (error) {
            throw error as string;
        }
    }
}