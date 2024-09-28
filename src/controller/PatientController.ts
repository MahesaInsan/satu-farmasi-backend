import {Response} from "express";
import PatientService from "../service/PatientService";
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
}
