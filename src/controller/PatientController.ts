import {Request, Response} from "express";
import PatientService from "../service/PatientService";
import {Patient} from "@prisma/client";
import AddPatientRequest from "../model/request/AddPatientRequest";

export default class PatientController{
    private readonly patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    async getPatientDropdownOptions(req: Request, res: Response){
        try{
            console.log("#getPatientDropdownOptions");
            const patientByPatientId = await this.patientService.fetchPatient()
            res.status(200).send(Object.fromEntries(patientByPatientId));
        } catch (error) {
            res.status(400).send(error)
        }
    }
}