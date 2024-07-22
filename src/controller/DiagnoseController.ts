import {Request, Response} from "express";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import DiagnoseService from "../service/DiagnoseService";

export default class DiagnoseController {
    private readonly diagnoseService: DiagnoseService

    constructor() {
        this.diagnoseService = new DiagnoseService();
    }

    async diagnosePatient(req: Request, res: Response){
        try {
            const request: AddDiagnoseRequest = req.body.data
            console.log(request)
            return res.status(200).send(await this.diagnoseService.createDiagnose(request))
        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
    }
}