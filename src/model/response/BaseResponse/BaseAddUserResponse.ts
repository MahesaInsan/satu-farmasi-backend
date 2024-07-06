import {Role} from "@prisma/client";

export default abstract class BaseAddUserResponse {
    private _nik: string;
    private _email: string;
    private _firstName: string;
    private _lastName: string;
    private _dob: Date;
    private _phoneNum: string;
    private _role: Role;

    constructor(nik: string, email: string, firstName: string, lastName: string,
                dob: Date, phoneNum: string, role: Role) {
        this._nik = nik;
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
        this._dob = dob;
        this._phoneNum = phoneNum;
        this._role = role;
    }

    get nik(): string {
        return this._nik;
    }

    set nik(value: string) {
        this._nik = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get dob(): Date {
        return this._dob;
    }

    set dob(value: Date) {
        this._dob = value;
    }

    get phoneNum(): string {
        return this._phoneNum;
    }

    set phoneNum(value: string) {
        this._phoneNum = value;
    }

    get role(): Role {
        return this._role;
    }

    set role(value: Role) {
        this.role = value;
    }
}