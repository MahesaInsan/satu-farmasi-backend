import DoctorService from "../DoctorService";
import AdminRepository from "../../repository/AdminRepository";
import DoctorRepository from "../../repository/DoctorRepository";
import jwt from 'jsonwebtoken';
import PharmacistRepository from "../../repository/PharmacistRepository";
import { Admin, Doctor, Pharmacist } from "@prisma/client";
const { sign, verify } = jwt;

export default class UserService {
    private readonly adminRepository: AdminRepository;
    private readonly doctorRepository: DoctorRepository;
    private readonly pharmacistRepository: PharmacistRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.doctorRepository = new DoctorRepository();
        this.pharmacistRepository = new PharmacistRepository();
    }

    public generateToken(email: string): string {
        const secretToken = process.env["SECREET_TOKEN"];
         if (!secretToken) throw new Error("SECRET_TOKEN environment variable is not set");
        return jwt.sign({email}, secretToken, { expiresIn: '1800s' });
    }

    public async getUserByEmail(email: string): Promise<Admin | Doctor | Pharmacist | null> {
        return await this.adminRepository.getAdminByEmail(email) || 
            await this.doctorRepository.getDoctorByEmail(email) || 
            this.pharmacistRepository.getPharmacistByEmail(email);
    }

    public async emailIsExist(email: string): Promise<void>{
        const isExist = 
            await this.adminRepository.emailIsExist(email) ||  
            await this.doctorRepository.emailIsExist(email) || 
            this.pharmacistRepository.emailIsExist(email);
        if (isExist) throw new Error("Email is already exist")
    }
}