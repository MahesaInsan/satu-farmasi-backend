import {Request, Response} from "express";
import TransactionService from "../service/TransactionService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import AddTransactionRequest from "../model/request/AddTransactionRequest";

export default class TransactionController extends BaseController{
    private readonly transactionService: TransactionService

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }

    public async createTransaction(req: Request, res: Response) {
        try {
            const request: AddTransactionRequest = req.body.data
            console.log("#createTransaction with request: ", request)
            res.status(200).send(new BaseResponse().ok(await this.transactionService.createNewTransaction(request)))
        } catch (error) {
            console.error(error)
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async getTransactionSummary(req: Request, res: Response) {
        try {
            console.log("#getTransactionSummary with request: ", req.query)
            const patientName = req.query.name as string | undefined
            const totalData = await this.transactionService.countTransaction(patientName)
            const pagination = this.getPagination(totalData, req)
            pagination.results = await this.transactionService.getTransactionSummary(pagination, patientName)
            pagination.total = totalData
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)))
        } catch (error) {
            console.error("error when #getTransactionSummary with error: ", error)
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async getTransactionDetail(req: Request, res: Response) {
        try {
            console.log("#getTranasctionDetail with id: ", req.params.id)
            const transactionId = parseInt(req.params.id)
            res.status(200).send(new BaseResponse().ok(await this.transactionService.getTransactionById(transactionId)))
        } catch (error) {
            console.error("error when #getTransactionDetail with error: ", error)
            res.status(400).send(new BaseResponse().badRequest(error as string));
        }
    }

    public async subscribeNotification(req: Request, res: Response) {
        try {
            console.log("#subscribeNotificationToTransaction");
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            await this.transactionService.subscribeNotification(res);

            res.write('data: Connected to transaction events\n\n');

            req.on('close', () => {
                console.log("Connection closed by client")
                this.transactionService.closeConnection(res)
            });
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async publishNotification(req: Request, res: Response) {
        try {
            console.log(req.body)
            console.log("#publishNotificationToTransaction");
            await this.transactionService.publishNotification(req.body.data)
            res.status(200).send('Published');
            console.log("Notification published successfully");
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}