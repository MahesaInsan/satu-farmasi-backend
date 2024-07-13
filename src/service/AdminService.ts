import AddAdminRequest from "../model/request/AddAdminRequest";
import AdminRepository from "../repository/AdminRepository";
import {Admin, Doctor, Pharmacist, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
<<<<<<< HEAD
import User from "../entity/User";
import DoctorRepository from "../repository/DoctorRepository";
import PharmacistRepository from "../repository/PharmacistRepository";

export default class AdminService{
    private readonly adminRepository: AdminRepository;
    private readonly doctorRepository: DoctorRepository;
    private readonly phamacistRepository: PharmacistRepository;
=======
import UserService from "./helper/UserService";
export default class AdminService{
    private readonly adminRepository: AdminRepository;
    private readonly userService: UserService;
>>>>>>> 830b19d520d0ae9c6231ccdaa261b7f14f4c4643
    private readonly createUserHelper: CreateUserHelper<AddAdminRequest, Admin>;

    constructor() {
        this.adminRepository = new AdminRepository();
<<<<<<< HEAD
        this.doctorRepository = new DoctorRepository();
        this.phamacistRepository = new PharmacistRepository();
=======
        this.userService = new UserService();
>>>>>>> 830b19d520d0ae9c6231ccdaa261b7f14f4c4643
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

    public async getAllStaff(): Promise<User[]>{
        const admins: Admin[] = await this.adminRepository.getAllAdmins();
        const doctors: Doctor[] = await this.doctorRepository.getAllDoctors();
        const pharmacists: Pharmacist[] = await this.phamacistRepository.getAllPharmacists();

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

        const doctor: Doctor | null = await this.doctorRepository.getDoctorById(id);
        if (doctor) return doctor;

        const pharmacist: Pharmacist | null = await this.phamacistRepository.getPharmacistById(id);
        if (pharmacist) return pharmacist;
        
        return null;
    }
}