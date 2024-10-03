import { OutputMedicine, ReasonOfDispose } from "@prisma/client";
import OutputMedicineRepository from "../repository/OutputMedicineRepository";
import OutputMedicineHelper from "./helper/OutputMedicineHelper";
import AddOutputMedicineRequest from "../model/request/AddOutputMedicineRequest";
import EditOutputMedicineRequest from "../model/request/EditOutputMedicineRequest";
import MedicineRepository from "../repository/MedicineRepository";
import OutputMedicineVO from "../model/VOs/OutputMedicineVO";

export default class OutputMedicineService {
    private readonly medicineRepository: MedicineRepository;
    private readonly outputMedicineRepository: OutputMedicineRepository;
    private readonly outputMedicineHelper: OutputMedicineHelper;

    constructor() {
        this.outputMedicineRepository = new OutputMedicineRepository();
        this.outputMedicineHelper = new OutputMedicineHelper();
        this.medicineRepository = new MedicineRepository();
    }

    public async getTotalOutputMedicines(): Promise<number> {
        try {
            return await this.outputMedicineRepository.getTotalOutputMedicines();
        } catch (error) {
            throw new Error(error as string);
        }
    }


    public async getOutputMedicineById(id: number): Promise<OutputMedicineVO | null> {
        try {
            return await this.outputMedicineRepository.getOutputMedicineById(id);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getTotalOutputMedicineBySearch(params: string): Promise<number> {
        try {
            return await this.outputMedicineRepository.getTotalOutputMedicineBySearch(params);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getAllOutputMedicines(limit: number, startIndex: number): Promise<OutputMedicineVO[]> {
        try {
            return await this.outputMedicineRepository.getAllOutputMedicines(limit, startIndex);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getOutputMedicineBySearch(params: string, limit: number, startIndex: number): Promise<OutputMedicineVO[]> {
        try {
            return await this.outputMedicineRepository.getOutputMedicineBySearch(limit, startIndex, params);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async addOutputMedicine(request: AddOutputMedicineRequest): Promise<Boolean> {
        try {
            // TODO: Handle if reportId is already finalized
            // Steps:
            // 1. Get today's report
            // 2. Check if report is finalized
            // 3. If finalized. create new today's report
            // 4. If not finalized, add to the today's report
            const matchedReason = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            request.reasonOfDispose = matchedReason as ReasonOfDispose
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.createOutputMedicine(request);
            // TODO: Decrese stock of medicine
            return await this.outputMedicineRepository.addOutputMedicine(outputMedicine);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async editOutputMedicine(request: EditOutputMedicineRequest): Promise<Boolean> {
        try {
            // TODO: Handle if reportId is already finalized
            // Steps:
            // 1. Get today's report
            // 2. Check if report is finalized
            // 3. If finalized. throw error
            const matchedReason = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            request.reasonOfDispose = matchedReason as ReasonOfDispose
            // TODO: Decrese stock of medicine
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.editOutputMedicine(request);
            return await this.outputMedicineRepository.editOutputMedicine(outputMedicine);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async deleteOutputMedicine(request: EditOutputMedicineRequest): Promise<Boolean> {
        try {
            // TODO: Choose weather to use the id only or with the body object to find the qunatity and medicineId
            const matchedReason = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            request.reasonOfDispose = matchedReason as ReasonOfDispose;
            console.log("increasing stock with id: ", request.medicineId);
            await this.medicineRepository.increaseStock(request.medicineId, request.quantity);
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.editOutputMedicine(request);
            return await this.outputMedicineRepository.editOutputMedicine(outputMedicine);
        } catch (error) {
            throw new Error(error as string);
        }
    }
}
