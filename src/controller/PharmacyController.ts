import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController"
import {Request, Response} from "express";
import PharmacyService from "../service/PharmacyService";
import AddAndEditPharmacyRequest from "../model/request/AddAndEditPharmacyRequest";

export default class PharmacyController extends BaseController {
    private readonly pharmacyService: PharmacyService;

    constructor() {
        super();
        this.pharmacyService = new PharmacyService();
    }

    async getPharmacyInformation(req: Request, res: Response) {
        try {
            console.log("#getPharmacyInformation")
            return res.status(200).send(new BaseResponse().ok(await this.pharmacyService.getPharmacyInformation()));
        } catch (error) {
            console.error("Error when #getPharmacyInformation with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async updatePharmacyInformation(req: Request, res: Response) {
        try {
            console.error("#updatePharmacyInformation with request: ", req.body.data)
            const request: AddAndEditPharmacyRequest = req.body.data;
            res.status(200).send(new BaseResponse().ok(await this.pharmacyService.updatePharmacyInformation(request),
                "Successfully Updated Pharmacy Information"));
        } catch (error) {
            console.error("Error when #updatePharmacyInformation with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
