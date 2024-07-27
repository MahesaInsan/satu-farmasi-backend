import { GenericName } from "@prisma/client";
import AddGenericNameRequest from "../model/request/AddGenericName";
import GenericNameService from "../service/GenericNameService";
import {Request, Response} from "express";
import ResponseHelper from "./ResponseHelper/ResponseHelper";

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
}