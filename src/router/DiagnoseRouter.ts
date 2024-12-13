import BaseRouter from "./BaseRouter";
import DiagnoseController from "../controller/DiagnoseController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class DiagnoseRouter extends BaseRouter{
    private readonly diagnoseController: DiagnoseController;

    constructor() {
        super();
        this.diagnoseController = new DiagnoseController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["DOCTOR"]),
        )
        this.router.post('/create', this.diagnoseController.diagnosePatient.bind(this.diagnoseController))
        this.router.post('/', this.diagnoseController.getDiagnoseSummary.bind(this.diagnoseController))
        this.router.get('/:id', this.diagnoseController.getDiagnoseDetail.bind(this.diagnoseController))
    }
}

export default new DiagnoseRouter().router;
