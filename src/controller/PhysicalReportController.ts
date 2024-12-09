import PhysicalReportService from "../service/PhysicalReportService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import {Request, Response} from "express";
import PhysicalReportVO from "../model/VOs/PhysicalReportVO";

export default class PhysicalReportController extends BaseController {
    private readonly physicalReportService: PhysicalReportService;

    constructor() {
        super();
        this.physicalReportService = new PhysicalReportService();
    }

    public async getPhysicalReportById(req: Request, res: Response) {
        try {
            const id: number = parseInt(req.params.id);
            const data: PhysicalReportVO | null = await this.physicalReportService.getPhysicalReportById(id);
            res.status(200).send(new BaseResponse().ok(data, "Succeed get data physical report"));
        } catch (error) {
            console.error("error when #getPrescriptionDetail with error:", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}