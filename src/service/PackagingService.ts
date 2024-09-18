import { Builder } from "builder-pattern";
import { Packaging } from "@prisma/client";
import PackagingRepository from "../repository/PackagingRepository";
import AddPackagingRequest from "../model/request/AddPackagingRequest";
import EditPackagingRequest from "../model/request/EditPackagingRequest";

export default class PackagingService {
    private readonly packagingRepository: PackagingRepository;

    constructor() {
        this.packagingRepository = new PackagingRepository();
    }

    public async createPackaging(request: AddPackagingRequest): Promise<Packaging> {
        try {
            await this.isPackagingExist(request.label);
            const packaging: Packaging = this.constructPackaging(request);
            return await this.packagingRepository.createPackaging(packaging);
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalPackagings(): Promise<number> {
        try {
            return await this.packagingRepository.getTotalPackagings();
        } catch (error) {
            throw error as string;
        }
    }

    public async getTotalPackagingsByLabel(label: string): Promise<number> {
        try {
            return await this.packagingRepository.getTotalPackagingsByLabel(label);
        } catch (error) {
            throw error as string;
        }
    }

    public async getAllPackagings(limit: number, startIndex: number): Promise<Packaging[]> {
        try {
            return await this.packagingRepository.getAllPackagings(limit, startIndex);
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

    public async getPackagingByLabel(limit: number, startIndex: number, label: string): Promise<Packaging[]> {
        try {
            return await this.packagingRepository.getPackagingByLabel(limit, startIndex, label);
        } catch (error) {
            throw error as string;
        }
    }

    public async isPackagingExist(label: string): Promise<void> {
        const isExist = await this.packagingRepository.isPackagingExist(label);
        if (isExist) throw new Error("Packaging is already exist");
    }

    public async editPackaging(request: EditPackagingRequest): Promise<Packaging> {
        try {
            await this.isPackagingExist(request.label);
            const packaging: Packaging = this.constructEditPackaging(request);
            return await this.packagingRepository.editPackaging(packaging);
        } catch (error) {
            throw error as string;
        }
    }

    public async deletePackaging(request: EditPackagingRequest): Promise<Packaging> {
        try {
            const packaging: Packaging = this.constructEditPackaging(request);
            return await this.packagingRepository.editPackaging(packaging);
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

    private constructEditPackaging(request: EditPackagingRequest): Packaging {
        return Builder<Packaging>()
            .id(request.id)
            .label(request.label)
            .value(request.value)
            .is_active(request.isActive)
            .created_at(request.createdAt)
            .updated_at(new Date())
            .build()
    }
}
