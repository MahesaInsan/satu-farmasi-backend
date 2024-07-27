import BaseRouter from "./BaseRouter";
import AdminController from "../controller/AdminController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class AdminRouter extends BaseRouter{
    private readonly adminController: AdminController;

    constructor() {
        super();
        this.adminController = new AdminController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.adminController.addAdmin.bind(this.adminController))
        this.router.get('/', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "ADMIN"),
            this.adminController.getAllStaff.bind(this.adminController)
    )
        this.router.get('/staffs', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "ADMIN"),
            this.adminController.getAllStaff.bind(this.adminController)
        )
        this.router.get('/staff/:id', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as unknown as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as unknown as BaseRequest, res, next, "ADMIN"),
            this.adminController.getStaffById.bind(this.adminController)
        )
        this.router.post('/staff/edit', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "ADMIN"),
            this.adminController.editStaff.bind(this.adminController)
        )
        this.router.post('/staff/nik', 
            (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
            (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "ADMIN"),
            this.adminController.getStaffByNik.bind(this.adminController)
        )
    }
}

export default new AdminRouter().router;