import {Role} from "@prisma/client";
import BaseEditUserRequest from "./BaseRequest/BaseEditUserRequest";

export default class EditPharmacistRequest extends BaseEditUserRequest{

    constructor(id: number, nik: string, email: string, password: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role, specialist: string, is_active: boolean, createdAt: Date, updatedAt: Date) {
        super(id, nik, email, password, firstName, lastName, dob, phoneNum, role, is_active, createdAt, updatedAt);
    }
}