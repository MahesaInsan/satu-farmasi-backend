import GenericNameController from "../controller/GenericNameController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import BaseRouter from "./BaseRouter";

class GenericNameRouter extends BaseRouter {
    private readonly genericNameController: GenericNameController;

    constructor() {
        super();
        this.genericNameController = new GenericNameController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        )
        this.router.post( "/genericName", this.genericNameController.addGenericName.bind(this.genericNameController)
        );
    }
}

export default new GenericNameRouter().router;
