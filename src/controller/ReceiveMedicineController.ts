import ReceiveMedicineService from "../service/ReceiveMedicineService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import {Request, Response} from "express";
import AddReceiveMedicineRequest from "../model/request/AddReceiveMedicineRequest";
import PaginationRequest from "../model/request/PaginationRequest";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";
import EditReceiveMedicineRequest from "../model/request/EditReceiveMedicineRequest";
import DeleteReceiveMedicineRequest from "../model/request/DeleteReceiveMedicineRequest";

export default class ReceiveMedicineController extends BaseController {
    private readonly receiveMedicineService: ReceiveMedicineService;

    constructor() {
        super();
        this.receiveMedicineService = new ReceiveMedicineService();
    }

    public async getAllReceiveMedicines(req: Request, res: Response) {
        try {
            const parameter: string = req.query.parameter as string;
            const totalReceiveMedicine: number = parameter
                ? await this.receiveMedicineService.getTotalSearchReceiveMedicines(parameter)
                : await this.receiveMedicineService.getTotalReceiveMedicines();

            const pagination: PaginationRequest = this.getPagination(totalReceiveMedicine, req);
            const receiveMedicines: ReceiveMedicineVO[] = parameter
                ? await this.receiveMedicineService.searchReceiveMedicine(pagination.limit, pagination.startIndex, parameter)
                : await this.receiveMedicineService.getAllReceiveMedicines(pagination.limit, pagination.startIndex);

            pagination.results = receiveMedicines;
            pagination.total = totalReceiveMedicine;
            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination), "Succeed fetch receive medicines"));
        } catch (error) {
            console.log("[src][controller][ReceiveMedicineController][getAllReceiveMedicines] : ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
    
    public async getReceiveMedicineById(req: Request, res: Response) {
        try {
            const id: number = parseInt(req.params.id);
            const data: ReceiveMedicineVO | null = await this.receiveMedicineService.getReceiveMedicineById(id);
            return res.status(200).send(new BaseResponse().ok(data, "Succeed get receive medicine by id"));
        } catch (error) {
            console.log("[src][controller][ReceiveMedicineController][getReceiveMedicineById] : ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async createReceiveMedicine(req: Request, res: Response) {
        try {
            const request: AddReceiveMedicineRequest = req.body;
            await this.receiveMedicineService.createReceiveMedicine(request);
            return res.status(200).send(new BaseResponse().ok(null, "Succeed insert receive medicine"));
        } catch (error) {
            console.log("[src][controller][ReceiveMedicineController][createReceiveMedicine] : ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
    
    public async confirmReceiveMedicine(req: Request, res: Response) {
        try {
            const request: EditReceiveMedicineRequest = req.body;
            await this.receiveMedicineService.confirmReceiveMedicine(request);
            return res.status(200).send(new BaseResponse().ok(null, "Succeed confirm receive medicine"));
        } catch (error) {
            console.log("[src][controller][ReceiveMedicineController][confirmReceiveMedicine] : ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
    
    public async deleteReceiveMedicine(req: Request, res: Response) {
        try {
            const request: DeleteReceiveMedicineRequest = req.body;
            console.log("red body: ", req.body);
            console.log("request: ", request);
            await this.receiveMedicineService.deleteReceiveMedicine(request.id);
            return res.status(200).send(new BaseResponse().ok(null, "Succeed delete receive medicine"))
        } catch (error) {
            console.log("[src][controller][ReceiveMedicineController][deleteReceiveMedicine] : ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}