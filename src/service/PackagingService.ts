import { Builder } from "builder-pattern";
import { Packaging } from "@prisma/client";
import PackagingRepository from "../repository/PackagingRepository";
import AddPackagingRequest from "../model/request/AddPackagingRequest";

export default class PackagingService {
    private readonly packagingRepository: PackagingRepository;

    constructor() {
        this.packagingRepository = new PackagingRepository();
    }

    public async createPackaging(request: AddPackagingRequest): Promise<Packaging> {
        try {
            const packaging: Packaging = this.constructPackaging(request);
            return await this.packagingRepository.createPackaging(packaging);
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllPackagings(): Promise<Packaging[]> {
        try {
            return await this.packagingRepository.getAllPackagings();
        } catch (error) {
            throw error as string;
        }
    }

    public async getPackagingById(id: number): Promise<Packaging | null> {
        try {
            const packaging: Packaging | null = await this.packagingRepository.getPackagingById(id);
            return packaging;
        } catch (error) {
            throw error as string;
        }
    }

    private constructPackaging(request: AddPackagingRequest): Packaging {
        return Builder<Packaging>()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .label(request.label)
            .value(request.value)
            .build()
    }
}