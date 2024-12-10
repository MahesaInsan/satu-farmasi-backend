import {Request, Response} from "express";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import DiagnoseService from "../service/DiagnoseService";
import BaseResponse from "../model/response/BaseResponse";

export default class DiagnoseController {
    private readonly diagnoseService: DiagnoseService

    constructor() {
        this.diagnoseService = new DiagnoseService();
    }

    async diagnosePatient(req: Request, res: Response){
        try {
            const request: AddDiagnoseRequest = req.body.data
            console.log("#diagnosePatient with request: ", request)
            console.log("medicineList: ", request.prescription.medicineList)
            return res.status(200).send(new BaseResponse().ok(await this.diagnoseService.createDiagnose(request), "Diagnosis Berhasil Dibuat!"))
        } catch (error) {
            console.log(error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
