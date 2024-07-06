import BaseAddUserRequest from "./BaseRequest/BaseAddUserRequest";
import {Role} from "@prisma/client";

export default class AddAdminRequest extends BaseAddUserRequest{

    constructor(nik: string, email: string, password: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role) {
        super(nik, email, password, firstName, lastName, dob, phoneNum, role);
    }
}