import DoctorService from "../DoctorService";
import AdminRepository from "../../repository/AdminRepository";
import DoctorRepository from "../../repository/DoctorRepository";
import PharmacistRepository from "../../repository/PharmacistRepository";
import { Admin, Doctor, Pharmacist } from "@prisma/client";
import User from "../../entity/User";
import CreateUserHelper from "./CreateUserHelper";
import BaseAddUserRequest from "../../model/request/BaseRequest/BaseAddUserRequest";

export default class UserService {
    private readonly adminRepository: AdminRepository;
    private readonly doctorRepository: DoctorRepository;
    private readonly pharmacistRepository: PharmacistRepository;
    private readonly createUserHelper: CreateUserHelper<BaseAddUserRequest, User>;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.doctorRepository = new DoctorRepository();
        this.pharmacistRepository = new PharmacistRepository();
        this.createUserHelper = new CreateUserHelper<BaseAddUserRequest, User>();
    }
}