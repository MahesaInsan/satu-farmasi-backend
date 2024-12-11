import { Classification } from "@prisma/client";
import AddClassificationRequest from "../model/request/AddClassificationRequest";
import ClassificationRepository from "../repository/ClassificationRepository";
import ClassificationHelper from "./helper/ClassificationHelper";
import EditClassificationRequest from "../model/request/EditClassificationRequest";
import MedicineRepository from "../repository/MedicineRepository";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";

export default class ClassificationService {
    private readonly classificationRepository: ClassificationRepository;
    private readonly classificationHelper: ClassificationHelper;
    private readonly medicineRepository: MedicineRepository;

    constructor() {
        this.classificationRepository = new ClassificationRepository();
        this.classificationHelper = new ClassificationHelper();
        this.medicineRepository = new MedicineRepository();
    }

  public async getTotalClassifications(): Promise<number> {
    try {
      return await this.classificationRepository.getTotalClassifications();
    } catch (error) {
      throw new Error(error as string);
    }
  }

  public async getTotalClassificationByLabel(label: string): Promise<number> {
    try {
      return await this.classificationRepository.getTotalClassificationByLabel(label);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  public async getAllClassifications(limit: number, startIndex: number): Promise<Classification[]> {
    try {
      return await this.classificationRepository.getAllClassifications(limit, startIndex);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  public async getClassificationById(id: number): Promise<Classification | null> {
    try {
      return await this.classificationRepository.getClassificationById(id);
    } catch (error) {
      throw new Error(error as string);
    }
  }

    public async addClassification(request: AddClassificationRequest): Promise<Classification>{
        try {
            await this.validateIfDuplicate(request.value)
            const classification: Classification = this.classificationHelper.createClassification(request);
            return await this.classificationRepository.addClassification(classification);
        } catch (error) {
            throw new Error(error as string);
        }
    }

  public async getClassificationByLabel(limit: number, startIndex: number, label: string): Promise<Classification[]> {
    try {
      return await this.classificationRepository.getClassificationByLabel(limit, startIndex, label);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  public async editClassification(request: EditClassificationRequest): Promise<Classification> {
    try {
      await this.validateIfDuplicate(request.value, request.id)
      const classification: Classification = this.classificationHelper.editClassification(request);
      return await this.classificationRepository.editClassification(classification);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  public async deleteClassification(request: EditClassificationRequest): Promise<Classification> {
    try {
      const classification: Classification = this.classificationHelper.editClassification(request);
      return await this.classificationRepository.editClassification(classification);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  public async getClassificationsDropdown(medicineCode?: string): Promise<Classification[]> {
	  try {
        let classificationId: number[] = []
        if (medicineCode) {
            const medicine: MedicineDisplayVO | null = await this.medicineRepository.getMedicineByCode(medicineCode);
            if (medicine) {
                for (const item of medicine.classifications) {
                    classificationId?.push(item.classification.id)
                }
            }
        }
        console.log("classificationId", classificationId);
		return await this.classificationRepository.getClassificationsDropdown(classificationId);
	  } catch (error) {
		  throw new Error(error as string);
	  }
  }

  private async validateIfDuplicate(value: string, id?: number) {
      try {
        const classification: Classification | null = await this.classificationRepository
            .findIfExistByValueExceptById(value, id);
        if (classification) {
          throw new Error("Classification by this value already exist")
        }
      } catch (error) {
        throw error as string
      }
  }

}
