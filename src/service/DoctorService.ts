import {  Role, User } from "@prisma/client";
import { Builder } from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import DoctorRepository from "../repository/DoctorRepository";
import AddDoctorRequest from "../model/request/AddDoctorRequest";
import EditDoctorRequest from "../model/request/EditDoctorRequest";
import EditUserHelper from "./helper/EditUserHelper";
import UserService from "./UserService";
import DoctorVO from "../model/VOs/DoctorVO";

export default class DoctorService {
	private readonly doctorRepository: DoctorRepository;
	private readonly userService: UserService;
	private readonly createUserHelper: CreateUserHelper<AddDoctorRequest, User>;
	private readonly editUserHelper: EditUserHelper<EditDoctorRequest, User>;

	constructor() {
		this.doctorRepository = new DoctorRepository();
		this.userService = new UserService();
		this.createUserHelper = new CreateUserHelper<AddDoctorRequest, User>();
		this.editUserHelper = new EditUserHelper<EditDoctorRequest, User>();
	}

	public async addDoctor(request: AddDoctorRequest): Promise<User> {
		try {
			await this.userService.emailIsExist(request.email);
			await this.userService.nikIsExist(request.nik);
            console.log("success validating ...")
			request.password = await this.userService.encryptPassword(request.password);
			const doctor: User = this.createUserHelper.createBaseUser(request);
			return await this.doctorRepository.addDoctor(Builder(doctor).role(Role.DOCTOR).specialist(request.specialist).build())
		} catch (error) {
			throw error as string;
		}
	}

	public async editDoctor(request: EditDoctorRequest): Promise<boolean> {
		try {
			await this.userService.emailIsExist(request.email, request.oldEmail);
			await this.userService.nikIsExist(request.nik, request.oldNik);
			const doctor: User = this.editUserHelper.editBaseUser(request);
			return await this.doctorRepository.editDoctor(Builder(doctor).role(Role.DOCTOR).specialist(request.specialist).build())
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalDoctor(param?: string): Promise<number> {
		try {
			return await this.doctorRepository.getTotalDoctor(param);
		} catch (error) {
			throw error as string;
		}
	}

	public async getAllDoctors(limit: number, startIndex: number, param?: string): Promise<DoctorVO[]> {
		try {
			return await this.doctorRepository.getAllDoctors(limit, startIndex, param)
		} catch (error) {
			throw error as string;
		}
	}

	public async getDoctorById(id: number): Promise<DoctorVO | null> {
		try {
			return await this.doctorRepository.getDoctorById(id)
		} catch (error) {
			console.error('Error getting doctor by id:', error);
			throw new Error('Failed to get doctor');
		}
	}

	public async getDoctorByNik(nik: string): Promise<DoctorVO | null> {
		try {
			return await this.doctorRepository.getDoctorByNik(nik)
		} catch (error) {
			console.error('Error getting doctor by nik:', error);
			throw new Error('Failed to get doctor');
		}
	}
}
