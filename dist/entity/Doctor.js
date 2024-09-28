"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class Doctor extends User_1.default {
    constructor(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role, specialist) {
        super(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role);
        this.specialist = specialist;
    }
    static createSchema() {
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
    static updateSchema() {
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
    static deleteSchema() {
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
exports.default = Doctor;
