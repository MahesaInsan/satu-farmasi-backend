import BaseRouter from "./BaseRouter";
import MedicineController from "../controller/MedicineController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class MedicineRouter extends BaseRouter {
    private readonly medicineController: MedicineController;

    constructor() {
        super();
        this.medicineController = new MedicineController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        )
        this.router.get( "/dropdownOptions", this.medicineController.getMedicineList.bind( this.medicineController));
    }
}

export default new MedicineRouter().router;