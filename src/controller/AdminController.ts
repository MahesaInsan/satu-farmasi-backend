import AdminService from "../service/AdminService";
import {Request, Response} from "express";
import AddAdminRequest from "../model/request/AddAdminRequest";
import User from "../entity/User";
import NikVO from "../model/VOs/nikVO";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import EditAdminRequest from "../model/request/EditAdminRequest";
import EditDoctorRequest from "../model/request/EditDoctorRequest";
import EditPharmacistRequest from "../model/request/EditPharmacistRequest";
import AdminVO from "../model/VOs/AdminVO";

export default class AdminController extends BaseController{
    private readonly adminService: AdminService;

    constructor() {
        super();
        this.adminService = new AdminService();
    }

    async addAdmin(req: Request, res: Response){
        try{
            this.validateData(req);
            const request: AddAdminRequest = req.body;
            const createdAdmin: User = await this.adminService.addAdmin(request)
            res.status(200).send(new BaseResponse().ok(createdAdmin));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getAllStaff(req: Request, res: Response){
        try{
            const param: string = req.query.param as string;
            const filter: string = req.query.filter as string;
			if (filter === null || filter === undefined) throw new Error('Filter query is required');
            const totalData = await this.adminService.getTotalStaff(filter, param);
            const pagination = this.getPagination(totalData, req);
            const staffList: User[] = await this.adminService.getAllStaff(pagination.limit, pagination.startIndex, filter, param);
            pagination.results = staffList;
            pagination.total = totalData;
            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
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

    async editAdmin(req: Request, res: Response) {
        try {
            this.validateData(req);
            const request: EditAdminRequest = req.body;
            const editedStaff: boolean = await this.adminService.editAdmin(request);
            res.status(200).send(new BaseResponse().ok(editedStaff, "Data Admin Berhasil Diubah"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async editDoctor(req: Request, res: Response) {
        try {
            this.validateData(req);
            const request: EditDoctorRequest = req.body;
            const editedStaff: boolean = await this.adminService.editDoctor(request);
            res.status(200).send(new BaseResponse().ok(editedStaff, "Data Dokter Berhasil Diubah"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async editPharmacist(req: Request, res: Response) {
        try {
            this.validateData(req);
            const request: EditPharmacistRequest = req.body;
            const editedStaff: boolean = await this.adminService.editPharmacist(request);
            res.status(200).send(new BaseResponse().ok(editedStaff, "Data Apoteker Berhasil Diubah"));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

}
