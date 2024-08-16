import { Vendor } from "@prisma/client";
import VendorRepository from "../repository/VendorRepository";
import AddVendorRequest from "../model/request/AddVendorRequest";
import EditVendorRequest from "../model/request/EditVendorRequest";
import VendorHelper from "./helper/EditVendorHelper";

export default class VendorService {
    private readonly vendorRepository: VendorRepository;
    private readonly vendorHelper: VendorHelper;

    constructor() {
        this.vendorRepository = new VendorRepository();
        this.vendorHelper = new VendorHelper();
    }

    public async getTotalVendor(): Promise<number> {
        try {
            return await this.vendorRepository.getTotalVendors();
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getTotalVendorByName(name: string): Promise<number> {
        try {
            return await this.vendorRepository.getTotalVendorsByName(name);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getAllVendor(limit: number, startIndex: number): Promise<Vendor[]> {
        try {
            return await this.vendorRepository.getAllVendors(limit, startIndex);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getVendorById(id: number): Promise<Vendor | null> {
        try {
            return await this.vendorRepository.getVendorById(id);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async getVendorByName(limit: number, startIndex: number, name: string): Promise<Vendor[]> {
        try {
            return await this.vendorRepository.getVendorByName(limit, startIndex, name);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async addVendor(request: AddVendorRequest): Promise<Vendor> {
        try {
            const vendor: Vendor = this.vendorHelper.createVendor(request);
            return await this.vendorRepository.addVendor(vendor);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async editVendor(request: EditVendorRequest): Promise<Vendor> {
        try {
            const vendor: Vendor = this.vendorHelper.editVendor(request);
            return await this.vendorRepository.editVendor(vendor);
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public async deleteVendor(request: EditVendorRequest): Promise<Vendor> {
        try {
            const vendor: Vendor = this.vendorHelper.editVendor(request);
            return await this.vendorRepository.editVendor(vendor);
        } catch (error) {
            throw new Error(error as string);
        }
    }
}