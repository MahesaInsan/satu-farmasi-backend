import PharmacistController from "../controller/PharmacistController";
import BaseRouter from "./BaseRouter";

class PharmacistRouter extends BaseRouter{
    private readonly pharmacistController: PharmacistController;

    constructor() {
        super();
        this.pharmacistController = new PharmacistController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.pharmacistController.addPharmacist.bind(this.pharmacistController))
    }
}

export default new PharmacistRouter().router;