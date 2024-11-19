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
        this.router.post('/', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "DOCTOR"),
            this.diagnoseController.diagnosePatient.bind(this.diagnoseController)
        )
    }
}

export default new DiagnoseRouter().router;
