export default class PatientRequestDTO{
    private _patientId: number;
    private _patientName: string;
    private _credentialNum: string;
    private _phoneNum: string;

    constructor(patientId: number, patientName: string, credentialNum: string, phoneNum: string) {
        this._patientId = patientId;
        this._patientName = patientName;
        this._credentialNum = credentialNum;
        this._phoneNum = phoneNum;
    }

    get patientId(): number{
        return this._patientId;
    }

    set patientId(value: number) {
        this._patientId = value;
    }

    get patientName(): string {
        return this._patientName;
    }

    set patientName(value: string) {
        this._patientName = value;
    }

    get credentialNum(): string {
        return this._credentialNum;
    }

    set credentialNum(value: string) {
        this._credentialNum = value;
    }

    get phoneNum(): string {
        return this._phoneNum;
    }

    set phoneNum(value: string) {
        this._phoneNum = value;
    }
}