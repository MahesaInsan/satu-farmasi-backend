"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaginatorHelper_1 = __importDefault(require("./PaginatorHelper/PaginatorHelper"));
const ResponseHelper_1 = __importDefault(require("./ResponseHelper/ResponseHelper"));
class BaseController {
    constructor() {
        this.paginatorHelper = new PaginatorHelper_1.default();
        this.responseHelper = new ResponseHelper_1.default();
    }
    getPagination(totalData, req) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        return this.paginatorHelper.paginate(page, limit, totalData);
    }
}
exports.default = BaseController;
