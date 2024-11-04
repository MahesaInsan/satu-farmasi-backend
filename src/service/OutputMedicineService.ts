import { OutputMedicine, ReasonOfDispose } from "@prisma/client";
import OutputMedicineRepository from "../repository/OutputMedicineRepository";
import OutputMedicineHelper from "./helper/OutputMedicineHelper";
import AddOutputMedicineRequest from "../model/request/AddOutputMedicineRequest";
import EditOutputMedicineRequest from "../model/request/EditOutputMedicineRequest";
import OutputMedicineVO from "../model/VOs/OutputMedicineVO";
import DeleteOutputMedicineRequest from "../model/request/DeleteOutputMedicineRequest";
import MedicineService from "./MedicineService";

export default class OutputMedicineService {
    private readonly medicineService: MedicineService;
    private readonly outputMedicineRepository: OutputMedicineRepository;
    private readonly outputMedicineHelper: OutputMedicineHelper;

    constructor() {
        this.outputMedicineRepository = new OutputMedicineRepository();
        this.outputMedicineHelper = new OutputMedicineHelper();
        this.medicineService = new MedicineService();
    }

    public async getTotalOutputMedicines(): Promise<number> {
        try {
            return await this.outputMedicineRepository.getTotalOutputMedicines();
        } catch (error) {
			throw error as string;
        }
    }


    public async getOutputMedicineById(id: number): Promise<OutputMedicineVO | null> {
        try {
            return await this.outputMedicineRepository.getOutputMedicineById(id);
        } catch (error) {
			throw error as string;
        }
    }

    public async getTotalOutputMedicineBySearch(q?: string, filter?: string): Promise<number> {
        try {
            return await this.outputMedicineRepository.getTotalOutputMedicineBySearch(q, filter);
        } catch (error) {
			throw error as string;
        }
    }

    public async getAllOutputMedicines(limit: number, startIndex: number): Promise<OutputMedicineVO[]> {
        try {
            return await this.outputMedicineRepository.getAllOutputMedicines(limit, startIndex);
        } catch (error) {
			throw error as string;
        }
    }

    public async getOutputMedicineBySearch(limit: number, startIndex: number, q?: string, filter?: string): Promise<OutputMedicineVO[]> {
        try {
            return await this.outputMedicineRepository.getOutputMedicineBySearch(limit, startIndex, q, filter);
        } catch (error) {
			throw error as string;
        }
    }

    public async addOutputMedicine(request: AddOutputMedicineRequest): Promise<Boolean> {
        try {
            await this.medicineService.decreaseMedicineStock(request.medicineId, request.quantity);
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.createOutputMedicine(request);
            const matchedReason = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            request.reasonOfDispose = matchedReason as ReasonOfDispose
            return await this.outputMedicineRepository.addOutputMedicine(outputMedicine);
        } catch (error) {
			throw error as string;
        }
    }

    public async editOutputMedicine(request: EditOutputMedicineRequest): Promise<Boolean> {
        try {
            await this.medicineService.updateMedicineStock(request.oldQuantity, request.quantity, request.medicineId);
            const matchedReason: string | undefined = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            request.reasonOfDispose = matchedReason as ReasonOfDispose
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.editOutputMedicine(request);
            return await this.outputMedicineRepository.editOutputMedicine(outputMedicine);
        } catch (error) {
			throw error as string;
        }
    }

    public async deleteOutputMedicine(request: DeleteOutputMedicineRequest): Promise<Boolean> {
        try {
            await this.medicineService.increaseMedicineStock(request.medicineId, request.quantity);
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.deleteOutputMedicine(request);
            return await this.outputMedicineRepository.deleteOutputMedicine(outputMedicine.id);
        } catch (error) {
			throw error as string;
        }
    }
}
