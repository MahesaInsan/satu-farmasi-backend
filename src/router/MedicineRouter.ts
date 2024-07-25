import BaseRouter from "./BaseRouter";
import MedicineController from "../controller/MedicineController";

class MedicineRouter extends BaseRouter{
    private readonly medicineController: MedicineController;

    constructor() {
        super();
        this.medicineController = new MedicineController();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.get('/dropdownOptions', this.medicineController.getMedicineList.bind(this.medicineController))
        this.router.post('/genericName', this.medicineController.addGenericName.bind(this.medicineController))
    }
}

export default new MedicineRouter().router;