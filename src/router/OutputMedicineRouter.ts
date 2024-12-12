import BaseRouter from "./BaseRouter";
import OutputMedicineController from "../controller/OutputMedicineController";

class OutputMedicineRouter extends BaseRouter {
    private readonly outputMedicineController: OutputMedicineController;

    constructor() {
        super();
        this.outputMedicineController = new OutputMedicineController();
        this.initRoutes();
    }

    private initRoutes() {
        // this.router.use(
        //     (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
        //     (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        // )
        this.router.get("/", this.outputMedicineController.getAllOutputMedicines.bind(this.outputMedicineController));
        this.router.get("/:id", this.outputMedicineController.getOutputMedicineById.bind(this.outputMedicineController));
        this.router.post("/", this.outputMedicineController.createOutputMedicine.bind(this.outputMedicineController));
        this.router.post("/bulkCreate", this.outputMedicineController.bulkCreateOutputMedicine.bind(this.outputMedicineController));
        this.router.put("/", this.outputMedicineController.editOutputMedicine.bind(this.outputMedicineController));
        this.router.delete("/", this.outputMedicineController.deleteOutputMedicine.bind(this.outputMedicineController));
    }
}

export default new OutputMedicineRouter().router;
