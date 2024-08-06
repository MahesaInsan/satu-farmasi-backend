import { Request, Response } from "express";
import PackagingService from "../service/PackagingService";
import BaseResponse from "../model/response/BaseResponse";
import AddPackagingRequest from "../model/request/AddPackagingRequest";
import { Packaging } from "@prisma/client";

export default class PackagingController {
    private readonly packagingService: PackagingService;

    constructor() {
        this.packagingService = new PackagingService();
    }

    async createPackaging(req: Request, res: Response) {
        try {
            const request: AddPackagingRequest = req.body;
            const packaging: Packaging = await this.packagingService.createPackaging(request);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController] ", error);
            return res.status(400).send(new BaseResponse().badRequest());
        }
    }

    async getPackaging(req: Request, res: Response) {
        try {
            const id: number = Number(req.query.id);
            const label: string = req.query.label as string;
            let packaging: Packaging | null;
            if (id) {
                packaging = await this.packagingService.getPackagingById(id);
                return res.status(200).send(new BaseResponse().ok(packaging));
            } else if (label) {
                packaging = await this.packagingService.getPackagingByLabel(label);
                return res.status(200).send(new BaseResponse().ok(packaging));
            }
            const packagings: Packaging[] = await this.packagingService.getAllPackagings();
            return res.status(200).send(new BaseResponse().ok(packagings))
        } catch (error) {
            console.log("[src][controller][PackagingController] ", error);
            return res.status(400).send(new BaseResponse().badRequest());
        }
    }

    async editPackaging(req: Request, res: Response) {
        try {
            const packaging: Packaging = await this.packagingService.editPackaging(req.body);
            return res.status(200).send(new BaseResponse().ok(packaging));
        } catch (error) {
            console.log("[src][controller][PackagingController] ", error);
            return res.status(400).send(new BaseResponse().badRequest());
        }
    }
}