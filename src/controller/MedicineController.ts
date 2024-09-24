import MedicineService from "../service/MedicineService";
import {Request, Response} from "express";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
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
            console.log("#getMedicineDropdownOption")
            const medicineDropdownOption: Map<number, MedicineDropdownVO> = await this.medicineService.getAllMedicineList()
            res.status(200).send(Object.fromEntries(medicineDropdownOption));
        } catch (error) {
            res.status(400).send("error")
            throw new Error(error as string)
        }
    }
}