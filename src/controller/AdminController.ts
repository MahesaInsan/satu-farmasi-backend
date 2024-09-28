import AdminService from "../service/AdminService";
import {Request, Response} from "express";
import AddAdminRequest from "../model/request/AddAdminRequest";
import {Admin} from "@prisma/client";
import User from "../entity/User";
import NikVO from "../model/VOs/nikVO";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import AdminValidation from "../validator/UserValidation/AdminValidation";

export default class AdminController extends BaseController{
    private readonly adminService: AdminService;
    private readonly adminValidation: AdminValidation;

    constructor() {
        super();
        this.adminService = new AdminService();
        this.adminValidation = new AdminValidation();
    }

    async addAdmin(req: Request, res: Response){
        try{
            this.validateData(req);
            const request: AddAdminRequest = req.body;
            const createdAdmin: Admin = await this.adminService.addAdmin(request)
            res.status(200).send(new BaseResponse().ok(createdAdmin));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getAllAdmin(res: Response){
        try{
            const adminList: Admin[] = await this.adminService.getAllAdmin()
            res.status(200).send(adminList);
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getAllStaff(res: Response){
        try{
            const staffList: User[] = await this.adminService.getAllStaff();
            // TODO: Change this to use base response
            return res.status(200).send(this.responseHelper.constructGetStaffResponse(staffList));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getStaffById(req: Request, res: Response){
        try{
            const id: number = Number(req.params.id);
            const staff: User | null = await this.adminService.getStaffById(id);
            return res.status(200).send(new BaseResponse().ok(staff));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getStaffByNik(req: Request, res: Response){
        try{
            const body: NikVO = req.body;
            const staff: User | null = await this.adminService.getStaffByNik(body.nik);
            return res.status(200).send(new BaseResponse().ok(staff));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async editStaff(req: Request, res: Response) {
        try {
             this.adminValidation.updateStaffValidation(req);
            console.log("start validation")
            this.validateData(req);
            console.log("end validation")
            //const request: EditAdminRequest | EditDoctorRequest | EditPharmacistRequest = req.body;
            //const editedStaff: User | null = await this.adminService.editStaff(request);
            //// TODO: Change this to use base response
            //return res.status(200).send(this.responseHelper.constructEditStaffResponse(editedStaff));
            return res.status(200).send("Not implemented yet");
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
