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
        this.router.get( "/:id", this.genericNameController.getGenericNameById.bind(this.genericNameController));
        this.router.post( "/", this.genericNameController.addGenericName.bind(this.genericNameController));
        this.router.put( "/:id", this.genericNameController.editGenericName.bind(this.genericNameController));
        this.router.delete( "/:id", this.genericNameController.deleteGenericName.bind(this.genericNameController));
    }
}

export default new GenericNameRouter().router;
