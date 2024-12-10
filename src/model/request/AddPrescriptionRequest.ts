import AddPrescribedMedicineRequest from "./AddPrescribedMedicineRequest";
import PatientRequestDTO from "./PatientRequestDTO";

export default class AddPrescriptionRequest{
    private _patient: PatientRequestDTO;
    private _medicineList: AddPrescribedMedicineRequest[]
    private _created_at?: Date;

    constructor(patient: PatientRequestDTO, medicineList: AddPrescribedMedicineRequest[], created_at: Date) {
        this._patient = patient;
        this._medicineList = medicineList;
        this._created_at = created_at;
    }

    get patient(): PatientRequestDTO {
        return this._patient;
    }

    get created_at(): Date | undefined{
        return this._created_at;
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

    set created_at(value: Date) {
        this.created_at = value;
    }
}
