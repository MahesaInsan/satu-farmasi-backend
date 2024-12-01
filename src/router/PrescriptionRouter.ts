import BaseRouter from "./BaseRouter";
import PrescriptionController from "../controller/PrescriptionController";
import BaseRequest from "../model/request/BaseRequest/BaseRequest";

class PrescriptionRouter extends BaseRouter{
    private readonly prescriptionController: PrescriptionController;

    constructor() {
        super();
        this.prescriptionController = new PrescriptionController();
        this.initRoutes()
    }

    private initRoutes(){
        // this.router.use(
        //     (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
        //     (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        // )
        this.router.get('/', this.prescriptionController.getAllPrescription.bind(this.prescriptionController))
        this.router.post('/', this.prescriptionController.addNewPrescription.bind(this.prescriptionController))
        this.router.put('/', this.prescriptionController.editPrescription.bind(this.prescriptionController))
        this.router.post('/most-sales-medicines', this.prescriptionController.getMostSalesMedicineByPrescription.bind(this.prescriptionController))
        this.router.put('/cancel/:id', this.prescriptionController.cancelPrescription.bind(this.prescriptionController))
        this.router.get('/:id', this.prescriptionController.getPrescription.bind(this.prescriptionController))
    }
}

export default new PrescriptionRouter().router;