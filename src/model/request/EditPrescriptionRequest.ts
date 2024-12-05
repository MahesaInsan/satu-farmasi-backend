import AddPrescribedMedicineRequest from "./AddPrescribedMedicineRequest";

export default class EditPrescriptionRequest{
    private _prescriptionId: number;
    private _medicineList: AddPrescribedMedicineRequest[]

    constructor(prescriptionId: number, medicineList: AddPrescribedMedicineRequest[]) {
        this._prescriptionId = prescriptionId;
        this._medicineList = medicineList;
    }

    get prescriptionId(): number {
        return this._prescriptionId;
    }

    set prescriptionId(value: number) {
        this._prescriptionId = value;
    }

    get medicineList(): AddPrescribedMedicineRequest[] {
        return this._medicineList;
    }

    set medicineList(value: AddPrescribedMedicineRequest[]) {
        this._medicineList = value;
    }
}