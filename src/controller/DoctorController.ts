import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import DoctorService from "../service/DoctorService";
import AddDoctorRequest from "../model/request/AddDoctorRequest";
import { validationResult } from "express-validator";
import BaseResponse from "../model/response/BaseResponse";
import { User } from "@prisma/client";

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
            const createdDoctor: User = await this.doctorService.addDoctor(request)
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructAddDoctorResponse(createdDoctor), "Dokter Berhasil Ditambahkan"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
