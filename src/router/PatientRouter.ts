import BaseRouter from "./BaseRouter";
import PatientController from "../controller/PatientController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class PatientRouter extends BaseRouter{
    private readonly patientController: PatientController;

    constructor() {
        super();
        this.patientController = new PatientController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["PHARMACIST", "DOCTOR"]),
        )
        this.router.get('/dropdownOptions', this.patientController.getPatientDropdownOptions.bind(this.patientController))
        this.router.get('/total', this.patientController.getTotalPateint.bind(this.patientController))
        // this.router.post('/', this.patientController.createNewPatient.bind(this.patientController))
    }
}

export default new PatientRouter().router;
