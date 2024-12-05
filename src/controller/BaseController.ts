import PaginationRequest from "../model/request/PaginationRequest";
import PaginatorHelper from "./PaginatorHelper/PaginatorHelper";
import { Request, Response } from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import { Result, validationResult } from "express-validator";


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

    public validateData(req: Request): void {
        const result: Result = validationResult(req);
        if(!result.isEmpty()) throw result;
    }
}
