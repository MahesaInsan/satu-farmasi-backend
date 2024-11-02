import BaseEntity from "./BaseEntity";
import {Role} from "@prisma/client"

export default abstract class User extends BaseEntity{
    public nik: string;
    public email: string;
    public password?: string;
    public firstName: string;
    public lastName: string;
    public dob: Date;
    public phoneNum: string;
    public role: Role;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, nik: string,
                email: string, password: string, firstName: string, lastName: string,
                dob: Date, phoneNum: string, role: Role) {
        super(id, is_active, created_at, updated_at);
        this.nik = nik;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.phoneNum = phoneNum;
        this.role = role;
    }
}
