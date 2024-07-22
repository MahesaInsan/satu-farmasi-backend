import {Prisma} from "@prisma/client"
import AddPrescribedMedicineRequest from "./AddPrescribedMedicineRequest";

export default class AddPrescriptionRequest{
    private _patientId: number
    private _medicineList: AddPrescribedMedicineRequest[]

    constructor(patientId: number, medicineList: AddPrescribedMedicineRequest[]) {
        this._patientId = patientId;
        this._medicineList = medicineList;
    }

    get patientId(): number {
        return this._patientId;
    }

    set patientId(value: number) {
        this._patientId = value;
    }

    get medicineList(): AddPrescribedMedicineRequest[] {
        return this._medicineList;
    }

    set medicineList(value: AddPrescribedMedicineRequest[]) {
        this._medicineList = value;
    }
}