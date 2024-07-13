import { Doctor, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import DoctorRepository from "../repository/DoctorRepository";
import AddDoctorRequest from "../model/request/AddDoctorRequest";
import UserService from "./helper/UserService";

export default class DoctorService{
    private readonly doctorRepository: DoctorRepository;
    private readonly userService: UserService;
    private readonly createUserHelper: CreateUserHelper<AddDoctorRequest, Doctor>;

    constructor() {
        this.doctorRepository = new DoctorRepository();
        this.userService = new UserService();
        this.createUserHelper = new CreateUserHelper<AddDoctorRequest, Doctor>();
    }

    public async emailIsExist(email: string): Promise<Boolean> {
        return await this.doctorRepository.emailIsExist(email)
    }

    public async addDoctor(request: AddDoctorRequest): Promise<Doctor>{
        try {
            await this.userService.emailIsExist(request.email);
            request.password = await this.userService.encryptPassword(request.password);
            const doctor: Doctor = this.createUserHelper.createBaseUser(request);
            return await this.doctorRepository.addDoctor(Builder(doctor).role(Role.DOCTOR).specialist(request.specialist).build())
        } catch (error) {
            throw error as string;
        }
    }

}