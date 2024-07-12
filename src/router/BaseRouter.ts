import {Router} from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";

export default abstract class BaseRouter {
    public readonly router: Router;
    private readonly authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.authMiddleware = new AuthMiddleware();
    }
}