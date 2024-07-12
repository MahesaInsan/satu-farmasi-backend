import {Pharmacist, Role} from "@prisma/client";
import {Builder} from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import UserService from "./helper/UserService";
import PharmacistRepository from "../repository/PharmacistRepository";
import AddPharmacistRequest from "../model/request/AddPharmacistRequest";

export default class PharmacistService{
    private readonly pharmacistRepository: PharmacistRepository;
    private readonly userService: UserService;
    private readonly createUserHelper: CreateUserHelper<AddPharmacistRequest, Pharmacist>;

    constructor() {
        this.pharmacistRepository = new PharmacistRepository();
        this.userService = new UserService();
        this.createUserHelper = new CreateUserHelper<AddPharmacistRequest, Pharmacist>();
    }

    public async emailIsExist(email: string): Promise<Boolean> {
        return await this.pharmacistRepository.emailIsExist(email)
    }

    public async addPharmacist(request: AddPharmacistRequest): Promise<Pharmacist>{
        console.log(request.firstName)
        try {
            await this.userService.emailIsExist(request.email);
            request.password = await this.userService.encryptPassword(request.password);
            const pharmacist: Pharmacist = this.createUserHelper.createBaseUser(request);
            return await this.pharmacistRepository.addPharmacist(Builder(pharmacist).role(Role.PHARMACIST).build())
        } catch (error) {
            throw error as string;
        }
    }
}