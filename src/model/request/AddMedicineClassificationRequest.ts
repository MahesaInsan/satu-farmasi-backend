export default class AddMedicineClassificationRequest {
    private _medicineId: number;
    private _classificationId: number;

    constructor(medicineId: number, classificationId: number) {
        this._medicineId = medicineId;
        this._classificationId = classificationId;
    }

    get medicineId(): number {
        return this._medicineId;
    }

    set medicineId(value: number) {
        this._medicineId = value;
    }

    get classificationId(): number {
        return this._classificationId;
    }

    set classificationId(value: number) {
        this._classificationId = value;
    }
}