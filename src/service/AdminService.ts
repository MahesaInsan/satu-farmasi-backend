import AddAdminRequest from "../model/request/AddAdminRequest";
import AdminRepository from "../repository/AdminRepository";
import {Admin, Doctor, Pharmacist, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import User from "../entity/User";
import DoctorService from "./DoctorService";
import PharmacistService from "./PharmacistService";
import BaseEditUserRequest from "../model/request/BaseRequest/BaseEditUserRequest";
import EditUserHelper from "./helper/EditUserHelper";
import EditAdminRequest from "../model/request/EditAdminRequest";
import EditDoctorRequest from "../model/request/EditDoctorRequest";
import EditPharmacistRequest from "../model/request/EditPharmacistRequest";
import UserService from "./UserService";

export default class AdminService{
    private readonly adminRepository: AdminRepository;
    private readonly doctorService: DoctorService;
    private readonly userService: UserService;
    private readonly pharmacistService: PharmacistService;
    private readonly createUserHelper: CreateUserHelper<AddAdminRequest, Admin>;
    private readonly editUserHelper: EditUserHelper<BaseEditUserRequest, Admin>;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.userService = new UserService();
        this.doctorService = new DoctorService();
        this.pharmacistService = new PharmacistService();
        this.createUserHelper = new CreateUserHelper<AddAdminRequest, Admin>();
        this.editUserHelper = new EditUserHelper<BaseEditUserRequest, Admin>();
    }

    public async addAdmin(request: AddAdminRequest): Promise<Admin>{
        try {
            await this.userService.emailIsExist(request.email);
            await this.userService.nikIsExist(request.nik);
            request.password = await this.userService.encryptPassword(request.password);
            const admin: Admin = this.createUserHelper.createBaseUser(request);
            return await this.adminRepository.addAdmin(Builder(admin).role(Role.ADMIN).build())
        } catch (error) {
            throw error as string;
        }
    }

    public async editAdmin(request: EditAdminRequest): Promise<Admin>{
        console.log("VO admin : ", request)
        const admin: Admin = this.editUserHelper.editBaseUser(request);
        return await this.adminRepository.editAdmin(Builder(admin).role(Role.ADMIN).build());
    }

    public async getAllAdmin(): Promise<Admin[]>{
        return await this.adminRepository.getAllAdmins()
    }

    public async getAllStaff(): Promise<User[]>{
        const admins: Admin[] = await this.adminRepository.getAllAdmins();
        const doctors: Doctor[] = await this.doctorService.getAllDoctors();
        const pharmacists: Pharmacist[] = await this.pharmacistService.getAllPharmacists();

        let users: User[] = [];
        admins.forEach(admin => {
            let user: User = admin;
            users.push(user);
        });

        doctors.forEach(doctor => {
            let user: User = doctor;
            users.push(user);
        });

        pharmacists.forEach(pharmacist => {
            let user: User = pharmacist;
            users.push(user);
        });

        return users;
    }

    public async getStaffById(id: number): Promise<User | null>{
        const admin: Admin | null = await this.adminRepository.getAdminById(id);
        if (admin) return admin;

        const doctor: Doctor | null = await this.doctorService.getDoctorById(id);
        if (doctor) return doctor;

        const pharmacist: Pharmacist | null = await this.pharmacistService.getPharmacistById(id);
        if (pharmacist) return pharmacist;

        return null;
    }

    public async getStaffByNik(nik: string): Promise<User | null>{
        const admin: Admin | null = await this.adminRepository.getAdminByNik(nik);
        if (admin) return admin;

        const doctor: Doctor | null = await this.doctorService.getDoctorByNik(nik);
        if (doctor) return doctor;

        const pharmacist: Pharmacist | null = await this.pharmacistService.getPharmacistByNik(nik);
        if (pharmacist) return pharmacist;

        return null;
    }

    public async editStaff(user: EditDoctorRequest | EditAdminRequest | EditPharmacistRequest): Promise<User | null>{
        if (user.role === Role.ADMIN) return await this.editAdmin(user);
        if (user.role === Role.DOCTOR) return await this.doctorService.editDoctor(user);
        if (user.role === Role.PHARMACIST) return await this.pharmacistService.editPharmacist(user);
        return null;
    }
}
