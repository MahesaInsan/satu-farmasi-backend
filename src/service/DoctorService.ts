import { Doctor, Role } from "@prisma/client";
import { Builder } from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import DoctorRepository from "../repository/DoctorRepository";
import AddDoctorRequest from "../model/request/AddDoctorRequest";
import EditDoctorRequest from "../model/request/EditDoctorRequest";
import EditUserHelper from "./helper/EditUserHelper";
import UserService from "./UserService";
import DoctorVO from "../model/VOs/DoctorVO";
import { CustomError } from "../validator/helper/ErrorHelper";

export default class DoctorService {
	private readonly doctorRepository: DoctorRepository;
	private readonly userService: UserService;
	private readonly createUserHelper: CreateUserHelper<AddDoctorRequest, Doctor>;
	private readonly editUserHelper: EditUserHelper<EditDoctorRequest, Doctor>;

	constructor() {
		this.doctorRepository = new DoctorRepository();
		this.userService = new UserService();
		this.createUserHelper = new CreateUserHelper<AddDoctorRequest, Doctor>();
		this.editUserHelper = new EditUserHelper<EditDoctorRequest, Doctor>();
	}

	public async emailIsExist(email: string): Promise<Boolean> {
		return await this.doctorRepository.emailIsExist(email)
	}

	public async addDoctor(request: AddDoctorRequest): Promise<Doctor> {
		try {
			await this.userService.emailIsExist(request.email);
			await this.userService.nikIsExist(request.nik);
			request.password = await this.userService.encryptPassword(request.password);
			const doctor: Doctor = this.createUserHelper.createBaseUser(request);
			return await this.doctorRepository.addDoctor(Builder(doctor).role(Role.DOCTOR).specialist(request.specialist).build())
		} catch (error) {
			throw error as string;
		}
	}

	public async editDoctor(request: EditDoctorRequest): Promise<boolean> {
		try {
			await this.userService.emailIsExist(request.email);
			await this.userService.nikIsExist(request.nik);
			const doctor: Doctor = this.editUserHelper.editBaseUser(request);
			return await this.doctorRepository.editDoctor(Builder(doctor).role(Role.DOCTOR).specialist(request.specialist).build())
		} catch (error) {
			throw error as string;
		}
	}

	public async getDoctorByEmail(email: string): Promise<Doctor | null> {
		try {
			return await this.doctorRepository.getDoctorByEmail(email)
		} catch (error) {
			console.error('Error getting doctor by email:', error);
			throw new Error('Failed to get doctor');
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
