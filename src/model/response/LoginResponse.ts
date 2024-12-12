export default class LoginResponse{
    private _id: number;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _token: string;
    private _role: string;

    constructor(id: number, firstName: string, lastName: string, token: string, role: string, email: string) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._token = token;
        this._role = role;
        this._email = email;
    }

    get id(): number {
        return this._id;
    }

    get firstName(): string {
        return this._firstName;
    }

    get email(): string {
        return this._email;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    set email(value: string) {
        this._email = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get token(): string{
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }

    set id(value: number) {
        this._id = value;
    }
}
