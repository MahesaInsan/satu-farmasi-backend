import BaseRouter from "./BaseRouter";
import AdminController from "../controller/AdminController";
import UserController from "../controller/UserController";

class UserRouter extends BaseRouter{
    private readonly userController: UserController;

    constructor() {
        super();
        this.userController = new UserController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.userController.getUserByEmail.bind(this.userController))
    }
}

export default new UserRouter().router;