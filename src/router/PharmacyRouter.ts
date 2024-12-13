import BaseRouter from "./BaseRouter";
import PharmacyController from "../controller/PharmacyController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class PharmacyRouter extends BaseRouter {
    private readonly pharmacyController: PharmacyController;

    constructor() {
        super();
        this.pharmacyController = new PharmacyController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["ADMIN"]),
        )
        this.router.get('/', this.pharmacyController.getPharmacyInformation.bind(this.pharmacyController));
        this.router.put('/', this.pharmacyController.updatePharmacyInformation.bind(this.pharmacyController));
    }
}

export default new PharmacyRouter().router;
