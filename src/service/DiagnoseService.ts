import DiagnoseRepository from "../repository/DiagnoseRepository";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import PrescriptionService from "./PrescriptionService";
import {Diagnose} from "@prisma/client";
import {Builder} from "builder-pattern";
import PatientService from "./PatientService";
import ValidationHelper from "./helper/ValidationHelper";

export default class DiagnoseService{
    private diagnoseRepository: DiagnoseRepository
    private prescriptionService: PrescriptionService
    private validationHelper: ValidationHelper
    private patientService: PatientService

    constructor() {
        this.diagnoseRepository = new DiagnoseRepository()
        this.prescriptionService = new PrescriptionService()
        this.patientService = new PatientService()
        this.validationHelper = new ValidationHelper()
    }

    public async createDiagnose(request: AddDiagnoseRequest): Promise<boolean>{
        try {
            await this.validationHelper.validateDiagnoseRequest(request)
            if (request.prescription.patient.patientId === -1) {
                return await this.patientService.addNewPatient(request.prescription.patient)
                    .then(async (idVO) => {
                        request.prescription.patient.patientId = idVO.id
                        return await this.prescriptionService.createNewPrescription(request.prescription)
                            .then(async (prescriptionId: number) => {
                                const newDiagnose: Diagnose = this.constructDiagnose(request, prescriptionId)
                                return await this.diagnoseRepository.createDiagnose(newDiagnose)
                            }).then((): boolean => true)
                    })
            } else {
                return await this.prescriptionService.createNewPrescription(request.prescription)
                    .then(async (prescriptionId: number) => {
                        const newDiagnose: Diagnose = this.constructDiagnose(request, prescriptionId)
                        return await this.diagnoseRepository.createDiagnose(newDiagnose)
                    }).then((): boolean => true)
            }
        } catch (error) {
            throw error as string
        }
    }

    private constructDiagnose(request: AddDiagnoseRequest, prescriptionId: number): Diagnose{
        return Builder<Diagnose>()
            .title(request.title)
            .description(request.description)
            .prescriptionId(prescriptionId)
            .doctorId(request.doctorId)
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .build()
    }
}
