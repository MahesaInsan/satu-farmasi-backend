import BaseRouter from "./BaseRouter";
import PatientController from "../controller/PatientController";

class PatientRouter extends BaseRouter{
    private readonly patientController: PatientController;

    constructor() {
        super();
        this.patientController = new PatientController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.get('/dropdownOptions', this.patientController.getPatientDropdownOptions.bind(this.patientController))
        // this.router.post('/', this.patientController.createNewPatient.bind(this.patientController))
    }
}

export default new PatientRouter().router;