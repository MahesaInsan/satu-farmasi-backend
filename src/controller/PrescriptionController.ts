import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import PrescriptionService from "../service/PrescriptionService";
import BaseResponse from "../model/response/BaseResponse";
import AddPrescriptionRequest from "../model/request/AddPrescriptionRequest";
import EditPrescriptionRequest from "../model/request/EditPrescriptionRequest";
import RangeMonthRequest from "../model/request/RangeMonthRequest";
import MostSalesMedicineVO from "../model/VOs/MostSalesMedicineVO";

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

    public async getMostSalesMedicineByPrescription(req: Request, res: Response) {
        try {
            console.log("#getMostSalesMedicineByPrescription with request:", req.body)
            const request: RangeMonthRequest = req.body;
            const result = await this.prescriptionService.getMostSalesMedicineByPrescription(request.startDate, request.startDate);
            return res.status(200).send(new BaseResponse().ok(result, "Succeed get most sales medicine by prescription"));
        } catch (error) {
            console.log(error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async addNewPrescription(req: Request, res: Response){
        try {
            console.log("#addNewPrescription with request:", req.body.data)
            const request: AddPrescriptionRequest = req.body.data;
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.addNewPrescription(request)))
        } catch (error) {
            console.error(error)
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async editPrescription(req: Request, res: Response){
        try {
            const request: EditPrescriptionRequest = req.body.data;
            console.log("#editPrescription with request:", request);
            res.status(200).send(new BaseResponse().ok(await this.prescriptionService.editPrescription(request)))
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

}