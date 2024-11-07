import ReceiveMedicineService from "../service/ReceiveMedicineService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import {Request, Response} from "express";
import AddReceiveMedicineRequest from "../model/request/AddReceiveMedicineRequest";

export default class ReceiveMedicineController extends BaseController {
    private readonly receiveMedicineService: ReceiveMedicineService;

    constructor() {
        super();
        this.receiveMedicineService = new ReceiveMedicineService();
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
}