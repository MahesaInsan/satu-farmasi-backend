import BaseAddUserRequest from "./BaseRequest/BaseAddUserRequest";
import {Role} from "@prisma/client";

export default class AddPharmacistRequest extends BaseAddUserRequest{
    private _sipaNum: string;

    constructor(nik: string, email: string, password: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role, sipaNum: string) {
        super(nik, email, password, firstName, lastName, dob, phoneNum, role);
        this._sipaNum = sipaNum;
    }

    get sipaNum(): string {
        return this._sipaNum;
    }

    set sipaNum(value: string) {
        this._sipaNum = value;
    }
}
