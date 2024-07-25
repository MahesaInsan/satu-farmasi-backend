import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import AddGenericNameRequest from "../model/request/AddGenericName";
import { GenericName } from "@prisma/client";
import CreateMedicineHelper from "./helper/CreateMedicineHelper";
import { Builder } from "builder-pattern";

export default class MedicineService{
    private readonly medicineRepository: MedicineRepository;
    private readonly createMedicineHelper: CreateMedicineHelper<AddGenericNameRequest, GenericName>;

    constructor() {
        this.medicineRepository = new MedicineRepository();
        this.createMedicineHelper = new CreateMedicineHelper<AddGenericNameRequest, GenericName>();
    }

    public async getAllMedicineList(): Promise<MedicineDropdownVO[]>{
        return await this.medicineRepository.fetchMedicineList()
    }

    public async addGenericName(request: AddGenericNameRequest): Promise<GenericName>{
        try {
            const genericName: GenericName = this.createMedicineHelper.createGenericName(request);
            return await this.medicineRepository.addGenericName(Builder(genericName).label(request.label).value(request.value).build())
        } catch (error) {
            throw error as string;
        }
    }
}