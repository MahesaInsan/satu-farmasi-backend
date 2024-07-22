export default class LoginRequest{
    private _email: string;
    private _password: string;
    private _isRemember?: boolean;

    constructor(email: string, password: string, isRemember: boolean | undefined) {
        this._email = email;
        this._password = password;
        this._isRemember = isRemember;
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

    get isRemember(): boolean | undefined {
        return this.isRemember;
    }

    set isRemember(value: boolean | undefined) {
        this._isRemember = value;
    }
}