import {Status} from "@prisma/client";

export default class PrescriptionSummaryResponse {
    private _prescriptionId: number;
    private _timestamps: Date;
    private _patientName: string;
    private _status: Status

    constructor(prescriptionId: number, timestamps: Date, patientName: string, status: Status) {
        this._prescriptionId = prescriptionId;
        this._timestamps = timestamps;
        this._patientName = patientName;
        this._status = status;
    }

    get prescriptionId(): number {
        return this._prescriptionId;
    }

    set prescriptionId(value: number) {
        this._prescriptionId = value;
    }

    get timestamps(): Date {
        return this._timestamps;
    }

    set timestamps(value: Date) {
        this._timestamps = value;
    }

    get patientName(): string {
        return this._patientName;
    }

    set patientName(value: string) {
        this._patientName = value;
    }

    get status(): Status {
        return this._status;
    }

    set status(value: Status) {
        this._status = value;
    }
}