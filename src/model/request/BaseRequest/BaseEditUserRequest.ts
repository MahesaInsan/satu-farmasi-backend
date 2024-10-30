import {Role} from "@prisma/client";

export default abstract class BaseEditUserRequest {
    private _id: number;
    private _nik: string;
    private _email: string;
    private _password: string;
    private _firstName: string;
    private _lastName: string;
    private _dob: Date;
    private _phoneNum: string;
    private _role: Role;
    private _is_active: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _oldEmail?: string;

    constructor(id: number, nik: string, email: string, password: string, firstName: string, lastName: string,
                dob: Date, phoneNum: string, role: Role, is_active: boolean, createdAt: Date, updatedAt: Date, oldEmail?: string) {
        this._id = id;
        this._nik = nik;
        this._email = email;
        this._password = password;
        this._firstName = firstName;
        this._lastName = lastName;
        this._dob = dob;
        this._phoneNum = phoneNum;
        this._role = role;
        this._is_active = is_active;;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._oldEmail = oldEmail;
    }

    get id(): number {
        return this._id;
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

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
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

    get oldEmail(): string | undefined {
        return this._oldEmail;
    }

    set role(value: Role) {
        this.role = value;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    set is_active(value: boolean) {
        this._is_active = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set updatedAt(value: Date) { 
        this._updatedAt = value;
    }

    set oldEmail(value: string | undefined) {
        this._oldEmail = value;
    }
}
