import MedicineReportController from "../controller/MedicineReportController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseRouter from "./BaseRouter";

class MedicineReportRouter extends BaseRouter {
    private readonly reportController: MedicineReportController;

    constructor() {
        super();
        this.reportController = new MedicineReportController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["PHARMACIST"]),
        )
        this.router.get("/unfinalize", this.reportController.getTodayUnFinalizedMedicineReport.bind(this.reportController));
        this.router.get("/", this.reportController.getAllMedicineReports.bind(this.reportController));
        this.router.get("/expiredMedicine", this.reportController.getExpiredMedicine.bind(this.reportController))
        this.router.get("/:id", this.reportController.getMedicineReportById.bind(this.reportController));
        this.router.post("/:id", this.reportController.finalizeReport.bind(this.reportController));
    }
}

export default new MedicineReportRouter().router;
