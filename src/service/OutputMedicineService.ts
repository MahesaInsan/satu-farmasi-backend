import {Medicine, OutputMedicine, Prisma, ReasonOfDispose} from "@prisma/client";
import TodayMedicineReportVOs from "../model/VOs/TodayMedicineReportVO";
import OutputMedicineRepository from "../repository/OutputMedicineRepository";
import OutputMedicineHelper from "./helper/OutputMedicineHelper";
import AddOutputMedicineRequest from "../model/request/AddOutputMedicineRequest";
import EditOutputMedicineRequest from "../model/request/EditOutputMedicineRequest";
import OutputMedicineVO from "../model/VOs/OutputMedicineVO";
import DeleteOutputMedicineRequest from "../model/request/DeleteOutputMedicineRequest";
import MedicineService from "./MedicineService";
import MedicineReportService from "./MedicineReportService";
import MedicineReportHelper from "./helper/MedicineReportHelper";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import AddMedicineReportRequest from "../model/request/AddMedicineReportRequest";
import MedicineData from "../model/VOs/MedicineDropdownVO";
import PhysicalReportService from "./PhysicalReportService";
import PhysicalReportVO from "../model/VOs/PhysicalReportVO";
import BulkAddOutputMedicineRequest from "../model/request/BulkAddOutputMedicineRequest";
import OutputMedicineDataRequest from "../model/request/OutputMedicineDataRequest";
import {Builder} from "builder-pattern";
import AddPhysicalReportRequest from "../model/request/AddPhysicalReportRequest";
import TotalOutcomeOutputVO from "../model/VOs/TotalOutcomeOutputVO";

export default class OutputMedicineService {
    private readonly medicineService: MedicineService;
    private readonly outputMedicineRepository: OutputMedicineRepository;
    private readonly outputMedicineHelper: OutputMedicineHelper;
    private readonly reportService: MedicineReportService;
    private readonly reportHelper: MedicineReportHelper;
    private readonly physicalReportService: PhysicalReportService;

