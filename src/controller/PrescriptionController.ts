import {Request, Response} from "express";
import PrescriptionService from "../service/PrescriptionService";
import BaseResponse from "../model/response/BaseResponse";
import AddPrescriptionRequest from "../model/request/AddPrescriptionRequest";
import EditPrescriptionRequest from "../model/request/EditPrescriptionRequest";
import BaseController from "./BaseController";
import {Status} from "@prisma/client";

export default class PrescriptionController extends BaseController{
    private readonly prescriptionService: PrescriptionService;

    constructor() {
        super()
        this.prescriptionService = new PrescriptionService();
    }

    public async getAllPrescription(req: Request, res: Response) {
        try{
            console.log("#getPrescriptionSummary with request: ", req.query)
            const patientName = req.query.name as string | undefined
            const status = Object.values(Status).includes(req.query.status as Status) ? req.query.status as Status : undefined;
            const totalData = await this.prescriptionService.countPrescription(patientName, status)
            const pagination = this.getPagination(totalData,req)
            pagination.results = await this.prescriptionService.getPrescriptionSummary(patientName, status, pagination)
            pagination.total = totalData
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            console.error("error when #getPrescriptionSummary with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getPrescription(req: Request, res: Response) {
        try {
            console.log("#getPrescriptionDetail with request:", req.params.id)
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.getPrescription(parseInt(req.params.id))))
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async addNewPrescription(req: Request, res: Response){
        try {
            console.log("#addNewPrescription with request:", req.body.data)
            const request: AddPrescriptionRequest = req.body.data;
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.addNewPrescription(request), "Successfully added new prescription"))
        } catch (error) {
            console.error("error when #addPrescription with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async editPrescription(req: Request, res: Response){
        try {
            const request: EditPrescriptionRequest = req.body.data;
            console.log("#editPrescription with request:", request);
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.editPrescription(request), "Successfully edited prescription"))
        } catch (error) {
            console.error("error when #editPrescription with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

}
