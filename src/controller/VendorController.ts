import { Vendor } from "@prisma/client";
import AddVendorRequest from "../model/request/AddVendorRequest";
import BaseResponse from "../model/response/BaseResponse";
import VendorService from "../service/VendorService";
import BaseController from "./BaseController"
import {Request, Response} from "express";
import EditVendorRequest from "../model/request/EditVendorRequest";

export default class VendorController extends BaseController {
    private readonly vendorService: VendorService;
    constructor() {
        super();
        this.vendorService = new VendorService();
    }
    async getAllVendor(req: Request, res: Response) {
        try {
            const name: string = req.query.label as string;
            const totalData = name
                ? await this.vendorService.getTotalVendorByName(name)
                : await this.vendorService.getTotalVendor() ?? 0;

            const pagination = this.getPagination(totalData, req);
            const vendors = name
                ? await this.vendorService.getVendorByName(pagination.limit, pagination.startIndex, name)
                : await this.vendorService.getAllVendor(pagination.limit, pagination.startIndex);

            pagination.results = vendors;
            pagination.total = totalData;

            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async addVendor(req: Request, res: Response) {
        try {
            const request: AddVendorRequest = req.body;
            const createdVendor: Vendor = await this.vendorService.addVendor(request)
            res.status(200).send(new BaseResponse().ok(createdVendor));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async getVendorByName(req: Request, res: Response) {
        try {
            const name: string = req.query.label as string;
            const totalData = await this.vendorService.getTotalVendorByName(name);
            const pagination = this.getPagination(totalData, req);
            const vendors = await this.vendorService.getVendorByName(pagination.limit, pagination.startIndex, name);
            pagination.results = vendors;
            pagination.total = totalData;
            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async getVendorById(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const vendor: Vendor | null = await this.vendorService.getVendorById(id);
            res.status(200).send(new BaseResponse().ok(vendor));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async editVendor(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const data = req.body;
            data.id = id;
            const request: EditVendorRequest = data;
            const editVendor: Vendor = await this.vendorService.editVendor(request);
            res.status(200).send(new BaseResponse().ok(editVendor));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async deleteVendor(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const data = req.body;
            data.id = id;
            const request: EditVendorRequest = data;
            const vendor: Vendor = await this.vendorService.deleteVendor(request);
            return res.status(200).send(new BaseResponse().ok(vendor));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}
