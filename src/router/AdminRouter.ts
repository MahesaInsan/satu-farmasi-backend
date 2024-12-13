import BaseRouter from "./BaseRouter";
import AdminController from "../controller/AdminController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";
import AdminValidation from "../validator/UserValidation/AdminValidation";
import { Request } from "express";

class AdminRouter extends BaseRouter {
	private readonly adminController: AdminController;
	private readonly adminValidation: AdminValidation;

	constructor() {
		super();
		this.adminController = new AdminController();
		this.adminValidation = new AdminValidation();
		this.initRoutes()
	}

	private initRoutes() {
		this.router.post('/',
			this.adminValidation.createAdminValidation(),
			this.adminController.addAdmin.bind(this.adminController)
		);
		this.router.get('/',
			(req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
			(req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["ADMIN"]),
			this.adminController.getAllStaff.bind(this.adminController)
		);
		this.router.get('/staffs',
			(req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
			(req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["ADMIN"]),
			this.adminController.getAllStaff.bind(this.adminController)
		);
		this.router.use('/staff',
			(req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
			(req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, ["ADMIN"]),
			this.router.get('/:id', this.adminController.getStaffById.bind(this.adminController)),
			this.router.post('/nik', this.adminController.getStaffByNik.bind(this.adminController)),
			this.router.use('/edit',
				this.router.put("/admin",
					this.adminValidation.updateAdminValidation(),
					this.adminController.editAdmin.bind(this.adminController)
				),
				this.router.put("/doctor",
					this.adminValidation.updateDoctorValidation(),
					this.adminController.editDoctor.bind(this.adminController)
				),
				this.router.put("/pharmacist",
					this.adminValidation.updatePharmacistValidation(),
					this.adminController.editPharmacist.bind(this.adminController)
				),
			),
		);
	}
}

export default new AdminRouter().router;
