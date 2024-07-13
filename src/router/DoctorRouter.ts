import DoctorController from "../controller/DoctorController";
import BaseRouter from "./BaseRouter";

class DoctorRouter extends BaseRouter{
    private readonly doctorController: DoctorController;

    constructor() {
        super();
        this.doctorController = new DoctorController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.doctorController.addDoctor.bind(this.doctorController))
    }
}

export default new DoctorRouter().router;