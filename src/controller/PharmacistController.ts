import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import PharmacistService from "../service/PharmacistService";
import AddPharmacistRequest from "../model/request/AddPharmacistRequest";
import { Pharmacist } from "@prisma/client";

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
            const createdPharmacist: Pharmacist = await this.pharmacistService.addPharmacist(request)
            res.status(200).send(this.responseHelper.constructAddPharmacistResponse(createdPharmacist));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}