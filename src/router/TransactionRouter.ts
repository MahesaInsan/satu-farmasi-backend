import BaseRouter from "./BaseRouter";
import TransactionController from "../controller/TransactionController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class TransactionRouter extends BaseRouter{
    private readonly transactionController: TransactionController;

    constructor() {
        super();
        this.transactionController = new TransactionController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        )
        this.router.post('/', this.transactionController.createTransaction.bind(this.transactionController))
        this.router.get('/_summary', this.transactionController.getTransactionSummary.bind(this.transactionController))
        this.router.get('/_subscribe', this.transactionController.subscribeNotification.bind(this.transactionController))
        this.router.post('/_publish', this.transactionController.publishNotification.bind(this.transactionController))
        this.router.post('/_pay', this.transactionController.confirmPayment.bind(this.transactionController))
        this.router.post('/_finish', this.transactionController.finishTransaction.bind(this.transactionController))
        this.router.get('/:id', this.transactionController.getTransactionDetail.bind(this.transactionController))
        this.router.get('/_status/on-progress-waiting-payment', this.transactionController.getOnGoingAndWaitingPaymentTransaction.bind(this.transactionController))
        this.router.post('/profit/date', this.transactionController.getTransactionProfitByDate.bind(this.transactionController))
        this.router.post('/annual-recap', this.transactionController.getAnnualTransactionRecap.bind(this.transactionController))
    }
}

export default new TransactionRouter().router;