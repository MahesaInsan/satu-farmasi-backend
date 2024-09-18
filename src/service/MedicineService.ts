import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import { GenericName, Medicine, MedicineHasClassification, UnitOfMeasure } from "@prisma/client";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import { Builder } from "builder-pattern";
import GetMedicineRequest from "../model/request/GetMedicineRequest";
import GenericNameService from "./GenericNameService";
import EditMedicineRequest from "../model/request/EditMedicineRequest";
import MedicineCheckStockVO from "../model/VOs/MedicineCheckStockVO";
import AddMedicineClassificationRequest from "../model/request/AddMedicineClassificationRequest";
import MedicineHasClassificationRepository from "../repository/MedicineHasClassificationRepository";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";

export default class MedicineService{
    private readonly medicineRepository: MedicineRepository;
    private readonly genericNameService: GenericNameService;
    private readonly medicineHasClassificationRepository: MedicineHasClassificationRepository;

    constructor() {
        this.medicineRepository = new MedicineRepository();
        this.genericNameService = new GenericNameService();
        this.medicineHasClassificationRepository = new MedicineHasClassificationRepository();
    }

    public async getAllMedicineList(): Promise<MedicineDropdownVO[]>{
        return await this.medicineRepository.fetchMedicineList()
    }

    public async getTotalMedicines(): Promise<number>{
        try {
            return await this.medicineRepository.getTotalMedicines();
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalSearchMedicines(parameter: string): Promise<number> {
        try {
            return await this.medicineRepository.getTotalSearchMedicines(parameter);
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalMedicineByCode(code: string): Promise<number> {
        try {
            return await this.medicineRepository.getTotalMedicineByCode(code);
        } catch (error) {
            throw error as string;
        }
    }
    
    public async getAllMedicines(startIndex: number, limit: number): Promise<MedicineDisplayVO[]> {
        try {
            return await this.medicineRepository.getMedicines(startIndex, limit);
        } catch (error) {
            throw error as string;
        }
    }
    
    public async getMedicineById(id: number): Promise<Medicine | null> {
        try {
            return await this.medicineRepository.getMedicineById(id);
        } catch (error) {
            throw error as string;
        }
    }

    public async getMedicineByCode(code: string): Promise<MedicineDisplayVO | null> {
        try {
            return await this.medicineRepository.getMedicineByCode(code);
        } catch (error) {
            throw error as string;
        }
    }

    public async searchMedicines(startIndex: number, limit: number, parameter: string): Promise<MedicineDisplayVO[]> {
        try {
            return await this.medicineRepository.searchMedicines(startIndex, limit, parameter);
        } catch (error) {
            throw error as string;
        }
    }

    public async createMedicine(request: AddMedicineRequest): Promise<MedicineDisplayVO> {
        try {
            request.code = await this.generateMedicineCode(request.genericNameId);
            const medicine: Medicine = this.constructMedicine(request);
            return await this.medicineRepository.createMedicine(medicine)
                .then(async (newMedicine: MedicineDisplayVO): Promise<MedicineDisplayVO> => {
                    await this.createNewMedicineHasClassification(request.classificationList, newMedicine.id);
                    return newMedicine;
                });
        } catch (error) {
            throw error as string;
        }
    }

    public async createNewMedicineHasClassification(classificationList: AddMedicineClassificationRequest[], medicineId: number) {
        try {
            const newMedicineHasClassification: MedicineHasClassification[] = classificationList
                .map((classification: AddMedicineClassificationRequest) => {
                    return this.constructMedicineHasClassification(classification.classificationId, medicineId);
                })
                console.log("newMedicineClassification: ", newMedicineHasClassification);
            return await this.medicineHasClassificationRepository.createMedicineHasClassification(newMedicineHasClassification);
        } catch (error) {
            throw error as string;
        }
    }

    public async editMedicine(request: EditMedicineRequest): Promise<MedicineDisplayVO> {
        try {
            const oldMedicine: Medicine | null = await this.getMedicineById(request.id);    
            if (!oldMedicine) throw new Error("Medicine not found");
            
            request.code = oldMedicine && oldMedicine.genericNameId === request.genericNameId
                ? request.code
                : await this.generateMedicineCode(request.genericNameId);

            const medicine: Medicine = this.constructEditMedicine(request);
            return await this.medicineRepository.editMedicine(medicine)
            .then(async (newMedicine: MedicineDisplayVO): Promise<MedicineDisplayVO> => {
                    await this.medicineHasClassificationRepository.deleteMedicineHasClassification(request.id);
                    await this.createNewMedicineHasClassification(request.classificationList, request.id);
                    return newMedicine;
                })
        } catch (error) {
            throw error as string;
        }
    }

    public async addStock(id: number, currStock: number): Promise<boolean> {
        try {
            const medicine: Medicine | null = await this.getMedicineById(id);
            if (!medicine) throw new Error("Medicine not found");
            medicine.currStock += currStock;
            if (medicine.currStock > medicine.maxStock) throw new Error("Max stock reached");
            return await this.medicineRepository.editMedicine(medicine) != null;
        } catch (error) {
            throw error as string;
        }
    }

    public async checkStock(id: number): Promise<MedicineCheckStockVO> {
        try {
            const medicine: Medicine | null = await this.getMedicineById(id);
            if (!medicine) throw new Error("Medicine not found");

            const vo: MedicineCheckStockVO = { isReady: true, flag: -1 };
            if (medicine.currStock == medicine.minStock) vo.flag = 0;
            else if (medicine.currStock > medicine.minStock && medicine.currStock <= medicine.maxStock) vo.flag = 1;
            
            return vo;
        } catch (error) {
            throw error as string;
        }
    }

    public async deleteMedicine(id: number): Promise<MedicineDisplayVO> {
        try {
            const medicine: Medicine | null = await this.getMedicineById(id);
            if (!medicine) throw new Error("Medicine not found");
            medicine.is_active = false;
            return await this.medicineRepository.editMedicine(medicine);
        } catch (error) {
            throw error as string;
        }
    }

    public async checkExpiration(date: Date): Promise<Medicine[]> {
        try {
            // const expiredDate: string = date.toString();
            return await this.medicineRepository.checkExpiration(date);
        } catch (error) {
            throw error as string;
        }
    }

    // ganti jadi count all (jangan spesifik per generic name)
    private async generateMedicineCode(genericNameId: number): Promise<string> {
        try {
            const genericName: GenericName | null = await this.genericNameService.getGenericNameById(genericNameId);
            if (!genericName) throw new Error("Generic name not found");

            console.log(genericName.value);
            const totalMedicine: number = await this.getTotalMedicineByCode(genericName.value);
            const formatNumber: string = (totalMedicine + 1).toString().padStart(6, "0");
            console.log("medicine code: ", formatNumber);

            return `${genericName.value}-${formatNumber}`
        } catch (error) {
            throw error as string;
        }
    }

    private constructMedicine(request: AddMedicineRequest): Medicine {
        return Builder<Medicine>()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .code(request.code)
            .name(request.name)
            .genericNameId(request.genericNameId)
            .merk(request.merk)
            .description(request.description)
            .unitOfMeasure(UnitOfMeasure.MILLIGRAM)
            .price(request.price)
            .expiredDate(request.expiredDate)
            .packagingId(request.packagingId)
            .currStock(request.currStock)
            .minStock(request.minStock)
            .maxStock(request.maxStock)
            .sideEffect(request.sideEffect)
            .build();
    }

    private constructEditMedicine(request: EditMedicineRequest): Medicine {
        return Builder<Medicine>()
            .id(request.id)
            .code(request.code)
            .name(request.name)
            .merk(request.merk)
            .description(request.description)
            .unitOfMeasure(request.unitOfMeasure)
            .price(request.price)
            .expiredDate(request.expiredDate)
            .packagingId(request.packagingId)
            .genericNameId(request.genericNameId)
            .currStock(request.currStock)
            .minStock(request.minStock)
            .maxStock(request.maxStock)
            .sideEffect(request.sideEffect)
            .is_active(request.isActive)
            .created_at(request.createdAt)
            .updated_at(new Date())
            .build();
    }

    private constructMedicineHasClassification(classificationId: number, medicineId: number): MedicineHasClassification {
        return Builder<MedicineHasClassification>()
            .medicineId(medicineId)
            .classificationId(classificationId)
            .build();
    }
    public async decreaseMedicineStock(medicineId: number, quantity: number){
        await this.medicineRepository.decreaseStock(medicineId, quantity)
    }

    public async getMedicineValidationList(medicineIdList: number[]) {
        return await this.medicineRepository.getMedicineIdIn(medicineIdList)
    }
}