import ClassificationController from "../controller/ClassificationController";
import ClassificationValidation from "../validator/ClassificationValidation";
import BaseRouter from "./BaseRouter";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class ClassificationRouter extends BaseRouter {
    private readonly classificationController: ClassificationController;
    private readonly classificationValidation: ClassificationValidation;

    constructor() {
        super();
        this.classificationController = new ClassificationController();
        this.classificationValidation = new ClassificationValidation();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["PHARMACIST"]),
        )
        this.router.get("/", this.classificationController.getClassification.bind(this.classificationController));
        this.router.get("/dropdown", this.classificationController.getClassificationsDropdown.bind(this.classificationController));
        this.router.post("/", this.classificationValidation.createClassificationValidation(), this.classificationController.addClassification.bind(this.classificationController));
        this.router.put("/", this.classificationValidation.updateClassificationValidation(), this.classificationController.editClassification.bind(this.classificationController));
        this.router.delete("/", this.classificationValidation.deleteClassificationValidation(), this.classificationController.deleteClassification.bind(this.classificationController));
    }
}

export default new ClassificationRouter().router;
