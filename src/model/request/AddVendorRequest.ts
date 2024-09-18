export default class AddVendorRequest {
    private _name: string;
    private _phoneNum: string;
    private _address: string;
    private _city: string;

    constructor(name: string, phoneNum: string, address: string, city: string) {
        this._name = name;
        this._phoneNum = phoneNum;
        this._address = address;
        this._city = city
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get phoneNum(): string {
        return this._phoneNum;
    }

    set phoneNum(value: string) {
        this._phoneNum = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get city(): string {
        return this._city;
    }

    set city(value: string) {
        this._city = value;
    }
}