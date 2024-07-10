import DoctorService from "../DoctorService";
import AdminRepository from "../../repository/AdminRepository";
import DoctorRepository from "../../repository/DoctorRepository";

export default class UserService {
    private readonly adminRepository: AdminRepository;
    private readonly doctorRepository: DoctorRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
        this.doctorRepository = new DoctorRepository();
    }

    public async emailIsExist(email: string): Promise<void>{
        const isExist = await this.adminRepository.emailIsExist(email) ||  await this.doctorRepository.emailIsExist(email);
        if (isExist) throw new Error("Email is already exist")
    }
}