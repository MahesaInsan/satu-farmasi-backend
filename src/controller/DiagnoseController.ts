import {Request, Response} from "express";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import DiagnoseService from "../service/DiagnoseService";
import PrescriptionRepository from "../repository/PrescriptionRepository";

export default class DiagnoseController {
    private readonly diagnoseService: DiagnoseService
    private readonly prescriptionRepository: PrescriptionRepository

    constructor() {
        this.diagnoseService = new DiagnoseService();
        this.prescriptionRepository = new PrescriptionRepository();
    }

    async diagnosePatient(req: Request, res: Response){
        try {
            const request: AddDiagnoseRequest = req.body
            console.log(request)
            return res.status(200).send(await this.diagnoseService.createDiagnose(request))
        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
    }
}