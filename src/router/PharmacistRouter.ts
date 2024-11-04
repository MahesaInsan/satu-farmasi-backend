import PharmacistController from "../controller/PharmacistController";
import PharmacistValidation from "../validator/UserValidation/PharmacistValidation";
import BaseRouter from "./BaseRouter";

class PharmacistRouter extends BaseRouter{
    private readonly pharmacistController: PharmacistController;
	private readonly pharmacistValidation: PharmacistValidation;

    constructor() {
        super();
        this.pharmacistController = new PharmacistController();
		this.pharmacistValidation = new PharmacistValidation();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.pharmacistValidation.createPharmacistValidation(), this.pharmacistController.addPharmacist.bind(this.pharmacistController))
    }
}

export default new PharmacistRouter().router;