    constructor() {
        this.outputMedicineRepository = new OutputMedicineRepository();
        this.reportHelper = new MedicineReportHelper();
        this.reportService = new MedicineReportService();
        this.outputMedicineHelper = new OutputMedicineHelper();
        this.medicineService = new MedicineService();
        this.physicalReportService = new PhysicalReportService();
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

    public async bulkAddOutputMedicine(request: BulkAddOutputMedicineRequest) {
        try {
            const outputMedicineRequests: AddOutputMedicineRequest[] = request.medicineList.map(medicine => {
                return this.constructAddOutputMedicineRequest(medicine, request.physicalReport)
            })
            outputMedicineRequests.map(async outputMedicine => {
                await this.addOutputMedicine(outputMedicine)
            })
        } catch (error) {
            throw error as string
        }
    }

    public async addOutputMedicine(request: AddOutputMedicineRequest): Promise<Boolean> {
        try {
            await this.updateMedicineCurrStockAndReserved(0, request.quantity, request.medicineId)
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.createOutputMedicine(request);
            const matchedReason = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            request.reasonOfDispose = matchedReason as ReasonOfDispose

            let todayReport: TodayMedicineReportVOs | null = 
                await this.reportService.getTodayUnFinalizedMedicineReport();

            if (!todayReport) {
                const reportRequest: AddMedicineReportRequest = new AddMedicineReportRequest(false, true, request.created_at || new Date());
                todayReport = await this.reportService.
                    addMedicineReport(this.reportHelper.createMedicineReport(reportRequest))
            }

            outputMedicine.reportId = todayReport.id

            const physicalReport: PhysicalReportVO = await this.physicalReportService.createPhysicalReport(request.physicalReport);
            outputMedicine.physicalReportId = physicalReport.id;

            return await this.outputMedicineRepository.addOutputMedicine(outputMedicine);
        } catch (error) {
			throw error as string;
        }
    }

    public async editOutputMedicine(request: EditOutputMedicineRequest): Promise<Boolean> {
        try {
            await this.updateMedicineCurrStockAndReserved(request.oldQuantity, request.quantity, request.medicineId)
            const matchedReason: string | undefined = this.outputMedicineRepository.validReasonOfDispose(request.reasonOfDispose);
            await this.physicalReportService.editPhysicalReport(request.physicalReport);
            request.reasonOfDispose = matchedReason as ReasonOfDispose
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.editOutputMedicine(request);
            return await this.outputMedicineRepository.editOutputMedicine(outputMedicine);
        } catch (error) {
			throw error as string;
        }
    }

    public async deleteOutputMedicine(request: DeleteOutputMedicineRequest): Promise<Boolean> {
        try {
            await this.updateMedicineCurrStockAndReserved(request.quantity, 0, request.medicineId)
            const outputMedicine: OutputMedicine = this.outputMedicineHelper.deleteOutputMedicine(request);
            return await this.outputMedicineRepository.deleteOutputMedicine(outputMedicine.id);
        } catch (error) {
			throw error as string;
        }
    }

    public async getTotalCostOutputMedicineByDate(startDate: Date, lastDate: Date): Promise<TotalOutcomeOutputVO[]> {
        try {
            return await this.outputMedicineRepository.getTotalCostOutputMedicineByDate(new Date(startDate), new Date(lastDate));
        } catch (error) {
            throw error as string;
        }
    }

    private async updateReservedMedicine(medicineId: number, quantityToBeAssign: number, quantityChange: number, code: string,
                                         medicinesByMedicineCode: Map<string, MedicineData[]>, isDelete: boolean) {
        let quantityLeftToUpdate = quantityToBeAssign;
        let medicineToReserve: Map<number, number> = new Map<number, number>()

        for (const medicine of medicinesByMedicineCode.get(code)!) {
            console.log(quantityLeftToUpdate)
            if (quantityLeftToUpdate === 0) {
                break;
            }
            if (medicine.id === medicineId) {
                if (isDelete) {
                    medicine.currStock += quantityChange
                } else medicine.currStock -= quantityChange
            }

            const medicineStockCanBeAssign = medicine.currStock - medicine.reservedStock
            if (medicineStockCanBeAssign > 0) {
                console.log(quantityLeftToUpdate, medicine)
                const stockAssign = Math.min(medicineStockCanBeAssign, quantityLeftToUpdate)
                medicineToReserve.set(medicine.id, stockAssign)
                quantityLeftToUpdate -= stockAssign
            }
        }

        if (quantityLeftToUpdate > 0) {
            throw new Error("Medicine are used by ongoing prescription please edit prescription before deleting")
        } else return medicineToReserve
    }

    private async reassignReservedMedicine (quantity: number, code: string,
                                            medicinesByMedicineCode: Map<string, MedicineData[]>): Promise<number> {
        let quantityLeftToUpdate = quantity;
        for (const medicine of [...medicinesByMedicineCode.get(code)!].reverse()) {
            if (quantityLeftToUpdate === 0) {
                break;
            }
            if (medicine.reservedStock > 0) {
                const stockAssign = Math.min(medicine.reservedStock, quantityLeftToUpdate)
                await this.medicineService.decreaseReservedMedicine(medicine.id, stockAssign)
                medicine.reservedStock -= stockAssign
                quantityLeftToUpdate -= stockAssign
            }
        }
        return quantityLeftToUpdate
    }

    public async updateMedicineCurrStockAndReserved(oldPrescriptionQuantity: number, newPrescriptionQuantity: number, medicineId: number) {
        try {
            const updatedQuantity = Math.abs(oldPrescriptionQuantity - newPrescriptionQuantity)
            const medicine = await this.medicineService.getMedicineById(medicineId);
            let medicineToReserve: Map<number, number> = new Map();

            if (newPrescriptionQuantity > oldPrescriptionQuantity) {
                console.log(`Higher ${newPrescriptionQuantity} > ${oldPrescriptionQuantity}`)
                let medicineToBeAssign = 0
                if (medicine) {
                    medicineToBeAssign = medicine.reservedStock - (medicine.currStock - updatedQuantity)
                    console.log(`${medicineToBeAssign} = ${medicine.reservedStock} - (${medicine.currStock} - ${updatedQuantity})`);
                    if (medicineToBeAssign > 0) {
                        const medicineList = await this.medicineService.getAndMapMedicineListByMedicineCode([medicine.code])
                        medicineToReserve = await this.updateReservedMedicine(medicineId, medicineToBeAssign, updatedQuantity,
                            medicine.code, medicineList, false)
                    }
                } else throw new Error("Medicine not found");

                await this.medicineService.decreaseStockAndReservedStock(medicineId, updatedQuantity,
                    medicineToBeAssign > 0 ? medicineToBeAssign : 0);

            } else if (newPrescriptionQuantity < oldPrescriptionQuantity) {
                console.log(`Lower ${newPrescriptionQuantity} < ${oldPrescriptionQuantity}`)
                if (medicine) {
                    const medicineList = await this.medicineService.getAndMapMedicineListByMedicineCode([medicine.code])
                    console.log(medicineList)
                    const quantityNotAssign = await this.reassignReservedMedicine(updatedQuantity, medicine.code, medicineList)
                    medicineToReserve = await this.updateReservedMedicine(medicineId, updatedQuantity - quantityNotAssign, updatedQuantity,
                        medicine.code, medicineList, true)
                } else throw new Error("Medicine not found");

                await this.medicineService.increaseMedicineStock(medicineId, updatedQuantity);
            }

            console.log(Array.from(medicineToReserve.keys()).length > 0)
            await Promise.all(
                Array.from(medicineToReserve.entries()).map(([key, value]) =>
                    this.medicineService.increaseReservedMedicine(key, value)
                )
            );
        } catch (error) {
            throw error as object;
        }
    }

    private constructAddOutputMedicineRequest(medicine: OutputMedicineDataRequest, physicalReport: AddPhysicalReportRequest): AddOutputMedicineRequest {
        return Builder<AddOutputMedicineRequest>()
            .medicineId(medicine.medicineId)
            .currStock(medicine.currStock)
            .quantity(medicine.quantity)
            .reasonOfDispose(medicine.reasonOfDispose)
            .physicalReport(physicalReport)
            .build()
    }
}
