import PrescriptionRepository from "../repository/PrescriptionRepository";
import {Prescription, Status, PrescriptionHasMedicine, Prisma, Diagnose} from "@prisma/client";
import AddPrescriptionRequest from "../model/request/AddPrescriptionRequest";
import {Builder} from "builder-pattern";
import IdVO from "../model/VOs/IdVO";
import AddPrescribedMedicineRequest from "../model/request/AddPrescribedMedicineRequest";
import PrescriptionHasMedicineRepository from "../repository/PrescriptionHasMedicineRepository";
import MedicineService from "./MedicineService";
import PrescriptionSummaryVO from "../model/VOs/PrescriptionSummaryVO";
import PrescriptionSummaryResponse from "../model/response/PrescriptionSummaryResponse";
import PatientService from "./PatientService";
import EditPrescriptionRequest from "../model/request/EditPrescriptionRequest";
import ValidationHelper from "./helper/ValidationHelper";

export default class PrescriptionService{
    private readonly prescriptionRepository: PrescriptionRepository
    private readonly prescriptionHasMedicineRepository: PrescriptionHasMedicineRepository
    private readonly medicineService: MedicineService
    private readonly patientService: PatientService
    private readonly validationHelper: ValidationHelper;

    constructor() {
        this.prescriptionRepository = new PrescriptionRepository();
        this.prescriptionHasMedicineRepository = new PrescriptionHasMedicineRepository();
        this.medicineService = new MedicineService();
        this.patientService = new PatientService();
        this.validationHelper = new ValidationHelper();
    }

    public async addNewPrescription (request: AddPrescriptionRequest): Promise<number> {
        try {
            if (request.patient.patientId === -1) {
                return await this.patientService.addNewPatient(request.patient)
                    .then(async (idVO) => {
                        request.patient.patientId = idVO.id
                        return await this.createNewPrescription(request)
                    })
            } else {
                return await this.createNewPrescription(request)
            }
        } catch (error) {
            throw error as string
        }
    }

    public async getPrescription (prescriptionId: number) {
        try {
            const result = this.prescriptionRepository.getPrescriptionByPrescriptionId(prescriptionId)
            if (result === null) {
                new Error("Not Found")
            } else return result;
        } catch (error) {
            throw error as string
        }
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

    public async editPrescription(request: EditPrescriptionRequest) {
        try {
            let tuple: [Map<number, PrescriptionHasMedicine>, Map<number, PrescriptionHasMedicine>]

            await this.validationHelper.validatePrescriptionRequest(request)
            tuple = await this.mapOldPrescriptionHasMedicine(await this.findPrescriptionMedicine(request.prescriptionId))

            return await this.compareAndUpdatePrescriptionHasMedicine(tuple[0], request.medicineList,
                request.prescriptionId, tuple[1]).then(result => true)
        } catch (error) {
            throw error as string
        }
    }

    public async updatePrescriptionToWaitingForPayment(id: number) {
        try {
            await this.prescriptionRepository.updatePrescriptionStatusById(Status.WAITING_FOR_PAYMENT, id);
        } catch (error) {
            throw error as string
        }
    }

    private async findPrescriptionMedicine(prescriptionId: number) {
        try {
            return await this.prescriptionHasMedicineRepository.getPrescriptionHasMedicine(prescriptionId)
        } catch (error) {
            throw error as string
        }
    }

    private async compareAndUpdatePrescriptionHasMedicine(prescriptionHasMedicineByMedicineId: Map<number, PrescriptionHasMedicine>,
                                                          newPrescriptionHasMedicine: AddPrescribedMedicineRequest[], prescriptionId: number,
                                                          prescriptionHasMedicineById: Map<number, PrescriptionHasMedicine>) {
															  try {
        let newPrescriptionHasMedicineUpdate: PrescriptionHasMedicine[] = [];

        newPrescriptionHasMedicine.forEach(newPrescription => {
            if (prescriptionHasMedicineByMedicineId.has(newPrescription.medicineId)) {
                const updatedPrescriptionHasMedicine: PrescriptionHasMedicine = prescriptionHasMedicineByMedicineId.get(newPrescription.medicineId)!
                this.medicineService.updateMedicineStock(updatedPrescriptionHasMedicine.quantity, newPrescription.quantity, updatedPrescriptionHasMedicine.medicineId)
                this.prescriptionHasMedicineRepository.updateWhereId(this.constructPrescriptionHasMedicine(newPrescription, prescriptionId),
                    updatedPrescriptionHasMedicine.id)
                prescriptionHasMedicineById.delete(updatedPrescriptionHasMedicine.id)
            } else {
                this.medicineService.decreaseMedicineStock(newPrescription.medicineId, newPrescription.quantity)
                newPrescriptionHasMedicineUpdate.push(this.constructPrescriptionHasMedicine(newPrescription, prescriptionId))
            }
        })

        prescriptionHasMedicineById.forEach(deletedPrescriptionHasMedicine => {
            console.log(deletedPrescriptionHasMedicine)
            this.medicineService.updateMedicineStock(deletedPrescriptionHasMedicine.quantity, 0, deletedPrescriptionHasMedicine.medicineId)
        })
        await this.prescriptionHasMedicineRepository.deleteWherePrescriptionIdAndInId(prescriptionId, Array.from(prescriptionHasMedicineById.keys()));

        if (newPrescriptionHasMedicineUpdate.length > 0) {
            this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescriptionHasMedicineUpdate);
        }
															  } catch (error) {
																  throw error as string
															  }
    }

    private async mapOldPrescriptionHasMedicine(oldPrescriptionHasMedicine: PrescriptionHasMedicine[]): Promise<[Map<number, PrescriptionHasMedicine>,
        Map<number, PrescriptionHasMedicine>]> {
        let prescriptionHasMedicineByMedicineId = new Map<number, PrescriptionHasMedicine>;
        let prescriptionHasMedicineById = new Map<number, PrescriptionHasMedicine>;

        oldPrescriptionHasMedicine.forEach(prescriptionHasMedicine => {
            prescriptionHasMedicineById.set(prescriptionHasMedicine.id, prescriptionHasMedicine)
            prescriptionHasMedicineByMedicineId.set(prescriptionHasMedicine.medicineId, prescriptionHasMedicine)
        })
        return [prescriptionHasMedicineByMedicineId, prescriptionHasMedicineById];
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
