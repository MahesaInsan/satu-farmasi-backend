import BaseRouter from "./BaseRouter";
import UserController from "../controller/UserController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class UserRouter extends BaseRouter{
    private readonly userController: UserController;

    constructor() {
        super();
        this.userController = new UserController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.userController.getUserByEmail.bind(this.userController))
        this.router.post('/check-token', this.userController.checkToken.bind(this.userController))
        this.router.delete('/', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            this.userController.deleteUser.bind(this.userController)
        )
    }
}

export default new UserRouter().router;
