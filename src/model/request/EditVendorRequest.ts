export default class EditVendorRequest {
    private _id: number;
    private _name: string;
    private _phoneNum: string;
    private _address: string;
    private _city: string;
    private _is_active: boolean;

    constructor(
        id: number,
        name: string,
        phoneNum: string,
        address: string,
        city: string,
        is_active: boolean
    ) {
        this._id = id;
        this._name = name;
        this._phoneNum = phoneNum;
        this._address = address;
        this._city = city;
        this._is_active = is_active;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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

    get is_active(): boolean {
        return this._is_active;
    }

    set is_active(v: boolean) {
        this._is_active = v;
    }
}
