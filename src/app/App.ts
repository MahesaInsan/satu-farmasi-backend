import express, {Application} from "express";
import cors from "cors";
import adminRouter from "../router/AdminRouter";
import dotenv from "dotenv";
import medicineRouter from "../router/MedicineRouter";
import patientRouter from "../router/PatientRouter";
import diagnoseRouter from "../router/DiagnoseRouter";

export default class App{
    private readonly app: Application;
    private readonly port: number;

    constructor() {
        dotenv.config()
        this.app = express();
        this.port = parseInt(process.env.PORT || "8000");
        this.initConfig()
        this.initRouter()
    }

    private initConfig(){
        this.app.use(express.json());
        this.app.use(cors())
    }

    private initRouter() {
        this.app.use("/api/v1/admins", adminRouter);
        this.app.use("/api/v1/medicines", medicineRouter);
        this.app.use("/api/v1/patients", patientRouter);
        this.app.use("/api/v1/diagnose", diagnoseRouter);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}