import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import {Medicine} from "@prisma/client";

export default class MedicineService{
    private readonly medicineRepository: MedicineRepository;

    constructor() {
        this.medicineRepository = new MedicineRepository();
    }

    public async getAllMedicineList(): Promise<MedicineDropdownVO[]>{
        return await this.medicineRepository.fetchMedicineList()
    }

    public async decreaseMedicineStock(medicineId: number, quantity: number){
        await this.medicineRepository.decreaseStock(medicineId, quantity)
    }

    public async increaseMedicineStock(medicineId: number, quantity: number){
        await this.medicineRepository.increaseStock(medicineId, quantity)
    }

    public async getMedicineValidationList(medicineIdList: number[]) {
        return await this.medicineRepository.getMedicineIdIn(medicineIdList)
    }
}