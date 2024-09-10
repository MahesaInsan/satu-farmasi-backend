import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import CreateMedicineHelper from "./helper/CreateMedicineHelper";
import GenericNameRepository from "../repository/GenericNameRepository";
import { Builder } from "builder-pattern";
import EditGenericNameHelper from "./helper/EditGenericNameHelper";
import EditGenericNameRequest from "../model/request/editGenericNameRequest";
import GenericDropdownVO from "../model/VOs/GenericDropdownVO";

export default class GenericNameService {
    private readonly genericNameRepository: GenericNameRepository;
    private readonly createMedicineHelper: CreateMedicineHelper<AddGenericNameRequest, GenericName>;
    private readonly editGenericNameHelper: EditGenericNameHelper<EditGenericNameRequest, GenericName>;

    constructor() {
        this.genericNameRepository = new GenericNameRepository();
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

    public async getGenericNameDropdown(): Promise<GenericDropdownVO[]>{
        try {
            return await this.genericNameRepository.getGenericNameDropdown();
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
    
    public async addGenericName(request: AddGenericNameRequest): Promise<GenericName>{
    try {
            const genericName: GenericName = this.createMedicineHelper.createGenericName(request);
            return await this.genericNameRepository.addGenericName(Builder(genericName).label(request.label).value(request.value).build())
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async editGenericName(request: EditGenericNameRequest): Promise<boolean>{
        try { 
            const genericName: GenericName = this.editGenericNameHelper.editGenericName(request);
            return await this.genericNameRepository.editGenericName(Builder(genericName).id(request.id).label(request.label).value(request.value).build())
        } catch (err) {
            throw new Error(err as string);
        }
    }

    public async deleteGenericName(id: number): Promise<boolean>{
        try {
            return await this.genericNameRepository.deleteGenericName(id);
        } catch (error) {
            throw new Error(error as string);
        }
    }
}