import { Request, Response } from "express";
import PackagingService from "../service/PackagingService";
import BaseResponse from "../model/response/BaseResponse";
import AddPackagingRequest from "../model/request/AddPackagingRequest";
import { Packaging } from "@prisma/client";
import PaginationRequest from "../model/request/PaginationRequest";
import BaseController from "./BaseController";
import PackagingDropdownVO from "../model/VOs/PackagingDropdownVO";

export default class PackagingController extends BaseController {
    private readonly packagingService: PackagingService;

    constructor() {
        super();
        this.packagingService = new PackagingService();
    }

    public async createPackaging(req: Request, res: Response) {
        try {
            this.validateData(req);
            const request: AddPackagingRequest = req.body;
            const packaging: boolean = await this.packagingService.createPackaging( request );
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController][createPackaging] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getPackaging(req: Request, res: Response) {
        try {
            const label: string = req.query.label as string;
            const totalPackaging: number = label
                ? await this.packagingService.getTotalPackagingsByLabel(label)
                : await this.packagingService.getTotalPackagings();

            const pagination: PaginationRequest = this.getPagination(totalPackaging, req);
            const packagings: Packaging[] = label
                ? await this.packagingService.getPackagingByLabel(pagination.limit, pagination.startIndex, label)
                : await this.packagingService.getAllPackagings(pagination.limit, pagination.startIndex);

            pagination.results = packagings;
            pagination.total = totalPackaging;
            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            console.log("[src][controller][PackagingController][getPackaging] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getPackagingsDropdown(req: Request, res: Response) {
        try {
            const packagings: PackagingDropdownVO[] = await this.packagingService.getPackagingsDropdown();
            return res.status(200).send(new BaseResponse().ok(packagings));
        } catch (error) {
            console.log("[src][controller][PackagingController][getPackagingsDropdown] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async editPackaging(req: Request, res: Response) {
        try {
            this.validateData(req);
            const packaging: boolean = await this.packagingService.editPackaging(req.body);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController][editPackaging] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async deletePackaging(req: Request, res: Response) {
        try {
            this.validateData(req);
            const packaging: boolean = await this.packagingService.deletePackaging(req.body);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController][deletePackaging] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
