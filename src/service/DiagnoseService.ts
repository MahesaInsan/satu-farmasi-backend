import DiagnoseRepository from "../repository/DiagnoseRepository";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import PrescriptionService from "./PrescriptionService";
import {Diagnose, User} from "@prisma/client";
import {Builder} from "builder-pattern";
import PatientService from "./PatientService";
import ValidationHelper from "./helper/ValidationHelper";
import SummaryDiagnoseVO from "../model/VOs/SummaryDiagnoseVO";
import UserService from "./UserService";
import PaginationRequest from "../model/request/PaginationRequest";
import DraftPrescriptionVO from "../model/VOs/DraftPrescriptionVO";
import PrescriptionDetailVO from "../model/VOs/PrescriptionDetailVO";
import DiagnoseDetailVO from "../model/VOs/DiagnoseDetailVO";
import DiagnoseDetailResponse from "../model/response/DiagnoseDetailResponse";

export default class DiagnoseService{
    private diagnoseRepository: DiagnoseRepository
    private prescriptionService: PrescriptionService
    private userService: UserService
    private validationHelper: ValidationHelper
    private patientService: PatientService

    constructor() {
        this.diagnoseRepository = new DiagnoseRepository()
        this.prescriptionService = new PrescriptionService()
        this.userService = new UserService()
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

    public async getDiagnoseCount(doctorEmail: string, patientName?: string): Promise<[number, User | null]> {
        try {
            const doctor: User | null = await this.userService.getUserByEmail(doctorEmail)
            if (doctor === null || doctor.id === undefined) {
                throw new Error("Doctor does not exist")
            }
            return [await this.diagnoseRepository.getDiagnoseCount(doctor.id, patientName), doctor]
        } catch (error) {
            throw error as string
        }
    }

    public async getDiagnoseSummary(doctorId: number,  pagination: PaginationRequest, patientName?: string): Promise<SummaryDiagnoseVO[]> {
        try {
            if (doctorId) {
                return await this.diagnoseRepository.getDiagnoseSummary(doctorId, pagination.startIndex, pagination.limit, patientName)
            } else throw new Error("Doctor id must not be empty")
        } catch (error) {
            throw error as string;
        }
    }

    public async getDiagnoseDetail(diagnoseId: number) {
        try {
            if (diagnoseId) {
                const diagnose = await this.diagnoseRepository.getDiagnoseDetail(diagnoseId)
                if (diagnose) {
                    const prescription: DraftPrescriptionVO | PrescriptionDetailVO | null = await this.prescriptionService
                        .getPrescription(diagnose?.prescription.id!)
                    if (prescription) {
                        return this.constructDiagnoseDetailResponse(diagnose, prescription)
                    } else throw new Error("Prescription is not found")
                } else throw new Error("Diagnose is not found")
            } else throw new Error("Diagnose id must not be blank")
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

    private constructDiagnoseDetailResponse(diagnose: DiagnoseDetailVO, prescription: PrescriptionDetailVO | DraftPrescriptionVO) {
        return Builder<DiagnoseDetailResponse>()
            .id(diagnose.id)
            .title(diagnose.title)
            .description(diagnose.description)
            .created_at(diagnose.created_at)
            .prescription(prescription)
    }
}
