import {Request, Response} from "express";
import PharmacistService from "../service/PharmacistService";
import AddPharmacistRequest from "../model/request/AddPharmacistRequest";
import BaseController from "./BaseController";
import BaseResponse from "../model/response/BaseResponse";

export default class PharmacistController extends BaseController{
    private readonly pharmacistService: PharmacistService

    constructor() {
		super();
        this.pharmacistService = new PharmacistService();
    }

    async addPharmacist(req: Request, res: Response){
        try{
            console.log("req from pharmacist: ", req.body)
            this.validateData(req);
            const request: AddPharmacistRequest = req.body;
            const createdPharmacist: boolean = await this.pharmacistService.addPharmacist(request)
             res.status(200).send(new BaseResponse().ok(createdPharmacist, "Pharmacist added successfully"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
