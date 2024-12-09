export default class AddTransactionRequest {
    private _patientId: number;
    private _prescriptionId: number;
    private _pharmacistId: number;

    constructor(patientId: number, prescriptionId: number, pharmacistId: number) {
        this._patientId = patientId;
        this._prescriptionId = prescriptionId;
        this._pharmacistId = pharmacistId;
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

    get pharmacistId(): number {
        return this._pharmacistId;
    }

    set pharmacistId(value: number) {
        this._pharmacistId = value;
    }
}