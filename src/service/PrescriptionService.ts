import PrescriptionRepository from "../repository/PrescriptionRepository";
import {Prescription, Status, PrescriptionHasMedicine, Prisma} from "@prisma/client";
import AddPrescriptionRequest from "../model/request/AddPrescriptionRequest";
import {Builder} from "builder-pattern";
import IdVO from "../model/VOs/IdVO";
import AddPrescribedMedicineRequest from "../model/request/AddPrescribedMedicineRequest";
import PrescriptionHasMedicineRepository from "../repository/PrescriptionHasMedicineRepository";
import MedicineService from "./MedicineService";
import PrescriptionSummaryVO from "../model/VOs/PrescriptionSummaryVO";
import PrescriptionSummaryResponse from "../model/response/PrescriptionSummaryResponse";

export default class PrescriptionService{
    private readonly prescriptionRepository: PrescriptionRepository
    private readonly prescriptionHasMedicineRepository: PrescriptionHasMedicineRepository
    private readonly medicineService: MedicineService
    constructor() {
        this.prescriptionRepository = new PrescriptionRepository()
        this.prescriptionHasMedicineRepository = new PrescriptionHasMedicineRepository()
        this.medicineService = new MedicineService();
    }

    public async createNewPrescription (request: AddPrescriptionRequest): Promise<number> {
        try {
            const newPrescription: Prescription = Builder<Prescription>()
                .patientId(request.patient.patientId)
                .status(Status.UNPROCESSED)
                .is_active(true)
                .created_at(new Date())
                .updated_at(new Date())
                .build();
            return await this.prescriptionRepository.createNewPrescription(newPrescription)
                .then(async (result: IdVO): Promise<number> => {
                    await this.createNewPrescriptionHasMedicine(request.medicineList, result.id)
                    return result.id
                })
        } catch (error) {
            throw error as string
        }
    }

    private async createNewPrescriptionHasMedicine(medicineList: AddPrescribedMedicineRequest[], prescriptionId: number){
        try {
            const newPrescribeMedicineList: PrescriptionHasMedicine[] = medicineList
                .map((prescribedMedicineRequest: AddPrescribedMedicineRequest) => {
                    this.medicineService.decreaseMedicineStock(prescribedMedicineRequest.medicineId, prescribedMedicineRequest.quantity)
                    return this.constructPrescriptionHasMedicine(prescribedMedicineRequest, prescriptionId)
                })
            console.log("prescribedMedicineList: ", newPrescribeMedicineList)
            return await this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescribeMedicineList)
        } catch (error) {
            throw error as string
        }
    }

    private constructPrescriptionHasMedicine(prescribeMedicineRequest: AddPrescribedMedicineRequest, prescriptionId: number): PrescriptionHasMedicine{
        return Builder<PrescriptionHasMedicine>()
            .prescriptionId(prescriptionId)
            .medicineId(prescribeMedicineRequest.medicineId)
            .quantity(prescribeMedicineRequest.quantity)
            .instruction(prescribeMedicineRequest.instruction)
            .totalPrice(new Prisma.Decimal(Number(prescribeMedicineRequest.price) * prescribeMedicineRequest.quantity))
            .build();
    }

    public async getAllPrescriptionList(username?: string){
        try {
            if (username) {
                return await this.prescriptionRepository.getAllPrescription().then(
                    prescriptions => {
                        return prescriptions.map(prescription => {
                            return this.constructPrescriptionSummaryVO(prescription)
                        })
                    }
                )
            } else {
                return await this.prescriptionRepository.getAllPrescription().then(
                    prescriptions => {
                        return prescriptions.map(prescription => {
                            return this.constructPrescriptionSummaryVO(prescription)
                        })
                    }
                )
            }
        } catch (error) {
            throw error as string
        }
    }

    private constructPrescriptionSummaryVO(prescription: PrescriptionSummaryVO): PrescriptionSummaryResponse{
        return Builder<PrescriptionSummaryResponse>()
            .prescriptionId(prescription.id)
            .timestamps(prescription.created_at)
            .patientName(prescription.patient.name)
            .status(prescription.status)
            .build()
    }
}