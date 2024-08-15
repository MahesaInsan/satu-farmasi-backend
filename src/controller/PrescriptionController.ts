import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import PrescriptionService from "../service/PrescriptionService";
import BaseResponse from "../model/response/BaseResponse";

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

}