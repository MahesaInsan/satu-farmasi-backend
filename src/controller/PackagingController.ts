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
            return res.status(200).send(new BaseResponse().ok(packaging))
        } catch (error) {
            console.log("[src][controller][PackagingController]: ", error);
            return res.status(400).send(new BaseResponse().badRequest())
        }
    }

    async getPackaging(req: Request, res: Response) {
        try {
            const id: number = Number(req.query.id);
            if (id) {
                const packaging: Packaging | null = await this.packagingService.getPackagingById(id);
                return res.status(200).send(new BaseResponse().ok(packaging))
            }
            const packagings: Packaging[] = await this.packagingService.getAllPackagings();
            return res.status(200).send(new BaseResponse().ok(packagings))
        } catch (error) {
            console.log("[src][controller][PackagingController]: ", error);
            return res.status(400).send(new BaseResponse().badRequest())
        }
    }
}