import MedicineReportVo from "../model/VOs/TodayMedicineReportVO";
import MedicineReportService from "../service/MedicineReportService";
import BaseController from "./BaseController";
import { Request, Response } from "express";
import BaseResponse from "../model/response/BaseResponse";

export default class MedicineReportController extends BaseController {
    private readonly reportService: MedicineReportService;
    constructor() {
        super();
        this.reportService = new MedicineReportService();
    }

    async getTodayUnFinalizedMedicineReport(req: Request, res: Response) {
        try {
            const report: MedicineReportVo | null =
                await this.reportService.getTodayUnFinalizedMedicineReport();
            res.status(200).send(
                new BaseResponse().ok(
                    report,
                    "Successfully Get Today Unfinalized Medicine Report",
                ),
            );
        } catch (error) {
            const { defaultErrorMsg, errors } =
                new BaseResponse().constructErrorHandler(error as object);
            return res
                .status(400)
                .send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async finalizeReport(req: Request, res: Response) {
        try {
            const finalized: boolean = await this.reportService.finalizeReport(
                parseInt(req.params.id),
            );
            res.status(200).send(
                new BaseResponse().ok(
                    finalized,
                    "Successfully Finalize Report",
                ),
            );
        } catch (error) {
            const { defaultErrorMsg, errors } =
                new BaseResponse().constructErrorHandler(error as object);
            return res
                .status(400)
                .send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getExpiredMedicine(req: Request, res: Response) {
        try {
            const reportDate: Date = new Date(req.params.reportDate as string)
            res.status(200).send(
                new BaseResponse().ok(
                    await this.reportService.checkExpiredMedicine(reportDate),
                    "Successfully GetE",
                ),
            );
        } catch (error) {
            const { defaultErrorMsg, errors } =
                new BaseResponse().constructErrorHandler(error as object);
            return res
                .status(400)
                .send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getAllMedicineReports(req: Request, res: Response) {
        try {
            const totalData =
                await this.reportService.getTotalMedicineReports();
            const pagination = this.getPagination(totalData, req);
            const reports: MedicineReportVo[] =
                await this.reportService.getAllMedicineReports(
                    pagination.limit,
                    pagination.startIndex,
                );
            pagination.results = reports;
            pagination.total = totalData;
            return res
                .status(200)
                .send(
                    new BaseResponse().ok(
                        this.responseHelper.constructPaginationResponse(
                            pagination,
                        ),
                        "Successfully Get All Medicine Reports",
                    ),
                );
        } catch (error) {
            const { defaultErrorMsg, errors } =
                new BaseResponse().constructErrorHandler(error as object);
            return res
                .status(400)
                .send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getMedicineReportById(req: Request, res: Response) {
        try {
            const medicineId = req.params.id;
            const report: MedicineReportVo | null =
                await this.reportService.getMedicineReportById(
                    parseInt(medicineId),
                );
            res.status(200).send(
                new BaseResponse().ok(
                    report,
                    "Successfully Get Medicine Report By Id",
                ),
            );
        } catch (error) {
            const { defaultErrorMsg, errors } =
                new BaseResponse().constructErrorHandler(error as object);
            return res
                .status(400)
                .send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
