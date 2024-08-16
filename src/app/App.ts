import express, { Application } from "express";
import cors from "cors";
import adminRouter from "../router/AdminRouter";
import doctorRouter from "../router/DoctorRouter";
import pharmacistRouter from "../router/PharmacistRouter";
import dotenv from "dotenv";
import UserRouter from "../router/UserRouter";
import medicineRouter from "../router/MedicineRouter";
import patientRouter from "../router/PatientRouter";
import diagnoseRouter from "../router/DiagnoseRouter";
import prescriptionRouter from "../router/PrescriptionRouter";
import packagingRouter from "../router/PackagingRouter";
import GenericNameRoute from "../router/GenericNameRoute";
import cookieParser from "cookie-parser";
import VendorRouter from "../router/VendorRouter";

export default class App {
    private readonly app: Application;
    private readonly port: number;
    private corsOptions: object = {
        origin: "http://localhost:3000",
        credentials: true,
        methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    };

    constructor() {
        dotenv.config();
        this.app = express();
        this.port = parseInt(process.env.PORT || "8000");
        this.initConfig();
        this.initRouter();
    }

    private initConfig() {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(cors(this.corsOptions));
        this.app.options("*", cors(this.corsOptions)); // Preflight OPTIONS request
    }

    private initRouter() {
        this.app.use("/api/v1/admins", adminRouter);
        this.app.use("/api/v1/doctors", doctorRouter);
        this.app.use("/api/v1/pharmacists", pharmacistRouter);
        this.app.use("/api/v1/users", UserRouter);
        this.app.use("/api/v1/medicines", medicineRouter);
        this.app.use("/api/v1/patients", patientRouter);
        this.app.use("/api/v1/diagnose", diagnoseRouter);
        this.app.use("/api/v1/packagings", packagingRouter);
        this.app.use("/api/v1/genericName", GenericNameRoute)
        this.app.use("/api/v1/prescriptions", prescriptionRouter)
        this.app.use("/api/v1/vendors", VendorRouter)
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}