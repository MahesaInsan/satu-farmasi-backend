import AddAdminRequest from "../model/request/AddAdminRequest";
import AdminRepository from "../repository/AdminRepository";
import {Admin, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";

export default class AdminService{
    private readonly adminRepository: AdminRepository;
    private readonly createUserHelper: CreateUserHelper<AddAdminRequest, Admin>;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.createUserHelper = new CreateUserHelper<AddAdminRequest, Admin>();
    }

    public async addAdmin(request: AddAdminRequest): Promise<Admin>{
        console.log(request.firstName)
        const admin: Admin = this.createUserHelper.createBaseUser(request);
        return await this.adminRepository.addAdmin(Builder(admin).role(Role.ADMIN).build())
    }

    public async getAllAdmin(): Promise<Admin[]>{
        return await this.adminRepository.getAllAdmins()
    }
}