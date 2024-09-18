import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import DoctorService from "../service/DoctorService";
import AddDoctorRequest from "../model/request/AddDoctorRequest";
import { Doctor } from "@prisma/client";
import { validationResult } from "express-validator";

export default class DoctorController{
    private readonly doctorService: DoctorService
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.doctorService = new DoctorService();
        this.responseHelper = new ResponseHelper();
    }

    async addDoctor(req: Request, res: Response){
        try{
            const result = validationResult(req);
            if(!result.isEmpty()) return res.status(400).send(this.responseHelper.constructBadRequest(result.mapped()));
            const request: AddDoctorRequest = req.body;
            const createdDoctor: Doctor = await this.doctorService.addDoctor(request)
            res.status(200).send(this.responseHelper.constructAddDoctorResponse(createdDoctor));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}
