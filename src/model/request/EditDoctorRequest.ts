import { Role } from "@prisma/client";
import BaseEditUserRequest from "./BaseRequest/BaseEditUserRequest";

export default class EditDoctorRequest extends BaseEditUserRequest {
    public specialist: string;

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
        is_active: boolean,
        createdAt: Date,
        updatedAt: Date,
        specialist: string,
        oldEmail?: string,
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
        );
        this.specialist = specialist;
    }
}
