import { Pharmacist, Role } from "@prisma/client";
import { Builder } from "builder-pattern";
import CreateUserHelper from "./helper/CreateUserHelper";
import UserService from "./UserService";
import PharmacistRepository from "../repository/PharmacistRepository";
import AddPharmacistRequest from "../model/request/AddPharmacistRequest";
import EditPharmacistRequest from "../model/request/EditPharmacistRequest";
import EditUserHelper from "./helper/EditUserHelper";
import PharmacistVO from "../model/VOs/PharmacistVO";

export default class PharmacistService {
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

	public async addPharmacist(request: AddPharmacistRequest): Promise<boolean> {
		try {
			await this.userService.emailIsExist(request.email);
			await this.userService.nikIsExist(request.nik);
			request.password = await this.userService.encryptPassword(request.password);
			const pharmacist: Pharmacist = this.createUserHelper.createBaseUser(request);
			return await this.pharmacistRepository.addPharmacist(Builder(pharmacist).role(Role.PHARMACIST).build());
		} catch (error) {
			throw error as object;
		}
	}

	public async editPharmacist(request: EditPharmacistRequest): Promise<boolean> {
		try {
			await this.userService.emailIsExist(request.email, request.oldEmail);
			await this.userService.nikIsExist(request.nik, request.oldNik);
			const pharmacist: Pharmacist = this.editUserHelper.editBaseUser(request);
			return await this.pharmacistRepository.editPharmacist(Builder(pharmacist).role(Role.PHARMACIST).build());
		} catch (error) {
			throw error as object;
		}
	}

	public async getPharmacistByEmail(email: string): Promise<Pharmacist | null> {
		try {
			return await this.pharmacistRepository.getPharmacistByEmail(email)
		} catch (error) {
			throw error as object;
		}
	}

	public async getTotalPharmacist(param?: string): Promise<number> {
		try {
			return await this.pharmacistRepository.getTotalPharmacist();
		} catch (error) {
			throw error as string;
		}
	}

	public async getAllPharmacists(limit: number, startIndex: number, param?: string): Promise<PharmacistVO[]> {
		try {
			return await this.pharmacistRepository.getAllPharmacists(limit, startIndex, param)
		} catch (error) {
			console.error('Error getting all pharmacist:', error);
			throw new Error('Failed to get pharmacist');
		}
	}

	public async getPharmacistById(id: number): Promise<PharmacistVO | null> {
		try {
			return await this.pharmacistRepository.getPharmacistById(id)
		} catch (error) {
			console.error('Error getting pharmacist by id:', error);
			throw new Error('Failed to get pharmacist');
		}
	}

	public async getPharmacistByNik(nik: string): Promise<PharmacistVO | null> {
		try {
			return await this.pharmacistRepository.getPharmacistByNik(nik)
		} catch (error) {
			console.error('Error getting pharmacist by nik:', error);
			throw new Error('Failed to get pharmacist');
		}
	}
}
