import OutputMedicineService from "../service/OutputMedicineService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import { Request, Response } from "express";
import PaginationRequest from "../model/request/PaginationRequest";

export default class OutputMedicineController extends BaseController {
    private readonly outputMedicineService: OutputMedicineService;

    constructor() {
        super();
        this.outputMedicineService = new OutputMedicineService();
    }

    public async getAllOutputMedicines(req: Request, res: Response) {
        try {
            const params: string = req.query.params as string;
            const totalData: number = params
                ? await this.outputMedicineService.getTotalOutputMedicineBySearch(params)
                : await this.outputMedicineService.getTotalOutputMedicines() ?? 0;

            const pagination: PaginationRequest = this.getPagination(totalData, req);

            const outputMedicines = params
                ? await this.outputMedicineService.getOutputMedicineBySearch(params, pagination.limit, pagination.startIndex)
                : await this.outputMedicineService.getAllOutputMedicines(pagination.limit, pagination.startIndex);

            pagination.results = outputMedicines;
            pagination.total = totalData;

            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async getOutputMedicineById(req: Request, res: Response) {
        try {
            const outputMedicine = await this.outputMedicineService.getOutputMedicineById(Number(req.params.id));
            return res.status(200).send(new BaseResponse().ok(outputMedicine));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async createOutputMedicine(req: Request, res: Response) {
        try {
            // TODO: add validation
            await this.outputMedicineService.addOutputMedicine(req.body);
            return res.status(200).send(new BaseResponse().ok("Succeed create output medicine"));
        } catch (error) {
            console.log("[src][controller][MedicineController][createMedicine] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async editOutputMedicine(req: Request, res: Response) {
        try {
            await this.outputMedicineService.editOutputMedicine(req.body);
            return res.status(200).send(new BaseResponse().ok("Succeed edit output medicine"));
        } catch (error) {
            console.log("[src][controller][MedicineController][createMedicine] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async deleteOutputMedicine(req: Request, res: Response) {
        try {
            await this.outputMedicineService.deleteOutputMedicine(req.body);
            return res.status(200).send(new BaseResponse().ok("Succeed delete output medicine"));
        } catch (error) {
            console.log("[src][controller][MedicineController][createMedicine] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }
}
