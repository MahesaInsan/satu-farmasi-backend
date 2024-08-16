import VendorController from "../controller/VendorController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseRouter from "./BaseRouter";

class VendorRouter extends BaseRouter {
    private readonly vendorController: VendorController;

    constructor() {
        super();
        this.vendorController = new VendorController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        )
        this.router.get("/", this.vendorController.getAllVendor.bind(this.vendorController));
        this.router.get("/:id", this.vendorController.getVendorById.bind(this.vendorController));
        this.router.post("/", this.vendorController.addVendor.bind(this.vendorController));
        this.router.put("/:id", this.vendorController.editVendor.bind(this.vendorController));
        this.router.delete("/:id", this.vendorController.deleteVendor.bind(this.vendorController));
    }
}

export default new VendorRouter().router;