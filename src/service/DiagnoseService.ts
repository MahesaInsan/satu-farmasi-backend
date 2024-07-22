import DiagnoseRepository from "../repository/DiagnoseRepository";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import PrescriptionService from "./PrescriptionService";
import {Diagnose} from "@prisma/client";
import {Builder} from "builder-pattern";

export default class DiagnoseService{
    private diagnoseRepository: DiagnoseRepository
    private prescriptionService: PrescriptionService

    constructor() {
        this.diagnoseRepository = new DiagnoseRepository()
        this.prescriptionService = new PrescriptionService()
    }

    public async createDiagnose(request: AddDiagnoseRequest): Promise<boolean>{
        try {
            return await this.prescriptionService.createNewPrescription(request.prescription)
                .then(async (prescriptionId: number) => {
                    const newDiagnose: Diagnose = this.constructDiagnose(request, prescriptionId)
                    return await this.diagnoseRepository.createDiagnose(newDiagnose)
                }).then((): boolean => true)
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