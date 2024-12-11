import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import CreateMedicineHelper from "./helper/CreateMedicineHelper";
import GenericNameRepository from "../repository/GenericNameRepository";
import { Builder } from "builder-pattern";
import EditGenericNameHelper from "./helper/EditGenericNameHelper";
import EditGenericNameRequest from "../model/request/editGenericNameRequest";
import GenericDropdownVO from "../model/VOs/GenericDropdownVO";
import MedicineService from "./MedicineService";
import MedicineRepository from "../repository/MedicineRepository";

export default class GenericNameService {
    private readonly genericNameRepository: GenericNameRepository;
    private readonly medicineRepository: MedicineRepository;
    private readonly createMedicineHelper: CreateMedicineHelper<AddGenericNameRequest, GenericName>;
    private readonly editGenericNameHelper: EditGenericNameHelper<EditGenericNameRequest, GenericName>;
    private readonly medicineService: MedicineService;

    constructor() {
        this.genericNameRepository = new GenericNameRepository();
        this.medicineService = new MedicineService();
        this.medicineRepository = new MedicineRepository();
        this.createMedicineHelper = new CreateMedicineHelper<AddGenericNameRequest, GenericName>();
        this.editGenericNameHelper = new EditGenericNameHelper<EditGenericNameRequest, GenericName>();
    }

    public async getTotalGenericName(): Promise<number>{
        try {
            return await this.genericNameRepository.getTotalGenericName();
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getTotalGenericNameByLabel(label: string): Promise<number>{
        try {
            return await this.genericNameRepository.getTotalGenericNameByLabel(label);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getAllGenericName(limit: number, startIndex: number): Promise<GenericName[]>{
        try {
            return await this.genericNameRepository.getAllGenericName(limit, startIndex);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getGenericNameDropdown(medicineCode?: string): Promise<GenericDropdownVO[]>{
        try {
            let genericNameId: number | undefined;
            if (medicineCode) {
                const medicine = await this.medicineRepository.getMedicineByCode(medicineCode)
                if (medicine) {
                    genericNameId = medicine.genericName.id
                }
            }
            return await this.genericNameRepository.getGenericNameDropdown(genericNameId)
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getGenericNameById(id: number): Promise<GenericName | null>{
        try {
            return await this.genericNameRepository.getGenericNameById(id);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getGenericNameByLabel(limit: number, startIndex: number, label: string): Promise<GenericName[]>{
        try {
            return await this.genericNameRepository.getGenericNameByLabel(limit, startIndex,label);
        } catch (error) {
            throw new Error(error as string);
        }
    }
    
    public async addGenericName(request: AddGenericNameRequest): Promise<boolean>{
        try {
            await this.validateDuplicate(request.value)
            const genericName: GenericName = this.createMedicineHelper.createGenericName(request);
            return await this.genericNameRepository.addGenericName(Builder(genericName).label(request.label).value(request.value).build())
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async editGenericName(request: EditGenericNameRequest): Promise<boolean>{
        try { 
            const genericName: GenericName = this.editGenericNameHelper.editGenericName(request);
            await this.validateDuplicate(genericName.value, genericName.id)
            const success =
                await this.genericNameRepository.editGenericName(Builder(genericName).id(request.id).label(request.label).value(request.value).build())
            this.medicineService.updateMedicineCode(genericName.id, genericName.value.toUpperCase(), request.value.toUpperCase())
            return success
        } catch (err) {
            throw new Error(err as string);
        }
    }

    public async deleteGenericName(request: EditGenericNameRequest): Promise<boolean>{
        try {
            const genericName: GenericName = this.editGenericNameHelper.editGenericName(request);
            return await this.genericNameRepository.editGenericName(Builder(genericName).id(request.id).label(request.label).value(request.value).is_active(request.isActive).build())
        } catch (error) {
            throw new Error(error as string);
        }
    }

    private async validateDuplicate(newGenericName: string, genericNameId?: number) {
        try {
            const genericName: GenericName | null =  await this.genericNameRepository
                .findIfExistByValueExceptById(newGenericName, genericNameId);

            if (genericName) {
                throw new Error("Generic name with the same value already exist")
            }
        } catch (error) {
            throw new Error(error as string)
        }
    }
}
