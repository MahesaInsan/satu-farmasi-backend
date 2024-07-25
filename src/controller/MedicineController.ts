import MedicineService from "../service/MedicineService";
import {Request, Response} from "express";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import AddGenericNameRequest from "../model/request/AddGenericName";
import { GenericName } from "@prisma/client";
import ResponseHelper from "./ResponseHelper/ResponseHelper";

export default class MedicineController{
    private readonly medicineService: MedicineService
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.medicineService = new MedicineService();
        this.responseHelper = new ResponseHelper();
    }

    async getMedicineList(req: Request, res: Response){
        try{
            const medicineDropdownOption: MedicineDropdownVO[] = await this.medicineService.getAllMedicineList()
            res.status(200).send(medicineDropdownOption);
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async addGenericName(req: Request, res: Response){
        try{
            const request: AddGenericNameRequest = req.body;
            const createdGenericName: GenericName = await this.medicineService.addGenericName(request)
            res.status(200).send(createdGenericName);
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}