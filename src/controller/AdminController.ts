import AdminService from "../service/AdminService";
import {Request, Response} from "express";
import AddAdminRequest from "../model/request/AddAdminRequest";
import {Admin, Doctor} from "@prisma/client";
import ResponseHelper from "./ResponseHelper/ResponseHelper";
import User from "../entity/User";
import DoctorService from "../service/DoctorService";

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
            if (staffList) {
                return res.status(200).send({
                    data: staffList,
                    message: "Success get staff data",
                    code: 200,
                });
            }
            return res.status(400).send("No staffs found");
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async getStaffById(req: Request, res: Response){
        try{
            const id: number = Number(req.params.id);
            const staff: User | null = await this.adminService.getStaffById(id);
            if (staff) {
                return res.status(200).send({
                    data: staff,
                    message: "Success get staff data",
                    code: 200,
                });
            }
            return res.status(400).send("No staff found");
        } catch (error) {
            throw new Error(error as string)
        }
    }
}