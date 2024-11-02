import PatientRepository from "../repository/PatientRepository";
import {Patient} from "@prisma/client";
import {Builder} from "builder-pattern";
import AddPatientRequest from "../model/request/AddPatientRequest";
import IdVO from "../model/VOs/IdVO";
import PatientRequestDTO from "../model/request/PatientRequestDTO";

export default class PatientService{
    private patientRepository: PatientRepository;

    constructor() {
        this.patientRepository = new PatientRepository();
    }

    public async addNewPatient(newPatientRequest: PatientRequestDTO): Promise<IdVO>{
        try {
            return await this.patientRepository.findIfExist(newPatientRequest.credentialNum)
                .then(async (exist) => {
                    if (exist?.id) {
                        throw new Error("Patient already exist")
                    } else {
                        const newPatient: Patient = Builder<Patient>()
                            .name(newPatientRequest.patientName)
                            .credentialNumber(newPatientRequest.credentialNum)
                            .phoneNum(newPatientRequest.phoneNum)
                            .is_active(true)
                            .created_at(new Date())
                            .updated_at(new Date())
                            .build();
                        return await this.patientRepository.createPatient(newPatient)
                    }
                })
        } catch (error) {
            throw error as string
        }
    }

    public async fetchPatient() {
        try {
            return await this.mapPatientById(await this.patientRepository.findPatientDropdownOptions())
        } catch(error) {
            throw error as string
        }
    }

    public async findIfExistById(id: number) {
        try {
            return await this.patientRepository.findIfExistById(id)
        } catch(error) {
            throw error as string
        }
    }

    public async getTotalPatient(): Promise<number> {
        try {
            return await this.patientRepository.getTotalPatient()
        } catch (error) {
            throw error as string
        }
    }

    private async mapPatientById(patientList: Patient[]) {
        return patientList.reduce((patientByPatientId, patient) => {
            patientByPatientId.set(patient.id, patient);
            return patientByPatientId;
        }, new Map<number, Patient>)
    }
}