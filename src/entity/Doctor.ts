import User from "./User";
import {Role} from "@prisma/client";

export default class Doctor extends User{
    public specialist: string | null;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, nik: string,
                email: string, password: string, firstName: string, lastName: string, dob: Date,
                phoneNum: string, role: Role, specialist: string) {
        super(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role);
        this.specialist = specialist;
    }

    public static createSchema() {
        return {
            nik: { isString: true, isLength: { min: 16, max: 16 } },
            email: { isEmail: true },
            firstName: { isString: true },
            lastName: { isString: true },
            password: { isString: true, isLength: { min: 8 } },
            phoneNum: { isString: true, isLength: { min: 10  } },
            dob: {  isString: true, isISO8601: true },
            specialist: { isString: true },
            role: { isString: true, equals: 'doctor' },
        };
    }

    public static updateSchema() {
        return {
            nik: { isString: true, isLength: { min: 16, max: 16 } },
            email: { isEmail: true },
            firstName: { isString: true },
            lastName: { isString: true },
            phoneNum: { isString: true, isLength: { min: 10 } },
            dob: {  isString: true, isISO8601: true },
			is_active: { isBoolean: true },
            specialist: { isString: true },
            role: { isString: true, equals: 'DOCTOR' },
        };
    }
}
