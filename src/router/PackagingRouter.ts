import PackagingController from "../controller/PackagingController";
import BaseRouter from "./BaseRouter";

class PackagingRouter extends BaseRouter {
    private readonly packagingController: PackagingController;

    constructor() {
        super();
        this.packagingController = new PackagingController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post('/', this.packagingController.createPackaging.bind(this.packagingController));
        this.router.get('/', this.packagingController.getPackaging.bind(this.packagingController));
        this.router.post('/edit', this.packagingController.editPackaging.bind(this.packagingController));
    }
}

export default new PackagingRouter().router;