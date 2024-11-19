import BaseRouter from "./BaseRouter";
import MedicineController from "../controller/MedicineController";

class MedicineRouter extends BaseRouter {
    private readonly medicineController: MedicineController;

    constructor() {
        super();
        this.medicineController = new MedicineController();
        this.initRoutes();
    }

    private initRoutes() {
        // this.router.use(
        //     (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
        //     (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        // )
        this.router.get( "/dropdownOptions", this.medicineController.getMedicineList.bind( this.medicineController));
        this.router.get( "/", this.medicineController.getMedicines.bind(this.medicineController));
        this.router.get( "/:id", this.medicineController.getMedicineById.bind(this.medicineController));
        this.router.get( "/total", this.medicineController.getTotalMedicine.bind(this.medicineController));
        this.router.post("/", this.medicineController.createMedicine.bind(this.medicineController));
        this.router.post("/edit", this.medicineController.editMedicine.bind(this.medicineController));
        this.router.post("/add-stock", this.medicineController.addStock.bind(this.medicineController));
        this.router.post("/check-stock", this.medicineController.checkStock.bind(this.medicineController));
        this.router.post("/delete", this.medicineController.deleteMedicine.bind(this.medicineController));
        this.router.post("/check-expiration", this.medicineController.checkExpiration.bind(this.medicineController));
    }
}

export default new MedicineRouter().router;
