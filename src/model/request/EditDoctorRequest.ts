import {Role} from "@prisma/client";
import BaseEditUserRequest from "./BaseRequest/BaseEditUserRequest";

export default class EditDoctorRequest extends BaseEditUserRequest{
    // public specialist: string | null;

    constructor(id: number, nik: string, email: string, password: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role, isActive: boolean, createdAt: Date, updatedAt: Date) {
        super(id, nik, email, password, firstName, lastName, dob, phoneNum, role, isActive, createdAt, updatedAt);
        // this.specialist = specialist;
    }
}