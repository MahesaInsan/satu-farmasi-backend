import BaseRouter from "./BaseRouter";
import AdminController from "../controller/AdminController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import AdminValidation from "../validator/UserValidation/AdminValidation";
import { Request } from "express";

class AdminRouter extends BaseRouter{
    private readonly adminController: AdminController;
    private readonly adminValidation: AdminValidation;

    constructor() {
        super();
        this.adminController = new AdminController();
        this.adminValidation = new AdminValidation();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/',  this.adminValidation.createAdminValidation(), this.adminController.addAdmin.bind(this.adminController))
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
        // TODO: Change the HTTP method to PUT
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
