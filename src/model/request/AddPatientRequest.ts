export default class AddPatientRequest{
    private _name: string
    private _credentialNumber: string
    private _phoneNum: string

    constructor(name: string, credentialNumber: string, phoneNum: string) {
        this._name = name;
        this._credentialNumber = credentialNumber;
        this._phoneNum = phoneNum;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get credentialNumber(): string {
        return this._credentialNumber;
    }

    set credentialNumber(value: string) {
        this._credentialNumber = value;
    }

    get phoneNum(): string {
        return this._phoneNum;
    }

    set phoneNum(value: string) {
        this._phoneNum = value;
    }
}