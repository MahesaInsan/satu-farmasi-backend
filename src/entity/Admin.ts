import User from "./User";
import {Role} from "@prisma/client";

export default class Admin extends User{

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, nik: string,
                email: string, password: string, firstName: string, lastName: string, dob: Date,
                phoneNum: string, role: Role) {
        super(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role);
    }

}