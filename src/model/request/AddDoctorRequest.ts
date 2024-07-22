import BaseAddUserRequest from "./BaseRequest/BaseAddUserRequest";
import {Role} from "@prisma/client";

export default class AddDoctorRequest extends BaseAddUserRequest{
    public specialist: string | null;

    constructor(nik: string, email: string, password: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role, specialist: string) {
        super(nik, email, password, firstName, lastName, dob, phoneNum, role);
        this.specialist = specialist;
    }
}