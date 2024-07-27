import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import CreateMedicineHelper from "./helper/CreateMedicineHelper";
import GenericNameRepository from "../repository/GenericNameRepository";
import { Builder } from "builder-pattern";

export default class GenericNameService {
    private readonly genericNameRepository: GenericNameRepository;
    private readonly createMedicineHelper: CreateMedicineHelper<AddGenericNameRequest, GenericName>;

    constructor() {
        this.genericNameRepository = new GenericNameRepository();
        this.createMedicineHelper = new CreateMedicineHelper<AddGenericNameRequest, GenericName>();
    }

    public async addGenericName(request: AddGenericNameRequest): Promise<GenericName>{
    try {
            const genericName: GenericName = this.createMedicineHelper.createGenericName(request);
            return await this.genericNameRepository.addGenericName(Builder(genericName).label(request.label).value(request.value).build())
        } catch (error) {
            throw error as string;
        }
    }
    
}