import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import PharmacistService from "../service/PharmacistService";
import AddPharmacistRequest from "../model/request/AddPharmacistRequest";
import { Pharmacist } from "@prisma/client";
import BaseResponse from "../model/response/BaseResponse";

export default class PharmacistController{
    private readonly pharmacistService: PharmacistService
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.pharmacistService = new PharmacistService();
        this.responseHelper = new ResponseHelper();
    }

    async addPharmacist(req: Request, res: Response){
        try{
            const request: AddPharmacistRequest = req.body;
            console.log("request: ", request);
            // TODO: change response to boolean
            const createdPharmacist: Pharmacist = await this.pharmacistService.addPharmacist(request)
            res.status(200).send(this.responseHelper.constructAddPharmacistResponse(createdPharmacist));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
