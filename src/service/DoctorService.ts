import { Doctor, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import DoctorRepository from "../repository/DoctorRepository";

export default class DoctorService{
    private readonly doctorRepository: DoctorRepository;

    constructor() {
        this.doctorRepository = new DoctorRepository();
    }

    public async getAllDoctors(): Promise<Doctor []> {
        try {
            return await this.doctorRepository.getAllDoctors();
        } catch (error) {
            console.error('Error getting all doctor:', error);
            throw new Error('Failed to get doctor');
        }
    }
}