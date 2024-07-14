import AddPrescriptionRequest from "./AddPrescriptionRequest";

export default class AddDiagnoseRequest{
    private _doctorId: number
    private _title: string
    private _description: string
    private _prescription: AddPrescriptionRequest

    constructor(doctorId: number, title: string, description: string, prescription: AddPrescriptionRequest) {
        this._doctorId = doctorId;
        this._title = title;
        this._description = description;
        this._prescription = prescription;
    }

    get doctorId(): number {
        return this._doctorId;
    }

    set doctorId(value: number) {
        this._doctorId = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get prescription(): AddPrescriptionRequest {
        return this._prescription;
    }

    set prescription(value: AddPrescriptionRequest) {
        this._prescription = value;
    }
}