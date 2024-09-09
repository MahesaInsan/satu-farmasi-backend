import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import PrescriptionService from "../service/PrescriptionService";
import BaseResponse from "../model/response/BaseResponse";
import AddPrescriptionRequest from "../model/request/AddPrescriptionRequest";
import EditPrescriptionRequest from "../model/request/EditPrescriptionRequest";

export default class PrescriptionController {
    private readonly prescriptionService: PrescriptionService;
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.prescriptionService = new PrescriptionService();
        this.responseHelper = new ResponseHelper();
    }

    public async getAllPrescription(req: Request, res: Response) {
        try{
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.getAllPrescriptionList(req.params.username)));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async getPrescription(req: Request, res: Response) {
        try {
            console.log("#getPrescriptionDetail with request:", req.params.id)
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.getPrescription(parseInt(req.params.id))))
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async addNewPrescription(req: Request, res: Response){
        try {
            const request: AddPrescriptionRequest = req.body;
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.addNewPrescription(request)))
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async editPrescription(req: Request, res: Response){
        try {
            console.log("#editPrescription with request:", req.body);
            const request: EditPrescriptionRequest = req.body;
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.editPrescription(request)))
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

}