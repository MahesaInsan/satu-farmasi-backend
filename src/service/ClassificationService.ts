import { Classification } from "@prisma/client";
import AddClassificationRequest from "../model/request/AddClassificationRequest";
import ClassificationRepository from "../repository/ClassificationRepository";
import ClassificationHelper from "./helper/ClassificationHelper";
import EditClassificationRequest from "../model/request/EditClassificationRequest";

export default class ClassificationService {
    private readonly classificationRepository: ClassificationRepository;
    private readonly classificationHelper: ClassificationHelper;

    constructor() {
        this.classificationRepository = new ClassificationRepository();
        this.classificationHelper = new ClassificationHelper();
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

}
