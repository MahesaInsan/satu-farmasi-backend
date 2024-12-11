export default class AddTransactionRequest {
    private _patientId: number;
    private _prescriptionId: number;
    private _created_at?: Date;
    private _pharmacistId: number;

    constructor(patientId: number, prescriptionId: number, pharmacistId: number, created_at?: Date) {
        this._patientId = patientId;
        this._prescriptionId = prescriptionId;
        this._pharmacistId = pharmacistId;
        this._created_at = created_at;
    }

    get patientId(): number {
        return this._patientId;
    }

    get created_at(): Date | undefined {
        return this._created_at;
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

    set created_at(value: Date | undefined) {
        this._created_at = value;
    }

    get pharmacistId(): number {
        return this._pharmacistId;
    }

    set pharmacistId(value: number) {
        this._pharmacistId = value;
    }
}
