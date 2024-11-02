import { Classification } from "@prisma/client";
import BaseController from "./BaseController";
import AddClassificationRequest from "../model/request/AddClassificationRequest";
import ClassificationService from "../service/ClassificationService";
import { Request, Response } from "express";
import BaseResponse from "../model/response/BaseResponse";

export default class ClassificationController extends BaseController {
    private readonly classificationService: ClassificationService;
    constructor() {
        super();
        this.classificationService = new ClassificationService();
    }

    async getClassification(req: Request, res: Response) {
        try {
            const label: string = req.query.label as string;
            const totalClassification: number = label
                ? await this.classificationService.getTotalClassificationByLabel(label)
                : await this.classificationService.getTotalClassifications();

            const pagination = this.getPagination(totalClassification, req);
            const classifications: Classification[] = label
                ? await this.classificationService.getClassificationByLabel(pagination.limit, pagination.startIndex, label)
                : await this.classificationService.getAllClassifications(pagination.limit, pagination.startIndex);

            pagination.results = classifications;
            pagination.total = totalClassification;
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async addClassification(req: Request, res: Response) {
        try {
            this.validateData(req);
            const request: AddClassificationRequest = req.body;
            const result = await this.classificationService.addClassification(request);
            res.status(200).send(new BaseResponse().ok(result));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async editClassification(req: Request, res: Response) {
        try {
            this.validateData(req);
            const result: Classification = await this.classificationService.editClassification(req.body);
            res.status(200).send(new BaseResponse().ok(result));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async deleteClassification(req: Request, res: Response) {
        try {
            this.validateData(req);
            const result: Classification = await this.classificationService.deleteClassification(req.body);
            res.status(200).send(new BaseResponse().ok(result));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
