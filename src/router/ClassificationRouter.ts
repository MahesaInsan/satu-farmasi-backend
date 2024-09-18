import ClassificationController from "../controller/ClassificationController";
import BaseRouter from "./BaseRouter";

class ClassificationRouter extends BaseRouter {
    private readonly classificationController: ClassificationController;
    constructor() {
        super();
        this.classificationController = new ClassificationController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get("/", this.classificationController.getClassification.bind(this.classificationController));
        this.router.post("/", this.classificationController.addClassification.bind(this.classificationController));
        this.router.put("/", this.classificationController.editClassification.bind(this.classificationController));
        this.router.delete("/", this.classificationController.deleteClassification.bind(this.classificationController));
    }
}

export default new ClassificationRouter().router;
