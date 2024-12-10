import {Request, Response} from "express";
import AddDiagnoseRequest from "../model/request/AddDiagnoseRequest";
import DiagnoseService from "../service/DiagnoseService";
import BaseResponse from "../model/response/BaseResponse";
import {User} from "@prisma/client";
import BaseController from "./BaseController";
import GetDiagnoseSummaryRequest from "../model/request/GetDiagnoseSummaryRequest";

export default class DiagnoseController extends BaseController{
    private readonly diagnoseService: DiagnoseService

    constructor() {
        super()
        this.diagnoseService = new DiagnoseService();
    }

    public async diagnosePatient(req: Request, res: Response){
        try {
            const request: AddDiagnoseRequest = req.body.data
            console.log("#diagnosePatient with request: ", request)
            console.log("medicineList: ", request.prescription.medicineList)
            return res.status(200).send(new BaseResponse().ok(await this.diagnoseService.createDiagnose(request), "Successfully create diagnose"))
        } catch (error) {
            console.log(error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getDiagnoseSummary(req: Request, res: Response){
        try {
            console.log("#getDiagnoseSummary with request: ", req.body.data)
            const request: GetDiagnoseSummaryRequest = req.body.data
            const [totalData, doctor]: [number, User | null] = await this.diagnoseService.getDiagnoseCount(request.doctorEmail,
                request.patientName)
            const pagination = this.getPagination(totalData, req)
            pagination.results = await this.diagnoseService.getDiagnoseSummary(doctor?.id!, pagination, request.patientName)
            pagination.total = totalData
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            console.error("error when #getDiagnoseSummary with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getDiagnoseDetail(req: Request, res: Response) {
        try {
            console.log("#getDiagnoseDetail with request:", req.params.id)
            return res.status(200).send(new BaseResponse().ok(await this.diagnoseService.getDiagnoseDetail(parseInt(req.params.id))))
        } catch (error) {
            console.error("error when #getDiagnoseDetail with error:", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
