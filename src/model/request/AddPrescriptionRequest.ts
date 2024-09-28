import AddPrescribedMedicineRequest from "./AddPrescribedMedicineRequest";
import PatientRequestDTO from "./PatientRequestDTO";

export default class AddPrescriptionRequest{
    private _patient: PatientRequestDTO;
    private _medicineList: AddPrescribedMedicineRequest[]

    constructor(patient: PatientRequestDTO, medicineList: AddPrescribedMedicineRequest[]) {
        this._patient = patient;
        this._medicineList = medicineList;
    }

    get patient(): PatientRequestDTO {
        return this._patient;
    }

    set patient(value: PatientRequestDTO) {
        this._patient = value;
    }

    get medicineList(): AddPrescribedMedicineRequest[] {
        return this._medicineList;
    }

    set medicineList(value: AddPrescribedMedicineRequest[]) {
        this._medicineList = value;
    }
}