"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClassificationController_1 = __importDefault(require("../controller/ClassificationController"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class ClassificationRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.classificationController = new ClassificationController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/", this.classificationController.getClassification.bind(this.classificationController));
        this.router.post("/", this.classificationController.addClassification.bind(this.classificationController));
        this.router.put("/", this.classificationController.editClassification.bind(this.classificationController));
        this.router.delete("/", this.classificationController.deleteClassification.bind(this.classificationController));
    }
}
exports.default = new ClassificationRouter().router;
