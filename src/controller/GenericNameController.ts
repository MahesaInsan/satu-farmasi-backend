import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import GenericNameService from "../service/GenericNameService";
import {Request, Response} from "express";
import EditGenericNameRequest from "../model/request/editGenericNameRequest";
import BaseController from "./BaseController";
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
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getGenericNameDropdown(req: Request, res: Response) {
        try {
            const genericName: GenericDropdownVO[] = await this.genericNameService.getGenericNameDropdown();
            return res.status(200).send(new BaseResponse().ok(genericName));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async addGenericName(req: Request, res: Response){
        try{
            this.validateData(req);
            const request: AddGenericNameRequest = req.body;
            const createdGenericName: boolean = await this.genericNameService.addGenericName(request)
            return res.status(200).send(new BaseResponse().ok(createdGenericName, "Successfully Created Generic Name"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getGenericNameById(req: Request, res: Response){
        try {
            const id: number = Number(req.params.id);
            const genericName: GenericName | null = await this.genericNameService.getGenericNameById(id);
            return res.status(200).send(new BaseResponse().ok(genericName));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async editGenericName(req: Request, res: Response){
        try {
            this.validateData(req);
            const id: number = Number(req.params.id);
            const data = req.body;
            data.id = id;
            const request: EditGenericNameRequest = data;
            await this.genericNameService.editGenericName(request);
            return res.status(200).send(new BaseResponse().ok(null, "Successfully Edited Generic Name"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async deleteGenericName(req: Request, res: Response){
        try {
            this.validateData(req);
             await this.genericNameService.deleteGenericName(req.body);
            return res.status(200).send(new BaseResponse().ok(null, "Successfully Deleted Generic Name"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
