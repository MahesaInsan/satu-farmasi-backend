import express, {Application} from "express";
import cors from "cors";
import adminRouter from "../router/AdminRouter";
import dotenv from "dotenv";

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
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}