import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import GenericNameService from "../service/GenericNameService";
import {Request, Response} from "express";
import EditGenericNameRequest from "../model/request/editGenericNameRequest";
import BaseController from "./BaseController";
import PaginationRequest from "../model/request/PaginationRequest";
import BaseResponse from "../model/response/BaseResponse";
import GenericDropdownVO from "../model/VOs/GenericDropdownVO";

export default class GenericNameController  extends BaseController {
    private readonly genericNameService: GenericNameService;

    constructor() {
        super();
        this.genericNameService = new GenericNameService();
    }

    async getAllGenericName(req: Request, res: Response){
        try {
            const label = req.query.label as string;
            const totalData = label
                ? await this.genericNameService.getTotalGenericNameByLabel(label)
                : await this.genericNameService.getTotalGenericName() ?? 0;
        
            const pagination = this.getPagination(totalData, req);
            const genericNames = label
                ? await this.genericNameService.getGenericNameByLabel(pagination.limit, pagination.startIndex, label)
                : await this.genericNameService.getAllGenericName(pagination.limit, pagination.startIndex);
        
            pagination.results = genericNames;
            pagination.total = totalData;

            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async getGenericNameDropdown(req: Request, res: Response) {
        try {
            const genericName: GenericDropdownVO[] = await this.genericNameService.getGenericNameDropdown();
            return res.status(200).send(new BaseResponse().ok(genericName));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object));
        }
    }

    async addGenericName(req: Request, res: Response){
        try{
            const request: AddGenericNameRequest = req.body;
            const createdGenericName: GenericName = await this.genericNameService.addGenericName(request)
            res.status(200).send(new BaseResponse().ok(createdGenericName));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async getGenericNameById(req: Request, res: Response){
        try {
            const id: number = Number(req.params.id);
            const genericName: GenericName | null = await this.genericNameService.getGenericNameById(id);
            res.status(200).send(new BaseResponse().ok(genericName));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async editGenericName(req: Request, res: Response){
        try {
            const id: number = Number(req.params.id);
            const data = req.body;
            data.id = id;
            const request: EditGenericNameRequest = data;
            const editedGenericName: boolean = await this.genericNameService.editGenericName(request);
            res.status(200).send(new BaseResponse().ok(editedGenericName));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async deleteGenericName(req: Request, res: Response){
        try {
            const id: number = Number(req.params.id);
            const isDeleted: boolean = await this.genericNameService.deleteGenericName(id);
            res.status(200).send(new BaseResponse().ok(isDeleted));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}