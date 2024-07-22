import AdminService from "../service/AdminService";
import {Request, Response} from "express";
import AddAdminRequest from "../model/request/AddAdminRequest";
import {Admin, Doctor, Pharmacist} from "@prisma/client";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import User from "../entity/User";
import DoctorService from "../service/DoctorService";
import EditAdminRequest from "../model/request/EditAdminRequest";
import EditDoctorRequest from "../model/request/EditDoctorRequest";
import EditPharmacistRequest from "../model/request/EditPharmacistRequest";
import NikVO from "../model/VOs/nikVO";
import BaseResponse from "../model/response/BaseResponse";

export default class AdminController{
    private readonly adminService: AdminService;
    private readonly doctorService: DoctorService;
    private readonly responseHelper: ResponseHelper;

    constructor() {
        this.adminService = new AdminService();
        this.doctorService = new DoctorService();
        this.responseHelper = new ResponseHelper();
    }

    async addAdmin(req: Request, res: Response){
        try{
            const request: AddAdminRequest = req.body;
            const createdAdmin: Admin = await this.adminService.addAdmin(request)
            res.status(200).send(this.responseHelper.constructAddAdminResponse(createdAdmin));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
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

    async getAllStaff(req: Request, res: Response){
        try{
            const staffList: User[] = await this.adminService.getAllStaff();
            return res.status(200).send(this.responseHelper.constructGetStaffResponse(staffList));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }

    async getStaffById(req: Request, res: Response){
        try{
            const id: number = Number(req.params.id);
            const staff: User | null = await this.adminService.getStaffById(id);
            // return res.status(200).send(this.responseHelper.constructGetStaffResponse(staff));
            return res.status(200).send(new BaseResponse().ok(staff));
        } catch (error) {
            return res.status(400).send(this.responseHelper.constructBadRequest(error as object));
        }
    }

    async getStaffByNik(req: Request, res: Response){
        try{
            const body: NikVO = req.body;
            const staff: User | null = await this.adminService.getStaffByNik(body.nik);
            // return res.status(200).send(this.responseHelper.constructGetStaffResponse(staff));
            return res.status(200).send(new BaseResponse().ok(staff));
        } catch (error) {
            return res.status(400).send(this.responseHelper.constructBadRequest(error as object));
        }
    }

    async editStaff(req: Request, res: Response) {
        try {
            const request: EditAdminRequest | EditDoctorRequest | EditPharmacistRequest = req.body;
            const editedStaff: User | null = await this.adminService.editStaff(request);
            return res.status(200).send(this.responseHelper.constructEditStaffResponse(editedStaff));
        } catch (error) {
            res.status(400).send(this.responseHelper.constructBadRequest(error as object))
        }
    }
}