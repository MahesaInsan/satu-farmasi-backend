import {Request, Response} from "express";
import PatientService from "../service/PatientService";
import {Patient} from "@prisma/client";
import AddPatientRequest from "../model/request/AddPatientRequest";

export default class PatientController{
    private readonly patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    async createNewPatient(req: Request, res: Response){
        try {
            const request: AddPatientRequest = req.body
            return res.status(200).send(await this.patientService.addNewPatient(request))
        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
    }

    async getPatientDropdownOptions(req: Request, res: Response){
        try{
            const patientList: Patient[] = await this.patientService.fetchPatient()
            res.status(200).send(patientList);
        } catch (error) {
            res.status(400).send(error)
        }
    }
}