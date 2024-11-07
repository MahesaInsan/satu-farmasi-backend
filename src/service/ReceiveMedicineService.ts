import { ReceiveMedicine } from "@prisma/client";
import MedicineService from "./MedicineService";
import ReceiveMedicineRepository from "../repository/ReceiveMedicineRepository";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import AddReceiveMedicineRequest from "../model/request/AddReceiveMedicineRequest";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import { Builder } from "builder-pattern";

export default class ReceiveMedicineService {
    private readonly receiveMedicineRepository: ReceiveMedicineRepository;
    private readonly medicineService: MedicineService

    constructor() {
        this.receiveMedicineRepository = new ReceiveMedicineRepository();
        this.medicineService = new MedicineService();
    }

    public async createReceiveMedicine(data: AddReceiveMedicineRequest) {
        try {
            // TODO: insert for report id
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
                        return await this.medicineService.increaseMedicineStock(data.medicineId, data.quantity)
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