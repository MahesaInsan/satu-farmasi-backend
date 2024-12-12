import { Role } from "@prisma/client";
import BaseEditUserRequest from "./BaseRequest/BaseEditUserRequest";

export default class EditPharmacistRequest extends BaseEditUserRequest {
    private _sipaNum: string;

    constructor(
        id: number,
        nik: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        dob: Date,
        phoneNum: string,
        role: Role,
        specialist: string,
        is_active: boolean,
        createdAt: Date,
        updatedAt: Date,
        oldEmail: string,
        sipaNum: string,
        oldNik?: string,
    ) {
        super(
            id,
            nik,
            email,
            password,
            firstName,
            lastName,
            dob,
            phoneNum,
            role,
            is_active,
            createdAt,
            updatedAt,
            oldEmail,
            oldNik,
        );
        this._sipaNum = sipaNum;
    }

    get sipaNum(): string {
        return this._sipaNum;
    }

    set sipaNum(value: string) {
        this._sipaNum = value;
    }
}

