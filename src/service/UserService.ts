import DoctorService from "./DoctorService";
import AdminRepository from "../repository/AdminRepository";
import DoctorRepository from "../repository/DoctorRepository";
import jwt from 'jsonwebtoken';
import PharmacistRepository from "../repository/PharmacistRepository";
import { Admin, Doctor, Pharmacist } from "@prisma/client";
import bcrypt from 'bcrypt';
import { CustomError } from "../validator/helper/ErrorHelper";

export default class UserService {
	private readonly adminRepository: AdminRepository;
	private readonly doctorRepository: DoctorRepository;
	private readonly pharmacistRepository: PharmacistRepository;

	constructor() {
		this.adminRepository = new AdminRepository();
		this.doctorRepository = new DoctorRepository();
		this.pharmacistRepository = new PharmacistRepository();
	}

	public generateToken(email: string, role: string): string {
		const secretToken = process.env["SECRET_TOKEN"];
		if (!secretToken) throw new Error("SECRET_TOKEN environment variable is not set");
		return jwt.sign({ email, role }, secretToken, { expiresIn: '1800s' });
	}

	public async getUserByEmail(email: string): Promise<Admin | Doctor | Pharmacist | null> {
		return await this.adminRepository.getAdminByEmail(email) ||
			await this.doctorRepository.getDoctorByEmail(email) ||
			await this.pharmacistRepository.getPharmacistByEmail(email);
	}

	public async nikIsExist(nikTarget: string, selfNik?: string): Promise<void> {
		const isExist = await this.adminRepository.nikIsExist(nikTarget, selfNik)
		if (isExist) {
			throw new CustomError().formatError("NIK is already exist", "nik");
		}
	}

	public async emailIsExist(emailTarget: string, selfEmail?: string): Promise<void> {
		const isExist =
			await this.adminRepository.emailIsExist(emailTarget, selfEmail) ||
			await this.doctorRepository.emailIsExist(emailTarget, selfEmail) ||
			await this.pharmacistRepository.emailIsExist(emailTarget, selfEmail);
		if (isExist) {
			throw new CustomError().formatError("Email is already exist", "email");
		}
	}

	public async encryptPassword(password: string): Promise<string> {
		const salt: string = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}

	public async bcryptPassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}

}
