import BaseRouter from "./BaseRouter";
import PrescriptionController from "../controller/PrescriptionController";

class PrescriptionRouter extends BaseRouter{
    private readonly prescriptionController: PrescriptionController;

    constructor() {
        super();
        this.prescriptionController = new PrescriptionController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.get('/', this.prescriptionController.getAllPrescription.bind(this.prescriptionController))
        this.router.post('/', this.prescriptionController.addNewPrescription.bind(this.prescriptionController))
        this.router.put('/', this.prescriptionController.editPrescription.bind(this.prescriptionController))
    }
}

export default new PrescriptionRouter().router;