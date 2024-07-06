import AdminService from "../service/AdminService";
import {Request, Response} from "express";
import AddAdminRequest from "../model/request/AddAdminRequest";
import {Admin} from "@prisma/client";
import ResponseHelper from "./ResponseHelper/ResponseHelper";

export default class AdminController{
    private readonly adminService: AdminService
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.adminService = new AdminService();
        this.responseHelper = new ResponseHelper();
    }

    async addAdmin(req: Request, res: Response){
        try{
            const request: AddAdminRequest = req.body;
            const createdAdmin: Admin = await this.adminService.addAdmin(request)
            res.status(200).send(this.responseHelper.constructAdminResponse(createdAdmin));
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async getAllAdmin(req: Request, res: Response){
        try{
            const adminList: Admin[] = await this.adminService.getAllAdmin()
            res.status(200).send(adminList);
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async showAllAdmin(req: Request, res: Response){
        res.send("HELLO WORLD")
    }
}