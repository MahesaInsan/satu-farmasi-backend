import DoctorController from "../controller/DoctorController";
import DoctorValidation from "../validator/DoctorValidation";
import BaseRouter from "./BaseRouter";

class DoctorRouter extends BaseRouter{
    private readonly doctorController: DoctorController;
    private readonly doctorValidation: DoctorValidation;

    constructor() {
        super();
        this.doctorController = new DoctorController();
        this.doctorValidation = new DoctorValidation();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.doctorValidation.createDoctorValidation(), this.doctorController.addDoctor.bind(this.doctorController))
    }
}

export default new DoctorRouter().router;
