import ReceiveMedicineController from "../controller/ReceiveMedicineController";
import BaseRouter from "./BaseRouter";

class MedicineRouter extends BaseRouter {
    private readonly receiveMedicineController: ReceiveMedicineController;

    constructor() {
        super();
        this.receiveMedicineController = new ReceiveMedicineController();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get( "/", this.receiveMedicineController.getAllReceiveMedicines.bind(this.receiveMedicineController));
        this.router.get( "/:id", this.receiveMedicineController.getReceiveMedicineById.bind(this.receiveMedicineController));
        this.router.post("/", this.receiveMedicineController.createReceiveMedicine.bind(this.receiveMedicineController));
        this.router.post("/_confirm", this.receiveMedicineController.confirmReceiveMedicine.bind(this.receiveMedicineController));
        this.router.post("/_delete", this.receiveMedicineController.deleteReceiveMedicine.bind(this.receiveMedicineController));
    }
}

export default new MedicineRouter().router;