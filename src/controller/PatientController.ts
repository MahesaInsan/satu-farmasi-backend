import {Response} from "express";
import PatientService from "../service/PatientService";
import {Patient} from "@prisma/client";
import AddPatientRequest from "../model/request/AddPatientRequest";
import BaseResponse from "../model/response/BaseResponse";

export default class PatientController{
    private readonly patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    async getPatientDropdownOptions(res: Response){
        try{
            console.log("#getPatientDropdownOptions");
            const patientByPatientId = await this.patientService.fetchPatient()
            res.status(200).send(Object.fromEntries(patientByPatientId));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getTotalPateint(req: Request, res: Response) {
        try {
            const result: number = await this.patientService.getTotalPatient()
            return res.status(200).send(new BaseResponse().ok(result, "Succeed get total patient"))
        } catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }
}
