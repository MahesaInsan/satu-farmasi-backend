import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import GenericNameService from "../service/GenericNameService";
import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import EditGenericNameRequest from "../model/request/editGenericNameRequest";

export default class GenericNameController {
    private readonly genericNameService: GenericNameService;
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.genericNameService = new GenericNameService();
        this.responseHelper = new ResponseHelper();
    }

    async addGenericName(req: Request, res: Response){
        try{
            const request: AddGenericNameRequest = req.body;
            const createdGenericName: GenericName = await this.genericNameService.addGenericName(request)
            res.status(200).send(createdGenericName);
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async getGenericNameById(req: Request, res: Response){
        try {
            const id: number = Number(req.params.id);
            const genericName: GenericName | null = await this.genericNameService.getGenericNameById(id);
            res.status(200).send(genericName);
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
            res.status(200).send(editedGenericName);
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async deleteGenericName(req: Request, res: Response){
        try {
            const id: number = Number(req.params.id);
            const isDeleted: boolean = await this.genericNameService.deleteGenericName(id);
            res.status(200).send(isDeleted);
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}