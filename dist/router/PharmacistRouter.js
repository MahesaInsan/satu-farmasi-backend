"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PharmacistController_1 = __importDefault(require("../controller/PharmacistController"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class PharmacistRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.pharmacistController = new PharmacistController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/', this.pharmacistController.addPharmacist.bind(this.pharmacistController));
    }
}
exports.default = new PharmacistRouter().router;
