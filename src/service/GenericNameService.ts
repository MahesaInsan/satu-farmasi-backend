import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import CreateMedicineHelper from "./helper/CreateMedicineHelper";
import GenericNameRepository from "../repository/GenericNameRepository";
import { Builder } from "builder-pattern";
import EditGenericNameHelper from "./helper/EditGenericNameHelper";
import EditGenericNameRequest from "../model/request/editGenericNameRequest";

export default class GenericNameService {
    private readonly genericNameRepository: GenericNameRepository;
    private readonly createMedicineHelper: CreateMedicineHelper<AddGenericNameRequest, GenericName>;
    private readonly editGenericNameHelper: EditGenericNameHelper<EditGenericNameRequest, GenericName>;

    constructor() {
        this.genericNameRepository = new GenericNameRepository();
        this.createMedicineHelper = new CreateMedicineHelper<AddGenericNameRequest, GenericName>();
        this.editGenericNameHelper = new EditGenericNameHelper<EditGenericNameRequest, GenericName>();
    }

    public async addGenericName(request: AddGenericNameRequest): Promise<GenericName>{
    try {
            const genericName: GenericName = this.createMedicineHelper.createGenericName(request);
            return await this.genericNameRepository.addGenericName(Builder(genericName).label(request.label).value(request.value).build())
        } catch (error) {
            throw error as string;
        }
    }

    public async editGenericName(request: EditGenericNameRequest): Promise<GenericName>{
        try { 
            const genericName: GenericName = this.editGenericNameHelper.editGenericName(request);
            return await this.genericNameRepository.editGenericName(Builder(genericName).id(request.id).label(request.label).value(request.value).build())
        } catch (err) {
            throw err as string;
        }
    }

    public async deleteGenericName(id: number): Promise<Boolean>{
        try {
            return await this.genericNameRepository.deleteGenericName(id);
        } catch (error) {
            throw error as string;
        }
    }
}