import BaseRouter from "./BaseRouter";
import AdminController from "../controller/AdminController";

class AdminRouter extends BaseRouter{
    private readonly adminController: AdminController;

    constructor() {
        super();
        this.adminController = new AdminController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/', this.adminController.addAdmin.bind(this.adminController))
        this.router.get('/', this.adminController.getAllStaff.bind(this.adminController))
        this.router.get('/staffs', this.adminController.getAllStaff.bind(this.adminController))
        this.router.get('/staff/:id', this.adminController.getStaffById.bind(this.adminController))
    }
}

export default new AdminRouter().router;