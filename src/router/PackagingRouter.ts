import PackagingController from "../controller/PackagingController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseRouter from "./BaseRouter";

class PackagingRouter extends BaseRouter {
    private readonly packagingController: PackagingController;

    constructor() {
        super();
        this.packagingController = new PackagingController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        )
        this.router.post('/', this.packagingController.createPackaging.bind(this.packagingController));
        this.router.get('/', this.packagingController.getPackaging.bind(this.packagingController));
        this.router.get('/dropdown', this.packagingController.getPackagingsDropdown.bind(this.packagingController));
        this.router.post('/edit', this.packagingController.editPackaging.bind(this.packagingController));
        this.router.post('/delete', this.packagingController.deletePackaging.bind(this.packagingController));
    }
}

export default new PackagingRouter().router;