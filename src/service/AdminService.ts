import AddAdminRequest from "../model/request/AddAdminRequest";
import AdminRepository from "../repository/AdminRepository";
import {Admin, Doctor, Pharmacist, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import User from "../entity/User";
import DoctorRepository from "../repository/DoctorRepository";
import PharmacistRepository from "../repository/PharmacistRepository";

export default class AdminService{
    private readonly adminRepository: AdminRepository;
    private readonly doctorRepository: DoctorRepository;
    private readonly phamacistRepository: PharmacistRepository;
    private readonly createUserHelper: CreateUserHelper<AddAdminRequest, Admin>;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.doctorRepository = new DoctorRepository();
        this.phamacistRepository = new PharmacistRepository();
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