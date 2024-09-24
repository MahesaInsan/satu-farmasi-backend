import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import {Medicine} from "@prisma/client";

export default class MedicineService{
    private readonly medicineRepository: MedicineRepository;

    constructor() {
        this.medicineRepository = new MedicineRepository();
    }

    public async getAllMedicineList(): Promise<Map<number, MedicineDropdownVO>>{
        return await this.mapMedicineDropdownList(await this.medicineRepository.fetchMedicineList());
    }

    public async decreaseMedicineStock(medicineId: number, quantity: number){
        await this.medicineRepository.decreaseStock(medicineId, quantity)
    }

    public async increaseMedicineStock(medicineId: number, quantity: number){
        await this.medicineRepository.increaseStock(medicineId, quantity)
    }

    public async getMedicineValidationList(medicineIdList: number[]) {
        return this.medicineRepository.getMedicineIdIn(medicineIdList);
    }

    private async mapMedicineDropdownList(medicineList: MedicineDropdownVO[]) {
        return medicineList.reduce((medicineByMedicineId, medicine) => {
            medicineByMedicineId.set(medicine.id, medicine)
            return medicineByMedicineId
        }, new Map<number, MedicineDropdownVO>)
    }
}