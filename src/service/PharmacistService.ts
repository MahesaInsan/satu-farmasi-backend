import {Pharmacist, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import UserService from "./UserService";
import PharmacistRepository from "../repository/PharmacistRepository";
import AddPharmacistRequest from "../model/request/AddPharmacistRequest";
import EditPharmacistRequest from "../model/request/EditPharmacistRequest";
import EditUserHelper from "./helper/EditUserHelper";

export default class PharmacistService{
    private readonly pharmacistRepository: PharmacistRepository;
    private readonly userService: UserService;
    private readonly createUserHelper: CreateUserHelper<AddPharmacistRequest, Pharmacist>;
    private readonly editUserHelper: EditUserHelper<EditPharmacistRequest, Pharmacist>;

    constructor() {
        this.pharmacistRepository = new PharmacistRepository();
        this.userService = new UserService();
        this.createUserHelper = new CreateUserHelper<AddPharmacistRequest, Pharmacist>();
        this.editUserHelper = new EditUserHelper<EditPharmacistRequest, Pharmacist>();
    }

    public async emailIsExist(email: string): Promise<Boolean> {
        return await this.pharmacistRepository.emailIsExist(email)
    }

    public async addPharmacist(request: AddPharmacistRequest): Promise<boolean>{
        try {
            await this.userService.emailIsExist(request.email);
            request.password = await this.userService.encryptPassword(request.password);
            const pharmacist: Pharmacist = this.createUserHelper.createBaseUser(request);
            return await this.pharmacistRepository.addPharmacist(Builder(pharmacist).role(Role.PHARMACIST).build());
        } catch (error) {
            throw error as object;
        }
    }

    public async editPharmacist(request: EditPharmacistRequest): Promise<Pharmacist | null> {
        try {
            const pharmacist: Pharmacist = this.editUserHelper.editBaseUser(request);
            return await this.pharmacistRepository.editPharmacist(Builder(pharmacist).role(Role.PHARMACIST).build());
        } catch (error) {
            console.error('Error updating pharmacist:', error);
            throw new Error('Failed to update pharmacist');
        }
    }

    public async getPharmacistByEmail(email: string): Promise<Pharmacist | null> {
        try {
            return await this.pharmacistRepository.getPharmacistByEmail(email)
        } catch (error) {
            console.error('Error getting pharmacist by email:', error);
            throw new Error('Failed to get pharmacist');
        }
    }

    public async getAllPharmacists(): Promise<Pharmacist[]> {
        try {
            return await this.pharmacistRepository.getAllPharmacists()
        } catch (error) {
            console.error('Error getting all pharmacist:', error);
            throw new Error('Failed to get pharmacist');
        }
    }

    public async getPharmacistById(id: number): Promise<Pharmacist | null> {
        try {
            return await this.pharmacistRepository.getPharmacistById(id)
        } catch (error) {
            console.error('Error getting pharmacist by id:', error);
            throw new Error('Failed to get pharmacist');
        }
    }

    public async getPharmacistByNik(nik: string): Promise<Pharmacist | null> {
        try {
            return await this.pharmacistRepository.getPharmacistByNik(nik)
        } catch (error) {
            console.error('Error getting pharmacist by nik:', error);
            throw new Error('Failed to get pharmacist');
        }
    }
}
