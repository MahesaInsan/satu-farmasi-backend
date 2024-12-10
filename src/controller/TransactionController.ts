import {Request, Response} from "express";
import TransactionService from "../service/TransactionService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import AddTransactionRequest from "../model/request/AddTransactionRequest";
import PaginationRequest from "../model/request/PaginationRequest";
import TransactionSummaryVO from "../model/VOs/TransactionSummaryVO";
import ConfirmPayRequest from "../model/request/ConfirmPayRequest";
import ChangeTransactionStatusVO from "../model/VOs/ChangeTransactionStatusVO";

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

    public async getOnGoingAndWaitingPaymentTransaction(req: Request, res: Response) {
        try {
            console.log("#getOnGoingAndWaitingPaymentTransaction with request: ", req.query);
            const patientName = req.query.name as string | undefined;
            const results: TransactionSummaryVO[] = await this.transactionService.getOnGoingAndWaitingPaymentTransaction(patientName)
            return res.status(200).send(new BaseResponse().ok(results, "Succeed fetch transaction"))
        } catch (error) {
            console.error("error when #getOnGoingAndWaitingPaymentTransaction with error: ", error)
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
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
            console.log("#publishNotification with request:", req.body);
            const request : ChangeTransactionStatusVO = req.body
            await this.transactionService.publishNotification(request)
            res.status(200).send('Published');
            console.log("Notification published successfully");
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async confirmPayment(req: Request, res: Response) {
        try {
            const request: ConfirmPayRequest = req.body.data
            console.log("#confirmPayment with request: ", request)
            res.status(200).send(new BaseResponse().ok(await this.transactionService.confirmPayment(request)));
        } catch (error) {
            console.error("error when #confirmPayment with error: ", error)
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    public async finishTransaction(req: Request, res: Response) {
        try {
            const request: ChangeTransactionStatusVO = req.body.data
            console.log("#finsihTransaction with request: ", request)
            res.status(200).send(new BaseResponse().ok(await this.transactionService.finishTransaction(request)));
        } catch (error) {
            console.error("error when #finishTransaction with error: ", error)
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}