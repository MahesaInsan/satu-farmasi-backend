import express, { Application } from "express";
import cors from "cors";
import adminRouter from "../router/AdminRouter";
import doctorRouter from "../router/DoctorRouter";
import pharmacistRouter from "../router/PharmacistRouter";
import dotenv from "dotenv";
import UserRouter from "../router/UserRouter";

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
        this.app.use(express.json());
        this.app.use(cors(this.corsOptions));
        this.app.options("*", cors(this.corsOptions)); // Preflight OPTIONS request
    }

    private initRouter() {
        this.app.use("/api/v1/admins", adminRouter);
        this.app.use("/api/v1/doctors", doctorRouter);
        this.app.use("/api/v1/pharmacists", pharmacistRouter);
        this.app.use("/api/v1/users", UserRouter);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}
