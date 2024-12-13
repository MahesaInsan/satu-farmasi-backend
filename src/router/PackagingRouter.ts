import PackagingController from "../controller/PackagingController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import PackagingValidation from "../validator/PackagingValidation";
import BaseRouter from "./BaseRouter";

class PackagingRouter extends BaseRouter {
    private readonly packagingController: PackagingController;
    private readonly packagingValidation: PackagingValidation;

    constructor() {
        super();
        this.packagingController = new PackagingController();
        this.packagingValidation = new PackagingValidation();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["PHARMACIST"]),
        )
        this.router.post('/', this.packagingValidation.createPackagingValidation(),this.packagingController.createPackaging.bind(this.packagingController));
        this.router.get('/', this.packagingController.getPackaging.bind(this.packagingController));
        this.router.get('/dropdown', this.packagingController.getPackagingsDropdown.bind(this.packagingController));
        this.router.post('/edit', this.packagingValidation.updatePackagingValidation(), this.packagingController.editPackaging.bind(this.packagingController));
        this.router.post('/delete', this.packagingValidation.deletePackagingValidation(), this.packagingController.deletePackaging.bind(this.packagingController));
    }
}

export default new PackagingRouter().router;
