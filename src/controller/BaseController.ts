import PaginationRequest from "../model/request/PaginationRequest";
import PaginatorHelper from "./PaginatorHelper/PaginatorHelper";
import { Request } from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";


export default class BaseController {
    private readonly paginatorHelper: PaginatorHelper;
    public readonly responseHelper: ResponseHelper;
    constructor() {
        this.paginatorHelper = new PaginatorHelper();
        this.responseHelper = new ResponseHelper();
    }
    public getPagination(totalData: number, req: Request): PaginationRequest {
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        return this.paginatorHelper.paginate(page, limit, totalData);
    }
}
