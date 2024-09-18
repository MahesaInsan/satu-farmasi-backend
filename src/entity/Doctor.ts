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
            role: { isString: true, equals: 'doctor' },
            specialist: { isString: true }
        };
    }

    public static updateSchema() {
        return {
            nik: { isString: true, isLength: { min: 16, max: 16 } },
            email: { isEmail: true },
            firstName: { isString: true },
            lastName: { isString: true },
            password: { isString: true, isLength: { min: 8 } },
            role: { isString: true, equals: 'doctor' },
            specialist: { isString: true }
        };
    }


    // TODO: Change with id
    public static deleteSchema() {
        return {
            nik: { isString: true, isLength: { min: 16, max: 16 } },
            email: { isEmail: true },
            firstName: { isString: true },
            lastName: { isString: true },
            password: { isString: true, isLength: { min: 8 } },
            role: { isString: true, equals: 'doctor' },
            specialist: { isString: true }
        };
    }
}
