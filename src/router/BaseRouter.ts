import {Router} from "express";

export default abstract class BaseRouter {
    public readonly router: Router;

    constructor() {
        this.router = Router();
    }
}