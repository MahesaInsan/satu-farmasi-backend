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
            const request: AddPackagingRequest = req.body;
            const packaging: Packaging = await this.packagingService.createPackaging(request);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController][createPackaging] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
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
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async getPackagingsDropdown(req: Request, res: Response) {
        try {
            const packagings: PackagingDropdownVO[] = await this.packagingService.getPackagingsDropdown();
            return res.status(200).send(new BaseResponse().ok(packagings));
        } catch (error) {
            console.log("[src][controller][PackagingController][getPackagingsDropdown] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async editPackaging(req: Request, res: Response) {
        try {
            const packaging: Packaging = await this.packagingService.editPackaging(req.body);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController][editPackaging] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async deletePackaging(req: Request, res: Response) {
        try {
            const packaging: Packaging = await this.packagingService.deletePackaging(req.body);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController][deletePackaging] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }
}