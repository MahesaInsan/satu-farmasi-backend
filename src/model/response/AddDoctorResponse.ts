import {Role} from "@prisma/client";
import BaseAddUserResponse from "./BaseResponse/BaseAddUserResponse";

export default class AddDoctorResponse extends BaseAddUserResponse{
    private specialist: string | null;

    constructor(nik: string, email: string, firstName: string, lastName: string, dob: Date, phoneNum: string, role: Role, specialist: string) {
        super(nik, email, firstName, lastName, dob, phoneNum, role);
        this.specialist = specialist;
    }

    getSpecialist(): string | null {
        return this.specialist;
    }

    setSpecialist(value: string | null): void {
        this.specialist = value;
    }
}