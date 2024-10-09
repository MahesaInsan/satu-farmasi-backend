export default class AddTransactionRequest {
    private _patientId: number;
    private _prescriptionId: number;

    constructor(patientId: number, prescriptionId: number) {
        this._patientId = patientId;
        this._prescriptionId = prescriptionId;
    }

    get patientId(): number {
        return this._patientId;
    }

    set patientId(value: number) {
        this._patientId = value;
    }

    get prescriptionId(): number {
        return this._prescriptionId;
    }

    set prescriptionId(value: number) {
        this._prescriptionId = value;
    }
}