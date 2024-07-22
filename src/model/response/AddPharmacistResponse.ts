import {Role} from "@prisma/client";
import BaseAddUserResponse from "./BaseResponse/BaseAddUserResponse";

export default class AddPharmacistResponse extends BaseAddUserResponse{

    constructor(nik: string, email: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role) {
        super(nik, email, firstName, lastName, dob, phoneNum, role);
    }
}