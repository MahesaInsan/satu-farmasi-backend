import BaseRouter from "./BaseRouter";
import DiagnoseController from "../controller/DiagnoseController";

class DiagnoseRouter extends BaseRouter{
    private readonly diagnoseController: DiagnoseController;

    constructor() {
        super();
        this.diagnoseController = new DiagnoseController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.diagnoseController.diagnosePatient.bind(this.diagnoseController))
    }
}

export default new DiagnoseRouter().router;