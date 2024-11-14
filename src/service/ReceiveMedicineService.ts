import { ReceiveMedicine } from "@prisma/client";
import MedicineService from "./MedicineService";
import ReceiveMedicineRepository from "../repository/ReceiveMedicineRepository";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import AddReceiveMedicineRequest from "../model/request/AddReceiveMedicineRequest";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import { Builder } from "builder-pattern";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";

export default class ReceiveMedicineService {
    private readonly receiveMedicineRepository: ReceiveMedicineRepository;
    private readonly medicineService: MedicineService;

    constructor() {
        this.receiveMedicineRepository = new ReceiveMedicineRepository();
        this.medicineService = new MedicineService();
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

    public async searchReceiveMedicine(limit: number, startIndex: number, parameter: string): Promise<ReceiveMedicineVO[]> {
        try {
            return await this.receiveMedicineRepository.searchReceiveMedicine(limit, startIndex, parameter);
        } catch (error) {
            throw error as string;
        }
    }

    public async createReceiveMedicine(data: AddReceiveMedicineRequest) {
        try {
            // TODO: insert for report id
            // const todayReport: TodayMedicineReportVOs | null = await this.repor

            if (!data.medicineId || data.medicineId == 0) {
                return await this.medicineService.createMedicine(data.medicineRequest)
                    .then(async (newMedicine: MedicineDisplayVO) => {
                        data.medicineId = newMedicine.id;
                        const request: ReceiveMedicine = this.constructAddReceiveMedicine(data)
                        return await this.receiveMedicineRepository.createReceiveMedicine(request)
                    })
            } else {
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
            .reportId(null)
            .build();
    }
}