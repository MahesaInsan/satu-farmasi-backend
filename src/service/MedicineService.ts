import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"

export default class MedicineService{
    private readonly medicineRepository: MedicineRepository;

    constructor() {
        this.medicineRepository = new MedicineRepository();
    }

    public async getAllMedicineList(): Promise<MedicineDropdownVO[]>{
        return await this.medicineRepository.fetchMedicineList()
    }

}