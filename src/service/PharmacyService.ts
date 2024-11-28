import PharmacyRepository from "../repository/PharmacyRepository";
import AddAndEditPharmacyRequest from "../model/request/AddAndEditPharmacyRequest";
import {Builder} from "builder-pattern";
import {Pharmacy} from "@prisma/client";

export default class PharmacyService{
    private readonly pharmacyRepository: PharmacyRepository;

    constructor() {
        this.pharmacyRepository = new PharmacyRepository();
    }

    public async getPharmacyInformation() {
        try {
            const pharmacyInfo = await this.pharmacyRepository.getPharmacyInfo()
            if (!pharmacyInfo) {
                throw new Error("Pharmacy not found");
            } else return pharmacyInfo;
        } catch (error) {
            throw error as string
        }
    }

    public async addNewPharmacyInformation(request: AddAndEditPharmacyRequest) {
        try {
            this.validatePharmacyInformation(request)
            if (await this.pharmacyRepository.getPharmacyInfo() !== null) {
                throw new Error("Pharmacy info already exist")
            }

            await this.pharmacyRepository.addPharmacyInfo(this.constructPharmacyInformation(request))
        } catch (error) {
            throw error as string;
        }
    }

    public async updatePharmacyInformation(request: AddAndEditPharmacyRequest) {
        try {
            this.validatePharmacyInformation(request)
            if (await this.pharmacyRepository.getPharmacyInfo() === null) {
                throw new Error("Pharmacy info not found")
            }

            await this.pharmacyRepository.editPharmacyInfo(this.constructPharmacyInformation(request))
        } catch (error) {
            throw error as string;
        }
    }

    private validatePharmacyInformation(req: AddAndEditPharmacyRequest){
        try {
            const emailRegex =  RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

            if (!req.name) {
                throw new Error("Name must not be blank")
            }
            if (!req.pharmacyNum) {
                throw new Error("Surat Izin Apotek must not be blank");
            }
            if (!req.address) {
                throw new Error("Address must not be blank");
            }
            if (!req.phoneNum) {
                throw new Error("Phone number must not be blank");
            }
            if (!req.email) {
                throw new Error("Email must not be blank");
            }
            if (!emailRegex.test(req.email)) {
                throw new Error("Email must be formatted as a normal email");
            }
        } catch (error) {
            throw error as string
        }
    }

    private constructPharmacyInformation(req: AddAndEditPharmacyRequest) {
        return Builder<Pharmacy>()
            .nama(req.name)
            .pharmacyNum(req.pharmacyNum)
            .address(req.address)
            .phoneNum(req.phoneNum)
            .email(req.email)
            .updated_at(new Date())
            .build()
    }
}