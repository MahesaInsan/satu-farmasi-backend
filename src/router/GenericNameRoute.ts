import GenericNameController from "../controller/GenericNameController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import GenericNameValidation from "../validator/GenericNameValidation";
import BaseRouter from "./BaseRouter";

class GenericNameRouter extends BaseRouter {
    private readonly genericNameController: GenericNameController;
    private readonly genericNameValidation: GenericNameValidation;

    constructor() {
        super();
        this.genericNameController = new GenericNameController();
        this.genericNameValidation = new GenericNameValidation();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["PHARMACIST"]),
        )
        this.router.get( "/", this.genericNameController.getAllGenericName.bind(this.genericNameController));
        this.router.get( "/dropdown", this.genericNameController.getGenericNameDropdown.bind(this.genericNameController));
        this.router.get( "/:id", this.genericNameController.getGenericNameById.bind(this.genericNameController));
        this.router.post( "/", this.genericNameValidation.createPackagingValidation(), this.genericNameController.addGenericName.bind(this.genericNameController));
        this.router.put( "/:id", this.genericNameValidation.updatePackagingValidation(), this.genericNameController.editGenericName.bind(this.genericNameController));
        this.router.delete( "/:id", this.genericNameValidation.deletePackagingValidation(), this.genericNameController.deleteGenericName.bind(this.genericNameController));
    }
}

export default new GenericNameRouter().router;
