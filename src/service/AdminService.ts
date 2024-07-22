import AddAdminRequest from "../model/request/AddAdminRequest";
import AdminRepository from "../repository/AdminRepository";
import {Admin, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import UserService from "./UserService";
export default class AdminService{
    private readonly adminRepository: AdminRepository;
    private readonly userService: UserService;
    private readonly createUserHelper: CreateUserHelper<AddAdminRequest, Admin>;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.userService = new UserService();
        this.createUserHelper = new CreateUserHelper<AddAdminRequest, Admin>();
    }

    public async emailIsExist(email: string): Promise<Boolean> {
        return await this.adminRepository.emailIsExist(email)
    }

    public async addAdmin(request: AddAdminRequest): Promise<Admin>{
        try {
            await this.userService.emailIsExist(request.email);
            request.password = await this.userService.encryptPassword(request.password);
            const admin: Admin = this.createUserHelper.createBaseUser(request);
            return await this.adminRepository.addAdmin(Builder(admin).role(Role.ADMIN).build())
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllAdmin(): Promise<Admin[]>{
        return await this.adminRepository.getAllAdmins()
    }
}