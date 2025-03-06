import AddAdminRequest from "../model/request/AddAdminRequest";
import AdminRepository from "../repository/AdminRepository";
import {  Role } from "@prisma/client";
import { Builder } from "builder-pattern";
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
import AdminVO from "../model/VOs/AdminVO";
import DoctorVO from "../model/VOs/DoctorVO";
import PharmacistVO from "../model/VOs/PharmacistVO";
import Admin from "../entity/Admin";

export default class AdminService {
	private readonly adminRepository: AdminRepository;
	private readonly doctorService: DoctorService;
	private readonly userService: UserService;
	private readonly pharmacistService: PharmacistService;
	private readonly createUserHelper: CreateUserHelper<AddAdminRequest, User>;
	private readonly editUserHelper: EditUserHelper<BaseEditUserRequest, User>;

	constructor() {
		this.adminRepository = new AdminRepository();
		this.userService = new UserService();
		this.doctorService = new DoctorService();
		this.pharmacistService = new PharmacistService();
		this.createUserHelper = new CreateUserHelper<AddAdminRequest, User>();
		this.editUserHelper = new EditUserHelper<BaseEditUserRequest, User>();
	}

	public async addAdmin(request: AddAdminRequest): Promise<User> {
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

	public async editAdmin(request: EditAdminRequest): Promise<boolean> {
		try {
			await this.userService.emailIsExist(request.email, request.oldEmail);
			await this.userService.nikIsExist(request.nik, request.oldNik);
			const admin: User = this.editUserHelper.editBaseUser(request);
			return await this.adminRepository.editAdmin(Builder(admin).role(Role.ADMIN).build());
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalAdmin(param?: string): Promise<number> {
		try {
			return await this.adminRepository.getTotalAdmin(param);
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalStaff(filter: string, param?: string,): Promise<number> {
		try {
			if (filter.toLowerCase() === "admin") return await this.getTotalAdmin(param);
			else if (filter.toLowerCase() === "doctor") return await this.doctorService.getTotalDoctor(param);
			else if (filter.toLowerCase() === "pharmacist") return await this.pharmacistService.getTotalPharmacist(param);
			else return 0;
		} catch (error) {
			throw error as string;
		}
	}

	public async getAllStaff(limit: number, startIndex: number, filter: string, param?: string): Promise<User[]> {
		try {
			if (filter.toLowerCase() === "admin") return await this.adminRepository.getAllAdmins(limit, startIndex, param);
			else if (filter.toLowerCase() === "doctor") return await this.doctorService.getAllDoctors(limit, startIndex, param);
			else if (filter.toLowerCase() === "pharmacist") return await this.pharmacistService.getAllPharmacists(limit, startIndex, param);
			return [];
		} catch (error) {
			throw error as string;
		}
	}

	public async getStaffById(id: number): Promise<User | null> {
		try {
			const admin: AdminVO | null = await this.adminRepository.getAdminById(id);
			if (admin) return admin;

			const doctor: DoctorVO | null = await this.doctorService.getDoctorById(id);
			if (doctor) return doctor;

			const pharmacist: PharmacistVO | null = await this.pharmacistService.getPharmacistById(id);
			if (pharmacist) return pharmacist;

			return null;
		} catch (error) {
			throw error as string;
		}
	}

	public async getStaffByNik(nik: string): Promise<User | null> {
		try {
			const admin: AdminVO | null = await this.adminRepository.getAdminByNik(nik);
			if (admin) return admin;

			const doctor: DoctorVO | null = await this.doctorService.getDoctorByNik(nik);
			if (doctor) return doctor;

			const pharmacist: PharmacistVO | null = await this.pharmacistService.getPharmacistByNik(nik);
			if (pharmacist) return pharmacist;

			return null;
		} catch (error) {
			throw error as string;
		}
	}

	public async editDoctor(req: EditDoctorRequest): Promise<boolean> {
		try {
			return await this.doctorService.editDoctor(req);
		} catch (error) {
			throw error as string;
		}
	}

	public async editPharmacist(req: EditPharmacistRequest): Promise<boolean> {
		try {
			return await this.pharmacistService.editPharmacist(req);
		} catch (error) {
			throw error as string;
		}
	}
}
